/* eslint-disable @typescript-eslint/no-unused-vars */
import { debounce } from 'lodash';
import { Dispatch } from 'redux';
import i18next from 'src/i18n/config';
// import { useNavigate } from 'react-router-dom';
import { login_action_types, USER_LOGOUT, USER_SWITCH } from './reduxConstants';
import { login, set_password, reset_password, get_user, logout_user } from '../utils/api_requests/login';
import { close_toast, show_toast } from './message';
import types from 'src/utils/types';
import { delete_persisted_data, save_persisted_data } from './persistedUserData';
import { PERSIST_REDUX_PATHS } from 'src/reducers/persistedUserData';
import * as Sentry from '@sentry/react';
import _ from 'lodash';
import store from 'src/store';
import { cartContainerConfig, initializeSettings, inventoryIconConfig } from './setting';
import settings from 'src/utils/api_requests/setting';
import utils from 'src/utils/utils';
import { Mixpanel } from 'src/mixpanel';
import { set_buyer } from './buyer';
import { INVENTORY_ICON_META } from 'src/common/@the-source/molecules/Inventory/constants';
import Events from 'src/utils/events_constants';
import { product_listing } from 'src/utils/api_requests/productListing';
import { DEFAULT_JSON_RULE_PAYMENT_ADDRESS, DEFAULT_SSRM_CONFIG } from 'src/screens/Settings/utils/constants';
import { json_rules } from './json_rule';
import constants from 'src/utils/constants';
import wiz_ai from 'src/utils/api_requests/wizAi';
import { insight_config, insight_list, insight_version } from './insight';
import buyer from 'src/utils/api_requests/buyer';
import { json_cart_calc_rule_config } from 'src/utils/CartRule';
import catalogs from 'src/utils/api_requests/catalog';
import { update_linked_catalog } from './linked_catalog';
import { master_discount_rule } from 'src/utils/DiscountEngineRule';
import { default_cart_grouping } from 'src/screens/Settings/utils/defaultSettings/cart/cart_grouping';

const { PAYMENTS_KEY } = constants;

const { VITE_APP_REPO } = import.meta.env;
const is_storefront = VITE_APP_REPO === 'store_front';
const is_ultron = VITE_APP_REPO === 'ultron';

export const reset_status = (status: boolean | null) => ({
	type: login_action_types.RESET_PASSWORD_SUCCESS,
	status,
});

export const change_email = (email: string) => ({
	type: login_action_types.CHANGE_EMAIL,
	email,
});

export const login_success = () => ({
	type: login_action_types.LOGIN_SUCCESS,
});
export const user_logout = () => ({
	type: USER_LOGOUT,
});
export const user_switch = () => ({
	type: USER_SWITCH,
});
export const change_status = (loggedIn: boolean) => ({
	type: login_action_types.CHANGE_STATUS,
	loggedIn,
});

const update_local_storage = (data: any) => {
	if (is_storefront) localStorage.setItem('UserDetails', JSON.stringify(data));
};

const fetch_insights = async (dispatch: any) => {
	try {
		const [list_response, version_response, sorting_response]: any = await Promise.all([
			wiz_ai.get_list(),
			wiz_ai.get_latest_version(),
			wiz_ai.get_insight_config(),
		]);
		if (list_response?.data) {
			dispatch(insight_list(list_response?.data));
		}

		if (version_response?.data) {
			dispatch(insight_version(version_response?.data?.version));
		}
		if (sorting_response?.data) {
			dispatch(insight_config(sorting_response?.data));
			localStorage.setItem('insights_region', JSON.stringify(sorting_response?.data?.filter));
		}
	} catch (e) {
		console.error(e);
	}
};

const get_linked_catalog = async (dispatch: any, buyer_id: any) => {
	try {
		const { status_code, data }: any = await catalogs.get_catalog_list(buyer_id);
		if (status_code === 200) {
			const default_catalog = _.find(data, (_p: any) => _p?.is_default === true);
			dispatch<any>(update_linked_catalog({ label: default_catalog?.label, value: default_catalog?.value }));
		}
	} catch (err) {
		console.error(err);
	}
};

