import utils from '../utils';

const storefront = {
	get_storefront_lead: () => {
		return utils.request({
			url: 'wizshop/v1/leads?status=open&limit=10',
			method: 'GET',
		});
	},
	get_storefront_lead_table: () => {
		return utils.request({
			url: 'wizshop/v1/leads',
			method: 'GET',
		});
	},
	get_storefront_leads_lead: (data: any) => {
		return utils.request({
			url: `wizshop/v1/leads/${data?.lead_id}`,
			method: 'GET',
		});
	},

	get_storefront_leads_buyer: (data: any) => {
		return utils.request({
			url: `wizshop/v1/leads/${data?.lead_id}/buyer`,
			method: 'GET',
		});
	},
	create_storefront_existing: (data: any) => {
		return utils.request({
			url: 'users/v1/wizshop/',
			method: 'POST',
			data,
		});
	},
	// /wizshop/v1/configuration/wizshop_leads_ssrm_settings
	// get_storefront_leads_ssrm: () => {
	// 	return utils.request({
	// 		url: `wizshop/v1/configuration/wizshop_leads_ssrm_settings`,
	// 		method: 'GET',

	// 	});
	// },
	get_storefront_leads_ssrm: () => {
		return utils.request({
			url: 'setting/v1/configuration/wizshop_leads_ssrm_settings',
			method: 'GET',
		});
	},
	update_storefront_lead: (data: any) => {
		return utils.request({
			url: 'wizshop/v1/leads',
			method: 'POST',
			data,
		});
	},
	reject_lead: (data: any) => {
		return utils.request({
			url: `wizshop/v1/leads/${data?.lead_id}`,
			method: 'DELETE',
			data,
		});
	},
	validate_token: (access_token: any) => {
		return utils.request({
			url: 'validate',
			method: 'GET',
			headers: {
				Authorization: access_token,
			},
		});
	},
	update_lead_status: (lead_id: string, type: string) => {
		return utils.request({
			url: `/wizshop/v1/leads/${lead_id}?type_of_customer=${type}`,
			method: 'PUT',
		});
	},
	// reject_lead: (data: any) => {
	// 	return utils.request({
	// 		url: 'wizshop/v1/leads/lead',
	// 		method: 'PUT',
	// 		data,
	// 	});
	// },
};

export default storefront;
