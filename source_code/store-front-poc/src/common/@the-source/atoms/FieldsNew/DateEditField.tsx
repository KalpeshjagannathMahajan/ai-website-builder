import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import apply_validations, { ValidationProps } from 'src/utils/apply_validations';
import dayjs from 'dayjs';
import { useTheme } from '@mui/material/styles';
import timezone from 'dayjs/plugin/timezone';
import { colors } from 'src/utils/theme';
import { useSelector } from 'react-redux';
import { convert_date_to_utc } from 'src/utils/dateUtils';

dayjs.extend(timezone);

interface Props {
	name: string;
	label?: string;
	validations?: ValidationProps;
	refInput?: any;
	value?: any;
	defaultValue?: any;
	onChangeCapture?: any;
	disablePast?: boolean;
}

const DateEditField = ({ name, label, validations, defaultValue, onChangeCapture, disablePast = true, ...props }: Props) => {
	const tenant_timezone = useSelector((state: any) => state?.login?.userDetails?.timezone) || 'UTC';
	const [new_value, set_new_value] = useState(defaultValue);
	const { control, watch, setValue } = useFormContext();
	const theme: any = useTheme();

	const watched_value = watch(name);

	useEffect(() => {
		if (!defaultValue) setValue(name, '');
		else setValue(name, defaultValue); // update the form value on mount, as it's setting up today's date if defaultValue is falsy
	}, [defaultValue]);

	useEffect(() => {
		if (watched_value === new_value) return;
		set_new_value(watched_value);
	}, [watched_value]);

	const handle_change = (onChange: any, val: any) => {
		setValue(name, val);
		let date = convert_date_to_utc(val, tenant_timezone);
		if (date === 'Invalid Date') {
			onChange(null);
		} else {
			onChange(date);
		}
		let parsed_date: string | null = dayjs(val).format('MM/DD/YYYY');
		if (parsed_date === 'Invalid Date') {
			parsed_date = null;
		}
		if (onChangeCapture) onChangeCapture({ target: { name, value: parsed_date } });
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs}>
			<Controller
				name={name}
				control={control}
				defaultValue={defaultValue}
				rules={apply_validations({ label, name, ...validations })}
				render={({ field, fieldState: { error } }) => {
					return (
						<DatePicker
							sx={{ width: '100%', '& .MuiOutlinedInput-root': { ...theme?.form_elements_ } }}
							timezone={tenant_timezone}
							{...field}
							{...props}
							disablePast={disablePast}
							format='MM/DD/YYYY'
							inputFormat='MM-DD-YYYY'
							label={`${label}${validations?.required ? '*' : ''}`}
							value={field?.value ? dayjs(field?.value) : null}
							onChange={(val) => handle_change(field.onChange, val)}
							renderInput={(params: any) => <TextField {...params} label={label} />}
							slotProps={{
								day: { sx: { fontSize: '14px' } },
								calendarHeader: { sx: { fontSize: '14px' } },
								textField: {
									helperText: error ? <p style={{ color: colors.red }}>{error?.message}</p> : '',
								},
							}}
						/>
					);
				}}
			/>
		</LocalizationProvider>
	);
};

export default DateEditField;
