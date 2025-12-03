import { styled } from '@mui/material';
import _ from 'lodash';
import { Button as MaterialButton } from 'src/common/@the-source/atoms';

export const ListGrid = styled(MaterialButton)({
	color: 'black',
	width: '100%',
	border: 0,
	textTransform: 'none',
	display: 'flex',
	justifyContent: 'flex-start',
	paddingLeft: '30px',
	fontWeight: '400 !important',
});
export const USER_MENU_ITEMS = [
	{
		title: 'General',
		id: 'general',
		is_display: true,
		children: [
			{ title: 'Company information', link: '/settings/general/company-info', id: 'company_info', is_display: true },
			{ title: 'Subscription', link: '/settings/general/subscription', id: 'subscription', is_display: false },
			{ title: 'Email Settings', link: '/settings/general/email-setting', id: 'email_setting', is_display: false },
			{ title: 'Barcode Settings', link: '/settings/general/barcode-setting', id: 'barcode_setting', is_display: false },
			{ title: 'Import Export', link: '/settings/general/import-export', id: 'import_export', is_display: false },
			{ title: 'JSON Rules', link: '/settings/general/json-rule', id: 'json_rule', is_display: false },
			{ title: 'Pricelist', link: '/settings/general/pricelist', id: 'pricelist', is_display: false },
		],
	},
	{
		title: 'Customer',
		id: 'buyer',
		is_display: false,
		children: [
			{ title: 'Customer form', link: '/settings/buyer/form', id: 'buyer_form', is_display: false },
			{ title: 'Customer permissions', link: '/settings/buyer/permission', id: 'buyer_permission', is_display: false },
			{ title: 'Listing and filters', link: '/settings/buyer/other', id: 'buyer_filters', is_display: false },
		],
	},
	{
		title: 'Order & Quote',
		id: 'order-management',
		is_display: true,
		children: [
			{ title: 'Order and quote form', link: '/settings/order-management/document', is_display: true, id: 'document_form' },
			{ title: 'Order and quote permissions', link: '/settings/order-management/permission', is_display: false, id: 'document_permission' },
			{ title: 'Order and quote charges', link: '/settings/order-management/charges', is_display: false, id: 'document_charges' },
			{ title: 'Listing and filters', link: '/settings/order-management/sales', is_display: false, id: 'order_filters' },
			{ title: 'Tags', link: '/settings/order-management/tags', is_display: true, id: 'tags' },
		],
	},
	{
		title: 'User Management',
		id: 'user-management',
		is_display: true,
		children: [{ title: 'Showroom mode', link: '/settings/user-management/showroom-mode', is_display: true, id: 'showroom_form' }],
	},
	{
		title: 'Cart',
		id: 'cart-summary',
		is_display: false,
		children: [
			{ title: 'Container Settings', link: '/settings/cart-summary/cart-container', is_display: false, id: 'cart_container' },
			{
				title: 'Grouping settings',
				link: '/settings/cart-summary/cart-grouping',
				is_display: false,
				id: 'cart_grouping',
			},
		],
	},
	{
		title: 'Templates',
		id: 'template',
		is_display: false,
		children: [
			{ title: 'Tear Sheet PDF', link: '/settings/template/tear_sheet_pdf', is_display: false, id: 'tear_sheet_pdf' },
			{ title: 'Tear Sheet Excel', link: '/settings/template/tear_sheet_excel', is_display: false, id: 'tear_sheet_excel' },
			{ title: 'Labels', link: '/settings/template/label', is_display: false, id: 'label' },
		],
	},
	{
		title: 'Product',
		id: 'product',
		is_display: false,
		children: [
			{ title: 'Product details page', link: '/settings/product/product_details', is_display: false, id: 'product_details' },
			{ title: 'Product listing page', link: '/settings/product/listing', is_display: false, id: 'product_listing' },
		],
	},
	{
		title: 'Reports',
		id: 'reporting',
		is_display: false,
		children: [{ title: 'Reports Settings', link: '/settings/reporting/reports', is_display: false, id: 'reports' }],
	},
	{
		title: 'Inventory',
		id: 'inventory',
		is_display: false,
		children: [
			{ title: 'Inventory & Cart rules', link: '/settings/inventory/inventory', is_display: false, id: 'inventory' },
			{ title: 'Inventory Display ', link: '/settings/inventory/inventory-display', is_display: false, id: 'inventory_display' },
		],
	},
	{
		title: 'Email Settings',
		id: 'email_settings',
		is_display: false,
		children: [
			{ title: 'Set reminders', link: '/settings/email-settings/set-reminders', is_display: true, id: 'set_reminders' },
			{ title: 'Email configuration', link: '/settings/email_settings/email_configuration', is_display: true, id: 'email_configuration' },
			{ title: 'External email triggers ', link: '/settings/email_settings/external_email', is_display: false, id: 'email_external_email' },
			{ title: 'Internal email triggers ', link: '/settings/email_settings/internal_email', is_display: false, id: 'email_internal_email' },
		],
	},
	{
		title: 'Other Settings',
		id: 'others',
		is_display: false,
		children: [{ title: 'Incremental Sync', link: '/settings/others/incremental-sync', is_display: false, id: 'incremental_sync' }],
	},
];
export const MENU_ITEMS = [
	{
		title: 'General',
		id: 'general',
		is_display: true,
		children: [
			{ title: 'Company information', link: '/settings/general/company-info', id: 'company_info', is_display: true },
			{ title: 'Subscription', link: '/settings/general/subscription', id: 'subscription', is_display: true },
			// { title: 'Email Settings', link: '/settings/general/email-setting', id: 'email_setting', is_display: true },
			{ title: 'Barcode Settings', link: '/settings/general/barcode-setting', id: 'barcode_setting', is_display: true },
			{ title: 'Import Export', link: '/settings/general/import-export', id: 'import_export', is_display: true },
			{ title: 'JSON Rules', link: '/settings/general/json-rule', id: 'json_rule', is_display: true },
			{ title: 'Pricelist', link: '/settings/general/pricelist', id: 'pricelist', is_display: true },
		],
	},
	{
		title: 'Customer',
		id: 'buyer',
		is_display: true,
		children: [
			{ title: 'Customer form', link: '/settings/buyer/form', id: 'buyer_form', is_display: true },
			{ title: 'Customer permissions', link: '/settings/buyer/permission', id: 'buyer_permission', is_display: true },
			{ title: 'Listing and filters', link: '/settings/buyer/other', id: 'buyer_filters', is_display: true },
		],
	},
	{
		title: 'Order & Quote',
		id: 'order-management',
		is_display: true,
		children: [
			{ title: 'Order and quote form', link: '/settings/order-management/document', is_display: true, id: 'document_form' },
			{ title: 'Order and quote permissions', link: '/settings/order-management/permission', is_display: true, id: 'document_permission' },
			{ title: 'Order and quote charges', link: '/settings/order-management/charges', is_display: true, id: 'document_charges' },
			{ title: 'Listing and filters', link: '/settings/order-management/sales', is_display: true, id: 'order_filters' },
			{ title: 'Tags', link: '/settings/order-management/tags', is_display: true, id: 'tags' },
		],
	},
	{
		title: 'User Management',
		id: 'user-management',
		is_display: true,
		children: [{ title: 'Showroom mode', link: '/settings/user-management/showroom-mode', is_display: true, id: 'showroom_form' }],
	},
	{
		title: 'Cart',
		id: 'cart-summary',
		is_display: true,
		children: [
			{ title: 'Container Settings', link: '/settings/cart-summary/cart-container', is_display: true, id: 'cart_container' },
			{
				title: 'Cart grouping',
				link: '/settings/cart-summary/cart-grouping',
				is_display: true,
				id: 'cart_grouping',
			},
		],
	},
	{
		title: 'Templates',
		id: 'template',
		is_display: true,
		children: [
			{ title: 'Tear Sheet PDF', link: '/settings/template/tear_sheet_pdf', is_display: true, id: 'tear_sheet_pdf' },
			{ title: 'Tear Sheet Excel', link: '/settings/template/tear_sheet_excel', is_display: true, id: 'tear_sheet_excel' },
			{ title: 'Labels', link: '/settings/template/label', is_display: true, id: 'label' },
		],
	},
	{
		title: 'Product',
		id: 'product',
		is_display: true,
		children: [
			{ title: 'Product details page', link: '/settings/product/product_details', is_display: true, id: 'product_details' },
			{ title: 'Product listing page', link: '/settings/product/listing', is_display: true, id: 'product_listing' },
		],
	},
	{
		title: 'Reports',
		id: 'reporting',
		is_display: true,
		children: [{ title: 'Reports Settings', link: '/settings/reporting/reports', is_display: true, id: 'reports' }],
	},
	{
		title: 'Inventory',
		id: 'inventory',
		is_display: true,
		children: [
			{ title: 'Inventory & Cart rules', link: '/settings/inventory/inventory', is_display: true, id: 'inventory' },
			{ title: 'Inventory Display ', link: '/settings/inventory/inventory-display', is_display: true, id: 'inventory_display' },
		],
	},
	{
		title: 'Setting Config',
		id: 'user-setting',
		is_internal: true,
		is_display: true,
		children: [{ title: 'Display Settings', link: '/settings/user-setting/settings-config/', is_display: true, id: 'setting_config' }],
	},
	{
		title: 'Email Settings',
		id: 'email_settings',
		is_display: true,
		children: [
			{ title: 'Set reminders', link: '/settings/email-setting/set-reminders', is_display: true, id: 'set_reminders' },
			{ title: 'Email configuration', link: '/settings/email-setting/email-config', is_display: true, id: 'email_configuration' },
			{ title: 'External email triggers ', link: '/settings/email-setting/external-email', is_display: true, id: 'email_external_email' },
			{ title: 'Internal email triggers ', link: '/settings/email-setting/internal-email', is_display: true, id: 'email_internal_email' },
		],
	},
	{
		title: 'Other Settings',
		id: 'others',
		is_internal: true,
		is_display: true,
		children: [{ title: 'Incremental Sync', link: '/settings/others/incremental-sync', is_display: true, id: 'incremental_sync' }],
	},
];

