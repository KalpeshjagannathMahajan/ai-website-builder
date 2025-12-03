/* eslint-disable */
import { Box, Grid, Icon, PageHeader, Button, Drawer } from 'src/common/@the-source/atoms';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { SECTIONS } from 'src/screens/BuyerLibrary/constants';
import { updateBreadcrumbs } from 'src/actions/topbar';
import api_requests from 'src/utils/api_requests';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import BasicDetails from '../BasicDetails';
import { useDispatch } from 'react-redux';
import RouteNames from 'src/utils/RouteNames';
import ContactCard from '../ContactCard';
import AddContactCard from '../AddContactCard';
import AddPaymentCard from '../AddPaymentCard';
import OtherDetails from '../OtherDetails';
import _ from 'lodash';
import AddContactDrawer from '../Drawer/AddContactDrawer';
import AddAddressDrawer from '../Drawer/AddAddressDrawer';
import Toaster from 'src/common/CustomToast';
import { set_buyer_toast } from 'src/actions/buyer';
import { BUYER_SECTIONS } from 'src/screens/OrderManagement/constants';
import { BuyerQuickFormSkeleton, LeadNewCustomerSkeleton } from '../BuyerFormSkeleton';
import Preferences from '../Preferences';
import AddressCard from '../AddressCard';
import AddAddressCard from '../AddAddressCard';
import { get_company_name_attr, get_permission, handle_on_submit } from '../helper/helper';
import TaxPreferences from '../TaxPreferences';
import PaymentCard from '../PaymentCard';
import AddPaymentModal from '../Drawer/AddPaymentModal';
import DiscardModal from '../DiscardModal';
import { PERMISSIONS } from 'src/casl/permissions';
import Can from 'src/casl/Can';
import CustomText from 'src/common/@the-source/CustomText';
import CustomSection from '../CustomSection';
import { clubAdditionals } from 'src/screens/BuyerLibrary/ViewBuyer/helper';
import useStyles from '../../../styles';
import { useTheme } from '@mui/material/styles';
import StoreFrontTable from '../StoreFrontTable';
import StoreFrontAddUser from '../StoreFrontAddUser';
import CustomerEmailModal from '../../CustomerEmailModal';
import { EmailData } from 'src/common/Interfaces/EmailData';
import SelectBuyerPanel from 'src/common/SelectBuyerPanel/SelectBuyerPanel';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

interface Props {
	set_drawer?: any;
	set_is_detailed?: any;
	set_quick_buyer_data?: any;
	set_is_filled?: any;
	from_cart?: boolean;
	set_is_buyer_add_form?: any;
	handle_submit_callback?: (key: any) => any;
	is_detailed?: boolean;
	set_buyer_data?: any;
	wizshop_lead_id?: string;
	set_refetch?: any;
	handle_selected_buyer_wizshop_create?: any;
	set_add_drawer?: any;
	exist_lead?: any;
	handle_selected_buyer_wizshop?: any;
	exist_customer?: boolean;
}

const initial_show_address_sheet_detail = {
	is_open: false,
	index: 0,
	is_shipping_type: true,
};

const initial_show_contact_sheet_detail = {
	is_open: false,
	index: 0,
};

const initial_show_card_sheet_detail = {
	is_open: false,
	payment_method_id: undefined,
};

