export const general_settings = {
	website: 'www.sourcewiz.co',
	company_name: 'Sourcewiz oritur technologies',
	company_address: {
		first_name: 'John',
		last_name: 'Doe',
		email: 'test@test.com',
		country_code: '+1',
		phone: '23449404',
		street_address: '7444 W North Ave, Elmwood Park, IL 60707, USA',
		city: 'Elmwood Park',
		state: 'Illinois',
		country: 'usa',
		pincode: '60707',
	},
};

export const general_field = [
	{
		name: 'Company name',
		id: 'company_name',
		type: 'text',
		required: false,
	},
	{
		name: 'Website URL',
		id: 'website',
		type: 'text',
		required: false,
	},
	{
		name: 'Company address',
		id: 'company_address',
		type: 'text',
		required: true,
	},
];

export const get_fields = (type: string) => {
	const document_field = [
		{
			name: 'Template name',
			id: 'name',
			type: 'text',
		},
		{
			name: 'Template ID',
			id: 'pdf_gen_template_id',
			type: 'text',
		},
	];

	const product_field = [
		{
			name: 'Template name',
			id: 'name',
			type: 'text',
		},
		{
			name: 'Template Description',
			id: 'description',
			type: 'text',
		},
		{
			name: 'Template ID',
			id: 'pdf_gen_template_id',
			type: 'number',
		},
	];

	switch (type) {
		case 'tear-sheet':
			return product_field;
		case 'cart':
			return [
				...product_field,
				{
					name: '# of Preview Product',
					id: 'preview_item_count',
					type: 'number',
				},
			];
		case 'document':
			return document_field;
	}
};

export const excel_template = [
	{
		name: 'Template name',
		id: 'name',
		type: 'text',
	},
];
export const ENTITIES = [
	{ key: 'general', id: 'general', label: 'General', type: 'general' },
	{
		key: 'tear-sheet-table',
		id: 'tear-sheet',
		label: 'Product Details',
		subtitle: 'Select tearsheet templates and details',
		type: 'table',
	},
	{ key: 'cart-table', id: 'cart', label: 'Cart Summary', subtitle: 'Select tearsheet templates and details', type: 'table' },
	{ key: 'document-table', id: 'document', label: 'Order/Quote', subtitle: 'Select tearsheet templates and details', type: 'table' },
];
export const EXCEL_ENTITIES = [
	{ key: 'document-table', id: 'document', label: 'Order/Quote', subtitle: 'Select tearsheet templates and details', type: 'table' },
];

export const ATTRIBUTES = ['sku_id', 'product_name', 'image', 'parameters', 'price'];

export const ATTRIBUTES2 = [
	{ label: 'SKU ID', value: 'sku_id' },
	{ label: 'Product name', value: 'product_name' },
	{ label: 'Image', value: 'image' },
	{ label: 'Parameters', value: 'parameters' },
	{ label: 'Price', value: 'price' },
];

export const label_config = [
	{
		suppressMenu: true,
		field: 'name',
		headerName: 'Template Name',
		flex: 1,
		dtype: 'text',
		editable: false,
		hideFilter: true,
	},
	{
		suppressMenu: true,
		field: 'pdf_gen_template_id',
		headerName: 'Template ID',
		flex: 1,
		dtype: 'text',
		editable: false,
		hideFilter: true,
	},
	{
		suppressMenu: true,
		field: 'img_logo',
		headerName: 'Header Logo',
		flex: 1,
		dtype: 'image',
		editable: false,
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
export const excel_config = [
	{
		suppressMenu: true,
		field: 'name',
		headerName: 'Template Name',
		flex: 1,
		dtype: 'text',
		editable: false,
		hideFilter: true,
	},
	{
		suppressMenu: true,
		field: 'id',
		headerName: 'Template ID',
		flex: 1,
		dtype: 'text',
		editable: false,
		hideFilter: true,
	},
];

export const MULTIPLE_TEMPLATE_ENTITY = ['tear-sheet', 'cart'];
export const multiple_template_config = [
	{
		suppressMenu: true,
		field: 'name',
		headerName: 'Template Name',
		flex: 1,
		dtype: 'text',
		editable: false,
		hideFilter: true,
		minWidth: 200,
	},
	{
		suppressMenu: true,
		field: 'transformed_attributes',
		headerName: 'Attributes',
		flex: 1,
		dtype: 'multiselect',
		editable: false,
		hideFilter: true,
		minWidth: 200,
	},
	{
		suppressMenu: true,
		field: 'pdf_gen_template_id',
		headerName: 'Template ID',
		flex: 1,
		dtype: 'text',
		editable: false,
		hideFilter: true,
	},
	{
		suppressMenu: true,
		field: 'img_logo',
		headerName: 'Header Logo',
		flex: 1,
		dtype: 'image',
		editable: false,
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

export const labels_module_config = [
	{
		suppressMenu: true,
		field: 'name',
		headerName: 'Template Name',
		flex: 1,
		dtype: 'text',
		editable: false,
		hideFilter: true,
	},
	{
		suppressMenu: true,
		field: 'template_id',
		headerName: 'Template ID',
		flex: 1,
		dtype: 'text',
		editable: false,
		hideFilter: true,
	},
	{
		suppressMenu: true,
		field: 'size',
		headerName: 'Size',
		flex: 1,
		dtype: 'text',
		editable: false,
		hideFilter: true,
	},
	{
		suppressMenu: true,
		field: 'img_logo',
		headerName: 'Company Logo',
		flex: 1,
		dtype: 'image',
		editable: false,
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
