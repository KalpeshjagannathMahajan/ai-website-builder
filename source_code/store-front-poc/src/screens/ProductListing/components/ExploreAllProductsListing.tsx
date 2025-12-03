import { Box, Grid, Pagination, Typography } from 'src/common/@the-source/atoms';
import ProductTemplateTwo from './ProductTemplate2';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { product_listing } from 'src/utils/api_requests/productListing';
import { ALL_PRODUCTS_FILTERS_STORAGE_KEY, CardData, FILTER_KEYS, FILTERS_INITIAL_STATE, PRODUCTS_PER_PAGE } from '../constants';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FiltersAndChips from 'src/common/@the-source/molecules/FiltersAndChips/FiltersAndChips';
import { ISelectedFilters, IFiltersSelect } from 'src/common/@the-source/molecules/FiltersAndChips/interfaces';
import _ from 'lodash';
import { APILoaded, ISearchConfig, Sort } from '../ProductListing';
import {
	calculate_total_pages,
	extractFiltersAndChips,
	generateUrl,
	get_pagination_range,
	get_session_state,
	get_sort,
	has_search_or_filters,
	sort_products_and_convert_to_array,
} from '../utils';
import { Product } from '../mock/ProductInterface';
import { Trans } from 'react-i18next';
import SkeletonProductCard from './SkeletonProductCard';
import NoProducts from 'src/common/@the-source/molecules/ErrorPages/No_Products';
import { useTheme } from '@mui/material/styles';
import GlobalSearch from 'src/common/@the-source/molecules/GlobalSearch/GlobalSearch';
import constants from 'src/utils/constants';
import { PRODUCT_DETAILS_TYPE } from 'src/screens/ProductDetailsPage/constants';
import usePricelist from 'src/hooks/usePricelist';
import { filtered_valid_discounts_for_buyer, master_discount_rule } from 'src/utils/DiscountEngineRule';
import useStyles from '../components/ProductStyle';
import { useInView } from 'react-intersection-observer';
import utils from 'src/utils/utils';
import { useMediaQuery } from '@mui/material';
import { colors } from 'src/utils/theme';
import { Helmet } from 'react-helmet';
import ImageLinks from 'src/assets/images/ImageLinks';
import CustomText from 'src/common/@the-source/CustomText';

const { VITE_APP_REPO } = import.meta.env;
const is_storefront = VITE_APP_REPO === 'store_front';
interface Props {
	card_template: any;
	sectionName: string;
	_categories: CardData[];
	_collections: CardData[];
	_filters: any[];
	sortData: Sort[];
	api_counter: APILoaded;
	search: string;
	type?: string;
	default_filters: IFiltersSelect;
	set_search: (search: string) => void;
	search_in_config: ISearchConfig[];
	section_name?: any;
	page_name?: any;

