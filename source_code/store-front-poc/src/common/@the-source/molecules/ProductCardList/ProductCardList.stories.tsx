import { Grid } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import Pagination from '../../atoms/Pagination/Pagination';
import Typography from '../../atoms/Typography/Typography';
import ProductCard from '../ProductCard/ProductCard';
import { mockProductList } from 'src/common/@the-source/molecules/ProductCardList';
import { useTheme } from '@mui/material/styles';

export default {
	title: 'SalesRep/ProductCardList',
	// component: ProductCard,
} as Meta<typeof ProductCard>;

const REACT_APP_CLOUDINARY = 'https://res.cloudinary.com/sourcewiz/image/upload';

const REACT_APP_DIRECTUS = 'https://sourcerer.tech/assets';

const ProductList = ({ mockData }: any) => {
	const theme: any = useTheme();
	return (
		<Grid>
			<Grid paddingY={2}>
				<Typography variant='subtitle-2' color={theme?.palette?.secondary[800]}>
					{mockData.result_message}
				</Typography>
			</Grid>
			<Grid container spacing={3}>
				{mockData.hits?.map((item: any) => (
					<Grid item key={item.id} xs>
						<ProductCard
							onProductCardClick={(id) => console.log(id)}
							handleVariant={(id) => console.log(id)}
							imageEnv={REACT_APP_CLOUDINARY}
							fallbackEnv={REACT_APP_DIRECTUS}
							data={item}
						/>
					</Grid>
				))}
			</Grid>
			<Grid container marginY={4} justifyContent='center'>
				<Grid item>
					<Pagination count={mockData.nbPages} onChange={() => console.log('page change')} />
				</Grid>
			</Grid>
		</Grid>
	);
};

export const List: StoryObj = {
	render: (args) => <ProductList mockData={mockProductList} {...args} />,
	args: {
		mockData: mockProductList,
	},
};
