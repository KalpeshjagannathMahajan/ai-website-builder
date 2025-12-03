export const response = {
	message: 'Ok',
	status_code: 200,
	success: true,
	data: {
		sections: [
			{
				key: 'basic_details',
				name: 'Basic Details',
				priority: 0,
				attributes: [
					{
						id: 'company_name',
						name: 'Company name',
						type: 'text',
						value: '',
						priority: 0,
						required: true,
					},
					{
						id: 'display_name',
						name: 'Display name',
						type: 'text',
						value: '',
						priority: 1,
						required: false,
					},
					{
						id: 'customer_type',
						name: 'Customer Type',
						type: 'select',
						value: '12345aa',
						options: [
							{
								label: 'B2B',
								value: '12345aa',
							},
							{
								label: 'B2C',
								value: '12345bb',
							},
							{
								label: 'C2C',
								value: '12345cc',
							},
						],
						priority: 3,
						required: true,
					},
					{
						id: 'customer_pricing',
						name: 'Customer Pricing',
						type: 'select',
						value: 'a2ec71a0-623b-4ee6-b9b5-ee74bca5ed9d',
						options: [
							{
								label: 'Designer Pricing',
								value: '4c893897-1ef6-4317-b440-27eb013ad6e0',
							},
							{
								label: 'Dealer',
								value: 'bc5f14f9-365e-44fb-b400-21a0ec0ac63f',
							},
							{
								label: 'Wholesale Pricing',
								value: 'a2ec71a0-623b-4ee6-b9b5-ee74bca5ed9d',
							},
						],
						priority: 3,
						required: true,
					},
					{
						id: 'sales_reps',
						name: 'Sales Rep',
						type: 'multi_select',
						value: '1b07a936-f93a-4689-8e6d-b4547bc05878',
						priority: 2,
						required: true,
						options: [
							{
								label: 'Rosham Admin',
								value: '1b07a936-f93a-4689-8e6d-b4547bc05878',
							},
							{
								label: 'Martha Graham',
								value: '87fcf92e-f694-4ece-9807-d452d4133dba',
							},
							{
								label: 'Ashley Hale',
								value: 'ef2d18e9-8ffd-41d7-bca4-326c756a0970',
							},
							{
								label: 'Maggie McCrary',
								value: 'e0a60e67-932b-4533-b09c-bdf4c178015a',
							},
							{
								label: 'Eric Tibbetts',
								value: 'ef1221cd-34d5-436a-9616-7167cc7fb501',
							},
							{
								label: 'Office .',
								value: '0003c54b-61d0-4c6f-af51-0736b4d86d78',
							},
							{
								label: 'Chris Saars',
								value: 'efa3dfa0-684e-4f35-949c-905791152439',
							},
							{
								label: 'Craig Goldstein',
								value: '9adbd3a3-79d4-4c72-be34-db35444bdb51',
							},
							{
								label: 'Rachel Admin',
								value: '98000075-6e55-443a-b86d-e183e9d5fc97',
							},
							{
								label: 'Random Admin',
								value: '59cdbe8d-3a65-410a-89e5-b0206dd4dd09',
							},
							{
								label: 'Gaurav Kalyan',
								value: 'dbb70c1f-966d-4a66-975b-48c602f669b6',
							},
							{
								label: 'Gaurav Kalyan',
								value: '38f2ad62-6bf4-4e3d-a31d-76e6d0f53abc',
							},
							{
								label: 'Steve Saks',
								value: '161f7515-9830-4ab6-9e73-96b1a81479d6',
							},
							{
								label: 'Admin KCB',
								value: '419af1a7-74e1-4919-a8e6-fd9b8d0990d1',
							},
							{
								label: 'John GMail',
								value: 'c43cb9dd-9f3a-448a-baf0-9571b06c4f20',
							},
							{
								label: 'Sales KCB',
								value: 'c78a846f-ecf9-492a-bb01-f8496807663f',
							},
							{
								label: 'MR KCB',
								value: '504c62dd-0b50-4595-b1d2-2fabef972c46',
							},
							{
								label: 'User 1 one',
								value: '83864920-7ade-449e-8ac3-5a952e5f3c9b',
							},
							{
								label: "can't access",
								value: '3a458a82-2417-4a56-b00d-81d315588449',
							},
							{
								label: 'Hello Hello',
								value: 'b96a088f-ef4b-4724-ad05-88a0fb64a53f',
							},
							{
								label: 'Deepam Patel',
								value: '6a0884d0-d2a9-451a-b264-2079a8a7c215',
							},
							{
								label: 'test wewerwerwertest',
								value: 'f7d425a7-2f75-434d-be85-50268353591c',
							},
							{
								label: 'Charles Arry',
								value: '602eb2e7-ccd1-44fd-a9f7-e8e33737a06a',
							},
						],
						is_disabled: false,
					},
				],
			},
			{
				key: 'contacts',
				name: 'Contacts',
				priority: 1,
				contacts: [
					{
						priority: 0,
						attributes: [
							{
								id: 'saluation',
								name: '',
								type: 'select',
								value: '1ass',
								options: [
									{
										label: 'MR.',
										value: '1ass',
									},
									{
										label: 'MRS.',
										value: '1b',
									},
									{
										label: 'MS.',
										value: '1c',
									},
								],
								priority: 0,
								required: true,
							},
							{
								id: 'first_name',
								name: 'First Name',
								type: 'text',
								value: '',
								priority: 0,
								required: true,
							},
							{
								id: 'last_name',
								name: 'Last Name',
								type: 'text',
								value: '',
								priority: 1,
								required: false,
							},
							{
								id: 'country_code',
								name: 'Country Code',
								type: 'text',
								value: '',
								priority: 2,
								required: true,
							},
							{
								id: 'phone',
								name: 'Phone number',
								type: 'number',
								value: '',
								priority: 3,
								required: true,
							},
							{
								id: 'designation',
								name: 'Designation',
								type: 'text',
								value: '',
								priority: 4,
								required: false,
							},
							{
								id: 'email',
								name: 'Email ID',
								type: 'email',
								value: '',
								priority: 5,
								required: false,
							},
						],
						is_removable: false,
					},
				],
			},
			{
				key: 'addresses',
				name: 'Addresses',
				priority: 2,
				addresses: [
					{
						attributes: [
							{
								id: 'first_name',
								name: 'First Name',
								type: 'text',
								value: '',
								priority: 0,
								required: true,
							},
							{
								id: 'last_name',
								name: 'Last Name',
								type: 'text',
								value: '',
								priority: 1,
								required: true,
							},
							{
								id: 'country_code',
								name: 'Country Code',
								type: 'text',
								value: '',
								priority: 2,
								required: true,
							},
							{
								id: 'phone',
								name: 'Phone number',
								type: 'number',
								value: '',
								priority: 3,
								required: true,
							},
							{
								id: 'email',
								name: 'Email ID',
								type: 'email',
								value: '',
								priority: 4,
								required: true,
							},
							{
								id: 'country',
								name: 'Country',
								type: 'select',
								value: 'usa',
								options: [
									{
										label: 'United States of America',
										value: 'usa',
									},
								],
								priority: 5,
								required: true,
								disabled: true,
							},
							{
								id: 'street_address',
								name: 'Street Address',
								type: 'text',
								value: '',
								priority: 6,
								required: true,
								is_taking_full_row: true,
							},
							{
								id: 'city',
								name: 'City',
								type: 'text',
								value: '',
								priority: 7,
								required: true,
							},
							{
								id: 'state',
								name: 'State / Region',
								type: 'text',
								value: '',
								priority: 8,
								required: true,
								disabled: true,
							},
							{
								id: 'pincode',
								name: 'Zip Code',
								type: 'number',
								value: '',
								priority: 9,
								required: true,
							},
							{
								id: 'type',
								name: 'Address Type',
								type: 'text',
								value: '',
								priority: 10,
								required: true,
							},
						],
					},
				],
			},
			{
				key: 'tax_preferences',
				name: 'Tax Preferences',
				priority: 3,
				required: false,
				attributes: [
					{
						id: 'is_taxable',
						name: 'Is Taxable',
						type: 'radio',
						value: true,
						priority: 0,
						options: [
							{
								label: 'Taxable',
								value: true,
							},
							{
								label: 'Non-taxable',
								value: false,
							},
						],
						required: false,
					},
					{
						id: 'tax_rate',
						name: 'Tax rate',
						type: 'percentage',
						value: '8',
						priority: 1,
						required: false,
					},
				],
			},
			{
				key: 'preferences',
				name: 'Preferences',
				priority: 3,
				attributes: [
					{
						id: 'payment_mode',
						name: 'Payment Method',
						type: 'multi_select',
						value: '',
						options: [
							{
								label: 'Credit Card',
								value: 'creditcard',
							},
							{
								label: 'ACH',
								value: 'ach',
							},
						],
						priority: 0,
						required: false,
					},
					{
						id: 'payment_terms',
						name: 'Payment Terms',
						type: 'multi_select',
						value: '',
						options: [
							{
								label: 'Due on Receipt',
								value: 'due_on_receipt',
							},
							{
								label: 'Net 7',
								value: 'net7',
							},
							{
								label: 'Net 15',
								value: 'net15',
							},
							{
								label: 'Net 30',
								value: 'net30',
							},
							{
								label: 'Net 45',
								value: 'net45',
							},
							{
								label: 'Net 60',
								value: 'net60',
							},
							{
								label: 'Net 90',
								value: 'net90',
							},
						],
						priority: 1,
						required: false,
					},
				],
			},
			{
				key: 'other_details',
				name: 'Other Details',
				priority: 4,
				custom_attributes: [],
				attachments: [
					{
						id: '',
						status: '',
						file_id: '',
					},
				],
			},
		],
	},
	paginator: {},
};
