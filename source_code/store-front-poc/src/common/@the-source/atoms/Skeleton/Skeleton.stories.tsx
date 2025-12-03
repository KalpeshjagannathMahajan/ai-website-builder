import { Meta, StoryObj } from '@storybook/react';

import Skeleton from './Skeleton';

export default {
	title: 'Components/Skeleton',
	component: Skeleton,
} as Meta<typeof Skeleton>;

export const Rounded: StoryObj = {
	render: (args) => (
		<div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
			<Skeleton variant='rounded' height={100} width={100} {...args} />
		</div>
	),
};

export const Rectangular: StoryObj = {
	render: (args) => (
		<div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
			<Skeleton variant='rectangular' height={100} width={100} {...args} />
		</div>
	),
};

export const Circular: StoryObj = {
	render: (args) => (
		<div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
			<Skeleton variant='circular' animation='wave' height={100} width={100} {...args} />
		</div>
	),
};
