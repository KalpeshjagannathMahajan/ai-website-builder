import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension';

import persistedUserData from './reducers/persistedUserData';
import app from './reducers/app';
import constants from './utils/constants';
import login_reducer from './reducers/login';
import message_reducer from './reducers/message';
import breadcrumb_reducer from './reducers/topbar';
import cart_reducer from './reducers/cart';
import setting_reducer from './reducers/setting';
import buyer_reducer from './reducers/buyer';
import dashboard_reducer from './reducers/dashboard';
import document_reducer from './reducers/document';
import notifications_reducer from './reducers/notifications';
import config_reducer from './reducers/config';
import version_reducer from './reducers/version';
import nylas_config from './reducers/nylas';
import pre_login_config from './reducers/preLogin';
import linked_catalog_reducer from './reducers/linked_catalogs';
import catalog_reducer from './reducers/catalog';
import json_rules from './reducers/json_rule';
import insights from './reducers/insight';
import catalog_mode_reducer from './reducers/catalog_mode';
import error_modal_reducer from './reducers/errorModal';
import wishlist_reducer from './reducers/wishlist';

const { VITE_APP_ENV } = import.meta.env;

const root_reducer: any = combineReducers({
	app,
	login: login_reducer,
	linked_catalog: linked_catalog_reducer,
	message: message_reducer,
	breadcrumb: breadcrumb_reducer,
	persistedUserData,
	cart: cart_reducer,
	buyer: buyer_reducer,
	dashboard: dashboard_reducer,
	document: document_reducer,
	notifications: notifications_reducer,
	configSettings: config_reducer,
	settings: setting_reducer,
	version: version_reducer,
	nylas: nylas_config,
	preLogin: pre_login_config,
	catalog: catalog_reducer,
	json_rules,
	insights,
	catalog_mode: catalog_mode_reducer,
	error_modal: error_modal_reducer,
	wishlist: wishlist_reducer,
});

const persistConfig = {
	key: 'root',
	version: 1,
	storage,
	blacklist: Object.keys(root_reducer),
	whitelist: ['persistedUserData', 'buyer'],
	stateReconciler: autoMergeLevel2,
};

const persisted_reducer = persistReducer(persistConfig, root_reducer);

const middlewares = [thunk];

const store = createStore(
	persisted_reducer,
	VITE_APP_ENV === constants.ALL_ENV.PRODUCTION ? applyMiddleware(...middlewares) : composeWithDevTools(applyMiddleware(...middlewares)),
);

export type RootState = ReturnType<typeof root_reducer>;

export const persistor = persistStore(store);

export default store;
