import { Grid } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';

import RangeFilter from './RangeFilter';

export default {
	title: 'SalesRep/RangeFilter',
	component: RangeFilter,
} as Meta<typeof RangeFilter>;

const conversionFactors = {
	base_unit: 'usd',
	factor: {
		inr: 80,
		usd: 1,
		gbp: 0.8,
		aed: 3.12,
	},
};

export const Basic: StoryObj = {
	render: (args) => (
		<Grid container spacing={3}>
			<Grid width={300} item>
				<RangeFilter
					UOM={[
						{ value: 'usd', label: 'USD' },
						{ value: 'inr', label: 'INR' },
						{ value: 'gbp', label: 'GBP' },
						{ value: 'aed', label: 'AED' },
					]}
					label='Selling Price 2'
					onApply={(min, max, unit) => console.log(min, max, unit)}
					minRange={10}
					maxRange={221}
					defaultUnit='usd'
					conversionFactors={conversionFactors}
					applied={[65, 100, 'aed']}
					{...args}
				/>
			</Grid>
			<Grid width={300} item>
				<RangeFilter
					onApply={(min, max, unit) => console.log(min, max, unit)}
					label='Selling Price'
					UOM={[
						{ value: 'usd', label: 'USD' },
						{ value: 'inr', label: 'INR' },
						{ value: 'gbp', label: 'GBP' },
					]}
					minRange={10}
					maxRange={200}
					{...args}
				/>
			</Grid>
		</Grid>
	),
};