const handle_fetch_tenant_settings = async (dispatch: any) => {
	const key = is_storefront ? 'wizshop_tenant_settings' : 'tenant_settings';
	const cart_grouping_key = is_storefront ? 'wizshop_cart_grouping_config' : 'cart_grouping_config';
	const discount_rule_key = is_storefront ? 'wizshop_master_discount_rule' : 'master_discount_rule';
	try {
		const [
			setting_response,
			container_response,
			inventory_response,
			product_card_config,
			all_card_configs,
			cart_grouping_config,
			default_ssrm_reposonse,
			product_listing_config,
			json_rule_payment_response,
			json_rule_cart_calculations_response,
			json_rule_cart_validation_response,
			json_master_discount_rule_response,
			json_rule_charges_config_response,
			document_line_item_config,
			presentation_config,
			display_priority,
			details_buyer_form,
		]: any = await Promise.all([
			settings.get_configuration(key),
			settings.get_containers_data(),
			settings.get_inventory_icon(),
			settings.get_product_card_config(),
			settings.get_all_card_config(),
			settings.get_configuration(cart_grouping_key),
			settings.get_default_tenant_config('default_ssrm_config'),
			product_listing.get_listing_configuration('product_listing_page_config_web'),
			settings.get_default_tenant_config('json_rule_payment_address'),
			settings.get_default_tenant_config('json_rule_cart_calculations'),
			settings.get_default_tenant_config('json_cart_rule_validation'),
			settings.get_default_tenant_config(discount_rule_key),
			settings.get_default_tenant_config('json_rule_charges_config'),
			settings.get_configuration('document_line_item_config'),
			settings.get_configuration('presentation_system_config'),
			settings.get_default_tenant_config('display_priority'),
			buyer.get_main_buyer_details_form('create'),
		]);

		let setting = {};
		const excluded_keys = _.get(setting_response, 'data.exclude_wizshop_configs', []);

		if (setting_response?.data) {
			setting = {
				...setting,
				...setting_response?.data,
				is_tenant_settings_fetched: true,
				is_payments_enabled: !_.includes(setting_response?.data?.excluded_permission_modules, PAYMENTS_KEY),
				product_card_config: product_card_config?.data,
				all_cards_config: all_card_configs?.data,
				default_ssrm_config: default_ssrm_reposonse?.data || DEFAULT_SSRM_CONFIG,
				document_line_item_config: document_line_item_config?.data,
			};
		}
		if (container_response?.data?.tenant_container_enabled === true) {
			dispatch(cartContainerConfig(container_response?.data));
		} else {
			dispatch(cartContainerConfig({ tenant_container_enabled: false }));
		}
		if (json_rule_payment_response?.status_code === 200) {
			dispatch(
				json_rules({
					payment_address_rule: !_.isEmpty(json_rule_payment_response?.data)
						? json_rule_payment_response?.data
						: DEFAULT_JSON_RULE_PAYMENT_ADDRESS,
					cart_calculations_rule: !_.isEmpty(json_rule_cart_calculations_response?.data)
						? json_rule_cart_calculations_response?.data
						: json_cart_calc_rule_config,
					master_discount_rule: !_.isEmpty(json_master_discount_rule_response?.data)
						? json_master_discount_rule_response?.data
						: master_discount_rule,
					cart_validation_rule: !_.isEmpty(json_rule_cart_validation_response?.data) ? json_rule_cart_validation_response?.data : {},
					json_rule_charges_config: !_.isEmpty(json_rule_charges_config_response?.data) ? json_rule_charges_config_response?.data : {},
				}),
			);
		}
		if (inventory_response?.data) {
			dispatch(inventoryIconConfig(inventory_response?.data));
		} else {
			dispatch(inventoryIconConfig(INVENTORY_ICON_META));
		}
		if (!setting_response?.data?.excluded_permission_modules?.includes('WizAI')) {
			fetch_insights(dispatch);
		}
		if (cart_grouping_config?.status_code === 200) {
			if (!_.includes(excluded_keys, 'cart_grouping_config')) {
				setting = { ...setting, cart_grouping_config: cart_grouping_config?.data || default_cart_grouping };
			}
		}

		if (product_listing_config?.status_code === 200) {
			const _rails = _.sortBy(product_listing_config?.data?.rails, 'priority');
			setting = {
				...setting,
				product_listing_config: {
					filters: product_listing_config?.data?.filters,
					config: _rails,
					sorts: product_listing_config?.data?.sorting,
					search_in_config: product_listing_config?.data?.search_in_config,
					global_sorts: product_listing_config?.data?.global_sorting,
					default_filters: product_listing_config?.data?.default_filters,
				},
			};
		}
		if (presentation_config?.status_code === 200) {
			setting = {
				...setting,
				presentation_config: presentation_config?.data,
			};
		}

		if (display_priority?.status_code === 200) {
			setting = { ...setting, display_priority: display_priority?.data };
		}

		if (details_buyer_form?.status_code === 200) {
			setting = { ...setting, details_buyer_form: details_buyer_form?.data };
		}

		dispatch(initializeSettings(setting));
	} catch (error) {
		console.error(error);
	}
};

