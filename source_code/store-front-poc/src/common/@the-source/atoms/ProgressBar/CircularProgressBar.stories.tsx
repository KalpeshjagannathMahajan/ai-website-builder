import { Meta, StoryObj } from '@storybook/react';

import CircularProgressBar from './CircularProgressBar';

export default {
	title: 'Components/CircularProgressBar',
	component: CircularProgressBar,
} as Meta<typeof CircularProgressBar>;

export const Variant: StoryObj = {
	render: (args) => (
		<div
			style={{
				display: 'flex',
				justifyContent: 'space-around',
				width: '100%',
			}}>
			<CircularProgressBar variant='determinate' value={25} {...args} />
			<CircularProgressBar variant='determinate' value={50} {...args} />
			<CircularProgressBar variant='determinate' value={75} {...args} />
			<CircularProgressBar variant='indeterminate' value={50} {...args} />
		</div>
	),
};
