import _ from 'lodash';
import { SECTIONS } from 'src/screens/BuyerLibrary/constants';
import { CARD_URLS } from 'src/utils/common';

export const handle_on_submit = (
	data: any,
	buyer_fields: any,
	setError: (params: any, obj: any) => any,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	set_show_toast: (obj: any) => any,
	payment_gateway = 'stax',
) => {
	let is_valid: boolean = true;
	let payload: any = {};
	const { tax_rate, is_taxable } = data;
	const taxable_rate = _.toNumber(tax_rate);
	const basic_details_section = _.find(buyer_fields?.sections, { key: SECTIONS.basic_details });
	const contact_section = _.find(buyer_fields?.sections, { key: SECTIONS.contact });
	const payment_section = _.find(buyer_fields?.sections, { key: SECTIONS.payment_methods });
	const address_section = _.find(buyer_fields?.sections, { key: SECTIONS.address });
	const tax_section = _.find(buyer_fields?.sections, { key: SECTIONS.tax_section });
	const preferences_section = _.find(buyer_fields?.sections, { key: SECTIONS.preferences });
	const wizshop_users = _.find(buyer_fields?.sections, { key: SECTIONS.wizshop_users });

	const tax_preferences = is_taxable ? { tax_rate: taxable_rate, is_taxable } : { is_taxable, tax_rate: 0 };

	const user_basic_preferences_section = [basic_details_section, tax_preferences, preferences_section];
	const user_info_section = [
		{ min_info_data: 1, ...contact_section },
		{ min_info_data: 2, ...address_section },
		{ min_info_data: 0, ...payment_section },
	];

	//basic details and preferences
	user_basic_preferences_section?.forEach((item) => {
		const obj: any = {};

		item?.attributes?.forEach((attr: any) => {
			const attr_id: any = attr?.id;
			let data_value: any;
			if (!_.isEmpty(data[attr_id])) {
				data_value = data[attr_id];
			}

			if (attr_id && data_value) {
				obj[attr_id] = attr?.type === 'multi_select' && Array.isArray(data_value) ? data_value?.join(',') : data_value;
			}
		});

		if (!_.isEmpty(obj)) {
			payload[item?.key] = obj;
		}
	});

	//contact and address
	user_info_section?.forEach((item) => {
		let obj: any = {};
		const attr_key = item?.key;
		const attr_name = item?.name;
		const data_value = data[attr_key];
		const required = item?.required;
		const min = item?.min_info_data;
		const is_billing_required = !_.some(item?.required_exclusion_type, (val) => val === 'billing');
		const is_shipping_required = !_.some(item?.required_exclusion_type, (val) => val === 'shipping');

		if (attr_key && data_value) {
			if (!_.isEmpty(data_value?.values)) {
				obj[attr_key] = data_value;
			}
			if (attr_key === 'payment_methods') {
				if (payment_gateway === 'stax') {
					if (!_.isEmpty(data_value?.customer_id)) obj[attr_key] = data_value;
				} else {
					obj[attr_key] = data_value;
				}
			} else if (required && attr_key === 'addresses') {
				const billing_data = _.filter(data_value?.values, (val) => val?.type === 'billing');
				const shipping_data = _.filter(data_value?.values, (val) => val?.type === 'shipping');

				if (is_billing_required && _.isEmpty(billing_data)) {
					setError('billing', {
						type: 'required',
						message: 'Billing Address is required',
					});
					is_valid = false;
				}

				if (is_shipping_required && _.isEmpty(shipping_data)) {
					setError('shipping', {
						type: 'required',
						message: 'Shipping Address is required',
					});
					is_valid = false;
				}

				// const filtered_item = _.filter(data_value?.values, (ele) => ele.status !== 'archived');
				// if (filtered_item) {
				// 	debugger;
				// 	set_show_toast({ state: true, title: 'Some fields are empty', sub_title: '' });
				// 	is_valid = false;
				// 	return;
				// }
			} else if ((_.isEmpty(data_value?.values) || data_value?.values?.length < min) && required) {
				setError(attr_key, {
					type: 'required',
					message: `${attr_name} is required`,
				});
				is_valid = false;
			}

			if (!_.isEmpty(obj)) {
				if (attr_key === 'addresses') {
					data_value.default_shipping_address = data_value.default_shipping_address || '';
					data_value.default_billing_address = data_value.default_billing_address || '';
				}
				data_value.values = _.map(data_value?.values, (val: any) =>
					_.mapValues(val, (value) => {
						return _.isArray(value) ? _.join(value, ',') : value;
					}),
				);
				payload[attr_key] = { ...data_value };
			}
			if (tax_section) {
				payload = {
					...payload,
					tax_preferences,
				};
			}
		}
	});

	//wizshop users
	if (wizshop_users) {
		payload = {
			...payload,
			wizshop_users: {
				values: data?.wizshop_users?.values || [],
			},
		};
	}

	return { payload, is_valid };
};

const get_specific_address_actions = (section: any, type: any) => {
	if (type === 'billing') {
		return section?.billing_allowed_actions;
	} else {
		return section?.shipping_allowed_actions;
	}
};

export const get_permission = (section: any, edit_buyer_id?: any, address_type?: string) => {
	const actions = address_type ? get_specific_address_actions(section, address_type) : section?.allowed_actions;
	if (!actions) {
		return {
			is_add: true,
			is_edit: true,
			is_delete: true,
		};
	}
	const add_permission: any = _.includes(actions, 'ADD');
	const edit_permission: any = _.includes(actions, 'EDIT');
	const delete_permission: any = _.includes(actions, 'DELETE');
	return {
		is_add: add_permission ?? false,
		is_edit: edit_permission ?? false,
		is_delete: delete_permission ?? false,
	};
};

export const transform_form_data = (response: any) => {
	return {
		payment_method_type: 'card',
		payment_method_id: response?.id,
		title: `Ending in ${response?.last_four_digits}`,
		sub_title: `Expiry ${response?.card_exp}`,
		logo: CARD_URLS[response?.card_scheme],
		card_type: response?.card_scheme,
		is_default: true,
		is_selected: true,
		card_name: response?.person_name,
		address_1: response?.address_1,
		address_2: response?.address_2,
		city: response?.address_city,
		state: response?.address_state,
		zip: response?.address_zip,
		country: response?.address_country,
		country_label: response?.country_label,
		state_label: response?.state_label,
	};
};

export const transform_pci_form_data = (response: any) => {
	return {
		title: `Ending in ${response?.last_four}`,
		sub_title: `Expiry ${response?.expiry}`,
		logo: CARD_URLS?.[response?.card_type],
		card_type: response?.card_type,
	};
};

export const get_company_name_attr = (buyer_fields: any) => {
	const basic_details_section = _.find(buyer_fields?.sections, { key: SECTIONS.basic_details });
	return basic_details_section ? _.find(basic_details_section?.attributes, { id: 'company_name' }) : undefined;
};

export const get_retrieved_card_data = async (payload: any) => {
	try {
		const response = await fetch(
			`${import.meta.env.VITE_APP_PCI_VAULT_BASE_URL}/retrieve/${payload?.retrieve_reference}?token=${payload?.external_id}&reference=${
				payload?.external_customer_id
			}`,
			{
				method: 'GET',
				headers: {
					'X-PCIVault-Retrieve-Secret': payload?.retrieve_secret,
				},
			},
		);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error(error);
	}
};
