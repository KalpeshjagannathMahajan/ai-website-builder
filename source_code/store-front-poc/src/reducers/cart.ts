import _ from 'lodash';
import { USER_LOGOUT, USER_SWITCH } from '../actions/reduxConstants';
import { IProduct } from 'src/common/Interfaces/SectionsInterface';

interface Cart {
	id: string;
	products: { [productId: string]: IProduct };
	products_details: any;
	products_removed: any;
}
const { VITE_APP_REPO } = import.meta.env;
const is_storefront = VITE_APP_REPO === 'store_front';

const initialState: Cart = {
	id: '',
	products: {},
	products_details: {},
	products_removed: 0,
};

const update_local_storage = (data: any) => {
	if (is_storefront) localStorage.setItem('CartData', JSON.stringify(data));
};

const cart_reducer = (state: any = initialState, action: any) => {
	switch (action.type) {
		case 'UPDATE_PRODUCT_QUANTITY': {
			const { id, quantity, parent_id, cart_item_id, cart_item } = action.data;
			let data = state?.products;
			//Check if product_id and cart_item_id exist and Update the quantity based on product_id and cart_item_id
			if (_.has(data, id) && _.has(data[id], cart_item_id) && data[id][cart_item_id]) {
				_.update(data, [id, cart_item_id, 'quantity'], () => quantity);
			}

			// Check if cart_item_id ToCreate exists under product_id, if not, create a new object with the provided payload
			else if (_.has(data, id) && !_.has(data[id], cart_item_id) && cart_item_id) {
				let payload = {
					...data[id],
					[cart_item_id]: {
						quantity,
						meta: {},
						is_custom_product: cart_item?.is_custom_product,
						discount_type: null,
						discount_value: null,
					},
				};
				_.set(data, id, payload);
			}
			// Check if cart_item_id ToCreate exists under product_id, if not, create a new object with the provided payload
			else if (id) {
				const payload = _.merge({}, cart_item, { parent_id, id });
				_.set(data, id, payload);
			}

			update_local_storage({
				...state,
				products: {
					...state.products,
				},
			});
			return {
				...state,
				products: {
					...state.products,
				},
			};
		}

		case 'REMOVE_PRODUCT': {
			const { product_id, cart_item_key } = action.data;
			let data = state?.products;

			if (_.isEmpty(data)) {
				return;
			}

			//check whether product_id and cart_item_id exist
			if (_.has(data, product_id) && _.has(data[product_id], cart_item_key)) {
				const cart_item_data = Object.keys(data[product_id]).filter((key) => key !== 'id' && key !== 'parent_id');
				// remove the product_id if only one children else remove the cart_item
				if (cart_item_data.length === 1 && cart_item_data.includes(cart_item_key)) {
					_.unset(data, `${product_id}`);
				} else {
					_.unset(data, `${product_id}.${cart_item_key}`);
				}
			}

			update_local_storage({
				...state,
				products: {
					...state.products,
				},
			});
			return {
				...state,
				products: {
					...state.products,
				},
			};
		}

		case 'INITIALIZE_CART':
			update_local_storage({
				...state,
				...action.data,
			});
			return {
				...state,
				...action.data,
			};
		case 'ADD_PRODUCT_DETAIL':
			return {
				...state,
				products_details: {
					...state.products_details,
					...action.data,
				},
			};
		case 'REMOVE_PRODUCT_DETAIL':
			return {
				...state,
				products_details: action.data,
			};
		case 'REMOVE_PRODUCT_COUNT': {
			return {
				...state,
				products_removed: action.data,
			};
		}
		case USER_SWITCH:
		case USER_LOGOUT:
			localStorage.removeItem('CartData');
			return { ...initialState };

		default:
			return state;
	}
};

export default cart_reducer;