const AddQuickBuyer = ({
	set_is_detailed,
	set_is_filled,
	set_quick_buyer_data,
	from_cart = false,
	set_is_buyer_add_form,
	set_buyer_data,
	wizshop_lead_id,
	set_drawer,
	set_refetch,
	set_add_drawer,
	handle_selected_buyer_wizshop_create,
	exist_lead,
	handle_selected_buyer_wizshop,
	exist_customer = false,
}: Props) => {
	const [is_loading, set_is_loading] = useState(false);
	const [is_open_alert, set_is_open_alert] = useState(false);
	const [buyer_fields, set_buyer_fields] = useState<any>({});
	const [show_toast, set_show_toast] = useState({ state: false, title: '', sub_title: '' });
	const [show_contact_sheet_detail, set_show_contact_sheet_detail] = useState(initial_show_contact_sheet_detail);
	const [show_address_sheet_detail, set_show_address_sheet_detail] = useState(initial_show_address_sheet_detail);
	const [show_payment_sheet_detail, set_show_payment_sheet_detail] = useState<any>(initial_show_card_sheet_detail);
	const [display_name_changed, set_display_name_changed] = useState(false);
	const [btn_loading, set_btn_loading] = useState<boolean>(false);
	const [upload_loader, set_upload_loader] = useState(false);
	const [uploaded_files, set_uploaded_files] = useState<any>([]);
	const [open_storefront_user, set_open_storefront_user] = useState(false);
	const [storefront_edit_user, set_storefront_edit_user] = useState({ index: null, user: null });
	const [email_data, set_email_data] = useState<EmailData>({
		to_emails: [],
		cc_emails: [],
		bcc_emails: [],
		is_auto_trigger: false,
		is_enable: false,
		user_permission_flag: false,
	});
	const [email_checkbox, set_email_checkbox] = useState<boolean>(false);
	const [is_modal_open, set_is_modal_open] = useState<boolean>(false);
	const [is_button_loading, set_is_button_loading] = useState<boolean>(false);
	const [api_payload, set_api_payload] = useState({});
	const [show_add_quick_buyer, set_show_add_quick_buyer] = useState<boolean>(false);
	const styles = useStyles();
	const theme: any = useTheme();
	const is_duplicate_customer_allowed = useSelector((state: any) => state?.settings?.is_duplicate_customer_allowed) ?? false;
	const { t } = useTranslation();

	const dispatch = useDispatch();
	const location = useLocation();
	const methods = useForm({
		defaultValues: {
			contacts: {
				primary_contact: '',
				values: [],
			},
		},
	});

	const { id } = useParams();

	const navigate = useNavigate();
	const breadCrumbList = [
		{
			id: 1,
			linkTitle: 'Dashboard',
			link: RouteNames.dashboard.path,
		},
		{
			id: 2,
			linkTitle: 'Customer List',
			link: `${RouteNames.buyer_library.buyer_list.path}`,
		},
		{
			id: 3,
			linkTitle: 'Add Customer',
			link: `${RouteNames.buyer_library.edit_buyer.path}`,
		},
	];

	const {
		handleSubmit,
		getValues,
		setValue,
		control,
		watch,
		setError,
		clearErrors,
		formState: { isDirty, errors },
	} = methods;

	const contact_arr = useFieldArray<any>({
		control,
		name: 'contacts.values',
	});

	const address_arr = useFieldArray<any>({
		control,
		name: 'addresses.values',
	});

	const payment_arr1 = useFieldArray<any>({
		control,
		name: 'payment_methods.payment_method_ids',
	});
	const attachments_arr = useFieldArray<any>({
		control,
		name: 'other_details.attachments',
	});

	const company_name = watch<any>('company_name');
	const all_contacts = watch<any>('contacts') || [];
	const all_address = watch<any>('addresses') || [];
	const all_cards = watch<any>('payment_methods') || [];
	const from_dashboard = location?.state?.from === 'buyer_dashboard';
	const all_attachments = watch<any>('other_details.attachments') || [];
	const all_wizshop_users = watch<any>('wizshop_users.values') || [];

	const handle_update_form = (key: any, value: any, set_btn_loading?: any) => {
		setValue(key, value);
		if (set_btn_loading) set_btn_loading(false);
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
	const on_close = () => set_is_open_alert(false);

	const sorted_data = _.sortBy(buyer_fields?.sections, 'priority');

	const get_details = () => {
		const method = id ? 'update' : 'create';
		set_is_loading(true);
		api_requests.buyer
			.get_quick_buyer_details_form(method)
			.then((res: any) => {
				const fields = res?.data;
				set_buyer_fields(fields);
				const payments_data = _.find(fields?.sections, { key: 'payment_methods' });
				if (payments_data) {
					handle_update_form('payment_methods', {
						customer_id: payments_data?.attributes?.find((attr: any) => attr?.id === 'customer_id')?.value,
						default_payment_method_id: payments_data?.attributes?.find((attr: any) => attr?.id === 'default_payment_method_id')?.value,
						payment_method_ids: payments_data?.attributes?.find((attr: any) => attr?.id === 'payment_method_ids')?.value,
						saved_payment_methods: payments_data?.saved_payment_methods,
					});
				}
			})
			.finally(() => {
				set_is_loading(false);
			});
	};
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
	const handle_get_lead_form = () => {
		set_is_loading(true);
		api_requests.storefront
			.get_storefront_leads_buyer({ lead_id: wizshop_lead_id })
			.then((res: any) => {
				if (res?.status === 200) {
					const fields = res?.data;
					set_buyer_fields(fields);
					const payments_data = _.find(fields?.sections, { key: 'payment_methods' });
					if (payments_data) {
						handle_update_form('payment_methods', {
							customer_id: payments_data?.attributes?.find((attr: any) => attr?.id === 'customer_id')?.value,
							default_payment_method_id: payments_data?.attributes?.find((attr: any) => attr?.id === 'default_payment_method_id')?.value,
							payment_method_ids: payments_data?.attributes?.find((attr: any) => attr?.id === 'payment_method_ids')?.value,
							saved_payment_methods: payments_data?.saved_payment_methods,
						});
					}
					const sections = fields?.sections;
					const basic_details = _.find(sections, { key: 'basic_details' });
					const contacts_data = _.find(sections, { key: 'contacts' });
					const address_data = _.find(sections, { key: 'addresses' });

					const other_data = _.find(sections, { key: 'other_details' });
					const preferences = _.find(sections, { key: 'preferences' });
					const wizshop_users = _.find(sections, { key: 'wizshop_users' });

					if (basic_details) {
						_.forEach(basic_details?.attributes, (detail) => {
							handle_update_form(`basic_details.${detail?.id}`, detail?.value);
						});
					}

					if (contacts_data) {
						const contact_values = format_default_values(contacts_data?.contacts);
						handle_update_form('contacts.values', contact_values);
						handle_update_form('contacts.primary_contact', contacts_data?.primary_contact || '');
					}
					if (address_data) {
						const address_values = format_default_values(address_data?.addresses);
						handle_update_form('addresses.values', address_values);
						handle_update_form('addresses.default_billing_address', address_data?.default_billing_address || '');
						handle_update_form('addresses.default_shipping_address', address_data?.default_shipping_address || '');
					}
					if (payments_data) {
						handle_update_form('payment_methods', {
							customer_id: payments_data?.attributes?.find((attr: any) => attr?.id === 'customer_id')?.value,
							default_payment_method_id: payments_data?.attributes?.find((attr: any) => attr?.id === 'default_payment_method_id')?.value,
							payment_method_ids: payments_data?.attributes?.find((attr: any) => attr?.id === 'payment_method_ids')?.value,
							saved_payment_methods: payments_data?.saved_payment_methods,
						});
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
						_.forEach(other_data.custom_attributes, (detail) => {
							handle_update_form(`other_details.custom_attributes.${detail?.id}`, detail?.value);
						});
					}
					if (preferences) {
						_.forEach(preferences.attributes, (detail) => {
							handle_update_form(`preferences.${detail?.id}`, detail?.value);
						});
					}
					if (wizshop_users) {
						const storefront_values = format_default_values(wizshop_users?.wizshop_users || []);
						handle_update_form('wizshop_users.values', storefront_values);
					}
				}
			})
			.finally(() => {
				set_is_loading(false);
			});
	};

	const handle_added_files = async (files: any) => {
		if (!files) {
			return;
		}

		let prev_value: any = getValues('other_details.attachments');

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
			console.error(error);
			set_show_toast({ state: true, title: 'Upload failed', sub_title: 'Please try again' });
		} finally {
			set_upload_loader(false);
			// set_uploaded_files([]);
			setValue('other_details.attachments', uploaded_file_payload);
		}
	};

	const got_to_detailed = () => {
		if (isDirty) {
			set_is_filled(true);
		}
		set_quick_buyer_data(getValues());
		set_is_detailed(true);
	};

	const go_back = () => {
		on_close();
		navigate(-1);
	};

	const on_cancel = () => {
		if (isDirty) {
			set_is_open_alert(true);
		} else {
			go_back();
		}
	};

	const delete_contact = (index: number) => {
		const is_contact_primary = all_contacts?.values?.[index]?.id === all_contacts?.primary_contact;
		contact_arr?.remove(index);
		if (is_contact_primary) {
			handle_update_form(
				`${BUYER_SECTIONS?.contact}.${'primary_contact'}`,
				all_contacts?.values?.length === 0 ? '' : all_contacts?.values[0]?.id,
			);
		}
	};

	const delete_card = (payment_method_id: string) => {
		const index = all_cards?.payment_method_ids?.findIndex((item: any) => item?.id === payment_method_id);
		const is_card_primary = all_cards?.payment_method_ids[index]?.id === all_cards?.default_payment_method_id;
		payment_arr1?.remove(index);
		delete all_cards?.saved_payment_methods[payment_method_id];
		handle_update_form('payment_methods.saved_payment_methods', all_cards?.saved_payment_methods);
		if (is_card_primary) {
			handle_update_form(
				`${BUYER_SECTIONS?.payment_methods}.${'default_payment_method_id'}`,
				all_cards?.payment_method_ids?.length === 0 ? undefined : all_cards?.payment_method_ids[0]?.id,
			);
		}
	};

	const handle_blur = async (attribute: any, value: string) => {
		if (!attribute) return;
		const { id: field_name = '' } = attribute;
		const check_duplicate = _.get(attribute, 'check_duplicate');
		const should_call_api = check_duplicate || (field_name === 'company_name' && check_duplicate !== false);

		if (field_name !== 'company_name' && _.isEmpty(value)) {
			clearErrors(field_name);
			return;
		}

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

	const on_submit = async (data: any) => {
		const address = {
			...data?.addresses,
			values: _.filter(data?.addresses?.values, (item) => item?.type !== ''),
		};
		const new_data = { ...data, addresses: address };

		set_btn_loading(true);
		const company_name_attr = get_company_name_attr(buyer_fields);
		if (company_name_attr) {
			const _errors = await handle_blur(company_name, new_data?.company_name);
			if (_errors) {
				set_btn_loading(false);
				return;
			}
		}

		const attachments = _.cloneDeep(new_data.other_details.attachments);
		const formatted_attachment =
			_.map(attachments, (item) => ({
				file_id: item?.raw_data?.file_id,
				id: item.id,
				status: item.status,
			})) || [];
		new_data.other_details.attachments = formatted_attachment;

		const attributes = _.cloneDeep(new_data.other_details.custom_attributes);
		const formatted_custom_attributes = _.mapValues(attributes, (value) => {
			return _.isArray(value) ? value.join(',') : value || '';
		});
		new_data.other_details.custom_attributes = formatted_custom_attributes;

		const { other_details } = new_data;
		let { payload, is_valid } = handle_on_submit(new_data, buyer_fields, setError, set_show_toast);

		payload = {
			...payload,
			other_details,
		};

		if (wizshop_lead_id) {
			payload = {
				...payload,
				wizshop_lead_id,
			};
		}
		if (!is_valid) {
			set_btn_loading(false);
			return;
		}

		if (wizshop_lead_id) {
			handle_final_submit(payload);
			set_btn_loading(false);
		} else {
			set_api_payload(payload);
			set_is_modal_open(true);
			set_btn_loading(false);
		}
	};

	const handle_final_submit = async (payload = api_payload) => {
		set_is_loading(true);
		set_is_button_loading(true);
		try {
			const res: any = await api_requests.buyer.add_buyer(
				{ ...payload, override_to_emails: email_data?.to_emails || [], is_auto_trigger: email_checkbox },
				false,
			);
			if (wizshop_lead_id) {
				try {
					await api_requests.storefront.update_lead_status(wizshop_lead_id, 'new_customer');
				} catch (err) {
					console.error(err);
				}
			}
			const { is_duplicate, message, buyer_id } = res?.data;
			if (is_duplicate) {
				set_is_loading(false);
				set_is_button_loading(false);
				set_show_toast({ state: true, title: 'Validation Error', sub_title: message });
				return;
			}
			if (wizshop_lead_id && !exist_customer) {
				dispatch(set_buyer_toast(true, 'A new customer has been created successfully', '', 'success'));
				set_refetch((prev: any) => !prev);
				set_is_button_loading(false);
				set_drawer(false);
				return;
			}

			if (set_is_buyer_add_form) {
				const buyer_data: any = await api_requests.buyer.get_buyer_dashboard(buyer_id);
				if (buyer_data.status === 200) {
					set_buyer_data(buyer_data?.data);
					if (exist_lead) {
						set_add_drawer(true);
						handle_selected_buyer_wizshop_create(buyer_data?.data);
					}
				}

				set_is_buyer_add_form(false);
			} else {
				navigate(`/buyer-library/view-buyer/${buyer_id}`, {
					state: {
						from: from_dashboard ? 'buyer_form' : 'buyer_listing',
					},
				});
			}

			dispatch(set_buyer_toast(true, 'A new customer has been created successfully', '', 'success'));
			if (exist_customer) set_drawer(false);
		} catch (error: any) {
			dispatch(set_buyer_toast(true, '', error?.response?.data?.message || '', 'warning'));
		} finally {
			set_btn_loading(false);
			set_is_loading(false);
			set_is_modal_open(false);
			set_is_button_loading(false);
			if (exist_customer) {
				set_refetch((prev: any) => !prev);
			}
		}
	};
	const on_add_new_contact = () => {
		set_show_contact_sheet_detail({ is_open: true, index: all_contacts.values.length });
	};

	const on_add_new_card = () => {
		set_show_payment_sheet_detail({ is_open: true, payment_method_id: undefined });
	};

	const on_edit_contact = (index: any) => {
		set_show_contact_sheet_detail({ is_open: true, index });
	};

	const on_edit_payment_method = (payment_method_id: string) => {
		set_show_payment_sheet_detail({ is_open: true, payment_method_id });
	};

	const close_contact_sheet = () => {
		set_show_contact_sheet_detail({ is_open: false, index: -1 });
	};

	const close_address_sheet = () => {
		set_show_address_sheet_detail({ is_open: false, index: -1, is_shipping_type: true });
	};

	const close_card_sheet = () => {
		set_show_payment_sheet_detail({ is_open: false, payment_method_id: undefined });
	};

	const on_add_new_address = (is_shipping_type = true) => {
		set_show_address_sheet_detail({ is_open: true, index: all_address.values.length, is_shipping_type });
	};

	const on_edit_address = (is_shipping_type: boolean, index: number) => {
		set_show_address_sheet_detail({ is_open: true, index, is_shipping_type });
	};

	const delete_address = (index: number) => {
		address_arr.remove(index);
	};

	const [payment_config, set_payment_config] = useState<any>(null);

	const get_config = async () => {
		api_requests.order_management
			.get_payment_config({})
			.then((res: any) => {
				if (res?.status === 200) {
					set_payment_config(res);
				}
			})
			.catch((err: any) => {
				console.log(err);
			});
	};
	const contact_section_data = _.find(buyer_fields?.sections, { key: SECTIONS?.contact });
	const address_section_data = _.find(buyer_fields?.sections, { key: SECTIONS?.address });

	const is_contact_required = contact_section_data?.required || false;
	const is_address_required = address_section_data?.required || false;

	const wizshop_attributes = _.find(buyer_fields?.sections, { key: SECTIONS.wizshop_users });
	const user_attributes = _.get(wizshop_attributes, SECTIONS.wizshop_users, [])?.[0]?.attributes || [];

	const excluded_attributes = ['status', 'send_invite'];
	const filter_wizshop_attributes = _.filter(user_attributes, (attr: any) => !excluded_attributes.includes(attr?.id));
	// const send_invite_attribute = _.find(user_attributes, { id: 'send_invite' });

	useEffect(() => {
		if (wizshop_lead_id) {
			handle_get_lead_form();
		} else {
			get_config();
			get_details();
			dispatch(updateBreadcrumbs(breadCrumbList));
		}
	}, []);

	useEffect(() => {
		if (!display_name_changed) {
			setValue('display_name', company_name);
		}
		const contact_section = _.find(buyer_fields?.sections, { key: SECTIONS?.contact });
		const address_section = _.find(buyer_fields?.sections, { key: SECTIONS?.address });

		const contact_data = _.filter(all_contacts?.values, (item: any) => item?.status !== 'archived');
		const shipping_address = _.filter(all_address?.values, (item: any) => item?.status !== 'archived' && item?.type === 'shipping');
		const billing_address = _.filter(all_address?.values, (item: any) => item?.status !== 'archived' && item?.type === 'billing');

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

	const handle_render_header = () => {
		return (
			<PageHeader
				leftSection={
					<Grid container>
						<Grid sx={{ cursor: 'pointer', marginTop: '2.8px' }}>
							<Icon color={theme?.quick_add_buyer?.header?.text} onClick={on_cancel} iconName='IconArrowLeft' />
						</Grid>
						<Grid item ml={1}>
							<CustomText type='H2'>Add customer</CustomText>
						</Grid>
					</Grid>
				}
				rightSection={
					<Grid container justifyContent={'right'}>
						<Grid item>
							<Button variant='outlined' onClick={got_to_detailed}>
								Add Details
							</Button>
						</Grid>
						<Grid item ml={1}>
							<Button loading={btn_loading} disabled={!_.isEmpty(errors)} variant='contained' onClick={handleSubmit(on_submit)}>
								Quick Add
							</Button>
						</Grid>
					</Grid>
				}
			/>
		);
	};

	// const handle_show_section_name = (item: any) => {
	// 	if (
	// 		item?.name === 'Addresses' ||
	// 		item?.name === 'Preferences' ||
	// 		item.name === 'Tax Preferences' ||
	// 		item.name === 'Contacts' ||
	// 		item.name === 'Payment Methods' ||
	// 		from_cart
	// 	) {
	// 		return true;
	// 	}
	// 	return false;
	// };

	const handle_render_toaster = () => {
		return (
			<Toaster
				open={show_toast.state}
				showCross={true}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				autoHideDuration={5000}
				onClose={() => set_show_toast({ state: false, title: '', sub_title: '' })}
				state='error'
				title={show_toast.title}
				subtitle={show_toast.sub_title}
				showActions={false}
			/>
		);
	};

	const handle_basic_details = (item: any) => {
		return (
			<>
				<CustomText type='H2' className={wizshop_lead_id ? styles.basic_details_wizshop : styles.basic_details}>
					{item?.name}
				</CustomText>
				<BasicDetails
					set_display_name_changed={set_display_name_changed}
					handle_blur={handle_blur}
					item={item}
					is_loading={is_loading}
					from_cart={from_cart}
					setValue={setValue}
				/>
			</>
		);
	};

	const handle_contact_details = (item: any, error_keys: any) => {
		const contact_data_length = all_contacts?.values?.length;
		const add_entity_allowed = item?.allowed_actions ? _.includes(item?.allowed_actions, 'ADD') : true;
		if (item?.is_display !== false && add_entity_allowed)
			return (
				<React.Fragment>
					<CustomText
						type='H2'
						color={error_keys?.includes(item?.key) ? theme?.palette?.error?.main : 'black'}
						style={{ paddingLeft: '16px' }}>
						{item.name === 'Contacts' ? 'Primary contact' : item?.name}
						{is_contact_required ? '*' : ''}
					</CustomText>
					{error_keys?.includes(item?.key) && (
						<CustomText type='Caption' color={theme?.palette?.error?.main} style={{ paddingLeft: '16px' }}>
							Primary contact is mandatory
						</CustomText>
					)}
					<Grid className='add-details-card-container' p={2}>
						{_.map(all_contacts?.values, (contact_item, contact_index: number) => {
							if (contact_item?.status === 'archived') {
								return;
							}
							return (
								<ContactCard
									key={`contact_card_${contact_index}`}
									is_editable={true}
									item={contact_item}
									primary_contact_id={all_contacts.primary_contact}
									on_edit_press={() => on_edit_contact(contact_index)}
									buyer_fields={buyer_fields}
								/>
							);
						})}
						{contact_data_length < (item?.max_entities || Infinity) && add_entity_allowed && (
							<AddContactCard on_card_press={on_add_new_contact} />
						)}
					</Grid>
				</React.Fragment>
			);
	};

	const handle_address_details = (item: any, error_keys: any) => {
		const available_address = _.filter(all_address?.values, (add_item: any) => add_item.status !== 'archived');
		const billing_address = _.filter(available_address, (add_item: any) => add_item.type === 'billing');
		const shipping_address = _.filter(available_address, (add_item: any) => add_item.type === 'shipping');

		const add_billing_permission = item?.billing_allowed_actions ? _.includes(item?.billing_allowed_actions, 'ADD') : true;
		const add_shipping_permission = item?.shipping_allowed_actions ? _.includes(item?.shipping_allowed_actions, 'ADD') : true;
		const add_entity_allowed = item?.allowed_actions ? add_billing_permission || add_shipping_permission : true;
		if (item?.is_display !== false && add_entity_allowed)
			return (
				<React.Fragment>
					{_.size(item?.is_display_exclusion_type) !== 2 && (
						<>
							<CustomText
								type='H2'
								color={error_keys?.includes(item?.key) ? theme?.palette?.error?.main : 'black'}
								style={{ paddingLeft: '16px' }}>
								Addresses
							</CustomText>
							{error_keys?.includes(item?.key) && (
								<CustomText type='Caption' color={theme?.palette?.error?.main} style={{ paddingLeft: '16px' }}>
									Address is mandatory
								</CustomText>
							)}
						</>
					)}

					{!_.some(item?.is_display_exclusion_type, (val) => val === 'billing') && add_billing_permission && (
						<>
							<CustomText type='H2' color='rgba(0, 0, 0, 0.6)' style={{ padding: '16px 0 0 16px' }}>
								Billing Address{!_.some(item?.required_exclusion_type, (val) => val === 'billing') && is_address_required && '*'}
							</CustomText>
							{error_keys?.includes('billing') && (
								<CustomText type='Caption' color={theme?.palette?.error?.main} style={{ paddingLeft: '20px' }}>
									Billing Address is mandatory
								</CustomText>
							)}

							<Grid className='add-details-card-container' padding={2}>
								{_.map(all_address.values, (address_item, address_index: number) => {
									if (address_item.type !== 'billing') return;
									if (address_item?.status === 'archived') {
										return;
									}
									let transformed_address = _.cloneDeep(address_item);
									transformed_address = clubAdditionals(transformed_address);
									return (
										<AddressCard
											key={`address_card_${address_index}`}
											is_editable={true}
											item={transformed_address}
											is_shipping_type={false}
											primary_address_id={all_address.default_billing_address}
											on_edit_press={() => on_edit_address(false, address_index)}
											buyer_fields={buyer_fields}
										/>
									);
								})}
								{billing_address?.length < (item?.billing_max_entities || Infinity) && add_billing_permission && (
									<AddAddressCard is_shipping_type={false} on_card_press={() => on_add_new_address(false)} />
								)}
							</Grid>
						</>
					)}

					{!_.some(item?.is_display_exclusion_type, (val) => val === 'shipping') && add_shipping_permission && (
						<>
							<CustomText type='H2' color='rgba(0, 0, 0, 0.6)' style={{ paddingLeft: '16px' }}>
								Shipping Address
								{!_.some(item?.required_exclusion_type, (val) => val === 'shipping') && is_address_required && '*'}
							</CustomText>
							{error_keys?.includes('shipping') && (
								<CustomText type='Caption' color={theme?.palette?.error?.main} style={{ paddingLeft: '20px' }}>
									Shipping Address is mandatory
								</CustomText>
							)}

							<Grid className='add-details-card-container' padding={2}>
								{_.map(all_address.values, (address_item, address_index: number) => {
									if (address_item?.type !== 'shipping') return;
									if (address_item?.status === 'archived') {
										return;
									}
									let transformed_address = _.cloneDeep(address_item);
									transformed_address = clubAdditionals(transformed_address);
									return (
										<AddressCard
											key={`address_card_${address_index}`}
											is_editable={true}
											item={transformed_address}
											is_shipping_type={true}
											primary_address_id={all_address.default_shipping_address}
											on_edit_press={() => on_edit_address(true, address_index)}
											buyer_fields={buyer_fields}
										/>
									);
								})}
								{shipping_address?.length < (item?.shipping_max_entities || Infinity) && add_shipping_permission && (
									<AddAddressCard is_shipping_type={true} on_card_press={() => on_add_new_address(true)} />
								)}
							</Grid>
						</>
					)}
				</React.Fragment>
			);
	};

	const handle_payment_details = (item: any) => {
		const payment_data_length = _.keys(all_cards?.saved_payment_methods)?.length || 0;
		const add_entity_allowed = item?.allowed_actions ? _.includes(item?.allowed_actions, 'ADD') : true;
		if (item?.is_display !== false && add_entity_allowed)
			return (
				<React.Fragment>
					<CustomText type='H2' style={{ paddingLeft: '16px' }}>
						Payment Methods
					</CustomText>
					<Grid className='add-details-card-container' p={3}>
						{_.map(all_cards?.saved_payment_methods, (value, key) => {
							return (
								<PaymentCard
									key={`payment_card_${key}`}
									item={value}
									primary_card_id={all_cards.default_payment_method_id}
									is_editable={true}
									on_edit_press={() => on_edit_payment_method(key)}
								/>
							);
						})}
						{payment_data_length < (item?.max_entities || Infinity) && add_entity_allowed && (
							<Can I={PERMISSIONS.add_payment.slug} a={PERMISSIONS.add_payment.permissionType}>
								<AddPaymentCard on_card_press={on_add_new_card} />
							</Can>
						)}
					</Grid>
				</React.Fragment>
			);
	};

	const handle_preferance_details = (item: any) => {
		if (item?.is_display !== false)
			return (
				<React.Fragment>
					<CustomText type='H2' style={{ paddingLeft: '16px' }}>
						{item.name}
					</CustomText>
					<Preferences item={item} />
				</React.Fragment>
			);
	};
	const handle_wizshop_users = (item: any) => {
		if (item?.is_display !== false)
			return (
				<Grid sx={{ marginBottom: '10px' }}>
					<CustomText type='H2' style={{ paddingLeft: '16px' }}>
						{item.name}
					</CustomText>
					<StoreFrontTable
						set_open_storefront_user={set_open_storefront_user}
						set_storefront_edit_user={set_storefront_edit_user}
						all_wizshop_users={all_wizshop_users}
						handle_update_form={handle_update_form}
					/>
					{open_storefront_user && (
						<StoreFrontAddUser
							buyer_fields={buyer_fields}
							open={open_storefront_user}
							set_open={set_open_storefront_user}
							storefront_edit_user={storefront_edit_user}
							set_storefront_edit_user={set_storefront_edit_user}
							handle_update_form={handle_update_form}
							all_wizshop_users={all_wizshop_users}
							wizshop_attributes={filter_wizshop_attributes}
						/>
					)}
				</Grid>
			);
	};
	const handle_custom_details = (item: any) => {
		return <CustomSection item={item} style={{ marginTop: '12px', paddingTop: '10px', paddingLeft: '16px' }} />;
	};

	const handle_tax_preferenece = (item: any) => {
		if (item?.is_display !== false)
			return (
				<React.Fragment>
					<CustomText type='H2' className={styles.tax_section_title}>
						{item?.name}
					</CustomText>

					<TaxPreferences items={item} />
				</React.Fragment>
			);
	};
	const handle_other_details = (item: any) => {
		if (item?.is_display !== false)
			return (
				<React.Fragment>
					<CustomText type='H2' id={item?.key} className={styles.tax_section_title}>
						{item.name}
					</CustomText>
					<OtherDetails
						set_show_toast={set_show_toast}
						all_attachments={all_attachments}
						delete_attachment={delete_attachment}
						handle_added_files={handle_added_files}
						item={item}
						uploaded_files={uploaded_files}
						is_loading={upload_loader}
						set_value={setValue}
					/>
				</React.Fragment>
			);
	};

	const render_section = (item: any, error_keys: any) => {
		switch (item.key) {
			case SECTIONS.basic_details:
				return handle_basic_details(item);
			case SECTIONS.contact:
				return handle_contact_details(item, error_keys);
			case SECTIONS.address:
				return handle_address_details(item, error_keys);
			case SECTIONS.tax_section:
				return handle_tax_preferenece(item);
			case SECTIONS.payment_methods:
				return (
					<Can I={PERMISSIONS.view_payment.slug} a={PERMISSIONS.view_payment.permissionType}>
						{handle_payment_details(item)}
					</Can>
				);
			case SECTIONS.preferences:
				return handle_preferance_details(item);
			case SECTIONS.wizshop_users:
				return handle_wizshop_users(item);
			case SECTIONS.other_details:
				return handle_other_details(item);
			default:
				return handle_custom_details(item);
		}
	};

	const contact_section = _.find(buyer_fields?.sections, { key: SECTIONS?.contact });

	const payment_section = _.find(buyer_fields?.sections, { key: SECTIONS?.payment_methods });

	const contact_permission = get_permission(contact_section, '');

	const payment_permission = get_permission(payment_section, '');

	return (
		<React.Fragment>
			{show_add_quick_buyer && (
				<Drawer
					anchor='right'
					open={show_add_quick_buyer}
					onClose={() => set_show_add_quick_buyer(false)}
					content={
						<SelectBuyerPanel
							show_drawer={show_add_quick_buyer}
							toggle_drawer={() => set_show_add_quick_buyer((prev) => !prev)}
							set_is_buyer_add_form={true}
							from_ums={true}
							show_add_quick_buyer={false}
							buyer_data={buyer_fields?.sections}
							set_buyer_data={buyer_fields?.sections}
							show_guest_buyer={false}
							handle_selected_buyer_wizshop={handle_selected_buyer_wizshop}
						/>
					}
				/>
			)}

			{is_loading && (!from_cart || wizshop_lead_id) ? (
				wizshop_lead_id ? (
					<LeadNewCustomerSkeleton />
				) : (
					<BuyerQuickFormSkeleton />
				)
			) : (
				<React.Fragment>
					{!from_cart && handle_render_header()}
					{from_cart && (
						<Box className={styles.header}>
							<Box className={styles.header_title}>
								<Grid container>
									<Grid item display='flex' flexDirection='row' gap='12px'>
										<CustomText className={wizshop_lead_id ? styles.company_name_truncate : styles.title}>
											{wizshop_lead_id ? company_name : 'Add Customer'}
										</CustomText>
										{wizshop_lead_id && <CustomText className={styles.new_customer}>New customer</CustomText>}
									</Grid>
									<Grid item mt={0.5} ml='auto'>
										<Icon onClick={() => set_is_buyer_add_form(false)} iconName='IconX' className={styles.cursor} />
									</Grid>
								</Grid>
							</Box>
						</Box>
					)}

					<Grid container justifyContent={'center'} alignItems={'center'}>
						<FormProvider {...methods}>
							<Grid
								bgcolor={theme?.quick_add_buyer?.background}
								md={from_cart ? 12 : 8}
								xs={from_cart ? 12 : 11}
								borderRadius={'12px'}
								sx={{
									display: 'flex',
									flexDirection: 'column',
									height: exist_customer ? 'calc(100vh - 210px) !important' : 'calc(100vh - 150px) !important',
									overflowY: 'scroll',
								}}
								mt={from_cart ? 9 : 1}>
								{_.map(sorted_data, (item: any, i: number) => {
									const error_keys = _.keys(errors);

									return (
										<Grid key={item?.key}>
											{render_section(item, error_keys)}
											{sorted_data.length === i + 1 ? null : <Grid item />}
										</Grid>
									);
								})}
							</Grid>
						</FormProvider>
					</Grid>
					<DiscardModal is_open_alert={is_open_alert} on_close={on_close} go_back={go_back} />
					{from_cart && (
						<Box className={styles.footer}>
							{exist_customer && (
								<Grid item className={styles.footer_existing_customer}>
									<Grid container className={styles.footer_existing_customer_text}>
										<CustomText type='H6'>{t('Common.ExistingCustomer.ExistingCustomerTitle')}</CustomText>
										<CustomText type='Caption' color={theme.colors.secondary_text}>
											{t('Common.ExistingCustomer.ExistingCustomerSubTitle')}
										</CustomText>
									</Grid>
									<Button
										variant='text'
										sx={{ textWrap: 'nowrap' }}
										onClick={() => {
											set_show_add_quick_buyer(true);
										}}>
										Select customer
										<Icon iconName='IconChevronRight' color={theme.palette.primary.main} />
									</Button>
								</Grid>
							)}
							<Box className={styles.footer_btn}>
								{wizshop_lead_id && (
									<Button variant='outlined' className={styles.cancel_btn} onClick={() => set_is_buyer_add_form(false)}>
										Cancel
									</Button>
								)}
								<Button variant='contained' onClick={handleSubmit(on_submit)} loading={btn_loading}>
									{wizshop_lead_id ? 'Save' : 'Submit'}
								</Button>
							</Box>
						</Box>
					)}
					<AddContactDrawer
						is_visible={show_contact_sheet_detail.is_open}
						close={close_contact_sheet}
						all_contacts={all_contacts.values}
						buyer_fields={buyer_fields}
						contact_index={show_contact_sheet_detail.index}
						selected_value={all_contacts.values[show_contact_sheet_detail.index]}
						primary_contact_id={all_contacts.primary_contact}
						handle_update_form={handle_update_form}
						delete_contact={delete_contact}
						contact_delete_permission={contact_permission?.is_delete}
					/>
					{handle_render_toaster()}
					<AddAddressDrawer
						show_address_sheet_detail={show_address_sheet_detail}
						close={close_address_sheet}
						all_address={all_address.values}
						buyer_fields={buyer_fields}
						selected_value={all_address.values[show_address_sheet_detail.index]}
						primary_address_id={
							show_address_sheet_detail.is_shipping_type ? all_address.default_shipping_address : all_address.default_billing_address
						}
						handle_update_form={handle_update_form}
						delete_address={delete_address}
					/>
					<AddPaymentModal
						all_address={all_address?.values}
						customer_id={all_cards?.customer_id}
						web_token={payment_config?.web_token}
						is_visible={show_payment_sheet_detail.is_open}
						close={close_card_sheet}
						all_cards={all_cards}
						payment_method_id={show_payment_sheet_detail.payment_method_id}
						primary_card_id={all_cards.default_payment_method_id}
						handle_update_form={handle_update_form}
						delete_card={delete_card}
						edit_data={{
							buyer_id: '',
							customer_id: all_cards?.customer_id || '',
							payment_method_id: all_cards.payment_method_ids?.find(
								(item: any) => item?.id === show_payment_sheet_detail?.payment_method_id,
							)?.id,
							...all_cards.payment_method_ids?.find((item: any) => item?.id === show_payment_sheet_detail?.payment_method_id),
						}}
						payment_delete_permission={payment_permission?.is_delete}
					/>
					<CustomerEmailModal
						is_modal_open={is_modal_open}
						set_is_modal_open={set_is_modal_open}
						is_button_loading={is_button_loading}
						handle_final_submit={handle_final_submit}
						email_data={email_data}
						set_email_data={set_email_data}
						email_checkbox={email_checkbox}
						set_email_checkbox={set_email_checkbox}
					/>
				</React.Fragment>
			)}
		</React.Fragment>
	);
};
export default AddQuickBuyer;
