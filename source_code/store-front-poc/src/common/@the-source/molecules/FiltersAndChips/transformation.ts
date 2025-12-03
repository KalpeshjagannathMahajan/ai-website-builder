import _ from 'lodash';
import { CardData } from '../../../../screens/ProductListing/constants';
import { IChip, IFilters, ISelectedFilters, ITransformedAttribute } from 'src/common/@the-source/molecules/FiltersAndChips/interfaces';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

interface TransformFacetsProps {
	filters: IFilters[];
	_facets: any;
	is_category_page: boolean;
	is_collections_page: boolean;
	collections: CardData[];
	categories: CardData[];
	select_filter: ISelectedFilters;
	filter_chips_list: IChip[];
	is_variant_drawer?: boolean;
}

interface TransformCategoryFacetReturn {
	options: any[];
	applied: string[];
	_chips_ids: string[];
	_chips: string[];
}

const transform_categories_facet = (
	categories_facet: any,
	categories: CardData[],
	select_filter: ISelectedFilters,
): TransformCategoryFacetReturn => {
	const { buckets } = categories_facet?.category;
	const _categories_temp: any[] = [];
	const applied: string[] = [];

	const _chips: string[] = [];
	const _chips_ids: string[] = [];

	const category_bucket_sorted = buckets
		?.map((bucket: any) => {
			const _category = categories?.find((category) => category.id === bucket.key);

			return {
				level: _category?.level,
				count: bucket.doc_count,
				name: _category?.name,
				id: bucket.key,
				path: _category?.path,
				parent_id: _category?.parent_id,
			};
		})
		?.sort((a: any, b: any) => a.level - b.level);

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
				const _index = _categories_temp?.findIndex((_category) => _category.id === bucket.parent_id);

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

	return { options: _categories_temp, applied, _chips_ids, _chips };
};

const transform_attribute_facet = (
	id: string = '',
	_facets: any,
	select_filter: ISelectedFilters,
	key: string,
	is_custom: boolean = false,
) => {
	const _attribute = !is_custom ? _facets.attributes[id] : _facets?.[key];
	if (_attribute === undefined) {
		return null;
	}
	const applied: string[] = [];
	const _buckets = id !== '' ? _attribute?.buckets[id]?.values?.buckets : _attribute?.buckets;
	const options = _buckets?.map((bucket: any) => {
		if (select_filter?.filters[key]?.includes(bucket.key)) {
			applied.push(bucket.key);
		}
		return {
			[bucket.key]: bucket,
		};
	});
	return { options, applied };
};

const transform_collection_facet = (collection_facet: any, collections: CardData[], select_filter: ISelectedFilters, key: string) => {
	const { buckets } = collection_facet.collections;
	const applied: string[] = [];
	const options = _.map(buckets, (bucket) => {
		const _collection = collections.find((collection) => collection.id === bucket.key);
		if (_collection) {
			if (select_filter?.filters[key]?.includes(bucket.key)) {
				applied.push(_collection.name);
			}
			return {
				[_collection.name]: bucket,
			};
		}
	});
	return { options, applied };
};

const categories_chips = (_chips: string[], filter_chips_list: IChip[], _chips_ids: string[]): IChip | undefined => {
	let output: IChip = { value: [], key: '', label: '', type: '', ids: [] };
	if (_chips.length > 0) {
		const _filter = filter_chips_list.find((filter) => filter.key === 'category');
		if (_filter) {
			output = { ..._filter, value: [..._chips], ids: [..._chips_ids] };
		} else {
			output = {
				value: [..._chips],
				key: 'category',
				label: 'Category',
				type: 'category',
				ids: [..._chips_ids],
			};
		}
	}
	return output?.key ? output : undefined;
};

interface TransformFacetsReturn {
	temp_facets_transform: ITransformedAttribute[];
	temp_filter_chips_list: IChip[];
}

