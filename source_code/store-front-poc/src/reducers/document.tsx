import {
	SHOW_DOCUMENT_TOAST,
	SHOW_DOCUMENT_TOAST_MESSAGE,
	SHOW_DOCUMENT_ALERT,
	USER_LOGOUT,
	SET_DOCUMENT_DATA,
	TOGGLE_EDIT_QUOTE,
	TOGGLE_EDIT_PENDING_ORDER,
	USER_SWITCH,
} from '../actions/reduxConstants';

export const EMPTY_QUOTE_OR_ORDER: any = {
	id: null,
	document_status: '',
	cart_id: null, // If this is blank create a new one? if this is not blank, check status of the cart, If cart is closed? Throw an error.
	buyer_id: '',
	system_id: '',
	type: '',
	cart_details: {
		items: {
			// '5d7ae22e-c162-452d-b772-f16f790f077c': {
			// 	price: 98.99,
			// 	quantity: 5,
			// 	meta: {
			// 		notes: [
			// 			{
			// 				title: 'Customer Note',
			// 				key: 'customer_note',
			// 				value: '',
			// 				share_with_buyer: 'True',
			// 			},
			// 			{
			// 				title: 'Your Note',
			// 				key: 'sales_rep_note',
			// 				value: '',
			// 				share_with_buyer: 'True',
			// 			},
			// 		],
			// 	},
			// },
		},
		products: {},
		charges: [
			// {
			// 	"value_type": "percentage",
			// 	"charge_type": "discount",
			// 	"value": 50,
			// 	"meta": {},
			// 	"name": "Discount"
			// }
		],
	},
	attributes: {
		// billing_address: null,
		// shipping_address: null,
		// payment_method: null,
		// payment_terms: null,
		// notification_email_ids: null,
		// shipping_method: null,
		// settings: {},
	},
};

interface Document {
	show_toast: boolean;
	toast_message: {};
	show_alert: boolean;
	document_data: any;
	is_editable_quote: boolean;
	is_editable_order: boolean;
}

const initialState: Document = {
	show_toast: false,
	toast_message: {
		title: '',
		sub: '',
		show_icon: false,
		is_custom: false,
	},
	show_alert: false,
	document_data: {},
	is_editable_quote: false,
	is_editable_order: false,
};

const document_reducer = (state: any = initialState, action: any) => {
	switch (action.type) {
		case SHOW_DOCUMENT_TOAST: {
			return {
				...state,
				show_toast: action?.payload,
			};
		}
		case SHOW_DOCUMENT_TOAST_MESSAGE: {
			return {
				...state,
				toast_message: action.payload,
			};
		}
		case SHOW_DOCUMENT_ALERT:
			return {
				...state,
				show_alert: action.payload,
			};
		case SET_DOCUMENT_DATA:
			return {
				...state,
				document_data: action.payload,
			};
		case TOGGLE_EDIT_QUOTE:
			return {
				...state,
				is_editable_quote: action.payload,
			};
		case TOGGLE_EDIT_PENDING_ORDER:
			return {
				...state,
				is_editable_order: action.payload,
			};
		case USER_SWITCH:
		case USER_LOGOUT:
			return { ...initialState };
		default:
			return state;
	}
};

export default document_reducer;
