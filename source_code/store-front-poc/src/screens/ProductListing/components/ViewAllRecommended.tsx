import React, { useEffect, useMemo, useState } from 'react';
import { Grid, PageHeader } from 'src/common/@the-source/atoms';
import { product_listing } from 'src/utils/api_requests/productListing';
import { useDispatch, useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { BuyerSwitch, Cart, CatalogSwitch, PageTitle, Wishlist } from 'src/common/PageHeaderComponents';
import SelectBuyerPanel from 'src/common/SelectBuyerPanel/SelectBuyerPanel';
import { card_template } from '../constants';
import { BUYER, GUEST_BUYER_ID } from 'src/screens/ProductDetailsPage/constants';
import useProductListingPageTemplate from '../useProductListingPageTemplate';
import { Drawer, Skeleton } from '@mui/material';
import AddQuickBuyer from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/AddQuickBuyer/AddQuickBuyer';
import SkeletonProductCard from './SkeletonProductCard';
import RouteNames from 'src/utils/RouteNames';
import { updateBreadcrumbs } from 'src/actions/topbar';
import ProductTemplateTwo from './ProductTemplate2';
import _ from 'lodash';
import PrevOrderCard from 'src/common/@the-source/molecules/PreviosOrderCard';
import { useLocation, useParams } from 'react-router-dom';
import SkeletonPrevOrderCard from './SkeletonPrevOrderCard';
import ErrorPage from 'src/common/@the-source/molecules/ErrorPages/Error';
import useBuyerDashboard from 'src/screens/BuyerDashboard/useBuyerDashboard';
import NoProducts from 'src/common/@the-source/molecules/ErrorPages/No_Products';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
import { get_customer_metadata } from 'src/utils/utils';
import usePricelist from 'src/hooks/usePricelist';
import useTenantSettings from 'src/hooks/useTenantSettings';
import constants from 'src/utils/constants';
// import cart_management from 'src/utils/api_requests/cartManagement';
// import Backdrop from 'src/common/@the-source/atoms/Backdrop';
// import { t } from 'i18next';

interface ViewAll {
	type?: string;
}

const ViewAllRecommended = ({ type = 'recommend' }: ViewAll) => {
	const dispatch = useDispatch();
	const location = useLocation();
	const params = useParams();
	const { id } = params;
	const product_id = id;
	const [error_screen, set_error_screen] = useState(false);
	const [loading, set_loading] = useState(true);
	const [is_redux, set_is_redux] = useState(location?.state?.from_redux);
	const [recommended_products, set_recommended_products] = useState([]);
	const [show_buyer_panel, toggle_buyer_panel] = useState(false);
	const [has_more, set_has_more] = useState(false);
	const buyer = useSelector((state: any) => state.buyer);
	const { initialize_cart } = useProductListingPageTemplate();
	const [is_buyer_add_form, set_is_buyer_add_form] = useState(false);
	const arr = [1, 2, 3, 4, 5];
	const is_previous = type === 'previous_order';
	const is_from_related = type === 'related-products' && product_id;
	const buyer_data = location?.state?.buyer_data;
	const cart_data = location?.state?.cart_data;
	const from_redux = location?.state?.from_redux;
	const prev_card_template = location?.state?.card_template;
	const { set_cart_data } = useBuyerDashboard();
	const { enable_wishlist } = useTenantSettings({
		[constants.TENANT_SETTINGS_KEYS.WISHLIST_ENABLED]: false,
	});
	const tenent_id = buyer?.buyer_id === BUYER.guest ? GUEST_BUYER_ID : is_redux || type === 'recommend' ? buyer?.buyer_id : buyer_data?.id;
	const [new_buyer_data, set_buyer_data] = useState({});
	const { catalog_switching_enabled_at_buyer_level = false } = useSelector((state: any) => state?.settings);
	const login = useSelector((state: any) => state?.login);
	const pricelist_value = usePricelist();
	const catalog_ids = [(is_redux || type === 'recommend' ? [pricelist_value?.value] : _.get(buyer_data, 'catalog.value')) || ''];
	// const cart = useSelector((state: any) => state?.cart);
	// const updated_cart = cart?.products;
	// const cart_id = _.get(buyer?.buyer_cart, 'id', '');
	// const [backdrop, set_backdrop] = useState(false);
	// const add_all_to_cart = useSelector((state: any) => state.settings.add_all_to_cart) || false;

	const is_logged_in = login?.status?.loggedIn;
	const customer_metadata = get_customer_metadata();

	const header_name = useMemo(() => {
		switch (type) {
			case 'previous_order':
				return {
					linkTitle: 'Previously Ordered',
					link: RouteNames.product.all_products.previously_ordered.path,
				};
			case 'abandoned_cart':
				return {
					linkTitle: 'Abandoned Cart',
					link: RouteNames.product.all_products.abandoned_cart.path,
				};
			case 'related-products':
				if (product_id) {
					return {
						linkTitle: 'Related Products',
						link: `${RouteNames.product.product_detail.routing_path}${id}/related-products`,
					};
				} else {
					return {
						linkTitle: 'Recommended',
						link: RouteNames.product.all_products.recommendation.path,
					};
				}
			default:
				return {
					linkTitle: 'Recommended',
					link: RouteNames.product.all_products.recommendation.path,
				};
		}
	}, [type, product_id]);

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
			linkTitle: header_name.linkTitle,
			link: header_name.link,
		},
	];

	const get_recommended_products = async () => {
		if (type === 'abandoned_cart') {
			const url_prams = new URLSearchParams(window.location.search);
			const buyer_id_from_params = url_prams.get('buyer_id');
			if (!buyer?.buyer_id || buyer_id_from_params !== buyer?.buyer_id) return;
		}

		try {
			let response: any;
			if (is_previous) {
				response = await product_listing.get_previous_ordered_product(tenent_id, catalog_ids);
			} else if (is_from_related) {
				response = await product_listing.get_all_related_products(buyer?.buyer_id, product_id, catalog_ids, is_logged_in);
			} else if (type === 'abondoned_cart') {
				response = await product_listing.get_analytics_rail(buyer?.buyer_id);
			} else {
				response = await product_listing.get_recommended_products({ tenent_id, catalog_ids });
			}
			if (response?.status_code === 200) {
				const { nbPages, page } = response?.data;
				set_recommended_products(type === 'abandoned_cart' ? response?.data?.products : response?.data);
				set_has_more(nbPages > page);
			}
			// set_error_screen(response?.data?.length === 0);
			set_loading(false);
		} catch (error) {
			set_error_screen(true);
			set_loading(false);
			console.error(error);
		} finally {
			set_loading(false);
		}
	};

	// const handle_add_all_to_cart = async () => {
	// 	set_backdrop(true);

	// 	try {
	// 		const promises = recommended_products.map((curr: any) => {
	// 			const { min_order_quantity = 0, product_id: _product_id = '' } = curr?.pricing;

	// 			const payload = {
	// 				cart_id,
	// 				product_id: _product_id,
	// 				quantity: min_order_quantity > 0 ? min_order_quantity : 1,
	// 				is_custom_product: false,
	// 			};

	// 			if (!updated_cart.hasOwnProperty(_product_id)) {
	// 				return cart_management.update_item(payload);
	// 			}

	// 			return Promise.resolve();
	// 		});

	// 		await Promise.all(promises);

	// 		initialize_cart();
	// 	} catch (error) {
	// 		console.error('Error updating the cart:', error);
	// 	}
	// 	set_backdrop(false);
	// };

	useEffect(() => {
		set_loading(true);
		dispatch(updateBreadcrumbs(breadCrumbList));
	}, []);

	useEffect(() => {
		set_is_redux(true);
		get_recommended_products();
	}, [buyer?.buyer_id, pricelist_value, product_id, type]);

	useEffect(() => {
		initialize_cart();
	}, [buyer?.buyer_cart]);

	const infiniteHits = () => {
		return (
			<InfiniteScroll
				dataLength={recommended_products.length}
				scrollableTarget='rootContainer'
				loader={
					<Grid className='Loader' direction='row' container columns={{ xs: 12, sm: 12, md: 12, lg: 15, xl: 15 }}>
						{loading && (
							<>
								{arr.map((a: any) => (
									<Grid key={a} xs={6} sm={4} md={4} lg={3} xl={3} item>
										<SkeletonProductCard />
									</Grid>
								))}
							</>
						)}
					</Grid>
				}
				next={function () {
					throw new Error('Function not implemented.');
				}}
				hasMore={has_more}>
				<Grid
					container
					spacing={1.5}
					columns={{ xs: 12, sm: 12, md: 12, lg: is_previous ? 12 : 15, xl: is_previous ? 12 : 15 }}
					alignItems='stretch'>
					{!loading ? (
						<React.Fragment>
							{recommended_products.map((product: any) => {
								return (
									<React.Fragment>
										{!is_previous ? (
											<Grid key={product?.id} xs={12} sm={4} md={4} lg={3} xl={3} item>
												<ProductTemplateTwo
													container_style={{ justifyContent: 'space-around' }}
													product={product}
													cards_template={card_template}
													has_similar={false}
													is_previous={is_previous}
													page_name='products_reco_listing_page'
													section_name=''
												/>
											</Grid>
										) : (
											<Grid key={product?.id} xs={12} sm={12} md={6} lg={4} xl={4} item>
												<PrevOrderCard
													prev_card_template={prev_card_template}
													prev_data={product}
													buyer={buyer_data}
													cart_data={cart_data}
													set_cart={set_cart_data}
													from_redux={from_redux}
													// is_responsive={true}
													from_view_all={true}
													page_name='previously_ordered_listing_page'
													section_name=''
													customer_metadata={customer_metadata}
													catalog_ids={catalog_ids}
												/>
											</Grid>
										)}
									</React.Fragment>
								);
							})}
						</React.Fragment>
					) : (
						<>
							{is_previous ? (
								<SkeletonPrevOrderCard is_rail={false} />
							) : (
								<>
									{arr.map((a: any) => (
										<Grid key={a} xs={12} sm={4} md={4} lg={3} xl={3} item>
											<SkeletonProductCard />
										</Grid>
									))}
								</>
							)}
						</>
					)}
				</Grid>
			</InfiniteScroll>
		);
	};

	// const handle_bar_code = async () => {
	// 	console.log('handle_bar_code');
	// };

	return (
		<>
			{!error_screen ? (
				<Grid container justifyContent='space-between' direction='row'>
					{!loading ? (
						<PageHeader
							leftSection={
								<PageTitle
									title={header_name.linkTitle}
									allow_back={true}
									subtitle={`Showing ${recommended_products?.length} ${recommended_products?.length > 1 ? 'results' : 'result'}`}
									// button={
									// 	_.size(recommended_products) > 0 &&
									// 	add_all_to_cart && (
									// 		<Button
									// 			sx={{ padding: 0 }}
									// 			variant='text'
									// 			onClick={handle_add_all_to_cart}
									// 			disabled={utils.check_disabled_for_add_all_to_cart(recommended_products, updated_cart)}>
									// 			{t('PDP.Common.AddAllToCart')}
									// 		</Button>
									// 	)
									// }
								/>
							}
							rightSection={
								is_ultron ? (
									<div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
										<BuyerSwitch onClick={() => toggle_buyer_panel(true)} />
										{(catalog_switching_enabled_at_buyer_level || buyer?.is_guest_buyer) && <CatalogSwitch />}
										{enable_wishlist && <Wishlist />}
										<Cart />
									</div>
								) : null
							}
						/>
					) : (
						<Grid container display={'flex'} justifyContent={'space-between'} sx={{ padding: '1.7rem 2rem' }} alignItems={'center'}>
							<Grid width={'fit-content'}>
								<Skeleton height={'2rem'} variant='text' width={'10.7rem'} />
								<Skeleton height={'1.9rem'} variant='text' width={'10.7rem'} />
							</Grid>
							<Grid container display={'flex'} justifyContent={'space-between'} gap={1} width={'fit-content'}>
								<Skeleton height={'4rem'} variant='rounded' width={'14.7rem'} />
								<Skeleton height={'4rem'} variant='rounded' width={'4rem'} />
							</Grid>
						</Grid>
					)}
					{infiniteHits()}
					{is_ultron && (
						<SelectBuyerPanel
							show_drawer={show_buyer_panel}
							toggle_drawer={toggle_buyer_panel}
							set_is_buyer_add_form={set_is_buyer_add_form}
							buyer_data={new_buyer_data}
							set_buyer_data={set_buyer_data}
						/>
					)}
					{is_buyer_add_form && (
						<Drawer
							PaperProps={{ sx: { width: 600 } }}
							anchor='right'
							open={is_buyer_add_form}
							onClose={() => set_is_buyer_add_form(false)}>
							<AddQuickBuyer is_detailed={false} from_cart set_is_buyer_add_form={set_is_buyer_add_form} set_buyer_data={set_buyer_data} />
						</Drawer>
					)}
				</Grid>
			) : (
				<ErrorPage is_back={true} />
			)}
			{recommended_products?.length === 0 && !loading && <NoProducts />}
			{/* <Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={backdrop}>
				<CircularProgress color='inherit' />
			</Backdrop> */}
		</>
	);
};

export default ViewAllRecommended;
