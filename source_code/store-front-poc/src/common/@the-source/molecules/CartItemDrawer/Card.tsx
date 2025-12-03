/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable array-callback-return */
import { Divider, Tooltip } from '@mui/material';
import { Counter, Grid, Icon, Typography, Image } from '../../atoms';
import _, { isEmpty } from 'lodash';
import types from 'src/utils/types';
import { from_max_quantity, get_max_quantity } from 'src/screens/ProductListing/utils';
import { Product } from 'src/screens/ProductListing/mock/ProductInterface';
import get_product_image from 'src/utils/ImageConstants';
import { useNavigate } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import InventoryStatus from '../Inventory/InventoryStatus';
import { INVENTORY_STATUS } from '../Inventory/constants';
// import { useSelector } from 'react-redux';
import ImageLinks from 'src/assets/images/ImageLinks';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { get_discounted_value } from 'src/screens/CartSummary/helper';
import { useTheme } from '@mui/material/styles';
import utils from 'src/utils/utils';
import { get_formatted_price_with_currency } from 'src/utils/common';
import { useSelector } from 'react-redux';
import { valid_discount_for_product } from 'src/utils/DiscountEngineRule';
import PriceView from '../../PriceView';
// import { colors } from 'src/utils/theme';

interface VariantCardProps {
	product: Product;
	cart_product: any;
	cart_item_key?: string;
	attribute_template?: any;
	discount_campaigns?: any[];
}

