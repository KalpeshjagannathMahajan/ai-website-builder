import _ from 'lodash';
import dayjs from 'dayjs';
import i18next from 'i18next';
import { CHARGE_TYPE, CHARGE_VALUE_TYPES, DOC_SYNC_TYPES, DOCUMENT_ENTITY_SOURCES, DOCUMENT_LEVEL_ATTRS_KEY_MAP } from '../constants';
import store from 'src/store';
import { allValuesEmpty, get_customer_metadata } from 'src/utils/utils';
import ImageLinks from 'src/assets/images/ImageLinks';
import { DocSyncConfig } from '../component/Common/TagHeader';
import { DocumentEntity } from 'src/@types/common_types';
import cart_management from 'src/utils/api_requests/cartManagement';
import order_listing from 'src/utils/api_requests/orderListing';
import { Mixpanel } from 'src/mixpanel';
import Events from 'src/utils/events_constants';

export const get_cart_summary = (cart_total: number, charges: any) => {
	let total_amount_without_charges = cart_total;
	let total_amount_with_discount = total_amount_without_charges;

	_.map(charges, (charge) => {
		const { charge_type, value_type, value } = charge;
		switch (charge_type) {
			case CHARGE_TYPE.discount:
				if (value_type === CHARGE_VALUE_TYPES.percentage) {
					total_amount_with_discount -= (total_amount_without_charges * value) / 100;
					return;
				}

				total_amount_with_discount -= value;
				break;

			default:
				break;
		}
	});

	let total_amount_with_taxes = total_amount_with_discount;

	_.map(charges, (charge) => {
		const { charge_type, value_type, value } = charge;
		switch (charge_type) {
			case CHARGE_TYPE.tax:
				const base_value = store.getState()?.configSettings?.cart_checkout_config?.charge_pre_discount
					? total_amount_without_charges
					: total_amount_with_discount;
				if (value_type === CHARGE_VALUE_TYPES.percentage) {
					total_amount_with_taxes += (base_value * value) / 100;
					return;
				}

				total_amount_with_taxes += value;
				break;

			default:
				break;
		}
	});

	return {
		total_amount_without_charges,
		total_amount_with_charges: total_amount_with_taxes,
		total_amount_with_discount,
	};
};

export const check_dynamic_attributes = (attributes: any) => _.some(attributes, (attr: any) => attr?.dynamic_attribute) || false;

export const get_transformed_form_attrs = (section_data: any, attribute_data: any) => {
	const updated_attributes = _.sortBy(section_data?.attributes, ['priority'])?.map((attribute) =>
		_.assign({}, attribute, {
			key: attribute.name,
			dType: attribute?.type,
			value: attribute_data[attribute?.id] ?? attribute?.value,
		}),
	);
	const updated_data = _.assign({}, section_data, { attributes: updated_attributes });
	return updated_data;
};

export const handle_check_mandatory = (props_data: any, attribute_data: any) => {
	const payload_keys = props_data?.attributes?.reduce((acc: any, attr: any) => {
		if (attr?.required) {
			acc[attr?.id] = attribute_data[attr.id];
		}
		return acc;
	}, {});
	return !_.isEmpty(payload_keys) && allValuesEmpty(payload_keys);
};

export const generate_document_msg = (person: string, action: string, doc_type: string, date: string) => {
	if (!date || !person) return null;
	return i18next.t('OrderManagement.SalesRepDetailsSection.DocCreatedUpdatedMessage', { person, action, doc_type, date });
};

export const get_default_values = (_data: any, attr_data: any, use_attr_id: boolean = false) => {
	const default_values: any = {};
	_data?.forEach((attr: any) => {
		if (!attr?.view_only) {
			const key_to_map = use_attr_id ? attr?.id : attr?.name;
			default_values[key_to_map] = attr.type === 'date' ? dayjs(attr_data[attr?.id]) : attr_data[attr?.id] || attr?.value || '';
		}
	});
	return default_values;
};

export const get_entity_img_src = (entity_src: string) => {
	switch (entity_src) {
		case DOCUMENT_ENTITY_SOURCES.SHOPIFY:
			return ImageLinks.shopify_icon;
		case DOCUMENT_ENTITY_SOURCES.ZOHO:
			return ImageLinks.zoho_logo;
		case DOCUMENT_ENTITY_SOURCES.SOS_INVENTORY:
			return ImageLinks.sos_inventory_logo;
		default:
			return undefined;
	}
};
export const get_payload_by_sync_type = (document_id: string, tenant_id: string, sync_type: string) => {
	if (!document_id || !sync_type) return;
	const payload = {
		[DOC_SYNC_TYPES.PUSH]: {
			before: {},
			after: {
				id: document_id,
				tenant_id,
			},
		},
		[DOC_SYNC_TYPES.PULL]: {
			document_id,
		},
	};
	return payload[sync_type];
};

