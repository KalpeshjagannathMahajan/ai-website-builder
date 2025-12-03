import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Accordion, Box, Grid } from '../../../atoms';
import AccordionMultiSelect from '../AccordionMultiSelect/AccordionMultiSelect';
import AccordionRange from '../AccordionRange/AccordionRange';
import AccordionSelect from '../AccordionSelect/AccordionSelect';
import styles from './filters.module.css';
import { useSelector } from 'react-redux';
import AccordionCategoryFilter from '../CategoryFilter/AccordionCategoryFilter';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import { useTheme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import AccordionDate from '../DateFIlter/AccordionDate';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { get_formatted_price_with_currency } from 'src/utils/common';
dayjs.extend(advancedFormat);

const selected_container = { display: 'flex', flexDirection: 'row' };
const FILTER_TYPE = ['range', 'timestamp', 'price', 'category', 'multi_select'];

const useStyles = makeStyles((theme: any) => ({
	accordion_layout: {
		marginTop: '1em !important',
		borderRadius: theme?.product?.filter?.accordion_type_filter?.borderRadius,
	},
}));

const RenderFields = ({ data, selectedFilters, setSelectedFilters, onFilterChange, isDisable = false }: any) => {
	const buyer = useSelector((state: any) => state.buyer);
	const defaultUnit = buyer?.buyer_cart?.meta?.pricing_info?.currency_symbol;
	if (data.meta.type === 'select') {
		const options = data?.data?.options || [];
		const Optionskeys = Object.keys(options);
		const applied = data?.data?.applied;
		if (applied?.length) {
			setSelectedFilters(applied);
		}
		return (
			<AccordionSelect
				options={Optionskeys}
				selectedOptions={selectedFilters}
				setSelectedOptions={setSelectedFilters}
				onApply={(value: any) => {
					onFilterChange(data.name, data.meta.key, data.meta.type, value);
				}}
			/>
		);
	}
	if (data?.meta?.type === 'multi-select' || data?.meta?.type === 'multi_select') {
		const optionsWithCount = data?.data?.options?.map((option: any) => {
			if (!option) return;
			const key: any = _.head(_.keys(option));
			const label = option?.[key]?.name || key; // Get the label from the key of the option object
			const count = option?.[key]?.doc_count; // Get the count from the value of the option object
			return { label: `${label} (${count})`, value: key };
		});

		const options = optionsWithCount || [];
		// const Optionskeys = Object.keys(options);
		const applied = data?.data?.applied;
		if (applied?.length) {
			setSelectedFilters(applied);
		}
		return (
			<AccordionMultiSelect
				options={options}
				selectedOptions={applied}
				setSelectedOptions={setSelectedFilters}
				onApply={(value: any) => {
					onFilterChange(data?.name, data?.meta?.key, data?.meta?.type, value);
				}}
				isDisable={isDisable}
			/>
		);
	}
	if (data.meta.type === 'range') {
		if (data.meta.key === 'price') {
			const options = data?.meta?.options || {};
			const { min, max } = data?.data?.options || {};

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
			const conversionFactors = data?.meta?.conversion_factors;
			const applied = data?.data?.applied;
			const handleFilter = (minValue: number, maxValue: number, selectedUnit: string, unitType: string) => {
				if (minValue === min && maxValue === max) {
					onFilterChange(data.name, data?.meta?.key, data?.meta?.type, []);
				} else {
					onFilterChange(data.name, data?.meta?.key, data?.meta?.type, [minValue, maxValue, selectedUnit, unitType]);
				}
			};
			return (
				<AccordionRange
					onApply={(minValue, maxValue, selectedUnit, unitType) => handleFilter(minValue, maxValue, selectedUnit, unitType)}
					UOM={uomOptions}
					isPrice={true}
					minRange={min}
					maxRange={max}
					defaultUnit={defaultUnit}
					conversionFactors={conversionFactors}
					unitType={data?.meta?.position}
					applied={applied}
					isDisable={isDisable}
				/>
			);
		} else {
			const options = data?.meta?.options || {};
			const { min, max, unit } = data?.data?.options || {};
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
			const conversionFactors = data?.meta?.conversion_factors;
			const applied = data?.data?.applied;
			const handleFilter = (minValue: number, maxValue: number, selectedUnit: string, unitType: string) => {
				if (minValue === min && maxValue === max) {
					onFilterChange(data.name, data?.meta?.key, data?.meta?.type, []);
				} else {
					onFilterChange(data.name, data?.meta?.key, data?.meta?.type, [minValue, maxValue, selectedUnit, unitType]);
				}
			};
			return (
				<AccordionRange
					onApply={(minValue, maxValue, selectedUnit, unitType) => handleFilter(minValue, maxValue, selectedUnit, unitType)}
					UOM={uomOptions}
					minRange={min}
					isPrice={false}
					maxRange={max}
					defaultUnit={unit}
					conversionFactors={conversionFactors}
					unitType={data?.meta?.position}
					applied={applied}
					key={JSON.stringify(data?.data?.applied)}
					isDisable={isDisable}
				/>
			);
		}
	}
	if (data.meta.type === 'category') {
		return (
			<Box mt={-2}>
				<AccordionCategoryFilter
					key={JSON.stringify(data?.data?.applied)}
					onApply={(payload: any) => onFilterChange(data.name, data?.meta?.key, 'category', payload)}
					categoryList={data?.data?.options}
					applied={data?.data?.applied || []}
					setAnchorEl={() => null}
					isDisable={isDisable}
				/>
			</Box>
		);
	}
	if (data?.meta?.type === 'timestamp' || data?.meta?.type === 'date') {
		const applied = data?.data?.applied || [];
		return (
			<Box mt={-2}>
				<AccordionDate
					filter_key={data?.meta?.key}
					activeSelection={applied}
					onUpdate={(payload: any) => onFilterChange(data?.name, data?.meta?.key, data?.meta?.type, payload)}
				/>
			</Box>
		);
	}
	return <div />;
};

export default function AccordionFilterType({
	data,
	onFilterChange,
	isDisable = false,
	apply_selected,
	has_opened,
	expanded,
	onChange,
}: any) {
	const [selectedFilters, setSelectedFilters] = useState([]);
	const buyer = useSelector((state: any) => state.buyer);
	const defaultUnit = buyer?.buyer_cart?.meta?.pricing_info?.currency_symbol;
	// eslint-disable-next-line @typescript-eslint/no-shadow
	const { t } = useTranslation();
	const theme: any = useTheme();
	const classes = useStyles();

	const [isOverflowing, setIsOverflowing] = useState(false);
	const typographyRef = useRef() as MutableRefObject<HTMLDivElement>;

	useEffect(() => {
		const checkOverflow = () => {
			if (typographyRef?.current) {
				const element = typographyRef?.current;
				if (element?.scrollWidth > element?.clientWidth) {
					setIsOverflowing(true);
				}
			}
		};

		checkOverflow();
		window.addEventListener('resize', checkOverflow);

		return () => window.removeEventListener('resize', checkOverflow);
	}, [selectedFilters]);
	useEffect(() => {
		if (_.includes(FILTER_TYPE, data?.meta?.type) && !_.isEqual(selectedFilters, data.data?.applied) && has_opened) {
			setSelectedFilters(data?.data?.applied || []);
		}
	}, [data, apply_selected, has_opened]);

	const update_selected_filters = (applied: any) => {
		setSelectedFilters(applied);
	};

	const renderAppliedValues = (type: any, values: any, options?: any) => {
		switch (type) {
			case 'range': {
				const [min = '', max = '', unit = ''] = values || [];
				return `${min}-${max} ${unit}`;
			}
			case 'timestamp': {
				const size = _.size(values);
				if (size <= 1) return _.head(values) || '';
				const [min = '', max = ''] = values || [];
				const from_date = dayjs(min).format("Do MMM'YY");
				const to_date = dayjs(max).format("Do MMM'YY");
				return `${from_date} - ${to_date}`;
			}
			case 'price': {
				const [min = '', max = ''] = values || [];
				return `${get_formatted_price_with_currency(defaultUnit, min)} - ${get_formatted_price_with_currency(defaultUnit, max)}`;
			}
			case 'category': {
				const splitValues = values?.map((item: string) => item.split(' > ').pop());
				return splitValues?.join(', ');
			}
			case 'multi-select':
			case 'multi_select': {
				const value: any[] = _.map(values, (opt: any) => {
					const option_val = _.find(options, (val: any) => val?.[opt]);
					if (option_val) return option_val?.[opt]?.name;
				});

				if (data?.meta?.key === 'inventory_status') return value?.join(', ');
				else return values?.join(', ');
			}
			default:
				return values?.join(', ');
		}
	};
	const handleClear = () => {
		onFilterChange(data.name, data?.meta?.key, data?.meta?.type, []);
	};

	if (data.meta.type === 'date') {
		return null;
	}

	const content = [
		{
			title: (
				<Grid>
					<Grid container spacing={1}>
						<Grid item>
							<CustomText
								type='H6'
								style={{ lineHeight: '2.4rem' }}
								children={
									<>
										{selectedFilters?.length > 0 && (
											<span
												className={styles['red-dot']}
												style={{
													...theme?.product?.filter?.red_dot,
												}}
											/>
										)}
										{!_.isEmpty(data?.label) ? data?.label : data?.name}
									</>
								}></CustomText>
						</Grid>
						{selectedFilters?.length > 0 && (
							<Grid item onClick={handleClear}>
								<CustomText
									type='H6'
									color={theme?.product?.filter?.accordion_type_filter?.clear_filter?.color}
									style={{ cursor: 'pointer', lineHeight: '2.4rem', textDecoration: 'underline' }}>
									Clear
								</CustomText>
							</Grid>
						)}
					</Grid>
					{selectedFilters?.length > 0 && data?.data?.applied?.length > 0 && (
						<Grid ml={2} sx={selected_container}>
							<p
								ref={typographyRef}
								style={{
									...theme?.product?.filter?.accordion_type_filter?.selected_filter,
								}}
								className={styles.selected_filter}>
								{renderAppliedValues(data?.meta?.key === 'price' ? 'price' : data?.meta?.type, data?.data?.applied, data?.data?.options)}
							</p>
							{isOverflowing && (
								<p
									style={{
										...theme?.product?.filter?.accordion_type_filter?.selected_filter,
									}}
									className={styles.more_selected}>
									{t('Common.FilterComponents.ShowingMore')}
								</p>
							)}
						</Grid>
					)}
				</Grid>
			),
			expandedContent: (
				<RenderFields
					data={data}
					selectedFilters={selectedFilters}
					setSelectedFilters={update_selected_filters}
					onFilterChange={onFilterChange}
					isDisable={isDisable}
				/>
			),
		},
	];

	return (
		<Accordion
			content={content}
			titleBackgroundColor={theme?.product?.filter?.accordion_type_filter?.background}
			contentBackground={theme?.product?.filter?.accordion_type_filter?.background}
			className={`${classes.accordion_layout}`}
			style={{ width: 398, ...theme?.product?.filter?.accordion_type_filter?.accordion_layout }}
			styleSub={{ backgroundColor: 'transparant !important', opacity: '1 !important' }}
			accordionDetailsClassName={styles.accordion_details}
			disabled={false}
			expanded={expanded}
			on_change={onChange}
			id={data.meta.key}
		/>
	);
}
