import { ICatalog } from 'src/reducers/buyer';
import { catalog_mode_action_types } from './reduxConstants';
import { SortOption } from 'src/@types/presentation';

// Toggle catalog mode
export const update_catalog_mode = (data: any) => {
	return {
		type: catalog_mode_action_types.UPDATE_CATALOG_MODE,
		data,
	};
};

export const update_catalog_product_count = (data: any) => {
	return {
		type: catalog_mode_action_types.UPDATE_PRODUCT_LENGTH,
		data,
	};
};

// Add multiple products
export const add_multiple_catalog_products = (product_ids: string[]) => {
	return {
		type: catalog_mode_action_types.ADD_MULTIPLE_PRODUCTS,
		data: product_ids,
	};
};

// Remove multiple products by their IDs
export const remove_multiple_catalog_products = (product_ids: string[]) => {
	return {
		type: catalog_mode_action_types.REMOVE_MULTIPLE_PRODUCTS,
		data: product_ids,
	};
};

// Add a single product
export const add_single_catalog_product = (product_id: string) => {
	return {
		type: catalog_mode_action_types.ADD_SINGLE_PRODUCT,
		data: product_id,
	};
};

// Remove a single product by its ID
export const remove_single_catalog_product = (product_id: string) => {
	return {
		type: catalog_mode_action_types.REMOVE_SINGLE_PRODUCT,
		data: product_id,
	};
};

// Set the entire product list (useful for initialization or resetting)
export const set_catalog_products = (product_ids: string[]) => {
	return {
		type: catalog_mode_action_types.SET_PRODUCTS,
		data: product_ids,
	};
};

export const remove_all_catalog_products = () => {
	return {
		type: catalog_mode_action_types.REMOVE_ALL_PRODUCTS,
	};
};

export const set_selected_pricelist = (data: ICatalog) => {
	return {
		type: catalog_mode_action_types.SET_SELECTED_PRICELIST,
		data,
	};
};

export const set_selected_sort = (data: SortOption) => {
	return {
		type: catalog_mode_action_types.SET_SELECTED_SORT,
		data,
	};
};

export const reset_catalog_mode = () => {
	return {
		type: catalog_mode_action_types.RESET_CATALOG_MODE,
	};
};

export const set_edit_mode = (edit_mode: boolean) => ({
	type: catalog_mode_action_types.SET_EDIT_MODE,
	data: edit_mode,
});

export const set_edit_catalog_id = (catalog_id: string | null) => ({
	type: catalog_mode_action_types.SET_EDIT_CATALOG_ID,
	data: catalog_id,
});

export const set_is_edit_fetched = (flag: boolean) => ({
	type: catalog_mode_action_types.SET_IS_EDIT_FETCHED,
	data: flag,
});

export const set_edit_catalog_data = (data: any) => ({
	type: catalog_mode_action_types.SET_EDIT_CATALOG_DATA,
	data,
});

export const set_price_lists_data = (data: ICatalog[]) => ({
	type: catalog_mode_action_types.SET_PRICE_LISTS,
	data,
});
