const field_type = [
	{ label: 'Text', value: 'text', component: null, icon: 'IconTextSize', disable: false },
	{ label: 'Percentage', value: 'percentage', component: null, icon: 'IconPercentage', disable: false },
	{ label: 'Long text', value: 'long_text', component: null, icon: 'IconMessage2', disable: false },
	{
		label: 'Select',
		value: 'select',
		icon: 'IconList',
		disable: false,
	},
	{ label: 'Multi select', value: 'multi_select', icon: 'IconListDetails', disable: false },
	{ label: 'Date', value: 'date', icon: 'IconCalendarDue', disable: false },
	{ label: 'URL', value: 'url', icon: 'IconLink', disable: true },
	{ label: 'HTML', value: 'html', icon: 'IconDeviceLaptop', disable: true },
	{ label: 'Email', value: 'email', icon: 'IconBrandMailgun', disable: false },
	{ label: 'Number', value: 'number', icon: 'IconListNumbers', disable: false },
	{ label: 'Phone_e164', value: 'phone_e164', icon: 'IconPhone', disable: false },
	{ label: 'Checkbox', value: 'checkbox', icon: 'IconCheckbox', disable: false },
];
const product_field_type = [
	{ label: 'Text', value: 'text', component: null, icon: 'IconTextSize', disable: false },
	{ label: 'Text Area', value: 'textarea', component: null, icon: 'IconMessage2', disable: false },
	{ label: 'URL', value: 'url', icon: 'IconLink', disable: false },
	{
		label: 'Select',
		value: 'select',
		icon: 'IconList',
		disable: false,
	},
	{ label: 'Multi select', value: 'multi_select', icon: 'IconListDetails', disable: false },

	{ label: 'HTML', value: 'html', icon: 'IconDeviceLaptop', disable: false },
];
export const add_section = {
	header: 'Add Section',
	attributes: [
		{
			name: 'Section Name',
			id: 'section_name',
			priority: 0,
			required: true,
			type: 'text',
			value: '',
		},
		{
			name: 'Display Name',
			id: 'name',
			priority: 2,
			required: true,
			type: 'text',
			value: '',
		},
	],
	field_type,
};
export const add_field = {
	header: 'Add Field',
	attributes: [
		{
			name: 'Display Name',
			id: 'name',
			priority: 1,
			required: true,
			type: 'text',
			value: '',
		},
		{
			name: 'Priority',
			id: 'priority',
			priority: 1,
			required: true,
			type: 'number',
			value: '1',
		},
	],
	field_type,
};
export const edit_field = {
	header: 'Edit Field',
	attributes: [
		{
			id: 'id',
			name: 'Field name',
			priority: 0,
			required: true,
			type: 'text',
			value: '',
			disabled: true,
		},
		{
			name: 'Display Name',
			id: 'name',
			priority: 1,
			required: true,
			type: 'text',
			value: '',
		},
		{
			name: 'Priority',
			id: 'priority',
			priority: 1,
			required: true,
			type: 'number',
			value: '1',
		},
	],
	field_type,
};
export const add_product_field = {
	header: 'Add Field',
	attributes: [
		{
			name: 'Attribute Name',
			id: 'name',
			priority: 1,
			required: true,
			type: 'text',
			value: '',
		},
	],
	field_type: product_field_type,
};
export const edit_product_field = {
	header: 'Edit  Field',
	attributes: [
		{
			id: 'id',
			name: 'Attribute Id',
			priority: 0,
			required: true,
			type: 'text',
			value: '',
			disabled: true,
		},
		{
			name: 'Attribute Name',
			id: 'name',
			priority: 1,
			required: true,
			type: 'text',
			value: '',
		},
	],
	field_type: product_field_type,
};
export const buyer_attributes = [
	{
		name: 'Buyer info',
		key: 'buyer_info',
		is_included: true,
	},
	{
		name: 'Billing address',
		key: 'billing_address',
		is_included: true,
	},
	{
		name: 'Shipping address',
		key: 'shipping_address',
		is_included: true,
	},
	{
		name: 'Preference',
		key: 'preferences',
		is_included: false,
	},
];
export const setting_attributes = [
	{
		name: 'To be included',
		key: 'visible',
	},
	{
		name: 'Set as filterable',
		key: 'isFilterable',
	},
];

export const order_info_setting = [
	{
		id: 'order',
		label: 'Order Settings',
		props: [
			{
				name: 'Set as Mandatory',
				key: 'is_mandatory',
			},
			{
				name: 'To be included',
				key: 'is_display',
			},
		],
	},
	{
		is: 'quote',
		label: 'Quote Settings',
		props: [
			{
				name: 'Set as Mandatory',
				key: 'is_quote_mandatory',
			},
			{
				name: 'To be included',
				key: 'is_quote_display',
			},
		],
	},
];

export const sales_setting = [
	{
		name: 'To be included',
		key: 'visible',
	},
	{
		name: 'Do you want filter on this attribute?',
		key: 'isFilterable',
	},
];

export const search_setting = [
	{
		name: 'Set tag as active',
		key: 'active',
	},
	{
		name: 'Set tag as default',
		key: 'default',
	},
];

export const rail_setting = [
	{
		name: 'Set rail as active',
		key: 'active',
	},
];
