export const response = {
	status_code: 200,
	content: {
		message: 'success',
		data: [
			{
				id: '0fbdb281-5f96-4247-b38f-f81896aedca1',
				name: 'Joust Duffle Bag',
				type: 'product',
				moq: '50',
				sku_id: 'KM001',
				tenant_id: 'cdcd4637-2216-4fe2-86fe-b540d9f98c7c',
				parent_id: '',
				collections: [
					{
						id: '1c21d88b-0a8f-4bd3-a5b3-2e3d5e1d7f96',
						name: 'category 5',
					},
					{
						id: '05e419d7-7cf3-43f5-9301-dfba838911e7',
						name: 'category 6',
					},
				],
				custom_attributes: {
					'f7a4b289-73dd-4568-9d0f-3c90f985d7b1': {
						id: 'f7a4b289-73dd-4568-9d0f-3c90f985d7b1',
						name: 'Description',
						value:
							'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
						type: 'textarea',
						composite: {},
					},
					'81569f54-aa20-42df-b0c8-5e3c21505480': {
						id: '81569f54-aa20-42df-b0c8-5e3c21505480',
						name: 'Color',
						value: 'Red',
						type: 'select',
						composite: {},
					},
					'b2be24ab-09a6-4406-98b0-e5b4ec1475b3': {
						id: 'b2be24ab-09a6-4406-98b0-e5b4ec1475b3',
						name: 'Customizable',
						value: 'true',
						type: 'boolean',
						composite: {},
					},
				},
				created_at: 'timestamp',
				updated_at: 'timestamp',
				media: [
					{
						id: '1',
						url: 'https://magento.sourcerer.tech/pub/media/catalog/product/s/c/screenshot_2023-07-06_at_9.00.39_pm.png',
						type: 'image',
						is_primary: true,
					},
					{
						id: '2',
						url: 'https://www.google.com/vid001.mp4',
						type: 'video',
						is_primary: false,
					},
				],
				category: [
					{
						id: '1c21d88b-0a8f-4bd3-a5b3-2e3d5e1d7f96',
						name: 'category 5',
						parent_id: '6c799911-2815-4e47-9b1e-caf2b15a489d',
						level: 2,
						path: '1,2',
						children: '5,6',
					},
					{
						id: '05e419d7-7cf3-43f5-9301-dfba838911e7',
						name: 'category 6',
						parent_id: '6c799911-2815-4e47-9b1e-caf2b15a489d',
						level: 2,
						path: '1,2',
						children: '7',
					},
				],
				meta: {},
				minimum_order_quantity: 15,
				max_order_quantity: 100,
				step_increment: 10,
				pricing: {
					price: 100, //will be added dynamically
					unit: {
						id: '7da4e00f-eb9a-4138-96f6-725ed78797c7',
						value: 'Rs',
					},
					final_value: '$100 - $120',
					pricing_rule: {
						//will be filtered based on price level [ customer / customer group ]
						volume: {
							name: 'Volume Discount',
							tiers: [
								{
									min_qty: 1,
									max_qty: 10,
									type: 'fixed', //fixed, percentage_discount, value_discount
									value: 10,
									final_price: 100,
								},
								{
									min_qty: 1,
									max_qty: 10,
									type: 'fixed', //fixed, percentage_discount, value_discount
									value: 10,
									final_price: 100,
								},
								{
									min_qty: 1,
									max_qty: 10,
									type: 'fixed', //fixed, percentage_discount, value_discount
									value: 10,
									final_price: 100,
								},
							],
						},
					},
				},
			},
			{
				id: '0fbdb281-5f96-4247-b38f-f81896aedca2',
				name: 'Joust Duffle 1',
				type: 'product',
				moq: '50',
				sku_id: 'KM001',
				tenant_id: 'cdcd4637-2216-4fe2-86fe-b540d9f98c7c',
				parent_id: '',
				collections: [
					{
						id: '1c21d88b-0a8f-4bd3-a5b3-2e3d5e1d7f96',
						name: 'category 5',
					},
					{
						id: '05e419d7-7cf3-43f5-9301-dfba838911e7',
						name: 'category 6',
					},
				],
				custom_attributes: {
					'f7a4b289-73dd-4568-9d0f-3c90f985d7b1': {
						id: 'f7a4b289-73dd-4568-9d0f-3c90f985d7b1',
						name: 'Description',
						value:
							'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
						type: 'textarea',
						composite: {},
					},
					'81569f54-aa20-42df-b0c8-5e3c21505480': {
						id: '81569f54-aa20-42df-b0c8-5e3c21505480',
						name: 'Color',
						value: 'Red',
						type: 'select',
						composite: {},
					},
					'b2be24ab-09a6-4406-98b0-e5b4ec1475b3': {
						id: 'b2be24ab-09a6-4406-98b0-e5b4ec1475b3',
						name: 'Customizable',
						value: 'true',
						type: 'boolean',
						composite: {},
					},
				},
				created_at: 'timestamp',
				updated_at: 'timestamp',
				media: [
					{
						id: '1',
						url: 'https://magento.sourcerer.tech/pub/media/catalog/product/s/c/screenshot_2023-07-06_at_9.00.39_pm.png',
						type: 'image',
						is_primary: true,
					},
					{
						id: '2',
						url: 'https://www.google.com/vid001.mp4',
						type: 'video',
						is_primary: false,
					},
				],
				category: [
					{
						id: '1c21d88b-0a8f-4bd3-a5b3-2e3d5e1d7f96',
						name: 'category 5',
						parent_id: '6c799911-2815-4e47-9b1e-caf2b15a489d',
						level: 2,
						path: '1,2',
						children: '5,6',
					},
					{
						id: '05e419d7-7cf3-43f5-9301-dfba838911e7',
						name: 'category 6',
						parent_id: '6c799911-2815-4e47-9b1e-caf2b15a489d',
						level: 2,
						path: '1,2',
						children: '7',
					},
				],
				meta: {},
				pricing: {
					price: 100, //will be added dynamically
					unit: {
						id: '7da4e00f-eb9a-4138-96f6-725ed78797c7',
						value: 'Rs',
					},
					final_value: '$100 - $120',
					pricing_rule: {
						//will be filtered based on price level [ customer / customer group ]
						volume: {
							name: 'Volume Discount',
							tiers: [
								{
									min_qty: 1,
									max_qty: 10,
									type: 'fixed', //fixed, percentage_discount, value_discount
									value: 10,
									final_price: 100,
								},
								{
									min_qty: 1,
									max_qty: 10,
									type: 'fixed', //fixed, percentage_discount, value_discount
									value: 10,
									final_price: 100,
								},
								{
									min_qty: 1,
									max_qty: 10,
									type: 'fixed', //fixed, percentage_discount, value_discount
									value: 10,
									final_price: 100,
								},
							],
						},
					},
				},
				variants_meta: {
					variant_count: 'integer',
					hinges_value_map: {
						'05e00cc4-0e33-417c-b229-edce0d0ef637': [
							{ value: 'Blue', priority: 59, type: 'color/image', type_value: '#694d99/image_url' },
							{ value: 'Red', priority: 4, type: 'color/image', type_value: '#694d99/image_url' },
							{ value: 'Black', priority: 34, type: 'color/image', type_value: '#694d99/image_url' },
						],
						'5f7fe97b-c639-4170-8460-2c6872d19ee9': [
							{ value: '100X75', priority: 59, type: 'color/image', type_value: '#694d99/image_url' },
							{ value: '25X25', priority: 4, type: 'color/image', type_value: '#694d99/image_url' },
							{ value: 'Test 2', priority: 34, type: 'color/image', type_value: '#694d99/image_url' },
						],
					},
					variant_data_map: [
						{
							'05e00cc4-0e33-417c-b229-edce0d0ef637': 'Blue',
							'5f7fe97b-c639-4170-8460-2c6872d19ee9': '100X75',
							product_id: 'e03a7d4e-8045-4742-9577-a2cc86fff712',
						},
						{
							'05e00cc4-0e33-417c-b229-edce0d0ef637': 'Red',
							'5f7fe97b-c639-4170-8460-2c6872d19ee9': 'Test 2',
							product_id: '94091f49-6768-41be-a52f-b6ba65c15b88',
						},
						{
							'05e00cc4-0e33-417c-b229-edce0d0ef637': 'Red',
							'5f7fe97b-c639-4170-8460-2c6872d19ee9': '100X75',
							product_id: 'ec8e3e3a-b09e-4b8d-a91d-269ca02ee654',
						},
					],
					hinge_attributes: [
						{
							id: '5f7fe97b-c639-4170-8460-2c6872d19ee9',
							name: 'color',
							priority: 132,
						},
						{
							id: '05e00cc4-0e33-417c-b229-edce0d0ef637',
							name: 'size',
							priority: 122,
						},
					],
				},
			},
			{
				id: '0fbdb281-5f96-4247-b38f-f81896aedca3',
				name: 'Joust Duffle 2',
				type: 'product',
				moq: '50',
				sku_id: 'KM002',
				tenant_id: 'cdcd4637-2216-4fe2-86fe-b540d9f98c7c',
				parent_id: '',
				collections: [
					{
						id: '1c21d88b-0a8f-4bd3-a5b3-2e3d5e1d7f96',
						name: 'category 5',
					},
					{
						id: '05e419d7-7cf3-43f5-9301-dfba838911e7',
						name: 'category 6',
					},
				],
				custom_attributes: {
					'f7a4b289-73dd-4568-9d0f-3c90f985d7b1': {
						id: 'f7a4b289-73dd-4568-9d0f-3c90f985d7b1',
						name: 'Description',
						value:
							'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
						type: 'textarea',
						composite: {},
					},
					'81569f54-aa20-42df-b0c8-5e3c21505480': {
						id: '81569f54-aa20-42df-b0c8-5e3c21505480',
						name: 'Color',
						value: 'Red',
						type: 'select',
						composite: {},
					},
					'b2be24ab-09a6-4406-98b0-e5b4ec1475b3': {
						id: 'b2be24ab-09a6-4406-98b0-e5b4ec1475b3',
						name: 'Customizable',
						value: 'true',
						type: 'boolean',
						composite: {},
					},
				},
				created_at: 'timestamp',
				updated_at: 'timestamp',
				media: [
					{
						id: '1',
						url: 'https://magento.sourcerer.tech/pub/media/catalog/product/s/c/screenshot_2023-07-06_at_9.00.39_pm.png',
						type: 'image',
						is_primary: true,
					},
					{
						id: '2',
						url: 'https://www.google.com/vid001.mp4',
						type: 'video',
						is_primary: false,
					},
				],
				category: [
					{
						id: '1c21d88b-0a8f-4bd3-a5b3-2e3d5e1d7f96',
						name: 'category 5',
						parent_id: '6c799911-2815-4e47-9b1e-caf2b15a489d',
						level: 2,
						path: '1,2',
						children: '5,6',
					},
					{
						id: '05e419d7-7cf3-43f5-9301-dfba838911e7',
						name: 'category 6',
						parent_id: '6c799911-2815-4e47-9b1e-caf2b15a489d',
						level: 2,
						path: '1,2',
						children: '7',
					},
				],
				meta: {},
				pricing: {
					price: 100, //will be added dynamically
					unit: {
						id: '7da4e00f-eb9a-4138-96f6-725ed78797c7',
						value: 'Rs',
					},
					final_value: '$120',
					pricing_rule: {
						//will be filtered based on price level [ customer / customer group ]
						volume: {
							name: 'Volume Discount',
							tiers: [
								{
									min_qty: 1,
									max_qty: 10,
									type: 'fixed', //fixed, percentage_discount, value_discount
									value: 10,
									final_price: 100,
								},
								{
									min_qty: 1,
									max_qty: 10,
									type: 'fixed', //fixed, percentage_discount, value_discount
									value: 10,
									final_price: 100,
								},
								{
									min_qty: 1,
									max_qty: 10,
									type: 'fixed', //fixed, percentage_discount, value_discount
									value: 10,
									final_price: 100,
								},
							],
						},
					},
				},
				variants_meta: {
					variant_count: 'integer',
					hinges_value_map: {
						'05e00cc4-0e33-417c-b229-edce0d0ef637': [
							{ value: 'Blue', priority: 59, type: 'color/image', type_value: '#694d99/image_url' },
							{ value: 'Red', priority: 4, type: 'color/image', type_value: '#694d99/image_url' },
							{ value: 'Black', priority: 34, type: 'color/image', type_value: '#694d99/image_url' },
						],
						'5f7fe97b-c639-4170-8460-2c6872d19ee9': [
							{ value: '100X75', priority: 59, type: 'color/image', type_value: '#694d99/image_url' },
							{ value: '25X25', priority: 4, type: 'color/image', type_value: '#694d99/image_url' },
							{ value: 'Test 2', priority: 34, type: 'color/image', type_value: '#694d99/image_url' },
						],
					},
					variant_data_map: [
						{
							'05e00cc4-0e33-417c-b229-edce0d0ef637': 'Blue',
							'5f7fe97b-c639-4170-8460-2c6872d19ee9': '100X75',
							product_id: 'e03a7d4e-8045-4742-9577-a2cc86fff712',
						},
						{
							'05e00cc4-0e33-417c-b229-edce0d0ef637': 'Red',
							'5f7fe97b-c639-4170-8460-2c6872d19ee9': 'Test 2',
							product_id: '94091f49-6768-41be-a52f-b6ba65c15b88',
						},
						{
							'05e00cc4-0e33-417c-b229-edce0d0ef637': 'Red',
							'5f7fe97b-c639-4170-8460-2c6872d19ee9': '100X75',
							product_id: 'ec8e3e3a-b09e-4b8d-a91d-269ca02ee654',
						},
					],
					hinge_attributes: [
						{
							id: '5f7fe97b-c639-4170-8460-2c6872d19ee9',
							name: 'color',
							priority: 132,
						},
						{
							id: '05e00cc4-0e33-417c-b229-edce0d0ef637',
							name: 'size',
							priority: 122,
						},
					],
				},
			},
			{
				id: '0fbdb281-5f96-4247-b38f-f81896aedca4',
				name: 'Joust Duffle 1',
				type: 'product',
				moq: '50',
				sku_id: 'KM001',
				tenant_id: 'cdcd4637-2216-4fe2-86fe-b540d9f98c7c',
				parent_id: '',
				collections: [
					{
						id: '1c21d88b-0a8f-4bd3-a5b3-2e3d5e1d7f96',
						name: 'category 5',
					},
					{
						id: '05e419d7-7cf3-43f5-9301-dfba838911e7',
						name: 'category 6',
					},
				],
				custom_attributes: {
					'f7a4b289-73dd-4568-9d0f-3c90f985d7b1': {
						id: 'f7a4b289-73dd-4568-9d0f-3c90f985d7b1',
						name: 'Description',
						value:
							'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
						type: 'textarea',
						composite: {},
					},
					'81569f54-aa20-42df-b0c8-5e3c21505480': {
						id: '81569f54-aa20-42df-b0c8-5e3c21505480',
						name: 'Color',
						value: 'Red',
						type: 'select',
						composite: {},
					},
					'b2be24ab-09a6-4406-98b0-e5b4ec1475b3': {
						id: 'b2be24ab-09a6-4406-98b0-e5b4ec1475b3',
						name: 'Customizable',
						value: 'true',
						type: 'boolean',
						composite: {},
					},
				},
				created_at: 'timestamp',
				updated_at: 'timestamp',
				media: [
					{
						id: '1',
						url: 'https://magento.sourcerer.tech/pub/media/catalog/product/s/c/screenshot_2023-07-06_at_9.00.39_pm.png',
						type: 'image',
						is_primary: true,
					},
					{
						id: '2',
						url: 'https://www.google.com/vid001.mp4',
						type: 'video',
						is_primary: false,
					},
				],
				category: [
					{
						id: '1c21d88b-0a8f-4bd3-a5b3-2e3d5e1d7f96',
						name: 'category 5',
						parent_id: '6c799911-2815-4e47-9b1e-caf2b15a489d',
						level: 2,
						path: '1,2',
						children: '5,6',
					},
					{
						id: '05e419d7-7cf3-43f5-9301-dfba838911e7',
						name: 'category 6',
						parent_id: '6c799911-2815-4e47-9b1e-caf2b15a489d',
						level: 2,
						path: '1,2',
						children: '7',
					},
				],
				meta: {},
				pricing: {
					price: 100, //will be added dynamically
					unit: {
						id: '7da4e00f-eb9a-4138-96f6-725ed78797c7',
						value: 'Rs',
					},
					final_value: '$100 - $120',
					pricing_rule: {
						//will be filtered based on price level [ customer / customer group ]
						volume: {
							name: 'Volume Discount',
							tiers: [
								{
									min_qty: 1,
									max_qty: 10,
									type: 'fixed', //fixed, percentage_discount, value_discount
									value: 10,
									final_price: 100,
								},
								{
									min_qty: 1,
									max_qty: 10,
									type: 'fixed', //fixed, percentage_discount, value_discount
									value: 10,
									final_price: 100,
								},
								{
									min_qty: 1,
									max_qty: 10,
									type: 'fixed', //fixed, percentage_discount, value_discount
									value: 10,
									final_price: 100,
								},
							],
						},
					},
				},
				variants_meta: {
					variant_count: 'integer',
					hinges_value_map: {
						'05e00cc4-0e33-417c-b229-edce0d0ef637': [
							{ value: 'Blue', priority: 59, type: 'color/image', type_value: '#694d99/image_url' },
							{ value: 'Red', priority: 4, type: 'color/image', type_value: '#694d99/image_url' },
							{ value: 'Black', priority: 34, type: 'color/image', type_value: '#694d99/image_url' },
						],
						'5f7fe97b-c639-4170-8460-2c6872d19ee9': [
							{ value: '100X75', priority: 59, type: 'color/image', type_value: '#694d99/image_url' },
							{ value: '25X25', priority: 4, type: 'color/image', type_value: '#694d99/image_url' },
							{ value: 'Test 2', priority: 34, type: 'color/image', type_value: '#694d99/image_url' },
						],
					},
					variant_data_map: [
						{
							'05e00cc4-0e33-417c-b229-edce0d0ef637': 'Blue',
							'5f7fe97b-c639-4170-8460-2c6872d19ee9': '100X75',
							product_id: 'e03a7d4e-8045-4742-9577-a2cc86fff712',
						},
						{
							'05e00cc4-0e33-417c-b229-edce0d0ef637': 'Red',
							'5f7fe97b-c639-4170-8460-2c6872d19ee9': 'Test 2',
							product_id: '94091f49-6768-41be-a52f-b6ba65c15b88',
						},
						{
							'05e00cc4-0e33-417c-b229-edce0d0ef637': 'Red',
							'5f7fe97b-c639-4170-8460-2c6872d19ee9': '100X75',
							product_id: 'ec8e3e3a-b09e-4b8d-a91d-269ca02ee654',
						},
					],
					hinge_attributes: [
						{
							id: '5f7fe97b-c639-4170-8460-2c6872d19ee9',
							name: 'color',
							priority: 132,
						},
						{
							id: '05e00cc4-0e33-417c-b229-edce0d0ef637',
							name: 'size',
							priority: 122,
						},
					],
				},
			},
			{
				id: '0fbdb281-5f96-4247-b38f-f81896aedca5',
				name: 'Joust Duffle 1',
				type: 'product',
				moq: '50',
				sku_id: 'KM001',
				tenant_id: 'cdcd4637-2216-4fe2-86fe-b540d9f98c7c',
				parent_id: '',
				collections: [
					{
						id: '1c21d88b-0a8f-4bd3-a5b3-2e3d5e1d7f96',
						name: 'category 5',
					},
					{
						id: '05e419d7-7cf3-43f5-9301-dfba838911e7',
						name: 'category 6',
					},
				],
				custom_attributes: {
					'f7a4b289-73dd-4568-9d0f-3c90f985d7b1': {
						id: 'f7a4b289-73dd-4568-9d0f-3c90f985d7b1',
						name: 'Description',
						value:
							'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
						type: 'textarea',
						composite: {},
					},
					'81569f54-aa20-42df-b0c8-5e3c21505480': {
						id: '81569f54-aa20-42df-b0c8-5e3c21505480',
						name: 'Color',
						value: 'Red',
						type: 'select',
						composite: {},
					},
					'b2be24ab-09a6-4406-98b0-e5b4ec1475b3': {
						id: 'b2be24ab-09a6-4406-98b0-e5b4ec1475b3',
						name: 'Customizable',
						value: 'true',
						type: 'boolean',
						composite: {},
					},
				},
				created_at: 'timestamp',
				updated_at: 'timestamp',
				media: [
					{
						id: '1',
						url: 'https://magento.sourcerer.tech/pub/media/catalog/product/s/c/screenshot_2023-07-06_at_9.00.39_pm.png',
						type: 'image',
						is_primary: true,
					},
					{
						id: '2',
						url: 'https://www.google.com/vid001.mp4',
						type: 'video',
						is_primary: false,
					},
				],
				category: [
					{
						id: '1c21d88b-0a8f-4bd3-a5b3-2e3d5e1d7f96',
						name: 'category 5',
						parent_id: '6c799911-2815-4e47-9b1e-caf2b15a489d',
						level: 2,
						path: '1,2',
						children: '5,6',
					},
					{
						id: '05e419d7-7cf3-43f5-9301-dfba838911e7',
						name: 'category 6',
						parent_id: '6c799911-2815-4e47-9b1e-caf2b15a489d',
						level: 2,
						path: '1,2',
						children: '7',
					},
				],
				meta: {},
				pricing: {
					price: 100, //will be added dynamically
					unit: {
						id: '7da4e00f-eb9a-4138-96f6-725ed78797c7',
						value: 'Rs',
					},
					final_value: '$100 - $120',
					pricing_rule: {
						//will be filtered based on price level [ customer / customer group ]
						volume: {
							name: 'Volume Discount',
							tiers: [
								{
									min_qty: 1,
									max_qty: 10,
									type: 'fixed', //fixed, percentage_discount, value_discount
									value: 10,
									final_price: 100,
								},
								{
									min_qty: 1,
									max_qty: 10,
									type: 'fixed', //fixed, percentage_discount, value_discount
									value: 10,
									final_price: 100,
								},
								{
									min_qty: 1,
									max_qty: 10,
									type: 'fixed', //fixed, percentage_discount, value_discount
									value: 10,
									final_price: 100,
								},
							],
						},
					},
				},
				variants_meta: {
					variant_count: 'integer',
					hinges_value_map: {
						'05e00cc4-0e33-417c-b229-edce0d0ef637': [
							{ value: 'Blue', priority: 59, type: 'color/image', type_value: '#694d99/image_url' },
							{ value: 'Red', priority: 4, type: 'color/image', type_value: '#694d99/image_url' },
							{ value: 'Black', priority: 34, type: 'color/image', type_value: '#694d99/image_url' },
						],
						'5f7fe97b-c639-4170-8460-2c6872d19ee9': [
							{ value: '100X75', priority: 59, type: 'color/image', type_value: '#694d99/image_url' },
							{ value: '25X25', priority: 4, type: 'color/image', type_value: '#694d99/image_url' },
							{ value: 'Test 2', priority: 34, type: 'color/image', type_value: '#694d99/image_url' },
						],
					},
					variant_data_map: [
						{
							'05e00cc4-0e33-417c-b229-edce0d0ef637': 'Blue',
							'5f7fe97b-c639-4170-8460-2c6872d19ee9': '100X75',
							product_id: 'e03a7d4e-8045-4742-9577-a2cc86fff712',
						},
						{
							'05e00cc4-0e33-417c-b229-edce0d0ef637': 'Red',
							'5f7fe97b-c639-4170-8460-2c6872d19ee9': 'Test 2',
							product_id: '94091f49-6768-41be-a52f-b6ba65c15b88',
						},
						{
							'05e00cc4-0e33-417c-b229-edce0d0ef637': 'Red',
							'5f7fe97b-c639-4170-8460-2c6872d19ee9': '100X75',
							product_id: 'ec8e3e3a-b09e-4b8d-a91d-269ca02ee654',
						},
					],
					hinge_attributes: [
						{
							id: '5f7fe97b-c639-4170-8460-2c6872d19ee9',
							name: 'color',
							priority: 132,
						},
						{
							id: '05e00cc4-0e33-417c-b229-edce0d0ef637',
							name: 'size',
							priority: 122,
						},
					],
				},
			},
			{
				id: '0fbdb281-5f96-4247-b38f-f81896aedca6',
				name: 'Joust Duffle 1',
				type: 'product',
				moq: '50',
				sku_id: 'KM001',
				tenant_id: 'cdcd4637-2216-4fe2-86fe-b540d9f98c7c',
				parent_id: '',
				collections: [
					{
						id: '1c21d88b-0a8f-4bd3-a5b3-2e3d5e1d7f96',
						name: 'category 5',
					},
					{
						id: '05e419d7-7cf3-43f5-9301-dfba838911e7',
						name: 'category 6',
					},
				],
				custom_attributes: {
					'f7a4b289-73dd-4568-9d0f-3c90f985d7b1': {
						id: 'f7a4b289-73dd-4568-9d0f-3c90f985d7b1',
						name: 'Description',
						value:
							'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
						type: 'textarea',
						composite: {},
					},
					'81569f54-aa20-42df-b0c8-5e3c21505480': {
						id: '81569f54-aa20-42df-b0c8-5e3c21505480',
						name: 'Color',
						value: 'Red',
						type: 'select',
						composite: {},
					},
					'b2be24ab-09a6-4406-98b0-e5b4ec1475b3': {
						id: 'b2be24ab-09a6-4406-98b0-e5b4ec1475b3',
						name: 'Customizable',
						value: 'true',
						type: 'boolean',
						composite: {},
					},
				},
				created_at: 'timestamp',
				updated_at: 'timestamp',
				media: [
					{
						id: '1',
						url: 'https://magento.sourcerer.tech/pub/media/catalog/product/s/c/screenshot_2023-07-06_at_9.00.39_pm.png',
						type: 'image',
						is_primary: true,
					},
					{
						id: '2',
						url: 'https://www.google.com/vid001.mp4',
						type: 'video',
						is_primary: false,
					},
				],
				category: [
					{
						id: '1c21d88b-0a8f-4bd3-a5b3-2e3d5e1d7f96',
						name: 'category 5',
						parent_id: '6c799911-2815-4e47-9b1e-caf2b15a489d',
						level: 2,
						path: '1,2',
						children: '5,6',
					},
					{
						id: '05e419d7-7cf3-43f5-9301-dfba838911e7',
						name: 'category 6',
						parent_id: '6c799911-2815-4e47-9b1e-caf2b15a489d',
						level: 2,
						path: '1,2',
						children: '7',
					},
				],
				meta: {},
				pricing: {
					price: 100, //will be added dynamically
					unit: {
						id: '7da4e00f-eb9a-4138-96f6-725ed78797c7',
						value: 'Rs',
					},
					final_value: '$100 - $120',
					pricing_rule: {
						//will be filtered based on price level [ customer / customer group ]
						volume: {
							name: 'Volume Discount',
							tiers: [
								{
									min_qty: 1,
									max_qty: 10,
									type: 'fixed', //fixed, percentage_discount, value_discount
									value: 10,
									final_price: 100,
								},
								{
									min_qty: 1,
									max_qty: 10,
									type: 'fixed', //fixed, percentage_discount, value_discount
									value: 10,
									final_price: 100,
								},
								{
									min_qty: 1,
									max_qty: 10,
									type: 'fixed', //fixed, percentage_discount, value_discount
									value: 10,
									final_price: 100,
								},
							],
						},
					},
				},
				variants_meta: {
					variant_count: 'integer',
					hinges_value_map: {
						'05e00cc4-0e33-417c-b229-edce0d0ef637': [
							{ value: 'Blue', priority: 59, type: 'color/image', type_value: '#694d99/image_url' },
							{ value: 'Red', priority: 4, type: 'color/image', type_value: '#694d99/image_url' },
							{ value: 'Black', priority: 34, type: 'color/image', type_value: '#694d99/image_url' },
						],
						'5f7fe97b-c639-4170-8460-2c6872d19ee9': [
							{ value: '100X75', priority: 59, type: 'color/image', type_value: '#694d99/image_url' },
							{ value: '25X25', priority: 4, type: 'color/image', type_value: '#694d99/image_url' },
							{ value: 'Test 2', priority: 34, type: 'color/image', type_value: '#694d99/image_url' },
						],
					},
					variant_data_map: [
						{
							'05e00cc4-0e33-417c-b229-edce0d0ef637': 'Blue',
							'5f7fe97b-c639-4170-8460-2c6872d19ee9': '100X75',
							product_id: 'e03a7d4e-8045-4742-9577-a2cc86fff712',
						},
						{
							'05e00cc4-0e33-417c-b229-edce0d0ef637': 'Red',
							'5f7fe97b-c639-4170-8460-2c6872d19ee9': 'Test 2',
							product_id: '94091f49-6768-41be-a52f-b6ba65c15b88',
						},
						{
							'05e00cc4-0e33-417c-b229-edce0d0ef637': 'Red',
							'5f7fe97b-c639-4170-8460-2c6872d19ee9': '100X75',
							product_id: 'ec8e3e3a-b09e-4b8d-a91d-269ca02ee654',
						},
					],
					hinge_attributes: [
						{
							id: '5f7fe97b-c639-4170-8460-2c6872d19ee9',
							name: 'color',
							priority: 132,
						},
						{
							id: '05e00cc4-0e33-417c-b229-edce0d0ef637',
							name: 'size',
							priority: 122,
						},
					],
				},
			},
		],
	},
};
