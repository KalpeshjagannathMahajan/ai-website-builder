import {
	SHOW_DOCUMENT_TOAST,
	SHOW_DOCUMENT_TOAST_MESSAGE,
	SHOW_DOCUMENT_ALERT,
	SET_DOCUMENT_DATA,
	UPDATE_DOCUMENT_DATA,
	TOGGLE_EDIT_QUOTE,
	TOGGLE_EDIT_PENDING_ORDER,
} from './reduxConstants';

interface Document {
	title: string;
	sub: string;
	is_custom?: boolean;
	show_icon?: boolean;
}

export const show_document_toast = (state: boolean) => ({
	type: SHOW_DOCUMENT_TOAST,
	payload: state,
});

export const toggle_edit_quote = (state: boolean) => ({
	type: TOGGLE_EDIT_QUOTE,
	payload: state,
});

export const toggle_edit_pending_order = (state: boolean) => ({
	type: TOGGLE_EDIT_PENDING_ORDER,
	payload: state,
});

export const show_document_toast_message = (data: Document) => ({
	type: SHOW_DOCUMENT_TOAST_MESSAGE,
	payload: data,
});

export const show_document_alert = (data: boolean) => ({
	type: SHOW_DOCUMENT_ALERT,
	payload: data,
});

export const set_document_data = (data: any) => ({
	type: SET_DOCUMENT_DATA,
	payload: data,
});

export const update_document_data = (data: any) => ({
	type: UPDATE_DOCUMENT_DATA,
	payload: data,
});
