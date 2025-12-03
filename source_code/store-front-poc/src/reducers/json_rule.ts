import { USER_LOGOUT, USER_SWITCH } from '../actions/reduxConstants';
interface Nylas {}

const initialState: Nylas = {};

const json_rules = (state: any = initialState, action: any) => {
	switch (action.type) {
		case 'JSON_RULES':
			return action.data;
		case USER_SWITCH:
		case USER_LOGOUT:
			return { ...initialState };
		default:
			return state;
	}
};

export default json_rules;
