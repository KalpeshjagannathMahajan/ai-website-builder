import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { product_listing } from 'src/utils/api_requests/productListing';
import { Box, Breadcrumb, Grid, Icon, PageHeader, Skeleton } from 'src/common/@the-source/atoms';
import ExploreAllProductListing from './components/ExploreAllProductsListing';
import { useDispatch, useSelector } from 'react-redux';
import RouteNames from 'src/utils/RouteNames';
import { updateBreadcrumbs } from 'src/actions/topbar';
import _ from 'lodash';
import CategoriesRail from './components/CategoriesRail';
import RecommendedRail from './components/RecomendedRail';
import PreviousOrderRail from './components/PreviousOrderRail';
import CollectionsRail from './components/CollectionsRail';
import { BuyerSwitch, Cart, CatalogSwitch, PageHeaderMenuOptions, PageTitle, Wishlist } from 'src/common/PageHeaderComponents';
import SelectBuyerPanel from 'src/common/SelectBuyerPanel/SelectBuyerPanel';
import AddQuickBuyer from '../BuyerLibrary/AddEditBuyerFlow/components/AddQuickBuyer/AddQuickBuyer';
import { Drawer } from '@mui/material';
import useProductListingPageTemplate from './useProductListingPageTemplate';
import { CardData } from './constants';
import CustomRail from './components/CustomRail';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import GlobalSearch from 'src/common/@the-source/molecules/GlobalSearch/GlobalSearch';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { get_customer_metadata } from 'src/utils/utils';
import useTenantSettings from 'src/hooks/useTenantSettings';
import constants from 'src/utils/constants';
import SkeletonCategory from './components/SkeletonCategory';
import SkeletonCollections from './components/SkeletonCollections';
import SkeletonProductCard from './components/SkeletonProductCard';
import usePricelist from 'src/hooks/usePricelist';

const useStyles = makeStyles((theme: any) => ({
	breadcrumbs_style: {
		...theme?.product?.bread_crumb_styles,
	},
}));

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
const is_store_front = VITE_APP_REPO === 'store_front';
// import usePricelist from 'src/hooks/usePricelist';

const { TENANT_SETTINGS_KEYS } = constants;

