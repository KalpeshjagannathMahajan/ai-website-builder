import { useState, useEffect } from 'react';
import { BaseTextFieldProps, InputAdornment, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import apply_validations, { ValidationProps } from 'src/utils/apply_validations';
import Icon from '../Icon';
import Grid from '../Grid';
import utils from 'src/utils/utils';

interface Props extends BaseTextFieldProps {
	name: string;
	label?: string;
	validations?: ValidationProps;
	refInput?: any;
	autoFocus?: boolean;
}

const PercentageEditField = ({ name, validations, label = '', refInput, autoFocus, type, defaultValue, ...rest }: Props) => {
	const { setValue, watch, control } = useFormContext();
	const val = watch(name);
	const [inputValue, setInputValue] = useState<number | string>(val || defaultValue);

	const handle_blur = (event: any, field: any) => {
		const value = event?.target?.value;
		let formattedValue = utils.extract_decimal_number(value);
		setInputValue(formattedValue);
		setValue(field.name, formattedValue);
		field.onBlur();
	};
	const handle_change = (event: any, field: any) => {
		const value = event.target.value;
		if (value.includes('e') || value.includes('E') || value.includes('-')) {
			event.preventDefault();
		}
		let numValue = utils.extract_decimal_number(value);
		if (numValue <= 0 || numValue > 100) {
			numValue = 0;
		}

		setInputValue(numValue);
		field.onChange(numValue);
	};

	useEffect(() => {
		setInputValue(val !== undefined ? val : defaultValue);
	}, [val, defaultValue]);

	useEffect(() => {
		setValue(name, parseFloat(inputValue as string));
	}, [inputValue, setValue, name]);

	return (
		<Grid md={6}>
			<Controller
				name={name}
				control={control}
				defaultValue={defaultValue}
				rules={apply_validations({ label, name, ...validations })}
				render={({ field, fieldState: { error } }) => (
					<TextField
						{...field}
						value={inputValue === null ? '' : inputValue}
						InputProps={{
							endAdornment: (
								<InputAdornment position='end' sx={{ cursor: 'pointer' }}>
									<Icon
										iconName='IconPercentage'
										color='#16885F'
										sx={{
											height: '30px',
											width: '28px',
											paddingY: 1.6,
											paddingLeft: 1.2,
											borderLeft: '1px solid #D1D6DD',
										}}
									/>
								</InputAdornment>
							),
						}}
						style={{
							backgroundColor: 'white',
						}}
						autoFocus={autoFocus}
						inputRef={refInput}
						label={label + (validations?.required ? '*' : '')}
						error={!!error}
						InputLabelProps={{ shrink: true }}
						helperText={error ? error?.message : ''}
						inputProps={{
							pattern: '^[0-9]*[.,]?[0-9]{0,2}$',
							type: 'text',
						}}
						onBlur={(e) => handle_blur(e, field)}
						onChange={(e) => handle_change(e, field)}
						{...rest}
					/>
				)}
			/>
		</Grid>
	);
};

export default PercentageEditField;
