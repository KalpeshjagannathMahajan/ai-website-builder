import { MenuItem, Select, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { FieldInterface } from '../../FieldInterface';
import { useEffect, useState } from 'react';

interface PriceEditFieldProps extends FieldInterface {
	compositeKey: any;
}

const SizeEditField: React.FC<PriceEditFieldProps> = ({
	field_key,
	name,
	refInput,
	handleChange,
	onError,
	required,
	options,
	style,
	value,
	compositeKey,
}) => {
	const {
		control,
		setValue,
		trigger,
		formState: { errors },
	} = useFormContext();
	const [isOpen, setIsOpen] = useState(true);

	const handleOnChange = (onChange: any, val: any) => {
		if (compositeKey !== 'unit') {
			val = parseInt(val);
		}
		handleChange && handleChange(val);
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
		trigger(field_key);
	}, [value, setValue, trigger, field_key]);
	const shouldShowError = errors[field_key];

	//   const errorMessage = shouldShowError ? errors[field_key]?.message?.toString() : '';

	// eslint-disable-next-line @typescript-eslint/no-shadow
	const handleRenderFields = (compositeKey: any, field: any, error: any) => {
		if (compositeKey === 'unit') {
			return (
				<Select
					{...field}
					open={isOpen}
					onClose={() => setIsOpen(false)}
					style={style}
					onOpen={() => setIsOpen(true)}
					inputRef={refInput}
					id={field_key}
					label={name}
					required={required}
					error={!!shouldShowError}
					onChange={(event) => handleOnChange(field.onChange, event.target.value)}>
					{options?.map(
						(item: any): JSX.Element => (
							<MenuItem value={item.value}>{item.label}</MenuItem>
						),
					)}
					{/* {shouldShowError && <span style={{ color: 'red' }}>{errorMessage}</span>} */}
				</Select>
			);
		} else {
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
		}
	};

	return (
		<Controller
			name={field_key}
			control={control}
			defaultValue={value || ''}
			rules={
				compositeKey === 'unit'
					? { required }
					: {
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
					  }
			}
			render={({ field, fieldState: { error } }) => {
				handleOnError(error);
				return <>{handleRenderFields(compositeKey, field, error)}</>;
			}}
		/>
	);
};

export default SizeEditField;
