/* eslint-disable */
import { useState, useContext } from 'react';
import { Typography, Button, Modal, Grid, Icon, Image } from 'src/common/@the-source/atoms';
import { currency_number_format_no_sym, formatNumberWithCommas, get_formatted_price_with_currency } from 'src/utils/common';
import CartSummaryContext from '../context';
import { useDispatch, useSelector } from 'react-redux';
import { create_document_type } from 'src/actions/buyer';
import { useLocation } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { PERMISSIONS } from 'src/casl/permissions';
import { IPermission } from 'src/@types/permissions';
import CartItemModal from 'src/common/CartItemModal';
import CustomText from 'src/common/@the-source/CustomText';
import { Alert, useMediaQuery, useTheme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import CartCheckModal from '../components/CartCheckModal';
import CartConfirmationModal from '../components/CartConfirmationModal';
import ImageLinks from 'src/assets/images/ImageLinks';
import _, { isEmpty } from 'lodash';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import { columnDefs } from 'src/utils/shppingRuleConfig';
import CustomCartTotal from 'src/common/CustomCartTotal';
import { get_items } from '../helper';
import { text_colors } from 'src/utils/light.theme';
import jsonLogic from 'json-logic-js';

const useStyles = makeStyles((theme: any) => {
	return {
		container: {
			padding: '24px',
			display: 'flex',
			flexDirection: 'column',
			gap: '16px',
			borderRadius: '12px',
			backgroundColor: theme?.cart_summary?.summary_card?.background,
			width: '100%',
			boxShadow: `0px 3px 1px -2px ${theme?.cart_summary?.summary_card?.box_shadow}`,
		},
		section_1: {
			display: 'flex',
			gap: '16px',
		},
		seperator: {
			height: '1px',
			width: '100%',
			borderBottom: `1px dashed ${theme?.cart_summary?.summary_card?.seperator}`,
		},
		avatar_box: {
			borderRadius: '50%',
			background: theme?.cart_summary?.summary_card?.avatar_box,
			height: '48px',
			width: '48px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
		},
		info_box: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			gap: '12px',
		},
		section: {
			display: 'flex',
			flexDirection: 'column',
			gap: '12px',
		},
		not_allowed: {
			background: theme?.cart_summary?.summary_card?.blocked,
			display: 'flex',
			padding: '8px 6px',
			gap: '4px',
			width: '100%',
			borderRadius: '6px',
			wordBreak: 'break-all',
			whiteSpace: 'pre-wrap',
		},
		fixedActionButtons: {
			display: 'flex',
			flexDirection: 'column',
			'@media (max-width: 900px)': {
				position: 'absolute',
				bottom: 0,
				left: 0,
				right: 0,
				border: 'none',
				borderTop: '1px solid #D1D6DD',
				zIndex: 1000,
				background: '#FFFFFF',
				padding: '12px 0px',
				width: '100%',
			},
		},
		shipping_error_container: {
			display: 'flex',
			width: '100%',
			alignItems: 'center',
			padding: '10px 16px',
			gap: '12px',
		},
		nudge_container: {
			display: 'flex',
			width: '100%',
			alignItems: 'center',
			padding: '10px 16px',
			gap: '12px',
		},
		modal_container: {
			height: 'auto',
			overflow: 'hidden',
		},
		table_container: {
			height: 'calc(100vh - 420px)',
			overflow: 'hidden',
		},
		know_more_text: {
			textDecoration: 'underline',
			cursor: 'pointer',
		},
	};
});

interface Props {
	selected_container?: any;
	container_is_display?: boolean;
	tenant_container_enabled?: boolean;
}

