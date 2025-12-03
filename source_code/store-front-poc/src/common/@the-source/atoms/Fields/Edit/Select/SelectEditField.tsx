import { MenuItem, Select } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { FieldInterface } from '../../FieldInterface';
import { useEffect, useState } from 'react';

const SelectEditField: React.FC<FieldInterface> = ({
	field_key,
	value,
	name,
	required,
	refInput,
	style,
	options,
	handleChange,
	onError,
}) => {
	const {
		control,
		setValue,
		trigger,
		formState: { errors },
	} = useFormContext();
	const [isOpen, setIsOpen] = useState(true);

	const handleOnChange = (onChange: any, val: any) => {
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

	return (
		<Controller
			name={field_key}
			control={control}
			defaultValue={value || ''}
			rules={{
				required,
			}}
			render={({ field, fieldState: { error } }) => {
				handleOnError(error);
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
			}}
		/>
	);
};

export default SelectEditField;
