import { Meta, StoryObj } from '@storybook/react';

import Button from '../Button';
import Tooltip from './Tooltip';

export default {
	title: 'Components/Tooltip',
	component: Tooltip,
} as Meta<typeof Tooltip>;

export const Type: StoryObj = {
	render: (args) => (
		<div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
			<Tooltip title='Hover text' {...args}>
				<Button>On Hover</Button>
			</Tooltip>
		</div>
	),
};
