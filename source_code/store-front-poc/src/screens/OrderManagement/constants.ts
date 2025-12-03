import i18next from 'i18next';
import { colors } from 'src/utils/theme';
import { DocSyncConfig } from './component/Common/TagHeader';
import { document } from './mock/document';

export const CART_SUMMARY_CONSTANTS = {
	CART_TITLE: 'Cart Summary',
	CART_EDIT: 'Edit',
	CART_PRODUCTS: 'products',
};

export const STATUS_CHIP = {
	PAID_STATUS_CHIP: 'PAID',
};

export const STEPPER_CONSTANTS = {
	SHIPPING_INFO: {
		label: 'Shipping information',
		step: 0,
		key: 'shipping_info',
		priority: 1,
	},
	PAYMENT_DETAILS: {
		label: 'Payment information',
		step: 1,
		key: 'payment_info',
		priority: 2,
	},
	REVIEW: {
		label: 'Review',
		step: 2,
		key: 'review',
		priority: 3,
	},
};

export const ALL_TABS: any = {
	// all: {
	// 	value: 'all',
	// 	text: 'All',
	// 	index: 0,
	// },
	orders: {
		value: 'orders',
		text: 'Orders',
		index: 1,
	},
	quotes: {
		value: 'quotes',
		text: 'Quotes',
		index: 2,
	},
	drafts: {
		value: 'drafts',
		text: 'Drafts',
		index: 3,
	},
	invoices: {
		value: 'invoices',
		text: 'Invoices',
		index: 4,
	},
	payments: {
		value: 'payments',
		text: 'Payments',
		index: 5,
	},
	catalogs: {
		value: 'catalogs',
		text: 'Catalogs',
		index: 6,
	},
	abaondoned_cart: {
		value: 'abandoned_cart',
		text: 'Abandoned Cart',
		index: 7,
	},
};

export default ALL_TABS;

export const INVOICE_HEADER_COL = [
	{ label: 'Created on', key: 'date' },
	{ label: 'Amount', key: 'amount' },
	{ label: 'Amount received', key: 'payment_received', style: { fontWeight: 700 } },
	{ label: 'Payment due', key: 'payment_due', style: { color: '#D74C10', fontWeight: 700 } },
];

export const PAYMENT_SECTION = 'payment_section';
export const ORDER_SECTION = 'order_section';
export const TERMS_SECTION = 'terms_section';
export const OTHER_SECTION = 'other_section';

export const COLLAPSE_SECTION_TYPE = {
	ACTIVITY_SECTION: 'activity',
	SHIPMENT_SECTION: 'shipment',
	INVOICE: 'invoice',
};

export const DRAWER_CONSTANTS: any = {
	SECTIONS: {
		primary_contact: 'Change Contact',
		billing_address: 'Select Billing Address',
		shipping_address: 'Select Shipping Address',
		add_new_address: 'Add new address',
		notification_email_ids: 'Send email to',
		notes: 'Add notes',
		add_edit_payment: 'Payment methods',
	},
};

export const CHARGE_NAMES = {
	Discount: {
		name: 'Discount',
	},
	Shipping: {
		name: 'Shipping',
		priority: 0,
	},
	tax: {
		name: 'Tax',
		priority: 1,
	},
	adjustment: {
		name: 'Adjustment',
		priority: 2,
	},
	additional_charge: {
		name: 'Additional Charge',
		priority: 3,
	},
};

export const BUYER_SECTIONS = {
	basic_details: 'basic_details',
	address: 'addresses',
	contact: 'contacts',
	payment_methods: 'payment_methods',
	preferences: 'preferences',
	other_details: 'other_details',
};

export const BUYER_PREFERENCES_FIELDS = {
	payment_mode: 'payment_mode',
	payment_terms: 'payment_terms',
};

export const DOUCMENT_PREFERENCES_FIELDS = {
	payment_terms: 'payment_terms',
	payment_method: 'payment_method',
	freight_terms: 'freight_terms',
};

