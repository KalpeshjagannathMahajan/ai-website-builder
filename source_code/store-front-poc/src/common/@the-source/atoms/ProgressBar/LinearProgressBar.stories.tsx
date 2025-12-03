import { Meta, StoryObj } from '@storybook/react';

import LinearProgressBar from './LinearProgressBar';

export default {
	title: 'Components/LinearProgressBar',
	component: LinearProgressBar,
} as Meta<typeof LinearProgressBar>;

export const Variant: StoryObj = {
	render: (args) => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				gap: '3.2rem',
			}}>
			<LinearProgressBar variant='determinate' value={25} {...args} />
			<LinearProgressBar variant='indeterminate' value={25} {...args} />
			<LinearProgressBar variant='buffer' value={50} valueBuffer={50} {...args} />
			<LinearProgressBar variant='determinate' value={50} label {...args} />
		</div>
	),
};
