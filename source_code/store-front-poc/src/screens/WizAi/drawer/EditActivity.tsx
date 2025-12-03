import { Divider } from '@mui/material';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon, Skeleton } from 'src/common/@the-source/atoms';

import RadioGroup from 'src/common/@the-source/molecules/RadioGroup';
import wiz_ai from 'src/utils/api_requests/wizAi';
import { text_colors } from 'src/utils/light.theme';
import { activities, icons } from '../constant';
import dayjs from 'dayjs';
import useStyles from '../style';
import constants from 'src/utils/constants';

interface Props {
	open: boolean;
	data: any;
	close: () => void;
	handle_activity: (payload: any, is_clear_activity: boolean) => void;
}
const ACTIVITY_OPTION = [
	{ label: 'Email', value: 'emailed' },
	{ label: 'Called', value: 'called' },
	{ label: 'Requirement', value: 'requirement' },
	{ label: 'Follow up', value: 'follow_up' },
	{ label: 'In person', value: 'in_person_visit' },
];
const EditActivity = ({ open, data, close, handle_activity }: Props) => {
	const [loading, set_loading] = useState<boolean>(false);
	const [show_history, set_show_history] = useState<boolean>(true);
	const [history_data, set_history_data] = useState<any>([]);
	const classes = useStyles();
	const methods = useForm({
		defaultValues: {
			buyer_activity_type: '',
			note: '',
		},
	});
	const { getValues, setValue } = methods;
	const [activity_loading, set_activity_loading] = useState(true);

	const handle_fetch_history = async (buyer_id: string) => {
		set_activity_loading(true);
		try {
			const response = await wiz_ai.get_activity_history(buyer_id);
			set_history_data(response?.data);
		} catch (err) {
			console.error(err);
		} finally {
			set_loading(false);
			set_activity_loading(false);
		}
	};

	useEffect(() => {
		handle_fetch_history(data?.buyer_id);
	}, [data?.buyer_id]);

	const handleClick = () => {
		set_loading(true);
		const payload = {
			type: getValues()?.buyer_activity_type,
			note: getValues()?.note,
			buyer_id: data?.buyer_id,
		};
		handle_activity(payload, false);
		close();
	};

	const handle_clear_activity = () => {
		const payload = {
			buyer_id: data?.buyer_id,
		};
		handle_activity(payload, true);
		close();
	};
	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>Activity</CustomText>
				<Icon iconName='IconX' onClick={close} />
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Button disabled={!data?.buyer_activity_type} variant='outlined' onClick={handle_clear_activity}>
					Clear activity
				</Button>
				<Button onClick={handleClick} loading={loading}>
					Save
				</Button>
			</Grid>
		);
	};

	const handle_activity_loader = () => {
		return _.map([1, 2, 3, 4, 5], () => (
			<>
				<Skeleton width={'75%'} height={'50px'} />
				<Skeleton width={'40%'} height={'20px'} />
			</>
		));
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<FormProvider {...methods}>
					<RadioGroup
						children={[{ name: 'Write Something ...', id: 'note', type: 'text', required: true, value: getValues()?.note }]}
						selectedOption={getValues().buyer_activity_type}
						options={ACTIVITY_OPTION}
						onChange={(val: string) => {
							setValue('buyer_activity_type', val);
							setValue('note', '');
						}}
					/>
				</FormProvider>
				<Grid
					display={'flex'}
					gap={'4px'}
					alignItems={'center'}
					sx={{ cursor: 'pointer', width: '14rem' }}
					onClick={() => set_show_history((prev) => !prev)}>
					<CustomText type='H3' color={text_colors.green}>
						Show history
					</CustomText>
					<Icon iconName={show_history ? 'IconChevronUp' : 'IconChevronDown'} color={text_colors.green} />
				</Grid>
				<Grid display={'flex'} flexDirection={'column'} gap={0}>
					{activity_loading
						? handle_activity_loader()
						: show_history &&
						  _.map(history_data, (item: any, index: number) => {
								return (
									<Grid key={item?.id} display={'flex'} gap={1}>
										<Grid display={'flex'} alignItems={'center'} direction={'column'}>
											<Grid>
												<Icon iconName={icons[item?.type]} className={classes.insight_icon_chip} />
											</Grid>
											{index < history_data.length - 1 && <Divider orientation='vertical' className={classes.insight_divider} />}
										</Grid>
										<Grid>
											<CustomText color={text_colors?.dark_grey}>
												{dayjs(item?.updated_at)?.format(constants.ATTRIBUTE_DATE_FORMAT)} : {item?.created_by_email}
											</CustomText>
											<CustomText>
												<strong>{activities[item?.type]}</strong>
												{item?.type !== 'activity_cleared' ? `: ${item?.description}` : ''}
											</CustomText>
										</Grid>
									</Grid>
								);
						  })}
				</Grid>
			</Grid>
		);
	};

	const handle_render_content = () => {
		return (
			<Grid className='drawer-container'>
				{handle_render_header()}
				<Divider className='drawer-divider' />
				{handle_render_drawer_content()}
				<Divider className='drawer-divider' />
				{handle_render_footer()}
			</Grid>
		);
	};

	return <Drawer anchor='right' width={380} open={open} onClose={close} content={handle_render_content()} />;
};
export default EditActivity;
