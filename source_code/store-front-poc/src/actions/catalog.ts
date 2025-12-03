import { catalog_data_action_types } from './reduxConstants';

export const update_catalog_data = (data: any) => {
	return {
		type: catalog_data_action_types.UPDATE_CATALOG_DATA,
		data,
	};
};

export const update_catalog_data_loader = (data: any) => {
	return {
		type: catalog_data_action_types.UPDATE_LOADER,
		data,
	};
};
