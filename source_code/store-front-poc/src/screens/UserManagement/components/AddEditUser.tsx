/* eslint-disable */

import { useNavigate } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { user_management } from 'src/utils/api_requests/userManagement';
import _ from 'lodash';
import { Section } from 'src/common/Interfaces/SectionsInterface';
import { user_management_interface } from '../constants';
import { close_toast, show_toast } from 'src/actions/message';
import types from 'src/utils/types';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { get_default_values } from 'src/common/OneColumnForms/helper';
import DeactivationModal from './DeactivationModal';
import { PERMISSIONS } from 'src/casl/permissions';
import { useSelector } from 'react-redux';
import OneColumnForm from 'src/common/OneColumnForms/OneColumnForms';

const AddEditUser = ({ id = '', is_edit = false }: user_management_interface) => {
	const user = useSelector((state: any) => state?.login?.userDetails);
	const [form_field_sections, set_form_field_sections] = useState<Section[]>([]);
	const [roles_options, set_role_options] = useState([]);
	const [is_manager_role, set_is_manager_role] = useState(false);
	const [is_loading, set_loading] = useState(false);
	const [role, setRole] = useState('');
	let disable_edit: boolean;
	// const [reporting_to, set_reporting_to] = useState('');
	// const [reportees, setReportees] = useState([]);
	// const [default_reportees, set_default_reportees] = useState([]);
	// const [product_catalogs, set_product_catalogs] = useState<any>([]);
	const [show_deactivation_modal, set_show_deactivation_modal] = useState(false);
	const [is_btn_loading, set_is_btn_loading] = useState(false);
	const [users_list, set_users_list] = useState<any>([]);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const permissions = useSelector((state: any) => state?.login?.permissions);
	const { t } = useTranslation();

	const methods = useForm({});
	useEffect(() => {
		methods.reset(get_default_values(form_field_sections));
	}, [form_field_sections]);

	const get_users_list = async () => {
		try {
			const response: any = await user_management.get_users_list();

			if (response?.status_code === 200) {
				const { rows } = response?.data;
				const filtered_list = rows?.filter((item: any) => item?.reference_id !== id);
				const current_user = _.find(rows, { reference_id: id });
				disable_edit = user?.id === id || current_user?.is_admin;
				const active_filtered_list = filtered_list?.filter((item: any) => item?.status === 'active');
				const _active: any[] = _.sortBy(
					active_filtered_list.map((item: any) => {
						return {
							value: item?.reference_id,
							label: item?.name,
						};
					}) || [],
					'label',
				);
				set_users_list(_active);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (role) {
			// get_reporter_manager_list(role);
			// get_reportees_list(role);
			get_users_list();
		}
	}, [role]);

	useEffect(() => {
		const role_manager: any = roles_options.find((item: any) => item.value === role);
		const is_manager = role_manager?.is_manager;
		set_is_manager_role(is_manager);
	}, [role]);

	const { setValue, getValues } = methods;

	const transform_roles = () => {
		const temp = _.map(roles_options, (role: any) => {
			return {
				key: role?.id,
				label: role?.name,
				value: role?.id,
			};
		});

		return temp;
	};

	const transform_form_field_response = (sections: any) => {
		const delete_user = permissions.find((item: any) => item.slug === PERMISSIONS?.delete_user.slug);

		return _.map(sections, (section: any) => {
			return {
				name: section.name,
				key: section.key,
				attributes: section.attributes?.map((attribute: any) => {
					return {
						...attribute,
						options: attribute?.key === 'role' && section?.key === 'roles' ? transform_roles() : attribute.options,
						disabled:
							attribute?.key === 'status' && disable_edit
								? true
								: attribute?.key === 'status' && is_edit
								? !delete_user?.toggle
								: attribute?.key === 'status' && !is_edit
								? true
								: attribute?.key === 'email' && is_edit
								? true
								: attribute?.key === 'role' && disable_edit
								? true
								: false,
					};
				}),
			};
		});
	};

	const get_roles_options = async () => {
		try {
			const response: any = await user_management.get_roles_option();
			if (response.status_code === 200) {
				const transformed_options = response?.data?.map((item: any) => {
					return {
						...item,
						value: item?.id,
						label: item?.name,
					};
				});
				set_role_options(transformed_options);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const get_add_user_form_fields = async () => {
		set_loading(true);
		try {
			get_users_list();
			const response: any =
				is_edit && id !== '' ? await user_management.get_edit_user_form_fields(id) : await user_management.get_add_user_form_fields();

			if (response.status_code === 200) {
				const sections = response?.data?.sections || [];
				const sorted_sections = _.sortBy(sections, ['priority']);
				// const basic_details = _.find(sorted_sections, { key: 'basic_details' });
				const roles: any = _.find(sorted_sections, { key: 'roles' });
				// const other_sections: any = _.filter(
				// 	sorted_sections,
				// 	(section: Section) => section?.key !== 'basic_details' && section?.key !== 'roles',
				// );
				const product_access: any = _.find(sorted_sections, { key: 'product_access' });
				set_form_field_sections(transform_form_field_response(sorted_sections));

				roles?.attributes?.map((item: any) => {
					setValue(item?.key, item?.value);
				});

				roles?.attributes?.map((item: any) => {
					if (item?.key === 'role') {
						setRole(item?.value);
					}
					// if (item?.key === 'reporting_to') {
					// 	set_reporting_to(item?.value);
					// }
					// if (item?.key === 'reportees') {
					// 	setReportees(item?.value);
					// 	set_default_reportees(item?.value);
					// }
				});

				product_access?.attributes?.map((item: any) => {
					let value = item?.value;
					if (typeof value === 'string') {
						value = value?.split(',');
					}
					setValue('catalogs_access', value);
					// if (value?.length > 0) {
					// 	set_product_catalogs((prev: any) => [...prev, ...value?.filter((item: any) => !prev.includes(item))]);
					// }
				});

				set_loading(false);
			}
		} catch (error) {
			console.error(error);
			set_loading(false);
		}
	};

	useEffect(() => {
		get_roles_options();
		// get_product_catalogs();
	}, []);

	useEffect(() => {
		if (roles_options?.length > 0) {
			get_add_user_form_fields();
		}
	}, [roles_options]);

	const handle_back_click = () => {
		navigate(RouteNames.user_management.users.path);
	};

	const submit_callback = async (data: any) => {
		set_is_btn_loading(true);

		if (data?.status === 'inactive') {
			// set_is_btn_loading(false);
			set_show_deactivation_modal(true);
			return;
		}

		data.phone = data.phone.slice(data?.country_code.length - 1);
		try {
			// const payload = create_add_edit_payload(data);
			const response: any =
				is_edit && id !== '' ? await user_management.put_update_user(id, data) : await user_management.post_add_user(data);

			if (response.status_code === 200) {
				set_is_btn_loading(false);
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
			}
			handle_back_click();
		} catch (error: any) {
			console.error(error);
			set_is_btn_loading(false);
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

	return is_loading ? (
		<div></div>
	) : (
		<div>
			<FormProvider {...methods}>
				{form_field_sections?.length > 0 && (
					<OneColumnForm
						sections={form_field_sections}
						allow_back={true}
						back_text={is_edit ? t('UserManagement.AddEditUser.EditUser') : t('UserManagement.AddEditUser.AddUser')}
						submit_cta_text={is_edit ? t('UserManagement.AddEditUser.Save') : t('UserManagement.AddEditUser.Add')}
						handle_back_callback={handle_back_click}
						submit_callback={submit_callback}
						is_permission_form={false}
						methods={methods}
						btn_loading_master={is_btn_loading}
						fetchFromForm={false}
					/>
				)}
				<DeactivationModal
					open={show_deactivation_modal}
					onClose={() => {
						set_is_btn_loading(false);
						set_show_deactivation_modal(false);
					}}
					reporting_manager_list={users_list}
					handle_back_click={handle_back_click}
					is_manager_role={is_manager_role}
					id={id}
				/>
			</FormProvider>
		</div>
	);
};

export default AddEditUser;
