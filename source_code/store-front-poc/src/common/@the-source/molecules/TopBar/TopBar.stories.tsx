import { Meta, StoryObj } from '@storybook/react';

import { Button, Grid, Icon } from '../../atoms';
import TopBar from './TopBar';
import RouteNames from 'src/utils/RouteNames';

export default {
	title: 'SalesRep/TopBar',
	component: TopBar,
} as Meta<typeof TopBar>;

export const Basic: StoryObj = {
	render: () => (
		<TopBar
			breadCrumbList={[
				{ id: 1, linkTitle: 'Dashboard', link: RouteNames.dashboard.path },
				{ id: 2, linkTitle: 'Products', link: RouteNames.product.all_products.path },
			]}
			username='John Doe 1235634'
			childNodes={<Icon iconName='IconClipboardList' />}
		/>
	),
};

export const Variant: StoryObj = {
	render: () => (
		<TopBar
			breadCrumbList={[
				{ id: 1, linkTitle: 'Dashboard', link: RouteNames.dashboard.path },
				{ id: 2, linkTitle: 'Products', link: RouteNames.product.all_products.path },
			]}
			username='John Doe 1235634'
			childNodes={
				<Grid container alignContent='center' alignItems='center' spacing={2} justifyContent='space-between'>
					<Grid item>
						<Icon iconName='IconClipboardList' />
					</Grid>
					<Grid item mb={1}>
						<Button size='small' onClick={() => {}} />
					</Grid>
				</Grid>
			}
		/>
	),
};
export const NoUserName: StoryObj = {
	render: () => (
		<TopBar
			breadCrumbList={[
				{ id: 1, linkTitle: 'Dashboard', link: RouteNames.dashboard.path },
				{ id: 2, linkTitle: 'Products', link: RouteNames.product.all_products.path },
			]}
			childNodes={
				<Grid item>
					<Icon iconName='IconClipboardList' />
				</Grid>
			}
		/>
	),
};

export const NoBreadCrumb: StoryObj = {
	render: () => (
		<TopBar
			username='John Doe 1235634'
			childNodes={
				<Grid item>
					<Icon iconName='IconClipboardList' />
				</Grid>
			}
		/>
	),
};
