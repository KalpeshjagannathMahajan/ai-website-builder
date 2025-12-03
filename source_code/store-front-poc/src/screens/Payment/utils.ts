import dayjs from 'dayjs';
import { isString } from 'lodash';
import payment_constants from './constants';
import { secondary } from 'src/utils/light.theme';

export const format_payment_schedule_date = (date: string) => {
	return isString(date) && dayjs(date, 'DD-MM-YYYY').isValid() ? dayjs(date, 'DD-MM-YYYY').format('MM/DD/YYYY') : 'Invalid Date';
};

export const recurring_payment_status_theme = (value: string) => {
	switch (value) {
		case 'Active':
		case 'Inactive':
		case 'Closed':
			return payment_constants.ssrm_constants.recurring_payment_status[value];
		default:
			return secondary[600];
	}
};
