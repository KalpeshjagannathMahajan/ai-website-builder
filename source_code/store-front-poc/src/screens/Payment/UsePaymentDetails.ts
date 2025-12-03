import _, { debounce, isEmpty } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api_requests from 'src/utils/api_requests';
import { payments } from 'src/utils/api_requests/payment';
import constants from './constants';
import { useForm } from 'react-hook-form';
import order_management from 'src/utils/api_requests/orderManagment';
import { EmailData } from 'src/common/Interfaces/EmailData';
import { finix_env, payment_gateways } from 'src/screens/BuyerLibrary/AddEditBuyerFlow/constants';
import { useInterval } from '../OrderManagement/component/Drawer/useInterval';
import RouteNames from 'src/utils/RouteNames';
import utils from 'src/utils/utils';
import { PERMISSIONS } from 'src/casl/permissions';
import { useSelector } from 'react-redux';
import { check_permission } from 'src/utils/utils';
import dayjs from 'dayjs';

const { VITE_APP_ENV } = import.meta.env;
const { FINIX } = payment_gateways;
const { PRODUCTION, LIVE, SANDBOX } = finix_env;

const UsePaymentDetails = (edit_flow = false) => {
	const [loading, set_loading] = useState(false);
	const [form_data, set_form_data] = useState<any>({});
	const [form_section, set_form_section] = useState<any>({});
	const [use_credit, set_use_credit] = useState(false);
	const [show_invoice, set_show_invoice] = useState(true);
	const [email_data, set_email_data] = useState<EmailData>({
		to_emails: [],
		cc_emails: [],
		bcc_emails: [],
		is_auto_trigger: false,
		is_enable: false,
		user_permission_flag: false,
	});
	const [checked_invoice, set_checked_invoice] = useState('');
	const [payment_config, set_payment_config] = useState<any>(null);
	const [payment_method_data, set_payment_method_data] = useState<any>(null);
	const [payment_method_attrs, set_payment_method_attrs] = useState<any>(null);
	const [email_checkbox, set_email_checkbox] = useState<boolean>(true);
	const [show_buyer_panel, set_show_buyer_panel] = useState(false);
	const [buyer_data, set_buyer_data] = useState<any>({});
	const [selected_payment_method_type, set_selected_payment_method_type] = useState<any>(null);
	const [payment_email_modal, set_payment_email_modal] = useState<boolean>(false);
	const [payment_email_payload, set_payment_email_payload] = useState({});
	const [is_submit_loading, set_is_submit_loading] = useState(false);
	const [is_transaction_complete_modal_visible, set_is_transaction_modal_visible] = useState<boolean>(false);
	const [is_terminal_modal_visible, set_is_terminal_modal_visible] = useState<boolean>(false);
	const [btn_loading, set_btn_loading] = useState(false);
	const [success_toast, set_success_toast] = useState<any>({ open: false, title: '', subtitle: '', state: '' });
	const [transaction_data, set_transaction_data] = useState<any>(null);
	const [isPolling, setIsPolling] = useState<any>({ data: undefined, state: false });
	const [selected_radio_btn, set_selected_radio_btn] = useState(constants?.radio_buttons[0]);
	const [payment_ids, set_payment_ids] = useState<any>([]);
	const [input_value, set_input_value] = useState<any>(0);
	const [is_modal_visible, set_is_modal_visible] = useState(false);
	const [drawer_state, set_drawer_state] = useState(false);
	const [all_addresses, set_all_addresses] = useState<any>([]);
	const [is_back_drop_visible, set_is_back_drop_visible] = useState(false);
	const [added_card_id, set_added_card_id] = useState(null);
	const [is_authorized, set_is_authorized] = useState<boolean>(false);
	const [show_discard_modal, set_show_discard_modal] = useState(false);
	const [temp_selected_radio_btn, set_temp_selected_radio_btn] = useState<any>({});
	const [refetch, set_refetch] = useState(false);
	const [ach_modal, set_ach_modal] = useState(false);
	const [selected_payment_method_id, set_selected_payment_method_id] = useState('');
	const [open_drawer, set_open_drawer] = useState(false);
	const [schedule_loading, set_schedule_loading] = useState(false);
	const [subscription_data, set_subscription_data] = useState({ form_section: {}, schedule_payment: {} });

	const [selected_opt, set_selected_opt] = useState<any>({
		mode: 'add',
		type: '',
	});
	const params = useParams();
	const { id, type, source }: any = params;
	const buyer_edit_flow = id && type === 'buyer';
	const order_edit_flow = id && type === 'order';
	const is_refund_flow = source === 'refund' || selected_radio_btn?.value === 'refund';
	const is_authorization_flow = source === 'authorize' || selected_radio_btn?.value === 'authorize';
	const is_refund_edit_flow = id && source === 'refund';
	const is_authorization_edit_flow = id && source === 'authorize';
	const methods = useForm<Record<string, any>>({ defaultValues: is_refund_flow ? { refund_destination: 'source', reason: '' } : {} });
	const { getValues, reset, setValue } = methods;
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { state } = useLocation();
	const { payment_method_id = '' } = state || {};
	const is_auth_flow = is_authorization_flow || is_authorization_edit_flow;
	const selected_option = getValues('payment_method_type');
	const is_subscription_flow = selected_radio_btn?.value === 'subscription';
	const permissions = useSelector((_state: any) => _state?.login?.permissions);

	const handle_get_payment_charges = () => {
		const payment_charge: number = _.sum(
			_.map(constants.payment_charges, (charge) => parseFloat((getValues() as any)?.transaction_summary?.[charge?.key]) || 0),
		);
		return payment_charge;
	};

	const credits_used = use_credit ? Math.min(form_data?.wallet_balance, handle_get_payment_charges()) : 0;

	const get_value_from_current_url = () => {
		const parts = _.split(window.location.pathname, '/');
		return id ? source : _.last(parts);
	};
	const source_url = get_value_from_current_url();

	const is_direct_flow = source_url === 'direct' && _.isEmpty(buyer_data);
	const is_buyer_payment = source_url === 'collect' && !_.isEmpty(_.omit(buyer_data, 'id'));
	const is_payment_against_buyer = is_buyer_payment || buyer_edit_flow;

	const handle_get_form_section = () => {
		!order_edit_flow && set_loading(true);
		payments
			.get_payment_form()
			.then((res: any) => {
				if (res?.status === 200) {
					const key = type === 'order' ? 'order_payment' : type === 'buyer' || is_buyer_payment ? 'buyer_payment' : 'direct_payment';
					const data = res?.data?.[key] || _.head(res?.data);
					data.sections = _.concat([constants.customer_details], data?.sections, [constants.notes], [constants.payment_method]);
					set_form_section(data);
				}
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				!order_edit_flow && set_loading(false);
			});
	};

	const handle_get_subscription_form = () => {
		set_loading(true);
		payments
			.get_recurring_payment_form()
			.then((res: any) => {
				if (res?.status === 200) {
					const data = res?.data;
					set_subscription_data((prev) => ({ ...prev, form_section: data }));
				}
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				set_loading(false);
			});
	};

	const handle_navigate_to_prev_page = () => {
		navigate(-1);
	};

	const handle_reset_loaders = () => {
		set_btn_loading(false);
		set_is_submit_loading(false);
		if (payment_email_modal) {
			set_payment_email_modal(false);
		}
		if (is_back_drop_visible) {
			set_is_back_drop_visible(false);
		}
	};

	const handle_reset_fields = (is_navigate = true) => {
		set_form_data({});
		set_buyer_data({});
		set_payment_method_data({});
		set_payment_method_attrs({});
		set_checked_invoice('');
		set_subscription_data({ form_section: {}, schedule_payment: {} });
		reset();

		if (is_buyer_payment && is_navigate) {
			navigate(RouteNames.payment.direct_payment.path, { replace: true });
		}
	};

	const handle_after_success_callback = (res?: any) => {
		if (is_subscription_flow) {
			handle_reset_fields();
			handle_reset_loaders();
			navigate(RouteNames.payment.recurring_payments.path);
			set_btn_loading(false);
			return;
		}

		if (!type) {
			navigate(RouteNames.payment.transactions.path);
			return;
		}
		handle_reset_loaders();
		if (!res && is_direct_flow) return;
		if (order_edit_flow || buyer_edit_flow || is_refund_edit_flow || is_authorization_edit_flow) {
			handle_navigate_to_prev_page();
			set_payment_email_modal(false);
		} else {
			handle_reset_fields();
		}
		set_is_back_drop_visible(false);
		if (is_direct_flow) {
			handle_get_form_section();
		}
		if (is_authorization_flow) {
			set_input_value(0);
		}
	};

	const handle_switch_tab = () => {
		handle_reset_fields();
		navigate(temp_selected_radio_btn?.route, { replace: true });
		set_refetch((prev) => !prev);
		set_show_discard_modal(false);
	};

	const handle_drawer_state = (value: boolean) => {
		set_drawer_state(value);
	};

	const fetch_buyer_addresses = async (buyer_id: string) => {
		try {
			if (!buyer_id) return;
			const res = await api_requests.buyer.get_buyer_details(buyer_id);
			const sections = _.get(res, 'data.sections', []);
			const address_data: any = _.find(sections, { key: 'addresses' });
			if (address_data) {
				const address_values = utils.format_address_section_to_values(address_data?.addresses);
				set_all_addresses(address_values);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const complete = (res: any) => {
		if (res?.collect_payment_method === 'payment_link') {
			set_success_toast({
				open: true,
				title: res?.transaction_status !== 'failed' ? 'Payment link sent' : 'Error sending payment link',
				subtitle: res?.transaction_status === 'failed' && 'Please try again',
				state: res?.transaction_status !== 'failed' ? 'success' : 'warning',
				callback: handle_after_success_callback,
			});
		} else if (res?.collect_payment_method === 'manual') {
			set_success_toast({
				open: true,
				title: res?.transaction_status === 'success' ? 'Payment collected' : 'Payment failed',
				subtitle: '',
				state: res?.transaction_status === 'success' ? 'success' : 'error',
				callback: handle_after_success_callback,
			});
		} else if (res?.collect_payment_method === 'card' || res?.collect_payment_method === 'ach') {
			set_transaction_data(res);
			set_is_transaction_modal_visible(true);
		} else if (res?.collect_payment_method === 'terminal') {
			set_transaction_data(res);
			set_is_terminal_modal_visible(true);
		}
	};

	useInterval(
		async () => {
			if (isPolling?.state) {
				if (transaction_data?.retry_count <= transaction_data?.max_retry_count) {
					api_requests.order_management
						.get_payment_status({
							transaction_id: isPolling?.data?.transaction_id,
							track_id: isPolling?.data?.track_id,
							retry_count: transaction_data?.retry_count,
						})
						.then((res: any) => {
							if (res?.transaction_status !== 'pending') {
								setIsPolling({ data: undefined, state: false });
								complete(res);
							} else {
								set_transaction_data(res);
							}
						})
						.catch((err: any) => {
							console.log(err);
							complete({ ...isPolling?.data, transaction_status: 'failed' });
							setIsPolling({ data: undefined, state: false });
						});
				} else {
					complete({ ...isPolling?.data, transaction_status: 'failed' });
					setIsPolling({ data: undefined, state: false });
				}
			}
		},
		isPolling ? transaction_data?.retry_frequency * 1000 : null,
	);

	const check_payment_method = (res: any) => {
		return (res?.collect_payment_method === 'card' || res?.collect_payment_method === 'terminal') && res?.transaction_status === 'pending';
	};

	const handle_submit_collect_payment = async (payload: any) => {
		try {
			const res: any = await payments.collect_payment(payload);
			if (check_payment_method(res)) setIsPolling({ data: res, state: true });
			complete({ ...res, collect_payment_method: selected_payment_method_type });
			set_payment_email_modal(false);
		} catch (err) {
			console.log(err);
			complete({
				transaction_status: 'failed',
				transaction_amount: handle_get_payment_charges(),
				collect_payment_method: selected_payment_method_type,
				transaction_message: 'Payment failed',
			});
			handle_reset_loaders();
		}
	};

	const handle_submit_direct_payment = async (payload: any) => {
		// if ((!is_direct_flow && selected_payment_method_type !== 'card') || selected_payment_method_type !== 'ach') {
		// 	set_is_back_drop_visible(true);
		// }
		try {
			const res: any = await payments.collect_direct_payment(payload);
			if (check_payment_method(res)) setIsPolling({ data: res, state: true });
			complete({ ...res, collect_payment_method: selected_payment_method_type });
			if (!buyer_edit_flow || !is_direct_flow) {
				set_is_back_drop_visible(false);
			}
		} catch (err) {
			complete({
				transaction_status: 'failed',
				transaction_amount: '',
				transaction_header: 'Payment failed',
			});
			handle_reset_loaders();
		} finally {
			if (!is_direct_flow) {
				handle_reset_loaders();
			}
		}
	};

	const add_fraud_session_to_payload = (payload: any): Promise<any> => {
		return new Promise((resolve) => {
			const { payment_gateway = FINIX, finix_merchant_id = '' } = payment_config || {};

			if (payment_gateway === FINIX) {
				const environment = VITE_APP_ENV === PRODUCTION ? LIVE : SANDBOX;
				// Authenticate with Finix and add fraud session ID to payload
				(window as any)?.Finix?.Auth(environment, finix_merchant_id, (session_key: string) => {
					const updatedPayload = {
						...payload,
						attributes: {
							...payload.attributes,
							fraud_session_id: session_key,
						},
					};
					resolve(updatedPayload);
				});
			} else {
				// If no fraud session ID is required, resolve with the original payload
				resolve(payload);
			}
		});
	};

	const handle_get_payload = () => {
		const data: any = getValues();
		const filter_form_section = _.filter(form_section?.sections, (item) => !['customer_details', 'payment_method'].includes(item?.key));
		const section_keys = _.map(filter_form_section, (section: any) => section?.key);
		const payment_context = _.pick(data, section_keys);

		if (_.get(payment_context, 'notes.notes')) {
			_.set(payment_context, 'notes', _.get(payment_context, 'notes.notes'));
		} else if (section_keys?.includes('notes')) {
			_.set(payment_context, 'notes', '');
		}

		_.forEach(section_keys, (key) => _.unset(data, key));
		if (is_direct_flow) {
			delete data?.attributes?.payment_method_id;
		}
		delete data?.transaction_summary?.order_invoice_amount;
		!data?.buyer_info && delete data?.buyer_info;
		const amount = handle_get_payment_charges();
		return {
			...data,
			collect_payment_method: selected_payment_method_type,
			custom_amount_to_pay: amount,
			payment_context,
			attributes: {
				...payment_method_attrs,
			},
		};
	};

	const handle_collect_payment = async () => {
		set_btn_loading(true);
		const data: any = getValues();
		//common payload
		const payload = handle_get_payload();

		if (payload.payment_method_type === 'payment_link' || payload.payment_method_type === 'manual') {
			delete payload?.attributes?.payment_method_id;
		}

		const is_use_authorized = payload?.attributes?.payment_method_id ? is_authorized : false;

		//edit flow
		if (!order_edit_flow && !buyer_edit_flow) {
			if (buyer_data) payload.buyer_id = buyer_data?.id;
			if (data?.buyer_info) payload.buyer_info = data.buyer_info;
		}

		//collect payment - order flow
		if (order_edit_flow) {
			Object.assign(payload, {
				document_id: id,
				invoice_ids: checked_invoice ? [checked_invoice] : [],
				...(use_credit && { credits_to_apply: Number(credits_used) }),
			});
			payload.attributes = {
				...payload.attributes, // Retain existing attributes
				is_auto_trigger: email_checkbox,
				email_ids: email_data?.to_emails || [],
			};
		}

		//direct payment - buyer flow
		if (buyer_edit_flow || type === 'buyer' || is_buyer_payment) {
			if (buyer_edit_flow) payload.buyer_id = id;
			if (type === 'buyer' && !id) payload.buyer_info = data?.buyer_info;
			payload.attributes = {
				...payload?.attributes,
				is_auto_trigger: email_checkbox,
				email_ids: email_data?.to_emails || [],
			};
			const updated_payload = await add_fraud_session_to_payload(payload);
			handle_submit_direct_payment({
				...updated_payload,
				use_authorization: is_use_authorized,
			});
			return;
		}

		if (order_edit_flow) {
			const updated_payload = await add_fraud_session_to_payload(payload);
			handle_submit_collect_payment({
				...updated_payload,
				use_authorization: is_use_authorized,
			});
			return;
		}
		handle_submit_direct_payment(payload);
	};

	const handle_refund_payment = async () => {
		set_btn_loading(true);
		// set_is_back_drop_visible(true);
		const { refund_destination = 'source', reason = '' } = getValues();
		const payload = {
			document_id: id,
			payment_ids,
			refund_destination,
			reason,
			amount: input_value,
			is_auto_trigger: email_checkbox,
			email_ids: email_data?.to_emails || [],
			payment_entity: type,
			buyer_id: type === 'buyer' ? id : buyer_data?.id,
		};
		if (type !== 'order') {
			delete payload.document_id;
		} else {
			delete payload.buyer_id;
		}
		try {
			const res: any = await api_requests.order_management.submit_refund_details(payload);
			if (res?.refund_status === 'failed') {
				set_success_toast({
					open: true,
					title: 'Refund failed',
					subtitle: res?.message || 'Please try again',
					state: 'error',
					callback: handle_after_success_callback,
				});
			} else if (res?.refund_status === 'pending') {
				set_success_toast({
					open: true,
					title: 'Refund request raised',
					subtitle: t('Payment.NotifyOverEmail'),
					state: 'success',
					callback: handle_after_success_callback,
				});
			} else if (res.refund_status === 'success') {
				set_success_toast({
					open: true,
					title: 'Success',
					subtitle: refund_destination === 'source' ? t('Payment.MoneyCredited') : '',
					state: 'success',
					callback: handle_after_success_callback,
				});
			}
		} catch (error) {
			console.error(error);
			handle_reset_loaders();
		}
	};

	const handle_authorization = async () => {
		try {
			set_btn_loading(true);
			const payload = {
				buyer_id: id ?? buyer_data?.id,
				payment_method_id: _.get(payment_method_attrs, 'payment_method_id'),
				payment_entity: 'buyer',
				authorize_amount: Number(input_value),
				attributes: {
					is_auto_trigger: email_checkbox,
					email_ids: email_data?.to_emails || [],
				},
				...(state?.document_id ? { document_id: state?.document_id } : {}),
			};
			const response: any = await api_requests.order_management.authorised_card(payload);
			if (response?.transaction_status === 'failed') {
				set_success_toast({
					open: true,
					title: 'Authorization Failed',
					subtitle: '',
					state: 'warning',
					callback: handle_after_success_callback,
				});
			} else {
				set_success_toast({
					open: true,
					title: 'Authorization Successful',
					subtitle: '',
					state: 'success',
					callback: handle_after_success_callback,
				});
			}
		} catch (error) {
			console.error(error);
			set_success_toast({
				open: true,
				title: 'Authorization Failed',
				subtitle: '',
				state: 'warning',
				callback: handle_after_success_callback,
			});
		}
	};

	const handle_submit_recurring_payment = async () => {
		const data = getValues();
		delete data?.recurring_amount;
		delete data?.notes;
		delete data?.transaction_summary;
		delete data?.additional_info;
		delete data?.buyer_info;

		set_btn_loading(true);
		const payload = {
			...data,
			...payment_method_attrs,
			buyer_id: buyer_data?.id,
			payment_method_type: 'card',
			total_amount: Number(data?.total_amount),
			start_date: data?.start_date, // Coming in utc format no need to change
			end_date: data?.end_date, // Coming in utc format no need to change
			email_ids: email_data?.to_emails || [],
			// is_auto_trigger: email_checkbox,
		};

		try {
			const response: any = await payments.create_recurring_payment(payload);
			if (response?.status === 200) {
				set_success_toast({
					open: true,
					title: 'Recurring payment created successfully',
					subtitle: '',
					state: 'success',
					callback: handle_after_success_callback,
				});
			}
		} catch (err) {
			set_btn_loading(false);
			set_success_toast({
				open: true,
				title: 'Recurring payment failed',
				subtitle: '',
				state: 'warning',
				callback: null,
			});
		}
	};

	const create_recurring_payment_schedule = useCallback(
		debounce(async () => {
			set_schedule_loading(true);
			let data: any = getValues();
			const payload = {
				frequency: data?.frequency,
				total_amount: Number(data?.total_amount),
				start_date: dayjs(data?.start_date)?.format('MM-DD-YYYY'),
				end_date: dayjs(data?.end_date)?.format('MM-DD-YYYY'),
			};
			try {
				const response: any = await payments.create_recurring_payment_schedule(payload);
				set_subscription_data((prev) => ({ ...prev, schedule_payment: response?.data }));
			} catch (err) {
				console.error(err);
			} finally {
				set_schedule_loading(false);
			}
		}, 1000),
		[],
	);

	const handle_submit_payment = () => {
		switch (true) {
			case is_refund_flow:
				handle_refund_payment();
				break;
			case is_authorization_flow:
				handle_authorization();
				break;
			case is_subscription_flow:
				handle_submit_recurring_payment();
				break;
			default:
				handle_collect_payment();
				break;
		}
	};

	const edit_form_details = async (payload: any, arg_source?: string) => {
		try {
			set_loading(true);
			const api_map: any = {
				refund: api_requests.order_management.get_refund_data,
				collect: api_requests.order_management.get_payment_details,
				authorize: api_requests.order_management.get_authorization_details,
				subscription: api_requests.order_management.get_payment_details,
			};
			const api_method = api_map[arg_source ?? source] || api_requests.order_management.get_payment_details;
			const res = await api_method(payload);
			if (res?.status === 200) {
				const response_handlers: any = {
					authorize: (response: any) => {
						set_form_data(response);
						set_payment_method_data({
							saved_payment_methods: response?.saved_payment_methods,
							saved_bank_accounts: response?.saved_bank_accounts,
						});
					},
					refund: (response: any) => {
						set_form_data(response);
					},
					collect: (response_data: any) => {
						response_data.total_amount_due = response_data?.total_amount_due?.toFixed(2);
						set_form_data(response_data);
						const active_invoice: any = _.head(response_data?.invoices || []);
						if (!_.isEmpty(response_data?.invoices) && !_.isEmpty(active_invoice)) {
							set_show_invoice(true);
							set_checked_invoice(active_invoice?.id);
							setValue('transaction_summary.order_invoice_amount', active_invoice?.remaining_amount);
						}

						set_payment_method_data({
							saved_payment_methods: response_data?.saved_payment_methods,
							saved_bank_accounts: response_data?.saved_bank_accounts,
						});
						const buyer_id = _.get(response_data, 'buyer_address.buyer_id', '');
						if (!_.isEmpty(buyer_id)) {
							set_buyer_data({ id: buyer_id });
						}
					},
					subscription: (response_data: any) => {
						const buyer_id = _.get(response_data, 'buyer_address.buyer_id', '');
						if (!_.isEmpty(buyer_id)) {
							set_buyer_data({ id: buyer_id });
						}
						set_form_data(response_data);
					},
				};
				response_handlers[arg_source ?? source](res);
			}
		} catch (err) {
			console.error(err);
			if (is_refund_flow) {
				set_form_data({});
				set_buyer_data({});
			}
		} finally {
			set_loading(false);
		}
	};

	const handle_get_edit_form_details = useCallback(() => {
		let payload: any = {};

		if (type === 'order') {
			payload = {
				document_id: id,
				payment_entity: 'order',
			};
		} else if (type === 'buyer') {
			payload = {
				buyer_id: id,
				payment_entity: 'buyer',
				document_id: '',
			};
			// handle refund flow against buyer
			if (source === 'refund') {
				payload.transaction_id = state?.transaction_id ?? '';
			}
			if (source === 'authorize') {
				payload = {
					buyer_id: id,
					...(state?.document_id ? { document_id: state?.document_id } : {}),
				};
			}
		} else if (type === 'tenant' && source === 'refund') {
			// in case of refund against direct payment
			payload = {
				payment_entity: type,
				transaction_id: id,
			};
		}

		if (source === 'refund' && type === 'order' && state?.transaction_id) {
			payload = {
				...payload,
				transaction_id: state?.transaction_id,
			};
		}

		edit_form_details(payload);
	}, [type, id, buyer_data]);

	const handle_get_payment_config = async () => {
		try {
			const response: any = await api_requests.order_management.get_payment_config({});
			if (response?.status === 200) {
				set_payment_config(response);
				set_show_invoice(response?.payment_config?.accept_payment_against_invoice_only === true);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handle_get_buyer_payment_details = async (update_loader: boolean = false) => {
		if (update_loader) {
			set_loading(true);
		}
		try {
			const response: any = await payments.get_payment_methods(buyer_edit_flow ? id : buyer_data?.id);
			if (response.status_code === 200) {
				set_payment_method_data({
					saved_payment_methods: response?.data?.saved_payment_methods,
					saved_bank_accounts: response?.data?.saved_bank_accounts,
				});
			}
		} catch (error) {
			console.error(error);
		} finally {
			set_loading(false);
		}
	};

	const update_payment_email_payload = (payment_entity: string) => {
		set_payment_email_payload((prev) => {
			const is_order = payment_entity === 'order';
			const is_refund = payment_entity === 'refund';
			const is_auth = payment_entity === 'auth';
			const is_subs = payment_entity === 'recurring_payment';
			const action = constants.PAYMENT_EMAIL_ACTIONS[payment_entity] || 'payment_success';
			const doc_id = is_order || type === 'order' ? id : is_auth ? state?.document_id : '';

			return {
				...prev,
				payment_type: is_refund ? 'payment_refund' : 'payment_success',
				payload: {
					entity: is_subs ? payment_entity : 'payment',
					action,
					...(!_.isEmpty(doc_id) ? { document_id: doc_id } : {}),
					buyer_id: id ?? buyer_data?.id,
					additional_info: {
						payment_entity: is_order ? 'order' : 'buyer',
						...(is_refund
							? {
									refund_destination: getValues('refund_destination') ?? 'source',
							  }
							: {}),
					},
				},
			};
		});
	};

	const get_email_config_info = useCallback(
		async (data: any = null) => {
			if (is_refund_flow) return;
			const action = 'confirm';
			const payload = data ?? { entity: type, action, id };
			const response: any = await order_management.get_email_config_info(payload);
			set_email_data(response?.data);
			return response?.data;
		},
		[type, id],
	);

	useEffect(() => {
		if (!_.isEmpty(buyer_data) && !order_edit_flow) {
			handle_get_buyer_payment_details();
		}
	}, [buyer_data, order_edit_flow]);

	useEffect(() => {
		if (id) {
			handle_get_edit_form_details();
			get_email_config_info();
		}
	}, [id]);

	useEffect(() => {
		if (!edit_flow) {
			handle_get_form_section();
		}
		handle_get_payment_config();
	}, [is_buyer_payment, refetch, edit_flow]);

	const handle_set_default_payment_method = () => {
		if (!isEmpty(payment_method_data)) {
			const default_payment_method_data = _.find(
				_.merge(payment_method_data?.saved_payment_methods, payment_method_data?.saved_bank_accounts),
				{ is_default: true },
			);

			const selected_payment_method_data = order_edit_flow
				? _.find(_.merge(payment_method_data?.saved_payment_methods, payment_method_data?.saved_bank_accounts), { is_selected: true }) ||
				  default_payment_method_data
				: default_payment_method_data;

			const method_key = selected_payment_method_data?.payment_method_type;
			const permission_slug: any =
				method_key === 'card' ? PERMISSIONS.collect_payment_card.slug : method_key === 'ach' ? PERMISSIONS.collect_payment_ach.slug : null;
			const new_payment_flow = selected_opt?.type && selected_opt?.mode === 'edit';

			const selected_type = new_payment_flow
				? selected_opt?.type
				: check_permission(permissions, [permission_slug]) && selected_payment_method_data?.payment_method_type;
			const selected_mode = new_payment_flow ? 'edit' : 'add';

			set_selected_opt({ type: selected_type, mode: selected_mode });
		}
	};

	useEffect(() => {
		handle_set_default_payment_method();
	}, [buyer_data, payment_method_data]);

	useEffect(() => {
		if (source_url === 'collect' && _.isEmpty(buyer_data) && !id) {
			navigate(RouteNames.payment.direct_payment.path);
		}
	}, []);

	useEffect(() => {
		if (selected_radio_btn?.value === 'subscription') {
			handle_get_subscription_form();
		}
	}, [selected_radio_btn?.value]);

	useEffect(() => {
		if (_.includes(['refund', 'authorize'], selected_radio_btn?.value) && !_.isEmpty(buyer_data)) {
			const payload_map: any = {
				authorize: {
					buyer_id: buyer_data?.id,
					...(state?.document_id ? { document_id: state?.document_id } : {}),
				},
				refund: {
					buyer_id: buyer_data?.id,
					payment_entity: 'buyer',
				},
			};
			edit_form_details(payload_map[selected_radio_btn?.value], selected_radio_btn?.value);
		}
	}, [selected_radio_btn, buyer_data]);

	useEffect(() => {
		if (buyer_edit_flow || !_.isEmpty(buyer_data)) {
			const buyer_id: string = buyer_edit_flow ? id : buyer_data?.id;
			fetch_buyer_addresses(buyer_id);
		}
	}, [buyer_edit_flow, buyer_data]);

	useEffect(() => {
		if (_.isEmpty(payment_method_id) || _.isEmpty(payment_method_data)) return;
		const payment_method = _.find(payment_method_data[selected_option], { payment_method_id });
		if (payment_method) {
			const payment_method_type = _.get(payment_method, 'payment_method_type');
			const authorized_amount = _.get(payment_method, 'authorized_amount');
			set_added_card_id((prev: any) => ({ ...prev, [selected_option]: payment_method_id }));
			setValue('payment_method_type', payment_method_type);
			set_selected_payment_method_type(payment_method_type);
			setValue('transaction_summary.order_invoice_amount', authorized_amount);
			set_form_data((prev: any) => ({
				...prev,
				total_amount_due: authorized_amount,
			}));
		}
	}, [payment_method_id, payment_method_data]);

	useEffect(() => {
		const get_payment_entity = () => {
			switch (true) {
				case is_auth_flow:
					return 'auth';
				case is_subscription_flow:
					return 'recurring_payment';
				case is_refund_flow:
				case is_refund_edit_flow:
					return 'refund';
				case order_edit_flow:
					return 'order';
				case is_payment_against_buyer:
					return 'buyer';
				default:
					return null;
			}
		};

		const payment_entity = get_payment_entity();
		if (payment_entity) {
			update_payment_email_payload(payment_entity);
		}
	}, [is_payment_against_buyer, is_auth_flow, is_refund_flow, is_refund_edit_flow, order_edit_flow, is_subscription_flow, id]);

	return {
		loading,
		form_data,
		email_data,
		set_email_data,
		set_loading,
		form_section,
		buyer_edit_flow,
		order_edit_flow,
		methods,
		set_use_credit,
		use_credit,
		show_invoice,
		set_show_invoice,
		checked_invoice,
		set_checked_invoice,
		payment_config,
		payment_method_data,
		payment_method_attrs,
		set_payment_method_attrs,
		email_checkbox,
		set_email_checkbox,
		get_email_config_info,
		set_show_buyer_panel,
		show_buyer_panel,
		buyer_data,
		set_buyer_data,
		selected_payment_method_type,
		set_selected_payment_method_type,
		payment_email_modal,
		set_payment_email_modal,
		payment_email_payload,
		set_payment_email_payload,
		handle_submit_payment,
		is_submit_loading,
		set_is_submit_loading,
		set_payment_method_data,
		is_transaction_complete_modal_visible,
		set_is_transaction_modal_visible,
		is_terminal_modal_visible,
		set_is_terminal_modal_visible,
		btn_loading,
		set_btn_loading,
		transaction_data,
		set_transaction_data,
		success_toast,
		set_success_toast,
		handle_get_edit_form_details,
		handle_get_payment_charges,
		selected_radio_btn,
		set_selected_radio_btn,
		payment_ids,
		set_payment_ids,
		input_value,
		set_input_value,
		set_form_data,
		set_is_modal_visible,
		is_modal_visible,
		is_direct_flow,
		handle_get_payload,
		is_buyer_payment,
		handle_drawer_state,
		drawer_state,
		handle_get_buyer_payment_details,
		all_addresses,
		source_url,
		handle_after_success_callback,
		is_back_drop_visible,
		set_added_card_id,
		added_card_id,
		set_is_authorized,
		edit_form_details,
		show_discard_modal,
		set_show_discard_modal,
		temp_selected_radio_btn,
		set_temp_selected_radio_btn,
		handle_switch_tab,
		is_auth_flow,
		is_payment_against_buyer,
		ach_modal,
		set_ach_modal,
		selected_option,
		set_selected_opt,
		selected_opt,
		open_drawer,
		set_open_drawer,
		handle_submit_recurring_payment,
		create_recurring_payment_schedule,
		schedule_loading,
		set_schedule_loading,
		subscription_data,
		set_subscription_data,
		selected_payment_method_id,
		set_selected_payment_method_id,
	};
};

export default UsePaymentDetails;
