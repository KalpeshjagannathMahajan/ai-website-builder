import { Meta, StoryObj } from '@storybook/react';

import Radio from './Radio';

export default {
	title: 'Components/Radio',
	component: Radio,
} as Meta<typeof Radio>;

export const Checked: StoryObj = {
	render: (args) => <Radio size='medium' checked {...args} />,
};

export const Unchecked: StoryObj = {
	render: (args) => <Radio size='medium' {...args} />,
};

export const Disabled: StoryObj = {
	render: (args) => <Radio size='medium' disabled checked {...args} />,
};

export const DisabledUnchecked: StoryObj = {
	render: (args) => <Radio size='medium' disabled {...args} />,
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
				<Radio size='small' {...args} />
				<Radio size='medium' {...args} />
				<Radio size='large' {...args} />
			</div>
			<div>
				<Radio size='small' checked {...args} />
				<Radio size='medium' checked {...args} />
				<Radio size='large' checked {...args} />
			</div>
			<div>
				<Radio size='large' checked disabled {...args} />
				<Radio size='medium' checked disabled {...args} />
				<Radio size='small' checked disabled {...args} />
			</div>
			<div>
				<Radio size='large' disabled {...args} />
				<Radio size='medium' disabled {...args} />
				<Radio size='small' disabled {...args} />
			</div>
		</div>
	),
};
