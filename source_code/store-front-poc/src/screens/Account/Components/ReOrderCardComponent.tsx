import { Card } from '@mui/material';
import React, { MutableRefObject, useLayoutEffect, useRef, useState } from 'react';
import { Grid, Image, Tooltip, Chip } from 'src/common/@the-source/atoms';
import { Product } from 'src/screens/ProductListing/mock/ProductInterface';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import { get_product_detail } from 'src/screens/ProductListing/utils';
import _ from 'lodash';
import get_product_image from 'src/utils/ImageConstants';
import utils, { get_attributes_mapping, get_customer_metadata, get_product_metadata } from 'src/utils/utils';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { colors } from 'src/utils/theme';
import { Mixpanel } from 'src/mixpanel';
import Events from 'src/utils/events_constants';
import ImageLinks from 'src/assets/images/ImageLinks';

import CustomText from 'src/common/@the-source/CustomText';
import InventoryStatus from 'src/common/@the-source/molecules/Inventory/InventoryStatus';
import { t } from 'i18next';
import PriceView from 'src/common/@the-source/PriceView';

interface similarCardProps {
	product: Product;
	page_name?: any;
	section_name?: any;
	cart_item?: any;
	cart_error?: any;
	already_in_cart?: any;
	search_data?: any;
	discount_campaigns?: any;
}

const useStyles = makeStyles((theme: any) => ({
	root: {
		width: 'auto',
		margin: '5px 10px',
		height: 'fit-content',
		boxShadow: 'none',
		padding: '10px 5px',
		position: 'relative',
	},
	product_container: {
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		cursor: 'pointer',
		display: 'flex',
		alignItems: 'flex-end',
		gap: 1,
	},
	chip_style: {
		padding: '4px',
	},
	imageContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: '8px',
		overflow: 'hidden',
		height: '110px',
		width: '120px',
		position: 'relative',
		...theme?.product?.recommanded?.card,
	},
	priceContainer: {
		display: 'flex',
		alignItems: 'center',
	},
	crossPrice: {
		marginLeft: '4px',
		textDecoration: 'line-through',
		color: colors.secondary_text,
	},
	error_chip: {
		background: theme?.product?.reorder_card?.already_in_cart_background,
		padding: '5px',
		width: '100%',
		display: 'flex',
		justifyContent: 'center',
		position: 'absolute',
		bottom: 0,
	},
	base_price_text: {
		marginLeft: '4px',
		textDecoration: 'line-through',
		color: colors.secondary_text,
	},
}));

