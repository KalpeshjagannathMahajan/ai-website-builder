/* eslint-disable react-hooks/rules-of-hooks */
import { Divider, Tooltip, useMediaQuery } from '@mui/material';
import { Counter, Grid, Image, Icon, Button } from '../../atoms';
import types from 'src/utils/types';
import { from_max_quantity, get_max_quantity, get_product_detail } from 'src/screens/ProductListing/utils';
import CounterWithoutRedux, { CartWithoutRedux } from '../../atoms/Counter/CounterWithoutRedux';
import { Buyer } from 'src/screens/BuyerDashboard/components/BuyerInterface';
import get_product_image from 'src/utils/ImageConstants';
import { useNavigate } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import InventoryStatus from '../Inventory/InventoryStatus';
import { INVENTORY_STATUS } from '../Inventory/constants';
import { useSelector } from 'react-redux';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import CartDrawer from '../CartItemDrawer/CartDrawer';
import utils, { get_customer_metadata, get_product_id, get_product_metadata } from 'src/utils/utils';
import _, { isEmpty, split } from 'lodash';
import CustomText from '../../CustomText';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { colors } from 'src/utils/theme';
import ImageLinks from 'src/assets/images/ImageLinks';
import { Mixpanel } from 'src/mixpanel';
import Events from 'src/utils/events_constants';
import useIsCustomization from 'src/hooks/useIsCustomization';
import { t } from 'i18next';
import constants from 'src/utils/constants';
import CatalogFactory from 'src/utils/catalog.utils';
import { useCatalogSelection } from 'src/hooks/useCatalogSelection';
import useTenantSettings from 'src/hooks/useTenantSettings';
import { get_formatted_price_with_currency } from 'src/utils/common';
import WishlistSelectionModal from 'src/screens/Wishlist/Modals/WishlistSelectionModal';
import { secondary } from 'src/utils/light.theme';
import { valid_discount_for_product } from 'src/utils/DiscountEngineRule';

interface VariantCardProps {
	key: any;
	show_divider: boolean;
	product: any;
	parent_id: string;
	attribute_template?: any;
	cart_data?: CartWithoutRedux;
	set_cart?: any;
	from_redux?: boolean;
	buyer_data?: Buyer;
	// row_template?: any;
	set_show_customise?: any;
	set_customise_id?: any;
	type?: 'ACTION' | 'REVIEW';
	close_drawer?: () => void;
	divider_style?: any;
	wishlist_data?: any;
	discount_campaigns?: any;
}

