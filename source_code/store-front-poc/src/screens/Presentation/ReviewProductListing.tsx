import React, { useEffect, useMemo, useState } from 'react';
import { filter, find, get, head, isEmpty, isEqual, map, omit, size } from 'lodash';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { updateBreadcrumbs } from 'src/actions/topbar';
import { Button, Icon, PageHeader, Grid, Sort } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import RouteNames from 'src/utils/RouteNames';
import CustomizeCatalogDrawer from './components/CustomizeCatalogDrawer';
import constants from 'src/utils/constants';
import ProductTemplateTwo from '../ProductListing/components/ProductTemplate2';
import { Product } from '../ProductListing/mock/ProductInterface';
import SkeletonProductCard from '../ProductListing/components/SkeletonProductCard';
import { CatalogPreviewModal } from './components/CatalogPreview';
import { CatalogSwitch } from 'src/common/PageHeaderComponents';
import { product_listing } from 'src/utils/api_requests/productListing';
import { get_default_sort } from 'src/common/@the-source/molecules/FiltersAndChips/helper';
import { sort_products_and_convert_to_array } from '../ProductListing/utils';
import presentation from 'src/utils/api_requests/presentation';
import {
	CatalogFormValues,
	CatalogTemplate,
	EditedCatalogData,
	FileData,
	ReviewProductListingProps,
	SortOption,
} from 'src/@types/presentation';
import {
	set_catalog_products,
	set_edit_catalog_data,
	set_is_edit_fetched,
	set_selected_pricelist,
	set_selected_sort,
} from 'src/actions/catalog_mode';
import CatalogFactory from 'src/utils/catalog.utils';
import EmptyReviewScreen from './components/EmptyReviewScreen';
import useCatalogActions from 'src/hooks/useCatalogActions';
import InfiniteScroll from 'react-infinite-scroll-component';
import Alert from 'src/common/@the-source/atoms/Alert';
import { REVIEW_PRODUCTS_PER_PAGE } from './constants';
import { t } from 'i18next';
import { get_product_id } from 'src/utils/utils';
import useEffectOnDependencyChange from 'src/hooks/useEffectOnDependencyChange';
import types from 'src/utils/types';
import { ICatalog } from 'src/reducers/buyer';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material';

const arr = [1, 2, 3, 4, 5];
const ALERT_INITIAL_STATE = {
	visible: false,
	count: 0,
};

const useStyles = makeStyles((theme: any) => ({
	alert: {
		width: '100%',
		padding: '4px 16px',
		margin: '4px 0px',
		backgroundColor: theme?.palette?.warning[50],
	},
}));

