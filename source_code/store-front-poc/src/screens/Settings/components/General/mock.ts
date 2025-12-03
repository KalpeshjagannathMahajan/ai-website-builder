import { PERMISSIONS } from 'src/casl/permissions';

export const columnDef = [
	{
		suppressMenu: true,
		field: 'name',
		headerName: 'Modules',
		flex: 1,
		dtype: 'text',
		editable: false,
		hideFilter: true,
	},
	{
		suppressMenu: true,
		field: 'is_active',
		headerName: 'Active',
		flex: 1,
		cellRenderer: 'agCheckboxCellRenderer',
		cellEditor: 'agCheckboxCellEditor',
		editable: false,
		disable: true,
	},
];

export const EDIT_PRODUCT_PRICE_KEY = 'Edit Product Price';
export const INTERCOM = 'Customer Support';
export const ADD_ALL_TO_CART = 'Add All To Cart';
export const ORDER_TAG = 'Order Tag';
export const DOWNLOAD_INVOICE = 'Download Invoice';
export const ENABLED_WISHLIST = 'Wishlist';
export const SHOWROOM_MODE = 'Showroom Mode';
export const CHANGE_FULLFILLMENT_STATUS = 'Change Fulfillment Status';
export const DELETE_CUSTOMER = 'Delete Customer';
export const ABANDONED_CART = 'Abandoned Cart';
export const DETOKENIZE = 'Detokenize';
export const PHYSICAL_COUNT_MODULE = 'Physical Count Module';
export const PAYMENT_INSTRUMENTS = 'Payment Instruments';

export const TENANT_CONSTANTS: any = {
	DAM: { modules: ['Files'], submodules: [] },
	Payments: { modules: ['Payments'], submodules: ['Saved cards', 'Credits'] },
	'Import / Export': { modules: ['Import / Export'], submodules: [] },
	Labels: ['create_labels'],
	WizPay: ['wizpay_dashboard_full_access'],
	Credits: { modules: [], submodules: ['Credits'] },
	Invoices: { modules: ['Invoice'], submodules: [] },
	Reports: { modules: ['Report'], submodules: [] },
	WizAI: { modules: ['WizAI'], submodules: [] },
	Product: { modules: ['Product'], submodules: [] },
	[ABANDONED_CART]: { modules: [], submodules: ['Abandoned Cart'] },
	[EDIT_PRODUCT_PRICE_KEY]: [PERMISSIONS.cart_price_override.slug],
	[ORDER_TAG]: [PERMISSIONS.edit_order_tag.slug],
	[CHANGE_FULLFILLMENT_STATUS]: [PERMISSIONS.edit_fulfilment_status.slug],
	[DELETE_CUSTOMER]: [PERMISSIONS.delete_buyers.slug],
	[DETOKENIZE]: [PERMISSIONS.detokenize.slug],
	[PAYMENT_INSTRUMENTS]: { modules: [PAYMENT_INSTRUMENTS] },
};

export const BARCODE = {
	TABLE_CONFIG: [
		{
			suppressMenu: true,
			field: 'name',
			headerName: 'Barcode Type',
			flex: 1,
			dtype: 'text',
			editable: false,
			hideFilter: true,
		},
		{
			suppressMenu: true,
			field: 'filter_logic.key_type',
			headerName: 'Logic Type',
			flex: 1,
			dtype: 'text',
			editable: false,
			hideFilter: true,
		},
	],
	FORM_FIELDS: [{ name: 'Select Attribute/Property', id: 'key', type: 'select', options: [] }],
};
export const BARCODE_TYPE_OPTION = [
	{ label: 'SKU ID', value: 'barcode' },
	{ label: 'Custom', value: 'upc_a' },
];
export const DEFAULT_VALUES = { name: 'Custom', data_type: 'text', logic: 'search', key_type: 'attribute', is_default: true };

export const DEFAULT_BARCODE = [
	{
		name: 'SKU ID',
		type: 'barcode',
		logic: 'search',
		filter_logic: { key: 'sku_id', key_type: 'sku_id' },
		is_default: true,
		data_type: 'string',
	},
];

export const pricelistColumDef = [
	{
		suppressMenu: true,
		field: 'name',
		headerName: 'Name',
		flex: 1,
		dtype: 'text',
		editable: false,
		hideFilter: true,
	},
	{
		suppressMenu: true,
		field: 'catalog_status',
		headerName: 'Status',
		flex: 1,
		dtype: 'status',
		editable: false,
		hideFilter: true,
	},
	{
		suppressMenu: true,
		field: 'is_default',
		headerName: 'Default',
		flex: 1,
		cellRenderer: 'agCheckboxCellRenderer',
		cellEditor: 'agCheckboxCellEditor',
		editable: false,
		disable: true,
	},
];
