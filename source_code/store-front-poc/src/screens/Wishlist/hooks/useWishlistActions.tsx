import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
	create_buyer_wishlist,
	create_self_wishlist,
	update_self_wishlist,
	update_buyer_wishlist,
	update_self_wishlist_loader,
	update_all_self_wishlist,
	update_all_buyer_wishlist,
	update_buyer_wishlist_loader,
	remove_wishlist,
	update_customer_wishlist_data,
} from 'src/actions/wishlist';
import { wishlist_sort, WishlistType, wishlist_source } from '../constants';
import wishlist from 'src/utils/api_requests/wishlist';
import { close_toast, show_toast } from 'src/actions/message';
import types from 'src/utils/types';
import { difference, find, get, intersection, isEmpty, map, trim } from 'lodash';
import { t } from 'i18next';
import { WishlistPayload, WishlistSort } from 'src/@types/wishlist';
import { get_wishlist_default_sort_data, update_session_for_wishlist } from '../utils';
import usePricelist from 'src/hooks/usePricelist';

const useWishlistActions = () => {
	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';

	const buyer = useSelector((state: any) => state?.buyer);
	const { buyer_wishlist = [], self_wishlist = [] } = useSelector((state: any) => state?.wishlist);
	const user_details = useSelector((state: any) => state?.login?.userDetails);
	const pricelist = usePricelist();
	const dispatch = useDispatch();
	const is_guest_buyer = buyer?.is_guest_buyer;
	const buyer_id = buyer?.buyer_info?.id;
	const user_fullname = trim(`${user_details?.first_name} ${user_details?.last_name}`);

	const get_buyer_wishlist = useCallback(
		async (sort?: WishlistSort) => {
			if (isEmpty(pricelist?.value)) return;
			try {
				dispatch(update_buyer_wishlist_loader(true));
				const wishlist_sort_data = get_wishlist_default_sort_data(wishlist_sort, sort);
				const res: any = await wishlist.get_buyer_wishlist(buyer_id ?? '', wishlist_sort_data, pricelist?.value);
				dispatch(update_all_buyer_wishlist(res?.data ?? []));
			} catch (err) {
				console.error(err);
				dispatch(update_all_buyer_wishlist([]));
			} finally {
				dispatch(update_buyer_wishlist_loader(false));
			}
		},
		[dispatch, buyer?.buyer_id, wishlist_sort, pricelist],
	);

	const get_self_wishlist = useCallback(
		async (sort?: WishlistSort) => {
			if (isEmpty(pricelist?.value)) return;
			try {
				dispatch(update_self_wishlist_loader(true));
				const wishlist_sort_data = get_wishlist_default_sort_data(wishlist_sort, sort);
				const res: any = await wishlist.get_self_wishlist(wishlist_sort_data, pricelist?.value);
				dispatch(update_all_self_wishlist(res?.data ?? []));
			} catch (err) {
				console.error(err);
				dispatch(update_all_self_wishlist([]));
			} finally {
				dispatch(update_self_wishlist_loader(false));
			}
		},
		[dispatch, wishlist_sort, pricelist],
	);

	const handle_success = (message = '') => {
		dispatch<any>(
			show_toast({
				open: true,
				showCross: false,
				anchorOrigin: {
					vertical: types.VERTICAL_TOP,
					horizontal: types.HORIZONTAL_CENTER,
				},
				autoHideDuration: 5000,
				onClose: (_: React.ChangeEvent<HTMLInputElement>, reason: String) => {
					if (reason === types.REASON_CLICK) {
						return;
					}
					dispatch(close_toast(''));
				},
				state: types.SUCCESS_STATE,
				title: types.SUCCESS_TITLE,
				subtitle: message,
				showActions: false,
			}),
		);
	};

	const handle_error = () => {
		dispatch<any>(
			show_toast({
				open: true,
				showCross: false,
				anchorOrigin: {
					vertical: types.VERTICAL_TOP,
					horizontal: types.HORIZONTAL_CENTER,
				},
				autoHideDuration: 5000,
				onClose: (_: React.ChangeEvent<HTMLInputElement>, reason: String) => {
					if (reason === types.REASON_CLICK) {
						return;
					}
					dispatch(close_toast(''));
				},
				state: types.ERROR_STATE,
				title: types.ERROR_TITLE,
				subtitle: '',
				showActions: false,
			}),
		);
	};

	const get_active_wishlist = useCallback(
		(for_is_guest_buyer: boolean = is_guest_buyer) => {
			if (for_is_guest_buyer) {
				return self_wishlist;
			}
			return buyer_wishlist;
		},
		[buyer_wishlist, self_wishlist, is_guest_buyer],
	);

	const find_wishlist = useCallback(
		(wishlist_id: string) => {
			const check_buyer = find(buyer_wishlist, (wishlist_data: any) => wishlist_data?.id === wishlist_id);
			if (!isEmpty(check_buyer)) {
				return {
					name: buyer?.buyer_info?.name,
					data: check_buyer,
				};
			}
			const check_guest = find(self_wishlist, (wishlist_data: any) => wishlist_data?.id === wishlist_id);
			if (!isEmpty(check_guest)) {
				return {
					name: 'Self',
					data: check_guest,
				};
			}
			return null;
		},
		[self_wishlist, buyer_wishlist],
	);

	const create_wishlist = useCallback(
		async (name: string, for_is_guest_buyer: boolean = is_guest_buyer, custome_buyer_id?: string) => {
			let payload: any = {
				type: WishlistType.SELF,
			};
			if (!for_is_guest_buyer || !isEmpty(custome_buyer_id)) {
				payload = {
					type: WishlistType.BUYER,
					buyer_id: !isEmpty(custome_buyer_id) ? custome_buyer_id : buyer_id,
				};
			}

			try {
				const res: any = await wishlist.create_wishlist({ name, ...payload });
				const created_at = get(res, 'data.created_at');
				const updated_at = get(res, 'data.updated_at');
				const data: any = {
					id: res?.data?.id,
					name,
					meta: res?.data?.meta,
					created_by_name: res?.data?.created_by_name ?? user_fullname,
					updated_by_name: res?.data?.updated_by_name ?? user_fullname,
					created_at: isEmpty(res?.data?.created_at) ? Date.now() : created_at,
					updated_at: isEmpty(res?.data?.updated_at) ? Date.now() : updated_at,
					source: res?.data?.source ? res?.data?.source : is_ultron ? wishlist_source.SALES_REP : wishlist_source.WIZSHOP,
				};
				if (isEmpty(custome_buyer_id)) {
					if (for_is_guest_buyer) {
						dispatch(create_self_wishlist(data));
						if (isEmpty(user_fullname)) get_self_wishlist();
					} else {
						dispatch(create_buyer_wishlist(data));
						if (isEmpty(user_fullname)) get_buyer_wishlist();
					}
				}
				handle_success(t('Wishlist.Toast.WishlistCreated'));
				return data;
			} catch (err) {
				handle_error();
			}
		},
		[is_guest_buyer, buyer_id, dispatch, user_details],
	);

	const remove_wishlist_data = useCallback(
		async (wishlist_id: string) => {
			try {
				await wishlist.delete_wishlist(wishlist_id);
				dispatch(remove_wishlist(wishlist_id));
				handle_success(t('Wishlist.Toast.WishlistDeleted'));
			} catch (err) {
				handle_error();
			}
		},
		[dispatch],
	);

	const rename_wishlist = useCallback(
		async (wishlist_id: string, payload: WishlistPayload, for_is_guest_buyer: boolean = is_guest_buyer) => {
			try {
				const res: any = await wishlist.update_wishlist(payload, wishlist_id);
				const updated_at = get(res, 'data.updated_at');
				const updated_data = {
					...payload,
					updated_at: isEmpty(res?.data?.updated_at) ? Date.now() : updated_at,
					updated_by_name: res?.data?.updated_by_name ?? user_fullname,
				};
				if (for_is_guest_buyer) {
					dispatch(update_self_wishlist(wishlist_id, updated_data));
				} else {
					dispatch(update_buyer_wishlist(wishlist_id, updated_data));
				}
				handle_success(t('Wishlist.Toast.WishlistRenamed'));
			} catch (err) {
				handle_error();
			}
		},
		[is_guest_buyer, user_details, dispatch],
	);

	// Using while removing product from wishlist
	const update_wishlist = useCallback(
		async (wishlist_id: string, for_is_guest_buyer: boolean = is_guest_buyer) => {
			try {
				const updated_data = {
					updated_at: Date.now(),
					updated_by_name: user_fullname,
				};
				if (for_is_guest_buyer) {
					dispatch(update_self_wishlist(wishlist_id, updated_data));
				} else {
					dispatch(update_buyer_wishlist(wishlist_id, updated_data));
				}
			} catch (err) {
				handle_error();
			}
		},
		[is_guest_buyer, user_details, dispatch],
	);

	const add_to_wishlist = useCallback(
		(wishlist_ids: string[], prev_wishlist_ids: string[]) => {
			const product_removed_from = difference(prev_wishlist_ids, wishlist_ids);
			const product_added_to = difference(wishlist_ids, prev_wishlist_ids);
			dispatch(update_customer_wishlist_data(product_added_to, 'ADD'));
			dispatch(update_customer_wishlist_data(product_removed_from, 'REMOVE'));
		},
		[dispatch],
	);

	const update_selected_wishlists = useCallback(
		async (product_id: string, wishlist_ids: string[], prev_selected_wishlists: string[], _buyer_id?: string) => {
			const active_wishlists = get_active_wishlist();
			const current_wishlists = map(active_wishlists, (wishlist_data: any) => wishlist_data.id);
			const active_prev_selected_wishlist = intersection(current_wishlists, prev_selected_wishlists);

			await wishlist.add_product_to_wishlists(product_id, wishlist_ids);
			const active_updated_wishlist = intersection(current_wishlists, wishlist_ids);
			if (!isEmpty(active_updated_wishlist) && isEmpty(active_prev_selected_wishlist)) {
				update_session_for_wishlist('ADD', active_updated_wishlist, _buyer_id);
			}
		},
		[dispatch, buyer_wishlist, self_wishlist, is_guest_buyer],
	);

	return {
		create_wishlist,
		remove_wishlist: remove_wishlist_data,
		get_active_wishlist,
		update_wishlist,
		rename_wishlist,
		find_wishlist,
		get_buyer_wishlist,
		get_self_wishlist,
		add_to_wishlist,
		update_selected_wishlists,
	};
};

export default useWishlistActions;
