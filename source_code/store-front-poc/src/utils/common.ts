import _ from 'lodash';
import constants from './constants';
import { IconNames } from 'src/common/@the-source/atoms/Icon/baseTypes';
import { convert_date_to_timezone } from './dateUtils';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const validate_email = (email: string) => {
	return String(email)
		.toLowerCase()
		.match(
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
		);
};

export const sort_by_priority = (attributes: any[]): any[] | undefined => {
	return attributes?.sort((a, b) => a?.priority - b?.priority);
};

export const status_check = (): boolean => {
	const persistedUserString = localStorage.getItem('persist:root');
	if (persistedUserString) {
		const persistedUser = JSON.parse(persistedUserString);

		if (persistedUser && persistedUser.persistedUserData) {
			const userData = JSON.parse(persistedUser.persistedUserData);

			if (userData.auth_access_token === null) {
				return false;
			} else {
				return true;
			}
		}
	}

	return false;
};

// export const set_auth_cookies = (access_token: string, refresh_token: string): void => {
// 	document.cookie = `access_token=${access_token}; path=/; max-age=${60 * 60 * 24 * 7};`;
// 	document.cookie = `refresh_token=${refresh_token}; path=/; max-age=${60 * 60 * 24 * 30}`;
// };

export const cookies: string[] = document.cookie.split('; ');

// export const access_token = (): string => {
// 	const token = cookies.find((cookie) => cookie.startsWith('access_token='));
// 	return token ? token.split('=')[1] : '';
// };

// export const refresh_token = (): string => {
// 	const token = cookies.find((cookie) => cookie.startsWith('refresh_token='));
// 	return token ? token.split('=')[1] : '';
// };

export const remove_tokens = (): void => {
	document.cookie = 'access_token=; max-age=0; path=/;';
	document.cookie = 'refresh_token=; max-age=0; path=/;';
};

export const delete_all_cookies = (): void => {
	const cooky = document.cookie.split(';');
	for (let i = 0; i < cooky.length; i++) {
		const cookie = cooky[i];
		const eqPos = cookie.indexOf('=');
		const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
	}
};

export const update_object_by_id = (
	obj: Record<string, any> | null,
	id: string,
	updateFn: (obj: any) => any,
): Record<string, any> | null => {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}
	const newObj: Record<string, any> = {};
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			const value = obj[key];
			if (Array.isArray(value)) {
				newObj[key] = value.map((item) => update_object_by_id(item, id, updateFn));
			} else if (value && typeof value === 'object') {
				newObj[key] = update_object_by_id(value, id, updateFn);
			} else if (key === 'key' && value === id) {
				return updateFn(obj);
			} else {
				newObj[key] = value;
			}
		}
	}
	return newObj;
};

export const get_attributes = (item: any): { attribute_id: string; value: any }[] | undefined => {
	const values = Object.entries(item)?.map(([attribute_id, value]) => ({
		attribute_id,
		value,
	}));
	return values;
};

export const get_accounts_payload = (values: any): any => {
	const tabs = Object.keys(values);
	const payload: any = {};

	if (tabs.includes('basic_details')) {
		const attributesValues = get_attributes(values?.basic_details?.[0]);
		payload.basic_details = {
			attributes: attributesValues?.map((attr) => ({
				attribute_id: attr?.attribute_id,
				value: attr?.value,
			})),
		};
	}

	if (tabs.includes('contacts')) {
		payload.basic_details = {
			...payload.basic_details,
			contact: values?.contacts?.map((item: any) => {
				const attributesValues = get_attributes(item);
				return {
					attributes: attributesValues?.map((attr) => ({
						attribute_id: attr?.attribute_id,
						value: attr?.value,
					})),
				};
			}),
		};
	}

	if (tabs.includes('address')) {
		payload.address = values?.address?.map((item: any) => {
			const attributesValues = get_attributes(item);
			return {
				attributes: attributesValues?.map((attr) => ({
					attribute_id: attr?.attribute_id,
					value: attr?.value?.toString(),
				})),
			};
		});
	}

	if (tabs.includes('banking')) {
		payload.preferences = {
			...payload.preferences,
			banking: {
				attributes: values?.banking?.map((item: any) => {
					return {
						attribute_id: Object.keys(item).toString(),
						value: Object.values(item).toString(),
					};
				}),
			},
		};
	}

	if (tabs.includes('payments')) {
		const attributesValues = get_attributes(values?.payments?.[0]);
		payload.preferences = {
			...payload.preferences,
			payments: {
				attributes: attributesValues?.map((attr) => ({
					attribute_id: attr?.attribute_id,
					value: attr?.value,
				})),
			},
		};
	}

	if (tabs.includes('order_settings')) {
		const attributesValues = get_attributes(values?.order_settings?.[0]);
		payload.preferences = {
			...payload.preferences,
			order_setting: {
				attributes: attributesValues?.map((attr) => ({
					attribute_id: attr?.attribute_id,
					value: attr?.value,
				})),
			},
		};
	}

	if (tabs.includes('shipment_method')) {
		const attributesValues = get_attributes(values?.shipment_method?.[0]);
		payload.preferences = {
			...payload.preferences,
			shipment_method: {
				attributes: attributesValues?.map((attr) => ({
					attribute_id: attr?.attribute_id,
					value: attr?.value,
				})),
			},
		};
	}

	if (tabs.includes('terms')) {
		payload.preferences = {
			...payload.preferences,
			terms_conditions: {
				attributes: values?.terms?.map((item: any) => {
					return {
						attribute_id: Object.keys(item).toString(),
						value: Object.values(item).toString(),
					};
				}),
			},
		};
	}

	if (tabs.includes('otherDetails')) {
		const attributesValues = get_attributes(values?.otherDetails?.[0]);
		payload.other_details = {
			...payload.other_details,
			remarks: {
				attributes: attributesValues?.map((attr) => ({
					attribute_id: attr?.attribute_id,
					value: attr?.value,
				})),
			},
		};
	}

	return payload;
};