export const check_doc_sync_enabled = (tenant_settings: Record<string, any>, DOC_SYNC_CONFIG_KEYS: DocSyncConfig[]): boolean => {
	return DOC_SYNC_CONFIG_KEYS.some((item: DocSyncConfig) => _.get(tenant_settings, item.key, false) === true);
};

export const is_doc_level_attribute = (entity_data: DocumentEntity) => {
	return _.get(entity_data, DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_VALUE_KEY);
};

export const get_active_tab_info = (tabs: any, active_tab: string) => {
	return _.reduce(
		tabs,
		(acc, tab, index): any => {
			if (tab?.value === active_tab) {
				return { tab, index };
			}
			return acc;
		},
		{ tab: null, index: -1 },
	);
};

export const calculateDaysDifference = (timestamp: Date) => {
	const currentTime: any = new Date(); // Get the current date and time
	const givenTime: any = new Date(timestamp); // Convert the timestamp into a Date object
	const timeDifference: number = currentTime - givenTime;
	const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
	return daysDifference;
};

export const customer_info_data: any[] = [
	{
		id: 'user_email',
		icon: 'IconMail',
		information: [
			{
				label: 'Email ID',
				value: 'website_user_email',
				style: { maxWidth: '30ch', color: '#4F555E' },
			},
		],
	},
	{
		id: 'user_phone',
		icon: 'IconPhone',
		information: [
			{
				label: 'Phone Number',
				value: 'website_user_phone',
				style: { maxWidth: '22ch', color: '#4F555E' },
			},
		],
	},
];

export const get_duration = (created_at_milliseconds: number) => {
	const createdAt = new Date(created_at_milliseconds);
	const now = new Date();
	const differenceInMilliseconds = now.getTime() - createdAt.getTime();
	const formattedDate = `${createdAt.getMonth() + 1}/${createdAt.getDate()}/${createdAt.getFullYear()}`;
	const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
	const hours = Math.floor(differenceInSeconds / 3600);
	const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));

	return {
		days: differenceInDays,
		date: formattedDate,
		hours,
	};
};

export const get_sales_rep_cart = async (data: any, set_is_sales_rep_cart: any, set_sales_rep_id: any) => {
	const sales_rep_cart: any = await cart_management.get_cart({
		buyer_id: data?.customer_id,
		is_guest_buyer: false,
	});
	set_sales_rep_id(sales_rep_cart?.data?.[0]?.id);
	const cart_details: any = await cart_management.get_cart_details({ cart_id: sales_rep_cart?.data?.[0]?.id, is_guest_buyer: false });
	if (_.values(cart_details?.cart?.products).length > 0) {
		set_is_sales_rep_cart(true);
	}
};

export const get_cart_data = async (cart_data_id: any, website_user_id: any, set_cart_data: any) => {
	const cart_details_response: any = await cart_management.get_cart_details({
		cart_id: cart_data_id,
		reference_user_id: website_user_id,
	});
	if (cart_details_response?.status === 200) {
		set_cart_data(cart_details_response?.cart);
	}
};

export const handle_update_data = async (
	payload: any,
	set_comment_data: any,
	set_comment_modal: any,
	set_loading: any,
	set_is_abandoned_changed_to_view: any,
	updated_at_milliseconds: any,
	set_handle_abandoned_cart_drawer_view: any,
	data_key?: string,
) => {
	set_loading(true);
	try {
		const response: any = await order_listing.update_abandoned_cart_data(payload);

		if (response?.status === 200) {
			if (payload?.update_key !== 'status') {
				set_comment_data(payload?.update_value);
			} else {
				set_is_abandoned_changed_to_view({ id: payload?.abandoned_cart_id, updated_at_milliseconds });
				set_handle_abandoned_cart_drawer_view('viewed');
				Mixpanel.track(Events.ABANDONED_CART_MARKED_VIEWED, {
					tab_name: 'abandoned cart',
					page_name: 'abandoned_cart_page',
					section_name: 'Sales',
					subtab_name: '',
					customer_metadata: get_customer_metadata({ is_loggedin: true }),
					status: 'viewed',
				});
			}
			if (data_key === 'comment') {
				set_comment_modal({ show: false, is_edit: false });
				Mixpanel.track(Events.ABANDONED_CART_ADD_EDIT_COMMENT, {
					tab_name: 'abandoned cart',
					page_name: 'abandoned_cart_page',
					section_name: 'Sales',
					subtab_name: '',
					customer_metadata: get_customer_metadata({ is_loggedin: true }),
					comment: payload?.update_value || '',
				});
			}
		}
	} catch (err) {
		console.error(err);
	} finally {
		set_loading(false);
	}
};

export const get_random_color = () => {
	const dummyArray = [
		{ background: '#EFB79F', color: '#AE3500' },
		{ background: '#F9DFAC', color: '#CE921E' },
		{ background: '#C4DBFF', color: '#4578C4' },
	];
	const x = Math.floor(Math.random() * dummyArray.length);
	return dummyArray[x];
};
