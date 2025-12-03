import { REFETCH_PERMISSIONS, UPDATE_PERMISSIONS } from 'src/actions/reduxConstants';
import { Dispatch } from 'redux';
import { get_permissions } from 'src/utils/api_requests/login';
import { IPermission } from 'src/reducers/login';

export const update_permission = (permissions: IPermission[]) => ({
	type: UPDATE_PERMISSIONS,
	payload: permissions,
});

export const refetch_permission = (boolean: boolean) => ({
	type: REFETCH_PERMISSIONS,
	payload: boolean,
});

export const set_permissions = () => async (dispatch: Dispatch) => {
	try {
		const response: any = await get_permissions();

		if (response?.status_code === 200) {
			dispatch(update_permission(response.data.permissions));
		}
		// if (callback) callback();
	} catch (error) {
		console.log(error);
	}
};
