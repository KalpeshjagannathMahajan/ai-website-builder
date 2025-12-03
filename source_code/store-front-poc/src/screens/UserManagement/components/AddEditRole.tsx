import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section } from 'src/common/Interfaces/SectionsInterface';
import OneColumnForm from 'src/common/OneColumnForms/OneColumnForms';
import RouteNames from 'src/utils/RouteNames';
import { user_management } from 'src/utils/api_requests/userManagement';
import _ from 'lodash';
import { user_management_interface } from '../constants';
import { useDispatch } from 'react-redux';
import { close_toast, show_toast } from 'src/actions/message';
import types from 'src/utils/types';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { get_default_values } from 'src/common/OneColumnForms/helper';
import { useSelector } from 'react-redux';
import { refetch_permission } from 'src/actions/permissions';

const AddEditRole = ({ id = '', is_edit = false }: user_management_interface) => {
	const [form_field_sections, set_form_field_sections] = useState<Section[]>([]);
	const [is_btn_loading, set_btn_loading] = useState<boolean>(false);
	const fetch_permissions = useSelector((state: any) => state.login?.refetch_permissions);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const methods = useForm({});

	useEffect(() => {
		methods.reset(get_default_values(form_field_sections));
	}, [form_field_sections]);

	const transform_form_field_response = (sections: any) => {
		return sections?.map((section: any) => {
			if (section.key === 'contacts') {
				return {
					name: section.name,
					key: section.key,
					attributes: section.contacts?.[0]?.attributes,
				};
			} else {
				return section;
			}
		});
	};

	const get_add_role_form_fields = async () => {
		try {
			let response: any = {};
			if (is_edit && id !== '') {
				response = await user_management.get_edit_role_form_fields(id);
			} else {
				response = await user_management.get_add_role_form_fields();
			}

			if (response.status === 200) {
				const sections = response?.data?.sections || [];
				const sorted_sections = _.sortBy(sections, ['priority']);
				set_form_field_sections(transform_form_field_response(sorted_sections));
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		get_add_role_form_fields();
	}, []);

	const handle_back_click = () => {
		navigate(RouteNames.user_management.roles.path);
	};

	const submit_callback = async (data: any) => {
		set_btn_loading(true);

		// modify for edit
		try {
			// const payload = create_add_edit_payload(data);?
			const response: any = is_edit ? await user_management.put_edit_role_form(id, data) : await user_management.post_add_role(data);

			if (response?.status_code === 200) {
				set_btn_loading(false);
				dispatch<any>(
					show_toast({
						open: true,
						showCross: false,
						anchorOrigin: {
							vertical: types.VERTICAL_TOP,
							horizontal: types.HORIZONTAL_CENTER,
						},
						autoHideDuration: 5000,
						onClose: (event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
							console.log(event);
							if (reason === types.REASON_CLICK) {
								return;
							}
							dispatch(close_toast(response.data?.user_id));
						},
						state: types.SUCCESS_STATE,
						title: types.SUCCESS_TITLE,
						subtitle: response.message,
						showActions: false,
					}),
				);
				dispatch(refetch_permission(!fetch_permissions));
				handle_back_click();
			}
		} catch (error: any) {
			console.error(error);
			set_btn_loading(false);

			const _data = error?.response?.data;
			if (_data?.status_code === 409 || _data?.status_code === 401) {
				dispatch<any>(
					show_toast({
						open: true,
						showCross: false,
						anchorOrigin: {
							vertical: types.VERTICAL_TOP,
							horizontal: types.HORIZONTAL_CENTER,
						},
						autoHideDuration: 5000,
						onClose: (event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
							console.log(event);
							if (reason === types.REASON_CLICK) {
								return;
							}
							dispatch(close_toast(''));
						},
						state: types.ERROR_STATE,
						title: types.ERROR_TITLE,
						subtitle: _data?.message,
						showActions: false,
					}),
				);
			}
		}
	};

	return (
		<div>
			<FormProvider {...methods}>
				{form_field_sections?.length > 0 && (
					<OneColumnForm
						sections={form_field_sections}
						allow_back={true}
						back_text={is_edit ? t('UserManagement.AddEditRole.EditRole') : t('UserManagement.AddEditRole.AddRole')}
						submit_cta_text={is_edit ? t('UserManagement.AddEditRole.Save') : t('UserManagement.AddEditRole.Add')}
						handle_back_callback={handle_back_click}
						submit_callback={submit_callback}
						is_permission_form={true}
						methods={methods}
						is_loading={is_btn_loading}
					/>
				)}
			</FormProvider>
		</div>
	);
};

export default AddEditRole;
