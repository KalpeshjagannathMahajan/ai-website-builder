import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Checkbox, CustomInput, Grid, Icon } from '../../../atoms';
import styles from '../MultiSelectFilter/MultiSelectFilter.module.css';
import { t } from 'i18next';
import CustomText from 'src/common/@the-source/CustomText';
import _ from 'lodash';

export interface AccordionMultiSelectProps {
	options: Array<string>;
	selectedOptions: Array<string>;
	setSelectedOptions: any;
	onApply?: any;
	isDisable?: boolean;
}

export default function AccordionMultiSelect({
	options,
	selectedOptions,
	setSelectedOptions,
	onApply,
	isDisable,
}: AccordionMultiSelectProps) {
	const [input, setInput] = useState<string>('');
	const [filteredOption, setFilteredOption] = useState<string[]>(options);
	const theme: any = useTheme();

	const handleSearch = (e: any) => {
		const searchValue = _.toLower(e?.target?.value);
		const filtered = options?.filter((item: any) => _.toLower(item?.value)?.includes(searchValue));
		setInput(e?.target?.value);
		setFilteredOption(filtered);
	};

	const handleOptionChange = (option: any) => {
		const optionFormatted = option?.value?.replace(/\s*\(\d+\)$/, '').trim();
		let newSelectedOptions;
		if (selectedOptions.includes(optionFormatted)) {
			newSelectedOptions = selectedOptions.filter((item) => item !== optionFormatted);
		} else {
			newSelectedOptions = [...selectedOptions, optionFormatted];
		}
		setSelectedOptions(newSelectedOptions);
		if (onApply) {
			onApply(newSelectedOptions);
		}
	};

	const handleSelectAllChange = () => {
		if (selectedOptions.length === filteredOption.length) {
			if (onApply) {
				onApply([]);
			}
		} else {
			const optionsToAdd = filteredOption.map((option: any) => option?.value?.replace(/\s*\(\d+\)$/, '').trim());
			if (onApply) {
				onApply(optionsToAdd);
			}
		}
	};

	useEffect(() => {
		setFilteredOption(options);
		if (input) {
			const searchValue = _.toLower(input);
			const filtered = options?.filter((item: any) => _.toLower(item?.value)?.includes(searchValue));
			setFilteredOption(filtered);
		}
	}, [options]);

	return (
		<Grid className={styles['sidebar-filter-container']} height={options?.length > 10 ? 420 : 'auto'}>
			{options?.length > 1 && (
				<Box
					className={styles['top-sticky-container']}
					sx={{
						background: theme?.product?.filter?.accordion_multi_type_filter?.background,
					}}>
					<CustomInput
						size='small'
						fullWidth
						startIcon={<Icon iconName='IconSearch' color={theme?.palette?.secondary?.[800]} />}
						onChange={handleSearch}
						value={input}>
						{t('Common.FilterComponents.Search')}
					</CustomInput>
				</Box>
			)}
			<Grid key={'Select All'} container>
				<Grid item>
					<Checkbox checked={selectedOptions?.length === filteredOption?.length} disabled={isDisable} onChange={handleSelectAllChange} />
				</Grid>
				<Grid display='flex' alignItems='center' justifyContent='center' item>
					<CustomText type='H3' color={theme?.product?.filter?.accordion_multi_type_filter?.color}>
						{t('Common.FilterComponents.SelectAll')}
					</CustomText>
				</Grid>
			</Grid>
			{_.map(filteredOption, (option: any) => (
				<Grid key={option?.value} display='flex' container>
					<Grid sm={1.2} item>
						<Checkbox
							checked={selectedOptions?.includes(option?.value?.replace(/\s*\(\d+\)$/, '').trim())}
							onChange={() => handleOptionChange(option)}
							disabled={isDisable}
						/>
					</Grid>
					<Grid sm={10.5} display='flex' alignItems='center' justifyContent='flex-start' item>
						<CustomText type='Title' style={{ noWrap: true }}>
							{option?.label}
						</CustomText>
					</Grid>
				</Grid>
			))}
		</Grid>
	);
}
