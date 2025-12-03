import { Card } from '@mui/material';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Box, Button, Counter, Grid, Icon, Image } from 'src/common/@the-source/atoms';
import SimilarDrawer from '../SimilarDrawer';
import VariantDrawer from '../VariantDrawer';
import { Product } from 'src/screens/ProductListing/mock/ProductInterface';
import { useSelector } from 'react-redux';
import HasSimilar from './HasSimilar';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { from_max_quantity, get_cart_items, get_max_quantity, get_product_detail } from 'src/screens/ProductListing/utils';
import { t } from 'i18next';
import types from 'src/utils/types';
import _ from 'lodash';
import CounterWithoutRedux, { CartWithoutRedux } from '../../atoms/Counter/CounterWithoutRedux';
import { Buyer } from 'src/screens/BuyerDashboard/components/BuyerInterface';
import get_product_image from 'src/utils/ImageConstants';
import InventoryStatus from '../Inventory/InventoryStatus';
import { INVENTORY_STATUS } from '../Inventory/constants';
import CartDrawer from '../CartItemDrawer/CartDrawer';
import utils, { get_attributes_mapping, get_product_metadata } from 'src/utils/utils';
import CustomText from '../../CustomText';
import { useTheme } from '@mui/material/styles';
import { colors } from 'src/utils/theme';
import { secondary } from 'src/utils/light.theme';
import useIsCustomization from 'src/hooks/useIsCustomization';
import CustomizeText from 'src/common/CommonCustomizationComp/CustomizeText';
import CommonCustomizationComponent from 'src/common/CommonCustomizationComp';
import { Mixpanel } from 'src/mixpanel';
import { ISelectedFilters } from '../FiltersAndChips/interfaces';
import Events from 'src/utils/events_constants';
import useTenantSettings from 'src/hooks/useTenantSettings';
import constants from 'src/utils/constants';
import { get_formatted_price_with_currency } from 'src/utils/common';
import WishlistSelectionModal from 'src/screens/Wishlist/Modals/WishlistSelectionModal';

interface RecommendCardProps {
	recommend: Product;
	rec_card_template: any;
	border: boolean;
	hasSimillar: boolean;
	handleClick: any;
	buyer?: Buyer;
	cart_data?: CartWithoutRedux;
	set_cart?: any;
	from_redux?: boolean;
	catalog_ids?: any;
	customer_metadata?: any;
	page_name?: any;
	section_name?: any;
	wishlist_data?: any;
}