const StoreCartSummary = ({ selected_container = [], container_is_display = false, tenant_container_enabled = false }: Props) => {
	const {
		is_cart_global_error,
		type,
		set_type,
		is_edit_flow,
		set_is_buyer_add_form,
		handle_update_document,
		cart_summary_card,
		set_transfer_cart,
		handle_create_document,
		// set_show_confirmation_modal,
		toggle_buyer_panel,
		is_secondary_loading,
		is_primary_loading,
		set_create_new_buyer,
		is_error_modal_open,
		set_is_error_modal_open,
		handle_discount_check,
		toggle_toast,
		cart,
		discount_loader,
		cart_error,
		cart_group_data,
		cart_errors,
		nudge_data,
		know_more_data,
		cart_discount_campaigns,
		selected_cart_discount,
		is_discount_campaign_error,
		set_is_discount_campaign_error,
	} = useContext(CartSummaryContext);
	const is_retail_mode = localStorage.getItem('retail_mode') === 'true';
	const [show_cart_check_modal, toggle_cart_check_modal] = useState(false);
	const [show_order_quote_modal, set_show_order_quote_modal] = useState(false);
	const [expanded, set_expanded] = useState<string[]>([]);
	const buyer = useSelector((state: any) => state.buyer);
	const [open_modal, set_open_modal] = useState(false);
	const [know_more_modal, set_know_more_modal] = useState(false);
	const dispatch = useDispatch();
	const location = useLocation();
	const { t } = useTranslation();
	const theme: any = useTheme();
	const classes = useStyles(theme);
	const is_small_screen = useMediaQuery(theme.breakpoints.down('md'));

	const { total: cart_in_stock_total, min_value } = cart_error;

	const { nudge = {}, charge = [], disclaimer = {} } = nudge_data;
	const discount = nudge?.discount;
	const is_nudge_display = nudge_data && discount;
	const amount_needed = formatNumberWithCommas(currency_number_format_no_sym(nudge?.amount_needed));

	const permissions = useSelector((state: any) => state?.login?.permissions);
	const create_order_permission = _.find(permissions, (item: IPermission) => item?.slug === PERMISSIONS?.create_orders.slug);
	const update_order_permission = _.find(permissions, (item: IPermission) => item?.slug === PERMISSIONS?.edit_orders.slug);
	const currency_symbol = cart_summary_card?.currency_symbol;
	const is_error = _.some(_.values(is_cart_global_error)) || !_.isEmpty(cart_errors);
	let from_submitted_quote = location?.state?.from;
	const cart_container_config = useSelector((state: any) => state?.settings?.cart_container_config);

	const handle_close_modal = () => {
		set_open_modal(false);
		dispatch(create_document_type(null));
	};

	const handle_close_know_more = () => {
		set_know_more_modal(false);
	};

	let total = cart_summary_card?.cart_total || 0;

	_.forEach(charge, (charge_item: any) => {
		const calculated_value = _.get(charge_item, 'calculated_value', 0);
		const charge_type = _.get(charge_item, 'charge_type', '');

		if (charge_type === 'tax') {
			total += calculated_value;
		} else if (charge_type === 'discount' || charge_type === 'charge_discount') {
			total -= calculated_value;
		}
	});

	if (selected_cart_discount?.discount_value) {
		total -= selected_cart_discount.discount_value;
	}
	const total_cart = cart_summary_card?.cart_total;
	jsonLogic.add_operation('cart_segement_handling', (rule, whole_data) => {
		const answer = jsonLogic.apply(rule, { cart_data: whole_data });
		// console.log(answer, 'amount', rule, whole_data);
		return answer;
	});

	const handle_get_discount = () => {
		const discountRule = {
			cart_segement_handling: [
				{ var: 'eligibility_rule' }, // References 'eligibility_rule' from data
				{ var: 'cart_data' }, // References 'cart_data' from data
			],
		};

		if (selected_cart_discount?.discount_type === 'percentage') {
			return total_cart * (selected_cart_discount?.configuration?.value / 100);
		} else if (selected_cart_discount?.discount_type === 'slab') {
			const val = jsonLogic.apply(discountRule, { eligibility_rule: selected_cart_discount?.cart_eligibilty_rule, cart_data: cart?.data });
			return val;
		} else if (selected_cart_discount?.discount_type === 'value') {
			return selected_cart_discount?.configuration?.value > total ? total : selected_cart_discount?.configuration?.value;
		} else {
			return 0;
		}
	};

	const discount_value_visible = _.includes(['pending-approval', 'confirmed'], cart?.data?.document_status)
		? handle_get_discount()
		: selected_cart_discount?.discount_value > total_cart
		? total_cart
		: selected_cart_discount?.discount_value || 0;
	const max_cart_discount = () => {
		const discount_value_to_show =
			selected_cart_discount?.discount_type === 'percentage'
				? `${selected_cart_discount?.configuration?.value}% off`
				: selected_cart_discount?.discount_type === 'slab'
				? ''
				: ` ${get_formatted_price_with_currency(
						currency_symbol,
						selected_cart_discount?.discount_value > total ? total : selected_cart_discount?.discount_value,
				  )} off`;

		if (cart_discount_campaigns?.length > 0 && selected_cart_discount?.discount_value > 0)
			return (
				<div className={classes.section}>
					<div className={classes.info_box}>
						<CustomText type='Title' color='rgba(0, 0, 0, 0.87)'>
							{`${!isEmpty(selected_cart_discount?.display_name) ? selected_cart_discount?.display_name : 'Discount'} ${
								isEmpty(discount_value_to_show) ? '' : `(${discount_value_to_show})`
							}`}
						</CustomText>
						<CustomText type='Title' color='red'>
							{`- ${get_formatted_price_with_currency(currency_symbol, discount_value_visible)}`}
						</CustomText>
					</div>
				</div>
			);
	};

	const render_not_allowed = () => {
		return (
			<div className={classes.not_allowed}>
				<Icon color={'#CE921E'} iconName={'IconAlertTriangle'} sx={{ transform: 'scale(0.9)' }} />

				<Typography variant='subtitle1' color='#684500' sx={{ fontWeight: 400, fontSize: '14px' }}>
					{is_edit_flow ? t('CartSummary.CartSummaryCard.UpdateOrderNotAllowed') : t('CartSummary.CartSummaryCard.CreateOrderNotAllowed')}
				</Typography>
			</div>
		);
	};

	const handle_existing_buyer = () => {
		set_open_modal(false);
		toggle_buyer_panel(true);
		set_transfer_cart(true);
	};

	const handle_create_document_by_type = (doc_type: string) => {
		set_type(doc_type);
		dispatch(create_document_type(doc_type));
		if (handle_discount_check()) {
			toggle_toast({
				show: true,
				message: `${
					doc_type === 'quote' ? 'Quote' : 'Order'
				} cannot be created as discount is higher than price. Please edit discount for this product to proceed`,
				title: 'Excessive Discount',
				status: 'warning',
			});
		} else if (cart_summary_card?.cart_check !== 0) {
			toggle_cart_check_modal(true);
		} else if (tenant_container_enabled) {
			handle_create_document(
				doc_type,
				[{ ...selected_container, unit: cart_container_config?.tenant_container_default_unit }],
				container_is_display,
			);
		} else {
			handle_create_document(doc_type);
		}
	};

	const handle_review_cart = () => {
		set_is_error_modal_open(false);
		set_is_discount_campaign_error(false);
	};

	const handle_discard_and_proceed = async () => {
		if (type === 'quote') {
			if (tenant_container_enabled) {
				handle_create_document(
					'quote',
					[{ ...selected_container, unit: cart_container_config?.tenant_container_default_unit }],
					container_is_display,
				);
			} else {
				handle_create_document('quote');
			}
		}
		if (type === 'order') {
			if (tenant_container_enabled) {
				handle_create_document(
					'order',
					[{ ...selected_container, unit: cart_container_config?.tenant_container_default_unit }],
					container_is_display,
				);
			} else {
				handle_create_document('order');
			}
		}
		toggle_cart_check_modal(false);
	};

	const handle_close_cart_check_modal = () => {
		toggle_cart_check_modal(false);
		set_type('');
	};

	const handle_new_buyer = () => {
		set_open_modal(false);
		set_is_buyer_add_form(true);
		set_transfer_cart(true);
		set_create_new_buyer(true);
	};

	const handle_primary_button_cta = () => {
		if (cart_summary_card?.document_type === 'order') {
			return t('CartSummary.CartSummaryCard.UpdateOrder');
		} else if (from_submitted_quote === 'submitted_quote') {
			return t('CartSummary.CartSummaryCard.SaveChanges');
		} else {
			return t('CartSummary.CartSummaryCard.UpdateQuote');
		}
	};

	const handle_close_order_quote_modal = () => {
		set_show_order_quote_modal(false);
		set_type('');
	};

	const handle_open_order_quote_modal = (doc_type: string) => {
		handle_create_document_by_type(doc_type);
	};

	const get_margin_bottom = () => {
		if (!is_small_screen) return '0px';

		if (!_.isEmpty(cart_error) && !_.isEmpty(nudge)) {
			return '220px';
		}

		if (!_.isEmpty(cart_error) || !_.isEmpty(disclaimer)) {
			return '140px';
		}

		if (!_.isEmpty(nudge)) {
			return _.head(charge)?.value_type === 'fixed' ? '0px' : '145px';
		}

		return '60px';
	};

	const handleChange = (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
		set_expanded(newExpanded ? [...expanded, panel] : _.remove(expanded, (_panel) => _panel !== panel));
	};

	const handle_display_total = () => {
		return (
			<Grid container justifyContent={'space-between'} alignItems={'center'}>
				<CustomText type='Title' color={text_colors?.black}>
					{t('CartSummary.CartSummaryCard.CartTotal')} ({get_items(cart, true)} units)
				</CustomText>
				{!is_retail_mode ? (
					<CustomText type='H6' color={text_colors?.black}>
						{`${currency_symbol} 
				${formatNumberWithCommas(currency_number_format_no_sym(cart_summary_card?.cart_total), true)}`}
					</CustomText>
				) : (
					<Image src={ImageLinks.price_locked} width={150} height={26} />
				)}
			</Grid>
		);
	};

	return (
		<>
			<div
				className={classes.container}
				style={{
					background: theme?.cart_summary?.summary_card?.background,
					boxShadow: theme?.cart_summary?.summary_card?.box_shadow,
					...theme?.card_,
					marginBottom: get_margin_bottom(),
				}}>
				<div className={classes.section}>
					{/* <div className={classes.info_box}>
						<CustomText type='Title' color={theme?.cart_summary?.shipping_charge_container?.color}>
							{t('CartSummary.CartSummaryCard.CartTotal')}
						</CustomText>
						{!is_retail_mode ? (
							<CustomText type='H6' color={theme?.cart_summary?.shipping_charge_container?.color}>
								{`${currency_symbol} 
							${formatNumberWithCommas(currency_number_format_no_sym(cart_summary_card?.cart_total))}`}
							</CustomText>
						) : (
							<Image src={ImageLinks.price_locked} width={150} height={26} />
						)}
					</div> */}
					<CustomCartTotal
						cart_group_data={cart_group_data}
						handle_display_total={handle_display_total}
						expanded={expanded}
						handleChange={handleChange}
						cart={cart?.data}
					/>
				</div>
				{_.map(charge, (charge_item, index) => {
					const charge_name = _.get(charge_item, 'name', '');
					const value_type = _.get(charge_item, 'value_type', '');
					const value = _.get(charge_item, 'value', 0);
					const calculated_value = _.get(charge_item, 'calculated_value', 0);
					const is_tax = charge_item?.charge_type === 'tax';

					return (
						<div key={index} className={classes.section}>
							<div className={classes.info_box}>
								<CustomText type='Title' color={theme?.cart_summary?.shipping_charge_container?.color}>
									{charge_name}
									{value_type !== 'fixed' && ` (${value}%)`}
								</CustomText>

								{!is_retail_mode ? (
									<CustomText
										type='H6'
										color={is_tax ? theme?.cart_summary?.shipping_charge_container?.color : theme?.cart_summary?.discount?.color}>
										{`${!is_tax ? '-' : ''}${currency_symbol} ${formatNumberWithCommas(currency_number_format_no_sym(calculated_value))}`}
									</CustomText>
								) : (
									<Image src={ImageLinks.price_locked} width={150} height={26} />
								)}
							</div>
						</div>
					);
				})}
				{max_cart_discount()}
				<div className={classes.seperator} />
				<div className={classes.section}>
					<div className={classes.info_box}>
						<CustomText type='H2' color={theme?.cart_summary?.shipping_charge_container?.color}>
							{t('CartSummary.CartSummaryCard.Total')}
						</CustomText>
						{!is_retail_mode ? (
							<CustomText type='H2' color={theme?.cart_summary?.shipping_charge_container?.color}>
								{`${currency_symbol} 
						${formatNumberWithCommas(currency_number_format_no_sym(total), true)}`}
							</CustomText>
						) : (
							<Image src={ImageLinks.price_locked} width={150} height={26} />
						)}
					</div>
				</div>
				<Modal
					width={470}
					open={open_modal}
					onClose={handle_close_modal}
					title={t('CartSummary.CartSummaryCard.NewOrExistingBuyer')}
					footer={
						<Grid container justifyContent='end'>
							<Button variant='outlined' onClick={handle_new_buyer} sx={{ marginRight: '1rem' }}>
								{t('CartSummary.CartSummaryCard.CreateNew')}
							</Button>
							<Button onClick={handle_existing_buyer}>{t('CartSummary.CartSummaryCard.ChooseExisting')}</Button>
						</Grid>
					}
					children={
						<>
							<CustomText type='Body'>{t('CartSummary.CartSummaryCard.SelectBuyer')}</CustomText>
							<Alert sx={{ my: 1, px: 1, py: 0.4 }} severity='warning'>
								{t('BuyerDashboard.SelectBuyerPanel.AlertMessage')}
							</Alert>
						</>
					}
				/>

				<CartConfirmationModal
					show_order_quote_modal={show_order_quote_modal}
					handle_close_order_quote_modal={handle_close_order_quote_modal}
					handle_create_document_by_type={handle_create_document_by_type}
					type={type}
					buyer={buyer}
					is_secondary_loading={is_secondary_loading}
					is_primary_loading={is_primary_loading}
					children={
						<>
							<CustomText type='Body'>{t('CartSummary.CartSummaryCard.SelectBuyer')}</CustomText>
							<Alert sx={{ my: 1, px: 1, py: 0.4 }} severity='warning'>
								{t('BuyerDashboard.SelectBuyerPanel.AlertMessage')}
							</Alert>
						</>
					}
				/>
			</div>

			<div className={`${classes.info_box} ${classes.fixedActionButtons}`}>
				{!_.isEmpty(cart_error) && (
					<div
						className={classes.shipping_error_container}
						style={{
							background:
								cart_error?.type === 'error'
									? theme?.order_management?.style?.charge_error_background
									: theme?.order_management?.style?.charge_warning_background,
						}}>
						<Icon
							iconName='IconAlertTriangle'
							color={
								cart_error?.type === 'error'
									? theme?.order_management?.style?.charge_error_icon
									: theme?.order_management?.style?.charge_warning_icon
							}
						/>
						{cart_error?.type === 'error' ? (
							<CustomText>
								To proceed, please ensure that the <span style={{ fontWeight: 700 }}>{cart_error?.message}</span> exceeds{' '}
								<span style={{ fontWeight: 700 }}>{`${currency_symbol} 
							${formatNumberWithCommas(currency_number_format_no_sym(min_value))}`}</span>{' '}
								as it is currently at{' '}
								<span style={{ fontWeight: 700 }}>
									{`${currency_symbol} 
							${formatNumberWithCommas(currency_number_format_no_sym(cart_in_stock_total))}`}
								</span>
								.
							</CustomText>
						) : (
							<CustomText>
								We recommend placing an order that exceeds{' '}
								<span style={{ fontWeight: 700 }}>{`${currency_symbol} 
							${formatNumberWithCommas(currency_number_format_no_sym(min_value))}`}</span>{' '}
								to avoid any
								<span style={{ fontWeight: 700 }}> {cart_error?.message}</span>.
							</CustomText>
						)}
					</div>
				)}
				{!_.isEmpty(disclaimer) && (
					<div className={classes.nudge_container} style={{ background: theme?.cart_summary?.disclaimer?.background }}>
						<Image src={ImageLinks.rosette_discount} width={32} height={32} />
						<div>
							<CustomText>{disclaimer?.text_to_display}</CustomText>
						</div>
					</div>
				)}
				{is_nudge_display && (
					<div className={classes.nudge_container} style={{ background: theme?.cart_summary?.shipping_charge_container?.background }}>
						<Image src={ImageLinks.rosette_discount} width={32} height={32} />
						<div>
							<CustomText>
								<Trans
									i18nKey={
										nudge?.type === 'fixed'
											? _.isInteger(discount)
												? 'CartSummary.CartSummaryCard.NudgeFlatDiscount'
												: 'CartSummary.CartSummaryCard.NudgeFreeShipping'
											: 'CartSummary.CartSummaryCard.NudgeDiscount'
									}
									values={{ currency_symbol, amount_needed, discount }}
									components={{ strong: <strong /> }}
								/>
							</CustomText>
							<CustomText onClick={() => set_know_more_modal(true)} className={classes.know_more_text}>
								{t('CartSummary.CartSummaryCard.KnowMore')}
							</CustomText>
						</div>
					</div>
				)}
				{is_edit_flow ? (
					update_order_permission?.toggle ? (
						<>
							<Button
								disabled={is_error || is_primary_loading || is_secondary_loading || discount_loader || cart_error?.type === 'error'}
								loading={is_primary_loading}
								variant={cart_summary_card?.document_type === 'order' ? 'contained' : 'outlined'}
								sx={{ height: '44px', flex: 1, width: '100%' }}
								onClick={() => handle_update_document(selected_container, cart_container_config, container_is_display)}>
								{handle_primary_button_cta()}
							</Button>
						</>
					) : (
						render_not_allowed()
					)
				) : (
					<>
						{create_order_permission?.toggle ? (
							<>
								<Button
									loading={is_primary_loading}
									disabled={is_error || is_secondary_loading || is_primary_loading || discount_loader || cart_error?.type === 'error'}
									sx={{ flex: 1, height: '44px', width: '100%' }}
									onClick={() => handle_open_order_quote_modal('order')}>
									{t('CartSummary.StorefrontProceed')}
								</Button>
							</>
						) : (
							render_not_allowed()
						)}
					</>
				)}
			</div>
			<Modal
				width={470}
				open={know_more_modal}
				onClose={handle_close_know_more}
				title='Shipping Discount Info'
				className={classes?.modal_container}
				children={
					<AgGridTableContainer
						columnDefs={columnDefs}
						rowData={know_more_data}
						className={classes?.table_container}
						containerStyle={{ height: 'calc(100vh - 450px)', overflow: 'auto' }}
						showStatusBar={false}
					/>
				}
			/>
			{show_cart_check_modal && (
				<CartCheckModal
					show_modal={show_cart_check_modal}
					handle_close={handle_close_cart_check_modal}
					handle_proceed={handle_discard_and_proceed}
					cart_check={cart_summary_card.cart_check}
				/>
			)}
			{is_error_modal_open && (
				<CartItemModal
					handle_review_cart={handle_review_cart}
					open={is_error_modal_open}
					set_open={set_is_error_modal_open}
					is_discount_campaign_issue={is_discount_campaign_error}
				/>
			)}
		</>
	);
};

export default StoreCartSummary;
