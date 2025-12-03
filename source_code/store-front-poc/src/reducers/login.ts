import { status_check } from 'src/utils/common';
import { login_action_types, REFETCH_PERMISSIONS, UPDATE_PERMISSIONS, USER_LOGOUT } from '../actions/reduxConstants';
import { IPermission } from 'src/@types/permissions';

interface login_state {
	email: string;
	// password: string;
	userDetails: {
		id: string;
		email: string;
		nickname: string;
		is_admin: boolean;
		tenant_id: string;
	};
	forgotPasswordEmail: string;
	// change_password: string;
	// change_passwordConfirm: string;
	status: {
		loggedIn: boolean;
	};
	resetSuccess: boolean;
	permissions: IPermission[];
	refetch_permissions: boolean;
	wizpay_url: null;
}

const INITIAL_STATE: login_state = {
	email: '',
	userDetails: {
		id: '',
		email: '',
		nickname: '',
		is_admin: true,
		tenant_id: '',
	},
	forgotPasswordEmail: '',
	status: {
		loggedIn: status_check(),
	},
	resetSuccess: false,
	permissions: [],
	refetch_permissions: false,
};

const login_reducer = (state: login_state = INITIAL_STATE, action: any): login_state => {
	switch (action.type) {
		case login_action_types.CHANGE_EMAIL:
			return { ...state, email: action.email };
		case login_action_types.CHANGE_STATUS:
			return { ...state, status: action.status };
		case login_action_types.FORGOT_PASSWORD_CHANGE_EMAIL:
			return { ...state, forgotPasswordEmail: action.forgotPasswordEmail };
		case login_action_types.LOGIN_SUCCESS:
			return { ...state, status: { loggedIn: true } };
		case USER_LOGOUT:
			return { ...INITIAL_STATE, status: { loggedIn: false } };
		case login_action_types.RESET_PASSWORD_SUCCESS:
			return { ...state, resetSuccess: action.status };
		case login_action_types.STORE_USER_DETAILS:
			return { ...state, userDetails: action.payload };
		case login_action_types.SET_WIZPAY_URL:
			return { ...state, wizpay_url: action.payload };
		case UPDATE_PERMISSIONS:
			return {
				...state,
				permissions: action.payload,
			};
		case REFETCH_PERMISSIONS:
			return {
				...state,
				refetch_permissions: action.payload,
			};
		default:
			return state;
	}
};

export default login_reducer;
