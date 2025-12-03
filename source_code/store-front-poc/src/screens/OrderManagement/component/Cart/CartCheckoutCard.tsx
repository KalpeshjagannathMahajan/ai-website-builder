/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Button, Grid, Icon, Modal, Image } from 'src/common/@the-source/atoms';
import { AccountList } from 'src/common/@the-source/molecules';
import React, { useContext, useEffect, useState } from 'react';
import OrderManagementContext from '../../context';
import { useSelector } from 'react-redux';
import { document } from '../../mock/document';
import api_requests from 'src/utils/api_requests';
import _ from 'lodash';
import ChargeModal from './ChargeModal';
import {
	CHARGE_NAME,
	CHARGE_NAMES,
	CHARGE_TYPE,
	CHARGE_VALUE_TYPES,
	DRAWER_TYPES,
	// LOADING_CONSTANT,
	PAID_STATUS,
	STEPPER_CONSTANTS,
	DOCUMENT_END_STATUS,
} from '../../constants';
import useSortedCharges from 'src/hooks/useSortedCharges';
import { get_cart_summary } from '../../helper/helper';
import { get_formatted_price_with_currency } from 'src/utils/common';
import CustomText from 'src/common/@the-source/CustomText';
import CartItemModal from 'src/common/CartItemModal';
import CartCheckoutSkeleton from './CartCheckoutSkeleton';
import { useNavigate, useParams } from 'react-router-dom';
import ContainerisedCart from 'src/screens/CartSummary/components/ContainerisedCart';
import settings from 'src/utils/api_requests/setting';
import { useDispatch } from 'react-redux';
import { cartContainerConfig } from 'src/actions/setting';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';
import { PERMISSIONS } from 'src/casl/permissions';
import Can from 'src/casl/Can';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import { t } from 'i18next';
import CustomCartTotal from 'src/common/CustomCartTotal';
import { get_items } from 'src/screens/CartSummary/helper';
import { text_colors } from 'src/utils/light.theme'; //secondary
import { colors, variables } from 'src/utils/theme';
import useMediaQuery from '@mui/material/useMediaQuery';
import ImageLinks from 'src/assets/images/ImageLinks';
import useTenantSettings from 'src/hooks/useTenantSettings';
import constants from 'src/utils/constants';
import { close_toast, show_toast } from 'src/actions/message';
import types from 'src/utils/types';
import ReviewCartModal from 'src/screens/Account/Components/ReviewCartModal';
import { Mixpanel } from 'src/mixpanel';
import Events from 'src/utils/events_constants';

const { TENANT_SETTINGS_KEYS } = constants;

interface Props {
	show_buyer_info?: boolean;
	is_end_status?: boolean;
	cart_container_style?: any;
	show_container?: boolean;
}

// const card_style = {
// 	border: '1px solid rgba(0, 0, 0, 0.12)',
// };

const disclaimer_container = {
	backgroundColor: colors.light_yellow,
	borderRadius: variables.border_radius_large,
	padding: '1rem',
	margin: '16px 0 0 16px',
	width: 'auto',
};

// const charge_text_style = {
// 	cursor: 'pointer',
// 	color: '#16885F',
// };

const initial_charge_modal_details = {
	is_open: false,
	charge_name: '',
	charge_type: '',
	charge_id: undefined,
	is_disable: false,
};

