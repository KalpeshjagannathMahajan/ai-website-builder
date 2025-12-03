import { Divider } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import ToggleSwitchEditField from 'src/common/@the-source/atoms/FieldsNew/ToggleSwitchEditField';
import TextEditField from 'src/common/@the-source/atoms/FieldsNew/TextEditField';
import CheckboxEditField from 'src/common/@the-source/atoms/FieldsNew/CheckboxEditField';
import { useSelector } from 'react-redux';

interface Props {
	is_visible: boolean;
	data: any;
	close: () => void;
	handle_save: any;
}

const AddEditPricelist = ({ is_visible, data, close, handle_save }: Props) => {
	const [error_message, set_error_message] = useState('');
	const tenant_info_currency = useSelector((state: any) => state?.settings?.currency);
	const [loading, set_loading] = useState<boolean>(false);
	const methods = useForm({
		defaultValues: { ...data, currency: tenant_info_currency ?? '$' },
	});
	const { getValues } = methods;

	const handleClick = () => {
		set_loading(true);
		let values;
		if (data) {
			values = { ...data, ...getValues() };
		} else {
			values = getValues();
		}
		if (!values?.name) {
			set_error_message('This field is required');
			set_loading(false);
			return;
		}
		handle_save(values);
		close();
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>{data?.id ? 'Edit' : 'Add new'} pricelist</CustomText>
				<Icon iconName='IconX' onClick={close} />
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<FormProvider {...methods}>
				<Grid container className='drawer-footer' alignItems='center' justifyContent='space-between'>
					<Grid item>
						<CheckboxEditField name='is_default' key='is_default' defaultValue={false} checkbox_value={true} label={'Set as Default'} />
					</Grid>
					<Grid item>
						<Button sx={{ mr: 1 }} variant='outlined' onClick={close}>
							Cancel
						</Button>
						<Button onClick={handleClick} loading={loading}>
							Save
						</Button>
					</Grid>
				</Grid>
			</FormProvider>
		);
	};

	const is_active = data?.catalog_status === 'active' ? true : false || false;

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<FormProvider {...methods}>
					<TextEditField
						sx={{ mt: 1 }}
						name='name'
						label='Pricelist'
						validations={{ required: true }}
						helperText={error_message}
						error={error_message?.length > 0}
					/>
					<Grid
						sx={{
							background: '#F7F8FA',
							borderRadius: '12px',
							padding: '2px',
						}}>
						<ToggleSwitchEditField
							name='is_active'
							key='is_active'
							disabled={data?.is_default}
							defaultValue={is_active}
							value={is_active}
							label='Active'
						/>
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
export default AddEditPricelist;
