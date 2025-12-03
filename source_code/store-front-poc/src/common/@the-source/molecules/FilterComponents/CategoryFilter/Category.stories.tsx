import { Meta, StoryObj } from '@storybook/react';

import { Grid } from '../../../atoms';
import Category from './Category';
import CATEGORYDATA from './categoryMock.json';

export default {
	title: 'SalesRep/Category',
	component: Category,
} as Meta<typeof Category>;

export const Basic: StoryObj = {
	render: (args) => (
		<Grid container spacing={3}>
			<Grid item width={300}>
				<Category onApply={(payload) => console.log(payload)} categoryList={CATEGORYDATA?.category} {...args} />
			</Grid>
			<Grid item width={300}>
				<Category
					onApply={(payload) => console.log(payload)}
					categoryList={CATEGORYDATA?.category_2}
					applied={[
						'Clothing',
						'Home & Kitchen > Home Decor > Artwork > Wall Stickers > Wall Decal',
						'Home & Kitchen > Home Decor > Rugs & Pads',
					]}
					{...args}
				/>
			</Grid>
		</Grid>
	),
};
