import { Meta, StoryObj } from '@storybook/react';

import Button from '../Button';
import Grid from './Grid';

export default {
	title: 'Components/Grid',
	component: Grid,
} as Meta<typeof Grid>;

export const Type: StoryObj = {
	render: (args) => (
		<div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
			<Grid {...args}>
				<Button>Button</Button>
			</Grid>
		</div>
	),
};
