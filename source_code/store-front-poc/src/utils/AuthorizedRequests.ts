import axios, { AxiosInstance, AxiosResponse } from 'axios';
import _ from 'lodash';
import store from 'src/store';
import { PERSIST_REDUX_PATHS } from 'src/reducers/persistedUserData';
import { save_persisted_data } from 'src/actions/persistedUserData';
import constants from 'src/utils/constants';
import { remove_tokens } from 'src/utils/common';
import { logout_click } from 'src/actions/login';
import { close_toast, show_toast } from 'src/actions/message';
import types from './types';
const { VITE_APP_REPO, VITE_APP_TENANT_ID } = import.meta.env;

export const instance: AxiosInstance = axios.create({
	baseURL: constants.ENDPOINT,
	timeout: 3600 * 1000,
});

let isRefreshing = false;
let is_store_front = VITE_APP_REPO === 'store_front';
let refreshSubscribers: ((access: string) => void)[] = [];
const _window: any = window;
const tenant_id = _window?.tenantId || VITE_APP_TENANT_ID;

const handle_show_toast = () => {
	const props = {
		open: true,
		showCross: false,
		anchorOrigin: {
			vertical: types.VERTICAL_TOP,
			horizontal: types.HORIZONTAL_CENTER,
		},
		autoHideDuration: 5000,
		onClose: (event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
			console.log(event);
			if (reason === types.REASON_CLICK) {
				return;
			}
			store.dispatch(close_toast(''));
		},
		state: types.ERROR_STATE,
		title: "Oops! It's not you, it's us.",
		subtitle: 'Tenant ID is not defined',
		showActions: false,
	};

	store.dispatch<any>(
		show_toast({
			...props,
		}),
	);
};

instance.interceptors.request.use(
	(config: any) => {
		const new_state = store.getState();
		const token = _.get(new_state, 'persistedUserData.auth_access_token');

		if (!tenant_id && is_store_front) {
			handle_show_toast();
			setTimeout(() => {
				remove_tokens();
				store.dispatch<any>(logout_click());
				window.location.href = '/';
			}, 100);
		}

		if (token) {
			config.headers.authorization = token;
			config.headers['x-client-id'] = 'WEB';
			config.headers['x-client-version'] = '0.0.1';
			config.headers['x-client-env'] = 'DEV';
		}

		if (is_store_front) {
			config.headers.channel = 'wizshop';
			config.headers['tenant-id'] = tenant_id;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

instance.interceptors.response.use(
	(response: AxiosResponse) => {
		return response;
	},
	(error) => {
		const originalRequest = error.config;

		if (error.response && error.response.status === 401) {
			if (!isRefreshing) {
				isRefreshing = true;

				const token = _.get(store.getState(), 'persistedUserData.auth_access_token');
				const refresh_token = _.get(store.getState(), 'persistedUserData.auth_refresh_token');

				if (!token && !refresh_token) {
					return;
				}

				return axios
					.post(`${constants.REFRESH_TOKEN}`, {
						token,
						refresh_token,
					})
					.then((response) => {
						store.dispatch(save_persisted_data(PERSIST_REDUX_PATHS.auth_access_token, response?.data?.token));
						store.dispatch(save_persisted_data(PERSIST_REDUX_PATHS.auth_refresh_token, response?.data?.refresh_token));

						originalRequest.headers.authorization = response?.data?.token;

						refreshSubscribers.forEach((subscriber) => subscriber(response?.data?.token));
						refreshSubscribers = [];
						localStorage.setItem('logout-event', `logout${Math.random()}`);
						return axios(originalRequest);
					})
					.catch((error2) => {
						if (error2.request.responseURL === constants.REFRESH_TOKEN) {
							remove_tokens();
							store.dispatch<any>(logout_click());
						}
						return Promise.reject(error);
					})
					.finally(() => {
						isRefreshing = false;
					});
			} else {
				return new Promise<AxiosResponse>((resolve, reject) => {
					refreshSubscribers.push((access) => {
						originalRequest.headers.authorization = access;

						axios(originalRequest)
							.then((response) => resolve(response))
							.catch((error3) => reject(error3));
					});
				});
			}
		} else {
			return Promise.reject(error);
		}
	},
);

export default instance;
