import { Divider } from '@mui/material';
import { t } from 'i18next';
import _ from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { useContext, useState } from 'react';
import SettingsContext from 'src/screens/Settings/context';
import CheckboxEditField from 'src/common/@the-source/atoms/FieldsNew/CheckboxEditField';
import { CONTAINER, CONTAINER_CONVERSIONS } from 'src/screens/Settings/utils/constants';
import { Container } from '../../Order/ContainerSetting';
import { handle_conversion } from 'src/screens/Settings/utils/helper';

interface ContainerProps {
	is_visible: boolean;
	close: () => void;
	data: Container;
	container_list: Container[];
	index: number;
}

const AddEditContainer = ({ is_visible, close, data, container_list = [], index = 0 }: ContainerProps) => {
	const [loading, set_loading] = useState<boolean>(false);
	const { configure, update_configuration, container_config_data } = useContext(SettingsContext);
	const methods = useForm({
		defaultValues: { ...data },
	});

	const { control, getValues, setValue, handleSubmit } = methods;
	const handle_check_change = () => {
		const obj: any = _.cloneDeep(getValues());

		return _.isEqual(obj, data);
	};

	const disable_button = getValues()?.container_volume <= 0 || handle_check_change();

	const handle_save = async (params: any) => {
		const conversion = container_config_data?.volume_conversion_map ?? CONTAINER_CONVERSIONS;

		set_loading(true);
		let updated_data: any = _.cloneDeep(params);
		updated_data.container_key = _.toLower(updated_data?.container_name).replace(/ /g, '_');
		let updated_container_list = _.cloneDeep(container_list);
		updated_container_list[index] = {
			...updated_data,
			container_volume: _.toNumber(updated_data?.container_volume),
			container_volume_data: handle_conversion(conversion, updated_data),
			is_default_container: false,
		};
		if (params?.is_default_container && !data?.is_default_container) {
			updated_container_list = _.map(updated_container_list, (container: Container) => ({
				...container,
				is_default_container: container?.container_name === params?.container_name ? true : false,
			}));
		}
		await update_configuration(
			'cart_container_config',
			{ ...configure?.cart_container_config, containers: updated_container_list },
			close(),
		);
		set_loading(false);
	};

	const get_default_value = () => {
		return container_list?.length === 0 || data?.is_default_container;
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>{data?.container_name || 'Add new'}</CustomText>
				<Icon iconName='IconX' sx={{ cursor: 'pointer' }} onClick={close} />
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<FormProvider {...methods}>
					<CheckboxEditField
						name='is_default_container'
						key='is_default_container'
						defaultValue={get_default_value()}
						checkbox_value={true}
						label='Set as default'
						disabled={get_default_value()}
					/>
				</FormProvider>
				<Button variant='outlined' onClick={close} disabled={loading}>
					{t('Settings.CTA.cancel')}
				</Button>
				<Button onClick={handleSubmit(handle_save)} disabled={disable_button} loading={loading}>
					{t('Settings.CTA.save')}
				</Button>
			</Grid>
		);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body' pt={1}>
				<FormProvider {...methods}>
					{_.map(CONTAINER?.CONTAINER_FORM, (attribute: any) => (
						<FormBuilder
							placeholder={attribute?.name}
							label={attribute?.name}
							name={attribute?.id}
							defaultValue={attribute?.value}
							validations={{ required: true }}
							type={attribute?.type}
							options={attribute?.options}
							control={control}
							register={methods.register}
							getValues={getValues}
							setValue={setValue}
						/>
					))}
				</FormProvider>
			</Grid>
		);
	};

	const handle_render_drawer = () => {
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

	return <Drawer width={480} open={is_visible} onClose={close} content={handle_render_drawer()} />;
};

export default AddEditContainer;
