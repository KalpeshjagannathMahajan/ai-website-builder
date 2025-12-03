import {
	CREATE_DOCUMENT_SELECTED_BUYER,
	CREATE_DOCUMENT_TYPE,
	UPDATE_BUYER,
	UPDATE_BUYER_CART,
	UPDATE_BUYER_PRICE_LIST,
	SHOW_BUYER_TOAST,
	TOTAL_BUYERS,
	UPDATE_CATALOG,
} from './reduxConstants';
import { Dispatch } from 'redux';
import cartManagement from 'src/utils/api_requests/cartManagement';
import api_requests from 'src/utils/api_requests';
import { initializeCart } from './cart';
import cart_management from 'src/utils/api_requests/cartManagement';
import { head, isEmpty } from 'lodash';

export const update_buyer = ({ buyer_cart, buyer_info }: any) => ({
	type: UPDATE_BUYER,
	payload: { buyer_cart, buyer_info },
});

export const get_total_buyers = (data: any) => ({
	type: TOTAL_BUYERS,
	payload: data,
});

export const set_buyer_toast = (state: boolean, title: string, sub_title: string, type: string) => ({
	type: SHOW_BUYER_TOAST,
	payload: { state, title, sub_title, type },
});

const update_buyer_cart = ({ buyer_cart }: any) => ({
	type: UPDATE_BUYER_CART,
	payload: { buyer_cart },
});

export const update_buyer_price_list = ({ price_list }: any) => ({
	type: UPDATE_BUYER_PRICE_LIST,
	payload: { price_list },
});

export const update_catalog = ({ catalog }: any) => ({
	type: UPDATE_CATALOG,
	payload: { catalog },
});

export const create_document_selected_buyer = (flag: boolean) => ({
	type: CREATE_DOCUMENT_SELECTED_BUYER,
	payload: flag,
});

export const create_document_type = (type: any) => ({
	type: CREATE_DOCUMENT_TYPE,
	payload: type,
});

const handle_get_cart_details = async (dispatch: any, cart_id: string) => {
	const location = window.location.pathname;
	if (!isEmpty(localStorage.getItem('CartData')) || location === '/cart-summary') {
		return;
	}
	cart_management
		.get_cart_details({ cart_id, is_guest_buyer: false })
		.then((response: any) => {
			if (response?.status === 200) {
				// eslint-disable-next-line @typescript-eslint/no-shadow
				const { cart } = response;
				const { items, products: res_product } = cart;

				if (items && Object?.keys(items)?.length > 0) {
					for (let item in items) {
						// eslint-disable-next-line @typescript-eslint/no-shadow
						const { id, parent_id } = res_product[item];
						items[item].parent_id = parent_id;
						items[item].id = id;
					}
				}
				dispatch(
					initializeCart({
						id: cart_id,
						products: items,
						products_details: res_product,
						document_items: cart?.document_items || {},
					}),
				);
			}
		})
		.catch((err: any) => {
			console.error(err);
		});
};

export const set_buyer =
	({ buyer_id, is_guest_buyer, callback, fail_callback }: any) =>
	async (dispatch: Dispatch) => {
		try {
			const [cart_response, buyer_details_response]: any = await Promise.all([
				cartManagement.get_cart({ buyer_id, is_guest_buyer }),
				is_guest_buyer ? Promise.resolve(null) : api_requests.buyer.get_buyer_dashboard(buyer_id),
			]);
			handle_get_cart_details(dispatch, head(cart_response?.data)?.id);

			dispatch(update_buyer({ buyer_cart: head(cart_response?.data), buyer_info: buyer_details_response?.data }));
			if (callback) callback();
		} catch (error) {
			console.log(error);
			if (fail_callback) fail_callback();
		}
	};

export const set_cart =
	({ buyer_id, is_guest_buyer }: any) =>
	async (dispatch: Dispatch) => {
		try {
			const buyer_cart = await cartManagement.get_cart({ buyer_id, is_guest_buyer });
			dispatch(update_buyer_cart({ buyer_cart }));
		} catch (error) {
			console.log(error);
		}
	};

export const edit_cart = async ({ buyer_id, cart_id, is_update_discount_campaign }: any) => {
	try {
		const [cart_response, buyer_details_response]: any = await Promise.all([
			cartManagement.get_cart_details({ cart_id, is_update_discount_campaign }),
			api_requests.buyer.get_buyer_dashboard(buyer_id),
		]);

		const {
			id,
			tenant_id,
			created_by,
			updated_by,
			type,
			created_at,
			updated_at,
			status,
			source,
			cart_hash,
			meta,
			cart_linked_to,
			document_id,
			is_guest_cart,
		} = cart_response?.cart;

		const buyer_cart = {
			id,
			tenant_id,
			buyer_id,
			created_by,
			updated_by,
			type,
			created_at,
			updated_at,
			status,
			source,
			cart_hash,
			meta,
			cart_linked_to,
			document_id,
			is_guest_cart,
		};
		return { buyer_cart, buyer_info: buyer_details_response?.data };
	} catch (error) {
		console.log(error);
	}
};
