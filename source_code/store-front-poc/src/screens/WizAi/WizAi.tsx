import { Button, Grid, Icon } from 'src/common/@the-source/atoms';
import { AgGridSSRMTableContainer } from 'src/common/@the-source/molecules/Table';
import WizAiManageCols from './drawer/ManageColumns';
import { useContext, useMemo, useState } from 'react';
import EditActivity from './drawer/EditActivity';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from './style';
import Alert from 'src/common/@the-source/atoms/Alert';
import _ from 'lodash';
import AddView from './modal/AddView';
import WizAiContext from './context';
import utils, { should_handle_click } from 'src/utils/utils';
import DeleteModal from './modal/DeleteModal';
// import AllFiltersDrawer from 'src/common/@the-source/molecules/FilterComponents/AllFiltersDrawer';
import SortDrawer from './drawer/SortingDrawer';
import wiz_ai from 'src/utils/api_requests/wizAi';
import Animations from 'src/assets/animations/Animations';
import Lottie from 'react-lottie';
import { useSearchParams } from 'react-router-dom';
import { PERMISSIONS } from 'src/casl/permissions';
import { permissions } from 'src/utils/mocks/mock_permissions';
import ViewHeader from './components/ViewHeader';
import { useTheme } from '@mui/material/styles';
import ExportInsights from './modal/ExportModal';
import { get_value_from_current_url } from 'src/utils/common';
import { useSelector } from 'react-redux';
import { primary } from 'src/utils/light.theme';
import constants from 'src/utils/constants';
import EmptyTableComponent from 'src/common/@the-source/EmptyTableComponent';
import TableSkeleton from 'src/common/TableSkeleton';

