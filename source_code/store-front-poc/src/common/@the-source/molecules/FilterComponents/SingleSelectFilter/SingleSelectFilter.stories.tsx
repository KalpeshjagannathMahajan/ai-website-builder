import { Grid } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';

import SingleSelectFilter from './SingleSelectFilter';

export default {
	title: 'SalesRep/SingleSelectFilter',
	component: SingleSelectFilter,
} as Meta<typeof SingleSelectFilter>;

const options = [
	{ value: '10', label: 'Ten' },
	{ value: 20, label: 'Twenty' },
	{ value: 30, label: 'Thirty' },
];

export const Basic: StoryObj = {
	render: (args) => (
		<Grid container spacing={3}>
			<Grid width={300} item>
				<SingleSelectFilter options={options} filterName='Single Select filter' onUpdate={(val) => console.log(val)} {...args} />
			</Grid>
			<Grid width={300} item>
				<SingleSelectFilter
					options={options}
					filterName='Single Select filter'
					onUpdate={(val) => console.log(val)}
					activeSelection='10'
					{...args}
				/>
			</Grid>
		</Grid>
	),
};
