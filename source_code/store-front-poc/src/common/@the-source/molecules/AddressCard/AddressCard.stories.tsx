import { Box } from '@mui/material';
import { Meta, StoryFn } from '@storybook/react';

import AddressCard from './AddressCard';

export default {
	title: 'salesRep/AddressCard',
	component: AddressCard,
} as Meta<typeof AddressCard>;

const data = {
	id: 0,
	section: 'main',
	section_heading: '',
	heading: 'Main',
	tag: {
		name: 'Default Shipping',
		backgroundColor: '#EEF1F7',
		textColor: '#000000',
	},
	status: 'published',
	attributes: [
		{
			attribute_id: '1',
			value: 'type: shipping',
			key: 'mn',
		},
		{
			attribute_id: '1',
			value: 'Nexus Mall',
			key: 'mn',
		},
		{
			attribute_id: '1',
			value: 'Koramangala, Bangalore',
			key: 'mn',
		},
		{
			attribute_id: '1',
			value: 'Karnataka, India',
			key: 'mn',
		},
		{
			attribute_id: '1',
			value: '560095',
			key: 'mn',
		},
	],
};

export const Basic: StoryFn = () => (
	<Box>
		<AddressCard data={data} />
	</Box>
);
