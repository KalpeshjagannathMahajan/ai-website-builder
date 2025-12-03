import { Grid, Image, PageHeader } from 'src/common/@the-source/atoms';
import { useEffect, useState } from 'react';
import { product_listing } from 'src/utils/api_requests/productListing';
import { Card, Drawer } from '@mui/material';
import SkeletonCategoryCard from './SkeletonCategoryCard';
import { CardData } from '../constants';
import { useNavigate } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import { BuyerSwitch, Cart, CatalogSwitch, PageTitle } from 'src/common/PageHeaderComponents';
import SelectBuyerPanel from 'src/common/SelectBuyerPanel/SelectBuyerPanel';
import { useDispatch, useSelector } from 'react-redux';
import AddQuickBuyer from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/AddQuickBuyer/AddQuickBuyer';
import useProductListingPageTemplate from '../useProductListingPageTemplate';
import { updateBreadcrumbs } from 'src/actions/topbar';
import { useTranslation } from 'react-i18next';
import constants from 'src/utils/constants';
import get_product_image from 'src/utils/ImageConstants';
import { makeStyles } from '@mui/styles';
import CustomText from 'src/common/@the-source/CustomText';
import { useTheme } from '@mui/material/styles';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
import { Mixpanel } from 'src/mixpanel';
import Events from 'src/utils/events_constants';
import { Helmet } from 'react-helmet';
import ImageLinks from 'src/assets/images/ImageLinks';
import usePricelist from 'src/hooks/usePricelist';

const useStyles = makeStyles((theme: any) => ({
	card: {
		background: 'none',
		boxShadow: 'none !important',
		cursor: 'pointer',
		margin: '1rem',
	},
	img_container: {
		display: 'flex',
		alignItems: 'center',
		gap: '1rem',
		justifyContent: 'center',
		boxShadow: 'none',
		borderRadius: '1.2rem',
		...theme?.image_,
	},
	image: {
		width: '250px',
		height: '250px',
		maxHeight: '250px',
		minHeight: '250px',
		objectFit: 'contain',
		borderRadius: '1.2rem',
		...theme?.image_,
	},
	header: {
		lineHeight: '2.4rem',
		margin: '.2rem',
	},
	sub_header: {
		lineHeight: '2rem',
		margin: '.2rem',
	},
}));