const defaultOptions = {
	loop: true,
	autoplay: true,
	animationData: Animations?.report_loading,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

const default_filters: any = {};

const WizAi = () => {
	const value = 'wiz_insights';
	const tenant_id = useSelector((state: any) => state?.login?.userDetails?.tenant_id);
	const theme: any = useTheme();
	const classes = useStyles(theme);
	const {
		column_def,
		view_columns,
		set_view_columns,
		manage_cols,
		set_manage_cols,
		edit_drawer,
		set_edit_drawer,
		edit_data,
		show_alert,
		set_show_alert,
		show_modal,
		set_show_modal,
		view_list,
		view,
		set_view,
		get_columns,
		get_extracted_columns,
		set_states_changed,
		delete_modal,
		set_delete_modal,
		activity_refetch,
		sort_data,
		set_sort_data,
		all_sorting_dta,
		set_all_sorting_dta,
		gridApi,
		setGridApi,
		columnApi,
		setColumnApi,
		facets,
		filters,
		set_facets,
		set_refetch,
		loading,
		generateUrl,
		handle_activity,
		handle_view_accessed,
		all_filter,
		set_all_filter,
		update_version_status,
		set_first_opened,
		export_modal,
		set_export_modal,
	} = useContext(WizAiContext);

	const set_columns = () => {
		const updated_config = _.map(view_columns, (item) => {
			if (item?.children) {
				const children = _.map(item?.children, (child) => {
					return get_extracted_columns(child);
				});

				return { ...item, children };
			}
			return get_extracted_columns(item, true);
		});

		return updated_config;
	};
	const [row_loading, set_row_loading] = useState<boolean>(false);
	const [searchParams] = useSearchParams();
	const [new_cols, set_new_cols] = useState<any[]>(set_columns() || []);
	const [row_count, set_row_count] = useState<any>(0);
	const [open_sort, set_open_sort] = useState<boolean>(false);
	// const [is_filter_active, set_is_filter_active] = useState(false);
	// const [filter_open, set_filter_open] = useState<boolean>(false);
	// const [select_filter, set_select_filters] = useState<any>({ filters: {}, range_filters: {} });

	const view_dashboard: any = permissions.find((item: any) => item.slug === PERMISSIONS?.view_dashboard.slug);

	const handle_update_columns = (update_col: any[]) => {
		set_view_columns(update_col);
		set_states_changed((prev: any) => ({ ...prev, columns: true }));
		const updated_config = _.map(update_col, (item) => {
			if (item?.children) {
				const children = _.map(item?.children, (child) => {
					return get_extracted_columns(child);
				});

				return { ...item, children };
			}
			return get_extracted_columns(item, true);
		});

		set_new_cols(updated_config);
	};

	const transformColumnsForComparing = (columns: any) => {
		return _.map(columns, (item: any) => {
			return {
				field: item?.field,
				children: _.map(item?.children, (child: any) => {
					return {
						field: child?.field,
						priority: child?.priority,
					};
				}),
				priority: item?.priority,
			};
		});
	};

	const on_column_move = (params: any) => {
		const columnState = params.columnApi.getColumnState();
		const prev_cols = transformColumnsForComparing(view?.column_config);
		const config = utils.get_reordered_column_config(view_columns, columnState);
		set_view_columns(config);
		const updated_config = _.map(config, (item) => {
			if (item?.children) {
				const children = _.map(item?.children, (child) => {
					return get_extracted_columns(child);
				});

				return { ...item, children };
			}
			return get_extracted_columns(item, true);
		});

		set_new_cols(updated_config);

		const updated_cols = transformColumnsForComparing(updated_config).filter((item: any) => item?.field !== 'action');
		const condition = !_.isEqual(JSON.stringify(updated_cols), JSON.stringify(prev_cols));
		set_states_changed((prev: any) => ({ ...prev, columns: condition }));
	};

	const handle_close_view = () => {
		if (get_value_from_current_url() === value) {
			const default_item = _.find(view_list, { is_default: true });
			set_view(default_item);
			get_columns(default_item?.id);
			handle_view_accessed(default_item?.id);
			set_all_sorting_dta([]);
			set_all_filter([]);
			searchParams.delete('sort');
			searchParams.delete('filter');
			window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
			set_sort_data([]);
		}
	};

	const handle_revert_changes = () => {
		if (get_value_from_current_url() === value) {
			searchParams.delete('sort');
			searchParams.delete('filter');
			window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
			get_columns(view?.id);
			set_first_opened(true);
			set_states_changed({
				columns: false,
				sort: false,
				filters: false,
			});
		}
	};

	const is_default = view?.is_default ?? true;

	// const is_category_page = false;
	// const is_collections_page = false;
	// const collections: any[] = [];
	// const categories: any[] = [];
	// const filter_chips_list: any[] = [];

	// const select_and_close = () => {
	// 	console.log('cakbdiw');
	// };

	const transformFilterModel = (filterModel: any) => {
		const new_filters = _.mapValues(filterModel, (item) => {
			if (item?.filterType === 'date') {
				const { dateFrom, dateTo, type } = item;
				const { from, to } = utils.getRange(dateFrom, dateTo, type);
				return {
					filterType: 'number',
					type: 'inRange',
					filter: from, // Assuming conversion to milliseconds timestamp
					filterTo: to,
					customType: 'timestamp',
				};
			} else {
				return item;
			}
		});

		return new_filters;
	};

	const transformSortModelForComparing = (sortModel: any) => {
		const new_sort_model = _.map(sortModel, (item) => {
			return {
				colId: item?.colId,
				sort: item?.sort,
			};
		});

		return JSON.stringify(_.sortBy(new_sort_model, 'colId'));
	};

	let isFirstRender = true;

	const createDataSource = () => {
		return {
			getRows(params: any) {
				set_row_loading(true);
				// let paramsData: any = sessionStorage.getItem('customer_params_data');
				// let filter = '';
				// if (typeof paramsData === 'string') {
				// 	try {
				// 		paramsData = JSON.parse(paramsData);
				// 		filter = paramsData[value];
				// 	} catch (err) {}
				// }
				// const storedParams = new URLSearchParams(filter);
				const urlParams = new URLSearchParams(window.location.search);
				const sortParam = urlParams.get('sort');
				const filtersParam = urlParams.get('filter');

				const tempSort =
					sortParam
						?.split(',')
						.map((item) => {
							const [colId, sort, globalFlag] = item.split('*');
							return { colId, sort, is_global: globalFlag === 'is_global' };
						})
						.filter((item) => item.colId) ?? [];

				const globalSorting =
					sort_data?.length > 0 ? sort_data : tempSort?.find((item) => item.is_global) ? [tempSort?.find((item) => item.is_global)] : [];
				const tableSorting = !isFirstRender
					? params.request.sortModel
					: tempSort
							.filter((item) => !item.is_global)
							.map((item) => {
								return { colId: item.colId, sort: item.sort };
							}) ?? [];
				const newSorting = tableSorting.length > 0 ? tableSorting : globalSorting; //[...globalSorting, ...tableSorting];
				const paramFiltering = filtersParam ? JSON.parse(filtersParam) : {};

				const transformedFilterModel: any = transformFilterModel(
					isFirstRender ? { ...paramFiltering, ...params.request.filterModel } : { ...params.request.filterModel },
				);
				const payload = {
					page: Math.floor(params.request.startRow / 100) + 1,
					pageSize: 100,
					sortModel: newSorting.length > 0 ? newSorting : [],
					filterModel: {
						...default_filters,
						...transformedFilterModel,
					},
				};

				set_all_sorting_dta(newSorting.length > 0 ? newSorting : []);
				set_all_filter(transformedFilterModel);

				const url = generateUrl(newSorting, transformedFilterModel);

				// if (Object.keys(transformedFilterModel).length === 0) {
				// 	set_is_filter_active(false);
				// } else {
				// 	set_is_filter_active(true);
				// }

				if (get_value_from_current_url() === value) {
					window.history.replaceState({ path: url }, '', url);
				}

				if (columnApi) {
					const table_sorting_update: any = tableSorting.map((item: any, index: number) => ({
						colId: item.colId,
						sort: item.sort,
						sortIndex: index,
					}));

					columnApi.applyColumnState({
						state: table_sorting_update,
						defaultState: { sort: table_sorting_update, filters: null },
					});
				}

				if (view?.id) {
					const new_sorting_model = _.map(view?.sort_model, (item) => {
						return { colId: item?.colId, sort: item?.sort };
					});
					const filterChanged = !_.isEqual(JSON.stringify(transformedFilterModel), JSON.stringify(view?.filter_model));
					const sort_changed = !_.isEqual(transformSortModelForComparing(newSorting), transformSortModelForComparing(new_sorting_model));
					set_states_changed((prev: any) => ({ ...prev, filters: filterChanged, sort: sort_changed }));
				}

				wiz_ai
					.get_view_data(view.id, payload)
					.then((response: any) => {
						const { data } = response;
						set_facets(response.facets);
						localStorage.setItem('insight_facets', JSON.stringify(response.facets));

						params.success({
							rowData: data || [],
							rowCount: response.total > 0 ? response?.total : data?.length,
						});
						set_row_loading(false);
						set_row_count(response.total > 0 ? response?.total : data?.length);
						set_first_opened(false);

						isFirstRender = false;
					})
					.catch((err: any) => {
						console.error(err);
						params.fail();
						set_row_loading(false);
						set_first_opened(false);

						isFirstRender = false;
					});
			},
		};
	};

	const data_source = useMemo(() => {
		if (view?.id && column_def?.length > 0) return createDataSource();
	}, [view, activity_refetch, sort_data, column_def, gridApi]);

	const handle_save_changes = () => {
		const column_definations = new_cols?.length > 0 ? new_cols : set_columns();
		const updated_config = _.filter(column_definations, (item) => item?.field !== 'action');
		const payload = {
			name: view?.name,
			sort_model: JSON.stringify(all_sorting_dta) ?? '',
			filter_model: JSON.stringify(all_filter) ?? '',
			column_config: JSON.stringify(updated_config),
		};
		wiz_ai
			.update_view(payload, view?.id)
			.then(() => {
				set_refetch((prev: any) => !prev);
			})
			.catch((err: any) => {
				console.error(err);
			})
			.finally(() => {
				set_first_opened(true);
				set_states_changed({
					columns: false,
					sort: false,
					filters: false,
				});
			});
	};

	const on_first_data_rendered = (params: any) => {
		const urlParams = new URLSearchParams(window.location.search);
		const sortParam = urlParams.get('sort') ? urlParams.get('sort') : '';
		const filters_param = urlParams.get('filter') ? urlParams.get('filter') : '';

		setGridApi(params.api);
		setColumnApi(params.columnApi);

		const filterData = filters_param ? utils.parse_and_check_json(filters_param) : {};
		params.api.setFilterModel(filterData);

		const tempSort = sortParam
			? sortParam
					.split(',')
					.map((item) => {
						// eslint-disable-next-line @typescript-eslint/no-shadow
						const [colId, sort, globalFlag] = item?.split('*');
						return { colId, sort, is_global: globalFlag === 'is_global' };
					})
					.filter((item) => item.colId)
			: [];

		const tableSorting: any = tempSort
			.filter((item) => !item?.is_global)
			.map((item: any, index: number) => ({ colId: item?.colId, sort: item?.sort, sortIndex: index }));
		params.columnApi.applyColumnState({
			state: tableSorting,
			applyOrder: true,
			defaultState: { sort: tableSorting },
		});
	};

	const valuesCallback = (params: any) => {
		const field = params?.colDef?.field;
		const new_facets = JSON.parse(localStorage?.getItem('insight_facets') || '{}');

		setTimeout(() => {
			const new_vals = !_.isEmpty(facets?.[field]) ? facets?.[field] : new_facets?.[field];
			params.success(new_vals);
		}, 100);
	};

	const valuesCallbackRegion = (params: any) => {
		const regions_filters = JSON.parse(localStorage?.getItem('insights_region') || '[]');
		const vals = _.find(!_.isEmpty(filters) ? filters : regions_filters, {
			key: 'region',
		})?.values;

		setTimeout(() => {
			params.success(vals);
		}, 100);
	};

	const definations = _.map(view_columns, (item) => {
		if (item?.children) {
			return {
				...item,
				children: _.map(item?.children, (child) => {
					if (child?.field === 'customer_details.company_name') {
						return {
							...child,
							cellRenderer: (params: any) => {
								return <CustomText type='Subtitle'>{params?.value}</CustomText>;
							},
							onCellClicked: (params: any) => {
								if (!should_handle_click(params?.event)) return;

								const url = `/buyer/dashboard/${params?.node?.data?.buyer_id}`;
								const state = { from: 'insights' };

								// Convert state object to URLSearchParams if needed (optional)
								const search_params = new URLSearchParams(state).toString();
								const fullUrl = `${url}?${search_params}`;

								if (get_value_from_current_url() === value) {
									// Open the URL in a new tab
									window.open(fullUrl, '_blank');
								}
							},
							hasViewPermission: view_dashboard?.toggle,
							sortable: child?.isSortable,
						};
					}
					if (child?.field === 'customer_details.buyer_reference_id' && tenant_id === constants.KALALOUE_ID) {
						return {
							...child,
							cellRenderer: (params: any) => {
								return (
									<CustomText type='Subtitle' color={primary.main}>
										{params?.value}
									</CustomText>
								);
							},
							onCellClicked: (params: any) => {
								if (!should_handle_click(params?.event)) return;

								const url = `https://974291.app.netsuite.com/app/common/entity/custjob.nl?id=${params?.value}`;

								window.open(url, '_blank');
							},
							hasViewPermission: view_dashboard?.toggle,
							sortable: child?.isSortable,
						};
					}
					if (child?.filterType === 'set') {
						return {
							...child,
							filterParams: {
								...child?.filterParams,
								values: valuesCallback,
								keyCreator: (params: any) => params?.value?.key,
								refreshValuesOnOpen: true,
								valueFormatter: (params: any) => {
									const label = _.capitalize(_.replace(params?.value?.key, '_', ' '));
									return `${label} (${params?.value?.doc_count})`;
								},
							},
						};
					} else return child;
				}),
			};
		}

		if (item?.field === 'region') {
			return {
				...item,
				filterType: 'set',
				filterParams: {
					...item?.filterParams,
					values: valuesCallbackRegion,
					refreshValuesOnOpen: true,
					keyCreator: (params: any) => params?.value,
					valueFormatter: (params: any) => `${params?.value}`,
				},
			};
		}
		return { ...item };
	});

	const onColumnPinned = (event: any) => {
		const { column, pinned } = event;
		const column_id = column.getColId();
		const update_cols = _.map(view_columns, (col) => {
			if (col?.children) {
				return {
					...col,
					children: _.map(col.children, (child) => (child?.field === column_id ? { ...child, pinned } : child)),
				};
			} else if (col?.field === column_id) {
				return { ...col, pinned };
			}
			return col;
		});
		handle_update_columns(update_cols);
	};

	return (
		<Grid pt={is_default ? 0 : 1}>
			<Grid p={1} m={'20px 0px 12px 10px'} display={'flex'} sx={{ borderBottom: '2px solid rgba(22, 136, 95, 1)', width: '84px' }}>
				<CustomText type='H2'> Insights</CustomText>
			</Grid>
			{show_alert && (
				<Grid my={1}>
					<Alert
						className='insights-alert'
						icon={<Icon iconName='IconCoins' color={theme?.insights?.alert?.icon_color} />}
						severity='info'
						message={
							<Grid
								container
								display={'flex'}
								direction={'row'}
								gap={1}
								alignItems={'center'}
								padding={0}
								marginTop={'-8px'}
								height={'34px'}>
								<Grid item>
									<CustomText type='Body'>New insights have been added. Update to see the latest the insights</CustomText>
								</Grid>
								<Grid item>
									<Button variant='text' onClick={update_version_status}>
										Update insights
									</Button>
								</Grid>
							</Grid>
						}
						open={show_alert}
						handle_close={() => set_show_alert(false)}
						style={{
							background: theme?.insights?.alert?.bg_color,
							border: `1px solid ${theme?.insights?.alert?.icon_color}`,
							height: '48px',
						}}
					/>
				</Grid>
			)}

			{loading ? (
				<Lottie options={defaultOptions} height={300} width={300} />
			) : (
				<>
					<ViewHeader
						is_default={is_default}
						set_manage_cols={set_manage_cols}
						total_rows={row_count}
						set_open_sort={set_open_sort}
						all_sorting_dta={all_sorting_dta}
						handle_revert_changes={handle_revert_changes}
						handle_save_changes={handle_save_changes}
						handle_close_view={handle_close_view}
					/>

					<Grid className={is_default ? classes.table_container : classes.view_table_container}>
						{definations?.length > 0 ? (
							<AgGridSSRMTableContainer
								columnDefs={definations}
								rowData={[]}
								dataSource={data_source}
								containerStyle={{ height: 'calc(100vh - 200px)' }}
								suppressFieldDotNotation
								totalRows={row_count}
								customRowName='Total Customers'
								onDragStopped={on_column_move}
								onFirstDataRendered={on_first_data_rendered}
								onColumnPinned={onColumnPinned}
							/>
						) : (
							<TableSkeleton />
						)}

						{!row_loading && definations?.length > 0 && row_count === 0 && (
							<EmptyTableComponent top={is_default ? '165px' : '180px'} height={'calc(100vh - 400px)'} />
						)}
					</Grid>
				</>
			)}

			{manage_cols && (
				<WizAiManageCols open={manage_cols} close={() => set_manage_cols(false)} data={view_columns} handle_save={handle_update_columns} />
			)}

			{/* {filter_open && (
				<AllFiltersDrawer
					isDrawerOpen={filter_open}
					setIsDrawerOpen={set_filter_open}
					select_filter={select_filter}
					filters={filters}
					_facets={facets}
					filter_chips_list={filter_chips_list}
					set_page={() => console.log('')}
					set_filter_chips_list={() => console.log('')}
					set_selected_filters={set_select_filters}
					categories={categories}
					collections={collections}
					is_category_page={is_category_page}
					is_collections_page={is_collections_page}
					_nb_hits={10}
					select_and_close={select_and_close}
					is_loading={false}
				/>
			)} */}
			{open_sort && <SortDrawer open={open_sort} close={() => set_open_sort(false)} columnApi={columnApi} />}
			{edit_drawer && (
				<EditActivity open={edit_drawer} close={() => set_edit_drawer(false)} data={edit_data} handle_activity={handle_activity} />
			)}
			{show_modal && <AddView open={show_modal} on_close={() => set_show_modal(false)} data={new_cols} />}
			{delete_modal && <DeleteModal open={delete_modal} on_close={() => set_delete_modal(false)} />}
			{export_modal && <ExportInsights open={export_modal} on_close={() => set_export_modal(false)} />}
		</Grid>
	);
};

export default WizAi;
