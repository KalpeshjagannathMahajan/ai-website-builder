import { Grid } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';

import FilterChips from './FilterChips';

export default {
	title: 'SalesRep/FilterChips',
	component: FilterChips,
} as Meta<typeof FilterChips>;

const appliedFilters = [
	{
		key: 'computedAttributes.Color',
		label: 'Color',
		type: 'multi-select',
		value: ['Green', 'Blue'],
	},
	{
		key: 'computedAttributes.Vendor Name',
		label: 'Vendor Name',
		type: 'multi-select',
		value: ['ABC', 'ASD', 'Green'],
	},
	{
		key: 'status',
		label: 'Status',
		type: 'select',
		value: ['published'],
	},
	{
		key: 'sub_category',
		type: 'multi-select',
		label: 'Sub Category',
		value: ['ABC', 'ASD'],
	},
	{
		key: 'costing_status',
		label: 'Costing Status',
		type: 'select',
		value: ['added'],
	},
	{
		key: 'computedAttributes.UOM',
		label: 'Weight',
		type: 'range',
		value: [20, 60, 'kg', 'suffix'],
	},
	{
		key: 'computedAttributes.TEST PRICE 1',
		label: 'Selling PRICE',
		type: 'range',
		value: [20, 100, 'usd', 'prefix'],
	},
	{
		key: 'category',
		label: 'Category',
		type: 'category',
		value: ['Home & Kitchen > Home Decor > Rugs & Pads > Carpets', 'Home & Kitchen > Home Decor > Rugs & Pads > Mats', 'Home & Kitchen'],
	},
];

export const Basic: StoryObj = {
	render: (args) => (
		<Grid container spacing={3}>
			<Grid item>
				<FilterChips
					onClearFilter={(key, value) => {
						console.log(key, value);
					}}
					filterList={appliedFilters}
					onClearAll={() => console.log('cleared all')}
					{...args}
				/>
			</Grid>
		</Grid>
	),
};
