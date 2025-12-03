import { useCallback, useEffect, useState } from 'react';
import { Grid, Icon, Sort } from '../../atoms';
import Filters from '../FilterComponents/Filters/Filters';
import { IFiltersAndChipsProps, ITransformedAttribute } from './interfaces';
import _ from 'lodash';
import useMediaQuery from '@mui/material/useMediaQuery';
import FilterIcon from '../FilterComponents/FilterIcon/FilterIcon';
import FilterChips from '../FilterComponents/FilterChips/FilterChips';
import { AllFiltersDrawerContainer } from '../FilterComponents/AllFiltersDrawer/AllFiltersDrawerContainer';
import { get_default_sort } from './helper';
import { transformFacets } from './transformation';
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { Divider, Fab } from '@mui/material';
import CustomText from '../../CustomText';
import SortByContainer from 'src/screens/ProductListing/components/SortByContainer';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

const useStyles = makeStyles((theme: any) => ({
	red_dot: {
		height: '0.5em',
		width: '0.5em',
		borderRadius: '50%',
		display: 'inline-block',
		marginLeft: '2.7rem',
		marginTop: '1.2rem',
		position: 'absolute',
	},
	red_dot_for_small_screen: {
		height: '0.5em',
		width: '0.5em',
		borderRadius: '50%',
		display: 'inline-block',
		marginLeft: '2.5rem',
		marginTop: '-2.5rem',
		position: 'absolute',
	},
	filter_icon: {
		width: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '20px',
		bottom: '50px',
		left: 0,
		position: 'fixed',
		zIndex: 20,
	},
	filter_container: {
		borderRadius: '16px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '8px',
		...theme?.product?.filter?.filter_container_mb,
		height: '32px',
		maxHeight: '32px !important',
		width: '80%',
	},
	filter_fab: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: '100% !important',
		boxShadow: 'none !important',
		backgroundColor: 'transparent !important',
		borderRadius: 0,
		height: '32px',
		maxHeight: '32px',
	},
}));

interface CustomFabProps {
	onClick: () => void;
	iconName: string | any;
	customText: string;
	classes?: {
		filter_fab?: string;
	};
}

