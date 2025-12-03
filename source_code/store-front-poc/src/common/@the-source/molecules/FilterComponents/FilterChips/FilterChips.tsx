import { useSelector } from 'react-redux';
import { Button, Chip, Grid, Icon, Tooltip } from '../../../atoms';
import { IChip } from '../../FiltersAndChips/interfaces';
import { MutableRefObject, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';
import constants from 'src/utils/constants';
import { get_formatted_price_with_currency } from 'src/utils/common';

export interface FilterChipsProps {
	filterList: IChip[];
	onClearAll: () => void;
	handleMore: () => void;
	onClearFilter: (key: string, value: any, type: string) => void;
}

const styles = {
	display_chips: { maxWidth: '150rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginLeft: '.4rem' },
	chip_container: { display: 'flex', flexDirection: 'row', alignItems: 'center' },
};

const FilterChips = ({ filterList, onClearAll, onClearFilter, handleMore }: FilterChipsProps) => {
	const buyer = useSelector((state: any) => state.buyer);
	const { t } = useTranslation();
	const chip_container_ref = useRef() as MutableRefObject<HTMLDivElement>;
	const [more_chips, set_more_chips] = useState<boolean>(false);
	const currency = buyer?.buyer_cart?.meta?.pricing_info?.currency_symbol;
	const theme: any = useTheme();
	const chipsProps = {
		bgColor: theme?.product?.filter?.filter_and_chips?.background,
		textColor: theme?.palette?.secondary?.[800],
		variant: 'outlined',
		deleteIcon: <Icon iconName='IconX' color={theme?.product?.filter?.filter_and_chips?.icon_style?.color} fontSize='small' />,
	};
	const getFilterLabel = (filterKey: string, filterValue: string, filterName: string) => {
		// [Suyash: 29/04/2024] Keeping code commentted for reference
		// const flatFilterListValues = filterList?.filter((item: any) => item?.key !== filterKey)?.flatMap((el: any) => el.value);
		// const isValueExist = flatFilterListValues.includes(filterValue);
		// return isValueExist ? `${filterName}: ${filterValue}` : filterValue;

		if (_.includes(filterValue, '>') || _.includes(constants.EXCLUDED_FACETS_LABELS, filterName?.toUpperCase())) {
			return filterValue;
		} else {
			return `${filterName}: ${filterValue}`;
		}
	};

	const checkOverflow = () => {
		if (chip_container_ref?.current) {
			const isOverflowing = chip_container_ref?.current?.scrollWidth > chip_container_ref?.current?.clientWidth;
			set_more_chips(isOverflowing);
		}
	};

	const renderFilterLabel = (filter: any) => {
		switch (filter.type) {
			case 'select': {
				const displayLabel = getFilterLabel(filter.key, filter.value, filter.label);
				return (
					<Grid item>
						<Tooltip placement='top' onClose={() => {}} onOpen={() => {}} title={displayLabel}>
							<Chip
								sx={styles.display_chips}
								label={displayLabel}
								onDelete={() => onClearFilter(filter?.key, filter?.value, filter?.type)}
								{...chipsProps}
							/>
						</Tooltip>
					</Grid>
				);
			}
			case 'multi_select':
			case 'multi-select': {
				const multiSelectArr = filter.value;
				return multiSelectArr.map((el: any, index: number) => {
					const displayLabel = getFilterLabel(filter.key, el, filter.label);
					return (
						<Grid item>
							<Tooltip placement='top' onClose={() => {}} onOpen={() => {}} title={displayLabel}>
								<Chip
									sx={styles.display_chips}
									label={displayLabel}
									onDelete={() => onClearFilter(filter?.key, filter.ids[index], filter?.type)}
									{...chipsProps}
								/>
							</Tooltip>
						</Grid>
					);
				});
			}
			case 'timestamp':
			case 'range': {
				const [min, max, unit, unitType = 'prefix'] = filter?.value;
				let label = `${filter?.label}: ${min} - ${max} ${unit}`;

				if (unitType === 'no_eta') {
					label = min;
				} else if (unitType === 'prefix') {
					const min_label = filter?.key === 'price' ? get_formatted_price_with_currency(currency, min) : min;
					const max_label = filter?.key === 'price' ? get_formatted_price_with_currency(currency, max) : max;
					label = `${filter?.label}: ${unit?.toUpperCase()} ${min_label} - ${max_label}`;
				}
				return (
					<Grid item>
						<Tooltip placement='top' onClose={() => {}} onOpen={() => {}} title={label}>
							<Chip
								sx={styles.display_chips}
								label={label}
								onDelete={() => onClearFilter(filter?.key, filter?.value, filter?.type)}
								{...chipsProps}
							/>
						</Tooltip>
					</Grid>
				);
			}
			case 'category': {
				const categoriesArr = filter?.value;
				return categoriesArr.map((category: any) => {
					if (!category) return null;
					// const selectedCategory = category.split(' > ')?.pop();
					const displayLabel = getFilterLabel(filter?.key, category, filter?.label);
					return (
						<Grid item>
							<Tooltip placement='top' onClose={() => {}} onOpen={() => {}} title={displayLabel}>
								<Chip
									sx={styles.display_chips}
									label={displayLabel}
									onDelete={() => onClearFilter(filter?.key, category, filter?.type)}
									{...chipsProps}
								/>
							</Tooltip>
						</Grid>
					);
				});
			}
			default: {
				const displayLabel = getFilterLabel(filter.key, filter.value, filter.label);
				return (
					<Tooltip placement='top' onClose={() => {}} onOpen={() => {}} title={displayLabel}>
						<Chip sx={styles.display_chips} label={displayLabel} {...chipsProps} />
					</Tooltip>
				);
			}
		}
	};

	useLayoutEffect(() => {
		checkOverflow();
		window.addEventListener('resize', checkOverflow);
		return () => window.removeEventListener('resize', checkOverflow);
	}, [filterList]);

	return (
		<Grid container spacing={1} width={'100%'} sx={{ marginTop: '0', overflow: 'hidden' }}>
			{filterList?.filter((row: any) => row?.value?.length > 0).length > 0 && (
				<Grid item sx={styles.chip_container} maxWidth='calc(100% - 10rem)'>
					<Chip
						bgColor={theme?.product?.filter?.filter_and_chips?.chip_style?.background}
						textColor={theme?.product?.filter?.filter_and_chips?.chip_style?.color}
						label='Clear All'
						variant='outlined'
						sx={{
							fontWeight: 'bold',
							cursor: 'pointer',
						}}
						onClick={onClearAll}
					/>
					<div
						style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', overflow: 'hidden', flexWrap: 'nowrap' }}
						ref={chip_container_ref}>
						{filterList.map((filter: any) => renderFilterLabel(filter))}
					</div>
				</Grid>
			)}
			{more_chips && (
				<Grid item width={'9rem'}>
					<Button onClick={handleMore} variant='text'>
						{t('Common.FilterComponents.MoreChip')}
					</Button>
				</Grid>
			)}
		</Grid>
	);
};

FilterChips.defaultProps = {};
export default FilterChips;
