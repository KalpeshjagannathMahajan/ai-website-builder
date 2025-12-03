import { get_unit_price_of_product } from 'src/utils/common';
import { CartProduct } from './components/ProductCard';
import { get_max_quantity } from '../ProductListing/utils';
import { INVENTORY_STATUS } from 'src/common/@the-source/molecules/Inventory/constants';
import _ from 'lodash';
import { handleSuggestedValue } from 'src/common/@the-source/atoms/Counter/helper';
import { isUUID } from '../Settings/utils/helper';
import { t } from 'i18next';

export const ADHOC_ITEM = 'ADHOC';
export const BLOCK_CART_STATUS = ['DISCONTINUED', 'CATALOG_NOT_FOUND', 'OOS', 'OUT_OF_STOCK', 'DEACTIVATED', 'DISCONTINUED_MODIFIERS'];
const LOW_INVENTORY = 'LOW_ON_INVENTORY';
export const PRODUCT_DEFAULT_TYPE = 'NORMAL';

export const get_initial_entity_error = (
	item: CartProduct,
	product_total_quantity: number,
	current_product_reserved?: number,
	from_offers?: number,
	is_custom_product: boolean = false,
) => {
	const max = from_offers ? from_offers : get_max_quantity(item, current_product_reserved, is_custom_product);
	// const min = item?.pricing?.min_order_quantity;
	const product_reserved = current_product_reserved ?? 0;
	const total_available = !item?.inventory?.inventory_tracking_enabled
		? item?.pricing?.max_order_quantity
		: item?.inventory?.total_available ?? 0;
	const out_of_stock_threshold = item?.inventory?.out_of_stock_threshold ?? 0;
	const is_not_in_stock = product_reserved + total_available <= out_of_stock_threshold;
	const is_out_of_stock = item?.inventory?.inventory_status === INVENTORY_STATUS.out_of_stock && is_not_in_stock;
	const value: number = item?.quantity + product_total_quantity;
	const actual_available = item?.inventory?.available_quantity;
	if (is_out_of_stock) {
		return { is_error: false, message: '', id: 0 };
	}
	if (value > actual_available && value <= total_available && item?.inventory?.inventory_tracking_enabled) {
		const not_instock_amount = value - actual_available;
		const text_error = not_instock_amount > 1 ? t('CartSummary.Main.TextErrorAre') : t('CartSummary.Main.TextErrorIs');
		return { is_error: false, message: `${not_instock_amount} ${text_error} ${t('CartSummary.Main.TextError')}`, id: 12 };
	}
	if (item?.inventory?.stock === 0) return { is_error: true, message: 'This item no longer available', id: 1 };
	if (value === max) return { is_error: false, message: '', id: 6 };
	if (value > max) {
		return { is_error: true, message: 'Exact quantity not available', id: 2 };
	}

	// if (value < min) {
	// 	return { is_error: true, message: 'Can’t add less items than MOQ', id: 10 };
	// }

	if (total_available + product_reserved < item?.pricing?.min_order_quantity) {
		return { is_error: true, message: 'In stock quantity is less than minimum order quantity', id: 8 };
	}

	// (Suyash) removing condition based on discussion - DO NOT DELETE
	// if (value !== 0 && (value - min) % item?.pricing?.step_increment !== 0) {
	// 	return { is_error: true, message: 'Quantity not defined', id: 5 };
	// }
	return { is_error: false, message: '', id: 0 };
};

