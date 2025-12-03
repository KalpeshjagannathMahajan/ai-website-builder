export const listing_config_mock = {
	status_code: 200,
	content: {
		message: 'success',
		data: {
			rails: [
				{
					name: 'Recommended',
					priority: 1,
					type: 'recommended_product',
					template: {
						template_id: 1,

						rows: [
							[
								{
									key: 'name', // Name here
									style: {
										fontSize: '14px',
										color: 'rgba(0, 0, 0, 0.87)',
										width: '88%',
									},
								},
							],
							[
								{
									key: 'sku_id',
									style: {
										fontSize: '14px',
										color: 'rgba(0, 0, 0, 0.60)',
										width: '100%',
									},
								},
							],
							[
								{
									key: 'pricing::price',
									style: {
										fontSize: '14px',
										color: 'rgba(0, 0, 0, 0.87)',
										width: '100%',
										fontWeight: '700',
										textAlign: 'start',
									},
								},
							],
						],
						attributes: {
							keys: [
								'custom_attributes::81569f54-aa20-42df-b0c8-5e3c21505480::value',
								'custom_attributes::b2be24ab-09a6-4406-98b0-e5b4ec1475b3::name',
							],
							style: {
								font_size: 24,
								color: '#fffff',
							},
						},
					},
				},
				// {
				// 	name: 'Previously Ordered',
				// 	priority: 2,
				// 	type: 'previously_ordered',
				// 	template: {
				// 		template_id: 1,
				// 		order_history: [
				// 			[
				// 				{
				// 					key: 'order_history::81569f54-aa20-42df-b0c8-5e3c21505480::value',
				// 					label: 'Value',
				// 					style: {
				// 						fontSize: '14px',
				// 						fontWeight: '700',
				// 					},
				// 				},
				// 			],
				// 			[
				// 				{
				// 					key: 'order_history::b2be24ab-09a6-4406-98b0-e5b4ec1475b3::value',
				// 					label: 'Quantity',
				// 					style: {
				// 						fontSize: '14px',
				// 						fontWeight: '700',
				// 					},
				// 				},
				// 			],
				// 		],
				// 		rows: [
				// 			[
				// 				{
				// 					key: 'name', // Name here
				// 					style: {
				// 						fontSize: '14px',
				// 						color: 'rgba(0, 0, 0, 0.87)',
				// 						width: '88%',
				// 						margin: '4px 0px',
				// 					},
				// 				},
				// 			],
				// 			[
				// 				{
				// 					key: 'sku_id',
				// 					style: {
				// 						fontSize: '14px',
				// 						color: 'rgba(0, 0, 0, 0.60)',
				// 						width: '100%',
				// 						margin: '4px 0px',
				// 					},
				// 				},
				// 			],
				// 			[
				// 				{
				// 					key: 'pricing::price',
				// 					style: {
				// 						fontSize: '14px',
				// 						color: 'rgba(0, 0, 0, 0.87)',
				// 						width: '100%',
				// 						fontWeight: '700',
				// 						textAlign: 'start',
				// 						margin: '4px 0px',
				// 					},
				// 				},
				// 			],
				// 		],
				// 		attributes: {
				// 			keys: [
				// 				'custom_attributes::81569f54-aa20-42df-b0c8-5e3c21505480::value',
				// 				'custom_attributes::b2be24ab-09a6-4406-98b0-e5b4ec1475b3::name',
				// 			],
				// 			style: {
				// 				font_size: 24,
				// 				color: '#fffff',
				// 			},
				// 		},
				// 	},
				// },
				{
					name: 'Categories',
					priority: 3,
					type: 'categories_rail',
				},
				{
					name: 'Collections',
					priority: 4,
					type: 'collections_rail',
				},
				{
					name: 'Explore all',
					priority: 5,
					type: 'all_products_section',
					template: {
						template_id: 2,
						rows: [
							[
								{
									key: 'name', // Name here
									style: {
										fontSize: '14px',
										color: 'rgba(0, 0, 0, 0.87)',
										width: '88%',
									},
								},
							],
							[
								{
									key: 'sku_id',
									style: {
										fontSize: '14px',
										color: 'rgba(0, 0, 0, 0.60)',
										width: '50%',
									},
								},
								{
									key: 'pricing::final_value',
									style: {
										fontSize: '14px',
										color: 'rgba(0, 0, 0, 0.87)',
										width: '50%',
										fontWeight: '700',
										textAlign: 'end',
									},
								},
							],
						],
						attributes: {
							keys: [
								'custom_attributes::014c1ba0-c885-4cdc-b589-62d68f3f66c8::value',
								'custom_attributes::b2be24ab-09a6-4406-98b0-e5b4ec1475b3::name',
							],
							style: {
								font_size: 24,
								color: '#fffff',
							},
						},
					},
				},
			],
		},
	},
};
