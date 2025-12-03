import { Controller, useFormContext } from 'react-hook-form';
import { MultiSelectFieldInterface } from '../../FieldInterface';
import { useEffect, useState } from 'react';
import { Box, Chip, MenuItem, Select } from '@mui/material';
import Icon from '../../../Icon/Icon';

const MultiSelectEditField: React.FC<MultiSelectFieldInterface> = ({
	options,
	value,
	field_key,
	name,
	complex,
	style,
	required,
	handleChange,
	onError,
}) => {
	const {
		control,
		setValue,
		trigger,
		formState: { errors },
	} = useFormContext();

	interface OptionProp {
		label: string;
		value: string;
	}

	const optionsTemp: Array<string> = complex
		? (options as OptionProp[]).map((option: OptionProp) => option.value)
		: (options as Array<string>);
	const [option, setOption] = useState<string[]>(value || []);

	const optionsMapping: Record<string, string> = complex
		? (options as OptionProp[]).reduce((acc, item) => {
				acc[item.value] = item.label;
				return acc;
		  }, {} as Record<string, string>)
		: {};

	const [isOpen, setOpen] = useState(true);

	const handleDelete = (onChange: any, event: React.MouseEvent, val: string) => {
		event.preventDefault();
		const updatedOptions = option?.filter((item) => item !== val);
		setOption(updatedOptions);
		onChange(updatedOptions);
		if (handleChange) {
			handleChange(updatedOptions);
		}
	};

	const handleMultiSelect = (onChange: any, val: any) => {
		// On autofill we get a stringified value.
		const selectedValue = typeof val === 'string' ? val.split(',') : val;
		setOption(selectedValue);
		onChange(val);
		if (handleChange) {
			handleChange(val);
		}
	};

	const handleOnError = (er: any) => {
		if (er && onError) {
			onError(er.message);
		}
	};

	useEffect(() => {
		setValue(field_key, value);
		trigger(field_key);
	}, [value, setValue, trigger, field_key]);

	const shouldShowError = errors[field_key];

	const displayValue = (item: string) => (complex ? optionsMapping[item] : item);

	return (
		<Controller
			name={field_key}
			control={control}
			defaultValue={value}
			rules={{
				required,
			}}
			render={({ field, fieldState: { error } }) => {
				handleOnError(error);
				return (
					<Select
						{...field}
						labelId='simple-select-label'
						multiple
						id='select-id'
						type='multiple'
						open={isOpen}
						onClose={() => setOpen(false)}
						onOpen={() => setOpen(true)}
						label={name}
						value={option}
						name={field_key}
						style={style}
						error={!!shouldShowError}
						onChange={(event) => handleMultiSelect(field.onChange, event.target.value)}
						renderValue={(selected) => (
							<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
								{selected.map((val) => (
									<Chip
										key={val}
										label={complex ? optionsMapping[val] : val}
										onDelete={(e) => handleDelete(field.onChange, e, val)}
										deleteIcon={<Icon iconName='IconX' fontSize='small' />}
									/>
								))}
							</Box>
						)}>
						{optionsTemp?.map(
							(item: any): JSX.Element => (
								<MenuItem key={item} value={item}>
									{displayValue(item)}
								</MenuItem>
							),
						)}
					</Select>
				);
			}}
		/>
	);
};

export default MultiSelectEditField;
