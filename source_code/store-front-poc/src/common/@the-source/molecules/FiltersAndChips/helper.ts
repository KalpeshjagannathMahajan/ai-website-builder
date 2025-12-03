import _ from 'lodash';
import { IChip, IFilters, ISelectedFilters, ISortData } from './interfaces';

export const get_default_sort = (sort_data: ISortData[], sort: any) => {
	const _default = sort_data?.find((d) => d?.key?.field === sort?.field && d?.key?.order === sort?.order) || sort_data[0];
	return `${_default?.key?.field}*${_default?.key?.order}`;
};

export const transform_collection_facet = (collection_facet: any, collections: any[]) => {
	const { buckets } = collection_facet.collections;

	const options = _.map(buckets, (bucket) => {
		const _collection = collections.find((collection) => collection.id === bucket.key);
		if (_collection) {
			return {
				[_collection.name]: bucket.doc_count,
			};
		}
	});
	return options;
};

export const transform_categories_facet = (
	categories_facet: any,
	categories: any[],
	filter_chips_list: IChip[],
	select_filter: ISelectedFilters,
) => {
	const { buckets } = categories_facet.category;
	const _categories_temp: any[] = [];
	const applied: string[] = [];

	const _chips: string[] = [];
	const _chips_ids: string[] = [];

	// Map to find category bucket details
	const category_bucket_sorted = buckets
		.map((bucket: any) => {
			const _category = categories.find((category) => category.id === bucket.key);

			return {
				level: _category?.level,
				count: bucket.doc_count,
				name: _category?.name,
				id: bucket.key,
				path: _category?.path,
				parent_id: _category?.parent_id,
			};
		})
		.sort((a: any, b: any) => a.level - b.level);

	_.forEach(category_bucket_sorted, (bucket) => {
		switch (bucket?.level) {
			case 1:
				if (select_filter?.filters?.category?.indexOf(bucket.id) >= 0) {
					applied.push(bucket.name);
					_chips.push(bucket.name);
					_chips_ids.push(bucket.id);
				}
				_categories_temp.push({
					children: [],
					count: bucket.count,
					name: bucket.name,
					id: bucket.id,
				});
				break;
			case 2:
				const _index = _categories_temp.findIndex((_category) => _category.id === bucket.parent_id);

				if (_index >= 0) {
					if (select_filter?.filters?.category?.indexOf(bucket.id) >= 0 && applied.indexOf(_categories_temp[_index]?.name) === -1) {
						applied.push(`${_categories_temp[_index]?.name} > ${bucket.name}`);
						_chips.push(bucket.name);
						_chips_ids.push(bucket.id);
					}
					_categories_temp[_index].children.push({
						children: [],
						count: bucket.count,
						name: bucket.name,
						id: bucket.id,
					});
				}
				break;
			case 3:
				const level_2_parent = category_bucket_sorted.find((b: any) => b.id === bucket.parent_id);
				const level_1_parent_index = _categories_temp.findIndex((b) => b.id === level_2_parent.parent_id);
				const level_2_parent_index = _categories_temp[level_1_parent_index].children.findIndex((b: any) => b.id === bucket.parent_id);

				if (
					select_filter?.filters?.category?.indexOf(bucket.id) >= 0 &&
					applied.indexOf(_categories_temp[level_1_parent_index]?.children[level_2_parent_index].name) === -1 &&
					applied.indexOf(_categories_temp[level_1_parent_index]?.name) === -1
				) {
					applied.push(`${_categories_temp[level_1_parent_index]?.name} > ${level_2_parent.name} > ${bucket.name}`);
					_chips.push(bucket.name);
					_chips_ids.push(bucket.id);
				}
				_categories_temp[level_1_parent_index].children[level_2_parent_index]?.children.push({
					children: [],
					count: bucket.count,
					name: bucket.name,
					id: bucket.id,
				});
				break;
			default:
				break;
		}
	});

	let _filter_chips_list = [];

	if (_chips.length > 0) {
		if (filter_chips_list.filter((filter) => filter.key === 'category')?.length > 0) {
			_filter_chips_list = filter_chips_list.map((_filter: IChip) => {
				if (_filter?.key === 'category') {
					return {
						..._filter,
						value: [..._chips],
					};
				} else {
					return _filter;
				}
			});
		} else {
			_filter_chips_list = [
				...filter_chips_list,
				{
					value: [..._chips],
					key: 'category',
					label: 'Category',
					type: 'category',
					ids: [..._chips_ids],
				},
			];
		}
	} else {
		_filter_chips_list = filter_chips_list.filter((_chip: IChip) => _chip.key !== 'category');
	}
	return { options: _categories_temp, applied, _filter_chips_list };
};

