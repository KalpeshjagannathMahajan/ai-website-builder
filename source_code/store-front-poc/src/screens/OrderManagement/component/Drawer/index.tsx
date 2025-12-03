import { Box, Drawer, Icon } from 'src/common/@the-source/atoms';
import OrderManagementContext from '../../context';
import React, { useContext, useEffect, useState } from 'react';
import { DRAWER_CONSTANTS, DRAWER_TYPES, TOTAL_AMOUNT_DUE } from '../../constants';
import ChangeContactDrawer from './ChangeContactDrawer';
import SendMailDrawer from './SendMailDrawer';
import NotesDrawer from './NotesDrawer';
import ChangeBillingAddressDrawer from './ChangeBillingAddressDrawer';
import ChangeShippingAddressDrawer from './ChangeShippingAddress';
import CustomText from 'src/common/@the-source/CustomText';
import AddEditPayment from './AddEditPayment';
import CollectPaymentDrawer from './CollectPaymentDrawer';
import AddPaymentModal from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/Drawer/AddPaymentModal';
import TransactionCompleteModal from 'src/screens/OrderManagement/component/Drawer/TransactionCompleteModal';
import TerminalModal from 'src/screens/OrderManagement/component/Drawer/TerminalModal';
import ShareReceiptModal from './ShareReceiptModal';
import CustomToast from 'src/common/CustomToast';
import RefundPaymentDrawer from './RefundPaymentDrawer';
import AddCreditsDrawer from 'src/screens/BuyerDashboard/components/AddCreditsDrawer';
import useStyles from '../../styles';
import AuthorisedDrawer from './AuthorisedDrawer';
import VoidAuthDrawer from './VoidAuthDrawer';
import api_requests from 'src/utils/api_requests';
import { finix_env, payment_gateways } from 'src/screens/BuyerLibrary/AddEditBuyerFlow/constants';
import _ from 'lodash';
import { t } from 'i18next';
import { EmailData } from 'src/common/Interfaces/EmailData';
import PaymentEmailModalWithContext from '../Common/PaymentEmailModalWithContext';
import AddAchPaymentModal from 'src/screens/Payment/component/AddAchPaymentModal';
const { VITE_APP_ENV } = import.meta.env;
const { FINIX } = payment_gateways;
const { PRODUCTION, LIVE, SANDBOX } = finix_env;

