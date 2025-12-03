import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import buyer from 'src/utils/api_requests/buyer';
import { document, payment_status_constants } from '../OrderManagement/mock/document';
import utils, { check_permission } from 'src/utils/utils';
import _ from 'lodash';
import api_requests from 'src/utils/api_requests';
import PaymentAmountComp from '../BuyerDashboard/components/PaymentAmountComp';
import { TABLE_CONSTANTS } from 'src/common/@the-source/molecules/Table/constants';
import RouteNames from 'src/utils/RouteNames';
import { show_document_alert } from 'src/actions/document';
import { useNavigate } from 'react-router-dom';
import { OrdersActionComp } from './Components/OrdersActionComp';
import ActionButtonRenderer from '../BuyerLibrary/BuyerList/ActionButtonRenderer';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid } from 'src/common/@the-source/atoms';
import order_management from 'src/utils/api_requests/orderManagment';
import cartManagement from 'src/utils/api_requests/cartManagement';
import { initializeCart } from 'src/actions/cart';
import cart_management from 'src/utils/api_requests/cartManagement';
import { RootState } from 'src/store';
import { Mixpanel } from 'src/mixpanel';
import Events from 'src/utils/events_constants';

const agGridCustomCell = {
	width: '100%',
	height: '100%',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	marginTop: '0.2rem',
};