const style = {
	left_container: {
		display: 'flex',
		width: '100%',
		gap: '10px',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	back_icon: {
		cursor: 'pointer',
		margin: '1rem',
		marginLeft: '0',
		height: '24px',
		width: '24px',
	},
	skeleton_container_style: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
};

export interface APILoaded {
	categories: boolean;
	collections: boolean;
}

export interface Sort {
	label: string;
	is_default: boolean;
	key: {
		field: string;
		order: string;
		nested?: any;
	};
}

export interface ISearchConfig {
	large_label: string;
	short_label: string;
	value: string;
	is_default: boolean;
	is_active?: boolean;
}

const ProductListingComp = ({ catalog_mode, pricelist_value }: any) => {
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const [searchParams] = useSearchParams();
	const [show_buyer_panel, toggle_buyer_panel] = useState(false);
	const [is_buyer_add_form, set_is_buyer_add_form] = useState(false);
	const [categories, set_categories] = useState<CardData[]>([]);
	const [collections, set_collections] = useState<CardData[]>([]);
	const [search, set_search] = useState(searchParams.get('search') || '');
	const show_discount_engine = useSelector((state: any) => state?.settings?.enable_discount_engine) ?? false;
	const [type] = useState('product');
	// API flags
	const [api_counter, set_api_counter] = useState<APILoaded>({ categories: false, collections: false });
	const dispatch = useDispatch();
	const { initialize_cart, cart, get_discount_campaign, discount_campaigns } = useProductListingPageTemplate();
	const { catalog_switching_enabled_at_buyer_level = false } = useSelector((state: any) => state?.settings);
	const {
		config = [],
		filters = [],
		sorts = [],
		global_sorts = [],
		search_in_config = [],
		default_filters = [],
	} = useSelector((state: any) => state?.settings?.product_listing_config);
	const buyer = useSelector((state: any) => state.buyer);
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [buyer_data, set_buyer_data] = useState({});
	const bread_crumb_list = useSelector((state: any) => state.breadcrumb.breadcrumbs);
	const header_name = searchParams.get('type') ? 'Search Results' : 'All Products';
	const classes = useStyles();
	const [refresh_page, set_referesh_page] = useState(false);
	const params = new URLSearchParams(window.location.search);
	const search_value = params.get('search');

	const customer_metadata = get_customer_metadata({ is_loggedin: true });
	const { is_presentation_enabled, enable_wishlist } = useTenantSettings({
		[TENANT_SETTINGS_KEYS.PRESENTATION_ENABLED]: false,
		[TENANT_SETTINGS_KEYS.WISHLIST_ENABLED]: false,
	});

	const breadCrumbList = [
		{
			id: 1,
			linkTitle: is_ultron ? 'Dashboard' : 'Home',
			link: is_ultron ? RouteNames.dashboard.path : RouteNames.home.path,
		},
		{
			id: 2,
			linkTitle: is_ultron ? 'Products' : 'All products',
			link: `${RouteNames.product.all_products.path}?search=`,
		},
	];

	const get_categories_data = useCallback(async () => {
		try {
			const response: any = await product_listing.get_category();
			if (Array.isArray(response?.data)) {
				set_categories(response?.data);
			} else {
				console.error(t('ProductList.Main.NotArrayError'), response);
			}
			set_api_counter((state) => ({ ...state, categories: true }));
		} catch (error) {
			set_api_counter((state) => ({ ...state, categories: true }));
			console.error(t('ProductList.Main.FetchingError'), error);
		}
	}, []);

	const get_collections_data = useCallback(async () => {
		try {
			const query_params = `?catalog_id=${pricelist_value?.value}`;
			const response: any = await product_listing.get_collection(query_params);
			if (Array.isArray(response?.data)) {
				set_collections(response?.data);
			} else {
				console.error(t('ProductList.Main.NotArrayError'), response?.content?.data);
			}
			set_api_counter((state) => ({ ...state, collections: true }));
		} catch (error) {
			set_api_counter((state) => ({ ...state, collections: true }));
			console.error(t('ProductList.Main.FetchingError'), error);
		}
	}, [pricelist_value?.value]);

	const get_page_name = (path: string) => {
		switch (true) {
			case _.includes(path, 'collection/products'):
				return 'collection_product_listing_page';
			case _.includes(path, 'collection'):
				return 'collection_listing_page';
			case _.includes(path, 'category/products'):
				return 'category_product_listing_page';
			case _.includes(path, 'category'):
				return 'category_listing_page';
			case _.includes(path, 'recommend'):
				return 'products_reco_listing_page';
			case _.includes(path, 'previously_ordered'):
				return 'previously_ordered_listing_page';
			case _.includes(path, 'cart-summary'):
				return 'cart_page';
			case _.includes(path, 'product-details'):
				return 'product_details_page';
			case _.includes(path, 'all-products/search'):
				return 'product_search_page';
			default:
				return 'all_products_page';
		}
	};

	const _path = get_page_name(window.location.pathname);

	const scrollToTop = (is_page_change?: boolean) => {
		const rootContainer = document.getElementById('product_listing_container') as HTMLElement | null;
		setTimeout(() => {
			if (rootContainer) {
				// rootContainer.scrollIntoView({ behavior: 'smooth' });
				rootContainer.scrollIntoView({ behavior: is_page_change ? 'auto' : 'smooth', block: 'start' });
				// rootContainer.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}, 0);
	};

	const get_component_by_type = (rail: any) => {
		switch (rail?.type) {
			case 'recommended_product':
				return (
					<>
						{!catalog_mode && search === '' && (
							<RecommendedRail
								handle_navigate={(product_id: any) => navigate(`${RouteNames.product.product_detail.routing_path}${product_id}`)}
								type={''}
								containerStyle={{
									margin: '6px 0px',
								}}
								title={'Recommended'}
								card_template={rail?.template}
								customer_metadata={customer_metadata}
								page_name='all_products_page'
								section_name='reco_products_rail'
							/>
						)}
					</>
				);
			case 'previously_ordered':
				return (
					<>
						{!catalog_mode && search === '' && !buyer?.is_guest_buyer && (
							<PreviousOrderRail
								title_style={{
									margin: '6px 0px',
								}}
								buyer_data={buyer}
								card_template={rail?.template}
								customer_metadata={customer_metadata}
								page_name='all_products_page'
								section_name='previously_ordered_rail'
							/>
						)}
					</>
				);
			case 'all_products_section':
				return (
					<>
						{api_counter?.categories && api_counter?.collections && !_.isEmpty(type) && (
							<ExploreAllProductListing
								sectionName={is_ultron ? 'Explore all' : ''}
								card_template={rail?.template}
								_collections={collections}
								_categories={categories}
								_filters={filters}
								sortData={location.pathname.split('/').pop() !== 'search' ? sorts : global_sorts}
								api_counter={api_counter}
								search={search}
								set_search={set_search}
								type={type}
								search_in_config={search_in_config}
								default_filters={_.isEmpty(search_value) ? default_filters : {}}
								section_name={_path === 'all_products_page' ? 'explore_all' : ''}
								page_name={_path}
								scrollToTop={scrollToTop}
								refresh_page={refresh_page}
								set_refresh_page={set_referesh_page}
								discount_campaigns={discount_campaigns}
							/>
						)}
					</>
				);
			case 'categories_rail':
				return (
					<>
						{search === '' && (
							<CategoriesRail
								containerStyle={{
									margin: '6px 0px',
								}}
								categories={categories}
								customer_metadata={customer_metadata}
							/>
						)}
					</>
				);
			case 'collections_rail':
				return <>{search === '' && <CollectionsRail collections={collections} customer_metadata={customer_metadata} />}</>;
			case 'custom':
				return (
					<>{!catalog_mode && search === '' && <CustomRail title={rail?.name} card_template={rail?.template} config={rail?.config} />}</>
				);
		}
	};

	useEffect(() => {
		if (buyer?.buyer_cart && buyer?.catalog) {
			if (catalog_mode) return;
			initialize_cart();
		}
	}, [buyer?.buyer_cart, buyer?.catalog]);

	useEffect(() => {
		dispatch(updateBreadcrumbs(breadCrumbList));
	}, [config]);

	useEffect(() => {
		get_categories_data();
		if (show_discount_engine) {
			get_discount_campaign();
		}
		get_collections_data();
	}, [show_discount_engine, buyer]);

	useEffect(() => {
		set_search(searchParams.get('search') || '');
	}, [searchParams]);

	useEffect(() => {
		scrollToTop();
	}, []);

	const back_click = () => {
		navigate('/');
		set_search('');
	};

	const handle_refreh_page = () => {
		set_referesh_page(true);
	};

	const handle_on_buyer_switch = (data: any) => {
		set_buyer_data(data);
	};

	const handle_render_left_section = () => {
		return (
			<Grid sx={style.left_container}>
				<Grid item alignContent='center'>
					{_.isEmpty(search) ? (
						<PageTitle title={'Products'} allow_back={false} />
					) : (
						<Icon iconName={'IconArrowLeft'} sx={style.back_icon} onClick={back_click} />
					)}
				</Grid>
				{is_ultron && (
					<Grid item xs={7} sm={7} md={7} lg={7} marginLeft={search === '' ? '1rem' : '-1rem'}>
						<GlobalSearch search_in_config={search_in_config} />
					</Grid>
				)}
			</Grid>
		);
	};

	const handle_render_skeleton_loader = () => {
		return (
			<Grid sx={style.skeleton_container_style} my={2} width='100%'>
				<Box sx={style.skeleton_container_style} gap={3.5}>
					<Skeleton variant='text' width='70px' />
					<Skeleton variant='rectangular' width='370px' height='40px' sx={{ borderRadius: 0.5 }} />
				</Box>

				<Box sx={style.skeleton_container_style} gap={1.5}>
					<Skeleton variant='rectangular' width='150px' height='40px' sx={{ borderRadius: 0.5 }} />
					<Skeleton variant='rectangular' width='185px' height='40px' sx={{ borderRadius: 0.5 }} />
					<Skeleton variant='rectangular' width='40px' height='40px' sx={{ borderRadius: 0.5 }} />
				</Box>
			</Grid>
		);
	};
	const handle_icon_click = () => {
		navigate(-1);
	};

	const handle_render_header = () => {
		if (is_ultron) {
			if (cart?.loading) {
				return (
					<PageHeader
						shiftToNextLine={true}
						leftSection={handle_render_left_section()}
						rightSection={
							<div style={{ display: 'flex', gap: '10px' }}>
								{!catalog_mode && <BuyerSwitch onClick={() => toggle_buyer_panel(true)} />}
								{(catalog_switching_enabled_at_buyer_level || buyer?.is_guest_buyer) && (
									<CatalogSwitch handle_on_change={handle_refreh_page} />
								)}
								{!catalog_mode && enable_wishlist && <Wishlist />}
								{!catalog_mode && <Cart />}
								{is_presentation_enabled && !catalog_mode && <PageHeaderMenuOptions />}
							</div>
						}
					/>
				);
			}

			return <React.Fragment>{handle_render_skeleton_loader()}</React.Fragment>;
		}
	};

	return (
		<Grid
			container
			id={'product_listing_container'}
			key={location?.search}
			sx={{ overflowY: `${api_counter?.categories && api_counter?.collections} ? 'auto' : 'none'` }}>
			{!is_small_screen && is_store_front && (
				<React.Fragment>
					{bread_crumb_list?.length > 0 && (
						<Grid item>
							<Breadcrumb className={classes.breadcrumbs_style} links={bread_crumb_list} />
						</Grid>
					)}
				</React.Fragment>
			)}

			{is_small_screen && is_store_front && (
				<Grid item sx={{ ...theme?.product?.collection?.header }}>
					<Icon sx={{ paddingRight: '1rem' }} iconName='IconArrowLeft' onClick={handle_icon_click} />
					{header_name}
				</Grid>
			)}

			{handle_render_header()}

			{is_ultron && (
				<SelectBuyerPanel
					show_drawer={show_buyer_panel}
					toggle_drawer={toggle_buyer_panel}
					set_is_buyer_add_form={set_is_buyer_add_form}
					buyer_data={buyer_data}
					set_buyer_data={handle_on_buyer_switch}
					on_buyer_change={handle_refreh_page}
				/>
			)}

			{is_ultron && _.isEmpty(config) ? (
				<Grid container direction='column'>
					<SkeletonCategory />
					<SkeletonCollections />
					<Grid container direction='row'>
						{[1, 2, 3, 4, 5].map((a: any) => (
							<Grid key={a} xs={6} sm={4} md={4} lg={3} xl={3} item>
								<SkeletonProductCard />
							</Grid>
						))}
					</Grid>
				</Grid>
			) : (
				_.sortBy(config, 'priority')
					?.filter((item: any) => item?.is_active !== false)
					?.map((rail: any) => {
						if (!(is_store_front ? theme?.components?.settings?.rails_settings?.show_rails ?? true : true)) {
							if (rail?.type !== 'all_products_section') return;
						}
						return (
							<Grid container key={rail?.type} direction='column' sx={{ cursor: 'default' }}>
								{get_component_by_type(rail)}
							</Grid>
						);
					})
			)}

			{is_buyer_add_form && (
				<Drawer
					PaperProps={{ sx: { width: 600, background: '#fff' } }}
					anchor='right'
					open={is_buyer_add_form}
					onClose={() => set_is_buyer_add_form(false)}>
					<AddQuickBuyer is_detailed={false} from_cart set_is_buyer_add_form={set_is_buyer_add_form} set_buyer_data={set_buyer_data} />
				</Drawer>
			)}
		</Grid>
	);
};
const ProductListing = () => {
	const { catalog_mode, price_lists } = useSelector((state: any) => state?.catalog_mode);
	const pricelist_value = usePricelist();

	return useMemo(
		() => <ProductListingComp catalog_mode={catalog_mode} pricelist_value={pricelist_value} />,
		[catalog_mode, price_lists, pricelist_value],
	);
};
export default ProductListing;
