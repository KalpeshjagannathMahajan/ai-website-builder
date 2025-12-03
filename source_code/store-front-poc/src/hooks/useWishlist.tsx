import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { update_all_buyer_wishlist } from 'src/actions/wishlist';
import { update_session_for_wishlist } from 'src/screens/Wishlist/utils';
import useEffectOnDependencyChange from './useEffectOnDependencyChange';
import useWishlistActions from 'src/screens/Wishlist/hooks/useWishlistActions';
import usePricelist from './usePricelist';

export default function useWishlist() {
	const buyer = useSelector((state: any) => state.buyer);
	const pricelist = usePricelist();
	const login = useSelector((state: any) => state.login);
	const dispatch = useDispatch();

	const { get_buyer_wishlist, get_self_wishlist } = useWishlistActions();

	useEffect(() => {
		if (!login.status.loggedIn) return;
		if (buyer?.is_guest_buyer) {
			dispatch(update_all_buyer_wishlist([]));
			return;
		}
		get_buyer_wishlist();
	}, [login.status.loggedIn, pricelist, buyer?.buyer_id, buyer?.is_guest_buyer]);

	useEffectOnDependencyChange(() => {
		if (!login.status.loggedIn) return;
		update_session_for_wishlist('REMOVE');
	}, [login.status.loggedIn, buyer?.buyer_id, buyer?.is_guest_buyer]);

	useEffect(() => {
		if (!login.status.loggedIn) return;
		get_self_wishlist();
	}, [login.status.loggedIn, pricelist]);
}
