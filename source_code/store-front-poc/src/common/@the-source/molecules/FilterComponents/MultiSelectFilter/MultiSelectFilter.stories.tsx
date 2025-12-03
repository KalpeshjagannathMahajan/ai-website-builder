import { Grid } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';

import MultiSelectFilter from './MultiSelectFilter';

export default {
	title: 'SalesRep/MultiSelectFilter',
	component: MultiSelectFilter,
} as Meta<typeof MultiSelectFilter>;

const options = [
	'Red',
	'Green',
	'Blue',
	'Yellow',
	'Black',
	'White',
	'Orange',
	'Purple',
	'Brown',
	'Grey',
	'Pink',
	'Gold',
	'Silver 1',
	'Option 2',
	'Option 3',
	'Option 4',
];

export const Basic: StoryObj = {
	render: (args) => (
		<Grid container spacing={3}>
			<Grid width={300} item>
				<MultiSelectFilter
					options={options}
					filterName='Multiselect filter'
					onUpdate={(val) => console.log(val)}
					onClear={() => console.log('cleared')}
					{...args}
				/>
			</Grid>
			<Grid width={300} item>
				<MultiSelectFilter
					options={options}
					filterName='Multiselect filter'
					onUpdate={(val) => console.log(val)}
					onClear={() => console.log('cleared')}
					activeSelection={['Option 1', 'Option 2']}
					{...args}
				/>
			</Grid>
			<Grid item>
				<MultiSelectFilter
					options={options}
					filterName='filter'
					onUpdate={(val) => console.log(val)}
					onClear={() => console.log('cleared')}
					activeSelection={['Option 1', 'Option 2']}
					{...args}
				/>
			</Grid>
		</Grid>
	),
};
