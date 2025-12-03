/**eslint-disable */
import _ from 'lodash';
import jsonLogic from 'json-logic-js';
import dayjs from 'dayjs';

const system_groups = ['inventory_status', 'inventory_status_with_date', 'inventory_status_with_month', 'none'];

export const json_cart_calc_rule_config: any = {
	get_product: {
		quantity: { var: 'cart_item.quantity' },
		id: { var: 'cart_item_key' },
		product_id: { var: 'key' },
		inventory: { var: 'product_info.inventory' },
		final_volume_CBM: {
			'*': [{ if: [{ var: 'product_info.volume_data.CBM' }, { var: 'product_info.volume_data.CBM' }, 0] }, { var: 'cart_item.quantity' }],
		},
		final_volume_CFT: {
			'*': [{ if: [{ var: 'product_info.volume_data.CFT' }, { var: 'product_info.volume_data.CFT' }, 0] }, { var: 'cart_item.quantity' }],
		},
		inventory_status: {
			if: [{ var: 'product_info.inventory.inventory_status' }, { var: 'product_info.inventory.inventory_status' }, 'IN_STOCK'],
		},
		product_state: { var: 'product_info.product_state' },
		final_price: { calculate_price: [{ var: 'product_info' }, { var: 'cart_item' }, { var: 'rule_config' }] },
		final_total: {
			'*': [{ calculate_price: [{ var: 'product_info' }, { var: 'cart_item' }, { var: 'rule_config' }] }, { var: 'cart_item.quantity' }],
		},
		on_order_date: { get_order_date: [{ var: 'product_info' }] },
		on_order_month: { get_order_month: [{ var: 'product_info' }] },
	},
	get_volume_price: {
		if: [
			{ var: 'cart_item.is_price_modified' },
			{ var: 'cart_item.final_price' },
			{
				if: [
					{ var: 'product_info.pricing.volume_tiers' },
					{ volume_price: [{ var: 'product_info' }, { var: 'cart_item' }] },
					{ var: 'cart_item.initial_price' },
				],
			},
		],
	},
	final_price: {
		if: [
			{ '==': [{ var: 'cart_item.discount_type' }, 'percentage'] },
			{ '*': [{ var: 'volumn_price' }, { '-': [1, { '/': [{ var: 'cart_item.discount_value' }, 100] }] }] },
			{ var: 'cart_item.discount_type' },
			{ '-': [{ var: 'volumn_price' }, { var: 'cart_item.discount_value' }] },
			{ var: 'volumn_price' },
		],
	},
	inventory_status: {
		IN_STOCK: {
			filter: [
				{ var: 'items' },
				{
					or: [{ '==': [{ var: 'inventory_status' }, 'IN_STOCK'] }, { '==': [{ var: 'product_state' }, 'ADHOC'] }],
				},
			],
		},
		BACKORDER: {
			filter: [{ var: 'items' }, { '==': [{ var: 'inventory_status' }, 'BACKORDER'] }],
		},
		OUT_OF_STOCK: {
			filter: [{ var: 'items' }, { '==': [{ var: 'inventory_status' }, 'OUT_OF_STOCK'] }],
		},
	},
	inventory_status_with_date: {
		IN_STOCK: {
			filter: [
				{ var: 'items' },
				{
					or: [{ '==': [{ var: 'inventory_status' }, 'IN_STOCK'] }, { '==': [{ var: 'product_state' }, 'ADHOC'] }],
				},
			],
		},
		BACKORDER: {
			group_by: [
				{
					filter: [{ var: 'items' }, { '==': [{ var: 'inventory_status' }, 'BACKORDER'] }],
				},
				'on_order_date',
			],
		},
		OUT_OF_STOCK: {
			group_by: [
				{
					filter: [{ var: 'items' }, { '==': [{ var: 'inventory_status' }, 'OUT_OF_STOCK'] }],
				},
				'on_order_date',
			],
		},
	},
	inventory_status_with_month: {
		IN_STOCK: {
			filter: [
				{ var: 'items' },
				{
					or: [{ '==': [{ var: 'inventory_status' }, 'IN_STOCK'] }, { '==': [{ var: 'product_state' }, 'ADHOC'] }],
				},
			],
		},
		BACKORDER: {
			group_by: [
				{
					filter: [{ var: 'items' }, { '==': [{ var: 'inventory_status' }, 'BACKORDER'] }],
				},
				'on_order_month',
			],
		},
		OUT_OF_STOCK: {
			group_by: [
				{
					filter: [{ var: 'items' }, { '==': [{ var: 'inventory_status' }, 'OUT_OF_STOCK'] }],
				},
				'on_order_month',
			],
		},
	},
	custom_grouping: {
		Ungrouped: {
			var: 'items',
		},
	},
};

