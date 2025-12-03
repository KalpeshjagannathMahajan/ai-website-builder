import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SSRMFilterModelDict, SSRMInput } from 'src/utils/api_requests/orderListing';
import { IServerSideGetRowsParams } from 'ag-grid-community';
import api_requests from 'src/utils/api_requests';
import { Grid } from 'src/common/@the-source/atoms';
import { AgGridSSRMTableContainer } from 'src/common/@the-source/molecules/Table/table';
import _ from 'lodash';
import RouteNames from 'src/utils/RouteNames';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { show_document_alert } from 'src/actions/document';
import { document } from 'src/screens/OrderManagement/mock/document';
import utils from 'src/utils/utils';
import TableSkeleton from 'src/common/TableSkeleton';
import EmptyTableComponent from 'src/common/@the-source/EmptyTableComponent';
import { time_range_list } from 'src/common/TimeRange/helper';
import { useSelector } from 'react-redux';
import { PERMISSIONS } from 'src/casl/permissions';

type OutputObject = {
	headerName: string;
	field: string;
	resizable?: boolean;
	headerStyle?: {} | undefined;
	isVisible?: boolean;
	dtype: string;
	sortable?: boolean;
	filter?: boolean;
	filterParams?: {
		buttons: string[];
		maxNumConditions?: number;
		values?: string[];
	};
	editable?: boolean;
	cellStyle?: React.CSSProperties;
	width?: number;
	suppressMenu?: boolean;
	actions?: any;
	flex?: 1;
	pinned?: any;
	minWidth?: number;
};

interface DocumentConfig {
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

function convertToNewStructure(inputArray: DocumentConfig[], navigate: NavigateFunction, dispatch: any, can_edit: any): OutputObject[] {
	const handle_navigate_on_click = (params: any) => {
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

	const newArray: OutputObject[] = inputArray.map((item) => {
		let column_props = {};

		if (item?.key === 'buyer_details.name') {
			column_props = {
				headerName: 'Customer',
			};
		}

		if (item?.key === 'updated_at') {
			column_props = {
				sortable: true,
				sort: 'desc',
			};
		}

		return {
			headerName: item.name,
			field: item.key,
			resizable: true,
			headerStyle: {},
			unSortIcon: true,
			lockPinned: item.name === 'Reference ID',
			clickable: item.name === 'Reference ID',
			isVisible: item.visible,
			dtype: item.name === 'Order value' ? 'currency' : item.name === 'Reference ID' ? 'imageText2' : item.type,
			// sortable: item.name !== 'Buyer Name',
			filter: item?.filter,
			hideFilter: item.name === 'Order value',
			filterParams: item?.filterParams ?? {
				buttons: ['reset', 'apply'],
				maxNumConditions: 1,
				values:
					item.type === 'status'
						? ['accepted', 'draft', 'sent', 'submitted', 'confirmed', 'converted', 'cancelled', 'rejected']
						: undefined,
			},
			minWidth: 200,
			editable: false,
			onCellClicked:
				item.name === 'Reference ID'
					? (params: any) => {
							handle_navigate_on_click(params);
					  }
					: '',
			...column_props,
		};
	});
	newArray.splice(1, 0, {
		headerName: 'Type',
		field: 'type',
		headerStyle: {},
		cellStyle: {},
		dtype: 'tags',
		editable: false,
		flex: 1,
		minWidth: 200,
	});
	newArray.unshift(utils.create_serial_number_config());
	{
		can_edit?.toggle && newArray.push(utils.create_action_config(actions, handle_navigate_on_click));
	}
	if (newArray.length > 0) {
		_.set(newArray, '[0].flex', 1);
	}
	if (newArray.length > 1) {
		_.set(newArray, '[1].flex', 1);
	}
	return newArray;
}

const OrderTable = ({ time_range, buyer_id, sales_rep_id }: { time_range: TimeRange; buyer_id: string; sales_rep_id: string }) => {
	const [total_rows, set_total_rows] = useState<any>(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [row_data, set_row_data] = useState<any>(null);
	const [document_config, set_document_config] = useState<DocumentConfig[]>([]);
	const [is_loading, set_is_loading] = useState<boolean>(true);
	const permission = useSelector((state: any) => state?.login?.permissions);
	const can_edit = permission?.find((item: any) => item?.slug === PERMISSIONS?.edit_orders?.slug);

	useEffect(() => {
		api_requests.order_listing
			.get_document_config()
			.then((res) => {
				if (_.get(res, 'status') === 200) {
					let data: any = _.get(res, 'data');
					if (data) {
						const status = _.findIndex(data, { key: 'document_status' });
						if (status) {
							_.set(data, `[${status}].type`, 'status');
							_.set(data, `[${status}].dtype`, 'set');
							_.set(data, `[${status}].filter`, 'agSetColumnFilter');
							_.set(data, `[${status}].filterParams`, ['draft', 'sent', 'pending', 'confirmed', 'converted', 'cancelled', 'rejected']);
							_.set(data, `[${status}].isFilterable`, true);
						}
						const user_details = _.findIndex(data, { key: 'user_details.attributes.name' });
						if (user_details) {
							_.set(data, `[${user_details}].key`, 'name');
						}
						const created_at = _.findIndex(data, { key: 'created_at' });
						if (created_at) _.set(data, `[${created_at}].type`, 'unixdate');
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
			return {
				...item,
				total_value: total_value_temp,
				name,
			};
		});
	};
	const createDataSource = useCallback((default_filter: SSRMFilterModelDict) => {
		return {
			getRows(params: IServerSideGetRowsParams) {
				const { startRow, endRow, filterModel, sortModel } = params.request;
				const payload = {
					startRow,
					endRow,
					sortModel,
					filterModel: {
						...default_filter,
						...filterModel,
					},
				};
				api_requests.order_listing
					.get_document_list(payload as SSRMInput)
					.then((res) => {
						if (_.get(res, 'status') === 200) {
							const data = _.get(res, 'data.data');
							const total = _.get(res, 'data.total');
							const newData = transformData(data);
							set_total_rows(total);
							set_row_data(endRow);
							if (data) {
								params.success({ rowData: newData as DocumentConfig[], rowCount: total });
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
		<Grid mt={2} sx={{ position: 'relative' }}>
			{!is_loading ? (
				<React.Fragment>
					<AgGridSSRMTableContainer
						rowData={[]}
						columnDefs={convertToNewStructure(document_config, navigate, dispatch, can_edit)}
						dataSource={dataSource}
						totalRows={total_rows}
						endRows={row_data}
						column_id={'total_value'}
						customRowName='Total Rows'
						containerStyle={{ height: 'calc(100vh - 140px)' }}
						suppressFieldDotNotation={true}
					/>
					{total_rows === 0 && <EmptyTableComponent top={'83px'} height={'calc(100vh - 275px)'} />}
				</React.Fragment>
			) : (
				<TableSkeleton />
			)}
		</Grid>
	);
};

export default OrderTable;
