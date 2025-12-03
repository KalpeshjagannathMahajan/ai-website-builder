export const filterChipsList = [
	{
		key: 'computedAttributes.Color',
		label: 'Color',
		type: 'multi-select',
		value: ['Green', 'Blue'],
	},
	{
		key: 'computedAttributes.Vendor Name',
		label: 'Vendor Name',
		type: 'multi-select',
		value: ['ABC', 'ASD', 'Green'],
	},
	{
		key: 'status',
		label: 'Status',
		type: 'select',
		value: ['published'],
	},
	{
		key: 'sub_category',
		label: 'Sub Category',
		type: 'multi-select',
		value: ['ABC', 'ASD'],
	},
	{
		key: 'costing_status',
		label: 'Costing Status',
		type: 'select',
		value: ['added'],
	},
	{
		key: 'computedAttributes.UOM',
		label: 'Weight',
		type: 'range',
		value: [20, 60, 'kg', 'suffix'],
	},
	{
		key: 'computedAttributes.TEST PRICE 1',
		label: 'Selling PRICE',
		type: 'range',
		value: [20, 100, 'usd', 'prefix'],
	},
	{
		key: 'category',
		label: 'Category',
		type: 'category',
		value: ['Home & Kitchen > Home Decor > Rugs & Pads > Carpets', 'Home & Kitchen > Home Decor > Rugs & Pads > Mats', 'Home & Kitchen'],
	},
];
