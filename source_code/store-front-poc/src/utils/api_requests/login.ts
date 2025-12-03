import constants from '../constants';
import axios from '../axios';
import utils from '../utils';
import _ from 'lodash';

export const enable2Fa = (): void => {};

export const validate2Fa = (): void => {};

export const deactivate2Fa = (): void => {};

export const login = (data: any): Promise<any> => {
	return axios.post(constants.LOGIN, data);
};
export const start_trial = (data: any): Promise<any> => {
	return axios.post(constants.START_TRIAL, data);
};

export const switch_tenant = (access_token: string, data: any): Promise<any> => {
	if (!_.isEmpty(access_token))
		return utils.request({
			url: constants.SWITCH_TENANT,
			data,
			method: 'POST',
			headers: {
				Authorization: access_token,
			},
		});
	return axios.post(constants.SWITCH_TENANT, data);
};

export const set_password = (data: any, uid: string, token: string): Promise<any> => {
	return axios.post(`${constants.RESET_PASSWORD}${uid}/${token}`, data);
};

export const reset_password = (data: any): Promise<any> => {
	return axios.post(constants.SET_PASSWORD, data);
};

export const get_short_url = (token: any) => {
	return axios.get(`${constants.SHORT_URL}${token}`);
};

export const refreshToken = (data: any): Promise<any> => {
	return axios.post(constants.REFRESH_TOKEN, data);
};

export const verifyToken = (data: any): Promise<any> => {
	return axios.post(constants.VERIFY_TOKEN, data);
};

export const logout_user = (data: any): Promise<any> => {
	return axios.post(constants.LOGOUT_API, data);
};

export const get_user = (access_token = ''): Promise<any> => {
	if (!_.isEmpty(access_token))
		return utils.request({
			url: constants.GET_USER,
			method: 'GET',
			headers: {
				Authorization: access_token,
			},
		});
	return utils.request({ method: 'GET', url: constants.GET_USER });
};

export const get_wizshop_create_buyer_form = (): Promise<any> => {
	return axios.get(constants.GET_WIZSHOP_BUYER_FORM);
};

export const get_wizshop_buyer_sections = (): Promise<any> => {
	return axios.get(constants.GET_WIZSHOP_BUYER_SECTION);
};

export const add_image = (form_data: any, config: any): Promise<any> => {
	return axios.post(constants.GET_WIZSHOP_UPLOAD_FILE, form_data, config);
};

export const login2Fa = (): void => {};

export const blacklistToken = (): void => {};

export const get_permissions = () => {
	return utils.request({
		method: 'GET',
		url: constants.GET_PERMISSIONS,
		// mock_id: MOCK_IDS.get_permissions,
		// mock: true,
	});
};

export const free_trails = (data: any): Promise<any> => {
	return utils.request({
		url: '/wizshop/v1/leads/trial',
		method: 'POST',
		data,
	});
};

export const get_company_info_api = (): Promise<any> => {
	return utils.request({
		url: 'wizshop/v1/configuration/wizshop_settings',
		method: 'GET',
	});
};

export const create_new_lead = (data: any): Promise<any> => {
	return utils.request({
		url: 'wizshop/v1/leads',
		method: 'POST',
		data,
	});
};

export const get_wizhsop_theme_config_settings = () => {
	return utils.request({
		url: 'wizshop/v1/configuration/wizshop_theme_config_settings',
		method: 'GET',
	});
};
