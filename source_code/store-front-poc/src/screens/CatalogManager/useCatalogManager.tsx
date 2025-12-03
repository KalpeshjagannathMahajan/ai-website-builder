import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { close_toast, show_toast } from 'src/actions/message';
import RouteNames from 'src/utils/RouteNames';
import api_requests from 'src/utils/api_requests';
import catalogs from 'src/utils/api_requests/catalog';
import types from 'src/utils/types';
import utils from 'src/utils/utils';
import _ from 'lodash';

interface ICatalogAction {
	id: string;
	action: string;
}

const useCatalogManager = () => {
	const [columns_defs, set_columns_defs] = useState();
	const [row_data, set_row_data] = useState<any[]>([]);
	const [is_loading, set_is_loading] = useState<boolean>(true);
	const [open_sheet, set_open_sheet] = useState<boolean>(false);
	const [catalog_action, set_catalog_action] = useState<ICatalogAction>({ id: '', action: '' });
	const [show_delete_confirm, set_show_delete_confirm] = useState<boolean>(false);
	const [deleting, set_deleting] = useState<boolean>(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const [selected_catalog, set_selected_catalog] = useState<string>('');
	const [selected_catalog_id, set_selected_catalog_id] = useState<string>('');

	const handle_view_catalog = () => {
		set_open_sheet(true);
	};

	const handle_close_sheet = () => {
		set_open_sheet(false);
	};

	const handle_table_action = (para: any, key: any) => {
		const { id } = para?.node?.data;
		if (key === 'edit') {
			navigate(`${RouteNames.catalog.edit.routing_path}/${id}`);
		}
		if (key === 'menu') {
			switch (para.item) {
				case 'Import Catalog': {
					set_catalog_action({ id, action: 'import' });
					break;
				}
				case 'Export Catalog': {
					set_catalog_action({ id, action: 'export' });
					break;
				}
				case 'Delete Catalog': {
					set_catalog_action({ id, action: 'delete' });
					break;
				}
				default: {
					break;
				}
			}
		}
	};

	const get_all_catalog_table = () => {
		set_is_loading(true);
		api_requests.catalogs
			.get_all_catalogs()
			.then((res: any) => {
				const { columns, rows } = res?.data;
				set_columns_defs(columns);
				set_row_data(rows);
			})
			.catch((err) => {
				console.error(err);
			})
			.finally(() => {
				set_is_loading(false);
			});
	};

	const transformData = () => {
		return row_data.map((item) => ({
			value: item.id,
			label: item.name,
		}));
	};

	const catalog_options = transformData();

	const transformColumns = (columns: any[], actions: any[]) => {
		if (!columns) return [];
		columns?.unshift(utils.create_serial_number_config());
		if (actions?.length > 0) {
			columns.push(utils.create_action_config(actions, handle_table_action));
		}

		// Use a Set to keep track of unique column fields
		const uniqueFields = new Set();

		// Filter out duplicate columns based on their field property
		const uniqueColumns = columns.filter((column) => {
			if (uniqueFields.has(column.field)) {
				return false; // Ignore this column, it's a duplicate
			} else {
				uniqueFields.add(column.field);
				return true; // Include this column, it's unique
			}
		});

		// Apply transformations
		return uniqueColumns.map((column) => {
			if (column.field === 'name' || column.field === 'catalog_name') {
				return {
					...column,
					flex: 1,
					cellClass: 'catalog_name',
					onCellClicked: (params: any) => {
						set_selected_catalog(params?.data?.name);
						set_selected_catalog_id(params?.data?.id);
						console.log(params);
						handle_view_catalog();
					},
				};
			} else {
				return { ...column, flex: 1 };
			}
		});
	};

	const handle_create_catalog = () => {
		navigate(RouteNames.catalog.create.path);
	};

	const handle_delete = (id: string) => {
		set_selected_catalog_id(id);
		set_selected_catalog(_.find(row_data, (data) => data.id === id).name);
		set_show_delete_confirm(true);
	};

	const delete_catalog = async () => {
		try {
			const response: any = await catalogs.delete_catalog(selected_catalog_id);

			if (response?.status_code === 200) {
				dispatch<any>(
					show_toast({
						open: true,
						showCross: false,
						anchorOrigin: {
							vertical: types.VERTICAL_TOP,
							horizontal: types.HORIZONTAL_CENTER,
						},
						autoHideDuration: 5000,
						onClose: (event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
							console.log(event);
							if (reason === types.REASON_CLICK) {
								return;
							}
							dispatch(close_toast(response.data?.user_id));
						},
						state: types.SUCCESS_STATE,
						title: t('Catalog.CatalogDeleted'),
						subtitle: `"${selected_catalog}"`,
						showActions: false,
					}),
				);
				set_deleting(false);
				set_show_delete_confirm(false);

				get_all_catalog_table();
			}
		} catch (error) {
			console.error(error);
		}
	};

	const handle_delete_confirm = () => {
		set_deleting(true);
		delete_catalog();
	};

	return {
		is_loading,
		open_sheet,
		selected_catalog,
		selected_catalog_id,
		catalog_action,
		columns_defs,
		row_data,
		catalog_options,
		show_delete_confirm,
		deleting,
		transformColumns,
		get_all_catalog_table,

		set_is_loading,
		set_open_sheet,
		set_selected_catalog,
		set_selected_catalog_id,
		handle_view_catalog,
		handle_close_sheet,
		handle_create_catalog,
		handle_delete_confirm,
		handle_delete,
		set_show_delete_confirm,
	};
};

export default useCatalogManager;
