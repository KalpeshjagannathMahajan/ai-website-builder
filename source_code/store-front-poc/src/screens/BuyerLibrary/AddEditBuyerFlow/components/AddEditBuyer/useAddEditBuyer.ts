/* eslint-disable no-prototype-builtins */
import { useState, useRef, useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api_requests from 'src/utils/api_requests';
import { SECTIONS } from 'src/screens/BuyerLibrary/constants';
import { set_buyer_toast } from 'src/actions/buyer';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { BUYER_ADDRESS_FIELDS, BUYER_SECTIONS } from 'src/screens/OrderManagement/constants';
import { get_company_name_attr, handle_on_submit } from '../helper/helper';
import { useSelector } from 'react-redux';
import { EmailData } from 'src/common/Interfaces/EmailData';

const initial_show_address_sheet_detail = {
	is_open: false,
	index: 0,
	is_shipping_type: true,
};

const initial_show_contact_sheet_detail = {
	is_open: false,
	index: 0,
};

const initial_show_payment_sheet_detail = {
	is_open: false,
	payment_method_id: undefined,
};

const initial_show_payment_ach_sheet_detail = {
	is_open: false,
	edit_mode: false,
	ach_payment_values: undefined,
};

const useAddEditBuyer = (quick_buyer_data: any, edit_buyer_id: any, set_refetch?: any) => {
	const [buyer_fields, set_buyer_fields] = useState<any>({});
	const [is_loading, set_is_loading] = useState(false);
	const [active_tab, set_active_tab] = useState(SECTIONS.basic_details);
	const [is_open_alert, set_is_open_alert] = useState(false);
	const [show_toast, set_show_toast] = useState<any>({ state: false, title: '', sub_title: '', type: '' });
	const [upload_loader, set_upload_loader] = useState(false);
	const [show_contact_sheet_detail, set_show_contact_sheet_detail] = useState(_.cloneDeep(initial_show_contact_sheet_detail));
	const [show_address_sheet_detail, set_show_address_sheet_detail] = useState(_.cloneDeep(initial_show_address_sheet_detail));
	const [show_payment_sheet_detail, set_show_payment_sheet_detail] = useState<any>(_.cloneDeep(initial_show_payment_sheet_detail));
	const [show_payment_ach_sheet_detail, set_show_payment_ach_sheet_detail] = useState<any>(
		_.cloneDeep(initial_show_payment_ach_sheet_detail),
	);
	const [display_name_changed, set_display_name_changed] = useState(false);
	const [edit_buyer_details, set_edit_buyer_details] = useState<any>({});
	const [edit_mode, set_edit_mode] = useState(false);
	const [uploaded_files, set_uploaded_files] = useState<any>([]);
	const [payment_config, set_payment_config] = useState<any>(null);
	const [open_storefront_user, set_open_storefront_user] = useState(false);
	const navigation = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();
	const cancel_ref = useRef(null);
	const methods = useForm({ defaultValues: quick_buyer_data });
	const from_dashboard = location?.state?.from === 'buyer_dashboard';
	const [btn_loading, set_btn_loading] = useState<boolean>(false);
	const [is_button_loading, set_is_button_loading] = useState<boolean>(false);
	const [api_payload, set_api_payload] = useState({});
	const [is_modal_open, set_is_modal_open] = useState<boolean>(false);
	const [email_data, set_email_data] = useState<EmailData>({
		to_emails: [],
		cc_emails: [],
		bcc_emails: [],
		is_auto_trigger: false,
		is_enable: false,
		user_permission_flag: false,
	});
	const [email_checkbox, set_email_checkbox] = useState<boolean>(false);

	const user_permissions = useSelector((state: any) => state?.login?.permissions);
	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';

	const { id } = useParams();

	const {
		control,
		watch,
		setValue,
		setError,
		getValues,
		clearErrors,
		formState: { isDirty },
	} = methods;

	const contact_arr = useFieldArray({
		control,
		name: 'contacts.values',
	});

	const payment_arr1 = useFieldArray<any>({
		control,
		name: 'payment_methods.payment_method_ids',
	});

	const address_arr = useFieldArray({
		control,
		name: 'addresses.values',
	});

	const attachments_arr = useFieldArray({
		control,
		name: 'other_details.attachments',
	});

	const company_name = watch('company_name');

	const all_contacts = watch('contacts') || [];
	const all_address = watch('addresses') || [];
	const all_cards = watch('payment_methods') || [];
	const all_attachments = watch('other_details.attachments') || [];
	const all_wizshop_users = watch('wizshop_users.values') || [];

	const [initial_addresses, set_initial_addresses] = useState<any>({});
	const [initial_cards, set_initial_cards] = useState<any>({});

	const get_buyer_sections = () => {
		if (!_.find(user_permissions, { slug: 'view_payment_method' })?.toggle) {
			return _.filter(
				edit_buyer_id ? edit_buyer_details?.sections : buyer_fields.sections,
				(section: any) => section.key !== 'payment_methods',
			);
		} else {
			return edit_buyer_id ? edit_buyer_details?.sections : buyer_fields.sections;
		}
	};

	const sorted_data = _.sortBy(get_buyer_sections(), 'priority');

	const handle_scroll_to_section = (section_id: string) => {
		const element = document.getElementById(section_id);
		const container: any = document.getElementById('rootContainer');

		if (element && container) {
			let total_height: any = 0;
			for (const ele of sorted_data) {
				const section = document.getElementById(ele.name);

				if (ele.key === section_id) {
					break;
				}

				if (section) {
					total_height += section?.offsetHeight;
				}
			}

			container.scrollTo({
				top: total_height ? total_height + 50 : total_height,
				behavior: 'smooth',
			});
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-shadow
	const handle_blur = async (attribute: any, value: string) => {
		if (!attribute) return;
		const { id: field_name = '' } = attribute;
		const check_duplicate = _.get(attribute, 'check_duplicate');
		const should_call_api = check_duplicate || (field_name === 'company_name' && check_duplicate !== false);
		if (should_call_api) {
			try {
				const res: any = await api_requests.buyer.check_field_duplicacy(field_name, value, id);
				if (res?.data?.is_duplicate) {
					setError(field_name, { type: 'custom', message: `${attribute?.name} already exists` });
					return true;
				} else {
					clearErrors(field_name);
				}
			} catch (error) {
				console.log(error);
			}
		}
	};

	const on_close = () => set_is_open_alert(false);

	const format_default_values = (data: any) => {
		return _.map(data, (item) => {
			const obj: any = {};
			_.forEach(item?.attributes, (attribute) => {
				obj[attribute?.id] = attribute?.value;
			});
			obj.id = item?.id;
			return obj;
		});
	};

	const on_submit = async (data: any) => {
		set_btn_loading(true);
		let _errors: any;
		const company_name_attr = get_company_name_attr(buyer_fields);
		if (company_name_attr && is_ultron) {
			_errors = await handle_blur(company_name, data?.company_name);
			if (_errors) {
				set_btn_loading(false);
				return;
			}
		}
		if (!is_ultron) {
			data = { ...data, ...data?.basic_details, ...data?.preferences };
		}
		if (edit_buyer_id) {
			delete data?.basic_details;
			delete data?.preferences;
		}
		const attachments = _.cloneDeep(data.other_details.attachments);
		const formatted_attachment =
			_.map(attachments, (item) => ({
				file_id: item?.raw_data?.file_id,
				id: item.id,
				status: item.status,
			})) || [];
		data.other_details.attachments = formatted_attachment;

		const attributes = _.cloneDeep(data.other_details.custom_attributes);
		const formatted_custom_attributes = _.mapValues(attributes, (value) => {
			return _.isArray(value) ? value.join(',') : value;
		});
		data.other_details.custom_attributes = formatted_custom_attributes;

		const { other_details } = data;

		const { payment_gateway = 'stax' } = payment_config || {};
		let { payload, is_valid } = handle_on_submit(data, buyer_fields, setError, set_show_toast, payment_gateway);
		if (!is_valid) {
			set_btn_loading(false);
			set_show_toast({ state: true, title: 'Error', sub_title: 'Please fill all the mandatory fields' });
			return;
		}
		payload = {
			...payload,
			other_details,
		};

		set_btn_loading(false);

		if (edit_buyer_id) {
			handle_final_submit(payload);
		} else {
			set_is_modal_open(true);
			set_api_payload(payload);
		}
	};

	const handle_final_submit = async (payload = {}) => {
		if (edit_buyer_id) {
			set_is_loading(true);
			api_requests.buyer
				.update_buyer_details(edit_buyer_id, payload, false)
				.then((res: any) => {
					if (res?.status === 200) {
						dispatch(set_buyer_toast(true, 'Customer has been edited successfully', '', 'success'));
						if (edit_buyer_id) {
							if (is_ultron) {
								navigation(`/buyer-library/view-buyer/${edit_buyer_id}`, {
									state: {
										from: from_dashboard ? 'buyer_form' : 'buyer_listing',
									},
								});
							}
						}
						set_is_loading(false);
					}
				})
				.catch((error: any) => {
					dispatch(set_buyer_toast(true, '', error?.response?.data?.message || '', 'warning'));
				})
				.finally(() => {
					set_btn_loading(false);
					set_is_loading(false);
					set_refetch && set_refetch((prev: boolean) => !prev);
				});
			return;
		}

		api_requests.buyer
			.add_buyer({ ...api_payload, override_to_emails: email_data?.to_emails || [], is_auto_trigger: email_checkbox }, false)
			.then((res: any) => {
				set_is_loading(true);
				set_is_button_loading(true);
				if (res?.status === 200) {
					let buyer_id = res?.data?.buyer_id;
					if (res.data?.is_duplicate) {
						set_is_loading(false);
						set_is_button_loading(false);
						set_show_toast({ state: true, title: 'Validation Error', sub_title: res?.message });
						return;
					} else {
						dispatch(set_buyer_toast(true, 'A new customer has been created successfully', '', 'success'));
					}
					set_is_button_loading(false);
					set_is_loading(false);

					navigation(`/buyer-library/view-buyer/${buyer_id}`, {
						state: {
							from: from_dashboard ? 'buyer_form' : 'buyer_listing',
						},
					});
				}
			})
			.catch((error: any) => {
				dispatch(set_buyer_toast(true, '', error?.response?.data?.message || '', 'warning'));
			})
			.finally(() => {
				set_btn_loading(false);
				set_is_loading(false);
				set_is_button_loading(false);
			});
	};

	const go_back = () => {
		on_close();
		navigation(-1);
	};

	const on_cancel = () => {
		if (isDirty) {
			set_is_open_alert(true);
		} else {
			go_back();
		}
	};

	const on_add_new_contact = () => {
		set_show_contact_sheet_detail({ is_open: true, index: all_contacts.values.length });
	};

	const on_add_new_card = () => {
		set_show_payment_sheet_detail({ is_open: true, payment_method_id: undefined });
	};

	const on_add_new_ach_card = () => {
		set_show_payment_ach_sheet_detail({ is_open: true, payment_method_id: undefined });
	};

	const on_edit_contact = (index: number) => {
		set_edit_mode(true);
		set_show_contact_sheet_detail({ is_open: true, index });
	};

	const on_edit_payment_method = (payment_method_id: string) => {
		set_edit_mode(true);
		set_show_payment_sheet_detail({ is_open: true, payment_method_id });
	};

	const on_edit_ach_payment_method = (payment_values: any) => {
		set_show_payment_ach_sheet_detail({ is_open: true, edit_mode: true, ach_payment_values: payment_values });
	};

	const close_contact_sheet = () => {
		set_show_contact_sheet_detail({ is_open: false, index: -1 });
	};

	const close_payment_sheet = () => {
		set_show_payment_sheet_detail({ is_open: false, index: undefined });
	};

	const close_ach_payment_sheet = () => {
		set_show_payment_ach_sheet_detail({ is_open: false, edit_mode: false, ach_payment_values: undefined });
	};

	const handle_update_form = (key: string, value: any) => {
		setValue(key, value);
	};

	const delete_contact = (index: number) => {
		const _all_contacts = _.cloneDeep(all_contacts);
		const is_contact_primary = _all_contacts.values[index]?.id === _all_contacts.primary_contact;
		if (_.isEmpty(edit_buyer_id) || _all_contacts.values[index]?.id?.includes('temp')) {
			contact_arr.remove(index);
			if (is_contact_primary) {
				const not_archive_contacts = _.filter(all_contacts.values, (item) => item.status !== 'archived');
				handle_update_form(
					`${BUYER_SECTIONS.contact}.${'primary_contact'}`,
					not_archive_contacts.length === 0 ? '' : not_archive_contacts[0].id,
				);
			}
			return;
		}

		_all_contacts.values[index].status = 'archived';
		const not_archive_contacts = _.filter(_all_contacts.values, (item) => item.status !== 'archived');
		_all_contacts.primary_contact = not_archive_contacts.length === 0 ? '' : not_archive_contacts[0].id;
		handle_update_form(BUYER_SECTIONS.contact, _all_contacts);
	};

	const delete_card = (payment_method_id: string) => {
		const index = all_cards?.payment_method_ids?.findIndex((item: any) => item.id === payment_method_id);
		if (index < 0) {
			return;
		}
		const _all_cards = _.cloneDeep(all_cards);

		const is_card_primary = _all_cards?.payment_method_ids?.[index]?.id === _all_cards?.default_payment_method_id;
		const is_present_in_bank_account =
			_all_cards?.saved_bank_accounts[payment_method_id] && payment_method_id === _all_cards?.default_payment_method_id;
		payment_arr1.remove(index);
		delete all_cards.saved_payment_methods[payment_method_id];
		delete all_cards.saved_bank_accounts[payment_method_id];
		handle_update_form('payment_methods.saved_payment_methods', all_cards.saved_payment_methods);
		handle_update_form('payment_methods.saved_bank_accounts', all_cards.saved_bank_accounts);
		if (is_card_primary) {
			const first_payment_method_id = _.first(_.keys(all_cards?.saved_payment_methods)) ?? '';
			handle_update_form(
				`${BUYER_SECTIONS.payment_methods}.${'default_payment_method_id'}`,
				_.size(all_cards?.saved_payment_methods) === 0
					? all_cards.payment_method_ids[0]?.id
					: all_cards?.saved_payment_methods?.[first_payment_method_id]?.payment_method_id,
			);
		}
		if (is_present_in_bank_account) {
			const first_payment_method_id = _.first(_.keys(all_cards?.saved_bank_accounts)) ?? '';
			handle_update_form(
				`${BUYER_SECTIONS.payment_methods}.${'default_payment_method_id'}`,
				_.size(all_cards?.saved_bank_accounts) === 0
					? all_cards.payment_method_ids[0]?.id
					: all_cards?.saved_bank_accounts?.[first_payment_method_id]?.payment_method_id,
			);
		}
	};

	const on_add_new_address = (is_shipping_type = true) => {
		set_show_address_sheet_detail({ is_open: true, index: all_address.values.length, is_shipping_type });
	};

	const on_edit_address = (is_shipping_type: boolean, index: number) => {
		set_edit_mode(true);
		set_show_address_sheet_detail({ is_open: true, index, is_shipping_type });
	};

	const close_address_sheet = () => {
		set_show_address_sheet_detail({ is_open: false, index: -1, is_shipping_type: true });
	};

	const delete_address = (index: number) => {
		const _all_address = _.cloneDeep(all_address);
		const address_type = all_address.values[index].type;
		const key_name =
			address_type === 'shipping' ? BUYER_ADDRESS_FIELDS.default_shipping_address : BUYER_ADDRESS_FIELDS.default_billing_address;
		const is_address_primary = _all_address.values[index].id === _all_address[key_name];

		if (_.isEmpty(edit_buyer_id) || _all_address.values[index].id.includes('temp')) {
			address_arr.remove(index);

			if (is_address_primary) {
				const not_archive_address = _.filter(all_address.values, (item) => item.status !== 'archived' && item.type === address_type);
				handle_update_form(`${BUYER_SECTIONS.address}.${key_name}`, not_archive_address.length === 0 ? '' : not_archive_address[0].id);
			}
			return;
		}

		_all_address.values[index].status = 'archived';
		const not_archive_address = _.filter(_all_address.values, (item) => item.status !== 'archived' && item.type === address_type);
		_all_address[key_name] = not_archive_address.length === 0 ? '' : not_archive_address[0].id;
		handle_update_form(`${BUYER_SECTIONS.address}`, _all_address);
	};

	const delete_attachment = (index: number) => {
		attachments_arr.remove(index);
		const _all_attachments = _.cloneDeep(all_attachments);

		if (_all_attachments[index].id.includes('temp_')) {
			return;
		}
		_all_attachments[index].status = 'archived';
		handle_update_form('other_details.attachments', _all_attachments);
	};

	const handle_added_files = async (files: any) => {
		if (!files) {
			return;
		}

		let prev_value = getValues('other_details.attachments');

		const updated_progress_data = [...prev_value];
		const uploaded_file_payload = [...prev_value];

		try {
			for (const file of files) {
				if (!file) {
					continue;
				}
				set_upload_loader(true);
				const url = URL.createObjectURL(file);
				const form_data: any = new FormData();
				form_data.append('file', file);

				const file_progress_data = {
					id: `temp_${crypto?.randomUUID()}`,
					status: 'published',
					raw_data: {
						image_url: url,
						date: file?.lastModifiedDate,
						file_name: file?.name,
						loading: 0,
					},
				};

				updated_progress_data.push(file_progress_data);

				const config = {
					headers: { 'content-type': 'multipart/form-data' },
					onUploadProgress: ({ loaded, total }: any) => {
						let percent = Math.round((loaded / total) * 100);
						file_progress_data.raw_data.loading = percent > 90 ? 90 : percent;
						set_uploaded_files([...updated_progress_data]);
					},
				};

				const response: any = await api_requests.buyer.add_image(form_data, config);

				if (response?.status === 200) {
					const obj = {
						id: `temp_${crypto?.randomUUID()}`,
						status: 'published',
						raw_data: {
							image_url: url,
							file_id: response?.id,
							date: file?.lastModifiedDate,
							file_name: file?.name,
						},
					};
					file_progress_data.raw_data.loading = 100;
					uploaded_file_payload.push(obj);
				}
			}
		} catch (error) {
			console.log(error);
			set_show_toast({ state: true, title: 'Upload failed', sub_title: 'Please try again' });
		} finally {
			set_upload_loader(false);
			// set_uploaded_files([]);
			setValue('other_details.attachments', uploaded_file_payload);
		}
	};

	const get_buyer_fields = () => {
		set_is_loading(true);
		const method = id ? 'update' : 'create';
		Promise.all([
			api_requests.buyer.get_main_buyer_details_form(method).then((res: any) => {
				set_buyer_fields(res?.data);
			}),
			// set_buyer_fields(mock.data),

			edit_buyer_id
				? api_requests.buyer.get_buyer_details(edit_buyer_id).then((res: any) => {
						const sections = _.get(res, 'data.sections', []);
						const basic_details = _.find(sections, { key: 'basic_details' });
						const contacts_data = _.find(sections, { key: 'contacts' });
						const address_data = _.find(sections, { key: 'addresses' });
						const payments_data = _.find(sections, { key: 'payment_methods' });
						const other_data = _.find(sections, { key: 'other_details' });
						const preferences = _.find(sections, { key: 'preferences' });
						const wizshop_users = _.find(sections, { key: 'wizshop_users' });

						if (basic_details) {
							_.map(basic_details.attributes, (detail) => {
								handle_update_form(`basic_details.${detail.id}`, detail.value);
							});
						}
						if (contacts_data) {
							const contact_values = format_default_values(contacts_data.contacts);
							handle_update_form('contacts.values', contact_values);
							handle_update_form('contacts.primary_contact', contacts_data.primary_contact || '');
						}
						if (address_data) {
							const address_values = format_default_values(address_data.addresses);
							const temp: any = {
								values: address_values,
								default_billing_address: address_data.default_billing_address || '',
								default_shipping_address: address_data.default_shipping_address || '',
							};
							handle_update_form('addresses', temp);
							set_initial_addresses(temp);
						}
						if (payments_data) {
							const temp: any = {
								customer_id: payments_data?.attributes?.find((attr: any) => attr.id === 'customer_id')?.value,
								default_payment_method_id: payments_data?.attributes?.find((attr: any) => attr.id === 'default_payment_method_id')?.value,
								payment_method_ids: payments_data?.attributes?.find((attr: any) => attr.id === 'payment_method_ids')?.value,
								saved_payment_methods: payments_data?.saved_payment_methods,

								saved_bank_accounts: payments_data?.saved_bank_accounts,
							};
							handle_update_form('payment_methods', temp);
							set_initial_cards(temp);
						}
						if (other_data) {
							let uploaded_data: any = [];
							_.forEach(other_data?.attachments, (item: any) => {
								if (item?.id) {
									let obj = {
										id: item?.id,
										status: item?.status,
										raw_data: {
											image_url: item?.file_url,
											file_id: item?.file_id,
											date: item?.created_at,
											file_name: item?.file_name,
										},
									};
									uploaded_data.push(obj);
								}
							});

							handle_update_form('other_details.attachments', uploaded_data);
							_.map(other_data.custom_attributes, (detail) => {
								handle_update_form(`other_details.custom_attributes.${detail.id}`, detail.value);
							});
						}
						if (preferences) {
							_.map(preferences.attributes, (detail) => {
								handle_update_form(`preferences.${detail.id}`, detail.value);
							});
						}
						if (wizshop_users) {
							const storefront_values = format_default_values(wizshop_users?.wizshop_users || []);
							handle_update_form('wizshop_users.values', storefront_values);
						}
						set_edit_buyer_details(res.data);
				  })
				: Promise.resolve(),
		]).finally(() => {
			set_is_loading(false);
		});
	};

	const get_config = async () => {
		api_requests.order_management
			.get_payment_config({})
			.then((res: any) => {
				if (res?.status === 200) {
					set_payment_config(res);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		get_config();
		get_buyer_fields();
	}, []);

	useEffect(() => {
		const quick_company_name = _.get(quick_buyer_data, 'basic_details.company_name') || _.get(quick_buyer_data, 'company_name');
		const company_name_attr = get_company_name_attr(buyer_fields);
		if (!_.isEmpty(quick_company_name) || !company_name_attr) {
			handle_blur(company_name_attr, quick_company_name);
		}
	}, []);

	useEffect(() => {
		if (!display_name_changed && !edit_buyer_id) {
			setValue('display_name', company_name);
		}

		const contact_section = _.find(buyer_fields?.sections, { key: SECTIONS.contact });
		const address_section = _.find(buyer_fields?.sections, { key: SECTIONS?.address });

		const contact_data = _.filter(all_contacts?.values, (item: any) => item.status !== 'archived');
		const shipping_address = _.filter(all_address?.values, (item: any) => item.status !== 'archived' && item.type === 'shipping');
		const billing_address = _.filter(all_address?.values, (item: any) => item.status !== 'archived' && item.type === 'billing');

		if (!_.isEmpty(contact_data) && contact_section?.required) {
			clearErrors('contacts');
		}

		if (!_.isEmpty(billing_address) && address_section?.required) {
			clearErrors('billing');
		}

		if (!_.isEmpty(shipping_address) && address_section?.required) {
			clearErrors('shipping');
		}
	}, [company_name, all_contacts?.values?.length, all_address?.values?.length]);

	return {
		go_back,
		on_add_new_ach_card,
		show_payment_ach_sheet_detail,
		close_ach_payment_sheet,
		on_submit,
		handle_scroll_to_section,
		navigation,
		active_tab,
		set_active_tab,
		buyer_fields,
		methods,
		on_close,
		is_open_alert,
		set_is_open_alert,
		cancel_ref,
		on_cancel,
		isDirty,
		on_add_new_contact,
		on_edit_contact,
		close_contact_sheet,
		handle_update_form,
		delete_contact,
		all_contacts,
		all_wizshop_users,
		show_contact_sheet_detail,
		all_address,
		show_address_sheet_detail,
		all_cards,
		show_payment_sheet_detail,
		on_add_new_card,
		on_edit_payment_method,
		on_edit_ach_payment_method,
		close_payment_sheet,
		delete_card,
		on_add_new_address,
		on_edit_address,
		close_address_sheet,
		delete_address,
		handle_blur,
		show_toast,
		set_show_toast,
		upload_loader,
		all_attachments,
		delete_attachment,
		handle_added_files,
		is_loading,
		uploaded_files,
		edit_mode,
		display_name_changed,
		set_display_name_changed,
		edit_buyer_details,
		payment_config,
		btn_loading,
		sorted_data,
		initial_addresses,
		initial_cards,
		open_storefront_user,
		set_open_storefront_user,
		setValue,
		handle_final_submit,
		is_button_loading,
		is_modal_open,
		set_is_modal_open,
		email_data,
		set_email_data,
		email_checkbox,
		set_email_checkbox,
	};
};

export default useAddEditBuyer;
