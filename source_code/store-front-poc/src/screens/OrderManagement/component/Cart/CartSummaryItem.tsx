/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Box, Grid, Image, Icon } from 'src/common/@the-source/atoms';
import { Divider } from '@mui/material';
import { get_discounted_value } from 'src/screens/CartSummary/helper';
import _, { truncate } from 'lodash';
import ImageLinks from 'src/assets/images/ImageLinks';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import { PLACE_HOLDER_IMAGE } from 'src/screens/ProductDetailsPage/constants';
import { useSelector } from 'react-redux';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';
import { error } from 'src/utils/common.theme';
import { get_formatted_price_with_currency, get_unit_price_of_product } from 'src/utils/common';
import utils, { get_attributes_mapping } from 'src/utils/utils';
import useMediaQuery from '@mui/material/useMediaQuery';
import { secondary } from 'src/utils/light.theme';
import ModifiedPriceComponent from 'src/common/ModifiedPriceComponent';
import NoteAndCustomize from 'src/screens/CartSummary/components/NoteAndCustomize';
import { colors } from 'src/utils/theme';

interface Props {
	product: any;
	item: any;
	unit_price: number;
	is_last: boolean;
	currency_symbol: string;
	container_is_display: any;
	unit: string;
	error_message: string;
	show_grouping_data: string;
}

const textStyle = {
	fontSize: '14px',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	overflow: 'hidden',
	minWidth: '5rem',
	maxWidth: '50rem',
	color: 'black',
};

