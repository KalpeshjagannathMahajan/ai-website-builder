import { PERMISSIONS } from 'src/casl/permissions';

const SECTIONS: any = {
	basic_details: 'basic_details',
	address: 'addresses',
	contact: 'contacts',
	tax_section: 'tax_preferences',
	payment_methods: 'payment_methods',
	preferences: 'preferences',
	other_details: 'other_details',
	wizshop_users: 'wizshop_users',
	leads: 'leads',
	buyer_list: 'buyer_list',
};

const STOREFRONT_SECTIONS: any = ['addresses', 'payment_methods', 'preferences'];
const PAYMENT_METHODS = {
	ACH: 'ACH',
	CARD: 'CARD',
};

export const ACH_EDIT_FORM_FIELDS = [
	{
		id: 'title',
		name: 'title',
		label: 'Full Name',
		type: 'text',
		value: '',
		priority: 0,
		required: true,
		disabled: true,
	},
	{
		id: 'sub_title',
		name: 'sub_title',
		label: 'Bank Account Number',
		type: 'text',
		value: '***',
		priority: 1,
		required: true,
		disabled: true,
	},
	{
		id: 'bank_code',
		name: 'bank_code',
		label: 'Bank Code',
		type: 'text',
		value: '***',
		priority: 2,
		required: true,
		disabled: true,
	},
	{
		id: 'bank_account_type',
		name: 'bank_account_type',
		label: 'Account Type',
		type: 'text',
		value: '***',
		priority: 3,
		required: true,
		disabled: true,
	},
	{
		id: 'country',
		name: 'country',
		label: 'Country',
		type: 'text',
		value: '******',
		priority: 4,
		required: true,
		disabled: true,
	},
];

const DEFAULT_BILLING_ADDRESS = 'is_default_billing_address';
const DEFAULT_SHIPPING_ADDRESS = 'is_default_shipping_address';
const ASSIGNED_CONTACT = 'assigned_contact';

export { SECTIONS, DEFAULT_BILLING_ADDRESS, DEFAULT_SHIPPING_ADDRESS, ASSIGNED_CONTACT, STOREFRONT_SECTIONS, PAYMENT_METHODS };

export const ALL_TABS: any = [
	{
		value: 'buyer_list',
		label: 'Customers',
		permission: {
			slug: PERMISSIONS.view_buyers.slug,
			type: PERMISSIONS.view_buyers.permissionType,
		},
	},
	{
		value: 'leads',
		label: 'Leads',
		permission: {
			slug: PERMISSIONS.view_wizshop_user.slug,
			type: PERMISSIONS.view_wizshop_user.permissionType,
		},
	},
	{
		value: 'wizshop_users',
		label: 'Website users',
		permission: {
			slug: PERMISSIONS.view_wizshop_user.slug,
			type: PERMISSIONS.view_wizshop_user.permissionType,
		},
	},
];
