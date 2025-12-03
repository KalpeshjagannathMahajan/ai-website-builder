import { useCallback, useEffect, useState } from 'react';
import { Box, Button, Drawer, Grid, Icon } from '../../../atoms';
import AccordionFilterType from '../Filters/AccordionFilterType';
import { IChip, IFilters, IFiltersSelect, ISelectedFilters, ITransformedAttribute } from '../../FiltersAndChips/interfaces';
import { transformFacets } from '../../FiltersAndChips/transformation';
import FilterDrawerSkeleton from './FilterDrawerSkeleton';
import classes from './AllFilterDrawer.module.css';
import Backdrop from 'src/common/@the-source/atoms/Backdrop/Backdrop';
import CircularProgressBar from 'src/common/@the-source/atoms/ProgressBar/CircularProgressBar';
import { t } from 'i18next';
import { Trans } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import { Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';
import useMediaQuery from '@mui/material/useMediaQuery';
import { has_any_applied_filters } from 'src/screens/ProductListing/utils';

export interface AllFiltersProps {
	select_filter: ISelectedFilters;
	filters: IFilters[];
	categories: any[];
	collections: any[];
	_facets: any;
	_nb_hits?: number;
	filter_chips_list: IChip[];
	is_category_page?: boolean;
	is_collections_page?: boolean;
	is_loading: boolean;
	default_filters: IFiltersSelect;
	// callbacks
	set_filter_chips_list: (state: any) => any;
	set_page: (_page: number) => any;
	set_selected_filters: (selected_filters: any) => any;
	isDrawerOpen: boolean;
	setIsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
	select_and_close: () => void;
	set_default_reset: (flag: boolean) => any;
}

export default function AllFiltersDrawer({
	isDrawerOpen,
	setIsDrawerOpen,
	select_filter, //selected filters
	filters, //list of filters
	_facets,
	filter_chips_list,
	categories,
	collections,
	is_category_page = false,
	is_collections_page = false,
	default_filters = {},
	set_filter_chips_list,
	set_page,
	set_selected_filters,
	select_and_close,
	_nb_hits,
	is_loading = true,
	set_default_reset,
}: AllFiltersProps) {
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const [transformed_facets, set_transformed_facets] = useState<ITransformedAttribute[]>([]);
	const [is_loading_filters, set_is_loading] = useState(false);
	const [changed_facet, set_changed_facet] = useState('');
	const [transformation_complete, set_trasformation_complete] = useState(false);
	const [expanded, set_expanded] = useState<string[]>([]);
	const transform_facets = useCallback(() => {
		const { temp_facets_transform, temp_filter_chips_list } = transformFacets({
			filters,
			_facets,
			is_category_page,
			is_collections_page,
			collections,
			categories,
			select_filter,
			filter_chips_list,
		});
		set_trasformation_complete(true);
		set_filter_chips_list(temp_filter_chips_list);
		set_transformed_facets(temp_facets_transform);
		set_is_loading(false);
		set_changed_facet('');
	}, [_facets]);

	useEffect(() => {
		if (_facets && Object.keys(_facets)?.length > 0 && !is_loading) {
			set_trasformation_complete(false);
			transform_facets();
		}
	}, [categories, collections, _facets, is_loading]);

	const handle_filters_selection_change = useCallback((filterName: string, filterKey: string, filterType: string, payload: any) => {
		set_is_loading(true);
		set_changed_facet(filterKey);
		set_page(0);
		if (filterType === 'range' || filterType === 'date' || filterType === 'timestamp') {
			if (payload?.length > 0) {
				set_selected_filters((prevFilters: any) => ({
					...prevFilters,
					range_filters: {
						...prevFilters.range_filters,
						[filterKey]: { value: { gte: payload[0], lte: payload[1] } },
					},
				}));
			} else {
				set_selected_filters((prevFilters: any) => ({
					...prevFilters,
					range_filters: _.omit(prevFilters?.range_filters, [filterKey]),
				}));
			}
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
				set_selected_filters((prevFilters: any) => ({
					...prevFilters,
					filters: _.omit(prevFilters?.filters, [filterKey]),
				}));
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
			set_selected_filters((prevFilters: any) => ({
				...prevFilters,
				filters: _.omit(prevFilters?.filters, [filterKey]),
			}));
		}

		if (
			_.keys(default_filters).includes(filterKey) &&
			(payload.length === 0 || _.difference(default_filters[filterKey], payload)?.length === 0)
		) {
			set_default_reset(true);
		}
	}, []);

	const handleSideFilterShowResult = () => {
		select_and_close();
	};

	const handleClear = () => {
		set_is_loading(true);
		if (is_category_page) {
			set_selected_filters((prevFilters: any) => ({
				...prevFilters,
				range_filters: {},
				filters: {
					category: prevFilters.filters.category,
				},
			}));
		} else if (is_collections_page) {
			set_selected_filters((prevFilters: any) => ({
				...prevFilters,
				range_filters: {},
				filters: {
					collection: prevFilters.filters.collection,
				},
			}));
		} else {
			set_selected_filters({
				range_filters: {},
				filters: {},
			});
		}

		set_default_reset(true);
	};

	const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
		set_expanded(newExpanded ? [panel] : []);
	};

	const moreFilters = (
		<Box
			height='100dvh'
			sx={{
				background: theme?.product?.filter?.all_filter_drawer?.background,
				overflow: 'hidden',
			}}>
			{!is_loading && _facets !== undefined ? (
				<Grid sx={theme?.product?.filter?.all_filter_drawer?.drawer_header}>
					<Grid container flexWrap={'nowrap'} sx={{ alignContent: 'baseline' }}>
						<Grid
							container
							pb='.5rem'
							sx={{ paddingBottom: theme?.product?.filter?.all_filter_drawer?.header_padding, alignSelf: 'center' }}>
							<Grid item xs={10}>
								<CustomText type='H1'>All Filters</CustomText>
							</Grid>
						</Grid>
						<Grid item xs={1} mt={'3px'} className={classes.filterDrawerHeader} sx={{ alignSelf: 'baseline' }}>
							<Icon onClick={() => setIsDrawerOpen(false)} iconName='IconX' />
						</Grid>
					</Grid>

					<Divider sx={{ ...theme?.product?.filter?.all_filter_drawer?.divider }} />

					<Grid
						pb={6}
						height='calc(100dvh - 11rem)'
						sx={{
							overflowY: 'scroll !important',
							'&::-webkit-scrollbar': {
								display: 'none',
							},
							overflowX: 'hidden',
							...theme?.product?.filter?.all_filter_drawer?.drawer_content,
						}}>
						{transformation_complete &&
							transformed_facets?.map((item: any) => (
								<AccordionFilterType
									key={`${item.meta.key}${isDrawerOpen ? 'open' : 'close'}`}
									data={item}
									onFilterChange={handle_filters_selection_change}
									width={364}
									isDisable={is_loading_filters && item.meta.key !== changed_facet}
									has_opened={isDrawerOpen}
									expanded={expanded}
									onChange={handleChange}
								/>
							))}
					</Grid>
					<Box
						className={classes.drawerFooterContainer}
						sx={{
							...theme?.product?.filter?.all_filter_drawer?.drawer_footer_container,
							...theme?.product?.filter?.all_filter_drawer?.divider_footer,
						}}>
						<Grid className={classes.buttonAlignmentContainer} gap={1}>
							<Button
								sx={{ flex: 1, width: '50%' }}
								variant='outlined'
								onClick={handleClear}
								disabled={!has_any_applied_filters(select_filter)}>
								{t('Common.FilterComponents.ClearAll')}
							</Button>
							<Button
								variant='contained'
								sx={{
									flex: 1,
									width: '50%',
									...theme?.product?.filter?.all_filter_drawer?.button,
									'&:hover': {
										...theme?.product?.filter?.all_filter_drawer?.hover_button,
									},
								}}
								type='submit'
								onClick={handleSideFilterShowResult}>
								{!is_small_screen ? (
									<Trans i18nKey='Common.FilterComponents.ShowingResults' count={(_nb_hits ?? 0) <= 1 ? 1 : _nb_hits}>
										Show {{ _nb_hits }} results
									</Trans>
								) : (
									'Show Results'
								)}
							</Button>
						</Grid>
					</Box>
				</Grid>
			) : (
				<FilterDrawerSkeleton />
			)}
			{is_loading_filters && (
				<Backdrop open={is_loading_filters} sx={{ zIndex: '99999', position: 'absolute' }}>
					<CircularProgressBar style={{ color: 'inherit' }} />
				</Backdrop>
			)}
		</Box>
	);
	return <Drawer open={isDrawerOpen} width={435} onClose={() => setIsDrawerOpen(false)} content={moreFilters} />;
}

AllFiltersDrawer.defaultProps = {
	showClearButton: false,
};
