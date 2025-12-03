import { Controller, useFormContext } from 'react-hook-form';
import { FieldInterface } from '../../FieldInterface';
import { useEffect } from 'react';
import Icon from '../../../Icon/Icon';
import { InputAdornment, OutlinedInput } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface PriceEditFieldProps extends FieldInterface {
	handleChange?: (value: any) => void;
	startIcon: any;
}

const PriceEditField: React.FC<PriceEditFieldProps> = ({
	field_key,
	value,
	name,
	required,
	refInput,
	startIcon,
	handleChange,
	onError,
}) => {
	const {
		control,
		setValue,
		trigger,
		formState: { errors },
	} = useFormContext();
	const theme: any = useTheme();

	const handleOnChange = (onChange: any, val: any) => {
		// const formattedValue = formatValue(value);
		onChange(val);
		if (handleChange) {
			handleChange({ currency: '$', amount: parseInt(val) });
		}
	};

	useEffect(() => {
		setValue(field_key, value);
		trigger(field_key);
	}, [value, setValue, trigger, field_key]);

	const handleOnError = (error: any) => {
		if (error && onError) {
			onError(error.message);
		}
	};

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
					message: 'Please enter a valid Price.',
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
					<OutlinedInput
						inputRef={refInput}
						id='outlined-adornment'
						label={name}
						type='number'
						onChange={(event: any) => handleOnChange(field.onChange, event.target.value)}
						value={value}
						error={!!shouldShowError}
						startAdornment={
							startIcon && (
								<InputAdornment position='start'>
									<Icon iconName={startIcon} color={theme?.palette?.secondary[800]} />
								</InputAdornment>
							)
						}
					/>
				);
			}}
		/>
	);
};

export default PriceEditField;