export const sorting_option = [
	{
		name: 'Recent - New to Old',
		is_selected: true,
	},
	{
		name: 'Recent - Old to New',
		is_selected: true,
	},
	{
		name: 'Total Value - High to Low',
		is_selected: true,
	},
	{
		name: 'Total Value - Low to High',
		is_selected: true,
	},
	{
		name: 'Order ID - High to Low',
		is_selected: false,
	},
	{
		name: 'Order ID - Low to High',
		is_selected: false,
	},
];

export const charge_sections = [
	{
		name: 'Discount',
		key: 'discount',
		is_fixed: true,
		value: 10,
		default: true,
	},
	{
		name: 'Shipping Charge',
		key: 'shipping_charges',
		default: true,
		on_discount: true,
	},
	{
		name: 'Taxes',
		key: 'tax',
		is_fixed: true,
		value: 8.5,
		default: true,
		on_discount: false,
	},
	{
		name: 'Additional Charge',
		key: 'additional_charge',
		default: true,
		is_fixed: true,
		value: 8.5,
		on_discount: true,
	},
];

export const charge_type = [
	{ value: 'yes', label: 'Fixed Charge', is_custom: false, custom_labels: 'Fixed shipping charges across customers' },
	{
		value: 'no',
		label: 'Custom Charge',
		is_custom: false,
		custom_labels: 'Sales rep will define charges for each customer in the cart',
	},
];
export const include_type = [
	{ value: 'yes', label: 'Yes' },
	{ value: 'no', label: 'No' },
];

