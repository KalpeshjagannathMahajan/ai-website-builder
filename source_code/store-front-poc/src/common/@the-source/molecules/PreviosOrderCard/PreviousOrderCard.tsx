import { Card } from '@mui/material';
import { Box, Chip, Counter, Grid, Icon, Image, Typography } from '../../atoms';
import dayjs from 'dayjs';
import { Product } from 'src/screens/ProductListing/mock/ProductInterface';
import { useSelector } from 'react-redux';
import RouteNames from 'src/utils/RouteNames';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, MutableRefObject, useLayoutEffect, useRef, useState } from 'react';
import { t } from 'i18next';
import types from 'src/utils/types';
import { from_max_quantity, get_max_quantity, get_product_detail } from 'src/screens/ProductListing/utils';
import _ from 'lodash';
import CounterWithoutRedux, { CartWithoutRedux } from '../../atoms/Counter/CounterWithoutRedux';
import { Buyer } from 'src/screens/BuyerDashboard/components/BuyerInterface';
import get_product_image from 'src/utils/ImageConstants';
import InventoryStatus from '../Inventory/InventoryStatus';
import { INVENTORY_STATUS } from '../Inventory/constants';
import utils, { get_attributes_mapping, get_product_metadata } from 'src/utils/utils';
import CartDrawer from '../CartItemDrawer/CartDrawer';
import { useTheme } from '@mui/material/styles';
import CustomText from '../../CustomText';
import { secondary } from 'src/utils/light.theme';
import { colors } from 'src/utils/theme';
import CommonCustomizationComponent from 'src/common/CommonCustomizationComp';
import useIsCustomization from 'src/hooks/useIsCustomization';
import { Mixpanel } from 'src/mixpanel';
import constants from 'src/utils/constants';
import Events from 'src/utils/events_constants';
import HasSimilar from '../RecommendCard/HasSimilar';
import SimilarDrawer from '../SimilarDrawer';
import { get_formatted_price_with_currency } from 'src/utils/common';
import useTenantSettings from 'src/hooks/useTenantSettings';
import WishlistSelectionModal from 'src/screens/Wishlist/Modals/WishlistSelectionModal';
import { valid_discount_for_product } from 'src/utils/DiscountEngineRule';

interface PrevOrderCardProps {
	prev_card_template: any;
	prev_data: Product;
	buyer?: Buyer;
	cart_data?: CartWithoutRedux;
	set_cart?: any;
	from_redux?: boolean;
	is_responsive?: boolean;
	customer_metadata?: any;
	page_name?: any;
	section_name?: any;
	has_similar?: boolean;
	catalog_ids?: String[];
	from_view_all?: boolean;
	wishlist_data?: any;
	discount_campaigns?: any[];
}

