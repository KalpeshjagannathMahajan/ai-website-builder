import { LINKED_CATALOG } from 'src/actions/reduxConstants';

const initialState: any = {};

const linked_catalog_reducer = (state = initialState, action: any) => {
	switch (action.type) {
		case LINKED_CATALOG.UPDATE_LINKED_CATALOG:
			return {
				...state,
				...action?.data,
			};
		case LINKED_CATALOG.UPDATE_LINKED_CATALOG_DATA:
			return {
				...state,
				...action?.data,
			};
		default:
			return state;
	}
};

export default linked_catalog_reducer;