export const include_type_add_permission_options = [
	{ value: 'yes', label: 'Option to sync back to customer' },
	{ value: 'no', label: 'Auto sync to customer' },
];

export const handle_entity = (entity: any) => {
	if (entity === 'buyer') {
		return {
			web_ssrm: 'buyer_ssrm_settings',
			app_filter: 'buyer_filter_config',
			super_set: 'buyer_settings',
			listing: 'buyer_listing_page_settings',
		};
	} else if (entity === 'document') {
		return {
			web_ssrm: 'document_ssrm_settings',
			app_filter: 'document_filter_config',
			super_set: 'document_settings',
			listing: 'sales_view_page_settings',
		};
	} else if (entity === 'product') {
		return {
			web_ssrm: '',
			app_filter: '',
			super_set: 'product_settings',
			listing: '',
		};
	}
};

export const sales_section: any = {
	columns: [
		{
			suppressMenu: true,
			rowDrag: true,
			width: 50,
			minWidth: 50,
			headerName: '',
			cellStyle: { width: '50px' },
		},
		{
			suppressMenu: true,
			field: 'name',
			headerName: 'Attributes',
			flex: 1,
			editable: false,
			clickable: false,
			valueFormatter: (params: any) => {
				return params.value === 'Buyer Name' ? 'Customer Name' : params.value;
			},
		},
		{
			suppressMenu: true,
			field: 'show_in_web',
			headerName: 'Include in web',
			flex: 1,
			cellRenderer: 'agCheckboxCellRenderer',
			cellEditor: 'agToggleCellEditor',
			editable: false,
			disable: true,
		},
		{
			suppressMenu: true,
			field: 'show_in_app',
			headerName: 'App Filter list',
			flex: 1,
			cellRenderer: 'agCheckboxCellRenderer',
			cellEditor: 'agToggleCellEditor',
			editable: false,
			disable: true,
		},
	],
	attributes: [
		{
			id: 'af5c5794-6233-4637-b47f-052587604213',
			key: 'reference_id',
			name: 'Reference ID',
			included: true,
			filters: true,
			priority: 2,
			data: null,
		},
		{
			id: 'af5c5794-6233-4637-b47f-052587604213',
			key: 'type',
			name: 'Type',
			included: true,
			filters: true,
			priority: 2,
			data: null,
		},
		{
			id: 'af5c5794-6233-4637-b47f-052587604213',
			key: 'document_status',
			name: 'Document Status',
			included: false,
			filters: true,
			priority: 2,
			data: null,
		},
		{
			id: 'af5c5794-6233-4637-b47f-052587604213',
			key: 'payument_status',
			name: 'Payment Status',
			included: true,
			filters: true,
			priority: 2,
			data: null,
		},
		{
			id: 'af5c5794-6233-4637-b47f-052587604213',
			key: 'custom',
			name: 'Customer',
			included: true,
			filters: false,
			priority: 2,
			data: null,
		},
		{
			id: 'af5c5794-6233-4637-b47f-052587604213',
			key: 'sales_rep',
			name: 'Sales rep',
			included: true,
			filters: true,
			priority: 2,
			data: null,
		},
	],
	id: 11112,
	key: 'contact',
	label: 'Contact',
	priority: 1,
	is_quick_add: true,
	render_type: 'section',
	is_default: false,
	attribute_quick_add: false,
};