const CartCheckoutCard = ({ show_buyer_info = true, is_end_status = false, cart_container_style, show_container = false }: Props) => {
	const {
		set_is_error_modal_open,
		is_error_modal_open,
		// set_is_discount_campaign_error,
		is_discount_campaign_error,
		handle_edit_cart,
		buyer_info_data,
		set_buyer_info_data,
		buyer_id,
		document_data,
		container_loading,
		loader,
		handle_click_cta,
		is_end_state,
		handle_drawer_state,
		handle_drawer_type,
		active_step,
		handle_update_stepper,
		wizshop_settings,
		btn_loading,
		buyer_section_loading,
		attribute_data,
		section_data,
		handle_get_terms_data,
		handleChange,
		handle_navigation_to_draft,
		expanded,
		set_review_modal,
		review_modal,
		// handle_loading_state,
		// get_order_summary,
		set_isview,
	} = useContext(OrderManagementContext);
	const cartData: any = localStorage.getItem('CartData');
	const cart_value = JSON.parse(cartData);
	const reorder_cart_detail = useSelector((state: any) => state?.cart);
	const classes = useStyles();
	const { cart_details, charges } = document_data;
	const { total, container_data } = cart_details;
	const navigate = useNavigate();
	const params = useParams();
	const [loading, set_loading] = useState(false);
	const [charge_modal_details, set_charge_modal_details] = useState<any>(_.cloneDeep(initial_charge_modal_details));
	const cart_checkout_config = useSelector((state: any) => state?.configSettings?.cart_checkout_config);
	const [switch_toggle, set_switch_toggle] = useState(cart_details?.container_data?.container_is_display);
	const cart_container_config = useSelector((state: any) => state?.settings?.cart_container_config);
	const [containers_data, set_container_data] = useState<any>({});
	const enable_payment_status_change = useSelector((state) => _.get(state, 'settings.enable_payment_status_change', false));
	const {
		enable_reorder_flow = false,
		hide_integration_reorder = false,
		external_terms_and_conditions,
	} = useSelector((state: any) => state?.settings);
	const { is_payments_enabled, manual_payment_status_change } = useTenantSettings({
		[TENANT_SETTINGS_KEYS.PAYMENTS_ENABLED]: false,
		[TENANT_SETTINGS_KEYS.MANUAL_PAYMENT_STATUS_CHANGE]: true,
	});
	const dispatch = useDispatch();
	const theme: any = useTheme();
	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';
	const is_store_front = VITE_APP_REPO === 'store_front';
	const is_terms_empty = handle_get_terms_data();
	const is_small_screen = useMediaQuery('(max-width:600px)');
	const is_big_screen = useMediaQuery('(min-width:900px)');
	const is_retail_mode = localStorage.getItem('retail_mode') === 'true';

	const card_style = () => {
		if (is_end_status || is_store_front) return { border: theme?.order_management?.cart_checkout_card?.border };
		return {};
	};

	const open_charge_modal = ({ charge_name, charge_type, charge_id, fetch_charge = false, is_disable = false }: any) => {
		set_charge_modal_details({
			is_open: true,
			charge_name,
			charge_type,
			charge_id,
			fetch_charge,
			is_disable,
		});
	};

	const close_charge_modal = () => {
		set_charge_modal_details(_.cloneDeep(initial_charge_modal_details));
	};
	const { document_type, doc_status } = params;
	const is_edit_quote = useSelector((state: any) => state?.document?.is_editable_quote);
	const is_edit_order = useSelector((state: any) => state?.document?.is_editable_order);
	const currency_symbol = cart_details?.meta?.pricing_info?.currency_symbol;
	const config = useSelector((state: any) => state?.configSettings?.cart_checkout_config);
	const [is_modal_open, set_is_modal_open] = useState<boolean>(false);
	const [is_agree, set_is_agree] = useState<boolean>(false);
	const { total_amount_without_charges, total_amount_with_discount, total_amount_with_charges } = get_cart_summary(total, charges);
	const sorted_charges = useSortedCharges(charges);
	const shipping_charges = _.find(charges, { name: CHARGE_NAMES.Shipping.name });
	const discount_charges = _.find(charges, { charge_type: CHARGE_TYPE.discount });
	const taxes_charges = _.find(charges, { name: CHARGE_NAMES.tax.name });
	const adjustment_charges = _.find(charges, { name: CHARGE_NAMES.adjustment.name });
	const [selected_container, set_selected_container] = useState(_.head(container_data?.containers) || {});
	const cart_group_data = cart_details?.meta?.grouping_data?.groups;
	// [Suyash] Condition updated based on discussion with Sunny.
	const show_document_amount_due =
		document_data?.type !== document.DocumentTypeEnum.QUOTE && document_data?.document_status !== 'draft' && is_payments_enabled;

	const checkout_card_payment_info = [
		{
			condition: document_data?.all_payment_received_total > 0,
			label: t('OrderManagement.CartCheckoutCard.PaymentReceived'),
			value: document_data?.all_payment_received_total,
		},
		{
			condition: document_data?.all_payment_refunded_total > 0,
			label: t('OrderManagement.CartCheckoutCard.PaymentRefunded'),
			value: document_data?.all_payment_refunded_total,
		},
		{
			condition: document_data?.excess_payment_received > 0 && !manual_payment_status_change,
			label: t('OrderManagement.CartCheckoutCard.ExcessPaymentReceived'),
			value: document_data?.excess_payment_received,
		},
	];

	const checkout_card_payment_data = _.filter(checkout_card_payment_info, 'condition');

	const get_discount_label = () => {
		if (discount_charges?.discount_campaign_id && discount_charges?.discount_campaign_name) {
			return discount_charges?.discount_campaign_name;
		}
		if (discount_charges?.value_type === 'value' || discount_charges?.value_type === 'fixed') {
			return t('OrderManagement.CartCheckoutCard.DiscountValue', { symbol: currency_symbol, value: discount_charges?.value });
		}
		if (discount_charges?.value_type === 'percentage') {
			return t('OrderManagement.CartCheckoutCard.DiscountPercentage', { value: discount_charges?.value });
		}
		return false;
	};

	const get_shipping_label = () => {
		if (shipping_charges?.value_type === 'value' || shipping_charges?.value_type === 'fixed') {
			return t('OrderManagement.CartCheckoutCard.ShippingValue', { symbol: currency_symbol, value: shipping_charges?.value });
		}

		if (shipping_charges?.value_type === 'percentage') {
			return t('OrderManagement.CartCheckoutCard.ShippingPercentage', { value: shipping_charges?.value });
		}
		return false;
	};

	const get_taxes_label = () => {
		if (taxes_charges?.value_type === 'value' || taxes_charges?.value_type === 'fixed') {
			return t('OrderManagement.CartCheckoutCard.TaxValue', { symbol: currency_symbol, value: taxes_charges?.value });
		}

		if (taxes_charges?.value_type === 'percentage') {
			return t('OrderManagement.CartCheckoutCard.TaxPercentage', { value: taxes_charges?.value });
		}
		return false;
	};

	const get_containers_detail = async () => {
		try {
			if (!cart_container_config) {
				const { data: response_data }: any = await settings.get_containers_data();
				if (response_data?.tenant_container_enabled === true) {
					dispatch(cartContainerConfig(response_data));
					set_container_data(response_data);
				} else {
					dispatch(cartContainerConfig({ tenant_container_enabled: false }));
				}
			} else {
				set_container_data(cart_container_config);
			}
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		get_containers_detail();
	}, []);

	const handle_transform_list_data = (buyer: any) => {
		const listData = {
			imageUrl: '',
			card_background: theme?.order_management?.cart_checkout_card?.card_background,
			background: theme?.order_management?.cart_checkout_card?.background,
			color: theme?.order_management?.cart_checkout_card?.color,
			heading: buyer?.name,
			sub_heading: buyer?.location,
			avatarStyle: {
				padding: 3.5,
			},
			avatarTextStyle: {
				fontSize: 20,
				fontStyle: 'normal',
				fontWeight: 700,
			},
		};
		return listData;
	};

	const handle_get_buyer = async (_id: any) => {
		set_loading(true);
		api_requests.buyer
			.get_buyer_dashboard(_id)
			.then((res: any) => {
				let buyer_data = res?.data;
				let list_data = handle_transform_list_data(buyer_data);
				set_buyer_info_data(list_data);
				set_loading(false);
			})
			.catch((err) => {
				set_loading(false);
				console.log(err);
			});
	};

	useEffect(() => {
		handle_get_buyer(buyer_id);
	}, [buyer_id]);

	const handle_charges_condition = (is_visible: any) => {
		if (is_visible) {
			return true;
		}
		return false;
	};

	const handle_edit_access = () => {
		if (document_data?.document_status === document?.DocumentStatus?.draft) {
			return true;
		}

		if (is_edit_quote || is_edit_order) {
			return true;
		}
		return false;
	};

	const handle_show_charges = (data: any) => {
		if (document_data?.document_status === document?.DocumentStatus?.draft && !data) {
			return true;
		}

		if (data) {
			return false;
		}

		if (is_edit_quote || is_edit_order) {
			return true;
		}
		return false;
	};

	const handle_edit_modal_action = (charge_name: any) => {
		let filtered_charge = _.find(sorted_charges, (item) => item.name === charge_name) || {};
		const { charge_type, id, name } = filtered_charge;

		if (!_.isEmpty(filtered_charge)) {
			open_charge_modal?.({
				charge_name: name,
				charge_id: id,
				charge_type,
				fetch_charge: true,
			});
		} else {
			open_charge_modal?.({
				charge_type: charge_name === 'Discount' ? 'discount' : 'tax',
				charge_name,
				fetch_charge: true,
			});
		}
	};

	const render_price_formatted = (value: any) => {
		return get_formatted_price_with_currency(currency_symbol, value);
	};

	const handle_get_charges = () => {
		return (
			<React.Fragment>
				{_.map(sorted_charges, (charge, key) => {
					const { value, value_type, name, charge_type, id } = charge;
					const is_tax = charge_type === CHARGE_TYPE.tax;
					const base_value = is_tax && !config?.charge_pre_discount ? total_amount_with_discount : total_amount_without_charges;
					let charge_amount = value;
					if (value_type === CHARGE_VALUE_TYPES.percentage) {
						charge_amount = (value / 100) * base_value;
					}

					const handle_open_modal = () => {
						open_charge_modal?.({
							charge_type,
							charge_name: name,
							charge_id: id,
						});
					};
					const handle_get_label = (charge_name: any) => {
						switch (charge_name) {
							case 'Discount':
								return get_discount_label();
							case 'Shipping':
								return get_shipping_label();
							case 'Tax':
								return get_taxes_label();
							default:
								return name;
						}
					};

					const options_key: any = _.findKey(CHARGE_NAME, (val) => val === name);
					const charge_option = cart_checkout_config?.[options_key] || {};
					const is_disabled = charge_option?.disabled || false;

					return (
						<Grid key={`tax${key}`} container justifyContent='space-between' id={`tax_${key}`}>
							<Box display='flex' justifyContent='center' alignItems='center' gap={1}>
								<CustomText type='Body'>{handle_get_label(name)}</CustomText>

								{!is_store_front && !is_disabled && handle_edit_access() && (
									<CustomText
										onClick={handle_open_modal}
										type='Subtitle'
										className={classes.charge_text_style}
										color={theme?.button?.color}>
										{t('OrderManagement.CartCheckoutCard.Edit')}
									</CustomText>
								)}
							</Box>
							<CustomText className={!is_tax ? classes.discount_color_valid : classes.discount_color_invalid} type='Subtitle'>
								{!is_retail_mode ? (
									handle_get_label(name) ? (
										`${!is_tax ? '-' : ''} 
          ${render_price_formatted(charge_amount)}`
									) : (
										'--'
									)
								) : (
									<Image src={ImageLinks.price_locked} width={is_small_screen ? 130 : 140} height={is_small_screen ? 20 : 26} />
								)}
							</CustomText>
						</Grid>
					);
				})}
			</React.Fragment>
		);
	};

	const handle_get_term_and_conditions = () => {
		const terms: any = section_data?.other_section?.terms_and_conditions_section;
		return _.map(
			_.head(terms)?.attributes?.map((item: any) => {
				const data = attribute_data[item?.id] || '';
				return { id: item?.name, data };
			}),
		);
	};
	const handle_render_modal_content = () => {
		const data = handle_get_term_and_conditions();
		return (
			<React.Fragment>
				{_.map(data, (item: any) => (
					<CustomText key={item?.id}>{item?.data}</CustomText>
				))}
			</React.Fragment>
		);
	};
	const handle_submit_modal = () => {
		set_is_agree(true);
		set_is_modal_open(false);
	};
	const handle_render_modal_footer = () => {
		return (
			<Grid display='flex' justifyContent='flex-end' gap={1.2}>
				<Button onClick={() => set_is_modal_open(false)} variant='outlined'>
					{t('OrderManagement.CartCheckoutCard.ModalFooterBackButton')}
				</Button>
				<Button onClick={handle_submit_modal} variant='contained'>
					{t('OrderManagement.CartCheckoutCard.ModalFooterButton')}
				</Button>
			</Grid>
		);
	};
	const render_terms_and_conditions = () => {
		return (
			<Grid item className={classes?.item_terms_and_conditions}>
				<Checkbox
					sx={{
						'&.Mui-checked': { color: theme?.order_management?.style?.checkbox_color },
					}}
					checked={is_agree}
					onChange={() => set_is_agree(!is_agree)}
					required={true}
				/>
				<CustomText style={{ fontSize: '14px' }}>
					{t('OrderManagement.CartCheckoutCard.IAgreeTerms')}
					<span className={classes.span_terms_and_conditions} onClick={() => set_is_modal_open(true)}>
						{t('OrderManagement.CartCheckoutCard.ReviewTnc')}
					</span>
				</CustomText>
				{is_modal_open && (
					<Modal
						width={430}
						open={is_modal_open}
						onClose={() => set_is_modal_open(false)}
						title={'Terms and conditions'}
						footer={handle_render_modal_footer()}
						children={handle_render_modal_content()}
					/>
				)}
			</Grid>
		);
	};
	const render_external_terms_and_conditions = () => {
		return (
			<Grid item className={classes?.item_terms_and_conditions}>
				<Checkbox
					sx={{
						'&.Mui-checked': { color: theme?.order_management?.style?.checkbox_color },
					}}
					checked={is_agree}
					onChange={() => set_is_agree(!is_agree)}
					required={true}
				/>
				<CustomText style={{ fontSize: '14px' }}>
					{t('OrderManagement.CartCheckoutCard.IAgreeTerms')}
					<span className={classes.span_terms_and_conditions} onClick={() => window.open(external_terms_and_conditions?.url, '_blank')}>
						{t('OrderManagement.CartCheckoutCard.ReviewTnc')}
					</span>
				</CustomText>
			</Grid>
		);
	};
	const handle_display_total = () => {
		return (
			<Grid container justifyContent='space-between' id='cart_total' alignItems='center'>
				<CustomText className='card_title'>
					{t('OrderManagement.CartCheckoutCard.CartTotal')} ({get_items({ data: { ...cart_details } }, true)} units)
				</CustomText>

				{!is_retail_mode ? (
					<CustomText type='H6'>{render_price_formatted(cart_details?.total || 0)}</CustomText>
				) : (
					<Image src={ImageLinks.price_locked} width={is_small_screen ? 130 : 140} height={is_small_screen ? 20 : 26} />
				)}
			</Grid>
		);
	};

	const handle_render_cart_price = () => {
		return (
			<Grid className={classes.cartCheckoutPriceContainer} flexDirection='column'>
				<Box mb={is_ultron ? 2 : 0} px={is_end_status ? 1.5 : 0}>
					<Grid container>
						<Grid container mb={1.5}>
							<CustomCartTotal
								cart_group_data={cart_group_data}
								handle_display_total={handle_display_total}
								expanded={expanded}
								handleChange={handleChange}
								cart={cart_details}
							/>
						</Grid>

						{/* {!is_end_state && is_store_front && (
							<React.Fragment>
								<Grid
									container
									justifyContent='space-between'
									mb={1.5}
									sx={{ color: theme?.order_management?.cart_checkout_card?.sub_discount_color }}>
									<CustomText>Discount (will be add later)</CustomText>
									<CustomText type='H6'>--</CustomText>
								</Grid>
								<Grid
									container
									justifyContent='space-between'
									mb={1.5}
									sx={{ color: theme?.order_management?.cart_checkout_card?.sub_discount_color }}>
									<CustomText>Shipping charges (will be add later)</CustomText>
									<CustomText type='H6'>--</CustomText>
								</Grid>
								<Grid
									container
									justifyContent='space-between'
									mb={1.5}
									sx={{ color: theme?.order_management?.cart_checkout_card?.sub_discount_color }}>
									<CustomText>Taxes (will be add later)</CustomText>
									<CustomText type='H6'>--</CustomText>
								</Grid>
							</React.Fragment>
						)} */}

						{handle_get_charges()}

						{open_charge_modal && is_ultron && (
							<Grid display='flex' flexDirection='column' gap={0.75}>
								{handle_charges_condition(cart_checkout_config?.discount?.is_visible) &&
									!cart_checkout_config?.discount?.disabled &&
									handle_show_charges(discount_charges) &&
									handle_edit_access() && (
										<CustomText
											color={theme?.button?.color}
											id='add_discount'
											onClick={() =>
												open_charge_modal({
													charge_type: CHARGE_TYPE.discount,
													charge_name: CHARGE_NAMES.Discount.name,
													is_disable: cart_checkout_config?.discount?.disabled,
												})
											}
											type='Subtitle'
											className={classes.charge_text_style}>
											Add Discount
										</CustomText>
									)}

								{handle_charges_condition(cart_checkout_config?.shipping_charges?.is_visible) &&
									!cart_checkout_config?.shipping_charges?.disable &&
									handle_show_charges(shipping_charges) &&
									handle_edit_access() && (
										<CustomText
											color={theme?.button?.color}
											id='add_shipping_charge'
											onClick={() =>
												open_charge_modal({
													charge_type: CHARGE_TYPE.tax,
													charge_name: CHARGE_NAMES.Shipping.name,
													is_disable: cart_checkout_config?.shipping_charges?.disabled,
												})
											}
											type='Subtitle'
											className={classes.charge_text_style}>
											Add Shipping Charge
										</CustomText>
									)}

								{handle_charges_condition(cart_checkout_config?.tax?.is_visible) &&
									!cart_checkout_config?.tax?.disabled &&
									handle_show_charges(taxes_charges) &&
									handle_edit_access() && (
										<CustomText
											color={theme?.button?.color}
											id='add_tax'
											onClick={() =>
												open_charge_modal({
													charge_type: CHARGE_TYPE.tax,
													charge_name: CHARGE_NAMES.tax.name,
													is_disable: cart_checkout_config?.tax?.disabled,
												})
											}
											type='Subtitle'
											className={classes.charge_text_style}>
											Add Tax
										</CustomText>
									)}

								{handle_charges_condition(cart_checkout_config?.adjustment?.is_visible) &&
									!cart_checkout_config?.adjustment?.disabled &&
									handle_show_charges(adjustment_charges) &&
									handle_edit_access() && (
										<CustomText
											id='add_adjustment'
											onClick={() =>
												open_charge_modal({
													charge_type: CHARGE_TYPE.tax,
													charge_name: CHARGE_NAMES.adjustment.name,
													is_disable: cart_checkout_config?.adjustment?.disabled,
												})
											}
											type='Subtitle'
											color={theme?.button?.color}
											className={classes.charge_text_style}>
											Add Adjustment
										</CustomText>
									)}

								{handle_charges_condition(cart_checkout_config?.additional_charge?.is_visible) &&
									!cart_checkout_config?.additional_charge?.disabled &&
									handle_edit_access() && (
										<CustomText
											id='add_additional'
											type='Subtitle'
											color={theme?.button?.color}
											className={classes.charge_text_style}
											onClick={() =>
												open_charge_modal({
													charge_type: CHARGE_TYPE.tax,
													charge_name: CHARGE_NAMES.additional_charge.name,
													is_disable: cart_checkout_config?.additional_charge?.disabled,
												})
											}>
											Add Additional Charge
										</CustomText>
									)}
							</Grid>
						)}
					</Grid>

					<hr></hr>

					<Grid container justifyContent='space-between' mt={1.8} mb={is_end_status ? 1 : 0}>
						<CustomText type='H2'>{t('OrderManagement.CartCheckoutCard.Total')}</CustomText>

						{!is_retail_mode ? (
							<CustomText type='H2'>{render_price_formatted(total_amount_with_charges)}</CustomText>
						) : (
							<Image src={ImageLinks.price_locked} width={is_small_screen ? 130 : 140} height={is_small_screen ? 20 : 26} />
						)}
					</Grid>

					{enable_payment_status_change &&
						_.map(checkout_card_payment_data, ({ label, value }, index) => (
							<Grid container justifyContent='space-between' mt={1} key={index}>
								<CustomText type='Title'>{label}</CustomText>
								<CustomText type='Title'>{render_price_formatted(value)}</CustomText>
							</Grid>
						))}
				</Box>

				{show_document_amount_due && enable_payment_status_change && !manual_payment_status_change && (
					<Grid
						container
						style={{ background: theme?.order_management?.cart_checkout_card?.grid_background, padding: '1.5rem 1rem' }}
						justifyContent='space-between'>
						<Grid display='flex'>
							<Icon iconName='IconCash' sx={{ paddingRight: '0.5rem' }} />
							<CustomText type='H3'>{t('OrderManagement.CartCheckoutCard.PaymentPending')}</CustomText>
						</Grid>
						<CustomText type='Title'>
							{!isNaN(document_data?.total_amount_due) && document_data?.total_amount_due < 0 && '-'}
							{render_price_formatted(Math.abs(document_data?.total_amount_due))}
						</CustomText>
					</Grid>
				)}
			</Grid>
		);
	};

	const handle_navigate = () => {
		navigate(`/buyer/dashboard/${document_data?.buyer_id}`, {
			state: {
				from: 'order-review-page',
			},
		});
	};

	const { is_primary_loading, is_secondary_loading } = loader; //download_loader
	const { document_status, type, payment_status } = document_data;
	const is_editable_order = useSelector((state: any) => state?.document.is_editable_order);
	const user_permissions = useSelector((state: any) => state?.login?.permissions);

	const document_type_data: any = document_type === document.DocumentTypeEnum.ORDER ? document?.ORDER_ACTIONS : document?.QUOTE_ACTIONS;
	const payments_on_pending_approval = useSelector((state: any) => state?.settings?.payments_on_pending_approval);
	const approval_access_data = _.find(user_permissions, { slug: 'approve_orders' });
	const { payment_method_v2 } = document_data?.attributes || {};
	const force_pending_approval_flow = useSelector((state: any) => state?.settings?.force_pending_approval_flow);

	const check_permission = (paymentPermissions: string[] = []) => {
		return paymentPermissions.some((permission) => _.find(user_permissions, { slug: permission })?.toggle);
	};
	const handle_collect_payment_click = () => {
		handle_drawer_state(true);
		handle_drawer_type(DRAWER_TYPES.collect_payment);
	};
	const handle_add_credits_click = () => {
		handle_drawer_state(true);
		handle_drawer_type(DRAWER_TYPES.add_credits);
	};
	const handle_add_edit_payment_click = () => {
		handle_drawer_state(true);
		handle_drawer_type(DRAWER_TYPES.add_edit_payment);
	};

	const handle_get_label_cta = () => {
		switch (active_step?.stepper_key) {
			case STEPPER_CONSTANTS.SHIPPING_INFO.key:
				return 'Continue';
			case STEPPER_CONSTANTS.PAYMENT_DETAILS.key:
				return 'Review order';
			case STEPPER_CONSTANTS.REVIEW.key:
				return 'Place order';
		}
	};

	const handle_render_action_buttons = (_doc_status: string) => {
		let current_action = document_type_data[document_status]?.current;
		let next_action = document_type_data[_doc_status]?.next;
		const placeholder_button_render = !is_agree && active_step?.stepper_key === STEPPER_CONSTANTS?.REVIEW?.key;

		const is_button_disabled =
			is_primary_loading || is_secondary_loading || is_end_state || btn_loading || buyer_section_loading || placeholder_button_render;

		if (document_type_data[_doc_status]?.approval_mode_on) {
			if (force_pending_approval_flow && document_type_data[_doc_status]?.force_pending_approval_flow_on && approval_access_data?.toggle) {
				next_action = document_type_data[_doc_status]?.force_pending_approval_flow_on?.next;
				current_action = document_type_data[_doc_status]?.force_pending_approval_flow_on?.current;
			} else if (approval_access_data?.toggle) {
				next_action = document_type_data[_doc_status]?.approval_mode_on?.next;
				current_action = document_type_data[_doc_status]?.approval_mode_on?.current;
			} else {
				next_action = document_type_data[_doc_status]?.approval_mode_off?.next;
				current_action = document_type_data[_doc_status]?.approval_mode_off?.current;
			}
		}

		const handle_store_front_action = async () => {
			const pages = wizshop_settings?.pages || STEPPER_CONSTANTS;
			const current_step = _.find(pages, { key: active_step?.stepper_key });
			const current_index = _.findIndex(pages, { key: current_step?.key });

			if (current_index === pages?.length - 1 && pages[current_index]?.key === STEPPER_CONSTANTS.REVIEW.key) {
				try {
					const status_res: any = await api_requests.order_management.get_document_status(document_data?.id);
					if (['confirmed', 'pending-approval'].includes(status_res?.data?.status)) {
						dispatch<any>(
							show_toast({
								open: true,
								showCross: true,
								anchorOrigin: {
									vertical: types.VERTICAL_TOP,
									horizontal: types.HORIZONTAL_CENTER,
								},
								autoHideDuration: 5000,
								onClose: (event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
									console.log(event);
									if (reason === types.REASON_CLICK) {
										return;
									}
									dispatch(close_toast(''));
								},
								state: types.WARNING_STATE,
								title: 'Order is already closed',
								subtitle: '',
								showActions: false,
							}),
						);
						navigate('/all-products');
					}
				} catch (err) {
					console.error(err, 'error while fetching status');
				}
				handle_click_cta(document?.Actions[next_action]?.value, document?.Actions[next_action]?.require_confirmation, next_action, 'next');
			} else {
				handle_update_stepper(current_index + 1, pages[current_index + 1]?.key);
			}
		};
		const handle_reorder_button = () => {
			Mixpanel.track(Events.REORDER_DETAIL_CLICKED, {
				tab_name: 'Reorder',
				page_name: 'Order Detail',
				section_name: '',
			});
			set_isview({ state: true, data: document_data });
		};
		return (
			<Grid display={'flex'} gap={1} pl={is_small_screen ? 0 : 2} pt={2} className={classes.fixedActionButtons}>
				{type === 'order' && is_ultron && (
					<React.Fragment>
						{payments_on_pending_approval &&
							params?.doc_status === document.DocumentStatus?.pendingApproval &&
							document_status === document.DocumentStatus?.pendingApproval &&
							!_.includes(PAID_STATUS, payment_status) && (
								<Can I={PERMISSIONS?.collect_payment_for_order?.slug} a={PERMISSIONS?.collect_payment_for_order?.permissionType}>
									<Button onClick={handle_collect_payment_click} variant='contained' fullWidth>
										Collect payment
									</Button>
								</Can>
							)}
						{document_status === document.DocumentStatus?.confirmed ? (
							!_.includes(PAID_STATUS, payment_status) && check_permission(['collect_payment_for_order']) ? (
								<Button
									fullWidth
									onClick={handle_collect_payment_click}
									variant={next_action && !is_editable_order ? 'outlined' : 'contained'}>
									Collect payment
								</Button>
							) : (
								<>
									{check_permission(['credit_top_up']) && (
										<Button
											fullWidth
											onClick={handle_add_credits_click}
											variant={next_action && !is_editable_order ? 'outlined' : 'contained'}>
											Add credits
										</Button>
									)}
								</>
							)
						) : !_.find(user_permissions, { slug: 'view_payment_method' })?.toggle && current_action === 'DraftOrderAction' ? (
							<Button
								fullWidth
								variant='outlined'
								disabled={is_primary_loading || is_secondary_loading || is_end_state}
								loading={is_primary_loading}
								onClick={() =>
									handle_click_cta(
										document?.Actions[current_action]?.value,
										document?.Actions[current_action]?.require_confirmation,
										next_action,
										'current',
									)
								}>
								{document?.Actions[current_action]?.label}
							</Button>
						) : (
							<>
								{document_status !== document.DocumentAction.pendingApproval &&
									document_status !== 'cancelled' &&
									payment_status === 'PENDING' && (
										<Can
											I={PERMISSIONS?.edit_orders?.slug && PERMISSIONS?.view_payment?.slug}
											a={PERMISSIONS?.view_payment?.permissionType}>
											<Button
												fullWidth
												variant={next_action && !is_editable_order ? 'outlined' : 'contained'}
												onClick={handle_add_edit_payment_click}>
												{payment_method_v2?.payment_method_id ? 'Edit' : 'Add'} Card
											</Button>
										</Can>
									)}
							</>
						)}
					</React.Fragment>
				)}

				{/* for pending approval flow - edit flow */}
				{is_editable_order && !current_action && !next_action && (
					<Button
						fullWidth
						variant='outlined'
						disabled={is_primary_loading || is_secondary_loading || is_end_state}
						loading={is_primary_loading}
						sx={{
							marginX: 2,
						}}
						onClick={() => handle_click_cta('update-order', false, null, null)}>
						Proceed
					</Button>
				)}

				{doc_status && is_store_front && !is_big_screen && (
					<div className={classes.orderbuttonContainer}>
						<Button variant='outlined' width='100%' onClick={() => navigate('/all-products')}>
							Continue Shopping
						</Button>
						{enable_reorder_flow && !hide_integration_reorder && (
							<Button width='100%' onClick={handle_reorder_button}>
								{t('Common.ReOrderFlow.ReOrder')}
							</Button>
						)}
					</div>
				)}

				{is_ultron
					? (current_action || next_action) && (
							<React.Fragment>
								{/* for submitted quote - edit flow */}
								{is_edit_quote && (
									<Button
										fullWidth
										variant='outlined'
										disabled={is_primary_loading || is_secondary_loading || is_end_state}
										loading={is_primary_loading}
										onClick={() =>
											handle_click_cta('re-submit', document?.Actions[current_action]?.require_confirmation, next_action, 'current')
										}>
										{t('OrderManagement.CartCheckoutCard.ReSumbitQuote')}
									</Button>
								)}

								{/* for updating edited order - edit flow*/}
								{current_action && is_editable_order && (
									<Button
										fullWidth
										variant='outlined'
										disabled={is_primary_loading || is_secondary_loading || is_end_state}
										loading={is_primary_loading}
										onClick={() => handle_click_cta('update-order', false, null, null)}>
										{t('OrderManagement.CartCheckoutCard.UpdateOrder')}
									</Button>
								)}

								{/* current action cta - no edit flow  */}
								{current_action && !is_edit_quote && !is_editable_order && type !== 'order' && (
									<Button
										fullWidth
										variant='outlined'
										loading={is_primary_loading}
										disabled={is_primary_loading || is_secondary_loading || is_end_state || document?.Actions[current_action]?.disabled}
										onClick={() =>
											handle_click_cta(
												document?.Actions[current_action]?.value,
												document?.Actions[current_action]?.require_confirmation,
												next_action,
												'current',
											)
										}>
										{document?.Actions[current_action]?.label}
									</Button>
								)}

								{/* next action cta - no edit flow  */}
								{next_action && !is_editable_order && (
									<Button
										fullWidth
										variant='contained'
										loading={is_secondary_loading}
										disabled={is_primary_loading || is_secondary_loading || is_end_state || document?.Actions[next_action]?.disabled}
										onClick={() =>
											handle_click_cta(
												document?.Actions[next_action]?.value,
												document?.Actions[next_action]?.require_confirmation,
												next_action,
												'next',
											)
										}>
										{document?.Actions[next_action]?.label}
									</Button>
								)}
							</React.Fragment>
					  )
					: !doc_status && (
							<Button
								fullWidth
								variant='contained'
								disabled={is_terms_empty && !external_terms_and_conditions?.enabled ? false : is_button_disabled}
								loading={is_primary_loading || btn_loading || buyer_section_loading}
								onClick={handle_store_front_action}>
								{handle_get_label_cta()}
							</Button>
					  )}
			</Grid>
		);
	};

	const handle_render_buyer_info = () => {
		return (
			<React.Fragment>
				{buyer_info_data && !loading && is_ultron ? (
					show_buyer_info && <AccountList data={buyer_info_data} handle_click={handle_navigate} />
				) : (
					<CartCheckoutSkeleton />
				)}
				{show_buyer_info && <hr></hr>}
			</React.Fragment>
		);
	};
	const should_display_container_section = () => {
		return cart_container_config?.tenant_container_enabled && show_container && !_.isEmpty(container_data?.containers) && switch_toggle;
	};

	return (
		<Grid
			item
			xl={show_buyer_info ? 4 : 12}
			lg={show_buyer_info ? 4 : 12}
			md={show_buyer_info ? 4 : 12}
			sm={12}
			xs={12}
			className={classes.cartCheckoutContainer}
			width={show_buyer_info ? '20rem' : 'auto'}
			style={cart_container_style}
			height={!show_buyer_info ? 'auto' : ''}>
			<Box
				className={!is_end_status && is_store_front ? classes.cartCheckoutCard_isDraft : classes.cartCheckoutCard}
				p={is_end_status ? '1rem 0rem 0rem' : is_ultron ? '2rem' : '2.4rem'}
				sx={card_style()}>
				{is_ultron && handle_render_buyer_info()}

				{handle_render_cart_price()}

				{charge_modal_details?.is_open && (
					<ChargeModal
						on_close={close_charge_modal}
						document_id={document_data?.id}
						charges={charges}
						cart_total={total}
						handle_edit_modal_action={handle_edit_modal_action}
						charge_name={charge_modal_details?.charge_name}
						charge_type={charge_modal_details?.charge_type}
						is_open={charge_modal_details?.is_open}
						charge_id={charge_modal_details?.charge_id}
						modal_details={charge_modal_details}
					/>
				)}
			</Box>
			{document_status === 'draft' && is_store_front && (
				<Grid ml={2} mt={2} p={1} className={classes.charge_warning} gap={1}>
					<Icon iconName='IconInfoCircle' className={classes.charge_warning_icon} />
					<CustomText>
						<strong>{t('OrderManagement.CartCommonNotification.Title')}</strong>
						{t('OrderManagement.CartCommonNotification.SubTitle')}
					</CustomText>
				</Grid>
			)}
			{is_store_front && (
				<Can I={PERMISSIONS?.edit_orders?.slug} a={PERMISSIONS?.edit_orders?.permissionType}>
					{handle_render_action_buttons(document_status)}
				</Can>
			)}
			{is_store_front && active_step?.stepper_key === STEPPER_CONSTANTS?.REVIEW?.key && !is_terms_empty && render_terms_and_conditions()}
			{external_terms_and_conditions?.enabled &&
				active_step?.stepper_key === STEPPER_CONSTANTS?.REVIEW?.key &&
				render_external_terms_and_conditions()}
			{show_container && is_ultron && (
				<Grid pt={2} container sx={disclaimer_container}>
					<Grid display='flex' alignSelf='center' style={{ marginRight: '0.5rem' }}>
						<Icon iconName='IconInfoCircle' color={text_colors.dark_grey} />
					</Grid>
					<Grid display='flex' gap={1}>
						<CustomText color={text_colors.dark_grey} type='Subtitle'>
							{t('OrderManagement.CartCommonNotification.Title')}
						</CustomText>
						<CustomText color={text_colors.dark_grey} type='Body'>
							{t('OrderManagement.CartCommonNotification.SubTitle')}
						</CustomText>
					</Grid>
				</Grid>
			)}

			{is_ultron && should_display_container_section() && (
				<Grid pt={2} className={classes.containerise_cart}>
					<ContainerisedCart
						container_loading={container_loading}
						switch_toggle={switch_toggle}
						set_switch_toggle={set_switch_toggle}
						container_data={containers_data?.containers || []}
						selected_container={selected_container}
						set_selected_container={set_selected_container}
						allow_edit={false}
						toggle_button_value={container_data?.cart_volume_unit}
					/>
				</Grid>
			)}

			{is_error_modal_open && (
				<CartItemModal
					handle_review_cart={() => handle_edit_cart('')}
					open={is_error_modal_open}
					set_open={set_is_error_modal_open}
					is_discount_campaign_issue={is_discount_campaign_error}
				/>
			)}
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
};

export default CartCheckoutCard;
