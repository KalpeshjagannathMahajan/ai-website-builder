export const updateCart = (updated_cart: any) => {
	return {
		type: 'UPDATE_PRODUCT_QUANTITY',
		data: updated_cart,
	};
};

export const removeProductFromCart = (updated_cart: any) => {
	return {
		type: 'REMOVE_PRODUCT',
		data: updated_cart,
	};
};

export const initializeCart = (cart: any) => {
	return {
		type: 'INITIALIZE_CART',
		data: cart,
	};
};

export const addProductDetails = (cart_products: any) => {
	return {
		type: 'ADD_PRODUCT_DETAIL',
		data: cart_products,
	};
};

export const removeProductDetails = (cart_products: any) => {
	return {
		type: 'REMOVE_PRODUCT_DETAIL',
		data: cart_products,
	};
};

export const removedProductsCount = (data: any) => {
	return {
		type: 'REMOVE_PRODUCT_COUNT',
		data,
	};
};
