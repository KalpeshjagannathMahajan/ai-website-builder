/* eslint-disable */
import { useState, useContext } from 'react';
import { Typography, Button, Modal, Grid, Icon } from 'src/common/@the-source/atoms';
import { get_initials, get_formatted_price_with_currency } from 'src/utils/common';
import CartSummaryContext from '../context';
import { useDispatch, useSelector } from 'react-redux';
import { create_document_type } from 'src/actions/buyer';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PERMISSIONS } from 'src/casl/permissions';
import { IPermission } from 'src/@types/permissions';
import CartItemModal from 'src/common/CartItemModal';
import CartCheckModal from './CartCheckModal';
import CustomText from 'src/common/@the-source/CustomText';
import { useNavigate } from 'react-router-dom';
import { Alert, useTheme } from '@mui/material';
import CartConfirmationModal from './CartConfirmationModal';
import { check_permission } from 'src/utils/utils';
import { makeStyles } from '@mui/styles';
import UpdateOrderModal from './UpdateConfirmOrder';
import { clear_filters_from_session_storage } from 'src/screens/ProductListing/utils';
import _ from 'lodash';
import CustomCartTotal from 'src/common/CustomCartTotal';
import { text_colors } from 'src/utils/light.theme';
import { get_items } from '../helper';
import '../../../common/SelectBuyerPanel/styles.css';
import useCatalogActions from 'src/hooks/useCatalogActions';
import cart_management from 'src/utils/api_requests/cartManagement';

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
			marginBottom: '16px',
		},
		seperator: {
			height: '1px',
			width: '100%',
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
		buyer_info_box: {
			display: 'flex',
			justifyContent: 'center',
			flexDirection: 'column',
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
	};
});

interface Props {
	tenant_container_enabled?: boolean;
}

