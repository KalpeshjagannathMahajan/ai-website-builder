import _ from 'lodash';
import { isUUID } from 'src/screens/Settings/utils/helper';

export const transformData = (data: any) => {
	const transformed = {
		tax_info: {
			attribute_id: data?.key || 'Taxes',
			name: data?.name || 'Is Taxable',
			is_taxable: 'True',
			tax_rate: 8.25,
		},
	};

	data?.attributes?.forEach((attr: any) => {
		if (attr.id === 'is_taxable') {
			transformed.tax_info.is_taxable = attr?.value;
		} else if (attr.id === 'tax_rate') {
			transformed.tax_info.tax_rate = parseFloat(attr?.value);
		}
	});

	return data ? transformed?.tax_info : null;
};

export const clubAdditionals = (data: any) => {
	data.additional_field_values = _.pickBy(data, (value: any, key) => isUUID(key));
	data = _.omitBy(data, (value: any, key) => isUUID(key));
	return data;
};

export const wizshop_constants: any = {
	YET_TO_BE_INVITED: 'Yet to be invited',
	Invited: 'Invited',
	Active: 'Active',
	Inactive: 'Inactive',
};

export const format_card_number = (number: string) => {
	try {
		if (!number) return '--';
		return number.replace(/(\d{4})(?=\d)/g, '$1 '); // Adds a space after every 4 digits
	} catch (error) {
		console.error('Error formatting card number', error);
		return number; // Fallback: return the original number
	}
};
