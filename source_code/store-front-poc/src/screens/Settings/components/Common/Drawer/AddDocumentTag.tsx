import { Divider } from '@mui/material';
import { t } from 'i18next';
import { FormProvider, useForm } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import { useContext, useEffect, useState } from 'react';
import ToggleSwitchEditField from 'src/common/@the-source/atoms/FieldsNew/ToggleSwitchEditField';
import SettingsContext from 'src/screens/Settings/context';
import _ from 'lodash';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { background_colors, text_colors } from 'src/utils/light.theme';
import { COLORS } from 'src/screens/Settings/utils/constants';
import settings from 'src/utils/api_requests/setting';

const AddDocumentTag = ({ is_visible, close, data, tag_list = [], index = 0 }: any) => {
	const { configure, update_configuration } = useContext(SettingsContext);
	const [loading, set_loading] = useState<boolean>(false);
	const methods = useForm({
		defaultValues: {
			label: data?.label,
			value: data?.value || data?.label || '',
			color: data?.color || COLORS[0],
			is_default: data?.is_default ?? false,
			is_active: data?.is_active ?? true,
		},
	});
	const {
		handleSubmit,
		watch,
		setValue,
		setError,
		clearErrors,
		formState: { errors },
	} = methods;
	const is_active = watch('is_active');
	const custom_name_val = watch('label');
	const tag_data = _.head(configure?.order_settings?.tags) || {};

	const onSubmit = async (formData: any) => {
		set_loading(true);
		let updated_tag_list = _.cloneDeep(tag_list);

		updated_tag_list[index] = {
			...formData,
			value: formData?.label,
		};

		if (formData?.is_default && !data?.is_default) {
			updated_tag_list = _.map(updated_tag_list, (tag: any) => ({
				...tag,
				is_default: tag?.value === formData?.value ? true : false,
			}));
		}

		const tags: any = [
			{
				...tag_data,
				options: updated_tag_list,
			},
		];

		let template: any = {
			entity: 'document',
			id: tag_data.id,
			alias: 'order tag',
			name: 'Order Tag',
			data_type: 'tag',
			is_mandatory: true,
			is_filterable: true,
			is_searchable: true,
			is_internal: true,
			configuration: { options: updated_tag_list },
		};

		await settings.update_attribute(template);
		await update_configuration('order_settings', { ...configure?.order_settings, tags }, close());
		await update_configuration('quote_settings', { ...configure?.quote_settings, tags }, close());
		set_loading(false);
	};

	const handleColorChange = (newColor: any) => {
		setValue('color', newColor);
	};

	useEffect(() => {
		if (is_active === false) {
			setValue('is_default', false);
		}
	}, [is_active, setValue]);

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>{data?.label || 'Add new'}</CustomText>
				<Icon iconName='IconX' sx={{ cursor: 'pointer' }} onClick={close} />
			</Grid>
		);
	};

	const handle_blur = () => {
		if (!custom_name_val || data?.label) return;

		const normalized_custom_name = custom_name_val.trim().toLowerCase();

		const is_duplicate = _.find(tag_list, (item: any) => {
			const normalized_label = item?.label?.trim().toLowerCase();
			return normalized_label === normalized_custom_name;
		});

		if (is_duplicate) {
			setError('label', { type: 'custom', message: 'Custom name already exists' });
		} else {
			clearErrors('label');
		}
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Button variant='outlined' onClick={close} disabled={loading}>
					{t('Settings.CTA.cancel')}
				</Button>
				<Button onClick={handleSubmit(onSubmit)} disabled={!_.isEmpty(errors)} loading={loading}>
					{t('Settings.CTA.save')}
				</Button>
			</Grid>
		);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body' pt={1}>
				<FormProvider {...methods}>
					<FormBuilder
						name='label'
						label='Custom name'
						validations={{
							required: true,
						}}
						type='text'
						on_blur={handle_blur}
						disabled={!_.isEmpty(data)}
					/>

					<Grid container sx={{ border: `1px solid ${text_colors?.primary}`, borderRadius: '0.8rem', padding: '2rem', gap: '2rem' }}>
						<CustomText type='H6'>{t('OrderTag.SelectChipColor')}</CustomText>
						<Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
							{_.map(COLORS, (color) => (
								<Grid
									p={2}
									sx={{
										cursor: 'pointer',
										borderRadius: '50%',
										background: color,
										border: _.toLower(color) === _.toLower(watch('color')) ? '1px solid black' : '',
									}}
									onClick={() => _.isEmpty(data) && handleColorChange(color)}></Grid>
							))}
						</Grid>
						<FormBuilder
							name='color'
							label='Enter hex code'
							validations={{
								required: true,
							}}
							type='text'
							on_blur={handle_blur}
							disabled={!_.isEmpty(data)}
						/>
					</Grid>

					<Grid
						sx={{
							background: background_colors?.secondary,
							borderRadius: '12px',
							padding: '2px',
							margin: '1rem 0rem',
						}}>
						<ToggleSwitchEditField key='is_active' {...methods.register('is_active')} label='Set status as active' />
					</Grid>
					<Grid
						sx={{
							background: background_colors?.secondary,
							borderRadius: '12px',
							padding: '2px',
						}}>
						<ToggleSwitchEditField
							key='is_default'
							{...methods.register('is_default')}
							label='Set status as default'
							disabled={!is_active}
						/>
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

	return <Drawer width={480} open={is_visible} onClose={close} content={handle_render_drawer()} />;
};

export default AddDocumentTag;