export const show_login_toast = (dispatch: any, email: any) => {
	const handle_response_toast_close = () => {
		dispatch(close_toast(email));
	};

	const message = {
		open: true,
		showCross: is_storefront,
		anchorOrigin: {
			vertical: types.VERTICAL_TOP,
			horizontal: types.HORIZONTAL_CENTER,
		},
		autoHideDuration: 5000,
		onClose: handle_response_toast_close,
		state: types.SUCCESS_STATE,
		title: types.SUCCESS_TITLE,
		subtitle: i18next.t('AuthFlow.Login.Success'),
		showActions: false,
	};
	dispatch(show_toast(message));
};

export const fetch_user_details = () => async (dispatch: any) => {
	try {
		const response = await get_user();
		if (response.status === 200) {
			dispatch({
				type: login_action_types.STORE_USER_DETAILS,
				payload: response,
			});
			update_local_storage(response);
			Sentry.setUser({
				email: response?.email,
				id: response?.id,
			});
			dispatch(login_success());
			handle_fetch_tenant_settings(dispatch);
			utils.handle_connected_account(dispatch);
			const { email, first_name, last_name, phone, id, tenant_id, catalogs_access = [], buyer_id } = response;
			Mixpanel.register({
				email,
				first_name,
				last_name,
				phone,
				distinct_id: id,
				tenant_id,
				user_id: id,
			});
			Mixpanel.track(Events.LOGIN_COMPLETED, {
				page_name: 'login_page',
				tab_name: '',
				section_name: '',
			});

			if (is_storefront) {
				dispatch<any>(set_buyer({ buyer_id: buyer_id || '', is_guest_buyer: false }));
				get_linked_catalog(dispatch, buyer_id);
				return;
			} else {
				utils.handle_connected_account(dispatch);
				return;
			}
		}
	} catch (error) {
		localStorage.clear();
		sessionStorage.clear();
		localStorage.setItem('logout-event', `logout${Math.random()}`);
		dispatch(delete_persisted_data(PERSIST_REDUX_PATHS.auth_access_token));
		dispatch(user_logout());
		console.error('Error fetching user details:', error);
		Mixpanel.track(Events.LOGIN_FAILED, {
			page_name: 'login_page',
			tab_name: '',
			section_name: '',
		});
	}
};

