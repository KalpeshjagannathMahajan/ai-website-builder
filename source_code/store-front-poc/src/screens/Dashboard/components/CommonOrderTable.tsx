import { useCallback, useEffect, useMemo, useState } from 'react';
import { SSRMFilterModelDict, SSRMInput } from 'src/utils/api_requests/orderListing';
import { IServerSideGetRowsParams } from 'ag-grid-community';
import api_requests from 'src/utils/api_requests';
import { Grid, Icon, Tooltip } from 'src/common/@the-source/atoms';
import { AgGridSSRMTableContainer } from 'src/common/@the-source/molecules/Table/table';
import _ from 'lodash';
import RouteNames from 'src/utils/RouteNames';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { show_document_alert } from 'src/actions/document';
import { document, payment_status_constants } from 'src/screens/OrderManagement/mock/document';
import utils, { should_handle_click } from 'src/utils/utils';
import TableSkeleton from 'src/common/TableSkeleton';
import EmptyTableComponent from 'src/common/@the-source/EmptyTableComponent';
import { time_range_list } from 'src/common/TimeRange/helper';
import { useSelector } from 'react-redux';
import { PERMISSIONS } from 'src/casl/permissions';
import ActionComp from 'src/screens/OrderManagement/component/ActionComp';
import CustomText from 'src/common/@the-source/CustomText';
import { colors } from 'src/utils/theme';
import { t } from 'i18next';
import useCatalogActions from 'src/hooks/useCatalogActions';

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

interface DocumentConfig {
	action_cell_width?: string;
	width?: number;
	key: string;
	name: string;
	visible: boolean;
	type: string;
	isFilterable: boolean;
	isSortable: boolean;
	filterType: string;
	filterParams?: any;
	filter?: string;
}

type TimeRange = 'today' | 'last_week' | 'last_30_days' | 'last_3_months' | 'last_6_months' | 'last_12_months' | 'all_time';

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
];

