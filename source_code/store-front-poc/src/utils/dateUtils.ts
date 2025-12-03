import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import i18next from 'i18next';
import constants from 'src/utils/constants';
import _ from 'lodash';
import store from 'src/store';
import { get_default_timezone } from './utils';

dayjs.extend(utc);
dayjs.extend(timezone);

export const get_last_synced_msg = (timestamp: string) => {
	try {
		if (!timestamp) throw new Error('Invalid timestamp');

		const local_time = dayjs.utc(timestamp).tz(dayjs.tz.guess());
		if (!local_time.isValid()) throw new Error('Invalid date');

		const synced_time = local_time.format(constants.TIME_FORMATS.HOUR_12);
		const synced_date = local_time.format(constants.CUSTOM_DATE_FORMATS.MM_DD_YYYY);
		return i18next.t('OrderManagement.OrderEndStatusInfoContainer.LastSyncedAt', {
			synced_time,
			synced_date,
		});
	} catch (error: any) {
		console.error(error?.message);
		return null;
	}
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const convert_date_to_timezone = (time: any, format?: string, time_zone_param?: string) => {
	const local_time = get_default_timezone();
	const time_zone = !_.isEmpty(time_zone_param) ? time_zone_param : _.get(store.getState(), 'login.userDetails.timezone', '') || local_time;
	const timezone_format = format || constants.ATTRIBUTE_DATE_FORMAT;
	try {
		const date = dayjs.utc(time).tz(time_zone);
		if (!date.isValid()) throw new Error('Invalid date');
		return date.format(timezone_format);
	} catch (error: any) {
		return 'Invalid Date';
	}
};

export const convert_date_to_utc = (datetime: any, tenant_timezone: string, format = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]') => {
	return dayjs.tz(datetime, tenant_timezone).startOf('day').utc().format(format);
};
