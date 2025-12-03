import { Button, Grid, Icon, Menu, Modal, Tooltip } from 'src/common/@the-source/atoms';
import React, { useEffect, useState } from 'react';
import api_requests from 'src/utils/api_requests';
import { useDispatch } from 'react-redux';
import { set_notification_feedback } from 'src/actions/notifications';
import { close_toast, show_toast } from 'src/actions/message';
import types from 'src/utils/types';
import { t } from 'i18next';
import ShareReceiptModal from 'src/screens/OrderManagement/component/Drawer/ShareReceiptModal';
import RefundCreditsDrawer from './RefundCreditsDrawer';
import EmailModalContent from 'src/screens/OrderManagement/component/Common/EmailModalContent';
import SendMailDrawer from 'src/screens/OrderManagement/component/Drawer/SendMailDrawer';
import { EmailData } from 'src/common/Interfaces/EmailData';
import { REFUND_OPTION_VALUES } from '../constants';
import { useSelector } from 'react-redux';
import useDownloadInvoice from 'src/hooks/useDownloadInvoice';
import { get_formatted_price_with_currency } from 'src/utils/common';
import constants from 'src/utils/constants';
import { useNavigate } from 'react-router-dom';
import usePaymentsPermissions from 'src/hooks/usePaymentsPermissions';
import VoidAuthModal from 'src/common/Authorization/VoidAuthModal';
import get from 'lodash/get';
import includes from 'lodash/includes';
import isEmpty from 'lodash/isEmpty';

const { PAYMENT_DEPENDENT_TABLES } = constants;

