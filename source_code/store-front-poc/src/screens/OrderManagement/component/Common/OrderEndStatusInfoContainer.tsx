/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
import { AccountList } from 'src/common/@the-source/molecules';
import { Accordion, Box, Chip, Grid, Icon, Image } from 'src/common/@the-source/atoms';
import React, { useContext, useEffect, useState } from 'react';
import OrderManagementContext from '../../context';
import { Divider, Tooltip } from '@mui/material';
import {
	COLLAPSE_SECTION_TYPE,
	SALESREP_ATTRS_VALUES_KEYS,
	SPECIAL_DOCUMENT_ATTRIBUTE,
	accordion_initial_state,
	LOADING_CONSTANT,
} from '../../constants';
import _, { isEmpty } from 'lodash';
import { get_discounted_value } from 'src/screens/CartSummary/helper';
import CartCheckoutCard from '../Cart/CartCheckoutCard';
import NotesSection from '../Sections/NotesSection';
import BuyerInfoSkeleton from './BuyerInfoSkeleton';
import { useTranslation } from 'react-i18next';
import ShowMoreSection from '../Sections/ShowMoreSection';
import CustomStepper from './CustomStep';
import CustomStatusChip from './CustomStatusChip';
import { PLACE_HOLDER_IMAGE } from 'src/screens/ProductDetailsPage/constants';
import { fulfilment_status_constants, submit_form_column } from '../../mock/document';
import utils, { allValuesEmpty, get_attributes_mapping } from 'src/utils/utils';
import { useSelector } from 'react-redux';
import CustomText from 'src/common/@the-source/CustomText';
import PaymentTable from './PaymentTable';
import PaymentMethodSection from '../Sections/PaymentMethodSection';
import {
	formattedValue,
	get_currency_icon,
	get_formatted_price_with_currency,
	get_unit_price_of_product,
	isoToDateDay,
} from 'src/utils/common';
import { useNavigate } from 'react-router-dom';
import settings from 'src/utils/api_requests/setting';
import { useDispatch } from 'react-redux';
import { cartContainerConfig } from 'src/actions/setting';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';
import CustomToast from 'src/common/CustomToast';
import DOMPurify from 'dompurify';
import ImageLinks from 'src/assets/images/ImageLinks';
import AccordionProductListing from 'src/common/AccordionProductListing';
import CustomerConsent from '../Sections/CustomerConsent';
import { custom_stepper_text_color, primary, text_colors } from 'src/utils/light.theme';
import useMediaQuery from '@mui/material/useMediaQuery';
import ChangeFulfilmentStatusModal from './ChangeFulfilmentStatusModal';
import TagHeader from './TagHeader';
import DocumentTagModal from './DocumentTagModal';
import RouteNames from 'src/utils/RouteNames';
import NoteAndCustomize from 'src/screens/CartSummary/components/NoteAndCustomize';
import ConsolidatedCard from '../Cart/ConsolidatedCard';
import DisplayPriorityCard from 'src/common/DisplayPriorityCard';
import VirtualList from 'src/common/VirtualList';
import { transform_image_url } from 'src/utils/ImageConstants';
import ChangePaymentStatusModal from './ChangePaymentStatusModal';
import { RESET_CATALOG_MODE_PARAMS_KEY } from 'src/screens/Presentation/constants';
import ReviewCartModal from 'src/screens/Account/Components/ReviewCartModal';

const text_style = {
	fontSize: 14,
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	flex: '0 1 auto',
	maxWidth: '100%',
};

// const bold_text_style = {
// 	...text_style,
// 	fontWeight: 'bold',
// 	color: '#000',
// 	marginBottom: '8px',
// };

const click_text_style = {
	fontSize: 14,
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	flex: '0 1 auto',
	maxWidth: '80%',
	cursor: 'pointer',
};

// const address_text_style = {
// 	fontSize: 14,
// 	overflow: 'hidden',
// 	whiteSpace: 'normal',
// 	flex: '0 1 auto',
// 	maxWidth: '80%',
// };

const order_info_style = {
	color: ' var(--grey-800, #4F555E)',
	fontSize: '12px',
	fontStyle: 'normal',
	fontWeight: 400,
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
};

const cart_header_style = {
	fontSize: 14,
	opacity: 0.6,
	padding: '0rem 1rem 0rem 1rem',
};

const empty_card_style = {
	display: 'flex',
	flexDirection: 'column',
	gap: 2,
	justifyContent: 'center',
	alignItems: 'center',
	minHeight: '15rem',
	height: 'auto',
};

// const icon_style = {
// 	color: '#9AA0AA',
// 	transform: 'scale(1.8)',
// };

const product_card = {
	background: primary?.contrastText,
	borderRadius: '1rem',
	cursor: 'pointer',
};

