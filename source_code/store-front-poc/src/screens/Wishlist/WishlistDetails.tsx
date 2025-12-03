import { t } from 'i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb, Button, Grid, Icon, PageHeader, Sort } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import { Cart, CatalogSwitch } from 'src/common/PageHeaderComponents';
import NoWishlist from './components/NoWishlist';
import { find, get, isEmpty, map, size } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import constants from 'src/utils/constants';
import { useSelector } from 'react-redux';
import useWishlistActions from './hooks/useWishlistActions';
import { colors } from 'src/utils/theme';
import { get_default_sort } from 'src/common/@the-source/molecules/FiltersAndChips/helper';
import { product_listing } from 'src/utils/api_requests/productListing';
import usePricelist from 'src/hooks/usePricelist';
import { SortOption } from 'src/@types/presentation';
import { PRODUCT_DETAILS_TYPE } from '../ProductDetailsPage/constants';
import wishlist from 'src/utils/api_requests/wishlist';
import InfiniteScroll from 'react-infinite-scroll-component';
import SkeletonProductCard from '../ProductListing/components/SkeletonProductCard';
import { Product } from '../ProductListing/mock/ProductInterface';
import { sort_products_and_convert_to_array } from '../ProductListing/utils';
import { close_toast, show_toast } from 'src/actions/message';
import types from 'src/utils/types';
import { useDispatch } from 'react-redux';
import useProductListingPageTemplate from '../ProductListing/useProductListingPageTemplate';
import { InputAdornment, TextField, useMediaQuery, useTheme } from '@mui/material';
import { secondary } from 'src/utils/light.theme';
import CancelProductCard from './components/CancelProductCard';
import { get_default_wishlist_sort, get_short_name } from './utils';
import { PRODUCTS_PER_PAGE } from '../ProductListing/constants';
import PageHeaderMenuOptions from './components/PageHeaderMenu';
import { convert_date_to_timezone } from 'src/utils/dateUtils';
import { WISHLIST_DATE_FORMAT, wishlist_source } from './constants';
import NoProducts from 'src/common/@the-source/molecules/ErrorPages/No_Products';
import RouteNames from 'src/utils/RouteNames';
import { updateBreadcrumbs } from 'src/actions/topbar';
import { makeStyles } from '@mui/styles';
import api_requests from 'src/utils/api_requests';

const useStyles = makeStyles((theme: any) => ({
	breadcrumbs_style: {
		...theme?.product?.bread_crumb_styles,
	},
}));

const arr = [1, 2, 3, 4, 5];

interface HitsResponseSetter {
	nbHits?: number;
	page?: number;
	hits?: any[];
	pages?: number;
	is_next_page?: boolean;
}

