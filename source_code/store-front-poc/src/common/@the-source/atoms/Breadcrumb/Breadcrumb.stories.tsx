import { Meta, StoryObj } from '@storybook/react';

import Breadcrumb from './Breadcrumb';

export default {
	title: 'Components/Breadcrumb',
	component: Breadcrumb,
} as Meta<typeof Breadcrumb>;

export const BreadcrumbsDefault: StoryObj = {
	render: (args) => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
			<Breadcrumb
				links={[
					{ id: 1, linkTitle: 'Home', link: '/' },
					{ id: 2, linkTitle: 'Products', link: '/all-products' },
				]}
				{...args}
			/>
			<Breadcrumb
				links={[
					{ id: 1, linkTitle: 'Home', link: '/' },
					{ id: 2, linkTitle: 'Products', link: '/all-products' },
					{ id: 3, linkTitle: 'Product 0', link: '/all-products' },
				]}
				{...args}
			/>
			<Breadcrumb
				links={[
					{ id: 1, linkTitle: 'Home', link: '/' },
					{ id: 2, linkTitle: 'Products', link: '/all-products' },
					{ id: 3, linkTitle: 'Product 0', link: '/all-products' },
					{ id: 4, linkTitle: 'Variants', link: '/all-products' },
				]}
				{...args}
			/>
		</div>
	),
};

export const BreadcrumbsChevron: StoryObj = {
	render: (args) => (
		<Breadcrumb
			seperatorIcon='chevron'
			links={[
				{ id: 1, linkTitle: 'Home', link: '/' },
				{ id: 2, linkTitle: 'All Products', link: '/all-products' },
				{ id: 3, linkTitle: 'Product 0', link: '/all-products' },
				{ id: 4, linkTitle: 'Variants', link: '/all-products' },
			]}
			{...args}
		/>
	),
};
