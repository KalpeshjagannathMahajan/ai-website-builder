/**eslint-disable */
import _ from 'lodash';
import jsonLogic from 'json-logic-js';

jsonLogic.add_operation('cart_total', (products, items, rule_config) => {
	return _.reduce(
		items,
		(total, product_items, product_id) => {
			const product = products?.[product_id];
			const price = product?.pricing?.price;

			const categories = product?.category || [];
			const is_valid_category = _.every(categories, (category) => jsonLogic.apply(rule_config?.cart_total_rule?.category_rule, category));

			if (is_valid_category) {
				const group_total = _.sumBy(_.values(product_items), (item) => (item?.quantity || 0) * (price || 0));
				return total + group_total;
			}
			return total;
		},
		0,
	);
});

const get_default_shipping_address = (buyer_details: any) => {
	const shipping_addresses = _.get(buyer_details, 'sections', []).find((section: any) => section.key === 'addresses');
	const default_shipping_address_id = _.get(shipping_addresses, 'default_shipping_address');
	return _.get(shipping_addresses, 'addresses', []).find((address: any) => address.id === default_shipping_address_id);
};

const get_tax_rate = (tax_preferences: any) => {
	return _.get(tax_preferences, 'attributes', []).find((attr: any) => attr.id === 'tax_rate')?.value;
};

export const util_function = ({ cart, buyer_details, rule_config, cart_items }: any) => {
	// buyer check
	const default_shipping_address = get_default_shipping_address(buyer_details);
	const state_attr = _.find(_.get(default_shipping_address, 'attributes', []), (attr: any) => attr.id === 'state');

	const tax_preferences = _.get(buyer_details, 'sections', []).find((section: any) => section.key === 'tax_preferences');
	const tax_result = jsonLogic.apply(rule_config?.buyer_rules?.tax_rule, tax_preferences);
	const state_result = jsonLogic.apply(rule_config?.buyer_rules?.state_rule, state_attr);

	let tax_rate;
	if (tax_result && state_result) {
		tax_rate = get_tax_rate(tax_preferences);
	}

	const cart_total_custom_result = jsonLogic.apply(rule_config?.cart_total_custom, {
		products: cart?.products,
		items: cart_items,
		rule_config,
	});

	// shipping rule check
	const shipping_rule_result = jsonLogic.apply(rule_config?.charge_rule, {
		cart_total: cart_total_custom_result,
	});

	const { charges = [], nudge = {}, disclaimer = {} } = shipping_rule_result || {};

	const sorted_charges = _.sortBy(charges || [], (charge) => {
		return _.get(charge, 'priority', Infinity);
	});

	return {
		cart_total: cart_total_custom_result,
		tax: {
			...(tax_rate && {
				value_type: 'percentage',
				charge_type: 'tax',
				value: tax_rate,
			}),
		},
		charge: [...sorted_charges],
		nudge: nudge ? { ...nudge } : {},
		disclaimer: disclaimer ? { ...disclaimer } : {},
	};
};
