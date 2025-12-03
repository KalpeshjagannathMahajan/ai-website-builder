import { Divider } from '@mui/material';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Box, Drawer, Icon, Grid, Switch, Button } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';

interface GroupingDrawerProps {
	open: boolean;
	set_open: (val: boolean) => void;
	data: any;
	set_data?: any;
	grouping_data?: any;
	update_configuration?: any;
}

interface PayloadProps {
	label: string;
	value: string;
	is_active: boolean;
	is_default: boolean;
}

const initial_state = {
	label: '',
	value: '',
	is_active: false,
	is_default: false,
};

const GroupingDrawer = ({ open, set_open, data, set_data, grouping_data, update_configuration }: GroupingDrawerProps) => {
	const [payload, set_payload] = useState<PayloadProps>(initial_state);

	const on_close = () => {
		set_open(false);
		set_data({});
	};

	const handle_change = (key: string, value: boolean) => {
		set_payload((prev: any) => ({ ...prev, [key]: value }));
	};

	const handle_save = () => {
		const temp_updated_grouping_data = {
			...grouping_data,
			options: grouping_data.options.map((option: any) => (option.value === payload.value ? { ...option, ...payload } : option)),
		};

		const any_default: boolean = temp_updated_grouping_data?.options?.some((option: any) => option.is_default);

		const updated_grouping_data = {
			...grouping_data,
			options: _.map(grouping_data?.options, (option: any) => {
				if (option.value === payload.value) {
					return {
						...option,
						...payload,
					};
				} else {
					if (payload?.is_default) {
						return { ...option, is_default: false };
					}
					if (!any_default && option?.value === 'none' && option?.is_active === true) {
						return { ...option, is_default: true };
					}
					return option;
				}
			}),
		};
		const all_option_disabled = _.some(updated_grouping_data?.options, 'is_active');
		if (!all_option_disabled) {
			updated_grouping_data.enabled = false;
		}
		update_configuration('cart_grouping_config', updated_grouping_data);
		on_close();
	};

	const content = (
		<Box p={2} sx={{ height: '100vh', background: '#fff' }}>
			{/* Header */}
			<Grid container>
				<Grid item>
					<CustomText type='H3'>Group by {data?.label}</CustomText>
				</Grid>
				<Grid item ml='auto'>
					<Icon sx={{ cursor: 'pointer' }} iconName='IconX' onClick={on_close} />
				</Grid>
			</Grid>
			<Divider sx={{ my: 2 }} />
			{/* Content */}
			<Box p={1} my={2} sx={{ background: '#F7F8FA', borderRadius: '12px' }}>
				<Grid container alignItems='center'>
					<Grid item>
						<CustomText type='Body2'>Set as active</CustomText>
					</Grid>
					<Grid item ml='auto'>
						<Switch
							disabled={payload?.is_default}
							checked={payload?.is_active}
							onChange={() => handle_change('is_active', !payload?.is_active)}
						/>
					</Grid>
				</Grid>
			</Box>
			<Box p={1} sx={{ background: '#F7F8FA', borderRadius: '12px' }}>
				<Grid container alignItems='center'>
					<Grid item>
						<CustomText type='Body2'>Set as default</CustomText>
					</Grid>
					<Grid item ml='auto'>
						<Switch
							disabled={!payload?.is_active}
							checked={payload?.is_default}
							onChange={() => handle_change('is_default', !payload?.is_default)}
						/>
					</Grid>
				</Grid>
			</Box>

			{/* Footer */}

			<Box sx={{ width: '420px', position: 'fixed', bottom: 10 }}>
				<Divider className='drawer-divider' />
				<Grid container gap={1} justifyContent={'flex-end'}>
					<Grid item mt={1}>
						<Button variant='outlined' onClick={on_close}>
							Cancel
						</Button>
					</Grid>
					<Grid item mt={1}>
						<Button variant='contained' onClick={handle_save}>
							Save
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);

	useEffect(() => {
		set_payload(data);
	}, []);
	return (
		<>
			<Drawer open={open} onClose={on_close} width={450} title='Edit data' content={content} />
		</>
	);
};

export default GroupingDrawer;
