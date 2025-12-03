import { Dispatch } from 'redux';

import { SHOW_INITIAL_STATE, SHOW_MESSAGE } from './reduxConstants';

let timeout: any;

export const show_toast = (payload: any) => async (dispatch: Dispatch) => {
	clearTimeout(timeout);
	timeout = setTimeout(() => {
		dispatch({ type: SHOW_INITIAL_STATE });
	}, payload.autoHideDuration);
	dispatch({ type: SHOW_MESSAGE, payload });
};

export const close_toast = (email: string) => ({
	type: SHOW_INITIAL_STATE,
	email,
});
