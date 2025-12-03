/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, PageHeader, Pagination, Breadcrumb, Icon } from 'src/common/@the-source/atoms';
import { BuyerSwitch, Cart, CatalogSwitch, PageHeaderMenuOptions, PageTitle } from 'src/common/PageHeaderComponents';
import SelectBuyerPanel from 'src/common/SelectBuyerPanel/SelectBuyerPanel';
import { product_listing } from 'src/utils/api_requests/productListing';
import { Divider, Drawer, useMediaQuery } from '@mui/material'; //PaginationRenderItemParams ,PaginationItem
import { CardData, card_template } from '../constants'; //VISIBLE_PAGES_COUNT
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import FiltersAndChips from 'src/common/@the-source/molecules/FiltersAndChips/FiltersAndChips';
import { IFiltersSelect, ISelectedFilters } from 'src/common/@the-source/molecules/FiltersAndChips/interfaces';
import useProductListingPageTemplate from '../useProductListingPageTemplate';
import AddQuickBuyer from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/AddQuickBuyer/AddQuickBuyer';
import SkeletonProductCard from './SkeletonProductCard';
import NoProducts from 'src/common/@the-source/molecules/ErrorPages/No_Products';
import RouteNames from 'src/utils/RouteNames';
import { updateBreadcrumbs } from 'src/actions/topbar';
import _, { capitalize } from 'lodash';
import { APILoaded, ISearchConfig, Sort } from '../ProductListing';
import ProductTemplateTwo from './ProductTemplate2';
import CategoryHeaderFilters from './CategoryHeaderFilter';
import CategorySubHeaderFilters from './CategorySubHeaderFilter';
import { Product } from '../mock/ProductInterface';
// import classes from '../components/Product.module.css';
import {
	calculate_total_pages,
	createFilterChip,
	get_page_size_by_type,
	get_pagination_range,
	get_selected_filters_by_type,
	has_search_or_filters,
	sort_products_and_convert_to_array,
} from '../utils';
import { Trans, useTranslation } from 'react-i18next';
import GlobalSearch from 'src/common/@the-source/molecules/GlobalSearch/GlobalSearch';
import CustomText from 'src/common/@the-source/CustomText';
import { useTheme } from '@mui/material/styles';
import useStyles from '../components/ProductStyle';
import { useInView } from 'react-intersection-observer';
import utils from 'src/utils/utils';
import { colors } from 'src/utils/theme';
import { Helmet } from 'react-helmet';
import constants from 'src/utils/constants';
import { set_selected_sort } from 'src/actions/catalog_mode';
import CatalogFactory from 'src/utils/catalog.utils';
import useTenantSettings from 'src/hooks/useTenantSettings';
import usePricelist from 'src/hooks/usePricelist';
import SelectAll from './SelectAll';

const { TENANT_SETTINGS_KEYS } = constants;

type FilterKey = keyof ISelectedFilters;