const classes = {
	icon: { margin: '0px 6px', height: '10px', width: '10px' },
	card: { margin: '10px 6px' },
	container: { minHeight: '145px', width: '100%' },
	inventory: { margin: '4px', marginLeft: '1rem', maxHeight: '40px', overflow: 'hidden' },
	counter: { width: 130 },
	product_name: { fontSize: '16px' },
	divider: { width: '100%', marginTop: '.6rem' },
	body: { paddingLeft: '8px', maxWidth: '65%' },
	stock_container: {
		display: 'flex',
		gap: 1,
		flexDirection: 'column',
		alignItems: 'top',
		height: 'fit-content',
	},
	notes: {
		display: 'flex',
		flexDirection: 'row',
		gap: '4px',
	},
	note_text: {
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
	},
	discount_bar: {
		display: 'flex',
		padding: '6px 8px',
		justifyContent: 'space-between',
		alignItems: 'center',
		alignSelf: 'stretch',
		borderRadius: '8px',
	},
	discount_header: {
		display: 'flex',
		gap: '4px',
		alignItems: 'center',
		fontSize: '14px',
		fontWeight: 700,
		flexDirection: 'row',
		color: 'var(--Secondary-text, rgba(0, 0, 0, 0.60))',
	},
	discount_icon: {
		color: 'linear-gradient( #16885F, #97B73E)',
		height: '24px',
		width: '24px',
		padding: 0,
		margin: 0,
	},
};
const CartItemCard = ({ product, attribute_template, cart_product, cart_item_key, discount_campaigns }: VariantCardProps) => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const buyer = useSelector((state: any) => state?.buyer);
	const variant_template = _.cloneDeep(attribute_template);
	const [price, set_price] = useState(product?.pricing?.price);

	const currency_symbol = product?.pricing?.currency;
	const discount_price =
		product?.pricing?.price - get_discounted_value(cart_product?.discount_type, cart_product?.discount_value, product?.pricing?.price);
	// const product_dimension = data?.transformed_attributes.filter((item: any) => item.label === 'dimensions')[0]?.value;
	const reserved_quantity = cart_product?.document_items?.[product?.id]?.total_reserved ?? 0;
	const total_available = product?.inventory?.total_available ?? 0;
	const out_of_stock_threshold = product?.inventory?.out_of_stock_threshold ?? 0;
	const is_not_in_stock = reserved_quantity + total_available <= out_of_stock_threshold;
	const max_quantity = get_max_quantity(product, reserved_quantity);
	const disable_counter = product?.inventory?.inventory_status === INVENTORY_STATUS.out_of_stock && is_not_in_stock;
	const notesValue = _.get(cart_product?.meta, 'notes[0].value', '');
	const theme: any = useTheme();
	const master_discount_rule = useSelector((state: any) => state?.json_rules?.master_discount_rule);
	const discount_applied = valid_discount_for_product(master_discount_rule, discount_campaigns, product, buyer);
	// const view_value = get_formatted_price_with_currency(currency_symbol, price);
	const discounted_value = isEmpty(discount_applied) ? price : discount_applied?.discounted_value;
	const get_column_display_value = (column: any) => {
		return utils.transform_column_display(column, product, price);
	};

	const handle_navigate = () => {
		navigate(`${RouteNames.product.product_detail.routing_path}${product?.id}`);
		window.scrollTo(0, 0);
	};

	const get_discount_label = () => {
		if (cart_product?.discount_type === 'value') {
			return t('CartSummary.DiscountAppliedValue', {
				discount_price: get_formatted_price_with_currency(currency_symbol, cart_product?.discount_value),
			});
		}
		if (cart_product?.discount_type === 'percentage') {
			return t('CartSummary.DiscountAppliedPercentage', {
				value: Number?.isInteger(cart_product?.discount_value) ? cart_product?.discount_value : cart_product?.discount_value?.toFixed(2),
			});
		}
		return false;
	};

	return (
		<>
			<Grid key={product?.id} sx={classes.card}>
				<Grid container sx={classes.container}>
					<Grid container direction='row' justifyContent='space-between'>
						<Grid item sx={{ maxWidth: '40%', cursor: 'pointer' }} onClick={() => handle_navigate()}>
							<Grid container direction='row'>
								<Image src={get_product_image(product, 'VARIANT_DRAWER')} width={75} height={75} style={{ borderRadius: '8px' }} />
								<Grid item sx={classes.body}>
									<Tooltip
										placement='top'
										arrow
										title={
											<Typography variant='body2' color={theme?.product?.cart_item_card?.light}>
												{product?.sku_id}
											</Typography>
										}>
										<div>
											<Typography variant='body2' sx={classes.inventory}>
												{product?.sku_id}
											</Typography>
										</div>
									</Tooltip>
									<Typography variant='h6' sx={classes.inventory}>
										{isEmpty(cart_product) ? (
											<PriceView
												product={product}
												data_values={{ is_variant: true }}
												column={{ variant_key: 'pricing::price', type: 'price' }}
												discount_campaigns={discount_campaigns}
												currency_symbol={currency_symbol}
												styles={{ display: 'flex', gap: 1, alignItems: 'center', flexDirection: 'row', width: '100%' }}
											/>
										) : (
											get_formatted_price_with_currency(currency_symbol, price)
										)}
									</Typography>
									<Typography variant='body2' color={theme?.product?.cart_item_card?.primary} sx={classes.inventory}>
										{'product_dimension'}
									</Typography>
								</Grid>
							</Grid>
						</Grid>
						<Grid item sx={classes.stock_container}>
							<InventoryStatus data={product} style={{ height: '3rem' }} showBg={false} />
							{product?.inventory?.inventory_status !== 'OUT_OF_STOCK' && (
								<Typography variant='body2' sx={classes.inventory}>
									{t('Common.MOQ', { count: product?.pricing?.min_order_quantity })}
								</Typography>
							)}
						</Grid>

						<Grid item direction='row' sx={classes.counter}>
							<Counter
								sx={{ boxShadow: 'none' }}
								disabled={disable_counter}
								step={product?.pricing?.step_increment || types.STEP_INCREMENT}
								initialCount={cart_product?.quantity ?? 0}
								min={product?.pricing?.min_order_quantity || types.MIN_ORDER_QUANTITY}
								max={max_quantity}
								product_id={product?.id}
								parent_id={product?.parent_id}
								cart_item_key={cart_item_key}
								product={product}
								default_order_quantity={product?.pricing?.default_order_quantity}
								volume_tiers={product?.pricing?.volume_tiers}
								set_price={set_price}
								discount_applied={isEmpty(cart_product) ? discount_applied : {}}
								from_max={from_max_quantity(max_quantity, product?.pricing?.max_order_quantity ?? types.DEFAULT_ORDER_QUANTITY)}
							/>
							<Grid sx={{ margin: '.6rem', display: 'flex', flexDirection: 'row-reverse', gap: '.8rem' }}>
								{cart_product?.discount_value ? (
									<>
										<Typography
											color={theme?.product?.cart_item_card?.tertiary}
											sx={{ fontWeight: 700, fontSize: '14px', textDecoration: 'line-through' }}>
											{t('CartSummary.ProductCard.Price', { price: get_formatted_price_with_currency(currency_symbol, price) })}
										</Typography>
										<Typography color={theme?.product?.cart_item_card?.tertiary} sx={{ fontWeight: 700, fontSize: '14px' }}>
											{t('CartSummary.ProductCard.Price', {
												price: get_formatted_price_with_currency(currency_symbol, discount_price),
											})}
										</Typography>
									</>
								) : (
									<Typography color={theme?.product?.cart_item_card?.tertiary} sx={{ fontWeight: 700, fontSize: '14px' }}>
										{t('CartSummary.ProductCard.Price', {
											price: get_formatted_price_with_currency(currency_symbol, isEmpty(cart_product) ? discounted_value : price),
										})}
									</Typography>
								)}
							</Grid>
						</Grid>
					</Grid>
					<Grid>
						<Typography sx={classes.product_name}>{product?.name}</Typography>
					</Grid>
					<Grid
						container
						direction='row'
						flexWrap='nowrap'
						width='100%'
						sx={{ whiteSpace: 'nowrap', overflow: 'hidden', alignItems: 'center' }}>
						{variant_template?.attributes?.keys?.map((key: any, index: number) => (
							<Grid item key={key} sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
								{index > 0 && get_column_display_value(key) !== '' && (
									<Icon iconName='IconMinusVertical' sx={{ ...classes.icon, color: theme?.product?.cart_item_card?.secondary }} />
								)}
								<Typography variant='subtitle2' color={theme?.product?.cart_item_card?.primary}>
									{get_column_display_value(key)}
								</Typography>
							</Grid>
						))}
					</Grid>
				</Grid>
				{cart_product?.discount_type && (
					<Grid sx={{ ...classes.discount_bar, ...theme?.product?.cart_item_card?.discount_bar }}>
						<Grid sx={{ ...classes.discount_header, ...theme?.product?.cart_item_card?.discount_header }}>
							<Image
								src={ImageLinks.DiscountIconChecked}
								style={{ height: '24px', width: '24px', color: theme?.product?.cart_item_card?.dark_grey }}
							/>
							<Grid> {get_discount_label()}</Grid>
						</Grid>
					</Grid>
				)}
				<Grid sx={classes.notes}>
					{notesValue && (
						<>
							<Typography sx={{ fontWeight: 700, fontSize: '14px', ...classes.note_text }} color={theme?.product?.cart_item_card?.primary}>
								Note
							</Typography>
							<Typography sx={{ fontWeight: 400, fontSize: '14px', ...classes.note_text }} color={theme?.product?.cart_item_card?.primary}>
								{t('CartSummary.ProductCard.YourNote', { Note: notesValue })}
							</Typography>
						</>
					)}
				</Grid>
				<Divider sx={classes.divider} />
			</Grid>
		</>
	);
};

export default CartItemCard;
