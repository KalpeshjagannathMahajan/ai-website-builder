import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import documentManagement from 'src/utils/api_requests/document';
import { time_range_list, ALL_TIME_ID } from 'src/common/TimeRange/helper';
import { user_management } from 'src/utils/api_requests/userManagement';
import buyer from 'src/utils/api_requests/buyer';
import { useInterval } from '../OrderManagement/component/Drawer/useInterval';
import order_management from 'src/utils/api_requests/orderManagment';
import { CartWithoutRedux } from 'src/common/@the-source/atoms/Counter/CounterWithoutRedux';
import { useBuyerData } from 'src/hooks/useBuyerData';

const useBuyerDashboard = (provided_buyer_id?: string) => {
	const [loading, set_loading] = useState(true);
	const [cart_data, set_cart_data] = useState<CartWithoutRedux | null>(null);
	const [analytics, set_analytics] = useState({});
	const [documents, set_documents] = useState([]);
	const [sales_rep, set_sales_rep] = useState([]);
	const [section, set_section] = useState<any>([]);
	const [selected_sales_rep, set_selected_sales_rep] = useState({ id: '', name: 'All Sales Rep' });
	const [buyer_data_loader, set_buyer_data_loader] = useState(true);
	const params = useParams();

	const buyer_id = provided_buyer_id || params?.buyer_id;

	const pages = ['cart-summary', 'order-review-page'];

	const [time_range, set_time_range] = useState(time_range_list[ALL_TIME_ID]);

	const { buyer_data, set_buyer_data, handle_fetch_buyer_data, handle_create_order, order_btn_loading, buyer_data_loading } =
		useBuyerData(buyer_id);

	const on_select_sales_rep = (_sales_rep: { reference_id: string; name: string }) => {
		set_selected_sales_rep({
			id: _sales_rep.reference_id === '' ? '' : _sales_rep.reference_id,
			name: _sales_rep.name === 'all_sales_rep' ? 'All sales Rep' : _sales_rep.name,
		});
	};

	const handle_fetch_analytics = async () => {
		const currentTimestamp = Math.floor(Date.now());

		try {
			const data = {
				search: '',
				filters: {
					buyer_id,
					...(selected_sales_rep.id !== '' ? { sales_rep_id: selected_sales_rep.id } : {}),
				},
				sort: [],
				aggregate: false,
				page_number: 1,
				page_size: 10,
			};
			if (time_range.id !== ALL_TIME_ID) {
				data.filters = {
					...data.filters,
					created_at: {
						lte: currentTimestamp,
						gte: time_range.data.value(),
					},
				};
			}
			const response = await documentManagement.get_analytics(data);
			return response;
		} catch (error) {
			throw error;
		}
	};

	const handle_fetch_documents = async () => {
		const currentTimestamp = Math.floor(Date.now());

		try {
			let data = {
				search: '',
				filters: {
					buyer_id,
				},
				sort: [],
				aggregate: false,
				page_number: 1,
				page_size: 100,
			};
			if (time_range.id !== ALL_TIME_ID) {
				data.filters = {
					...data.filters,
					created_at: {
						lte: currentTimestamp,
						gte: time_range.data.value(),
					},
				};
			}

			const response = await documentManagement.serach_documents(data);
			return response;
		} catch (error) {
			throw error;
		}
	};
	const handle_fetch_users_list = async () => {
		try {
			const response = await user_management.get_users_reportee_list();
			return response;
		} catch (error) {
			console.error('Error fetching user list:', error);
		}
	};

	const handle_get_payment_config = async () => {
		try {
			const response = await buyer.get_payment_config({});
			return response;
		} catch (error) {
			console.error('Error fetching user list:', error);
		}
	};

	const [payment_config, set_payment_config] = useState<any>();
	const [transaction_data, set_transaction_data] = useState<any>(null);
	const [is_terminal_modal_visible, set_is_terminal_modal_visible] = useState<boolean>(false);
	const [isPolling, setIsPolling] = useState<any>({ data: undefined, state: false });
	const [success_toast, set_success_toast] = useState<any>({ open: false, title: '', subtitle: '', state: '' });
	const [is_drawer_visible, set_is_drawer_visible] = useState<boolean>(false);
	const [is_transaction_complete_modal_visible, set_is_transaction_modal_visible] = useState<boolean>(false);
	const [notification_email_ids, set_notification_email_ids] = useState<string[]>([]);
	const [customer_id, set_customer_id] = useState<string>('');

	const update_buyer_user_data = async () => {
		try {
			const response: any = await handle_fetch_buyer_data();
			if (response?.status === 200) {
				set_buyer_data(response?.data || {});
			}
		} catch (err) {
			console.error(err);
		} finally {
			set_buyer_data_loader(false);
		}
	};

	const complete = (res: any) => {
		res?.transaction_status === 'success' && update_buyer_user_data();
		if (res?.collect_payment_method === 'payment_link') {
			set_is_drawer_visible(false);
			set_success_toast({
				open: true,
				title: res.transaction_status !== 'failed' ? 'Payment link sent' : 'Error sending payment link',
				subtitle: res.transaction_status === 'failed' && 'Please try again',
				state: res.transaction_status !== 'failed' ? 'success' : 'warning',
			});
		} else if (res?.collect_payment_method === 'manual') {
			set_is_drawer_visible(false);
			set_success_toast({
				open: true,
				title: res?.transaction_status === 'success' ? 'Payment collected' : 'Payment failed',
				subtitle: '',
				state: res?.transaction_status === 'success' ? 'success' : 'error',
			});
		} else if (res?.collect_payment_method === 'card') {
			set_transaction_data(res);
			set_is_transaction_modal_visible(true);
		} else if (res?.collect_payment_method === 'terminal') {
			set_transaction_data(res);
			set_is_terminal_modal_visible(true);
		}
	};

	const handle_buyer_section = async () => {
		if (buyer_id) {
			const response = await buyer.get_buyer_details(buyer_id);
			return response;
		}
	};

	useInterval(
		async () => {
			if (isPolling?.state) {
				if (transaction_data?.retry_count <= transaction_data?.max_retry_count) {
					order_management
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

	useEffect(() => {
		Promise.all([handle_fetch_users_list(), handle_get_payment_config(), handle_buyer_section()])
			.then((results) => {
				const [sales_rep_response, payment_config_response, buyer_sections_response]: any = results;
				set_sales_rep(sales_rep_response?.data?.rows || []);
				set_payment_config(payment_config_response);
				set_section(buyer_sections_response?.data?.sections || []);
			})
			.catch(() => {})
			.finally(() => {
				set_loading(false);
				set_buyer_data_loader(false);
			});
	}, []);

	useEffect(() => {
		handle_fetch_analytics()
			.then((result: any) => {
				set_analytics(result?.data || {});
			})
			.catch(() => {})
			.finally(() => {
				set_loading(false);
			});
	}, [time_range.id, selected_sales_rep.id]);

	useEffect(() => {
		handle_fetch_documents()
			.then((result: any) => {
				set_documents(result?.data?.hits || []);
			})
			.catch(() => {})
			.finally(() => {
				set_loading(false);
			});
	}, [time_range.id]);

	return {
		analytics,
		documents: Object.values(documents),
		loading: loading || buyer_data_loading,
		buyer_data,
		time_range,
		set_time_range,
		sales_rep,
		selected_sales_rep,
		on_select_sales_rep,
		pages,
		payment_config,
		is_drawer_visible,
		set_is_drawer_visible,
		success_toast,
		set_success_toast,
		isPolling,
		setIsPolling,
		complete,
		is_transaction_complete_modal_visible,
		set_is_transaction_modal_visible,
		transaction_data,
		is_terminal_modal_visible,
		set_is_terminal_modal_visible,
		notification_email_ids,
		set_notification_email_ids,
		customer_id,
		set_customer_id,
		cart_data,
		set_cart_data,
		set_refetch: update_buyer_user_data,
		section,
		set_buyer_data,
		buyer_data_loading: buyer_data_loader || buyer_data_loading,
		handle_create_order,
		order_btn_loading,
	};
};

export default useBuyerDashboard;
