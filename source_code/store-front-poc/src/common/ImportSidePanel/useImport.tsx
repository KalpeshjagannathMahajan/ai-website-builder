import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import ManageDataApis from 'src/utils/api_requests/manageData';
import NotificationsApis from 'src/utils/api_requests/notifications';
import { Config, ImportOptions, SelectedTemplate, Entity, ImportSteps, SubEntity } from 'src/@types/manage_data';
import { RootState } from 'src/store';
import _ from 'lodash';

const useImport = (entity: Entity, task_id?: string, entity_ids?: string[], sub_entities?: any[]) => {
	const step = task_id ? ImportSteps.DATA_VALIDATION_SUCCESS : ImportSteps.INIT_STATE;

	const [import_step, set_import_step] = useState(step);
	const [selected_template, set_selected_template] = useState<SelectedTemplate | null>(null);
	const [sub_entity, set_sub_entity] = useState<any>(sub_entities?.[0]);
	const [config, set_config] = useState<Config | null>(null);
	const [registered_task_id, set_registered_task_id] = useState(task_id);
	const user_id = useSelector((state: RootState) => state.login.userDetails.id);
	const [csv_ready, set_csv_ready] = useState(false);
	const [confirm_load, set_confirm_load] = useState(false);
	const [is_discard_loading, set_is_discard_loading] = useState<boolean>(false);

	const reset_to_init_state = () => {
		// set_import_step(ImportSteps.INIT_STATE)
		// set_registered_task_id(null)
		// set_selected_template(null)
		// set_csv_ready(false)
	};

	const manage_array = ['collections', 'categories'];
	const fetch_import_config = async () => {
		try {
			const response: any = manage_array.includes(entity)
				? await ManageDataApis.get_import_validations(entity)
				: await ManageDataApis.get_import_validations(entity, sub_entity?.value);
			const templates = response?.data?.data?.filter((t: any) => ({ ...t }));
			if (templates?.length === 1) {
				set_config(response.data);
				set_selected_template(templates[0]);
			} else {
				set_config(response.data);
			}
		} catch (error) {
			console.log({ error });
		}
	};

	const handle_register_import = async (data: any) => {
		try {
			const response: any = await ManageDataApis.register_import(entity, data, sub_entity?.value, entity_ids);
			set_registered_task_id(response?.data?.task_id);
			const data_task_id = response?.data?.task_id;
			if (entity === Entity.Catalog || entity === Entity.Inventory) {
				await update_import_options(ImportOptions.Update, data_task_id);
				set_import_step(ImportSteps.REVIEW_AND_SYNC_IN_PROGRESS);
			} else if (
				sub_entity?.value === SubEntity.OrderQuoteItems ||
				entity === Entity.Modifiers ||
				sub_entity?.value === 'related_products'
			) {
				await update_import_options(ImportOptions.AddAndUpdate, data_task_id);
				set_import_step(ImportSteps.REVIEW_AND_SYNC_IN_PROGRESS);
			} else {
				set_import_step(ImportSteps.DATA_VALIDATION_SUCCESS);
			}
		} catch (error) {
			console.log({ error });
		}
	};

	const debouncedUpdateImportOptions = _.throttle(async (option: ImportOptions, response_task_id?: string) => {
		try {
			set_confirm_load(true);
			if (response_task_id) {
				await ManageDataApis.import_options(response_task_id, option);
				set_import_step(ImportSteps.REVIEW_AND_SYNC_IN_PROGRESS);
				set_confirm_load(false);
			} else if (registered_task_id) {
				await ManageDataApis.import_options(registered_task_id, option);
				set_import_step(ImportSteps.REVIEW_AND_SYNC_IN_PROGRESS);
				set_confirm_load(false);
			}
		} catch (error) {
			console.log({ error });
			set_confirm_load(false);
		}
	}, 500);
	const update_import_options = (option: ImportOptions, response_task_id?: string) => {
		debouncedUpdateImportOptions(option, response_task_id);
	};

	const cancel_current_task = async () => {
		try {
			if (registered_task_id) {
				set_is_discard_loading(true);
				await NotificationsApis.notification_action('cancel', registered_task_id);
			}
		} catch (error) {
			console.log({ error });
		} finally {
			set_is_discard_loading(false);
		}
	};

	useEffect(() => {
		if (entity) {
			fetch_import_config();
			set_csv_ready(false);
		}
	}, [entity, sub_entity]);

	return {
		handle_register_import,
		import_step,
		set_import_step,
		selected_template,
		set_selected_template,
		config,
		user_id,
		registered_task_id,
		update_import_options,
		set_csv_ready,
		csv_ready,
		sub_entity,
		set_sub_entity,
		cancel_current_task,
		reset_to_init_state,
		confirm_load,
		is_discard_loading,
	};
};

export default useImport;