export const DEFAULT_BILLING_ADDRESS = 'is_default_billing_address';
export const DEFAULT_SHIPPING_ADDRESS = 'is_default_shipping_address';

export const BUYER_ADDRESS_TYPE = {
	billing: 'billing',
	shipping: 'shipping',
};

export const SPECIAL_DOCUMENT_ATTRIBUTE: any = {
	billing_address: 'billing_address',
	primary_contact: 'primary_contact',
	notification_email_ids: 'notification_email_ids',
	shipping_address: 'shipping_address',
	notes_settings: 'notes_settings',
	payment_mode: 'payment_mode',
	payment_method: 'payment_method',
	payment_terms: 'payment_terms',
	notes: 'notes',
	payment_method_v2: 'payment_method_v2',
	send_emails_on_order: 'send_emails_on_order',
	payment_section: 'payment_section',
};

export const BUYER_ADDRESS_TYPE_ATTRIBUTE_MAP = {
	[BUYER_ADDRESS_TYPE.billing]: SPECIAL_DOCUMENT_ATTRIBUTE.billing_address,
	[BUYER_ADDRESS_TYPE.shipping]: SPECIAL_DOCUMENT_ATTRIBUTE.shipping_address,
};

export const accordion_initial_state = {
	notes: 'notes',
	additional_info: 'additional_info',
	activity: 'activity',
	payment_method: 'payment_method',
	notification_email_ids: 'notification_email_ids',
	customer_consent: 'customer_consent',
	products: 'products',
};

export const CHARGE_VALUE_TYPES = {
	percentage: 'percentage',
	value: 'value',
};

export const CHARGE_TYPE = {
	discount: 'discount',
	tax: 'tax',
};

export const CHARGE_NAME = {
	discount: 'Discount',
	shipping_charges: 'Shipping',
	tax: 'Tax',
	additional_charge: 'Additional Charge',
	adjustment: 'Adjustment',
};
export const CONFIRMATION_MODAL_MESSAGE = {
	title: 'All set to proceed?',
	content: "Do you wish to add/remove any selected item from the customer's cart?",
};

export const QUOTE_SUCCESS_MESSAGE = 'Complete necessary details to submit order';
export const GO_TO_ORDER = 'go to order';
export const GROUPING_ALERT =
	'Group shown inside the cart summary can change due to updated product inventory levels. Please edit the cart to review the updated groups.';

export const DOCUMENT_END_STATUS = ['cancelled', 'expired', 'accepted', 'rejected', 'confirmed'];

export const BUYER_INFO_SECTION = ['buyer_details', 'send_emails_to', 'billing_address', 'shipping_address'];

export const NON_PAYMENT_SECTION = ['order_details', 'terms_and_conditions', 'notes'];

export const INVOICE_TAB = '/order-listing/invoice';
export const DOCUMENT_SECTION = {
	notes: 'notes',
	terms_and_conditions: 'terms_and_conditions',
	address: 'addresses',
	contact: 'contacts',
	order_details: 'order_details',
	customer_consent: 'customer_consent',
	sales_rep_details: 'sales_rep_details',
};
export const PAYMENT_METHOD_SECTION = ['payment_method_v2'];

export const BUYER_ADDRESS_FIELDS = {
	id: 'id',
	first_name: 'first_name',
	last_name: 'last_name',
	country_code: 'country_code',
	phone: 'phone',
	email: 'email',
	country: 'country',
	state: 'state',
	pincode: 'pincode',
	type: 'type',
	street_address: 'street_address',
	city: 'city',
	default_shipping_address: 'default_shipping_address',
	default_billing_address: 'default_billing_address',
	address_line_2: 'address_line_2',
};

export const DRAWER_TYPES = {
	add_edit_payment: 'add_edit_payment',
	collect_payment: 'collect_payment',
	refund_payment: 'refund_payment',
	add_credits: 'add_credits',
	auth_card: 'auth_card',
	void_auth_card: 'void_auth_card',
	notification_email_ids: 'notification_email_ids',
};

