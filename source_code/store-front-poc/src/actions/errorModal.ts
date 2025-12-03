import { AddCardErrorModalData } from 'src/@types/common_types';
import { ADD_CARD_ERROR_MODAL_TYPES } from './reduxConstants';

export const set_error_modal_data = (data: AddCardErrorModalData) => {
	return {
		type: ADD_CARD_ERROR_MODAL_TYPES.SET_MODAL_DATA,
		data,
	};
};
