/* eslint-disable */
import { Tab, Tabs } from '@mui/material';
import { IServerSideGetRowsParams } from 'ag-grid-community';
import _ from 'lodash';
import React, { useCallback, useMemo } from 'react';
import { useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import EmptyTableComponent from 'src/common/@the-source/EmptyTableComponent';
import { Chip, Grid, Icon, Tooltip } from 'src/common/@the-source/atoms';
import { AgGridSSRMTableContainer } from 'src/common/@the-source/molecules/Table';
import TableSkeleton from 'src/common/TableSkeleton';
import { document, payment_status_constants } from 'src/screens/OrderManagement/mock/document';
import api_requests from 'src/utils/api_requests';
import { SSRMFilterModelDict, SSRMInput } from 'src/utils/api_requests/orderListing';
import utils, { should_handle_click } from 'src/utils/utils';
import PaymentActionComp from './PaymentActionComp';
import { time_range_list } from 'src/common/TimeRange/helper';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { PERMISSIONS } from 'src/casl/permissions';
import RouteNames from 'src/utils/RouteNames';
import { show_document_alert } from 'src/actions/document';
import ActionComp from 'src/screens/OrderManagement/component/ActionComp';
import PaymentAmountComp from './PaymentAmountComp';
import ALL_TABS from '../constants';
import useBuyerDashboard from '../useBuyerDashboard';
import { useTheme } from '@mui/material/styles';
import { t } from 'i18next';
import { colors } from 'src/utils/theme';
import { ImageTextCellRenderer } from 'src/common/@the-source/molecules/Table/TableComponent/CellRendererComponent';
import AchCellRenderer from 'src/screens/Payment/component/AchCellRenderer';
import payment_constants from 'src/screens/Payment/constants';

interface DocumentConfig {
	key: string;
	name: string;
	visible: boolean;
	type: string;
	isFilterable: boolean;
	isSortable: boolean;
	filterType: string;
	filterParams?: any;
	filter?: any;
	action_cell_width?: string;
	width?: number;
}

type OutputObject = {
	headerName: string;
	field: string;
	resizable?: boolean;
	headerStyle?: {} | undefined;
	isVisible?: boolean;
	dtype: string;
	sortable?: boolean;
	filter?: any;
	filterParams?: any;
	editable?: boolean;
	cellStyle?: React.CSSProperties;
	width?: number;
	suppressMenu?: boolean;
	actions?: any;
	flex?: 1;
	pinned?: any;
	minWidth?: number;
	maxWidth?: number;
};

type TimeRange = 'today' | 'last_week' | 'last_30_days' | 'last_3_months' | 'last_6_months' | 'last_12_months' | 'all_time';

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
];

