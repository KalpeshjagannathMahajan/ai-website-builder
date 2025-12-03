import { Meta, StoryObj } from '@storybook/react';

import Checkbox from './Checkbox';

export default {
	title: 'Components/Checkbox',
	component: Checkbox,
} as Meta<typeof Checkbox>;

export const Checked: StoryObj = {
	render: (args) => <Checkbox size='medium' checked {...args} />,
};

export const Unchecked: StoryObj = {
	render: (args) => <Checkbox size='medium' {...args} />,
};

export const Disabled: StoryObj = {
	render: (args) => <Checkbox size='medium' disabled checked {...args} />,
};

export const DisabledUnchecked: StoryObj = {
	render: (args) => <Checkbox size='medium' disabled {...args} />,
};

export const AllVariants: StoryObj = {
	render: (args) => (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'flex-start',
			}}>
			<div>
				<Checkbox size='small' {...args} />
				<Checkbox size='medium' {...args} />
				<Checkbox size='large' {...args} />
			</div>
			<div>
				<Checkbox size='small' checked {...args} />
				<Checkbox size='medium' checked {...args} />
				<Checkbox size='large' checked {...args} />
			</div>
			<div>
				<Checkbox size='large' checked disabled {...args} />
				<Checkbox size='medium' checked disabled {...args} />
				<Checkbox size='small' checked disabled {...args} />
			</div>
			<div>
				<Checkbox size='large' disabled {...args} />
				<Checkbox size='medium' disabled {...args} />
				<Checkbox size='small' disabled {...args} />
			</div>
		</div>
	),
};
