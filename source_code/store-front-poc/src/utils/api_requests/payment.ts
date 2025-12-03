import { MOCK_IDS } from '../mocks/mocks';
import utils from '../utils';

export const payments = {
	get_payment_methods: (buyer_id: string) => {
		return utils.request({
			url: `buyer/v1/account/payment_methods/${buyer_id}`,
			method: 'GET',
		});
	},

	collect_direct_payment: (data: any) => {
		return utils.request({
			url: 'payments/v1/collect/direct',
			data,
			method: 'POST',
		});
	},

	collect_payment: (data: any) => {
		return utils.request({
			url: '/payments/v1/collect',
			method: 'POST',
			data,
		});
	},

	get_payment_form: () => {
		return utils.request({
			url: 'setting/v1/configuration/tenant_or_default/payment_checkout_form',
			method: 'GET',
		});
	},
	update_payment_method: () => {
		return utils.request({
			url: 'payments',
			method: 'POST',
			data: {},
			// base: 'https://staging-salesrep.sourcerer.tech/',
			mock_id: MOCK_IDS.user_list,
			mock: true,
		});
	},
	get_transactions_ssrm_config: () => {
		return utils.request({
			url: 'payments/v1/ssrm/transactions/config',
			method: 'GET',
		});
	},
	get_transactions_ssrm_data: (payload: any) => {
		return utils.request({
			url: 'payments/v1/ssrm/transaction/search',
			method: 'POST',
			data: payload,
		});
	},

	get_recurring_payment_ssrm_config: () => {
		return utils.request({
			url: 'payments/recurring_payment/v1/ssrm/config',
			method: 'GET',
		});
	},
	get_recurring_payment_ssrm_data: (payload: any) => {
		return utils.request({
			url: 'payments/recurring_payment/v1/ssrm/search',
			method: 'POST',
			data: payload,
		});
	},

	create_recurring_payment: (payload: any) => {
		return utils.request({
			url: 'payments/recurring_payment/v1',
			method: 'POST',
			data: payload,
		});
	},

	create_recurring_payment_schedule: (payload: any) => {
		return utils.request({
			url: `payments/recurring_payment/v1/schedule?start_date=${payload?.start_date}&end_date=${payload?.end_date}&frequency=${payload?.frequency}&total_amount=${payload?.total_amount}`,
			method: 'GET',
		});
	},

	get_recurring_payment_form: () => {
		return utils.request({
			url: 'setting/v1/configuration/tenant_or_default/recurring_payment_form',
			method: 'GET',
		});
	},

	get_recurring_payment_details: (recurring_payment_id: string) => {
		return utils.request({
			url: `payments/recurring_payment/v1/${recurring_payment_id}`,
			method: 'GET',
		});
	},

	update_recurring_payment_details: (recurring_payment_id: string, payload: any) => {
		return utils.request({
			url: `payments/recurring_payment/v1/${recurring_payment_id}`,
			method: 'PUT',
			data: payload,
		});
	},
	get_pretoken_transaction: (payload: any, base_url: string = '', access_token: string = '') => {
		const url = `${base_url}/payments/v1/method/pretoken_transaction`;
		if (access_token && access_token !== '') {
			return utils.request({
				url,
				method: 'POST',
				data: payload,
				headers: {
					Authorization: access_token,
				},
			});
		}
		return utils.request({
			url: '/payments/v1/method/pretoken_transaction',
			method: 'POST',
			data: payload,
		});
	},
};
