import { TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { FieldInterface } from '../../FieldInterface';
import { useEffect } from 'react';

const NumberEditField: React.FC<FieldInterface> = ({ field_key, value, name, required, refInput, handleChange, onError }) => {
	const {
		control,
		setValue,
		trigger,
		formState: { errors },
	} = useFormContext();

	const handleOnChange = (onChange: any, val: any) => {
		onChange(parseInt(val));
		if (handleChange) {
			handleChange(parseInt(val));
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
					value: /^$|^[0-9]+$/,
					message: 'Please enter a valid number',
				},
				validate: {
					positiveNumber: (val) => {
						const numValue = parseInt(val);
						if (numValue < 0) {
							return 'Number must be greater than or equal to 0.';
						}
						if (isNaN(numValue)) {
							return 'Please enter a valid number';
						}
						return true;
					},
				},
			}}
			render={({ field, fieldState: { error } }) => {
				handleOnError(error);
				return (
					<TextField
						{...field}
						inputRef={refInput}
						id={field_key}
						label={name}
						required={required}
						type='number'
						error={!!shouldShowError}
						helperText={shouldShowError ? error?.message : ''}
						onChange={(event) => handleOnChange(field.onChange, event.target.value)}
					/>
				);
			}}
		/>
	);
};

export default NumberEditField;
