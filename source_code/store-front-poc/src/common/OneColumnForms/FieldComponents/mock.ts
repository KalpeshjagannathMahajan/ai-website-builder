export const response = [
	{
		key: 'buyer_access',
		name: 'Buyer access',
		priority: 0,
		attributes: [
			// All individual form controls
			{
				key: 'buyer_access',
				name: '',
				type: 'radio',
				dType: 'radioGroup',
				value: '52c51be3-244d-4f3a-a6fe-b42c04e8c42d',
				priority: 1,
				required: true,
				options: [
					{
						value: 'self',
						label: 'Buyers assigned to self',
					},
					{
						value: 'all',
						label: 'All buyers',
					},
					{
						value: 'select',
						label: 'Select users to access their assigned buyers',
						additional_attributes: [
							{
								key: 'sales_rep',
								name: 'Users',
								type: 'multi_select',
								dType: 'multi_select',
								value: [],
								priority: 1,
								required: true,
								options: [
									{ value: 'option1', label: 'Option 1' },
									{ value: 'option2', label: 'Option 2' },
									{ value: 'option3', label: 'Option 3' },
									{ value: 'option4', label: 'Option 4' },
									{ value: 'option5', label: 'Option 5' },
								],
							},
						],
					},
				],
			},
		],
	},
];
