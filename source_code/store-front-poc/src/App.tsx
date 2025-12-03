/* eslint-disable */
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@mui/material';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider, useSelector, useDispatch } from 'react-redux';
import relativeTime from 'dayjs/plugin/relativeTime';
import './App.css';
import dayjs from 'dayjs';
import lightTheme from './utils/light.theme';
import primaryTheme from './utils/primary.theme';
import store, { persistor, RootState } from './store';
import './i18n/config';
import Toast from './common/@the-source/Toast';
import { AuthRouter, MainRouter, StorefrontRouter } from './utils/RouteNames';
import React, { useEffect, useState } from 'react';
import { set_buyer_toast, set_cart } from 'src/actions/buyer';
import { fetch_user_details, handle_pre_login_tenant_settings } from './actions/login';
import ability from './casl/ability';
import { AbilityBuilder } from '@casl/ability';
import { set_permissions } from './actions/permissions';
import Loading from './screens/Loading/Loading';
import { Grid } from './common/@the-source/atoms';
import { FileStackContextComponent } from './screens/UserDrive/Context/FileStackContext';
import { LicenseManager } from 'ag-grid-enterprise';
import { update_web_to_latest_version } from './actions/version';
import Tracker from '@openreplay/tracker';
import { Mixpanel } from './mixpanel';
import Toaster from './common/CustomToast';
import constants from './utils/constants';
import CustomText from './common/@the-source/CustomText';
import _ from 'lodash';
import MultiTenant from './screens/AuthFlow/MultiTenant/MultiTenant';
import { fetching_pre_login_data } from './actions/preLogin';
import { get_wizhsop_theme_config_settings } from './utils/api_requests/login';
import Events from './utils/events_constants';
import settings from './utils/api_requests/setting';
import i18n from './i18n/config';
import { get_customer_metadata } from './utils/utils';
import {
	set_catalog_products,
	set_edit_catalog_data,
	set_edit_catalog_id,
	set_edit_mode,
	set_is_edit_fetched,
	set_selected_pricelist,
	set_selected_sort,
	update_catalog_mode,
} from './actions/catalog_mode';
import CatalogFactory from './utils/catalog.utils';
import AddCardErrorModal from './common/AddCardErrorModal';
import { RESET_CATALOG_MODE_PARAMS_KEY } from './screens/Presentation/constants';
import usePricelistActions from './hooks/usePricelistActions';
import useWishlist from './hooks/useWishlist';

const { VITE_APP_ENV, VITE_APP_TRACKER_KEY, VITE_APP_REPO } = import.meta.env;
const is_store_front = VITE_APP_REPO === 'store_front';
const is_ultron = VITE_APP_REPO === 'ultron';

const AG_GRID_LICENSE_KEY = import.meta.env.VITE_AG_GRID_LICENSE_KEY ? import.meta.env.VITE_AG_GRID_LICENSE_KEY : '';

LicenseManager.setLicenseKey(AG_GRID_LICENSE_KEY);

dayjs.extend(relativeTime);

