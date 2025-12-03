import _ from 'lodash';
import { IFiltersSelect, ISelectedFilters } from 'src/common/@the-source/molecules/FiltersAndChips/interfaces';
import { ALL_PRODUCTS_FILTERS_STORAGE_KEY, CardData, FILTER_KEYS, MAX_HITS_LIMIT, PAGE_TYPE_MAP, PRODUCTS_PER_PAGE } from './constants';
import { Sort } from './ProductListing';
import { Product } from './mock/ProductInterface';
import { remove_item_from_session_storage } from 'src/utils/common';

interface CategoryLevels {
	categoryLevel2?: string;
	categoryLevel3?: string;
}

type PathElements = string[];
type SelectFilter = Record<string, any>;

export const generateUrl = (
	select_filter: SelectFilter,
	search: string,
	sortData: Sort[],
	sort: any,
	type: string = '',
	category_levels: CategoryLevels = {},
	path_elements: PathElements = [],
	default_reset: boolean = false,
	current_page: number,
): string => {
	const _keys = Object.keys(select_filter);
	let newUrl = `?search=${encodeURIComponent(search)}`;

	if (type !== '') {
		newUrl += `&type=${type}`;
	}
	if (current_page) {
		newUrl = `${newUrl}&page=${current_page}`;
	}
	// Add categoryLevel2 and categoryLevel3 to the URL if they exist
	if (category_levels.categoryLevel2) {
		newUrl += `&categoryLevel2=${category_levels.categoryLevel2}`;
	}
	if (category_levels.categoryLevel3) {
		newUrl += `&categoryLevel3=${category_levels.categoryLevel3}`;
	}

	if (_keys?.length > 0) {
		_keys.forEach((_key: string) => {
			const _attrKeys = Object.keys(select_filter[_key]);
			_attrKeys.forEach((_attr) => {
				if (_key === 'filters') {
					if ((!path_elements[2] || path_elements[2] !== _attr) && select_filter[_key][_attr]?.length > 0) {
						newUrl = `${newUrl}&${_key}*${_attr}=${encodeURIComponent(select_filter[_key][_attr])}&`;
					}
				} else {
					newUrl = `${newUrl}&${_key}*${_attr}=${encodeURIComponent(JSON.stringify(select_filter[_key][_attr]))}&`;
				}
			});
		});
	}

	if (!sortData.find((s) => s.key.field === sort?.field && s.key.order === sort?.order)?.is_default) {
		newUrl = `${newUrl}&sort=${sort?.field}*${sort?.order}`;
	}

	if (default_reset === true) {
		newUrl = `${newUrl}&default_reset=true`;
	}

	return newUrl;
};

interface FilterMeta {
	key: string;
	type: string;
}

interface FilterType {
	meta: FilterMeta;
	name: string;
}

const get_category_names = (values: string[], categories: CardData[]) => {
	return values.map((value) => {
		return categories?.find((category) => category.id === value)?.name;
	});
};

export const createFilterChip = (
	keyTags: string[],
	values: string[],
	_filter: FilterType,
	categories?: CardData[],
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	collections?: CardData[],
): any | null => {
	if (keyTags[0] === 'range_filters') {
		const { gte, lte } = JSON.parse(values?.join())?.value;
		return {
			value: [gte, lte, ''],
			key: keyTags[1],
			label: keyTags[1].replace(/^\w/, (c) => c?.toUpperCase()),
			type: _filter?.meta?.type,
		};
	} else if (keyTags[1] === 'category') {
		if (categories && !get_category_names(values, categories)) {
			return null;
		}
		return {
			value: categories ? get_category_names(values, categories) : '',
			key: keyTags[1],
			label: _filter.name,
			type: 'category',
		};
	} else if (keyTags[1] === 'collection') {
		if (collections && !get_category_names(values, collections)) {
			return null;
		}
		return {
			value: collections ? get_category_names(values, collections) : '',
			key: keyTags[1],
			label: _filter.name,
			type: 'category',
		};
	} else if (keyTags[0] === 'filters') {
		return {
			value: [...values],
			key: keyTags[1],
			label: _filter.name,
			type: _filter.meta.type,
		};
	}
	return null;
};

