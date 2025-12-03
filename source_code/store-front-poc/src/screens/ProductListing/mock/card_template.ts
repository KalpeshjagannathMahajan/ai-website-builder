export const all_product_card_template = {
	template_id: 1,
	rows: [
		[
			{
				key: 'name',
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
			'custom_attributes::014c1ba0-c885-4cdc-b589-62d68f3f66c8::value',
			'custom_attributes::f52bedd2-a7f1-46bf-acd4-addcd69ffac9::value',
		],
		style: {
			font_size: 24,
			color: '#fffff',
		},
	},
};
