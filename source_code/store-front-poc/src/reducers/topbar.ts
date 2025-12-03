import { USER_LOGOUT, USER_SWITCH } from '../actions/reduxConstants';

interface Breadcrumb {
	id: string | number;
	linkTitle: string;
	link: string;
}

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

const initialState: Breadcrumb[] = is_ultron
	? [{ id: 1, linkTitle: 'Dashboard', link: '/dashboard' }]
	: [{ id: 1, linkTitle: 'Home', link: '/' }];

const breadcrumb_reducer = (state: any = initialState, action: any) => {
	switch (action.type) {
		case 'UPDATE_BREADCRUMBS':
			return { breadcrumbs: action.payload };
		case USER_SWITCH:
		case USER_LOGOUT:
			return { ...initialState };
		default:
			return state;
	}
};

export default breadcrumb_reducer;
