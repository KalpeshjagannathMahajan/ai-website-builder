import {
	DatePicker,
	DateTimePicker,
	// DateTimePickerProps,
	DesktopDateTimePicker,
	MobileDateTimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// type SVGIconBase = Pick<DateTimePickerProps<T>, 'defaultValue'>;

export interface DatePickerProps {
	type: 'mobile' | 'desktop' | 'responsive';
	label?: string;
	disableFuture?: boolean;
	disablePast?: boolean;
	variant?: 'date' | 'date-time';
}

const DateTime = ({ type, variant, ...rest }: DatePickerProps) => {
	const dateTimeMap = {
		mobile: <MobileDateTimePicker {...rest} />,
		responsive: <DateTimePicker {...rest} />,
		desktop: <DesktopDateTimePicker />,
	};

	if (variant === 'date') {
		return (
			<LocalizationProvider dateAdapter={AdapterDayjs}>
				<DatePicker {...rest} />
			</LocalizationProvider>
		);
	}

	return <LocalizationProvider dateAdapter={AdapterDayjs}>{dateTimeMap[type]}</LocalizationProvider>;
};

DateTime.defaultProps = {
	label: 'Date Picker',
	disableFuture: false,
	disablePast: false,
	variant: 'date',
};
export default DateTime;
