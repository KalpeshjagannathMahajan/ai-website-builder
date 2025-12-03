import { Card } from '@mui/material';
import React, { MutableRefObject, useLayoutEffect, useRef, useState } from 'react';
import { Button, Counter, Grid, Icon, Image, Typography, Tooltip, Box, Chip } from 'src/common/@the-source/atoms';
import VariantDrawer from '../VariantDrawer/VariantDrawer';
import { Product } from 'src/screens/ProductListing/mock/ProductInterface';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import { t } from 'i18next';
import types from 'src/utils/types';
import { from_max_quantity, get_max_quantity, get_product_detail } from 'src/screens/ProductListing/utils';
import _ from 'lodash';
import CounterWithoutRedux, { CartWithoutRedux } from '../../atoms/Counter/CounterWithoutRedux';
import { Buyer } from 'src/screens/BuyerDashboard/components/BuyerInterface';
import get_product_image from 'src/utils/ImageConstants';
import InventoryStatus from '../Inventory/InventoryStatus';
import { INVENTORY_STATUS } from '../Inventory/constants';
import utils, { get_attributes_mapping, get_customer_metadata, get_product_id, get_product_metadata } from 'src/utils/utils';
import CartDrawer from '../CartItemDrawer/CartDrawer';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { colors } from 'src/utils/theme';
import CustomText from '../../CustomText';
import { background_colors, secondary } from 'src/utils/light.theme';
import useIsCustomization from 'src/hooks/useIsCustomization';
import CommonCustomizationComponent from 'src/common/CommonCustomizationComp';
import CustomizeText from 'src/common/CommonCustomizationComp/CustomizeText';
import { useMediaQuery } from '@mui/material';
const { VITE_APP_REPO } = import.meta.env;
const is_store_front = VITE_APP_REPO === 'store_front';
import { Mixpanel } from 'src/mixpanel';
import { ISelectedFilters } from '../FiltersAndChips/interfaces';
import Events from 'src/utils/events_constants';
import { PRODUCT_DETAILS_TYPE } from 'src/screens/ProductDetailsPage/constants';
import CatalogFactory from 'src/utils/catalog.utils';
import { useCatalogSelection } from 'src/hooks/useCatalogSelection';

import CustomCheckbox from '../../atoms/Checkbox/CustomCheckbox';
import useTenantSettings from 'src/hooks/useTenantSettings';
import constants from 'src/utils/constants';
import ImageLinks from 'src/assets/images/ImageLinks';
import WishlistSelectionModal from 'src/screens/Wishlist/Modals/WishlistSelectionModal';
// import ViewSelectButtons from 'src/screens/ProductListing/components/ViewSelectButtons';
import { valid_discount_for_product } from 'src/utils/DiscountEngineRule';
import PriceView from '../../PriceView';

interface similarCardProps {
	simillar: Product;
	rec_card_template: any;
	cart_data?: CartWithoutRedux;
	set_cart?: any;
	from_redux?: boolean;
	buyer_data?: Buyer;
	page_name?: any;
	section_name?: any;
	wishlist_data?: any;
	cart_item?: any;
	cart_error?: any;
	discount_campaigns?: any;
}

const useStyles = makeStyles((theme: any) => ({
	remove_icon: {
		border: 'none',
		width: '20px',
		height: '20px',
		padding: '7px',
		borderRadius: '50px',
		cursor: 'pointer',
		marginRight: '6px',
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
	hinge_product_detail: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'nowrap',
		marginTop: '0rem',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
	},
	hinge_product_detail_nth: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'nowrap',
		margin: '0.2rem 0 0 0',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
	},
	hinge_attr_value: {
		display: 'inline-flex',
		cursor: 'pointer',
		backgroundColor: `${colors.grey_600}`,
		padding: '0.5rem 0.6rem',
		marginRight: '0.4rem',
		borderRadius: '0.4rem',
		overflow: 'auto',
	},
	attr_value: {
		maxWidth: '13.5rem',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	image_style: {
		height: '140px',
	},
	review_checkbox: {
		position: 'absolute',
		left: '6px',
		top: '0px',
		zIndex: 1,
		cursor: 'pointer',
	},
	wishlist_icon: {
		position: 'absolute',
		right: '6px',
		top: '0px',
		zIndex: 1,
		cursor: 'pointer',
	},
	cart_quantity: {
		position: 'absolute',
		left: '6px',
		bottom: '0px',
		zIndex: 1,
		cursor: 'pointer',
	},
	review_icon_style: {
		backgroundColor: `${colors.white}`,
		borderRadius: '2.1px',
	},
	product_container: {
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
		gap: '8px',
	},
	chip_style: {
		borderRadius: '38px',
		background: background_colors?.primary,
		padding: '4px',
		boxShadow: `0px 4px 8px 0px ${theme?.product?.similar_drawer?.chip_color}`,
	},
}));