export const sort_products_and_convert_to_array = (products: { [key: string]: Product }) => {
	return Object.values(products)?.sort((a, b) => a.position - b.position);
};

export const get_session_state = (key: string) => {
	const session_data = sessionStorage.getItem(ALL_PRODUCTS_FILTERS_STORAGE_KEY);
	try {
		if (session_data && typeof session_data === 'string') {
			const parsed_data = JSON.parse(session_data);
			return _.get(parsed_data, key);
		}
	} catch {}
	return null;
};

export const extractFiltersAndChips = (
	filters: FilterType[],
	categories?: CardData[],
	collections?: CardData[],
	default_filters?: IFiltersSelect,
	default_filters_reset?: boolean,
): { _filterData: ISelectedFilters; _filterChips: any[] } => {
	const _filterData: ISelectedFilters = {
		range_filters: {},
		filters: {},
	};
	const _filterChips = [];
	const params = new URLSearchParams(window.location.search);

	for (const key of params.keys()) {
		const key_tags = key.split('*');
		const values = params.get(key)?.split(',') || [];
		if (key_tags[0] === 'filters' && key_tags[1]) {
			_filterData.filters[key_tags[1]] = values;
		} else if (key_tags[0] === 'range_filters' && key_tags[1]) {
			const parsedData = _.attempt(JSON.parse, params.get(key) || '{}');
			if (!_.isError(parsedData)) {
				_filterData.range_filters[key_tags[1]] = parsedData;
			} else {
				continue;
			}
		}
		const _filter = filters.find((_f) => _f.meta.key === key_tags[1]);
		if (_filter) {
			const chip = createFilterChip(key_tags, values, _filter, categories, collections);
			if (chip) {
				_filterChips.push(chip);
			}
		}
	}

	if (_.isEmpty(_filterData.range_filters) && _.isEmpty(_filterData.filters)) {
		const search_value = params.get('search');
		if (_.isEmpty(search_value)) {
			const parsed_data = get_session_state(FILTER_KEYS.FILTERS);
			if (parsed_data && parsed_data?.filters && parsed_data?.range_filters) {
				_filterData.filters = parsed_data.filters;
				_filterData.range_filters = parsed_data.range_filters;
			}
		}
	}

	if (!default_filters_reset) {
		for (const key of _.keys(default_filters)) {
			if (_.isEmpty(_filterData.filters[key])) {
				_filterData.filters[key] = default_filters?.[key] || [];
			} else {
				_filterData.filters[key] = [..._filterData.filters[key], ..._.difference(default_filters?.[key], _filterData.filters[key])];
			}

			const _filter = filters.find((_f) => _f.meta.key === key);
			if (_filter) {
				const chip = createFilterChip(['filters', key], default_filters?.[key] || [], _filter, categories, collections);
				if (chip) {
					_filterChips.push(chip);
				}
			}
		}
	}

	return { _filterData, _filterChips };
};

export const get_cart_items = (data: any, cart: any) => {
	let count = 0;
	const is_variant = _.get(data, 'type') === 'variant';
	const product_items = Object.values(cart?.products);

	if (_.size(data?.inner_hits) > 0) {
		[data?.id, ...data?.inner_hits].forEach((product_id: string) => {
			for (const item of product_items as any) {
				if (product_id === item?.id) {
					for (let cart_item in item) {
						if (item?.[cart_item]?.quantity && !item?.[cart_item]?.is_custom_product) {
							count += item[cart_item]?.quantity;
						}
					}
				}
			}
		});

		return count;
	}
	const product_id = is_variant ? data?.id : data?.parent_id;
	for (const item of product_items as any) {
		if (product_id === item?.parent_id) {
			for (let cart_item in item) {
				if (item?.[cart_item]?.quantity && !item?.[cart_item]?.is_custom_product) {
					count += item[cart_item]?.quantity;
				}
			}
		}
	}
	return count;
};

export const from_max_quantity = (max_quantity: number, max: number) => {
	if (max_quantity === max) {
		return 'max order quantity';
	} else {
		return ' Inventory';
	}
};

export const get_max_quantity = (product: any, product_reserve_quantity: number = 0, is_custom_product?: boolean) => {
	if (is_custom_product) {
		return Infinity;
	}
	if (product?.inventory?.inventory_tracking_enabled === false) {
		return product?.pricing?.max_order_quantity;
	}
	return Math.min(product?.pricing?.max_order_quantity, product?.inventory?.total_available + product_reserve_quantity);
};

