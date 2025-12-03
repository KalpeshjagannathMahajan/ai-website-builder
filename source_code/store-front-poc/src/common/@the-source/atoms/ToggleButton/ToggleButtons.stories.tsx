import { Meta, StoryObj } from '@storybook/react';

import ToggleButtons from './ToggleButtons';

export default {
	title: 'Components/ToggleButtons',
	component: ToggleButtons,
} as Meta<typeof ToggleButtons>;

export const ToggleButtonGroup: StoryObj = {
	render: (args) => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
			<ToggleButtons
				value='grid'
				icons={[
					{
						id: 1,
						icon: 'IconLayoutGrid',
						value: 'grid',
					},
					{
						id: 2,
						icon: 'IconLayoutGrid',
						value: 'grid2',
					},
				]}
				{...args}
			/>
			<ToggleButtons
				value='grid'
				icons={[
					{
						id: 1,
						icon: 'IconLayoutGrid',
						value: 'grid',
					},
					{
						id: 2,
						icon: 'IconLayoutGrid',
						value: 'grid2',
					},
					{
						id: 3,
						icon: 'IconLayoutGrid',
						value: 'grid3',
					},
				]}
				{...args}
			/>
			<ToggleButtons
				value='grid'
				icons={[
					{
						id: 1,
						icon: 'IconLayoutGrid',
						value: 'grid',
					},
					{
						id: 2,
						icon: 'IconLayoutGrid',
						value: 'grid2',
					},
					{
						id: 3,
						icon: 'IconLayoutGrid',
						value: 'grid3',
					},
					{
						id: 4,
						icon: 'IconLayoutGrid',
						value: 'grid4',
					},
				]}
				{...args}
			/>
		</div>
	),
};

export const ToggleButtonsSize: StoryObj = {
	render: (args) => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
			<ToggleButtons
				value='grid'
				size='small'
				icons={[
					{
						id: 1,
						icon: 'IconLayoutGrid',
						value: 'grid',
					},
					{
						id: 2,
						icon: 'IconLayoutGrid',
						value: 'grid2',
					},
					{
						id: 3,
						icon: 'IconLayoutGrid',
						value: 'grid3',
					},
				]}
				{...args}
			/>
			<ToggleButtons
				value='grid'
				size='medium'
				icons={[
					{
						id: 1,
						icon: 'IconLayoutGrid',
						value: 'grid',
					},
					{
						id: 2,
						icon: 'IconLayoutGrid',
						value: 'grid2',
					},
					{
						id: 3,
						icon: 'IconLayoutGrid',
						value: 'grid3',
					},
				]}
				{...args}
			/>
			<ToggleButtons
				value='grid'
				size='large'
				icons={[
					{
						id: 1,
						icon: 'IconLayoutGrid',
						value: 'grid',
					},
					{
						id: 2,
						icon: 'IconLayoutGrid',
						value: 'grid2',
					},
					{
						id: 3,
						icon: 'IconLayoutGrid',
						value: 'grid3',
					},
				]}
				{...args}
			/>
		</div>
	),
};

export const ToggleButtonDisabled: StoryObj = {
	render: (args) => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
			<ToggleButtons value='grid' disabled {...args} />
			<ToggleButtons
				value='grid'
				disabled
				icons={[
					{
						id: 1,
						icon: 'IconLayoutGrid',
						value: 'grid',
					},
					{
						id: 2,
						icon: 'IconLayoutGrid',
						value: 'grid2',
					},
				]}
				{...args}
			/>
		</div>
	),
};

export const ToggleButtonDisabled2: StoryObj = {
	render: (args) => (
		<ToggleButtons
			value='grid'
			disabled
			icons={[
				{
					id: 1,
					icon: 'IconLayoutGrid',
					value: 'grid',
				},
				{
					id: 2,
					icon: 'IconLayoutGrid',
					value: 'grid2',
				},
			]}
			{...args}
		/>
	),
};
