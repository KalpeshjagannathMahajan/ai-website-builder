import dayjs from 'dayjs';
import dompurify from 'dompurify';
import { convert_date_to_timezone } from 'src/utils/dateUtils';
import constants from '../../../../../utils/constants';

const formatValueByDtype = (dtype: string) => {
	const valueFormatters: { [key: string]: (params: any) => any } = {
		date: (params) => {
			// const isValid = moment(params?.value).isValid();
			// if (!isValid) return '';
			// const utc_format = moment.utc(params?.value).toDate();
			// const format = params?.colDef?.format || constants.ATTRIBUTE_DATE_FORMAT;
			// const date = moment(utc_format).local().format(format);
			// return date;
			const isValid = params?.value ? dayjs(params?.value).isValid() : false;

			if (!isValid) return '--';
			const format = params?.colDef?.format || constants.ATTRIBUTE_DATE_FORMAT;
			const date = convert_date_to_timezone(params?.value, format);
			return date;
		},
		html: (params) => {
			const strippedText = params?.value.replace(/<[^>]+>/g, '');
			const isContentEmpty = strippedText.trim() === '';
			dompurify.sanitize(params.value);
			if (isContentEmpty) {
				return true;
			} else {
				return false;
			}
		},
		multiSelect: (params) => {
			let val = params.value;
			if (val) {
				const convertedString = val.join(',');
				return (params.formattedValue = convertedString);
			} else {
				return (params.formattedValue = []);
			}
		},
		category: (params) => {
			if (params.value) {
				const convertedString = params.value?.map((item: any) => `${item}`).join(',');
				return convertedString;
			} else {
				return (params.formattedValue = '');
			}
		},
		decimal: (params) => {
			return params.value >= 0 || params.value ? parseInt(params.value) : '';
		},
		number: (params) => {
			return params?.value ? (params.value >= 0 || params.value ? parseInt(params.value) : '--') : '--';
		},
		price: (params) => {
			let { amount, currency } = params?.value;
			if (!amount) {
				return { amount: '', currency };
			}
			const priceString = amount.toFixed(2);
			const parts = priceString.split('.');
			parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
			return { amount: parts.join('.'), currency };
		},
		text: (params) => {
			if (params.value) {
				const convertedString = params.value;
				return convertedString;
			} else {
				return (params.formattedValue = '');
			}
		},
		default: (params) => {
			return params.value || '';
		},
	};

	return valueFormatters[dtype] || valueFormatters.default;
};

export default formatValueByDtype;