export const transform_attribute_facet = (id: string, _facets: any) => {
	const _attribute = _facets.attributes[id];
	if (_attribute === undefined) {
		return null;
	}
	const options = _attribute?.buckets[id]?.values?.buckets?.map((bucket: any) => {
		return {
			[bucket.key]: bucket.doc_count,
		};
	});
	return options;
};

export const _transform_facets = (
	filters: IFilters[],
	_facets: any,
	categories: any[],
	collections: any[],
	filter_chips_list: IChip[],
	select_filter: ISelectedFilters,
	is_category_page: boolean,
	is_collections_page: boolean,
) => {
	const temp_facets_transform: any[] = [];
	let temp_filter_chips = JSON.parse(JSON.stringify(filter_chips_list));

	const sorted_filters = filters.sort((a: any, b: any) => a.priority - b.priority);
	_.forEach(sorted_filters, (filter: any) => {
		// category, collection, attributes
		switch (filter.entity_name) {
			case 'category':
				if (is_category_page === true) {
					break;
				}
				const _temp = transform_categories_facet(_facets.categories, categories, temp_filter_chips, select_filter);

				if (!_temp || _temp.options.length === 0) {
					break;
				}

				temp_filter_chips = [..._temp._filter_chips_list];

				temp_facets_transform.push({
					meta: {
						key: 'category',
						type: 'category',
					},
					name: 'Category',
					priority: 0,
					data: _temp,
				});
				break;
			case 'collection':
				if (is_collections_page === true) {
					break;
				}
				const collections_temp = transform_collection_facet(_facets.collections, collections);

				if (!collections_temp || collections_temp.length === 0) {
					break;
				}
				const _applied = collections.filter((_f) => select_filter?.filters?.[filter.meta.key]?.includes(_f.id)).map((_f) => _f.name);

				temp_facets_transform.push({
					meta: filter.meta,
					name: filter.name,
					priority: filter.priority,
					data: {
						options: collections_temp,
						applied: _applied || [],
					},
				});

				break;
			case 'created_at':
				temp_facets_transform.push({
					meta: filter.meta,
					name: filter.name,
					priority: filter.priority,
				});
				break;
			case 'price':
				const price_facet = _facets?.price;
				if (!price_facet || price_facet.min === price_facet.max) {
					const _temp_chips = JSON.parse(JSON.stringify(temp_filter_chips));
					const _index = _temp_chips.findIndex((_chip: IChip) => _chip.key === 'price');
					if (_index >= 0) {
						_temp_chips.splice(_index, 1);
						temp_filter_chips = JSON.parse(JSON.stringify(_temp_chips));
						// set_filter_chips_list(_temp_chips);
					}
					break;
				}

				const applied = [];
				if (select_filter?.range_filters?.price?.value !== undefined) {
					const { gte, lte } = select_filter?.range_filters?.price?.value;

					if (parseInt(gte) < price_facet.min && parseInt(lte) > price_facet.max) {
						// both out of bounds
						temp_filter_chips = temp_filter_chips.filter((_chip: IChip) => _chip.key !== 'price');
						// set_filter_chips_list(_temp_chips);
					} else if (parseInt(gte) < price_facet.min && parseInt(lte) < price_facet.max) {
						// lower range is out of bound
						applied.push(price_facet.min);
						applied.push(parseInt(lte));
						const _temp_chips = JSON.parse(JSON.stringify(temp_filter_chips));
						const _index = _temp_chips.findIndex((_chip: IChip) => _chip.key === 'price');
						if (_index >= 0) {
							_temp_chips[_index].value[0] = price_facet.min;
							temp_filter_chips = JSON.parse(JSON.stringify(_temp_chips));
						}
						// set_filter_chips_list(_temp_chips);
					} else if (parseInt(gte) > price_facet.min && parseInt(lte) > price_facet.max) {
						// upper range is out of bound
						applied.push(parseInt(gte));
						applied.push(price_facet.max);
						const _temp_chips = JSON.parse(JSON.stringify(temp_filter_chips));
						const _index = _temp_chips.findIndex((_chip: IChip) => _chip.key === 'price');
						if (_index >= 0) {
							_temp_chips[_index].value[1] = price_facet.max;
							temp_filter_chips = JSON.parse(JSON.stringify(_temp_chips));
						}
						// set_filter_chips_list(_temp_chips);
					} else if (parseInt(gte) >= price_facet.min && parseInt(lte) <= price_facet.max) {
						const _temp_chips = JSON.parse(JSON.stringify(temp_filter_chips));
						const _index = _temp_chips.findIndex((_chip: IChip) => _chip.key === 'price');
						if (_index >= 0) {
							_temp_chips[_index].value[0] = parseInt(gte) < price_facet.min ? price_facet.min : parseInt(gte);
							_temp_chips[_index].value[1] = parseInt(lte) > price_facet.max ? price_facet.max : parseInt(lte);
						}
						temp_filter_chips = JSON.parse(JSON.stringify(_temp_chips));
						// set_filter_chips_list(_temp_chips);
						applied.push(parseInt(gte) < price_facet.min ? price_facet.min : parseInt(gte));
						applied.push(parseInt(lte) > price_facet.max ? price_facet.max : parseInt(lte));
					}
				}
				temp_facets_transform.push({
					meta: filter.meta,
					name: filter.name,
					priority: filter.priority,
					data: { options: price_facet, applied },
				});
				break;
			case 'attribute':
				const temp = transform_attribute_facet(filter.entity_id, _facets);
				if (!temp) {
					break;
				}
				temp_facets_transform.push({
					meta: filter.meta,
					name: filter.name,
					priority: filter.priority,
					data: {
						options: temp,
						applied: select_filter?.filters?.[filter.meta.key] || [],
					},
				});
				break;
		}
	});

	return { temp_facets_transform, temp_filter_chips };
};

