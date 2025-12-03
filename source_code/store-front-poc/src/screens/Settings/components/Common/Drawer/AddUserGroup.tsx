import { Divider } from '@mui/material';
import { t } from 'i18next';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, Drawer, Grid, Icon, Skeleton } from 'src/common/@the-source/atoms';
import ToggleSwitchEditField from 'src/common/@the-source/atoms/FieldsNew/ToggleSwitchEditField';
import CustomText from 'src/common/@the-source/CustomText';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import SectionFields from 'src/common/OneColumnForms/FieldComponents/SectionFields';
import settings from 'src/utils/api_requests/setting';
import { background_colors } from 'src/utils/light.theme';

interface Props {
	is_visible: boolean;
	close: () => void;
	data: any;
	index?: number;
	handle_update_setting: any;
}

const AddUserGroup = ({ is_visible, close, data, handle_update_setting }: Props) => {
	const [sections, set_sections] = useState([]);
	const [loading, set_loading] = useState(false);
	const methods = useForm({
		defaultValues: {
			buyer_access: data?.buyer_access ?? '',
			catalog_access: data?.catalog_access ?? '',
			order_access: data?.order_access ?? '',
			user_list: data?.user_list ?? [],
			buyer_access_toggle: !!data?.buyer_access,
			catalog_access_toggle: !!data?.catalog_access,
			order_access_toggle: !!data?.order_access,
		},
	});
	const {
		handleSubmit,
		formState: { errors },
		getValues,
		setValue,
		watch,
		register,
		reset,
		clearErrors,
	} = methods;

	const onSubmit = (form_data: any) => {
		const custom_attributes_section: any = sections.find((section) => section.key === 'custom_attributes');
		const custom_attributes = custom_attributes_section?.attributes.reduce((acc: any, attr: any) => {
			const user_selected_option = getValues(attr?.key);
			if (!user_selected_option) {
				acc[attr?.id] = null;
			} else {
				const selected_option = attr.options?.find((option: any) => option.value === user_selected_option);
				if (selected_option) {
					acc[attr?.id] = {
						label: selected_option.label || '',
						value: selected_option.value || '',
					};
				}
			}
			return acc;
		}, {});

		handle_update_setting({
			showroom_mode_permission_id: data?.id ?? '',
			user_list: form_data?.user_list,
			buyer_access: form_data?.buyer_access_toggle ? form_data?.buyer_access : '',
			order_access: form_data?.order_access_toggle ? form_data?.order_access : '',
			catalog_access: form_data?.catalog_access_toggle ? form_data?.catalog_access : '',
			custom_attributes,
		});
		close();
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>{_.isEmpty(data) ? 'Add' : 'Edit'} user</CustomText>
				<Icon iconName='IconX' sx={{ cursor: 'pointer' }} onClick={close} />
			</Grid>
		);
	};
	const handle_render_drawer_content = () => {
		if (loading)
			return (
				<Grid className='drawer-body' pt={1} gap={2}>
					<Skeleton variant='rounded' width={'100%'} height={50} />
					<Skeleton variant='rounded' width={'100%'} height={50} />
					<Skeleton variant='rounded' width={'100%'} height={50} />
					<Skeleton variant='rounded' width={'100%'} height={50} />
				</Grid>
			);

		return (
			<Grid className='drawer-body' pt={1}>
				<FormProvider {...methods}>
					{sections.map((section: any) => {
						const transform_attr =
							section?.key === 'custom_attributes'
								? section?.attributes?.map((item: any) => ({ ...item, required: false }))
								: section?.attributes;
						if (section?.key === 'select_user') {
							const attribute: any = section?.attributes[0];
							const default_values = _.map(data?.user_list, (item) => item?.value)?.join(', ');

							return (
								<FormBuilder
									placeholder={attribute.name}
									label={attribute.name}
									name={'user_list'}
									validations={{
										required: Boolean(attribute.required),
										number: attribute.type === 'number',
										email: attribute.type === 'email',
									}}
									defaultValue={default_values}
									type={'multi_select'}
									options={attribute.options}
									setValue={setValue}
								/>
							);
						}
						return (
							<Grid
								key={section.key}
								sx={{
									padding: section?.key === 'custom_attributes' && _.size(section?.attributes) == 0 ? '0rem 0rem' : '1rem 0rem',
									borderRadius: '12px',
									background: background_colors?.secondary,
								}}>
								{section?.key !== 'custom_attributes' && (
									<ToggleSwitchEditField
										key={`${section?.key}_toggle`}
										{...register(`${section?.key}_toggle`)}
										label={`Update ${section.name.toLowerCase()} list`}
										labelStyle={{ fontWeight: 700 }}
									/>
								)}
								{section?.key === 'custom_attributes' && _.size(section?.attributes) > 0 && (
									<Grid ml={2} mb={1}>
										<CustomText type='H3'>Set attribute defaults</CustomText>
									</Grid>
								)}

								<Grid pr={section?.key === 'custom_attributes' ? 1 : 0} sx={{ marginLeft: '1rem' }}>
									{_.size(section?.attributes) > 0 && (watch(`${section?.key}_toggle`) || section?.key === 'custom_attributes') && (
										<SectionFields
											attributes={transform_attr}
											getValues={getValues}
											setValue={setValue}
											register={register}
											clearErrors={clearErrors}
											multi_select_value={_.isArray(data?.[section?.key]) ? data?.[section?.key]?.map((item: any) => item?.value) : []}
										/>
									)}
								</Grid>
							</Grid>
						);
					})}
				</FormProvider>
			</Grid>
		);
	};
	const handle_render_footer = () => {
		return (
			<Grid container justifyContent={'flex-end'} gap={2}>
				<Button variant='outlined' onClick={close}>
					{t('Settings.CTA.cancel')}
				</Button>
				<Button onClick={handleSubmit(onSubmit)} disabled={!_.isEmpty(errors)}>
					{t('Settings.CTA.save')}
				</Button>
			</Grid>
		);
	};

	useEffect(() => {
		set_loading(true);
		settings
			.get_showroom_mode_form(data?.id)
			.then((res: any) => {
				if (res?.status === 200) {
					set_sections(res?.data?.sections);
				}
			})
			.catch((err) => console.error(err))
			.finally(() => set_loading(false));
	}, []);

	useEffect(() => {
		if (data) {
			reset();
		}
	}, [data, reset]);

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

export default AddUserGroup;
