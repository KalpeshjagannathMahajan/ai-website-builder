import { Grid } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';

import FilterIcon from './FilterIcon';

export default {
	title: 'SalesRep/FilterIcon',
	component: FilterIcon,
} as Meta<typeof FilterIcon>;

export const Basic: StoryObj = {
	render: (args) => (
		<Grid container spacing={3}>
			<Grid item>
				<FilterIcon btnPrefix='Filters' onClick={() => console.log('abc')} {...args} />
			</Grid>
		</Grid>
	),
};