export const handle_pre_login_tenant_settings = () => async (dispatch: Dispatch) => {
	try {
		const [inventory_response, product_listing_config, product_card_config, all_card_configs]: any = await Promise.all([
			settings.get_inventory_icon(),
			product_listing.get_listing_configuration('product_listing_page_config_web'),
			settings.get_configuration('product_card_config', true),
			settings.get_configuration('card_template_setting', true),
		]);
		let setting = {};
		if (inventory_response?.data) {
			dispatch(inventoryIconConfig(inventory_response?.data));
		} else {
			dispatch(inventoryIconConfig(INVENTORY_ICON_META));
		}

		if (product_listing_config?.status_code === 200) {
			const _rails = _.sortBy(product_listing_config?.data?.rails, 'priority');
			setting = {
				...setting,
				product_card_config: product_card_config?.data,
				all_cards_config: all_card_configs?.data,
				product_listing_config: {
					filters: product_listing_config?.data?.filters,
					config: _rails,
					sorts: product_listing_config?.data?.sorting,
					search_in_config: product_listing_config?.data?.search_in_config,
					global_sorts: product_listing_config?.data?.global_sorting,
					default_filters: product_listing_config?.data?.default_filters,
				},
			};
		}

		dispatch(initializeSettings(setting));
	} catch (error) {
		console.error(error);
	}
};

export const handle_multi_tenant = async (dispatch: any, token: string) => {
	try {
		dispatch(save_persisted_data(PERSIST_REDUX_PATHS.temp_token, token));
		const response = await get_user(token);

		if (response.status === 200) {
			dispatch({
				type: login_action_types.STORE_USER_DETAILS,
				payload: response,
			});
		}
	} catch (e) {
		console.error(e);
	}
};

