import { Grid } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { response } from 'src/common/@the-source/molecules/ProductCard/';
import { newHit } from 'src/common/@the-source/molecules/ProductCard/';
import ProductCard from './ProductCard';

export default {
	title: 'SalesRep/ProductCard',
	component: ProductCard,
} as Meta<typeof ProductCard>;

const REACT_APP_CLOUDINARY = 'https://res.cloudinary.com/sourcewiz/image/upload';

const REACT_APP_DIRECTUS = 'https://sourcerer.tech/assets';

const UpdatedHitData = {
	imageFit: 'cover',
	product_images: ['a6a211c3-dace-42b2-b416-9d3bcfc40d6f'],
	favourite: null,
	inventory: {
		min_order_quantity: 5,
		incremental_value: 10,
		max_order_quantity: 100,
		stock: 500,
		name: 'In Stock: 500 pcs',
		box_color: 'primary',
		show_stock_list: true,
		list: ['In Stock: 100 pcs', 'On Hold: 100 pcs', 'On Loom: 50 pcs'],
	},
	cart: [
		{
			id: 'd495b1dc-499f-46fa-afb6-15c29f55bc4e',
			quantity: 15,
		},
	],
	badges: [
		{
			values: [],
			position: 'top-left',
			is_visible: true,
		},
		{
			values: [],
			position: 'bottom-left',
			is_visible: true,
		},
	],
	lines: [
		{
			line: [
				{
					key: 'entity_id',
					label: 'ID',
					order: 1,
					position: 'left',
					text_type: 'h5',
					text_color: 'default',
					text: 'ID - CH-2009-T',
				},
			],
			priority: 1,
		},
		{
			line: [
				{
					key: 'attributes.Primary Color',
					label: 'Color',
					position: 'left',
					text_type: 'subtitle1',
					text_color: 'default',
					truncateIn: 2,
					text: 'Color - Navy',
				},
			],
			priority: 2,
		},
		{
			line: [
				{
					key: 'attributes.Pattern',
					label: 'Pattern',
					position: 'left',
					text_type: 'normal',
					text_color: 'default',
					text: 'Pattern - Southwestern',
				},
			],
			priority: 3,
		},
		{
			line: [
				{
					key: 'price_level',
					label: null,
					position: 'left',
					text_type: 'subtitle2',
					text_color: 'default',
					text: '🔐 Price Locked 🔐',
				},
			],
			priority: 4,
		},
	],
	variant: {
		has_variant: false,
		count: 0,
	},
	priority: 0,
	section: 'product',
	page_name: 'search',
	id: 'd495b1dc-499f-46fa-afb6-15c29f55bc4e',
	entity_id: 'CH-2009-T',
	tenant_id: '03b40c6a-6a15-47f6-90d1-e56bdf8ec1c6',
};

export const Basic: StoryObj = {
	render: (args) => (
		<Grid container spacing={3}>
			<Grid item width={360}>
				<ProductCard
					onProductCardClick={(id) => console.log(id)}
					handleVariant={(id) => console.log(id)}
					imageEnv={REACT_APP_CLOUDINARY}
					data={newHit}
					{...args}
				/>
			</Grid>
		</Grid>
	),

	args: {
		data: newHit,
	},
};

export const Basic2: StoryObj = {
	render: (args) => (
		<Grid container spacing={3}>
			<Grid item width={360}>
				<ProductCard
					onProductCardClick={(id) => console.log(id)}
					handleVariant={(id) => console.log(id)}
					imageEnv={REACT_APP_CLOUDINARY}
					fallbackEnv={REACT_APP_DIRECTUS}
					data={UpdatedHitData}
					{...args}
				/>
			</Grid>
		</Grid>
	),
};

export const Variants: StoryObj = {
	render: (args) => (
		<Grid container rowSpacing={3} columnSpacing={{ xs: 2, md: 1.5, lg: 1, xl: 1 }} justifyContent='flex-start' maxWidth='100%'>
			{response.hits?.map((item: any) => (
				<Grid item key={item.id} xs lg={3} xl={3}>
					<ProductCard
						onProductCardClick={(id) => console.log(id)}
						handleVariant={(id) => console.log(id)}
						imageEnv={REACT_APP_CLOUDINARY}
						fallbackEnv={REACT_APP_DIRECTUS}
						data={item}
						{...args}
					/>
				</Grid>
			))}
		</Grid>
	),
};