export const get_image_src = (id: string): string => {
	// eslint-disable-next-line no-undef
	return `${process.env.REACT_APP_CLOUDINARY}/${id}`;
};

export const get_fallback_src = (id: string): string => {
	// eslint-disable-next-line no-undef
	return `${process.env.REACT_APP_SOURCERER_BASEURL}/${id}`;
};

export const get_param = (key: string): string | null => {
	const urlParams = window.location.search;
	const params = new URLSearchParams(urlParams);
	return params.get(key);
};

export const get_initials = (name: string, max_chars: number): string => {
	const names = name?.trim()?.split(' ');
	// eslint-disable-next-line @typescript-eslint/no-shadow
	const initials = names?.map((name) => name?.charAt(0)?.toUpperCase());
	// if (max_chars) return initials?.join('');
	return initials?.join('')?.slice(0, max_chars);
};

export const currency_number_format_no_sym = (value: any) => {
	if (_.isNumber(value) || (_.isString(value) && !isNaN(parseFloat(value)))) {
		const numericValue = parseFloat(value as string);
		return _.isInteger(numericValue) ? numericValue : numericValue?.toFixed(2);
	} else {
		return value || 0;
	}
};

export const get_unit_price_of_product = (item: any) => {
	const volume_tiers = item?.pricing?.volume_tiers;
	const quantity = item.quantity;

	const price_obj = volume_tiers?.find((v: any) => {
		if (v.end_quantity === -1) return true;
		return quantity >= v.start_quantity && quantity <= v.end_quantity;
	});

	const default_price = item?.[item?.key]?.initial_price ?? item?.pricing?.price;
	let final_price;

	if (_.isEmpty(volume_tiers)) final_price = default_price;
	else {
		final_price = _.isEmpty(price_obj) ? 0 : price_obj?.price;
	}

	return {
		unit_price: final_price,
	};
};

export const isoToUnixTimestamp = (isoDate: string) => {
	const date = new Date(isoDate);
	return Math.floor(date.getTime() / 1000);
};

export const isoDateToMMDDYYYY = (isoDate: string) => {
	try {
		const dateObj = new Date(isoDate);
		if (!_.isNaN(dateObj.getDate())) {
			const month = String(dateObj.getMonth() + 1).padStart(2, '0');
			const day = String(dateObj.getDate()).padStart(2, '0');
			const year = dateObj.getFullYear();
			return `${month}/${day}/${year}`;
		} else {
			throw new Error('Invalid ISO date format');
		}
	} catch (error) {
		throw new Error('Invalid ISO date format');
	}
};

export const isoToDateDay = (isoDate: string, format: string = 'DD/MM/YY hh:mm A') => {
	if (!isoDate) return '--';
	const utc_format = dayjs.utc(isoDate).toDate();
	const formattedDate = convert_date_to_timezone(utc_format, format);
	if (formattedDate === 'Invalid date') return '--';
	return formattedDate || '';
};

export const formatNumberWithCommas = (str: string, showDecimal: boolean = false, removeMinus = false) => {
	try {
		let numberValue = parseFloat(str);
		if (isNaN(numberValue)) {
			throw new Error('Invalid number format.');
		}
		if (removeMinus) {
			numberValue = Math.abs(numberValue);
		}
		let options: Intl.NumberFormatOptions;
		if (showDecimal) {
			options = {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			};
		} else {
			options = {};
		}
		return new Intl.NumberFormat('en-US', options).format(numberValue);
	} catch (error: any) {
		console.error('Error formatting number:', error.message);
		return str;
	}
};

export const download_pdf = (url: string) => {
	const downloadLink = document.createElement('a');
	downloadLink.href = url;

	// Set the 'download' attribute to specify the file name
	downloadLink.setAttribute('download', 'tear_sheet.pdf');

	// Set the 'target' attribute to "_blank" to force download
	downloadLink.setAttribute('target', '_blank');

	// Trigger the click event to start the download
	document.body.appendChild(downloadLink);
	downloadLink.click();

	// Remove the anchor element from the DOM
	document.body.removeChild(downloadLink);
};

