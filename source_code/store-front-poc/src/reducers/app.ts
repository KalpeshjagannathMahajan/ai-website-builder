import _ from 'lodash';
import { USER_LOGOUT } from 'src/actions/reduxConstants';

const initial_state = {
	user: null,
};

const app = (state = _.cloneDeep(initial_state), action: any) => {
	switch (action.type) {
		case USER_LOGOUT: {
			return { ..._.cloneDeep(initial_state) };
		}

		default:
			return state;
	}
};

export default app;