const Index: React.FC = () => {
	const {
		document_data,
		handle_drawer_state,
		handle_drawer_type,
		drawer,
		section_data,
		is_transaction_complete_modal_visible,
		set_is_transaction_modal_visible,
		transaction_data,
		success_toast,
		set_success_toast,
		customer_id,
		payment_config,
		buyer_addresses,
		is_terminal_modal_visible,
		setIsPolling,
		complete,
		set_customer_id,
		get_table_data,
		set_refetch,
		email_checkbox,
		email_data,
		set_payment_email_modal,
		set_payment_email_payload,
		document_id,
		set_email_data,
		send_email,
		set_send_email,
		set_email_checkbox,
		set_is_payment_email_submit_loading,
		currency,
		set_ach_modal,
		ach_modal,
		set_selected_payment_opt,
		saved_payment_methods_data,
		set_refetch_payment_options,
	} = useContext(OrderManagementContext);
	const { drawer_state, drawer_type } = drawer;
	const [is_payment_modal_visible, set_is_payment_modal_visible] = useState<boolean>(false);
	const [is_share_receipt_modal_visible, set_is_share_receipt_modal_visible] = useState<boolean>(false);
	const classes = useStyles();
	// const [amount, set_amount] = useState<number>(0);
	const [active, set_active] = useState<string>('card');
	const [is_authorised, set_is_authorised] = useState<boolean>(false);
	const [is_button_loading, set_is_button_loading] = useState<boolean>(false);
	const [use_credit, set_use_credit] = useState<boolean>(false);
	const [collect_for_invoice, set_collect_for_invoice] = useState<boolean>(false);
	const [input_value, set_input_value] = useState<any>(0);
	const [attributes, set_attributes] = useState<any>({});
	const [invoice_ids, set_invoice_ids] = useState([]);
	const [selected_payment_method_id, set_selected_payment_method_id] = useState<string>('');
	const [saved_payment_methods, set_saved_payment_methods] = useState<any>([]);
	const [data, set_data] = useState<any>();
	const [order_info, set_order_info] = useState<string>(document_data?.system_id);
	const [reason, set_reason] = useState<string>('');
	const [selected_option, update_selected_option] = useState<string>('source');
	const [payment_ids, set_payment_ids] = useState<any>([]);
	const [is_terminal_modal_open, set_is_terminal_modal_open] = useState<boolean>(false);

	useEffect(() => {
		set_order_info(_.get(document_data, 'system_id', ''));
	}, [document_data?.system_id]);

	useEffect(() => {
		if (TOTAL_AMOUNT_DUE.includes(drawer_type) && document_data?.total_amount_due) set_input_value(document_data?.total_amount_due);
	}, [drawer_type, document_data?.total_amount_due]);

	const check_payment_method = (res: any) => {
		return (res?.collect_payment_method === 'card' || res?.collect_payment_method === 'terminal') && res?.transaction_status === 'pending';
	};

	const handle_final_submit = (payload: any) => {
		api_requests.order_management
			.submit_details(payload)
			.then((res: any) => {
				if (check_payment_method(res)) setIsPolling({ data: res, state: true });

				complete({ ...res, collect_payment_method: active });
			})
			.catch((err) => {
				console.log(err);
				complete({
					transaction_status: 'failed',
					transaction_amount: input_value,
					collect_payment_method: active,
					transaction_message: 'Payment failed',
				});
			})
			.finally(() => {
				set_is_button_loading(false);
				set_is_payment_email_submit_loading(false);
				set_payment_email_modal(false);
			});
	};

	const handle_collect_payment = () => {
		set_is_button_loading(true);

		let payload = {
			document_id: document_data.id,
			custom_amount_to_pay: input_value,
			credits_to_apply: use_credit ? Math.min(data.wallet_balance, input_value) : 0,
			invoice_ids,
			collect_payment_method: active,
			attributes: {
				...attributes,
				is_auto_trigger: email_checkbox,
				email_ids: email_data?.to_emails || [],
			},
			use_authorization: is_authorised,
		};
		const { payment_gateway = FINIX, finix_merchant_id = '' } = payment_config || {};
		if (payment_gateway === FINIX) {
			const _env = VITE_APP_ENV === PRODUCTION ? LIVE : SANDBOX;
			(window as any)?.Finix?.Auth(_env, finix_merchant_id, (session_key: string) => {
				const updated_payload = {
					...payload,
					attributes: {
						...payload.attributes,
						fraud_session_id: session_key,
					},
				};
				handle_final_submit(updated_payload);
			});
		} else {
			handle_final_submit(payload);
		}
	};

	const handle_add_credit = () => {
		set_is_button_loading(true);
		let payload = {
			buyer_id: document_data.buyer_id,
			document_id: document_data?.id,
			order_info,
			custom_amount_to_pay: input_value,
			collect_payment_method: active,
			attributes: {
				...attributes,
				is_auto_trigger: email_checkbox,
				email_ids: email_data?.to_emails || [],
			},
		};
		api_requests.order_management
			.submit_add_credits_details(payload)
			.then((res: any) => {
				if (check_payment_method(res)) setIsPolling({ data: res, state: true });
				complete({ ...res, collect_payment_method: active });
			})
			.catch((err: any) => {
				console.error(err);
				complete({
					transaction_status: 'failed',
					transaction_amount: input_value,
					collect_payment_method: active,
					transaction_message: 'Payment failed',
				});
			})
			.finally(() => {
				set_is_button_loading(false);
				set_is_payment_email_submit_loading(false);
				set_payment_email_modal(false);
			});
	};

	const handle_refund_payment = () => {
		set_is_button_loading(true);
		const payload = {
			document_id: document_data?.id,
			payment_ids,
			refund_destination: selected_option,
			reason,
			amount: input_value,
			is_auto_trigger: email_checkbox,
			email_ids: email_data?.to_emails || [],
		};
		api_requests.order_management
			.submit_refund_details(payload)
			.then((res: any) => {
				if (res?.refund_status === 'failed') {
					set_success_toast({ open: true, title: 'Refund failed', subtitle: res?.message || 'Please try again', state: 'error' });
				} else if (res?.refund_status === 'pending') {
					set_success_toast({
						open: true,
						title: 'Refund request raised',
						subtitle: t('Payment.NotifyOverEmail'),
						state: 'success',
					});
				} else if (res.refund_status === 'success') {
					set_success_toast({
						open: true,
						title: 'Success',
						subtitle: selected_option === 'source' ? t('Payment.MoneyCredited') : '',
						state: 'success',
					});
				}
				set_reason(''); // reset to default state
			})
			.catch((err: any) => {
				console.error(err);
				set_success_toast({ open: true, title: 'Refund failed', subtitle: 'Please try again', state: 'error' });
			})
			.finally(() => {
				set_is_button_loading(false);
				set_is_terminal_modal_open(false);
				set_is_payment_email_submit_loading(false);
				set_payment_email_modal(false);
				set_refetch((state: boolean) => !state);
				get_table_data();
			});
	};

	const handle_submit = (val: string) => {
		switch (val) {
			case 'collect_payment':
				return handle_collect_payment();
			case 'add_credit':
				return handle_add_credit();
			case 'refund_payment':
				return handle_refund_payment();
		}
	};

	const handle_send_emails = (_email_data: EmailData) => {
		if (!send_email) return;

		api_requests.order_management
			.send_emails_for_orders({ document_id, emails: _email_data?.to_emails || [] })
			.then((res: any) => {
				if (res?.status === 200) {
					set_success_toast({
						open: true,
						title: res?.message,
						subtitle: '',
						state: 'success',
					});
				}
			})
			.catch((e) => console.error(e))
			.finally(() => set_send_email(false));
	};

	const handle_render_factory = (type: any) => {
		switch (type) {
			case 'primary_contact':
				const contact_data = section_data?.user_details?.find((item: any) => item?.key === 'buyer_details');
				return <ChangeContactDrawer data={contact_data} />;
			case 'notification_email_ids':
				return (
					<SendMailDrawer
						email_drawer={drawer_state}
						set_email_drawer={handle_drawer_state}
						document_id={document_id}
						email_data={email_data}
						set_email_data={set_email_data}
						handle_send_emails={handle_send_emails}
						set_send_email={set_send_email}
					/>
				);
			case 'billing_address':
				const billing_address_data = section_data?.user_details?.find((item: any) => item?.key === 'billing_address');
				return <ChangeBillingAddressDrawer data={billing_address_data} />;
			case 'shipping_address':
				const shipping_address_data = section_data?.user_details?.find((item: any) => item?.key === 'shipping_address');
				return <ChangeShippingAddressDrawer data={shipping_address_data} />;
			case 'notes':
				const notes_data = section_data?.notes;
				return <NotesDrawer _data={notes_data} />;

			case DRAWER_TYPES.add_edit_payment:
				return <AddEditPayment is_ultron={true} is_store_front={false} />;
			case DRAWER_TYPES.collect_payment:
				return (
					<CollectPaymentDrawer
						document_id={document_data.id}
						is_visible={true}
						close={() => handle_drawer_state(false)}
						set_is_payment_modal_visible={set_is_payment_modal_visible}
						handle_add_credits={() => {
							handle_drawer_type(DRAWER_TYPES.add_credits);
						}}
						set_data={set_data}
						set_input_value={set_input_value}
						set_collect_for_invoice={set_collect_for_invoice}
						use_credit={use_credit}
						data={data}
						input_value={input_value}
						active={active}
						set_attributes={set_attributes}
						set_is_authorised={set_is_authorised}
						attributes={attributes}
						set_use_credit={set_use_credit}
						is_button_loading={is_button_loading}
						set_active={set_active}
						set_invoice_ids={set_invoice_ids}
						collect_for_invoice={collect_for_invoice}
						invoice_ids={invoice_ids}
						handle_collect_payment={handle_collect_payment}
						email_data={email_data}
						set_email_data={set_email_data}
						set_email_checkbox={set_email_checkbox}
						currency={currency}
					/>
				);
			case DRAWER_TYPES.refund_payment:
				return (
					<RefundPaymentDrawer
						document_id={document_data.id}
						is_visible={true}
						close={() => handle_drawer_state(false)}
						set_data={set_data}
						set_input_value={set_input_value}
						data={data}
						input_value={input_value}
						payment_ids={payment_ids}
						selected_option={selected_option}
						reason={reason}
						is_button_loading={is_button_loading}
						set_payment_ids={set_payment_ids}
						set_reason={set_reason}
						update_selected_option={update_selected_option}
						is_terminal_modal_open={is_terminal_modal_open}
						set_is_terminal_modal_open={set_is_terminal_modal_open}
						currency={currency}
					/>
				);
			case DRAWER_TYPES.add_credits:
				return (
					<AddCreditsDrawer
						is_visible={true}
						close={() => handle_drawer_state(false)}
						set_is_payment_modal_visible={set_is_payment_modal_visible}
						payment_config={payment_config}
						set_customer_id={set_customer_id}
						buyer_id={document_data?.buyer_id}
						document_id={document_data?.id}
						data={data}
						set_saved_payment_methods={set_saved_payment_methods}
						set_selected_payment_method_id={set_selected_payment_method_id}
						input_value={input_value}
						set_input_value={set_input_value}
						attributes={attributes}
						is_button_loading={is_button_loading}
						saved_payment_methods={saved_payment_methods}
						set_active={set_active}
						handle_add_credit={handle_add_credit}
						set_order_info={set_order_info}
						order_info={order_info}
						selected_payment_method_id={selected_payment_method_id}
						set_attributes={set_attributes}
						set_data={set_data}
						set_payment_email_modal={set_payment_email_modal}
						set_payment_email_payload={set_payment_email_payload}
						active={active}
						email_data={email_data}
						set_email_data={set_email_data}
						set_email_checkbox={set_email_checkbox}
						currency={currency}
					/>
				);
			case DRAWER_TYPES.auth_card:
				return (
					<AuthorisedDrawer
						is_visible={true}
						close={() => handle_drawer_state(false)}
						document_id={document_data.id}
						set_is_payment_modal_visible={set_is_payment_modal_visible}
						prefilled_data={{ amount: document_data?.total_amount_due, order_info: document_data?.system_id }}
						currency={currency}
					/>
				);
			case DRAWER_TYPES.void_auth_card:
				return <VoidAuthDrawer is_visible={true} close={() => handle_drawer_state(false)} currency={currency} />;
			default:
				return null;
		}
	};

	const close = () => {
		handle_drawer_state(false);
		set_send_email(false);
	};

	const handle_render_header = (type: any) => {
		return (
			<Box className={classes.drawerHeaderContainer}>
				<CustomText type='H2'>{DRAWER_CONSTANTS.SECTIONS[type]}</CustomText>
				<Icon iconName='IconX' onClick={close} className={classes.iconStyle} />
			</Box>
		);
	};

	const handle_close_ach_modal = () => {
		set_ach_modal(false);
	};

	const handle_show_toast = (obj: any) => {
		set_success_toast({ open: true, title: obj?.title, subtitle: obj?.subtitle, state: obj?.state });
	};

	return (
		<>
			<Drawer
				open={drawer_state}
				width={420}
				content={
					<React.Fragment>
						{handle_render_header(drawer_type)}
						<Box>{handle_render_factory(drawer_type)}</Box>
					</React.Fragment>
				}
				onClose={() => null}
			/>
			<AddPaymentModal
				all_address={buyer_addresses}
				customer_id={customer_id}
				web_token={payment_config?.web_token}
				is_visible={is_payment_modal_visible}
				close={() => {
					set_is_payment_modal_visible(false);
					handle_drawer_state(true);
					set_selected_payment_opt({ mode: 'edit', type: 'card' });
				}}
				source={'collect_payment'}
				buyer_id={document_data.buyer_id}
				payment_source={payment_config?.payment_gateway}
			/>
			<TransactionCompleteModal
				is_visible={is_transaction_complete_modal_visible}
				set_is_transaction_modal_visible={set_is_transaction_modal_visible}
				transaction_data={transaction_data}
				close={() => {
					handle_drawer_state(false);
					set_is_transaction_modal_visible(false);
				}}
				currency={currency}
			/>
			<ShareReceiptModal
				is_visible={is_share_receipt_modal_visible}
				close={() => {
					set_is_share_receipt_modal_visible(false);
					handle_drawer_state(false);
				}}
				document_id={document_data.id}
				track_id={transaction_data?.track_id}
				prefilled_emails={email_data?.to_emails}
				transaction_id={transaction_data?.transaction_id}
			/>
			<TerminalModal is_visible={is_terminal_modal_visible} currency={currency} />
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
				onClose={() => set_success_toast({ open: false, title: '', subtitle: '', state: '' })}
				state={success_toast.state}
				title={success_toast.title}
				subtitle={success_toast.subtitle}
				showActions={false}
			/>

			{ach_modal && (
				<AddAchPaymentModal
					payment_method_ids={[
						...(saved_payment_methods_data?.saved_payment_methods || []),
						...(saved_payment_methods_data?.saved_bank_accounts || []),
					]}
					buyer_id={document_data.buyer_id}
					web_token={payment_config?.web_token}
					is_visible={ach_modal}
					close={handle_close_ach_modal}
					set_success_toast={handle_show_toast}
					set_refetch_payment_options={set_refetch_payment_options}
				/>
			)}

			<PaymentEmailModalWithContext handle_submit={handle_submit} currency={currency} />
		</>
	);
};

export default Index;
