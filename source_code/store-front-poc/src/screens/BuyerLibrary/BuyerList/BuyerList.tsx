import { AgGridSSRMTableContainer } from 'src/common/@the-source/molecules/Table';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import api_requests from 'src/utils/api_requests';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import RouteNames from 'src/utils/RouteNames';
import { updateBreadcrumbs } from 'src/actions/topbar';
import _ from 'lodash';
import utils, { get_buyer_navigation_url, should_handle_click } from 'src/utils/utils';
import TableSkeleton from 'src/common/TableSkeleton';
import EmptyTableComponent from 'src/common/@the-source/EmptyTableComponent';
import { Grid, Icon, Tooltip } from 'src/common/@the-source/atoms';
import { useSelector } from 'react-redux';
import { PERMISSIONS } from 'src/casl/permissions';
import React from 'react';
import constants from 'src/utils/constants';
import CustomText from 'src/common/@the-source/CustomText';
import { colors } from 'src/utils/theme';
import { t } from 'i18next';
import CustomToast from 'src/common/CustomToast';
import { Box, Button } from '@mui/material';
import useStyles from '../styles';
import { get_field_of_session_storage_item, get_value_from_current_url, remove_field_of_session_storage_item } from 'src/utils/common';
import { SECTIONS } from '../constants';
import useCatalogActions from 'src/hooks/useCatalogActions';

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
];

