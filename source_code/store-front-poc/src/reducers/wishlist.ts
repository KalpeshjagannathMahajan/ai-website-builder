import { filter, find, isEmpty, map, merge } from 'lodash';
import { WISHLIST_ACTION_TYPES } from '../actions/reduxConstants';

interface Wishlist {
	buyer_wishlist: any[];
	self_wishlist: any[];
	buyer_wishlist_loader: boolean;
	self_wishlist_loader: boolean;
}

const update_product_to_wishlist = (wishlists: any[], wishlist_ids: any[], action_type: string) => {
	return map(wishlists, (wishlist: any) => {
		const wishlist_data = find(wishlist_ids, (item: any) => item === wishlist?.id);
		if (!isEmpty(wishlist_data)) {
			let product_count = wishlist?.meta?.product_count ?? 0;
			if (action_type === 'ADD') {
				product_count += 1;
			} else if (action_type === 'REMOVE') {
				if (product_count > 0) product_count -= 1;
			}
			const data = {
				...wishlist,
				meta: {
					...(wishlist?.meta ?? {}),
					product_count,
				},
				updated_at: Date.now(),
			};
			return data;
		}
		return wishlist;
	});
};

const initial_state: Wishlist = {
	buyer_wishlist: [],
	self_wishlist: [],
	buyer_wishlist_loader: true,
	self_wishlist_loader: true,
};

const wishlist_reducer = (state: any = initial_state, action: any) => {
	switch (action?.type) {
		case WISHLIST_ACTION_TYPES.REMOVE_WISHLIST:
			return {
				...state,
				buyer_wishlist: filter(state?.buyer_wishlist, (wishlist: any) => wishlist?.id !== action?.data?.id),
				self_wishlist: filter(state?.self_wishlist, (wishlist: any) => wishlist?.id !== action?.data?.id),
			};
		case WISHLIST_ACTION_TYPES.CREATE_NEW_BUYER_WISHLIST:
			return {
				...state,
				buyer_wishlist: [action?.data, ...state.buyer_wishlist],
			};
		case WISHLIST_ACTION_TYPES.REMOVE_BUYER_WISHLIST:
			return {
				...state,
				buyer_wishlist: filter(state?.buyer_wishlist, (wishlist: any) => wishlist?.id !== action?.data?.id),
			};
		case WISHLIST_ACTION_TYPES.CREATE_NEW_SELF_WISHLIST:
			return {
				...state,
				self_wishlist: [action?.data, ...state.self_wishlist],
			};
		case WISHLIST_ACTION_TYPES.REMOVE_SELF_WISHLIST:
			return {
				...state,
				self_wishlist: filter(state?.self_wishlist, (wishlist: any) => wishlist?.id !== action?.data?.id),
			};
		case WISHLIST_ACTION_TYPES.UPDATE_SELF_WISHLIST:
			return {
				...state,
				self_wishlist: map(state?.self_wishlist, (wishlist) =>
					(wishlist.id === action?.data?.id ? merge({}, wishlist, action?.data?.payload) : wishlist),
				),
			};
		case WISHLIST_ACTION_TYPES.UPDATE_BUYER_WISHLIST:
			return {
				...state,
				buyer_wishlist: map(state?.buyer_wishlist, (wishlist) =>
					(wishlist.id === action?.data?.id ? merge({}, wishlist, action?.data?.payload) : wishlist),
				),
			};
		case WISHLIST_ACTION_TYPES.UPDATE_ALL_BUYER_WISHLIST:
			return {
				...state,
				buyer_wishlist: action?.data,
			};
		case WISHLIST_ACTION_TYPES.UPDATE_ALL_SELF_WISHLIST:
			return {
				...state,
				self_wishlist: action?.data,
			};
		case WISHLIST_ACTION_TYPES.UPDATE_SELF_WISHLIST_LOADER:
			return {
				...state,
				self_wishlist_loader: action?.data,
			};
		case WISHLIST_ACTION_TYPES.UPDATE_BUYER_WISHLIST_LOADER:
			return {
				...state,
				buyer_wishlist_loader: action?.data,
			};
		case WISHLIST_ACTION_TYPES.CLEAR_SELF_WISHLIST:
			return {
				...state,
				self_wishlist: [],
			};
		case WISHLIST_ACTION_TYPES.CLEAR_BUYER_WISHLIST:
			return {
				...state,
				self_wishlist: [],
			};
		case WISHLIST_ACTION_TYPES.UPDATE_CUSTOMER_WISHLIST_DATA:
			const wishlist_ids = action?.data?.wishlist_ids;
			const action_type = action?.data?.action;
			return {
				...state,
				self_wishlist: update_product_to_wishlist(state?.self_wishlist, wishlist_ids, action_type),
				buyer_wishlist: update_product_to_wishlist(state?.buyer_wishlist, wishlist_ids, action_type),
			};
		case WISHLIST_ACTION_TYPES.CLEAR_WISHLIST:
			return initial_state;
		default:
			return state;
	}
};

export default wishlist_reducer;
