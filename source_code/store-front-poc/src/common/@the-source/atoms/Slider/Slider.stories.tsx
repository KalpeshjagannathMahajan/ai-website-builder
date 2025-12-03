import { Meta, StoryObj } from '@storybook/react';

import Slider from './Slider';

export default {
	title: 'Components/Slider',
	component: Slider,
} as Meta<typeof Slider>;

export const Type: StoryObj = {
	render: (args) => (
		<div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
			<Slider {...args} />
		</div>
	),
};
