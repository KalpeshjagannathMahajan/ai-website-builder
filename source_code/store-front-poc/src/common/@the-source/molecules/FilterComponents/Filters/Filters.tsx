import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Avatar, Box } from '../../../atoms';
import Grid from '../../../atoms/Grid';
import Icon from '../../../atoms/Icon';
import Category from '../CategoryFilter/Category';
import MultiSelectFilter from '../MultiSelectFilter';
import RangeFilter from '../RangeFilter';
import SingleSelectFilter from '../SingleSelectFilter';
import styled from '@emotion/styled';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
// import DateTime from 'src/common/@the-source/atoms/Datetime';
import DateTypeFilter from '../DateFIlter/DateTypeFilter';
import _ from 'lodash';

export interface FiltersProps {
	filtersList: Object[];
	onFilterChange: (name: string, key: any, type: any, value: any, range?: any) => any;
	showFilterCount?: boolean;
}

const StyledDiv = styled.div`
	width: 100%;
	overflow-y: hidden;
	overflow-x: scroll;
	scrollbar-width: none; /* For Firefox */
	-ms-overflow-style: none; /* For IE and Edge */
	&::-webkit-scrollbar {
		display: none; /* For Chrome, Safari, and Opera */
	}
	display: flex;
	flex-direction: row;
	gap: 0.75em;
	margin: 0;
	align-items: center;
`;

