import _ from 'lodash';
import CustomText from 'src/common/@the-source/CustomText';

export const data_transform = (data_source: any) => {
	return data_source?.map((item: any) => {
		return {
			...item,
			channel: item?.channel?.label || '',
			event_name: item?.event_name?.label || '',
		};
	});
};

export const transform_unique_module = (events: any) => {
	const extract_module_name = _.map(events, 'module_name');
	const unique_module_name = _.uniq(extract_module_name);
	return unique_module_name;
};

export const table_columns = [
	{
		headerName: 'Email action',
		field: 'event_name',
		cellStyle: {},
		headerStyle: {},
		isVisible: true,
		dtype: 'text',
		hideFilter: true,
		width: 250,
	},
	{
		headerName: 'Channel',
		field: 'channel',
		cellStyle: {},
		headerStyle: {},
		isVisible: true,
		dtype: 'text',
		hideFilter: true,
	},
	{
		headerName: 'Email On',
		field: 'is_enable',
		cellStyle: {},
		headerStyle: {},
		isVisible: true,
		dtype: 'toggle',
		hideFilter: true,
	},
	{
		headerName: 'Default Trigger',
		field: 'is_auto_trigger',
		cellStyle: {},
		headerStyle: {},
		isVisible: true,
		cellRenderer: 'agCheckboxCellRenderer',
		cellEditor: 'agToggleCellEditor',
		hideFilter: true,
	},
];

export const frequency_options = [
	// { label: 'Seconds', value: '1' },
	// { label: 'Minutes', value: '60' },
	{ label: 'Hours', value: '3600' },
	{ label: 'Days', value: '86400' },
];
export const reminder_table_column = [
	{
		headerName: 'Email action',
		field: 'event_name',
		cellStyle: {},
		headerStyle: {},
		isVisible: true,
		dtype: 'text',
		hideFilter: true,
		width: 250,
		flex: 1,
	},
	{
		headerName: 'Frequency',
		field: 'delay_interval',
		cellStyle: {},
		headerStyle: {},
		isVisible: true,
		dtype: 'text',
		hideFilter: true,
		flex: 1,
		cellRenderer: (params: any) => {
			const unit = _.find(frequency_options, (item: any) => item?.value === params?.data?.delay_unit)?.label;
			const value = params?.data?.delay_value;
			// const value = _.find(frequency_options, (item: any) => item?.value === params?.value)?.label;
			// console.log(params?.data, value);
			return <CustomText>{`${value} ${unit}`}</CustomText>;
		},
	},
	{
		headerName: 'Email On',
		field: 'is_enable',
		cellStyle: {},
		headerStyle: {},
		isVisible: true,
		dtype: 'toggle',
		hideFilter: true,
		flex: 1,
	},
];

export const default_toast = { state: false, title: '', sub_title: '', type_status: 'success' };
export const reminder_description: any = {
	wizshop_reinvite_user:
		"The Invite User Email feature allows you to automatically send invitation emails to users who haven't signed up yet. You can set the timing for the reminders, and choose an email template that should be rolled out to the user.	",
	abandoned_cart:
		"The Abandoned Cart Email feature automatically sends reminder emails to users who have added items to their cart but haven't completed the purchase. You can set the timing for the reminders, and choose an email template that should be rolled out to the user",
};
