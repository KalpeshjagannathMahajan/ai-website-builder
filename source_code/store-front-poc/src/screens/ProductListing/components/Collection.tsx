import { Grid, Image, PageHeader } from 'src/common/@the-source/atoms';
import { useEffect, useState } from 'react';
import { product_listing } from 'src/utils/api_requests/productListing';
import { Card, Drawer, styled } from '@mui/material';
import SkeletonCollectionsCard from './SkeletonCollectionsCard';
import { useNavigate } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import { BuyerSwitch, Cart, CatalogSwitch, PageTitle } from 'src/common/PageHeaderComponents';
import SelectBuyerPanel from 'src/common/SelectBuyerPanel/SelectBuyerPanel';
import AddQuickBuyer from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/AddQuickBuyer/AddQuickBuyer';
import useProductListingPageTemplate from '../useProductListingPageTemplate';
import { useDispatch, useSelector } from 'react-redux';
import { updateBreadcrumbs } from 'src/actions/topbar';
import { useTranslation } from 'react-i18next';
import constants from 'src/utils/constants';
import get_product_image from 'src/utils/ImageConstants';
import { makeStyles } from '@mui/styles';
import CustomText from 'src/common/@the-source/CustomText';
import { useTheme } from '@mui/material/styles';

import { Mixpanel } from 'src/mixpanel';
import Events from 'src/utils/events_constants';
import { Helmet } from 'react-helmet';
import ImageLinks from 'src/assets/images/ImageLinks';
import usePricelist from 'src/hooks/usePricelist';
import _ from 'lodash';
interface MediaItem {
	type: string;
	view_type: string;
	url: string;
}

interface CardData {
	priority: number;
	name: string;
	media: MediaItem[] | [];
	id: string;
	product_count: number;
}

const useStyles = makeStyles((theme: any) => ({
	card: {
		height: '20rem',
		border: 'none',
		boxShadow: 'none',
		borderRadius: '.8rem',
		cursor: 'pointer',
		...theme?.card_,
	},
	container: {
		position: 'relative',
		bottom: '4rem',
		left: '2rem',
		zIndex: '1',
	},
	text: {
		lineHeight: '2rem',
		textShadow: ' 2px 2px 4px rgba(0, 0, 0, 0.5)',
	},
}));
const GradientImage = styled('div')`
	position: relative;
	/* width: 286px; */
	height: 200px;

	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%);
		z-index: 1;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
`;

const CollectionHome = () => {
	const classes = useStyles();
	const [containers, setContainers] = useState<CardData[]>([]);
	const [loading, setLoading] = useState(true);
	const [show_buyer_panel, toggle_buyer_panel] = useState(false);
	const [is_buyer_add_form, set_is_buyer_add_form] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const [buyer_data, set_buyer_data] = useState({});
	const buyer = useSelector((state: any) => state?.buyer);
	const theme: any = useTheme();
	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';
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
			linkTitle: 'Collection',
			link: `${RouteNames.product.all_products.collection.path}`,
		},
	];

	useEffect(() => {
		initialize_cart();
	}, [buyer?.buyer_cart, pricelist_value]);

	useEffect(() => {
		const fetchContainerDetails = async () => {
			try {
				const query_params = `?catalog_id=${pricelist_value?.value}`;
				const response: any = await product_listing.get_collection(query_params);
				if (Array.isArray(response?.data)) {
					const filteredData = hide_empty_products ? _.filter(response.data, (item: any) => item?.product_count > 0) : response.data;
					setContainers(filteredData);
				} else {
					console.error(t('ProductList.Main.NotArrayError'), response?.content?.data);
				}
			} catch (error) {
				console.error(t('ProductList.Main.FetchingError'), error);
			}
		};

		const fetchData = async () => {
			setTimeout(async () => {
				await fetchContainerDetails();
				setLoading(false);
			}, 1000);
		};

		fetchData();
		dispatch(updateBreadcrumbs(breadCrumbList));
	}, [pricelist_value]);

	if (loading) {
		return (
			<Grid container direction='column'>
				<SkeletonCollectionsCard />
			</Grid>
		);
	}
	const handle_collection_click = (id: string, name: string) => {
		navigate(`${RouteNames.product.all_products.collection_listing.routing_path}${name}/${id}?search=`);
		Mixpanel.track(Events.COLLECTION_CLICKED, {
			tab_name: 'Products',
			page_name: 'collection_listing_page',
			section_name: '',
			subtab_name: '',
			customer_metadata,
		});
	};

	return (
		<>
			<Helmet>
				<title>Collection</title>
				<meta name='description' content='Buy the best at the best price.' />
				<meta name='keywords' content='collection, buy, ecommerce, product' />

				{/* Open Graph Meta Tags */}
				<meta property='og:title' content='Collection' />
				<meta property='og:description' content='Discover our curated collection of products at the best prices.' />
				<meta property='og:type' content='website' />
				<meta property='og:url' content={window.location.href} />
				<meta property='og:image' content={LogoWithText} />
				<meta property='og:image:alt' content='Browse our products' />
				<meta property='og:site_name' content={company_title} />
			</Helmet>
			<Grid container direction='row'>
				<Grid width='100%' mb={1}>
					<PageHeader
						shiftToNextLine={true}
						leftSection={
							<PageTitle
								title={'Collections'}
								allow_back={true}
								subtitle={`Showing ${
									containers?.filter((item: CardData) => (hide_empty_products ? item?.product_count > 0 : true))?.length
								} ${
									containers?.filter((item: CardData) => (hide_empty_products ? item?.product_count > 0 : true))?.length > 1
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
				</Grid>
				<Grid container alignItems='stretch' spacing={2.4}>
					{containers
						?.filter((item: CardData) => (hide_empty_products ? item?.product_count > 0 : true))
						?.map((item: CardData) => (
							<Grid key={item?.id} xs={12} sm={6} md={4} lg={3} xl={3} item>
								<Card className={classes.card} onClick={() => handle_collection_click(item?.id, item?.name)} key={item?.id}>
									<GradientImage>
										<Image
											style={{ objectFit: 'contain' }}
											fallbackSrc={constants.FALLBACK_IMAGE}
											src={get_product_image(item, 'COLLECTIONS_CARD')}
											alt='Collection Image'
										/>
									</GradientImage>
									<Grid container direction='column' justifyContent='flex-end' className={classes.container}>
										<CustomText type='H6' color={theme?.product?.collection?.color} className={classes.text}>
											{item?.name}
										</CustomText>
									</Grid>
								</Card>
							</Grid>
						))}
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

export default CollectionHome;
