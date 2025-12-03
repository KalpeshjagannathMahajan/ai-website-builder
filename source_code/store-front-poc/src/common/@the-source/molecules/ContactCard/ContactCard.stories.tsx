import { Box } from '@mui/material';
import { Meta, StoryFn } from '@storybook/react';

import ContactCard from './ContactCard';

export default {
	title: 'salesRep/ContactCard',
	component: ContactCard,
} as Meta<typeof ContactCard>;

const data = {
	priority: 0,
	attributes: [
		{
			key: 'name',
			name: 'Contact Name',
			type: 'text',
			dType: 'name',
			value: '',
			priority: 0,
			required: true,
			attribute_id: '0f349df7-7c9b-4b95-b',
		},
		{
			key: 'phone',
			name: 'Contact Number',
			type: 'number',
			dType: 'phone',
			value: '',
			priority: 1,
			required: true,
			attribute_id: '0f349df7-7c9b-4b95-b370-e889b63039f2',
		},
		{
			key: 'designation',
			name: "Contact's Designation",
			type: 'text',
			dType: 'designation',
			value: '',
			priority: 2,
			required: true,
			attribute_id: '0f349df7-7c9b-4b95-b370-e889b63037f2',
		},
		{
			key: 'email',
			name: 'Email ID',
			type: 'text',
			dType: 'email',
			value: '',
			priority: 3,
			required: true,
			attribute_id: '0f349df7-7c9b-4b95-b370-e889b63038f2',
		},
	],
	is_removable: 'False',
};

export const Basic: StoryFn = () => (
	<Box>
		<ContactCard data={data} />
	</Box>
);
