import utils from '../utils';
const { VITE_APP_REPO } = import.meta.env;

const settings = {
	get_configuration: (key: string, is_pre_login?: boolean): any => {
		let url = is_pre_login ? `wizshop/v1/configuration/${key}` : `setting/v1/configuration/${key}`;
		return utils.request({
			url,
			method: 'GET',
		});
	},
	post_configuration: (key: string, data: any): any => {
		return utils.request({
			url: `setting/v1/configuration/${key}`,
			method: 'POST',
			data,
		});
	},
	get_keys: () => {
		return utils.request({
			url: 'setting/v1/configuration/list_keys',
			method: 'GET',
		});
	},
	update_setting: (data: any) => {
		return utils.request({
			url: 'setting/v1/configuration',
			method: 'POST',
			data,
		});
	},
	update_setting_bulk: (data: any) => {
		return utils.request({
			url: 'setting/v1/configuration/bulk',
			method: 'POST',
			data,
		});
	},
	update_attribute: (data: any) => {
		return utils.request({
			url: 'org-settings/v1/attribute/',
			method: 'POST',
			data: {
				meta: data,
			},
		});
	},
	delete_attribute: ({ entity, attribute_id }: any) => {
		return utils.request({
			url: `org-settings/v1/attribute/${entity}/${attribute_id}`,
			method: 'DELETE',
		});
	},
	get_general_settings: () => {
		return utils.request({
			url: 'org-settings/v1/pdf/general-settings',
			method: 'GET',
		});
	},
	update_general_settings: (data: any) => {
		return utils.request({
			url: 'org-settings/v1/pdf/general-settings',
			method: 'PUT',
			data,
		});
	},
	get_templates: (type: string) => {
		return utils.request({
			url: `org-settings/v1/pdf/template/${type}`,
			method: 'GET',
		});
	},
	get_excel_templates: (type: string) => {
		return utils.request({
			url: `org-settings/v1/excel/template?entity=${type}`,
			method: 'GET',
		});
	},
	add_update_template: (data: any, method: string) => {
		return utils.request({
			url: 'org-settings/v1/pdf/template',
			method,
			data,
		});
	},
	add_excel_template: (data: any) => {
		return utils.request({
			url: 'org-settings/v1/excel/template/upload',
			method: 'POST',
			data,
		});
	},
	update_excel_template: (data: any) => {
		return utils.request({
			url: 'org-settings/v1/excel/template',
			method: 'PUT',
			data,
		});
	},
	get_attributes_entity: (type: string) => {
		return utils.request({
			url: `org-settings/v1/attribute/${type}`,
			method: 'GET',
		});
	},
	get_attributes: (type: string) => {
		return utils.request({
			url: `org-settings/v1/pdf/template/common-details/${type}`,
			method: 'GET',
		});
	},
	update_attributes: (data: any) => {
		return utils.request({
			url: 'org-settings/v1/pdf/template/all',
			method: 'PUT',
			data,
		});
	},
	update_bulk_attribute: () => {
		return utils.request({
			url: 'org-settings/v1/pdf/general-settings',
			method: 'GET',
		});
	},
	get_all_attributes: (entity: any) => {
		return utils.request({
			url: `org-settings/v1/attribute/${entity}`,
			method: 'GET',
		});
	},
	get_super_set: () => {
		return utils.request({
			url: 'setting/v1/configuration/tenant_or_default/org_setting_super_set',
			method: 'GET',
		});
	},
	get_containers_data: () => {
		return utils.request({
			url: 'setting/v1/configuration/tenant_or_default/cart_container_config',
			method: 'GET',
		});
	},
	get_inventory_icon: () => {
		const is_storefront = VITE_APP_REPO === 'store_front';
		const url = is_storefront
			? 'wizshop/v1/configuration/wizshop_inventory_i_button_settings'
			: 'setting/v1/configuration/tenant_or_default/inventory_i_button_settings';
		return utils.request({
			url,
			method: 'GET',
		});
	},
	get_default_tenant_config: (key: string, access_token?: string, base_url?: string) => {
		if (access_token && base_url) {
			return utils.request({
				url: `${base_url}/setting/v1/configuration/tenant_or_default/${key}`,
				method: 'GET',
				headers: {
					Authorization: access_token,
				},
			});
		} else {
			return utils.request({
				url: `setting/v1/configuration/tenant_or_default/${key}`,
				method: 'GET',
			});
		}
	},
	get_product_card_config: () => {
		return utils.request({
			url: 'setting/v1/configuration/tenant_or_default/product_card_config',
			method: 'GET',
		});
	},
	get_all_card_config: () => {
		return utils.request({
			url: 'setting/v1/configuration/tenant_or_default/card_template_setting',
			method: 'GET',
		});
	},
	get_labels: () => {
		return utils.request({
			url: 'org-settings/v1/label/template',
			method: 'GET',
		});
	},

	update_labels: (data: any) => {
		return utils.request({
			url: 'org-settings/v1/label/template',
			method: 'PUT',
			data,
		});
	},
	post_labels: (data: any) => {
		return utils.request({
			url: 'org-settings/v1/label/template',
			method: 'POST',
			data,
		});
	},
	get_reports_settings: () => {
		return utils.request({
			url: 'org-settings/v1/metabase/get/all',
			method: 'GET',
		});
	},
	update_reporting: (data: any) => {
		return utils.request({
			url: 'org-settings/v1/metabase/update',
			method: 'POST',
			data,
		});
	},
	create_reporting: (data: any) => {
		return utils.request({
			url: 'org-settings/v1/metabase/create',
			method: 'POST',
			data,
		});
	},
	delete_reporting: (data: any) => {
		return utils.request({
			url: 'org-settings/v1/metabase/delete',
			method: 'DELETE',
			data,
		});
	},
	get_email_config: (type?: string) => {
		return utils.request({
			url: 'setting/v1/email_config/list',
			method: 'GET',
			params: { email_type: type },
		});
	},
	get_template_list: (type?: string) => {
		return utils.request({
			url: 'email_template/v1/get_event_email_templates',
			method: 'GET',
			params: { event_name: type },
		});
	},
	update_email_config: (data: any) => {
		return utils.request({
			url: 'setting/v1/email_config/update_or_create',
			method: 'POST',
			data,
		});
	},
	get_org_setting_configuration: (key: string) => {
		return utils.request({
			url: `org-settings/v1/${key}`,
			method: 'GET',
		});
	},
	update_org_setting: (key: string, data: any) => {
		return utils.request({
			url: `org-settings/v1/${key}`,
			method: 'PUT',
			data,
		});
	},
	get_showroom_mode_setting: () => {
		return utils.request({
			url: 'org-settings/v1/showroom_mode/setting',
			method: 'GET',
		});
	},
	update_showroom_mode_setting: (data: any) => {
		return utils.request({
			url: 'org-settings/v1/showroom_mode/setting',
			method: 'PUT',
			data,
		});
	},
	get_showroom_mode_form: (id: string) => {
		return utils.request({
			url: `org-settings/v1/showroom_mode?showroom_mode_permission_id=${id}`,
			method: 'GET',
		});
	},
	incremental_sync: (type: string) => {
		return utils.request({
			url: `integrations/v1/entity/${type}`,
			method: 'POST',
		});
	},
	incremental_sync_logs: () => {
		return utils.request({
			url: 'integrations/v1/entity/tasks',
			method: 'GET',
		});
	},
	save_default_email_template: (data: any) => {
		return utils.request({
			url: 'email_template/v1/create_template',
			method: 'POST',
			data,
		});
	},
	get_default_email_config: (config_key: string) => {
		return utils.request({
			url: `email_template/v1/get_default_email_config?event_name=${config_key}`,
			method: 'GET',
		});
	},
	get_event_email_templates: (event_name: string) => {
		return utils.request({
			url: `email_template/v1/get_event_email_templates?event_name=${event_name}`,
			method: 'GET',
		});
	},
	get_template_by_id: (templateId: string) => {
		return utils.request({
			url: `email_template/v1/template/${templateId}`,
			method: 'GET',
		});
	},
};

export default settings;
