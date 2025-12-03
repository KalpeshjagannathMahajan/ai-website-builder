// import { MOCK_IDS } from '../mocks/mocks';
import utils from '../utils';

export const user_management = {
	get_users_list: () => {
		return utils.request({
			url: 'users/v1/list',
			method: 'GET',
			data: {},
			// base: 'https://staging-salesrep.sourcerer.tech/',
			// mock_id: MOCK_IDS.user_list,
			// mock: true,
		});
	},
	get_users_reportee_list: () => {
		return utils.request({
			url: 'users/v2/list',
			method: 'GET',
			data: {},
			// base: 'https://staging-salesrep.sourcerer.tech/',
			// mock_id: MOCK_IDS.user_list,
			// mock: true,
		});
	},
	get_roles_list: () => {
		return utils.request({
			url: 'users/v1/role/ssrm',
			method: 'POST',
			data: {},
			// base: 'https://staging-salesrep.sourcerer.tech/',
			// mock_id: MOCK_IDS.user_list,
			// mock: true,
		});
	},
	get_roles_list_ssrm: () => {
		return utils.request({
			url: 'users/v1/role/ssrm',
			method: 'POST',
			data: {},
		});
	},
	get_user_roles_meta_data: (role_id: string) => {
		return utils.request({
			url: `users/v1/role/meta_data/${role_id}`,
			method: 'GET',
			data: {},
		});
	},
	get_add_user_form_fields: () => {
		return utils.request({
			url: 'users/v1/form',
			method: 'GET',
			data: {},
			// base: 'https://staging-salesrep.sourcerer.tech/',
		});
	},
	get_edit_user_form_fields: (id: string) => {
		return utils.request({
			url: `users/v1/details/${id}`,
			method: 'GET',
			data: {},
			// base: 'https://staging-salesrep.sourcerer.tech/',
			// mock_id: MOCK_IDS.add_user_form,
			// mock: true,
		});
	},
	post_add_user: (data: any) => {
		return utils.request({
			url: '/users/v1',
			method: 'POST',
			data: { ...data },
			// base: 'https://staging-salesrep.sourcerer.tech/',
		});
	},
	put_update_user: (id: string, data: any) => {
		return utils.request({
			url: `/users/v1/${id}`,
			method: 'PATCH',
			data: { ...data },
			// base: 'https://staging-salesrep.sourcerer.tech/',
		});
	},
	get_add_role_form_fields: () => {
		return utils.request({
			url: '/users/v1/role/form',
			method: 'GET',
			data: {},
			// base: 'https://staging-salesrep.sourcerer.tech/',
		});
	},
	get_edit_role_form_fields: (id: string) => {
		return utils.request({
			url: `/users/v1/role/details/${id}`,
			method: 'GET',
			data: {},
			// base: 'https://staging-salesrep.sourcerer.tech/',
		});
	},
	put_edit_role_form: (id: string, data: any) => {
		return utils.request({
			url: `/users/v1/role/${id}`,
			method: 'PATCH',
			data: { ...data },
			// base: 'https://staging-salesrep.sourcerer.tech/',
		});
	},
	post_add_role: (data: any) => {
		return utils.request({
			url: '/users/v1/role',
			method: 'POST',
			data: { ...data },
			// base: 'https://staging-salesrep.sourcerer.tech/',
		});
	},
	get_roles_option: () => {
		return utils.request({
			url: '/users/v1/role/list',
			method: 'POST',
			data: {},
		});
	},
	get_reporting_manager_list: (data: any) => {
		return utils.request({
			url: '/users/v1/reporting/managers',
			method: 'POST',
			data,
		});
	},
	get_reportees_list: (data: any) => {
		return utils.request({
			url: '/users/v1/reporting/reportees',
			method: 'POST',
			data,
		});
	},
	get_product_catalogs: () => {
		return utils.request({
			url: '/entity/v2/product/catalog_list',
			method: 'GET',
		});
	},
	deactivating_user: (data: any) => {
		return utils.request({
			url: '/users/v1/user-deactivate/deactivate',
			method: 'POST',
			data,
		});
	},
	get_reset_password_link: (data: any) => {
		return utils.request({
			url: '/users/v1/get_password_reset_link',
			method: 'POST',
			data,
		});
	},
};