export const CARD_URLS: any = {
	visa: 'https://sourcerer.tech/assets/e3b36b47-fa6b-4526-839a-58bb5820ddc5',
	mastercard: 'https://sourcerer.tech/assets/2a35773c-3615-47de-a62a-1c722ba7561d',
	amex: 'https://sourcerer.tech/assets/3ad5f693-47a6-44e7-8f38-1546a8034d26',
	discover: 'https://sourcerer.tech/assets/bf0e684f-0638-4baf-8a03-0a57eca19880',
	american_express: 'https://sourcerer.tech/assets/3ad5f693-47a6-44e7-8f38-1546a8034d26', // 'american_express' key is returned from finix after tokenization
};

export const formattedValue = (value: any, field: any) => {
	if (field?.type === 'multi_select') {
		value = _.split(value, ',')
			.map((i: any) => _.find(field?.options, (opt: any) => opt.value === i)?.label)
			?.join(', ');
	} else if (field?.type === 'select' || field?.type === 'single_select') {
		value = _.find(field?.options, (opt: any) => _.toLower(opt?.value) === _.toLower(value))?.label;
	} else if (field?.type === 'date') {
		value = isoToDateDay(value, constants.DATE_FORMAT);
	}
	return value || '--';
};

export const check_truncation = (text: string, width: string, fontSize: string, lineHeight: string, maxLines: number) => {
	const textElement = document.createElement('span');
	textElement.textContent = text;
	textElement.style.display = 'inline-block'; // Temporarily make it inline-block to measure
	textElement.style.width = width; // Set the width to match your target element
	textElement.style.fontSize = fontSize; // Set font size
	textElement.style.lineHeight = lineHeight; // Set line height
	textElement.style.visibility = 'hidden'; // Make sure it's not visible
	textElement.style.position = 'absolute'; // Position absolutely to avoid affecting layout
	textElement.style.whiteSpace = 'nowrap'; // Disable wrapping to measure base line height

	document.body.appendChild(textElement);

	// Measure the height of a single line of text
	const singleLineHeight = textElement.offsetHeight;
	textElement.style.whiteSpace = ''; // Allow wrapping
	textElement.style.webkitBoxOrient = 'vertical';
	textElement.style.display = '-webkit-box';
	textElement.style.webkitLineClamp = String(maxLines); // Clamp to the max number of lines

	const isTruncated = textElement.scrollHeight > singleLineHeight * maxLines;
	document.body.removeChild(textElement);

	return isTruncated;
};

export const remove_item_from_session_storage = (key: string) => {
	sessionStorage.removeItem(key);
};

export const get_value_from_current_url = () => {
	const path = window.location.pathname;
	const parts = path.split('/');
	return _.last(parts);
};

export const remove_field_of_session_storage_item = (key: string, value: string) => {
	let params: any = sessionStorage.getItem(key);
	if (params) {
		try {
			params = JSON.parse(params);
			delete params[value];
			sessionStorage.setItem(key, JSON.stringify(params));
		} catch (err) {}
	}
};
export const get_field_of_session_storage_item = (key: string, value: string) => {
	let params: any = sessionStorage.getItem(key);
	if (params) {
		try {
			params = JSON.parse(params);
			return params[value];
		} catch (err) {}
	}
};

export const get_currency = (currency: string) => {
	switch (currency) {
		case 'CAD':
			return 'CAD';
		case 'EUR':
			return '€';
		case 'GBP':
			return '£';
		case 'INR':
			return '₹';
		case 'MXN':
			return '₱';
		case 'AED':
			return 'AED';
		case 'USD':
			return '$';
		case 'AUD':
			return 'AUD';
		default:
			return currency || '$';
	}
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const get_currency_icon = (_currency: string): IconNames => {
	return 'IconCurrencyDollar';
	// switch (get_currency(currency)) {
	// 	case 'CAD':
	// 		return 'IconCurrencyDollarCanadian';
	// 	case '€':
	// 		return 'IconCurrencyEuro';
	// 	case '£':
	// 		return 'IconCurrencyPound';
	// 	case '₹':
	// 		return 'IconCurrencyRupee';
	// 	case '₱':
	// 		return 'IconCurrencyPeso';
	// 	case 'AED':
	// 		return 'IconCurrencyDirham';
	// 	case '$':
	// 		return 'IconCurrencyDollar';
	// 	case 'AUD':
	// 		return 'IconCurrencyDollarAustralian';
	// 	default:
	// 		return 'IconCurrencyDollar';
	// }
};

export const get_formatted_price_with_currency = (currency_string: string, price: any) => {
	const currency = get_currency(currency_string);
	const final_price = currency_number_format_no_sym(price);
	const decimal_price = formatNumberWithCommas(final_price, final_price - Math.floor(final_price) > 0);

	if (['CAD', 'AED', 'AUD'].includes(currency)) return `${currency} ${decimal_price}`;

	return `${currency}${decimal_price}`;
};