export const buyer_info_columns = [
	{
		suppressMenu: true,
		field: 'name',
		headerName: 'Name',
		flex: 1,
		editable: false,
		clickable: false,
		type: 'text',
	},
	{
		suppressMenu: true,
		field: 'is_mandatory',
		headerName: 'Order Mandatory',
		flex: 1,
		dtype: 'toggle',
		editable: false,
		disable: true,
	},
	{
		suppressMenu: true,
		field: 'is_display',
		headerName: 'Included in order',
		flex: 1,
		dtype: 'toggle',
		editable: false,
		disable: true,
	},
	{
		suppressMenu: true,
		field: 'is_quote_mandatory',
		headerName: 'Quote Mandatory',
		flex: 1,
		dtype: 'toggle',
		editable: false,
		disable: true,
	},
	{
		suppressMenu: true,
		field: 'is_quote_display',
		headerName: 'Included in quote',
		flex: 1,
		dtype: 'toggle',
		editable: false,
		disable: true,
	},
];

export const order_details_config = [
	{
		suppressMenu: true,
		field: 'name',
		headerName: 'Name',
		flex: 1,
		editable: false,
		clickable: false,
		type: 'text',
		minWidth: 160,
	},
	{
		suppressMenu: true,
		field: 'type',
		headerName: 'Dtype',
		flex: 1,
		editable: false,
		disable: true,
		type: 'text',
		minWidth: 100,
	},
	{
		suppressMenu: true,
		field: 'required',
		headerName: 'Order Mandatory',
		flex: 1,
		dtype: 'toggle',
		editable: false,
		disable: true,
		minWidth: 160,
	},
	{
		suppressMenu: true,
		field: 'is_display',
		headerName: 'Included in order',
		flex: 1,
		dtype: 'toggle',
		editable: false,
		disable: true,
		minWidth: 160,
	},
	{
		suppressMenu: true,
		field: 'is_quote_mandatory',
		headerName: 'Quote Mandatory',
		flex: 1,
		dtype: 'toggle',
		editable: false,
		disable: true,
		minWidth: 160,
	},
	{
		suppressMenu: true,
		field: 'is_quote_display',
		headerName: 'Included in quote',
		flex: 1,
		dtype: 'toggle',
		editable: false,
		disable: true,
		minWidth: 160,
	},
];
export const payment_method_config = [
	{
		suppressMenu: true,
		field: 'name',
		headerName: 'Name',
		flex: 1,
		editable: false,
		clickable: false,
		type: 'text',
		minWidth: 160,
	},
	{
		suppressMenu: true,
		field: 'type',
		headerName: 'Dtype',
		flex: 1,
		editable: false,
		disable: true,
		type: 'text',
		minWidth: 100,
	},
	{
		suppressMenu: true,
		field: 'is_display',
		headerName: 'Included in order',
		flex: 1,
		dtype: 'toggle',
		editable: false,
		disable: true,
		minWidth: 160,
	},
];

