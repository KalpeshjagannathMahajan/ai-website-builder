import { Meta, StoryFn } from '@storybook/react';

import SourcewizLogo from '../../assets/SourcewizLogo.svg';
import Sidebar from './Sidebar';

export default {
	title: 'SalesRep/Sidebar',
	component: Sidebar,
} as Meta<typeof Sidebar>;

// id should be unique
const sidebarItems = [
	{
		id: 1,
		icon: 'IconLayout',
		priority: 1,
		title: 'Dashboard',
		link: '#',
		slug: 'dashboard',
		children: [],
		onIconClick: () => console.log('Dashboard clicked'),
	},
	{
		id: 2,
		icon: 'IconListDetails',
		priority: 2,
		title: 'Products',
		link: '#',
		slug: 'products',
		children: [
			{
				id: 8,
				icon: 'IconDashboard',
				link: '#',
				slug: 'all-products',
				title: 'All products',
				onIconClick: () => console.log('navigate to All Products'),
			},
			{
				id: 9,
				icon: 'IconDashboard',
				link: '#',
				slug: 'categories',
				title: 'Categories',
				onIconClick: () => console.log('Navigate to Categories '),
			},
			{
				id: 15,
				icon: 'IconDashboard',
				link: '#',
				slug: 'collections',
				title: 'Collections',
				onIconClick: () => console.log('Navigate to Collections '),
			},
			{
				id: 23,
				icon: 'IconDashboard',
				link: '#',
				title: 'Labels',
				slug: 'labels',
				onIconClick: () => console.log('Navigate to Labels '),
			},
		],
		onIconClick: () => {},
	},
	{
		id: 3,
		icon: 'IconReceipt',
		priority: 3,
		title: 'Sales',
		link: '#',
		slug: 'sales',
		children: [],
		onIconClick: () => console.log('Sales clicked'),
	},
	{
		id: 4,
		icon: 'IconUsers',
		priority: 5,
		title: 'Customers',
		link: '#',
		slug: 'customers',
		children: [],
		onIconClick: () => console.log('Customers clicked'),
	},
	{
		id: 5,
		icon: 'IconCoins',
		title: 'Pricing',
		priority: 4,
		link: '#',
		slug: 'pricing',
		children: [
			{
				id: 11,
				icon: 'IconDashboard',
				link: '#',
				slug: 'bulk-pricing',
				title: 'Bulk Pricing',
				onIconClick: () => {},
			},
			{
				id: 12,
				icon: 'IconDashboard',
				link: '#',
				slug: 'costing',
				title: 'Costing',
				onIconClick: () => {},
			},
		],
		onIconClick: () => console.log('Navigate to Pricing'),
	},
	{
		id: 34,
		icon: 'IconCards',
		priority: 6,
		slug: 'catalogues',
		title: 'Catalogues',
		link: '#',
		children: [],
		onIconClick: () => console.log('Navigate to Catalogues'),
	},
];

const BOTTOM_ACTION = [
	{
		id: 8,
		icon: 'IconSettings',
		title: 'Settings',
		slug: 'settings',
		link: '#',
		onIconClick: () => console.log('Settings clicked'),
	},
	{
		id: 9,
		icon: 'IconLogout',
		slug: 'logout',
		title: 'Logout',
		link: '#',
		onIconClick: () => console.log('Logout clicked'),
	},
];

export const SidebarComponent: StoryFn = () => (
	<Sidebar active={1} logo={SourcewizLogo} sidebarItems={sidebarItems} bottomActions={BOTTOM_ACTION} />
);
