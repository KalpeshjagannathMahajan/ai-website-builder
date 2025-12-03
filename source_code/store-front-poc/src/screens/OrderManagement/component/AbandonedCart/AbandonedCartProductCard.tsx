import { Card } from '@mui/material';
import React, { MutableRefObject, useLayoutEffect, useRef, useState } from 'react';
import { Grid, Image, Typography, Tooltip, Icon } from 'src/common/@the-source/atoms';
import { Product } from 'src/screens/ProductListing/mock/ProductInterface';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import { get_product_detail } from 'src/screens/ProductListing/utils';
import _ from 'lodash';
import get_product_image from 'src/utils/ImageConstants';
import utils, { get_attributes_mapping, get_customer_metadata, get_product_metadata } from 'src/utils/utils';
import { makeStyles } from '@mui/styles';
import { colors } from 'src/utils/theme';
import { secondary } from 'src/utils/light.theme';
import { Mixpanel } from 'src/mixpanel';
import Events from 'src/utils/events_constants';
import InventoryStatus from 'src/common/@the-source/molecules/Inventory/InventoryStatus';
import CustomText from 'src/common/@the-source/CustomText';
import { get_formatted_price_with_currency } from 'src/utils/common';

interface AbandonedCartProductCardProps {
	product: Product;
	rec_card_template: any;
	page_name?: any;
	section_name?: any;
	cart_info?: any;
}

const useStyles = makeStyles(() => ({
	remove_icon: {
		border: 'none',
		background: '#EBEDD9',
		color: 'grey',
		width: '20px',
		height: '20px',
		padding: '7px',
		borderRadius: '50px',
		cursor: 'pointer',
		marginRight: '6px',
	},
	add_icon: {
		border: 'none',
		background: '#16885F',
		color: 'white',
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
		background: '#fff',
		height: '34px',
		borderRadius: '10px',
		color: '#16885F',
		width: '100%',
		cursor: 'pointer',
		border: '1px solid #D1D6DD',
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
	review_icon_style: {
		backgroundColor: `${colors.white}`,
		borderRadius: '2.1px',
	},
}));

const AbandonedCartProductCard = ({
	product,
	rec_card_template = {},
	page_name,
	section_name,
	cart_info,
}: AbandonedCartProductCardProps) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const [show_ellipsis, set_show_ellipsis] = useState(false);
	const [price] = useState(product?.pricing?.price);
	const simillar_card_ref = useRef() as MutableRefObject<HTMLDivElement>;
	const currency = useSelector((state: any) => state?.settings?.currency);
	const { product_card_config = [], all_cards_config = {} } = useSelector((state: any) => state?.settings);

	const data_values = get_product_detail(product);
	const product_metadata = get_product_metadata(product);
	const get_product_rows = _.get(all_cards_config, 'recommended.rows');
	const customer_metadata = get_customer_metadata({ is_loggedin: true });
	const custom_variant_template = get_attributes_mapping(product_card_config, product);

	const checkOverflow = () => {
		if (simillar_card_ref?.current && !show_ellipsis) {
			const isOverflowing = simillar_card_ref?.current?.scrollWidth > simillar_card_ref?.current?.clientWidth;
			set_show_ellipsis(isOverflowing);
		}
	};

	const handleClick = () => {
		if (cart_info?.is_custom_product) {
			navigate(`${RouteNames.product.product_detail.routing_path}${product?.parent_id}`);
		} else {
			navigate(`${RouteNames.product.product_detail.routing_path}${product?.id}`);
		}

		Mixpanel.track(Events.PRODUCT_CARD_CLICKED, {
			tab_name: 'abandoned_cart_page',
			page_name,
			section_name,
			subtab_name: '',
			customer_metadata,
			product_metadata,
		});
	};

	useLayoutEffect(() => {
		checkOverflow();
		window.addEventListener('resize', checkOverflow);
		return () => window.removeEventListener('resize', checkOverflow);
	}, [custom_variant_template]);

	return (
		<React.Fragment>
			<Card
				style={{
					width: '100%',
					height: 'fit-content',
					boxShadow: 'none',
					padding: '10px 5px',
					position: 'relative',
					border: '1px solid rgba(0, 0, 0, 0.12)',
				}}>
				<Grid container direction='row' justifyContent='space-between'>
					<Grid sx={{ position: 'relative' }}>
						<Image
							src={get_product_image(product, 'SIMILAR_DRAWER_CARD')}
							width='184px'
							height={'142px'}
							style={{ borderRadius: '8px' }}
							onClick={() => handleClick()}
						/>
						<InventoryStatus variantType='chip' data={product} />
					</Grid>
					<Grid container justifyContent='space-between' direction='column' width='310px' sx={{ cursor: 'pointer' }}>
						<Grid container gap={1} mb={1}>
							<Grid container direction='row' gap={1} alignItems='center' bgcolor={'#F0F6FF'} borderRadius={'6px'} padding={'6px 10px'}>
								<CustomText type='Subtitle'>{get_formatted_price_with_currency(currency, cart_info?.final_total)}</CustomText>
								<Icon iconName='IconCircleFilled' sx={{ height: '8px', width: '8px' }} />
								<CustomText>{cart_info?.quantity > 1 ? `${cart_info?.quantity} units` : `${cart_info?.quantity} unit`}</CustomText>
							</Grid>
							{_.map(get_product_rows || rec_card_template?.rows, (row: any) => (
								<React.Fragment>
									{row?.map((column: any, index: number) => {
										if (column?.type === 'price') {
											return (
												<Grid
													onClick={() => handleClick(product?.id)}
													sx={{ ...column.style, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', cursor: 'pointer' }}>
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
										} else {
											return (
												<Grid
													onClick={() => handleClick(product?.id)}
													sx={{ ...column.style, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', cursor: 'pointer' }}>
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
							{custom_variant_template?.map((row: any, _index: number) => (
								<Grid
									container
									className={_index === 0 ? classes.hinge_product_detail : classes.hinge_product_detail_nth}
									width={'100%'}
									key={`attribute_row_${_index}`}>
									<div ref={simillar_card_ref}>
										{row?.attributes?.keys?.map((key: any) => {
											const value = utils.get_column_display_value(key, product, price, data_values);
											if (!value) {
												return <></>;
											}
											return (
												<Tooltip title={value} key={key} placement='top' onClose={() => {}} onOpen={() => {}}>
													<Grid onClick={() => handleClick(product?.id)} item className={classes.hinge_attr_value}>
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
					</Grid>
				</Grid>
			</Card>
		</React.Fragment>
	);
};

export default AbandonedCartProductCard;