export const get_entity_error = (
	item: CartProduct,
	value: number,
	product_total_quantity: number,
	current_product_reserved?: number,
	max_quantity_allow: number = 0,
	is_custom_product: boolean = false,
	moq_break_enabled = false,
	is_volume_tier_empty = true,
	is_discount_applied = false,
) => {
	const moq_value_check = () => {
		return value + product_total_quantity < item?.pricing?.min_order_quantity && !moq_break_enabled && !is_custom_product;
	};

	const max = get_max_quantity(item, current_product_reserved, is_custom_product);
	const min = item?.pricing?.min_order_quantity;
	const actual_available = item?.inventory?.available_quantity;
	const total_available = !item?.inventory?.inventory_tracking_enabled
		? item?.pricing?.max_order_quantity
		: item?.inventory?.total_available ?? 0;
	const product_reserved = current_product_reserved ?? 0;
	const out_of_stock_threshold = item?.inventory?.out_of_stock_threshold ?? 0;
	const is_not_in_stock = product_reserved + total_available <= out_of_stock_threshold;
	const is_out_of_stock = item?.inventory?.inventory_status === INVENTORY_STATUS.out_of_stock && is_not_in_stock;
	let suggest = handleSuggestedValue(value, min, max, item?.pricing?.step_increment)?.suggestCount - product_total_quantity;

	if (value > actual_available && value <= total_available && item?.inventory?.inventory_tracking_enabled) {
		const not_instock_amount = value - actual_available;
		const text_error = not_instock_amount > 1 ? t('CartSummary.Main.TextErrorAre') : t('CartSummary.Main.TextErrorIs');
		return { is_error: false, message: `${not_instock_amount} ${text_error} ${t('CartSummary.Main.TextError')}`, id: 12 };
	}

	if (max_quantity_allow > 0) {
		if (value > max_quantity_allow) {
			return { is_error: true, message: 'Can’t add more items', id: 7, suggest };
		}

		// if (value < min || !value) {
		// 	return { is_error: true, message: 'Can’t add less items than MOQ', id: 9, suggest };
		// }
	}

	if (max_quantity_allow <= 0) {
		if (is_out_of_stock) {
			return { is_error: false, message: '', id: 0 };
		}

		if (moq_value_check()) {
			return { is_error: true, message: 'Can’t add less items than MOQ', id: 3, suggest };
		}
		if (value + product_total_quantity === max) return { is_error: false, message: '', id: 6, suggest };
		if (value + product_total_quantity > max) {
			const message = !item?.inventory?.inventory_tracking_enabled
				? `Quantity exceeds max order quantity (${max})`
				: 'Can’t add more items than in stock';
			return { is_error: true, message, id: 4, suggest };
		}

		if (
			!is_discount_applied &&
			is_volume_tier_empty &&
			value + product_total_quantity !== 0 &&
			(value - min) % item?.pricing?.step_increment !== 0 &&
			!moq_break_enabled
		) {
			return { is_error: true, message: 'Quantity not defined', id: 5, suggest };
		}

		if (total_available + product_reserved < item?.pricing?.min_order_quantity) {
			return { is_error: true, message: 'In stock quantity is less than minimum order quantity', id: 8, suggest };
		}
	}

	return { is_error: false, message: '', id: 0 };
};

export const get_discounted_value = (discount_logic_type: string, discount: any, cart_total: number) => {
	if (discount_logic_type === 'value' || discount_logic_type === 'fixed') {
		if (discount) return +discount;
		return 0;
	}
	if (discount_logic_type === 'percentage') {
		const d = (cart_total * +discount) / 100;
		if (discount) return d;
		return 0;
	}

	return 0;
};

export const get_cart_total_on_change_quantity = (
	prev_cart: any,
	entity_id: string,
	quantity: number,
	unit_price: number,
	cart_item_id: string,
) => {
	let item = prev_cart?.items?.[entity_id]?.[cart_item_id];
	let discounted_price = unit_price - get_discounted_value(item?.discount_type, item?.discount_value, unit_price);
	const is_price_modified = _.get(item, 'is_price_modified', false);

	if (item?.discount_type && item?.discount_value) {
		let temp_total = prev_cart?.cart_total - discounted_price * item?.quantity;
		let temp_increase = discounted_price * quantity;
		let cart_total = temp_total + temp_increase;
		return cart_total;
	} else if (is_price_modified) {
		const modified_price = _.get(item, 'final_price', 0);
		let temp_total = prev_cart?.cart_total - modified_price * item?.quantity;
		let temp_increase = modified_price * quantity;
		let cart_total = temp_total + temp_increase;
		return cart_total;
	} else {
		let temp_total = prev_cart?.cart_total - item?.quantity * prev_cart?.items_with_unit_prices?.[cart_item_id];
		let temp_increase = unit_price * quantity;
		let cart_total = temp_total + temp_increase;
		return cart_total;
	}
};

