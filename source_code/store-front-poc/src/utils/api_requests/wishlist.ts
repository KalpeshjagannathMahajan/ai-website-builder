import { WishlistPayload, WishlistSort } from 'src/@types/wishlist';
import utils from '../utils';

const wishlist = {
	create_wishlist: (data: any) => {
		return utils.request({
			url: 'wishlist/v1/wishlist',
			method: 'POST',
			data,
		});
	},
	update_wishlist: (data: WishlistPayload, wishlist_id: string) => {
		return utils.request({
			url: `wishlist/v1/wishlist/${wishlist_id}`,
			method: 'PUT',
			data,
		});
	},
	delete_wishlist: (wishlist_id: string) => {
		return utils.request({
			url: `wishlist/v1/wishlist/${wishlist_id}`,
			method: 'DELETE',
		});
	},
	get_self_wishlist: (sort: WishlistSort, pricelist_id: string) => {
		return utils.request({
			url: `wishlist/v1/wishlist/self?catalog_id=${pricelist_id}`,
			method: 'POST',
			data: {
				sorting: sort,
			},
		});
	},
	get_buyer_wishlist: (buyer_id: string, sort: WishlistSort, pricelist_id: string) => {
		return utils.request({
			url: `wishlist/v1/wishlist/buyer/${buyer_id}?catalog_id=${pricelist_id}`,
			method: 'POST',
			data: {
				sorting: sort,
			},
		});
	},
	add_product_to_wishlists: (product_id: string, wishlist_ids: string[]) => {
		return utils.request({
			url: `wishlist/v1/wishlist/product/${product_id}`,
			method: 'POST',
			data: {
				wishlist_ids,
			},
		});
	},
	add_wishlist_to_cart: (wishlist_id: string, cart_id: string, pricelist_id: string, buyer_id?: string) => {
		return utils.request({
			url: 'wishlist/v1/wishlist/cart',
			method: 'POST',
			data: {
				wishlist_id,
				cart_id,
				catalog_id: pricelist_id,
				buyer_id,
			},
		});
	},
	remove_product_from_wishlist: (product_id: string, wishlist_id: string) => {
		return utils.request({
			url: `wishlist/v1/wishlist/product/${product_id}/${wishlist_id}`,
			method: 'DELETE',
		});
	},
};

export default wishlist;
