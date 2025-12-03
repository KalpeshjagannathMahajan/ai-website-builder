// import { MOCK_IDS } from '../mocks/mocks';
import _ from 'lodash';
import utils from '../utils';
export interface SSRMFilterModel {
	values?: string[];
	filterType?: string;
	customType?: string;
	filter?: string | number;
	filterTo?: string | number | null;
	type?: string;
}

export interface SSRMSortModel {
	colId: string;
	sort: string;
}

export interface SSRMSortModelDict {
	[key: string]: SSRMSortModel;
}

export interface SSRMFilterModelDict {
	[key: string]: SSRMFilterModel;
}

export interface SSRMInput {
	startRow: number;
	endRow: number;
	sortModel: SSRMSortModel[];
	filterModel: SSRMFilterModelDict;
}

const buyer = {
	get_buyer_dashboard: (id: string) => {
		return utils.request({
			url: `buyer/v1/account/dashboard/${id}`,
			method: 'GET',
			mock: false,
		});
	},
	get_buyer_list: ({ pageNumber = 1, pageSize = 15, searchValue = '', sortValue = [], signal = null }: any) => {
		return utils.request({
			url: 'buyer/v2/account/search',
			method: 'POST',
			data: {
				search: searchValue,
				filters: {},
				sort: sortValue,
				aggregate: false,
				page_number: pageNumber,
				page_size: pageSize,
			},
			signal,
		});
	},
	get_buyers_v1_list: () => {
		return utils.request({
			url: 'buyer/v1/account/search',
			method: 'POST',
			data: {
				search: '',
				filters: {},
				sort: [],
				aggregate: false,
				page_number: 1,
				page_size: 1000,
			},
		});
	},
	get_buyer_details: (id: string, show_error = true) => {
		return utils.request({
			url: `buyer/v1/account/details/${id}`,
			method: 'GET',
			show_error,
		});
	},
	get_quick_buyer_details_form: (method?: string) => {
		return utils.request({
			url: `buyer/v1/account/form/quick${method ? `?method=${method}` : ''}`,
			method: 'GET',
			mock: false,
			// mock_id: MOCK_IDS.mock_buyer,
		});
	},
	get_main_buyer_details_form: (method?: string) => {
		return utils.request({
			url: `buyer/v1/account/form/details${method ? `?method=${method}` : ''}`,
			method: 'GET',
			mock: false,
			// mock_id: MOCK_IDS.mock_buyer,
		});
	},
	update_buyer_details: (id: string, data: any, show_error = true) => {
		return utils.request({
			url: `buyer/v1/account/${id}`,
			method: 'PUT',
			data,
			show_error,
		});
	},

	add_buyer_address: (id: string, data: any) => {
		return utils.request({
			url: `buyer/v1/account/address/${id}`,
			method: 'POST',
			data,
		});
	},
	update_buyer_address: (id: string, data: any) => {
		return utils.request({
			url: `buyer/v1/account/address/${id}`,
			method: 'PATCH',
			data,
		});
	},
	add_buyer_contact: (id: string, data: any) => {
		return utils.request({
			url: `buyer/v1/account/contact/${id}`,
			method: 'POST',
			data,
		});
	},
	update_buyer_contact: (id: string, data: any) => {
		return utils.request({
			url: `buyer/v1/account/contact/${id}`,
			method: 'PATCH',
			data,
		});
	},
	add_image: (data: any, config: any = {}) => {
		return utils.request({
			...config,
			url: 'artifact/v1/upload',
			method: 'POST',
			data,
		});
	},
	check_field_duplicacy: (field_name: string, field_value: string, buyer_id?: any) => {
		let new_url = 'buyer/v2/account/check/duplicate';

		if (field_name) {
			new_url = `${new_url}?field_name=${field_name}&field_value=${encodeURIComponent(field_value?.trim())}`;
		}

		if (buyer_id) {
			new_url = `${new_url}&buyer_id=${buyer_id}`;
		}
		return utils.request({
			url: new_url,
			method: 'GET',
		});
	},

	upload_artifacts: (data: any) => {
		return utils.request({
			url: 'artifact/v1/upload',
			method: 'POST',
			data,
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	},
	add_buyer: (data: any, show_error = true) => {
		return utils.request({
			url: '/buyer/v1/account',
			method: 'POST',
			data,
			show_error,
		});
	},
	get_add_card_form: (data: any, access_token: string = '', base_url: string = '') => {
		const url = `${base_url}/payments/v1/method/form`;
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
			});
		}
	},
	edit_payment_card_address: (data: any, access_token: string = '', base_url: string = '') => {
		const url = `${base_url}/payments/v1/method/update`;
		if (access_token && access_token !== '') {
			return utils.request({
				url,
				method: 'PATCH',
				data,
				headers: {
					Authorization: access_token,
				},
			});
		} else {
			return utils.request({
				url,
				method: 'PATCH',
				data,
			});
		}
	},
	get_random_customer_id: (access_token: string = '', base_url: string = '') => {
		const url = `${base_url}/payments/v1/stax_customer/create`;
		if (access_token && access_token !== '') {
			return utils.request({
				url,
				method: 'POST',
				headers: {
					Authorization: access_token,
				},
			});
		} else {
			return utils.request({
				url,
				method: 'POST',
			});
		}
	},

	buyer_details: () => {
		return utils.request({
			url: 'settings/account',
			method: 'GET',
		});
	},
	buyer_dashboard: (params: any) => {
		return utils.request({
			url: 'settings/account',
			method: 'GET',
			params,
		});
	},
	get_Price_list: () => {
		return utils.request({
			url: 'entity/v1/product/price_list',
			method: 'GET',
		});
	},
	get_buyer_group: (id: string) => {
		return utils.request({
			url: `users/v1/customer/group/${id}`,
			method: 'GET',
		});
	},
	post_buyer_group: (data: any) => {
		return utils.request({
			url: 'users/v1/customer/group',
			method: 'PUT',
			data,
		});
	},
	get_buyer_group_listing: () => {
		return utils.request({
			url: '/users/v1/customer/group',
			method: 'GET',
		});
	},
	get_buyer_contact: ({ buyer_id }: any) => {
		return utils.request({
			url: `/users/v1/account/contacts/${buyer_id}`,
			method: 'GET',
		});
	},
	get_ssrm_config: () => {
		return utils.request({
			url: 'buyer/v1/ssrm/config',
			method: 'GET',
		});
	},
	get_ssrm_table: (data: SSRMInput) => {
		return utils.request({
			url: 'buyer/v1/ssrm/search',
			method: 'POST',
			data,
			response_array: true,
		});
	},

	get_buyer_filter_config: () => {
		return utils.request({
			url: 'setting/v1/configuration/buyer_filter_config_web',
			method: 'GET',
		});
	},
	get_country_states: (data: any, access_token: string = '', base_url: string = '') => {
		const url = `${base_url}/payments/v1/country_states`;
		if (access_token && access_token !== '') {
			return utils.request({
				url,
				method: 'POST',
				headers: {
					Authorization: access_token,
				},
				data,
			});
		} else {
			return utils.request({
				url,
				data,
				method: 'POST',
			});
		}
	},
	get_payment_config: (data: any, access_token: string = '', base_url: string = '') => {
		const url = `${base_url}/payments/v1/method/config?client_type=${_.isEmpty(access_token) ? 'web' : 'app'}`;
		if (access_token && access_token !== '') {
			return utils.request({
				url,
				method: 'GET',
				headers: {
					Authorization: access_token,
				},
				data,
			});
		} else {
			return utils.request({
				url,
				data,
				method: 'GET',
			});
		}
	},
	collect_direct_payment: (data: any, access_token: string = '', base_url: string = '') => {
		const url = `${base_url}/payments/v1/collect/direct`;
		if (access_token && access_token !== '') {
			return utils.request({
				url,
				method: 'POST',
				headers: {
					Authorization: access_token,
				},
				data,
			});
		} else {
			return utils.request({
				url,
				data,
				method: 'POST',
			});
		}
	},
	get_invoices_config: (signal?: any) => {
		return utils.request({
			url: 'invoice/v1/ssrm/config',
			method: 'GET',
			signal,
		});
	},
	get_payments_config: (signal?: any) => {
		return utils.request({
			url: 'payments/v1/ssrm/payment/config',
			method: 'GET',
			signal,
		});
	},
	get_presentations_listing_config: (signal?: any) => {
		return utils.request({
			url: 'presentations/v1/ssrm/config',
			method: 'GET',
			signal,
		});
	},
	get_credits_config: () => {
		return utils.request({
			url: 'payments/v1/ssrm/credit/config',
			method: 'GET',
		});
	},
	get_invoices_ssrm: (data: any, signal?: any) => {
		return utils.request({
			url: 'invoice/v1/ssrm/search',
			method: 'POST',
			data,
			signal,
		});
	},
	get_payments_ssrm: (data: any, signal?: any) => {
		return utils.request({
			url: 'payments/v1/ssrm/payment/search',
			method: 'POST',
			data,
			signal,
		});
	},
	get_presentations_ssrm: (data: any, signal?: any) => {
		return utils.request({
			url: 'presentations/v1/ssrm/search',
			method: 'POST',
			data,
			signal,
		});
	},
	get_credits_ssrm: (data: any) => {
		return utils.request({
			url: 'payments/v1/ssrm/credit/search',
			method: 'POST',
			data,
		});
	},
	submit_refund_credit_details: (data: any) => {
		return utils.request({
			url: 'payments/v1/refund/credits',
			method: 'POST',
			data,
		});
	},
	delete_buyer: (buyer_id: string) => {
		return utils.request({
			url: `/buyer/v1/account/delete/${buyer_id}`,
			method: 'DELETE',
		});
	},
	sync_buyer: (data: any) => {
		return utils.request({
			url: '/integrations/v1/entity/buyer/pull/id',
			method: 'POST',
			data,
		});
	},
	get_transaction_setup_id: (data: any, access_token?: string, base_url?: string) => {
		const url = `${base_url}/payments/v1/method/setup`;
		if (access_token && access_token !== '') {
			return utils.request({
				url,
				method: 'POST',
				headers: {
					Authorization: access_token,
				},
				data,
			});
		} else {
			return utils.request({
				url,
				data,
				method: 'POST',
			});
		}
	},
	get_pci_vault_secrets: (access_token?: string, base_url?: string) => {
		const url = `${base_url}/payments/v1/pci-vault/capture`;
		if (!_.isEmpty(access_token)) {
			return utils.request({
				url,
				method: 'GET',
				headers: {
					Authorization: access_token,
				},
			});
		} else {
			return utils.request({
				url,
				method: 'GET',
			});
		}
	},
	get_retrieval_token: (payment_method_id: string, access_token?: string, base_url?: string) => {
		const url = `${base_url}/payments/v1/pci-vault/retrieve/${payment_method_id}`;
		if (!_.isEmpty(access_token)) {
			return utils.request({
				url,
				method: 'GET',
				headers: {
					Authorization: access_token,
				},
			});
		} else {
			return utils.request({
				url,
				method: 'GET',
			});
		}
	},
};

export default buyer;
