import { DatePicker, DateTimePicker, DesktopDateTimePicker, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Controller, useFormContext } from 'react-hook-form';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FieldInterface } from '../../FieldInterface';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import '../../style.css';

interface DatePickerProps extends FieldInterface {
	type: 'mobile' | 'desktop' | 'responsive';
	variant?: 'date' | 'date-time';
}

const DateEditField: React.FC<DatePickerProps> = ({ field_key, refInput, type, required, variant, value, handleChange }) => {
	const [isOpen, setIsOpen] = useState(true);
	const { control, setValue, trigger } = useFormContext();

	const dateTimeMap = {
		mobile: <MobileDateTimePicker />,
		responsive: <DateTimePicker />,
		desktop: <DesktopDateTimePicker />,
	};

	const handleOnChange = (onChange: any, val: any) => {
		let date = dayjs(val).format('YYYY-MM-DD');
		if (date === 'Invalid Date') {
			handleChange && handleChange(null);
		} else {
			handleChange && handleChange(date);
		}
		onChange(date);
	};

	useEffect(() => {
		setValue(field_key, value);
		trigger(field_key);
	}, [value, setValue, trigger, field_key]);

	if (variant === 'date') {
		return (
			<Controller
				name={field_key}
				control={control}
				defaultValue={value || ''}
				rules={{
					required,
				}}
				render={({ field }) => {
					return (
						<LocalizationProvider dateAdapter={AdapterDayjs}>
							<DatePicker
								{...field}
								open={isOpen}
								value={dayjs(value)}
								onChange={(val) => handleOnChange(field.onChange, val)}
								onClose={() => setIsOpen(false)}
								onOpen={() => setIsOpen(true)}
								inputRef={refInput}
							/>
						</LocalizationProvider>
					);
				}}
			/>
		);
	}

	return <LocalizationProvider dateAdapter={AdapterDayjs}>{dateTimeMap[type]}</LocalizationProvider>;
};

DateEditField.defaultProps = {
	variant: 'date',
};
export default DateEditField;
