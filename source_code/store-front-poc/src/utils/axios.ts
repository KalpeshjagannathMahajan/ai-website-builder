import axios, { AxiosInstance, AxiosResponse } from 'axios';
import constants from './constants';
import { remove_tokens } from './common';
import _ from 'lodash';
import store from 'src/store';
import types from './types';
import { close_toast, show_toast } from 'src/actions/message';
const { VITE_APP_REPO, VITE_APP_TENANT_ID } = import.meta.env;

export const instance: AxiosInstance = axios.create({
	baseURL: constants.ENDPOINT,
});

let isRefreshing = false;
let refreshSubscribers: ((access: string) => void)[] = [];

let is_store_front = VITE_APP_REPO === 'store_front';
const _window: any = window;
const tenant_id = _window?.tenantId || VITE_APP_TENANT_ID;

if (is_store_front) {
	instance.defaults.headers.channel = 'wizshop';
	instance.defaults.headers['tenant-id'] = tenant_id;
}

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
		if (!tenant_id && is_store_front) {
			handle_show_toast();
			window.location.href = '/';
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

		if (error.response && error.response.status === 401 && !error?.config?.url.includes('users/v1/login')) {
			if (!isRefreshing) {
				isRefreshing = true;

				return axios
					.post(`${constants.REFRESH_TOKEN}`, {
						refresh_token: _.get(store.getState(), 'persistedUserData.auth_access_token'),
						token: _.get(store.getState(), 'persistedUserData.auth_access_token'),
					})
					.then((response) => {
						const access = response.data?.access;
						// const refresh = response.data?.refresh;
						// set_auth_cookies(access, refresh);

						refreshSubscribers.forEach((subscriber) => subscriber(access));
						refreshSubscribers = [];

						return axios(originalRequest);
					})
					.catch((error2) => {
						if (error2.request.responseURL === constants.REFRESH_TOKEN) {
							remove_tokens();
							window.location.href = '/';
						}
						return Promise.reject(error);
					})
					.finally(() => {
						isRefreshing = false;
					});
			} else {
				return new Promise<AxiosResponse>((resolve, reject) => {
					refreshSubscribers.push((access) => {
						originalRequest.headers.Authorization = `Bearer ${access}`;

						axios(originalRequest)
							.then((response) => resolve(response))
							// eslint-disable-next-line @typescript-eslint/no-shadow
							.catch((error) => reject(error));
					});
				});
			}
		} else {
			return Promise.reject(error);
		}
	},
);

export default instance;
