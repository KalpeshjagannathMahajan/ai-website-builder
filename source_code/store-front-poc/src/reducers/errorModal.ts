import { AddCardErrorModalData } from 'src/@types/common_types';
import { ADD_CARD_ERROR_MODAL_TYPES } from 'src/actions/reduxConstants';

const initial_state: AddCardErrorModalData = {
	is_modal_visible: false,
	subtitle: null,
	reason: null,
};

const error_modal_reducer = (state = initial_state, action: any) => {
	switch (action.type) {
		case ADD_CARD_ERROR_MODAL_TYPES.SET_MODAL_DATA:
			return {
				...state,
				...action.data,
			};
		default:
			return state;
	}
};

export default error_modal_reducer;
