import _ from 'lodash';
import { DELETE_PERSISTED_DATA, SAVE_PERSISTED_DATA, USER_LOGOUT } from '../actions/reduxConstants';

/*
 - the key name will consist of 2 parts separated by underscore
 - first part will be context of the key and second part will be the name
 - for key with only name will mean the key context is app wide
*/

export const PERSIST_REDUX_PATHS = {
	// auth
	auth_access_token: 'auth_access_token',
	auth_refresh_token: 'auth_refresh_token',
	temp_token: 'temp_token',
};

const initial_state = {
	[PERSIST_REDUX_PATHS.auth_access_token]: null,
	[PERSIST_REDUX_PATHS.auth_refresh_token]: null,
	[PERSIST_REDUX_PATHS.temp_token]: null,
};

const persistedUserData = (state = _.cloneDeep(initial_state), action: any) => {
	const { type, path, data } = action;
	switch (type) {
		case SAVE_PERSISTED_DATA: {
			if (_.get(initial_state, path) === undefined) {
				return state;
			}
			const state_clone = _.cloneDeep(state);
			_.set(state_clone, path, data);
			return state_clone;
		}
		case DELETE_PERSISTED_DATA: {
			const cur_path_initial_state = _.get(initial_state, path);
			if (cur_path_initial_state === undefined) {
				return state;
			}
			const state_clone = _.cloneDeep(state);
			_.set(state_clone, path, cur_path_initial_state);
			return state_clone;
		}
		case USER_LOGOUT: {
			return { ...initial_state };
		}
		default:
			return state;
	}
};

export default persistedUserData;
