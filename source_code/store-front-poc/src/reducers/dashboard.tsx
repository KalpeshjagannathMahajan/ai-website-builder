import { UPDATE_DASHBOARD_OPTIONS, USER_LOGOUT, USER_SWITCH } from '../actions/reduxConstants';

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

const initialState: Dashboard = {
	time_range_id: 'last_30_days',
	buyer: {
		id: '',
		name: 'All Customers',
	},
	sales_rep: {
		id: '',
		name: 'All sales rep',
	},
};

const dashboard_reducer = (state: any = initialState, action: any) => {
	switch (action.type) {
		case UPDATE_DASHBOARD_OPTIONS: {
			const { ...rest } = action.payload;
			return {
				...state,
				...rest,
			};
		}
		case USER_SWITCH:
		case USER_LOGOUT:
			return { ...initialState };
		default:
			return state;
	}
};

export default dashboard_reducer;