function ReviewProductListing({ is_edit_mode = false }: ReviewProductListingProps) {
	const [products, set_products] = useState<Product[]>([]);
	const [is_loading, set_is_loading] = useState<boolean>(true);
	const [catalog_drawer, set_catalog_drawer] = useState(false);
	const [catalog_preview, set_catalog_preview] = useState(false);
	const [is_submit_loading, set_is_submit_loading] = useState<boolean>(false);
	const [is_preview_loading, set_is_preview_loading] = useState<boolean>(false);
	// const [catalog_selected_sort, set_current_sorting] = useState<SortOption>();
	const [catalog_templates, set_catalog_templates] = useState<CatalogTemplate[]>([]);
	// const [catalog_selected_pricelist, set_selected_price_list] = useState<ICatalog>();
	const [submit_payload, set_submit_payload] = useState<CatalogFormValues | null>(null);
	const { sorts = [], config = [] } = useSelector((state: any) => state?.settings?.product_listing_config);
	const [has_more, set_has_more] = useState(false);
	const [nb_hits, set_nbhits] = useState(0);
	const [current_page, set_current_page] = useState(1);
	const [total_pages, set_total_pages] = useState(0);
	const [is_loading_more, set_is_loading_more] = useState(false);
	const [alert, set_alert] = useState(ALERT_INITIAL_STATE);
	const {
		catalog_mode,
		catalog_products = [],
		catalog_selected_pricelist = {},
		catalog_selected_sort = {},
		is_edit_fetched,
		edit_catalog_data,
		edit_mode,
	} = useSelector((state: any) => state?.catalog_mode);
	const { catalog_id = '' } = useParams();
	const [file_data, set_file_data] = useState<FileData>({
		name: '',
		url: '',
		products: 0,
	});
	const { handle_reset_catalog_mode, handle_get_products, handle_show_toast } = useCatalogActions();
	const is_empty_screen = isEmpty(products);
	const product_template = useMemo(() => {
		return find(config, (item: any) => item.type === constants.RAILS.ALL_PRODUCTS_SECTION)?.template;
	}, [config]);
	const page_heading = useMemo(() => {
		return is_edit_mode ? get(edit_catalog_data, 'name') : t('Presentation.ReviewProductListing.Heading');
	}, [is_edit_mode, edit_catalog_data]);
	const classes = useStyles();
	const theme: any = useTheme();

	const breadCrumbList = [
		{
			id: 1,
			linkTitle: 'All products',
			link: `${RouteNames.product.all_products.path}`,
		},
		{
			id: 2,
			linkTitle: 'Review products',
			link: `${RouteNames.product.all_products.review.path}`,
		},
	];

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handle_navigate_back = () => {
		navigate(-1);
	};

	const handle_navigate_to_plp = () => {
		navigate(RouteNames.product.all_products.path);
	};

	const hits_response_setter = (nbHits: number = 0, page: number = 0, hits: any[] = [], pages: number = 0, is_next_page = false) => {
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

	const close_alert = () => {
		set_alert(ALERT_INITIAL_STATE);
	};

	const fetch_products_hits = async (
		sorting: SortOption,
		price_list: string | undefined,
		product_ids = catalog_products,
		is_next_page = false,
		curr_page = current_page,
	) => {
		if (!is_loading && !is_next_page) {
			set_is_loading(true);
		}

		if (isEmpty(product_ids)) {
			set_products([]);
			set_is_loading(false);
			return;
		}

		try {
			const payload = {
				filters: {
					id: product_ids,
				},
				sort: sorting ? [sorting] : [],
				catalog_ids: price_list ? [price_list] : [],
				page_size: REVIEW_PRODUCTS_PER_PAGE,
				page_number: is_next_page ? curr_page + 1 : curr_page,
			};
			const response: any = await product_listing.get_product_list(payload);
			const { hits, nbHits, page, nbPages } = response?.data;
			const mapped_hits = sort_products_and_convert_to_array(hits);
			hits_response_setter(nbHits, page, mapped_hits, nbPages, is_next_page);
		} catch (error) {
			console.error(error);
		} finally {
			set_is_loading(false);
			set_is_loading_more(false);
		}
	};

	const fecth_catalog_templates = async () => {
		try {
			const response: any = await presentation.get_presentation_templates();
			if (response?.status === 200) {
				const data: CatalogTemplate[] = response?.data || [];
				set_catalog_templates(data);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const count_unavailable_products = (previous_products: string[], updated_products: string[]): number => {
		return filter(previous_products, (product: string) => !updated_products.includes(product)).length;
	};

	const fetch_unavailable_products = async (product_ids: string[], pricelist: ICatalog) => {
		try {
			const updated_products = await handle_get_products({
				product_ids,
				pricelist,
				response_keys: ['id'],
			});
			const { hits } = updated_products?.data;
			const updated_ids = map(hits, (item: any) => item?.id);
			const unavailable_products = count_unavailable_products(product_ids, updated_ids);
			if (unavailable_products > 0) {
				set_alert({
					visible: true,
					count: unavailable_products,
				});
			}
			dispatch(set_catalog_products(updated_ids));
			return updated_ids;
		} catch (error) {
			console.error(error);
		}
	};

	const fetch_presentation_data = async () => {
		set_is_loading(true);
		try {
			const response: any = await presentation.get_presenntation_by_id(catalog_id);
			const data: EditedCatalogData | null = response?.data;
			if (!data) return;
			const { product_ids = [], sort_by, catalog_id: pricelist_id } = data;
			const response_price_list = {
				value: pricelist_id,
			};
			const updated_ids = await fetch_unavailable_products(product_ids, response_price_list);
			dispatch(set_selected_pricelist(response_price_list));
			const default_sorting = find(sorts, (sort_option: SortOption) => sort_option?.is_default)?.key || (head(sorts) as any)?.key;

			const response_sort_option = find(sorts, (sort_item) => isEqual(sort_item?.key, sort_by))?.key || default_sorting;
			dispatch(set_selected_sort(response_sort_option));
			dispatch(set_edit_catalog_data(data));
			dispatch(set_is_edit_fetched(true));
			fetch_products_hits(response_sort_option, response_price_list?.value, updated_ids);
		} catch (error) {
			console.error(error);
		}
	};

	const handle_sort_select = (key: SortOption) => {
		dispatch(set_selected_sort(key));
	};

	const handle_only_on_sort_change = (key: SortOption) => {
		fetch_products_hits(key, catalog_selected_pricelist?.value, catalog_products);
	};

	useEffect(() => {
		dispatch(updateBreadcrumbs(breadCrumbList));
		fecth_catalog_templates();
	}, []);

	useEffect(() => {
		if (is_edit_mode && !is_edit_fetched && edit_mode) {
			fetch_presentation_data();
		}
	}, [is_edit_mode, is_edit_fetched, edit_mode]);

	useEffect(() => {
		if (!is_edit_mode) {
			dispatch(set_selected_pricelist(CatalogFactory.MODE.get_selected_pricelist()));
			dispatch(set_selected_sort(CatalogFactory.MODE.get_selected_sort()));
			fetch_unavailable_products(catalog_products, catalog_selected_pricelist);
		}
	}, [is_edit_mode]);

	useEffect(() => {
		if (is_edit_mode && !is_edit_fetched) return;
		if (!catalog_selected_sort || !catalog_selected_pricelist?.value) return;
		fetch_products_hits(catalog_selected_sort, catalog_selected_pricelist?.value);
	}, [is_edit_mode, is_edit_fetched, catalog_selected_pricelist?.value]);

	const handle_submit_catalog = async (form_values: CatalogFormValues) => {
		set_is_submit_loading(true);
		try {
			const product_ids_to_map = get(form_values, 'product_ids', []);
			const { template_id, ...rest_values } = form_values;
			const payload = {
				...rest_values,
				template_db_id: template_id,
				catalog_id: catalog_selected_pricelist?.value,
				product_ids: filter(product_ids_to_map, (item: string) => Boolean(item)), // to filter out falsy values
			};
			const api_method = is_edit_mode
				? () => presentation.update_presentation(catalog_id, payload)
				: () => presentation.create_presentation(payload);
			const response: any = await api_method();
			if (response?.status === 200 || response?.status === 201) {
				handle_reset_catalog_mode();
				handle_show_toast({
					state: types.SUCCESS_STATE,
					title: t('Presentation.ToastMsg.GeneratingCatalog'),
					subtitle: '',
				});
				navigate(`${RouteNames.order_management.catalogs.path}`);
			}
		} catch (error) {
			console.error(error);
		} finally {
			set_is_submit_loading(false);
			set_catalog_drawer(false);
		}
	};

	const handle_catalog_preview = async (data: CatalogFormValues) => {
		try {
			set_is_preview_loading(true);
			const payload = {
				...omit(data, ['template_id']), // Removes template_id from data as not required in api
				template_db_id: data?.template_id,
			};
			const response: any = await presentation.get_presentation_preview(payload);
			if (response?.status === 200) {
				set_file_data({
					url: get(response, 'data.url', ''),
					name: data.name,
					products: size(payload.product_ids),
				});
				set_submit_payload(data);
				set_catalog_preview(true);
			}
		} catch (err) {
			console.error(err);
		} finally {
			set_is_preview_loading(false);
		}
	};

	const refine_next = () => {
		if (is_loading_more) return;
		if (!catalog_selected_sort) return;
		if (total_pages > current_page) {
			set_is_loading_more(true);
			const updated_product_ids = filter(catalog_products, (product_id: string) => {
				const check_product = filter(products, (product: Product) => get_product_id(product) === product_id);
				return size(check_product) === 0;
			});
			fetch_products_hits(catalog_selected_sort, catalog_selected_pricelist?.value, updated_product_ids, true, 0);
		}
	};

	const on_handle_cancel = (variant_id: string) => {
		set_products((prev) => filter(prev, (product: Product) => get_product_id(product) !== variant_id));
	};

	useEffectOnDependencyChange(() => {
		if (size(products) < 15 && size(catalog_products) - size(products) > 0) {
			refine_next();
		}
	}, [catalog_products, current_page, total_pages, products, catalog_selected_sort]);

	const handle_page_header_right_section = () => {
		return is_empty_screen ? null : (
			<div style={{ display: 'flex', gap: '10px' }}>
				<Button variant='outlined' onClick={handle_navigate_to_plp} color='primary'>
					{t('Presentation.ReviewProductListing.AddProducts')}
				</Button>
				<Button onClick={() => set_catalog_drawer(true)} color='primary'>
					{is_edit_mode ? t('Presentation.ReviewProductListing.Update') : t('Presentation.ReviewProductListing.Proceed')}
				</Button>
			</div>
		);
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
								<Grid key={a} xs={12} sm={4} md={4} lg={3} xl={3} item>
									<SkeletonProductCard />
								</Grid>
							))}
						</Grid>
					)
				}>
				<Grid container sx={{ paddingTop: '1rem' }} spacing={1.6} columns={{ xs: 12, sm: 12, md: 12, lg: 15, xl: 15 }} alignItems='stretch'>
					{products?.length > 0 && (
						<React.Fragment>
							{products.map((product: Product, index: number) => {
								return (
									<Grid xs={12} sm={4} md={4} lg={3} xl={3} item key={product.id} id={`scroll_div-${index}`}>
										<ProductTemplateTwo
											type={constants.PRODUCT_CARD_TYPE.SELECTED}
											container_style={{ justifyContent: 'space-around' }}
											product={product}
											has_similar={false}
											cards_template={product_template}
											catalog_mode={catalog_mode}
											on_handle_cancel={on_handle_cancel}
											allow_pdp_navigation={false}
										/>
									</Grid>
								);
							})}
						</React.Fragment>
					)}
				</Grid>
			</InfiniteScroll>
		);
	};

	return (
		<Grid
			container
			sx={{
				position: 'relative',
				paddingBottom: '4rem',
				height: '95vh',
				gap: '1.5rem',
				alignContent: 'flex-start',
			}}>
			<PageHeader
				shiftToNextLine={true}
				leftSection={
					<CustomText type='H6' style={{ display: 'flex', alignItems: 'center' }}>
						<Icon
							iconName='IconArrowLeft'
							sx={{
								cursor: 'pointer',
								paddingRight: '1rem',
							}}
							onClick={handle_navigate_back}
						/>
						{page_heading}
					</CustomText>
				}
				rightSection={handle_page_header_right_section()}
			/>
			<Alert
				style={{ width: '100%', padding: '4px 16px', margin: '4px 0px', backgroundColor: theme?.palette?.warning[50] }}
				className={classes.alert}
				open={alert.visible}
				icon={false}
				handle_close={close_alert}
				severity={'error'}
				message={`${alert.count} ${alert.count === 1 ? 'product is' : 'products are'} not available as ${
					alert.count === 1 ? 'it has' : 'they have'
				} been deleted`}
			/>
			<Grid container width={'100%'} display={'flex'} justifyContent={'space-between'}>
				<Grid item display={'flex'} gap={1} alignItems={'center'} pl={1}>
					{!is_loading && (
						<>
							<CustomText type='H3'>
								{catalog_products?.length} {catalog_products?.length === 1 ? 'product' : 'products'}
							</CustomText>
							<CustomText>{t('Presentation.ReviewProductListing.InCatalog')}</CustomText>
						</>
					)}
				</Grid>
				<Grid item display={'flex'} gap={1}>
					<CatalogSwitch />
					{!is_empty_screen && (
						<Sort
							onlyOnChange={handle_only_on_sort_change}
							onChange={handle_sort_select}
							options={sorts}
							defaultSort={get_default_sort(sorts, catalog_selected_sort)}
							size='small'
							fullWidth={false}
						/>
					)}
				</Grid>
			</Grid>
			{is_loading ? (
				<Grid container sx={{ paddingTop: '1rem' }} spacing={1.6} columns={{ xs: 12, sm: 12, md: 12, lg: 15, xl: 15 }} alignItems='stretch'>
					{arr.map((a: any) => (
						<Grid key={a} xs={12} sm={4} md={4} lg={3} xl={3} item>
							<SkeletonProductCard />
						</Grid>
					))}
				</Grid>
			) : size(products) === 0 ? (
				<EmptyReviewScreen handle_add_products={handle_navigate_to_plp} />
			) : (
				nb_hits > 0 && render_hits()
			)}

			{catalog_drawer && (
				<CustomizeCatalogDrawer
					is_edit_mode={is_edit_mode}
					current_sorting={catalog_selected_sort}
					edit_catalog_data={edit_catalog_data}
					is_preview_loading={is_preview_loading}
					is_drawer_visible={catalog_drawer}
					is_submit_loading={is_submit_loading}
					catalog_templates={catalog_templates}
					default_price_list={catalog_selected_pricelist}
					handle_close_drawer={() => set_catalog_drawer(false)}
					handle_submit_catalog={handle_submit_catalog}
					handle_catalog_preview={handle_catalog_preview}
				/>
			)}

			<CatalogPreviewModal
				is_edit_mode={is_edit_mode}
				is_submit_loading={is_submit_loading}
				open_modal={catalog_preview}
				set_open_modal={set_catalog_preview}
				file_data={file_data}
				submit_payload={submit_payload}
				handle_submit_catalog={handle_submit_catalog}
				from_review_page={true}
				max_pages={1}
			/>
		</Grid>
	);
}

export default ReviewProductListing;