export const transformFacets = ({
	filters,
	_facets,
	is_category_page,
	is_collections_page,
	collections,
	categories,
	select_filter,
	filter_chips_list,
	is_variant_drawer = false,
}: TransformFacetsProps): TransformFacetsReturn => {
	const temp_facets_transform: ITransformedAttribute[] = [];
	const temp_filter_chips_list: IChip[] = [];
	const sorted_filters = filters?.sort((a: any, b: any) => a?.priority - b?.priority);
	_.forEach(sorted_filters, (filter: any) => {
		switch (filter?.entity_name) {
			case 'category':
				if (is_category_page === true || _facets === undefined || _facets.categories === undefined || is_variant_drawer === true) {
					break;
				}
				const { options, applied, _chips_ids } = transform_categories_facet(_facets?.categories, categories, select_filter);
				const _temp = categories_chips(applied, filter_chips_list, _chips_ids);
				if (options.length > 0) {
					temp_facets_transform.push({
						meta: {
							key: 'category',
							type: 'category',
						},
						name: 'Category',
						label: filter?.label,
						priority: 0,
						data: { options, applied },
					});
				}

				if (_temp) {
					temp_filter_chips_list.push(_temp);
				}
				break;
			case 'collection':
				if (is_collections_page === true || _facets === undefined || _facets.collections === undefined || is_variant_drawer === true) {
					break;
				}
				const collections_temp = transform_collection_facet(_facets.collections, collections, select_filter, filter.meta.key);
				if (!collections_temp.options || collections_temp.options.length === 0) {
					break;
				}

				const _ids_collection = collections.filter((_f) => select_filter?.filters?.[filter.meta.key]?.includes(_f.id)).map((_f) => _f.id);
				const _name_collection = collections
					.filter((_f) => select_filter?.filters?.[filter.meta.key]?.includes(_f.id))
					.map((_f) => _f.name);
				temp_facets_transform.push({
					meta: filter.meta,
					name: filter.name,
					label: filter?.label,
					priority: filter.priority,
					data: {
						options: collections_temp.options,
						applied: collections_temp.applied || [],
					},
				});
				if (collections_temp.applied.length > 0) {
					temp_filter_chips_list.push({
						value: _name_collection || [],
						key: filter.meta.key,
						label: filter.name,
						type: filter.meta.type,
						ids: _ids_collection || [],
					});
				}

				break;
			case 'created_at':
				break;
			case 'inventory_eta':
				const filter_value = select_filter?.range_filters?.[filter.entity_name]?.value;
				const applied_filter: any[] = [];
				let is_no_eta = false;
				if (filter_value) {
					const { gte, lte } = filter_value;
					if (gte === lte || gte === '' || lte === '') {
						is_no_eta = true;
						applied_filter.push('No ETA');
					} else {
						applied_filter.push(gte, lte);
					}
				}
				temp_facets_transform.push({
					meta: filter?.meta,
					name: filter?.name,
					label: filter?.label,
					priority: filter?.priority,
					data: { applied: applied_filter },
				});
				if (applied_filter?.length === 2) {
					temp_filter_chips_list.push({
						key: filter?.meta?.key,
						label: filter?.name,
						type: filter?.meta?.type,
						value: [dayjs(applied_filter[0]).format("Do MMM'YY"), dayjs(applied_filter[1]).format("Do MMM'YY"), ' '],
						ids: [],
					});
				} else if (applied_filter.length === 1 && is_no_eta) {
					temp_filter_chips_list.push({
						key: filter?.meta?.key,
						label: filter?.name,
						type: filter?.meta?.type,
						value: ['No ETA', '', ' ', 'no_eta'],
						ids: [],
					});
				}
				break;

			case 'attribute':
				const temp = transform_attribute_facet(filter.entity_id, _facets, select_filter, filter.meta.key);
				if (!temp?.options) {
					break;
				}
				const applied_attribute = temp.applied;
				temp_facets_transform.push({
					meta: filter.meta,
					name: filter.name,
					label: filter?.label,
					priority: filter.priority,
					data: {
						options: temp.options,
						applied: applied_attribute || [],
					},
				});
				if (applied_attribute?.length > 0) {
					temp_filter_chips_list.push({
						key: filter.meta.key,
						label: filter.name,
						type: filter.meta.type,
						value: applied_attribute || [],
						ids: applied_attribute || [],
					});
				}
				break;

			case 'inventory_status':
			case 'buyer_activity_type':
			case 'buyer_priority':
				const status_temp = transform_attribute_facet('', _facets, select_filter, filter.meta.key, true);
				if (_.isEmpty(status_temp?.options)) {
					break;
				}
				const status_applied_attribute = status_temp?.applied;
				temp_facets_transform.push({
					meta: filter.meta,
					name: filter.name,
					label: filter?.label,
					priority: filter.priority,
					data: {
						options: status_temp?.options,
						applied: status_applied_attribute || [],
					},
				});

				const _name_status: any = _facets?.[filter?.meta?.key]?.buckets
					.filter((_f: any) => select_filter?.filters?.[filter.meta.key]?.includes(_f.key))
					.map((_f: any) => _f.name);
				if (_.size(status_applied_attribute) > 0) {
					temp_filter_chips_list.push({
						key: filter.meta.key,
						label: filter.name,
						type: filter.meta.type,
						value: _name_status || [],
						ids: status_applied_attribute || [],
					});
				}
				break;

			default:
				if (filter?.meta?.type === 'range') {
					const _facet = _facets?.[filter.entity_name];
					if (!_facet || _facet.min === _facet.max) {
						break;
					}

					const _applied = [];
					if (select_filter?.range_filters?.[filter.entity_name]?.value !== undefined) {
						const { gte, lte } = select_filter?.range_filters?.[filter.entity_name]?.value;
						const _check_gte = _.attempt(parseFloat, gte);
						const _check_lte = _.attempt(parseFloat, lte);
						if (_.isError(_check_gte) || _.isError(_check_lte)) {
							break;
						}
						if (_check_gte < _facet.min && _check_lte > _facet.max) {
							// No Filter Case
							break;
						} else {
							_applied.push(
								Math.max(_check_gte, _facet.min)
									.toFixed(2)
									.replace(/[.,]00$/, ''),
							);
							_applied.push(
								Math.min(_check_lte, _facet.max)
									.toFixed(2)
									.replace(/[.,]00$/, ''),
							);
						}
					}
					temp_facets_transform.push({
						meta: filter.meta,
						name: filter.name,
						label: filter?.label,
						priority: filter.priority,
						data: { options: _facet, applied: _applied },
					});
					if (_applied.length === 2) {
						temp_filter_chips_list.push({
							key: filter.meta.key,
							label: filter.name,
							type: filter.meta.type,
							value: [_applied[0].toString(), _applied[1].toString(), ''],
							ids: [],
						});
					}
				}
				break;
		}
	});
	return { temp_facets_transform, temp_filter_chips_list };
};