export const BUYER_INFO = ['buyer_details', 'send_emails_to', 'billing_address', 'shipping_address', 'notes'];
export const PERMISSION = ['Notes', 'Terms and conditions'];
export const OTHERS = [
	'Buyer Details',
	'Customer Details',
	'Send emails to',
	'Billing Address',
	'Shipping Address',
	'Notes',
	'Terms and conditions',
];
export const BACKFLOW_PERMISSION_ALLOWED_ATTRIBUTES = [
	'primary_contact',
	'billing_address',
	'shipping_address',
	'payment_terms',
	'payment_method',
	'freight_terms',
	'shipping_method',
];

export const order_buyer_map_config = [
	{
		suppressMenu: true,
		field: 'document_field_name',
		headerName: 'Attributes',
		flex: 1,
		editable: false,
		clickable: false,
		minWidth: 200,
	},
	{
		suppressMenu: true,
		field: 'buyer_field_name',
		headerName: 'Buyer mapping',
		flex: 1,
		editable: false,
		clickable: false,
		minWidth: 200,
	},
];
export const order_permissions_config = [
	{
		suppressMenu: true,
		field: 'name',
		headerName: 'Attributes',
		flex: 1,
		editable: false,
		clickable: false,
		minWidth: 200,
	},

	{
		headerName: 'Editing Permission',
		marrychildren: true,
		children: [
			{
				suppressMenu: true,
				field: 'edit_permissions',
				headerName: 'User ',
				flex: 1,
				dtype: 'multiselect',
				editable: false,
				disable: true,
				minWidth: 200,
			},
			{
				suppressMenu: true,
				field: 'roles_edit_permissions',
				headerName: 'Roles ',
				flex: 1,
				dtype: 'multiselect',
				editable: false,
				disable: true,
				minWidth: 200,
			},
		],
	},
	{
		headerName: 'Adding Permission',
		marrychildren: true,
		children: [
			{
				suppressMenu: true,
				field: 'add_permissions',
				headerName: 'User ',
				flex: 1,
				dtype: 'multiselect',
				editable: false,
				disable: true,
				minWidth: 200,
			},
			{
				suppressMenu: true,
				field: 'roles_add_permissions',
				headerName: 'Roles ',
				flex: 1,
				dtype: 'multiselect',
				editable: false,
				disable: true,
				minWidth: 200,
			},
		],
	},
	{
		headerName: 'Sync to customer permission',
		marrychildren: true,
		children: [
			{
				suppressMenu: true,
				field: 'back_flow_permission',
				headerName: 'User',
				flex: 1,
				dtype: 'multiselect',
				editable: false,
				disable: true,
				minWidth: 200,
			},
			{
				suppressMenu: true,
				field: 'roles_back_flow_permission',
				headerName: 'Roles',
				flex: 1,
				dtype: 'multiselect',
				editable: false,
				disable: true,
				minWidth: 200,
			},
		],
	},
];
export const charge_permissions_config = [
	{
		suppressMenu: true,
		field: 'name',
		headerName: 'Attributes',
		flex: 1,
		editable: false,
		clickable: false,
		minWidth: 200,
	},
	{
		headerName: 'Editing Permissions',
		marrychildren: true,
		children: [
			{
				suppressMenu: true,
				field: 'edit_permissions',
				headerName: 'User',
				flex: 1,
				dtype: 'multiselect',
				editable: false,
				disable: true,
				minWidth: 200,
			},
			{
				suppressMenu: true,
				field: 'roles_edit_permissions',
				headerName: 'Roles',
				flex: 1,
				dtype: 'multiselect',
				editable: false,
				disable: true,
				minWidth: 200,
			},
		],
	},
];

export const ORDER_CONSTANTS_PAYMENT = ['payment_method_v2'];

export const EXCLUDE_ADD_MORE_FIELDS = ['customer_consent', 'payment_method_v2', 'sales_rep_details'];