const Filters = ({ filtersList, onFilterChange, showFilterCount }: FiltersProps) => {
	const filterBoxRef = useRef() as MutableRefObject<HTMLDivElement>;
	const [isFirst, setIsFirst] = useState(true);
	const [isLast, setIsLast] = useState(false);
	const buyer = useSelector((state: any) => state.buyer);
	const theme: any = useTheme();

	useEffect(() => {
		const node = filterBoxRef.current;

		const checkScrollPosition = () => {
			const scrollPosition = node.scrollLeft + node.clientWidth;
			const maxScrollPosition = node.scrollWidth;
			setIsFirst(node.scrollLeft === 0);
			setIsLast(scrollPosition >= maxScrollPosition - 1);
		};

		if (node) {
			// Set initial values
			checkScrollPosition();

			const handleScroll = () => {
				checkScrollPosition();
			};

			const resizeObserver = new ResizeObserver(() => {
				checkScrollPosition();
			});

			node.addEventListener('scroll', handleScroll);
			resizeObserver.observe(node);

			return () => {
				node.removeEventListener('scroll', handleScroll);
				resizeObserver.disconnect();
			};
		}
	}, []);

	const scroll = (scrollOffset: number) => {
		filterBoxRef.current.scroll({
			left: filterBoxRef.current.scrollLeft + scrollOffset,
			behavior: 'smooth',
		});
	};

	const renderFilter = (filter: any) => {
		const label = !_.isEmpty(filter?.label) ? filter?.label : filter?.name;
		switch (filter.meta.type) {
			case 'range':
				{
					switch (filter.meta.key) {
						case 'price':
							{
								const conversionFactors = filter?.meta?.conversion_factors;
								const applied = filter?.data?.applied;
								const { min, max } = filter?.data?.options || {};
								const unit = buyer?.buyer_cart?.meta?.pricing_info?.currency_symbol;
								if (min < max) {
									return (
										<RangeFilter
											onApply={(minValue, maxValue, selectedUnit, unitType) =>
												onFilterChange(
													filter?.name,
													filter?.meta?.key,
													filter?.meta?.type,
													[minValue, maxValue, selectedUnit, unitType],
													[min, max],
												)
											}
											label={label}
											minRange={min}
											UOM={[]}
											maxRange={max}
											defaultUnit={unit}
											conversionFactors={conversionFactors}
											unitType={filter?.meta?.position}
											applied={applied}
										/>
									);
								}
							}
							break;
						default:
							{
								const options = filter?.meta?.options || filter?.data?.options || {};
								const uomOptions = Object.keys(options).reduce(
									(agg: any, item: any) => [
										...agg,
										{
											value: item,
											label: options[item],
										},
									],
									[],
								);
								const conversionFactors = filter?.meta?.conversion_factors;
								const applied = filter?.data?.applied;
								const { min, max, unit } = filter?.data?.options || {};
								return (
									<RangeFilter
										onApply={(minValue, maxValue, selectedUnit, unitType) =>
											onFilterChange(
												filter.name,
												filter.meta.key,
												filter.meta.type,
												[minValue, maxValue, selectedUnit, unitType],
												[min, max],
											)
										}
										label={label}
										UOM={uomOptions}
										minRange={min}
										maxRange={max}
										defaultUnit={unit}
										conversionFactors={conversionFactors}
										unitType={filter?.meta?.position}
										applied={applied}
										style={{ width: 'max-content' }}
									/>
								);
							}
							break;
					}
				}
				break;
			case 'select': {
				const opt = filter?.data?.options;
				const filterOptions = Object.keys(opt).map((item) => {
					const obj = {
						value: item.toLocaleLowerCase(),
						label: showFilterCount ? `${item} (${opt[item]})` : item,
					};
					return obj;
				});
				const applied = filter?.data?.applied?.[0]?.toLowerCase() || [];
				return (
					<SingleSelectFilter
						options={filterOptions}
						filterName={label}
						activeSelection={applied}
						onUpdate={(value) => {
							onFilterChange(filter.name, filter.meta.key, filter.meta.type, value);
						}}
						onClear={() => onFilterChange(filter.name, filter.meta.key, filter.meta.type, [])}
					/>
				);
			}
			case 'multi_select': {
				const optionsWithCount = filter?.data?.options
					?.filter((option: any) => option)
					.map((option: any) => {
						const key: any = _.head(_.keys(option));
						const option_label = option?.[key]?.name || key; // Get the label from the key of the option object
						const count = option?.[key]?.doc_count; // Get the count from the value of the option object
						return { label: showFilterCount ? `${option_label} (${count})` : option_label, value: key };
					});
				const applied = filter?.data?.applied || [];
				return (
					<MultiSelectFilter
						options={optionsWithCount}
						filterName={label}
						onUpdate={(value) => onFilterChange(filter.name, filter.meta.key, filter.meta.type, value)}
						onClear={() => onFilterChange(filter.name, filter.meta.key, filter.meta.type, [])}
						activeSelection={applied}
					/>
				);
			}
			case 'category': {
				const categories = filter.data?.options;
				const applied = filter?.data?.applied || [];
				return (
					<Category
						onApply={(payload) => onFilterChange(filter.name, filter?.meta.key, filter.meta.type, payload)}
						applied={applied}
						categoryList={categories}
					/>
				);
			}
			case 'date':
			case 'timestamp': {
				const applied = filter?.data?.applied || [];
				return (
					<Grid>
						<DateTypeFilter
							filterName={label}
							filter_key={filter?.meta.key}
							activeSelection={applied}
							onUpdate={(payload: any) => onFilterChange(filter.name, filter?.meta.key, filter.meta.type, payload)}
						/>
					</Grid>
				);
			}

			default:
				break;
		}
	};

	return (
		<Box position='relative'>
			<Grid sx={{ marginLeft: '0 !important' }} container spacing={1} direction='column' justifyContent='space-between'>
				{!isFirst && (
					<Grid
						onClick={() => scroll(-150)}
						sx={{
							position: 'absolute',
							zIndex: 100,
							top: -7,
							left: -10,
							cursor: 'pointer',
						}}
						item>
						<Avatar
							isImageAvatar={false}
							size='large'
							variant='circular'
							style={{
								...theme?.product?.filter?.chevron,
							}}
							content={<Icon color={theme?.palette?.secondary?.[600]} fontSize='medium' iconName='IconChevronLeft' />}
						/>
					</Grid>
				)}
				<StyledDiv ref={filterBoxRef}>
					{filtersList?.map((item: any) => (
						<Grid item key={item?.meta?.key} sx={{ background: theme?.product?.filter?.background, borderRadius: '8px', height: '42px' }}>
							{renderFilter(item)}
						</Grid>
					))}
				</StyledDiv>
				{!isLast && (
					<Grid
						sx={{
							position: 'absolute',
							zIndex: 100,
							right: -20,
							top: -7,
							cursor: 'pointer',
						}}
						onClick={() => scroll(150)}
						item>
						<Avatar
							isImageAvatar={false}
							size='large'
							variant='circular'
							style={{
								...theme?.product?.filter?.chevron,
							}}
							content={<Icon color={theme?.palette?.secondary?.[600]} fontSize='medium' iconName='IconChevronRight' />}
						/>
					</Grid>
				)}
			</Grid>
		</Box>
	);
};

Filters.defaultProps = {
	showFilterCount: true,
};
export default Filters;
