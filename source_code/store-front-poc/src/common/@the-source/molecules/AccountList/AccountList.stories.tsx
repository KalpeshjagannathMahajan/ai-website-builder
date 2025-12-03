import { Meta, StoryFn } from '@storybook/react';
import { Box } from '../../atoms';
import AccountList from './AccountList';

export default {
	title: 'salesRep/AccountList',
	component: AccountList,
} as Meta<typeof AccountList>;

const data = {
	imageUrl: '',
	card_background: '#E8F3EF',
	background: '#7DA50E',
	color: '#ffffff',
	heading: 'John Doe',
	sub_heading: 'Delhi, India',
	tags: [
		{
			name: '3 Orders',
			textColor: '#ffffff',
		},
		{
			name: '3 Orders',
			textColor: '#ffffff',
		},
		{
			name: '3 Orders',
			textColor: '#ffffff',
		},
	],
};

export const Basic: StoryFn = () => (
	<Box>
		<AccountList data={data} />
	</Box>
);
