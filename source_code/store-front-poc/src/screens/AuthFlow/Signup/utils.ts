import utils from 'src/utils/utils';

export const transformValues = (values: Record<string, any>, pagesSection: string[], existingSections: string[]) => {
	let updatedValues = { ...values };

	// Structure contacts section if it exists in form settings
	if (existingSections.includes('contacts') && pagesSection.includes('contacts')) {
		const contactId = `temp_${crypto.randomUUID()}`;
		const country_code = `+${values.contacts?.phone?.slice(0, -10)}`;
		updatedValues = {
			...updatedValues,
			contacts: {
				primary_contact: contactId,
				values: [
					{
						id: contactId,
						country_code,
						...values.contacts,
					},
				],
			},
		};
	}

	// Structure addresses section if it exists in form settings
	if (existingSections.includes('addresses') && pagesSection.includes('addresses')) {
		updatedValues = {
			...updatedValues,
			addresses: {
				default_billing_address: values['addresses.default_billing_address'],
				default_shipping_address: values['addresses.default_shipping_address'],
				values: values.addresses,
			},
		};
	}

	return updatedValues;
};

export const includeSectionData = (finalData: any, sectionKey: string, formData: any, transformedData: any) => {
	switch (sectionKey) {
		case 'basic_details':
			if (formData.basic_details) {
				finalData.basic_details = formData.basic_details;
			}
			break;
		case 'contacts':
			if (formData.contacts) {
				finalData.contacts = formData.contacts;
			}
			break;
		case 'addresses':
			if (formData.addresses) {
				finalData.addresses = formData.addresses;
			}
			break;
		case 'other_details':
			if (transformedData.other_details) {
				finalData.other_details = {
					custom_attributes: transformedData.other_details?.custom_attributes || {},
				};
			}
			break;
		case 'attachments':
			if (transformedData.attachments) {
				finalData.attachments = transformedData.attachments;
			}
			break;
		case 'customer_type':
			if (transformedData.customer_type) {
				finalData.customer_type = transformedData.customer_type;
			}
			break;
		default:
			break;
	}
	return finalData;
};
export const format_address = (data: any) => {
	const updated_values = data?.values?.map((payload: any) => {
		if (payload?.phone) {
			const lastTenValues = payload?.phone?.slice(-10);
			const restValues = `+${payload?.phone?.slice(0, -10)}`;
			return {
				...payload,
				phone: lastTenValues,
				country_code: restValues,
			};
		}
		return payload;
	});

	return {
		...data,
		values: updated_values,
	};
};

export const format_details = (obj: any) => {
	if (obj?.attachments && Array.isArray(obj?.attachments)) {
		obj?.attachments.forEach((attachment: any) => {
			delete attachment.raw_data;
		});
	}
	return obj;
};

export const validation = {
	check_duplicate_lead: (data: any) => {
		return utils.request({
			url: '/users/v1/wizshop/check_duplicate_lead',
			method: 'POST',
			data,
		});
	},
};