const useStyle = makeStyles(() => ({
	icon: {
		margin: '0px 2px',
		height: '10px',
		width: '10px',
	},
	detail: {
		cursor: 'pointer',
		display: 'flex',
		gap: '4px',
		flexDirection: 'row',
		maxWidth: '300px',
		minWidth: '300px',
		'@media (max-width: 600px)': {
			gap: '5px',
			maxWidth: '80px',
			minWidth: '140px',
		},
	},
	card: {
		margin: '4px 6px',
		width: 'calc(100% - 15px)',
	},
	container: {
		width: '100%',
		'@media (max-width: 600px)': {
			display: 'flex',
			flexDirection: 'column',
			gap: '8px',
		},
	},
	inventory: {
		margin: '4px',
		maxHeight: '40px',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		'@media (max-width: 600px)': {
			fontSize: '12px !important',
		},
	},
	price_inventory: {
		margin: '4px',
		maxHeight: '40px',
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
	},
	divider: {
		width: '100%',
		margin: '8px 0px',
	},
	remove_icon: {
		border: 'none',
		width: '20px',
		height: '20px',
		padding: '7px',
		borderRadius: '50px',
		cursor: 'pointer',
		marginRight: '6px',
	},
	attr_container: {
		display: 'flex',
		flexDirection: 'row',
	},
	add_icon: {
		border: 'none',
		width: '2rem',
		height: '2rem',
		padding: '.7rem',
		borderRadius: '5rem',
		cursor: 'pointer',
		marginLeft: '.6rem',
	},
	show_count: {
		outline: 'none',
		fontSize: '16px',
		fontWeight: 700,
		height: '34px',
		borderRadius: '10px',
		width: '100%',
		cursor: 'pointer',

		textAlign: 'center',
	},
	attr_section: {
		width: '95%',
		display: 'flex',
		flexDirection: 'row',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		alignItems: 'center',
		height: 'fit-content',
	},
	attr_value: {
		maxWidth: '13.5rem',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	ellipsis: {
		marginTop: '-.4rem',
		marginLeft: '.3rem',
	},
	attribute: {
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
		backgroundColor: colors.grey_600,
		marginRight: '0.4rem',
		marginTop: '0.4rem',
		borderRadius: '0.4rem',
		padding: '0.5rem 0.6rem',
		overflow: 'auto',
	},
	body: {
		paddingLeft: '8px',
		// maxWidth: '65%',
		width: '100%',
		'@media (max-width: 600px)': {
			paddingLeft: '0px',
			maxWidth: '100%',
		},
		'@media (max-width: 370px)': {
			paddingLeft: '0px',
			maxWidth: '65%',
		},
	},
	stock_container: {
		display: 'flex',
		gap: '0.5rem',
		flexDirection: 'column',
		height: 'fit-content',
		'@media (max-width: 600px)': {
			display: 'none',
		},
	},
	name_container: {
		marginTop: '2px',
	},
	name: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		maxWidth: '97%',
		cursor: 'pointer',
		'@media (max-width: 600px)': {
			fontSize: '12px !important',
		},
	},

	inventory_status: {
		height: '3rem',
		flex: 'none',
		width: 'fit-content',
		gap: '5px',
	},

	image_container: {
		width: '75px',
		height: '75px',
		padding: '0 10px 0 0',
		'@media (max-width: 600px)': {
			width: '64px',
		},
	},
}));

