import _ from 'lodash';
import { DELETE_API_RESPONSE, SAVE_API_RESPONSE } from '../actions/reduxConstants';

/*
 - the key name will consist of 2 parts separated by underscore
 - first part will be context of the key and second part will be the name
 - for key with only name will mean the key context is app wide
*/

export const API_RESPONSE_PATHS = {};

const initial_state = {};

const apiResponses = (state = _.cloneDeep(initial_state), action: any) => {
	const { type, path, data } = action;

	switch (type) {
		case SAVE_API_RESPONSE: {
			if (_.get(initial_state, path) === undefined) {
				return state;
			}
			const state_clone = _.cloneDeep(state);
			_.set(state_clone, path, data);
			return state_clone;
		}

		case DELETE_API_RESPONSE: {
			const cur_path_initial_state = _.get(initial_state, path);
			if (cur_path_initial_state === undefined) {
				return state;
			}
			const state_clone = _.cloneDeep(state);
			_.set(state_clone, path, cur_path_initial_state);
			return state_clone;
		}

		default:
			return state;
	}
};

export default apiResponses;
