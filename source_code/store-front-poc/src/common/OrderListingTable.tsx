import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Grid } from 'src/common/@the-source/atoms';
import api_requests from 'src/utils/api_requests';
import { SSRMFilterModelDict, SSRMInput, SSRMSortModel } from 'src/utils/api_requests/orderListing';
import { AgGridSSRMTableContainer } from 'src/common/@the-source/molecules/Table';
import { IServerSideGetRowsParams } from 'ag-grid-community';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
	// {
	// 	name: 'Info',
	// 	action: 'more_info',
	// 	icon: 'IconDotsVertical',
	// 	key: 'more_info',
	// },
];

interface DocumentConfig {
	key: string;
	name: string;
	visible: boolean;
	type: string;
	isFilterable: boolean;
	isSortable: boolean;
	filterType: string;
}

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

function convertToNewStructure(inputArray: DocumentConfig[], navigate: NavigateFunction): OutputObject[] {
	const newArray: OutputObject[] = inputArray.map((item) => ({
		headerName: item.name,
		field: item.key,
		resizable: true,
		headerStyle: {},
		isVisible: item.visible,
		dtype: item.type,
		unSortIcon: true,
		sortable: item.isSortable && !item.key.includes('.'),
		filterParams: {
			buttons: ['reset', 'apply'],
			maxNumConditions: 1,
			values:
				item.type === 'status' ? ['accepted', 'draft', 'sent', 'submitted', 'confirmed', 'converted', 'cancelled', 'rejected'] : undefined,
		},
		minWidth: 200,
		editable: false,
	}));
	newArray.push({
		headerName: 'Action',
		field: 'action',
		editable: false,
		filter: false,
		dtype: 'action',
		pinned: 'right',
		cellStyle: {
			border: 'none',
			borderRadius: '0px',
			background: 'transparent',
			width: '120px',
			justifyContent: 'center',
			alignItems: 'center',
			minWidth: '120px',
		},
		headerStyle: {
			width: '120px',
		},
		width: 120,
		minWidth: 120,
		suppressMenu: true,
		actions: {
			actions: actions.map((action) => ({
				...action,
				onClick: (params: any) => {
					console.log(`${action.name} clicked for row`, params);
					if (_.get(params, 'data.id') && _.get(params, 'data.type')) {
						navigate(`${RouteNames.product.review.routing_path}${_.get(params, 'data.type')}/${_.get(params, 'data.id')}`);
					}
				},
			})),
			type: 'action',
		},
	});
	if (newArray.length > 0) {
		_.set(newArray, '[0].flex', 1);
	}
	if (newArray.length > 1) {
		_.set(newArray, '[1].flex', 1);
	}
	return newArray;
}

// Example usage

const default_filters: SSRMFilterModelDict[] = [
	{},
	{
		type: {
			filterType: 'text',
			type: 'equals',
			filter: 'order',
			filterTo: null,
		},
	},
	{
		type: {
			filterType: 'text',
			type: 'equals',
			filter: 'quote',
			filterTo: null,
		},
	},
	{
		document_status: {
			filterType: 'text',
			type: 'equals',
			filter: 'draft',
			filterTo: null,
		},
	},
];

const create_datasource = (filter_options: SSRMFilterModelDict, sort_options: SSRMSortModel[]) => {
	return {
		getRows(params: IServerSideGetRowsParams) {
			const { startRow, endRow, filterModel, sortModel } = params.request;
			const payload = {
				startRow,
				endRow,
				sortModel: [...sortModel, ...sort_options],
				filterModel: {
					...filter_options,
					...filterModel,
				},
			};
			api_requests.order_listing
				.get_document_list(payload as SSRMInput)
				.then((res) => {
					if (_.get(res, 'status') === 200) {
						const data = _.get(res, 'data.data');
						const total = _.get(res, 'data.total');
						if (data) {
							params.success({ rowData: data as DocumentConfig[], rowCount: total });
						}
					}
				})
				.catch((error) => {
					console.log(error);
					params.fail();
				});
		},
	};
};

interface OrderListingProps {
	value: number;
	sort_options: SSRMSortModel[];
	filter_options: SSRMFilterModelDict;
}

const OrderListing = ({ value, sort_options = [] as SSRMSortModel[], filter_options = {} }: OrderListingProps) => {
	const navigate = useNavigate();
	const [document_config, set_document_config] = useState<DocumentConfig[]>([]);

	const all_filters = {
		...default_filters[value],
		...filter_options,
	};

	console.log({ all_filters });

	const data_source = create_datasource(all_filters, sort_options);

	useEffect(() => {
		api_requests.order_listing
			.get_document_config()
			.then((res) => {
				if (_.get(res, 'status') === 200) {
					let data = _.get(res, 'data');
					if (data) {
						const status = _.findIndex(data, { key: 'document_status' });
						if (status) {
							_.set(data, `[${status}].type`, 'status');
							_.set(data, `[${status}].dtype`, 'set');
							_.set(data, `[${status}].filter`, 'agSetColumnFilter');
							_.set(data, `[${status}].filterParams`, ['draft', 'sent', 'pending', 'confirmed', 'converted', 'cancelled', 'rejected']);
							_.set(data, `[${status}].isFilterable`, true);
						}
						const created_at = _.findIndex(data, { key: 'created_at' });
						if (created_at) _.set(data, `[${created_at}].type`, 'unixdate');
						if (Array.isArray(data)) data = _.uniqBy(data, 'key');
						if (Array.isArray(data)) {
							set_document_config(data as DocumentConfig[]);
						}
					}
				}
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	useEffect(() => {}, [document_config]);

	return (
		<React.Fragment>
			<Grid mt={2}>
				<AgGridSSRMTableContainer
					showSWHeader={false}
					rowData={[]}
					columnDefs={convertToNewStructure(document_config, navigate)}
					dataSource={data_source}
					containerStyle={{ height: 'calc(100vh - 140px)' }}
					suppressFieldDotNotation={true}
				/>
			</Grid>
		</React.Fragment>
	);
};

// const filter_options = useMemo(() => {
// 		const currentTimestamp = Math.floor(Date.now());
// 		let filters = {}
// 		const buyer_filter =  {
// 			filterType: 'text',
// 			type: 'equals',
// 			filter: "ffd07fab-ddfd-4adc-bf74-a445646e494d",
// 			filterTo: null,
// 		}

// 		const time_range_filter = {
// 			filterType: 'string',
// 			type: 'equals',
// 			filter: 0,
// 			filterTo: null,
// 		}

// 		if(buyer_data.id !== "all_buyers") {
// 			filters.buyer_id = buyer_filter
// 		}
// 		return filters
// 		// if(time_range.id !== "all_time") {
// 		// 	filters.created_at = time_range_filter
// 		// }

// 	});

export default OrderListing;