export const login_action = (payload: { email: string; password: string; set_loading: any }) => async (dispatch: any) => {
	try {
		const { email, password, set_loading } = payload;
		const handle_close_toast = (_event: React.SyntheticEvent<Element, Event>, reason: string) => {
			if (reason === types.REASON_CLICK) {
				return;
			}
			dispatch(close_toast(email));
		};
		if (email.length === 0 || password.length === 0) {
			return dispatch(
				show_toast({
					open: true,
					showCross: !is_ultron,
					anchorOrigin: {
						vertical: types.VERTICAL_TOP,
						horizontal: types.HORIZONTAL_CENTER,
					},
					autoHideDuration: 5000,
					onClose: (event: React.SyntheticEvent<Element, Event>, reason: string) => handle_close_toast(event, reason),
					state: types.ERROR_STATE,
					title: types.ERROR_TITLE,
					subtitle: i18next.t('AuthFlow.Login.ErrorEmptyField'),
					showActions: false,
				}),
			);
		}

		//TODO: Not needed for now, commenting
		// else if (password.length < 8) {
		// 	return dispatch(
		// 		show_toast({
		// 			open: true,
		// 			showCross: false,
		// 			anchorOrigin: {
		// 				vertical: types.VERTICAL_TOP,
		// 				horizontal: types.HORIZONTAL_CENTER,
		// 			},
		// 			autoHideDuration: 5000,
		// 			onClose: (event: React.SyntheticEvent<Element, Event>, reason: string) => handle_close_toast(event, reason),
		// 			state: types.ERROR_STATE,
		// 			title: types.ERROR_TITLE,
		// 			subtitle: types.ERROR_SUBTITLE_INVALID_PASS,
		// 			showActions: false,
		// 		}),
		// 	);
		// }

		const response = await login(payload);
		const { token = '', refresh_token = '', is_tenant_selection_required = false } = response?.data;
		set_loading(false);

		const handle_response_toast_close = () => {
			dispatch(close_toast(payload.email));
		};
		const message = {
			open: true,
			showCross: !is_ultron,
			anchorOrigin: {
				vertical: types.VERTICAL_TOP,
				horizontal: types.HORIZONTAL_CENTER,
			},
			autoHideDuration: 5000,
			onClose: handle_response_toast_close,
			state: types.SUCCESS_STATE,
			title: types.SUCCESS_TITLE,
			subtitle: i18next.t('AuthFlow.Login.Success'),
			showActions: false,
		};

		if (response?.data?.token) {
			// dispatch(show_toast(message));
			dispatch(save_persisted_data(PERSIST_REDUX_PATHS.auth_access_token, response?.data?.token));
			dispatch(save_persisted_data(PERSIST_REDUX_PATHS.auth_refresh_token, response?.data?.refresh_token));
			if (is_storefront) {
				setTimeout(() => {
					const origin = window.location.origin;
					const prev_url: any = localStorage.getItem('prev_url');
					const redirect_url = prev_url ? `${origin}${prev_url}` : origin;
					localStorage.removeItem('prev_url');
					// window.location.href = redirect_url;
					window.history.pushState(null, '', '/'); // Push a placeholder state
					window.location.replace(redirect_url);
					// else {
					// 	const updated_url = `${origin}${window.location.pathname}${window.location.search}`;
					// 	window.location.href = updated_url;
					// }
					dispatch(login_success());
				}, 1200);
			} else if (is_ultron) {
				if (is_tenant_selection_required) {
					handle_multi_tenant(dispatch, token);
				} else {
					dispatch(login_success());
				}
			}
			localStorage.setItem('logout-event', `logout${Math.random()}`);
			show_login_toast(dispatch, email);
		}
	} catch (error: any) {
		payload.set_loading(false);
		const handle_error_toast_close = (_event: React.SyntheticEvent<Element, Event>, reason: string, username: string) => {
			if (reason === types.REASON_CLICK) {
				return;
			}
			dispatch(close_toast(username));
		};

		const errorMessage = error?.response?.data?.message || i18next.t('AuthFlow.Login.ErrorInvalidCredentials');

		const message = {
			open: true,
			showCross: !is_ultron,
			anchorOrigin: {
				vertical: types.VERTICAL_TOP,
				horizontal: types.HORIZONTAL_CENTER,
			},
			autoHideDuration: 5000,
			onClose: (event: React.SyntheticEvent<Element, Event>, reason: string) => handle_error_toast_close(event, reason, payload.email),
			state: types.ERROR_STATE,
			title: types.ERROR_TITLE,
			subtitle: errorMessage,
			showActions: false,
		};
		dispatch(show_toast(message));
		console.error(error.error);
		Mixpanel.track(Events.LOGIN_FAILED, {
			message: errorMessage,
			status_code: error?.response?.status,
			email: payload?.email,
			page_name: 'login_page',
			tab_name: '',
			section_name: '',
		});
	}
};

export const debounced_login_action = debounce((payload: any) => {
	return (dispatch: any) => {
		dispatch(login_action(payload));
	};
}, 1000);

export const forgot_password_action = (payload: any) => async (dispatch: any) => {
	try {
		await reset_password(payload);
		const handle_forgot_password_toast_close = () => {
			dispatch(close_toast(payload));
		};
		const message = {
			open: true,
			showCross: !is_ultron,
			anchorOrigin: {
				vertical: types.VERTICAL_TOP,
				horizontal: types.HORIZONTAL_CENTER,
			},
			autoHideDuration: 5000,
			onClose: handle_forgot_password_toast_close,
			state: types.SUCCESS_STATE,
			title: types.SUCCESS_TITLE,
			subtitle: i18next.t('AuthFlow.ForgotPassword.Success'),
			showActions: false,
		};
		// if (window.location.href.includes(types.LOCAL_HOST) || window.location.href.includes(types.VERCEL_APP)) {
		// 	// TODO: we can either use .then() or async await | give a callback function here
		// 	// navigate('/reset-password/1/1');
		// 	// window.open(`${window.location.origin}/reset-password/1/1`);
		// }
		Mixpanel.track(Events.RESET_LINK_SUCCESS, {
			email: payload?.email,
			page_name: 'reset_password_page',
			tab_name: '',
			section_name: '',
		});
		dispatch(show_toast(message));
	} catch (error: any) {
		const handle_debounced_login_action = (_event: React.SyntheticEvent<Element, Event>, reason: string) => {
			if (reason === types.REASON_CLICK) {
				return;
			}
			dispatch(close_toast(payload));
		};
		const message = {
			open: true,
			showCross: !is_ultron,
			anchorOrigin: {
				vertical: types.VERTICAL_TOP,
				horizontal: types.HORIZONTAL_CENTER,
			},
			autoHideDuration: 5000,
			onClose: (event: React.SyntheticEvent<Element, Event>, reason: string) => handle_debounced_login_action(event, reason),
			state: types.ERROR_STATE,
			title: types.ERROR_TITLE,
			subtitle: error.error || i18next.t('AuthFlow.ResetPassword.ErrorUnableToReset'),
			showActions: false,
		};
		dispatch(show_toast(message));
		Mixpanel.track(Events.RESET_LINK_FAILED, {
			message: error?.response?.data?.message,
			status_code: error?.response?.status,
			email: payload?.email,
			page_name: 'reset_password_page',
			tab_name: '',
			section_name: '',
		});
		console.error(error);
	}
};

