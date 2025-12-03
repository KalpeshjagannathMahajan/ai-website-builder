import { Divider } from '@mui/material';
import _ from 'lodash';
import React, { ReactNode, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Button, Drawer, Grid, Icon, Modal } from 'src/common/@the-source/atoms';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import CopyAddressDrawer from './CopyAddressDrawer';
import CheckboxEditField from 'src/common/@the-source/atoms/FieldsNew/CheckboxEditField';
import LocationSearch from 'src/common/LocationSearch';
import { SECTIONS } from 'src/screens/BuyerLibrary/constants';
import CustomText from 'src/common/@the-source/CustomText';
import { isUUID } from 'src/screens/Settings/utils/helper';
import { useTheme } from '@mui/material/styles';
// import useStyles from '../../../styles';
import '../../../style.css';
import { get_permission } from '../helper/helper';
import { useTranslation } from 'react-i18next';

interface Props {
	show_address_sheet_detail: any;
	all_address: [];
	close: () => void;
	handle_update_form: (key: string, data: any, optional_callback?: (value: boolean) => void) => void;
	delete_address: (index: number) => void;
	buyer_fields: any;
	primary_address_id: string;
	selected_value?: any;
	show_primary?: boolean;
	edit_buyer_id?: any;
	edit_mode?: any;
	close_on_submit?: boolean;
	extra_fields?: ReactNode;
	validate_field_id?: boolean;
	show_delete?: boolean;
}