interface DocumentConfig {
	filterParams: any;
	dtype: string;
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

const default_filters = {};

// const default_sort = [{ sort: 'desc', colId: 'created_at_milliseconds' }];

const handle_format_address = (addresses: any) => {
	if (!_.isEmpty(addresses)) {
		const billing_address = _.find(addresses, { type: 'billing' }) || addresses[0];
		const { city, state, country } = billing_address;
		const formatted_address = `${city}, ${state}, ${country}`;
		return formatted_address;
	}
	return '';
};

const transformData = (data: any) => {
	return data.map((item: any) => {
		return {
			...item,
			created_at_milliseconds: item?.created_at_milliseconds / 1000,
			updated_at_milliseconds: item?.updated_at_milliseconds / 1000,
			region: handle_format_address(item?.addresses),
		};
	});
};

const BuyerListGrid = ({ showCheckbox, showActionItems = true, onSelectionChanged, checkedRows, setCheckedRows, preSelectedRows }: any) => {
	const value = SECTIONS.buyer_list;

	const classes = useStyles();
	const [columns_defs, set_columns_defs] = useState<any[]>([]);
	const [total_rows, set_total_rows] = useState(0);
	const [summary, set_summary] = useState<any>(null);
	const [is_loading, set_is_loading] = useState<boolean>(true);
	const [row_data, set_row_data] = useState<any>(null);
	const [facets, set_facets] = useState<any>(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();
	const [search_params, set_search_params] = useSearchParams(); // eslint-disable-line @typescript-eslint/no-unused-vars
	const [count_loading, set_count_loading] = useState(true);
	const [toast, set_toast] = useState({ show: false, message: '', title: '', status: '' });
	const default_ssrm_config = useSelector((state: any) => state.settings.default_ssrm_config);
	const default_sort = _.get(default_ssrm_config, 'sorting.customer_ssrm', []);
	const permissions = useSelector((state: any) => state?.login?.permissions);
	const view_buyer = permissions.find((item: any) => item.slug === PERMISSIONS?.view_buyers.slug);
	const [is_filter_active, set_is_filter_active] = useState(false);
	const [grid_api, set_grid_api] = useState<any>(null);
	const { handle_reset_catalog_mode } = useCatalogActions();

	const breadCrumbList = [
		{
			id: 1,
			linkTitle: 'Dashboard',
			link: RouteNames.dashboard.path,
		},
		{
			id: 2,
			linkTitle: 'Customer',
			link: `${RouteNames.buyer_library.buyer_list.path}`,
		},
	];

	function convertToNewStructure(inputArray: DocumentConfig[]): OutputObject[] {
		const newArray: OutputObject[] = inputArray.map((item) => {
			let column_props = {};
			if (item?.key === 'company_name') {
				column_props = {
					headerName: 'Customer',
				};
			}
			if (item.type === 'multiselect') {
				column_props = {
					filterParams: {
						...item?.filterParams,
						values: facets?.[item.key],
						keyCreator: (params: any) => params?.value?.value,
						valueFormatter: (params: any) => `${params?.value?.label} (${params?.value?.doc_count})`,
					},
				};
			}

			return {
				...item,
				headerName: item.name === 'Carts' ? 'Open carts' : item.name,
				field: item.key,
				resizable: true,
				headerStyle: {},
				hide: !item.visible,
				unSortIcon: true,
				clickable: item.name === 'Customer Name',
				menuTabs: item.name === 'Customer Name' ? [] : undefined,
				lockPinned: item.name === 'Customer Name',
				lockPosition: item.name === 'Customer Name',
				dtype: item.name === 'Carts' ? 'tags2' : item.type,
				type: item.name === 'Carts' ? 'tags2' : item.type,
				sortable: item.isSortable,
				// hideFilter: item.name === 'Sales rep' ? true : !item.isFilterable,
				hideFilter: !item.isFilterable,
				minWidth: 200,
				editable: false,
				...column_props,
			};
		});

		if (newArray.length > 0) {
			_.set(newArray, '[0].flex', 1);
		}
		if (newArray.length > 1) {
			_.set(newArray, '[1].flex', 1);
		}
		return newArray;
	}

	const transformFilterModel = (filterModel: any) => {
		const new_filters = _.mapValues(filterModel, (item) => {
			if (item?.filterType === 'date' || item?.filterType === 'unixdate') {
				const { dateFrom, dateTo, type } = item;
				const { from, to } = utils.getRange(dateFrom, dateTo, type);
				// const today = dayjs().unix();
				return {
					filterType: 'number',
					type: 'inRange',
					filter: from * 1000, // Assuming conversion to milliseconds timestamp
					filterTo: to * 1000,
				};
			} else if (item?.filterType === 'set') {
				const values = item?.values?.map((data: any) => data ?? '') || [''];
				return {
					filterType: 'set',
					values,
				};
			} else {
				return item;
			}
		});

		return new_filters;
	};
	let isFirstDataRender = true;

	const createDataSource = () => {
		return {
			getRows(params: any) {
				set_count_loading(true);
				let paramsData: any = sessionStorage.getItem('customer_params_data');
				let filter = '';
				if (typeof paramsData === 'string') {
					try {
						paramsData = JSON.parse(paramsData);
						filter = paramsData[value];
					} catch (err) {}
				}
				const urlParams = new URLSearchParams(window.location.search);
				const storedParams = new URLSearchParams(filter);
				const filtersParam = (get_value_from_current_url() === value ? urlParams.get('filter') : false) || storedParams.get('filter') || '';

				const paramFiltering = utils.parse_and_check_json(filtersParam);
				const { startRow, endRow, filterModel, sortModel } = params.request;

				const hasOrderSort = sortModel?.length > 0;

				const finalSortModel = hasOrderSort ? sortModel : default_sort;

				const transformedFilterModel = transformFilterModel(isFirstDataRender ? { ...paramFiltering, ...filterModel } : filterModel);

				const payload = {
					startRow,
					endRow,
					sortModel: finalSortModel,
					filterModel: {
						...default_filters,
						...transformedFilterModel,
					},
				};

				if (!_.isEmpty(filter)) {
					set_is_filter_active(true);
				}

				if (get_value_from_current_url() === value) {
					if (!_.isEmpty(transformedFilterModel)) {
						urlParams.set('filter', JSON.stringify(transformedFilterModel));
						set_is_filter_active(true);
					} else {
						urlParams.delete('filter');
						set_is_filter_active(false);
					}
					if (_.isEmpty(sortModel) && default_sort) {
						params.columnApi.applyColumnState({
							state: default_sort,
							defaultState: { sort: default_sort },
						});
					}

					window.history.pushState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
					try {
						if (!paramsData || typeof paramsData !== 'object') {
							paramsData = {};
						}
						paramsData[value] = urlParams.toString();
						sessionStorage.setItem('customer_params_data', JSON.stringify(paramsData));
					} catch (err) {}
				}

				api_requests.buyer
					.get_ssrm_table(payload)
					.then((response: any) => {
						const { data } = response;
						set_total_rows(data?.total);
						const newData = transformData(data?.data);
						set_row_data(endRow);
						set_summary(data?.summary);
						set_facets(data?.facet);
						if (endRow >= 10000) {
							set_toast({
								show: true,
								message: t('OrderManagement.OrderListing.ToastMessage', { type: 'customers' }),
								title: '',
								status: 'warning',
							});
						}
						params.success({
							rowData: newData,
							rowCount: data?.total > 10000 ? 10000 : data?.total,
							startRow,
							endRow,
						});
						set_count_loading(false);
						isFirstDataRender = false;
					})
					.catch((error) => {
						console.error(error);
						params.fail();
						isFirstDataRender = false;
						set_count_loading(false);
					});
			},
		};
	};

	const data_source = useMemo(() => createDataSource(), []);

	useEffect(() => {
		api_requests.buyer
			.get_ssrm_config()
			.then((res: any) => {
				const data = Object.values(res).filter((column: any) => typeof column === 'object' && column.key);
				if (Array.isArray(data)) {
					set_columns_defs(data);
				} else {
					console.error('Invalid response format for columns_defs');
				}
				set_is_loading(false);
			})
			.catch((error) => {
				console.error(error);
				set_is_loading(false);
			});
	}, []);

	const getRowNodeId = (data: any) => {
		return data?.data?.id;
	};

	const handleSelectionChanged = useCallback(
		(event: any) => {
			const selectedNodes = event.api.getSelectedNodes();
			const selectedIds = selectedNodes.map((node: any) => node.data.id);
			setCheckedRows(selectedIds);

			if (onSelectionChanged) {
				onSelectionChanged(event);
			}
		},
		[onSelectionChanged, setCheckedRows],
	);

	const getBuyerNameColumn = (column: any) => {
		return {
			...column,
			flex: 1,
			isHyperLink: true,
			onCellClicked: (params: any) => {
				if (!should_handle_click(params?.event)) return;
				if (get_value_from_current_url() === value) {
					const url_to_navigate = get_buyer_navigation_url(params?.data?.id, view_buyer?.toggle);
					handle_reset_catalog_mode();
					navigate(url_to_navigate);
				}
			},
			hasViewPermission: view_buyer?.toggle,
		};
	};

	const columnData = columns_defs?.map((column: any) => {
		if (column?.key === 'company_name') {
			return getBuyerNameColumn(column);
		}
		return {
			...column,
			flex: 1,
		};
	});

	const handle_navigate_on_click = (params: any) => {
		if (params?.event && !should_handle_click(params?.event)) return;
		handle_reset_catalog_mode();
		navigate(`${RouteNames.buyer_library.edit_buyer.routing_path}/${params?.node?.data?.id}`);
	};

	const handle_clear_filter = () => {
		if (is_filter_active) {
			search_params.delete('filter');
			window.history.pushState({}, '', `${window.location.pathname}?${search_params.toString()}`);
			remove_field_of_session_storage_item('customer_params_data', value);
			grid_api?.api?.setFilterModel(null);
			grid_api?.api?.onFilterChanged();
		}
	};

	const columnsDefs = [
		...(showCheckbox
			? [
					{
						headerCheckboxSelection: false,
						checkboxSelection: (params: any) => {
							return !preSelectedRows.includes(params.data.id);
						},
						lockPinned: true,
						lockPosition: true,
						resizable: false,
						showDisabledCheckboxes: true,
						unSortIcon: true,
						width: 50,
						minWidth: 50,
						cellStyle: {
							textAlign: 'center',
							width: 100,
							borderRadius: '0px',
							background: 'transparent',
							borderWidth: '0px 0px 0px 1px',
							borderColor: '#ddd4d1',
						},
						suppressSizeToFit: true,
						pinned: 'left',
					},
					{ ...utils.create_serial_number_config() },
			  ]
			: [{ ...utils.create_serial_number_config() }]),
		...convertToNewStructure(columnData),
		...(showActionItems ? [utils.create_action_config(actions, handle_navigate_on_click, '', constants.BUYER_LIST_KEY)] : []), // passing empty string as this method accpets 4th argument as navigation key
	];

	const gridReady = useCallback(
		(params: any) => {
			let paramsData: any = get_field_of_session_storage_item('customer_params_data', value);
			let filter = paramsData ?? '';
			set_grid_api(params);
			const urlParams = new URLSearchParams(window.location.search);
			const filtersParam =
				(get_value_from_current_url() === value && urlParams.get('filter') ? urlParams.get('filter') : false) ||
				new URLSearchParams(filter).get('filter') ||
				'';
			const paramFiltering = utils.parse_and_check_json(filtersParam);
			params.api!.setServerSideDatasource(data_source);
			if (paramFiltering) params.api.setFilterModel(paramFiltering);
			setTimeout(() => {
				if (Array.isArray(checkedRows))
					checkedRows.forEach((id) => {
						let rowNode = params.api.getRowNode(id);
						if (rowNode) {
							rowNode.setSelected(true);
						} else {
							console.error(`Couldn't find row with ID ${id}.`);
						}
					});
				if (Array.isArray(preSelectedRows)) {
					preSelectedRows.forEach((id: any) => {
						let rowNode = params.api.getRowNode(id);
						if (rowNode) {
							rowNode.setSelected(true);
						} else {
							console.error(`Couldn't find row with ID ${id}.`);
						}
					});
				}
			}, 2000);
		},
		[preSelectedRows, checkedRows],
	);

	useEffect(() => {
		dispatch(updateBreadcrumbs(breadCrumbList));
	}, []);

	useLayoutEffect(() => {
		let urlParams = new URLSearchParams(window.location.search);
		let params: any = sessionStorage.getItem('customer_params_data');
		if (typeof params === 'string') {
			try {
				params = JSON.parse(params);
				if (get_value_from_current_url() === value && !urlParams.get('filter')) {
					if (value in params) {
						set_search_params(params[value]);
					}
				}
			} catch (err) {}
		}
	}, [location.pathname]);

	return (
		<Grid my={2} sx={{ position: 'relative' }}>
			{!is_loading ? (
				<>
					<Box component={'div'} className={classes.sub_header_container}>
						<Grid display={'flex'} alignItems={'center'} gap={1}>
							<CustomText type='Body' color={colors.secondary_text}>
								{total_rows > 10000
									? t('OrderManagement.OrderListing.LimitShowing', { type: value === 'all' ? 'orders/quotes' : value })
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
						{is_filter_active && (
							<Button onClick={handle_clear_filter} className={classes.clear_filter_button} variant='text'>
								<CustomText type='Subtitle' color={colors.primary_600}>
									Clear filters
								</CustomText>
							</Button>
						)}
					</Box>
					<CustomToast
						open={toast?.show}
						showCross={true}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'center',
						}}
						show_icon={true}
						is_custom={false}
						autoHideDuration={3000}
						onClose={() => set_toast({ show: false, message: '', title: '', status: toast?.status })}
						state={toast?.status}
						title={toast?.title}
						subtitle={toast?.message}
						showActions={false}
					/>
					<AgGridSSRMTableContainer
						getRowId={getRowNodeId}
						onGridReady={gridReady}
						onSelectionChanged={handleSelectionChanged}
						rowData={[]}
						dataSource={data_source}
						totalRows={total_rows}
						summary={summary}
						columnDefs={columnsDefs}
						endRows={row_data}
						customRowName='Total Customers'
						column_id='Buyers'
						containerStyle={{ height: 'calc(100vh - 170px)' }}
						suppressFieldDotNotation={true}
					/>
					{!count_loading && total_rows === 0 && <EmptyTableComponent top={'140px'} height={'calc(100vh - 340px)'} />}
				</>
			) : (
				<TableSkeleton />
			)}
		</Grid>
	);
};

export default BuyerListGrid;