function OrderEndStatusInfoContainer() {
	const {
		section_data,
		attribute_data,
		document_data,
		buyer_section_loading,
		get_order_info,
		buyer_info_data,
		buyer_details_form,
		get_country_label,
		handle_drawer_type,
		document_type,
		doc_status,
		loader,
		handle_loading_state,
		get_order_summary,
		buyer_id,
		set_success_toast,
		success_toast,
		expanded: product_expanded,
		handleChange: handle_product_accordian,
		set_expanded: set_product_expanded,
		document_tag_form,
		set_review_modal,
		review_modal,
		handle_navigation_to_draft,
		set_download_file_type,
	} = useContext(OrderManagementContext);
	const { download_loader } = loader;
	const thankyou = useSelector((state: any) => state?.settings?.show_thankyou_page) || false;
	const thankyou_url = useSelector((state: any) => state?.settings?.thankyou_url) || '';
	const is_retail_mode = localStorage.getItem('retail_mode') === 'true';
	const cart_container_config = useSelector((state: any) => state?.settings?.cart_container_config);
	const cart_grouping_config = useSelector((state: any) => state?.settings?.cart_grouping_config) || {};
	const document_line_item_config = useSelector((state: any) => state?.settings?.document_line_item_config) || [];
	const { product_card_config = [], show_download_at_order_detail = true } = useSelector((state: any) => state?.settings);
	const dispatch = useDispatch();
	const [expanded, set_expanded] = useState<any>(accordion_initial_state);
	const [send_order_confirmation, set_send_order_confirmation] = useState(false);
	const [toast, toggle_toast] = useState({ show: false, message: '', title: '', status: 'success' });
	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';
	const is_store_front = VITE_APP_REPO === 'store_front';
	const is_small_screen = useMediaQuery('(max-width:900px)');
	const classes = useStyles();

	// const handle_get_cols = (column_data: any) => {
	// 	if (is_ultron) {
	// 		return column_data;
	// 	}

	// 	const updated_columns = {
	// 		...column_data,
	// 		columns: _.filter(column_data?.columns, (column) => column.name !== 'offered_price'),
	// 	};
	// 	if (is_retail_mode) {
	// 		const temp_cols = { ...column_data, columns: _.filter(column_data?.columns, (column) => column?.dtype !== 'price') };
	// 		return temp_cols;
	// 	}
	// 	return updated_columns;
	// };

	const columns = _.map(submit_form_column?.columns, (curr) => {
		if (curr?.name === 'item_status') {
			return undefined;
		} else return curr;
	}).filter((curr) => !_.isUndefined(curr));

	const cols = useSelector((state: any) => state?.settings?.order_table_structure) ?? { columns };
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { cart_details, fulfillment_status, catalog_name, document_items } = document_data;
	const { items = {}, container_data, cart_total_breakdown = {} } = cart_details;
	const order_info = get_order_info(document_data);
	const products = cart_details?.products;
	const fulfillments = _.get(document_data, 'fulfillment_details');
	const theme: any = useTheme();

	const meta = _.get(document_data, 'meta');
	const events = _.get(meta, 'events');
	const line_items = _.get(events, 'nodes') || [];
	const grouping_data = cart_details?.meta?.grouping_data?.groups || {};
	const currency = cart_details?.meta?.pricing_info?.currency_symbol;
	const toggle_button_value = container_data?.cart_volume_unit;
	const show_grouping_data = utils.show_grouping_data(cart_grouping_config, grouping_data);
	const written_for_name = _.get(document_data, SALESREP_ATTRS_VALUES_KEYS.WRITTEN_FOR, null);
	const written_by_name = _.get(document_data, SALESREP_ATTRS_VALUES_KEYS.WRITTEN_BY, null);
	const written_for_name_display = _.find(
		section_data?.sales_rep_details_section?.attributes,
		(item) => item?.id === 'written_for',
	)?.is_display;
	const written_by_name_display = _.find(
		section_data?.sales_rep_details_section?.attributes,
		(item) => item?.id === 'written_by',
	)?.is_display;

	const handle_change = (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
		set_expanded((prev: any) => ({ ...prev, [panel]: newExpanded ? [panel] : [] }));
	};
	const handle_empty_state = (icon: any, label: string) => {
		return (
			<Grid className={classes.viewDetailsCard} width={'100%'} sx={empty_card_style}>
				<Icon iconName={icon} className={classes.order_end_status_icon_style} />
				<CustomText style={{ fontWeight: 400 }} color={theme?.order_management?.order_end_status_info_container?.custom_color}>
					{label}
				</CustomText>
			</Grid>
		);
	};

	const handle_render_table_header = () => {
		return (
			<Grid container className={classes.cartTableHeaderContainer} mb={2.5}>
				{_.map(cols?.columns, (item: any) => {
					const col_span = 12 / cols?.columns?.length;
					if (item?.name === 'item_status' && document_data?.type === 'quote') return null;
					return (
						<Grid key={item?.name} item sm={col_span} md={col_span} lg={col_span} xl={col_span} textAlign={item?.align}>
							<CustomText type='H6' style={{ ...cart_header_style }}>
								{item?.label}
							</CustomText>
						</Grid>
					);
				})}
			</Grid>
		);
	};

	//handle product table header for smaller screens
	const handle_render_table_header_v2 = () => {
		return (
			<Grid container className={classes.cartTableHeaderContainerV2} mb={1.2}>
				<Grid item xs={is_retail_mode ? 8 : 10} sm={is_retail_mode ? 8 : 10} md={is_retail_mode ? 8 : 10}>
					<CustomText type='H6' style={cart_header_style}>
						{t('OrderManagement.OrderEndStatusInfoContainer.ProductDetails')}
					</CustomText>
				</Grid>
				{/* 
				<Grid item xs={2} sm={2} md={2} textAlign={'center'}>
					<CustomText type='H6' style={cart_header_style}>
						{t('OrderManagement.OrderEndStatusInfoContainer.Qty')}
					</CustomText>
				</Grid> */}

				{!is_retail_mode && (
					<Grid item xs={2} sm={2} md={2} textAlign={'right'}>
						<CustomText type='H6' style={cart_header_style}>
							{t('OrderManagement.OrderEndStatusInfoContainer.Total')}
						</CustomText>
					</Grid>
				)}
			</Grid>
		);
	};

	const handle_render_info_section = () => {
		return (
			<Grid container className={classes?.buyerInfoContainer} gap={1.5}>
				{section_data?.user_details?.map((ele: any) => {
					let id = ele.attributes[0]?.id;
					const updated_attribute_detail = attribute_data[id] || [];
					const is_address = _.includes([SPECIAL_DOCUMENT_ATTRIBUTE.shipping_address, SPECIAL_DOCUMENT_ATTRIBUTE.billing_address], id);
					const is_contact = _.includes([SPECIAL_DOCUMENT_ATTRIBUTE.primary_contact], id);

					const is_shipping_address = _.includes([SPECIAL_DOCUMENT_ATTRIBUTE.shipping_address], id);
					const is_billing_address = _.includes([SPECIAL_DOCUMENT_ATTRIBUTE.billing_address], id);

					const additional_field_values: any = [];
					const attr_keys = Object?.keys(updated_attribute_detail) || [];

					if (is_address || is_contact) {
						_.map(attr_keys, (key) => {
							if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/?.test(key)) {
								additional_field_values.push(key);
							}
						});
					}

					if (ele?.is_display !== false) {
						return (
							<Grid item xs={12} sm={9} md={3.8} lg={3.8} xl={3.8} key={id}>
								<CustomText
									type='H6'
									style={{ marginBottom: 1, ...text_style }}
									color={theme?.order_management?.order_end_status_info_container?.custom_text_color}>
									{ele?.name}
								</CustomText>
								{is_address &&
									is_shipping_address &&
									allValuesEmpty(updated_attribute_detail) &&
									handle_empty_state('IconTruckDelivery', t('OrderManagement.OrderEndStatusInfoContainer.ShippingAddress'))}
								{is_address &&
									is_billing_address &&
									allValuesEmpty(updated_attribute_detail) &&
									handle_empty_state('IconReceipt', t('OrderManagement.OrderEndStatusInfoContainer.BillingAddress'))}
								{is_address && !allValuesEmpty(updated_attribute_detail) && (
									<Box style={{ lineHeight: 2 }}>
										<DisplayPriorityCard
											entity='addresses'
											buyer_fields={buyer_details_form}
											item={updated_attribute_detail}
											is_editable={false}
											text_type='Body'
											from_order={true}
											is_bold={false}
										/>
									</Box>
								)}

								{is_contact &&
									allValuesEmpty(updated_attribute_detail) &&
									handle_empty_state('user', t('OrderManagement.OrderEndStatusInfoContainer.Contact'))}
								{is_contact && !allValuesEmpty(updated_attribute_detail) && (
									<Box style={{ lineHeight: 2 }}>
										<DisplayPriorityCard
											entity='contacts'
											buyer_fields={buyer_details_form}
											item={updated_attribute_detail}
											is_editable={false}
											text_type='Body'
											from_order={true}
											is_bold={false}
										/>
									</Box>
								)}
							</Grid>
						);
					}
				})}
			</Grid>
		);
	};

	const handle_render_back_order_chip = (item: any) => {
		if (item?.backorder_reserved_quantity > 0) {
			return (
				<Grid className={classes.parent_container} my={1}>
					<Box bgcolor={theme?.order_management?.order_end_status_info_container?.box_bgcolor} className={classes.status_container}>
						<CustomText type='CaptionBold' color={theme?.order_management?.order_end_status_info_container?.custom_box_color}>
							Back Order
						</CustomText>
					</Box>
				</Grid>
			);
		}
	};

	const show_container = () => {
		return (
			cart_container_config?.tenant_container_enabled && container_data?.container_is_display && !_.isEmpty(container_data?.containers)
		);
	};

	const handle_product_navigate = (product: any, cart_data?: any) => {
		if (!cart_data?.is_custom_product && !cart_data?.is_product_modified && product?.product_state !== 'ADHOC' && product?.is_active) {
			window.open(`${RouteNames.product.product_detail.routing_path}${product?.id}?${RESET_CATALOG_MODE_PARAMS_KEY}=true`, '_blank');
		}
	};

	const handle_render_product_card = (product_key: any, index: number) => {
		const product: any = products[product_key];
		const product_data = { ...items?.[product_key], ...product };
		const image = product_data?.media?.find((img_obj: any) => img_obj?.is_primary) || _.head(product_data?.media);
		const col_span = 12 / cols?.columns?.length;

		const attributes = get_attributes_mapping(product_card_config, product_data);
		const currency_symbol = product?.pricing?.currency;
		let unit_price = product?.pricing?.price;
		const cart_volume_unit = container_data?.cart_volume_unit || '';

		const should_use_discount_price = (cart_product_data: any) => {
			return (
				!_.isNull(cart_product_data?.discount_value) &&
				!_.isUndefined(cart_product_data?.discount_value) &&
				cart_product_data?.discount_value > 0 &&
				!_.isUndefined(cart_product_data?.discounted_price) &&
				cart_product_data?.discounted_price !== 0
			);
		};
		return (
			<div key={`product-${index}`} style={{ margin: '10px 0px' }}>
				{_.map(items?.[product?.id], (_value, key) => {
					if (_.isObject(items?.[product?.id][key])) {
						const document_item = _.get(document_items, product?.id);
						const cart_product_data = items?.[product?.id]?.[key];
						const notes_value = _.get(cart_product_data?.meta, 'notes[0].value', '');
						const temp_quantity = cart_product_data?.quantity;
						unit_price = get_unit_price_of_product({ ...product_data, key, quantity: temp_quantity })?.unit_price;
						const discount_price = should_use_discount_price(cart_product_data)
							? cart_product_data?.discounted_price
							: unit_price - get_discounted_value(cart_product_data?.discount_type, cart_product_data?.discount_value, unit_price);
						const is_price_modified = cart_product_data?.is_price_modified || false;
						const modified_price = cart_product_data?.final_price;
						const total_price = (is_price_modified ? modified_price : discount_price) * temp_quantity;

						const get_discount_label_value = () => {
							switch (cart_product_data?.discount_type) {
								case 'value':
									return `(-${get_formatted_price_with_currency(currency_symbol, cart_product_data?.discount_value)})`;
								case 'percentage':
									return `(-${cart_product_data?.discount_value?.toFixed(2)}%)`;
								default:
									return null;
							}
						};

						const product_line_item: any = {
							sku_id: product_data.sku_id,
							media: image?.url,
							name: product_data?.name,
							status: product?.status,
							price: unit_price,
							base_price: product_data?.pricing?.base_price,
							offered_price: is_price_modified ? modified_price : discount_price,
							quantity: cart_product_data?.quantity || 0,
							total: cart_product_data?.final_total || total_price,
							item_status: cart_product_data?.quantity_breakdown,
							volume: product_data?.volume,
						};

						const volume_unit = _.toUpper(cart_volume_unit);
						const volume_to_show = product_data?.volume_data?.[volume_unit] || 0;
						const total_volume = volume_to_show * product_line_item?.quantity;

						const handle_render_col_dtype = (dtype: any, value: any, key: any) => {
							switch (dtype) {
								case 'image':
									return (
										<Box className={classes.image_box} onClick={() => handle_product_navigate(product_data, cart_product_data)}>
											<Image width={90} height={85} src={transform_image_url(image?.url, 'ORDER_END')} />
										</Box>
									);
								case 'price':
									return (
										<React.Fragment>
											{key === 'price' && (
												<>
													{is_retail_mode ? (
														<Image src={ImageLinks.price_locked} width={140} height={26} />
													) : (
														<CustomText type='H6'>
															{t('OrderManagement.OrderEndStatusInfoContainer.Amount', {
																price: get_formatted_price_with_currency(currency_symbol, product_line_item?.offered_price),
															})}
														</CustomText>
													)}
													{!is_retail_mode &&
														(product_line_item?.offered_price < product_line_item?.base_price ||
															product_line_item?.offered_price !== value) && (
															<CustomText type='Caption' color='#00000099'>
																{/* {get_discount_label_value()}{' '} */}
																<del>
																	{t('OrderManagement.OrderEndStatusInfoContainer.Amount', {
																		price: get_formatted_price_with_currency(currency_symbol, product_line_item?.base_price || value),
																	})}
																</del>
															</CustomText>
														)}
												</>
											)}
											{key === 'offered_price' && (
												<>
													<CustomText type='H6'>
														{t('OrderManagement.OrderEndStatusInfoContainer.Amount', {
															price: get_formatted_price_with_currency(currency_symbol, value),
														})}
														{product_line_item.price !== value && (
															<CustomText type='Caption' color='#00000099'>
																{get_discount_label_value()}{' '}
															</CustomText>
														)}
													</CustomText>
												</>
											)}
											{key === 'total' && (
												<>
													{is_retail_mode ? (
														<Image src={ImageLinks.price_locked} width={140} height={26} />
													) : (
														<CustomText type='H6'>
															{t('OrderManagement.OrderEndStatusInfoContainer.Amount', {
																price: get_formatted_price_with_currency(currency_symbol, value),
															})}
														</CustomText>
													)}
													{show_container() && (
														<CustomText type='Body'>
															{cart_volume_unit?.toUpperCase()}: {_.isNumber(total_volume) ? total_volume.toFixed(2) : '0.00'}
														</CustomText>
													)}
												</>
											)}
										</React.Fragment>
									);
								case 'number':
									const org = _.get(cart_product_data, 'quantity_breakdown.original.quantity', 0);
									return (
										<>
											<CustomText type='H6'>{value}</CustomText>
											{org !== 0 && (
												<CustomText type='Caption' color='#00000099'>
													<del>{value !== org && !_.isEmpty(document_line_item_config) ? `(${org})` : ''}</del>
												</CustomText>
											)}
										</>
									);

								case 'status':
									return (
										<React.Fragment>
											{_.isArray(product?.status)
												? product?.status?.map((ele: any) => (
														<Box display='flex' alignItems={'center'} gap={2} key={ele}>
															<CustomText type='Body'>{ele?.quantity}</CustomText>
															<CustomText type='Body'>{_.capitalize(ele?.value)}</CustomText>
														</Box>
												  ))
												: '--'}
										</React.Fragment>
									);
								case 'item_status':
									if (document_data?.type === 'quote') return null;
									return _.map(document_line_item_config, (curr) => {
										const obj = value?.[curr?.key];

										return (
											<Grid container gap={1}>
												<CustomText type='Caption' color={curr?.styles_table?.color}>
													{curr?.label_table}
													{` (${obj?.quantity || 0}) :`}
												</CustomText>
												<CustomText type='Caption' style={curr?.styles_table}>
													{obj?.quantity
														? t('OrderManagement.OrderEndStatusInfoContainer.Amount', {
																price: get_formatted_price_with_currency(currency_symbol, obj?.total),
														  })
														: '--'}
												</CustomText>
											</Grid>
										);
									});
								case 'text':
									if (key === 'name') {
										return (
											<Box width='85%' sx={{ cursor: 'pointer' }} onClick={() => handle_product_navigate(product_data, cart_product_data)}>
												<CustomText type='H6' style={{ click_text_style, mb: 0.5, fontSize: 14 }}>
													{`${product_data?.name} ${cart_product_data?.is_custom_product ? ' Custom' : ''}`}
												</CustomText>
												{handle_render_back_order_chip(document_item)}
												{/* 
													[suyash] commenting based on Ravish's confirmation,
													DO NOT DELETE
													*/}
												{/* {!cart_product_data?.is_custom_product &&
														attributes?.map((row: any, _index: number) => (
															<Grid container className={classes.product_attribute_detail} key={`attribute_row_${_index}`}>
																{row?.attributes?.keys?.map((attr: any, key: number) => {
																	const value = get_column_display_value(attr, product_data);
																	if (!value) {
																		return <></>;
																	}
																	return (
																		<Box display='flex' className={classes.hinge_attr_value} alignItems='center' key={key}>
																			<CustomText type='Caption' color={secondary[700]} className={classes.hinge_custom_text}>
																				{value}
																			</CustomText>
																		</Box>
																	);
																})}
															</Grid>
													))} */}
											</Box>
										);
									} else if (key === 's_no') {
										return <CustomText style={{ click_text_style, opacity: 0.6 }}># {index + 1}</CustomText>;
									}
									return (
										<CustomText
											style={{ click_text_style, opacity: 0.6 }}
											onClick={() => handle_product_navigate(product_data, cart_product_data)}>
											{product_data?.sku_id}
										</CustomText>
									);
							}
						};

						const render_order_amount_detail = (isToolTip: boolean = false, is_small_screen: boolean = false) => {
							return (
								<>
									{is_retail_mode && is_small_screen ? (
										<Image src={ImageLinks.price_locked} width={100} height={17} />
									) : (
										<CustomText type='Subtitle' className={!isToolTip && is_small_screen ? classes.truncateText : ''}>
											{t('OrderManagement.OrderEndStatusInfoContainer.Amount', {
												symbol: currency_symbol,
												price: cart_product_data?.final_total?.toFixed(2) || (discount_price * cart_product_data?.quantity)?.toFixed(2),
											})}
										</CustomText>
									)}
								</>
							);
						};
						const render_quantity_content = (isToolTip = false, is_small_screen = false) => {
							return (
								<CustomText type='Subtitle' className={!isToolTip && is_small_screen ? classes.truncateText : ''}>
									{t('OrderManagement.OrderEndStatusInfoContainer.Qty')} {cart_product_data?.quantity}
								</CustomText>
							);
						};

						return (
							<Grid container sx={show_grouping_data && product_card}>
								<Grid
									container
									key={index}
									className={classes.cartItemContainer}
									alignItems={show_container() ? 'flex-start' : 'center'}
									px={1}>
									{cols?.columns?.map((item: any) => (
										<Grid key={item?.name} item sm={col_span} md={col_span} lg={col_span} xl={col_span} textAlign={item?.align}>
											{handle_render_col_dtype(item?.dtype, product_line_item[item?.name], item?.name)}
										</Grid>
									))}
									<NoteAndCustomize
										product_data={cart_product_data}
										show_edit_btn={false}
										notesValue={notes_value}
										style={{ width: 'calc(100% + 2rem)', margin: '1rem -1rem -1.1rem -1rem', padding: '0.5rem 0rem 0.5rem 1rem' }}
									/>
								</Grid>

								<Grid container key={index} className={classes.cartItemContainerV2} alignItems='center'>
									<Grid
										item
										maxWidth={'65%'}
										xs={is_retail_mode ? 8 : 10}
										sm={is_retail_mode ? 8 : 10}
										md={is_retail_mode ? 8 : 10}
										marginLeft={'.5rem'}>
										<Box display='flex'>
											<Box className={classes.image_box} onClick={() => handle_product_navigate(product_data, cart_product_data)}>
												<Image
													width={90}
													height={85}
													src={image?.url}
													fallbackSrc={PLACE_HOLDER_IMAGE}
													style={{ borderRadius: '8px', border: theme?.order_management?.order_end_status_info_container?.border }}
												/>
											</Box>
											<Box
												className={classes.cartItemTextContainer}
												style={{
													overflow: 'hidden',
												}}
												onClick={() => handle_product_navigate(product_data, cart_product_data)}>
												<CustomText style={{ ...text_style }} type='H6'>
													{`${product_data?.name} ${cart_product_data?.is_custom_product ? ' Custom' : ''}`}
												</CustomText>
												<p>{`ID: ${product_data?.sku_id}`}</p>
												{!is_retail_mode && (
													<CustomText style={text_style} type='H6'>
														{t('OrderManagement.OrderEndStatusInfoContainer.Amount', {
															price: get_formatted_price_with_currency(currency_symbol, unit_price),
														})}
													</CustomText>
												)}
												{handle_render_back_order_chip(document_item)}
												{/* 
													[suyash] commenting based on Ravish's confirmation,
													DO NOT DELETE
													*/}
												{/* {!cart_product_data?.is_custom_product &&
														attributes?.map((row: any, _index: number) => (
															<Grid container className={classes.product_attribute_detail} key={`attribute_row_${_index}`}>
																{row?.attributes?.keys?.map((attr: any, key: number) => {
																	const display_value = get_column_display_value(attr, product_data);
																	if (!display_value) return <></>;

																	return (
																		<Box display='flex' className={classes.hinge_attr_value} alignItems='center' key={key}>
																			<CustomText type='Caption' color={secondary[700]} className={classes.hinge_custom_text}>
																				{display_value}
																			</CustomText>
																		</Box>
																	);
																})}
															</Grid>
													))} */}
											</Box>
										</Box>
									</Grid>

									<Grid item xs={12} sm={1.5} md={1} sx={{ flexBasis: 'auto', minHeight: '87px' }}>
										<Grid item xs={8} sm={12} md={12} textAlign='right' sx={{ maxWidth: 'none' }}>
											<Tooltip placement='top' arrow title={render_order_amount_detail(true)}>
												<span>{render_order_amount_detail(false, is_small_screen)}</span>
											</Tooltip>
										</Grid>
										<Grid container direction='column' alignItems='flex-end' mt={1}>
											<Grid display='flex' flexDirection='row' gap={1} style={{ maxWidth: '85%' }}>
												<Tooltip placement='top' arrow title={render_quantity_content(true)}>
													<span className={classes.truncateText}>{render_quantity_content(false, is_small_screen)}</span>
												</Tooltip>
											</Grid>
											<CustomText type='Caption' color='#00000099'>
												<del>
													{cart_product_data?.quantity !== cart_product_data?.quantity_breakdown?.original?.quantity &&
													!_.isEmpty(document_line_item_config)
														? `(${cart_product_data?.quantity_breakdown?.original?.quantity})`
														: ''}
												</del>
											</CustomText>
										</Grid>
									</Grid>

									<NoteAndCustomize
										product_data={cart_product_data}
										show_edit_btn={false}
										notesValue={notes_value}
										style={{ width: 'calc(100% + 2rem)', margin: '1rem -1rem -1.1rem -1rem', padding: '0.5rem 0rem 0.5rem 1rem' }}
									/>
								</Grid>
							</Grid>
						);
					}
				})}
			</div>
		);
	};

	const handle_render_products = (_products: any) => {
		const sorted_products = utils.sort_according_to_customise(_products, items);

		return (
			<VirtualList
				list_style={{ overflowY: 'auto', height: sorted_products?.length > 3 ? 600 : 'auto' }}
				render_item={handle_render_product_card}
				data={sorted_products}
				item_height={30}
				item_key={(item: any) => item}
			/>
		);
	};

	const handle_render_products_accordion = () => {
		return (
			<Grid container gap={1}>
				<AccordionProductListing
					cart_group_data={grouping_data}
					handle_product_card={handle_render_products}
					expanded={product_expanded}
					handleChange={handle_product_accordian}
					toggle_button_value={toggle_button_value}
					set_expanded={set_product_expanded}
				/>
			</Grid>
		);
	};

	const handle_container_cart_data = () => {
		const { cart_volume_unit, containers } = container_data;
		const _container: any = _.head(containers) || {};
		const total_vol = _container?.container_volume_filled_data?.[cart_volume_unit];
		const container_vol = _container?.container_volume_data?.[cart_volume_unit];

		const percentage = (total_vol / container_vol) * 100 || 0;
		return (
			<Grid className={classes.container_cart}>
				<CustomText type='Subtitle'>Container information</CustomText>
				<Grid className={classes.container_info}>
					<Icon iconName='IconTruckDelivery' className={classes.icon_delivery} />
					<Grid>
						<CustomText className={classes.text_primary} type='Body'>
							{_container?.container_name}
						</CustomText>
						<CustomText className={classes.text_secondary} type='Caption'>
							{t('OrderManagement.OrderEndStatusInfoContainer.Capacity')} {container_vol} {cart_volume_unit?.toUpperCase()}
						</CustomText>
					</Grid>
				</Grid>
				<Grid className={classes.total_cbm_info}>
					<CustomText type='Subtitle'>
						{t('OrderManagement.OrderEndStatusInfoContainer.Total')} {cart_volume_unit?.toUpperCase()} : {(total_vol || 0)?.toFixed(2)}
					</CustomText>
					<CustomText className={classes.text_primary} type='Body'>
						({percentage?.toFixed(1)}% filled)
					</CustomText>
				</Grid>
			</Grid>
		);
	};

	//handle cart checkout cards
	const handle_render_cart_checkout = () => {
		return (
			<Grid id='finalCart' container justifyContent={`${show_container() && is_ultron ? 'space-between' : 'flex-end'}`} my={2}>
				<Grid item>{show_container() && is_ultron && handle_container_cart_data()}</Grid>
				<Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
					{document_data?.type === 'order' && (
						<ConsolidatedCard table_config={document_line_item_config} cart_total_breakdown={cart_total_breakdown} currency={currency} />
					)}
					<CartCheckoutCard
						cart_container_style={{
							height: 'fit-content',
							background: theme?.order_management?.order_end_status_info_container?.cart_checkout_card_background,
							border: theme?.order_management?.style?.cart_checkout_card_border,
							borderRadius: '12px',
						}}
						is_end_status
						show_buyer_info={false}
					/>
				</Grid>
			</Grid>
		);
	};

	//handle order details
	const handle_render_order_section = () => {
		const specific_section = _.get(section_data, 'specific_section');

		const handle_get_value_by_type = (item: any) => {
			return formattedValue(attribute_data[item?.id], item);
		};

		const update_attr = _.filter(specific_section?.attributes, (ite) => ite?.is_display !== false);
		if (update_attr?.length > 0)
			return (
				<React.Fragment>
					<Grid container p={1} alignItems='center'>
						<Grid display='flex' flexDirection='column' width='100%' gap={1}>
							<CustomText type='Subtitle'>{specific_section?.name}</CustomText>
							<Box>
								{update_attr?.map((ele: any) => (
									<Grid container alignItems='center' mb={1}>
										<Grid item md={3} sm={4} xs={4.5}>
											<CustomText type={is_ultron ? 'Subtitle' : 'Body'}>{ele?.name}</CustomText>
										</Grid>

										<Grid item xl={3} lg={4} md={4} sm={6} xs={6}>
											<CustomText type='Body'>{handle_get_value_by_type(ele)}</CustomText>
										</Grid>
									</Grid>
								))}
							</Box>
						</Grid>
					</Grid>
					<Divider sx={section_data?.notes || section_data?.other_section ? { mb: 0.2 } : { my: 1 }} />
				</React.Fragment>
			);
	};

	//handle notes and additional info
	const handle_render_other_details = () => {
		const other_sections: any = [];

		// show sections if value exist in document
		const notes = attribute_data?.notes_settings;

		if (
			(is_store_front && !_.isEmpty(notes?.customer_notes?.notes)) ||
			(is_ultron && (!_.isEmpty(notes?.customer_notes?.notes) || !_.isEmpty(notes?.my_notes?.notes)) && notes?.is_display !== false)
		) {
			other_sections.push({
				title: 'Notes',
				key: 'notes',
				renderer: <NotesSection data={section_data?.notes} is_accordion />,
			});
		}

		const { terms_and_conditions_section = [], payment_section = [] } = section_data?.other_section;

		const has_visible_payment_section = payment_section.some((section: any) => section.is_display);
		const has_visible_terms_section = terms_and_conditions_section.some((section: any) => section.is_display);

		if ((has_visible_payment_section && !isEmpty(payment_section)) || (has_visible_terms_section && !isEmpty(terms_and_conditions_section)))
			other_sections.push({
				title: 'Additional info',
				key: 'additional_info',
				renderer: (
					<ShowMoreSection
						container_style={{
							borderRadius: '8px',
							backgroundColor: theme?.order_management?.order_end_status_info_container?.background_color,
							padding: '0rem 1rem 1.5rem 1rem',
						}}
						data={section_data?.other_section}
						is_accordion
					/>
				),
			});

		if (!_.isEmpty(section_data?.customer_consent) && utils.handle_check_display(section_data?.customer_consent))
			other_sections.push({
				title: 'Customer consent',
				key: 'customer_consent',
				renderer: <CustomerConsent data={section_data?.customer_consent} is_accordion />,
			});

		return (
			<React.Fragment>
				{other_sections?.map((item: any) => {
					let key = _.get(item, 'key');
					let title = _.get(item, 'title');
					let renderer = _.get(item, 'renderer');

					return (
						<React.Fragment key={key}>
							<Accordion
								contentBackground={theme?.order_management?.order_end_status_info_container?.accordion_content_background}
								titleBackgroundColor={theme?.order_management?.cart_summary?.title_background_color}
								key={title}
								id={key}
								titleStyle={{
									padding: '0px 10px',
								}}
								containerStyle={{
									padding: '0px',
								}}
								expanded={expanded[key]}
								on_change={handle_change}
								content={[
									{
										expandedContent: renderer,
										title: <CustomText type={is_ultron ? 'Subtitle' : 'H3'}>{title}</CustomText>,
									},
								]}
							/>
							<Divider sx={{ my: 0.2 }} />
						</React.Fragment>
					);
				})}
			</React.Fragment>
		);
	};

	const get_icons = (section: any) => {
		switch (section) {
			case COLLAPSE_SECTION_TYPE.SHIPMENT_SECTION:
				return 'IconTruckDelivery';
			case COLLAPSE_SECTION_TYPE.INVOICE:
				return get_currency_icon(currency);
			default:
				return 'IconTruckDelivery';
		}
	};

	//handle accordion common title
	const handle_render_title = (title: string, status?: any) => {
		return (
			<Grid container gap={2} alignItems='center' mt={2} mb={2}>
				<CustomText type='H6'>{_.capitalize(title)}</CustomText>

				{status && (
					<CustomStatusChip
						bgColor='#EEF1F7'
						content={
							<Grid container gap={0.4} alignItems='center'>
								<Icon color={theme?.order_management?.order_end_status_info_container?.custom_color} iconName={get_icons(title)} />
								<CustomText color={theme?.order_management?.order_end_status_info_container?.custom_text_color} type='Body'>
									{_.capitalize(status)}
								</CustomText>
							</Grid>
						}
					/>
				)}
			</Grid>
		);
	};

	//handle shipped products
	const handle_render_shipped_products = (shipment_products: any) => {
		return (
			<React.Fragment>
				<Grid container className={classes.cartShippedProductHeader} mb={2.5}>
					<Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
						<CustomText type='H6' style={cart_header_style}>
							#
						</CustomText>
					</Grid>
					<Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
						<CustomText type='H6' style={cart_header_style}>
							Product Name
						</CustomText>
					</Grid>
					<Grid item xs={3} sm={3} md={3} lg={3} xl={3} textAlign={'right'}>
						<CustomText type='H6' style={cart_header_style}>
							Quantity
						</CustomText>
					</Grid>
				</Grid>
				<Grid container gap={2.5}>
					{shipment_products?.map((product: any, index: number) => {
						return (
							<Grid container key={product?.item_id} className={classes.cartShippedContainer} sx={{ padding: '1rem 2rem !important' }}>
								<Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
									<CustomText>{index + 1}</CustomText>
								</Grid>
								<Grid item display='flex' gap={0.5} flexDirection='column' xs={10} sm={8} md={8} lg={8} xl={8}>
									<CustomText
										type='Subtitle'
										style={{
											fontWeight: 700,
										}}>
										{product?.name}
									</CustomText>

									<CustomText style={{ text_style }}>{`SKU : ${product.sku_id}`}</CustomText>
									<CustomText style={{ text_style, opacity: 0.6, lineHeight: 1.5 }}>{product?.description}</CustomText>
								</Grid>
								<Grid item xs={1} sm={3} md={3} lg={3} xl={3} textAlign={'right'}>
									<CustomText type='H6' style={{ text_style }}>
										{product?.quantity?.toFixed(2)}
									</CustomText>
									<span>pcs</span>
								</Grid>
							</Grid>
						);
					})}
				</Grid>
			</React.Fragment>
		);
	};

	//handle shipped products collapsible section
	const handle_render_shipped_products_details = (key: any, shipment_products: any) => {
		return (
			<Accordion
				id={key}
				expanded={expanded[key]}
				on_change={handle_change}
				content={[
					{
						expandedContent: handle_render_shipped_products(shipment_products),
						title: (
							<CustomText
								type='Body'
								color={theme?.order_management?.order_end_status_info_container?.custom_color}
								style={{
									fontWeight: 700,
								}}>
								Products
							</CustomText>
						),
					},
				]}
				contentBackground='white'
			/>
		);
	};

	//handle shipment section
	const handle_render_shipment_section = () => {
		const shipment_status = fulfilment_status_constants[fulfillment_status]?.label || fulfillment_status;
		return (
			<Grid display='flex' flexDirection='column' gap={2}>
				{handle_render_title('shipment', shipment_status)}
				{fulfillments?.map((item: any, index: number) => {
					const [tracking_info = {}] = _.get(item, 'trackingInfo');
					const shipment_products = _.get(item, 'products');

					const { events = {} } = item;
					const { nodes } = events;
					// Check if any node contains a message, happenedAt, or status
					const has_valid_tracking_info = _.some(nodes, (tracking: any) => {
						const { message, happenedAt, status } = tracking;
						return message || happenedAt || status;
					});

					return (
						<React.Fragment key={tracking_info}>
							<CustomStepper
								type='shipment'
								data={item}
								_index={index + 1}
								tracking_info={tracking_info}
								set_success_toast={set_success_toast}
							/>
							{!_.isEmpty(nodes) && has_valid_tracking_info && (
								<Box className={classes.tracking_message}>
									{_.map(_.reverse(nodes), (tracking: any, key: number) => {
										const { message, happenedAt, status } = tracking;
										return (
											<Grid key={`tracking${key}`} display='flex' gap={1}>
												<Box>
													{key === 0 ? (
														<Image width={16} height={16} src={ImageLinks.active_step} />
													) : (
														<Image width={16} height={16} src={ImageLinks.inactive_step} />
													)}
												</Box>
												<Box display='flex' flexWrap='wrap' gap={0.5}>
													<CustomText type='Subtitle'>{status}</CustomText>
													<CustomText type='Body'>
														<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(message) }} />
													</CustomText>
													<CustomText type='Body'>{happenedAt && isoToDateDay(happenedAt, 'MM/DD/YYYY hh:mm A')}</CustomText>
												</Box>
											</Grid>
										);
									})}
								</Box>
							)}
							{_.size(shipment_products) > 0 && handle_render_shipped_products_details(`shippped_product${index}`, shipment_products)}
						</React.Fragment>
					);
				})}
			</Grid>
		);
	};

	const handle_render_activity_section = () => {
		const activity_accordion_key = 'activity';
		const reversed_event_line_items = [...line_items]?.reverse();
		return (
			<Accordion
				id={activity_accordion_key}
				expanded={expanded[activity_accordion_key]}
				on_change={handle_change}
				titleStyle={{
					padding: '0px 10px',
				}}
				containerStyle={{
					padding: '0px 20px 30px 20px',
				}}
				content={[
					{
						expandedContent: (
							<CustomStepper
								container_style={{
									backgroundColor: theme?.order_management?.order_end_status_info_container?.custom_background_color,
									padding: 0,
								}}
								type='activity'
								line_items={reversed_event_line_items}
							/>
						),
						title: <CustomText type='Subtitle'>Activity</CustomText>,
					},
				]}
				contentBackground='white'
			/>
		);
	};

	const handle_navigate = () => {
		navigate(is_store_front ? '/account/profile' : `/buyer/dashboard/${document_data?.buyer_id}`, {
			state: {
				from: 'order-review-page',
			},
		});
	};

	const handle_render_table = () => {
		const count = _.size(products);
		return (
			<Accordion
				id={'products'}
				expanded={expanded?.products}
				on_change={handle_change}
				titleStyle={{
					padding: '0px 10px',
				}}
				containerStyle={{
					padding: '0px',
				}}
				contentBackground='white'
				content={[
					{
						expandedContent: (
							<>
								{handle_render_table_header()}
								{handle_render_table_header_v2()}
								{show_grouping_data ? handle_render_products_accordion() : handle_render_products(products)}
							</>
						),
						title: (
							<Grid container gap={1} alignItems={'center'}>
								<CustomText type='H6'>Products</CustomText>
								<CustomText type='Body' color='grey'>
									({count} {count > 1 ? 'products' : 'product'})
								</CustomText>
							</Grid>
						),
					},
				]}
			/>
		);
	};

	const get_containers_detail = async () => {
		try {
			const { data: response_data }: any = await settings.get_containers_data();
			if (response_data?.tenant_container_enabled === true) {
				dispatch(cartContainerConfig(response_data));
			} else {
				dispatch(cartContainerConfig({ tenant_container_enabled: false }));
			}
		} catch (err) {
			console.error(err);
		}
	};

	const open_modal = (type?: string) => {
		set_download_file_type(type);
		if (!download_loader) {
			handle_loading_state(LOADING_CONSTANT.download_loader, true);
			get_order_summary(buyer_id, type);
		}
	};

	useEffect(() => {
		if (_.isEmpty(cart_container_config)) {
			get_containers_detail();
		}
	}, [cart_container_config]);

	const thankyou_page = () => {
		return (
			<Grid className={classes?.thankyou}>
				<Divider />
				<Image src={thankyou_url} height={108} width={261} />
			</Grid>
		);
	};
	const handle_status_chips = () => {
		const shipment_status_chip_label = fulfillment_status
			? fulfilment_status_constants[fulfillment_status]?.label || fulfillment_status
			: '';
		if (shipment_status_chip_label && shipment_status_chip_label !== fulfilment_status_constants.UNFULFILLED?.label)
			return (
				<Grid>
					<Chip
						bgColor={text_colors.secondary}
						sx={{ marginBottom: '8px' }}
						label={
							<Grid container gap={0.4} alignItems='center'>
								<Icon color={custom_stepper_text_color.grey} iconName='IconTruckDelivery' />
								<CustomText color={text_colors.black} type='Body'>
									{shipment_status_chip_label}
								</CustomText>
							</Grid>
						}
					/>
					<Divider />
				</Grid>
			);
	};

	return (
		<Grid className={classes?.endStatusInfoContainer} sx={{ boxShadow: is_ultron ? 'none' : '0px 0px 10px 0.5px rgb(48 47 47 / 10%)' }}>
			{is_ultron && <TagHeader />}
			{is_store_front && handle_status_chips()}

			<Grid container justifyContent='space-between' mb={1}>
				{buyer_section_loading || _.isEmpty(buyer_info_data) ? (
					<BuyerInfoSkeleton />
				) : (
					<Grid container display='flex' justifyContent='space-between'>
						<AccountList handle_click={handle_navigate} data={buyer_info_data} variant='rounded' />
						<Grid gap={0.5} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'end', flexDirection: 'column' }}>
							{!is_ultron &&
								!is_small_screen &&
								!is_retail_mode &&
								(show_download_at_order_detail ? (
									<CustomText type='H6' className={classes.download_cta} onClick={() => open_modal('pdf')}>
										<Icon color={theme?.page_header_component?.tear_sheet} iconName='IconDownload' sx={{ height: '16px' }} />
										<span>{t('OrderManagement.OrderEndStatusInfoContainer.Download')}</span>
									</CustomText>
								) : (
									<Grid display='flex' alignItems='center' gap={2}>
										<CustomText
											type='H6'
											className={classes.download_cta}
											color={theme?.page_header_component?.pdf}
											onClick={() => open_modal('pdf')}>
											<Icon iconName='IconDownload' sx={{ height: '16px' }} />
											<Image src={ImageLinks.pdf_icon} width={16} height={16} style={{ marginRight: '0.5rem' }} />
											<span>{t('OrderManagement.OrderEndStatusInfoContainer.PDF')}</span>
										</CustomText>
										<CustomText
											type='H6'
											className={classes.download_cta}
											color={theme?.page_header_component?.excel}
											onClick={() => open_modal('excel')}>
											<Icon iconName='IconDownload' sx={{ height: '16px' }} />
											<Image src={ImageLinks.excel_icon} width={16} height={16} style={{ marginRight: '0.5rem' }} />

											<span>{t('OrderManagement.OrderEndStatusInfoContainer.Excel')}</span>
										</CustomText>
									</Grid>
								))}
							{order_info?.updated_on && order_info?.updated_by && is_ultron && (
								<CustomText className={order_info_style}>
									{`Updated  ${`on ${order_info?.updated_on}`}  ${`by ${order_info?.updated_by}`}`}
								</CustomText>
							)}

							{order_info?.created_on && order_info?.created_by && is_ultron && (
								<CustomText className={order_info_style}>{`Created  ${`on ${order_info?.created_on}`} by ${
									order_info?.created_by
								}`}</CustomText>
							)}
							{order_info?.expired_on !== 'Invalid Date' && is_ultron && (
								<Grid item>
									<CustomText className={order_info_style}>{`Valid Till :  ${order_info?.expired_on} `}</CustomText>
								</Grid>
							)}
							{written_for_name && written_for_name_display && (
								<CustomText style={order_info_style}>
									{t('OrderManagement.OrderEndStatusInfoContainer.WrittenForName', { written_for_name })}
								</CustomText>
							)}
							{written_by_name && written_by_name_display && (
								<CustomText style={order_info_style}>
									{t('OrderManagement.OrderEndStatusInfoContainer.WrittenByName', { written_by_name })}
								</CustomText>
							)}
						</Grid>
					</Grid>
				)}
			</Grid>
			<Divider />
			{handle_render_info_section()}
			<Divider sx={{ borderBottomStyle: 'dashed', margin: '2rem 0rem' }} />

			{is_ultron && (
				<Grid container gap={1} px={1}>
					<CustomText type='Subtitle'>Pricelist : </CustomText>
					<CustomText type='Body'>{catalog_name}</CustomText>
				</Grid>
			)}
			{is_ultron && <Divider sx={{ margin: '2rem 0rem 3rem' }} />}
			{!_.isEmpty(cols?.columns) && handle_render_table()}
			{handle_render_cart_checkout()}
			<Divider sx={{ my: 1 }} />
			{/* order section */}
			{section_data?.specific_section && handle_render_order_section()}
			{/* other section */}
			{(section_data?.other_section || section_data?.notes) && handle_render_other_details()}
			{!_.isEmpty(fulfillments) && handle_render_shipment_section()}
			{!_.isEmpty(fulfillments) && <Divider sx={{ my: 1 }} />}
			{!_.isEmpty(line_items) && handle_render_activity_section()}
			{!_.isEmpty(line_items) && <Divider />}
			{section_data?.payment_method && section_data?.payment_method?.is_display !== false && document_data?.type === 'order' && (
				<PaymentMethodSection
					style={{
						borderRadius: '8px',
						backgroundColor: theme?.order_management?.order_end_status_info_container?.payment_background_color,
						padding: '1.5rem 1rem',
					}}
					data={section_data?.payment_method}
				/>
			)}
			<PaymentTable />
			<CustomToast
				open={success_toast.open}
				showCross={true}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				show_icon={true}
				is_custom={false}
				autoHideDuration={5000}
				onClose={() => set_success_toast({ open: false, title: '', subtitle: '', state: success_toast.state })}
				state={success_toast.state}
				title={success_toast.title}
				subtitle={success_toast.subtitle}
				showActions={false}
			/>
			<ChangePaymentStatusModal />
			<ChangeFulfilmentStatusModal />
			<DocumentTagModal />
			{thankyou && thankyou_page()}
			{review_modal?.state && (
				<ReviewCartModal
					open={review_modal.state}
					on_close={() => set_review_modal({ state: false, data: null })}
					onSubmit={() => handle_navigation_to_draft(review_modal?.data, 'repeat')}
					data={review_modal?.data}
				/>
			)}
		</Grid>
	);
}

export default OrderEndStatusInfoContainer;
