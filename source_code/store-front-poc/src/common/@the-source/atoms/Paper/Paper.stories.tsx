import { Meta, StoryObj } from '@storybook/react';

import Paper from './Paper';

export default {
	title: 'Components/Paper',
	component: Paper,
} as Meta<typeof Paper>;

export const Basic: StoryObj = {
	render: (args) => <Paper {...args}>SalesRep</Paper>,
};
