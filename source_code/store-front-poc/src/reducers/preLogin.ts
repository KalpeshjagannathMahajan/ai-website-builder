const initialState = {
	auth_loading: false,
};

const pre_login_config = (state = initialState, action: any) => {
	switch (action?.type) {
		case 'PRE_LOGIN_CONFIG':
			return { ...state, ...action?.data };
		case 'SET_AUTH_LOADING':
			return { ...state, auth_loading: action?.data };
		default:
			return state;
	}
};

export default pre_login_config;