const WishlistDetails = () => {
	const navigate = useNavigate();
	const params = useParams();
	const dispatch = useDispatch();
	const classes = useStyles();

	const theme = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));

	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';

	const { config = [], global_sorts = [] } = useSelector((state: any) => state?.settings?.product_listing_config);
	const bread_crumb_list = useSelector((state: any) => state.breadcrumb.breadcrumbs);

	const cart = useSelector((state: any) => state?.cart);
	const buyer = useSelector((state: any) => state?.buyer);
	const pricelist = usePricelist();
	const { find_wishlist } = useWishlistActions();
	const { initialize_cart } = useProductListingPageTemplate();

	const [products, set_products] = useState<any[]>([]);
	const [sort, set_sort] = useState<any>('');
	const [has_more, set_has_more] = useState(false);
	const [nb_hits, set_nbhits] = useState(0);
	const [current_page, set_current_page] = useState(1);
	const [total_pages, set_total_pages] = useState(0);
	const [is_loading_more, set_is_loading_more] = useState(false);
	const [loading, set_loading] = useState(true);
	const [add_to_cart_loader, set_add_to_cart_loader] = useState(false);
	const [search, set_search] = useState('');

	const product_template = useMemo(() => {
		return find(config, (item: any) => item.type === constants.RAILS.ALL_PRODUCTS_SECTION)?.template;
	}, [config]);

	const wishlist_for = find_wishlist(params?.id ?? '');

	const created_by = useMemo(() => get(wishlist_for, 'data.created_by_name'), [wishlist_for]);
	const updated_by = useMemo(() => get(wishlist_for, 'data.updated_by_name'), [wishlist_for]);
	const created_at = useMemo(() => convert_date_to_timezone(get(wishlist_for, 'data.created_at'), WISHLIST_DATE_FORMAT), [wishlist_for]);
	const updated_at = useMemo(() => convert_date_to_timezone(get(wishlist_for, 'data.updated_at'), WISHLIST_DATE_FORMAT), [wishlist_for]);

	const [discount_campaigns, set_discount_campaigns] = useState<any>([]);
	const breadCrumbList = [
		{
			id: 1,
			linkTitle: 'Home',
			link: is_ultron ? RouteNames.dashboard.path : RouteNames.home.path,
		},
		{
			id: 2,
			linkTitle: 'Wishlist',
			link: RouteNames.account.wishlist.path,
		},
		{
			id: 2,
			linkTitle: `${wishlist_for?.data?.name}`,
			link: '',
		},
	];

	useEffect(() => {
		dispatch(updateBreadcrumbs(breadCrumbList));
	}, [config]);
	const is_wizshop_source = get(wishlist_for, 'data.source', '') === wishlist_source.WIZSHOP;

	const handle_sort = (key: any) => {
		set_sort(key);
	};

	const handle_error = () => {
		dispatch<any>(
			show_toast({
				open: true,
				showCross: false,
				anchorOrigin: {
					vertical: types.VERTICAL_TOP,
					horizontal: types.HORIZONTAL_CENTER,
				},
				autoHideDuration: 5000,
				onClose: (_: React.ChangeEvent<HTMLInputElement>, reason: String) => {
					if (reason === types.REASON_CLICK) {
						return;
					}
					dispatch(close_toast(''));
				},
				state: types.ERROR_STATE,
				title: types.ERROR_TITLE,
				showActions: false,
			}),
		);
	};

	const convert_wishlist_to_cart = async () => {
		if (!params.id) return;
		if (add_to_cart_loader) return;
		try {
			const cart_id = !isEmpty(cart?.id) ? cart?.id : buyer?.buyer_cart?.id;
			set_add_to_cart_loader(true);
			const res: any = await wishlist.add_wishlist_to_cart(params?.id, cart_id, pricelist?.value, buyer?.id);
			initialize_cart();
			dispatch<any>(
				show_toast({
					open: true,
					showCross: false,
					anchorOrigin: {
						vertical: types.VERTICAL_TOP,
						horizontal: types.HORIZONTAL_CENTER,
					},
					autoHideDuration: 5000,
					onClose: (_: React.ChangeEvent<HTMLInputElement>, reason: String) => {
						if (reason === types.REASON_CLICK) {
							return;
						}
						dispatch(close_toast(''));
					},
					state: types.SUCCESS_STATE,
					title: types.SUCCESS_TITLE,
					subtitle: res?.message ?? '',
					showActions: false,
				}),
			);
		} catch (err) {
			handle_error();
		} finally {
			set_add_to_cart_loader(false);
		}
	};

	const hits_response_setter = ({ nbHits = 0, page = 0, hits = [], pages = 0, is_next_page = false }: HitsResponseSetter) => {
		set_nbhits(nbHits);
		set_current_page(page);
		if (is_next_page) {
			set_products((prev: any[]) => [...prev, ...hits]);
		} else {
			set_products(hits);
		}
		set_total_pages(pages);
		set_has_more(pages > page);
	};

	const get_discount_campaign = async () => {
		try {
			const response: any = await api_requests.product_details.get_discount_campaign('product_discount_campaign');
			if (response?.status === 200) {
				set_discount_campaigns(response?.data);
			}
		} catch (err) {
			console.error(err, 'error while fetching discount campaigns');
		}
	};

	const get_wishlist_products = useCallback(
		async (sorting: SortOption, price_list: string | undefined, wishlist_id: string, is_next_page = false, curr_page = current_page) => {
			try {
				const payload = {
					filters: {
						wishlists: [wishlist_id],
						type: PRODUCT_DETAILS_TYPE.variant,
					},
					search: isEmpty(search) ? '' : search,
					page_size: PRODUCTS_PER_PAGE.WISHLIST_PAGE,
					sort: sorting ? [sorting] : [],
					catalog_ids: price_list ? [price_list] : [],
					page_number: is_next_page ? curr_page + 1 : curr_page,
				};
				const response: any = await product_listing.get_product_list(payload);
				const { hits, nbHits, page, nbPages } = response?.data;
				const mapped_hits = sort_products_and_convert_to_array(hits);
				hits_response_setter({
					nbHits,
					page,
					hits: mapped_hits,
					pages: nbPages,
					is_next_page,
				});
			} catch (err) {
				console.error(err);
			} finally {
				set_loading(false);
				set_is_loading_more(false);
			}
		},
		[sort, current_page, pricelist, search],
	);

	const refine_next = () => {
		if (is_loading_more) return;
		if (!sort) return;
		if (total_pages > current_page) {
			set_is_loading_more(true);
			get_wishlist_products(sort, pricelist?.value, params?.id ?? '', true);
		}
	};

	const render_hits = () => {
		return (
			<InfiniteScroll
				dataLength={products.length}
				next={refine_next}
				hasMore={has_more}
				scrollableTarget='rootContainer'
				loader={
					is_loading_more && (
						<Grid
							className='Loader'
							spacing={0}
							direction='row'
							container
							columns={{ xs: 12, sm: 12, md: 12, lg: 15, xl: 15 }}
							alignItems='stretch'>
							{arr.map((a: any) => (
								<Grid key={a} xs={is_ultron ? 12 : 6} sm={4} md={4} lg={3} xl={3} item>
									<SkeletonProductCard />
								</Grid>
							))}
						</Grid>
					)
				}>
				<Grid container sx={{ paddingTop: '1rem' }} spacing={1.6} columns={{ xs: 12, sm: 12, md: 12, lg: 15, xl: 15 }} alignItems='stretch'>
					{size(products) > 0 && (
						<>
							{map(products, (product: Product, index: number) => {
								return (
									<Grid xs={is_ultron ? 12 : 6} sm={4} md={4} lg={3} xl={3} item key={product.id} id={`scroll_div-${index}`}>
										<CancelProductCard
											product={product}
											wishlist_for={wishlist_for}
											set_products={set_products}
											set_nbhits={set_nbhits}
											handle_error={handle_error}
											product_template={product_template}
											discount_campaigns={discount_campaigns}
										/>
									</Grid>
								);
							})}
						</>
					)}
				</Grid>
			</InfiniteScroll>
		);
	};

	const handle_render_wishlisted_products = () => {
		return loading ? (
			<Grid container sx={{ paddingTop: '1rem' }} spacing={1.6} columns={{ xs: 12, sm: 12, md: 12, lg: 15, xl: 15 }} alignItems='stretch'>
				{arr.map((a: any) => (
					<Grid key={a} xs={is_ultron ? 12 : 6} sm={4} md={4} lg={3} xl={3} item>
						<SkeletonProductCard />
					</Grid>
				))}
			</Grid>
		) : size(products) === 0 ? (
			isEmpty(search) ? (
				<NoWishlist title={t('Wishlist.NoWishList.NoWishlistedProducts')} description={t('Wishlist.NoWishList.NoWishlistedProductDesc')} />
			) : (
				<NoProducts />
			)
		) : (
			nb_hits > 0 && render_hits()
		);
	};

	useEffect(() => {
		if (isEmpty(sort)) return;

		set_loading(true);
		if (!isEmpty(search)) {
			const timeout = setTimeout(() => {
				get_wishlist_products(sort, pricelist?.value, params?.id ?? '', false, 1);
			}, 500);

			return () => {
				clearTimeout(timeout);
				set_loading(false);
			};
		} else {
			get_wishlist_products(sort, pricelist?.value, params?.id ?? '', false, 1);
		}
	}, [sort, search, sort, pricelist, params]);

	useEffect(() => {
		if (size(products) < 15 && has_more) {
			refine_next();
		}
	}, [products, has_more]);

	useEffect(() => {
		set_sort(get_default_wishlist_sort(global_sorts));
	}, [global_sorts]);

	useEffect(() => {
		initialize_cart();
		get_discount_campaign();
	}, [buyer?.buyer_cart, buyer?.catalog]);

	return (
		<Grid container flexDirection={'column'} style={{ minHeight: '94vh', paddingBottom: '16px' }}>
			{is_ultron && (
				<PageHeader
					leftSection={
						<Grid container flexDirection={'row'} gap={'2rem'}>
							<CustomText type='H6' style={{ display: 'flex', alignItems: 'center' }}>
								<Icon
									iconName='IconArrowLeft'
									sx={{
										cursor: 'pointer',
										paddingRight: '1rem',
									}}
									onClick={() => navigate(-1)}
								/>
								{get(wishlist_for, 'data.name', '')}
							</CustomText>
							<TextField
								size='small'
								value={search}
								onChange={(e) => set_search(e.target.value)}
								placeholder='Search'
								sx={{
									width: '350px',
									'& .MuiOutlinedInput-root': {
										backgroundColor: colors.white,
									},
								}}
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											{<Icon iconName='IconSearch' sx={{ color: '#4F555E' }} color={secondary[800]} />}
										</InputAdornment>
									),
								}}
							/>
						</Grid>
					}
					rightSection={
						<div style={{ display: 'flex', gap: '10px' }}>
							<CatalogSwitch />
							<Button disabled={isEmpty(products)} loading={add_to_cart_loader} onClick={convert_wishlist_to_cart}>
								{t('Wishlist.Details.AddAllToCart')}
							</Button>
							<Cart />
							{!is_wizshop_source && <PageHeaderMenuOptions wishlist={wishlist_for?.data} />}
						</div>
					}
				/>
			)}

			{!is_ultron && !is_small_screen && (
				<React.Fragment>
					{bread_crumb_list?.length > 0 && (
						<Grid item>
							<Breadcrumb className={classes.breadcrumbs_style} links={bread_crumb_list} />
						</Grid>
					)}
				</React.Fragment>
			)}

			{!is_ultron && (
				<Grid display={'flex'} alignItems={'center'} style={{ margin: '1rem 0rem' }}>
					{is_small_screen && <Icon sx={{ paddingRight: '1rem' }} iconName='IconArrowLeft' onClick={() => navigate(-1)} />}
					<CustomText type='BodyLarge'>{get_short_name(wishlist_for?.data?.name)}</CustomText>
				</Grid>
			)}

			{!loading && size(products) > 0 && (
				<>
					<Grid item display={'flex'} alignItems={'center'} mt={1}>
						<CustomText color={colors.secondary_text}>
							{t('Wishlist.Details.WishlistCreatedAt', { date: created_at })}
							<span> • </span>
							{t('Wishlist.Details.WishlistUpdatedAt', { date: updated_at })}
						</CustomText>
					</Grid>
					<Grid container width={'100%'} display={'flex'} justifyContent={'space-between'}>
						<Grid item display={'flex'} alignItems={'center'}>
							<CustomText color={colors.secondary_text}>
								{t('Wishlist.Details.TotalProductsCount', {
									value: `${nb_hits} ${nb_hits <= 1 ? 'product' : 'products'}`,
								})}
							</CustomText>
							{!is_ultron && (
								<Button
									variant='text'
									disabled={isEmpty(products)}
									loading={add_to_cart_loader}
									onClick={convert_wishlist_to_cart}
									sx={{
										paddingLeft: '12px !important',
									}}>
									{t('Wishlist.Details.AddAllToCart')}
								</Button>
							)}
						</Grid>
						<Grid item display={'flex'} gap={1} justifyContent={'flex-end'}>
							<Sort
								onChange={handle_sort}
								defaultSort={get_default_sort(global_sorts, sort)}
								options={global_sorts}
								size='small'
								fullWidth={false}
								{...(is_small_screen && !is_ultron ? { renderValue: () => '' } : {})}
								sx={
									is_small_screen && !is_ultron
										? {
												'& .MuiInputBase-root': {
													width: 'auto',
												},
												'& .MuiSvgIcon-root': {
													width: '100%',
													right: '0',
												},
										  }
										: {}
								}
							/>
						</Grid>
					</Grid>
				</>
			)}

			<Grid flex={1} container flexDirection={'column'} gap={4} mt={1}>
				<Grid container flexDirection={'column'} flex={1}>
					{handle_render_wishlisted_products()}
				</Grid>
				{is_ultron && (
					<Grid>
						<CustomText color={colors.secondary_text} type='Body'>
							{t('Wishlist.Details.WishlistUpdated', {
								date: updated_at,
								name: updated_by,
							})}
						</CustomText>
						<CustomText color={colors.secondary_text} type='Body'>
							{t('Wishlist.Details.WishlistCreated', {
								date: created_at,
								name: created_by,
							})}
						</CustomText>
					</Grid>
				)}
			</Grid>
		</Grid>
	);
};

export default WishlistDetails;