const PrimaryComp = () => {
	const [is_loading, set_is_loading] = useState(true);
	const dispatch = useDispatch();
	const buyer_toast = useSelector((state: any) => state?.buyer?.toast);
	const login = useSelector((state: any) => state.login);
	const buyer = useSelector((state: any) => state.buyer);
	const permissions = login.permissions;
	const access_token = useSelector((state: any) => state.persistedUserData.auth_access_token);
	const temp_token = _.get(store.getState(), 'persistedUserData.temp_token', '');
	const is_buyer = !!buyer.buyer_cart;
	const error_modal_data = useSelector((state: RootState) => state?.error_modal);

	const wizshop_settings: any = localStorage.getItem('wizshop_settings');
	const pre_login_settings = JSON.parse(wizshop_settings);
	usePricelistActions();
	useWishlist();

	const defineRulesFor = () => {
		const { can, rules } = new AbilityBuilder();

		if (permissions?.length > 0) {
			permissions.forEach((p: any) => {
				if (p.toggle) {
					can(p?.slug, p?.permissionType);
				}
			});
		}
		set_is_loading(false);
		return rules;
	};

	const handle_initialize_tracker = () => {
		const user_details = login?.userDetails;
		if (VITE_APP_ENV === 'production' && login.status.loggedIn && user_details?.id && is_ultron) {
			const tracker = new Tracker({
				projectKey: VITE_APP_TRACKER_KEY,
				captureExceptions: true,
				captureIFrames: true,
				network: {
					sessionTokenHeader: false,
					capturePayload: true,
					failuresOnly: false,
					ignoreHeaders: false,
					captureInIframes: true,
				},
			});

			tracker
				.start({
					userID: user_details?.email,
					metadata: {
						email: user_details?.email,
						mobile: `${user_details?.country_code} ${user_details?.phone}`,
						isAdmin: user_details?.is_admin,
						userId: user_details?.id,
					},
				})
				.then(() => {
					console.log('Tracker Started');
				})
				.catch((error) => {
					console.error('Tracker failed to start:', error);
				});
		}
	};

	const handle_render_buyer_toaster = () => {
		return (
			<Toaster
				open={buyer_toast.state}
				showCross={true}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				autoHideDuration={5000}
				onClose={() => dispatch(set_buyer_toast(false, '', '', buyer_toast.type))}
				state={buyer_toast.type}
				title={buyer_toast.title}
				subtitle={buyer_toast.sub_title}
				showActions={false}
			/>
		);
	};

	const logoutEvent: any = window.addEventListener('storage', (event) => {
		if (event.key === 'logout-event') {
			window.location.reload();
		}
		if (event.key === 'switch-user') {
			window.location.replace('/');
		}
	});

	useEffect(() => {
		if (login?.userDetails?.tenant_id === 'b424c2df-7fb1-40f4-81d4-0dffa643f070') {
			const script = document.createElement('script');
			script.src = 'https://www.socialintents.com/api/socialintents.1.3.js#2c9faa358d2ed411018d3cfb7e600d79';
			// script.async = true;
			document.head.appendChild(script);
			return () => {
				document.head.removeChild(script);
			};
		}
		handle_initialize_tracker();
	}, [login]);

	useEffect(() => {
		window.addEventListener('storage', logoutEvent);
		return () => {
			window.removeEventListener('storage', logoutEvent);
		};
	}, [logoutEvent]);

	useEffect(() => {
		if (access_token) {
			dispatch<any>(fetch_user_details());
			dispatch<any>(update_web_to_latest_version());
		}
	}, [dispatch, access_token]);

	useEffect(() => {
		if (!access_token) return;
		dispatch<any>(set_permissions());
	}, [dispatch, access_token, login?.refetch_permissions]);

	useEffect(() => {
		if (login.status.loggedIn && !is_buyer && !is_store_front) {
			dispatch<any>(set_cart({ buyer_id: buyer.buyer_id, is_guest_buyer: buyer.is_guest_buyer }));
		}
	}, [login.status.loggedIn, is_buyer]);

	useEffect(() => {
		ability.update(defineRulesFor());
	}, [permissions]);

	const initialize_catalog_states = () => {
		dispatch(update_catalog_mode({ catalog_mode: CatalogFactory.MODE.get_catalog_mode_state() }));
		dispatch(set_catalog_products(CatalogFactory.PRODUCT.get_products()));
		const catalog_id = CatalogFactory.MODE.get_catalog_id();
		if (catalog_id) {
			dispatch(set_edit_catalog_id(catalog_id));
		}
		const edit_catalog_mode = CatalogFactory.MODE.get_edit_catalog_mode();
		if (edit_catalog_mode) {
			const edit_catalog_data = CatalogFactory.MODE.get_catalog_data();
			dispatch(set_edit_mode(edit_catalog_mode));
			dispatch(set_edit_catalog_data(edit_catalog_data));
		}
		const is_edit_fetched = CatalogFactory.MODE.get_is_edit_fetched();
		if (is_edit_fetched) {
			dispatch(set_is_edit_fetched(is_edit_fetched));
		}
		dispatch(set_selected_pricelist(CatalogFactory.MODE.get_selected_pricelist()));
		dispatch(set_selected_sort(CatalogFactory.MODE.get_selected_sort()));
	};
	const customer_metadata = get_customer_metadata();
	useEffect(() => {
		const search_params = new URLSearchParams(window?.location?.search);
		const reset_catalog_mode = search_params?.get(RESET_CATALOG_MODE_PARAMS_KEY);
		if (!reset_catalog_mode) {
			initialize_catalog_states();
		}
		Mixpanel.track(Events.APP_LAUNCHED, {
			page_name: '',
			tab_name: '',
			section_name: '',
			subtab_name: '',
			customer_metadata,
		});
		if (is_store_front) {
			const loading_element = document?.getElementById('loading');
			if (loading_element) {
				loading_element.style.display = 'none';
			}
			dispatch<any>(fetching_pre_login_data());
			if (pre_login_settings?.prelogin_allowed) {
				dispatch<any>(handle_pre_login_tenant_settings());
			}
		}
	}, []);

	const handle_routes = () => {
		const logged_in = login.status.loggedIn;
		if (!_.isNull(temp_token)) {
			return <MultiTenant />;
		}

		const router = is_store_front ? (logged_in ? MainRouter : StorefrontRouter) : logged_in && is_ultron ? MainRouter : AuthRouter;

		return <React.Fragment>{is_loading ? <Loading /> : <RouterProvider router={router} />}</React.Fragment>;
	};

	return (
		<React.Fragment>
			{!is_store_front && constants.ALL_ENV.PRODUCTION !== VITE_APP_ENV && (
				<Grid style={{ backgroundColor: '#FF8282' }}>
					<CustomText type='Caption' style={{ textAlign: 'center', textTransform: 'capitalize' }}>
						{VITE_APP_ENV}
					</CustomText>
				</Grid>
			)}
			{handle_routes()}
			<Toast />
			{handle_render_buyer_toaster()}
			{error_modal_data?.is_modal_visible && <AddCardErrorModal modal_data={error_modal_data} />}
		</React.Fragment>
	);
};

