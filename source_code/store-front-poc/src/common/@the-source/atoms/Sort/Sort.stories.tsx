import { Meta, StoryObj } from '@storybook/react';

import Box from '../Box';
import Sort from './Sort';

export default {
	title: 'Components/Sort',
	component: Sort,
} as Meta<typeof Sort>;

export const OutlinedWithLabel: StoryObj = {
	render: (args) => (
		<Box width={250}>
			<Sort
				fullWidth
				defaultSort='best_match'
				onChange={() => console.log('Selected')}
				options={[
					{ value: 'best_match', label: 'Best Match' },
					{ value: 'recent_first', label: 'Recent First' },
					{ value: 'product_id_asc', label: 'Product ID Asc' },
					{ value: 'product_id_desc', label: 'Product ID Desc' },
				]}
				{...args}
			/>
		</Box>
	),

	args: {
		options: [
			{ value: 'best_match', label: 'Best Match' },
			{ value: 'recent_first', label: 'Recent First' },
			{ value: 'product_id_asc', label: 'Product ID Asc' },
			{ value: 'product_id_desc', label: 'Product ID Desc' },
		],
	},
};
