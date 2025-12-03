interface Config {
	cart_checkout_config: any;
}

const initialState: Config = {
	cart_checkout_config: {},
};

const config_reducer = (state: any = initialState, action: any) => {
	switch (action.type) {
		// TODO: All the configs should be stored in the redux store
		case 'GET_CART_CHECKOUT_CONFIG':
			return {
				...state,
				cart_checkout_config: action.data,
			};
		default:
			return state;
	}
};

export default config_reducer;
