export const newHit = {
	priority: 0,
	id: '32bbaf8b-aeaf-45d2-bfc9-1770a33e0d07',
	entity_id: 'RIS-BTH-8332 ',
	type: 'product',
	tenant_id: 'd236ee6a-0350-43cf-9269-d146810b44cb',
	is_categorised: true,
	product_images: ['2464640b-3772-4429-9075-b05467ad34e1', 'd236ee6a-0350-43cf-9269-d146810b44cb'],
	badges: [
		{
			values: [
				{
					text: '100 In Stock',
					background_color: '#7DA50E',
					text_type: 'h1/h2/h3/h4/h5/h6/subtitle1/subtitle2/body1/body2/caption/button/overline',
					text_color: '#FFFFFF',
					priority: 2,
				},
				{
					text: 'Badge 2',
					background_color: '#6BA6FE',
					text_type: 'h1/h2/h3/h4/h5/h6/subtitle1/subtitle2/body1/body2/caption/button/overline',
					text_color: '#FFFFFF',
					priority: 1,
				},
			],
			position: 'top-right',
		},
		{
			values: [
				{
					text: '100 In Stock',
					background_color: '#7DA50E',
					text_type: 'h1/h2/h3/h4/h5/h6/subtitle1/subtitle2/body1/body2/caption/button/overline',
					text_color: '#FFFFFF',
					priority: 1,
				},
			],
			position: 'top-left',
		},
		{
			values: [
				{
					text: '100 In Stock',
					background_color: '#F9DFAC',
					text_type: 'h1/h2/h3/h4/h5/h6/subtitle1/subtitle2/body1/body2/caption/button/overline',
					text_color: 'primary/secondary/default',
					priority: '',
				},
			],
			position: 'bottom-right',
		},
		{
			values: [
				{
					text: '100 In Stock',
					background_color: '#F9DFAC',
					text_type: 'h1/h2/h3/h4/h5/h6/subtitle1/subtitle2/body1/body2/caption/button/overline',
					text_color: 'primary/secondary/default',
					priority: '',
				},
			],
			position: 'bottom-left',
		},
	],
	favourite: {
		is_visible: 'true/false',
		is_favourite: 'true/false',
	},
	lines: [
		{
			priority: 1,
			line: [
				{
					text: 'ID - 2435445',
					text_type: 'h1/h2/h3/h4/h5/h6/subtitle1/subtitle2/body1/body2/caption/button/overline',
					text_color: 'primary/secondary/default',
					position: 'left',
					key: 'product_id',
				},
				{
					text: '+2 Options',
					key: 'variant_count',
					text_type: 'h1/h2/h3/h4/h5/h6/subtitle1/subtitle2/body1/body2/caption/button/overline',
					text_color: 'primary/secondary/default',
					position: 'right',
				},
			],
		},
		{
			priority: 2,
			line: [
				{
					text: 'Title - Hi there',
					text_type: 'h1/h2/h3/h4/h5/h6/subtitle1/subtitle2/body1/body2/caption/button/overline',
					text_color: 'primary/secondary/default',
					position: 'left',
				},
			],
		},
		{
			priority: 3,
			line: [
				{
					text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nunc sit amet ultricies ultricies, nunc nisl aliquam nunc, sit amet ultricies lorem ipsum sit amet dolor. Sed euismod, nunc sit amet ultricies ultricies, nunc nisl aliquam nunc, sit amet ultricies lorem ipsum sit amet dolor.',
					text_type: 'caption',
					truncate: 2,
					text_color: '#676D77',
					position: 'left',
				},
			],
		},
		{
			priority: 3,
			line: [
				{
					text: 'Lorem left ',
					text_type: 'body-2',
					truncate: 2,
					text_color: '#676D77',
					position: 'left',
				},
				{
					text: 'Lorem right ',
					text_type: 'body-2',
					truncate: 2,
					text_color: '#6BA6FE',
					position: 'right',
				},
			],
		},
	],
	inventory: {
		min_order_quantity: 5,
		incremental_value: 10,
		max_order_quantity: 100,
		stock: 100,
	},
	cart: [
		{
			is_added: 'true/false',
			quantity: 1,
			product_id: 'abc',
		},
		{
			is_added: 'true/false',
			quantity: 1,
			product_id: 'abc-a',
		},
	],
	variant: {
		has_variant: 'true',
		count: 4,
	},
};
