export const initializeSettings = (data: any) => {
	return {
		type: 'INITIALIZE_SETTING',
		data,
	};
};

export const cartContainerConfig = (data: any) => {
	return {
		type: 'CART_CONTAINER_CONFIG',
		data,
	};
};

export const duplicateRepeatDocument = (data: any) => {
	return {
		type: 'DUPLICATE_REPEAT_DOCUMENT',
		data,
	};
};
export const inventoryIconConfig = (data: any) => {
	return {
		type: 'INVENTORY_ICON_CONFIG',
		data,
	};
};

export const cartGroupingConfig = (data: any) => {
	return {
		type: 'CART_GROUPING_CONFIG',
		data,
	};
};

export const update_product_listing_config = (data: any) => {
	return {
		type: 'UPDATE_PRODUCT_LISTING_CONFIG',
		data,
	};
};
