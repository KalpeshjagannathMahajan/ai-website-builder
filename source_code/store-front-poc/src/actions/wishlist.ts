import { WISHLIST_ACTION_TYPES } from './reduxConstants';

export const create_buyer_wishlist = (data: any) => {
	return {
		type: WISHLIST_ACTION_TYPES.CREATE_NEW_BUYER_WISHLIST,
		data,
	};
};

export const remove_buyer_wishlist = (id: string) => {
	return {
		type: WISHLIST_ACTION_TYPES.REMOVE_BUYER_WISHLIST,
		data: {
			id,
		},
	};
};

export const update_buyer_wishlist = (id: string, payload: any) => {
	return {
		type: WISHLIST_ACTION_TYPES.UPDATE_BUYER_WISHLIST,
		data: {
			id,
			payload,
		},
	};
};

export const update_all_buyer_wishlist = (data: any) => {
	return {
		type: WISHLIST_ACTION_TYPES.UPDATE_ALL_BUYER_WISHLIST,
		data,
	};
};

export const create_self_wishlist = (data: any) => {
	return {
		type: WISHLIST_ACTION_TYPES.CREATE_NEW_SELF_WISHLIST,
		data,
	};
};

export const remove_self_wishlist = (id: string) => {
	return {
		type: WISHLIST_ACTION_TYPES.REMOVE_SELF_WISHLIST,
		data: {
			id,
		},
	};
};

export const remove_wishlist = (wishlist_id: string) => {
	return {
		type: WISHLIST_ACTION_TYPES.REMOVE_WISHLIST,
		data: {
			id: wishlist_id,
		},
	};
};

export const update_self_wishlist = (id: string, payload: any) => {
	return {
		type: WISHLIST_ACTION_TYPES.UPDATE_SELF_WISHLIST,
		data: {
			id,
			payload,
		},
	};
};

export const update_all_self_wishlist = (data: any) => {
	return {
		type: WISHLIST_ACTION_TYPES.UPDATE_ALL_SELF_WISHLIST,
		data,
	};
};

export const update_self_wishlist_loader = (loader: boolean) => {
	return {
		type: WISHLIST_ACTION_TYPES.UPDATE_SELF_WISHLIST_LOADER,
		data: loader,
	};
};

export const update_buyer_wishlist_loader = (loader: boolean) => {
	return {
		type: WISHLIST_ACTION_TYPES.UPDATE_BUYER_WISHLIST_LOADER,
		data: loader,
	};
};

export const update_customer_wishlist_data = (wishlist_ids: string[], action: 'ADD' | 'REMOVE') => {
	return {
		type: WISHLIST_ACTION_TYPES.UPDATE_CUSTOMER_WISHLIST_DATA,
		data: {
			wishlist_ids,
			action,
		},
	};
};
