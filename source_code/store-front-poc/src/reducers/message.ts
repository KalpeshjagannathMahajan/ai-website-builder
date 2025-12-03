import { SHOW_INITIAL_STATE, SHOW_MESSAGE, USER_LOGOUT, USER_SWITCH } from '../actions/reduxConstants';

interface State {
	open: boolean;
	showCross: boolean;
	anchorOrigin: {
		vertical: string;
		horizontal: string;
	};
	autoHideDuration: number;
	onClose: () => void;
	state: string;
	title: string;
	subtitle: string;
	subtitle_font_variant: string;
	showActions: boolean;
	iconSize: string;
	primaryBtnName: string;
	secondryBtnName: string;
}

const INITIAL_STATE: State = {
	open: false,
	showCross: false,
	anchorOrigin: {
		vertical: 'top',
		horizontal: 'center',
	},
	autoHideDuration: 5000,
	onClose: () => {},
	state: 'success',
	title: 'Title 1',
	subtitle: 'Subtitle 1',
	subtitle_font_variant: 'subtitle2',
	showActions: false,
	iconSize: 'large',
	primaryBtnName: 'Submit',
	secondryBtnName: 'Cancel',
};

const message_reducer = (state: State = INITIAL_STATE, action: { type: string; payload: any }) => {
	switch (action.type) {
		case SHOW_MESSAGE:
			return { ...state, ...action.payload };
		case SHOW_INITIAL_STATE:
			return { ...INITIAL_STATE };
		case USER_SWITCH:
		case USER_LOGOUT:
			return { ...INITIAL_STATE };
		default:
			return state;
	}
};

export default message_reducer;
