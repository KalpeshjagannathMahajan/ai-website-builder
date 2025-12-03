import { LINKED_CATALOG } from './reduxConstants';

export const update_linked_catalog = (data: any) => {
	return {
		type: LINKED_CATALOG.UPDATE_LINKED_CATALOG,
		data,
	};
};

export const update_linked_catalog_data = (data: any) => {
	return {
		type: LINKED_CATALOG.UPDATE_LINKED_CATALOG_DATA,
		data,
	};
};