const classes = {
	card_style: {
		height: '270px',
		padding: '8px',
		boxShadow: 'none',
	},
	card_style_responsive: {
		width: '100%',
		height: 'fit-content',
		padding: '8px',
		boxShadow: 'none',
	},
	overflow_details: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		margin: '4px 0px',
		height: '24px',
	},
	date_chip: {
		width: 'auto',
		height: '28px',
		fontSize: '4px',
		border: '1px solid white',
		borderRadius: '40px',
	},
	history: { borderRadius: '8px', padding: '6px 10px' },
	order_text: { fontSize: '12px' },
	order_text_amount: {
		fontSize: '12px',
		width: 'auto',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	attr_section: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center' },
	detail_container: { padding: '2px 8px' },
	attr_icon: { marginTop: '-0.1rem', display: 'inline' },
	counter: { marginTop: '6px' },
	image_cont: { borderRadius: '6px', width: '100%', height: '245px' },
	image_cont_responsive: {
		borderRadius: '6px',
		width: '100%',
		maxWidth: '19rem',
		height: '22.5rem',
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
	},
	hinge_product_detail_nth: {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'nowrap',
		margin: '0.4rem 0 0 0',
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
	chips_and_icons: {
		position: 'absolute',
		top: '0.2rem',
		left: '0.3rem',
		display: 'flex',
		width: '100%',
		justifyContent: 'center',
	},
};
const PrevOrderCard = ({
	prev_card_template,
	prev_data,
	buyer,
	cart_data,
	set_cart,
	from_redux = true,
	is_responsive = false,
	customer_metadata,
	page_name,
	section_name,
	has_similar = true,
	catalog_ids,
	from_view_all = false,
	wishlist_data,
	discount_campaigns,
}: PrevOrderCardProps) => {
	const buyer_from_redux = useSelector((state: any) => state?.buyer);
	const cart = useSelector((state: any) => state?.cart);
	const { product_card_config = [], all_cards_config = {} } = useSelector((state: any) => state?.settings);
	const data_values = get_product_detail(prev_data);

	const get_product_rows = _.get(all_cards_config, 'previously_ordered.rows');
	const [show_ellipsis, set_show_ellipsis] = useState(false);
	const [drawer, set_drawer] = useState(false);
	const [price, set_price] = useState(prev_data?.pricing?.price);
	const prev_card_ref = useRef() as MutableRefObject<HTMLDivElement>;
	const currency = buyer_from_redux?.buyer_cart?.meta?.pricing_info?.currency_symbol;
	const navigate = useNavigate();
	const [cart_drawer, set_cart_drawer] = useState(false);
	const [show_customization_drawer, set_show_customization_drawer] = useState<boolean>(false);
	const master_discount_rule = useSelector((state: any) => state?.json_rules?.master_discount_rule);
	const discount_applied = valid_discount_for_product(master_discount_rule, discount_campaigns, prev_data, buyer, from_redux);
	const discounted_products: any = utils.get_discount_detail(cart?.products[prev_data?.id], discount_applied);
	const filtered_keys: any = utils.get_non_discount_keys(
		prev_data,
		from_redux ? cart?.products : cart_data?.products,
		data_values?.product_id,
		discount_applied,
	);
	const theme: any = useTheme();
	const catalog_mode = useSelector((state: any) => state?.catalog_mode?.catalog_mode);
	const { enable_wishlist } = useTenantSettings({
		[constants.TENANT_SETTINGS_KEYS.WISHLIST_ENABLED]: false,
	});

	const { is_customization_required, customize_id, grouping_identifier, get_and_initialize_cart } = useIsCustomization(prev_data);
	const product_metadata = get_product_metadata(prev_data);
	const similarSW = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
		set_drawer(true);
		e.stopPropagation();
		Mixpanel.track(Events.VIEW_SIMILAR_CLICKED, {
			tab_name: 'Products',
			page_name,
			section_name,
			subtab_name: '',
			customer_metadata,
			product_metadata,
		});
	};

	const checkOverflow = () => {
		if (prev_card_ref?.current && !show_ellipsis) {
			const isOverflowing = prev_card_ref?.current?.scrollWidth > prev_card_ref?.current?.clientWidth;
			set_show_ellipsis(isOverflowing);
		}
	};

	const handleDiscountProduct = () => {
		set_cart_drawer(true);
	};

	const formatDate = (dateString: string) => {
		try {
			const date = dayjs(dateString);
			if (!date?.isValid()) {
				throw new Error('Invalid date string');
			}

			const formattedDate = date.format(constants.ATTRIBUTE_DATE_FORMAT);
			return formattedDate;
		} catch (error) {
			console.error('Error formatting date:', error);
			return '';
		}
	};
	const handleClick = (product_id: any) => {
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
	const custom_variant_template = get_attributes_mapping(product_card_config, prev_data);

	const max = prev_data?.pricing?.max_order_quantity;
	const reserved_quantity = cart?.document_items?.[prev_data?.id]?.total_reserved ?? 0;
	const total_available = prev_data?.inventory?.total_available ?? 0;
	const out_of_stock_threshold = prev_data?.inventory?.out_of_stock_threshold ?? 0;
	const is_not_in_stock = reserved_quantity + total_available <= out_of_stock_threshold;
	const max_quantity = get_max_quantity(prev_data, reserved_quantity);
	const disable_counter = prev_data?.inventory?.inventory_status === INVENTORY_STATUS.out_of_stock && is_not_in_stock;

	useEffect(() => {}, [cart]);

	useLayoutEffect(() => {
		checkOverflow();
		window.addEventListener('resize', checkOverflow);
		return () => window.removeEventListener('resize', checkOverflow);
	}, [custom_variant_template]);

	const handle_customization = (event: React.MouseEvent<HTMLButtonElement>) => {
		event?.stopPropagation();
		set_show_customization_drawer(true);
	};

	return (
		<>
			<Card
				id={prev_data?.id}
				style={
					is_responsive
						? { ...classes.card_style_responsive, ...theme?.product?.previous_ordered_card?.card_style }
						: { ...classes.card_style, width: !from_view_all && '465px', ...theme?.product?.previous_ordered_card?.card_style }
				}>
				<Grid container direction='row' justifyContent='space-between'>
					<Grid width={is_responsive ? 'auto' : '40%'} style={{ position: 'relative', marginRight: !is_responsive && '8px', flex: 1 }}>
						<Box
							sx={{
								position: 'absolute',
								top: '0.1rem',
								left: '0.3rem',
								display: 'flex',
								width: '100%',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}>
							<Chip
								onClick={() => handleClick(prev_data?.id)}
								bgColor={theme?.palette?.success[50]}
								textColor={colors.grey_800}
								sx={classes.date_chip}
								label={<CustomText type='Caption'>{`Last order: ${formatDate(prev_data?.order_date)}`}</CustomText>}
							/>
							{!catalog_mode && enable_wishlist && <WishlistSelectionModal buyer_wishlist_data={wishlist_data} product={prev_data} />}
						</Box>
						<Image
							onClick={() => handleClick(prev_data?.id)}
							src={get_product_image(prev_data, 'PREVIOUSLY_ORDERED_RAILS')}
							style={is_responsive ? classes.image_cont_responsive : classes.image_cont}
						/>

						<Chip
							bgColor={theme?.product?.previous_ordered_card?.chip_style?.background}
							textColor={theme?.product?.previous_ordered_card?.chip_style?.color}
							sx={{
								...classes.date_chip,
								...theme?.product?.product_template?.date_chip,
							}}
							label={`Last order: ${formatDate(prev_data?.order_date)}`}
						/>
						{prev_data?.inventory?.inventory_status === 'OUT_OF_STOCK' && (
							<InventoryStatus
								data={prev_data}
								variantType='chip'
								style={{
									bottom: 10,
									left: 5,
									top: null,
								}}
							/>
						)}
						{has_similar && <HasSimilar similarDrawer={similarSW} />}
					</Grid>
					<Grid container direction='column' width={is_responsive ? '55%' : '50%'} justifyContent={'space-between'}>
						<Grid
							container
							direction='row'
							justifyContent='space-between'
							sx={{ ...classes.history, ...theme?.product?.previous_ordered_card?.history }}
							onClick={() => handleClick(prev_data?.id)}>
							<Grid item direction='column' width='50px'>
								<Typography variant='caption' color={theme?.product?.previous_ordered_card?.order_text?.color} sx={classes.order_text}>
									{t('Common.PreviosOrderCard.OrderedTillDate')}
								</Typography>
							</Grid>

							<Grid item direction='column' width='50px'>
								<Typography variant='caption' sx={classes.order_text}>
									{t('Common.PreviosOrderCard.Value')}
								</Typography>
								<Grid sx={classes.order_text_amount}>{get_formatted_price_with_currency(currency, prev_data?.amount)}</Grid>
							</Grid>
							<Grid item direction='column' width='50px'>
								<Typography variant='caption' sx={classes.order_text}>
									{t('Common.PreviosOrderCard.Quantity')}
								</Typography>
								<Grid sx={{ fontSize: '12px' }}>{prev_data?.quantity}</Grid>
							</Grid>
						</Grid>

						<Grid container direction='column' sx={classes.detail_container} onClick={() => handleClick(prev_data?.id)}>
							{_.map(get_product_rows || prev_card_template?.rows, (row: any) => (
								<>
									{row?.map((column: any) => {
										if (column?.type === 'price') {
											const key = data_values?.is_variant ? column?.variant_key : column?.product_key;
											const price_value = _.get(prev_data, 'pricing.price');
											const base_price = _.get(prev_data, 'pricing.base_price') ?? 0;
											const base_price_condition = utils.base_price_conditions(column, data_values, price_value, base_price);
											return (
												<Grid
													key={key}
													sx={{
														...column?.style,
														textAlign: 'start',
														...classes.overflow_details,
														display: 'flex',
														alignItems: 'flex-end',
														gap: 1,
													}}>
													{utils.get_column_display_value(column, prev_data, price, data_values)}
													{base_price_condition && (
														<CustomText
															type='Caption'
															style={{
																textDecoration: 'line-through',
																color: colors.secondary_text,
															}}>
															{get_formatted_price_with_currency(currency, base_price)}
														</CustomText>
													)}
												</Grid>
											);
										} else {
											return (
												<Grid
													key={column?.key}
													sx={{
														...column?.style,
														...classes.overflow_details,
													}}>
													{utils.get_column_display_value(column, prev_data, price, data_values)}
												</Grid>
											);
										}
									})}
								</>
							))}

							{custom_variant_template?.map((row: any, _index: number) => (
								<Grid
									sx={_index === 0 ? classes.hinge_product_detail : classes.hinge_product_detail_nth}
									width={'90%'}
									key={`attribute_row_${_index}`}
									flexWrap='nowrap'>
									<Grid container alignItems='center' sx={{ overflow: 'hidden', flexWrap: 'nowrap' }}>
										<div style={classes.attr_section} ref={prev_card_ref}>
											{row?.attributes?.keys?.map((key: any) => {
												const value = utils.get_column_display_value(key, prev_data, price, data_values);
												if (!value) {
													return <></>;
												}
												return (
													<Grid sx={classes.hinge_attr_value} item key={key}>
														<CustomText type='Caption' color={secondary[700]} style={classes.attr_value}>
															{value}
														</CustomText>
													</Grid>
												);
											})}
										</div>
									</Grid>
								</Grid>
							))}
						</Grid>
						<Grid sx={classes.counter}>
							{!discounted_products?.is_discount_applied ? (
								<>
									{from_redux ? (
										<Counter
											disabled={disable_counter}
											step={prev_data?.pricing?.step_increment || types.STEP_INCREMENT}
											initialCount={0}
											min={prev_data?.pricing?.min_order_quantity || types.MIN_ORDER_QUANTITY}
											max={max_quantity}
											cart_item_key={filtered_keys}
											product_id={data_values?.product_id}
											product={prev_data}
											parent_id={data_values?.parent_id}
											from_max={from_max_quantity(max_quantity, max)}
											default_order_quantity={prev_data?.pricing?.default_order_quantity}
											volume_tiers={prev_data?.pricing?.volume_tiers}
											set_price={set_price}
											is_customization_required={is_customization_required}
											handle_customization={handle_customization}
											page_name={page_name}
											section_name={section_name}
											discount_applied={discount_applied}
										/>
									) : (
										<CounterWithoutRedux
											disabled={disable_counter}
											step={prev_data?.pricing?.step_increment || types.STEP_INCREMENT}
											initialCount={0}
											cart_item_key={filtered_keys}
											min={prev_data?.pricing?.min_order_quantity || types.MIN_ORDER_QUANTITY}
											max={max_quantity}
											product_id={data_values?.product_id}
											product={prev_data}
											parent_id={data_values?.parent_id}
											from_max={from_max_quantity(max_quantity, max)}
											buyer={buyer}
											cart={cart_data}
											set_cart={set_cart}
											is_customization_required={is_customization_required}
											handle_customization={handle_customization}
											discount_applied={discount_applied}
										/>
									)}
								</>
							) : (
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
										iconName='IconMinus'
										fontSize='small'
										onClick={handleDiscountProduct}
										sx={{ ...classes.remove_icon, ...theme?.product?.recommended?.remove_icon }}
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
											style={{ ...classes.show_count, ...theme?.product?.recommended?.show_count }}
											type='number'
											value={utils.get_cart_items(data_values?.product_id, cart) as any}
											onClick={handleDiscountProduct}
										/>
									</Grid>
									<Icon
										color={'primary'}
										iconName='IconPlus'
										fontSize='small'
										sx={{ ...classes.add_icon, ...theme?.product?.recommended?.add_icon }}
										onClick={handleDiscountProduct}
									/>
								</Grid>
							)}
						</Grid>
					</Grid>
				</Grid>
				{cart_drawer && (
					<CartDrawer
						show={cart_drawer}
						set_show={set_cart_drawer}
						data={prev_data}
						cart_product_id={prev_data?.id}
						attribute_template={custom_variant_template}
					/>
				)}
			</Card>
			{show_customization_drawer && (
				<CommonCustomizationComponent
					customize_id={customize_id}
					product_details={prev_data}
					grouping_identifier={grouping_identifier}
					get_and_initialize_cart={get_and_initialize_cart}
					show_customization_drawer={show_customization_drawer}
					set_show_customization_drawer={set_show_customization_drawer}
					page_name={page_name}
					section_name={section_name}
				/>
			)}

			{drawer && (
				<SimilarDrawer
					drawer={drawer}
					setDrawer={set_drawer}
					simillar={prev_data?.id}
					card_temp={{}}
					catalog_ids={catalog_ids}
					buyer_data={buyer}
					cart_data={cart_data}
					set_cart={set_cart}
					from_redux={from_redux}
					wishlist_data={wishlist_data}
				/>
			)}
		</>
	);
};

export default PrevOrderCard;