const CartSummaryItem: React.FC<Props> = ({
	product,
	item,
	unit_price,
	is_last,
	currency_symbol,
	container_is_display,
	unit,
	error_message,
	show_grouping_data,
}) => {
	const { t } = useTranslation();
	const product_data = { ...item, ...product };
	const image = product_data?.media?.find((img_obj: any) => img_obj?.is_primary);
	const settings = useSelector((state: any) => state?.settings);
	const classes = useStyles();
	const theme: any = useTheme();
	const is_retail_mode = localStorage.getItem('retail_mode') === 'true';
	const is_small_screen = useMediaQuery('(max-width:1050px)');
	const { cart_container_config = {}, product_card_config = [] } = settings;
	// Do not delete
	const attributes = get_attributes_mapping(product_card_config, product_data);
	const base_price_per_unit = _.get(product, 'pricing.base_price', null);

	const handleRenderImageContainer = (data: any, calculated_price: number) => {
		const is_price_modified = _.get(data, 'is_price_modified', false);
		const modified_price = _.get(data, 'final_price', calculated_price);
		const discount_price = Number(unit_price) - get_discounted_value(data?.discount_type, data?.discount_value, unit_price);
		return (
			<Grid container>
				<Grid xs={4} sm={0} md={3} lg={2} xl={2}>
					<Box className={classes.box_container} ml={is_small_screen ? -2 : 0}>
						<Image
							imgClass={classes?.review_image}
							width={90}
							height={85}
							src={image?.url}
							fallbackSrc={PLACE_HOLDER_IMAGE}
							alt='product_img'
						/>
					</Box>
				</Grid>

				<Grid md={4} sm={6} xs={8}>
					<Box className={classes.cartItemTextContainer}>
						<CustomText style={textStyle} type='H6' className={classes.textStyle}>
							{`${product_data?.name} ${data?.is_custom_product ? ' Custom' : ''}`}
						</CustomText>
						<p>{`ID: ${product_data?.sku_id}`}</p>
						{!is_retail_mode && (
							<>
								{data?.discount_value || data?.discount_value === 0 ? (
									<Grid>
										<Grid sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
											<CustomText className={classes.text}>
												{t('CartSummary.ProductCard.Price', {
													price: get_formatted_price_with_currency(currency_symbol, discount_price),
												})}
											</CustomText>
											<CustomText className={classes.price_text} color={colors.secondary_text}>
												{t('CartSummary.ProductCard.Price', {
													price: get_formatted_price_with_currency(
														currency_symbol,
														data?.discount_campaign_id ? calculated_price : base_price_per_unit || calculated_price,
													),
												})}
											</CustomText>
											{!_.isEmpty(data?.discount_campaign_id) && (
												<CustomText
													type='CaptionBold'
													style={{
														...theme?.product?.discount_campaign,
													}}>
													{data?.discount_type === 'percentage'
														? `${data?.discount_value}% off`
														: ` ${get_formatted_price_with_currency(
																currency_symbol,
																data?.discount_value > calculated_price ? calculated_price : data?.discount_value,
														  )} off`}
												</CustomText>
											)}
										</Grid>
									</Grid>
								) : is_price_modified ? (
									<ModifiedPriceComponent
										modified_price={modified_price}
										unit_price={calculated_price}
										base_price={base_price_per_unit}
										single_item_price
										currency_symbol={currency_symbol}
									/>
								) : (
									<Grid sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
										<CustomText className={classes.text}>
											{t('CartSummary.ProductCard.Price', {
												price: get_formatted_price_with_currency(currency_symbol, calculated_price),
											})}
										</CustomText>
										{base_price_per_unit && base_price_per_unit > calculated_price && (
											<CustomText type='Caption' className={classes.price_text}>
												{t('CartSummary.ProductCard.Price', {
													price: get_formatted_price_with_currency(currency_symbol, base_price_per_unit),
												})}
											</CustomText>
										)}
									</Grid>
								)}
							</>
						)}
						{/* {!_.isEmpty(data?.discount_campaign_id) && (
							<Grid
								my={1}
								sx={{
									...theme?.product?.discount_campaign_banner,
								}}>
								<Icon iconName='IconDiscount2' color='#FFF' />
								<CustomText type='Subtitle' color='#FFF'>
									{truncate(data?.discount_campaign_name, { length: 35 }) || ''}
								</CustomText>
							</Grid>
						)} */}
						{/* 
								[suyash] commenting based on Ravish's confirmation,
								DO NOT DELETE
								 */}
						{!data?.is_custom_product &&
							attributes?.map((row: any, _index: number) => (
								<Grid
									container
									key={`attribute_row_${_index}`}
									style={{
										marginTop: '0',
										display: 'inline-flex',
										whiteSpace: 'nowrap',
										overflow: 'hidden',
									}}>
									{row?.attributes?.keys?.map((attr: any) => {
										const display_value = utils.transform_column_display(attr, product_data);
										if (!display_value) return <></>;

										return (
											<Grid item key={attr} className={classes.hinge_attr_value}>
												<CustomText
													type='Caption'
													color={secondary[700]}
													style={{
														maxWidth: '13.5rem',
														overflow: 'hidden',
														textOverflow: 'ellipsis',
													}}>
													{display_value}
												</CustomText>
											</Grid>
										);
									})}
								</Grid>
							))}
					</Box>
				</Grid>
			</Grid>
		);
	};

	const handleRenderPriceContainer = (data: any, calculated_price: number) => {
		const is_price_modified = _.get(data, 'is_price_modified', false);
		const modified_price = _.get(data, 'final_price', calculated_price);
		const temp_quantity = data?.quantity;
		const total_price = calculated_price * temp_quantity;
		const total_modified_price = modified_price * temp_quantity;
		const volume = (data?.product_volume_data?.[unit] ?? 0) * temp_quantity;
		const discount_price = (unit_price - get_discounted_value(data?.discount_type, data?.discount_value, unit_price)) * temp_quantity;
		return (
			<Grid textAlign={'right'} xs={4}>
				<Box className={classes.cartItemPrice} style={{ ...theme?.order_management?.custom_price_align }}>
					<CustomText style={textStyle} type='H6'>
						{temp_quantity}
					</CustomText>
				</Box>
				{!is_retail_mode && (
					<Box>
						{data?.discount_value || data?.discount_value === 0 ? (
							<React.Fragment>
								<CustomText className={classes.text}>
									{t('CartSummary.ProductCard.Price', {
										price: get_formatted_price_with_currency(currency_symbol, discount_price),
									})}
								</CustomText>
							</React.Fragment>
						) : is_price_modified ? (
							<>
								<ModifiedPriceComponent
									modified_price={total_modified_price}
									unit_price={total_modified_price}
									base_price={total_price}
									currency_symbol={currency_symbol}
									justify_content='flex-end'
									alignItems='flex-end'
								/>
							</>
						) : (
							<Box display='flex' justifyContent={'flex-end'} gap={1} alignItems='center'>
								<CustomText className={classes.text}>
									{t('CartSummary.ProductCard.Price', {
										price: get_formatted_price_with_currency(currency_symbol, total_price),
									})}
								</CustomText>
							</Box>
						)}
					</Box>
				)}
				{cart_container_config?.tenant_container_enabled && container_is_display && (
					<div>
						<CustomText type='Body'>
							{unit?.toUpperCase()}: {_.isNumber(volume) ? volume.toFixed(2) : '0.00'}
						</CustomText>
					</div>
				)}
				{!_.isEmpty(error_message) && (
					<CustomText color={error.main} type='Body'>
						{error_message}
					</CustomText>
				)}
			</Grid>
		);
	};

	const get_discount_label = (cart_product: any) => {
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
		<Grid className={(show_grouping_data && classes.product_card) || ''}>
			{_.map(item, (_value: any, key: any) => {
				if (_.isObject(item?.[key])) {
					const notesValue = _.get(item?.[key]?.meta, 'notes[0].value', '');
					const calculated_price = get_unit_price_of_product({ ...product, quantity: item?.[key]?.quantity });
					return (
						<Grid key={`item-${key}`}>
							<Grid className={!_.isEmpty(error_message) ? classes.error_header_container : classes.headerContainer}>
								{handleRenderImageContainer(item?.[key], calculated_price?.unit_price)}
								{handleRenderPriceContainer(item?.[key], calculated_price?.unit_price)}
							</Grid>
							<NoteAndCustomize product_data={item?.[key]} show_edit_btn={false} notesValue={notesValue} />

							{item?.[key]?.discount_type && !item?.[key]?.discount_campaign_id && (
								<Grid className={classes.discount_bar}>
									<Grid className={classes.discount_header}>
										<Image src={ImageLinks.DiscountIconChecked} imgClass={classes.discount_img} />
										<Grid> {get_discount_label(item[key])}</Grid>
									</Grid>
								</Grid>
							)}
							{!is_last && !show_grouping_data && <Divider style={{ marginBottom: 25 }} />}
						</Grid>
					);
				}
			})}
		</Grid>
	);
};

export default CartSummaryItem;