export const get_product_detail = (data: any) => {
	const is_variant = _.get(data, 'type') === 'variant';
	const product_id = is_variant ? data.id : data?.variants_meta?.variant_data_map?.[0]?.product_id;
	const parent_id = is_variant ? data.parent_id : data?.id;

	return { is_variant, product_id, parent_id };
};

export const clear_filters_from_session_storage = () => {
	remove_item_from_session_storage(ALL_PRODUCTS_FILTERS_STORAGE_KEY);
};

export const get_updated_default_filters = (default_filters: IFiltersSelect, selected_filters: ISelectedFilters) => {
	if (_.isEmpty(default_filters)) return selected_filters;

	const updated_filters = { ...selected_filters };

	for (const key of _.keys(default_filters)) {
		if (_.isEmpty(updated_filters.filters[key])) {
			updated_filters.filters[key] = default_filters?.[key] || [];
		} else {
			const new_values = _.difference(default_filters?.[key], updated_filters.filters[key]);
			updated_filters.filters[key] = [...updated_filters.filters[key], ...new_values];
		}
	}
	return updated_filters;
};

export const get_page_size_by_type = (type: string) => {
	switch (type) {
		case PAGE_TYPE_MAP.CATEGORY:
			return PRODUCTS_PER_PAGE.CATEGORIES_PAGE;
		case PAGE_TYPE_MAP.COLLECTION:
			return PRODUCTS_PER_PAGE.COLLECTIONS_PAGE;
		default:
			return PRODUCTS_PER_PAGE.EXPLORE_ALL;
	}
};

export const get_selected_filters_by_type = (selected_filters: any, type: string) => {
	let filters = _.cloneDeep(_.get(selected_filters, 'filters'));
	switch (type) {
		case PAGE_TYPE_MAP.CATEGORY:
			// Check if 'category' exists and is non-empty, then delete it
			if (_.has(filters, 'category') && _.some(filters?.category, (val) => !_.isEmpty(val))) {
				delete filters?.category;
			}
			return { ...selected_filters, filters }; // Return updated filters

		case PAGE_TYPE_MAP.COLLECTION:
			// Check if 'collection' exists and is non-empty, then delete it
			if (_.has(filters, 'collection') && _.some(filters?.collection, (val) => !_.isEmpty(val))) {
				delete filters?.collection;
			}
			return { ...selected_filters, filters }; // Return updated filters
		default:
			return selected_filters; // If no specific type, return as is
	}
};

export const get_pagination_range = (page: number, products_per_page: number, nb_hits: number) => {
	const start_count = (page - 1) * products_per_page + 1;
	const end_count = nb_hits > page * products_per_page ? page * products_per_page : nb_hits;
	return { start_count, end_count };
};
export const has_any_applied_filters = (selected_filters: ISelectedFilters) => {
	const { filters = {}, range_filters = {} } = selected_filters;
	const has_filters = !_.isEmpty(filters) && _.some(filters, (val) => !_.isEmpty(val));
	const has_range_filters = !_.isEmpty(range_filters) && _.some(range_filters, (val) => !_.isEmpty(val));
	return has_filters || has_range_filters;
};

export const has_search_or_filters = (search: string, selected_filters: ISelectedFilters): boolean => {
	const is_search_empty = search === ''; // Keeping it as it was before
	const has_filters = has_any_applied_filters(selected_filters); // Reuse the first method
	// Return true if there are active filters, range filters, or if search is not empty
	return !(is_search_empty && !has_filters);
};

export const calculate_total_pages = (nb_hits: number, nb_pages: number, products_per_page: number): number => {
	// Check if the total hits exceed the maximum allowed limit
	if (nb_hits > MAX_HITS_LIMIT) {
		// Calculate the maximum pages the user can access based on the limit
		return Math.ceil(MAX_HITS_LIMIT / products_per_page);
	}
	// If hits are within the limit, return the actual number of pages
	return nb_pages;
};

export const get_sort = (field: any, order: any, sortData: Sort[]) => {
	return sortData?.find((s) => s.key.field === field && s.key.order === order)?.key || {};
};
