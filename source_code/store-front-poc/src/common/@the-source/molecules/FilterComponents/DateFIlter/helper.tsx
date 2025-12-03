import dayjs from 'dayjs';

export interface DateFilterProps {
	filterName: string;
	activeSelection?: any;
	filter_key: any;
	onUpdate: (val: string[]) => any;
}
export interface AccordionDateFilterProps {
	activeSelection?: any;
	filter_key: any;
	onUpdate: (val: string[]) => any;
}
export interface FilterState {
	from_date: any | null;
	to_date: any | null;
}

export const DATE_FORMAT = 'MM-DD-YYYY';
export const DATE_TIME_FORMAT = 'MM-DD-YYYY, h:mm a';
export const INVENTORY_ETA = 'inventory_eta';

export const empty_state = { from_date: null, to_date: null };
export const date_picker_props = {
	day: { sx: { fontSize: '14px' } },
	calendarHeader: { sx: { fontSize: '14px' } },
};
export const INVENTORY_ETA_OPTIONS: any = [
	{ label: 'Next 7 days', value: 'next_7_days' },
	{ label: 'Next 30 days', value: 'next_30_days' },
	{ label: 'Next 60 days', value: 'next_60_days' },
	{ label: 'Next 90 days', value: 'next_90_days' },
	{ label: 'No ETA', value: 'no_eta' },
	{ label: 'Select Custom', value: 'custom' },
];
export const DATE_OPTIONS: any = [
	{ label: 'Today', value: 'today' },
	{ label: 'Last week', value: 'last_week' },
	{ label: 'Last month', value: 'last_month' },
	{ label: 'Last 60 days', value: 'last_2_months' },
	{ label: 'Last 90 days', value: 'last_3_months' },
	{ label: 'Select Custom', value: 'custom' },
];

export const handle_get_value = (value: string) => {
	const today_date = dayjs().startOf('day').unix() * 1000;
	switch (value) {
		case 'no_eta':
			return [-1, -1];
		case 'last_week':
			return [dayjs().subtract(1, 'week').startOf('day').unix() * 1000, today_date];
		case 'last_month':
			return [dayjs().subtract(1, 'month').startOf('day').unix() * 1000, today_date];
		case 'last_2_months':
			return [dayjs().subtract(2, 'month').startOf('day').unix() * 1000, today_date];
		case 'last_3_months':
			return [dayjs().subtract(3, 'month').startOf('day').unix() * 1000, today_date];
		case 'next_7_days':
			return [today_date, dayjs().add(7, 'day').endOf('day').unix() * 1000];
		case 'next_30_days':
			return [today_date, dayjs().add(30, 'day').endOf('day').unix() * 1000];
		case 'next_60_days':
			return [today_date, dayjs().add(60, 'day').endOf('day').unix() * 1000];
		case 'next_90_days':
			return [today_date, dayjs().add(90, 'day').endOf('day').unix() * 1000];
		default:
			return [];
	}
};
