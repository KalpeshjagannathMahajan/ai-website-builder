import { TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { FieldInterface } from '../../FieldInterface';
import { useEffect } from 'react';

const DecimalEditField: React.FC<FieldInterface> = ({ field_key, name, refInput, handleChange, required, value, onError }) => {
	const {
		control,
		setValue,
		trigger,
		formState: { errors },
	} = useFormContext();

	const handleOnChange = (onChange: any, val: any) => {
		const parsedValue = val === '' ? NaN : parseFloat(value);
		onChange(parsedValue);
		if (handleChange) {
			handleChange(parsedValue);
		}
	};

	const handleOnError = (error: any) => {
		if (error && onError) {
			onError(error.message);
		}
	};

	useEffect(() => {
		setValue(field_key, value);
		trigger(field_key);
	}, [value, setValue, trigger, field_key]);

	const shouldShowError = errors[field_key];

	return (
		<Controller
			name={field_key}
			control={control}
			defaultValue={value || ''}
			rules={{
				required,
				pattern: {
					value: /^\d+(\.\d{1,2})?$/,
					message: 'Please enter a valid decimal number.',
				},
				validate: {
					NaN: (val) => {
						return isNaN(parseFloat(val)) ? 'Please enter a valid decimal number.' : true;
					},
				},
			}}
			render={({ field, fieldState: { error } }) => {
				handleOnError(error);
				return (
					<TextField
						{...field}
						id={field_key}
						label={name}
						required={required}
						type='number'
						inputRef={refInput}
						error={!!shouldShowError}
						helperText={shouldShowError ? error?.message : ''}
						onChange={(event) => handleOnChange(field.onChange, event.target.value)}
					/>
				);
			}}
		/>
	);
};

export default DecimalEditField;
