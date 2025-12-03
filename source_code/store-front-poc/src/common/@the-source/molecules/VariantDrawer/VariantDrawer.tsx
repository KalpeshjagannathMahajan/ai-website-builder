/* eslint-disable @typescript-eslint/no-unused-vars */
import { Divider } from '@mui/material';
import styles from './variant.module.css';
import { Box, Button, Checkbox, Drawer, Grid, Icon, Pagination } from 'src/common/@the-source/atoms';
import { useCallback, useEffect, useState } from 'react';
import { product_listing } from 'src/utils/api_requests/productListing';
import { useSelector } from 'react-redux';
import _, { debounce } from 'lodash';
import SkeletonVariants from './SkeletonVariant';
import VariantDetailCard from './VariantDetailCard';
import { t } from 'i18next';
import { CartWithoutRedux } from '../../atoms/Counter/CounterWithoutRedux';
import { Buyer } from 'src/screens/BuyerDashboard/components/BuyerInterface';
import CustomText from '../../CustomText';
import { get_discounted_value } from 'src/screens/CartSummary/helper';
import CustomProductDrawer from 'src/screens/CustomProduct/CustomProductDrawer';
import CustomProductModal from 'src/screens/CustomProduct/CustomProductModal';
import CustomToast from 'src/common/CustomToast';
import { useDispatch } from 'react-redux';
import cart_management from 'src/utils/api_requests/cartManagement';
import { initializeCart } from 'src/actions/cart';
import VariantSearchAndSort from './VariantSearchAndSort';
import FiltersAndChips from '../FiltersAndChips/FiltersAndChips';
import { IFilters, IFiltersSelect, ISortData } from '../FiltersAndChips/interfaces';
import NoProducts from '../ErrorPages/No_Products';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { get_formatted_price_with_currency, get_unit_price_of_product } from 'src/utils/common';
import VariantSkeletonStorefront from './VariantSkeletonStorefront';
import { calculate_total_pages, get_pagination_range, get_updated_default_filters } from 'src/screens/ProductListing/utils';
import DetailCard from './DetailCard';
import { primary, secondary, text_colors } from 'src/utils/light.theme';
import { info } from 'src/utils/common.theme';
import constants from 'src/utils/constants';
import CatalogFactory from 'src/utils/catalog.utils';
import { useCatalogSelection } from 'src/hooks/useCatalogSelection';

const { VITE_APP_REPO } = import.meta.env;
const is_store_front = VITE_APP_REPO === 'store_front';

interface variant_props {
	type?: 'VIEW' | 'DELETE';
	drawer: boolean;
	set_drawer: any;
	id: any;
	handle_get_total_price?: any;
	attribute_template?: any;
	buyer_data?: Buyer;
	cart_data?: CartWithoutRedux;
	set_cart?: any;
	from_redux?: boolean;
	catalog_ids?: any;
	parent_product?: any;
	from_cart?: boolean;
	selected_skus?: any;
	selected_filters: any;
	set_show_delete_product_modal?: (val: boolean) => void;
	set_selected_skus?: (val: any) => void;
	set_selected_filters: (val: any) => void;
	handle_done?: any;
	wishlist_data?: any;
	discount_campaigns?: any[];
}

