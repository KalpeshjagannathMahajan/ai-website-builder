/* eslint-disable @typescript-eslint/no-shadow */
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import { Box, Chip, Grid, MenuItem } from '@mui/material';
import Select, { SelectProps as MuiSelectProps } from '@mui/material/Select';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import apply_validations, { ValidationProps } from 'src/utils/apply_validations';
import Icon from '../Icon/Icon';
import _ from 'lodash';
import { CustomInput, Tooltip } from 'src/common/@the-source/atoms';
import { t } from 'i18next';
import NoOption from 'src/screens/CustomProduct/Components/NoOption';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import utils from 'src/utils/utils';

type SelectBaseProps = Pick<MuiSelectProps, 'error' | 'value' | 'label' | 'disabled'>;

interface OptionProp {
	label: string;
	value: string;
}

export interface SelectProps extends SelectBaseProps {
	label?: string;
	checkmarks?: boolean;
	value?: string[];
	helperText?: string;
	handleChange: (value: string[]) => void; // Change this to accept an array of strings
	name: string;
	defaultValue?: any;
	options: Array<string> | OptionProp[];
	complex?: boolean;
	style: any;
	type: string;
	validations?: ValidationProps;
	alwaysSelected?: any;
	disabled?: boolean;
	fetchFromForm?: boolean; // TODO: remove this hack in future! Doing this so that user and buyer from can work together
	onChangeCapture?: any;
}

const chip_style = {
	padding: '0.6rem 0.3rem',
	maxWidth: 'fit-content',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	flex: '0.5',
};