const useAccount = () => {
	const user_details = useSelector((state: any) => state?.login?.userDetails);
	const [isview, set_isview] = useState({ state: false, data: null });
	const buyer_id = user_details?.buyer_id;
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [success_toast, set_success_toast] = useState<any>({ open: false, title: '', subtitle: '', state: '' });
	const [is_loading, set_is_loading] = useState(false);
	const [count_loading, set_count_loading] = useState(true);
	const [re_order_loading, set_re_order_loading] = useState<any>({ id: null, loading: false });
	const [buyer_details, set_buyer_details] = useState([]);
	const [user_info, set_user_info] = useState<any>([]);
	const [document_config, set_document_config] = useState<any>([]);
	const [refetch, set_refetch] = useState<boolean>(false);
	const [total_rows, set_total_rows] = useState<any>(null);
	const [summary, set_summary] = useState<any>(null);
	const [row_data, set_row_data] = useState<any>(null);
	const is_retail_mode = localStorage.getItem('retail_mode') === 'true';
	const [review_modal, set_review_modal] = useState({ state: false, data: null });
	const { enable_reorder_flow = false } = useSelector((state: any) => state?.settings);
	const cartDataFromStorage = JSON.parse(localStorage.getItem('CartData') || '{}');
	const cart_id_value = useSelector((state: RootState) => state?.cart?.id) || cartDataFromStorage?.id;
	const redux_cart_id = useSelector((state: RootState) => state?.buyer?.buyer_cart?.id);
	const new_cart_id = !_.isEmpty(cart_id_value) ? cart_id_value : redux_cart_id;

	const handle_buyer_details = async () => {
		set_is_loading(true);
		try {
			const res: any = await buyer.get_buyer_details(buyer_id);
			if (res) {
				set_buyer_details(res?.data?.sections);
				const profile_data: any = [
					{
						key: 'company_name',
						icon_name: 'IconBuildingCommunity',
						value: user_details?.company_name || '--',
					},
					{
						key: 'company_mail',
						icon_name: 'IconMail',
						value: user_details?.email || '--',
					},
					{
						key: 'phone_number',
						icon_name: 'IconPhone',
						value: `${user_details?.country_code || '--'} ${user_details?.phone || '--'}`,
					},
				];
				if (check_permission(['wallet_view']))
					profile_data.push({
						key: 'wallet_balance',
						icon_name: 'IconWallet',
						value: 'Available credits:',
						sub_value: `$ ${res?.data?.wallet_balance || 0}`,
					});
				set_user_info(profile_data);
			}
			set_is_loading(false);
		} catch (err) {
			console.error(err);
			set_is_loading(false);
		}
	};

	const get_value_from_current_url = () => {
		const path = window.location.pathname;
		const parts = path.split('/');
		return parts[parts.length - 1];
	};

	const transform_filter_model = (filterModel: any) => {
		let updatedFilterModel = _.cloneDeep(filterModel);
		_.forEach(updatedFilterModel, (child, key) => {
			if (_.has(child, 'values') && _.isArray(child.values)) {
				updatedFilterModel[key].values = _.map(child?.values, (value) => {
					if (value === 'converted to order') {
						return 'accepted';
					}
					return value === null ? '' : value;
				});
			}
		});

		if (updatedFilterModel?.created_at) {
			const { dateFrom, dateTo, type } = updatedFilterModel.created_at;
			const { from, to } = utils.getRange(dateFrom, dateTo, type);
			updatedFilterModel.created_at = {
				filterType: 'number',
				type: 'inRange',
				filter: from,
				filterTo: to,
			};
		}
		if (updatedFilterModel?.updated_at) {
			const { dateFrom, dateTo, type } = updatedFilterModel.updated_at;
			const { from, to } = utils.getRange(dateFrom, dateTo, type);
			updatedFilterModel.updated_at = {
				filterType: 'number',
				type: 'inRange',
				filter: from,
				filterTo: to,
			};
		}
		return updatedFilterModel;
	};

	const transform_data = (data: any) => {
		return _.map(data, (item: any) => {
			const total_value_temp = _.isNumber(item?.total_value) ? parseFloat((Math?.floor(item.total_value * 100) / 100).toFixed(2)) : 0;

			const get_name_or_email = (firstName: string, lastName: string, email: string) => {
				if (firstName || lastName) {
					return `${firstName || ''} ${lastName || ''}`.trim();
				}
				return email;
			};

			let firstName = _.get(item, 'user_details.first_name');
			let lastName = _.get(item, 'user_details.last_name');
			let email = _.get(item, 'user_details.email');

			const name = get_name_or_email(firstName, lastName, email);
			const payment_status = payment_status_constants[_.get(item, 'payment_status')]?.label;
			const document_status = item?.document_status === 'pending-approval' ? 'Under review' : item?.document_status;

			return {
				...item,
				total_value: total_value_temp,
				name,
				payment_status,
				document_status,
				source: item?.source === 'wizshop' ? 'Website' : item?.source === 'sales_rep' ? 'Sales Rep' : item?.source || '',
				table_type: get_value_from_current_url(),
			};
		});
	};

	const tab = get_value_from_current_url();

	const default_sort: any = [{ sort: 'desc', colId: 'system_id' }];

	const default_filters: any = useMemo(() => {
		return {
			orders: {
				type: {
					filterType: 'text',
					type: 'equals',
					filter: 'order',
					filterTo: null,
				},
			},
			invoices: {
				type: {
					filterType: 'text',
					type: 'equals',
					filter: 'invoice',
					filterTo: null,
				},
			},
		};
	}, []);

	const create_datasource = useCallback((default_filter: any) => {
		if (get_value_from_current_url() === 'profile') return;
		set_count_loading(true);
		return {
			getRows(params: any) {
				const { startRow, endRow, filterModel, sortModel } = params.request;

				const sort_data = sortModel?.length > 0 ? sortModel : default_sort;

				const transformedFilterModel = transform_filter_model(filterModel);
				const payload = {
					startRow,
					endRow,
					sortModel: sort_data,
					filterModel: {
						...default_filter,
						...transformedFilterModel,
					},
				};

				const get_api: any = () => {
					switch (get_value_from_current_url()) {
						case 'invoices':
							return api_requests.buyer.get_invoices_ssrm;
						default:
							return api_requests.order_listing.get_document_list;
					}
				};

				get_api()(payload as any)
					.then((res: any) => {
						if (_.get(res, 'status') === 200) {
							let data: any;
							if (get_value_from_current_url() === 'invoices') data = res;
							else data = res?.data;
							const new_data = transform_data(data?.data);

							set_total_rows(data?.total);
							set_row_data(endRow);
							set_summary(data?.summary);
							if (data) {
								params.success({ rowData: new_data as any[], rowCount: data?.total });
							}
						}
					})
					.catch((error: any) => {
						console.error(error);
						params.fail();
					})
					.finally(() => set_count_loading(false));
			},
		};
	}, []);

	const data_source = useMemo(
		() => create_datasource(default_filters[get_value_from_current_url()]),
		[create_datasource, location.pathname],
	);

	const handle_navigate_on_click = (params: any) => {
		if (_.get(params, 'node.data.type') === 'invoice') {
			let invoice_url = _.get(params, 'node.data.invoice_url');
			invoice_url && window.open(invoice_url, '_blank');
			return;
		}

		if (_.get(params, 'node.data.id') && _.get(params, 'node.data.type')) {
			let status = _.get(params, 'node.data.document_status');
			let get_document_status = utils.handle_get_status(status);

			const route = RouteNames.product.checkout.routing_path;

			if (!get_document_status && status === document?.DocumentStatus?.draft) {
				navigate(`${route}${_.get(params, 'node.data.type')}/${_.get(params, 'node.data.id')}`);

				dispatch(show_document_alert(false));
				return;
			}
			navigate(
				`${RouteNames.product.review.routing_path}${_.get(params, 'node.data.type')}/${_.get(
					params,
					'node.data.id',
				)}/${get_document_status}`,
				{
					state: {
						from: 'order-listing',
					},
				},
			);
			dispatch(show_document_alert(false));
		}
	};

	const handle_get_dtype = (name: any, dtype: any, key: any) => {
		if (name === 'Order value' || name === 'Amount') {
			return 'currency';
		}
		if (key === 'system_id') {
			return 'imageText2';
		}

		if (key === 'transaction_status') {
			return 'tags';
		}

		if (TABLE_CONSTANTS.INTERNAL_STATUS_HEADER_NAME.includes(name) && dtype === 'tags') {
			return 'internal_status';
		}

		return dtype;
	};

	const handle_reorder_flow = async (data: any) => {
		if (get_value_from_current_url() === 'orders') {
			set_re_order_loading({ id: data?.id, loading: true });
			const payload = {
				document_id: data?.id,
				buyer_id: data?.buyer_id,
				reference_user_id: data?.created_by,
			};
			try {
				const response: any = await order_management.get_duplicate_document(payload);
				if (response?.status_code === 200) {
					set_success_toast({
						open: true,
						title: 'Repeating order',
						subtitle: '',
						state: 'success',
					});
					setTimeout(() => {
						navigate(`/checkout/order/${response?.data?.document_id}?step=review`, {
							replace: true,
						});
					}, 2000);
				}
			} catch (err) {
				set_success_toast({
					open: true,
					title: 'Repeating order failed',
					subtitle: '',
					state: 'warning',
				});
				console.error(err);
			} finally {
				if (review_modal?.state) {
					set_review_modal({ state: false, data: null });
				}
				setTimeout(() => {
					set_re_order_loading({ id: null, loading: false });
				}, 2000);
			}
		}
	};

	function convert_to_new_structure(inputArray: any[]): any[] {
		const handle_action_click = (params: any) => {
			if (!enable_reorder_flow) {
				handle_navigate_on_click(params);
			} else {
				Mixpanel.track(Events.REORDER_LIST_CLICKED, {
					tab_name: 'My Orders',
					page_name: 'Accounts',
					section_name: 'Reorder',
				});

				set_isview({ state: true, data: params?.node?.data });
			}
		};

		const newArray: any[] = inputArray.map((item) => {
			let column_props = {};

			// const formatValue = (val: any, key: string, constants: any) => {
			// 	if (!val || val.key === '') {
			// 		return '(Blanks)';
			// 	}
			// 	if (val.key === 'accepted') {
			// 		return 'converted to order';
			// 	}
			// 	if (key === 'payment_status' && constants[val.key]) {
			// 		return `${constants[val.key].label}`;
			// 	}
			// 	return val?.label || val.key;
			// };

			if (item?.key === 'buyer_details.name') {
				column_props = {
					headerName: 'Customer',
				};
			}

			if (item?.key === 'record_date_milliseconds') {
				column_props = {
					format: 'DD/MM/YY hh:mm A',
				};
			}

			if (item?.name === 'Amount' || item?.name === 'Balance due') {
				column_props = {
					cellRenderer: (params: any) => <PaymentAmountComp item_name={item?.name} {...params} />,
				};
			}
			if (item?.key === 'item_count') {
				column_props = {
					cellRenderer: (params: any) => (
						<Grid style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', ...agGridCustomCell }}>
							<CustomText type='Body'>
								{params?.data?.item_count > 1 ? `${params?.data?.item_count} SKUs` : `${params?.data?.item_count} SKU`}
							</CustomText>
						</Grid>
					),
				};
			}

			// if (item.filterType === 'set') {
			// 	column_props = {
			// 		filterParams: {
			// 			values: facets?.[item.key],
			// 			keyCreator: (params: any) => params?.value?.key,
			// 			valueFormatter: (params: any) => {
			// 				const formattedValue = formatValue(params.value, item.key, payment_status_constants);
			// 				const count = params?.value?.doc_count;
			// 				return count ? `${formattedValue} (${count})` : formattedValue;
			// 			},
			// 		},
			// 	};
			// }

			return {
				headerName: item.name,
				field: item.key,
				resizable: true,
				headerStyle: {},
				unSortIcon: true,
				lockPinned: false,
				hide: item.name === 'Order value' ? is_retail_mode : false,
				clickable: item.name === 'Order ID' || item.name === 'Invoice ID' || item.name === 'Reference ID',
				type: handle_get_dtype(item?.name, item?.type, item?.key),
				dtype: handle_get_dtype(item?.name, item?.type, item?.key),
				filter: item?.filter,
				sortable: item?.isSortable,
				flex: 1,
				hideFilter: true,
				minWidth: 200,
				editable: false,
				isHyperLink: false,
				menuTabs: [],
				onCellClicked:
					item.name === 'Reference ID' || item.name === 'Invoice ID' || item.name === 'Order ID'
						? (params: any) => {
								handle_navigate_on_click(params);
						  }
						: '',
				...column_props,
			};
		});

		if (tab === 'invoices') {
			newArray.push({
				headerName: 'Actions',
				field: 'action',
				editable: false,
				filter: false,
				dtype: 'action',
				resizable: false,
				cellStyle: {
					background: 'transparent',
					width: '119px',
					justifyContent: 'center',
					alignItems: 'center',
					minWidth: '119px',
					textAlign: 'center',
					borderRadius: '8px',
				},
				sortable: false,
				headerStyle: {
					width: '120px',
				},
				isHyperLink: false,
				width: 120,
				minWidth: 120,
				suppressMenu: true,
				hideFilter: true,
				cellRenderer: OrdersActionComp,
			});
		} else {
			newArray.push({
				headerName: 'Action',
				field: 'action',
				editable: false,
				filter: false,
				dtype: 'action',
				lockPinned: true,
				resizable: false,
				pinned: 'right',
				hideFilter: true,
				cellStyle: {
					background: 'transparent',
					width: '140px',
					justifyContent: 'center',
					alignItems: 'center',
					minWidth: '140px',
					textAlign: 'center',
					borderRadius: '0px',
					borderWidth: '0px 0px 0px 1px',
					borderColor: '#ddd4d1',
				},
				sortable: false,
				headerStyle: {
					width: '140px',
				},
				width: 140,
				flex: 1,
				minWidth: 140,
				suppressMenu: true,
				handle_action_click,
				cellRenderer: (params: any) => ActionButtonRenderer({ ...params, re_order_loading }),
			});
		}

		return newArray;
	}

	const handle_get_config = () => {
		set_is_loading(true);
		const value = get_value_from_current_url();

		const handle_get_api: any = () => {
			switch (value) {
				case 'invoices':
					return api_requests.buyer.get_invoices_config();
				default:
					return api_requests.order_listing.get_document_config();
			}
		};

		handle_get_api()
			.then((res: any) => {
				if (_.get(res, 'status') === 200) {
					if (value === 'invoices') {
						const data = Object.values(res).filter((column: any) => typeof column === 'object' && column.key);
						if (Array.isArray(data)) {
							set_document_config(data as any[]);
						} else {
							console.error('Invalid response format for columns_defs');
						}
					} else {
						let data: any = _.get(res, 'data');
						if (data) {
							if (Array.isArray(data)) data = _.uniqBy(data, 'key');
							if (Array.isArray(data)) {
								set_document_config(data as any[]);
							}
						}
					}
				}
			})
			.catch((error: any) => {
				console.error(error);
			})
			.finally(() => set_is_loading(false));
	};

	const handle_cart_detail = async (cart_id: string) => {
		try {
			const response: any = await cartManagement.get_cart_details({ cart_id }, false);

			if (response?.status === 200) {
				const { cart: _cart } = response;
				if (response?.cart?.cart_status === 'closed') {
					try {
						const get_new_cart: any = await cart_management.get_cart({
							buyer_id: _cart?.buyer_id,
							is_guest_buyer: false,
						});

						const new_cart_details: any = await cart_management.get_cart_details({
							cart_id: get_new_cart?.data?.[0]?.id,
							is_guest_buyer: false,
						});

						dispatch(
							initializeCart({
								id: new_cart_details?.cart?.id,
								products: new_cart_details?.cart?.items,
								products_details: new_cart_details?.cart?.products,
								document_items: new_cart_details?.cart?.document_items || {},
							}),
						);
					} catch {
						console.error('error');
					}
				} else {
					dispatch(
						initializeCart({
							id: cart_id || _cart?.id,
							products: _cart?.items,
							products_details: _cart?.products,
							document_items: _cart?.document_items || {},
						}),
					);
				}
			}
		} catch (err) {
			console.error(err, 'error while fetching cart details');
		}
	};

	useEffect(() => {
		if (user_details?.id && tab === 'profile') {
			handle_buyer_details();
		} else if (tab === 'orders' || tab === 'invoices') {
			handle_get_config();
			if (new_cart_id) {
				handle_cart_detail(new_cart_id);
			}
		}
	}, [user_details, location.pathname, refetch]);

	return {
		user_details,
		buyer_details,
		is_loading,
		set_is_loading,
		user_info,
		get_value_from_current_url,
		data_source,
		total_rows,
		summary,
		row_data,
		convert_to_new_structure,
		document_config,
		set_refetch,
		count_loading,
		buyer_id,
		handle_navigate_on_click,
		review_modal,
		set_review_modal,
		handle_reorder_flow,
		isview,
		set_isview,
		success_toast,
		set_success_toast,
		re_order_loading,
	};
};

export default useAccount;