const VariantDrawer = ({
	type = constants.VARIANT_DRAWER_TYPES.VIEW,
	drawer,
	set_drawer,
	id,
	handle_get_total_price,
	attribute_template,
	catalog_ids,
	from_redux = true,
	buyer_data,
	cart_data,
	set_cart,
	parent_product,
	from_cart = false,
	selected_skus,
	set_selected_skus,
	set_selected_filters,
	selected_filters,
	set_show_delete_product_modal,
	handle_done,
	wishlist_data,
	discount_campaigns,
}: variant_props) => {
	const dispatch = useDispatch();
	{
		/* 
		DO NOT DELETE
	*/
	}
	// const [variant_data, set_variant_data] = useState<any>({});
	// const [pages, set_pages] = useState(0);
	// const [is_loading_more, set_is_loading_more] = useState(true);
	// const [has_more, set_has_more] = useState(false);
	const [customise_id, set_customise_id] = useState(parent_product?.id);
	const [total_price, set_total_price] = useState(0);
	const [open, set_open] = useState(false);
	const [show_customise, set_show_customise] = useState(false);
	const [show_modal, set_show_modal] = useState(false);
	const [search_string, set_search_string] = useState('');
	const [sort, set_sort] = useState({});
	const [sort_data, set_sort_data] = useState([]);
	const [_facets, set_facets] = useState({});
	const [is_loading, set_is_loading] = useState(true);
	const [nb_hits, set_nbhits] = useState(0);
	const [to_scroll, set_to_scroll] = useState(false);
	const [_filters, set_filters] = useState<IFilters[]>([]);
	const [is_filter_applied, set_is_filter_applied] = useState(false);
	const buyer_from_redux = useSelector((state: any) => state?.buyer);
	const price_level_id = _.get(buyer_from_redux, 'is_guest_buyer') ? _.get(buyer_from_redux, 'price_list.value') : '';
	const buyer = buyer_data ? buyer_data : buyer_from_redux;
	const catalog_id: string[] = [from_redux ? _.get(buyer_from_redux, 'buyer_info.pricelist', '') : _.head(catalog_ids) || ''];
	const cart = useSelector((state: any) => state?.cart);
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const [cart_item, set_cart_item] = useState<any>({});
	const [default_filters, set_default_filters] = useState<IFiltersSelect>({});
	const [pagination_page, set_pagination_page] = useState(1);
	const [pagination_data, set_pagination_data] = useState<any>({});
	const [select_partial, set_select_partial] = useState(false);
	const [total_pages, set_total_pages] = useState<number>(0);
	const is_view_active = type === constants.VARIANT_DRAWER_TYPES.VIEW;
	const is_delete_active = type === constants.VARIANT_DRAWER_TYPES.DELETE;
	const items_per_page = is_delete_active ? constants.DELETE_SKU_DRAWER_ITEM_PER_PAGE : constants.VIEW_SKU_DRAWER_ITEM_PER_PAGE;
	const { start_count, end_count } = get_pagination_range(pagination_page, items_per_page, nb_hits);
	// const has_search_or_filters_applied = has_search_or_filters(search_string, selected_filters);
	const { catalog_mode, catalog_products_length, catalog_products } = useSelector((state: any) => state?.catalog_mode);
	const { selected, set_selected, handle_select_all } = useCatalogSelection();
	const selected_custom_product_price = pagination_data?.[customise_id]?.pricing?.price;
	const is_retail_mode = localStorage.getItem('retail_mode') === 'true';
	const currency = parent_product?.pricing?.currency;
	const login = useSelector((state: any) => state?.login);
	const is_logged_in = login?.status?.loggedIn;
	const wizshop_settings = JSON.parse(localStorage.getItem('wizshop_settings') || '{}');

	const scrollToTop = () => {
		const rootContainer = document.getElementById('variant_drawer_container') as HTMLElement | null;
		if (rootContainer) {
			rootContainer.scrollIntoView({ behavior: 'smooth' });
		}
	};
	const get_attributes_list = () => {
		const _temp = parent_product?.variants_meta?.hinge_attributes?.map((attr: any) => {
			return `transformed_attributes.${attr?.id}`;
		});

		return _temp;
	};

	const check_filters_empty =
		Object?.keys(selected_filters?.filters)?.length > 0 || Object.keys(selected_filters?.range_filters)?.length > 0;

	const check_inner_hits = _.size(parent_product?.inner_hits) > 0;

	const get_variants = useCallback(
		async (is_next_page: boolean = false, page_number = pagination_page) => {
			set_is_loading(true);
			try {
				let payload: any = {
					buyer_tenant_id: buyer?.buyer_id,
					price_level_id,
					search: search_string,
					filters: {
						parent_id: parent_product?.parent_id,
						...selected_filters?.filters,
						type: 'variant',
					},
					range_filters: selected_filters?.range_filters,
					sort: Object?.keys(sort)?.length !== 0 ? [sort] : [{ field: 'created_at', order: 'desc' }],
					catalog_ids: is_logged_in ? catalog_id : wizshop_settings?.wizshop_catalog_ids || [],
					attributes_list: get_attributes_list(),
					page_number: is_next_page ? page_number : 1,
					page_size: items_per_page,
				};

				let ele_id = parent_product?.id;
				if (parent_product?.id === parent_product?.parent_id) {
					const ele: any = _.head(parent_product?.variants_meta?.variant_data_map);
					ele_id = ele?.product_id;
				}

				let single_id_response: any;
				let single_hits: any = [];
				if (!check_filters_empty) {
					single_id_response = await product_listing.get_variants_product({
						...payload,
						filters: {
							id: [ele_id],
							type: 'variant',
						},
					});

					if (single_id_response?.status === 200) {
						single_hits = single_id_response?.data?.hits;
					}

					payload = {
						...payload,
						exclude_ids: [ele_id],
					};
				}

				if (check_inner_hits) {
					payload = {
						...payload,
						filters: {
							...payload?.filters,
							id: [ele_id, ...parent_product?.inner_hits] || [],
							type: 'variant',
						},
					};
				}

				const response: any = await product_listing.get_variants_product(payload);
				if (response?.status_code === 200) {
					const { hits, nbHits, nbPages, page, facets } = response?.data;
					{
						/* 
						DO NOT DELETE
					*/
					}
					// if (is_next_page) {
					// 	set_variant_data((state: any) => {
					// 		return { ...state, ...hits };
					// 	});
					// } else {
					// }
					// set_pages(nbPages);
					// set_has_more(nbPages > page);
					// set_is_loading_more(false);
					set_nbhits(_.isEmpty(single_hits) ? nbHits : nbHits + 1);
					set_pagination_page(page);
					set_pagination_data({ ...single_hits, ...hits });
					set_total_pages(nbPages);
					if (payload?.page_number === 1) {
						set_facets(facets);
					}
					set_is_loading(false);

					if (to_scroll) {
						scrollToTop();
						set_to_scroll(false);
					}

					set_is_filter_applied(check_filters_empty);
				}
			} catch (error) {
				console.error(error);
				{
					/* 
					DO NOT DELETE
				*/
				}
				// set_is_loading_more(false);
				set_is_loading(false);
			}
		},
		[search_string, sort, pagination_page, selected_filters],
	);

	useEffect(() => {
		if (!is_delete_active) return;
		const data = Object.keys(pagination_data);

		if (_.size(data) === 0) return;

		const all_selected = _.every(data, (key) => _.includes(selected_skus, key));

		set_selected(all_selected);
	}, [selected_skus, pagination_data]);

	const handle_page_change = (event: any, value: number) => {
		set_pagination_page(value);
		set_is_loading(true);
		get_variants(true, value);
	};

	const get_filters = useCallback(async () => {
		try {
			const response: any = await product_listing.get_listing_configuration_variant('variant_drawer_page_config');

			if (response?.status_code === 200) {
				const { filters, sorting } = response?.data;
				set_filters(filters);
				set_sort(sorting?.find((d: ISortData) => d?.is_default)?.key || sorting?.[0]?.key);
				set_sort_data(sorting);
				set_default_filters(response?.data?.default_filters);
			}
		} catch (err) {
			console.error(err);
		}
	}, []);

	const handle_variant_data = debounce(get_variants, 500);

	const close_drawers = () => {
		set_drawer(false);
		set_show_customise(false);
		let cart_changed = cart_item === cart?.products;

		set_selected_skus && set_selected_skus([]);
		set_selected_filters({ filters: {}, range_filters: {} });

		if (!cart_changed && from_cart) {
			handle_done();
		}
	};

	const handle_get_cart_details = async () => {
		const { buyer_cart, is_guest_buyer } = buyer;
		const cart_id = buyer_cart?.id;

		cart_management
			.get_cart_details({ cart_id, is_guest_buyer })
			.then((response: any) => {
				if (response?.status === 200) {
					// eslint-disable-next-line @typescript-eslint/no-shadow
					const { cart } = response;
					const { items, products: res_product } = cart;

					if (items && Object?.keys(items)?.length > 0) {
						for (let item in items) {
							// eslint-disable-next-line @typescript-eslint/no-shadow
							const { id, parent_id } = res_product[item];
							items[item].parent_id = parent_id;
							items[item].id = id;
						}
					}
					dispatch(
						initializeCart({
							id: cart_id,
							products: items,
							products_details: res_product,
							document_items: cart?.document_items || {},
						}),
					);
				}
			})
			.catch((err: any) => {
				console.error(err);
			});
	};

	const paginate = () => {
		const variant_data_ids = Object?.keys(pagination_data);

		return (
			<Grid container direction='column'>
				{_.map(variant_data_ids, (key, ind) =>
					(is_delete_active ? (
						<DetailCard
							selected_skus={selected_skus}
							set_selected_skus={set_selected_skus}
							key={key}
							product={pagination_data[key]}
							attribute_template={attribute_template}
							discount_campaigns={discount_campaigns}
						/>
					) : (
						<VariantDetailCard
							type={catalog_mode ? constants.VARIANT_DETAILS_CARD_TYPE.REVIEW : constants.VARIANT_DETAILS_CARD_TYPE.ACTION}
							close_drawer={set_drawer}
							show_divider={ind !== _.size(pagination_data) - 1}
							key={key}
							product={pagination_data[key]}
							parent_id={id}
							attribute_template={attribute_template}
							buyer_data={buyer_data}
							cart_data={cart_data}
							set_cart={set_cart}
							from_redux={from_redux}
							set_customise_id={set_customise_id}
							set_show_customise={set_show_customise}
							wishlist_data={wishlist_data}
							discount_campaigns={discount_campaigns}
						/>
					)),
				)}

				{/* 
					DO NOT DELETE
				*/}
				{/* <Grid item className={styles.pagination}>
					<Grid sx={{ width: 'fit-content' }}>
						<Pagination
							count={Math.ceil(nb_hits / itemsPerPage)}
							page={pagination_page}
							onChange={handle_page_change}
							color='primary'
							variant='outlined'
							shape='rounded'
						/>
					</Grid>
				</Grid> */}
			</Grid>
		);
	};

	{
		/* 
		DO NOT DELETE
	*/
	}
	// const refine_next = () => {
	// 	if (pages > _page) {
	// 		if (!to_scroll) {
	// 			set_is_loading_more(true);
	// 		}
	// 		get_variants(true);
	// 		set_to_scroll(false);
	// 		set_is_loading_more(true);
	// 	}
	// };

	// const infiniteHits = () => {
	// 	const variant_data_ids = Object?.keys(variant_data);
	// 	const size = _.size(variant_data_ids);

	// 	return (
	// 		<InfiniteScroll
	// 			dataLength={size}
	// 			next={refine_next}
	// 			hasMore={has_more}
	// 			scrollableTarget='variant_drawer_container'
	// 			loader={is_loading_more && <SkeletonVariants is_single={true} />}>
	// 			{size > 0 ? (
	// 				_.map(variant_data_ids, (key, ind) => (
	// 					<VariantDetailCard
	// 						show_divider={ind !== _.size(variant_data) - 1}
	// 						key={key}
	// 						product={variant_data[key]}
	// 						parent_id={id}
	// 						attribute_template={attribute_template}
	// 						buyer_data={buyer_data}
	// 						cart_data={cart_data}
	// 						set_cart={set_cart}
	// 						from_redux={from_redux}
	// 					/>
	// 				))
	// 			) : (
	// 				<SkeletonVariants />
	// 			)}
	// 		</InfiniteScroll>
	// 	);
	// };

	const reset_filter_click = () => {
		set_is_loading(true);
		set_selected_filters({ filters: {}, range_filters: {} });
		set_search_string('');
		set_to_scroll(true);
	};

	const handle_select_all_checkbox = () => {
		const sku_ids = Object.keys(pagination_data);

		if (catalog_mode && !is_delete_active) {
			handle_select_all(sku_ids);
			return;
		}

		if (selected) {
			set_selected_skus && set_selected_skus(_.difference(selected_skus, sku_ids));
		} else {
			set_selected_skus && set_selected_skus(_.union(selected_skus, sku_ids));
		}
		set_selected(!selected);
	};

	const handle_close = () => {
		set_drawer(false);
		set_show_delete_product_modal && set_show_delete_product_modal(true);
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H6'>{is_delete_active ? t('Common.VariantDrawer.SKUDelete') : t('Common.VariantDrawer.AllVariants')}</CustomText>
				<Icon
					iconName='IconX'
					onClick={() => {
						close_drawers();
					}}
					className={styles.icon_style}
					sx={{ cursor: 'pointer' }}
				/>
			</Grid>
		);
	};

	const handle_submit = () => {
		close_drawers();
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className={`${styles['drawer-body-container']}`} id='variant_drawer_container'>
				<Grid sx={{ flex: 1 }} container direction='column'>
					{(!is_loading || nb_hits > 0) && !is_small_screen && (
						<VariantSearchAndSort
							set_search_string={set_search_string}
							set_sort={set_sort}
							sort={sort}
							sort_data={sort_data}
							search_string={search_string}
						/>
					)}
					{!is_small_screen && nb_hits > 0 && (
						<FiltersAndChips
							set_is_loading={set_is_loading}
							select_filter={selected_filters}
							set_selected_filters={set_selected_filters}
							filters={_filters}
							_facets={_facets}
							set_page={set_pagination_page}
							set_scroll={set_to_scroll}
							is_variant_drawer={true}
							sort_data={sort_data}
							default_filters={default_filters}
						/>
					)}
					{is_loading ? (
						is_store_front ? (
							<VariantSkeletonStorefront />
						) : (
							<SkeletonVariants />
						)
					) : Object?.keys(pagination_data)?.length > 0 ? (
						<Grid container direction='column' style={{ flex: 1, position: 'relative' }}>
							<Grid item xs style={{ overflowY: 'auto', paddingBottom: '4rem' }} sx={{ maxWidth: '100% !important' }}>
								<Grid
									container
									px={1}
									py={1}
									gap={1}
									sx={{ alignItems: 'center', position: 'sticky', top: '0rem', zIndex: '4', background: 'white' }}>
									<CustomText color={text_colors?.primary}>{`Showing ${start_count}-${end_count} of ${nb_hits} ${
										nb_hits === 1 ? 'result' : 'results'
									}`}</CustomText>

									{is_filter_applied && (
										<CustomText type='Subtitle' color={primary.main} onClick={() => reset_filter_click()} style={{ cursor: 'pointer' }}>
											{t('Common.VariantDrawer.ClearFilters')}
										</CustomText>
									)}
									{(catalog_mode || is_delete_active) && (
										<Grid sx={{ display: 'flex', alignItems: 'center' }}>
											<Checkbox checked={selected} indeterminate={select_partial} onChange={handle_select_all_checkbox} />
											<CustomText type='Subtitle'>{t('Common.VariantDrawer.SelectAll')}</CustomText>
										</Grid>
									)}
								</Grid>

								{paginate()}
							</Grid>
						</Grid>
					) : (
						<NoProducts is_filter_applied={is_filter_applied} reset_filter_click={reset_filter_click} />
					)}
				</Grid>
			</Grid>
		);
	};

	const handle_render_footer = () => {
		const size = _.size(selected_skus);
		const total_accessible_pages = calculate_total_pages(nb_hits, total_pages, items_per_page);
		return (
			<Box className={`${styles['drawer-footer-container']}`}>
				<Grid item className={styles.pagination}>
					<Grid sx={{ width: 'fit-content' }}>
						{total_accessible_pages > 1 && (
							<Pagination
								count={total_accessible_pages}
								page={pagination_page}
								onChange={handle_page_change}
								color='primary'
								variant='text'
								shape='rounded'
							/>
						)}
					</Grid>
				</Grid>
				<Divider className='drawer-divider' />
				<Grid className='drawer-footer' justifyContent={'space-between'} gap={1.2}>
					{is_delete_active ? (
						<>
							<Grid item sx={{ backgroundColor: info[50], padding: '1rem', borderRadius: '0.8rem' }}>
								<CustomText type='Subtitle'>{`${size} ${size > 1 ? 'SKUs' : 'SKU'} selected`}</CustomText>
							</Grid>

							<Grid item>
								<Button onClick={close_drawers} variant='text' sx={{ border: `1px solid ${secondary[400]}`, color: text_colors.black }}>
									{t('Common.VariantDrawer.Cancel')}
								</Button>
								<Button color='error' onClick={handle_close} disabled={!size} sx={{ marginLeft: '1.2rem' }}>
									{t('Common.VariantDrawer.DeleteSelected', {
										sku: _.size(selected_skus) > 1 ? 'SKUs' : 'SKU',
									})}
								</Button>
							</Grid>
						</>
					) : (
						<Grid container justifyContent={catalog_mode ? 'flex-end' : is_retail_mode ? 'end' : 'space-between'}>
							{!catalog_mode &&
								(is_retail_mode ? null : (
									<CustomText type='H3' style={{ marginRight: '10px' }}>
										{t('Common.VariantDrawer.Value', {
											price: get_formatted_price_with_currency(currency, total_price),
										})}
									</CustomText>
								))}
							<Grid direction='row' justifyContent='space-around' className={styles.inner_grid}>
								<Button className={styles.button_style} onClick={handle_submit}>
									{t('Common.VariantDrawer.Done')}
								</Button>
							</Grid>
						</Grid>
					)}
				</Grid>
			</Box>
		);
	};

	useEffect(() => {
		if (_filters && _filters?.length > 0) {
			handle_variant_data();

			return () => handle_variant_data?.cancel();
		}
	}, [search_string, sort, selected_filters, _filters]);

	useEffect(() => {
		if (!catalog_mode) return;
		const sku_ids = Object.keys(pagination_data);
		const check = CatalogFactory.PRODUCT.check_multiple_products(sku_ids, catalog_products);
		set_selected(check.is_complete);
		set_select_partial(!check.is_complete && check.is_partial);
	}, [catalog_mode, catalog_products_length, catalog_products, pagination_data]);

	useEffect(() => {
		if (!is_view_active) return;
		let total = 0;

		if (pagination_data && cart?.products) {
			Object?.entries(pagination_data)?.forEach(([key, product]: any) => {
				if (cart?.products?.[product?.id]) {
					Object?.entries(cart?.products?.[product?.id])?.forEach(([variantKey, variantValue]: any) => {
						const quantity = variantValue?.quantity ?? 0;
						const price: any = get_unit_price_of_product({ ...product, quantity });
						const { unit_price } = price;
						const discounted_val = get_discounted_value(variantValue?.discount_type, variantValue?.discount_value, unit_price);
						const discountPrice = unit_price < discounted_val ? 0 : unit_price - discounted_val;
						total += discountPrice * quantity;
					});
				}
			});
		}

		set_total_price(total);
		if (handle_get_total_price) {
			handle_get_total_price(total);
		}
	}, [cart, pagination_data, type]);

	useEffect(() => {
		get_filters();
		if (from_cart) {
			set_cart_item(cart?.products);
		}
	}, []);

	useEffect(() => {
		if (_.isEmpty(default_filters)) return;
		set_selected_filters((prev_filters: any) => get_updated_default_filters(default_filters, prev_filters));
	}, [default_filters]);

	return (
		<>
			<Drawer
				anchor='right'
				width={is_delete_active ? 500 : 700}
				open={drawer}
				onClose={() => close_drawers()}
				content={
					<Grid className='drawer-container'>
						{handle_render_header()}
						<Divider className='drawer-divider' />
						{handle_render_drawer_content()}
						{handle_render_footer()}
					</Grid>
				}
			/>
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
					state={t('CustomProduct.Toast.State')}
					title={t('CustomProduct.Toast.Title')}
					subtitle={t('CustomProduct.Toast.SubTitle')}
					showActions={false}
				/>
			)}
			{show_customise && (
				<CustomProductDrawer
					show_customise={show_customise}
					set_show_customise={set_show_customise}
					set_show_modal={set_show_modal}
					product_id={customise_id}
					default_sku_id={parent_product?.sku_id}
					open={open}
					set_open={set_open}
					handle_get_cart_details={handle_get_cart_details}
					base_price={selected_custom_product_price}
					currency={currency}
					product_data={parent_product}
				/>
			)}
			{show_modal && <CustomProductModal show_modal={show_modal} set_show_modal={set_show_modal} set_show_customise={set_show_customise} />}
		</>
	);
};

export default VariantDrawer;
