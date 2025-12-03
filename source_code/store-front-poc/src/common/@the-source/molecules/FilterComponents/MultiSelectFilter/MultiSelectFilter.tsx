import { FormControl, MenuItem, MenuProps, Select, Typography } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { Box, Button, Checkbox, CustomInput, Grid, Icon } from '../../../atoms';
import styles from './MultiSelectFilter.module.css';
import './styles.css';
import { t } from 'i18next';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';

const { VITE_APP_REPO } = import.meta.env;

const is_ultron = VITE_APP_REPO === 'ultron';

export interface MultiSelectDropdownProps {
	filterName: string;
	onClear: () => any;
	onUpdate: (val: string[]) => any;
	activeSelection?: string[];
	options: string[];
}

const MultiSelectDropdown = ({ filterName, onClear, onUpdate, options, activeSelection = [] }: MultiSelectDropdownProps) => {
	const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
	const [input, setInput] = useState<string>('');
	const [isOpen, setIsOpen] = useState(false);
	const [filteredOption, setFilteredOption] = useState<string[]>(options);
	const theme: any = useTheme();

	useEffect(() => {
		setFilteredOption(options);
		if (input) {
			const searchValue = _.toLower(input);
			const filtered = options?.filter((item: any) => _.toLower(item?.value)?.includes(searchValue));
			setFilteredOption(filtered);
		}
	}, [options]);

	useEffect(() => {
		if (isOpen) {
			setSelectedOptions(activeSelection);
		}
	}, [activeSelection, isOpen]);

	const handleOptionSelect = (event: SelectChangeEvent<string[]>) => {
		if (event.target.value) {
			const filtered = Array.isArray(event.target.value) ? event.target.value.filter(Boolean) : [];

			setSelectedOptions(filtered as string[]);
		}
	};
	const handleClear = () => {
		setSelectedOptions([]);
		onClear();
		setIsOpen(false);
	};

	const handleClose = () => {
		setIsOpen(false);
		// After closing the dropdown, reset the filtered options to the full options list
		setFilteredOption(options);
	};
	const handleUpdate = () => {
		const filteredOptions = selectedOptions.map((value) => value.replace(/\s*\(\d+\)$/, '').trim()).filter(Boolean);
		onUpdate(filteredOptions);
		handleClose();
	};

	const handleSearch = (e: any) => {
		const filtered = options?.filter((item: any) => _.toLower(item?.value)?.includes(_.toLower(e?.target?.value)));
		setInput(e?.target?.value);
		setFilteredOption(filtered);
	};

	const handleSelectAll = () => {
		if (selectedOptions?.length === filteredOption?.length) {
			setSelectedOptions([]);
		} else {
			setSelectedOptions(filteredOption.map((option: any) => option?.value?.replace(/\s*\(\d+\)$/, '').trim()));
		}
	};
	const handleSelect = (option: any) => () => {
		setSelectedOptions((prevSelected) => {
			const option_value = _.trim(option?.value?.replace(/\s*\(\d+\)$/, ''));
			const optionIndex = prevSelected.indexOf(option_value);
			if (optionIndex > -1) {
				// Remove the option from selectedOptions if it's already selected
				return prevSelected.filter((item) => item !== option_value);
			} else {
				// Add the option to selectedOptions if it's not already selected
				return [...prevSelected, option_value];
			}
		});
	};

	const DropdownIcon = () => <Icon iconName='IconChevronDown' sx={{ mr: '.5em' }} onClick={() => setIsOpen(true)} />;

	const UpIcon = () => <Icon iconName='IconChevronUp' sx={{ mr: '.5em' }} onClick={() => setIsOpen(false)} />;

	return (
		<FormControl fullWidth sx={{ minWidth: 160, height: 42 }}>
			<Select
				multiple
				displayEmpty
				value={selectedOptions}
				onKeyDown={(e) => e.stopPropagation()}
				defaultValue={activeSelection}
				onChange={handleOptionSelect}
				onClose={() => setIsOpen(false)}
				onOpen={() => setIsOpen(true)}
				IconComponent={isOpen ? UpIcon : DropdownIcon}
				className={activeSelection?.length > 0 ? 'selectCustom2' : 'selectCustom'}
				renderValue={() => {
					if (activeSelection?.length > 0) {
						return (
							<>
								<span className={styles['red-dot']} style={{ ...theme?.product?.filter?.range_filter?.red_dot }} />
								{filterName} ({activeSelection?.length})
							</>
						);
					}

					return filterName;
				}}
				sx={{
					border:
						activeSelection?.length > 0 || isOpen
							? theme?.product?.filter?.multi_select_filter?.border
							: theme?.product?.filter?.multi_select_filter?.border,
					height: 42,
					textOverflow: 'ellipsis',
					fontSize: '1.4rem',
					'&:hover': {
						border: theme?.product?.filter?.multi_select_filter?.container_border,
						cursor: 'pointer',
					},
					fontFamily: theme?.product?.filter?.multi_select_filter?.fontFamily,
					borderRadius: theme?.product?.filter?.multi_select_filter?.borderRadius,
				}}
				open={isOpen}
				MenuProps={
					{
						PaperProps: {
							style: {
								width: 240,
								borderRadius: theme?.dropdown_border_radius?.borderRadius,
								overflow: 'hidden',
							},
							sx: {
								'& ul': {
									borderRadius: theme?.dropdown_border_radius?.borderRadius,
								},
							},
						},
						anchorOrigin: {
							vertical: 'bottom',
							horizontal: 'left',
						},
						transformOrigin: {
							vertical: 'top',
							horizontal: 'left',
						},
						getContentAnchorEl: null,
					} as Partial<MenuProps>
				}>
				<Box
					className={styles['top-sticky-container']}
					sx={{
						background: theme?.product?.filter?.multi_select_filter?.background,
					}}>
					<CustomInput
						size='small'
						fullWidth
						startIcon={<Icon iconName='IconSearch' color={theme?.palette?.secondary?.[800]} />}
						onChange={handleSearch}
						value={input}
						allowClear>
						{t('Common.FilterComponents.Search')}
					</CustomInput>
				</Box>
				<Box className={styles['content-container']}>
					<MenuItem onKeyDown={(e) => e.stopPropagation()} sx={{ pl: 1 }} onClick={handleSelectAll}>
						<Checkbox size='small' checked={selectedOptions?.length === filteredOption?.length} />
						<Typography noWrap color={theme?.product?.filter?.multi_select_filter?.color} fontWeight={700}>
							{t('Common.FilterComponents.SelectAll')}
						</Typography>
					</MenuItem>
					{filteredOption?.map((option: any) => (
						<MenuItem
							onKeyDown={(e) => e.stopPropagation()}
							sx={{ pl: 1 }}
							key={option?.value}
							value={option}
							onClick={handleSelect(option)}>
							<Checkbox
								size='small'
								checked={
									selectedOptions.indexOf(option?.value?.replace(/\s*\(\d+\)$/, '').trim()) > -1 || selectedOptions.indexOf(option) > -1
								}
							/>
							<Typography noWrap>{option?.label}</Typography>
						</MenuItem>
					))}
				</Box>

				<Box
					className={styles['bottom-button-container']}
					sx={{
						background: theme?.product?.filter?.multi_select_filter?.background,
					}}>
					{activeSelection?.length > 0 ? (
						<Grid container spacing={1} justifyContent='space-between'>
							<Grid item xs>
								<Button fullWidth color='secondary' variant='outlined' onClick={handleClear} sx={{ boxShadow: 'none' }}>
									{t('Common.FilterComponents.Clear')}
								</Button>
							</Grid>
							<Grid item xs>
								<Button fullWidth tonal={is_ultron} variant='contained' onClick={handleUpdate} sx={{ boxShadow: 'none' }}>
									{t('Common.FilterComponents.Update')}
								</Button>
							</Grid>
						</Grid>
					) : (
						<Button
							tonal
							variant='contained'
							fullWidth
							disabled={selectedOptions?.length === 0}
							onClick={handleUpdate}
							sx={{ boxShadow: 'none' }}>
							{t('Common.FilterComponents.Apply')}
						</Button>
					)}
				</Box>
			</Select>
		</FormControl>
	);
};

MultiSelectDropdown.defaultProps = {
	activeSelection: [],
};

export default MultiSelectDropdown;
