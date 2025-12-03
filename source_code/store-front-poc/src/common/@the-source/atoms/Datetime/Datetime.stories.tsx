import { Meta, StoryObj } from '@storybook/react';

import DateTime from './Datetime';

export default {
	title: 'Components/DateTime',
	component: DateTime,
} as Meta<typeof DateTime>;

export const DatePicker: StoryObj = {
	render: (args) => <DateTime type='desktop' variant='date' label='Date Picker' {...args} />,
};

export const DesktopDateTimePicker: StoryObj = {
	render: (args) => <DateTime variant='date' label='Date Time Picker - Desktop' type='desktop' {...args} />,
};

export const DisableFutureDates: StoryObj = {
	render: (args) => <DateTime label='Date Time Picker - Desktop' variant='date' disableFuture type='desktop' {...args} />,
};

export const DisablePastDates: StoryObj = {
	render: (args) => <DateTime label='Date Time Picker - Desktop' variant='date-time' disablePast type='desktop' {...args} />,
};

export const MobileDateTimePicker: StoryObj = {
	render: (args) => <DateTime label='Date Time Picker - Mobile' variant='date-time' type='mobile' {...args} />,
};
export const ResponsiveDateTimePicker: StoryObj = {
	render: (args) => <DateTime variant='date-time' label='Date Time Picker - Responsive' type='responsive' {...args} />,
};
