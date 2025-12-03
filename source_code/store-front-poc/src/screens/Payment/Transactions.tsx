import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { capitalize, cloneDeep, forEach, get, isEmpty, isNull, set } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Button, Grid, Icon, Skeleton, Chip } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import EmptyTableComponent from 'src/common/@the-source/EmptyTableComponent';
import { AgGridSSRMTableContainer } from 'src/common/@the-source/molecules/Table';
import { TABLE_CONSTANTS } from 'src/common/@the-source/molecules/Table/constants';
import TableSkeleton from 'src/common/TableSkeleton';
import PaymentActionComp from 'src/screens/BuyerDashboard/components/PaymentActionComp';
import PaymentAmountComp from 'src/screens/BuyerDashboard/components/PaymentAmountComp';
import { payment_status_constants } from 'src/screens/OrderManagement/mock/document';
import { TransactionsConfig, TransactionsOutputObject } from 'src/@types/payment';
import { colors } from 'src/utils/theme';
import { payments } from 'src/utils/api_requests/payment';
import utils from 'src/utils/utils';
import { useSelector } from 'react-redux';
import { time_range_list } from 'src/common/TimeRange/helper';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
	get_field_of_session_storage_item,
	get_formatted_price_with_currency,
	remove_field_of_session_storage_item,
} from 'src/utils/common';
import EditRecurringPayment from './drawers/EditRecurringPayment';
import { ImageTextCellRenderer } from 'src/common/@the-source/molecules/Table/TableComponent/CellRendererComponent';
import AchCellRenderer from './component/AchCellRenderer';
import payment_constants from './constants';
import { recurring_payment_status_theme } from './utils';

interface Props {
	value: string;
	handle_get_value: (data: any) => any;
	set_toast: (data: any) => any;
}

const transform_filter_model = (filter_model: any) => {
	let updated_filter_model = cloneDeep(filter_model);
	forEach(updated_filter_model, (child, key) => {
		if (child?.filterType === 'date') {
			const { dateFrom, dateTo, type } = child;
			const { from, to }: any = utils.getRange(dateFrom, dateTo, type);
			updated_filter_model[key] = {
				filterType: 'number',
				type,
				filter: from * 1000,
				filterTo: to * 1000,
			};
		}
	});

	return updated_filter_model;
};

