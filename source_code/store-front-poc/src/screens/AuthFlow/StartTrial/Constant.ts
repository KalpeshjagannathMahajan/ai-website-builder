import types from 'src/utils/types';

export const form_config = [
	{
		name: 'Company Name',
		id: 'tenant_name',
		type: 'text',
		placeholder: 'Enter Company Name',
		required: true,
	},
	{
		name: 'First Name',
		id: 'first_name',
		type: 'text',
		placeholder: 'Enter First Name',
		required: true,
	},
	{
		name: 'Last Name',
		id: 'last_name',
		type: 'text',
		placeholder: 'Enter Last Name',
		required: false,
	},
	{
		name: 'Email',
		id: 'email',
		type: 'email',
		placeholder: 'example@mail.com',
		required: true,
	},
	{
		name: 'Phone Number',
		id: 'phone',
		type: 'phone',
		placeholder: '',
		required: false,
	},
	{
		name: 'Select Industry',
		id: 'industry',
		type: 'select',
		options: [
			{ label: 'Home', value: 'home' },
			{ label: 'Apparel and Accessories', value: 'apparel_and_accessories' },
			{ label: 'Food and Grocery', value: 'food_and_grocery' },
			{ label: 'Lighting', value: 'lighting' },
			{ label: 'Industrial', value: 'industrial' },
			{ label: 'Beauty and Wellness', value: 'beauty_and_wellness' },
			{ label: 'Auto Parts', value: 'auto_parts' },
			{ label: 'Others', value: 'others' },
		],
		required: true,
	},
];

export const free_trial_form_config = [
	{
		name: 'Name',
		id: 'first_name',
		type: 'text',
		placeholder: 'Enter your Name',
		required: true,
	},
	{
		name: 'Company Name',
		id: 'company_name',
		type: 'text',
		placeholder: 'Enter Company Name',
		required: true,
	},
	{
		name: 'Email',
		id: 'email',
		type: 'email',
		placeholder: 'example@mail.com',
		required: true,
	},
];

export const handle_message = (state: string, title: string, subtitle: string) => {
	const message = {
		open: true,
		showCross: false,
		anchorOrigin: {
			vertical: types.VERTICAL_TOP,
			horizontal: types.HORIZONTAL_CENTER,
		},
		autoHideDuration: 10000,
		state,
		title,
		subtitle,
		subtitle_font_variant: 'h5',
	};
	return message;
};
