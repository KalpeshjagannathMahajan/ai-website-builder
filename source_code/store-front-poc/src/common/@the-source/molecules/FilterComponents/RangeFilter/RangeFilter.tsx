import { InputAdornment, Menu, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Button, Grid, Icon, Slider, Typography } from '../../../atoms';
import { OptionProps } from '../../../atoms/SingleSelect/SingleSelect';
import styles from './RangeFilter.module.css';
import { t } from 'i18next';
import { useTheme } from '@mui/material/styles';
import CustomText from 'src/common/@the-source/CustomText';
import { get_currency } from 'src/utils/common';

export interface RangeFilterProps {
	minRange: number;
	maxRange: number;
	defaultUnit?: any;
	label?: string;
	UOM: OptionProps[];
	onApply: (minValue: number, maxValue: number, unit: string, unitType: 'prefix' | 'suffix') => any;
	conversionFactors?: any;
	unitType: 'prefix' | 'suffix';
	applied?: any;
	style?: any;
}

const DEBOUNCE_TIME = 1000;

const RangeFilter = ({
	minRange,
	maxRange,
	UOM,
	onApply,
	label,
	conversionFactors,
	defaultUnit = conversionFactors?.base_unit || UOM?.[0]?.value,
	unitType,
	applied,
	style = {},
}: RangeFilterProps) => {
	const [min, setMin] = useState(parseFloat(minRange && typeof minRange ? minRange.toFixed(3) : '0'));
	const [max, setMax] = useState(parseFloat(maxRange && typeof maxRange ? maxRange.toFixed(3) : '0'));
	const [minValue, setMinValue] = useState(minRange);
	const [maxValue, setMaxValue] = useState(maxRange);
	const [selectedUnit, setSelectedUnit] = useState(defaultUnit);
	const theme: any = useTheme();

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleUnitChange = (select: any, noValueUpdate: boolean = false) => {
		setSelectedUnit(select?.value);
		const { factor = null } = conversionFactors ?? {};
		if (factor) {
			const conversionFactor = factor[select?.value];
			const baseFactor = factor[selectedUnit];
			if (!conversionFactor) {
				console.error(`Conversion factor not found for ${select?.value}`);
				return;
			}

			const convertedMinValue = ((minRange && typeof minRange ? minRange : 0) * conversionFactor) / baseFactor;
			const convertedMin = (min * conversionFactor) / baseFactor;
			const convertedMaxValue = ((maxRange && typeof maxRange ? maxRange : 0) * conversionFactor) / baseFactor;
			const convertedMax = (max * conversionFactor) / baseFactor;
			if (!noValueUpdate) {
				setMaxValue(parseFloat(convertedMaxValue.toFixed(3)));
				setMinValue(parseFloat(convertedMinValue.toFixed(3)));
			}
			setMin(parseFloat(convertedMin.toFixed(3)));
			setMax(parseFloat(convertedMax.toFixed(3)));
		}
	};

	useEffect(() => {
		setMin(parseFloat(minRange && typeof minRange ? minRange.toFixed(3) : '0'));
	}, [minRange]);
	useEffect(() => {
		setMax(parseFloat(maxRange && typeof maxRange ? maxRange.toFixed(3) : '0'));
	}, [maxRange]);

	useEffect(() => {
		if (open) {
			if (applied?.length > 0) {
				const [appliedMin, appliedMax, appliedUnit] = applied;
				setMinValue(appliedMin);
				setMaxValue(appliedMax);
				const event = { value: appliedUnit };
				handleUnitChange(event, true);
			} else {
				setMinValue(parseFloat(minRange && typeof minRange ? minRange.toFixed(3) : '0'));
				setMaxValue(parseFloat(maxRange && typeof maxRange ? maxRange.toFixed(3) : '0'));
			}
		}
	}, [applied, open]);

	useEffect(() => {
		// eslint-disable-next-line
		let debounceReset: NodeJS.Timeout | undefined;

		if (minValue > Math.min(max, maxValue)) {
			debounceReset = setTimeout(() => {
				setMinValue(Math.min(max, maxValue));
			}, DEBOUNCE_TIME);
		}

		return () => {
			if (debounceReset) {
				clearTimeout(debounceReset);
			}
		};
	}, [minValue]);

	useEffect(() => {
		// TODO: Fix this NodeJS.Timeout type
		// eslint-disable-next-line
		let debounceReset: NodeJS.Timeout | undefined;

		// if (maxValue > max || maxValue < min) {
		// 	debounceReset = setTimeout(() => {
		// 		setMaxValue(max);
		// 	}, DEBOUNCE_TIME);
		// }

		// return () => {
		// 	if (debounceReset) {
		// 		clearTimeout(debounceReset);
		// 	}
		// };

		if (maxValue < Math.max(min, minValue)) {
			debounceReset = setTimeout(() => {
				setMaxValue(Math.min(min, minValue));
			}, DEBOUNCE_TIME);
		}
		return () => {
			if (debounceReset) {
				clearTimeout(debounceReset);
			}
		};
	}, [maxValue]);

	const handleBoxClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleMinValueChange = (event: any) => {
		setMinValue(event.target.value);
	};

	const handleMaxValueChange = (event: any) => {
		setMaxValue(event.target.value);
	};

	const handleApply = () => {
		setAnchorEl(null);
		onApply(minValue, maxValue, selectedUnit, unitType);
	};

	const marks = [
		{
			value: min,
			label: min,
		},
		{
			value: max,
			label: max,
		},
	];

	return (
		<>
			<Grid
				container
				className={styles['range-filter-box']}
				sx={{
					border: (!anchorEl && applied?.length) === 0 ? '' : theme?.product?.filter?.range_filter?.border,
					padding: (!anchorEl && applied?.length) === 0 ? '0em 0.5em' : '0em 0.5em',
					'&:hover': {
						border: applied.length === 0 ? theme?.product?.filter?.range_filter?.hover_border : '',
					},
					...style,
					...theme?.product?.filter?.range_filter?.range_filter_box,
				}}
				direction='row'
				justifyContent='space-between'
				alignItems='center'
				minWidth={150}
				height={42}
				onClick={(e: any) => {
					handleBoxClick(e);
				}}>
				<Grid item sx={{ display: 'flex', alignItems: 'center' }}>
					{applied?.length > 0 && (
						<span
							className={styles['red-dot']}
							style={{
								...theme?.product?.filter?.range_filter?.red_dot,
							}}
						/>
					)}
					<Typography sx={{ fontFamily: theme?.product?.filter?.range_filter?.fontFamily }} className='range_filter_label' variant='body-2'>
						{label}
					</Typography>
				</Grid>
				<Grid item alignItems='center'>
					<Icon iconName={anchorEl ? 'IconChevronUp' : 'IconChevronDown'} sx={{ marginTop: '.2em' }} />
				</Grid>
			</Grid>
			<Menu
				onClose={handleClose}
				open={open}
				anchorEl={anchorEl}
				slotProps={{
					paper: {
						sx: {
							borderRadius: theme?.dropdown_border_radius?.borderRadius,
							'& ul': {
								borderRadius: theme?.dropdown_border_radius?.borderRadius,
							},
						},
					},
				}}>
				<Grid container paddingY={1} sx={{ width: '26.5rem' }} paddingX={2} marginTop={0} rowSpacing={1.5} direction='column'>
					<Grid item xs>
						<Grid item marginBottom={2}>
							<CustomText type='Body'>{t('Common.FilterComponents.SelectRange')}</CustomText>
						</Grid>
						<Grid item paddingX={1} xs sx={{ margin: '0 1rem' }}>
							<Slider
								sx={{
									...theme?.product?.filter?.range_filter?.slider,
								}}
								min={min}
								max={max}
								value={[minValue, maxValue]}
								onChange={(event, newValue: any) => {
									event.stopPropagation();
									setMinValue(newValue[0]);
									setMaxValue(newValue[1]);
								}}
								marks={marks}
								valueLabelDisplay='auto'
								disableSwap
							/>
						</Grid>
					</Grid>
					{label === 'Price' ? (
						<Grid item container spacing={1}>
							<Grid item xs>
								<TextField
									label='Min Value'
									type='number'
									value={minValue}
									onChange={handleMinValueChange}
									fullWidth
									sx={{
										'& .MuiOutlinedInput-root': {
											...theme?.form_elements_,
										},
									}}
									InputProps={{
										startAdornment: <InputAdornment position='start'>{get_currency(defaultUnit)}</InputAdornment>,
										sx: {
											'& .MuiInputBase-input': {
												paddingLeft: '0px !important',
											},
										},
									}}
								/>
							</Grid>
							<Grid item xs>
								<TextField
									label='Max Value'
									type='number'
									value={maxValue}
									onChange={handleMaxValueChange}
									fullWidth
									sx={{
										'& .MuiOutlinedInput-root': {
											...theme?.form_elements_,
										},
									}}
									InputProps={{
										startAdornment: <InputAdornment position='start'>{get_currency(defaultUnit)}</InputAdornment>,
										sx: {
											'& .MuiInputBase-input': {
												paddingLeft: '0px !important',
											},
										},
									}}
								/>
							</Grid>
						</Grid>
					) : (
						<Grid item container spacing={1}>
							<Grid item xs>
								<TextField label='Min Value' type='number' value={minValue} onChange={handleMinValueChange} fullWidth />
							</Grid>
							<Grid item xs>
								<TextField label='Max Value' type='number' value={maxValue} onChange={handleMaxValueChange} fullWidth />
							</Grid>
						</Grid>
					)}

					{/* {UOM.length > 0 && (
						<Grid item>
							<SingleSelect defaultValue={selectedUnit} options={UOM} handleChange={handleUnitChange} />
						</Grid>
					)} */}
					<Grid item>
						<Button tonal fullWidth onClick={handleApply} sx={{ boxShadow: 'none' }}>
							{t('Common.FilterComponents.Apply')}
						</Button>
					</Grid>
				</Grid>
			</Menu>
		</>
	);
};

RangeFilter.defaultProps = {
	minRange: 0,
	maxRange: 100,
	label: 'Range',
	unitType: 'prefix',
	applied: [],
	conversionFactors: null,
};

export default RangeFilter;