const VariantDetailCard = ({
	key,
	show_divider,
	product,
	parent_id,
	attribute_template,
	cart_data,
	set_cart,
	from_redux = true,
	buyer_data,
	set_show_customise,
	set_customise_id,
	type = constants.VARIANT_DETAILS_CARD_TYPE.ACTION,
	close_drawer = () => {},
	divider_style = {},
	wishlist_data,
	discount_campaigns,
}: // row_template,
VariantCardProps) => {
	const login = useSelector((state: any) => state.login);
	const is_logged_in = login?.status?.loggedIn;
	const is_retail_mode = localStorage.getItem('retail_mode') === 'true';
	const navigate = useNavigate();
	const styles = useStyle();
	const { enable_wishlist } = useTenantSettings({
		[constants.TENANT_SETTINGS_KEYS.WISHLIST_ENABLED]: false,
	});
	const buyer_info = useSelector((state: any) => state?.buyer);
	const master_discount_rule = useSelector((state: any) => state?.json_rules?.master_discount_rule);
	const discount_applied = valid_discount_for_product(
		master_discount_rule,
		discount_campaigns,
		product,
		buyer_data ? buyer_data : buyer_info,
	);
	const { catalog_products_length, catalog_mode } = useSelector((state: any) => state?.catalog_mode);
	const { all_cards_config = {} } = useSelector((state: any) => state?.settings);
	const cart = useSelector((state: any) => state?.cart);
	const [price, set_price] = useState(product?.pricing?.price);
	const variant_template = _.cloneDeep(attribute_template);
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));

	const get_product_rows = _.get(all_cards_config, 'recommended.rows');
	const filtered_keys: any = utils.get_non_discount_keys(product, from_redux ? cart?.products : cart_data?.products, discount_applied);
	const data_values = get_product_detail(product);
	const [cart_drawer, set_cart_drawer] = useState(false);
	const { is_customization_required, customize_id } = useIsCustomization(product);

	const handleDiscountProduct = () => {
		set_cart_drawer(true);
	};
	// const product_dimension = product?.transformed_attributes?.filter((item: any) => item?.label === 'dimensions')[0]?.value;
	const reserved_quantity = cart?.document_items?.[product.id]?.total_reserved ?? 0;
	const total_available = product?.inventory?.total_available ?? 0;
	const out_of_stock_threshold = product?.inventory?.out_of_stock_threshold ?? 0;
	const is_not_in_stock = reserved_quantity + total_available <= out_of_stock_threshold;
	const max_quantity = get_max_quantity(product, reserved_quantity);
	const discounted_products = utils.get_discount_detail(cart?.products?.[product?.id], discount_applied);
	const is_review_active = type === constants.VARIANT_DETAILS_CARD_TYPE.REVIEW;
	const variant_id = get_product_id(product);

	const product_metadata = get_product_metadata(product);
	const { selected, set_selected, handle_select_variant } = useCatalogSelection();

	const customer_metadata = get_customer_metadata({ is_loggedin: true });
	const disable_counter = product?.inventory?.inventory_status === INVENTORY_STATUS.out_of_stock && is_not_in_stock;

	const check_is_pdp_page = () => location.pathname.includes(RouteNames.product.product_detail.routing_path);

	const handle_navigate = () => {
		navigate(`${RouteNames?.product.product_detail.routing_path}${product?.id}`, {
			replace: check_is_pdp_page(),
		});
		close_drawer();
		window.scrollTo(0, 0);
		Mixpanel.track(Events.PRODUCT_CARD_CLICKED, {
			tab_name: 'Products',
			page_name: '',
			section_name: 'variants_listing_side_&_bottom_sheet',
			customer_metadata,
			product_metadata,
		});
	};
	const variant_refs: any = useRef({})?.current;
	const [show_ellipsis, set_show_ellipsis] = useState(false);
	const assignRef = (node: any, product_id: any) => {
		if (node) {
			variant_refs[product_id] = node;
		}
	};
	const check_overflow = (product_id: string) => {
		const ref = variant_refs[product_id];
		if (ref) {
			const is_overflowing = ref?.offsetWidth > 537;
			set_show_ellipsis(is_overflowing);
		}
	};

	const get_column_display_value = (column: any) => {
		const base_price = _.get(product, 'pricing.base_price');
		const currency = _.get(product, 'pricing.currency', '$');
		const base_price_condition =
			_.includes(split(column?.key, '::'), 'price') && !_.isEmpty(String(base_price)) && !_.isNaN(String(base_price)) && base_price > price;
		const view_value = utils.transform_column_display(column, product, price);
		const discounted_value = isEmpty(discount_applied) ? view_value : discount_applied?.discounted_value;

		const price_to_show = isEmpty(discount_applied)
			? view_value
			: discounted_value >= 0
			? get_formatted_price_with_currency(currency, discounted_value)
			: get_formatted_price_with_currency(currency, 0);
		return (
			<Grid container gap={1} alignItems={'flex-end'}>
				<div
					style={{
						whiteSpace: 'nowrap',
						textOverflow: 'ellipsis',
						overflow: 'hidden',
						maxWidth: '150px',
						display: 'inline-block',
					}}>
					{price_to_show}
				</div>

				{(base_price_condition || !isEmpty(discount_applied)) && (
					<CustomText
						type='Caption'
						style={{
							textDecoration: 'line-through',
							color: colors.secondary_text,
						}}>
						{get_formatted_price_with_currency(currency, !isEmpty(discount_applied) ? price : base_price)}
					</CustomText>
				)}
				{!isEmpty(discount_applied) && (
					<CustomText
						type='CaptionBold'
						style={{
							...theme?.product?.discount_campaign,
						}}>
						{discount_applied?.configuration?.type === 'percentage'
							? `${discount_applied?.configuration?.value}% off`
							: ` ${get_formatted_price_with_currency(
									currency,
									discount_applied?.configuration?.value > price ? price : discount_applied?.configuration?.value,
							  )} off`}
					</CustomText>
				)}
			</Grid>
		);
	};

	const handle_customization = () => {
		set_show_customise(true);
		set_customise_id(customize_id);
	};

	const handle_select = () => {
		handle_select_variant(variant_id);
	};

	// const get_formatted_price = () => {
	// 	const formattedPrice = Number.isInteger(price) ? `${price}` : `${_.isNumber(price) ? `${price.toFixed(2)}` : ''}`;
	// 	return `${product?.pricing?.currency} ${formatNumberWithCommas(formattedPrice, true)}`;
	// };
	const MOQ = product?.pricing?.min_order_quantity && product?.pricing?.min_order_quantity > 0;
	useLayoutEffect(() => {
		set_selected(CatalogFactory.PRODUCT.check_product(variant_id));
	}, [catalog_products_length, catalog_mode]);

	useEffect(() => {
		check_overflow(product?.id);
	}, [product?.id, key]);

	return (
		<Grid key={product?.id} className={styles.card}>
			<Grid className={styles.container}>
				<Grid container direction='row' justifyContent={'space-between'} flexWrap={'nowrap'}>
					<Grid xs={4.3} item className={styles.detail} onClick={() => handle_navigate()}>
						<Image src={get_product_image(product, 'VARIANT_DRAWER')} imgClass={styles.image_container} style={{ borderRadius: '8px' }} />
						{!is_small_screen && get_product_rows ? (
							<Grid className={styles.body}>
								{_.map(get_product_rows, (row: any) => (
									<React.Fragment key={row?.key}>
										{row?.map((column: any) => {
											if (column?.type === 'price') {
												const col_key = data_values?.is_variant ? column?.variant_key : column?.product_key;
												if (utils.is_prelogin_price(is_logged_in)) {
													return (
														<Grid key={col_key} sx={column.style} className={styles.price_inventory}>
															{!is_retail_mode && get_column_display_value({ key: col_key })}
														</Grid>
													);
												} else {
													return <Image src={ImageLinks.unlock_price} width='100px' alt='banner_image' />;
												}
											} else {
												return (
													<Tooltip
														placement='top'
														arrow
														title={
															<CustomText type='Body' color={theme?.product?.variant_detail_card?.tool_tip?.color}>
																{/* {get_column_display_value(column)} */}
																{utils.transform_column_display(column, product, price)}
															</CustomText>
														}>
														<div key={column?.key} style={column.style} className={styles.inventory}>
															{/* {get_column_display_value(column)} */}
															{utils.transform_column_display(column, product, price)}
														</div>
													</Tooltip>
												);
											}
										})}
									</React.Fragment>
								))}
							</Grid>
						) : (
							<Grid className={styles.body}>
								<Grid className={styles.price_inventory} sx={{ fontSize: '14px', color: theme?.product?.custom_color_style?.color }}>
									{get_column_display_value({ key: 'sku_id' })}
								</Grid>
								{utils.is_prelogin_inventory(is_logged_in) && (
									<InventoryStatus data={product} style={styles.inventory_status} showBg={false} show_icon={false} />
								)}
								{utils.is_prelogin_price(is_logged_in) ? (
									<Grid
										className={styles.price_inventory}
										sx={{ fontSize: '14px', color: theme?.product?.custom_color_style?.color, fontWeight: '700' }}>
										{!is_retail_mode && get_column_display_value({ key: 'pricing::price' })}
									</Grid>
								) : (
									<Image src={ImageLinks.unlock_price} width='100px' alt='banner_image' />
								)}
							</Grid>
						)}
					</Grid>
					{!is_small_screen && utils.is_prelogin_inventory(is_logged_in) && (
						<Grid item xs={3} className={styles.stock_container}>
							<InventoryStatus data={product} style={styles.inventory_status} showBg={true} />
							{product?.inventory?.inventory_status !== 'OUT_OF_STOCK' && MOQ && (
								<CustomText type='Body'>{t('Common.MOQ', { count: product?.pricing?.min_order_quantity })}</CustomText>
							)}
						</Grid>
					)}

					{utils.is_prelogin_add_to_cart_button(is_logged_in) && (
						<Grid
							sx={{ display: 'flex', width: is_small_screen ? '16rem !important' : '20rem !important', gap: '5px', justifyContent: 'end' }}>
							{!catalog_mode && enable_wishlist && !product?.is_customizable && (
								<Grid>
									<WishlistSelectionModal from_drawer={true} buyer_wishlist_data={wishlist_data} icon_size={'LARGE'} product={product} />
								</Grid>
							)}
							{is_review_active && (
								<Button
									variant='contained'
									id={`add_to_cart_${product?.id}`}
									sx={{
										height: '40px',
										boxShadow: 'none',
									}}
									onClick={handle_select}
									fullWidth
									tonal={selected}>
									<Grid>
										{selected ? (
											<Grid container alignItems={'center'} gap={1}>
												<Icon iconName='check' color={colors.primary_500} />
												Selected
											</Grid>
										) : (
											'Select'
										)}
									</Grid>
								</Button>
							)}
							{!is_review_active &&
								(from_redux ? (
									<>
										{!discounted_products?.is_discount_applied ? (
											<Grid sx={{ width: 'calc(100% - 45px)' }}>
												<Counter
													sx={{ boxShadow: 'none' }}
													disabled={disable_counter}
													step={product?.pricing?.step_increment || types.STEP_INCREMENT}
													initialCount={0}
													min={product?.pricing?.min_order_quantity || types.MIN_ORDER_QUANTITY}
													max={max_quantity}
													cart_item_key={filtered_keys}
													product_id={product?.id}
													parent_id={parent_id}
													product={product}
													default_order_quantity={product?.pricing?.default_order_quantity}
													volume_tiers={product?.pricing?.volume_tiers}
													set_price={set_price}
													from_max={from_max_quantity(max_quantity, product?.pricing?.max_order_quantity ?? types.DEFAULT_ORDER_QUANTITY)}
													page_name=''
													section_name='variants_listing_side_&_bottom_sheet'
													is_customization_required={is_customization_required}
													handle_customization={handle_customization}
												/>
											</Grid>
										) : (
											<Grid container display='flex' whiteSpace='nowrap' alignItems='center' wrap='nowrap'>
												<Icon
													color='primary'
													iconName='IconMinus'
													fontSize='small'
													onClick={handleDiscountProduct}
													className={styles.remove_icon}
													sx={{
														...theme?.product?.recommanded?.remove_icon,
													}}
												/>
												<Grid item flex={1} alignItems='center' xl={8} lg={8} md={8} sm={8} xs={8}>
													<input
														readOnly={true}
														className={styles.show_count}
														style={{
															...theme?.product?.recommanded?.show_count,
														}}
														type='number'
														value={utils.get_cart_items(product?.id, cart) as any}
														onClick={handleDiscountProduct}
													/>
												</Grid>
												<Icon
													color={'primary'}
													iconName='IconPlus'
													fontSize='small'
													className={styles.add_icon}
													sx={{
														...theme?.product?.recommanded?.add_icon,
													}}
													onClick={handleDiscountProduct}
												/>
											</Grid>
										)}
									</>
								) : (
									<>
										{!discounted_products?.is_discount_applied ? (
											<CounterWithoutRedux
												sx={{ boxShadow: 'none' }}
												disabled={disable_counter}
												step={product?.pricing?.step_increment || types.STEP_INCREMENT}
												initialCount={0}
												min={product?.pricing?.min_order_quantity || types.MIN_ORDER_QUANTITY}
												max={max_quantity}
												product_id={product?.id}
												parent_id={parent_id}
												cart_item_key={filtered_keys}
												product={product}
												from_max={from_max_quantity(max_quantity, product?.pricing?.max_order_quantity ?? types.DEFAULT_ORDER_QUANTITY)}
												buyer={buyer_data}
												cart={cart_data}
												set_cart={set_cart}
												is_customization_required={is_customization_required}
												handle_customization={handle_customization}
											/>
										) : (
											<Grid container whiteSpace='nowrap' display='flex' alignItems='center' wrap='nowrap'>
												<Icon
													color='primary'
													iconName='IconMinus'
													fontSize='small'
													onClick={handleDiscountProduct}
													sx={{
														...theme?.product?.recommanded?.remove_icon,
													}}
													className={styles.remove_icon}
												/>
												<Grid item flex={1} alignItems='center' xl={8} lg={8} md={8} sm={8} xs={8}>
													<input
														readOnly={true}
														className={styles.show_count}
														style={{
															...theme?.product?.recommanded?.show_count,
														}}
														type='number'
														value={utils.get_cart_items(product?.id, cart) as any}
														onClick={handleDiscountProduct}
													/>
												</Grid>
												<Icon
													color={'primary'}
													iconName='IconPlus'
													fontSize='small'
													className={styles.add_icon}
													sx={{
														...theme?.product?.recommanded?.add_icon,
													}}
													onClick={handleDiscountProduct}
												/>
											</Grid>
										)}
									</>
								))}
						</Grid>
					)}
					{!utils?.is_prelogin_price(is_logged_in) && (
						<Grid
							item
							direction='row'
							sx={{
								whiteSpace: 'nowrap',
								width: { xs: 130, sm: 190 },
							}}>
							<Button
								width='100%'
								className='lock_price_button'
								startIcon={<Icon iconName='IconLock' />}
								onClick={() => navigate(utils?.handle_active_free_trial_navigate())}>
								{utils?.check_prelogin_price(is_small_screen)}
							</Button>
						</Grid>
					)}
				</Grid>
				{product?.name && (
					<Grid width='80%' className={styles.name_container}>
						<Tooltip
							placement='bottom'
							title={
								<CustomText type='Body' color={theme?.product?.variant_detail_card?.tool_tip?.color}>
									{product?.name}
								</CustomText>
							}>
							<div>
								<CustomText type='Title' className={styles.name}>
									{product?.name}
								</CustomText>
							</div>
						</Tooltip>
					</Grid>
				)}
				{_.map(variant_template, (row: any, _index: number) => (
					<React.Fragment key={`attribute_row_${_index}`}>
						<div className={styles.attr_section}>
							<div className={styles.attr_container} ref={(el) => assignRef(el, product?.id)}>
								{row?.attributes?.keys?.map((attr_key: any) => {
									const value = utils.transform_column_display(attr_key, product);
									if (value) {
										return (
											<div key={attr_key} className={styles.attribute}>
												<CustomText type='Caption' color={secondary[700]} className={styles.attr_value}>
													{value}
												</CustomText>
											</div>
										);
									}
									return (
										<div key={attr_key} className={styles.attribute}>
											<CustomText type='Caption' color={theme?.product?.variant_detail_card?.color} className={styles.attr_value}>
												{value}
											</CustomText>
										</div>
									);
								})}
							</div>
						</div>
						{show_ellipsis && (
							<div>
								<p className={styles.ellipsis}>{'...'}</p>
							</div>
						)}
					</React.Fragment>
				))}
			</Grid>
			{show_divider && <Divider className={styles.divider} sx={divider_style} />}
			{cart_drawer && (
				<CartDrawer
					show={cart_drawer}
					set_show={set_cart_drawer}
					data={product}
					cart_product_id={product?.id}
					attribute_template={attribute_template}
				/>
			)}
		</Grid>
	);
};

export default VariantDetailCard;