const ReOrderCard = ({
	product,
	page_name,
	section_name,
	cart_item,
	cart_error,
	already_in_cart,
	search_data,
	discount_campaigns,
}: similarCardProps) => {
	const login = useSelector((state: any) => state.login);
	const is_retail_mode = localStorage.getItem('retail_mode') === 'true';
	const is_logged_in = login?.status?.loggedIn;
	const { product_card_config = [], all_cards_config = {} } = useSelector((state: any) => state?.settings);
	const [show_ellipsis, set_show_ellipsis] = useState(false);
	const data_values = get_product_detail(product);
	const simillar_card_ref = useRef() as MutableRefObject<HTMLDivElement>;
	const price = product?.is_customizable ? product?.pricing?.price : search_data?.[product?.id]?.pricing?.price || product?.pricing?.price;

	const get_product_rows = _.get(all_cards_config, 'recommended.rows');
	const navigate = useNavigate();
	const classes = useStyles();
	const theme: any = useTheme();

	const checkOverflow = () => {
		if (simillar_card_ref?.current && !show_ellipsis) {
			const isOverflowing = simillar_card_ref?.current?.scrollWidth > simillar_card_ref?.current?.clientWidth;
			set_show_ellipsis(isOverflowing);
		}
	};

	const product_metadata = get_product_metadata(product);
	const customer_metadata = get_customer_metadata({ is_loggedin: true });

	const custom_variant_template = get_attributes_mapping(product_card_config, product);

	useLayoutEffect(() => {
		checkOverflow();
		window.addEventListener('resize', checkOverflow);
		return () => window.removeEventListener('resize', checkOverflow);
	}, [custom_variant_template]);

	const handleClick = (product_id: any) => {
		if (cart_error) return;
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

	return (
		<React.Fragment>
			<Card className={classes.root}>
				<Grid container direction='row' justifyContent='space-between'>
					<Grid sx={{ position: 'relative' }}>
						<Grid item className={classes.imageContainer}>
							<Image
								src={get_product_image(product, 'SIMILAR_DRAWER_CARD')}
								height='100%'
								width='100%'
								style={{ cursor: cart_error ? 'default' : 'pointer' }}
								onClick={() => handleClick(product?.id)}
							/>
							{(cart_error || already_in_cart) && (
								<Grid className={classes.error_chip}>
									<CustomText type='Caption'>
										{already_in_cart ? t('Common.QuickViewDrawer.AlreadyInCart') : t('Common.QuickViewDrawer.Discontinued')}
									</CustomText>
								</Grid>
							)}
						</Grid>

						{utils.is_prelogin_inventory(is_logged_in) && (
							<InventoryStatus variantType='chip' data={product} color={theme?.product?.inventory_status?.out_of_stock_chip?.color} />
						)}
					</Grid>
					<Grid container justifyContent='space-between' direction='column' xs={6} md={7} lg={7} sx={{ cursor: 'pointer' }}>
						<Grid container gap={1} mb={1}>
							{_.map(get_product_rows, (row: any) => (
								<React.Fragment>
									{row?.map((column: any, index: number) => {
										if (column?.type === 'price' || column?.key === 'pricing::price') {
											const currency = _.get(product, 'pricing.currency', '$');
											const key = data_values?.is_variant ? column?.variant_key : column?.product_key;

											if (utils.is_prelogin_price(is_logged_in)) {
												return (
													<Grid className={classes.product_container} sx={{ ...column.style }}>
														<Tooltip
															key={index}
															title={utils.get_column_display_value({ key }, product, price, data_values)}
															placement='top'
															onClose={() => {}}
															onOpen={() => {}}>
															{!is_retail_mode && (
																<Grid sx={{ display: 'flex', alignItems: 'center' }}>
																	<PriceView
																		product={product}
																		data_values={{ is_variant: true }}
																		column={{ variant_key: 'pricing::price', type: 'price' }}
																		discount_campaigns={discount_campaigns}
																		currency_symbol={currency}
																		styles={{ display: 'flex', gap: 1, alignItems: 'center', flexDirection: 'row', width: '100%' }}
																		custom_text_types={{
																			base_price_type: 'H6',
																		}}
																	/>
																</Grid>
															)}
														</Tooltip>
													</Grid>
												);
											} else {
												return <Image src={ImageLinks.unlock_price} width='100px' alt='banner_image' />;
											}
										} else {
											return (
												<Grid className={classes.product_container} sx={{ ...column.style }}>
													<Tooltip
														key={index}
														title={utils.get_column_display_value(column, product, price, data_values)}
														placement='top'
														onClose={() => {}}
														onOpen={() => {}}>
														{utils.get_column_display_value(column, product, price, data_values)}
													</Tooltip>
												</Grid>
											);
										}
									})}
								</React.Fragment>
							))}
							{cart_item && (
								<Chip
									className={classes.chip_style}
									size={'small'}
									label={t('Common.QuickViewDrawer.LastOrdered', {
										quantity: cart_item?.quantity,
										unit: cart_item?.quantity > 1 ? t('Common.QuickViewDrawer.Units') : t('Common.QuickViewDrawer.Unit'),
									})}
								/>
							)}
						</Grid>
					</Grid>
				</Grid>
			</Card>
		</React.Fragment>
	);
};

export default ReOrderCard;
