export interface IFiltersAndChipsProps {
	// searchInput: string;
	select_filter: ISelectedFilters;
	filters: IFilters[];
	categories?: any[];
	collections?: any[];
	_facets: any;
	_nb_hits?: number;
	sort?: any;
	filter_chips_list?: IChip[];
	sort_data: ISortData[];
	is_category_page?: boolean;
	is_collections_page?: boolean;
	inputValue?: string;
	is_reseting?: boolean;
	default_filters: IFiltersSelect;
	// default_reset: boolean;
	// callbacks
	handle_search_string_update?: (name: string) => any;
	set_filter_chips_list?: (state: any) => any;
	handle_sort_change?: (key: any) => any;
	set_page: (_page: number) => any;
	set_selected_filters: (selected_filters: any) => any;
	get_initial_filters?: () => void;
	set_is_resetting?: (flag: boolean) => any;
	reset_default_filters?: (flag: boolean) => any;
	set_scroll?: any;
	is_variant_drawer?: boolean;
	inView?: boolean;
	products_per_page?: number;
	set_is_loading?: (flag: boolean) => any;
	handle_sort?: (value: any) => any;
}

export interface ISortData {
	label: string;
	is_default?: boolean;
	key: any;
}

interface RangeValue {
	gte: number;
	lte: number;
}
interface RangeFilter {
	value: RangeValue;
}
export interface IChip {
	value: string[] | RangeFilter;
	key: string;
	label: string;
	type: string;
	ids: string[];
}

export interface IFacets {
	[key: string]: object;
}

export interface IFilters {
	id: string;
	name: string;
	priority: number;
	meta: object;
	entity_id: string;
	entity_name: string;
}

export interface ITransformedAttribute {
	meta: any;
	name: string;
	label?: string;
	priority: number;
	data?: any;
}

export interface IFiltersSelect {
	[key: string]: string[];
}

export interface IRangeFiltersSelect {
	[key: string]: any;
}

export interface ISelectedFilters {
	filters: IFiltersSelect;
	range_filters: IRangeFiltersSelect;
}
