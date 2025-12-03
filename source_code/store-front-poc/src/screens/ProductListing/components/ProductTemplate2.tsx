/* eslint-disable */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useRef, useState } from 'react';
import useStyles from '../components/ProductStyle';
import { useSelector } from 'react-redux';
import { Button, Grid, Icon, Image, Counter, Tooltip, Chip, Box } from 'src/common/@the-source/atoms';
import VariantDrawer from 'src/common/@the-source/molecules/VariantDrawer';
import { Product } from '../mock/ProductInterface';
import SimilarDrawer from 'src/common/@the-source/molecules/SimilarDrawer';
import { all_product_card_template } from '../mock/card_template';
import { Link, useNavigate } from 'react-router-dom';
import HasSimilar from 'src/common/@the-source/molecules/RecommendCard/HasSimilar';
import RouteNames from 'src/utils/RouteNames';
import { useTranslation } from 'react-i18next';
import { from_max_quantity, get_cart_items, get_max_quantity, get_product_detail } from '../utils';
import types from 'src/utils/types';
import _, { get } from 'lodash';
import get_product_image from 'src/utils/ImageConstants';
import InventoryStatus from 'src/common/@the-source/molecules/Inventory/InventoryStatus';
import { INVENTORY_STATUS } from 'src/common/@the-source/molecules/Inventory/constants';
import dayjs from 'dayjs';
import utils, { get_attributes_mapping, get_product_id, get_product_metadata, should_handle_click } from 'src/utils/utils';
import CartDrawer from 'src/common/@the-source/molecules/CartItemDrawer/CartDrawer';
import React from 'react';
import CustomText from 'src/common/@the-source/CustomText';
// import { currency_number_format_no_sym, formatNumberWithCommas } from 'src/utils/common';
import { useTheme } from '@mui/material/styles';
import { colors, primary, secondary } from 'src/utils/light.theme'; //success
import useIsCustomization from 'src/hooks/useIsCustomization';
import CommonCustomizationComponent from 'src/common/CommonCustomizationComp';
// import CustomizeText from 'src/common/CommonCustomizationComp/CustomizeText';
import useMediaQuery from '@mui/material/useMediaQuery';
// import ImageLinks from 'src/assets/images/ImageLinks';
import { Mixpanel } from 'src/mixpanel';
import useProductListingPageTemplate from '../useProductListingPageTemplate';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
import constants from 'src/utils/constants';
import { ISelectedFilters } from 'src/common/@the-source/molecules/FiltersAndChips/interfaces';
import Events from 'src/utils/events_constants';
import CatalogFactory from '../../../utils/catalog.utils';
import { add_single_catalog_product, remove_multiple_catalog_products, remove_single_catalog_product } from 'src/actions/catalog_mode';
import { useDispatch } from 'react-redux';
import { useCatalogSelection } from 'src/hooks/useCatalogSelection';

import CustomCheckbox from 'src/common/@the-source/atoms/Checkbox/CustomCheckbox';
import { CircularProgress } from '@mui/material';
import useTenantSettings from 'src/hooks/useTenantSettings';
import { get_formatted_price_with_currency } from 'src/utils/common';
import WishlistSelectionModal from 'src/screens/Wishlist/Modals/WishlistSelectionModal';
import ImageLinks from 'src/assets/images/ImageLinks';
import useCatalogActions from 'src/hooks/useCatalogActions';
import ViewSelectButtons from './ViewSelectButtons';
import { valid_discount_for_product } from 'src/utils/DiscountEngineRule';
import PriceView from 'src/common/@the-source/PriceView';

// const useStyles = makeStyles(() => ({
// 	review_icon_style: {
// 		backgroundColor: colors.white,
// 		borderRadius: '2.1px',
// 	},
// 	selected_close_icon: {
// 		position: 'absolute',
// 		right: '8px',
// 		top: '8px',
// 		zIndex: 99,
// 		backgroundColor: colors.white,
// 		borderRadius: '100px',
// 		padding: '4px',
// 		boxShadow: '0px 4.88px 14.64px 0px #00000014',
// 		cursor: 'pointer',
// 	},
// }));

interface ProductTemplateTwoProps {
	type?: 'REVIEW' | 'ACTION' | 'SELECTED';
	product: Product;
	cards_template: any;
	has_similar: boolean;
	is_previous?: boolean;
	container_style?: React.CSSProperties;
	section_name?: any;
	page_name?: any;
	_page?: number;
	catalog_mode?: boolean;
	allow_pdp_navigation?: boolean;
	from_wishlist_detail_page?: boolean;
	card_loading?: boolean;
	show_stack_ui?: boolean;
	is_wizshop_source?: boolean;
	on_handle_cancel?: (id: string) => void;
	discount_campaigns?: any[];
}