const useStyles = makeStyles((theme: any) => ({
	card: {
		width: '436px',
		height: '195px',
		boxShadow: 'none',
		padding: '8px',
	},
	image: {
		width: '180px',
		height: '162px',
		borderRadius: '8px',
		cursor: 'pointer',
		objectFit: 'contain',
	},
	prod_detail: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		width: '85%',
		lineHeight: '150%',
		...theme?.product?.recommanded?.prod_detail,
	},
	attribute: {
		display: 'flex',
		flexDirection: 'row',
		width: '96%',
		alignItems: 'center',
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
		width: 'auto',
		...theme?.product?.recommanded?.attr_chip,
		textOverflow: 'ellipsis',
	},
	variant_value: {
		height: '2rem',
		width: '3rem',
		fontSize: '1.2rem',
		textAlign: 'center',
		borderRadius: '2rem',
		fontWeight: '700',
		margin: '-2rem 1rem .4rem 19rem',
	},
	selected_variant_value: {
		height: '2rem',
		width: '3rem',
		fontSize: '1.2rem',
		textAlign: 'center',
		borderRadius: '2rem',
		fontWeight: '700',
		margin: '-2rem 1rem .4rem 19rem',
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
		margin: '0.2rem 0 0 0',
	},
	wishlist_icon: {
		position: 'absolute',
		right: '6px',
		top: '0px',
		zIndex: 1,
		cursor: 'pointer',
	},
}));
const RecommendCard = ({
	recommend,
	rec_card_template = {},
	border,
	hasSimillar,
	handleClick,
	from_redux = true,
	buyer,
	cart_data,
	set_cart,
	catalog_ids,
	customer_metadata,
	page_name,
	section_name,
	wishlist_data,
}: RecommendCardProps) => {
	const cart = useSelector((state: any) => state?.cart);
	const { product_card_config = [], all_cards_config = {} } = useSelector((state: any) => state?.settings);
	const [drawer, setDrawer] = useState(false);
	const [cart_drawer, set_cart_drawer] = useState(false);
	const [drawerV, setDrawerV] = useState(false);
	const [show_ellipsis, set_show_ellipsis] = useState(false);
	const [show_customization_drawer, set_show_customization_drawer] = useState<boolean>(false);
	const [price, set_price] = useState(recommend?.pricing?.price);
	const recommend_card_ref = useRef() as MutableRefObject<HTMLDivElement>;
	const classes = useStyles();
	const data_values = get_product_detail(recommend);
	const filtered_keys = utils.get_non_discount_keys(recommend, from_redux ? cart?.products : cart_data?.products, data_values?.product_id);
	const selected_variants = Object.values(cart?.products)?.filter((_p: any) => data_values?.parent_id === _p?.parent_id)?.length;
	const discounted_products: any = utils.get_discount_detail(cart?.products[recommend?.id]);
	const theme: any = useTheme();

	const [selected_filters, set_selected_filters] = useState<ISelectedFilters>({ filters: {}, range_filters: {} });
	const get_product_rows = _.get(all_cards_config, 'recommended.rows');
	const { is_customization_required, customize_id, grouping_identifier, get_and_initialize_cart } = useIsCustomization(recommend);
	const catalog_mode = useSelector((state: any) => state?.catalog_mode?.catalog_mode);
	const { enable_wishlist } = useTenantSettings({
		[constants.TENANT_SETTINGS_KEYS.WISHLIST_ENABLED]: false,
	});

	const checkOverflow = () => {
		if (recommend_card_ref?.current && !show_ellipsis) {
			const isOverflowing = recommend_card_ref?.current?.scrollWidth > recommend_card_ref?.current?.clientWidth;
			set_show_ellipsis(isOverflowing);
		}
	};
	const product_metadata = get_product_metadata(recommend);
	const variant_data_map = recommend?.variants_meta?.variant_data_map || [];
	const similarSW = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
		setDrawer(true);
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
	const handleVariant = () => {
		setDrawerV(true);
	};
	const handleDiscountProduct = () => {
		set_cart_drawer(true);
	};
	const reserved_quantity = cart?.document_items?.[recommend?.id]?.total_reserved ?? 0;
	const total_available = recommend?.inventory?.total_available ?? 0;
	const out_of_stock_threshold = recommend?.inventory?.out_of_stock_threshold ?? 0;
	const is_not_in_stock = reserved_quantity + total_available <= out_of_stock_threshold;
	const max_quantity = get_max_quantity(recommend, reserved_quantity);
	const disable_counter = recommend?.inventory?.inventory_status === INVENTORY_STATUS.out_of_stock && is_not_in_stock;

	const custom_variant_template = get_attributes_mapping(product_card_config, recommend);
	// const custom_variant_template = {
	// 	attributes: {
	// 		keys: _.map(recommend?.variants_meta?.hinge_attributes, (v: any) => `custom_attributes::${v?.id}::value`),
	// 	},
	// };

	useEffect(() => {
		checkOverflow();
		window.addEventListener('resize', checkOverflow);
		return () => window.removeEventListener('resize', checkOverflow);
	}, [recommend?.id]);

	const handle_customization = (event: React.MouseEvent<HTMLButtonElement>) => {
		event?.stopPropagation();
		set_show_customization_drawer(true);
	};

	const handle_recommend_click = () => {
		handleClick(recommend?.id);
		Mixpanel.track(Events.PRODUCT_CARD_CLICKED, {
			tab_name: 'Products',
			page_name,
			section_name,
			subtab_name: '',
			customer_metadata,
			product_metadata,
		});
	};

	return (
		<>
			<Card id={recommend?.id} className={classes.card} style={{ border: border ? theme?.product?.recommanded?.card?.border : 'none' }}>
				<Grid container direction='row' justifyContent='space-between'>
					<Grid sx={{ cursor: 'pointer', position: 'relative' }}>
						{!catalog_mode && enable_wishlist && (
							<Box className={classes.wishlist_icon}>
								<WishlistSelectionModal buyer_wishlist_data={wishlist_data} product={recommend} />
							</Box>
						)}
						<Image
							onClick={() => handle_recommend_click()}
							src={get_product_image(recommend, 'RECOMMENDED_RAIL_CARD')}
							imgClass={classes.image}
							id='recomended_image'
						/>
						<InventoryStatus variantType='chip' data={recommend} />
						{hasSimillar && <HasSimilar similarDrawer={similarSW} />}
					</Grid>
					<Grid container direction='column' justifyContent='space-between' width='232px' height='180px'>
						{_.map(get_product_rows || rec_card_template?.rows, (row: any, index: number) => (
							<React.Fragment key={row?.key}>
								{row?.map((column: any) => {
									if (column?.type === 'price') {
										const key = data_values?.is_variant ? column?.variant_key : column?.product_key;
										const price_value = _.get(recommend, 'pricing.price');
										const base_price: any = _.get(recommend, 'pricing.base_price');
										const currency = _.get(recommend, 'pricing.currency', '$');
										const base_price_condition = utils.base_price_conditions(column, data_values, price_value, base_price);

										return (
											<Grid
												key={key}
												sx={{ ...column.style, display: 'flex', alignItems: 'flex-end', gap: 1 }}
												className={classes.prod_detail}
												onClick={() => handle_recommend_click()}>
												{utils.get_column_display_value(column, recommend, price, data_values)}
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
											<Grid key={column?.key} sx={column.style} className={classes.prod_detail} onClick={() => handle_recommend_click()}>
												{utils.get_column_display_value(column, recommend, price, data_values)}
											</Grid>
										);
									}
								})}
								{index === 0 && !data_values?.is_variant && variant_data_map?.length > 1 && (
									<Grid
										sx={
											selected_variants > 0
												? { ...theme?.product?.recommanded?.selected_variant_value }
												: { ...theme?.product?.recommanded?.variant_value }
										}
										className={selected_variants > 0 ? classes.selected_variant_value : classes.variant_value}>
										{selected_variants > 0
											? `${selected_variants}/${variant_data_map?.length}`
											: `+ ${recommend?.variants_meta?.variant_data_map?.length}`}
									</Grid>
								)}
							</React.Fragment>
						))}
						{custom_variant_template?.map((row: any, _index: number) => (
							<Grid
								key={`attribute_row_${_index}`}
								className={_index === 0 ? classes.hinge_product_detail : classes.hinge_product_detail_nth}
								flexWrap='nowrap'
								width={'100%'}
								onClick={() => handle_recommend_click()}>
								<div className={classes.attribute} ref={recommend_card_ref}>
									{row?.attributes?.keys?.map((key: any) => {
										const value = utils.get_column_display_value(key, recommend, price, data_values);
										if (!value) {
											return <></>;
										}
										return (
											<Grid item key={key} className={classes.hinge_attr_value}>
												<CustomText type='Caption' color={secondary[700]} className={classes.attr_value}>
													{value}
												</CustomText>
											</Grid>
										);
									})}
								</div>
								{show_ellipsis && (
									<CustomText type='Body' style={{ paddingTop: '0px' }}>
										{'...'}
									</CustomText>
								)}
							</Grid>
						))}
						{data_values?.is_variant || recommend?.variants_meta?.variant_data_map?.length === 1 ? (
							from_redux ? (
								<>
									{!discounted_products?.is_discount_applied ? (
										<Counter
											disabled={disable_counter}
											sx={{ boxShadow: 'none' }}
											step={recommend?.pricing?.step_increment || types.STEP_INCREMENT}
											initialCount={0}
											min={recommend?.pricing?.min_order_quantity ?? types.MIN_ORDER_QUANTITY}
											max={max_quantity}
											cart_item_key={filtered_keys}
											product_id={data_values?.product_id}
											containerStyle={{ justifyContent: 'space-between' }}
											product={recommend}
											default_order_quantity={recommend?.pricing?.default_order_quantity}
											volume_tiers={recommend?.pricing?.volume_tiers}
											parent_id={data_values?.parent_id}
											set_price={set_price}
											from_max={from_max_quantity(max_quantity, recommend?.pricing?.max_order_quantity ?? types.DEFAULT_ORDER_QUANTITY)}
											is_customization_required={is_customization_required}
											handle_customization={handle_customization}
											page_name={page_name}
											section_name={section_name}
										/>
									) : (
										<Grid
											container
											id={`counter_${recommend?.id}`}
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
									{!discounted_products?.is_discount_applied ? (
										<CounterWithoutRedux
											disabled={disable_counter}
											sx={{ boxShadow: 'none' }}
											step={recommend?.pricing?.step_increment || types.STEP_INCREMENT}
											initialCount={0}
											min={recommend?.pricing?.min_order_quantity ?? types.MIN_ORDER_QUANTITY}
											max={max_quantity}
											cart_item_key={filtered_keys}
											product_id={data_values?.product_id}
											containerStyle={{ justifyContent: 'space-between' }}
											product={recommend}
											parent_id={data_values?.parent_id}
											from_max={from_max_quantity(max_quantity, recommend?.pricing?.max_order_quantity ?? types.DEFAULT_ORDER_QUANTITY)}
											buyer={buyer}
											cart={cart_data}
											set_cart={set_cart}
											is_customization_required={is_customization_required}
											handle_customization={handle_customization}
										/>
									) : (
										<Grid
											id={`counter_${recommend?.id}`}
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
							)
						) : (
							<>
								{selected_variants > 0 ? (
									<Grid
										id={`counter_${recommend?.id}`}
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
											sx={{
												...theme?.product?.recommanded?.remove_icon,
											}}
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
												value={get_cart_items(recommend, cart)}
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
										id={`add_to_cart_${recommend?.id}`}
										size='large'
										tonal
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
										}}
										fullWidth
										onClick={disable_counter ? () => {} : handleVariant}>
										{t('Common.ProductCard.AddToCart')}
										{is_customization_required && <CustomizeText />}
									</Button>
								)}
							</>
						)}
					</Grid>
				</Grid>
			</Card>
			{/* TODO: Add props inside similar drawer and variant cart */}
			{drawer && (
				<SimilarDrawer
					drawer={drawer}
					setDrawer={setDrawer}
					simillar={recommend?.id}
					card_temp={rec_card_template}
					catalog_ids={catalog_ids}
					buyer_data={buyer}
					cart_data={cart_data}
					set_cart={set_cart}
					from_redux={from_redux}
					wishlist_data={wishlist_data}
				/>
			)}
			{drawerV && (
				<VariantDrawer
					drawer={drawerV}
					set_drawer={setDrawerV}
					id={recommend?.id}
					attribute_template={custom_variant_template}
					catalog_ids={catalog_ids}
					buyer_data={buyer}
					cart_data={cart_data}
					set_cart={set_cart}
					from_redux={from_redux}
					parent_product={recommend}
					set_selected_filters={set_selected_filters}
					selected_filters={selected_filters}
					wishlist_data={wishlist_data}
				/>
			)}
			{cart_drawer && (
				<CartDrawer
					show={cart_drawer}
					set_show={set_cart_drawer}
					data={recommend}
					cart_product_id={recommend?.id}
					attribute_template={custom_variant_template}
				/>
			)}
			{show_customization_drawer && (
				<CommonCustomizationComponent
					customize_id={customize_id}
					product_details={recommend}
					grouping_identifier={grouping_identifier}
					get_and_initialize_cart={get_and_initialize_cart}
					show_customization_drawer={show_customization_drawer}
					set_show_customization_drawer={set_show_customization_drawer}
				/>
			)}
		</>
	);
};

export default RecommendCard;