const CategoryHome = () => {
	const classes = useStyles();
	const [containers, setContainers] = useState<CardData[]>([]);
	const [show_buyer_panel, toggle_buyer_panel] = useState(false);
	const [is_buyer_add_form, set_is_buyer_add_form] = useState(false);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const [buyer_data, set_buyer_data] = useState({});
	const buyer = useSelector((state: any) => state?.buyer);
	const theme: any = useTheme();
	const pricelist_value = usePricelist();
	const { initialize_cart, customer_metadata } = useProductListingPageTemplate();
	const wizshop_settings_local: any = localStorage.getItem('wizshop_settings');
	const wizshop_settings = JSON.parse(wizshop_settings_local);
	const hide_empty_products = wizshop_settings?.hide_empty_products || false;
	const { catalog_switching_enabled_at_buyer_level = false } = useSelector((state: any) => state?.settings);
	const { LogoWithText } = ImageLinks;
	const pre_login = useSelector((state: any) => state?.preLogin);
	const company_title = pre_login?.company_name;
	const breadCrumbList = [
		{
			id: 1,
			linkTitle: 'Dashboard',
			link: RouteNames.dashboard.path,
		},
		{
			id: 2,
			linkTitle: 'Products',
			link: `${RouteNames.product.all_products.path}`,
		},
		{
			id: 3,
			linkTitle: 'Category',
			link: `${RouteNames.product.all_products.category.path}`,
		},
	];

	const fetchContainerDetails = async () => {
		try {
			const query_params = `?type=category&catalog_id=${pricelist_value?.value}`;
			const response: any = await product_listing.get_category(query_params);
			if (Array.isArray(response?.data)) {
				setContainers(response.data);
			} else {
				console.error(t('ProductList.Main.NotArrayError'), response?.content?.data);
			}
		} catch (error) {
			console.error(t('ProductList.Main.FetchingError'), error);
		}
	};

	const fetchData = async () => {
		setTimeout(async () => {
			setLoading(true);
			await fetchContainerDetails();
			setLoading(false);
		}, 1000);
	};

	useEffect(() => {
		initialize_cart();
	}, [buyer?.buyer_cart, pricelist_value?.value]);

	useEffect(() => {
		fetchData();
		dispatch(updateBreadcrumbs(breadCrumbList));
	}, [pricelist_value?.value]);

	const handle_category_click = (id: string, name: string) => {
		navigate(`${RouteNames.product.all_products.category_listing.routing_path}${name}/${id}?search=`);
		Mixpanel.track(Events.CATEGORY_CLICKED, {
			tab_name: 'Products',
			page_name: 'category_listing_page',
			section_name: '',
			subtab_name: '',
			customer_metadata,
		});
	};

	return (
		<>
			<Helmet>
				<title>Categories</title>
				<meta name='description' content='Explore our diverse collections of products.' />
				<meta name='keywords' content='collections, products, shopping, online store, trends' />

				{/* Open Graph Meta Tags */}
				<meta property='og:title' content='Categories - Explore Our Product Collections' />
				<meta property='og:description' content='Discover a wide range of product collections tailored to meet all your needs.' />
				<meta property='og:type' content='website' />
				<meta property='og:url' content={window.location.href} />
				<meta property='og:image' content={LogoWithText} />
				<meta property='og:image:alt' content='Browse our products' />
				<meta property='og:site_name' content={company_title} />
			</Helmet>
			<Grid container direction='row'>
				<PageHeader
					shiftToNextLine={true}
					leftSection={
						<PageTitle
							title={'Categories'}
							allow_back={true}
							subtitle={`Showing ${
								containers.filter((item) => item?.level === 1 && (hide_empty_products ? item?.product_count > 0 : true))?.length
							} ${
								containers.filter((item) => item?.level === 1 && (hide_empty_products ? item?.product_count > 0 : true))?.length > 1
									? 'results'
									: 'result'
							}`}
						/>
					}
					rightSection={
						is_ultron ? (
							<div style={{ display: 'flex', gap: '10px' }}>
								<BuyerSwitch onClick={() => toggle_buyer_panel(true)} />
								{(catalog_switching_enabled_at_buyer_level || buyer?.is_guest_buyer) && <CatalogSwitch />}
								<Cart />
							</div>
						) : null
					}
				/>
				<Grid container alignItems='stretch'>
					{loading ? (
						<SkeletonCategoryCard />
					) : (
						containers
							?.filter((item) => item?.level === 1 && (hide_empty_products ? item?.product_count > 0 : true))
							?.map((item: CardData) => (
								<Grid
									key={item?.id}
									xs={12}
									sm={6}
									md={4}
									lg={3}
									xl={2.4}
									item
									sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
									<Card sx={{ ...theme?.card_ }} className={classes.card} onClick={() => handle_category_click(item?.id, item?.name)}>
										<Grid className={classes.img_container} item sx={{ ...theme?.product?.category, width: '252px', height: '252px' }}>
											<Image
												src={get_product_image(item, 'CATEGORY_CARD')}
												fallbackSrc={get_product_image(constants.FALLBACK_IMAGE, 'CATEGORY_CARD')}
												imgClass={classes.image}
												style={{ background: theme?.product?.category_image?.background }}
												alt='Category Image'
											/>
										</Grid>

										<Grid container direction='column' justifyContent='flex-end'>
											<CustomText type='H6' className={classes.header}>
												{item?.name}
											</CustomText>
											<CustomText type='Body' color='rgba(0, 0, 0, 0.60)' className={classes.sub_header}>
												{`${item?.product_count} products`}
											</CustomText>
										</Grid>
									</Card>
								</Grid>
							))
					)}
				</Grid>
				{is_ultron && (
					<SelectBuyerPanel
						show_drawer={show_buyer_panel}
						toggle_drawer={toggle_buyer_panel}
						set_is_buyer_add_form={set_is_buyer_add_form}
						buyer_data={buyer_data}
						set_buyer_data={set_buyer_data}
					/>
				)}
				{is_buyer_add_form && (
					<Drawer PaperProps={{ sx: { width: 600 } }} anchor='right' open={is_buyer_add_form} onClose={() => set_is_buyer_add_form(false)}>
						<AddQuickBuyer is_detailed={false} from_cart set_is_buyer_add_form={set_is_buyer_add_form} set_buyer_data={set_buyer_data} />
					</Drawer>
				)}
			</Grid>
		</>
	);
};

export default CategoryHome;