const BuyerTables = ({
	time_range,
	sales_rep_id,
	tab_value,
	set_toast,
	set_refetch,
}: {
	time_range: TimeRange;
	sales_rep_id: string;
	tab_value: string;
	set_toast?: any;
	set_refetch: any;
}) => {
	const default_ssrm_config = useSelector((state: any) => state.settings.default_ssrm_config);
	const [refetch, set_ref] = useState<boolean>(true);
	const [is_loading, set_is_loading] = useState<boolean>(true);
	const [total_rows, set_total_rows] = useState<any>(null);
	const [row_data, set_row_data] = useState<any>(null);
	const [active_tab, set_active_tab] = useState<any>('orders');
	const [facets, set_facets] = useState<any>(null);
	const [document_config, set_document_config] = useState<DocumentConfig[]>([]);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const permission = useSelector((state: any) => state?.login?.permissions);
	const can_edit = permission?.find((item: any) => item?.slug === PERMISSIONS?.edit_orders?.slug);
	const params = useParams();
	const { buyer_id } = params;
	const theme: any = useTheme();

	const handle_change = (value: String) => {
		if (active_tab === value) return;
		set_is_loading(true);
		set_active_tab(value);
	};

	const formattedDate = {
		today: time_range_list.today.data.value(),
		last_week: time_range_list.last_week.data.value(),
		last_30_days: time_range_list.last_30_days.data.value(),
		last_3_months: time_range_list.last_3_months.data.value(),
		last_6_months: time_range_list.last_6_months.data.value(),
		last_12_months: time_range_list.last_12_months.data.value(),
		all_time: time_range_list.all_time.data.value(),
	};

	const default_filters = useMemo(
		() => [
			(() => {
				if (sales_rep_id === '') {
					return {
						created_at_milliseconds: {
							filterType: 'number',
							type: 'greaterThan',
							filter: Math.floor(formattedDate[time_range]),
							filterTo: null,
						},
						buyer_id: {
							filterType: 'text',
							type: 'equals',
							filter: buyer_id,
							filterTo: null,
						},
						type: {
							filterType: 'set',
							values: ['order', 'quote'],
						},
					};
				} else {
					return {
						created_at_milliseconds: {
							filterType: 'number',
							type: 'greaterThan',
							filter: Math.floor(formattedDate[time_range]),
							filterTo: null,
						},
						created_by: {
							filterType: 'text',
							type: 'equals',
							filter: sales_rep_id,
							filterTo: null,
						},
						buyer_id: {
							filterType: 'text',
							type: 'equals',
							filter: buyer_id,
							filterTo: null,
						},
						type: {
							filterType: 'set',
							values: ['order', 'quote'],
						},
					};
				}
			})(),
			(() => {
				if (sales_rep_id !== '') {
					return {
						created_at_milliseconds: {
							filterType: 'number',
							type: 'greaterThan',
							filter: Math.floor(formattedDate[time_range]),
							filterTo: null,
						},
						buyer_id: {
							filterType: 'text',
							type: 'equals',
							filter: buyer_id,
							filterTo: null,
						},
						sales_rep_info: {
							filterType: 'set',
							values: [sales_rep_id],
						},
					};
				} else {
					return {
						created_at_milliseconds: {
							filterType: 'number',
							type: 'greaterThan',
							filter: Math.floor(formattedDate[time_range]),
							filterTo: null,
						},
						buyer_id: {
							filterType: 'text',
							type: 'equals',
							filter: buyer_id,
							filterTo: null,
						},
					};
				}
			})(),
			(() => {
				if (sales_rep_id !== '') {
					return {
						record_date_milliseconds: {
							filterType: 'number',
							type: 'greaterThan',
							filter: Math.floor(formattedDate[time_range]),
							filterTo: null,
						},
						sales_rep_info: {
							filterType: 'set',
							values: [sales_rep_id],
						},
						buyer_info: {
							filterType: 'set',
							values: [buyer_id],
						},
					};
				} else {
					return {
						record_date_milliseconds: {
							filterType: 'number',
							type: 'greaterThan',
							filter: Math.floor(formattedDate[time_range]),
							filterTo: null,
						},
						buyer_info: {
							filterType: 'set',
							values: [buyer_id],
						},
					};
				}
			})(),
			(() => {
				if (sales_rep_id !== '') {
					return {
						record_date_milliseconds: {
							filterType: 'number',
							type: 'greaterThan',
							filter: Math.floor(formattedDate[time_range]),
							filterTo: null,
						},
						sales_rep_info: {
							filterType: 'set',
							values: [sales_rep_id],
						},
						buyer_info: {
							filterType: 'set',
							values: [buyer_id],
						},
					};
				} else {
					return {
						record_date_milliseconds: {
							filterType: 'number',
							type: 'greaterThan',
							filter: Math.floor(formattedDate[time_range]),
							filterTo: null,
						},
						buyer_info: {
							filterType: 'set',
							values: [buyer_id],
						},
					};
				}
			})(),
		],
		[time_range, buyer_id, sales_rep_id],
	);

	const transformFilterModel = (filterModel: any) => {
		let updatedFilterModel = _.cloneDeep(filterModel);
		_.forEach(updatedFilterModel, (child, key) => {
			if (_.has(child, 'values') && _.isArray(child.values)) {
				updatedFilterModel[key].values = _.map(child.values, (value) => {
					if (value === 'converted to order') {
						return 'accepted';
					}
					return value === null ? '' : value;
				});
			}
			if (child?.filterType === 'set') {
				const values = child?.values?.map((value: any) => value ?? '') || [''];
				updatedFilterModel[key] = {
					filterType: 'set',
					values,
				};
			}
			if (child?.filterType === 'date') {
				const { dateFrom, dateTo, type } = child;
				const { from, to }: any = utils.getRange(dateFrom, dateTo, type);
				updatedFilterModel[key] = {
					filterType: 'number',
					type: 'inRange',
					filter: from * 1000,
					filterTo: to * 1000,
				};
			}
			if (child?.filterType === 'unixdate') {
				const { dateFrom, dateTo, type } = child;
				const { from, to }: any = utils.getRange(dateFrom, dateTo, type);
				updatedFilterModel[key] = {
					filterType: 'number',
					type: 'inRange',
					filter: from,
					filterTo: to,
				};
			}
		});

		return updatedFilterModel;
	};

	const transformData = (data: any, val: string) => {
		return data.map((item: any) => {
			let total_value_temp = 0;
			try {
				total_value_temp = parseFloat((Math.floor(item?.total_value * 100) / 100).toFixed(2));
			} catch {
				console.error('Unable to calculate the total value');
			}
			const getNameOrEmail = (firstName: string, lastName: string, email: string) => {
				if (firstName || lastName) {
					return `${firstName || ''} ${lastName || ''}`.trim();
				}
				return email;
			};
			let firstName = _.get(item, 'user_details.first_name');
			let lastName = _.get(item, 'user_details.last_name');
			let email = _.get(item, 'user_details.email');
			const name = getNameOrEmail(firstName, lastName, email);
			return {
				...item,
				table_type: val === 'payments' ? 'payment' : val === 'credits' ? 'credit' : 'invoice',
				total_value: total_value_temp,
				source: item?.source === 'wizshop' ? 'Website' : item?.source || '',
				name,
			};
		});
	};

	const get_default_sorting = (type: any) => {
		switch (type) {
			case 'payments':
				// return _.get(default_ssrm_config, 'sorting.payment_ssrm', []);
				return [];
			case 'invoices':
				return _.get(default_ssrm_config, 'sorting.invoice_ssrm', []);
			case 'credits':
				// return _.get(default_ssrm_config, 'sorting.credits_ssrm', []);
				return [];
			default:
				return _.get(default_ssrm_config, 'sorting.order_ssrm', []);
		}
	};

	const create_datasource = useCallback((default_filter: SSRMFilterModelDict, val: string) => {
		return {
			getRows(params: IServerSideGetRowsParams) {
				const default_sorting = get_default_sorting(val);
				const { startRow, endRow, filterModel, sortModel } = params.request;
				const transformedFilterModel = transformFilterModel(filterModel);
				const payload = {
					startRow,
					endRow,
					sortModel: _.isEmpty(sortModel) ? default_sorting : sortModel,
					filterModel: {
						...default_filter,
						...transformedFilterModel,
					},
				};
				const get_api: any = () => {
					switch (val) {
						case 'orders':
							return api_requests.order_listing.get_document_list;
						case 'invoices':
							return api_requests.buyer.get_invoices_ssrm;
						case 'payments':
							return api_requests.buyer.get_payments_ssrm;
						case 'credits':
							return api_requests.buyer.get_credits_ssrm;
					}
				};
				get_api()(payload as SSRMInput)
					.then((res: any) => {
						if (res.status === 200) {
							let data: any;
							if (val !== 'orders') data = res;
							else data = res?.data;
							const newData = transformData(data?.data, val);
							set_total_rows(data?.total);
							set_row_data(endRow);
							set_facets(data?.facet);
							if (endRow && endRow >= 10000) {
								set_toast({
									show: true,
									message: t('OrderManagement.OrderListing.ToastMessage', { type: val }),
									title: '',
									status: 'warning',
								});
							}
							if (_.isEmpty(sortModel) && default_sorting) {
								params.columnApi.applyColumnState({
									state: default_sorting,
									defaultState: { sort: default_sorting },
								});
							}
							params.success({
								rowData: newData as DocumentConfig[],
								rowCount: data?.total > 10000 ? 10000 : data?.total,
							});
						}
					})
					.catch((err: any) => {
						console.error(err);
						params.fail();
					});
			},
		};
	}, []);

	let active_tab_index = _.keys(ALL_TABS).indexOf(active_tab);

	const data_source = useMemo(
		() => create_datasource(default_filters[active_tab_index], active_tab),
		[create_datasource, default_filters[active_tab_index], active_tab, refetch],
	);

	function convertToNewStructure(inputArray: DocumentConfig[]): OutputObject[] {
		const handle_navigate_on_click = (params: any) => {
			if (params?.event && !should_handle_click(params?.event)) return;
			if (_.get(params, 'node.data.id') && _.get(params, 'node.data.type')) {
				let status = _.get(params, 'node.data.document_status');
				let get_document_status = utils.handle_get_status(status);

				if (!get_document_status && status === document?.DocumentStatus?.draft) {
					navigate(`${RouteNames.product.review.routing_path}${_.get(params, 'node.data.type')}/${_.get(params, 'node.data.id')}`);
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
							from: 'dashboard',
						},
					},
				);
				dispatch(show_document_alert(false));
			}
		};
		inputArray = inputArray.filter((item) => item.key !== 'buyer_details.name' && item.key !== 'buyer_info');
		const newArray: OutputObject[] = inputArray.map((item) => {
			let column_props = {};

			const formatValue = (val: any, key: string, constants: any) => {
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

			if (item?.key === 'record_date_milliseconds' || (active_tab === 'invoices' && item?.type === 'date')) {
				column_props = {
					format: 'DD/MM/YY hh:mm A',
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
							const formattedValue = formatValue(params.value, item.key, payment_status_constants);
							const count = params?.value?.doc_count;
							return count ? `${formattedValue} (${count})` : formattedValue;
						},
					},
				};
			}

			if (active_tab === ALL_TABS?.payments?.value) {
				if (item?.key === 'settlement_status_info') {
					column_props = {
						...column_props,
						cellRenderer: (params: any) => {
							const settlement_config =
								payment_constants.ssrm_constants.settlement_status[_.isEmpty(params?.value?.value) ? 'unknown' : params?.value?.value];
							return (
								<Chip textColor={settlement_config?.text_color} label={settlement_config?.label} bgColor={settlement_config?.bg_color} />
							);
						},
					};
				}

				if (item?.key === 'payment_method_info') {
					column_props = {
						...column_props,
						cellRenderer: (params: any) => {
							const payment_method_type = params?.data?.payment_method_type;
							const source = params?.data?.source;
							const sub_title = params?.data?.sub_title;
							if (
								(payment_method_type !== 'ach' && !_.isEmpty(payment_method_type)) ||
								(payment_method_type === 'ach' && source === 'manual')
							) {
								return <ImageTextCellRenderer valueFormatted={params?.value} value={params?.value} />;
							}
							if (payment_method_type === 'ach' && (source === 'ach' || !_.isEmpty(sub_title))) {
								return <AchCellRenderer value={params?.data?.sub_title} />;
							} else return '--';
						},
					};
				}
			}

			const should_navigate = item.name === 'Reference ID' && active_tab === 'orders';
			return {
				headerName: item.name,
				field: item.key,
				resizable: true,
				headerStyle: {},
				lockPinned: item.name === 'Reference ID',
				clickable: item.name === 'Reference ID',
				isVisible: item.visible,
				type: utils.handle_get_dtype(item?.name, item?.type),
				dtype: utils.handle_get_dtype(item?.name, item?.type),
				sortable: item?.isSortable,
				filter: item?.filter,
				hideFilter: !item?.isFilterable,
				width: item?.width || 200,
				minWidth: item?.width || 200,
				cellStyle: {
					width: `${item?.width || 200}px`,
					minWidth: `${item?.width || 200}px`,
				},
				hide: !item.visible,
				editable: false,
				unSortIcon: true,
				isHyperLink: should_navigate,
				onCellClicked: should_navigate
					? (params: any) => {
							handle_navigate_on_click(params);
					  }
					: '',
				...column_props,
			};
		});
		newArray.unshift(utils.create_serial_number_config());
		if (active_tab === 'orders' && can_edit?.toggle) {
			let actionColumn = utils.create_action_config(actions, handle_navigate_on_click);
			const action_cell_width = _.head(inputArray)?.action_cell_width || 120;
			actionColumn = {
				...actionColumn,
				cellStyle: {
					...actionColumn.cellStyle,
					width: `${action_cell_width}px`,
					minWidth: `${action_cell_width}px`,
				},
				width: action_cell_width,
				maxWidth: action_cell_width,
				headerStyle: {
					...actionColumn.headerStyle,
					width: `${action_cell_width}px`,
				},
				cellRenderer: ActionComp,
			};
			newArray.push(actionColumn);
		}
		if (active_tab !== 'orders') {
			const actionColumn = {
				headerName: '',
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
				refund_callback: () => {
					set_ref((prev: boolean) => !prev);
					set_refetch();
				},
				cellRenderer: PaymentActionComp,
				is_credits_drawer: active_tab === 'credits',
				cellRendererParams: {
					set_toast,
					refetch: () => set_ref((prev: boolean) => !prev),
				},
			};
			newArray.push(actionColumn);
		}
		if (newArray.length > 0) {
			_.set(newArray, '[0].flex', 1);
		}
		if (newArray.length > 1) {
			_.set(newArray, '[1].flex', 1);
		}
		return newArray;
	}

	useEffect(() => {
		const get_api: any = () => {
			switch (active_tab) {
				case 'orders':
					return api_requests.order_listing.get_document_config();
				case 'invoices':
					return api_requests.buyer.get_invoices_config();
				case 'payments':
					return api_requests.buyer.get_payments_config();
				case 'credits':
					return api_requests.buyer.get_credits_config();
			}
		};
		get_api()
			.then((res: any) => {
				if (_.get(res, 'status') === 200) {
					if (active_tab !== 'orders') {
						const data = Object.values(res).filter((column: any) => typeof column === 'object' && column.key);
						if (Array.isArray(data)) {
							set_document_config(data as DocumentConfig[]);
						} else {
							console.error('Invalid response format for columns_defs');
						}
					} else {
						let data: any = _.get(res, 'data');
						if (data) {
							const user_details = _.findIndex(data, { key: 'user_details.first_name' });
							if (user_details) {
								_.set(data, `[${user_details}].key`, 'name');
							}
							if (Array.isArray(data)) data = _.uniqBy(data, 'key');
							if (Array.isArray(data)) {
								set_document_config(data as DocumentConfig[]);
							}
						}
					}
				}
			})
			.catch((error: any) => {
				console.error(error);
			})
			.finally(() => set_is_loading(false));
	}, [active_tab, refetch]);

	useEffect(() => {
		if (tab_value) {
			set_is_loading(true);
			set_active_tab(tab_value);
		}
	}, [tab_value]);

	const get_show_tab = (tab_name: string) => {
		_.find(permission, (item) => item?.slug === 'view_payment_history')?.toggle;
		if (tab_name === ALL_TABS.credits.value) {
			return _.find(permission, (item) => item?.slug === 'view_credit_history')?.toggle;
		}
		if (tab_name === ALL_TABS.payments.value) {
			return _.find(permission, (item) => item?.slug === 'view_payment_history')?.toggle;
		}
		if (tab_name === ALL_TABS.invoices.value) {
			return _.find(permission, (item) => item?.slug === 'view_invoice')?.toggle;
		}
		return true;
	};

	const handle_get_active_tab = () => {
		let filter_tab_data = _.keys(ALL_TABS)?.filter((val) => get_show_tab(val));
		let active_tab_index = filter_tab_data?.indexOf(active_tab);
		return active_tab_index;
	};

	return (
		<Grid m={'10px 0px'}>
			<Tabs value={handle_get_active_tab()} aria-label='basic tabs example' sx={{ borderBottom: 1, borderColor: 'divider' }}>
				{_.map(ALL_TABS, (tab: any) => {
					const is_visible_tab = get_show_tab(tab?.value);

					if (!is_visible_tab) {
						return null;
					}

					return (
						<Tab
							sx={{ textTransform: 'unset' }}
							onClick={() => handle_change(tab?.value)}
							label={
								<CustomText
									type='H2'
									style={
										active_tab === tab?.value
											? { fontWeight: '800', color: 'rgba(22, 136, 95, 1)', borderBottom: 10 }
											: { fontWeight: '500', color: theme?.buyer_dashboard?.inactive_tab_color }
									}>
									{tab.text}
								</CustomText>
							}
						/>
					);
				})}
			</Tabs>
			<Grid mt={2} sx={{ position: 'relative' }}>
				{!is_loading ? (
					<React.Fragment>
						<Grid display={'flex'} alignItems={'center'} gap={1} mb={1}>
							<CustomText type='Body' color={colors.secondary_text}>
								{total_rows > 10000
									? t('OrderManagement.OrderListing.LimitShowing', { type: active_tab })
									: t('OrderManagement.OrderListing.Showing', { count: total_rows ?? 0 })}
							</CustomText>
							{total_rows > 10000 && (
								<Tooltip title={t('OrderManagement.OrderListing.ShowingTooltip')} placement='right' arrow>
									<div>
										<Icon iconName='IconInfoCircle' color={colors.secondary_text} />
									</div>
								</Tooltip>
							)}
						</Grid>
						<AgGridSSRMTableContainer
							showSWHeader={false}
							rowData={[]}
							totalRows={total_rows}
							endRows={row_data}
							columnDefs={convertToNewStructure(document_config)}
							dataSource={data_source}
							containerStyle={{ height: 'calc(100vh - 140px)' }}
							suppressFieldDotNotation={true}
						/>
						{total_rows === 0 && <EmptyTableComponent top={'120px'} height={'calc(100vh - 300px)'} />}
					</React.Fragment>
				) : (
					<TableSkeleton />
				)}
			</Grid>
		</Grid>
	);
};

export default BuyerTables;
