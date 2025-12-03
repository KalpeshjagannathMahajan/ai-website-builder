import { Divider } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import ToggleSwitchEditField from 'src/common/@the-source/atoms/FieldsNew/ToggleSwitchEditField';

interface Props {
	is_visible: boolean;
	data: any;
	close: () => void;
	handle_save: any;
	entity?: string;
}

const EditRailDrawer = ({ is_visible, data, close, handle_save, entity = 'rail' }: Props) => {
	const [loading, set_loading] = useState<boolean>(false);
	const methods = useForm({
		defaultValues: { ...data },
	});
	const { getValues } = methods;

	const handleClick = () => {
		set_loading(true);
		handle_save(getValues());
		close();
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>{data?.name}</CustomText>
				<Icon iconName='IconX' onClick={close} />
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Button variant='outlined' onClick={close}>
					Cancel
				</Button>
				<Button onClick={handleClick} loading={loading}>
					Save
				</Button>
			</Grid>
		);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<FormProvider {...methods}>
					<Grid
						sx={{
							background: '#F7F8FA',
							borderRadius: '12px',
							padding: '2px',
						}}>
						<ToggleSwitchEditField name='is_active' key='is_active' defaultValue={false} label={`Set ${entity} as active`} />
					</Grid>
				</FormProvider>
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

	return <Drawer anchor='right' width={480} open={is_visible} onClose={close} content={handle_render_content()} />;
};
export default EditRailDrawer;
