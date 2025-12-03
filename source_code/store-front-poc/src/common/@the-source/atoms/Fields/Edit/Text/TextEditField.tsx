import { useEffect } from 'react';
import { TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { FieldInterface } from '../../FieldInterface';

interface TextEditFieldProps extends FieldInterface {
	compositeKey: any;
}
const TextEditField: React.FC<TextEditFieldProps> = ({
	field_key,
	value,
	name,
	compositeKey,
	required,
	refInput,
	rows,
	handleChange,
	onError,
}) => {
	const {
		control,
		setValue,
		trigger,
		formState: { errors },
	} = useFormContext();

	const handleOnChange = (onChange: any, val: any) => {
		onChange(val);
		if (handleChange) {
			handleChange(val);
		}
	};

	const handleOnError = (error: any) => {
		if (error && onError) {
			onError(error.message);
		}
	};

	useEffect(() => {
		setValue(field_key, value);
		trigger(field_key); // Trigger validation for the field
	}, [value, setValue, trigger, field_key]);

	const shouldShowError = errors[field_key];

	return (
		<Controller
			name={field_key}
			control={control}
			defaultValue={value || ''}
			rules={
				compositeKey === 'url'
					? {
							required,
							pattern: {
								value: /^(ftp|http|https):\/\/[^ "]+$/,
								message: 'Invalid URL format',
							},
					  }
					: {
							required,
							pattern: {
								value: /^[a-zA-Z ]*$/, // Only allows text characters and spaces
								message: 'Only text characters are allowed',
							},
					  }
			}
			render={({ field, fieldState: { error } }) => {
				handleOnError(error);
				return (
					<TextField
						{...field}
						inputRef={refInput}
						id={field_key}
						label={name}
						rows={rows}
						multiline
						required={required}
						error={!!shouldShowError}
						helperText={shouldShowError ? error?.message : ''}
						onChange={(event) => handleOnChange(field.onChange, event.target.value)}
					/>
				);
			}}
		/>
	);
};

export default TextEditField;
