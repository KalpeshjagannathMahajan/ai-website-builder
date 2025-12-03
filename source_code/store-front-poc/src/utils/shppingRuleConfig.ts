export const columnDefs = [
	{
		headerName: 'Order Value',
		field: 'orderValue',
		suppressMovable: true,
		suppressMenu: true,
		menuTabs: [],
		cellStyle: {
			pointerEvents: 'none',
			whiteSpace: 'nowrap',
		},
	},
	{
		headerName: 'Shipping Discount',
		field: 'shippingDiscount',
		suppressMovable: true,
		suppressMenu: true,
		menuTabs: [],
		cellStyle: {
			pointerEvents: 'none',
			fontWeight: 700,
		},
	},
];

export const rule_config: any = {
	buyer_rules: {
		tax_rule: {
			and: [{ '==': [{ var: 'is_taxable' }, true] }, { and: [{ '>=': [{ var: 'tax_rate' }, 8] }, { '<=': [{ var: 'tax_rate' }, 9] }] }],
		},
		state_rule: {
			'!': {
				in: [
					{ var: 'value' },
					['HI', 'PR', 'AK', 'AS', 'GU', 'MP', 'VI', 'NM', 'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'],
				],
			},
		},
	},
	cart_total_rule: {
		category_rule: {
			and: [
				{
					'!': {
						in: [{ var: 'name' }, ['Pillows', 'Pillow Inserts', 'Duvet Inserts', 'Leather Furniture', 'Metal Bed', 'Swatches']],
					},
				},
			],
		},
	},
	cart_total_custom: { cart_total: [{ var: 'products' }, { var: 'items' }, { var: 'rule_config' }] },
	charge_rule: {
		if: [
			{
				'<': [{ var: 'cart_total' }, 100],
			},
			{
				charges: [
					{
						value_type: 'percentage',
						charge_type: 'tax',
						value: 15,
						name: 'Shipping Charge',
						priority: 2,
					},
				],
				nudge: {
					type: 'percentage',
					amount_needed: 500,
					discount: 5,
				},
				disclaimer: {},
			},
			{
				if: [
					{
						and: [{ '>=': [{ var: 'cart_total' }, 100] }, { '<': [{ var: 'cart_total' }, 500] }],
					},
					{
						charges: [
							{
								value_type: 'percentage',
								charge_type: 'tax',
								value: 18,
								name: 'Shipping Charge',
								priority: 3,
							},
							{
								value_type: 'percentage',
								charge_type: 'discount',
								value: 10,
								name: 'Discount',
								priority: 1,
							},
							{
								value_type: 'percentage',
								charge_type: 'charge_discount',
								value: 10,
								name: 'Shipping Discount',
								priority: 4,
							},
						],
						nudge: {
							type: 'percentage',
							amount_needed: 500,
							discount: 5,
						},
						disclaimer: {
							text_to_display: 'This is a black friday sale. Get 10 % flat discount on all products. Valid till 01/01/2025',
						},
					},
					{
						if: [
							{
								and: [{ '>=': [{ var: 'cart_total' }, 500] }, { '<': [{ var: 'cart_total' }, 1000] }],
							},
							{
								charges: [
									{
										value_type: 'percentage',
										charge_type: 'tax',
										value: 17,
										name: 'Shipping Charge',
										priority: 2,
									},
									{
										value_type: 'percentage',
										charge_type: 'charge_discount',
										value: 5,
										name: 'Shipping Discount',
										priority: 3,
									},
								],
								nudge: {
									type: 'percentage',
									amount_needed: 1000,
									discount: 10,
								},
								disclaimer: {},
							},
							{
								if: [
									{
										and: [{ '>=': [{ var: 'cart_total' }, 1000] }, { '<': [{ var: 'cart_total' }, 1800] }],
									},
									{
										charges: [
											{
												value_type: 'percentage',
												charge_type: 'tax',
												value: 17,
												name: 'Shipping Charge',
											},
											{
												value_type: 'percentage',
												charge_type: 'charge_discount',
												value: 10,
												name: 'Shipping Discount',
											},
										],
										nudge: {
											type: 'fixed',
											amount_needed: 1800,
											discount: 160,
										},
										disclaimer: {},
									},
									{
										if: [
											{
												'>=': [{ var: 'cart_total' }, 1800],
											},
											{
												charges: [
													{
														value_type: 'fixed',
														charge_type: 'tax',
														value: 320,
														name: 'Shipping Charge',
													},
													{
														value_type: 'fixed',
														charge_type: 'charge_discount',
														value: 160,
														name: 'Shipping Discount',
													},
												],
												nudge: {},
												disclaimer: {},
											},
										],
									},
								],
							},
						],
					},
				],
			},
		],
	},
};
