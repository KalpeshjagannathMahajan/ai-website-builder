import api_requests from 'src/utils/api_requests';
import { DOCUMENT_END_STATUS } from '../../constants';

const get_document_details = async (document_id: any) => {
	try {
		const response = await api_requests.order_management.get_document_details({ document_id });

		return response;
	} catch (error: any) {
		throw new Error(`Failed to fetch document details: ${error.message}`);
	}
};

const get_document_setting = async (type: any) => {
	try {
		const response = await api_requests.order_management.get_document_setting(type);
		return response;
	} catch (error: any) {
		throw new Error(`Failed to fetch document setting: ${error.message}`);
	}
};

export const get_document_details_api = async (document_id: any, only_details_response = false) => {
	try {
		const response_details: any = await get_document_details(document_id);

		const document_status = response_details?.document_status;
		const document_attributes = response_details?.attributes;
		const document_end_status_flag = DOCUMENT_END_STATUS.includes(document_status);

		if (only_details_response) {
			return { document_status, document_end_status_flag, document_attributes };
		}
		const response_section: any = await get_document_setting(response_details?.type);
		const document_section = response_section;

		if (response_details && response_section) {
			return { document_status, document_end_status_flag, document_attributes, document_section };
		}
	} catch (error: any) {
		return { error: error.message };
	}
};
