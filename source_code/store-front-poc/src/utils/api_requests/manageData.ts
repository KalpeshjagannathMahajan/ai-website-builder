import utils from '../utils';
import { MOCK_IDS } from '../mocks/mocks';

export interface EXPORT_OPTIONS {
	option?: string;
	from_date?: string;
	to_date?: string;
}

interface ImportExportPayload {
	entity: string;
	sub_entity?: string;
	entity_ids?: string[];
	export_option?: EXPORT_OPTIONS;
}

const manage_data = {
	get_import_validations: (entity: string, sub_entity?: string) => {
		return utils.request({
			url: '/tasks/v1/import/validations',
			method: 'POST',
			mock: false,
			data: {
				entity,
				sub_entity,
			},
		});
	},
	get_template: (entity: string, sub_entity?: string) => {
		// let params: any = { entity };

		// if (sub_entity) params.sub_entity = sub_entity;
		return utils.request({
			url: '/tasks/v1/import/template',
			method: 'POST',
			mock: false,
			data: {
				entity,
				sub_entity,
			},
		});
	},
	get_task_history: () => {
		return utils.request({
			url: '/tasks/v1/history',
			method: 'POST',
			mock: false,
		});
	},

	get_manage_data_entities: () => {
		return utils.request({
			url: 'tasks/v1/manage/page',
			method: 'GET',
			mock: false,
			mock_id: MOCK_IDS.manage_response,
		});
	},

	export_module: (entity: string, entity_ids?: string[], export_option?: EXPORT_OPTIONS, source?: string, sub_entity?: string) => {
		const data: ImportExportPayload = {
			entity,
			sub_entity,
		};
		if (source !== 'import_export' && entity_ids) {
			data.entity_ids = entity_ids;
		}
		if (export_option) {
			data.export_option = export_option;
		}
		return utils.request({
			url: 'tasks/v1/export',
			method: 'POST',
			mock: false,
			data,
		});
	},
	get_import_config: (entity: string, entity_ids?: string[]) => {
		const data: ImportExportPayload = {
			entity,
		};
		if (entity_ids) {
			data.entity_ids = entity_ids;
		}
		return utils.request({
			url: 'tasks/v1/import/config',
			method: 'POST',
			mock: false,
			data,
		});
	},
	register_import: (entity: string, data: any, sub_entity?: string, entity_ids?: string[]) => {
		let params: any = { entity, data };

		if (sub_entity) params.sub_entity = sub_entity;
		if (entity_ids) params.entity_ids = entity_ids;
		return utils.request({
			url: 'tasks/v1/import',
			method: 'POST',
			mock: false,
			data: params,
		});
	},
	import_options: (task_id: string, option: string) => {
		return utils.request({
			url: 'tasks/v1/import/options',
			method: 'POST',
			mock: false,
			data: {
				task_id,
				option,
			},
		});
	},
	export_module_with_filter: (data: any) => {
		return utils.request({
			url: 'tasks/v1/export/ssrm',
			method: 'POST',
			data,
		});
	},
};

export default manage_data;
