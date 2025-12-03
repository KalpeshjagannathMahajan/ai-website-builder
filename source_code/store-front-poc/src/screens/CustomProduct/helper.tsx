import { t } from 'i18next';
import _ from 'lodash';
import CustomText from 'src/common/@the-source/CustomText';

export const handle_field_validations = (value: number, isMandatory: boolean, min: number, max: number) => {
	if (value === undefined || typeof value !== 'number') {
		return { valid: false, error: 'Value is undefined or not a number' };
	}
	if (isMandatory) {
		const minValue = min ? min : 1;
		if (value < minValue) {
			return { valid: false, error: `Select atleast ${minValue} ${minValue === 1 ? 'item' : 'items'}` };
		}
	} else {
		if (min && value > 0 && value < min) {
			return { valid: false, error: `Select atleast ${min} items or no item` };
		}
		return { valid: true };
	}
	if (max && value > max) {
		return { valid: false, error: `Value must not exceed ${max}` };
	}

	return { valid: true };
};

const calculatePriceByLogicType = (prices: number[], logicType: string, percentage: number) => {
	let price = 0;
	switch (logicType) {
		case 'max':
			price = Math.max(...prices);
			break;
		case 'min':
			price = Math.min(...prices);
			break;
		case 'average':
			price = prices?.reduce((acc: any, cur: any) => acc + cur, 0) / prices?.length;
			break;
		default:
			price = prices?.reduce((acc: any, cur: any) => acc + cur, 0); // sum
			break;
	}
	if (percentage) {
		price += (price * percentage) / 100;
	}
	return price;
};

export const calculatePriceForSelections = (customVal: any, mockData: any, set_total: any, base_price?: number) => {
	let totalPrice = base_price || 0;

	Object.entries(customVal).forEach(([category, selection]: any) => {
		if (!selection) return;

		const categoryData = mockData.find((c: any) => c?.id === category);
		if (!categoryData) return;

		const { type, options, pricing_logic } = categoryData;
		const { type: logicType = '', percentage = 0 } = pricing_logic || {};

		switch (type) {
			case 'Multi Select': {
				const selectedItems = selection?.split(',')?.map((item: any) => item?.trim());
				const prices = selectedItems?.map((itemName: any) => options?.find((option: any) => option?.display_name === itemName)?.price || 0);

				let categoryPrice = prices?.length < 2 ? prices[0] : calculatePriceByLogicType(prices, logicType?.toLowerCase(), percentage);

				totalPrice += categoryPrice;
				break;
			}
			case 'Single Select': {
				const itemData = options?.find((option: any) => option?.display_name === selection);
				totalPrice += itemData?.price || 0;
				break;
			}
			case 'Counter': {
				const perUnit = options[0]?.price || 0;
				totalPrice += selection * perUnit;
				break;
			}
		}
	});

	set_total(totalPrice);
};
export const transformData = (custom_data: any, data: any) => {
	let transformed = {};

	Object.keys(custom_data)?.map((key: any) => {
		const modifier: any = _.find(data, { id: key });

		if (!custom_data[key]) {
			transformed = { ...transformed };
		} else {
			transformed = {
				...transformed,
				[key]: {
					value: custom_data[key],
					label: modifier?.name || '',
				},
			};
		}
	});
	return transformed;
};

export const generate_sku_id = (selected_options: any, modifiers: any, custom_val: any, set_sku_id: any, default_sku_id: string) => {
	let options_for_sku: any = [];

	_.forEach(selected_options, (selected_option_names, modifier_id) => {
		const modifier = _.find(modifiers, { id: modifier_id });

		if (!modifier) return;
		let suffixes: any = '';
		if (custom_val[modifier?.id]) {
			suffixes = _.chain(modifier?.options)
				.filter((option) => _.includes(selected_option_names, option?.name) && option?.suffix)
				.map('suffix')
				.value();
		}

		if (modifier?.type === 'Multi Select' && !_.isEmpty(suffixes)) {
			options_for_sku.push({ priority: modifier?.priority, suffix: suffixes?.join('|') });
		} else if (modifier?.type === 'Counter' && custom_val[modifier?.id] > 0) {
			const suffix = _.head(modifier?.options)?.suffix + custom_val[modifier?.id] || '';
			options_for_sku.push({ priority: modifier?.priority, suffix });
		} else if (!_.isEmpty(suffixes)) {
			_.each(suffixes, (suffix) => options_for_sku.push({ priority: modifier?.priority, suffix }));
		}
	});

	const sortedOptionsForSKU = _.sortBy(options_for_sku, ['priority']);
	const suffixes = _.map(sortedOptionsForSKU, 'suffix').join('-');
	if (suffixes) {
		const new_sku_id = `${default_sku_id}-${suffixes}`;
		set_sku_id(new_sku_id);
	} else {
		set_sku_id(default_sku_id || '');
	}
};

export const handle_subtext = (attr: any, errors: any, modifiers: any, done_click: any, custom_val: any, primary: any, orange: any) => {
	const is_counter = attr?.type === 'Counter';
	const has_error = !errors[attr?.id]?.valid && done_click;
	const min_selection = attr?.min_selection_quantity;
	const max_selection = attr?.max_selection_quantity;

	let message = '';

	if (min_selection > 0 || max_selection > 0) {
		const type_phrase = is_counter ? 'Add' : 'Select';
		const min_phrase = min_selection > 0 ? `at least ${min_selection}` : '';
		const max_phrase = max_selection > 0 ? `up to ${max_selection}` : '';
		const options_phrase = is_counter ? '' : max_selection === 1 ? 'option' : 'options';

		message = `${type_phrase} ${min_phrase}${min_selection > 0 && max_selection > 0 ? ' and ' : ' '}${max_phrase} ${options_phrase} ${
			modifiers ? t('CustomProduct.CustomText.SelectLongPress') : ''
		}`;
	}

	if (attr?.mandatory) {
		return (
			<CustomText type='Body' style={{ color: has_error ? orange : primary, margin: '5px 0px 5px 1px' }}>
				{message}
			</CustomText>
		);
	} else {
		return (
			<>
				{!_.isEmpty(custom_val[attr?.id]) && (
					<CustomText type='Body' style={{ color: has_error ? orange : primary, margin: '5px 0px 5px 1px' }}>
						{message}
					</CustomText>
				)}
			</>
		);
	}
};
export const should_show_modifier = (modifier: any, sorted_data: any, custom_val: any): boolean => {
	if (!modifier.parent_modifier_id) {
		return true;
	}

	const parent_modifier = sorted_data.find((m: any) => m.id === modifier.parent_modifier_id);
	if (!parent_modifier) {
		return false;
	}

	const parent_selected_value = custom_val[parent_modifier.id];
	if (!parent_selected_value) {
		return false;
	}

	const selected_values =
		typeof parent_selected_value === 'string'
			? parent_selected_value.split(',')
			: typeof parent_selected_value === 'number'
			? [parent_selected_value.toString()]
			: Array.isArray(parent_selected_value)
			? parent_selected_value
			: [];

	return selected_values.some((value: string) => modifier?.parent_modifier_values?.includes(value.trim()));
};
