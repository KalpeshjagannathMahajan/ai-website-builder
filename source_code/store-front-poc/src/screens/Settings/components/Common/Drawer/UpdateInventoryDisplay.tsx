import { Divider } from '@mui/material';
import { t } from 'i18next';
import _ from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { useContext, useState } from 'react';
import SettingsContext from 'src/screens/Settings/context';
import { INVENTORY_FORM } from '../../Inventory/constant';
import ToggleSwitchEditField from 'src/common/@the-source/atoms/FieldsNew/ToggleSwitchEditField';
import { background_colors } from 'src/utils/light.theme';
import { INVENTORY_ICON_META } from 'src/common/@the-source/molecules/Inventory/constants';

interface Props {
	open: boolean;
	close: () => void;
	data: any;
}

const UpdateInventoryDisplay = ({ open, close, data }: Props) => {
	const [loading, set_loading] = useState<boolean>(false);
	const { configure, update_configuration } = useContext(SettingsContext);
	const config_data = configure?.inventory_i_button_settings || INVENTORY_ICON_META;
	const methods = useForm({
		defaultValues: { ...data, ...data?.filter_logic },
	});

	const {
		control,
		getValues,
		setValue,
		handleSubmit,
		formState: { isDirty },
	}: any = methods;

	const handle_save = async (params: any) => {
		set_loading(true);

		try {
			let updated_key_data = {
				...config_data?.[params?.key],
				label: params?.name || config_data?.[params?.key]?.label,
				show: params?.show,
			};
			if (data?.entries > 0) {
				updated_key_data = { ...updated_key_data, entries: params?.entries };
			}
			const updated_data = {
				...config_data,
				[params?.key]: updated_key_data,
			};
			await update_configuration('inventory_i_button_settings', updated_data, close);
			set_loading(false);
		} catch (err) {
			console.log(err);
			set_loading(false);
		}
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>{data?.name}</CustomText>
				<Icon iconName='IconX' sx={{ cursor: 'pointer' }} onClick={close} />
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Button variant='outlined' onClick={close} disabled={loading}>
					{t('Settings.CTA.cancel')}
				</Button>
				<Button onClick={handleSubmit(handle_save)} loading={loading} disabled={!isDirty}>
					{t('Settings.CTA.save')}
				</Button>
			</Grid>
		);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body' pt={1}>
				<FormProvider {...methods}>
					{_.map(INVENTORY_FORM, (attribute: any) => {
						if (attribute?.id === 'entries') {
							if (data?.entries) {
								return (
									<FormBuilder
										key={attribute?.id}
										placeholder={attribute?.name}
										label={attribute?.name}
										name={attribute?.id}
										defaultValue={data?.[attribute?.id] || attribute?.value}
										validations={{ required: true }}
										type={attribute?.type}
										control={control}
										register={methods.register}
										getValues={getValues}
										setValue={setValue}
									/>
								);
							}
						} else {
							return (
								<FormBuilder
									key={attribute?.id}
									placeholder={attribute?.name}
									label={attribute?.name}
									name={attribute?.id}
									defaultValue={data?.[attribute?.id] || attribute?.value}
									validations={{ required: true }}
									type={attribute?.type}
									control={control}
									register={methods.register}
									getValues={getValues}
									setValue={setValue}
								/>
							);
						}
					})}
					<Grid
						sx={{
							background: background_colors?.secondary,
							borderRadius: '12px',
							padding: '2px',
						}}>
						<ToggleSwitchEditField name='show' key='show' defaultValue={data?.show ?? true} label='To be included' />
					</Grid>
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

	return <Drawer width={480} open={open} onClose={close} content={handle_render_drawer()} />;
};

export default UpdateInventoryDisplay;
