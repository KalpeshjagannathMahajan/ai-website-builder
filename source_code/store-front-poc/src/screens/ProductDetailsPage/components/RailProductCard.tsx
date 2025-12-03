/* eslint-disable react/no-array-index-key */
/* eslint-disable no-prototype-builtins */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Grid, Icon, Image, Counter, Tooltip, Box } from 'src/common/@the-source/atoms';
import VariantDrawer from 'src/common/@the-source/molecules/VariantDrawer';
import { useNavigate } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import { Product } from 'src/screens/ProductListing/mock/ProductInterface';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { from_max_quantity, get_cart_items, get_max_quantity, get_product_detail } from 'src/screens/ProductListing/utils';
import types from 'src/utils/types';
import _ from 'lodash';
import get_product_image from 'src/utils/ImageConstants';
import InventoryStatus from 'src/common/@the-source/molecules/Inventory/InventoryStatus';
import { INVENTORY_STATUS } from 'src/common/@the-source/molecules/Inventory/constants';
import CartDrawer from 'src/common/@the-source/molecules/CartItemDrawer/CartDrawer';
import utils, { get_attributes_mapping, get_customer_metadata, get_product_id, get_product_metadata } from 'src/utils/utils';
import CustomText from 'src/common/@the-source/CustomText';
import { useTheme } from '@mui/material/styles';
import useStyles from './RailProductStyle';
import { secondary } from 'src/utils/light.theme';
import { Buyer } from 'src/screens/BuyerDashboard/components/BuyerInterface';
import CounterWithoutRedux, { CartWithoutRedux } from 'src/common/@the-source/atoms/Counter/CounterWithoutRedux';
import useIsCustomization from 'src/hooks/useIsCustomization';
import CommonCustomizationComponent from 'src/common/CommonCustomizationComp';
import CustomizeText from 'src/common/CommonCustomizationComp/CustomizeText';
import ImageLinks from 'src/assets/images/ImageLinks';
import { useMediaQuery } from '@mui/material';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
import { Mixpanel } from 'src/mixpanel';
import { ISelectedFilters } from 'src/common/@the-source/molecules/FiltersAndChips/interfaces';
import Events from 'src/utils/events_constants';
import { PRODUCT_DETAILS_TYPE } from '../constants';
import CatalogFactory from 'src/utils/catalog.utils';
import { useCatalogSelection } from 'src/hooks/useCatalogSelection';
import useTenantSettings from 'src/hooks/useTenantSettings';
import constants from 'src/utils/constants';
import WishlistSelectionModal from 'src/screens/Wishlist/Modals/WishlistSelectionModal';
import ViewSelectButtons from 'src/screens/ProductListing/components/ViewSelectButtons';
import { valid_discount_for_product } from 'src/utils/DiscountEngineRule';
import PriceView from 'src/common/@the-source/PriceView';
import { isEmpty } from 'lodash';

