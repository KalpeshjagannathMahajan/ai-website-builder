import { Meta, StoryObj } from '@storybook/react';

import Breadcrumb from '../Breadcrumb';
import Button from '../Button';
import Grid from '../Grid';
import Typography from '../Typography';
import PageHeader from './PageHeader';

export default {
	title: 'Components/PageHeader',
	component: PageHeader,
} as Meta<typeof PageHeader>;

export const Variant: StoryObj = {
	render: (args) => (
		<PageHeader
			leftSection={
				<Grid container direction='row' alignItems='center' spacing={2}>
					<Grid item>
						<Typography variant='h4'>Home</Typography>
					</Grid>
					<Grid item>
						<Breadcrumb
							links={[
								{ id: 1, linkTitle: 'Home', link: '/' },
								{ id: 2, linkTitle: 'Products', link: '/all-products' },
								{ id: 3, linkTitle: 'Product 0', link: '/all-products' },
							]}
						/>
					</Grid>
				</Grid>
			}
			rightSection={<Button tonal>Save</Button>}
			{...args}
		/>
	),
};
