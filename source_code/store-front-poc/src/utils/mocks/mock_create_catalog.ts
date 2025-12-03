export const response = {
	message: 'Ok',
	status_code: 200,
	success: true,
	data: {
		sections: [
			{
				key: 'basic_details',
				name: 'Basic Details',
				attributes: [
					{
						key: 'name',
						name: 'Name',
						type: 'text',
						dType: 'text',
						value: '',
						priority: 0,
						required: true,
					},
					{
						key: 'description',
						name: 'Description',
						type: 'text',
						dType: 'text',
						value: '',
						priority: 2,
						required: false,
					},
					{
						key: 'status',
						name: 'Status',
						type: 'select',
						dType: 'select',
						value: '',
						options: [
							{
								value: 'active',
								label: 'Active',
							},
							{
								value: 'inactive',
								label: 'Inactive',
							},
						],
						priority: 3,
						required: true,
					},
					{
						key: 'currency',
						name: 'Currency',
						type: 'select',
						dType: 'select',
						value: '',
						options: [
							{
								value: 'usd',
								label: '$ US Dollar',
							},
							{
								value: 'inr',
								label: '₹ Indian rupee',
							},
						],
						priority: 3,
						required: true,
					},
				],
				priority: 0,
			},
		],
	},
	paginator: {},
};
