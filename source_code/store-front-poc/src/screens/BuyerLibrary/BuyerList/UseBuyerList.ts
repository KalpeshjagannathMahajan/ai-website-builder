import { useState } from 'react';

const UseBuyerList = () => {
	const [drawer, set_drawer] = useState(false);
	const [column_def, set_column_def] = useState<any>([]);
	const [row_data, set_row_data] = useState<any>([]);
	const [selected_row, set_selected_row] = useState<any>([]);
	const [gridApi, setGridApi] = useState<any>(null);
	const [buyer_data, set_buyer_data] = useState({});
	const [is_loading, set_is_loading] = useState<boolean>(true);
	const [toggle_toast, set_toggle_toast] = useState({ show: false, message: '', title: '', status: 'success' });
	const [storefront_edit_user, set_storefront_edit_user] = useState({ index: null, user: null });

	return {
		drawer,
		set_drawer,
		column_def,
		set_column_def,
		row_data,
		set_row_data,
		selected_row,
		set_selected_row,
		gridApi,
		setGridApi,
		buyer_data,
		set_buyer_data,
		is_loading,
		set_is_loading,
		toggle_toast,
		set_toggle_toast,
		storefront_edit_user,
		set_storefront_edit_user,
	};
};

export default UseBuyerList;
