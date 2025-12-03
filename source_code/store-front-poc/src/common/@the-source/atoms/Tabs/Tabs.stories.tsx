import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import Tabs from './Tabs';

export default {
	title: 'Components/Tabs',
	component: Tabs,
} as Meta<typeof Tabs>;

const TabsComponent: React.FC = (args) => {
	const tabData = [
		{
			name: 'Basic Info',
		},
		{
			name: 'Addresses',
		},
		{
			name: 'Preferences',
		},
		{
			name: 'Other info',
		},
	];
	const [value, setValue] = useState<number>(0);

	const handleChange = (index: number) => {
		setValue(index);
	};

	const getTabpanel = (val: number) => {
		switch (val) {
			case val:
				return val;

			default:
				return 'hello';
		}
	};

	return (
		<Tabs label='Tab 1' value={value} handleChange={handleChange} noOftabs={tabData} {...args}>
			{getTabpanel(value)}
		</Tabs>
	);
};

export const Basic: StoryObj = {
	render: () => <TabsComponent />,
};
