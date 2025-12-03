export const response = {
	status: 'success',
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
			'custom_attributes::81569f54-aa20-42df-b0c8-5e3c21505480::value',
			'custom_attributes::b2be24ab-09a6-4406-98b0-e5b4ec1475b3::name',
		],
		style: {
			font_size: 24,
			color: '#fffff',
		},
	},
};
