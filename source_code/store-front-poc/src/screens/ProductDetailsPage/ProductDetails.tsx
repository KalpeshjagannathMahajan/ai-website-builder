import React, { useContext, useEffect } from 'react';
import Header from './components/Header';
import { Grid, Image } from 'src/common/@the-source/atoms';
import CustomToast from 'src/common/CustomToast';
import ProductImageContainer from './components/Containers/ProductImageContainer';
import ProductInfoContainer from './components/Containers/ProductInfoContainer';
import useProductDetails from './useProductDetails';
import ProductDetailsContext from './context';
import SkeletonLoader from './components/Skeleton';
import _ from 'lodash';
import SimilarProductContainer from './components/Containers/SimilarProductContainer';
import FrequentProductRail from './components/Containers/FrequentProductRail';
import RelatedProductRail from './components/Containers/RelatedProductRail';
import { useParams } from 'react-router-dom';
import ImageLinks from 'src/assets/images/ImageLinks';
import { close_toast, show_toast } from 'src/actions/message';
import types from 'src/utils/types';
import { useDispatch } from 'react-redux';
import useStyles from './styles';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { Helmet } from 'react-helmet';
import { useSelector } from 'react-redux';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
import { RootState } from 'src/store';

const ProductDetailsComponent = () => {
	const { loading, product_details, toast, toggle_toast, showEmptyState, open, set_open, product_section, empty_state_text } =
		useContext(ProductDetailsContext);
	const { catalog_mode } = useSelector((state: RootState) => state?.catalog_mode);
	const { id } = useParams();
	const dispatch = useDispatch();
	const classes = useStyles();
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const image_url = product_details.media && product_details.media.length > 0 ? product_details.media[0].url : ImageLinks.ProductNotFound;

	const custom_attributes = product_details.custom_attributes;
	const description_attribute = custom_attributes
		? Object.values(custom_attributes).find((attr: any) => attr.name === 'Description')
		: null;

	const description_seo = description_attribute?.value;

	const pre_login = useSelector((state: any) => state?.preLogin);
	const company_title = pre_login?.company_name;

	useEffect(() => {
		const element: any = document.getElementById('rootContainer');
		element?.scrollTo(0, 0);
	}, [id]);

	useEffect(() => {
		if (showEmptyState) {
			dispatch<any>(
				show_toast({
					open: true,
					showCross: false,
					anchorOrigin: {
						vertical: types.VERTICAL_TOP,
						horizontal: types.HORIZONTAL_CENTER,
					},
					autoHideDuration: 3000,
					onClose: (event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
						if (reason === types.REASON_CLICK) {
							return;
						}
						dispatch(close_toast(''));
					},
					state: types.WARNING_STATE,
					title: 'Product not found',
					subtitle: empty_state_text,
					showActions: false,
				}),
			);
		}
	}, [showEmptyState]);

	const handle_render_loader = () => {
		return <SkeletonLoader />;
	};

	const handle_rails = () => {
		return _.sortBy(product_section?.rails, 'priority')
			?.filter((item) => item?.is_active !== false)
			?.map((rail) => {
				switch (rail?.type) {
					case 'frequently-bought-products':
					case 'frequently_bought_together':
						return <FrequentProductRail />;
					case 'similar_products':
					case 'similar_product':
						return <SimilarProductContainer />;
					case 'related-products':
					case 'related_products':
					case 'related_product':
						return <RelatedProductRail />;
					default:
						return null;
				}
			});
	};

	const handle_render_container = () => {
		if (showEmptyState) {
			return (
				<Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
					<Image src={ImageLinks.ProductNotFound} width={'300'} height={'244'} />
					<p style={{ fontSize: '18px', fontWeight: '700' }}>{empty_state_text}</p>
				</Grid>
			);
		}

		if (!_.isEmpty(product_details) && !loading && product_details?.id === id) {
			return (
				<React.Fragment>
					<Helmet>
						<title>{product_details.name}</title>
						<meta name='description' content={description_seo} data-react-helmet='true' />
						<meta name='keywords' content={`${product_details.name}, buy, ecommerce, product`} data-react-helmet='true' />

						{/* Open Graph Meta Tags */}
						<meta property='og:title' content={product_details.name} />
						<meta property='og:description' content={description_seo} />
						<meta property='og:type' content='product' />
						<meta property='og:url' content={window.location.href} />
						<meta property='og:image' content={image_url} />
						<meta property='og:site_name' content={company_title} />
					</Helmet>

					<Grid container className={classes.container}>
						<Grid container pt={is_ultron ? 1 : 0} gap={is_small_screen ? 2 : 0} mb={catalog_mode ? 5 : 0}>
							<ProductImageContainer />
							<ProductInfoContainer />
						</Grid>
						{handle_rails()}
					</Grid>

					{open && (
						<CustomToast
							open={open}
							showCross={false}
							is_custom={false}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'center',
							}}
							show_icon={true}
							autoHideDuration={5000}
							onClose={() => set_open(false)}
							state={'success'}
							title='All Done'
							subtitle='Customised Product added to cart'
							showActions={false}
						/>
					)}
				</React.Fragment>
			);
		} else {
			return handle_render_loader();
		}
	};

	return (
		<React.Fragment>
			<Header />
			{toast.show && (
				<CustomToast
					open={toast.show}
					showCross={true}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					show_icon={true}
					is_custom={false}
					autoHideDuration={toast?.time ?? 3000}
					onClose={() => {
						toggle_toast({ show: false, message: '', title: '', status: '' });
						toast?.callback && toast?.callback();
					}}
					state={toast.status}
					title={toast.title}
					subtitle={toast.message}
					showActions={false}
				/>
			)}
			{loading ? handle_render_loader() : handle_render_container()}
		</React.Fragment>
	);
};

const ProductDetails = () => {
	const value = useProductDetails();
	return (
		<ProductDetailsContext.Provider value={value}>
			<ProductDetailsComponent />
		</ProductDetailsContext.Provider>
	);
};

export default ProductDetails;
