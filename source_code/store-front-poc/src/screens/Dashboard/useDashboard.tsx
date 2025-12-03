import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { time_range_list, ALL_TIME_ID } from 'src/common/TimeRange/helper';
import documentManagement from 'src/utils/api_requests/document';
import { update_dashbord_options } from 'src/actions/dashboard';
import { RootState } from 'src/store';
import { user_management } from 'src/utils/api_requests/userManagement';
import cart_management from 'src/utils/api_requests/cartManagement';
import { useInterval } from '../OrderManagement/component/Drawer/useInterval';
import api_requests from 'src/utils/api_requests';

const useDashboard = () => {
	const [loading, set_loading] = useState(true);
	const [analytics, set_analytics] = useState({});
	const [documents, set_documents] = useState([]);
	const [sales_rep, set_sales_rep] = useState([]);
	const [cart_data, set_cart_data] = useState<any>({});
	const [reject_id, set_reject_id] = useState<any>(false);
	const [reject_modal, set_reject_modal] = useState<any>(false);

	const [catalog_id, set_catalog_id] = useState<string>('');
	const dispatch = useDispatch();
	const dashboard_data = useSelector((state: RootState) => state?.dashboard);

	const buyer_data = dashboard_data.buyer;
	const time_range_id = dashboard_data.time_range_id;
	const sales_rep_data = dashboard_data.sales_rep;

	const time_range = time_range_list[time_range_id];
	const buyer_id = buyer_data.id === 'all_buyers' ? '' : buyer_data.id;
	const selected_sales_rep = sales_rep_data || { id: '', name: 'All Sales Rep' };

	const handle_time_range = (data: any) => {
		const payload = {
			time_range_id: data.id,
		};
		dispatch(update_dashbord_options(payload));
	};

	const on_select_buyer = (buyer: any) => {
		const payload =
			buyer.buyer_id === 'all_buyers'
				? {
						id: '',
						name: 'All Customers',
						cart_items: 0,
						buyer_id: '',
				  }
				: {
						id: buyer.buyer_id,
						name: buyer?.buyer_name || buyer?.name,
						cart_items: buyer?.total_cart_items || buyer?.cart_items || 0,
						buyer_id: buyer.buyer_id,
				  };

		dispatch(update_dashbord_options({ buyer: payload }));
	};

	const on_select_sales_rep = (_sales_rep: { reference_id: string; name: string }) => {
		const payload = {
			sales_rep: {
				id: _sales_rep.reference_id === '' ? '' : _sales_rep.reference_id,
				name: _sales_rep.name === 'all_sales_rep' ? 'All sales Rep' : _sales_rep.name,
			},
		};
		dispatch(update_dashbord_options(payload));
	};

	const handle_fetch_analytics = async () => {
		const currentTimestamp = Math.floor(Date.now());

		try {
			const data = {
				search: '',
				filters: {
					...(buyer_id !== '' ? { buyer_id } : {}),
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
				filters: buyer_id !== '' ? { buyer_id } : {},
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

	const fetch_data = () => {
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		Promise.all([handle_fetch_analytics(), handle_fetch_documents(), handle_fetch_users_list()])
			.then((results) => {
				const [analyticsResponse, documentsResponse, sales_rep_response]: any = results;
				set_analytics(analyticsResponse?.data || {});
				set_documents(documentsResponse?.data?.hits || []);
				set_sales_rep(sales_rep_response?.data?.rows || []);
			})
			.catch(() => {})
			.finally(() => {
				set_loading(false);
			});
	};

	const handle_fetch_users_list = async () => {
		try {
			const response = await user_management.get_users_reportee_list();
			return response;
		} catch (error) {
			console.error('Error fetching user list:', error);
		}
	};

	const handle_fetch_user_cart = async () => {
		try {
			const response_data: any = await cart_management.get_cart({ buyer_id, is_guest_buyer: false });
			const response: any = await cart_management.get_cart_details({ cart_id: response_data?.data?.[0]?.id });
			set_cart_data(response);
			set_catalog_id(response?.cart?.catalog_ids?.[0]);
		} catch (error) {
			console.error('Error fetching user list:', error);
		}
	};

	const [transaction_data, set_transaction_data] = useState<any>(null);
	const [is_terminal_modal_visible, set_is_terminal_modal_visible] = useState<boolean>(false);
	const [isPolling, setIsPolling] = useState<any>({ data: undefined, state: false });

	const complete = (res: any) => {
		set_transaction_data(res);
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

	useEffect(() => {
		if (transaction_data) {
			set_is_terminal_modal_visible(true);
		}
	}, [transaction_data]);

	useEffect(() => {
		fetch_data();
		if (buyer_id !== '') {
			handle_fetch_user_cart();
		} else {
			set_catalog_id('');
		}
	}, [buyer_id, time_range.id, selected_sales_rep.id]);

	return {
		analytics,
		documents: Object.values(documents),
		loading,
		on_select_buyer,
		time_range,
		handle_time_range,
		buyer_data,
		buyer_id,
		cart_data,
		sales_rep,
		selected_sales_rep,
		on_select_sales_rep,
		catalog_id,
		is_terminal_modal_visible,
		complete,
		setIsPolling,
		set_is_terminal_modal_visible,
		transaction_data,
		reject_id,
		set_reject_id,
		reject_modal,
		set_reject_modal,
	};
};

export default useDashboard;
