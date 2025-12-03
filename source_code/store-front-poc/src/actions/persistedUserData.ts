import { DELETE_PERSISTED_DATA, SAVE_PERSISTED_DATA } from './reduxConstants';

export const save_persisted_data = (path: string, data: any) => ({
	type: SAVE_PERSISTED_DATA,
	path,
	data,
});

export const delete_persisted_data = (path: string) => ({
	type: DELETE_PERSISTED_DATA,
	path,
});