// export const cart_validation_rule = {
// 	filter_data: { filter: [{ var: '' }, { '==': [{ var: 'inventory_status' }, 'IN_STOCK'] }] },
// 	effective_price: {
// 		if: [
// 			{
// 				var: "inventory.inventory_tracking_enabled"
// 			},
// 			{
// 				"*": [
// 					{
// 						"min": [
// 							{
// 								var: "inventory.in_stock_quantity"
// 							},
// 							{
// 								var: "quantity"
// 							}
// 						]
// 					},
// 					{
// 						var: "final_price"
// 					}
// 				]
// 			},
// 			{
// 				"*": [
// 					{
// 						var: "final_price"
// 					},
// 					{
// 						var: "quantity"
// 					}
// 				]
// 			}
// 		]
// 	},
// 	is_valid: {
// 		if: [
// 			{ '<': [{ var: 'total' }, 1100] },
// 			[{
// 				key: 'cart_value',
// 				type: 'error',
// 				message: 'cart value',
// 				min_value: 1100,
// 			}, {
// 				key: 'in-stock',
// 				type: 'error',
// 				message: 'in-stock value',
// 				min_value: 1100,
// 			}],
// 			{},
// 		],
// 	},
// 	detail_match: {
// 		"==": [{ var: "product_details.sku_id" }, "PD-000987"],
// 		// some: [
// 		// 	{ var: "product_details.category" },
// 		// 	{ in: [{ var: "name" }, ["Wall Art", "Curtains"]] }
// 		// ]
// 	},
// 	exclude_price: {
// 		some: [
// 			{ var: "product_details.category" },
// 			{ in: [{ var: "name" }, ["Accents"]] }
// 		]
// 	}
// };

jsonLogic.add_operation('calculate_price', (product_info, cart_item, rule_config) => {
	const volumn_price = jsonLogic.apply(rule_config.get_volume_price, {
		product_info,
		cart_item,
	});
	const final_price = jsonLogic.apply(rule_config.final_price, {
		cart_item,
		volumn_price: volumn_price ? volumn_price : 0,
	});

	return typeof final_price === 'string' ? parseInt(final_price) : final_price ?? 0;
});

jsonLogic.add_operation('get_order_date', (product_info) => {
	const in_transit_details = product_info?.inventory?.in_transit_details || [];
	const on_order_details = product_info?.inventory?.on_order_details || [];
	const whole_transit_inventory = [...in_transit_details, ...on_order_details];

	const min_date = _.minBy(
		_.filter(whole_transit_inventory, (item) => item.quantity > 0),
		'date',
	);

	return min_date?.date ? dayjs(min_date?.date * 1000).format("DD MMM' YY") : 'Invalid';
});

jsonLogic.add_operation('get_order_month', (product_info) => {
	const in_transit_details = product_info?.inventory?.in_transit_details || [];
	const on_order_details = product_info?.inventory?.on_order_details || [];
	const whole_transit_inventory = [...in_transit_details, ...on_order_details];

	const min_date = _.minBy(
		_.filter(whole_transit_inventory, (item) => item.quantity > 0),
		'date',
	);
	return min_date?.date ? dayjs(min_date?.date * 1000).format("MMM'YY") : 'Invalid';
});

jsonLogic.add_operation('group_by', (product_info, key) => {
	return _.groupBy(product_info, key);
});

jsonLogic.add_operation('volume_price', (product_info, cart_item) => {
	const filter_tier = _.filter(
		product_info?.pricing?.volume_tiers,
		(item) => item?.start_quantity <= cart_item?.quantity && item?.end_quantity >= cart_item?.quantity,
	);
	const tier_price = _.isEmpty(filter_tier) ? cart_item.initial_price : _.head(filter_tier)?.price;

	return tier_price;
});

const validate_cart = (new_items: any, shipping_rule_config: any) => {
	const filtered_items = !_.isEmpty(shipping_rule_config?.filter_data)
		? jsonLogic.apply(shipping_rule_config?.filter_data, new_items)
		: new_items;

	let match_found = filtered_items?.some((item: any) => jsonLogic.apply(shipping_rule_config?.detail_match, item));

	const items_to_calculate = match_found ? new_items : filtered_items;

	const calculated_items = _.map(items_to_calculate, (item: any) => {
		const exclude_price = !_.isEmpty(shipping_rule_config?.exclude_price)
			? jsonLogic.apply(shipping_rule_config?.exclude_price, item)
			: false;
		return {
			...item,
			effective_price: match_found ? item?.final_total : exclude_price ? 0 : jsonLogic.apply(shipping_rule_config?.effective_price, item),
		};
	});

	const filtered_total = _.sumBy(calculated_items, 'effective_price');
	const validation_val = jsonLogic.apply(shipping_rule_config?.is_valid, { total: filtered_total });

	const validation_response = _.isEmpty(validation_val)
		? {}
		: match_found
		? validation_val?.find((val: any) => val?.key === 'cart_value')
		: validation_val?.find((val: any) => val?.key !== 'cart_value') || {};

	return _.isEmpty(validation_response) ? {} : { ...validation_response, total: filtered_total };
};

