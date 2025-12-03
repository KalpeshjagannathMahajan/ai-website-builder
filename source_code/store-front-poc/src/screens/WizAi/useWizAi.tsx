import { useEffect, useState } from 'react';
import wiz_ai from 'src/utils/api_requests/wizAi';
// import utils from 'src/utils/utils';
import _ from 'lodash';
import IconChip from './components/IconChip';
import MenuTags from './components/MenuTags';
import PriceTags from './components/PriceTags';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { insight_list } from 'src/actions/insight';
import dayjs from 'dayjs';
import RouteNames from 'src/utils/RouteNames';
import { updateBreadcrumbs } from 'src/actions/topbar';
import { check_permission } from 'src/utils/utils';
const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
];

const useWizAi = () => {
	const value = 'wiz_insights';
	const dispatch = useDispatch();
	const insights = useSelector((state: any) => state.insights);
	const permissions = useSelector((state: any) => state?.login?.permissions);
	//states
	const theme: any = useTheme();
	const [first_opened, set_first_opened] = useState<boolean>(true);
	const [searchParams] = useSearchParams();
	const [loading, set_loading] = useState<boolean>(false);
	const [column_def, set_column_def] = useState<any[]>([]);
	const [view_columns, set_view_columns] = useState<any[]>([]);
	const [row_data, set_row_data] = useState<any[]>([]);
	const [manage_cols, set_manage_cols] = useState<boolean>(false);
	const [edit_drawer, set_edit_drawer] = useState<boolean>(false);
	const [edit_data, set_edit_data] = useState<any>({});
	const [show_alert, set_show_alert] = useState<boolean>(false);
	const [show_modal, set_show_modal] = useState<boolean>(false);
	const [view_name, set_view_name] = useState<string>('');
	const [view_list, set_view_list] = useState<any>(insights?.list ?? []);
	const [export_modal, set_export_modal] = useState<boolean>(false);
	const [view, set_view] = useState<any>({});
	const [new_view, set_new_view] = useState<boolean>(false);
	const [refetch, set_refetch] = useState<boolean>(false);
	const [activity_refetch, set_activity_refetch] = useState<boolean>(false);
	const [delete_modal, set_delete_modal] = useState<boolean>(false);
	const [facets, set_facets] = useState<any>();
	const [filters, set_filters] = useState<any>(insights?.config?.filter ?? {});
	const [all_filter, set_all_filter] = useState<any>();
	const [sort, set_sort] = useState<any[]>(insights?.config?.sorting ?? []);
	const [sort_data, set_sort_data] = useState<any[]>([]);
	const [all_sorting_dta, set_all_sorting_dta] = useState<any[]>([]);
	const [version] = useState<any>(insights?.version);
	const [states_changed, set_states_changed] = useState<any>({
		columns: false,
		sort: false,
		filters: false,
	});
	const [gridApi, setGridApi] = useState<any>(null);
	const [columnApi, setColumnApi] = useState<any>(null);
	const [is_filter_active, set_is_filter_active] = useState(false);

	const breadCrumbList = [
		{
			id: 1,
			linkTitle: 'Dashboard',
			link: '/',
		},
		{
			id: 2,
			linkTitle: 'Insights',
			link: `${RouteNames.wiz_insights.path}`,
		},
	];

	const get_extracted_columns = (dta: any, is_parent?: boolean) => {
		if (is_parent) {
			return {
				field: dta?.field,
				headerName: dta?.headerName,
				hide: dta?.hide,
				dtype: dta?.dtype,
				pinned: dta?.pinned,
				isFilterable: dta?.isFilterable,
				isSortable: dta?.isSortable,
				marryChildren: dta?.marryChildren,
				filter: dta?.filter,
				filterType: dta?.filterType,
				priority: dta?.priority,
				children: dta?.children,
			};
		} else {
			return {
				field: dta?.field,
				headerName: dta?.headerName,
				hide: dta?.hide,
				dtype: dta?.dtype,
				pinned: dta?.pinned,
				isFilterable: dta?.isFilterable,
				isSortable: dta?.isSortable,
				marryChildren: dta?.marryChildren,
				filter: dta?.filter,
				filterType: dta?.filterType,
				priority: dta?.priority,
			};
		}
	};

	const handle_edit = (params: any) => {
		set_edit_data(params.node?.data);
		set_edit_drawer(true);
	};

	const get_value_from_current_url = () => {
		const path = window.location.pathname;
		const parts = path.split('/');
		return _.last(parts);
	};

	//Get columns , row_dta and transformations
	const transform_columns = (col_data: any[]) => {
		const update_cols = _.map(col_data, (col: any) => {
			if (col?.children) {
				return {
					...col,
					children: _.map(col?.children, (child: any) => {
						if (child?.field === 'customer_details.company_name') {
							return {
								...child,
								unSortIcon: true,
								suppressMenu: true,
								resizable: false,
								suppressMovable: true,
								pinned: 'left',
							};
						} else if (child?.field === 'buyer_activity.buyer_activity_type') {
							return {
								...child,
								unSortIcon: true,
								cellRenderer: IconChip,
								sortable: child?.isSortable,
								minWidth: 200,
							};
						} else if (child?.field === 'customer_details.buyer_priority') {
							return {
								...child,
								unSortIcon: true,
								cellRenderer: MenuTags,
								maxWidth: 140,
								sortable: child?.isSortable,
								minWidth: 200,
								cellStyle: { width: 80, minWidth: 80 },
							};
						} else if (child?.field === 'buyer_activity.buyer_activity_note') {
							return {
								...child,
								minWidth: 200,
							};
						}
						if (child?.dtype === 'number') {
							return {
								...child,
								unSortIcon: true,
								sortable: child?.isSortable,
								cellRenderer: (params: any) => {
									return <PriceTags value={params?.value} id={child?.headerName} />;
								},
								maxWidth: 140,
								minWidth: 200,
							};
						} else {
							return {
								...child,
								sortable: child?.isSortable,
								unSortIcon: true,
								minWidth: 200,
							};
						}
					}),
				};
			}
			return {
				...col,
				sortable: col?.isSortable,
				unSortIcon: !col?.children && true,
				minWidth: 200,
			};
		});
		const new_col = [
			...update_cols,

			// utils.create_action_config(actions, handle_edit),
			{
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
					width: '60px',
					justifyContent: 'center',
					alignItems: 'center',
					minWidth: '60px',
					textAlign: 'center',
					borderRadius: '0px',
					borderWidth: '0px 0px 0px 1px',
					borderColor: theme?.insights?.action_color,
				},
				sortable: false,
				headerStyle: {
					width: '60px',
				},
				width: 60,
				flex: 1,
				maxWidth: 60,
				suppressMenu: true,

				actions: {
					actions: actions.map((action) => ({
						...action,
						onClick: (params: any) => {
							handle_edit(params);
						},
					})),
					type: 'action',
				},
			},
		];

		return new_col;
	};
	//get columns
	const get_columns = async (id: string) => {
		try {
			set_loading(true); // Set loading true at the beginning of the API call
			const res = await wiz_ai.view_config(id);
			if (res?.data) {
				const col_def = res.data.config || [];
				const new_cols = transform_columns(col_def);
				set_column_def(new_cols);
				set_view_columns(new_cols);
				const is_version_greater = res?.data?.version < version;
				if (is_version_greater) {
					//API CALLd
					set_show_alert(true);
				} else {
					set_show_alert(false);
				}

				const sorting_data = res.data.sort_model || [];
				set_all_sorting_dta(sorting_data);
				const filter_data = res.data.filter_model || {};
				set_all_filter(filter_data);
				if ((sorting_data || filter_data) && !res?.data?.is_default) {
					generateUrl(sorting_data, filter_data); // Generate URL with the new sorting
				}
				set_states_changed({
					columns: false,
					sort: false,
					filters: false,
				});

				// if (columnApi) {
				// 	columnApi.applyColumnState({
				// 		defaultState: { sort: null, filters: null },
				// 		state: sorting_data,
				// 	});
				// }

				set_loading(false); // Set loading false once data is successfully fetched and processed
			}
		} catch (err) {
			console.error(err);
			set_loading(false); // Ensure to set loading false if an error occurs
		}
	};

	//change view and menu actions
	const handle_view_accessed = async (id: string) => {
		try {
			await wiz_ai.update_view_accessed(id);
		} catch (err) {
			console.error(err);
		}
	};
	//menu actions
	const handle_view = (id: string) => {
		if (get_value_from_current_url() === value) {
			set_first_opened(true);
			set_states_changed({
				columns: false,
				sort: false,
				filters: false,
			});
			const _item = _.find(insights?.list, { id });
			searchParams.delete('sort');
			searchParams.delete('filter');
			window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
			set_view(_item);
			get_columns(id);
			handle_view_accessed(id);
			if (columnApi) {
				columnApi.applyColumnState({
					defaultState: { sort: null },
				});
			}
		}
	};
	const handle_add_view = () => {
		set_show_modal(true);
	};

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
	//create view
	const handle_create_view = async (name: string, new_cols: any) => {
		const column_definations = new_cols.length > 0 ? new_cols : set_columns();
		try {
			const columns = _.filter(column_definations, (_item: any) => _item?.field !== 'action');
			const payload = {
				name,
				sort_model: JSON.stringify(all_sorting_dta),
				filter_model: JSON.stringify(all_filter) || '',
				column_config: JSON.stringify(columns),
			};
			await wiz_ai.create_view(payload);
			set_new_view(false);
			set_show_modal(false);
			set_first_opened(true);
			set_states_changed({
				columns: false,
				sort: false,
				filters: false,
			});
			set_refetch((prev) => !prev);
		} catch (err) {
			console.error(err);
		}
	};

	const handle_clear_filter = () => {
		if (is_filter_active) {
			set_all_filter([]);
			searchParams.delete('filter');
			gridApi?.setFilterModel(null);
			window.history.pushState({}, '', `${window.location.pathname}?${searchParams.toString()}`);
			set_refetch((prev: any) => !prev);
			set_is_filter_active(false);
		}
	};

	// delete view
	const handle_delete_view = async (id: string) => {
		try {
			await wiz_ai.delete_view(id);
			handle_clear_filter();
		} catch (err) {
			console.error(err);
		}
	};
	// duplicate view
	const handle_duplicate_view = async () => {
		const payload = {
			name: `${view?.name}_copy`,
			sort_model: JSON.stringify(view?.sort_model) ?? '',
			filter_model: JSON.stringify(view?.filter_model) ?? '',
			column_config: JSON.stringify(view?.column_config),
		};
		try {
			await wiz_ai.create_view(payload);
			set_new_view(false);
			set_show_modal(false);
			set_refetch((prev) => !prev);
		} catch (err) {
			console.error(err);
		}
	};

	// rename view
	const handle_rename_section = async (name: string) => {
		const payload = {
			name,
			sort_model: JSON.stringify(view?.sort_model) ?? '',
			filter_model: JSON.stringify(view?.filter_model) ?? '',
			column_config: JSON.stringify(view?.column_config),
		};
		try {
			await wiz_ai.update_view(payload, view?.id);
			set_show_modal(false);
			set_refetch((prev) => !prev);
		} catch (err) {
			console.error(err);
		}
	};

	//update activity
	const handle_activity = async (payload: any, clear_activity?: boolean) => {
		try {
			clear_activity ? await wiz_ai.delete_buyer_activity(payload?.buyer_id) : await wiz_ai.update_buyer_activity(payload);
			gridApi.forEachNode((rowNode: any) => {
				const today_date = dayjs().unix() * 1000;
				if (rowNode.data?.buyer_id === payload?.buyer_id) {
					rowNode.setData({
						...rowNode.data,
						['buyer_activity.buyer_activity_note']: payload?.note,
						['buyer_activity.buyer_activity_type']: payload?.type,
						['buyer_activity.buyer_activity_created_at']: clear_activity ? undefined : today_date,
					});
				}
			});
		} catch (err) {
			console.error(err);
		}
	};

	//get data
	const fetch_data = async () => {
		// set_loading(true);
		if (check_permission(permissions, ['view_insights'])) {
			try {
				const list_response = await wiz_ai.get_list();
				if (insights?.config?.sorting?.length > 0) {
					const sorting_response = await wiz_ai.get_insight_config();
					set_sort(sorting_response?.data?.sorting);
				}
				// set_filters(sorting_response?.data?.filter);
				const default_item: any = _.find(list_response?.data, (item: any) => item.is_default);
				const last_updated = _.find(list_response?.data, (item: any) => item.is_last_accessed);
				set_view_list(list_response?.data);
				dispatch(insight_list(list_response?.data));
				const show_item = last_updated ? last_updated : default_item;
				set_view(show_item);
				//API CALL - for default
				// set_version(version_response?.data?.version);
				// get_row_data(show_item?.id);
				get_columns(show_item?.id);
				set_loading(false);
				// const rowData = search_data.data;
				// set_row_data(rowData);

				const is_version_greater = show_item?.active_version < insights?.version;
				if (is_version_greater) {
					//API CALLd
					set_show_alert(true);
				}
			} catch (error) {
				console.error('Error fetching data:', error);
				set_loading(false);
			}
		}
	};

	const generateUrl = (sorting: any, filter: any) => {
		const params = new URLSearchParams(window.location.search);

		if (_.isEmpty(sorting)) {
			params.delete('sort');
		}
		if (_.isEmpty(filter)) {
			params.delete('filter');
		}
		if (sorting && sorting?.length > 0) {
			const sortQuery = sorting?.map((item: any) => `${item?.colId}*${item?.sort}${item?.is_global ? '*is_global' : ''}`).join(',');
			params.set('sort', sortQuery);
		}

		if (filter && _.size(filter) > 0) {
			params.set('filter', JSON.stringify(filter));
		}

		if (get_value_from_current_url() === value) {
			window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
		}
	};
	const update_version_status = async () => {
		try {
			await wiz_ai.update_view_version(view?.id);
			set_show_alert(false);
			set_refetch((prev) => !prev);
		} catch (error) {
			console.error('Error updating version:', error);
		}
	};
	useEffect(() => {
		fetch_data();
	}, [refetch, permissions]);

	useEffect(() => {
		if (get_value_from_current_url() === value && _.isEmpty(window.location.search)) {
			generateUrl(all_sorting_dta, all_filter);
			dispatch(updateBreadcrumbs(breadCrumbList));
		}
	}, [window.location.pathname]);

	return {
		insights,
		column_def,
		set_column_def,
		row_data,
		set_row_data,
		manage_cols,
		set_manage_cols,
		edit_drawer,
		set_edit_drawer,
		edit_data,
		set_edit_data,
		show_alert,
		set_show_alert,
		show_modal,
		set_show_modal,
		view_name,
		set_view_name,
		view_list,
		set_view_list,
		view,
		set_view,
		view_columns,
		set_view_columns,
		new_view,
		set_new_view,
		states_changed,
		set_states_changed,
		facets,
		set_facets,
		filters,
		set_filters,
		sort,
		set_sort,
		activity_refetch,
		set_activity_refetch,
		gridApi,
		setGridApi,
		columnApi,
		setColumnApi,
		export_modal,
		set_export_modal,
		get_columns,
		get_extracted_columns,
		handle_create_view,
		handle_view,
		handle_add_view,
		handle_delete_view,
		handle_duplicate_view,
		handle_activity,
		handle_rename_section,
		delete_modal,
		set_delete_modal,
		sort_data,
		set_sort_data,
		all_sorting_dta,
		set_all_sorting_dta,
		refetch,
		set_refetch,
		loading,
		set_loading,
		generateUrl,
		handle_view_accessed,
		all_filter,
		set_all_filter,
		update_version_status,
		first_opened,
		set_first_opened,
		handle_clear_filter,
		set_is_filter_active,
		is_filter_active,
	};
};

export default useWizAi;