const Transactions = ({ value, handle_get_value, set_toast }: Props) => {
	const transactions_key = value;
	const [is_loading, set_is_loading] = useState<boolean>(true);
	const [summary, set_summary] = useState<any>(null);
	const [total_rows, set_total_rows] = useState<number>(0);
	const [end_rows, set_end_rows] = useState<any>(null);
	const [facets, set_facets] = useState<any>(null);
	const [count_loading, set_count_loading] = useState<boolean>(true);
	const [transactions_config, set_transactions_config] = useState<TransactionsConfig[]>([]);
	const { default_ssrm_config } = useSelector((state: any) => state.settings);
	const [is_filter_active, set_is_filter_active] = useState<boolean>(false);
	const [grid_api, set_grid_api] = useState<any>(null);
	const [refetch, set_refetch] = useState<boolean>(false);
	const location = useLocation();
	const { t } = useTranslation();
	const [recurring_payment_drawer, set_recurring_payment_drawer] = useState({
		open: false,
		buyer_id: '',
		recurring_payment_id: '',
	});

	let is_first_render = true;

	const [search_params, set_search_params] = useSearchParams();
	let new_search_params = new URLSearchParams();

	let buyer_id: any = search_params.get('buyer_id');
	new_search_params.append('buyer_id', buyer_id);

	let buyer_name: any = search_params.get('buyer');
	new_search_params.append('buyer', buyer_name);

	let date: any = search_params.get('date');
	new_search_params.append('date', date);

	let sales_rep_id: any = search_params.get('sales_rep');
	new_search_params.append('sales_rep', sales_rep_id);

	const formatted_date: any = {
		today: time_range_list.today.data.value(),
		last_week: time_range_list.last_week.data.value(),
		last_30_days: time_range_list.last_30_days.data.value(),
		last_3_months: time_range_list.last_3_months.data.value(),
		last_6_months: time_range_list.last_6_months.data.value(),
		last_12_months: time_range_list.last_12_months.data.value(),
		all_time: time_range_list.all_time.data.value(),
	};

	const created_at_filter = date
		? {
				['record_date_milliseconds']: {
					filterType: 'number',
					type: 'greaterThan',
					filter: Math.floor(formatted_date[date]),
				},
		  }
		: {};

	const sales_rep_filter = sales_rep_id
		? {
				sales_rep_info: {
					filterType: 'set',
					values: [sales_rep_id],
				},
		  }
		: {
				'user_details.id': {
					filterType: 'text',
					type: 'equals',
					filter: sales_rep_id,
				},
		  };

	const buyer_filter = buyer_id
		? {
				buyer_info: {
					filterType: 'set',
					values: [buyer_id],
				},
		  }
		: {};

	const buyer_name_filter = buyer_name
		? {
				'buyer_details.name': {
					filterType: 'text',
					type: 'equals',
					filter: buyer_name,
				},
		  }
		: {};

	const open_recurring_drawer = (data: any) => {
		set_recurring_payment_drawer({
			open: true,
			recurring_payment_id: data?.recurring_payment_id,
			buyer_id: data?.buyer_id,
		});
	};

	const close_recurring_drawer = () => {
		set_recurring_payment_drawer({
			open: false,
			recurring_payment_id: '',
			buyer_id: '',
		});
	};

	const get_config_api: any = () => {
		switch (value) {
			case payment_constants.all_tabs.RECURRING_PAYMENTS.value:
				return payments.get_recurring_payment_ssrm_config();
			default:
				return payments.get_transactions_ssrm_config();
		}
	};

	const get_transactions_config = async () => {
		try {
			const response: any = await get_config_api();
			const data = Object.values(response).filter((column: any) => typeof column === 'object' && column.key);
			if (Array.isArray(data)) {
				set_transactions_config(data as TransactionsConfig[]);
			} else {
				console.error('Invalid response format for columns_defs');
			}
		} catch (error) {
			console.error(error);
		} finally {
			set_is_loading(false);
		}
	};

	const get_column_dtype = (name: string, dtype: string, key: any) => {
		if (name === 'Order value' || name === 'Amount') return 'currency';
		if (name === 'Reference ID') return 'imageText2';
		if (key === 'transaction_status') return 'tags';
		if (TABLE_CONSTANTS.INTERNAL_STATUS_HEADER_NAME.includes(name) && dtype === 'tags') return 'internal_status';
		return dtype;
	};

	const transform_data = (data: any) => {
		switch (value) {
			case payment_constants.all_tabs.RECURRING_PAYMENTS.value:
				return data;
			default:
				return data?.map((item: any) => {
					const total_value = parseFloat((Math.floor(item?.total_value * 100) / 100)?.toFixed(2)) || 0;
					const first_name = get(item, 'user_details.first_name');
					const last_name = get(item, 'user_details.last_name');
					const email = get(item, 'user_details.email');
					const name = first_name || last_name ? `${first_name ?? ''} ${last_name ?? ''}`.trim() : email;
					const payment_status = payment_status_constants[get(item, 'payment_status')]?.label;
					return {
						...item,
						total_value,
						table_type: 'transactions',
						name,
						source: item?.source === 'wizshop' ? 'Website' : item?.source || '',
						payment_status,
					};
				});
		}
	};

	const get_table_datasource = () => {
		return {
			async getRows(params: any) {
				let active_value = handle_get_value(window.location.pathname);
				let params_from_url = new URLSearchParams(window.location.search);
				let stored_params: any = sessionStorage.getItem('params_data');
				let filter: any = {
					value: transactions_key,
					params: '',
				};
				if (typeof stored_params === 'string') {
					try {
						stored_params = JSON.parse(stored_params);
						filter = stored_params[transactions_key];
					} catch (err) {}
				}
				set_count_loading(true);
				const check_buyer_id: boolean = params_from_url.get('buyer_id') !== null;
				const check_buyer_name: boolean = params_from_url.get('buyer') !== null;
				const check_date: boolean = params_from_url.get('date') !== null;
				const check_sales_rep = params_from_url.get('sales_rep') !== null;
				const default_sorting = get(default_ssrm_config, 'sorting.transaction_ssrm', []);
				let filters_param: string = new URLSearchParams(filter?.params).get('filter') ?? '';

				if (active_value === value) {
					if (
						(params_from_url.get('filter') && params_from_url.get('filter') !== '') ||
						check_buyer_id ||
						check_date ||
						check_sales_rep ||
						check_buyer_name
					) {
						filters_param = params_from_url.get('filter') ?? '';
					}
				}

				const param_filtering = utils.parse_and_check_json(filters_param);
				let { startRow, endRow, filterModel, sortModel } = params.request;
				let filter_data = { ...param_filtering, ...filterModel };
				if (active_value === value) {
					if (check_buyer_name) {
						filter_data = {
							...buyer_name_filter,
							...filterModel,
						};
					}
					if (check_buyer_id) {
						filter_data = {
							...buyer_filter,
							...filterModel,
						};
					}
					if (check_date) {
						filter_data = {
							...created_at_filter,
							...filterModel,
						};
					}
					if (check_sales_rep) {
						filter_data = {
							...sales_rep_filter,
							...filterModel,
						};
					}
				}

				const condition = is_first_render || check_date || check_buyer_id || check_sales_rep || check_buyer_name;
				const transformed_filter_model = transform_filter_model(condition ? filter_data : filterModel);

				let payload: any = {
					startRow,
					endRow,
					sortModel: isEmpty(sortModel) ? default_sorting : sortModel,
					filterModel: {
						...transformed_filter_model,
					},
				};

				if (active_value === value) {
					if (check_buyer_name) {
						payload = {
							...payload,
							filterModel: {
								...payload.filterModel,
								...buyer_name_filter,
							},
						};
					}
					if (check_buyer_id) {
						payload = {
							...payload,
							filterModel: {
								...payload.filterModel,
								...buyer_filter,
							},
						};
					}
					if (check_date) {
						payload = {
							...payload,
							filterModel: {
								...payload.filter_model,
								...created_at_filter,
							},
						};
					}
					if (check_sales_rep) {
						payload = {
							...payload,
							filterModel: {
								...payload.filterModel,
								...sales_rep_filter,
							},
						};
					}
				}

				if (filters_param && filters_param !== '') {
					set_is_filter_active(true);
				}

				if (active_value === value) {
					let params_to_cache: any = param_filtering;
					if (!isEmpty(transformed_filter_model)) {
						params_from_url.set('filter', JSON.stringify(transformed_filter_model));
						window.history.pushState({}, '', `${window.location.pathname}?${params_from_url.toString()}`);
						params_to_cache = params_from_url.toString();
						set_is_filter_active(true);
					} else {
						window.history.pushState({}, '', `${window.location.pathname}`);
						params_to_cache = '';
						set_is_filter_active(false);
					}

					if (!check_buyer_id && !check_date && !check_sales_rep && !check_buyer_name) {
						let cache = {
							[transactions_key]: {
								value: transactions_key,
								params: params_to_cache,
							},
						};
						if (typeof stored_params === 'object') {
							sessionStorage.setItem(
								'params_data',
								JSON.stringify({
									...stored_params,
									...cache,
								}),
							);
						} else {
							sessionStorage.setItem('params_data', JSON.stringify(cache));
						}
					}
				}

				const get_api: any = () => {
					switch (value) {
						case payment_constants.all_tabs.RECURRING_PAYMENTS.value:
							return payments.get_recurring_payment_ssrm_data;
						case payment_constants.all_tabs.TRANSACTIONS.value:
						default:
							return payments.get_transactions_ssrm_data;
					}
				};

				try {
					const data: any = await get_api()(payload);
					set_total_rows(data?.total);
					const transformed_data = transform_data(data?.data);

					if (isEmpty(sortModel) && default_sorting) {
						params.columnApi.applyColumnState({
							state: default_sorting,
							defaultState: { sort: default_sorting },
						});
					}
					if (endRow && endRow >= 10000) {
						set_toast({
							show: true,
							message: t('Payment.Transactions.SSRMLimitWarning'),
							title: '',
							status: 'warning',
						});
					}
					set_total_rows(data?.total);
					set_count_loading(false);
					set_end_rows(endRow);
					set_facets(data?.facet);
					set_summary(data?.summary);
					if (data) {
						params.success({ rowData: transformed_data as TransactionsConfig[], rowCount: data?.total > 10000 ? 10000 : data?.total });
					}
					is_first_render = false;
				} catch (error) {
					console.error(error);
					params.fail();
					set_count_loading(false);
					is_first_render = false;
				}
			},
		};
	};

	const handle_update_row = async (id: string, status?: string, payment_method_info?: any, notification_email_ids?: string) => {
		const row_data = await grid_api?.api?.getRowNode(id);
		grid_api?.api?.applyServerSideTransactionAsync({
			update: [
				{
					...row_data?.data,
					...(!isEmpty(status) ? { recurring_payment_status: capitalize(status) } : {}),
					...(!isEmpty(payment_method_info) ? { payment_method_info } : {}),
					...(!isEmpty(notification_email_ids) ? { notification_email_ids } : {}),
				},
			],
		});
	};

	const data_source = useMemo(() => get_table_datasource(), [refetch, value]);

	const handle_refetch = () => {
		set_refetch((prev) => !prev);
	};

	const create_column_config = (input_array: TransactionsConfig[]): TransactionsOutputObject[] => {
		if (isNull(facets)) return [];

		let new_array: TransactionsOutputObject[] = input_array.map((item) => {
			let column_props = {};

			const format_value = (val: any, key: string, constants: any) => {
				if (!val || val.key === '') {
					return '(Blanks)';
				}
				if (val.key === 'accepted') {
					return 'converted to order';
				}
				if (key === 'payment_status' && constants[val.key]) {
					return `${constants[val.key].label}`;
				}
				return val?.label || val.key;
			};

			if (item?.key === 'recurring_payment_status') {
				column_props = {
					cellRenderer: (params: any) => {
						return (
							<CustomText type='Subtitle' color={recurring_payment_status_theme(params?.value)}>
								{params?.value}
							</CustomText>
						);
					},
				};
			}

			if (item?.key === 'settlement_status_info') {
				column_props = {
					cellRenderer: (params: any) => {
						const settlement_config =
							payment_constants.ssrm_constants.settlement_status[isEmpty(params?.value?.value) ? 'unknown' : params?.value?.value];
						return (
							<Chip textColor={settlement_config?.text_color} label={settlement_config?.label} bgColor={settlement_config?.bg_color} />
						);
					},
				};
			}

			if (item?.key === 'payment_method_info') {
				column_props = {
					cellRenderer: (params: any) => {
						const payment_method_type = params?.data?.payment_method_type;
						const source = params?.data?.source;
						const sub_title = params?.data?.sub_title;
						if (
							(payment_method_type !== 'ach' &&
								(value === payment_constants.all_tabs.RECURRING_PAYMENTS.value || !isEmpty(payment_method_type))) ||
							(payment_method_type === 'ach' && source === 'manual')
						) {
							return <ImageTextCellRenderer valueFormatted={params?.value} value={params?.value} />;
						}
						if (payment_method_type === 'ach' && (source === 'ach' || !isEmpty(sub_title))) {
							return <AchCellRenderer value={params?.data?.sub_title} />;
						} else return '--';
					},
				};
			}

			if (item?.key === 'buyer_info') {
				column_props = {
					valueGetter: (params: any) => params?.data?.buyer_info?.label,
				};
			}

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

			if (item?.name === 'Payable Amount' || item?.name === 'Recurring Amount') {
				column_props = {
					cellRenderer: (params: any) => {
						const currency = params?.node?.data?.currency;
						return params?.value ? get_formatted_price_with_currency(currency, params?.value) : '--';
					},
				};
			}

			if (item?.name === 'Amount' || item?.name === 'Balance due') {
				column_props = {
					cellRenderer: (params: any) => <PaymentAmountComp item_name={item?.name} {...params} />,
				};
			}

			if (item.filterType === 'set') {
				column_props = {
					filterParams: {
						values: facets?.[item.key],
						keyCreator: (params: any) => params?.value?.key,
						valueFormatter: (params: any) => {
							const formatted_value = format_value(params.value, item.key, payment_status_constants);
							const count = params?.value?.doc_count;
							return count ? `${formatted_value} (${count})` : formatted_value;
						},
					},
					...column_props,
				};
			}

			return {
				headerName: item.name,
				field: item?.key,
				resizable: true,
				headerStyle: {},
				unSortIcon: true,
				hide: !item.visible,
				type: get_column_dtype(item?.name, item?.type, item?.key),
				dtype: get_column_dtype(item?.name, item?.type, item?.key),
				filter: item?.filter,
				sortable: item?.isSortable,
				hideFilter: !item?.isFilterable,
				minWidth: 200,
				editable: false,
				...column_props,
			};
		});

		new_array = [utils.create_serial_number_config(), ...new_array];

		const action_column: any = {
			headerName: 'Actions',
			field: 'action',
			editable: false,
			filter: false,
			dtype: 'action',
			lockPinned: true,
			resizable: false,
			pinned: 'right',
			cellStyle: {
				background: 'transparent',
				width: '120px',
				justifyContent: 'center',
				alignItems: 'center',
				minWidth: '120px',
				textAlign: 'center',
				borderRadius: '0px',
				borderWidth: '0px 0px 0px 1px',
				borderColor: '#ddd4d1',
			},
			sortable: false,
			headerStyle: {
				width: '120px',
			},
			width: 120,
			flex: 1,
			minWidth: 120,
			suppressMenu: true,
			cellRenderer:
				value === payment_constants.all_tabs.TRANSACTIONS.value
					? PaymentActionComp
					: (params: any) => {
							return (
								<Grid display={'flex'} justifyContent={'center'} height={'100%'} alignItems={'center'}>
									<Icon
										onClick={() => open_recurring_drawer({ buyer_id: params?.data?.buyer_id, recurring_payment_id: params?.data?.id })}
										sx={{ cursor: 'pointer' }}
										color={colors.grey_800}
										iconName='IconEdit'
									/>
								</Grid>
							);
					  },
			cellRendererParams:
				value === payment_constants.all_tabs.TRANSACTIONS.value
					? {
							set_toast,
							refetch: handle_refetch,
					  }
					: null,
		};
		new_array.push(action_column);
		if (new_array.length > 0) {
			set(new_array, '[0].flex', 1);
		}
		if (new_array.length > 1) {
			set(new_array, '[1].flex', 1);
		}

		return new_array;
	};

	const update_param_values = () => {
		buyer_id = search_params.get('buyer_id');
		buyer_name = search_params.get('buyer');
		date = search_params.get('date');
		sales_rep_id = search_params.get('sales_rep');
		new_search_params = new URLSearchParams();
	};

	const handle_clear_filter = () => {
		if (is_filter_active) {
			set_search_params('');
			remove_field_of_session_storage_item('params_data', transactions_key);
			update_param_values();
			grid_api?.api?.setFilterModel(null);
			grid_api?.api?.onFilterChanged();
		}
	};

	const on_first_data_rendered = (params: any) => {
		let params_data: any = get_field_of_session_storage_item('params_data', transactions_key);
		let filter = get(params_data, 'params', '');
		const url_params = new URLSearchParams(window.location.search);
		const filters_param = (url_params.get('filter') ? url_params.get('filter') : false) || new URLSearchParams(filter).get('filter') || '';
		const param_filtering = utils.parse_and_check_json(filters_param);
		if (param_filtering) params.api.setFilterModel(param_filtering);
	};

	const column_data = create_column_config(transactions_config);

	useLayoutEffect(() => {
		let params: any = sessionStorage.getItem('params_data');
		let url_params = new URLSearchParams(window.location.search);
		if (typeof params === 'string') {
			try {
				params = JSON.parse(params);
				if (
					handle_get_value(location.pathname) === value &&
					!url_params.get('filter') &&
					!url_params.get('buyer_id') &&
					!url_params.get('buyer') &&
					!url_params.get('date') &&
					!url_params.get('sales_rep')
				) {
					if (transactions_key in params && params[transactions_key]?.params) {
						set_search_params(params[transactions_key]?.params);
					}
				}
			} catch (err) {
				console.error(err, 'Failed to set search params');
			}
		}
	}, [location.pathname]);

	useEffect(() => {
		get_transactions_config();
	}, [value]);

	const render_title = count_loading ? (
		<Skeleton variant='rounded' width={170} height={20} />
	) : (
		<Grid display='flex' gap={1} alignItems={'center'}>
			<CustomText type='Body' color={colors.secondary_text}>
				{total_rows > 10000 ? t('Payment.Transactions.LimitShowing') : t('Payment.Transactions.Showing', { count: total_rows ?? 0 })}
			</CustomText>
			{!count_loading && is_filter_active && (
				<Button variant='text' onClick={handle_clear_filter}>
					Clear filters
				</Button>
			)}
		</Grid>
	);

	return (
		<React.Fragment>
			<Grid mt={2} position={'relative'}>
				{!is_loading ? (
					<>
						<AgGridSSRMTableContainer
							showSWHeader
							rowData={[]}
							totalRows={total_rows}
							summary={summary}
							endRows={end_rows}
							column_id={'transactions'}
							customRowName={'Total transactions'}
							columnDefs={column_data}
							containerStyle={{ height: 'calc(100vh - 170px)' }}
							suppressFieldDotNotation={true}
							dataSource={data_source}
							hideManageColumn
							getRowId={(params) => params.data.id}
							title={render_title}
							onGridReady={(params: any) => set_grid_api(params)}
							onFirstDataRendered={on_first_data_rendered}
						/>
						{total_rows === 0 && !count_loading && <EmptyTableComponent top={'140px'} height={'calc(100vh - 340px)'} />}
					</>
				) : (
					<TableSkeleton />
				)}
			</Grid>

			{recurring_payment_drawer?.open && (
				<EditRecurringPayment
					handle_update={handle_update_row}
					on_close={close_recurring_drawer}
					{...recurring_payment_drawer}
					edit_flow={true}
					set_toast={set_toast}
				/>
			)}
		</React.Fragment>
	);
};

export default Transactions;
