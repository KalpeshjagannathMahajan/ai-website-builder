import { UPDATE_DASHBOARD_OPTIONS } from './reduxConstants';

interface Dashboard {
	time_range_id?: string;
	buyer?: {
		id: string;
		name: string;
		cart_items: number;
	};
	sales_rep?: {
		id: string;
		name: string;
	};
}

export const update_dashbord_options = (data: Dashboard) => ({
	type: UPDATE_DASHBOARD_OPTIONS,
	payload: data,
});
