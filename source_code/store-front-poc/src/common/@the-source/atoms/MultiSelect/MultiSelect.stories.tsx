import { ComponentMeta, Story } from '@storybook/react';

import Box from '../Box';
import MultiSelect from './MultiSelect';

export default {
	title: 'Components/MultiSelect',
	component: MultiSelect,
	argTypes: { options: { control: 'object' } },
} as ComponentMeta<typeof MultiSelect>;

const DUMMY = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];

const consoleSelected = (e: any) => {
	console.log(e);
};
export const Variant: Story = (args) => (
	<Box width={400}>
		<MultiSelect defaultValue='One,Two' handleChange={consoleSelected} options={DUMMY} {...args} />
	</Box>
);

export const Disabled: Story = (args) => (
	<Box width={400}>
		<MultiSelect handleChange={consoleSelected} options={DUMMY} disabled {...args} />
	</Box>
);

export const Error: Story = (args) => (
	<Box width={400}>
		<MultiSelect handleChange={consoleSelected} options={DUMMY} error {...args} />
	</Box>
);

export const Checkmarks: Story = (args) => (
	<Box width={400}>
		<MultiSelect handleChange={consoleSelected} options={DUMMY} checkmarks {...args} />
	</Box>
);

const DUMMYCOMPLEX = [
	{ label: 'one', value: 'id1' },
	{ label: 'two', value: 'id2' },
	{ label: 'three', value: 'id3' },
];

export const VariantComplex: Story = (args) => <MultiSelect options={DUMMYCOMPLEX} {...args} complex handleChange={consoleSelected} />;

export const DisabledComplex: Story = (args) => (
	<MultiSelect options={DUMMYCOMPLEX} disabled {...args} complex handleChange={consoleSelected} />
);

export const ErrorComplex: Story = (args) => <MultiSelect options={DUMMYCOMPLEX} error {...args} complex handleChange={consoleSelected} />;

export const CheckmarksComplex: Story = (args) => (
	<MultiSelect options={DUMMYCOMPLEX} checkmarks {...args} complex handleChange={consoleSelected} />
);

Variant.args = {
	options: DUMMY,
};

Checkmarks.args = {
	options: DUMMY,
};
