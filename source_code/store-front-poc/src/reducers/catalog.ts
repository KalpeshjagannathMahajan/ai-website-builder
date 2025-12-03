import { catalog_data_action_types } from 'src/actions/reduxConstants';

const initialState: any = {
	catalog_data: [],
	paginator: {},
	loader: false,
};

const catalog_reducer = (state = initialState, action: any) => {
	switch (action.type) {
		case catalog_data_action_types.UPDATE_CATALOG_DATA:
			return {
				...state,
				...action.data,
			};
		case catalog_data_action_types.UPDATE_LOADER:
			return {
				...state,
				...action.data,
			};
		default:
			return state;
	}
};

export default catalog_reducer;