export const email_config = [
	{
		name: 'Name',
		id: 'name',
		priority: 0,
		required: true,
		type: 'text',
		value: '',
	},
	{
		name: 'Email',
		id: 'email',
		priority: 1,
		required: true,
		type: 'email',
		value: '',
	},
];
export const report_config = [
	{
		name: 'Name',
		id: 'tab_name',
		priority: 0,
		required: true,
		type: 'select',
		options: [
			{ label: 'Sales', value: 'Sales' },
			{ label: 'Product', value: 'Product' },
			{ label: 'Team', value: 'Team' },
			{ label: 'Buyers', value: 'Buyers' },
		],
		value: '',
	},
	{
		name: 'Dashboard ID',
		id: 'dashboard_id',
		priority: 1,
		required: true,
		type: 'number',
		value: '',
	},
];
export const report_user_roles = [
	{
		name: 'Roles',
		id: 'roles',
		priority: 0,
		required: false,
		type: 'multi_select',
		value: '',
	},
	{
		name: 'Users',
		id: 'users',
		priority: 1,
		required: false,
		type: 'multi_select',
		value: '',
	},
];
export const email_columns = [
	{
		suppressMenu: true,
		field: 'name',
		headerName: 'Name',
		flex: 1,
		editable: false,
		clickable: false,
		minWidth: 200,
	},
	{
		suppressMenu: true,
		field: 'email',
		headerName: 'Email ID',
		flex: 1,
		editable: false,
		disable: true,
		minWidth: 200,
	},
];

export const sorting_columns = [
	{
		suppressMenu: true,
		field: 'name',
		headerName: 'Name',
		flex: 1,
		editable: false,
		clickable: false,
		type: 'text',
		minWidth: 200,
	},
	{
		suppressMenu: true,
		field: 'options',
		headerName: 'option',
		flex: 1,
		editable: false,
		clickable: false,
		type: 'multiselect',
		minWidth: 200,
	},
	{
		suppressMenu: true,
		field: 'default',
		headerName: 'Default Value',
		flex: 1,
		editable: false,
		clickable: false,
		type: 'text',
		minWidth: 200,
	},
];

export const filter_columns = [
	{
		suppressMenu: true,
		rowDrag: true,
		width: 50,
		minWidth: 50,
		headerName: '',
		cellStyle: { width: '50px' },
	},
	{
		suppressMenu: true,
		field: 'name',
		headerName: 'Filter name',
		flex: 1,
		editable: false,
		clickable: false,
		type: 'text',
		minWidth: 200,
	},
	{
		suppressMenu: true,
		field: 'type',
		headerName: 'Type',
		flex: 1,
		editable: false,
		clickable: false,
		type: 'text',
		minWidth: 160,
		valueFormatter: (params: any) => {
			return params?.node?.data?.meta?.type || '--';
		},
	},
	{
		suppressMenu: true,
		field: 'filter_sort',
		headerName: 'Sort by',
		flex: 1,
		editable: false,
		clickable: false,
		minWidth: 200,
		type: 'text',
		valueFormatter: (params: any) => {
			return _.split(params?.value, '_')?.join(' ') || '--';
		},
	},
	{
		suppressMenu: true,
		field: 'is_display',
		headerName: 'Active',
		flex: 1,
		cellRenderer: 'agCheckboxCellRenderer',
		cellEditor: 'agToggleCellEditor',
		editable: false,
		minWidth: 150,
		disable: true,
	},
];
export const product_entity = 'product';
export const disable_types = ['url', 'html'];
export const FORM_VALUES_KEYS = {
	VISIBLE: 'is_visible',
	CALCULATED: 'is_calculated',
	DISBALED: 'is_disabled',
};

export const CONTAINER = {
	CONTAINER_CONFIG: [
		{
			suppressMenu: true,
			field: 'container_name',
			headerName: 'Name',
			flex: 1,
			dtype: 'text',
			editable: false,
			hideFilter: true,
		},
		{
			suppressMenu: true,
			field: 'container_volume_data.CFT',
			headerName: 'CFT Volume',
			flex: 1,
			dtype: 'text',
			editable: false,
			hideFilter: true,
		},
		{
			suppressMenu: true,
			field: 'container_volume_data.CBM',
			headerName: 'CBM Volume',
			flex: 1,
			dtype: 'text',
			editable: false,
			hideFilter: true,
		},
		{
			suppressMenu: true,
			field: 'is_default_container',
			headerName: 'Default',
			flex: 1,
			cellRenderer: 'agCheckboxCellRenderer',
			cellEditor: 'agCheckboxCellEditor',
			editable: false,
			disable: true,
		},
	],
	CONTAINER_FORM: [
		{ name: 'Container name', id: 'container_name', type: 'text' },
		{ name: 'Volume', id: 'container_volume', type: 'amount' },
		{
			id: 'container_unit',
			name: 'Unit Type',
			type: 'select',
			options: [
				{ label: 'CBM', value: 'CBM' },
				{ label: 'CFT', value: 'CFT' },
			],
		},
	],
	DEFAULT_UNIT_OPTION: [
		{ label: 'CBM', value: 'CBM' },
		{ label: 'CFT', value: 'CFT' },
	],
};