interface ProductTemplateTwoProps {
	product: Product;
	cards_template: any;
	container_style?: React.CSSProperties;
	buyer?: Buyer;
	cart_data?: CartWithoutRedux;
	set_cart?: any;
	from_redux?: boolean;
	page_name?: any;
	section_name?: any;
	is_buyer_dashboard?: boolean;
	wishlist_data?: any;
	discount_campaigns?: any[];
}
const RailProductCard = ({
	product,
	cards_template,
	container_style,
	buyer,
	cart_data,
	set_cart,
	from_redux = true,
	page_name,
	section_name,
	is_buyer_dashboard = false,
	wishlist_data,
	discount_campaigns,
}: ProductTemplateTwoProps) => {
	const login = useSelector((state: any) => state.login);
	const is_logged_in = login?.status?.loggedIn;
	const is_retail_mode = localStorage.getItem('retail_mode') === 'true';
	const { enable_wishlist } = useTenantSettings({
		[constants.TENANT_SETTINGS_KEYS.WISHLIST_ENABLED]: false,
	});
	const { catalog_mode, catalog_products_length } = useSelector((state: any) => state?.catalog_mode);
	const cart = useSelector((state: any) => state?.cart);
	const [drawerV, setDrawerV] = useState(false);
	const [cart_drawer, set_cart_drawer] = useState(false);
	const [selected_filters, set_selected_filters] = useState<ISelectedFilters>({ filters: {}, range_filters: {} });
	const [price, set_price] = useState(product?.pricing?.price);
	const [show_customization_drawer, set_show_customization_drawer] = useState<boolean>(false);
	const product_refs: any = useRef({})?.current;
	// const [show_ellipsis, set_show_ellipsis] = useState<boolean>(false);
	const { product_card_config = [], all_cards_config = {} } = useSelector((state: any) => state?.settings);
	const { is_customization_required, customize_id, grouping_identifier, get_and_initialize_cart } = useIsCustomization(product);
	const data_values = get_product_detail(product);
	const get_product_rows = _.get(all_cards_config, 'product.rows');
	const variants_count = _.filter(product?.variants_meta?.variant_data_map, (e: any) => e.is_active !== false)?.length;
	const variant_id = get_product_id(product);
	const { selected, set_selected, handle_select_variant } = useCatalogSelection();

	const assignRef = (node: any, product_id: any) => {
		if (node) {
			product_refs[product_id] = node;
		}
	};
	const master_discount_rule = useSelector((state: any) => state?.json_rules?.master_discount_rule);
	const discount_applied = !isEmpty(master_discount_rule)
		? valid_discount_for_product(master_discount_rule, discount_campaigns, product, buyer, from_redux)
		: {};

	const classes = useStyles();
	const max = product?.pricing?.max_order_quantity;
	const count_non_custom_product = () => {
		return _.reduce(
			_.values(cart?.products),
			(acc: any, products: any) => {
				const isCustom = _.some(_.values(products), (item: any) => item?.is_custom_product);
				return !isCustom && data_values?.parent_id === products?.parent_id ? acc + 1 : acc;
			},
			0,
		);
	};

	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const selected_variants = count_non_custom_product();
	const filtered_keys: any = utils.get_non_discount_keys(
		product,
		from_redux ? cart?.products : cart_data?.products,
		data_values?.product_id,
		discount_applied,
	);
	const discounted_products: any = utils.get_discount_detail(
		from_redux ? cart?.products?.[product?.id] : cart_data?.products?.[product?.id],
		discount_applied,
	);
	const navigate = useNavigate();
	const { t } = useTranslation();

	// const check_overflow = (product_id: string) => {
	// 	const ref = product_refs[product_id];
	// 	if (ref) {
	// 		const is_overflowing = ref?.offsetWidth > 180;
	// 		set_show_ellipsis(is_overflowing);
	// 	}
	// };

	const handle_transform_card = (cards_template_row: any) => {
		if (is_ultron) {
			return cards_template_row;
		} else {
			const row_data = cards_template_row?.flat()?.map((item: any) => {
				if (item?.key === 'pricing::variant_price_range::final_range') {
					item.style = {
						...item.style,
						textAlign: 'start',
					};
				}
				return {
					...item,
					style: {
						...item.style,
						...theme?.product_details?.product_attributes,
					},
				};
			});
			const [row_1, row_2]: any = _.partition(row_data?.flat(), (item: any) => item?.key === 'sku_id');
			const updated_data = [row_1, row_2];
			return updated_data;
		}
	};

	const handleVariant = () => {
		setDrawerV(true);
	};
	const custom_variant_template = get_attributes_mapping(product_card_config, product);

	const handleDiscountProduct = () => {
		set_cart_drawer(true);
	};

	const handle_select = () => {
		if (variants_count > 1 && product?.type === PRODUCT_DETAILS_TYPE.product) {
			setDrawerV(true);
			return;
		}
		handle_select_variant(variant_id);
	};

	useEffect(() => {}, [cart]);
	const get_variant_details = () => {
		const variants_length = product?.variants_meta?.variant_data_map?.length;
		if (!data_values?.is_variant && variants_length > 1) {
			return (
				<Grid className={classes.variant_badge}>
					<Grid className={selected_variants > 0 ? classes.selected_variant_value : classes.variant_value}>
						{selected_variants > 0 ? `${selected_variants}/${variants_length}` : `+ ${product?.variants_meta?.variant_data_map?.length}`}
					</Grid>
				</Grid>
			);
		}
		return <></>;
	};
	const render_column_content = (column: any, index: number) => {
		switch (column?.key) {
			case 'name':
				return (
					<Grid className={classes.detail_container} key={column?.key}>
						<CustomText className={classes.product_name} style={column?.style}>
							{utils.get_column_display_value(column, product, price, data_values)}
						</CustomText>

						{index === 0 && get_variant_details()}
					</Grid>
				);
			case 'sku_id':
				const styles = { ...column?.style };
				return (
					<Grid sx={{ ...styles }} className={classes.text_overflow} key={column?.key}>
						{utils.get_column_display_value(column, product, price, data_values)}
					</Grid>
				);
			default:
				if (utils?.is_prelogin_price(is_logged_in)) {
					if (column?.type === 'price') {
						const key = data_values?.is_variant ? column?.variant_key : column?.product_key;
						const currency = _.get(product, 'pricing.currency', '$');
						return (
							<React.Fragment>
								<Grid className={classes.product_card_info} sx={column?.style} key={key}>
									{!is_retail_mode ? (
										<PriceView
											discount_campaigns={discount_campaigns}
											currency_symbol={currency}
											product={product}
											column={column}
											data_values={data_values}
											custom_text_types={{
												base_price_type: 'H6',
											}}
										/>
									) : (
										<Image src={ImageLinks.price_locked} width={150} height={26} />
									)}
								</Grid>
							</React.Fragment>
						);
					} else {
						return (
							<Grid sx={column?.style} key={column?.key}>
								{utils.get_column_display_value(column, product, price, data_values)}
							</Grid>
						);
					}
				} else {
					return <Image src={ImageLinks.unlock_price} width='100px' alt='banner_image' />;
				}
		}
	};
	const reserved = cart?.document_items?.[product.id]?.total_reserved ?? 0;
	const total_available = product?.inventory?.total_available ?? 0;
	const out_of_stock_threshold = product?.inventory?.out_of_stock_threshold ?? 0;
	const is_not_in_stock = reserved + total_available <= out_of_stock_threshold;
	const max_quantity = get_max_quantity(product, reserved);
	const disable_counter =
		product?.inventory?.inventory_status === INVENTORY_STATUS.out_of_stock &&
		is_not_in_stock &&
		product?.variants_meta?.variant_data_map?.length <= 1;

	const handle_get_product_info = () => {
		return (
			<React.Fragment>
				{handle_transform_card(get_product_rows || cards_template?.rows)?.map((row: any, index: number) => (
					<Grid
						display='flex'
						flexDirection='column'
						key={`row_${index}`}
						className={classes.product_detail}
						container
						onClick={catalog_mode ? handle_product_card_click : handle_navigate_to_pdp}>
						<Grid className={classes.card_custom_style} display='flex' justifyContent='space-between' sx={{ maxWidth: '100%' }}>
							{row?.map((column: any, row_index: number) => render_column_content(column, row_index))}
						</Grid>
					</Grid>
				))}
			</React.Fragment>
		);
	};

	const handle_customization = (event: React.MouseEvent<HTMLButtonElement>) => {
		event?.stopPropagation();
		set_show_customization_drawer(true);
	};

	const handle_navigate_to_pdp = () => {
		navigate(`${RouteNames.product.product_detail.routing_path}${product?.id}`);
	};

	const product_metadata = get_product_metadata(product);

	const customer_metadata = get_customer_metadata();
	const handle_product_card_click = () => {
		if (catalog_mode) {
			handle_select();
			return;
		}

		navigate(`${RouteNames.product.product_detail.routing_path}${product?.id}`);
		window.scrollTo(0, 0);
		Mixpanel.track(Events.PRODUCT_CARD_CLICKED, {
			tab_name: 'Products',
			page_name,
			section_name,
			customer_metadata,
			product_metadata,
		});
	};

	useLayoutEffect(() => {
		set_selected(CatalogFactory.PRODUCT.check_product(variant_id));
	}, [catalog_products_length, catalog_mode]);
	return (
		<Grid
			container
			className={classes.product_container}
			sx={{
				...theme?.productCard,
			}}>
			<Box onClick={handle_select} className={catalog_mode ? classes.review_checkbox : classes.wishlist_icon}>
				{catalog_mode ? (
					selected ? (
						<Image width={'16px'} height={'16px'} imgClass={classes.review_icon_style} src={ImageLinks.checkbox_checked} alt='Checked' />
					) : (
						<Image
							width={'16px'}
							height={'16px'}
							imgClass={classes.review_icon_style}
							src={ImageLinks.checkbox_unchecked}
							alt='Unchecked'
						/>
					)
				) : (
					enable_wishlist && !product?.is_customizable && <WishlistSelectionModal buyer_wishlist_data={wishlist_data} product={product} />
				)}
			</Box>
			<Grid className={classes.image_container} container onClick={handle_product_card_click}>
				<Image src={get_product_image(product, 'PRODUCT_CARD')} imgClass={classes.product_image} />
				{utils.is_prelogin_inventory(is_logged_in) && <InventoryStatus data={product} variantType='chip' />}
			</Grid>

			<Grid container>
				{!is_ultron && (
					<React.Fragment>
						{handle_get_product_info()}
						{custom_variant_template?.map((row: any, _index: number) => (
							<div className={classes.hinge_product_detail} key={`attribute_row_${_index}`}>
								<div
									className={_index === 0 ? classes.product_attribute_detail : classes.product_attribute_detail_nth}
									ref={(el) => assignRef(el, product?.id)}>
									{row?.attributes?.keys?.map((key: any) => {
										const columnValue = utils.get_column_display_value(key, product, price, data_values);

										if (columnValue) {
											return (
												<Tooltip title={columnValue} placement='top' onClose={() => {}} onOpen={() => {}}>
													<div
														className={classes.hinge_attr_value}
														onClick={catalog_mode ? handle_product_card_click : handle_navigate_to_pdp}
														key={key}>
														<CustomText className={classes.hinge_custom_text} type='Caption' color={secondary[700]}>
															{columnValue}
														</CustomText>
													</div>
												</Tooltip>
											);
										}

										return null;
									})}
								</div>
							</div>
						))}
					</React.Fragment>
				)}

				{is_ultron && (
					<Grid container>
						{handle_get_product_info()}
						{custom_variant_template?.map((row: any, _index: number) => (
							<div className={classes.hinge_product_detail} key={`attribute_row_${_index}`}>
								<div className={classes.product_attribute_detail} ref={(el) => assignRef(el, product?.id)}>
									{row?.attributes?.keys?.map((key: any, index: number) => {
										const columnValue = utils.get_column_display_value(key, product, price, data_values);

										if (columnValue) {
											return (
												<Tooltip title={columnValue} placement='top' onClose={() => {}} onOpen={() => {}}>
													<div
														style={{ display: 'inline-flex', cursor: 'pointer' }}
														onClick={() => navigate(`${RouteNames.product.product_detail.routing_path}${product?.id}`)}
														key={key}>
														{index > 0 && <Icon iconName='IconPointFilled' className={classes.list_circle} />}
														<p>{columnValue}</p>
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

						{utils?.is_prelogin_add_to_cart_button(is_logged_in) && (
							<Grid container justifyContent='center' alignItems='center' className={classes.add_to_button}>
								{!is_buyer_dashboard && catalog_mode ? (
									<Grid container gap={0.5}>
										<ViewSelectButtons product={product} on_view={handle_navigate_to_pdp} on_select={handle_select} selected={selected} />
									</Grid>
								) : !from_redux ? (
									<CounterWithoutRedux
										disabled={disable_counter}
										step={product?.pricing?.step_increment || types.STEP_INCREMENT}
										initialCount={0}
										cart_item_key={filtered_keys}
										min={product?.pricing?.min_order_quantity || types.MIN_ORDER_QUANTITY}
										max={max_quantity}
										product_id={data_values?.product_id}
										product={product}
										parent_id={data_values?.parent_id}
										from_max={from_max_quantity(max_quantity, max)}
										buyer={buyer}
										cart={cart_data}
										set_cart={set_cart}
										is_customization_required={is_customization_required}
										handle_customization={handle_customization}
									/>
								) : data_values?.is_variant || product?.variants_meta?.variant_data_map?.length === 1 ? (
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
										) : (
											<Grid
												id={`counter_${product?.id}`}
												container
												whiteSpace='nowrap'
												display='flex'
												justifyContent='space-between'
												alignItems='center'
												wrap='nowrap'>
												<Icon
													color='primary'
													iconName='IconMinus'
													fontSize='small'
													onClick={handleDiscountProduct}
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
														flex: '1',
													}}>
													<input
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
													sx={{
														...theme?.product?.recommanded?.add_icon,
													}}
													className={classes.add_icon}
													onClick={handleDiscountProduct}
												/>
											</Grid>
										)}
									</>
								) : (
									<>
										{selected_variants > 0 ? (
											<Grid
												container
												id={`counter_${product?.id}`}
												whiteSpace='nowrap'
												display='flex'
												justifyContent='space-between'
												alignItems='center'
												wrap='nowrap'>
												<Icon
													color='primary'
													iconName='IconMinus'
													fontSize='small'
													onClick={handleVariant}
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
														readOnly={true}
														className={classes.show_count}
														style={{
															...theme?.product?.recommanded?.show_count,
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
													color: disable_counter ? theme?.product?.recommanded?.add_to_cart?.disabled_color : '',
													background: disable_counter ? theme?.product?.recommanded?.add_to_cart?.disabled_background : '',
													'&:hover': {
														background: disable_counter ? theme?.product?.recommanded?.add_to_cart?.disabled_background : '',
														color: disable_counter ? theme?.product?.recommanded?.add_to_cart?.disabled_color : '',
													},
												}}>
												<Grid>
													{t('ProductList.Main.AddToCart')}
													{is_customization_required && <CustomizeText />}
												</Grid>
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
									className='lock_price_button'
									startIcon={<Icon iconName='IconLock' />}
									onClick={() => navigate(utils?.handle_active_free_trial_navigate())}>
									{utils?.check_prelogin_price(is_small_screen)}
								</Button>
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
						{show_customization_drawer && (
							<CommonCustomizationComponent
								customize_id={customize_id}
								product_details={product}
								grouping_identifier={grouping_identifier}
								get_and_initialize_cart={get_and_initialize_cart}
								show_customization_drawer={show_customization_drawer}
								set_show_customization_drawer={set_show_customization_drawer}
							/>
						)}
					</Grid>
				)}
			</Grid>
		</Grid>
	);
};

export default RailProductCard;
