import { Meta, StoryObj } from '@storybook/react';

import Switch from './Switch';

export default {
	title: 'Components/Switch',
	component: Switch,
} as Meta<typeof Switch>;

export const Type: StoryObj = {
	render: (args) => (
		<div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
			<Switch {...args} />
		</div>
	),
};
