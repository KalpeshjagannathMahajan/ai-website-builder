import { DETAILS_BUYER_FORM } from './defaultSettings/buyer/details_buyer_form';
import { DOCUMENT_FILTER_CONFIG } from './defaultSettings/order/document_filter_config';
import { DOCUMENT_REVIEWS_PAGE_CART_SUMMARY } from './defaultSettings/order/document_review_page_cart_summary';
import { DOCUMENT_SSRM_SETTINGS } from './defaultSettings/order/document_ssrm_settings';
import { ORDER_AUTO_FILL_SETTINGS } from './defaultSettings/order/order_auto_fill_settings';
import { ORDER_FORM_PERMISSIONS } from './defaultSettings/order/order_form_permissions';
import { ORDER_SETTINGS } from './defaultSettings/order/order_settings';
import { QUOTE_AUTO_FILL_SETTINGS } from './defaultSettings/order/quote_auto_fill_settings';
import { QUOTE_SETTINGS } from './defaultSettings/order/quote_settings';

export const DEFAULT_SETTINGS = {
	ORDER: {
		order_settings: {
			type: 'section_attribute',
			setting: ORDER_SETTINGS,
		},
		quote_settings: {
			type: 'section_attribute',
			setting: QUOTE_SETTINGS,
		},
		order_form_settings: {
			type: 'permission',
			setting: ORDER_FORM_PERMISSIONS,
		},
		quote_form_settings: {
			type: 'permission',
			setting: ORDER_FORM_PERMISSIONS,
		},
		order_auto_fill_settings: {
			type: 'mapping',
			setting: ORDER_AUTO_FILL_SETTINGS,
		},
		quote_auto_fill_settings: {
			type: 'mapping',
			setting: QUOTE_AUTO_FILL_SETTINGS,
		},
		document_review_page_cart_summary: {
			type: 'charges',
			setting: DOCUMENT_REVIEWS_PAGE_CART_SUMMARY,
		},
		document_ssrm_settings: {
			type: 'table',
			DOCUMENT_SSRM_SETTINGS,
		},
		document_filter_config: {
			type: 'filter',
			setting: DOCUMENT_FILTER_CONFIG,
		},
	},
	BUYER: {
		details_buyer_form: {
			type: 'section_attribute',
			setting: DETAILS_BUYER_FORM,
		},
		buyer_ssrm_settings: {
			type: 'table',
			setting: {},
		},
		buyer_filter_settings: {
			type: 'filter',
			setting: {},
		},
	},
};
