import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ManageDataItem } from 'src/@types/manage_data';
import { updateBreadcrumbs } from 'src/actions/topbar';
import RouteNames from 'src/utils/RouteNames';
import api_requests from 'src/utils/api_requests';
import { format_data } from './helper';
import { set_notification_feedback } from 'src/actions/notifications';

const useManageData = () => {
	const dispatch = useDispatch();
	const [selected_data_card, set_selected_data_card] = useState<ManageDataItem>(null);
	const [show_export_modal, toggle_export_modal] = useState(false);
	const [show_toast, set_show_toast] = useState(false);
	const [show_import_drawer, toggle_import_drawer] = useState(false);
	const [data_cards, set_data_cards] = useState(null);
	const [task_history, set_task_history] = useState<any>({ loading: true, data: null });

	const breadCrumbList = [
		{
			id: 1,
			linkTitle: 'Dashboard',
			link: RouteNames.dashboard.path,
		},
		{
			id: 2,
			linkTitle: 'Import - Export',
			link: `${RouteNames.manage_data.path}`,
		},
	];

	const transformColumns = (columns: any) => {
		return columns.map((column: any) => ({
			...column,
			flex: column?.field === 'action' ? null : 1,
			minWidth: column?.field === 'action' ? null : 200,
			suppressSizeToFit: true,
			suppressMovable: true,
			menuTabs: [],
			...(column?.field === 'action'
				? {
						is_custom_download: true,
				  }
				: {}),
		}));
	};

	const handle_fetch_data = async () => {
		try {
			const [task_history_response, manage_data_entities_response]: any = await Promise.all([
				api_requests.manage_data.get_task_history(),
				api_requests.manage_data.get_manage_data_entities(),
			]);

			const task_history_data = format_data(task_history_response?.data);
			const { rows, columns } = task_history_data;
			const newColumns = transformColumns(columns);

			set_data_cards(manage_data_entities_response?.data);
			set_task_history({ loading: false, data: { rows, columns: newColumns } });
		} catch (error) {
			console.error(error);
		} finally {
		}
	};

	useEffect(() => {
		handle_fetch_data();
	}, []);

	useEffect(() => {
		dispatch(updateBreadcrumbs(breadCrumbList));
	}, []);

	const handle_import_button = () => {
		toggle_import_drawer(true);
	};

	const handle_export_button = async (export_option?: any) => {
		try {
			const entity = selected_data_card?.value;
			const sub_entity = selected_data_card?.value === 'products' ? export_option?.option : null;
			if (selected_data_card?.value === 'products') {
				await api_requests.manage_data.export_module(entity, [], export_option, 'import_export', sub_entity);
			} else {
				await api_requests.manage_data.export_module(entity, [], export_option, 'import_export');
			}
			set_show_toast(true);
			dispatch(set_notification_feedback(true));
		} catch (error) {
			console.log(error);
		}
	};

	const handle_close_export_modal = () => {
		toggle_export_modal(false);
	};

	return {
		selected_data_card,
		set_selected_data_card,
		set_show_toast,
		show_toast,
		handle_export_button,
		handle_import_button,
		handle_close_export_modal,
		show_export_modal,
		toggle_export_modal,
		show_import_drawer,
		toggle_import_drawer,
		data_cards,
		task_history,
	};
};

export default useManageData;