export const FILTER_SORTING = ['alphanumeric_ascending', 'alphanumeric_descending', 'count_ascending', 'count_descending'];

export const PRODUCT = 'product';
export const CUSTOMER_FIELDS = ['sales_reps', 'catalog_group'];
export const DATA_TYPE = ['select', 'multi_select'];
export const TEXT_DEFAULT = ['text', 'percentage', 'textarea', 'long_text', 'number'];
export const VALUE_DEFAULT = ['select', 'multi_select'];
export const LIMIT_ATTRIBUTE_SECTIONS = ['buyer', 'order'];
export const LIMIT_CHECK_TYPE = ['text', 'long_text', 'textarea', 'number'];

export const report_columns = [
	{
		suppressMenu: true,
		field: 'tab_name',
		headerName: 'Name',
		flex: 1,
		editable: false,
		clickable: false,
		type: 'text',
		minWidth: 150,
	},
	{
		suppressMenu: true,
		field: 'dashboard_id',
		headerName: 'Dashboard ID',
		flex: 1,
		editable: false,
		clickable: false,
		type: 'text',
		minWidth: 100,
	},
	{
		suppressMenu: true,
		field: 'roles',
		headerName: 'Roles',
		flex: 1,
		editable: false,
		clickable: false,
		type: 'multiselect',
		minWidth: 200,
	},
	{
		suppressMenu: true,
		field: 'users',
		headerName: 'Users',
		flex: 1,
		editable: false,
		clickable: false,
		type: 'multiselect',
		minWidth: 200,
	},
	{
		suppressMenu: true,
		field: 'is_specific',
		headerName: 'Specific',
		flex: 1,
		cellRenderer: 'agCheckboxCellRenderer',
		cellEditor: 'agToggleCellEditor',
		editable: false,
		minWidth: 150,
		disable: true,
	},
	{
		suppressMenu: true,
		field: 'filters',
		headerName: 'Filter',
		flex: 1,
		editable: false,
		minWidth: 150,
		disable: true,
		valueFormatter: (params: any) => {
			return !_.isEmpty(params?.value) ? 'Yes' : 'No';
		},
	},
];

export const PRE_FETCH_KEYS = [
	'settings_configuration',
	'emailer_settings',
	'json_rule_payment_address',
	'json_rule_cart_calculations',
	'product_listing_page_config_web',
	'product_listing_page_config_v2',
	'product_listing_page_config',
	'collection_product_listing_page_config_web',
	'collection_product_listing_page_config',
	'collection_product_listing_page_config_v2',
	'category_product_listing_page_config_web',
	'category_product_listing_page_config',
	'category_product_listing_page_config_v2',
	'barcode_scanner_settings',
];

export const CONTAINER_CONVERSIONS = { CBM: { CFT: 35.314667 }, CFT: { CBM: 0.0283168466 } };

