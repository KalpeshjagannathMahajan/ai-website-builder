import React, { useEffect, useState } from 'react';
import FormHelperText from '@mui/material/FormHelperText';
import { Autocomplete, TextField, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import apply_validations, { ValidationProps } from 'src/utils/apply_validations';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';

export interface SelectProps {
	label: string;
	value?: string;
	helperText?: string;
	options: any[];
	handleChange: (value: any) => any;
	name?: any;
	sx?: any;
	validations?: ValidationProps;
	type: any;
	setErrorState?: any;
	setTextValue?: any;
	onKeyDown?: any;
}

const SearchSelect = ({
	options,
	label,
	value,
	helperText,
	name,
	handleChange,
	setTextValue,
	setErrorState,
	type,
	sx,
	validations,
	onKeyDown,
	...rest
}: SelectProps) => {
	const [selectedValue, setSelectedValue] = useState<any>(null);
	// const [inputValue, setInputValue] = useState(value);

	const {
		control,
		formState: { errors },
		setValue,
		trigger,
	} = useFormContext();
	const fieldError = errors[name];

	const check_empty_value = () => {
		return fieldError !== undefined && fieldError?.ref?.value !== '';
	};

	useEffect(() => {
		setErrorState(check_empty_value());
	}, [fieldError]);

	const handleAutocompleteChange = (_event: any, newValue: any | null) => {
		if (typeof newValue === 'string') {
			setSelectedValue(newValue);
		} else if (newValue && newValue.inputValue) {
			setSelectedValue(newValue.inputValue);
		} else {
			setSelectedValue(newValue);
		}
		handleChange(newValue);
		trigger(name);
		setTextValue('');
		setErrorState(false);
		setValue(name, newValue, { shouldValidate: true });
	};

	const condition_check_on_enter_keydown = (reason: string, _value: string) => {
		return reason === 'reset' && !check_empty_value() && _.size(_value) > 1;
	};

	const handleInputChange = (_event: any, newInputValue: string, reason: any) => {
		setTextValue(newInputValue);
		handleChange(newInputValue);
		setSelectedValue(null);
		setValue(name, newInputValue, { shouldValidate: true });
		setErrorState(false);
		trigger(name);
		if (condition_check_on_enter_keydown(reason, newInputValue)) {
			onKeyDown(newInputValue);
		}
	};
	const theme: any = useTheme();

	return (
		<React.Fragment>
			<Autocomplete
				id='search-select-id'
				options={options}
				sx={{ ...sx }}
				inputValue={value}
				value={selectedValue}
				onChange={handleAutocompleteChange}
				onInputChange={handleInputChange}
				freeSolo
				renderInput={(params) => (
					<Controller
						name={name}
						control={control}
						rules={apply_validations({ label, name, ...validations })}
						render={({ field, fieldState: { error } }) => (
							<TextField
								{...params}
								{...field}
								type={type}
								error={!!error && value !== ''}
								value={value}
								helperText={error && value !== '' ? <Typography variant='body1'>{error?.message}</Typography> : ''}
								InputProps={{ sx: { borderRadius: theme?.form_elements_?.borderRadius } }}
								label={label}
								inputProps={{
									...params.inputProps,
								}}
							/>
						)}
					/>
				)}
				{...rest}
			/>
			<FormHelperText>{helperText}</FormHelperText>
		</React.Fragment>
	);
};

SearchSelect.defaultProps = {
	disabled: false,
	value: '',
	helperText: '',
	name: 'select',
};
export default SearchSelect;