const CartSummaryCard = ({ tenant_container_enabled = false }: Props) => {
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
		cart_errors,
		cart_group_data,
		cart_discount_campaigns,
		selected_cart_discount,
	} = useContext(CartSummaryContext);
	const classes = useStyles();
	console.log(selected_cart_discount, 'selected_discount');
	// const [show_discount_modal, toggle_discount_modal] = useState(false);
	const [show_cart_check_modal, toggle_cart_check_modal] = useState(false);
	const [update_confirmed_order, set_update_confirmed_order] = useState(false);
	const [show_order_quote_modal, set_show_order_quote_modal] = useState(false);
	const buyer = useSelector((state: any) => state.buyer);
	const [open_modal, set_open_modal] = useState(false);
	const [expanded, set_expanded] = useState<string[]>([]);
	const dispatch = useDispatch();
	const location = useLocation();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const theme: any = useTheme();

	const { data } = cart;

	const permissions = useSelector((state: any) => state?.login?.permissions);
	const create_order_permission = permissions.find((item: IPermission) => item?.slug === PERMISSIONS?.create_orders.slug);
	const update_order_permission = permissions.find((item: IPermission) => item?.slug === PERMISSIONS?.edit_orders.slug);
	const settings = useSelector((state: any) => state?.settings);
	const currency_symbol = cart_summary_card?.currency_symbol;
	const buyer_info = cart_summary_card?.buyer_info;
	const from_comfirmed_order = location?.state?.from === 'confirmed';
	const is_error = Object?.values(is_cart_global_error)?.some((v) => v) || !_.isEmpty(cart_errors);
	let from_submitted_quote = location?.state?.from;
	const { handle_reset_catalog_mode } = useCatalogActions();

	const handle_close_modal = () => {
		set_open_modal(false);
		dispatch(create_document_type(null));
	};
	const total = cart_summary_card?.cart_total;

	const max_cart_discount = () => {
		const discount_value_to_show =
			selected_cart_discount?.configuration?.type === 'percentage'
				? `${selected_cart_discount?.configuration?.value}% off`
				: ` ${get_formatted_price_with_currency(
						currency_symbol,
						selected_cart_discount?.configuration?.value > total ? total : selected_cart_discount?.configuration?.value,
				  )} off`;

		if (cart_discount_campaigns.length > 0)
			return (
				<div className={classes.section}>
					<div className={classes.info_box}>
						<CustomText type='Title' color='rgba(0, 0, 0, 0.87)'>
							{/* {t('CartSummary.CartSummaryCard.Total')} */}
							{`${selected_cart_discount?.name} (${discount_value_to_show})`}
						</CustomText>
						<CustomText type='Title' color='red'>
							{get_formatted_price_with_currency(currency_symbol, selected_cart_discount?.discount_value)}
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
		} else if (buyer?.is_guest_buyer) {
			if (!check_permission(permissions, ['create_buyers'])) {
				handle_existing_buyer();
			} else {
				set_open_modal(true);
			}
		} else if (cart_summary_card?.cart_check !== 0) {
			toggle_cart_check_modal(true);
		} else if (tenant_container_enabled) {
			handle_create_document(doc_type);
		} else {
			handle_create_document(doc_type);
		}
		clear_filters_from_session_storage(); // remove all products filter from session storage
	};

	const handle_review_cart = () => {
		set_is_error_modal_open(false);
	};

	const handle_discard_and_proceed = async () => {
		if (type === 'quote') {
			if (tenant_container_enabled) {
				handle_create_document('quote');
			} else {
				handle_create_document('quote');
			}
		}
		if (type === 'order') {
			if (tenant_container_enabled) {
				handle_create_document('order');
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
	const handle_close_update_order_modal = () => {
		set_update_confirmed_order(false);
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

	const handle_navigate_on_click = () => {
		navigate(`/buyer/dashboard/${data?.buyer_id}`, {
			state: {
				from: 'cart-summary',
			},
		});
	};

	const handle_close_order_quote_modal = () => {
		set_show_order_quote_modal(false);
		set_type('');
	};

	const handle_open_order_quote_modal = (doc_type: string) => {
		if (buyer.is_guest_buyer) {
			set_open_modal(true);
			if (!settings?.catalog_switching_enabled_at_buyer_level) {
				handle_create_document_by_type(doc_type);
			} else {
				dispatch(create_document_type('catalog_enabled_document'));
			}
		} else {
			set_type(doc_type);
			set_show_order_quote_modal(true);
		}
		handle_reset_catalog_mode();
	};
	const handle_confirm_update = () => {
		handle_update_document();
	};

	const handle_update = () => {
		if (from_comfirmed_order) {
			set_update_confirmed_order(true);
		} else {
			handle_confirm_update();
		}
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
				<CustomText type='H6' color={text_colors?.black}>
					{get_formatted_price_with_currency(currency_symbol, cart_summary_card?.cart_total)}
				</CustomText>
			</Grid>
		);
	};

	const handle_discard_update = async () => {
		try {
			const response: any = await cart_management.resync_cart(cart?.data?.id);
			if (response?.status_code === 200) {
				navigate(-1);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<>
			<div
				className={classes.container}
				style={{
					background: theme?.cart_summary?.summary_card?.background,
					boxShadow: `0px 3px 1px -2px ${theme?.cart_summary?.summary_card?.box_shadow}`,
				}}>
				<div>
					<div className={classes.section_1}>
						<div className={classes.avatar_box}>
							<CustomText type='H2' style={{ fontWeight: 500 }} color={theme?.cart_summary?.summary_card?.initial}>
								{get_initials(buyer_info?.buyer_name, 2)}
							</CustomText>
						</div>
						<div className={classes.buyer_info_box}>
							<CustomText
								type='H6'
								color={theme?.cart_summary?.summary_card?.buyer_name}
								onClick={handle_navigate_on_click}
								style={{
									cursor: 'pointer',
								}}>
								{buyer_info?.buyer_name}
							</CustomText>
							{!buyer_info?.is_guest_buyer && (
								<CustomText type='Body' color={theme?.cart_summary?.summary_card?.location}>
									{buyer_info?.location}
								</CustomText>
							)}
						</div>
					</div>
					<div className={classes.seperator} style={{ borderBottom: `1px dashed ${theme?.cart_summary?.summary_card?.seperator}` }} />{' '}
				</div>

				<div className={classes.section}>
					<div className={classes.info_box}>
						<CustomCartTotal
							cart_group_data={cart_group_data}
							handle_display_total={handle_display_total}
							expanded={expanded}
							handleChange={handleChange}
							cart={cart?.data}
						/>
					</div>
				</div>
				{max_cart_discount()}
				<div className={classes.seperator} style={{ borderBottom: `1px dashed ${theme?.cart_summary?.summary_card?.seperator}` }} />
				<div className={classes.section}>
					<div className={classes.info_box}>
						<CustomText type='H2' color={theme?.colors?.black_8}>
							{t('CartSummary.CartSummaryCard.Total')}
						</CustomText>
						<CustomText type='H2' color={theme?.colors?.black_8}>
							{get_formatted_price_with_currency(currency_symbol, selected_cart_discount?.discounted_value)}
						</CustomText>
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
							<Alert id='assign_cart_alert' sx={{ my: 1, px: 1, py: 0.4 }} severity='warning'>
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
							<Alert id='assign_cart_alert' sx={{ my: 1, px: 1, py: 0.4 }} severity='warning'>
								{t('BuyerDashboard.SelectBuyerPanel.AlertMessage')}
							</Alert>
						</>
					}
				/>
				<div className={classes.info_box}>
					{is_edit_flow ? (
						update_order_permission?.toggle ? (
							<>
								<Button sx={{ height: '44px', flex: 1 }} onClick={handle_discard_update}>
									Discard
								</Button>
								<Button
									disabled={is_error || is_primary_loading || is_secondary_loading || discount_loader}
									loading={is_primary_loading}
									variant='outlined'
									sx={{ height: '44px', flex: 1 }}
									onClick={handle_update}>
									{handle_primary_button_cta()}
								</Button>
								{/* {cart_summary_card?.document_type === 'quote' && (
									<Button
										disabled={is_error || is_secondary_loading || is_primary_loading || discount_loader}
										loading={is_secondary_loading}
										sx={{ height: '44px', flex: 1 }}
										onClick={() => set_show_confirmation_modal(true)}>
										{t('CartSummary.CartSummaryCard.ConterToOrder')}
									</Button>
								)} */}
							</>
						) : (
							render_not_allowed()
						)
					) : (
						<>
							{create_order_permission?.toggle ? (
								<>
									<Button
										disabled={is_error || is_primary_loading || is_secondary_loading || discount_loader}
										variant='outlined'
										sx={{ height: '44px', flex: 1 }}
										onClick={() => handle_open_order_quote_modal('quote')}>
										{t('CartSummary.CartSummaryCard.CreateQuote')}
									</Button>
									<Button
										disabled={is_error || is_secondary_loading || is_primary_loading || discount_loader}
										sx={{ flex: 1, height: '44px' }}
										onClick={() => handle_open_order_quote_modal('order')}>
										{t('CartSummary.CartSummaryCard.CreateOrder')}
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

			{show_cart_check_modal && (
				<CartCheckModal
					show_modal={show_cart_check_modal}
					handle_close={handle_close_cart_check_modal}
					handle_proceed={handle_discard_and_proceed}
					cart_check={cart_summary_card.cart_check}
				/>
			)}
			{update_confirmed_order && (
				<UpdateOrderModal
					show_modal={update_confirmed_order}
					handle_close={handle_close_update_order_modal}
					handle_proceed={handle_confirm_update}
				/>
			)}
			{is_error_modal_open && (
				<CartItemModal handle_review_cart={handle_review_cart} open={is_error_modal_open} set_open={set_is_error_modal_open} />
			)}
		</>
	);
};

export default CartSummaryCard;
