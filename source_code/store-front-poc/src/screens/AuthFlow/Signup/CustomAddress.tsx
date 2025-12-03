/* eslint-disable */
import _ from 'lodash';
import { useState } from 'react';
// import { useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Checkbox, Grid } from 'src/common/@the-source/atoms';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import LocationSearch from 'src/common/LocationSearch';
import { SECTIONS } from 'src/screens/BuyerLibrary/constants';
import { isUUID } from 'src/screens/Settings/utils/helper';

interface Props {
	show_address_sheet_detail: any;
	all_address: [];
	buyer_fields: any;
	// selected_value?: any;
	edit_buyer_id?: any;
	edit_mode?: any;
	type?: any;
	setValue?: any;
	getValues?: any;
	methods?: any;
	watch?: any;
	reset?: any;
}

const AddAddressComp = ({
	all_address,
	// selected_value,
	buyer_fields,
	show_address_sheet_detail,

	edit_buyer_id,
	edit_mode,
	type,
	setValue,
	getValues,
	methods,
	watch,
	reset,
}: Props) => {
	let addresses_object = buyer_fields;
	let source = _.get(addresses_object, SECTIONS?.address, [])?.[0];

	const billing_length = _.filter(all_address, { type: 'billing' }).length;
	const shipping_length = _.filter(all_address, { type: 'shipping' }).length;

	const sorted_data = _.sortBy(source?.attributes, 'priority') || [];
	const [check, set_check] = useState(false);
	// const [distinct_id, set_distinct_id] = useState(`temp_${crypto.randomUUID()}`);

	// const methods = useForm({
	// 	defaultValues: {
	// 		...selected_value,
	// 	},
	// });

	// const {
	// 	handleSubmit,
	// 	reset,
	// 	control,

	// 	formState: { errors },
	// } = methods;

	let street_address = getValues()?.street_address;

	const handle_selected_place = (data: any, address_type: string) => {
		setValue(`${address_type}.city`, data?.city);
		setValue(`${address_type}.pincode`, data?.zip_code);
		setValue(`${address_type}.state`, data?.state?.key || data?.state);
		setValue(`${address_type}.street_address`, data?.street_address);
		setValue(`${address_type}.address_line_2`, data?.address_2);
	};

	const handle_copied_address = () => {
		set_check((prev) => !prev);
		if (!check) {
			const _address = _.cloneDeep(getValues()?.billing_address);
			setValue('shipping_address', _address);
		}
	};
	// const _address = _.cloneDeep(getValues()?.billing_address);
	// reset(_address);

	// const handle_check_duplicate = (name: any, value: any, is_unique?: boolean) => {
	// 	if (is_unique) {
	// 		const filtered_data = selected_value ? all_address?.filter((item: any) => item?.id !== selected_value?.id) : all_address;
	// 		const is_duplicate = filtered_data?.some((ele) => ele[name] === value);
	// 		if (is_duplicate) {
	// 			setError(name, { type: 'custom', message: 'This address name already exists' });
	// 		} else {
	// 			clearErrors(name);
	// 		}
	// 	}
	// };

	const handle_get_type = (name: any, attribute: any) => {
		if (name === 'phone') {
			return 'phone';
		} else if (attribute?.id === 'street_address') {
			return 'location';
		} else if (attribute?.type === 'email') {
			return 'text';
		} else {
			return attribute?.type;
		}
	};

	// const handle_get_default_value = (attribute: any, name: string) => {
	// 	if (!attribute?.auto_increment || edit_mode || name !== 'first_name') {
	// 		return attribute?.value || ' ';
	// 	}

	// 	if (attribute?.auto_increment) {
	// 		const type = show_address_sheet_detail.is_shipping_type ? 'shipping' : 'billing';
	// 		const length = show_address_sheet_detail.is_shipping_type ? shipping_length + 1 : billing_length + 1;
	// 		return `${type} #${length}`;
	// 	}
	// };

	const handle_render_content = (address_type: any) => {
		return (
			<Grid>
				{/* <FormProvider {...methods}> */}
				<Grid>
					{/* <Grid sx={{ visibility: 'hidden' }}>
							<FormBuilder
								placeholder='id'
								label='id'
								name='id'
								validations={{ required: true }}
								defaultValue={_.isEmpty(selected_value) ? distinct_id : selected_value?.id}
								type='text'
								// inputProps={{ height: 0 }}
							/>
							<FormBuilder
								placeholder='type'
								label='type'
								name='type'
								validations={{ required: true }}
								defaultValue={show_address_sheet_detail?.is_shipping_type ? 'shipping' : 'billing'}
								type='text'
								// inputProps={{ height: 0 }}
							/>
						</Grid> */}
					<Grid>
						{_.filter(sorted_data, (att: any) => isUUID(att?.id) || att?.is_display !== false).map((attribute: any, i: any) => {
							const name = `${attribute?.id}`;
							if (
								name === 'is_default_billing_address' ||
								name === 'is_default_shipping_address' ||
								name === 'country_code' ||
								name === 'type'
							) {
								return;
							}
							const all_address = watch();
							if (name === 'country') {
								return (
									<Grid key={`${attribute?.name}-${i}`} mb={2.5}>
										<FormBuilder
											placeholder={attribute?.name}
											label={attribute?.name}
											name={`${address_type}.${attribute?.id}`}
											validations={{
												required: Boolean(attribute.required),
												number: attribute.type === 'number',
												email: attribute.id === 'email' || attribute.type === 'email',
												phone: attribute.id === 'phone' || attribute.type === 'phone',
											}}
											// style={{
											// 	marginTop: i === 0 && 5,
											// }}
											defaultValue={attribute?.value || 'usa'}
											disabled={attribute?.disabled}
											type={attribute?.type === 'email' ? 'text' : attribute?.type}
											options={attribute?.options}
											checkbox_value={true}
											// control={control}
											register={methods.register}
											getValues={getValues}
											setValue={setValue}
										/>
									</Grid>
								);
							}

							if (attribute.id === 'street_address') {
								return (
									<Grid key={`${attribute?.name}-${i}`} mb={2.5}>
										<LocationSearch
											placeholder={attribute?.name}
											label={attribute?.name}
											name={`${address_type}.${attribute?.id}`}
											validations={{
												required: Boolean(attribute.required),
												number: attribute?.type === 'number',
												email: attribute?.type === 'email',
											}}
											// disabled={attribute?.disabled ?? false}

											edit_buyer_id={edit_buyer_id || street_address}
											handle_selected_place={(data) => handle_selected_place(data, address_type)}
											getValues={getValues}
											// setValue={setValue}
											field_data={sorted_data}
											allow_check_box={check}
										/>
									</Grid>
								);
							}
							return (
								<Grid key={`${attribute?.name}-${i}`} mb={2.5}>
									<FormBuilder
										placeholder={attribute?.name}
										label={attribute?.name}
										name={`${address_type}.${attribute?.id}`}
										validations={{
											required: Boolean(attribute.required),
											number: attribute.type === 'number',
											email: attribute.id === 'email' || attribute.type === 'email',
											phone: attribute.id === 'phone' || attribute.type === 'phone',
										}}
										// style={{
										// 	marginTop: i === 0 && 5,
										// }}
										autoFocus={name === 'first_name' && true}
										defaultValue={all_address?.[address_type]?.[attribute?.id]}
										type={handle_get_type(name, attribute)}
										options={attribute?.options}
										disabled={attribute?.disabled}
										checkbox_value={true}
										is_edit_mode={edit_mode}
										register={methods.register}
										getValues={getValues}
										is_unique={attribute?.is_unique}
										// on_blur={(value: string, is_unique?: boolean) => handle_check_duplicate(name, value, is_unique)}
										setValue={setValue}
										allow_check_box={check}
									/>
								</Grid>
							);
						})}
					</Grid>
				</Grid>
				{/* </FormProvider> */}
			</Grid>
		);
	};

	// const address_data = _.filter(all_address, (item: any) => item.status !== 'archived');

	return (
		<Grid>
			{type === 'shipping_address' && (
				<Grid display={'flex'} alignItems={'center'} style={{ padding: '0 0 10px 0' }}>
					<Checkbox checked={check} disabled={false} onChange={handle_copied_address} />
					<CustomText type='Body2'>Autofill shipping address</CustomText>
				</Grid>
			)}
			<CustomText type='H2' style={{ padding: '0 0 24px 0' }}>
				{type === 'shipping_address' ? 'Shipping address' : 'Billing address'}
			</CustomText>
			{handle_render_content(type)}
		</Grid>
	);
};

const CustomAddress = (props: any) => {
	return <AddAddressComp {...props} />;
};

export default CustomAddress;
