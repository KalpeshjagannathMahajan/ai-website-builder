import { Grid, InputAdornment, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Button, SingleSelect, Slider } from '../../../atoms';
import { OptionProps } from '../../../atoms/SingleSelect/SingleSelect';
import { t } from 'i18next';
import { useTheme } from '@mui/material/styles';
import { get_currency } from 'src/utils/common';

export interface RangeFilterProps {
	minRange: number;
	maxRange: number;
	isPrice: boolean;
	defaultUnit?: any;
	UOM: OptionProps[];
	onApply: (minValue: number, maxValue: number, unit: string, unitType: 'prefix' | 'suffix') => any;
	conversionFactors?: any;
	unitType: 'prefix' | 'suffix';
	applied?: any;
	isDisable?: boolean;
}

const DEBOUNCE_TIME = 1000;

export default function AccordionRange({
	onApply,
	minRange = 0,
	maxRange = 100,
	UOM,
	conversionFactors,
	defaultUnit = conversionFactors?.base_unit || UOM?.[0]?.value,
	isPrice,
	unitType,
	applied,
	isDisable = false,
}: RangeFilterProps) {
	const [min, setMin] = useState(parseFloat(minRange && typeof minRange ? minRange.toFixed(3) : '0'));
	const [max, setMax] = useState(parseFloat(maxRange && typeof maxRange ? maxRange.toFixed(3) : '0'));
	const calculateValue = (value: any) => {
		try {
			return parseFloat(value.toFixed(2));
		} catch (error) {
			console.error('Error setting min value:', error);
			return 0;
		}
	};
	const [minValue, setMinValue] = useState(() => calculateValue(minRange));

	const [maxValue, setMaxValue] = useState(() => calculateValue(maxRange));
	const [selectedUnit, setSelectedUnit] = useState(defaultUnit);
	const theme: any = useTheme();

	const debouncedOnApply = () => {
		const _min = Math.max(min, minValue);
		const _max = Math.min(max, maxValue);

		onApply(_min, _max, selectedUnit, unitType);
	};

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
		if (applied?.length > 0) {
			const [appliedMin, appliedMax, appliedUnit] = applied;
			setMinValue(appliedMin);
			setMaxValue(appliedMax);
			const event = { value: appliedUnit };
			handleUnitChange(event, true);
		}
	}, [applied]);

	useEffect(() => {
		// eslint-disable-next-line no-undef
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
		// eslint-disable-next-line no-undef
		let debounceReset: NodeJS.Timeout | undefined;

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

	const handleMinValueChange = (event: any) => {
		setMinValue(event.target.value);
	};

	const handleMaxValueChange = (event: any) => {
		setMaxValue(event.target.value);
	};

	const handleApply = () => {
		debouncedOnApply();
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
		<Grid sx={{ marginTop: '-2em' }}>
			<Grid container paddingY={1} paddingX={2} marginTop={0} rowSpacing={1.5} direction='column'>
				<Grid item xs>
					<Grid item padding={1} xs>
						<Slider
							sx={{ ...theme?.product?.filter?.accordion_slider }}
							min={min}
							max={max}
							value={[minValue, maxValue]}
							onChange={(event, newValue: any) => {
								event.stopPropagation();
								setMinValue(newValue[0]);
								setMaxValue(newValue[1]);
							}}
							marks={marks}
							disableSwap
							disabled={isDisable}
						/>
					</Grid>
				</Grid>
				{isPrice ? (
					<Grid item container spacing={1}>
						<Grid item xs>
							<TextField
								label={t('Common.FilterComponents.MinValue')}
								type='number'
								value={minValue}
								onChange={handleMinValueChange}
								fullWidth
								disabled={isDisable}
								sx={{
									'& .MuiOutlinedInput-root': {
										...theme?.form_elements_,
									},
								}}
								InputProps={{
									startAdornment: <InputAdornment position='start'>{get_currency(defaultUnit)}</InputAdornment>,
								}}
							/>
						</Grid>
						<Grid item xs>
							<TextField
								label={t('Common.FilterComponents.MaxValue')}
								type='number'
								value={maxValue}
								onChange={handleMaxValueChange}
								fullWidth
								disabled={isDisable}
								sx={{
									'& .MuiOutlinedInput-root': {
										...theme?.form_elements_,
									},
								}}
								InputProps={{
									startAdornment: <InputAdornment position='start'>{get_currency(defaultUnit)}</InputAdornment>,
								}}
							/>
						</Grid>
					</Grid>
				) : (
					<Grid item container spacing={1}>
						<Grid item xs>
							<TextField
								label={t('Common.FilterComponents.MinValue')}
								type='number'
								value={minValue}
								onChange={handleMinValueChange}
								fullWidth
								InputProps={{
									endAdornment: <InputAdornment position='end'>{get_currency(defaultUnit)}</InputAdornment>,
								}}
								disabled={isDisable}
							/>
						</Grid>
						<Grid item xs>
							<TextField
								label={t('Common.FilterComponents.MaxValue')}
								type='number'
								value={maxValue}
								onChange={handleMaxValueChange}
								fullWidth
								disabled={isDisable}
								InputProps={{
									endAdornment: <InputAdornment position='end'>{get_currency(defaultUnit)}</InputAdornment>,
								}}
							/>
						</Grid>
					</Grid>
				)}
				{UOM?.length > 0 && (
					<Grid item>
						<SingleSelect defaultValue={selectedUnit} options={UOM} handleChange={handleUnitChange} />
					</Grid>
				)}
				<Grid item>
					<Button tonal fullWidth onClick={handleApply} disabled={(min === minValue && max === maxValue) || isDisable}>
						{t('Common.FilterComponents.Apply')}
					</Button>
				</Grid>
			</Grid>
		</Grid>
	);
}

AccordionRange.defaultProps = {
	minRange: 0,
	maxRange: 100,
	label: 'Range',
	unitType: 'prefix',
	applied: [],
	conversionFactors: null,
};
