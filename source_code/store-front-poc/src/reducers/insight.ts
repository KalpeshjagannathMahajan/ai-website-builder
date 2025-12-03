import { USER_LOGOUT, USER_SWITCH } from '../actions/reduxConstants';
interface Insights {}

const initialState: Insights = {};

const nylas_config = (state: any = initialState, action: any) => {
	switch (action.type) {
		case 'INSIGHT_LIST':
			return { ...state, list: action.data };
		case 'INSIGHT_VERSION':
			return { ...state, version: action.data };
		case 'INSIGHT_CONFIG':
			return { ...state, config: action.data };
		case USER_SWITCH:
		case USER_LOGOUT:
			return { ...initialState };
		default:
			return state;
	}
};

export default nylas_config;
