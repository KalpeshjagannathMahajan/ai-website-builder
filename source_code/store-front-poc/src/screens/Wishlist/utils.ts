import { find, get, head, isEmpty } from 'lodash';
import { WishlistSort } from 'src/@types/wishlist';

export const get_short_name = (name: string, maxLength: number = 20): string => {
	if (!name) return '';
	if (name.length <= maxLength) return name;
	return `${name.substring(0, maxLength)}...`;
};

export const transform_wishlist_sort = (sort: any): WishlistSort => {
	return {
		sort_by: sort?.field ?? '',
		sort_order: sort?.order ?? '',
	};
};

export const get_wishlist_default_sort_data = (sort_data: any[], sort?: WishlistSort): WishlistSort => {
	const filter_default_sort = find(sort_data, (item) => item?.is_default) ?? head(sort_data);
	const default_sort = get(filter_default_sort, 'key');
	if (!isEmpty(sort)) {
		const find_sort = find(sort_data, (item) => item?.key?.field === sort?.sort_by && item?.key?.order === sort?.sort_order);
		if (!isEmpty(find_sort)) return transform_wishlist_sort(find_sort?.key);
	}
	return transform_wishlist_sort(default_sort);
};

export const get_default_wishlist_sort = (sort_data: any[]) => {
	const filter_default_sort = find(sort_data, (item) => item?.is_default) ?? head(sort_data);
	return filter_default_sort?.key;
};

export const WISHLIST_SESSION_KEY = 'wishlist_session_ids';
export const update_session_for_wishlist = (action: 'ADD' | 'REMOVE', wishlist_ids?: string[], buyer_id?: string) => {
	const key = `${WISHLIST_SESSION_KEY}${isEmpty(buyer_id) ? '' : `-${buyer_id}`}`;
	if (action === 'ADD') {
		sessionStorage.setItem(key, JSON.stringify(wishlist_ids));
	} else {
		sessionStorage.removeItem(key);
	}
};
export const get_session_for_wishlist = (buyer_id?: string) => {
	const key = `${WISHLIST_SESSION_KEY}${isEmpty(buyer_id) ? '' : `-${buyer_id}`}`;
	let data = sessionStorage.getItem(key);
	try {
		return JSON.parse(data ?? '[]');
	} catch {
		return [];
	}
};