const ProductTemplateTwo = ({
	type = constants.PRODUCT_CARD_TYPE.ACTION,
	product,
	cards_template,
	has_similar,
	container_style,
	is_previous = false,
	section_name,
	page_name,
	_page,
	catalog_mode = false,
	allow_pdp_navigation = true,
	from_wishlist_detail_page = false,
	card_loading = false,
	show_stack_ui = false,
	is_wizshop_source = false,
	discount_campaigns,
	on_handle_cancel = () => {},
}: ProductTemplateTwoProps) => {
	const { enable_wishlist } = useTenantSettings({
		[constants.TENANT_SETTINGS_KEYS.WISHLIST_ENABLED]: false,
	});
	const { catalog_products, catalog_products_length } = useSelector((state: any) => state?.catalog_mode);
	const buyer = useSelector((state: any) => state?.buyer);
	const cart = useSelector((state: any) => state?.cart);
	const { product_card_config = [], all_cards_config = {} } = useSelector((state: any) => state?.settings);
	const enable_tootip_plp_name = useSelector((state: any) => state?.settings?.enable_tootip_plp_name) || false;
	const hide_view_similar = useSelector((state: any) => state?.settings?.hide_view_similar) || false;
	const [drawer, setDrawer] = useState(false);
	const [drawerV, setDrawerV] = useState(false);
	const [cart_drawer, set_cart_drawer] = useState(false);
	const product_refs: any = useRef({}).current;
	const is_retail_mode = localStorage.getItem('retail_mode') === 'true';
	// const [show_ellipsis, set_show_ellipsis] = useState<boolean>(false);
	const data_values = get_product_detail(product);
	const get_product_rows = _.get(all_cards_config, 'product.rows');
	const [price, set_price] = useState(product?.pricing?.price);
	const [show_customization_drawer, set_show_customization_drawer] = useState<boolean>(false);
	const [selected_filters, set_selected_filters] = useState<ISelectedFilters>({ filters: {}, range_filters: {} });
	const [select_partial, set_select_partial] = useState(false);
	const assignRef = (node: any, product_id: any) => {
		if (node) {
			product_refs[product_id] = node;
		}
	};
	const master_discount_rule = useSelector((state: any) => state?.json_rules?.master_discount_rule);
	const discount_applied = valid_discount_for_product(master_discount_rule, discount_campaigns, product, buyer);

	const { is_customization_required, customize_id, grouping_identifier, get_and_initialize_cart } = useIsCustomization(product);
	const { selected, set_selected, handle_select_variant } = useCatalogSelection();
	const inner_hits = product?.inner_hits ?? [];
	const [single_selected, set_single_selected] = useState(false);

	const classes = useStyles();

	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const login = useSelector((state: any) => state.login);
	const is_logged_in = login?.status?.loggedIn;

	const count_non_custom_product = (cart: any, data_values: any) => {
		return _.reduce(
			_.values(cart?.products),
			(acc, product) => {
				const isCustom = _.some(_.values(product), (item) => item?.is_custom_product);
				return !isCustom && data_values?.parent_id === product?.parent_id ? acc + 1 : acc;
			},
			0,
		);
	};
	const count_selected_variants = (products: any[], variants: any[]) => {
		return _.reduce(
			variants,
			(acc, variant) => {
				return products.includes(variant) ? acc + 1 : acc;
			},
			0,
		);
	};

	const count_selected_inner_hits = () => {
		const final_array = [product?.id, ...inner_hits];

		if (catalog_mode) {
			return _.reduce(
				final_array,
				(acc, variant) => {
					return catalog_products.includes(variant) ? acc + 1 : acc;
				},
				0,
			);
		}

		let count = 0;
		const product_items = _.values(cart?.products);
		final_array.forEach((product_id: string) => {
			for (const item of product_items as any) {
				if (product_id === item?.id) {
					for (let cart_item in item) {
						if (item?.[cart_item]?.quantity && !item?.[cart_item]?.is_custom_product) {
							count++;
						}
					}
				}
			}
		});

		return count;
	};

	const { customer_metadata } = useProductListingPageTemplate();
	const product_metadata = get_product_metadata(product);
	const filtered_keys: any = utils.get_non_discount_keys(product, cart?.products, data_values?.product_id, discount_applied);
	const discounted_products: any = utils.get_discount_detail(cart.products?.[product?.id], discount_applied);
	const navigate = useNavigate();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	// const icon_classes = useStyles();

	const variants_count = _.filter(product?.variants_meta?.variant_data_map, (e: any) => e.is_active !== false)?.length;
	const is_review_active = type === constants.PRODUCT_CARD_TYPE.REVIEW;
	const is_selected_active = type === constants.PRODUCT_CARD_TYPE.SELECTED;
	const variant_id = get_product_id(product);
	const variant_ids: string[] = _.map(_.get(product, 'variants_meta.variant_data_map', []), (item: any) => item.product_id);
	const selected_variants = catalog_mode
		? count_selected_variants(catalog_products, variant_ids)
		: count_non_custom_product(cart, data_values);
	const product_limit = useSelector((state: any) =>
		get(state, 'settings.presentation_config.product_limit', constants.MAX_CATALOG_STORING_LIMIT_DEFAULT),
	);
	const { handle_selection_limit_toast } = useCatalogActions();
	// const check_overflow = (product_id: string) => {
	// 	const ref = product_refs[product_id];
	// 	if (ref) {
	// 		const is_overflowing = ref.offsetWidth > 180;
	// 		set_show_ellipsis(is_overflowing);
	// 	}
	// };

	const custom_variant_template: any[] = get_attributes_mapping(product_card_config, product);

	const handleVariant = () => {
		setDrawerV(true);
	};
	const handleDiscountProduct = () => {
		set_cart_drawer(true);
	};

	const similarSW = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
		Mixpanel.track(Events.VIEW_SIMILAR_CLICKED, {
			tab_name: 'Products',
			page_name,
			section_name,
			subtab_name: '',
			customer_metadata,
			product_metadata,
		});
		setDrawer(true);
		e.stopPropagation();
		e?.preventDefault(); // Fix to prevent navigation of Link component
	};
	const formatDate = (dateString: string) => {
		try {
			const date = dayjs(dateString);
			if (!date?.isValid()) {
				throw new Error('Invalid date string');
			}
			const formattedDate = date?.format(constants.ATTRIBUTE_DATE_FORMAT);
			return formattedDate;
		} catch (error) {
			console.error('Error formatting date:', error);
			return '';
		}
	};
	const get_variant_details = () => {
		if (_.size(inner_hits) > 0) {
			let count = count_selected_inner_hits();
			return (
				<Grid className={classes.variant_badge}>
					<Grid
						sx={{
							...theme?.product?.product_variant_chip,
							alignItems: 'center',
						}}
						className={count > 0 ? classes.selected_variant_value : classes.variant_value}>
						{count > 0 ? `${count}/${_.size(inner_hits) + 1}` : `+ ${_.size(inner_hits) + 1}`}
					</Grid>
				</Grid>
			);
		}

		if (!data_values?.is_variant && variants_count > 1) {
			return (
				<Grid className={classes.variant_badge}>
					<Grid
						sx={{
							...theme?.product?.product_variant_chip,
							background:
								selected_variants > 0
									? theme?.product?.recommanded?.selected_variant_value?.background
									: theme?.product?.recommanded?.number_of_variants?.background,
							alignItems: 'center',
						}}
						className={selected_variants > 0 ? classes.selected_variant_value : classes.variant_value}>
						{selected_variants > 0 ? `${selected_variants}/${variants_count}` : `+ ${variants_count}`}
					</Grid>
				</Grid>
			);
		}
		return <></>;
	};
	const render_column_content = (column: any, index: number) => {
		const styles = column?.style;
		switch (column?.key) {
			case 'name':
				return (
					<Grid className={classes.detail_container} key={column?.key}>
						<CustomText className={classes.product_name} style={column?.style}>
							{enable_tootip_plp_name ? (
								<Tooltip
									placement='top'
									onClose={() => {}}
									onOpen={() => {}}
									title={utils.get_column_display_value(column, product, price, data_values)}>
									{utils.get_column_display_value(column, product, price, data_values)}
								</Tooltip>
							) : (
								utils.get_column_display_value(column, product, price, data_values)
							)}
						</CustomText>

						{index === 0 && !is_small_screen && get_variant_details()}
					</Grid>
				);
			case 'sku_id':
				return (
					<Grid sx={styles} className={classes.text_overflow} key={column?.key} width={is_small_screen ? '100%' : '40%'}>
						{utils.get_column_display_value(column, product, price, data_values)}
					</Grid>
				);
			default:
				if (utils.is_prelogin_price(is_logged_in)) {
					if (column?.type === 'price') {
						// const key = data_values?.is_variant ? column?.variant_key : column?.product_key;
						const price = _.get(product, 'pricing.price');
						const currency = _.get(product, 'pricing.currency', '$');
						const min = _.get(product, 'pricing.variant_price_range.min_value', 0);
						const max = _.get(product, 'pricing.variant_price_range.max_value', 0);
						const price_range =
							min === max
								? `${get_formatted_price_with_currency(currency, price)}`
								: `${get_formatted_price_with_currency(currency, _.floor(min))} - 
											${get_formatted_price_with_currency(currency, _.ceil(max))}`;

						return (
							<Grid
								display={'flex'}
								gap={1}
								sx={{ ...column?.style, color: theme?.product?.product_card?.color }}
								className={classes.text_overflow}
								key={column?.type}>
								{!is_retail_mode ? (
									// utils.get_column_display_value(column, product, price, data_values)
									<PriceView
										discount_campaigns={discount_campaigns}
										currency_symbol={currency}
										product={product}
										column={column}
										data_values={data_values}
										show_stack_ui={show_stack_ui}
										custom_text_types={{
											base_price_type: 'Body',
											discount_applied_type: 'Caption',
											discount_value_type: 'Caption',
										}}
									/>
								) : null}
							</Grid>
						);
					} else {
						return (
							<Grid sx={{ ...column?.style, color: theme?.product?.product_card?.color }} key={column?.key}>
								{utils.get_column_display_value(column, product, price, data_values)}
							</Grid>
						);
					}
				} else {
					return (
						<Grid>
							<Image src={ImageLinks.unlock_price} width='100px' alt='banner_image' />
						</Grid>
					);
				}
		}
	};

	const reserved = cart?.document_items?.[product.id]?.total_reserved ?? 0;
	const total_available = product?.inventory?.total_available ?? 0;
	const out_of_stock_threshold = product?.inventory?.out_of_stock_threshold ?? 0;
	const is_not_in_stock = reserved + total_available <= out_of_stock_threshold;
	const max_quantity = get_max_quantity(product, reserved);
	const disable_counter = product?.inventory?.inventory_status === INVENTORY_STATUS.out_of_stock && is_not_in_stock && variants_count <= 1;

	// useLayoutEffect(() => {
	// 	check_overflow(product?.id);
	// }, [product?.id]);

	const handle_mark_for_review = (e: any) => {
		e.preventDefault();
		if ((variants_count > 1 && !data_values.is_variant) || _.size(inner_hits) > 0) {
			setDrawerV(true);
			return;
		}
		if (select_partial) {
			dispatch(remove_multiple_catalog_products(variant_ids));
			set_select_partial(false);
			return;
		}
		handle_select_variant(variant_id);
	};

	const handle_single_product_selection = () => {
		if (single_selected) {
			dispatch(remove_single_catalog_product(variant_id));
		} else {
			if (catalog_products_length >= product_limit) {
				handle_selection_limit_toast(product_limit);
				return;
			}
			dispatch(add_single_catalog_product(variant_id));
		}
		set_single_selected((prev: boolean) => !prev);
	};

	const handle_product_card_click = (e: React.MouseEvent<HTMLDivElement>) => {
		if (!should_handle_click(e) || !allow_pdp_navigation) return;

		const id_to_send = product?.type === 'variant' ? product?.id : product?.parent_id;
		sessionStorage.setItem('product_id', id_to_send);

		if (is_review_active) {
			handle_single_product_selection();
			return;
		}
		navigate(`${RouteNames.product.product_detail.routing_path}${product?.id}`, { state: _page });
		window.scrollTo(0, 0);

		Mixpanel.track(Events.PRODUCT_CARD_CLICKED, {
			tab_name: 'Products',
			page_name,
			section_name,
			subtab_name: '',
			customer_metadata,
			product_metadata,
		});
	};

	const handle_product_chips = (e: any) => {
		if (is_selected_active) return;
		if (is_review_active) {
			handle_single_product_selection();
		} else {
			navigate(`${RouteNames.product.product_detail.routing_path}${product?.id}`);
		}
	};

	const handle_remove = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();

		on_handle_cancel(variant_id);
		if (is_selected_active) {
			dispatch(remove_single_catalog_product(variant_id));
		}
	};

	const handle_render_remove = () => {
		if ((is_selected_active || from_wishlist_detail_page) && is_wizshop_source) {
			return <Icon iconName='IconX' color={secondary[700]} onClick={handle_remove} className={`${classes.selected_close_icon}`} />;
		}
		return null;
	};

	const handle_render_wishlist = () => {
		if (enable_wishlist && !from_wishlist_detail_page && !product?.is_customizable) {
			return (
				<Box className={classes.wishlist_icon}>
					<WishlistSelectionModal product={product} />
				</Box>
			);
		}
		return null;
	};

	const handle_customization = (event: React.MouseEvent<HTMLButtonElement>) => {
		event?.stopPropagation();
		set_show_customization_drawer(true);
	};
	const attributes_list: any = custom_variant_template && _.head(custom_variant_template)?.attributes?.keys?.length > 0;
	const handle_navigate_to_pdp = () => {
		if (!allow_pdp_navigation) return;
		navigate(`${RouteNames.product.product_detail.routing_path}${product?.id}`);
	};

	const handle_render_button = () => {
		if (is_selected_active) return;

		if (is_review_active)
			return (
				<ViewSelectButtons
					product={product}
					on_view={handle_navigate_to_pdp}
					on_select={handle_mark_for_review}
					selected={selected && !select_partial}
				/>
			);

		if (variants_count + _.size(inner_hits) === 1 || (data_values.is_variant && _.size(inner_hits) === 0)) {
			if (!discounted_products?.is_discount_applied) {
				return (
					<Counter
						disabled={disable_counter}
						step={product?.pricing?.step_increment || types.STEP_INCREMENT}
						initialCount={0}
						cart_item_key={filtered_keys}
						min={product?.pricing?.min_order_quantity || types.MIN_ORDER_QUANTITY}
						max={max_quantity}
						from_max={from_max_quantity(max_quantity, product?.pricing?.max_order_quantity ?? types.DEFAULT_ORDER_QUANTITY)}
						product_id={data_values?.product_id}
						product={product}
						parent_id={data_values?.parent_id}
						containerStyle={{
							display: 'flex', // Use flex display
							justifyContent: 'space-between',
							...container_style,
						}}
						default_order_quantity={product?.pricing?.default_order_quantity}
						volume_tiers={product?.pricing?.volume_tiers}
						set_price={set_price}
						is_customization_required={is_customization_required}
						handle_customization={handle_customization}
						page_name={page_name}
						section_name={section_name}
						discount_applied={discount_applied}
					/>
				);
			} else {
				return (
					<Grid
						id={`counter_${product?.id}`}
						container
						style={{
							whiteSpace: 'nowrap',
							display: 'flex', // Use flex display
							justifyContent: 'space-between',
						}}
						alignItems='center'
						wrap='nowrap'>
						<Icon color='primary' iconName='IconMinus' fontSize='small' onClick={handleDiscountProduct} className={classes.remove_icon} />
						<Grid
							item
							alignItems='center'
							xl={8}
							lg={8}
							md={8}
							sm={8}
							xs={8}
							style={{
								flex: '1',
							}}>
							<input
								readOnly={true}
								className={classes.show_count}
								type='number'
								value={utils.get_cart_items(data_values?.product_id, cart) as any}
								onClick={handleDiscountProduct}
							/>
						</Grid>
						<Icon color={'primary'} iconName='IconPlus' fontSize='small' className={classes.add_icon} onClick={handleDiscountProduct} />
					</Grid>
				);
			}
		}

		return selected_variants > 0 || count_selected_inner_hits() > 0 ? (
			<Grid
				container
				id={`counter_${product?.id}`}
				style={{
					whiteSpace: 'nowrap',
					display: 'flex', // Use flex display
					justifyContent: 'space-between',
				}}
				alignItems='center'
				wrap='nowrap'>
				<Icon color='primary' iconName='IconMinus' fontSize='small' onClick={handleVariant} className={classes.remove_icon} />
				<Grid
					item
					alignItems='center'
					xl={8}
					lg={8}
					md={8}
					sm={8}
					xs={8}
					style={{
						flex: '1', // Let this item grow as needed
						justifyItems: 'center',
						position: 'relative',
					}}>
					<input
						readOnly={true}
						className={classes.show_count}
						type='number'
						value={get_cart_items(product, cart)}
						onClick={handleVariant}
					/>
				</Grid>
				<Icon color={'primary'} iconName='IconPlus' fontSize='small' className={classes.add_icon} onClick={handleVariant} />
			</Grid>
		) : (
			<Button
				size='large'
				id={`add_to_cart_${product?.id}`}
				tonal
				className={classes.cart_button}
				onClick={handleVariant}
				disabled={disable_counter}
				sx={{
					color: disable_counter ? primary[200] : '',
					background: disable_counter ? primary?.contrastText : '',
					'&:hover': { background: disable_counter ? primary?.contrastText : '', color: disable_counter ? primary[200] : '' },
				}}>
				<Grid container flexDirection={'column'}>
					<Grid>{t('ProductList.Main.AddToCart')}</Grid>
				</Grid>
			</Button>
		);
	};

	const get_product_ids_for_catalog_check = () => {
		const should_check_single_variant = data_values.is_variant && _.size(inner_hits) === 0;
		const ids_with_inner_hits = [variant_id, ...inner_hits];
		return should_check_single_variant ? [variant_id] : _.size(inner_hits) > 0 ? ids_with_inner_hits : variant_ids;
	};

	useEffect(() => {
		if (!catalog_mode && !is_review_active) return;
		const check = CatalogFactory.PRODUCT.check_multiple_products(get_product_ids_for_catalog_check(), catalog_products);
		const check_for_variant = CatalogFactory.PRODUCT.check_product(variant_id);
		const is_variant = data_values?.is_variant;
		const mark_for_review = (check.is_complete && !is_variant) || ((is_variant || variants_count === 0) && check_for_variant);
		set_selected(mark_for_review);
		set_select_partial(!check.is_complete && check.is_partial);
		set_single_selected(check_for_variant);
	}, [catalog_mode, catalog_products]);
	return (
		<Grid
			container
			className={
				show_stack_ui ? classes.product_container_stack : is_ultron ? classes.product_container : classes.storefront_product_container
			}
			id={product?.id}
			sx={{
				...theme?.product?.product_card,
				position: 'relative',
				width: show_stack_ui ? '50%' : '100%',
				marginLeft: show_stack_ui ? '10px' : '0px',
			}}>
			{card_loading && (
				<Grid className={classes.card_loading}>
					<CircularProgress sx={{ color: colors?.white }} />
				</Grid>
			)}
			{handle_render_wishlist()}
			<Grid container id={product?.id}>
				{card_loading && (
					<Grid className={classes.card_loading}>
						<CircularProgress sx={{ color: colors?.white }} />
					</Grid>
				)}
				{is_review_active && (
					<Box onClick={handle_single_product_selection} className={classes.review_checkbox}>
						<CustomCheckbox selected={selected} partial={select_partial} />
					</Box>
				)}

				{/* {(is_selected_active || from_wishlist_detail_page) && !is_wizshop_source && (
					<Icon iconName='IconX' color={secondary[700]} onClick={handle_remove} className={classes.selected_close_icon} />
				)} */}

				<Link
					to={`${RouteNames.product.product_detail.routing_path}${product?.id}`}
					state={_page}
					onClick={(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => utils.prevent_default_link_click(event)}
					className={classes.product_container_image}>
					<Grid className={classes.image_container} container onClick={handle_product_card_click}>
						{!is_ultron && handle_render_remove()}
						<Image
							id={is_ultron ? 'ultron_product_image' : 'product_image'}
							src={get_product_image(product, 'PRODUCT_CARD')}
							imgClass={classes.product_image}
						/>
						{is_previous && (
							<Chip
								bgColor={theme?.product?.product_template?.chip_style?.background}
								textColor={theme?.product?.product_template?.chip_style?.color}
								sx={{
									...theme?.product?.product_template?.date_chip,
								}}
								className={classes.date_chip}
								label={`Last order: ${formatDate(product?.updated_at)}`}
							/>
						)}
						{has_similar && !hide_view_similar && <HasSimilar similarDrawer={similarSW} />}

						{utils.is_prelogin_inventory(is_logged_in) && (
							<InventoryStatus
								data={product}
								variantType='chip'
								color={theme?.product?.inventory_status?.out_of_stock_chip?.color}
								style={
									is_previous && {
										color: 'white !important',
										bottom: 10,
										left: 5,
										top: null,
									}
								}
							/>
						)}
					</Grid>
				</Link>

				<Grid
					container
					sx={{
						paddingBottom: is_selected_active ? '12px' : '',
					}}>
					{_.map(get_product_rows || cards_template?.rows, (row: any, index: number) => (
						<Grid
							display='flex'
							flexDirection='column'
							key={`row_${index}`}
							className={classes.product_detail}
							container
							onClick={catalog_mode ? handle_single_product_selection : handle_navigate_to_pdp}>
							<Grid className={classes.product_sku_price} display={'flex'} justifyContent={'space-between'} sx={{ maxWidth: '100%' }}>
								{row?.map((column: any, index: number) => render_column_content(column, index))}
							</Grid>
						</Grid>
					))}

					{!is_small_screen &&
						custom_variant_template?.map((row: any, _index: number) => (
							<div style={{ width: '100%' }} className={classes.hinge_product_detail} key={`attribute_row_${_index}`}>
								<div
									className={_index === 0 ? classes.product_attribute_detail : classes.product_attribute_detail_nth}
									ref={(el) => assignRef(el, product?.id)}>
									{row?.attributes?.keys?.map((key: any) => {
										const columnValue = utils.get_column_display_value(key, product, price, data_values);
										if (columnValue && typeof columnValue === 'string' && columnValue?.trim()) {
											return (
												<Tooltip title={columnValue} placement='top' onClose={() => {}} onOpen={() => {}}>
													<div className={classes?.hinge_attr_value} onClick={handle_product_chips} key={key}>
														{/* {index > 0 && <Icon iconName='IconPointFilled' className={classes.list_circle} />} */}
														<CustomText className={classes?.hinge_custom_text} type='Caption' color={secondary[700]}>
															{columnValue}
														</CustomText>
													</div>
												</Tooltip>
											);
										}

										return null;
									})}
								</div>
								{/* {show_ellipsis && <p className={classes.ellipsis}>{'...'}</p>} */}
							</div>
						))}
					{(utils?.is_prelogin_add_to_cart_button(is_logged_in) || (is_ultron && !is_selected_active)) && (
						<Grid container justifyContent='center' alignItems='center' className={classes.add_to_button}>
							{is_review_active ? (
								<Button
									size='large'
									id={`view_details_${product?.id}`}
									tonal
									className={classes.cart_button}
									onClick={handle_navigate_to_pdp}
									sx={{
										height: '40px',
										boxShadow: 'none',
									}}>
									<Grid>{t('ProductList.Main.ViewDetails')}</Grid>
								</Button>
							) : variants_count + _.size(inner_hits) === 1 || (data_values.is_variant && _.size(inner_hits) === 0) ? (
								<>
									{!discounted_products?.is_discount_applied ? (
										<Counter
											disabled={disable_counter}
											step={product?.pricing?.step_increment || types.STEP_INCREMENT}
											initialCount={0}
											cart_item_key={filtered_keys}
											min={product?.pricing?.min_order_quantity || types.MIN_ORDER_QUANTITY}
											max={max_quantity}
											from_max={from_max_quantity(max_quantity, product?.pricing?.max_order_quantity ?? types.DEFAULT_ORDER_QUANTITY)}
											product_id={data_values?.product_id}
											product={product}
											parent_id={data_values?.parent_id}
											containerStyle={{
												display: 'flex',
												justifyContent: 'space-between',
												...container_style,
											}}
											default_order_quantity={product?.pricing?.default_order_quantity}
											volume_tiers={product?.pricing?.volume_tiers}
											set_price={set_price}
											is_customization_required={is_customization_required}
											handle_customization={handle_customization}
											page_name={page_name}
											section_name={section_name}
											discount_applied={discount_applied}
										/>
									) : (
										<>
											<Grid
												id={`counter_${product?.id}`}
												container
												style={{
													whiteSpace: 'nowrap',
													display: 'flex', // Use flex display
													justifyContent: 'space-between',
												}}
												alignItems='center'
												wrap='nowrap'>
												<Icon
													color='primary'
													iconName='IconMinus'
													fontSize='small'
													sx={{
														...theme?.product?.recommanded?.remove_icon,
													}}
													onClick={handleDiscountProduct}
													className={classes.remove_icon}
												/>
												<Grid
													item
													alignItems='center'
													xl={8}
													lg={8}
													md={8}
													sm={8}
													xs={8}
													style={{
														flex: '1',
													}}>
													<input
														id={'counter-input'}
														readOnly={true}
														className={classes.show_count}
														style={{
															...theme?.product?.recommanded?.show_count,
														}}
														type='number'
														value={utils.get_cart_items(data_values?.product_id, cart) as any}
														onClick={handleDiscountProduct}
													/>
												</Grid>
												<Icon
													color={'primary'}
													iconName='IconPlus'
													fontSize='small'
													className={classes.add_icon}
													sx={{
														...theme?.product?.recommanded?.add_icon,
													}}
													onClick={handleDiscountProduct}
												/>
											</Grid>
										</>
									)}
								</>
							) : (
								<>
									{selected_variants > 0 || count_selected_inner_hits() > 0 ? (
										<Grid
											container
											id={`counter_${product?.id}`}
											style={{
												whiteSpace: 'nowrap',
												display: 'flex', // Use flex display
												justifyContent: 'space-between',
											}}
											alignItems='center'
											wrap='nowrap'>
											<Icon
												color='primary'
												iconName='IconMinus'
												fontSize='small'
												onClick={handleVariant}
												sx={{
													...theme?.product?.recommanded?.remove_icon,
												}}
												className={classes.remove_icon}
											/>
											<Grid
												item
												alignItems='center'
												xl={8}
												lg={8}
												md={8}
												sm={8}
												xs={8}
												style={{
													flex: '1', // Let this item grow as needed
												}}>
												<input
													id={'counter-input'}
													readOnly={true}
													className={classes.show_count}
													style={{
														...theme?.product?.recommanded?.show_count,
														...theme?.product?.inventory_status?.product_listing_counter_style,
													}}
													type='number'
													value={get_cart_items(product, cart)}
													onClick={handleVariant}
												/>
											</Grid>
											<Icon
												color={'primary'}
												iconName='IconPlus'
												fontSize='small'
												sx={{
													...theme?.product?.recommanded?.add_icon,
												}}
												className={classes.add_icon}
												onClick={handleVariant}
											/>
										</Grid>
									) : (
										<Button
											size='large'
											id={`add_to_cart_${product?.id}`}
											tonal
											className={classes.cart_button}
											onClick={handleVariant}
											disabled={disable_counter}
											sx={{
												height: '40px',
												boxShadow: 'none',
												...theme?.product?.recommanded?.button,
												color: disable_counter ? theme?.product?.counter?.disabled_color : '',
												background: disable_counter ? theme?.product?.counter?.disabled_background : '',
												'&:hover': {
													background: disable_counter
														? theme?.product?.counter?.disabled_background
														: theme?.product?.recommanded?.button?.background,
													color: disable_counter ? theme?.product?.counter?.disabled_color : theme?.product?.recommanded?.button,
												},
											}}>
											<Grid>{t('ProductList.Main.AddToCart')}</Grid>
										</Button>
									)}
								</>
							)}
						</Grid>
					)}
					{!utils?.is_prelogin_price(is_logged_in) && (
						<Grid container justifyContent='center' alignItems='center' className={classes.add_to_button}>
							<Button
								fullWidth
								className={classes.wrapping_text}
								startIcon={<Icon iconName='IconLock' />}
								onClick={() => navigate(utils?.handle_active_free_trial_navigate())}>
								{utils?.check_prelogin_price(is_small_screen)}
							</Button>
						</Grid>
					)}

					{is_ultron && (
						<Grid
							container
							justifyContent='center'
							alignItems='center'
							className={classes.add_to_button}
							sx={{ gap: is_review_active ? 0.4 : 0 }}>
							{handle_render_button()}
						</Grid>
					)}

					{drawerV && (
						<VariantDrawer
							drawer={drawerV}
							set_drawer={setDrawerV}
							id={product?.id}
							attribute_template={custom_variant_template}
							parent_product={product}
							set_selected_filters={set_selected_filters}
							selected_filters={selected_filters}
							discount_campaigns={discount_campaigns}
						/>
					)}
					{drawer && (
						<SimilarDrawer
							drawer={drawer}
							setDrawer={setDrawer}
							simillar={product?.id}
							card_temp={all_product_card_template}
							discount_campaigns={discount_campaigns}
						/>
					)}

					{cart_drawer && (
						<CartDrawer
							show={cart_drawer}
							set_show={set_cart_drawer}
							data={product}
							cart_product_id={product?.id}
							attribute_template={custom_variant_template}
						/>
					)}
				</Grid>
				{show_customization_drawer && (
					<CommonCustomizationComponent
						customize_id={customize_id}
						product_details={product}
						grouping_identifier={grouping_identifier}
						get_and_initialize_cart={get_and_initialize_cart}
						show_customization_drawer={show_customization_drawer}
						set_show_customization_drawer={set_show_customization_drawer}
						page_name={page_name}
						section_name={section_name}
					/>
				)}
			</Grid>
		</Grid>
	);
};

export default ProductTemplateTwo;
