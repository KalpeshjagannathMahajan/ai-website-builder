import { USER_LOGOUT, USER_SWITCH } from '../actions/reduxConstants';
interface Nylas {}

const initialState: Nylas = {};

const nylas_config = (state: any = initialState, action: any) => {
	switch (action.type) {
		case 'NYLAS_CONFIG':
			return action.data;
		case 'NYLAS_CLEAR':
			return { ...initialState };
		case USER_SWITCH:
		case USER_LOGOUT:
			return { ...initialState };
		default:
			return state;
	}
};

export default nylas_config;