export const customer_permission_config = {
	section: [
		{
			suppressMenu: true,
			field: 'name',
			headerName: 'Section Name',
			flex: 1,
			editable: false,
			clickable: false,
			minWidth: 200,
		},
		{
			headerName: 'Add Permission',
			marryChildren: true,
			children: [
				{
					suppressMenu: true,
					field: 'users_with_add_permissions',
					headerName: 'Users',
					flex: 1,
					dtype: 'multiselect',
					editable: false,
					disable: true,
					minWidth: 200,
				},
				{
					suppressMenu: true,
					field: 'roles_with_add_permissions',
					headerName: 'Roles',
					flex: 1,
					dtype: 'multiselect',
					editable: false,
					disable: true,
					minWidth: 200,
				},
			],
		},

		{
			headerName: 'Edit Permission',
			marryChildren: true,
			children: [
				{
					suppressMenu: true,
					field: 'users_with_edit_permissions',
					headerName: 'Users',
					flex: 1,
					dtype: 'multiselect',
					editable: false,
					disable: true,
					minWidth: 200,
				},
				{
					suppressMenu: true,
					field: 'roles_with_edit_permissions',
					headerName: 'Roles',
					flex: 1,
					dtype: 'multiselect',
					editable: false,
					disable: true,
					minWidth: 200,
				},
			],
		},

		{
			headerName: 'Delete Permission',
			marryChildren: true,
			children: [
				{
					suppressMenu: true,
					field: 'users_with_delete_permissions',
					headerName: 'Users',
					flex: 1,
					dtype: 'multiselect',
					editable: false,
					disable: true,
					minWidth: 200,
				},
				{
					suppressMenu: true,
					field: 'roles_with_delete_permissions',
					headerName: 'Roles',
					flex: 1,
					dtype: 'multiselect',
					editable: false,
					disable: true,
					minWidth: 200,
				},
			],
		},

		{
			suppressMenu: true,
			field: 'max_number_of_entities',
			headerName: 'Max Entities',
			flex: 1,
			dtype: 'text',
			editable: false,
			clickable: false,
			minWidth: 200,
		},
	],
	attributes: [
		{
			suppressMenu: true,
			field: 'name',
			headerName: 'Attributes',
			flex: 1,
			editable: false,
			clickable: false,
			minWidth: 200,
		},
		{
			suppressMenu: true,
			field: 'users_with_edit_permissions',
			headerName: 'Edit Access Users',
			flex: 1,
			dtype: 'multiselect',
			editable: false,
			disable: true,
			minWidth: 200,
		},
		{
			suppressMenu: true,
			field: 'roles_with_edit_permissions',
			headerName: 'Edit Access Roles',
			flex: 1,
			dtype: 'multiselect',
			editable: false,
			disable: true,
			minWidth: 200,
		},
	],
};

export const DEFAULT_SSRM_CONFIG = {
	sorting: {
		credits_ssrm: [{ colId: 'record_date_milliseconds', sort: 'desc' }],
		order_ssrm: [{ colId: 'updated_at', sort: 'desc' }],
		invoice_ssrm: [{ colId: 'created_at', sort: 'desc' }],
		payment_ssrm: [{ colId: 'record_date', sort: 'desc' }],
		customer_ssrm: [{ colId: 'updated_at', sort: 'desc' }],
	},
};
export const ALLOWED_ADDING_DOCUMENT_ATTR_KEYS = ['primary_contact', 'billing_address', 'shipping_address'];

export const DEFAULT_JSON_RULE_PAYMENT_ADDRESS = {
	first_name: { var: 'first_name' },
	last_name: { var: 'last_name' },
	phone: { cat: [{ var: 'country_code' }, '', { var: 'phone' }] },
	email: { var: 'email' },
	address_1: {
		if: [
			{ and: [{ var: 'address_line_1' }, { var: 'street_address' }] },
			{ cat: [{ var: 'address_line_1' }, ', ', { var: 'street_address' }] },
			{ if: [{ var: 'street_address' }, { var: 'street_address' }, { var: 'address_line_1' }] },
		],
	},
	address_2: { var: 'address_line_2' },
	city: { var: 'city' },
	state: {
		customStateHandling: [{ var: 'state' }, { var: 'state_options' }],
	},
	country: {
		iso_3_code: [{ var: 'country' }, { var: 'iso_code' }],
	},
	zip: { var: 'pincode' },
};

export const COLORS = ['#EEF1F7', '#EBEDEF', '#D0E7DF', '#F2F6E7', '#E1EDFF', '#FBEDE7', '#FCEFD6', '#F5EFFF', '#FFEFFD', '#ECFBFF'];

export const EXCLUDE_DATA_TYPE = ['written_for', 'written_by'];

export const showroom_mode_config = [
	{
		suppressMenu: true,
		field: 'user_list',
		headerName: 'User List',
		flex: 1,
		dtype: 'multiselect',
		editable: false,
		disable: true,
		minWidth: 200,
	},
	{
		suppressMenu: true,
		field: 'buyer_access',
		headerName: 'Customer access',
		flex: 1,
		dtype: 'multiselect',
		editable: false,
		disable: true,
		minWidth: 200,
	},
	{
		suppressMenu: true,
		field: 'order_access',
		headerName: 'Order Access',
		flex: 1,
		dtype: 'multiselect',
		editable: false,
		disable: true,
		minWidth: 200,
	},
	{
		suppressMenu: true,
		field: 'catalog_access',
		headerName: 'Pricelist access',
		flex: 1,
		dtype: 'multiselect',
		editable: false,
		disable: true,
		minWidth: 200,
	},
];