	scrollToTop: (is_next_page: any) => void;
	refresh_page?: boolean;
	set_refresh_page?: (flag: boolean) => any;
	discount_campaigns?: any[];
}

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const ExploreAllProductListing = ({
	card_template = {},
	sectionName = '',
	_collections,
	_categories,
	_filters,
	sortData,
	api_counter,
	search,
	type,
	default_filters,
	set_search,
	search_in_config,
	section_name,
	page_name,
	scrollToTop,
	refresh_page,
	set_refresh_page = () => {},
	discount_campaigns,
}: Props) => {
	const theme: any = useTheme();
	const [products, set_products] = useState<Product[]>([]);
	const [nb_hits, set_nbhits] = useState(0);
	const [pages, set_pages] = useState(0);
	const [is_loading, set_is_loading] = useState(true);
	// const [is_loading_more, set_is_loading_more] = useState(true); //[DON'T REMOVE]
	const [categories, set_categories] = useState<CardData[]>(_categories);
	const [collections, set_collections] = useState<CardData[]>(_collections);
	const [_facets, set_facets] = useState<any>();
	const [filters, set_filters] = useState<any>({});
	const [select_filter, set_select_filter] = useState<ISelectedFilters>(FILTERS_INITIAL_STATE);
	const [is_filter_applied, set_is_filter_applied] = useState(false);
	const [searchParams]: any = useSearchParams();
	const [_page, set_page] = useState(Number(new URLSearchParams(window.location.search).get('page')) || 1);
	const [filter_chips_list, set_filter_chips_list] = useState<any[]>([]);
	const [sort, set_sort] = useState<any>({});
	const buyer = useSelector((state: any) => state.buyer);
	const [to_scroll, set_to_scroll] = useState(false);
	const [is_reseting, set_is_reseting] = useState(false);
	const [is_stored_filter, set_is_stored_filter] = useState(false);
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const products_per_page = PRODUCTS_PER_PAGE.EXPLORE_ALL;

	const presisted_data = JSON.parse(localStorage.getItem('persist:root') || '');
	const customer_information = presisted_data?.buyer?.buyer_id;
	const buyer_id = customer_information || buyer?.buyer_id || buyer?.buyer_info?.id;
	const pricelist_value = usePricelist();
	const wizshop_settings = JSON.parse(localStorage.getItem('wizshop_settings') || '{}');

	const product_id_to_navigate = sessionStorage.getItem('product_id');
	const [default_reset, set_default_reset] = useState<boolean>(searchParams.get('default_reset') === 'true' ? true : false);
	const login = useSelector((state: any) => state?.login);
	const is_logged_in = login?.status?.loggedIn;
	const classes: any = useStyles();
	const { LogoWithText } = ImageLinks;

	const { start_count, end_count } = get_pagination_range(_page, products_per_page, nb_hits);
	const is_product_listing = !has_search_or_filters(search, select_filter);
	const [sync_data, set_sync_data] = useState({
		[FILTER_KEYS.SORT]: true,
		[FILTER_KEYS.SELECT_FILTER]: true,
		[FILTER_KEYS.FILTERS]: true,
	});
	const smart_search_ids = sessionStorage.getItem('smart_search_ids');

	const update_validation_data = (key: string, value: boolean) => {
		set_sync_data((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const use_sync_data = (callback: () => void, key: string) => {
		update_validation_data(key, true);
		callback();
		update_validation_data(key, false);
	};
	// const visible_pages_list = get_visible_pages(VISIBLE_PAGES_COUNT, _page, pages);

	const pre_login = useSelector((state: any) => state?.preLogin);
	const company_title = pre_login?.company_name;
	// const catalog_mode = useSelector((state: any) => state?.catalog_mode?.catalog_mode);

	const get_attributes_list = () => {
		return _.filter(filters, (f: any) => f.entity_name === 'attribute')?.map((f: any) => f.meta.key);
	};

	const { ref, inView }: any = useInView({
		threshold: 0.01,
	});

	const get_page = (is_next_page: boolean, page_number: any) => {
		if (page_number === undefined) {
			const page = (page_number || _page) ?? 1;
			return page;
		}
		return is_next_page ? page_number ?? _page + 1 : 1;
	};

	const handle_get_filters = () => {
		const pre_login_inventory_filter = utils.get_pre_login_inventory_status_filter(is_logged_in);
		if (!_.isEmpty(pre_login_inventory_filter)) {
			select_filter.filters.inventory_status = _.union(select_filter?.filters?.inventory_status, pre_login_inventory_filter);
		}
		return select_filter?.filters;
	};

	const get_sort_filter = () => {
		const query_params = new URLSearchParams(window.location.search);
		const sort_from_param = query_params.get('sort');
		if (!_.isEmpty(sort_from_param)) {
			const _values = _.split(sort_from_param, '*');
			const _temp = get_sort(_.head(_values), _.nth(_values, 1), sortData);
			return _temp;
		}

		const search_value = query_params.get('search');
		if (_.isEmpty(search_value)) {
			const sort_from_session = get_session_state(FILTER_KEYS.SORT);
			if (!_.isEmpty(sort_from_session) || !_.isEmpty(sort_from_session?.field) || !_.isEmpty(sort_from_session?.order)) {
				const _field = _.get(sort_from_session, 'field');
				const _order = _.get(sort_from_session, 'order');
				const _temp = get_sort(_field, _order, sortData);
				return _temp;
			}
		}

		const _data = _.find(sortData, (d: any) => d.is_default) || _.head(sortData);
		const _temp = _.get(_data, 'key');
		return _temp;
	};

	const check_filter_applied = Object.keys(select_filter?.filters).length > 0 || Object.keys(select_filter?.range_filters).length > 0;

	const get_products = useCallback(
		async (is_next_page: boolean = false, page_number?: number) => {
			try {
				const filtered_discount_keys = filtered_valid_discounts_for_buyer(discount_campaigns, master_discount_rule, buyer);
				const parsed_smart_search_ids = JSON.parse(smart_search_ids || '[]');
				const discount_applied =
					typeof select_filter?.filters?.discounts === 'object'
						? _.head(select_filter?.filters?.discounts)
						: select_filter?.filters?.discounts || '';
				const _type = searchParams.get('type') || '';

				const select_filter_data = handle_get_filters();
				const listing_type =
					has_search_or_filters(search, select_filter) || !_.isEmpty(parsed_smart_search_ids)
						? PRODUCT_DETAILS_TYPE.variant
						: PRODUCT_DETAILS_TYPE.product;
				const payload: any = {
					buyer_tenant_id: is_logged_in ? buyer_id : wizshop_settings?.buyer_tenant_id,
					search: _.includes(_type, 'AI') ? '' : search,
					filters: !_.isEmpty(discount_applied)
						? {
								...select_filter_data,
								discounts: discount_applied,
								type: listing_type,
						  }
						: {
								...select_filter_data,
								type: listing_type,
						  },
					search_field: search === '' || _.includes(_type, 'AI') ? '' : _type,
					range_filters: select_filter?.range_filters,
					sort: [sort],
					discount_ids: !_.isEmpty(discount_applied) ? filtered_discount_keys : [],
					page_number: get_page(is_next_page, page_number),
					page_size: is_storefront ? 50 : products_per_page,
					attributes_list: get_attributes_list(),
					catalog_ids: is_logged_in
						? pricelist_value?.value
							? [pricelist_value?.value]
							: []
						: wizshop_settings?.wizshop_catalog_ids || [],
					for_ai_search: _.includes(_type, 'AI') && !_.isEmpty(parsed_smart_search_ids),
					wrap: check_filter_applied || !_.includes(_type, 'AI'),
				};

				const _newUrl = generateUrl(select_filter, search, sortData, sort, _type, {}, [], default_reset, payload.page_number);
				window.history.replaceState({ path: _newUrl }, '', _newUrl);
				if (!_.isEmpty(parsed_smart_search_ids)) {
					payload.filters.id = parsed_smart_search_ids;
				}
				let variant_facets_promise = null;
				if (listing_type === 'product') {
					const variants_payload = { ...payload, filters: { ...payload?.filters, type: 'variant' } };
					variant_facets_promise = product_listing.get_product_list(variants_payload);
				}
				const product_promise = product_listing.get_product_list(payload);
				const [variants_response, product_response]: any = await Promise.all([variant_facets_promise, product_promise]);

				if (variants_response && variants_response?.status_code === 200) {
					const variant_facets = _.get(variants_response?.data, 'facets');
					if (variant_facets) {
						set_facets(variant_facets);
					}
				}

				if (product_response && product_response?.status_code === 200) {
					const { hits, nbHits, nbPages, page, facets } = product_response?.data;
					let sorted_hits = sort_products_and_convert_to_array(hits);

					if (_.isEmpty(variants_response) && facets && !_.isEqual(facets, _facets)) {
						let filtered_facets = utils.handle_filtered_facets(facets, is_logged_in);
						set_facets(filtered_facets);
					}

					set_products(sorted_hits);
					set_nbhits(nbHits);
					set_page(page);
					const total_accessible_pages = calculate_total_pages(nbHits, nbPages, products_per_page);
					set_pages(total_accessible_pages);
					//[DON'T REMOVE]
					// set_has_more(nbPages > page);
					// set_facets(facets);
					// set_is_loading_more(false);
					set_is_loading(false);

					const newUrl = generateUrl(select_filter, search, sortData, sort, _type, {}, [], default_reset, payload?.page_number);

					window.history.replaceState({ path: newUrl }, '', newUrl);
					scrollToTop(is_next_page);

					set_is_filter_applied(check_filter_applied);
					if (is_stored_filter) {
						set_is_stored_filter(false);
					}
				}
			} catch (error) {
				console.error(error);
				// set_is_loading_more(false);
				set_is_loading(false);
				if (is_storefront) {
					set_products([]);
				}
			}
		},
		[select_filter, search, _page, sort, filters, pricelist_value, smart_search_ids, discount_campaigns],
	);

	const reset_filter_click = () => {
		set_is_reseting(true);
		if (is_storefront) {
			set_default_reset(false);
			set_select_filter({ filters: {}, range_filters: {} });
		}
	};

	const update_session_state = (key: string, value: any) => {
		const search_value = searchParams.get('search');
		if (search_value) return;
		const session_data = sessionStorage.getItem(ALL_PRODUCTS_FILTERS_STORAGE_KEY);
		let parsed_data = {
			filters: FILTERS_INITIAL_STATE,
		};
		try {
			if (session_data && typeof session_data === 'string') parsed_data = JSON.parse(session_data);
		} catch {}
		const new_data = {
			...parsed_data,
			[key]: value,
		};
		sessionStorage.setItem(ALL_PRODUCTS_FILTERS_STORAGE_KEY, JSON.stringify(new_data));
	};

	useEffect(() => {
		set_categories(_categories);
	}, [_categories]);

	useEffect(() => {
		set_collections(_collections);
	}, [_collections]);

	useLayoutEffect(() => {
		use_sync_data(() => {
			const updated_filter = _.sortBy(
				_.filter(_filters, (item) => {
					return is_storefront
						? item.is_display !== false && (item?.hide_in_wizshop === undefined || item?.hide_in_wizshop !== true)
						: item.is_display !== false;
				}),
				'priority',
			);
			set_filters(updated_filter);
		}, FILTER_KEYS.FILTERS);
	}, [_filters]);

	useLayoutEffect(() => {
		use_sync_data(() => {
			const _temp = get_sort_filter();
			set_sort(_temp);
			update_session_state(FILTER_KEYS.SORT, _temp);
		}, FILTER_KEYS.SORT);
	}, [sortData]);

	// useEffect(() => {
	// 	const edit_catalog_mode = CatalogFactory.MODE.get_edit_catalog_mode();
	// 	if (_.isEmpty(sort) || edit_catalog_mode || !catalog_mode) return;
	// 	dispatch(set_selected_sort(sort));
	// }, [sort, catalog_mode]);

	useEffect(() => {
		if (is_storefront && (!_.isEmpty(select_filter?.filters) || !_.isEmpty(select_filter?.range_filters))) {
			searchParams?.set('page', '1');
		}

		if (sync_data.filters || sync_data.select_filter || sync_data.sort) return;
		if (api_counter.categories && api_counter.collections && !_.isEmpty(filters) && !_.isEqual(sort, {})) {
			if (!to_scroll) {
				set_is_loading(true);
			}
			get_products();
		}
	}, [select_filter, search, sort, type, filters, sync_data, pricelist_value, smart_search_ids, discount_campaigns]);

	useEffect(() => {
		if (refresh_page) {
			set_page(1);
			set_is_loading(true);
			get_products(false, 1);
			set_refresh_page && set_refresh_page(false);
		}
	}, [refresh_page]);

	useEffect(() => {
		use_sync_data(() => {
			if (!_.isEmpty(filters)) {
				const { _filterData, _filterChips } = extractFiltersAndChips(filters, categories, collections, default_filters, default_reset);
				if (!_.isEqual(_filterData, select_filter)) {
					update_session_state(FILTER_KEYS.FILTERS, _filterData);
					set_select_filter(_filterData);
				}
				if (!_.isEqual(_filterChips, filter_chips_list)) {
					set_filter_chips_list(_filterChips);
				}
			}
		}, FILTER_KEYS.SELECT_FILTER);
	}, [filters, categories, collections, default_reset]);

	//[DON'T REMOVE]
	// const refine_next = () => {
	// 	if (pages > _page) {
	// 		if (!to_scroll) {
	// 			set_is_loading_more(true);
	// 		}
	// 		get_products(true);
	// 		set_to_scroll(false);
	// 	}
	// };

	const handle_sort_change = (key: any) => {
		set_sort(key);
		update_session_state(FILTER_KEYS.SORT, key);
		set_to_scroll(true);
	};

	useEffect(() => {
		if (!_.isEmpty(product_id_to_navigate) && products?.length > 0) {
			const rootContainer = document.getElementById(`scroll_div-${product_id_to_navigate}`) as HTMLElement | null;
			if (rootContainer) {
				rootContainer.scrollIntoView({ block: 'start', behavior: 'smooth' });
			}
			sessionStorage.removeItem('product_id');
		}
	}, [product_id_to_navigate, products]);

	const handle_render_product_card = () => {
		return (
			<Grid
				container
				sx={{ paddingTop: '1rem' }}
				spacing={1.6}
				columns={{ xs: 12, sm: 12, md: 12, lg: 15, xl: 15 }}
				alignItems='stretch'
				{...(is_small_screen ? {} : { gap: 1 })}>
				{products?.map((product: Product) => {
					const is_variant = _.get(product, 'type') === 'variant';
					const variants_count = _.filter(product?.variants_meta?.variant_data_map, (e: any) => e.is_active !== false)?.length;
					const show_stack_ui = _.size(product?.inner_hits) > 0 || (!is_variant && variants_count > 1);

					return (
						<Grid
							xs={6}
							sm={3.85}
							md={2.9}
							lg={2.91}
							xl={2.93}
							item
							key={product.id}
							id={`scroll_div-${product?.id}`}
							sx={{ position: 'relative' }}>
							{show_stack_ui && !is_small_screen && (
								<>
									<Grid container item className={classes.stack_container_1}>
										<Grid className={classes.storefront_overlay_container_1}></Grid>
									</Grid>
									<Grid container item className={classes.stack_container_2}>
										<Grid className={classes.storefront_overlay_container_2}></Grid>
									</Grid>
								</>
							)}
							<ProductTemplateTwo
								container_style={{ justifyContent: 'space-around' }}
								product={product}
								cards_template={card_template}
								has_similar={true}
								_page={_page}
								show_stack_ui={show_stack_ui}
								discount_campaigns={discount_campaigns}
							/>
						</Grid>
					);
				})}
			</Grid>
		);
	};

	const handle_page_change = (event: any, value: number) => {
		set_is_loading(true);
		set_to_scroll(true);
		get_products(true, value);
	};

	const pagination = () => {
		return (
			<>
				{is_small_screen ? (
					<Box minHeight={is_small_screen ? '90vh' : 'auto'}>{handle_render_product_card()}</Box>
				) : (
					handle_render_product_card()
				)}
				{pages > 1 && (
					<div ref={ref} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
						<Grid p={1} mx='auto' my={1}>
							<Pagination count={pages} page={_page} onChange={handle_page_change} />
						</Grid>
					</div>
				)}
			</>
		);
	};

	const handle_sort = (key: any) => {
		const default_sort = sortData?.find((d) => d.is_default)?.key || sortData?.[0]?.key;
		if (key !== default_sort) {
			set_page(1);
		}
	};

	const update_select_filter = (updated_filter: any) => {
		if (typeof updated_filter === 'function') {
			set_select_filter((prev: any) => {
				const new_filters = updated_filter(prev);
				update_session_state(FILTER_KEYS.FILTERS, new_filters);
				return new_filters;
			});
			return;
		}
		set_select_filter(updated_filter);
		update_session_state(FILTER_KEYS.FILTERS, updated_filter);
	};

	const render_hits = () => {
		return (
			// 	//[DON'T REMOVE]
			// <InfiniteScroll
			// 	dataLength={products.length}
			// 	next={refine_next}
			// 	hasMore={has_more}
			// 	scrollableTarget='rootContainer'
			// 	loader={
			// 		is_loading_more && (
			// 			<Grid
			// 				className='Loader'
			// 				spacing={0}
			// 				direction='row'
			// 				container
			// 				columns={{ xs: 12, sm: 12, md: 12, lg: 15, xl: 15 }}
			// 				alignItems='stretch'>
			// 				{arr.map((a: any) => (
			// 					<Grid key={a} xs={12} sm={4} md={4} lg={3} xl={3} item>
			// 						<SkeletonProductCard />
			// 					</Grid>
			// 				))}
			// 			</Grid>
			// 		)
			// 	}>
			<Grid
				id='products_container'
				container
				sx={{ paddingTop: '1rem' }}
				spacing={2.5}
				columns={{ xs: 12, sm: 12, md: 12, lg: 15, xl: 15 }}
				alignItems='stretch'>
				{products.length > 0 ? (
					<React.Fragment>
						{products.map((product: Product, index: number) => {
							const is_variant = _.get(product, 'type') === 'variant';
							const variants_count = _.filter(product?.variants_meta?.variant_data_map, (e: any) => e.is_active !== false)?.length;
							const show_stack_ui = _.size(product?.inner_hits) > 0 || (!is_variant && variants_count > 1);
							return (
								<Grid
									xs={12}
									sm={4}
									md={4}
									lg={3}
									xl={3}
									item
									key={product.id}
									id={`scroll_div-${index}`}
									sx={
										show_stack_ui
											? {
													position: 'relative',
													paddingLeft: '10px',
											  }
											: {}
									}>
									{show_stack_ui && (
										<>
											<Grid className={classes.overlay_container_1}></Grid>
											<Grid className={classes.overlay_container_2}></Grid>
										</>
									)}

									<ProductTemplateTwo
										type={constants.PRODUCT_CARD_TYPE.ACTION}
										container_style={{ justifyContent: 'space-around' }}
										product={product}
										cards_template={card_template}
										has_similar={true}
										section_name={section_name}
										page_name={page_name}
										catalog_mode={false}
										show_stack_ui={show_stack_ui}
									/>
								</Grid>
							);
						})}
						{pages > 1 && (
							<Grid
								xs={24}
								display='flex'
								justifyContent='center'
								my={2}
								//[DON'T remove, could be used in next releases]// sx={{
								// 	position: 'fixed',
								// 	bottom: 16,
								// 	left: 0,
								// 	right: 0,
								// }}
								// zIndex={1000}
							>
								<Box
									width='fit-content'
									display='flex'
									justifyContent='center'
									padding={1}
									bgcolor={colors.white}
									borderRadius='4.5rem'
									boxShadow='0px 4px 8px 0px rgba(0, 0, 0, 0.08)'>
									<Pagination count={pages} page={_page} onChange={handle_page_change} color='primary' variant='text' shape='rounded' />
								</Box>
							</Grid>
						)}
					</React.Fragment>
				) : (
					<React.Fragment>
						{arr.map((a: any) => (
							<Grid key={a} xs={12} sm={4} md={4} lg={3} xl={3} item>
								<SkeletonProductCard />
							</Grid>
						))}
					</React.Fragment>
				)}
			</Grid>
			// </InfiniteScroll>
		);
	};

	// NEW/REQUIRED FUNCTIONS

	const update_search = (value: string) => {
		set_search(value);
		set_to_scroll(true);
	};

	return (
		<>
			<Helmet>
				<title>All Products</title>
				<meta name='description' content='Browse our complete catalog of top-quality products at unbeatable prices.' />
				<meta name='keywords' content='all products, catalog, buy, ecommerce, top-quality' />

				{/* Open Graph Meta Tags */}
				<meta property='og:title' content='All Products - Wizcommerce' />
				<meta property='og:description' content='Browse our complete catalog of top-quality products at unbeatable prices.' />
				<meta property='og:type' content='website' />
				<meta property='og:url' content={window.location.href} />
				<meta property='og:image' content={LogoWithText} />
				<meta property='og:image:alt' content='Browse our products' />
				<meta property='og:site_name' content={company_title} />
			</Helmet>
			<Grid
				container
				style={{ width: '100%', marginTop: search === '' ? '8px' : '', paddingBottom: 0 }}
				display='flex'
				id='explore_all_container'>
				{/* [Suyash] For now checking just search, if reusing change props */}
				{search === '' && (
					<Grid container>
						<Typography variant='h6' sx={{ padding: '0' }}>
							{sectionName}
						</Typography>
					</Grid>
				)}
				{is_storefront && searchParams.get('type') && (
					<Grid width={'100%'} className={classes.search_results_container}>
						{!is_small_screen && (
							<CustomText className={classes.search_result_heading} type='Body' style={{ fontSize: '25px' }}>
								Search results
							</CustomText>
						)}
						<Grid width={'100%'} maxWidth={'785px'} paddingBottom={is_small_screen ? 2 : 4}>
							<GlobalSearch search_in_config={search_in_config} />
						</Grid>
					</Grid>
				)}
				{products?.length > 0 && (
					<FiltersAndChips
						handle_sort={handle_sort}
						select_filter={select_filter}
						filters={filters}
						_facets={_facets}
						_nb_hits={nb_hits}
						filter_chips_list={filter_chips_list}
						categories={categories}
						collections={collections}
						sort_data={sortData}
						sort={sort}
						inputValue={search}
						handle_search_string_update={update_search}
						set_filter_chips_list={set_filter_chips_list}
						handle_sort_change={handle_sort_change}
						set_page={set_page}
						set_selected_filters={update_select_filter}
						set_scroll={set_to_scroll}
						is_reseting={is_reseting}
						set_is_resetting={set_is_reseting}
						default_filters={default_filters}
						inView={inView}
						reset_default_filters={set_default_reset}
						products_per_page={products_per_page}
					/>
				)}
				{is_loading ? (
					<Grid className='Loader' direction='row' container columns={{ xs: 12, sm: 12, md: 12, lg: 15, xl: 15 }}>
						{arr.map((a: any) => (
							<Grid key={a} xs={6} sm={4} md={4} lg={3} xl={3} item>
								<SkeletonProductCard />
							</Grid>
						))}
					</Grid>
				) : Object.keys(products).length > 0 ? (
					<>
						{!is_loading && (
							<Grid container alignItems={'center'}>
								<Typography sx={{ ...theme?.product?.product_show_items }}>
									{is_product_listing ? (
										<Trans i18nKey='ProductList.Main.ShowingPaginatedProducts' count={nb_hits}>
											{{ start_count, end_count, nb_hits }}
										</Trans>
									) : (
										<Trans i18nKey='ProductList.Main.ShowingPaginatedResults' count={nb_hits}>
											{{ start_count, end_count, nb_hits }}
										</Trans>
									)}
								</Typography>
								{/* {catalog_mode && <SelectAll products={products} />} */}
							</Grid>
						)}
						{nb_hits > 0 && (is_storefront ? pagination() : render_hits())}
					</>
				) : (
					<NoProducts is_filter_applied={is_filter_applied} reset_filter_click={reset_filter_click} />
				)}
			</Grid>
		</>
	);
};

export default ExploreAllProductListing;