const CommonOrderTable = ({
	time_range,
	buyer_id,
	sales_rep_id,
	from_dashboard = false,
	style,
	set_toast,
}: {
	time_range: TimeRange;
	buyer_id: string;
	sales_rep_id: string;
	from_dashboard: boolean;
	style?: any;
	set_toast?: any;
}) => {
	const default_ssrm_config = useSelector((state: any) => state.settings.default_ssrm_config);
	const [total_rows, set_total_rows] = useState<any>(null);
	const [summary, set_summary] = useState<any>(null);
	const [facets, set_facets] = useState<any>(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [row_data, set_row_data] = useState<any>(null);
	const [document_config, set_document_config] = useState<DocumentConfig[]>([]);
	const [is_loading, set_is_loading] = useState<boolean>(true);
	const permission = useSelector((state: any) => state?.login?.permissions);
	const can_edit = permission?.find((item: any) => item?.slug === PERMISSIONS?.edit_orders?.slug);
	const { handle_reset_catalog_mode } = useCatalogActions();

	useEffect(() => {
		api_requests.order_listing
			.get_document_config()
			.then((res) => {
				if (_.get(res, 'status') === 200) {
					let data: any = _.get(res, 'data');
					if (data) {
						const user_details = _.findIndex(data, { key: 'user_details.attributes.name' });
						if (user_details) {
							_.set(data, `[${user_details}].key`, 'name');
						}
						if (Array.isArray(data)) data = _.uniqBy(data, 'key');
						if (Array.isArray(data)) {
							set_document_config(data as DocumentConfig[]);
						}
					}
					set_is_loading(false);
				}
			})
			.catch((error) => {
				set_is_loading(false);
				console.error(error);
			});
	}, []);

	const transformData = (data: any) => {
		return data.map((item: any) => {
			let total_value_temp = 0;
			try {
				total_value_temp = parseFloat((Math.floor(item?.total_value * 100) / 100).toFixed(2));
			} catch {
				console.error('Unable to calculate the total value');
			}
			function getNameOrEmail(firstName: string, lastName: string, email: string) {
				if (firstName || lastName) {
					return `${firstName || ''} ${lastName || ''}`.trim();
				}
				return email;
			}
			let firstName = _.get(item, 'user_details.first_name');
			let lastName = _.get(item, 'user_details.last_name');
			let email = _.get(item, 'user_details.email');
			const name = getNameOrEmail(firstName, lastName, email);
			const payment_status = payment_status_constants[_.get(item, 'payment_status')]?.label;
			return {
				...item,
				total_value: total_value_temp,
				name,
				source: item?.source === 'wizshop' ? 'Website' : item?.source || '',
				payment_status,
			};
		});
	};

	function convertToNewStructure(inputArray: DocumentConfig[]): OutputObject[] {
		const handle_navigate_on_click = (params: any) => {
			// check if the click is cmd or ctrl click
			if (params?.event && !should_handle_click(params?.event)) return;

			if (_.get(params, 'node.data.id') && _.get(params, 'node.data.type')) {
				if (_.get(params, 'node.data.type') === 'invoice') {
					let invoice_url = _.get(params, 'node.data.invoice_url');
					invoice_url && window.open(invoice_url, '_blank');
					return;
				}

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
				handle_reset_catalog_mode();
			}
		};

		if (!from_dashboard) inputArray = inputArray.filter((item) => item.key !== 'buyer_details.name');

		const newArray: OutputObject[] = inputArray.map((item) => {
			let column_props = {};

			const formatValue = (value: any, key: string, constants: any) => {
				if (!value || value.key === '') {
					return '(Blanks)';
				}
				if (value.key === 'accepted') {
					return 'converted to order';
				}
				if (key === 'payment_status' && constants[value.key]) {
					return `${constants[value.key].label}`;
				}
				return value?.label || value.key;
			};

			if (item?.key === 'buyer_details.name') {
				column_props = {
					headerName: 'Customer',
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

			return {
				headerName: item.name,
				field: item.key,
				resizable: true,
				headerStyle: {},
				unSortIcon: true,
				hide: !item.visible,
				lockPinned: item.name === 'Reference ID',
				clickable: item.name === 'Reference ID',
				isVisible: item.visible,
				type: utils.handle_get_dtype(item?.name, item?.type),
				dtype: utils.handle_get_dtype(item?.name, item?.type),
				filter: item?.filter,
				filterType: item.filterType,
				hideFilter: !item?.isFilterable,
				width: item?.width || 200,
				minWidth: item?.width || 200,
				cellStyle: {
					width: `${item?.width || 200}px`,
					minWidth: `${item?.width || 200}px`,
				},
				editable: false,
				isHyperLink: item?.name === 'Reference ID',
				onCellClicked:
					item.name === 'Reference ID'
						? (params: any) => {
								handle_reset_catalog_mode();
								handle_navigate_on_click(params);
						  }
						: '',
				...column_props,
			};
		});
		newArray.unshift(utils.create_serial_number_config());
		if (can_edit?.toggle) {
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
		if (newArray.length > 0) {
			_.set(newArray, '[0].flex', 1);
		}
		if (newArray.length > 1) {
			_.set(newArray, '[1].flex', 1);
		}
		return newArray;
	}

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
	const createDataSource = useCallback((default_filter: SSRMFilterModelDict) => {
		return {
			getRows(params: IServerSideGetRowsParams) {
				const default_sorting = _.get(default_ssrm_config, 'sorting.order_ssrm', []);
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
				api_requests.order_listing
					.get_document_list(payload as SSRMInput)
					.then((res) => {
						if (_.get(res, 'status') === 200) {
							const data = _.get(res, 'data.data');
							const total = _.get(res, 'data.total') || 0;
							const smry = _.get(res, 'data.summary');
							const fct = _.get(res, 'data.facet');
							const newData = transformData(data);
							set_total_rows(total);
							set_row_data(endRow);
							set_summary(smry);
							set_facets(fct);
							if (_.isEmpty(sortModel) && default_sorting) {
								params.columnApi.applyColumnState({
									state: default_sorting,
									defaultState: { sort: default_sorting },
								});
							}
							if (endRow && endRow >= 10000) {
								set_toast({
									show: true,
									message: t('OrderManagement.OrderListing.ToastMessage', { type: 'orders/quotes' }),
									title: '',
									status: 'warning',
								});
							}
							if (data) {
								params.success({ rowData: newData as DocumentConfig[], rowCount: total > 10000 ? 10000 : total });
							}
						}
					})
					.catch((error) => {
						console.error(error);
						params.fail();
					});
			},
		};
	}, []);

	// const getDateInSeconds = (daysAgo: number) => {
	// 	const currentDate = (new Date(new Date().setHours(0, 0, 0, 0) - (24 * 60 * 60 * 1000 * (daysAgo - 1)))).getTime() / 1000;
	// 	return currentDate;
	// };

	const formattedDate = {
		today: time_range_list.today.data.value(),
		last_week: time_range_list.last_week.data.value(),
		last_30_days: time_range_list.last_30_days.data.value(),
		last_3_months: time_range_list.last_3_months.data.value(),
		last_6_months: time_range_list.last_6_months.data.value(),
		last_12_months: time_range_list.last_12_months.data.value(),
		all_time: time_range_list.all_time.data.value(),
	};

	const default_filters = useMemo(() => {
		if (buyer_id === '' && sales_rep_id === '') {
			return {
				created_at_milliseconds: {
					filterType: 'number',
					type: 'greaterThan',
					filter: Math.floor(formattedDate[time_range]),
					filterTo: null,
				},
			};
		} else if (buyer_id !== '' && sales_rep_id === '') {
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
		} else if (buyer_id === '' && sales_rep_id !== '') {
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
			};
		}
	}, [time_range, buyer_id, sales_rep_id]);

	const dataSource = useMemo(() => createDataSource(default_filters), [createDataSource, default_filters]);

	return (
		<Grid mt={2.4} sx={{ position: 'relative', ...style }}>
			{!is_loading ? (
				<>
					<Grid display={'flex'} alignItems={'center'} gap={1} mb={1}>
						<CustomText type='Body' color={colors.secondary_text}>
							{total_rows > 10000
								? t('OrderManagement.OrderListing.LimitShowing', { type: 'orders/quotes' })
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
						rowData={[]}
						columnDefs={convertToNewStructure(document_config)}
						dataSource={dataSource}
						totalRows={total_rows}
						summary={summary}
						endRows={row_data}
						column_id={'total_value'}
						customRowName='Total Rows'
						containerStyle={{ height: 'calc(100vh - 150px)' }}
						suppressFieldDotNotation={true}
					/>
					{total_rows === 0 && <EmptyTableComponent top={'120px'} height={'calc(100vh - 300px)'} />}
				</>
			) : (
				<TableSkeleton />
			)}
		</Grid>
	);
};

export default CommonOrderTable;