const PaymentActionComp: React.FC<any> = ({ node, ...rest }) => {
	const row_data = node?.data;
	const [email_modal_data, set_email_modal_data] = useState<any>({ is_open: false, track_is: '', emails: [], type: undefined });
	const [refund_drawer, set_refund_drawer] = useState<any>({ state: false, data: null });
	const [is_button_loading, set_is_button_loading] = useState<boolean>(false);
	const [is_modal_open, set_is_modal_open] = useState<boolean>(false);
	const [is_terminal_modal_open, set_is_terminal_modal_open] = useState<boolean>(false);
	const [reason, set_reason] = useState<string>('');
	const [email_data, set_email_data] = useState<EmailData>({
		to_emails: [],
		cc_emails: [],
		bcc_emails: [],
		is_auto_trigger: false,
		is_enable: false,
		user_permission_flag: false,
	});
	const [email_checkbox, set_email_checkbox] = useState<boolean>(false);
	const [input_value, set_input_value] = useState<any>(refund_drawer?.data?.refundable_amount);
	const [email_drawer, set_email_drawer] = useState<boolean>(false);
	const [open_void_auth_modal, set_open_void_auth_modal] = useState<boolean>(false);
	const [selected_transaction, set_selected_transaction] = useState<any>(false);
	const is_credits_drawer = get(rest, 'colDef.is_credits_drawer', false);
	const [selected_refund_destination, set_selected_refund_destination] = useState<string>(REFUND_OPTION_VALUES.SOURCE);
	const { invoice_download_enabled = false } = useSelector((state: any) => state?.settings);
	const { handle_download_invoice } = useDownloadInvoice();
	const { has_any_refund_permission, has_void_authorization_permission, has_collect_payment_for_customer_permission } =
		usePaymentsPermissions();
	const currency = useSelector((state: any) => state?.settings?.currency);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const set_toast_state = get(rest, 'cellRendererParams.set_toast', () => {});
	const refetch = get(rest, 'cellRendererParams.refetch', () => {});

	const handle_download_click = (ele: any) => {
		api_requests.order_management
			.download_receipt({ transaction_id: ele?.id })
			.then((res: any) => {
				if (res?.status === 200) {
					dispatch(set_notification_feedback(true));
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const show = async (toast: any) => {
		dispatch<any>(
			show_toast({
				open: true,
				showCross: false,
				anchorOrigin: {
					vertical: types.VERTICAL_TOP,
					horizontal: types.HORIZONTAL_CENTER,
				},
				autoHideDuration: 5000,
				onClose: (event: React.ChangeEvent<HTMLInputElement>, rea: String) => {
					if (rea === types.REASON_CLICK) {
						return;
					}
					dispatch(close_toast(''));
				},
				state: toast?.state,
				title: toast?.title,
				subtitle: toast?.subtitle,
				showActions: false,
			}),
		);
	};

	const copy_to_clipboard = async (link: string) => {
		await navigator.clipboard.writeText(link);
		dispatch<any>(
			show_toast({
				open: true,
				showCross: false,
				anchorOrigin: {
					vertical: types.VERTICAL_TOP,
					horizontal: types.HORIZONTAL_CENTER,
				},
				autoHideDuration: 5000,
				onClose: (event: React.ChangeEvent<HTMLInputElement>, rea: String) => {
					if (rea === types.REASON_CLICK) {
						return;
					}
					dispatch(close_toast(''));
				},
				state: types.SUCCESS_STATE,
				title: t('Common.Common.CopiedToClipboard'),
				subtitle: '',
				showActions: false,
			}),
		);
	};

	const handle_download_receipt = () => {
		if (!invoice_download_enabled) {
			window.open(row_data?.invoice_url, 'blank');
			return;
		}
		handle_download_invoice(row_data?.id);
	};

	const handle_void_auth = () => {
		const mapped_row_data = {
			...row_data,
			payment_method_info: {
				title: get(row_data, 'payment_method_info.text_value', ''),
				logo: get(row_data, 'payment_method_info.image_src', null),
			},
		};
		set_selected_transaction(mapped_row_data);
		set_open_void_auth_modal(true);
	};

	const handle_collect_payment = () => {
		if (isEmpty(row_data?.buyer_id)) return;
		navigate(`/payment/form/collect/buyer/${row_data?.buyer_id}`, {
			state: {
				payment_method_id: get(row_data, 'payment_method_id', ''),
			},
		});
	};

	const menu_items = [];
	if (includes(PAYMENT_DEPENDENT_TABLES, row_data?.table_type)) {
		if (
			includes(['add_credits', 'purchase', 'buyer_purchase', 'authorize', 'recurring_payment'], row_data?.transaction_mode) &&
			includes(['success', 'partially_refunded', 'refunded', 'captured'], row_data?.transaction_status)
		)
			menu_items.push({ label: 'Download receipt', icon: 'IconDownload', onClick: () => handle_download_click(row_data) });
		if (row_data?.gateway_transaction_id)
			menu_items.push({ label: 'Copy gateway ID', icon: 'IconCopy', onClick: () => copy_to_clipboard(row_data?.gateway_transaction_id) });
		if (
			row_data?.source === 'payment_link' &&
			includes(['add_credits', 'purchase', 'buyer_purchase'], row_data?.transaction_mode) &&
			row_data?.transaction_status === 'pending'
		)
			menu_items.push({ label: 'Copy payment link', icon: 'IconLink', onClick: () => copy_to_clipboard(row_data?.payment_link) });
		if (
			includes(['add_credits', 'purchase', 'buyer_purchase', 'authorize', 'recurring_payment'], row_data?.transaction_mode) &&
			includes(['success', 'partially_refunded', 'refunded', 'captured'], row_data?.transaction_status)
		)
			menu_items.push({
				label: 'Share receipt',
				icon: 'IconShare',
				onClick: () =>
					set_email_modal_data({
						is_open: true,
						track_id: row_data?.track_id,
						emails: row_data?.notification_email_ids,
						type: 'share_receipt',
						transaction_id: row_data?.id,
					}),
			});
		if (
			row_data?.source === 'payment_link' &&
			includes(['add_credits', 'purchase', 'buyer_purchase'], row_data?.transaction_mode) &&
			row_data?.transaction_status === 'pending'
		)
			menu_items.push({
				label: 'Resend payment link',
				icon: 'IconSend',
				onClick: () =>
					set_email_modal_data({
						is_open: true,
						track_id: row_data?.track_id,
						emails: row_data?.payment_link_email_ids,
						type: 'resend_payment_link',
						transaction_id: row_data?.id,
					}),
			});
		if (
			includes(['add_credits', 'purchase', 'buyer_purchase', 'recurring_payment'], row_data?.transaction_mode) &&
			row_data?.refundable_amount > 0 &&
			has_any_refund_permission
		)
			menu_items.push({
				label: 'Refund',
				icon: 'IconArrowBackUp',
				onClick: () => {
					const { id, entity_type, document_id, buyer_id } = row_data || {};
					if (!isEmpty(row_data?.id)) {
						const entity_mapping: any = {
							order: document_id,
							buyer: buyer_id,
						};
						const navigation_id = entity_mapping[entity_type] ?? id;
						navigate(`/payment/form/refund/${row_data?.entity_type}/${navigation_id}`, {
							state: {
								transaction_id: row_data?.id,
							},
						});
						// set_refund_drawer({
						// 	state: true,
						// 	data: { refund_source: row_data?.table_type === 'payment' ? 'order' : 'buyer', ...row_data },
						// }),
					}
				},
			});
	} else if (row_data?.invoice_url || invoice_download_enabled) {
		menu_items.push({ label: 'Download receipt', icon: 'IconDownload', onClick: handle_download_receipt });
	}
	if (row_data?.transaction_mode === 'authorize' && row_data?.transaction_status === 'success' && has_void_authorization_permission) {
		menu_items.push({ label: 'Void authorization', icon: 'IconCreditCardOff', onClick: handle_void_auth });
	}

	if (
		row_data?.transaction_mode === 'authorize' &&
		row_data?.transaction_status === 'success' &&
		has_collect_payment_for_customer_permission
	) {
		menu_items.push({ label: 'Collect payment', icon: 'IconMoneybag', onClick: handle_collect_payment });
	}

	const handle_submit = () => {
		const data = refund_drawer.data;
		set_is_button_loading(true);
		const payload: any = {
			payment_ids: [data?.id],
			refund_destination: is_credits_drawer ? REFUND_OPTION_VALUES.SOURCE : selected_refund_destination,
			reason,
			amount: input_value,
			is_auto_trigger: email_checkbox,
			email_ids: email_data?.to_emails || [],
		};
		if (data?.refund_source === 'buyer') {
			payload.buyer_id = data?.buyer_id;
			payload.payment_entity = 'buyer';
		} else {
			payload.document_id = data?.document_id;
		}
		const get_api: any = () => {
			switch (data?.refund_source) {
				case 'buyer':
					return api_requests.buyer.submit_refund_credit_details;
				case 'order':
					return api_requests.order_management.submit_refund_details;
			}
		};
		get_api()(payload)
			.then((res: any) => {
				if (res?.refund_status === 'failed') {
					show({ title: 'Refund failed', subtitle: 'Please try again', state: 'error' });
				} else if (res?.refund_status === 'pending') {
					show({
						title: 'Refund request raised',
						subtitle: t('Payment.NotifyOverEmail'),
						state: 'success',
					});
				} else if (res?.refund_status === 'success') {
					show({
						title: 'Refund successful',
						subtitle: t('Payment.CreditsAdded'),
						state: 'success',
					});
				}
			})
			.catch((err: any) => {
				console.log(err);
				show({ title: 'Refund failed', subtitle: 'Please try again', state: 'error' });
			})
			.finally(() => {
				set_is_modal_open(false);
				set_is_terminal_modal_open(false);
				set_is_button_loading(false);
			});
	};

	useEffect(() => {
		set_input_value(refund_drawer?.data?.refundable_amount);
	}, [refund_drawer?.data]);

	return (
		<Grid container mt={1} pt={1} justifyContent='center' alignItems='center'>
			<ShareReceiptModal
				is_visible={email_modal_data.is_open}
				close={() => set_email_modal_data({ is_open: false, track_id: '', emails: [], transaction_id: '' })}
				track_id={email_modal_data.track_id}
				prefilled_emails={email_modal_data.emails}
				type={email_modal_data.type}
				transaction_id={email_modal_data?.transaction_id}
			/>
			{menu_items?.length > 0 && (
				<Menu
					LabelComponent={
						<Tooltip title={'Actions'} placement='right' arrow>
							<div>
								<Icon sx={{ cursor: 'pointer' }} iconName='IconDotsVertical' />
							</div>
						</Tooltip>
					}
					menu={menu_items}
					onClickMenuItem={() => console.log('menu clicked')}
				/>
			)}
			<RefundCreditsDrawer
				data={refund_drawer.data}
				is_visible={refund_drawer.state}
				close={() => {
					rest?.colDef?.refund_callback && rest?.colDef?.refund_callback();
					set_refund_drawer({ state: false, data: null });
				}}
				handle_submit={handle_submit}
				set_is_modal_open={set_is_modal_open}
				is_terminal_modal_open={is_terminal_modal_open}
				set_is_terminal_modal_open={set_is_terminal_modal_open}
				reason={reason}
				set_reason={set_reason}
				input_value={input_value}
				set_input_value={set_input_value}
				set_refund_drawer={set_refund_drawer}
				is_credits_drawer={is_credits_drawer}
				selected_refund_destination={selected_refund_destination}
				set_selected_refund_destination={set_selected_refund_destination}
				currency={currency}
			/>
			<Modal
				width={500}
				open={is_modal_open}
				onClose={() => set_is_modal_open(false)}
				title={t('Common.RefundPaymentDrawer.RefundPayment')}
				footer={
					<Grid display='flex' justifyContent='flex-end' gap={1.2}>
						<Button onClick={() => set_is_modal_open(false)} variant='outlined'>
							{t('Common.RefundPaymentDrawer.Back')}
						</Button>
						<Button loading={is_button_loading} onClick={handle_submit}>
							{t('Common.RefundPaymentDrawer.Confirm')}
						</Button>
					</Grid>
				}
				children={
					<EmailModalContent
						modal_message={{
							sub: t('Common.RefundPaymentDrawer.ConfirmRefund', { price: get_formatted_price_with_currency(currency, input_value) }),
						}}
						payload={{
							entity: 'payment',
							action: 'payment_refund',
							buyer_id: row_data?.buyer_id,
							additional_info: {
								payment_entity: 'buyer',
							},
						}}
						email_data={email_data}
						set_email_data={set_email_data}
						email_checkbox={email_checkbox}
						set_email_checkbox={set_email_checkbox}
						set_email_drawer={set_email_drawer}
					/>
				}
			/>
			{email_drawer && (
				<SendMailDrawer
					email_drawer={email_drawer}
					set_email_drawer={set_email_drawer}
					email_data={email_data}
					set_email_data={set_email_data}
				/>
			)}
			{open_void_auth_modal && (
				<VoidAuthModal
					open_void_auth_modal={open_void_auth_modal}
					set_open_void_auth_modal={set_open_void_auth_modal}
					transaction={selected_transaction}
					set_toast={set_toast_state}
					callback={refetch}
				/>
			)}
		</Grid>
	);
};

export default PaymentActionComp;
