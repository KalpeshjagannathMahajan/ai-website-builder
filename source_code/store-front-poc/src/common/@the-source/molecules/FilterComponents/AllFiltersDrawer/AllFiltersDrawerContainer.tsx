import { useCallback, useEffect, useState } from 'react';
import { IChip, IFiltersSelect, ISelectedFilters } from '../../FiltersAndChips/interfaces';
import { useSelector } from 'react-redux';
import { product_listing } from 'src/utils/api_requests/productListing';
import AllFiltersDrawer from './AllFiltersDrawer';
import { useSearchParams } from 'react-router-dom';
import usePricelist from 'src/hooks/usePricelist';
import utils from 'src/utils/utils';
import { PRODUCT_DETAILS_TYPE } from 'src/screens/ProductDetailsPage/constants';

interface AllFiltersDrawerContainerProps {
	isDrawerOpen: boolean;
	setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
	categories: any[];
	collections: any[];
	search: string;
	is_category_page: boolean;
	is_collections_page: boolean;
	filters: any[];
	selected_filters: ISelectedFilters;
	default_filters: IFiltersSelect;
	set_filters_selected: (selected_filters: ISelectedFilters) => ISelectedFilters;
	reset_default_filters?: (flag: boolean) => any;
	set_scroll: any;
	products_per_page?: number;
	set_current_page?: (page: number) => void;
}

export const AllFiltersDrawerContainer = ({
	isDrawerOpen,
	setIsDrawerOpen,
	categories,
	collections,
	search,
	is_category_page,
	is_collections_page,
	filters,
	selected_filters,
	default_filters = {},
	reset_default_filters,
	set_filters_selected,
	set_scroll,
	products_per_page,
	set_current_page = () => {},
}: AllFiltersDrawerContainerProps) => {
	const [select_filter, set_selected_filters] = useState<ISelectedFilters>({ filters: {}, range_filters: {} });
	const [is_selected_filter_initialized, set_is_selected_filter_initialized] = useState(false);
	const [_facets, set_facets] = useState<any>();
	const [filter_chips_list, set_filter_chips_list] = useState<IChip[]>([]);
	const [_page, set_page] = useState(0);
	const [is_api_call_complete, set_api_call_complete] = useState(false);
	const [nb_hits, set_nbhits] = useState(0);
	const [is_loading, set_is_loading] = useState(true);
	const [searchParams] = useSearchParams();
	const [default_reset, set_default_reset] = useState<boolean>(searchParams.get('default_reset') === 'true' ? true : false);
	const buyer = useSelector((state: any) => state.buyer);
	const login = useSelector((state: any) => state?.login);
	const is_logged_in = login?.status?.loggedIn;
	const pricelist_value = usePricelist();

	const get_attributes_list = () => {
		return filters.filter((f: any) => f.entity_name === 'attribute')?.map((f: any) => f.meta.key);
	};

	const get_products = useCallback(
		async (is_next_page: boolean = false) => {
			try {
				const _type = searchParams.get('type') || '';
				const listing_type = PRODUCT_DETAILS_TYPE.variant;
				const payload = {
					buyer_tenant_id: buyer.buyer_info?.id, // change this later
					search, // change after filters implementation
					filters: {
						...select_filter.filters,
						type: listing_type, // type // dynamic for global searches
					},
					range_filters: select_filter.range_filters,
					sort: [
						{
							field: 'created_at',
							order: 'desc',
						},
					], // change after filters implementation
					page_number: is_next_page ? _page + 1 : 1,
					page_size: products_per_page ?? 50,
					attributes_list: get_attributes_list(),
					search_field: search === '' ? '' : _type,
					catalog_ids: pricelist_value?.value ? [pricelist_value?.value] : [],
				};

				const response: any = await product_listing.get_product_list(payload);
				if (response?.status_code === 200) {
					const { nbHits, page, facets } = response?.data;
					let filtered_facets = utils.handle_filtered_facets(facets, is_logged_in);
					set_nbhits(nbHits);
					set_page(page);
					set_facets(filtered_facets);
					set_api_call_complete(true);
					set_is_loading(false);
				}
			} catch (error) {
				set_is_loading(false);
				console.error(error);
			}
		},
		[select_filter, search, _page, is_api_call_complete, pricelist_value],
	);

	const select_and_close = () => {
		setIsDrawerOpen(false);
		set_current_page && set_current_page(1); // Used for plp
		set_filters_selected(select_filter);
	};

	const update_selected_filters = (_filters: ISelectedFilters) => {
		set_api_call_complete(false);
		default_reset === true && reset_default_filters && reset_default_filters(default_reset);
		set_selected_filters(_filters);
		set_scroll(true);
	};

	useEffect(() => {
		if (filters && filters.length > 0 && !is_api_call_complete && is_selected_filter_initialized) {
			get_products();
		}
	}, [select_filter, search, is_api_call_complete, is_selected_filter_initialized, pricelist_value]);

	useEffect(() => {
		if (isDrawerOpen) {
			set_is_selected_filter_initialized(true);
			set_selected_filters(selected_filters);
		} else {
			set_api_call_complete(false);
			set_is_selected_filter_initialized(false);
		}
	}, [selected_filters, isDrawerOpen]);

	useEffect(() => {
		if (isDrawerOpen) {
			set_is_loading(true);
		}
	}, [isDrawerOpen]);

	return (
		<>
			{isDrawerOpen && is_selected_filter_initialized && (
				<AllFiltersDrawer
					isDrawerOpen={isDrawerOpen}
					setIsDrawerOpen={setIsDrawerOpen}
					select_filter={select_filter}
					filters={filters}
					_facets={_facets}
					filter_chips_list={filter_chips_list}
					set_page={set_page}
					set_filter_chips_list={set_filter_chips_list}
					set_selected_filters={update_selected_filters}
					categories={categories}
					collections={collections}
					is_category_page={is_category_page}
					is_collections_page={is_collections_page}
					_nb_hits={nb_hits}
					select_and_close={select_and_close}
					is_loading={is_loading}
					default_filters={default_filters}
					set_default_reset={set_default_reset}
				/>
			)}
		</>
	);
};