const ProductListingPageByType = () => {
	const location = useLocation();

	const path = location.pathname;
	const { VITE_APP_REPO } = import.meta.env;
	const is_storefront = VITE_APP_REPO === 'store_front';
	const is_ultron = VITE_APP_REPO === 'ultron';
	const path_elements = path?.split('/');
	const id = path_elements?.pop();
	const header_name = path_elements?.pop();
	const [search_params]: any = useSearchParams();
	const [_page, set_page] = useState(Number(search_params.get('page')) || 1);
	const [show_buyer_panel, toggle_buyer_panel] = useState(false);
	const [products, set_products] = useState<Product[]>([]);
	const [nb_hits, set_nbhits] = useState(0);
	const [pages, set_pages] = useState(0);
	const [is_loading, set_is_loading] = useState(true);
	// const [is_loading_more, set_is_loading_more] = useState(false); 	//[DON'T REMOVE]
	// const [has_more, set_has_more] = useState(false);
	const show_discount_engine = useSelector((state: any) => state?.settings?.enable_discount_engine) ?? false;
	const [category_levels, set_category_levels] = useState({
		categoryLevel2: search_params.get('categoryLevel2') ?? '',
		categoryLevel3: search_params.get('categoryLevel3') ?? '',
	});
	const product_id_to_navigate = sessionStorage.getItem('product_id');
	const [initial_filter_set, set_initial_filter] = useState(false);
	const buyer = useSelector((state: any) => state.buyer);
	const [search, set_search] = useState(search_params.get('search') || '');
	const [categories, set_categories] = useState<CardData[]>([]);
	const [collections, set_collections] = useState<CardData[]>([]);
	const [_facets, set_facets] = useState<any>([]);
	const [filters, set_filters] = useState<any>([]);
	const [select_filter, set_select_filter] = useState<ISelectedFilters>({ filters: {}, range_filters: {} });
	const [filter_chips_list, set_filter_chips_list] = useState<any>([]);
	const [sort, set_sort] = useState({});
	const { initialize_cart, get_discount_campaign, discount_campaigns } = useProductListingPageTemplate();
	const [is_buyer_add_form, set_is_buyer_add_form] = useState(false);
	const [api_counter, set_api_counter] = useState<APILoaded>({ categories: false, collections: false });
	const [sortData, set_sort_data] = useState<any>([]);
	const [global_sorts, set_global_sorts] = useState<Sort[]>([]);
	const [search_in_config, set_search_in_config] = useState<ISearchConfig[]>([]);
	const arr = [1, 2, 3, 4, 5];
	const dispatch = useDispatch();
	const [CategoryLevels, setCategoryLevels] = useState<any[]>([]);
	const [SubCategoryLevels, setSubCategoryLevels] = useState<any[]>([]);
	const [CategoriesData, setCategoriesData] = useState<any[]>([]);
	const [cards_template, set_card_template] = useState({});
	const [to_scroll, set_to_scroll] = useState(false);
	const { t } = useTranslation();
	const [is_filter_applied, set_is_filter_applied] = useState(false);
	const [is_reseting, set_is_reseting] = useState(false);
	const [buyer_data, set_buyer_data] = useState({});
	const [default_filters, set_default_filters] = useState<IFiltersSelect>({});
	const presisted_data = JSON.parse(localStorage.getItem('persist:root') || '');
	const customer_information = presisted_data?.buyer?.buyer_id;
	const buyer_id = customer_information || buyer?.buyer_id || buyer?.buyer_info?.id;
	const wizshop_settings = JSON.parse(localStorage.getItem('wizshop_settings') || '{}');
	const [default_reset, set_default_reset] = useState<boolean>(search_params.get('default_reset') === 'true' ? true : false);
	const hide_empty_products = wizshop_settings?.hide_empty_products || false;
	const { catalog_switching_enabled_at_buyer_level = false } = useSelector((state: any) => state?.settings);
	const classes: any = useStyles();
	const theme: any = useTheme();
	const navigate = useNavigate();
	const login = useSelector((state: any) => state?.login);
	const is_logged_in = login?.status?.loggedIn;
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const ProductImageUrl =
		CategoriesData.length > 0 && CategoriesData[0].media && CategoriesData[0].media.length > 0 ? CategoriesData[0].media[0].url : '';
	const { ref, inView }: any = useInView({
		threshold: 0.01,
	});
	const pathSegments = location.pathname.split('/');
	const categoryName = decodeURIComponent(pathSegments[4]);
	const products_per_page = get_page_size_by_type(path_elements?.[2]);
	const { start_count, end_count } = get_pagination_range(_page, products_per_page, nb_hits);
	const selected_filters_by_type = get_selected_filters_by_type(select_filter, path_elements?.[2]);
	const is_product_listing = !has_search_or_filters(search, selected_filters_by_type);
	// const visible_pages_list = get_visible_pages(VISIBLE_PAGES_COUNT, _page, pages);

	const pre_login = useSelector((state: any) => state?.preLogin);
	const company_title = pre_login?.company_name;
	const { catalog_mode } = useSelector((state: any) => state.catalog_mode);
	const { is_presentation_enabled, enable_wishlist } = useTenantSettings({
		[TENANT_SETTINGS_KEYS.PRESENTATION_ENABLED]: false,
		[TENANT_SETTINGS_KEYS.WISHLIST_ENABLED]: false,
	});
	const pricelist_value = usePricelist();

	const scrollToTop = () => {
		const rootContainer = document.getElementById('explore_all_container') as HTMLElement | null;
		if (rootContainer) {
			rootContainer.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const bread_crumb_list = [
		{
			id: 1,
			linkTitle: is_storefront ? 'Home' : 'Dashboard',
			link: is_storefront ? RouteNames.home.path : RouteNames.dashboard.path,
		},
		{
			id: 2,
			linkTitle: is_ultron ? 'Products' : 'All products',
			link: `${RouteNames.product.all_products.path}`,
		},
		{
			id: 3,
			linkTitle: capitalize(`${path_elements[2]}`),
			link: `${(RouteNames.product.all_products as any)?.[path_elements?.[2]]?.path}`,
		},
		{
			id: 4,
			linkTitle: header_name && decodeURIComponent(header_name),
			link: `${RouteNames.product.all_products.category_listing.path}`,
		},
	];
	const [containers, setContainers] = useState<CardData[]>([]);

	const get_filters_data = useCallback(async () => {
		try {
			const _key =
				path_elements[2] === 'category'
					? 'category_product_listing_page_config_web'
					: path_elements[2] === 'collection'
					? 'collection_product_listing_page_config_web'
					: 'product_listing_page_config_web';
			const response: any = await product_listing.get_listing_configuration(_key);
			if (response?.status === 200) {
				set_card_template(response?.data?.template || card_template);
				set_sort_data(response?.data?.sorting);
				let updated_filter: any = _.sortBy(
					_.filter(response?.data?.filters, (item: any) => {
						return is_storefront
							? item?.is_display !== false && (item?.hide_in_wizshop === undefined || item?.hide_in_wizshop !== true)
							: item?.is_display !== false;
					}),
					'priority',
				);
				set_filters(updated_filter);
				set_search_in_config(_.uniqBy(response?.data?.search_in_config, 'value'));
				set_global_sorts(response?.data?.global_sorting);
				set_default_filters(response?.data?.default_filters);
				set_initial_filter(true);
			}
		} catch (error) {
			console.error('Error fetching container details:', error);
		}
	}, []);

	const get_categories_data = useCallback(async () => {
		try {
			const response: any = await product_listing.get_category();
			if (Array.isArray(response?.data)) {
				const filteredData = hide_empty_products ? _.filter(response?.data, (item: any) => item?.product_count > 0) : response?.data;
				set_categories(filteredData);
				setContainers(filteredData);
				set_api_counter((state) => ({ ...state, categories: true }));
			} else {
				console.error(t('ProductList.Main.NotArrayError'), response);
			}
		} catch (error) {
			console.error(t('ProductList.Main.FetchingError'), error);
			set_api_counter((state) => ({ ...state, categories: true }));
		}
	}, [path_elements, pricelist_value]);

	const get_collections_data = useCallback(async () => {
		try {
			const query_params = `?catalog_id=${pricelist_value?.value}`;
			const response: any = await product_listing.get_collection(query_params);
			if (Array.isArray(response?.data)) {
				const filteredData = hide_empty_products ? _.filter(response.data, (item: any) => item?.product_count > 0) : response.data;
				set_collections(filteredData);
				set_api_counter((state) => ({ ...state, collections: true }));
			} else {
				console.error(t('ProductList.Main.NotArrayError'), response?.content?.data);
			}
		} catch (error) {
			console.error(t('ProductList.Main.FetchingError'), error);
			set_api_counter((state) => ({ ...state, collections: true }));
		}
	}, [path_elements, pricelist_value]);

	const selected_category_level_id = () => {
		let _categories: string[] = id ? [id] : [];
		if (category_levels?.categoryLevel2 && typeof category_levels?.categoryLevel2 === 'string') {
			_categories = [category_levels?.categoryLevel2];
		}
		if (category_levels?.categoryLevel3 && typeof category_levels?.categoryLevel3 === 'string') {
			_categories = [category_levels?.categoryLevel3];
		}
		return _categories;
	};

	const get_filters = () => {
		const _filters: any = {};
		switch (path_elements[2]) {
			case 'category':
				_filters.category = selected_category_level_id();
				break;
			case 'collection':
				_filters.collection = [id];
		}

		get_filters_data();

		set_select_filter((state) => {
			return {
				...state,
				filters: _filters,
			};
		});
	};

	const page_name = path_elements[2] === 'category' ? 'category_product_listing_page' : 'collection_product_listing_page';
	const get_category_names = (values: string[]) => {
		return values?.map((value) => {
			return categories?.find((category) => category?.id === value)?.name;
		});
	};

	useEffect(() => {
		set_select_filter((select_state: any) => {
			let _categories: string[] = selected_category_level_id();
			const _filters: any = {};
			if (!default_reset) {
				for (const key of _.keys(default_filters)) {
					if (_.isEmpty(_filters[key])) {
						_filters[key] = default_filters?.[key] || [];
					} else {
						_filters[key] = [..._filters[key], ..._.difference(default_filters?.[key], _filters[key])];
					}
				}
			}

			return {
				filters: {
					..._filters,
					category: _categories,
				},
				range_filters: select_state?.range_filters,
			};
			// return {
			// 	filters: {
			// 		...select_state?.filters,
			// 		category: _categories,
			// 	},
			// 	range_filters: select_state?.range_filters,
			// };
		});
	}, [category_levels]);

	useEffect(() => {
		if (filters?.length > 0) {
			const _filters: any = {
				range_filters: {},
				filters: {},
			};

			switch (path_elements[2]) {
				case 'category':
					_filters.filters.category = selected_category_level_id();
					break;
				case 'collection':
					_filters.filters.collection = [id];
			}

			const _filterChips = [];

			for (const key of search_params?.keys()) {
				const key_tags = key?.split('*');
				const values = search_params?.get(key)?.split(',');

				if (key_tags[0] === 'filters') {
					_filters.filters[key_tags[1]] = values;
				} else if (key_tags[0] === 'range_filters') {
					_filters.range_filters[key_tags[1]] = JSON.parse(search_params?.get(key) || '{}');
				}
				const _filter: any = filters?.filter((_f: any) => _f?.meta?.key === key_tags[1])?.[0];

				if (key_tags[0] === 'range_filters') {
					const { gte, lte } = JSON.parse(search_params?.get(key)).value;
					_filterChips.push({
						value: [gte, lte, ''],
						key: key_tags[1],
						label: key_tags[1]?.replace(/^\w/, (c: any) => c?.toUpperCase()),
						type: _filter?.meta?.type,
					});
				} else if (key?.includes('category') && path_elements[2] !== 'category') {
					_filterChips.push({
						value: get_category_names(values),
						key: key_tags[1],
						label: _filter?.name,
						type: 'category',
					});
				} else if (key?.includes('filters*') || key?.includes('range_filters*')) {
					_filterChips.push({
						value: [...values],
						key: key_tags[1],
						label: _filter?.name,
						type: _filter?.meta?.type,
					});
				}
			}

			if (search_params.get('sort')) {
				const _values = search_params.get('sort')?.split('*');
				const _temp = sortData?.find((s: any) => s?.key?.field === _values?.[0] && s?.key?.order === _values?.[1])?.key || {};
				set_sort(_temp);
			} else {
				const _temp = sortData?.find((d: any) => d?.is_default)?.key || sortData[0]?.key;
				set_sort(_temp);
			}

			if (!default_reset) {
				for (const key of _.keys(default_filters)) {
					if (_.isEmpty(_filters.filters[key])) {
						_filters.filters[key] = default_filters?.[key] || [];
					} else {
						_filters.filters[key] = [..._filters.filters[key], ..._.difference(default_filters?.[key], _filters.filters[key])];
					}

					const _filter = filters.find((_f: any) => _f?.meta?.key === key);
					if (_filter) {
						const chip = createFilterChip(['filters', key], default_filters?.[key] || [], _filter, categories, collections);
						if (chip) {
							_filterChips.push(chip);
						}
					}
				}
			}
			set_select_filter(_filters);
			set_filter_chips_list(_filterChips);
		}

		dispatch(updateBreadcrumbs(bread_crumb_list));
	}, [search_params, filters]);

	useEffect(() => {
		const edit_catalog_mode = CatalogFactory.MODE.get_edit_catalog_mode();
		if (_.isEmpty(sort) || edit_catalog_mode || !catalog_mode) return;
		dispatch(set_selected_sort(sort as any));
	}, [sort, catalog_mode]);

	useEffect(() => {
		if (path_elements[2] === 'category' && containers?.length > 0) {
			const _CategoryLevels: any[] = [];
			const _SubCategoryLevels: any[] = [];
			const _CategoriesData: any[] = [];
			// eslint-disable-next-line array-callback-return
			containers?.map((item: any) => {
				if (item?.level === 2 && item?.parent_id === id && (hide_empty_products ? item?.product_count > 0 : true)) {
					_CategoryLevels.push(item?.id); // For example, you can push the item to the 'test' array
					_CategoriesData.push(item);
				} else if (item?.level === 3 && (hide_empty_products ? item?.product_count > 0 : true)) {
					if (category_levels?.categoryLevel2 === item?.parent_id) {
						_SubCategoryLevels.push(item?.id); // For example, you can push the item to the 'test' array
						_CategoriesData.push(item);
					}
				}
			});

			setCategoriesData(_CategoriesData);
			setCategoryLevels(_CategoryLevels);
			setSubCategoryLevels(_SubCategoryLevels);
		}
	}, [containers]);

	const update_url = (current_page: number) => {
		const _keys: any = Object.keys(select_filter);
		const _loc = window.location;
		let newUrl = `${_loc.protocol}//${_loc.host}${_loc.pathname}?search=${encodeURIComponent(search)}`;

		if (category_levels?.categoryLevel2) {
			newUrl += `&categoryLevel2=${category_levels?.categoryLevel2}`;
		}

		if (category_levels?.categoryLevel3) {
			newUrl += `&categoryLevel3=${category_levels?.categoryLevel3}`;
		}

		if (_keys?.length > 0) {
			_keys?.forEach((_key: FilterKey) => {
				if (!(path_elements[2] === _key)) {
					const _attrKeys = Object.keys(select_filter[_key]);
					_attrKeys?.forEach((_attr: any) => {
						const value = select_filter[_key][_attr];
						if (_key === 'filters') {
							if (path_elements[2] !== _attr) {
								newUrl = `${newUrl}&${_key}*${_attr}=${encodeURIComponent(value)}`;
							}
						} else {
							newUrl = `${newUrl}&${_key}*${_attr}=${encodeURIComponent(JSON.stringify(value))}`;
						}
					});
				}
			});
		}
		if (default_reset) {
			newUrl = `${newUrl}&default_reset=true`;
		}

		if (current_page) {
			newUrl = `${newUrl}&page=${current_page}`;
		}
		window.history.replaceState({ path: newUrl }, '', newUrl);
	};

	const get_attributes_list = () => {
		return filters?.filter((f: any) => f?.entity_name === 'attribute')?.map((f: any) => f?.meta?.key);
	};

	const handle_get_filters = () => {
		const pre_login_inventory_filter = utils.get_pre_login_inventory_status_filter(is_logged_in);
		if (!_.isEmpty(pre_login_inventory_filter)) {
			select_filter.filters.inventory_status = _.union(select_filter?.filters?.inventory_status, pre_login_inventory_filter);
		}
		return select_filter;
	};

	const check_filter_applied = Object.keys(select_filter?.filters).length > 0 || Object.keys(select_filter?.range_filters).length > 0;

	const get_products = useCallback(
		async (is_next_page: boolean = false, page_number?: number) => {
			try {
				!is_next_page && set_is_loading(true);
				const select_filter_data = handle_get_filters();
				const listing_type = has_search_or_filters(search, selected_filters_by_type) ? 'variant' : 'product';
				const payload = {
					buyer_tenant_id: is_logged_in ? buyer_id : wizshop_settings?.buyer_tenant_id,
					search,

					filters: { ...select_filter_data?.filters, type: listing_type },
					range_filters: select_filter_data?.range_filters,
					sort: [sort],

					page_number: (page_number ?? _page) || 1,
					page_size: is_storefront ? 50 : products_per_page,
					attributes_list: get_attributes_list(),
					catalog_ids: is_logged_in
						? pricelist_value?.value
							? [pricelist_value?.value]
							: []
						: wizshop_settings?.wizshop_catalog_ids || [],
					wrap: check_filter_applied || !_.isEmpty(search),
				};
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

					//[DON'T REMOVE]
					// if (is_next_page) {
					// 	set_products((state) => {
					// 		return [...state, ...sorted_hits];
					// 	});
					// } else {
					set_products(sorted_hits);
					// }
					set_nbhits(nbHits);
					set_page(page);
					const total_accessible_pages = calculate_total_pages(nbHits, nbPages, products_per_page);
					set_pages(total_accessible_pages);
					// set_has_more(nbPages > page);
					// set_facets(facets);
					set_is_loading(false);
					// set_is_loading_more(false);
					update_url(page);
					if (to_scroll) {
						scrollToTop();
						set_to_scroll(false);
					}
					set_is_filter_applied(check_filter_applied);
				}
			} catch (error) {
				console.error(error);
				set_is_loading(false);

				if (is_storefront) {
					set_products([]);
				}
				// set_is_loading_more(false);
			}
		},
		[select_filter, search, _page, sort, pricelist_value],
	);

	useEffect(() => {
		if (!initial_filter_set) {
			get_filters();
		}
	}, [initial_filter_set]);

	useEffect(() => {
		if (initial_filter_set) {
			if ((categories?.length === 0 && path_elements[2] !== 'category') || path_elements[2] === 'category') {
				get_categories_data();
			}
			if (collections?.length === 0 && path_elements[2] !== 'collection') {
				get_collections_data();
			}
			if (!_.isEqual(sort, {})) {
				if (!to_scroll) {
					set_is_loading(true);
				}

				get_products();
			}
		}
	}, [select_filter, search, filters, sort, sortData, pricelist_value, discount_campaigns]);

	useEffect(() => {
		if (!catalog_mode) {
			initialize_cart();
		}
		if (show_discount_engine) {
			get_discount_campaign();
		}
		if (path_elements[2] === 'category') {
			set_select_filter((prevFilters: any) => ({
				...prevFilters,
				range_filters: {},
				filters: {
					category: prevFilters?.filters?.category,
				},
			}));
		} else if (path_elements[2] === 'collection') {
			set_select_filter((prevFilters: any) => ({
				...prevFilters,
				range_filters: {},
				filters: {
					collection: prevFilters?.filters?.collection,
				},
			}));
		} else {
			set_select_filter({
				range_filters: {},
				filters: {},
			});
		}
	}, [buyer?.buyer_cart, pricelist_value, show_discount_engine]);
	//[DON'T REMOVE]
	// const refine_next = () => {
	// 	if (pages > _page) {
	// 		if (!to_scroll) {
	// 			set_is_loading_more(true);
	// 		}
	// 		get_products(true);
	// 	}
	// };

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
				sx={{ paddingTop: '.8rem', width: '100%' }}
				spacing={1.6}
				columns={{ xs: 12, sm: 12, md: 12, lg: 15, xl: 15 }}
				alignItems='stretch'>
				{products?.map((product: Product) => {
					const is_variant = _.get(product, 'type') === 'variant';
					const variants_count = _.filter(product?.variants_meta?.variant_data_map, (e: any) => e.is_active !== false)?.length;
					const show_stack_ui = _.size(product?.inner_hits) > 0 || (!is_variant && variants_count > 1);
					return (
						<Grid xs={6} sm={4} md={4} lg={3} xl={3} item key={product?.id} id={`scroll_div-${product?.id}`} sx={{ position: 'relative' }}>
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
								catalog_mode={catalog_mode}
								type={constants.PRODUCT_CARD_TYPE[catalog_mode ? 'REVIEW' : 'ACTION']}
								product={product}
								cards_template={cards_template}
								has_similar={true}
								page_name={page_name}
								section_name=''
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
		scrollToTop();
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

	const render_hits = () => {
		return (
			<Grid container sx={{ width: '100%' }} pb={catalog_mode ? 8 : 0}>
				{/* 	//[DON'T REMOVE] */}
				{/* <InfiniteScroll
					dataLength={products?.length}
					next={refine_next}
					hasMore={has_more}
					scrollableTarget='rootContainer'
					style={{ width: '100%' }}
					loader={
						is_loading_more && (
							<Grid className='Loader' direction='row' container columns={{ xs: 12, sm: 12, md: 12, lg: 15, xl: 15 }}>
								{arr.map((a: any) => (
									<Grid key={a} xs={12} sm={4} md={4} lg={3} xl={3} item margin='10px'>
										<SkeletonProductCard />
									</Grid>
								))}
							</Grid>
						)
					}> */}
				<Grid
					container
					sx={{ paddingTop: '.8rem', width: '100%' }}
					spacing={2.5}
					columns={{ xs: 12, sm: 12, md: 12, lg: 15, xl: 15 }}
					alignItems='stretch'>
					{products?.length > 0 ? (
						<>
							{products?.map((product: Product) => {
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
										key={product?.id}
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
											catalog_mode={catalog_mode}
											type={constants.PRODUCT_CARD_TYPE[catalog_mode ? 'REVIEW' : 'ACTION']}
											product={product}
											cards_template={cards_template}
											has_similar={true}
											page_name={page_name}
											section_name=''
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
						</>
					) : (
						<>
							{arr?.map((a: any) => (
								<Grid key={a} xs={6} sm={4} md={4} lg={3} xl={3} item>
									<SkeletonProductCard />
								</Grid>
							))}
						</>
					)}
				</Grid>
				{/* </InfiniteScroll> */}
			</Grid>
		);
	};

	const handleSubCategory = (catId: string) => {
		if (SubCategoryLevels?.includes(catId)) {
			set_page(0);
			set_category_levels({ ...category_levels, categoryLevel3: catId });
		} else {
			console.log('Wrong Category');
		}
	};
	const handleCategory = (catId: string) => {
		if (CategoryLevels?.includes(catId)) {
			set_page(0);
			set_category_levels({ ...category_levels, categoryLevel2: catId, categoryLevel3: '' });
		} else {
			console.log('Wrong Category');
		}
	};

	const handleAllCategory = () => {
		set_page(0);
		set_category_levels({ ...category_levels, categoryLevel2: '' });
	};
	const handleAllSubCategory = () => {
		set_page(0);
		set_category_levels({ ...category_levels, categoryLevel3: '' });
	};
	const update_search = (value: string) => {
		set_search(value);
	};
	const handle_sort_change = (key: any) => {
		set_sort(key);
	};
	const handle_on_sort = () => {
		set_page(1);
	};

	const on_buyer_change = (new_buyer: any) => {
		set_buyer_data(new_buyer);
	};

	const reset_page = () => {
		set_page(1);
	};

	const reset_filter_click = () => {
		set_is_reseting(true);
	};

	return (
		<>
			<Helmet>
				<title>{categoryName}</title>
				<meta name='description' content={`Explore our ${categoryName} collection at the best price.`} />
				<meta name='keywords' content={`${categoryName}, collection, buy, ecommerce, product`} />

				{/* Open Graph Meta Tags */}
				<meta property='og:title' content={`${categoryName}`} />
				<meta
					property='og:description'
					content={`Discover top products in our ${categoryName} collection, available at unbeatable prices.`}
				/>
				<meta property='og:type' content='website' />
				<meta property='og:url' content={window.location.href} />
				<meta property='og:image' content={ProductImageUrl} />
				<meta property='og:image:alt' content='Browse our products' />
				<meta property='og:site_name' content={company_title} />
			</Helmet>
			<Grid sx={{ minHeight: '90vh' }}>
				<Grid container id='explore_all_container' alignItems={'flex-start'}>
					{is_ultron && (
						<PageHeader
							shiftToNextLine={true}
							leftSection={
								<Grid gap={1} display='flex' width='100%'>
									<Grid item alignContent='center' alignItems='center' display='flex'>
										<PageTitle
											page_title_style={{
												maxWidth: 'calc(100% - 25px)',
											}}
											title={header_name ? decodeURIComponent(header_name) : 'Back'}
											allow_back={true}
										/>
									</Grid>
									<Grid sm={6} ml='1rem'>
										<GlobalSearch search_in_config={search_in_config} />
									</Grid>
								</Grid>
							}
							rightSection={
								is_ultron && (
									<Grid gap={1} display='flex'>
										{!catalog_mode && (
											<BuyerSwitch
												onClick={() => {
													toggle_buyer_panel(true);
												}}
											/>
										)}
										{(catalog_switching_enabled_at_buyer_level || buyer?.is_guest_buyer || catalog_mode) && <CatalogSwitch />}
										{!catalog_mode && <Cart />}
										{is_presentation_enabled && !catalog_mode && <PageHeaderMenuOptions />}
									</Grid>
								)
							}
						/>
					)}

					<Grid container direction='column'>
						{is_storefront && (
							<React.Fragment>
								{bread_crumb_list?.length > 0 && (
									<Grid item>
										<Breadcrumb className={classes.breadcrumbs_style} links={bread_crumb_list} />
									</Grid>
								)}
							</React.Fragment>
						)}

						{is_storefront && header_name && (
							<Grid item sx={{ ...theme?.product?.collection?.header }}>
								<Icon iconName={'IconArrowLeft'} onClick={() => navigate(-1)} sx={{ marginRight: '10px' }} />
								{decodeURIComponent(header_name)}
							</Grid>
						)}
					</Grid>

					{is_storefront && search_params.get('type') && (
						<Grid width={'100%'} className={classes.search_results_container}>
							<CustomText type='Body' style={{ fontSize: '25px' }}>
								Search results
							</CustomText>
							<Grid width={'100%'} maxWidth={'785px'}>
								<GlobalSearch search_in_config={search_in_config} />
							</Grid>
						</Grid>
					)}
					{CategoryLevels?.length > 1 && (
						<>
							<CategoryHeaderFilters
								CategoriesData={CategoriesData}
								CategoryLevels={CategoryLevels}
								handleAllCategory={handleAllCategory}
								handleCategory={handleCategory}
								category_levels={category_levels}
							/>
							{!is_storefront && <Divider />}
						</>
					)}

					{SubCategoryLevels?.length > 1 && !is_loading && (
						<>
							<CategorySubHeaderFilters
								CategoriesData={CategoriesData}
								SubCategoryLevels={SubCategoryLevels}
								handleAllSubCategory={handleAllSubCategory}
								handleSubCategory={handleSubCategory}
								category_levels={category_levels}
							/>
							{!is_storefront && <Divider />}
						</>
					)}

					{(api_counter?.categories || path_elements[2] === 'category') &&
						(api_counter?.collections || path_elements[2] === 'collection') &&
						filters?.length > 0 &&
						Object.keys(_facets)?.length > 0 && (
							<FiltersAndChips
								handle_sort={handle_on_sort}
								sort={sort}
								select_filter={select_filter}
								filters={filters}
								_facets={_facets}
								_nb_hits={nb_hits}
								filter_chips_list={filter_chips_list}
								categories={categories}
								collections={collections}
								sort_data={search === '' ? sortData : global_sorts}
								is_category_page={path_elements[2] === 'category' ? true : false}
								is_collections_page={path_elements[2] === 'collection' ? true : false}
								handle_search_string_update={update_search}
								set_filter_chips_list={set_filter_chips_list}
								handle_sort_change={handle_sort_change}
								set_page={set_page}
								set_selected_filters={set_select_filter}
								get_initial_filters={get_filters}
								inputValue={search}
								set_scroll={set_to_scroll}
								is_reseting={is_reseting}
								set_is_resetting={set_is_reseting}
								default_filters={default_filters}
								reset_default_filters={set_default_reset}
								inView={inView}
								products_per_page={products_per_page}
							/>
						)}
					{is_loading ? (
						<React.Fragment>
							<Grid className='Loader' direction='row' container columns={{ xs: 12, sm: 12, md: 12, lg: 15, xl: 15 }}>
								{arr?.map((a: any) => (
									<Grid key={a} xs={6} sm={4} md={4} lg={3} xl={3} item>
										<SkeletonProductCard />
									</Grid>
								))}
							</Grid>
						</React.Fragment>
					) : products?.length > 0 ? (
						<>
							{!is_loading && start_count > 0 && end_count > 0 && (
								<Grid container alignItems={'center'}>
									<CustomText type='Body'>
										{is_product_listing ? (
											<Trans i18nKey='ProductList.Main.ShowingPaginatedProducts' count={nb_hits}>
												{{ start_count, end_count, nb_hits }}
											</Trans>
										) : (
											<Trans i18nKey='ProductList.Main.ShowingPaginatedResults' count={nb_hits}>
												{{ start_count, end_count, nb_hits }}
											</Trans>
										)}
									</CustomText>
									{catalog_mode && <SelectAll products={products} />}
								</Grid>
							)}
							{nb_hits > 0 && (is_storefront ? pagination() : render_hits())}
						</>
					) : (
						<NoProducts is_filter_applied={is_filter_applied} reset_filter_click={reset_filter_click} />
					)}

					{is_ultron && (
						<SelectBuyerPanel
							show_drawer={show_buyer_panel}
							toggle_drawer={toggle_buyer_panel}
							set_is_buyer_add_form={set_is_buyer_add_form}
							buyer_data={buyer_data}
							set_buyer_data={on_buyer_change}
							on_buyer_change={reset_page}
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
			</Grid>
		</>
	);
};

export default ProductListingPageByType;
