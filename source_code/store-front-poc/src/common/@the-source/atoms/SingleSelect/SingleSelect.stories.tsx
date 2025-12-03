import { Meta, StoryObj } from '@storybook/react';

import Box from '../Box';
import SingleSelect from './SingleSelect';

export default {
	title: 'Components/SingleSelect',
	component: SingleSelect,
} as Meta<typeof SingleSelect>;

const onChange = () => {};

export const OutlinedWithLabel: StoryObj = {
	render: (args) => (
		<Box width={400}>
			<SingleSelect
				label='Single Select'
				handleChange={() => console.log('Selected')}
				defaultValue={10}
				options={[
					{ value: 10, label: 'Ten' },
					{ value: 20, label: 'Twenty' },
					{ value: 30, label: 'Thirty' },
				]}
				{...args}
			/>
		</Box>
	),

	args: {
		options: [
			{ value: 10, label: 'Ten' },
			{ value: 20, label: 'Twenty' },
			{ value: 30, label: 'Thirty' },
		],
	},
};

export const OutlineWithoutLabel: StoryObj = {
	render: (args) => (
		<Box width={400}>
			<SingleSelect
				label=''
				displayEmpty
				handleChange={onChange}
				options={[
					{ value: 10, label: 'Ten' },
					{ value: 20, label: 'Twenty' },
					{ value: 30, label: 'Thirty' },
				]}
				{...args}
			/>
		</Box>
	),

	args: {
		options: [
			{ value: 10, label: 'Ten' },
			{ value: 20, label: 'Twenty' },
			{ value: 30, label: 'Thirty' },
		],
	},
};

export const OutlinedWithLabelSize: StoryObj = {
	render: (args) => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '30px',
				width: 400,
			}}>
			<SingleSelect
				label='Single Select'
				size='small'
				handleChange={onChange}
				options={[
					{ value: 10, label: 'Ten' },
					{ value: 20, label: 'Twenty' },
					{ value: 30, label: 'Thirty' },
				]}
				{...args}
			/>
			<SingleSelect
				label='Single Select'
				size='medium'
				handleChange={onChange}
				options={[
					{ value: 10, label: 'Ten' },
					{ value: 20, label: 'Twenty' },
					{ value: 30, label: 'Thirty' },
				]}
				{...args}
			/>
		</div>
	),
};

export const Disabled: StoryObj = {
	render: (args) => (
		<Box width={400}>
			<SingleSelect
				label='Single Select'
				handleChange={onChange}
				options={[
					{ value: 10, label: 'Ten' },
					{ value: 20, label: 'Twenty' },
					{ value: 30, label: 'Thirty' },
				]}
				disabled
				{...args}
			/>
		</Box>
	),
};

export const Error: StoryObj = {
	render: (args) => (
		<Box width={400}>
			<SingleSelect
				label='Single Select'
				handleChange={onChange}
				options={[
					{ value: 10, label: 'Ten' },
					{ value: 20, label: 'Twenty' },
					{ value: 30, label: 'Thirty' },
				]}
				error
				{...args}
			/>
		</Box>
	),

	args: {
		options: [
			{ value: 10, label: 'Ten' },
			{ value: 20, label: 'Twenty' },
			{ value: 30, label: 'Thirty' },
		],
	},
};