const App = () => {
	const [theme, set_theme] = useState<any>();
	const [font_mapping_data, set_font_mapping_data] = useState();
	const wizshop_settings: any = localStorage.getItem('wizshop_settings');
	const pre_login_settings = JSON.parse(wizshop_settings);

	const handle_theme_rendering = (data: any) => {
		if (is_store_front) {
			set_theme(lightTheme(data));
		} else {
			set_theme(primaryTheme(data));
		}
	};

	const handle_apply_fonts = async () => {
		if (is_store_front) {
			try {
				const response: any = await get_wizhsop_theme_config_settings();
				const data = !_.isEmpty(response?.data) ? response?.data : constants.FALLBACK_CONFIG_SETTINGS;
				set_font_mapping_data(data?.font_mapping);
				handle_theme_rendering(data);
			} catch (err) {
				console.log(err);
			}
		} else {
			const data = constants.FALLBACK_CONFIG_SETTINGS;
			handle_theme_rendering(data);
		}
	};

	const handle_text_configuration = async () => {
		try {
			// if (pre_login_settings?.prelogin_allowed) {
			const response = await settings.get_configuration('web_translations', pre_login_settings?.prelogin_allowed);
			const data = response?.data;

			if (!_.isEmpty(data)) {
				Object.keys(data)?.forEach((lang: any) => {
					i18n.addResourceBundle(lang, 'translation', data[lang]);
				});
				i18n.changeLanguage('en');
			}
			// }
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		handle_text_configuration();

		if (is_store_front) {
			handle_apply_fonts();
		} else {
			const data = constants.FALLBACK_CONFIG_SETTINGS;
			handle_theme_rendering(data);
		}

		const script = document.createElement('script');
		script.src =
			VITE_APP_ENV === 'production'
				? 'https://flex.cybersource.com/microform/bundle/v2/flex-microform.min.js'
				: 'https://testflex.cybersource.com/microform/bundle/v2/flex-microform.min.js';
		script.onload = () => {
			console.log('CS script loaded successfully.');
		};

		script.onerror = () => {
			console.error('Failed to load the CS script.');
		};

		document.head.appendChild(script);

		return () => {
			document.head.removeChild(script);
		};
	}, []);

	return (
		<React.Fragment>
			{theme && (
				<MuiThemeProvider theme={theme}>
					<Provider store={store}>
						<PersistGate loading={null} persistor={persistor}>
							<FileStackContextComponent>
								<PrimaryComp />
							</FileStackContextComponent>
						</PersistGate>
					</Provider>
				</MuiThemeProvider>
			)}
		</React.Fragment>
	);
};

export default App;