export const reset_password_action = (payload: any, uid: string, token: string) => async (dispatch: any) => {
	try {
		const response = await set_password(payload, uid, token);
		if (response?.status === 200) {
			const handle_reset_password_toast_close = () => {
				dispatch(close_toast(payload));
			};
			const message = {
				open: true,
				showCross: !is_ultron,
				anchorOrigin: {
					vertical: types.VERTICAL_TOP,
					horizontal: types.HORIZONTAL_CENTER,
				},
				autoHideDuration: 5000,
				onClose: handle_reset_password_toast_close,
				state: types.SUCCESS_STATE,
				title: types.SUCCESS_TITLE,
				subtitle: i18next.t('AuthFlow.ResetPassword.Success'),
				showActions: false,
			};
			dispatch(show_toast(message));
			dispatch(reset_status(true));
		}
	} catch (error: any) {
		const handle_error_reset_password_toast_close = (_event: React.SyntheticEvent<Element, Event>, reason: string) => {
			if (reason === types.REASON_CLICK) {
				return;
			}
			dispatch(close_toast(payload));
		};
		const message = {
			open: true,
			showCross: !is_ultron,
			anchorOrigin: {
				vertical: types.VERTICAL_TOP,
				horizontal: types.HORIZONTAL_CENTER,
			},
			autoHideDuration: 5000,
			onClose: (event: React.SyntheticEvent<Element, Event>, reason: string) => handle_error_reset_password_toast_close(event, reason),
			state: types.ERROR_STATE,
			title: types.ERROR_TITLE,
			subtitle: error?.response?.data?.message || i18next.t('AuthFlow.ResetPassword.ErrorUnableToReset'),
			showActions: false,
		};
		dispatch(show_toast(message));
		console.error(error);
	}
};

export const logout_click = () => async (dispatch: Dispatch) => {
	try {
		const token = _.get(store.getState(), 'persistedUserData.auth_access_token');
		logout_user({ token });
		dispatch(user_logout());
		dispatch(delete_persisted_data(PERSIST_REDUX_PATHS.auth_access_token));
		localStorage.clear();
		sessionStorage.clear();
		localStorage.setItem('logout-event', `logout${Math.random()}`);

		Mixpanel.track(Events.LOGOUT_BUTTON_CLICKED, {
			page_name: '',
			tab_name: '',
			section_name: '',
		});
		Mixpanel.reset();

		// utils.logout();
		// delete_all_cookies(navigate);
	} catch (error) {
		console.log(error);
	}
};

export const forgot_password_email_action = (forgotPasswordEmail: string) => ({
	type: login_action_types.FORGOT_PASSWORD_CHANGE_EMAIL,
	forgotPasswordEmail,
});

export const set_wizpay_url = (url: string) => ({
	type: login_action_types.SET_WIZPAY_URL,
	payload: url,
});
