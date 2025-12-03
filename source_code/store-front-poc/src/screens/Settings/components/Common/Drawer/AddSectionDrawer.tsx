/* eslint-disable @typescript-eslint/no-shadow */
import React, { useContext, useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Drawer, Grid, Icon, Button, Chip, Switch } from 'src/common/@the-source/atoms';
import { handle_product_template, handle_select_template, isUUID } from '../../../utils/helper';
import { Divider } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import _ from 'lodash';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import SelectWithDropDown from './SelectWithDropDown';
import CheckboxEditField from 'src/common/@the-source/atoms/FieldsNew/CheckboxEditField';
import ToggleSwitchEditField from 'src/common/@the-source/atoms/FieldsNew/ToggleSwitchEditField';
import {
	CUSTOMER_FIELDS,
	DATA_TYPE,
	PRODUCT,
	TEXT_DEFAULT,
	VALUE_DEFAULT,
	disable_types,
	LIMIT_ATTRIBUTE_SECTIONS,
	LIMIT_CHECK_TYPE,
	EXCLUDE_DATA_TYPE,
} from 'src/screens/Settings/utils/constants';
import { SECTION_DEFAULTS } from '../../Buyer/mock';
import SettingsContext from 'src/screens/Settings/context';
import DynamicAttribute from '../DynamicAttributes/DynamicAttribute';
import { SECTION_DISPLAY_FIELDS } from '../../Buyer/Buyer';
import { background_colors } from 'src/utils/light.theme';

const dividerStyle: React.CSSProperties = {
	height: '1px',
	background: 'repeating-linear-gradient(90deg,#D1D6DD 0 4px,#0000 0 8px)',
	margin: '1rem 0',
};