export const util_function = ({ data, shipping_rule_config }: any) => {
	const rule_config = json_cart_calc_rule_config;
	const { items, containers, cart_grouping_logic, container_is_display, products, currency }: any = data;

	const unit_for_cart = _.head(containers)?.unit;
	const new_items: any[] = [];
	const validate_cart_items: any[] = [];

	_.map(items, (item: any, key: any) => {
		_.map(item, (cart_item, cart_item_id) => {
			const product_det = products[key];
			const new_obj = { cart_item, cart_item_key: cart_item_id, product_info: product_det, key, rule_config };
			let result: any = {};
			_.mapKeys(rule_config?.get_product, (logic: any, keys: any) => {
				let value: any;
				value = jsonLogic.apply(logic, new_obj);
				if (keys === 'final_price' || keys === 'final_total' || keys === 'final_volume_CFT' || keys === 'final_volume_CBM') {
					result[keys] = value || 0;
				} else {
					result[keys] = value || '';
				}
			});

			new_items.push(result);
			validate_cart_items.push({ ...result, product_details: product_det });
		});
	});

	const cart_valid_result = validate_cart(validate_cart_items, shipping_rule_config);

	let grouping_data: any[] = [];
	_.mapKeys(rule_config?.[cart_grouping_logic?.group_by], (logic: any, key: any) => {
		let value: any;
		value = jsonLogic.apply(logic, { items: new_items });
		if (
			key !== 'IN_STOCK' &&
			!_.isEmpty(value) &&
			cart_grouping_logic?.group_by !== 'inventory_status' &&
			cart_grouping_logic?.group_by !== 'custom_grouping'
		) {
			let other_groups: any[] = _.map(value, (item: any, itemkey: string) => {
				return {
					base_name: key,
					sub_group_name: itemkey === 'Invalid' ? 'ETA unkown' : `Earliest arriving by ${itemkey}`,
					products: _.uniq(_.map(item, (_item) => _item?.product_id)),
					cart_items: _.map(item, (_item) => _item?.id),
					group_total_price: parseFloat(_.sumBy(item, 'final_total')?.toFixed(2)),
					group_currency: currency,
					grouping_date: dayjs(_.head(item)?.on_order_date).unix(),
					group_total_volume:
						unit_for_cart === 'CFT'
							? parseFloat(_.sumBy(item, 'final_volume_CFT')?.toFixed(2))
							: parseFloat(_.sumBy(item, 'final_volume_CBM')?.toFixed(2)),
					group_volume_data: {
						CFT: parseFloat(_.sumBy(item, 'final_volume_CFT')?.toFixed(2)),
						CBM: parseFloat(_.sumBy(item, 'final_volume_CBM')?.toFixed(2)),
					},
					group_volume_unit: unit_for_cart,
				};
			});
			other_groups = _.sortBy(other_groups, 'grouping_date');
			grouping_data.push(...other_groups);
		} else if (!_.isEmpty(value)) {
			const get_item = {
				base_name: key,
				sub_group_name: '',
				products: _.uniq(_.map(value, (_item) => _item?.product_id)),
				cart_items: _.map(value, (item) => item?.id),
				group_total_price: _.sumBy(value, 'final_total')?.toFixed(2),
				group_currency: currency,
				group_total_volume:
					unit_for_cart === 'CFT'
						? parseFloat(_.sumBy(value, 'final_volume_CFT')?.toFixed(2))
						: parseFloat(_.sumBy(value, 'final_volume_CBM')?.toFixed(2)),
				group_volume_data: {
					CFT: parseFloat(_.sumBy(value, 'final_volume_CFT')?.toFixed(2)),
					CBM: parseFloat(_.sumBy(value, 'final_volume_CBM')?.toFixed(2)),
				},
				group_volume_unit: unit_for_cart,
			};

			grouping_data.push(get_item);
		}
	});

	const container_volume_filled_data =
		cart_grouping_logic?.group_by === 'none' || !cart_grouping_logic?.group_by
			? {
					CBM: _.sumBy(new_items, 'final_volume_CBM'),
					CFT: _.sumBy(new_items, 'final_volume_CFT'),
			  }
			: {
					CBM: _.sumBy(grouping_data, 'group_volume_data.CBM'),
					CFT: _.sumBy(grouping_data, 'group_volume_data.CFT'),
			  };
	if (_.includes(system_groups, cart_grouping_logic?.group_by) || _.isEmpty(cart_grouping_logic?.groups))
		return {
			grouping_data: { groups: cart_grouping_logic?.group_by === 'none' ? [] : grouping_data },
			container_data: {
				containers: _.map(containers, (item) => {
					return {
						...item,
						container_volume_filled_data,
						container_volume_data: {
							CFT: unit_for_cart === 'CFT' ? item?.container_volume : parseFloat((item?.container_volume * 35.314667)?.toFixed(2)),
							CBM: unit_for_cart === 'CBM' ? item?.container_volume : parseFloat((item?.container_volume * 0.0283168466)?.toFixed(2)),
						},
					};
				}),
				container_is_display,
				cart_volume_unit: unit_for_cart,
			},
			cart_error: cart_valid_result,
		};
	else {
		let not_ungrouped_vals: any[] = [];
		let not_ungrouped_vals_products: any[] = [];
		let grouping_data_2: any[] = _.map(cart_grouping_logic?.groups, (group) => {
			if (group?.base_name !== 'Ungrouped') {
				not_ungrouped_vals.push(...group?.cart_items);
				not_ungrouped_vals_products.push(...group?.products);
			}
			const total_price = _.sumBy(
				_.map(new_items, (item) => (group?.cart_items?.includes(item?.id) ? item : null)),
				'final_total',
			);
			const cft_volume = _.sumBy(
				_.map(new_items, (item) => (group?.cart_items?.includes(item?.id) ? item : null)),
				'final_volume_CFT',
			);
			const cbm_volume = _.sumBy(
				_.map(new_items, (item) => (group?.cart_items?.includes(item?.id) ? item : null)),
				'final_volume_CBM',
			);
			return {
				...group,
				group_total_price: total_price || 0,
				group_currency: currency,
				group_total_volume: unit_for_cart === 'CFT' ? cft_volume : cbm_volume,
				group_volume_data: {
					CFT: cft_volume,
					CBM: cbm_volume,
				},
				group_volume_unit: unit_for_cart,
			};
		});
		const new_grouping_data: any = _.map(grouping_data_2, (item) => {
			if (item?.base_name === 'Ungrouped') {
				const new_item = _.find(grouping_data, { base_name: 'Ungrouped' })?.cart_items;
				const new_item_product = _.find(grouping_data, { base_name: 'Ungrouped' })?.products;
				const filtered_items = _.filter(new_item, (_item) => !_.includes(not_ungrouped_vals, _item));
				const filtered_products = _.filter(new_item_product, (_item) => !_.includes(not_ungrouped_vals_products, _item));

				const total_price = _.sumBy(
					_.map(new_items, (_item) => (filtered_items?.includes(_item?.id) ? _item : null)),
					'final_total',
				);
				const cft_volume = _.sumBy(
					_.map(new_items, (_item) => (filtered_items?.includes(_item?.id) ? _item : null)),
					'final_volume_CFT',
				);
				const cbm_volume = _.sumBy(
					_.map(new_items, (_item) => (filtered_items?.includes(_item?.id) ? _item : null)),
					'final_volume_CBM',
				);
				return {
					base_name: 'Ungrouped',
					sub_group_name: '',
					cart_items: filtered_items,
					products: _.uniq(filtered_products),
					group_total_price: parseFloat(total_price?.toFixed(2)) || 0,
					group_currency: currency,
					group_total_volume: unit_for_cart === 'CFT' ? parseFloat(cft_volume?.toFixed(2)) : parseFloat(cbm_volume?.toFixed(2)),
					group_volume_data: {
						CFT: parseFloat(cft_volume?.toFixed(2)),
						CBM: parseFloat(cbm_volume?.toFixed(2)),
					},
					group_volume_unit: unit_for_cart,
				};
			} else return item;
		});

		const container_volume_filled_data_custom = {
			CBM: _.sumBy(new_grouping_data, 'group_volume_data.CBM'),
			CFT: _.sumBy(new_grouping_data, 'group_volume_data.CFT'),
		};
		return {
			grouping_data: { groups: cart_grouping_logic?.group_by === 'none' ? [] : new_grouping_data },
			container_data: {
				containers: _.map(containers, (item) => {
					return {
						...item,
						container_volume_filled_data: container_volume_filled_data_custom,
						container_volume_data: {
							CFT: unit_for_cart === 'CFT' ? item?.container_volume : parseFloat((item?.container_volume * 35.314667)?.toFixed(2)),
							CBM: unit_for_cart === 'CBM' ? item?.container_volume : parseFloat((item?.container_volume * 0.0283168466)?.toFixed(2)),
						},
					};
				}),
				container_is_display,
				cart_volume_unit: unit_for_cart,
			},
		};
	}
};