const AddAddressComp = ({
	all_address,
	selected_value,
	buyer_fields,
	show_address_sheet_detail,
	primary_address_id,
	close,
	handle_update_form,
	delete_address,
	show_primary = true,
	edit_buyer_id,
	edit_mode,
	close_on_submit = true,
	extra_fields = null,
	validate_field_id = true,
	show_delete = true,
}: Props) => {
	// const classes = useStyles();
	const theme: any = useTheme();
	let addresses_object = _.find(buyer_fields?.sections, { key: SECTIONS?.address });
	let source = _.get(addresses_object, SECTIONS?.address, [])?.[0];

	const billing_length = _.filter(all_address, { type: 'billing' }).length;
	const shipping_length = _.filter(all_address, { type: 'shipping' }).length;

	const sorted_data = _.sortBy(source?.attributes, 'priority') || [];
	const [show_sheet, set_show_sheet] = useState(false);
	const [distinct_id, set_distinct_id] = useState(`temp_${crypto.randomUUID()}`);
	const [show_modal, set_show_modal] = useState(false);
	const [btn_loading, set_btn_loading] = useState<boolean>(false);
	const { t } = useTranslation();

	const address_permission = get_permission(
		addresses_object,
		edit_buyer_id,
		show_address_sheet_detail.is_shipping_type ? 'shipping' : 'billing',
	);
	const address_delete_permission = address_permission?.is_delete;

	const methods = useForm({
		defaultValues: {
			...selected_value,
		},
	});

	const {
		handleSubmit,
		reset,
		control,
		getValues,
		setValue,
		setError,
		clearErrors,
		watch,
		formState: { errors },
	} = methods;

	const handle_copied_address = (address: any) => {
		const _address = _.cloneDeep(address);

		_.forEach(sorted_data, (attribute) => {
			const address_type = show_address_sheet_detail?.is_shipping_type ? 'shipping' : 'billing';
			const is_display_exclusion_type = _.some(attribute?.is_display_exclusion_type, (val) => val === address_type);

			if (is_display_exclusion_type) _address[attribute?.id] = '';
		});

		const new_id = `temp_${crypto.randomUUID()}`;
		_address.id = new_id;
		_address.type = show_address_sheet_detail.is_shipping_type ? 'shipping' : 'billing';
		set_distinct_id(new_id);
		reset(_address);
		set_show_sheet(false);
		handle_check_duplicate('first_name', _address?.first_name, _.find(sorted_data, { id: 'first_name' })?.is_unique || false);
	};

	let street_address = getValues()?.street_address;

	const handle_drawer_disable = () => {
		return false;
	};

	const get_phone_number = (has_phone_e164_field: boolean, data: any) => {
		return has_phone_e164_field ? data?.phone || '' : data?.phone?.slice(data.country_code?.length - 1) || '';
	};

	const handle_confirm = (data: any) => {
		if (_.isEmpty(data)) {
			return;
		}
		if (show_primary) {
			const primary_value = data?.is_primary
				? data?.id
				: primary_address_id === selected_value?.id
				? ''
				: handle_default_value()
				? data?.id
				: primary_address_id;
			handle_update_form(
				`addresses.${show_address_sheet_detail?.is_shipping_type ? 'default_shipping_address' : 'default_billing_address'}`,
				primary_value,
			);
			delete data?.is_primary;
		}
		const has_phone_e164_field = _.some(sorted_data, { type: 'phone_e164' });
		const new_phone_number = get_phone_number(has_phone_e164_field, data);
		handle_update_form(`addresses.values.${show_address_sheet_detail.index}`, { ...data, phone: new_phone_number }, set_btn_loading);
		if (close_on_submit) {
			close();
		}
	};

	const handle_cancel_delete = () => {
		if (!_.isEmpty(selected_value)) {
			set_show_modal(true);
			return;
		}
		close();
	};

	const handle_copy_sheet_close = () => {
		set_show_sheet(false);
	};

	const handle_selected_place = (data: any) => {
		const address_fields = [
			{ name: 'city', value: data?.city },
			{ name: 'pincode', value: data?.zip_code },
			{ name: 'state', value: data?.state?.key || data?.state },
			{ name: 'street_address', value: data?.street_address },
			{ name: 'address_line_2', value: data?.address_2 },
		];

		address_fields.forEach((field) => {
			const options = !_.isEmpty(field.value) ? { shouldValidate: true } : {};
			setValue(field.name, field.value, options);
		});
	};

	const handle_check_duplicate = (name: any, value: any, is_unique?: boolean) => {
		if (is_unique) {
			const filtered_data = selected_value ? all_address?.filter((item: any) => item?.id !== selected_value?.id) : all_address;
			const is_duplicate = filtered_data?.some((ele) => ele[name] === value);
			if (is_duplicate) {
				setError(name, { type: 'custom', message: 'This address name already exists' });
			} else {
				clearErrors(name);
			}
		}
	};

	const handle_render_header = () => {
		const type = show_address_sheet_detail.is_shipping_type ? 'shipping' : 'billing';
		const type_to_check = show_address_sheet_detail.is_shipping_type ? 'billing' : 'shipping';
		const all_address_by_type = _.filter(all_address, (item: any) => item.status !== 'archived' && item.type === type_to_check) || [];
		return (
			<Grid className='drawer-header'>
				<CustomText type='H2'>
					{_.isEmpty(selected_value)
						? t('Common.AddEditAddressDrawer.AddAddress', {
								address_type: type,
						  })
						: t('Common.AddEditAddressDrawer.EditAddress', {
								address_type: type,
						  })}
				</CustomText>
				{all_address_by_type.length > 0 && (
					<Grid display='flex' ml={1} onClick={() => set_show_sheet(true)}>
						<Icon iconName='IconCopy' color={theme?.quick_add_buyer?.copy} sx={{ cursor: 'pointer' }} />
						<CustomText
							style={{
								cursor: 'pointer',
							}}
							type='Subtitle'
							color={theme?.quick_add_buyer?.copy}>
							Copy from
						</CustomText>
					</Grid>
				)}
				<Icon iconName='IconX' sx={{ cursor: 'pointer', marginLeft: 'auto' }} onClick={close} />
			</Grid>
		);
	};

	const handle_default_value = () => {
		if (show_address_sheet_detail.is_shipping_type) {
			const shipping_data = _.filter(all_address, (item: any) => item?.status !== 'archived' && item?.type === 'shipping');
			return shipping_data?.length === 0 ? true : selected_value?.id === primary_address_id;
		} else {
			const billing_data = _.filter(all_address, (item: any) => item?.status !== 'archived' && item?.type === 'billing');
			return billing_data?.length === 0 ? true : selected_value?.id === primary_address_id;
		}
	};

	const handle_disable = () => {
		if (show_address_sheet_detail?.is_shipping_type) {
			const shipping_data = _.filter(all_address, (item: any) => item?.status !== 'archived' && item?.type === 'shipping');
			return shipping_data?.length === 0 ? true : selected_value?.id === primary_address_id;
		} else {
			const billing_data = _.filter(all_address, (item: any) => item?.status !== 'archived' && item?.type === 'billing');
			return billing_data?.length === 0 ? true : selected_value?.id === primary_address_id;
		}
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Box style={{ visibility: show_primary ? 'visible' : 'hidden' }}>
					<FormProvider {...methods}>
						<CheckboxEditField
							name={'is_primary'}
							defaultValue={handle_default_value()}
							checkbox_value={true}
							label='Set as default'
							disabled={handle_disable()}
						/>
					</FormProvider>
				</Box>

				<Grid mt={1} className='checkbox-container'>
					{address_delete_permission && show_delete && (
						<Button disabled={handle_drawer_disable()} onClick={handle_cancel_delete} sx={{ marginRight: '1rem' }} variant='outlined'>
							{_.isEmpty(selected_value) ? 'Cancel' : 'Delete'}
						</Button>
					)}
					{!show_delete && (
						<Button onClick={() => close()} sx={{ marginRight: '1rem' }} variant='outlined'>
							Cancel
						</Button>
					)}
					<Button disabled={!_.isEmpty(errors) ? true : false} onClick={handleSubmit(handle_confirm)} type='submit' loading={btn_loading}>
						{_.isEmpty(selected_value) || !show_delete ? 'Save' : 'Update'}
					</Button>
				</Grid>
			</Grid>
		);
	};

	const handle_get_type = (name: any, attribute: any) => {
		if (name === 'phone' && attribute?.type !== 'phone_e164') {
			return 'phone';
		} else if (attribute?.id === 'street_address') {
			return 'location';
		} else {
			return attribute?.type;
		}
	};

	const handle_get_default_value = (attribute: any, name: string) => {
		if (!attribute?.auto_increment || edit_mode || name !== 'first_name') {
			return attribute?.value || watch(name);
		}

		if (attribute?.auto_increment) {
			const type = show_address_sheet_detail.is_shipping_type ? 'shipping' : 'billing';
			const length = show_address_sheet_detail.is_shipping_type ? shipping_length + 1 : billing_length + 1;
			return `${type} #${length}`;
		}
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body' sx={{ paddingTop: '0.5rem' }}>
				<Grid>
					<Grid container width={0} height={0} sx={{ visibility: 'hidden' }}>
						<FormBuilder
							placeholder='id'
							label='id'
							name='id'
							validations={{ required: validate_field_id }}
							defaultValue={_.isEmpty(selected_value) ? distinct_id : selected_value?.id}
							type='text'
							inputProps={{ height: 0 }}
						/>
						<FormBuilder
							placeholder='type'
							label='type'
							name='type'
							validations={{ required: true }}
							defaultValue={show_address_sheet_detail?.is_shipping_type ? 'shipping' : 'billing'}
							type='text'
							inputProps={{ height: 0 }}
						/>
					</Grid>
					<Grid>
						{_.filter(sorted_data, (att: any) => isUUID(att?.id) || att?.is_display !== false).map((attribute: any, i: any) => {
							const name = `${attribute?.id}`;
							const address_type = show_address_sheet_detail?.is_shipping_type ? 'shipping' : 'billing';
							const is_display_exclusion_type = _.some(attribute?.is_display_exclusion_type, (val) => val === address_type);
							const required_exclusion_type = _.some(attribute?.required_exclusion_type, (val) => val === address_type) ?? true;
							if (
								name === 'is_default_billing_address' ||
								name === 'is_default_shipping_address' ||
								name === 'country_code' ||
								name === 'type'
							) {
								return <></>;
							}

							if (is_display_exclusion_type) return <></>;

							if (name === 'country') {
								return (
									<Grid key={`${attribute?.name}-${i}`} mb={2.5}>
										<FormBuilder
											placeholder={attribute?.name}
											label={attribute?.name}
											name={name}
											validations={{
												required: Boolean(attribute.required) && !required_exclusion_type,
												number: attribute.type === 'number',
												email: attribute.id === 'email' || attribute.type === 'email',
												phone: attribute.id === 'phone' || attribute.type === 'phone',
												pincode: attribute?.type === 'text' && attribute.id === 'pincode',
												...attribute?.validations,
											}}
											defaultValue={selected_value?.[attribute?.id] || attribute?.value || 'usa'}
											disabled={attribute?.disabled}
											show_copy_drawer={show_sheet}
											type={attribute?.type === 'email' ? 'text' : attribute?.type}
											options={attribute?.options}
											checkbox_value={true}
											control={control}
											register={methods.register}
											getValues={getValues}
											setValue={setValue}
										/>
									</Grid>
								);
							}

							if (attribute.id === 'street_address') {
								return (
									<Grid key={`${attribute?.name}-${i}`}>
										<LocationSearch
											placeholder={attribute?.name}
											label={attribute?.name}
											name={name}
											validations={{
												required: Boolean(attribute.required) && !required_exclusion_type,
												number: attribute?.type === 'number',
												email: attribute?.type === 'email',
												...attribute?.validations,
											}}
											disabled={attribute.disabled}
											edit_buyer_id={edit_buyer_id || street_address}
											show_copy_drawer={show_sheet}
											handle_selected_place={handle_selected_place}
											getValues={getValues}
											field_data={sorted_data}
										/>
									</Grid>
								);
							}

							return (
								<Grid key={`${attribute?.name}-${i}`} mb={2.5}>
									<FormBuilder
										placeholder={attribute?.name}
										label={attribute?.name}
										name={name}
										validations={{
											required: Boolean(attribute.required) && !required_exclusion_type,
											number: attribute.type === 'number',
											email: attribute.id === 'email' || attribute.type === 'email',
											phone: attribute.id === 'phone' || attribute.type === 'phone',
											...attribute?.validations,
										}}
										autoFocus={name === 'first_name' && true}
										defaultValue={handle_get_default_value(attribute, name)}
										show_copy_drawer={show_sheet}
										type={handle_get_type(name, attribute)}
										options={attribute?.options}
										disabled={attribute?.disabled}
										checkbox_value={true}
										control={control}
										is_edit_mode={edit_mode}
										register={methods.register}
										getValues={getValues}
										is_unique={attribute?.is_unique}
										on_blur={(value: string, is_unique?: boolean) => handle_check_duplicate(name, value, is_unique)}
										setValue={setValue}
									/>
								</Grid>
							);
						})}
					</Grid>
				</Grid>
			</Grid>
		);
	};

	const handle_render_drawer = () => {
		return (
			<Grid className='drawer-container'>
				{handle_render_header()}
				<Divider className='drawer-divider' />
				<FormProvider {...methods}>
					{handle_render_drawer_content()}
					{extra_fields}
				</FormProvider>
				<Divider className='drawer-divider' />
				{handle_render_footer()}
			</Grid>
		);
	};

	const handle_delete_address = () => {
		delete_address(show_address_sheet_detail.index);
		close();
	};

	const address_data = _.filter(all_address, (item: any) => item.status !== 'archived');

	return (
		<React.Fragment>
			<Drawer open={show_address_sheet_detail?.is_open} onClose={close} content={handle_render_drawer()} />;
			<CopyAddressDrawer
				is_visible={show_sheet}
				close={handle_copy_sheet_close}
				all_address={address_data}
				address_type={show_address_sheet_detail?.is_shipping_type}
				primary_address_id={primary_address_id}
				handle_copied_address={handle_copied_address}
				buyer_fields={buyer_fields}
			/>
			<Modal
				open={show_modal}
				onClose={() => set_show_modal(false)}
				title={'Delete address'}
				footer={
					<Grid container justifyContent='flex-end' gap={2}>
						<Button variant='outlined' onClick={() => set_show_modal(false)}>
							Cancel
						</Button>
						<Button onClick={handle_delete_address}>Delete</Button>
					</Grid>
				}
				children={<CustomText type='Body'>Are you sure, want to delete address ?</CustomText>}
			/>
		</React.Fragment>
	);
};

const AddAddressDrawer = (props: any) => {
	const { show_address_sheet_detail } = props;
	if (!show_address_sheet_detail.is_open) {
		return null;
	}

	return <AddAddressComp {...props} />;
};

export default AddAddressDrawer;