export const format_cart_details_response = (cart: any) => {
	const items_with_unit_prices: any = {};
	for (let entity_id in cart?.products) {
		const item: any = { ...cart?.products?.[entity_id], ...cart?.items?.[entity_id] };
		for (let cart_item_id in cart?.items?.[entity_id]) {
			let cart_item_data = item?.[cart_item_id];
			if (cart_item_data?.quantity) {
				let { unit_price } = get_unit_price_of_product({ ...item, quantity: cart_item_data?.quantity });
				items_with_unit_prices[cart_item_id] = unit_price;
				cart_item_data.initial_price = cart_item_data?.initial_price ?? unit_price;
			}
		}
	}
	//TODO: must change items_with_unit_prices structure if needed
	// items_with_unit_prices[entity_id] = {};
	// for (let cart_item_id in cart?.items[entity_id]) {
	// 	let unit_price = get_unit_price_of_product(item);
	// 	items_with_unit_prices[entity_id][cart_item_id] = unit_price;
	// }
	return { ...cart, items_with_unit_prices };
};

export const get_attr = (product_data: any) => {
	const attr_keys = product_data?.variants_meta?.hinge_attributes || [];
	const attr_value = attr_keys
		.map((attr: any) => {
			return { name: product_data?.custom_attributes?.[attr?.id]?.name, value: product_data?.custom_attributes?.[attr?.id]?.value };
		})
		.filter((v: any) => v.value);
	return attr_value;
};

export const is_quantity_zero = (data: any) => {
	const quantity_zero_keys = _.flatMap(data, (value, parent_key) =>
		_.chain(value)
			.pickBy((obj) => _.get(obj, 'quantity') === 0)
			.keys()
			.map((key) => ({ obj_key: key, parent_key }))
			.value(),
	);
	return quantity_zero_keys.length ? quantity_zero_keys[0] : false;
};

export const handle_get_errors = (data: any) => {
	const error_ids = _.keys(data?.errors);
	const error_product_ids = _.keys(data?.errors);

	let unavailable_product: any = 0;
	let partially_available_product: any = 0;

	_.map(error_product_ids, (key: any) => {
		const error_item: any = _.head(data?.errors?.[key]);
		if (_.includes(BLOCK_CART_STATUS, error_item?.error_code)) {
			unavailable_product += 1;
		} else if (LOW_INVENTORY === error_item?.error_code) {
			partially_available_product += 1;
		}
	});

	return {
		errors_count: _.size(error_ids) || 0,
		unavailable_product_count: unavailable_product || 0,
		low_inventory_count: partially_available_product || 0,
	};
};

export const get_items = (cart: any, return_count: boolean = false) => {
	const { data = {} } = cart;
	const line_items: any = {};
	const items = data?.items;
	const products = data?.products;

	let count = 0;

	_.forEach(_.keys(items), (product_id: string) => {
		_.forEach(_.keys(items[product_id]), (key) => {
			if (isUUID(key)) {
				if (!line_items[product_id]) {
					line_items[product_id] = {};
				}
				count += items?.[product_id]?.[key]?.quantity || 0;
				line_items[product_id][key] = {
					...items?.[product_id]?.[key],
					meta: {
						product_details: products?.[product_id],
					},
				};
			}
		});
	});

	if (return_count === true) {
		return count;
	}
	return line_items;
};

export const get_each_items_count = (cart: any, product_ids: any) => {
	const items = cart?.items;

	let count = 0;

	_.forEach(product_ids, (product_id: string) => {
		const item_keys = _.keys(items?.[product_id]);
		_.forEach(item_keys, (key) => {
			// Fixed the position of closing parenthesis
			if (isUUID(key)) {
				count += items?.[product_id]?.[key]?.quantity || 0;
			}
		});
	});

	return count;
};