export const payment_status_arr = ['PENDING', 'PARTIALLY_PAID', 'PAID', 'PARTIALLY_REFUNDED', 'REFUNDED', 'OVERPAID'];

export const PAID_STATUS = ['PAID', 'OVERPAID'];

export const REFUND_STATUS = ['PARTIALLY_PAID', 'PAID', 'PARTIALLY_REFUNDED', 'OVERPAID'];

export const LOADING_CONSTANT = {
	loader: 'loading',
	primary_loader: 'is_primary_loading',
	secondary_loader: 'is_secondary_loading',
	download_loader: 'download_loader',
	update_document_loader: 'update_document_loader',
	apply_discount_loader: 'apply_discount_loader',
	document_change_loader: 'document_change_loader',
	edit_cart_loading: 'edit_cart_loading',
};

export const EDIT_ORDER_BUYER_CONSTANT = {
	modal_state: 'edit_order_modal_state',
	modal_type: 'edit_order_modal_type',
	payload: 'edit_order_payload',
	loader: 'edit_order_loader',
};
export const ALLOWED_EMPTY_VALUES_TYPES = ['date'];
export const SALESREP_ATTRS_VALUES_KEYS = {
	WRITTEN_FOR: 'written_for_name',
	WRITTEN_BY: 'written_by_name',
};
export const COMMON_TEXT_WRAP_STYLE_HEADER = {
	fontSize: '16px',
	fontStyle: 'normal',
	fontWeight: 400,
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	maxWidth: '82%',
};
export const ORDER_ENTITY_SRC_CONTAINER = {
	padding: '6px 15px 6px 11px',
	borderRadius: '40px',
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	border: `1px solid ${colors.dark_midnight_blue}`,
	background: 'inherit',
};
export const DOCUMENT_ENTITY_SOURCES = {
	WIZORDER: 'wizorder',
	WIZSHOP: 'wizshop',
	SHOPIFY: 'shopify',
	NETSUITE: 'netsuite',
	QUICKBOOK: 'quickbook',
	SAGE_BROOK: 'sage_brook',
	SOS_INVENTORY: 'sos_inventory',
	XORO: 'xoro',
	EPICORE_P21: 'epicore_p21',
	WOOCOMMERCE: 'woocommerce',
	FISHBOWL: 'fishbowl',
	ZOHO: 'zoho',
};
export const DOC_SYNC_CONFIG_KEYS: DocSyncConfig[] = [
	{
		key: 'integration_document_push_enabled',
		label: i18next.t('OrderManagement.OrderEndStatusInfoContainer.PushUpdates'),
		type: 'push',
	},
	{
		key: 'integration_document_resync_enabled',
		label: i18next.t('OrderManagement.OrderEndStatusInfoContainer.PullUpdates'),
		type: 'pull',
	},
];
export const DOC_SYNC_TYPES = {
	PUSH: 'push',
	PULL: 'pull',
};
export const EXPORT_DRAWER_SALES_TYPES = ['orders', 'quotes'];
export const DOCUMENT_LEVEL_ATTRS_KEY_MAP = {
	FORM_VALUE_KEY: 'for_document_only', // this key is being used to distinguish between document level addresses/contacts and buyer level addresses/contacts
	FORM_KEY: 'save_changes_to_customer',
};
export const DOCUMENT_ATTR_PERMISSION_KEYS = {
	ADD_PERMISSION: 'add_permitted',
	EDIT_PERMISSION: 'edit_permitted',
	BACK_SAVING_PERMITTED: 'back_saving_permitted',
};
export const DOC_LEVEL_ATTRS = {
	ADDRESS: 'address',
	CONTACT: 'contact',
	ADDRESSES: 'addresses',
	CONTACTS: 'contacts',
};
export const DOC_CONFIRM_ROUTES = ['confirm', 'confirmed', document.DocumentStatus.pendingApproval];
export const TOTAL_AMOUNT_DUE = ['collect_payment', 'add_credits'];
export const SYNCABLE_DOC_STATUSES = [document.DocumentStatus.confirmed, document.DocumentStatus.pendingApproval];
