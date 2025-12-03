import { Box } from '@mui/material';
import { Meta, StoryFn } from '@storybook/react';

import VariantCard from './VariantCard';

export default {
	title: 'salesRep/VariantCards',
	component: VariantCard,
} as Meta<typeof VariantCard>;

export const Basic: StoryFn = () => {
	const data = [
		{
			id: '32bbaf8b-aeaf-45d2-bfc9-1770a33e0d07',
			variant_id: 'RIS-BTH-8332',
			is_selected: 'true/false',
			product_image: '72464536-0783-46cb-9e9e-54de015a0b5d',
			heading: '123456',
			sub_heading: '$25',
			is_customizable: 'true/false',
			cart: {
				is_added: 'true/false',
				quantity: 1,
				product_id: 'abc',
			},
			inventory: {
				min_order_quantity: 5,
				incremental_value: 10,
				max_order_quantity: 100,
				stock: 100,
			},
			attributes: [
				{
					key: 'Color',
					value: 'Sage green',
					priority: 1,
				},
				{
					key: 'Size',
					value: '240 x 280 inches',
					priority: 2,
				},
				{
					key: 'In stock',
					value: '40 pcs',
					priority: 3,
				},
			],
		},
	];

	return (
		<Box>
			{data?.map((item: any) => (
				<VariantCard
					background='#F7F8FA'
					data={item}
					handleIncrement={() => console.log('++')}
					handleDecrement={() => console.log('--')}
					handleLimit={() => console.log('limit handler')}
					handleRemoveFromCart={() => console.log('Remove Cart Handler')}
				/>
			))}
		</Box>
	);
};
