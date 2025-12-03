export const mock_cart = {
	items: {
		'6c231d08-4717-49d6-80d1-dc0c324ed876': {
			'1a': {
				discount_type: '',
				discount_value: 0,
				final_value: 248,
				quantity: 2,
				cart_item_id: '1a',
				meta: {
					notes: [
						{
							value: 'Have to deliver order untill Monday',
						},
					],
				},
				id: '6c231d08-4717-49d6-80d1-dc0c324ed876',
				parent_id: '8d52bc72-df21-4f62-8bda-652a25a02311',
			},
			'2b': {
				discount_type: 'value',
				discount_value: 40,
				final_value: 208,
				quantity: 2,
				cart_item_id: '2b',
				meta: {},
				id: '6c231d08-4717-49d6-80d1-dc0c324ed876',
				parent_id: '8d52bc72-df21-4f62-8bda-652a25a02311',
			},
			'3c': {
				discount_type: 'value',
				discount_value: 20,
				final_value: 228,
				quantity: 4,
				cart_item_id: '3c',
				meta: {},
				id: '6c231d08-4717-49d6-80d1-dc0c324ed876',
				parent_id: '8d52bc72-df21-4f62-8bda-652a25a02311',
			},
		},
		'de82410c-3da1-4414-86f8-bc86268c74b6': {
			quantity: 1,
			meta: {
				notes: [
					{
						value: 'Have to deliver order untill Monday',
					},
				],
			},
		},
		'e37cdd8a-3e0d-4106-b702-549a3e36342e': {
			quantity: 50,
			meta: {},
		},
		'00141673-75ee-4e06-8ed6-90ee1fe90b2e': {
			quantity: 2,
			meta: {},
		},
	},
};

export const ADDTEMPLATE = [
	{
		name: 'SKU ID',
		id: 'sku_id',
		priority: 0,
		required: true,
		type: 'text',
		value: '',
	},
	{
		name: 'Product Name',
		id: 'name',
		priority: 1,
		required: false,
		type: 'text',
		value: '',
	},
	{
		name: 'Price',
		id: 'price',
		priority: 2,
		required: true,
		type: 'amount',
		value: '0.00',
	},
	{
		name: 'Quantity',
		id: 'quantity',
		priority: 3,
		required: true,
		type: 'number',
		value: '',
	},
	{
		name: 'Unit volume',
		id: 'container',
		priority: 4,
		required: false,
		type: 'amount',
		value: '0.00',
	},
	{
		name: 'Add Note',
		id: 'note',
		priority: 5,
		required: false,
		type: 'text',
		value: '',
	},
];