const AddSection = ({ drawer, set_drawer, type, data = {}, on_add, section, source = 'buyer' }: any) => {
	const { setting_to_customer } = useContext(SettingsContext);
	const is_product = source === PRODUCT;
	const template = is_product ? handle_product_template(type) : handle_select_template(type);
	const methods = useForm({
		defaultValues: {
			...data,
			value: data?.value || data?.configuration?.default_value || '',
			is_label_display: data?.is_label_display || data?.configuration?.is_label_display || false,
			validations: data?.validations || data?.configuration?.validations,
		},
	});
	const disable_options = !is_product ? data?.type : false;
	const {
		control,
		getValues,
		setValue,
		watch,
		formState: { isDirty },
		handleSubmit,
	} = methods;

	const [selectedChip, setSelectedChip] = useState<any>(data?.type ?? 'text');
	const [disable, set_disable] = useState<boolean>(false);
	const [toggle, set_toggle] = useState<boolean>(false);
	const [loading, set_loading] = useState<boolean>();
	const [error_message, set_error_message] = useState<string>('');
	const is_internal_app = import.meta.env.VITE_APP_INTERNAL_TOOL === 'true';
	const is_dynamic_attribute = watch('dynamic_attribute');

	const handle_toggle_change = (name: string, isChecked: boolean, type: 'mandatory' | 'inclusion') => {
		const requiredExclusion = getValues().required_exclusion_type || [];
		const displayExclusion = getValues().is_display_exclusion_type || [];

		if (type === 'mandatory') {
			const updated_required = isChecked ? requiredExclusion?.filter((item: string) => item !== name) : [...requiredExclusion, name];
			const unique_required = Array.from(new Set(updated_required));
			setValue('required_exclusion_type', unique_required);
			setValue('required', updated_required?.length < 2 ? true : false);
		} else if (type === 'inclusion') {
			const updated_display = isChecked ? displayExclusion?.filter((item: string) => item !== name) : [...displayExclusion, name];
			const updated_required = isChecked ? requiredExclusion : [...requiredExclusion, name];

			const unique_display = Array.from(new Set(updated_display));
			const unique_required = Array.from(new Set(updated_required));

			setValue('is_display_exclusion_type', unique_display);
			setValue('required_exclusion_type', unique_required);
			setValue('required', updated_required?.length < 2 ? true : false);
		}
	};

	useEffect(() => {
		if (!is_dynamic_attribute) {
			setValue('attribute_class', null);
			setValue('dynamic_attr_config', null);
		}
	}, [is_dynamic_attribute]);

	useEffect(() => {
		setValue('value', type === 'multi_select' ? [] : data?.value || '');
		set_toggle(false);
	}, [selectedChip]);

	useEffect(() => {
		if (!_.isEmpty(data?.value)) {
			set_toggle(true);
			setValue('value', data?.type === 'multi_select' ? _.split(data?.value, ', ') : data?.value);
		}
		if (!data || Object.keys(data).length <= 1) {
			if (source === 'order') {
				setValue('is_display', true);
				setValue('required', false);
				setValue('is_quote_display', true);
				setValue('is_quote_mandatory', false);
			} else if (source === 'buyer') {
				setValue('is_display', true);
			}
		}
	}, [data]);

	useEffect(() => {
		if (type === 'add_field' && section?.key === 'addresses' && source === 'buyer') {
			setValue('required_exclusion_type', []);
			setValue('is_display_exclusion_type', []);
		}
	}, [type, section?.key, source]);

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>{template?.header}</CustomText>
				<Icon iconName='IconX' onClick={() => set_drawer(false)} />
			</Grid>
		);
	};

	const handleClick = () => {
		set_loading(true);
		set_error_message('');
		const values: any = getValues();

		const minLength = values?.validations?.minLength;
		const maxLength = values?.validations?.maxLength;

		if (minLength && maxLength && parseInt(maxLength) < parseInt(minLength)) {
			set_loading(false);
			set_error_message('Min limit cannot be greater than Max limit');
			return;
		}

		values.id = data?.id ?? '';
		values.priority = Number(values.priority);
		if (selectedChip === 'multi_select') {
			values.value = _.join(getValues().value, ', ');
		} else if (!toggle && _.includes(VALUE_DEFAULT, selectedChip)) {
			values.value = '';
		} else if (values?.type === 'radio' || values?.type === 'checkbox') {
			values.value = false;
		}
		const is_edit = Boolean(values?.id || data?.id);
		if (is_internal_app && is_dynamic_attribute) {
			values.dynamic_attr_config = {
				attribute_class: values?.attribute_class,
			};
		}

		on_add(values, is_edit, section?.name);
	};

	const enable_basic_details = ['display_name', 'type_of_customer', 'email', 'phone'];

	useEffect(() => {
		if (source === 'buyer') {
			if (!watch('is_display')) {
				setValue('required', false);
				setValue('is_quick_add', false);
			}

			if (watch('required')) {
				setValue('is_quick_add', true);
			}

			if (!watch('is_quick_add')) {
				setValue('required', false);
			}
		}

		if (!isDirty) {
			if (data?.type) {
				setValue('type', data?.type);
			} else {
				setValue('type', 'text');
			}
		}
		if (section?.key === 'basic_details') {
			if (enable_basic_details?.includes(data?.id)) {
				set_disable(false);
			} else {
				set_disable(true);
			}
		}
	}, [watch('is_display'), watch('is_quick_add'), watch('required')]);

	useEffect(() => {
		if (source === 'order') {
			if (!watch('is_display')) {
				setValue('required', false);

				if (!watch('required')) {
					setValue('is_display', false);
				} else {
					setValue('is_display', true);
				}
			}

			if (!watch('is_quote_display')) {
				setValue('is_quote_mandatory', false);

				if (!watch('is_quote_mandatory')) {
					setValue('is_quote_display', false);
				} else {
					setValue('is_quote_display', true);
				}
			}
		}
	}, [watch('is_display'), watch('is_quote_display'), watch('required'), watch('is_quote_mandatory')]);

	const handle_click = (val: string) => {
		if (disable_options) return;
		if (disable) return;
		if (disable_types.includes(val) && !is_product) return;
		setSelectedChip(val);
		setValue('type', val);
	};

	const display_exclusion_type_watch = watch('is_display_exclusion_type');
	const required_exclusion_type_watch = watch('required_exclusion_type');

	useEffect(() => {
		const val = watch('is_display');
		if (!val) {
			setValue('is_display_exclusion_type', ['billing', 'shipping']);
			setValue('required_exclusion_type', ['billing', 'shipping']);
		}
	}, [watch('is_display')]);

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<FormProvider {...methods}>
					{_.map(template?.attributes, (attribute: any) => {
						if (attribute?.id === 'priority') {
							return (
								<Grid sx={{ display: setting_to_customer ? 'none' : 'flex' }}>
									<FormBuilder
										placeholder={attribute?.name}
										label={attribute?.name}
										name={`${attribute?.id}`}
										validations={{
											required: Boolean(attribute?.required),
										}}
										defaultValue={attribute?.value}
										type={attribute?.type}
										control={control}
										register={methods.register}
										getValues={getValues}
										setValue={setValue}
										disabled={attribute?.id === 'id'}
									/>
								</Grid>
							);
						} else if (attribute?.id !== 'priority') {
							return (
								<FormBuilder
									placeholder={attribute?.name}
									label={attribute?.name}
									name={`${attribute?.id}`}
									validations={{
										required: Boolean(attribute?.required),
									}}
									defaultValue={attribute?.value}
									type={attribute?.type}
									control={control}
									register={methods.register}
									getValues={getValues}
									setValue={setValue}
									disabled={attribute?.id === 'id'}
								/>
							);
						}
					})}
					{!EXCLUDE_DATA_TYPE.includes(data?.id) && (
						<Grid border={'1px dashed rgba(181, 187, 195, 1)'} borderRadius={1.2} p={2}>
							<CustomText type='H6' style={{ marginBottom: '16px' }}>
								Select data type
							</CustomText>
							<Grid display='flex' flexWrap='wrap' gap={1.2}>
								{_.map(template?.field_type, ({ label, value, icon, disable }: any) => (
									<Chip
										sx={{
											borderColor: selectedChip === value ? '#16885F' : disable_options || disable ? 'rgba(103, 109, 119, 0.4)' : '',
											margin: '5px',
											padding: '5px',
											'& .MuiSvgIcon-root': {
												color: selectedChip === value ? '#16885F' : disable_options || disable ? 'rgba(103, 109, 119, 0.4)' : '',
											},
										}}
										size={'small'}
										avatar={<Icon sx={{ height: '10px', width: '10px' }} iconName={icon} />}
										key={value}
										onClick={() => handle_click(value)}
										label={label}
										bgColor={selectedChip === value ? '#E8F3EF' : '#fff'}
										textColor={selectedChip === value ? '#16885F' : disable_options || disable ? 'rgba(103, 109, 119, 0.4)' : '#676D77'}
										variant='outlined'
									/>
								))}
							</Grid>
							{!_.includes(CUSTOMER_FIELDS, data?.id) && DATA_TYPE.includes(selectedChip) && (
								<SelectWithDropDown
									type={selectedChip}
									control={control}
									getValues={getValues}
									setValue={setValue}
									methods={methods}
									option={is_product ? data?.meta?.options ?? [] : data?.options}
									toggle={toggle}
									set_toggle={set_toggle}
									is_product={is_product}
									data={data}
								/>
							)}
						</Grid>
					)}
					{TEXT_DEFAULT.includes(selectedChip) && (
						<FormBuilder
							placeholder='Select default value'
							label='Select default value'
							name='value'
							validations={{ required: false }}
							type={type === 'percentage' ? 'amount' : 'text'}
							control={control}
							register={methods.register}
							getValues={getValues}
							setValue={setValue}
						/>
					)}
					{source === 'buyer' && _.includes(SECTION_DISPLAY_FIELDS, section?.key) && (
						<Grid
							sx={{
								background: '#F7F8FA',
								borderRadius: '12px',
								padding: '2px',
							}}>
							<ToggleSwitchEditField name='is_label_display' key='is_label_display' defaultValue={false} label='Show label on display' />
						</Grid>
					)}
					{_.includes(LIMIT_ATTRIBUTE_SECTIONS, source) && _.includes(LIMIT_CHECK_TYPE, selectedChip) && (
						<Grid p={2} sx={{ background: '#F7F8FA', borderRadius: '12px' }}>
							<CustomText type='H6'>Character Limit</CustomText>
							<Grid container gap={2} my={2}>
								<Grid item xs={5.5}>
									<FormBuilder
										placeholder='Min limit'
										label='Min limit'
										name='validations.minLength'
										validations={{
											required: false,
										}}
										type={'number'}
										control={control}
										register={methods.register}
										getValues={getValues}
										setValue={setValue}
										style={{ background: '#fff' }}
									/>
								</Grid>
								<Grid item xs={5.5}>
									<FormBuilder
										placeholder='Max limit'
										label='Max limit'
										name='validations.maxLength'
										validations={{ required: false }}
										type={'number'}
										control={control}
										register={methods.register}
										getValues={getValues}
										setValue={setValue}
										style={{ background: '#fff' }}
									/>
								</Grid>
							</Grid>
							{error_message && <CustomText style={{ color: 'red' }}>{error_message}</CustomText>}
						</Grid>
					)}
					{source === 'buyer' && !_.includes(SECTION_DEFAULTS, section?.key) && (
						<Grid
							sx={{
								background: '#F7F8FA',
								borderRadius: '12px',
								padding: '2px',
							}}>
							<ToggleSwitchEditField
								name='is_quick_add'
								key='is_quick_add'
								defaultValue={false}
								label='Include in quick add form'
								disabled={!watch('is_display') || watch('required') || disable}
							/>
						</Grid>
					)}
					{source === 'order' && (
						<>
							{(_.isEmpty(data) || isUUID(data?.id)) && is_internal_app && (
								<DynamicAttribute data={data} is_dynamic_attribute={is_dynamic_attribute} />
							)}
							{selectedChip === 'select' && (_.isEmpty(data) || isUUID(data?.id)) && (
								<Grid
									sx={{
										background: background_colors?.secondary,
										borderRadius: '12px',
										padding: '2px',
									}}>
									<ToggleSwitchEditField
										name='enabled_for_showroom'
										key='enabled_for_showroom'
										defaultValue={data?.enabled_for_showroom ?? false}
										label='Enable on showroom mode'
									/>
								</Grid>
							)}
							<CustomText type='H6'> Order Settings</CustomText>
							<Grid
								sx={{
									background: '#F7F8FA',
									borderRadius: '12px',
									padding: '2px',
								}}>
								<ToggleSwitchEditField name='required' key='required' defaultValue={data?.required ?? true} label='Set as Mandatory' />
							</Grid>
							<Grid
								sx={{
									background: '#F7F8FA',
									borderRadius: '12px',
									padding: '2px',
								}}>
								<ToggleSwitchEditField
									name='is_display'
									key='is_display'
									defaultValue={data?.is_display ?? true}
									value={data?.required}
									label='To be included'
								/>
							</Grid>

							<div style={dividerStyle}></div>

							<CustomText type='H6'> Quote Settings</CustomText>
							<Grid
								sx={{
									background: '#F7F8FA',
									borderRadius: '12px',
									padding: '2px',
								}}>
								<ToggleSwitchEditField
									name='is_quote_mandatory'
									key='is_quote_mandatory'
									defaultValue={data?.is_quote_mandatory ?? true}
									label='Set as Mandatory'
								/>
							</Grid>
							<Grid
								sx={{
									background: '#F7F8FA',
									borderRadius: '12px',
									padding: '2px',
								}}>
								<ToggleSwitchEditField
									name='is_quote_display'
									key='is_quote_display'
									defaultValue={data?.is_quote_display ?? true}
									label='To be included'
								/>
							</Grid>
						</>
					)}
					{source === 'buyer' && section?.key === 'addresses' && (
						<Grid>
							{/* Billing Section */}
							<Grid container flexDirection='column' sx={{ p: 2, gap: 2, background: '#F7F8FA', borderRadius: '12px' }}>
								<Grid>
									<CustomText type='H6'>Billing Address</CustomText>
								</Grid>
								<Grid container alignItems='center'>
									<Grid item>
										<CustomText type='Body'>Mandatory</CustomText>
									</Grid>
									<Grid item ml='auto'>
										<Switch
											checked={!required_exclusion_type_watch?.includes('billing')}
											disabled={display_exclusion_type_watch?.includes('billing')}
											onChange={(e: any) => handle_toggle_change('billing', e.target.checked, 'mandatory')}
										/>
									</Grid>
								</Grid>
								<Grid container>
									<Grid item>
										<CustomText type='Body'>Include</CustomText>
									</Grid>
									<Grid item ml='auto'>
										<Switch
											checked={!getValues().is_display_exclusion_type?.includes('billing')}
											disabled={!watch('is_display')}
											onChange={(e: any) => handle_toggle_change('billing', e.target.checked, 'inclusion')}
										/>
									</Grid>
								</Grid>
							</Grid>

							{/* Shipping Section */}
							<Grid container flexDirection='column' sx={{ p: 2, gap: 2, mt: 2, background: '#F7F8FA', borderRadius: '12px' }}>
								<Grid>
									<CustomText type='H6'>Shipping Address</CustomText>
								</Grid>
								<Grid container alignItems='center'>
									<Grid item>
										<CustomText type='Body'>Mandatory</CustomText>
									</Grid>
									<Grid item ml='auto'>
										<Switch
											checked={!required_exclusion_type_watch?.includes('shipping')}
											disabled={display_exclusion_type_watch?.includes('shipping')}
											onChange={(e: any) => handle_toggle_change('shipping', e.target.checked, 'mandatory')}
										/>
									</Grid>
								</Grid>
								<Grid container>
									<Grid item>
										<CustomText type='Body'>Include</CustomText>
									</Grid>
									<Grid item ml='auto'>
										<Switch
											checked={!getValues().is_display_exclusion_type?.includes('shipping')}
											disabled={!watch('is_display')}
											onChange={(e: any) => handle_toggle_change('shipping', e.target.checked, 'inclusion')}
										/>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					)}
					{source === 'buyer' && section?.key !== 'addresses' && (
						<Grid
							sx={{
								background: '#F7F8FA',
								borderRadius: '12px',
								padding: '2px',
							}}>
							<ToggleSwitchEditField
								name='required'
								key='required'
								defaultValue={data?.required ?? true}
								label='Set as Mandatory'
								disabled={!watch('is_display') || disable}
							/>
						</Grid>
					)}
				</FormProvider>
			</Grid>
		);
	};

	const handle_render_disable = () => {
		if (EXCLUDE_DATA_TYPE.includes(data?.id)) return;
		return (selectedChip === 'select' || selectedChip === 'multi_select') && getValues()?.options?.length === 0;
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Grid display='flex' alignItems='center'>
					{source === 'buyer' && (
						<FormProvider {...methods}>
							<CheckboxEditField
								name='is_display'
								key='is_display'
								defaultValue={true}
								checkbox_value={data?.is_display || true}
								label={'Include in customer form'}
								disabled={_.includes(['company_name', 'sales_reps', 'catalog_group'], data?.id)}
							/>
						</FormProvider>
					)}
				</Grid>
				<Grid display='flex' gap={2}>
					<Button onClick={() => set_drawer(false)} disabled={loading} variant='outlined'>
						Cancel
					</Button>
					<Button loading={loading} disabled={handle_render_disable()} onClick={handleSubmit(handleClick)}>
						{type === 'edit_field' ? 'Save' : 'Create'}
					</Button>
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

	return (
		<Drawer
			anchor='right'
			width={480}
			open={drawer}
			onClose={() => set_drawer(false)}
			content={<React.Fragment>{handle_render_content()}</React.Fragment>}
		/>
	);
};
export default AddSection;