const FiltersAndChips = ({
	// searchInput,
	select_filter, //selected filters
	filters, //list of filters
	_facets,
	filter_chips_list = [],
	categories = [],
	collections = [],
	sort_data,
	is_category_page = false,
	is_collections_page = false,
	sort,
	inputValue = '',
	is_reseting = false,
	default_filters = {},
	// default_reset = false,
	set_filter_chips_list,
	handle_sort_change,
	set_page,
	set_selected_filters,
	get_initial_filters,
	set_is_resetting,
	reset_default_filters,
	set_scroll,
	is_variant_drawer = false,
	inView,
	products_per_page,
	set_is_loading,
	handle_sort = () => {},
}: IFiltersAndChipsProps) => {
	const theme: any = useTheme();
	const [isSortDrawerOpen, setIsSortDrawerOpen] = useState(false);
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const [transformed_facets, set_transformed_facets] = useState<ITransformedAttribute[]>([]);
	const [isDrawerOpen, setIsDrawerOpen] = useState(false);
	const styles = useStyles(theme);

	const transform_facets = useCallback(() => {
		if (_facets !== undefined) {
			const { temp_facets_transform, temp_filter_chips_list } = transformFacets({
				filters,
				_facets,
				is_category_page,
				is_collections_page,
				collections,
				categories,
				select_filter,
				filter_chips_list,
				is_variant_drawer,
			});

			if (!is_variant_drawer && set_filter_chips_list) set_filter_chips_list(temp_filter_chips_list);
			set_transformed_facets(temp_facets_transform);
		}
	}, [_facets, select_filter]);

	const handle_filters_selection_change = (filterName: string, filterKey: string, filterType: string, payload: any, range?: any) => {
		set_is_loading && set_is_loading(true);
		set_page(1); // reset to default state since we're showing count now based on current page
		if (filterType === 'range' || filterType === 'date' || filterType === 'timestamp') {
			set_selected_filters((prevFilters: any) => {
				// Clone the range_filters object to avoid directly mutating the state
				let updatedRangeFilters = { ...prevFilters.range_filters };

				if (_.head(payload) === _.head(range) && _.nth(payload, 1) === _.nth(range, 1)) {
					delete updatedRangeFilters[filterKey]; // Remove the specific key from range_filters
				} else {
					updatedRangeFilters[filterKey] = { value: { gte: payload?.[0], lte: payload?.[1] } };
				}

				return {
					...prevFilters,
					range_filters: updatedRangeFilters,
				};
			});
		} else if (filterType === 'category') {
			set_selected_filters((prevFilters: any) => ({
				...prevFilters,
				filters: {
					...prevFilters?.filters,
					[filterKey]: [...payload],
				},
			}));
		} else if (filterKey === 'collection') {
			const ids = collections.filter((_f) => payload.includes(_f.name)).map((_f) => _f.id);
			if (ids.length === 0) {
				const _temp_selected = JSON.parse(JSON.stringify(select_filter));
				delete _temp_selected.filters[filterKey];
				set_selected_filters(_temp_selected);
			} else {
				set_selected_filters((prevFilters: any) => ({
					...prevFilters,
					filters: {
						...prevFilters?.filters,
						[filterKey]: [...ids],
					},
				}));
			}
		} else if (payload.length > 0) {
			set_selected_filters((prevFilters: any) => ({
				...prevFilters,
				filters: {
					...prevFilters?.filters,
					[filterKey]: [...payload],
				},
			}));
		} else {
			const _temp_selected = JSON.parse(JSON.stringify(select_filter));
			delete _temp_selected.filters[filterKey];
			set_selected_filters(_temp_selected);
		}
		if (
			_.keys(default_filters).includes(filterKey) &&
			(payload.length === 0 || _.difference(default_filters[filterKey], payload)?.length === 0)
		) {
			reset_default_filters && reset_default_filters(true);
		}
		set_scroll(true);
	};

	const handle_sort_select = (key: any) => {
		set_is_loading && set_is_loading(true);
		handle_sort_change && handle_sort_change(key);
		set_scroll(true);
	};

	const handleAllFilterDrawer = () => {
		setIsDrawerOpen(true);
	};

	const find_and_pop = (arr: string[], val: string, type: string) => {
		if (!Array.isArray(arr)) {
			console.error('arr is not an array', filter_chips_list, arr, val, type);
			return [];
		} else {
			const _temp = [...arr];
			let _index = _.indexOf(_temp, val);
			if (type === 'category') {
				_index = filter_chips_list.filter((f) => f.key === type)?.[0]?.value?.indexOf(val);
			}
			_temp.splice(_index, 1);
			return _temp;
		}
	};

	const handle_clear_chip = (key: string, value: any, type: string) => {
		set_is_loading && set_is_loading(true);
		set_page(1);
		if (_.isEmpty(select_filter?.filters) && _.isEmpty(select_filter?.range_filters)) {
			return;
		}
		if (type === 'range' || type === 'timestamp') {
			const _temp = JSON.parse(JSON.stringify(select_filter));
			delete _temp.range_filters[key];
			set_selected_filters(_temp);
		} else if (type === 'filters' || type === 'category' || type === 'multi_select') {
			const _temp = JSON.parse(JSON.stringify(select_filter));
			if (select_filter?.filters[key]?.length === 1) {
				delete _temp.filters[key];
				set_selected_filters(_temp);
				if (_.keys(default_filters).includes(key)) {
					reset_default_filters && reset_default_filters(true);
				}
			} else {
				if (
					_.keys(default_filters).includes(key) &&
					_.difference(default_filters[key], find_and_pop(_temp?.filters[key], value, type))?.length === 0
				) {
					reset_default_filters && reset_default_filters(true);
				}
				set_selected_filters((prevFilters: any) => ({
					...prevFilters,
					filters: {
						...prevFilters?.filters,
						[key]: find_and_pop(prevFilters?.filters[key], value, type),
					},
				}));
			}
		}
		set_scroll(true);
	};

	const reset_filters = () => {
		set_is_loading && set_is_loading(true);
		set_page(1);
		if (is_category_page && get_initial_filters) {
			set_selected_filters((prevFilters: any) => ({
				...prevFilters,
				range_filters: {},
				filters: {
					category: is_category_page ? prevFilters.filters.category : [],
				},
			}));
		} else if (is_collections_page && get_initial_filters) {
			set_selected_filters((prevFilters: any) => ({
				...prevFilters,
				range_filters: {},
				filters: {
					collection: is_collections_page ? prevFilters.filters?.collection : [],
				},
			}));
			// } else if (is_collections_page && get_initial_filters) {
		} else {
			set_selected_filters((prevFilters: any) => ({
				...prevFilters,
				range_filters: {},
				filters: {
					...(prevFilters.filters?.type ? { type: prevFilters.filters.type } : {}),
				},
			}));
		}
		if (!_.isEmpty(default_filters)) {
			reset_default_filters && reset_default_filters(true);
		}
		set_filter_chips_list && set_filter_chips_list([]);
		set_scroll(true);
	};

	const handle_more_filters = () => {
		setIsDrawerOpen(true);
	};
	const show_red_dot_after_selecting_filters = () => {
		const has_selected_filters = !_.isEmpty(select_filter?.filters) || !_.isEmpty(select_filter?.range_filters);
		return has_selected_filters;
	};
	// Hooks here
	const CustomFab: React.FC<CustomFabProps> = ({ onClick, iconName, customText, classes }) => {
		return (
			<Fab className={classes?.filter_fab} size='small' variant='extended' onClick={onClick}>
				<Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
					<Icon sx={{ cursor: 'pointer', width: '16px', height: '32px', padding: '0 4px' }} iconName={iconName} />
					<CustomText>{customText}</CustomText>
				</Grid>
			</Fab>
		);
	};

	const handle_render_fab_filters = () => {
		const is_clear_all_activestate = filter_chips_list.length > 0;
		if (!inView && transformed_facets?.length > 0) {
			return (
				<Grid className={styles.filter_icon}>
					<Grid className={styles.filter_container}>
						<Grid style={{ position: 'relative' }}>
							<CustomFab classes={styles} onClick={() => setIsDrawerOpen(true)} iconName='IconFilter' customText='Filters' />
							{show_red_dot_after_selecting_filters() && is_clear_all_activestate && (
								<span className={styles.red_dot_for_small_screen} style={{ ...theme?.product?.filter?.red_dot }} />
							)}
						</Grid>
						<Grid>
							<Divider orientation='vertical' sx={{ width: '1px', height: '32px' }} />
						</Grid>
						<Grid>
							<CustomFab classes={styles} onClick={() => setIsSortDrawerOpen(true)} iconName='IconArrowsSort' customText='Sort By' />
						</Grid>
					</Grid>
				</Grid>
			);
		}
	};

	useEffect(() => {
		transform_facets();
	}, [_facets, select_filter]);

	useEffect(() => {
		if (is_reseting) {
			reset_filters();
			set_is_resetting && set_is_resetting(false);
		}
	}, [is_reseting]);

	return (
		<>
			{is_small_screen ? (
				handle_render_fab_filters()
			) : (
				<Grid
					container
					direction='row'
					alignItems='center'
					justifyContent='space-between'
					flexWrap='nowrap'
					sx={{
						...theme?.product?.filter?.filter_container,
					}}
					className={
						is_variant_drawer ? 'filter-header-variant-drawer' : is_ultron ? 'filter-header' : 'filter-header store-filter-header'
					}>
					{transformed_facets?.length > 0 && (
						<Grid
							item
							sm={is_variant_drawer ? 12 : 7}
							md={is_variant_drawer ? 12 : 8}
							lg={is_variant_drawer ? 12 : 9}
							xl={is_variant_drawer ? 12 : 9}
							display={{ xs: 'none', sm: 'block' }}
							paddingLeft={is_ultron ? '1rem' : 0}>
							<Filters onFilterChange={handle_filters_selection_change} filtersList={transformed_facets} showFilterCount={true} />
						</Grid>
					)}
					{!is_variant_drawer && !is_small_screen && transformed_facets?.length > 0 && (
						<Grid item xs={12} sm={5} md={4} lg={3} xl={3} margin='0px 0 10px 20px'>
							<Grid container alignItems='center' direction='row' justifyContent='flex-end'>
								<Grid item sx={{ width: '3.5rem', marginRight: '0.5rem' }}>
									{filter_chips_list?.length > 0 && (
										<span
											className={styles.red_dot}
											style={{
												...theme?.product?.filter?.red_dot,
											}}
										/>
									)}
									<FilterIcon onClick={handleAllFilterDrawer} />
								</Grid>
								<Grid item marginLeft='10px' sx={{ width: '78%', marginRight: is_ultron ? '1rem' : 0 }}>
									<Sort
										onChange={handle_sort_select}
										options={sort_data}
										onlyOnChange={handle_sort}
										defaultSort={get_default_sort(sort_data, sort)}
										size='small'
										fullWidth={true}
									/>
								</Grid>
							</Grid>
						</Grid>
					)}
				</Grid>
			)}

			{!is_variant_drawer && !is_small_screen && filter_chips_list?.length > 0 && (
				<Grid
					container
					justifyContent='space-between'
					sx={{
						...theme?.product?.filter?.filter_container,
					}}
					alignItems='center'
					className={is_ultron ? 'filter-chips-header' : 'filter-chips-header store-filter-chips-header'}>
					<FilterChips
						onClearAll={reset_filters}
						onClearFilter={handle_clear_chip}
						filterList={filter_chips_list}
						handleMore={handle_more_filters}
					/>
				</Grid>
			)}
			<SortByContainer
				drawer={isSortDrawerOpen}
				set_drawer={setIsSortDrawerOpen}
				sort={sort}
				sort_data={sort_data}
				handle_sort_change={handle_sort_change}
			/>
			<AllFiltersDrawerContainer
				isDrawerOpen={isDrawerOpen}
				setIsDrawerOpen={setIsDrawerOpen}
				categories={categories}
				collections={collections}
				search={inputValue}
				is_category_page={is_category_page}
				is_collections_page={is_collections_page}
				filters={filters}
				selected_filters={select_filter}
				set_filters_selected={set_selected_filters}
				set_scroll={set_scroll}
				default_filters={default_filters}
				reset_default_filters={reset_default_filters}
				products_per_page={products_per_page}
				set_current_page={set_page}
			/>
		</>
	);
};

export default FiltersAndChips;
