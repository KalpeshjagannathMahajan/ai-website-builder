import { Dispatch } from 'react';
import cart_management from 'src/utils/api_requests/cartManagement';

export const setCartCheckoutConfig = (config: any) => ({
	type: 'GET_CART_CHECKOUT_CONFIG',
	data: config,
});

export const getCartCheckoutConfig = (document_type: string) => async (dispatch: Dispatch) => {
	try {
		const response: any = await cart_management.get_cart_checkout_config(document_type);

		if (response?.status === 200) {
			dispatch(setCartCheckoutConfig(response));
		}
	} catch (error) {
		console.log(error);
	}
};
