/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormControl, FormHelperText, InputLabel, MenuItem, Radio, Select, SelectProps } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import apply_validations, { ValidationProps } from 'src/utils/apply_validations';
import { CustomInput, Grid, Icon, Button } from 'src/common/@the-source/atoms';
import { manage_data_export_select_color } from 'src/utils/light.theme';
import { t } from 'i18next';
import NoOption from 'src/screens/CustomProduct/Components/NoOption';
import _ from 'lodash';
import utils from 'src/utils/utils';
import { useTheme } from '@mui/material/styles';

interface Props extends SelectProps {
	name: string;
	options?: any;
	label?: string;
	validations?: ValidationProps;
	refInput?: any;
	onChangeCapture?: any;
	defaultValue?: any;
	type?: any;
	displayRadioButton?: boolean;
	showSelector?: boolean;
	show_clear?: boolean;
	sort_option?: boolean;
}

const SelectEditField = ({
	name,
	refInput,
	label,
	validations,
	options,
	defaultValue,
	type,
	onChangeCapture,
	displayRadioButton = true,
	showSelector = false,
	show_clear = true,
	sort_option = true,
	...rest
}: Props) => {
	const {
		control,
		setValue,
		watch,
		formState: { errors },
		clearErrors,
	} = useFormContext();

	const current_theme: any = useTheme();
	const theme: any = useTheme();

	const [selected_value, set_selected_value] = useState(defaultValue || watch(name) || '');
	const [search_values, set_search_values] = useState(options || []);
	const [is_open, set_is_open] = useState(false);
	const [selected_value_array, set_selected_value_array] = useState<any>([]);

	useEffect(() => {
		set_search_values(options || []);
	}, [options]);

	useEffect(() => {
		set_selected_value(defaultValue);
	}, [defaultValue]);

	const sort_options = (selected_array: any, complete_array: any) => {
		// Add another props with meaningful name
		if (!displayRadioButton) {
			return;
		}
		const sortedArray = utils.get_sorted_array_on_selection(selected_array, complete_array, (item: any) => item?.label);
		set_search_values(sortedArray);
	};

	const handle_search = (search_string: string) => {
		const selectedFilterResult = utils.get_search_string_result(selected_value_array, search_string, (item: any) => item?.label);
		const filteredResult = utils.get_search_string_result(options, search_string, (item: any) => item?.label);
		sort_options(selectedFilterResult, filteredResult);
	};

	const handle_clear = () => {
		set_selected_value('');
		set_is_open(false);
	};

	useEffect(() => {
		onChangeCapture && onChangeCapture({ target: { value: selected_value, name } });
		if (selected_value) {
			clearErrors(name);
		}
		setValue(name, selected_value);
		set_selected_value_array(_.filter(options, (item) => item?.value === selected_value));
	}, [name, selected_value]);
	const getNestedValue = (_errors: any, path_name: string) => {
		return path_name?.split('.')?.reduce((acc, key) => acc && acc[key], _errors);
	};
	return (
		<Controller
			name={name}
			control={control}
			defaultValue={type === 'multi_select' ? selected_value || [] : selected_value}
			shouldUnregister={false}
			rules={apply_validations({ label, name, ...validations })}
			render={({ field, fieldState: { error } }) => {
				return (
					<FormControl style={{ width: '100%', margin: 1 }}>
						{label && (
							<InputLabel>
								{label}
								{validations?.required && '*'}
							</InputLabel>
						)}
						<Select
							{...field}
							open={is_open}
							onClose={() => set_is_open(false)}
							onOpen={() => {
								set_is_open(true);
								sort_option && sort_options(selected_value_array, options);
							}}
							multiple={type === 'multi_select'}
							value={watch(name) ? watch(name) : selected_value}
							inputRef={refInput}
							label={label}
							renderValue={(selected: any) => {
								const data = search_values?.filter((item: any) => item?.value === selected) || [];
								return <>{data[0]?.label}</>;
							}}
							{...rest}
							style={{ ...theme?.form_elements_ }}>
							<>
								{options?.length >= 7 && (
									<CustomInput
										size='small'
										fullWidth
										inputType='search'
										input_style={{ margin: '0rem 1rem' }}
										startIcon={<Icon iconName='IconSearch' color={current_theme?.palette?.secondary[800]} />}
										onChange={(e) => handle_search(e.target.value)}
										allowClear>
										{t('Common.FilterComponents.Search')}
									</CustomInput>
								)}
								<Grid sx={{ maxHeight: 300, overflowY: 'auto' }}>
									{_.isArray(search_values) &&
										(search_values?.length > 0 ? (
											search_values?.map(
												(item: any): JSX.Element => (
													<MenuItem
														key={item?.value}
														value={item?.value}
														style={{ background: showSelector && selected_value === item?.value ? manage_data_export_select_color : '' }}
														onClick={() => {
															set_selected_value(item?.value);
															set_is_open(false);
														}}>
														{displayRadioButton && <Radio checked={selected_value === item?.value} />}
														{item.label}
													</MenuItem>
												),
											)
										) : (
											<NoOption />
										))}
								</Grid>
								{!_.isEmpty(selected_value) && show_clear && (
									<Grid px={2} pt={1}>
										<Button fullWidth tonal onClick={handle_clear}>
											Clear
										</Button>
									</Grid>
								)}
							</>
						</Select>
						{(errors[name] || getNestedValue(errors, name)) && (
							<FormHelperText style={{ fontSize: '1.4rem', color: current_theme?.palette?.colors?.red }}>{error?.message}</FormHelperText>
						)}
					</FormControl>
				);
			}}
		/>
	);
};

export default SelectEditField;