export const handle_filters_selection = (
	filterName: string,
	filterKey: string,
	filterType: string,
	payload: any,
	selected_filters: ISelectedFilters,
	filter_chips_list: IChip[],
	collections: any[],
) => {
	let select_filter = JSON.parse(JSON.stringify(selected_filters));
	let _filter_chips_list = JSON.parse(JSON.stringify(filter_chips_list));

	if (filterType === 'range' || filterType === 'date') {
		select_filter = {
			...select_filter,
			range_filters: {
				[filterKey]: { value: { gte: payload[0], lte: payload[1] } },
			},
		};

		if (filter_chips_list.filter((filter) => filter.key === filterKey)?.length > 0) {
			_filter_chips_list = _filter_chips_list.map((_filter: any) => {
				if (_filter?.key === filterKey) {
					return {
						..._filter,
						value: [payload[0], payload[1], ''],
					};
				} else {
					return _filter;
				}
			});
		} else {
			_filter_chips_list = [
				..._filter_chips_list,
				{
					value: [payload[0], payload[1], ''],
					key: filterKey,
					label: filterName,
					type: filterType,
				},
			];
		}
	} else if (filterType === 'category') {
		if (payload.length > 0) {
			select_filter = {
				...select_filter,
				filters: {
					...select_filter?.filters,
					[filterKey]: [...payload],
				},
			};
		} else {
			delete select_filter.filters[filterKey];
		}
	} else {
		if (filter_chips_list.filter((filter) => filter.key === filterKey)?.length > 0) {
			_filter_chips_list = _filter_chips_list.map((_filter: any) => {
				if (_filter?.key === filterKey) {
					return {
						..._filter,
						value: [...payload],
					};
				} else {
					return _filter;
				}
			});
		} else {
			_filter_chips_list = [
				..._filter_chips_list,
				{
					value: [...payload],
					key: filterKey,
					label: filterName,
					type: filterType,
				},
			];
		}

		if (filterKey === 'collection') {
			const ids = collections.filter((_f) => payload.includes(_f.name)).map((_f) => _f.id);
			if (ids.length === 0) {
				// const _temp_selected = JSON.parse(JSON.stringify(select_filter));
				// delete _temp_selected.filters[filterKey];
				delete select_filter.filters[filterKey];
			}
			select_filter = {
				...select_filter,
				filters: {
					...select_filter?.filters,
					[filterKey]: [...ids],
				},
			};
		} else if (payload.length > 0) {
			select_filter = {
				...select_filter,
				filters: {
					...select_filter?.filters,
					[filterKey]: [...payload],
				},
			};
		} else {
			// const _temp_selected = JSON.parse(JSON.stringify(select_filter));
			// delete _temp_selected.filters[filterKey];
			delete select_filter.filters[filterKey];
		}
	}

	return { select_filter, _filter_chips_list };
};