const MultiSelectEditField = ({
	options,
	label,
	value, // Change this to accept an array of strings
	error,
	type,
	checkmarks,
	helperText,
	name,
	handleChange,
	defaultValue,
	complex,
	validations,
	style,
	disabled,
	fetchFromForm = true,
	alwaysSelected = [],
	onChangeCapture,
	...rest
}: SelectProps) => {
	const { control, setValue, watch, setError, clearErrors } = useFormContext();
	const current_theme: any = useTheme();
	const val = watch(name);
	const theme: any = useTheme();
	let default_data: string[] = [];
	if (typeof defaultValue === 'string') {
		default_data = defaultValue
			.split(',')
			.map((valued: any) => valued.trim())
			.filter((valued: any) => valued !== '');
	} else if (Array.isArray(defaultValue)) {
		default_data = defaultValue?.map((valued: any) => valued?.trim())?.filter((valued: any) => valued !== '');
	}

	if (!_.isEmpty(val) && fetchFromForm) {
		if (typeof val === 'string') {
			default_data = val
				.split(',')
				.map((valued: any) => valued.trim())
				.filter((valued: any) => valued !== '');
		} else {
			default_data = val;
		}
	}

	let output: any = [];

	!_.isEmpty(default_data) &&
		_.forEach(default_data, (data_value) => {
			let matching_item: any = _.find(options, { value: data_value });
			if (matching_item) {
				output.push(matching_item.value);
			}
		});

	const [selectedOptions, setSelectedOptions] = useState<any>(null);

	const optionsTemp: Array<string> = complex
		? (options as OptionProp[]).map((option: OptionProp) => option.value)
		: (options as Array<string>);

	const optionsMapping: Record<string, string> = complex
		? (options as OptionProp[]).reduce((acc, item) => {
				acc[item.value] = item.label;
				return acc;
		  }, {} as Record<string, string>)
		: {};

	const displayValue = (item: string) => (complex ? optionsMapping[item] : item);

	const [search_values, setsearch_values] = useState(optionsTemp);

	const handle_delete = (event: React.MouseEvent, val: string) => {
		event.preventDefault();
		if (alwaysSelected.includes(val)) {
			return;
		}
		const updatedOptions = selectedOptions?.filter((item: any) => item !== val);
		setSelectedOptions(updatedOptions);
		if (updatedOptions && updatedOptions.length > 0) {
			clearErrors(name);
		} else {
			// If needed, you can also set an error for the field explicitly.
			validations?.required &&
				setError(name, {
					type: 'manual',
					message: 'This field is mandatory',
				});
		}

		handleChange && handleChange(updatedOptions);
		onChangeCapture && onChangeCapture({ target: { name, value: updatedOptions } });
	};

	const handleSelect = (item: any) => {
		setSelectedOptions((prev: any) => {
			const itemIndex = prev.indexOf(item);

			if (itemIndex > -1) {
				return prev.filter((_: any, index: number) => index !== itemIndex);
			} else {
				return [...prev, item];
			}
		});
	};

	const sort_items_on_selection = (selected_options_array: any, complete_array: any) => {
		const sorted_array = utils.get_sorted_array_on_selection(selected_options_array, complete_array, displayValue);

		setsearch_values(sorted_array);
	};

	const handleSearch = (search_string: string) => {
		const filteredResults = utils.get_search_string_result(optionsTemp, search_string, displayValue);
		const matchingSelectedOptions = utils.get_search_string_result(selectedOptions, search_string, displayValue);

		sort_items_on_selection(matchingSelectedOptions, filteredResults);
	};

	useEffect(() => {
		if (output) {
			setSelectedOptions(output);
		}
	}, [options]);

	useEffect(() => {
		if (output && _.size(output) && (_.isNull(selectedOptions) || !_.size(selectedOptions))) {
			setSelectedOptions(output);
		}
	}, [output]);

	useEffect(() => {
		if (val || selectedOptions) {
			setValue(name, selectedOptions);
		} else {
			setValue(name, defaultValue);
		}

		if (selectedOptions && selectedOptions.length > 0) {
			clearErrors(name);
		} else {
			// If needed, you can also set an error for the field explicitly.
			validations?.required &&
				setError(name, {
					type: 'manual',
					message: 'This field is mandatory',
				});
		}

		selectedOptions && handleChange && handleChange(selectedOptions);
		onChangeCapture && onChangeCapture({ target: { name, value: selectedOptions } });
	}, [setValue, defaultValue, selectedOptions]);

	return (
		<Controller
			name={name}
			control={control}
			defaultValue={type === 'multi_select' ? defaultValue || [] : defaultValue}
			shouldUnregister={false}
			rules={apply_validations({ label, name, ...validations })}
			render={({ fieldState: { error } }) => {
				return (
					<FormControl fullWidth error={!!error} disabled={disabled}>
						<InputLabel id='simple-select-label'>
							{label}
							{validations?.required && '*'}
						</InputLabel>
						<Select
							labelId='simple-select-label'
							multiple
							id='select-id'
							type='multiple'
							label={label}
							onOpen={() => sort_items_on_selection(selectedOptions, optionsTemp)}
							value={selectedOptions?.length >= 0 ? selectedOptions : default_data} // Use selectedOptions state
							name={name}
							style={{ ...style, ...theme?.form_elements_ }}
							renderValue={(selected: any) => {
								let data;
								if (Array.isArray(selected)) {
									data = selected;
								} else {
									data = selected?.split(',');
								}
								return (
									<Box
										sx={{
											display: 'flex',
											gap: 0.5,
											flexWrap: 'nowrap',
											overflow: 'hidden',
										}}>
										{data.slice(0, 2).map((val: any, index: number) => (
											<Tooltip key={index} title={displayValue(val)}>
												{disabled ? (
													<Chip
														size='small'
														label={displayValue(val)}
														sx={{
															...chip_style,
															...current_theme?.product?.filter?.multi_select_filter?.chip,
															flex: '0.5',
														}}
													/>
												) : (
													<Chip
														size='small'
														sx={{
															...chip_style,
															...current_theme?.product?.filter?.multi_select_filter?.chip,
															flex: '0.5',
														}}
														label={displayValue(val)}
														onDelete={(e) => handle_delete(e, val)}
														deleteIcon={alwaysSelected?.includes(val) ? <></> : <Icon iconName='IconX' fontSize='small' />}
													/>
												)}
											</Tooltip>
										))}
										{data.length > 2 && (
											<Chip
												size='small'
												label={`+${data.length - 2}`}
												sx={{
													...chip_style,
													...current_theme?.product?.filter?.multi_select_filter?.chip,
													minWidth: '50px',
												}}
											/>
										)}
									</Box>
								);
							}}
							{...rest}>
							<Grid>
								{optionsTemp.length >= 7 && (
									<CustomInput
										size='small'
										fullWidth
										inputType='search'
										input_style={{ margin: '0rem 1rem' }}
										startIcon={<Icon iconName='IconSearch' color={current_theme?.palette?.secondary[800]} />}
										onChange={(e) => handleSearch(e.target.value)}
										allowClear>
										{t('Common.FilterComponents.Search')}
									</CustomInput>
								)}
								<Grid sx={{ maxHeight: 300, overflowY: 'auto' }}>
									{_.isArray(search_values) &&
										(search_values.length > 0 ? (
											search_values.map(
												(item: any): JSX.Element => (
													<MenuItem key={item} value={item} onClick={() => handleSelect(item)}>
														{checkmarks && (
															<Checkbox disabled={alwaysSelected?.includes(item)} checked={selectedOptions?.indexOf(item) > -1} />
														)}
														{displayValue(item)}
													</MenuItem>
												),
											)
										) : (
											<NoOption />
										))}
								</Grid>
							</Grid>
						</Select>
						{error && (
							<FormHelperText style={{ fontSize: '1.4rem', color: current_theme?.palette?.colors?.red }}>
								{error?.message || 'This field is mandatory'}
							</FormHelperText>
						)}
					</FormControl>
				);
			}}
		/>
	);
};

MultiSelectEditField.defaultProps = {
	label: 'Multi-Select',
	value: [],
	helperText: '',
	checkmarks: false,
	name: 'multi-select',
	complex: false,
};

export default MultiSelectEditField;
