import { Dispatch } from 'redux';
import { get_company_info_api } from 'src/utils/api_requests/login';

export const pre_login_config = (data: any) => {
	return {
		type: 'PRE_LOGIN_CONFIG',
		data,
	};
};

export const set_auth_loading = (data: boolean) => {
	return {
		type: 'SET_AUTH_LOADING',
		data,
	};
};

export const fetching_pre_login_data = () => async (dispatch: Dispatch) => {
	dispatch(set_auth_loading(true));
	try {
		const res: any = await get_company_info_api();
		dispatch(pre_login_config(res?.data));
		dispatch(set_auth_loading(false));
	} catch (err) {
		console.error(err);
		dispatch(set_auth_loading(false));
	}
};
