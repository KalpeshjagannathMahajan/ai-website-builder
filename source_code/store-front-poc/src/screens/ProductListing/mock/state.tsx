export const cart_data = {
	status: 'published',
	updated_at: '2023-07-15T12:49:21.868454',
	source: null,
	updated_by: 'c18495ad-50a7-4b5c-9ff7-85020a81473b',
	id: 'cc434466-f740-4949-bddd-931517b76831',
	created_by: 'c18495ad-50a7-4b5c-9ff7-85020a81473b',
	meta: null,
	created_at: '2023-07-15T12:49:21.868454',
	cart_hash: null,
	tenant_id: 'a3269fcb-c237-4d40-85b5-be1c2bd23e6e',
	type: 'cart',
	buyer_id: '46cd87b7-2865-4286-a995-89a0eea9e774',
	items: {
		'5d7ae22e-c162-452d-b772-f16f790f077c': {
			quantity: 27,
			meta: {
				notes: {
					customer_note: '',
					share_customer_note_with_buyer: false,
					my_note: '',
					share_my_note_with_buyer: false,
				},
			},
		},
		'5d7ae22e-c162-452d-b772-f16f790f077K': {
			quantity: 999,
			meta: {
				notes: {
					customer_note: '',
					share_customer_note_with_buyer: false,
					my_note: '',
					share_my_note_with_buyer: false,
				},
			},
		},
	},
	validations: {
		partially_in_stock: [],
		not_in_stock: [],
	},
	products: [
		{
			id: '5d7ae22e-c162-452d-b772-f16f790f077c',
			moq: 6,
			name: 'Neural-net',
			description: 'Behavior wish next attorney first memory.',
			sku_id: 29610,
			media: [
				{
					id: '84f70445-e754-45cc-87d9-9154c02cd789',
					url: 'https://sourcerer.tech/assets/73a05a0a-6aa0-4c15-8f25-ee9534db27aa?transforms=[["resize",{"width":300,"height":300,"fit":"contain","background":"white"}]]',
					type: 'image',
					is_primary: true,
				},
			],
			pricing_rule: {
				volume: {
					name: 'Volume Discount',
					tiers: [
						{
							min_qty: 1,
							max_qty: 19,
							type: 'percentage_discount',
							value: 17,
						},
						{
							min_qty: 5,
							max_qty: 19,
							type: 'fixed',
							value: 20,
						},
						{
							min_qty: 2,
							max_qty: 13,
							type: 'fixed',
							value: 11,
						},
					],
				},
			},
			price: 235,
			currency: 'USD',
			unit: 'm',
			inventory: {
				min_order_quantity: 18,
				incremental_value: 9,
				max_order_quantity: 81,
				stock: 58,
				name: 'In Stock: 58 pcs',
				box_color: 'secondary',
				show_stock_list: false,
				list: ['In Stock: 93 pcs', 'On Hold: 63 pcs', 'On Loom: 41 pcs'],
			},
			attributes: [
				{
					color: 'white',
					bgcolor: 'black',
					label: 'Size',
					value: '10 X 12 X 12 cm',
					dtype: 'text',
					priority: 1,
				},
				{
					color: 'white',
					bgcolor: 'black',
					label: 'Color',
					value: 'red, green',
					dtype: 'text',
					priority: 2,
				},
			],
		},
		{
			id: '5d7ae22e-c162-452d-b772-f16f790f077K',
			moq: 6,
			name: 'Reactive asynchronous neural-net',
			description: 'Behavior wish next attorney first memory.',
			sku_id: 29610,
			media: [
				{
					id: '84f70445-e754-45cc-87d9-9154c02cd789',
					url: 'https://sourcerer.tech/assets/73a05a0a-6aa0-4c15-8f25-ee9534db27aa?transforms=[["resize",{"width":300,"height":300,"fit":"contain","background":"white"}]]',
					type: 'image',
					is_primary: true,
				},
			],
			pricing_rule: {
				volume: {
					name: 'Volume Discount',
					tiers: [
						{
							min_qty: 1,
							max_qty: 19,
							type: 'percentage_discount',
							value: 17,
						},
						{
							min_qty: 5,
							max_qty: 19,
							type: 'fixed',
							value: 20,
						},
						{
							min_qty: 2,
							max_qty: 13,
							type: 'fixed',
							value: 11,
						},
					],
				},
			},
			price: 235,
			currency: 'USD',
			unit: 'm',
			inventory: {
				min_order_quantity: 18,
				incremental_value: 9,
				max_order_quantity: 81,
				stock: 0,
				name: 'In Stock: 58 pcs',
				box_color: 'secondary',
				show_stock_list: false,
				list: ['In Stock: 93 pcs', 'On Hold: 63 pcs', 'On Loom: 41 pcs'],
			},
			attributes: [
				{
					color: 'white',
					bgcolor: 'black',
					label: 'Size',
					value: '10 X 12 X 12 cm',
					dtype: 'text',
					priority: 1,
				},
				{
					color: 'white',
					bgcolor: 'black',
					label: 'Color',
					value: 'red, green',
					dtype: 'text',
					priority: 2,
				},
			],
		},
	],
	cart_total: 975.24,
	total: 925.24,
	charges: [
		{
			value_type: 'fixed',
			id: 'c727a433-4d3c-4397-ae2a-d2cc9936a2ba',
			charge_type: 'discount',
			value: 50,
			meta: {},
			name: 'Discount',
		},
	],
};
