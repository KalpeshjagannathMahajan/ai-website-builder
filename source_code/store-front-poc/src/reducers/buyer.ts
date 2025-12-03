import {
	CREATE_DOCUMENT_SELECTED_BUYER,
	CREATE_DOCUMENT_TYPE,
	UPDATE_BUYER,
	UPDATE_BUYER_CART,
	UPDATE_BUYER_PRICE_LIST,
	UPDATE_CATALOG,
	USER_LOGOUT,
	SHOW_BUYER_TOAST,
	TOTAL_BUYERS,
	USER_SWITCH,
} from '../actions/reduxConstants';

export interface IPriceList {
	value: string;
	label?: string;
	is_custom?: boolean;
	custom_labels?: any;
}

export interface ICatalog {
	value?: string;
	label?: string;
	is_default?: boolean;
}
interface Buyer {
	is_guest_buyer: boolean;
	buyer_id: string;
	buyer_cart: any;
	buyer_info: any;
	toast: any;
	price_list: IPriceList;
	catalog: ICatalog;
	create_document_flag: boolean;
	create_document_type: string;
	total_buyer: any;
}

const initialState: Buyer = {
	is_guest_buyer: true,
	buyer_id: '',
	buyer_cart: null,
	buyer_info: null,
	create_document_flag: false,
	create_document_type: '',
	total_buyer: null,
	toast: {
		state: false,
		title: '',
		sub_title: '',
		type: '',
	},
	price_list: {
		value: '',
		label: '',
	},
	catalog: {
		value: '',
		label: '',
	},
};

const buyer_reducer = (state: any = initialState, action: any) => {
	switch (action?.type) {
		case UPDATE_BUYER: {
			const { buyer_cart, buyer_info, price_list = { value: '', label: '' } } = action?.payload;
			return {
				...state,
				is_guest_buyer: buyer_cart?.is_guest_cart,
				buyer_id: buyer_cart?.buyer_id,
				buyer_info,
				buyer_cart,
				price_list,
			};
		}

		case UPDATE_BUYER_CART: {
			const { buyer_cart } = action?.payload;
			return {
				...state,
				is_guest_buyer: buyer_cart?.is_guest_cart,
				buyer_id: buyer_cart?.buyer_id,
				buyer_cart,
			};
		}

		case TOTAL_BUYERS: {
			return {
				...state,
				total_buyer: action?.payload,
			};
		}

		case UPDATE_BUYER_PRICE_LIST: {
			const { price_list } = action?.payload;
			return {
				...state,
				price_list,
			};
		}
		case UPDATE_CATALOG: {
			const { catalog } = action?.payload;
			return {
				...state,
				catalog,
			};
		}
		case CREATE_DOCUMENT_SELECTED_BUYER: {
			return {
				...state,
				create_document_flag: action?.payload,
			};
		}
		case CREATE_DOCUMENT_TYPE: {
			return {
				...state,
				create_document_type: action?.payload,
			};
		}
		case SHOW_BUYER_TOAST: {
			return {
				...state,
				toast: action.payload,
			};
		}
		case USER_LOGOUT:
			return { ...initialState };
		case USER_SWITCH:
			return { ...initialState };
		default:
			return state;
	}
};

export default buyer_reducer;