const SimillarCard = ({
	simillar,
	rec_card_template = {},
	cart_data,
	set_cart,
	from_redux = true,
	buyer_data,
	page_name,
	section_name,
	wishlist_data,
	cart_item,
	cart_error,
	discount_campaigns,
}: similarCardProps) => {
	const { catalog_mode, catalog_products_length } = useSelector((state: any) => state?.catalog_mode);
	const cart = useSelector((state: any) => state?.cart);
	const login = useSelector((state: any) => state.login);
	const is_logged_in = login?.status?.loggedIn;
	const { product_card_config = [], all_cards_config = {} } = useSelector((state: any) => state?.settings);
	const [cart_drawer, set_cart_drawer] = useState(false);
	const [drawer, setDrawer] = useState(false);
	const buyer = useSelector((state: any) => state?.buyer);
	const [show_ellipsis, set_show_ellipsis] = useState(false);
	const [selected_filters, set_selected_filters] = useState<ISelectedFilters>({ filters: {}, range_filters: {} });
	const [price, set_price] = useState(simillar?.pricing?.price);
	const [show_customization_drawer, set_show_customization_drawer] = useState<boolean>(false);
	const data_values = get_product_detail(simillar);
	const simillar_card_ref = useRef() as MutableRefObject<HTMLDivElement>;
	const get_product_rows = _.get(all_cards_config, 'recommended.rows');
	const navigate = useNavigate();
	const classes = useStyles();
	const master_discount_rule = useSelector((state: any) => state?.json_rules?.master_discount_rule);
	const discount_applied = valid_discount_for_product(master_discount_rule, discount_campaigns, simillar, buyer_data ? buyer_data : buyer);
	const selected_variants = Object?.values(cart?.products)?.filter((_p: any) => data_values?.parent_id === _p?.parent_id)?.length;
	const discounted_products: any = utils.get_discount_detail(cart?.products[simillar?.id], discount_applied);
	const filtered_keys: any = utils.get_non_discount_keys(
		simillar,
		from_redux ? cart?.products : cart_data?.products,
		data_values?.product_id,
		discount_applied,
	);
	const is_retail_mode = localStorage.getItem('retail_mode') === 'true';

	const theme: any = useTheme();

	const handleDiscountProduct = () => {
		set_cart_drawer(true);
	};
	const variants_count = _.get(simillar, 'variants_meta.variant_data_map', []).filter((e: any) => e.is_active !== false)?.length;
	const variant_id = get_product_id(simillar);

	const checkOverflow = () => {
		if (simillar_card_ref?.current && !show_ellipsis) {
			const isOverflowing = simillar_card_ref?.current?.scrollWidth > simillar_card_ref?.current?.clientWidth;
			set_show_ellipsis(isOverflowing);
		}
	};
	const { handle_select_variant, selected, set_selected } = useCatalogSelection();

	const variant_data_map = simillar?.variants_meta?.variant_data_map || [];
	const reserved_quantity = cart?.document_items?.[simillar?.id]?.total_reserved ?? 0;
	const total_available = simillar?.inventory?.total_available ?? 0;
	const out_of_stock_threshold = simillar?.inventory?.out_of_stock_threshold ?? 0;
	const is_not_in_stock = reserved_quantity + total_available <= out_of_stock_threshold;

	const max_quantity = get_max_quantity(simillar, reserved_quantity);
	const disable_counter = (simillar?.inventory?.inventory_status === INVENTORY_STATUS.out_of_stock && is_not_in_stock) || cart_error;

	const { is_customization_required, customize_id, grouping_identifier, get_and_initialize_cart } = useIsCustomization(simillar);
	const is_small_screen = useMediaQuery('(max-width: 445px)');
	const { enable_wishlist } = useTenantSettings({
		[constants.TENANT_SETTINGS_KEYS.WISHLIST_ENABLED]: false,
	});

	const handleVariant = () => {
		setDrawer(true);
	};
	const product_metadata = get_product_metadata(simillar);
	const customer_metadata = get_customer_metadata({ is_loggedin: true });

	const custom_variant_template = get_attributes_mapping(product_card_config, simillar);

	useLayoutEffect(() => {
		checkOverflow();
		window.addEventListener('resize', checkOverflow);
		return () => window.removeEventListener('resize', checkOverflow);
	}, [custom_variant_template]);

	const handle_customization = (event: React.MouseEvent<HTMLButtonElement>) => {
		event?.stopPropagation();
		set_show_customization_drawer(true);
	};

	const handle_select = () => {
		if (variants_count > 1 && simillar?.type === PRODUCT_DETAILS_TYPE.product) {
			setDrawer(true);
			return;
		}
		handle_select_variant(variant_id);
	};

	const handle_navigate_to_pdp = (product_id: any) => {
		navigate(`${RouteNames.product.product_detail.routing_path}${product_id}`);
	};

	const handleClick = (product_id: any) => {
		if (catalog_mode) {
			handle_select();
			return;
		}
		navigate(`${RouteNames.product.product_detail.routing_path}${product_id}`);
		Mixpanel.track(Events.PRODUCT_CARD_CLICKED, {
			tab_name: 'Products',
			page_name,
			section_name,
			subtab_name: '',
			customer_metadata,
			product_metadata,
		});
	};

	useLayoutEffect(() => {
		set_selected(CatalogFactory.PRODUCT.check_product(variant_id));
	}, [catalog_products_length, catalog_mode]);

	const handle_discounted_product = () => {
		return (
			<Grid
				container
				style={{
					whiteSpace: 'nowrap',
					display: 'flex', // Use flex display
				}}
				alignItems='center'
				wrap='nowrap'>
				<Icon
					color='primary'
					sx={{
						...theme?.product?.recommanded?.remove_icon,
					}}
					iconName='IconMinus'
					fontSize='small'
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
						flex: '1', // Let this item grow as needed
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
					sx={{
						...theme?.product?.recommanded?.add_icon,
					}}
					color={'primary'}
					iconName='IconPlus'
					fontSize='small'
					className={classes.add_icon}
					onClick={handleDiscountProduct}
				/>
			</Grid>
		);
	};

	const handle_counter_from_redux = () => {
		if (discounted_products?.is_discount_applied) return handle_discounted_product();

		return (
			<Counter
				disabled={disable_counter}
				sx={{ boxShadow: 'none' }}
				step={simillar?.pricing?.step_increment || types.STEP_INCREMENT}
				initialCount={0}
				min={simillar?.pricing?.min_order_quantity || types.MIN_ORDER_QUANTITY}
				max={max_quantity}
				cart_item_key={filtered_keys}
				product_id={data_values?.product_id}
				containerStyle={{
					justifyContent: 'space-between',
				}}
				parent_id={data_values?.parent_id}
				product={simillar}
				default_order_quantity={simillar?.pricing?.default_order_quantity}
				volume_tiers={simillar?.pricing?.volume_tiers}
				set_price={set_price}
				from_max={from_max_quantity(max_quantity, simillar?.pricing?.max_order_quantity ?? types.DEFAULT_ORDER_QUANTITY)}
				is_customization_required={is_customization_required}
				handle_customization={handle_customization}
				page_name={page_name}
				section_name={section_name}
				discount_applied={discount_applied}
			/>
		);
	};

	const handle_counter_without_redux = () => {
		if (discounted_products?.is_discount_applied) return handle_discounted_product();

		return (
			<CounterWithoutRedux
				disabled={disable_counter}
				sx={{ boxShadow: 'none' }}
				step={simillar?.pricing?.step_increment || types.STEP_INCREMENT}
				initialCount={0}
				cart_item_key={filtered_keys}
				min={simillar?.pricing?.min_order_quantity || types.MIN_ORDER_QUANTITY}
				max={max_quantity}
				product_id={data_values?.product_id}
				containerStyle={{
					justifyContent: 'space-between',
				}}
				parent_id={data_values?.parent_id}
				product={simillar}
				from_max={from_max_quantity(max_quantity, simillar?.pricing?.max_order_quantity ?? types.DEFAULT_ORDER_QUANTITY)}
				buyer={buyer_data}
				cart={cart_data}
				set_cart={set_cart}
				is_customization_required={is_customization_required}
				handle_customization={handle_customization}
				discount_applied={discount_applied}
			/>
		);
	};

	return (
		<React.Fragment>
			<Card
				sx={{ ...theme?.product?.recommanded?.card }}
				style={{
					width: 'auto',
					margin: '5px 10px',
					height: 'fit-content',
					boxShadow: 'none',
					padding: '10px 5px',
					position: 'relative',
					...theme?.product?.recommanded?.card,
					...theme?.card_,
				}}>
				<Grid container direction='row' justifyContent='space-between'>
					<Grid sx={{ position: 'relative' }}>
						{catalog_mode ? (
							<Box onClick={handle_select} className={classes.review_checkbox}>
								<CustomCheckbox selected={selected} />
							</Box>
						) : (
							enable_wishlist &&
							!cart_item &&
							!simillar?.is_customizable && (
								<Box className={classes.wishlist_icon}>
									<WishlistSelectionModal from_drawer={true} buyer_wishlist_data={wishlist_data} product={simillar} />
								</Box>
							)
						)}
						{cart_item && (
							<Box className={classes.cart_quantity}>
								<Chip
									className={classes.chip_style}
									size={'small'}
									label={cart_item?.quantity > 1 ? `${cart_item?.quantity} units` : `${cart_item?.quantity} unit`}
								/>
							</Box>
						)}
						<Image
							imgClass={classes.image_style}
							src={get_product_image(simillar, 'SIMILAR_DRAWER_CARD')}
							height={'140px'}
							width={'140px'}
							style={{ borderRadius: '8px' }}
							onClick={() => handleClick(simillar?.id)}
						/>
						{utils.is_prelogin_inventory(is_logged_in) && (
							<InventoryStatus variantType='chip' data={simillar} color={theme?.product?.inventory_status?.out_of_stock_chip?.color} />
						)}
					</Grid>
					<Grid container justifyContent='space-between' direction='column' xs={6} md={7} lg={7} sx={{ cursor: 'pointer' }}>
						<Grid container gap={1} mb={1} xs={is_store_front ? 0 : 6} md={is_store_front ? 0 : 7} lg={is_store_front ? 0 : 7}>
							{_.map(get_product_rows || rec_card_template?.rows, (row: any) => (
								<React.Fragment>
									{row?.map((column: any, index: number) => {
										if (column?.type === 'price' || column?.key === 'pricing::price') {
											const price_value = _.get(simillar, 'pricing.price');
											const base_price: any = _.get(simillar, 'pricing.base_price');
											const base_price_condition =
												column?.type === 'price' && utils.base_price_conditions(column, data_values, price_value, base_price);
											if (utils.is_prelogin_price(is_logged_in)) {
												return (
													<Grid
														onClick={() => catalog_mode && handleClick(simillar?.id)}
														className={classes.product_container}
														sx={{ ...column.style }}>
														{!is_retail_mode && (
															<PriceView
																column={column}
																data_values={data_values}
																product={simillar}
																discount_campaigns={discount_campaigns}
																currency_symbol={simillar?.pricing?.currency}
																styles={{ fontWeight: 700, fontSize: '14px' }}
																custom_data={{ base_price_condition }}
																custom_text_types={{
																	base_price_type: 'Body',
																	discount_applied_type: 'Caption',
																	discount_value_type: 'Caption',
																}}
															/>
														)}
													</Grid>
												);
											} else {
												return <Image src={ImageLinks.unlock_price} width='100px' alt='banner_image' />;
											}
										} else {
											return (
												<Grid
													onClick={() => catalog_mode && handleClick(simillar?.id)}
													sx={{ ...column.style, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', cursor: 'pointer' }}>
													<Tooltip
														key={index}
														title={utils.get_column_display_value(column, simillar, price, data_values)}
														placement='top'
														onClose={() => {}}
														onOpen={() => {}}>
														{utils.get_column_display_value(column, simillar, price, data_values)}
													</Tooltip>
												</Grid>
											);
										}
									})}
								</React.Fragment>
							))}
							{custom_variant_template?.map((row: any, _index: number) => (
								<Grid
									container
									className={_index === 0 ? classes.hinge_product_detail : classes.hinge_product_detail_nth}
									width={'100%'}
									key={`attribute_row_${_index}`}>
									<div ref={simillar_card_ref}>
										{row?.attributes?.keys?.map((key: any) => {
											const value = utils.get_column_display_value(key, simillar, price, data_values);
											if (!value) {
												return <></>;
											}
											return (
												<Tooltip title={value} key={key} placement='top' onClose={() => {}} onOpen={() => {}}>
													<Grid onClick={() => catalog_mode && handleClick(simillar?.id)} item className={classes.hinge_attr_value}>
														<CustomText type='Caption' color={secondary[700]} className={classes.attr_value}>
															{value}
														</CustomText>
													</Grid>
												</Tooltip>
											);
										})}
									</div>
									{show_ellipsis && <Typography sx={{ paddingTop: '0px' }}>{'...'}</Typography>}
								</Grid>
							))}
						</Grid>

						{!utils?.is_prelogin_add_to_cart_button(is_logged_in) && (
							<>
								<Button
									size='large'
									tonal
									fullWidth
									className='lock_price_button'
									startIcon={<Icon iconName='IconLock' />}
									onClick={() => navigate(utils?.handle_active_free_trial_navigate())}>
									{utils?.check_prelogin_price(is_small_screen)}
								</Button>
							</>
						)}

						{utils?.is_prelogin_add_to_cart_button(is_logged_in) && (
							<>
								{catalog_mode ? (
									<Button
										size='large'
										id={`view_details_${simillar?.id}`}
										tonal
										onClick={() => handle_navigate_to_pdp(simillar?.id)}
										sx={{
											height: '40px',
											boxShadow: 'none',
										}}>
										<Grid>{t('ProductList.Main.ViewDetails')}</Grid>
									</Button>
								) : data_values?.is_variant || variant_data_map?.length === 1 ? (
									<Grid container flexDirection='row-reverse'>
										{from_redux ? handle_counter_from_redux() : handle_counter_without_redux()}
									</Grid>
								) : selected_variants > 0 ? (
									<Button size='large' variant='outlined' fullWidth sx={{ boxShadow: 'none' }} onClick={handleVariant}>
										<Icon iconName='IconEdit' color={theme?.product?.similar_drawer?.edit_icon?.color} sx={{ paddingRight: '4px' }} />
										{t('Common.SimilarCard.UpdateSelection')}
									</Button>
								) : (
									<Button
										size='large'
										tonal
										fullWidth
										sx={{ boxShadow: 'none' }}
										disabled={simillar?.inventory?.total_available === 0}
										onClick={handleVariant}>
										<Grid>
											{t('Common.SimilarCard.AddToCart')}
											{is_customization_required && <CustomizeText />}
										</Grid>
									</Button>
								)}
							</>
						)}
					</Grid>
				</Grid>
			</Card>
			{cart_error && (
				<Grid
					container
					ml={1}
					gap={1}
					alignItems={'center'}
					sx={{ color: theme?.product?.inventory_status?.out_of_stock?.container_style?.background }}>
					<Icon color='primary' iconName='IconInfoCircle' />
					<CustomText type='Caption'>{t('Common.ProductCard.Discontinued')}</CustomText>
				</Grid>
			)}
			{/** We are only using it inside drawer therefore no variant template handling here */}
			{drawer && (
				<VariantDrawer
					drawer={drawer}
					set_drawer={setDrawer}
					id={simillar?.id}
					attribute_template={custom_variant_template}
					parent_product={simillar}
					set_selected_filters={set_selected_filters}
					selected_filters={selected_filters}
				/>
			)}
			{cart_drawer && (
				<CartDrawer
					show={cart_drawer}
					set_show={set_cart_drawer}
					data={simillar}
					cart_product_id={simillar?.id}
					attribute_template={custom_variant_template}
				/>
			)}
			{show_customization_drawer && (
				<CommonCustomizationComponent
					customize_id={customize_id}
					product_details={simillar}
					grouping_identifier={grouping_identifier}
					get_and_initialize_cart={get_and_initialize_cart}
					show_customization_drawer={show_customization_drawer}
					set_show_customization_drawer={set_show_customization_drawer}
				/>
			)}
		</React.Fragment>
	);
};

export default SimillarCard;
