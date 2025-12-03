import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { Box, Grid } from '../../../atoms';
import AllFiltersDrawer from '../AllFiltersDrawer/AllFiltersDrawer';
import FilterIcon from '../FilterIcon';
import filterData from './filterMock.json';
import Filters from './Filters';

export default {
	title: 'SalesRep/Filters',
	component: Filters,
} as Meta<typeof Filters>;

const sortedFilters = filterData?.sort((a: any, b: any) => a.priority - b.priority);

const FiltersComponent: React.FC = (args) => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const handleFilters = () => {};

	return (
		<>
			<Grid container justifyContent='space-between'>
				<Grid item width='95%'>
					<Box padding={2}>
						<Filters onFilterChange={handleFilters} filtersList={sortedFilters} showFilterCount={false} {...args} />
					</Box>
				</Grid>
				<Grid item>
					<Grid container paddingTop={1}>
						<FilterIcon onClick={() => setIsDrawerOpen(true)} />
					</Grid>
				</Grid>
			</Grid>

			{isDrawerOpen && (
				<AllFiltersDrawer
					isDrawerOpen={isDrawerOpen}
					setIsDrawerOpen={setIsDrawerOpen}
					onFilterChange={() => console.log('filter applied')}
					data={sortedFilters}
					facetResultsNumber={133}
					handleShowResult={() => console.log('logging show result')}
					showClearButton
					handleClear={() => console.log('Clear')}
				/>
			)}
		</>
	);
};

export const Basic: StoryObj = {
	render: () => <FiltersComponent />,
};
