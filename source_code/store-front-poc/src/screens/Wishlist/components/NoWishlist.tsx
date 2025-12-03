import { Box, Button, Grid, Image } from 'src/common/@the-source/atoms';
import { makeStyles } from '@mui/styles';
import CustomText from 'src/common/@the-source/CustomText';
import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';
import ImageLinks from 'src/assets/images/ImageLinks';

const useStyles = makeStyles(() => ({
	no_wishlist_container: {
		flex: 1,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '24px',
	},
	no_wishlist_text: {
		textAlign: 'center',
		display: 'flex',
		flexDirection: 'column',
		gap: '8px',
	},
}));

interface NoWishlistProps {
	title: string;
	description: string;
}

const NoWishlist = ({ title, description }: NoWishlistProps) => {
	const classes = useStyles();
	const navigate = useNavigate();

	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';

	return (
		<Grid className={classes.no_wishlist_container}>
			<Image
				src={is_ultron ? ImageLinks.empty_wishlist : ImageLinks.no_wishlist_storefront}
				width={300}
				height={'auto'}
				style={{ objectFit: 'contain' }}
				alt='No Wishlist'
			/>
			<Box className={classes.no_wishlist_text}>
				<CustomText type='H2'>{title}</CustomText>
				<CustomText type='Title'>{description}</CustomText>
			</Box>
			<Button onClick={() => navigate(is_ultron ? '/' : '/all-products')}>{t('Wishlist.NoWishList.StartExploreBtn')}</Button>
		</Grid>
	);
};

export default NoWishlist;
