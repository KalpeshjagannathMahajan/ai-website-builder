import utils from '../utils';
import { MOCK_IDS } from '../mocks/mocks';
import { DOC_SYNC_TYPES } from 'src/screens/OrderManagement/constants';
import { PaymentStatusPayload } from 'src/@types/common_types';

const order_management = {
	get_document_details: (data: any) => {
		return utils.request({
			url: 'document/v2/detail',
			method: 'POST',
			data,
			mock: false,
			mock_id: MOCK_IDS.get_document,
		});
	},
	get_product_list: (data: any) => {
		return utils.request({
			url: '/entity/v2/product/search',
			method: 'POST',
			data: { ...data },
		});
	},
	get_document_setting: (type: any) => {
		return utils.request({
			url: `document/v2/settings/${type}`,
			method: 'GET',
			mock: false,
		});
	},

	update_buyer_order_details: (data: any, type: any) => {
		return utils.request({
			url: `document/v2/buyers/update/${type}`,
			method: 'POST',
			data,
		});
	},

	update_document_attributes: (data: any, show_error = true) => {
		return utils.request({
			url: '/document/v3/update',
			method: 'POST',
			data,
			show_error,
		});
	},

	update_document_status: (action: any, data: any, show_error?: boolean) => {
		return utils.request({
			url: `/document/v3/${action}`,
			method: 'PUT',
			data,
			show_error,
		});
	},

	update_document_charge: (data: any) => {
		return utils.request({
			url: '/document/v3/charge',
			method: 'POST',
			data,
		});
	},
	remove_document_charge: (data: any) => {
		return utils.request({
			url: '/document/v3/charge',
			method: 'DELETE',
			data,
		});
	},

	get_wizshop_order_settings: (key: string) => {
		return utils.request({
			url: `wizshop/v1/configuration/${key}`,
			method: 'GET',
		});
	},

	update_buyer_cart: (data: any) => {
		return utils.request({
			url: '/cart/v3/attach/buyer',
			method: 'POST',
			data,
		});
	},
	get_order_summary: (tenant_id: any, document_id: any, file_type: string) => {
		let url = `/document/v3/order/${document_id}/${file_type}`;
		if (tenant_id) {
			url = `${url}?buyer_tenant_id=${tenant_id}`;
		}
		return utils.request({
			url,
			method: 'GET',
		});
	},
	get_order_summary_v2: (tenant_id: any, document_id: any, file_type: string) => {
		let url = `/document/v2/order/${document_id}/${file_type}`;
		if (tenant_id) {
			url = `${url}?buyer_tenant_id=${tenant_id}`;
		}
		return utils.request({
			url,
			method: 'GET',
		});
	},

	get_payment_config: (data: any) => {
		return utils.request({
			url: '/payments/v1/method/config?client_type=web',
			method: 'GET',
			data,
		});
	},
	get_payment_details: (data: any) => {
		return utils.request({
			url: '/payments/v1/checkout/form',
			method: 'POST',
			data,
		});
	},
	get_authorization_details: (data: any) => {
		return utils.request({
			url: '/payments/v1/authorization/form',
			method: 'POST',
			data,
		});
	},
	submit_details: (data: any) => {
		return utils.request({
			url: '/payments/v1/collect',
			method: 'POST',
			data,
		});
	},
	get_payment_status: (data: any) => {
		return utils.request({
			url: '/payments/v1/status',
			method: 'POST',
			data,
		});
	},
	get_document_status: (id: any) => {
		return utils.request({
			url: `/document/v3/${id}/status`,
			method: 'GET',
		});
	},
	add_card: (data: any, access_token: string = '', base_url: string = '', show_error = true) => {
		const url = `${base_url}/payments/v1/method/add`;
		if (access_token && access_token !== '') {
			return utils.request({
				url,
				method: 'POST',
				data,
				headers: {
					Authorization: access_token,
				},
			});
		} else {
			return utils.request({
				url,
				method: 'POST',
				data,
				show_error,
			});
		}
	},
	get_payment_table: (document_id: string) => {
		return utils.request({
			url: `document/v2/payment/${document_id}`,
			method: 'GET',
		});
	},
	get_refund_data: (data: any, show_custom_error_title = true) => {
		return utils.request({
			url: '/payments/v1/refund/form',
			method: 'POST',
			data,
			show_custom_error_title,
		});
	},
	submit_refund_details: (data: any) => {
		return utils.request({
			url: '/payments/v1/refund',
			method: 'POST',
			data,
		});
	},
	share_receipt: (data: any) => {
		return utils.request({
			url: 'payments/v1/share_receipt',
			method: 'POST',
			data,
		});
	},
	resend_payment_link: (data: any) => {
		return utils.request({
			url: 'payments/v1/share_payment_link',
			method: 'POST',
			data,
		});
	},
	download_receipt: (data: any) => {
		return utils.request({
			url: 'payments/v1/receipt/pdf',
			method: 'POST',
			data,
		});
	},
	get_wizpay_url: () => {
		return utils.request({
			url: 'payments/v1/stax/dashboard/url',
			method: 'GET',
		});
	},
	submit_add_credits_details: (data: any) => {
		return utils.request({
			url: '/payments/v1/wallet/load',
			method: 'POST',
			data,
		});
	},
	authorised_card: (data: any) => {
		return utils.request({
			url: '/payments/v1/authorize',
			method: 'POST',
			data,
		});
	},
	get_recomended_emails_for_buyers: (data: any) => {
		return utils.request({
			url: '/recommended/v2/emails',
			method: 'POST',
			data,
		});
	},
	send_emails_for_orders: (data: any) => {
		return utils.request({
			url: '/document/v3/emails',
			method: 'POST',
			data,
		});
	},
	sync_now: (data: any, type: string) => {
		let url = `/integrations/v1/entity/document/${type}`;
		if (type === DOC_SYNC_TYPES.PULL) {
			url += '/id';
		}
		return utils.request({
			url,
			method: 'POST',
			data,
		});
	},
	get_duplicate_document: (data: any) => {
		return utils.request({
			url: '/document/v3/duplicate_document',
			method: 'POST',
			data,
		});
	},
	get_fulfillment_form: () => {
		return utils.request({
			url: 'document/v3/fulfillment_status/form',
			method: 'GET',
		});
	},
	get_payment_status_form: () => {
		return utils.request({
			url: 'document/v3/payment_status/form',
			method: 'GET',
		});
	},
	update_fulfillment_status: (data: any) => {
		return utils.request({
			url: 'document/v3/fulfillment_status/update',
			method: 'PUT',
			data,
		});
	},
	update_payment_status: (data: PaymentStatusPayload) => {
		return utils.request({
			url: 'document/v3/payment_status/update',
			method: 'PUT',
			data,
		});
	},
	upload_signature: (document_id: string, data: any, config: any) => {
		return utils.request({
			...config,
			url: `/document/v3/${document_id}/signature`,
			method: 'POST',
			data,
		});
	},
	void_auth: (data: any) => {
		return utils.request({
			url: '/payments/v1/authorize/void',
			method: 'POST',
			data,
		});
	},
	get_email_config_info: (data: any) => {
		return utils.request({
			url: '/setting/v1/email_config/get_email_info',
			method: 'POST',
			data,
		});
	},
	get_dynamic_attribute_value: (document_id: string, attribute_id: string) => {
		return utils.request({
			url: `/document/v3/${document_id}/dynamic_attribute?attribute_id=${attribute_id}`,
			method: 'GET',
		});
	},
	get_document_tags: () => {
		return utils.request({
			url: '/document/v3/tags/document_status',
			method: 'GET',
		});
	},
};

export default order_management;
