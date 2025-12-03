import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';

import { Image, Button } from 'src/common/@the-source/atoms';
import RouteNames from 'src/utils/RouteNames';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removedProductsCount } from 'src/actions/cart';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

const useStyles = makeStyles(() => ({
	container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		gap: '20px',
		height: '60vh',
	},
}));

const EmptyCart = ({ handle_custom_product }: any) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const settings = useSelector((state: any) => state?.settings);

	useEffect(() => {
		dispatch(removedProductsCount(0));
	}, []);

	const handle_explore_products = () => {
		navigate(`${RouteNames.product.all_products.path}?search=`);
	};

	const image_src = is_ultron
		? 'https://frontend-bucket.vercel.app/images/empty_cart.png'
		: 'https://frontend-bucket.vercel.app/images/storefront/empty_cart_storefront.svg';

	return (
		<div className={classes.container}>
			<Image src={image_src} width={'320px'} height={'auto'} />
			<CustomText type='Title'>{t('CartSummary.EmptyCart.EmptyCart')}</CustomText>
			<Button onClick={handle_explore_products}>
				{settings?.enable_custom_line_item ? t('CartSummary.EmptyCart.AddExisting') : t('CartSummary.EmptyCart.ExploreProducts')}
			</Button>
			{settings?.enable_custom_line_item && (
				<Button variant='outlined' onClick={handle_custom_product}>
					{t('CartSummary.EmptyCart.CustomProducts')}
				</Button>
			)}
		</div>
	);
};

export default EmptyCart;
