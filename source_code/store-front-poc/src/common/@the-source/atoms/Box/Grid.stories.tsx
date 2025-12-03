import { Meta, StoryObj } from '@storybook/react';

import Button from '../Button';
import Box from './Box';

export default {
	title: 'Components/Box',
	component: Box,
} as Meta<typeof Box>;

export const Type: StoryObj = {
	render: (args) => (
		<div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
			<Box {...args}>
				<Button>Button</Button>
			</Box>
		</div>
	),
};
