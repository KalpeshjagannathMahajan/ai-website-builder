import { uniq, without, includes } from 'lodash';
import CatalogFactory from 'src/utils/catalog.utils';
import { catalog_mode_action_types } from 'src/actions/reduxConstants';

const initial_state = {
	catalog_mode: false,
	catalog_products_length: 0,
	catalog_products: [],
	catalog_selected_pricelist: {},
	catalog_selected_sort: {},
	edit_mode: false,
	edit_catalog_id: null,
	is_edit_fetched: false,
	edit_catalog_data: null,
	price_lists: [],
};

const catalog_mode_reducer = (state = initial_state, action: any) => {
	let updated_products = [];

	switch (action.type) {
		case catalog_mode_action_types.UPDATE_CATALOG_MODE:
			CatalogFactory.MODE.update_catalog_mode_state(action.data.catalog_mode);
			return {
				...state,
				catalog_mode: action.data.catalog_mode,
			};
		case catalog_mode_action_types.UPDATE_PRODUCT_LENGTH:
			return {
				...state,
				catalog_products_length: action.data.catalog_products_length,
			};

		case catalog_mode_action_types.ADD_MULTIPLE_PRODUCTS:
			updated_products = uniq([...state.catalog_products, ...action.data]);
			break;

		case catalog_mode_action_types.REMOVE_MULTIPLE_PRODUCTS:
			updated_products = without(state.catalog_products, ...action.data);
			break;

		case catalog_mode_action_types.ADD_SINGLE_PRODUCT:
			updated_products = includes(state.catalog_products, action.data) ? state.catalog_products : [...state.catalog_products, action.data];
			break;

		case catalog_mode_action_types.REMOVE_SINGLE_PRODUCT:
			updated_products = without(state.catalog_products, action.data);
			break;

		case catalog_mode_action_types.SET_PRODUCTS:
			updated_products = action.data;
			break;

		case catalog_mode_action_types.REMOVE_ALL_PRODUCTS:
			updated_products = [];
			break;

		case catalog_mode_action_types.SET_SELECTED_PRICELIST:
			CatalogFactory.MODE.set_selected_pricelist(action.data);
			return {
				...state,
				catalog_selected_pricelist: action.data,
			};
		case catalog_mode_action_types.SET_SELECTED_SORT:
			CatalogFactory.MODE.set_selected_sort(action.data);
			return {
				...state,
				catalog_selected_sort: action.data,
			};
		case catalog_mode_action_types.RESET_CATALOG_MODE:
			CatalogFactory.MODE.set_edit_catalog_mode(false);
			CatalogFactory.MODE.store_is_edit_fetched(false);
			CatalogFactory.MODE.update_catalog_mode_state(false);
			CatalogFactory.MODE.set_catalog_id(null);
			CatalogFactory.MODE.set_catalog_data(null);
			CatalogFactory.PRODUCT.save_catalog_products([]);
			CatalogFactory.MODE.set_selected_pricelist({});
			CatalogFactory.MODE.set_selected_sort({});
			return {
				...initial_state,
				price_lists: state.price_lists,
			};

		case catalog_mode_action_types.SET_EDIT_MODE:
			CatalogFactory.MODE.set_edit_catalog_mode(action.data);
			return {
				...state,
				edit_mode: action.data,
			};

		case catalog_mode_action_types.SET_EDIT_CATALOG_DATA:
			CatalogFactory.MODE.set_catalog_data(action.data);
			return {
				...state,
				edit_catalog_data: action.data,
			};

		case catalog_mode_action_types.SET_EDIT_CATALOG_ID:
			CatalogFactory.MODE.set_catalog_id(action.data);
			return {
				...state,
				edit_catalog_id: action.data,
			};
		case catalog_mode_action_types.SET_IS_EDIT_FETCHED:
			CatalogFactory.MODE.store_is_edit_fetched(action.data);
			return {
				...state,
				is_edit_fetched: action.data,
			};
		case catalog_mode_action_types.SET_PRICE_LISTS:
			return {
				...state,
				price_lists: action.data,
			};
		default:
			return state;
	}
	CatalogFactory.PRODUCT.save_catalog_products(updated_products);
	return {
		...state,
		catalog_products: updated_products,
		catalog_products_length: updated_products.length,
	};
};

export default catalog_mode_reducer;
