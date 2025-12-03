/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Entity } from 'src/@types/manage_data';
import { set_notification_feedback } from 'src/actions/notifications';
import api_requests from 'src/utils/api_requests';
import inventory from 'src/utils/api_requests/inventory';
import utils from 'src/utils/utils';
import DateComp from './component/DateComp';
import ImageComp from '../LabelManagement/LabelsGrid/ImageComp';
import { useTheme } from '@mui/material/styles';

const useInventoryManagement = () => {
	const dispatch = useDispatch();
	const [columns_defs, set_columns_defs] = useState([]);
	const [all_columns, set_all_columns] = useState([]);
	const [loading, set_loading] = useState<boolean>(true);
	const [start_import, set_start_import] = useState<boolean>(false);
	const theme: any = useTheme();

	const menu_options = [
		{ value: 'import', label: 'Import Inventory' },
		{ value: 'export', label: 'Export Inventory' },
	];

	const transformColumns = (columns: any) => {
		if (!columns) return [];

		const transformColumn = (column: any) => {
			let column_props = {};
			if (column?.key === 'media.1.url') {
				column_props = {
					sortable: false,
					minWidth: 85,
					width: 80,
					resizable: false,
					cellStyle: {
						borderRadius: '0px',
						background: theme?.inventory_management?.use_inventory?.background,
						borderWidth: '0px 1px 0px 0px',
						minWidth: 85,
						width: 85,
						borderColor: theme?.inventory_management?.use_inventory?.borderColor,
					},
					pinned: 'left',
				};
			} else if (column?.key === 'sku_id') {
				column_props = {
					minWidth: 50,
					cellStyle: {
						fontWeight: 700,
					},
					pinned: true,
				};
			} else if (column?.key === 'inventory.updated_at') {
				column_props = {
					sortable: true,
					sort: 'desc',
					cellRenderer: DateComp,
				};
			} else {
				column_props = {
					flex: 1,
					minWidth: 200,
				};
			}

			const transformedColumn = {
				...column,
				...column_props,
				headerName: column?.name,
				sortable: column?.isSortable,
				hideFilter: !column?.isFilterable,
				unSortIcon: true,
				field: column?.key,
				dtype: column?.type,
				suppressMenu: true,
				suppressMovable: true,
			};

			if (column?.children) {
				transformedColumn.children = column?.children?.map(transformColumn);
			}
			if (transformedColumn.key === 'media.1.url') {
				return {
					...transformedColumn,
					cellRenderer: ImageComp,
				};
			}

			return transformedColumn;
		};

		return columns.map(transformColumn);
	};

	const handle_get_column_def = () => {
		const columnDefs = [{ ...utils.create_serial_number_config() }, ...transformColumns(columns_defs)];

		return columnDefs;
	};

	const handle_export_flow = async () => {
		try {
			await api_requests.manage_data.export_module(Entity.Inventory);
			dispatch(set_notification_feedback(true));
		} catch (error) {
			console.log(error);
		}
	};

	const handle_click = (event: string) => {
		if (event === 'Import Inventory') {
			set_start_import(true);
		} else {
			handle_export_flow();
		}
	};

	useEffect(() => {
		inventory
			.get_inventory_ssrm_config()
			.then((res: any) => {
				set_columns_defs(res?.data);
				set_loading(false);
			})
			.catch((err) => {
				console.error(err);
				set_loading(false);
			});
	}, []);

	return {
		columns_defs,
		all_columns,
		loading,
		menu_options,
		start_import,
		set_start_import,
		handle_click,
		handle_get_column_def,
	};
};

export default useInventoryManagement;
