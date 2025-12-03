/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api_requests from 'src/utils/api_requests';
import { document } from './mock/document';
import {
	show_document_alert,
	show_document_toast,
	show_document_toast_message,
	toggle_edit_pending_order,
	toggle_edit_quote,
} from 'src/actions/document';
import { get_document_details_api } from './component/Api/getDocumentDetails';
import { edit_cart, set_buyer, update_buyer } from 'src/actions/buyer';
import { useDispatch, useSelector } from 'react-redux';
import RouteNames from 'src/utils/RouteNames';
import _ from 'lodash';
import order_management from 'src/utils/api_requests/orderManagment';
import { useTranslation } from 'react-i18next';
import { set_notification_feedback } from 'src/actions/notifications';
// import dayjs from 'dayjs';
import {
	BUYER_INFO_SECTION,
	DOCUMENT_SECTION,
	NON_PAYMENT_SECTION,
	SPECIAL_DOCUMENT_ATTRIBUTE,
	PAYMENT_METHOD_SECTION,
	LOADING_CONSTANT,
	EDIT_ORDER_BUYER_CONSTANT,
	DRAWER_TYPES,
	BUYER_SECTIONS,
	BUYER_ADDRESS_TYPE,
	BUYER_ADDRESS_TYPE_ATTRIBUTE_MAP,
	DOCUMENT_LEVEL_ATTRS_KEY_MAP,
} from './constants';
import { useInterval } from './component/Drawer/useInterval';
import utils, { allValuesEmpty, get_cart_metadata, get_customer_metadata } from 'src/utils/utils';
import { getCartCheckoutConfig } from 'src/actions/config';
import { isUUID } from '../Settings/utils/helper';
import cart_management from 'src/utils/api_requests/cartManagement';
import { handle_get_errors } from '../CartSummary/helper';
import { initializeCart } from 'src/actions/cart';
import { useTheme } from '@mui/material/styles';
import constants from 'src/utils/constants';
import { DocumentEntity, FormValuesObj, MappedAddressContact } from 'src/@types/common_types';
import { EmailData } from 'src/common/Interfaces/EmailData';
import useCatalogActions from 'src/hooks/useCatalogActions';
import { convert_date_to_timezone } from 'src/utils/dateUtils';
import { close_toast, show_toast } from 'src/actions/message';
import types from 'src/utils/types';

const initial_show_address_sheet_detail = {
	is_open: false,
	index: 0,
	is_shipping_type: true,
};

const initial_show_contact_sheet_detail = {
	is_open: false,
	index: 0,
};

const initial_loading_state = {
	loading: false,
	is_primary_loading: false,
	is_secondary_loading: false,
	download_loader: false,
	update_document_loader: false,
	apply_discount_loader: false,
	document_change_loader: false,
	edit_cart_loading: false,
};

const initial_edit_order_buyer_state = {
	edit_order_modal_state: false,
	edit_order_modal_type: null,
	edit_order_payload: null,
	edit_order_loader: false,
};

const initial_stepper_state = {
	stepper_state: 0,
	stepper_key: '',
};
const default_sections_mode = {
	payment: 'view',
	quote_details: 'view',
	terms: 'view',
	customer_concent: 'view',
	notes_section: 'view',
	[DOCUMENT_SECTION.sales_rep_details]: 'view',
};
const initial_doc_entity_state = {
	data: null,
	show_sync_back_checkbox: false,
	show_sync_back_info: false,
};

const optional_payment_initial_state = {
	id: 'skip',
	payment_method_id: 'skip',
	value: 'skip',
	is_custom: true,
	type: 'card',
	payment_method_type: 'card',
	title: "I'll select a card later",
	sub_title: 'You can add your payment details later',
	logo: '',
	is_default: false,
	is_selected: false,
};

const useOrderManagement = () => {
	const [document_details, set_document_details] = useState<any>({});
	const [document_attributes, set_document_attributes] = useState<any>([]);
	const [section, set_section] = useState<any>([]);
	const [drawer_state, set_drawer_state] = useState(false);
	const [drawer_type, set_drawer_type] = useState('');
	const [buyer_section_data, set_buyer_section_data] = useState([]);
	const [is_discount_campaign_error, set_is_discount_campaign_error] = useState(false);
	const [refetch, set_refetch] = useState(false);
	const is_confirmed_edit = useSelector((state: any) => state?.settings?.enable_confirmed_order_editing);
	const user_permissions = useSelector((state: any) => state?.login?.permissions);
	const [show_edit_cta, set_show_edit_cta] = useState(true);
	const [section_mode, set_section_mode] = useState(default_sections_mode);
	const [confirmation_action, set_confirmation_action] = useState('');
	const [show_confirmation_modal, set_show_confirmation_modal] = useState(false);
	const [show_contact_sheet_detail, set_show_contact_sheet_detail] = useState(_.cloneDeep(initial_show_contact_sheet_detail));
	const [show_address_sheet_detail, set_show_address_sheet_detail] = useState(_.cloneDeep(initial_show_address_sheet_detail));
	const [buyer_id, set_buyer_id] = useState<any>(null);
	const [buyer_details_form, set_buyer_details_form] = useState<any>({});
	const [fetch_buyer_details, set_fetch_buyer_details] = useState(false);
	const [cart_errors, set_cart_errors] = useState<any>({});
	const [send_email, set_send_email] = useState(false);
	const [review_modal, set_review_modal] = useState({ state: false, data: null });
	const [isview, set_isview] = useState({ state: false, data: null });
	const skip_order_approval = useSelector((state: any) => state?.settings?.skip_order_approval) || false;

	const [loader, set_loader] = useState(initial_loading_state);

	const [is_end_state, set_is_end_state] = useState(false);
	const [buyer_info_data, set_buyer_info_data] = useState({});
	const [buyer_section_loading, set_buyer_section_loading] = useState(false);
	const [show_error, set_show_error] = useState(false);
	const [toast_data, set_toast_data] = useState({
		toast_state: false,
		toast_message: '',
	});
	const [is_error_modal_open, set_is_error_modal_open] = useState(false);

	const [show_tear_sheet, set_show_tear_sheet] = useState(false);
	const [validate_fields, set_validate_fields] = useState<any>([]);
	const [action_type, set_action_type] = useState(null);
	const [previous_action, set_previous_action] = useState(null);

	const [edit_order_buyer_data, set_edit_order_buyer_data] = useState(initial_edit_order_buyer_state);

	const [show_add_card, set_show_add_card] = useState<any>({ state: false, refetch: true });
	const [buyer_addresses, set_buyer_addresses] = useState<any>([]);

	const [customer_id, set_customer_id] = useState<string>('');
	const [is_transaction_complete_modal_visible, set_is_transaction_modal_visible] = useState<boolean>(false);
	const [is_terminal_modal_visible, set_is_terminal_modal_visible] = useState<boolean>(false);
	const [transaction_data, set_transaction_data] = useState<any>(null);
	const [success_toast, set_success_toast] = useState<any>({ open: false, title: '', subtitle: '', state: '' });
	const [table_data, set_table_data] = useState<any>(null);
	const [payment_config, set_payment_config] = useState<any>(null);
	const [isPolling, setIsPolling] = useState<any>({ data: undefined, state: false });
	const [container_loading, set_container_loading] = useState<boolean>(false);
	const [send_email_check, set_send_email_check] = useState<boolean>(true);
	const [active_step, set_active_step] = useState(initial_stepper_state);
	const [download_file_type, set_download_file_type] = useState('pdf');
	const [wizshop_settings, set_wizshop_settings] = useState([]);
	const [original_section_data, set_original_section_data] = useState([]);
	const [expanded, set_expanded] = useState<string[]>([]);
	const [customer_consent_box, set_customer_consent_box] = useState(false);
	const [signature_file, set_signature_file] = useState('');
	const [sync_loading, set_sync_loading] = useState<boolean>(false);
	const [email_data, set_email_data] = useState<EmailData>({
		to_emails: [],
		cc_emails: [],
		bcc_emails: [],
		is_auto_trigger: false,
		is_enable: false,
		user_permission_flag: false,
	});
	const [email_checkbox, set_email_checkbox] = useState<boolean>(true);
	const [payment_email_modal, set_payment_email_modal] = useState<boolean>(false);
	const [payment_email_payload, set_payment_email_payload] = useState({});
	const [is_payment_email_submit_loading, set_is_payment_email_submit_loading] = useState<boolean>(false);
	const [ach_modal, set_ach_modal] = useState(false);
	const [selected_payment_opt, set_selected_payment_opt] = useState({ mode: 'add', type: 'card' });
	const [refetch_payment_options, set_refetch_payment_options] = useState(false);

	const navigate = useNavigate();
	const location = useLocation();
	const param: any = useParams();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const theme: any = useTheme();

	const from_cart = location?.state?.from === 'cart-summary';
	const from_dashboard = location?.state?.from === 'dashboard';
	const from_order_listing = location?.state?.from === 'order-listing';
	const from_buyer_dashboard = location?.state?.from === `buyer/dashboard/${buyer_id}`;
	const from_submitted_quote = location?.state?.from === 'submitted_quote';
	const from_pending_order = location?.state?.from === 'pending_order';
	const from_edit_confirm_order = location?.state?.from === 'confirmed';
	const edited_pending_order = location?.state?.from === 'edited_pending_order';

	const { document_type, document_id, doc_status } = param;
	const { edit_order_modal_type, edit_order_payload } = edit_order_buyer_data;
	const { cart_id, child, orignal_order_id, cart_details } = document_details;
	const linked_id = child?.id || orignal_order_id;
	const [status_404, set_status_404] = useState(false);
	const [fulfilment_status_modal, set_fulfilment_status_modal] = useState(false);
	const [ful_fillment_form, set_ful_fillment_form] = useState<any>({});
	const [document_tag_form, set_document_tag_form] = useState({});
	const [document_tag_modal, set_document_tag_modal] = useState(false);
	const [add_edit_address_data, set_add_edit_address_data] = useState<MappedAddressContact>(initial_doc_entity_state);
	const [add_edit_contact_data, set_add_edit_contact_data] = useState<MappedAddressContact>(initial_doc_entity_state);
	const [manual_payment_status_form, set_manual_payment_status_form] = useState<any>(null);
	const [manual_payment_status_modal, set_manual_payment_status_modal] = useState<boolean>(false);
	const [is_status_updating, set_is_status_updating] = useState<boolean>(false); // Submit btn Loader state for fulfilment_status_modal & manual_payment_status_modal
	const [is_status_form_loading, set_is_status_form_loading] = useState<boolean>(false);
	const [saved_payment_methods_data, set_saved_payment_methods_data] = useState<any>([]);
	const currency = useSelector((state: any) => state?.settings?.currency);
	const { handle_reset_catalog_mode } = useCatalogActions();
	const url_status: string[] = window.location.href.split('/') || '';
	const { VITE_APP_REPO } = import.meta.env;
	const is_store_front = VITE_APP_REPO === 'store_front';
	const is_ultron = VITE_APP_REPO === 'ultron';
	const cart_metadata = get_cart_metadata();
	const customer_metadata = get_customer_metadata({ is_loggedin: true });
	const [optional_payment, set_optional_payment] = useState<any>(optional_payment_initial_state);
	const get_table_data = () => {
		api_requests.order_management
			.get_payment_table(document_id)
			.then((res: any) => {
				if (res?.status === 200) {
					set_table_data(res);
				}
			})
			.catch((err: any) => {
				console.log(err);
			});
	};

	const handleChange = (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
		set_expanded(newExpanded ? [...expanded, panel] : _.remove(expanded, (_panel) => _panel !== panel));
	};

	const handle_drawer_state = (state: boolean) => {
		set_drawer_state(state);
	};

	const complete = (res: any) => {
		get_table_data();
		set_refetch((prev: boolean) => !prev);
		if (res?.collect_payment_method === 'payment_link') {
			handle_drawer_state(false);
			set_success_toast({
				open: true,
				title: res?.transaction_status !== 'failed' ? 'Payment link sent' : 'Error sending payment link',
				subtitle: res?.transaction_status === 'failed' && 'Please try again',
				state: res?.transaction_status !== 'failed' ? 'success' : 'warning',
			});
		} else if (res?.collect_payment_method === 'manual') {
			handle_drawer_state(false);
			set_success_toast({
				open: true,
				title: res?.transaction_status === 'success' ? 'Payment collected' : 'Payment failed',
				subtitle: '',
				state: res?.transaction_status === 'success' ? 'success' : 'error',
			});
		} else if (res?.collect_payment_method === 'card') {
			set_transaction_data(res);
			set_is_transaction_modal_visible(true);
		} else if (res?.collect_payment_method === 'terminal') {
			set_transaction_data(res);
			set_is_terminal_modal_visible(true);
		}
	};

	const handle_update_stepper = (step: number, key: string) => {
		set_active_step({ stepper_state: step, stepper_key: key });
		const queryParams = new URLSearchParams(location.search);
		queryParams.set('step', key?.toString());
		window.history.replaceState(null, null, `${location.pathname}?${queryParams}`);
	};

	useInterval(
		async () => {
			if (isPolling?.state) {
				if (transaction_data?.retry_count <= transaction_data?.max_retry_count) {
					api_requests.order_management
						.get_payment_status({
							transaction_id: isPolling?.data?.transaction_id,
							track_id: isPolling?.data?.track_id,
							retry_count: transaction_data?.retry_count,
						})
						.then((res: any) => {
							if (res?.transaction_status !== 'pending') {
								setIsPolling({ data: undefined, state: false });
								complete(res);
							} else {
								set_transaction_data(res);
							}
						})
						.catch((err: any) => {
							console.log(err);
							complete({ ...isPolling?.data, transaction_status: 'failed' });
							setIsPolling({ data: undefined, state: false });
						});
				} else {
					complete({ ...isPolling?.data, transaction_status: 'failed' });
					setIsPolling({ data: undefined, state: false });
				}
			}
		},
		isPolling ? transaction_data?.retry_frequency * 1000 : null,
	);

	const handle_get_payment_config = () => {
		api_requests.order_management
			.get_payment_config({ document_id })
			.then((res: any) => {
				if (res?.status === 200) {
					set_payment_config(res);
				}
			})
			.catch((err: any) => {
				console.log(err);
			});
	};

	const handle_loading_state = (key: any, value: boolean) => {
		set_loader((prev) => ({ ...prev, [key]: value }));
	};

	const handle_update_edit_order_data = (key: any, value: any) => {
		set_edit_order_buyer_data((prev) => ({ ...prev, [key]: value }));
	};

	const handle_update_edit_order_modal = (modal_state: boolean, modal_type: any) => {
		set_edit_order_buyer_data((prev: any) => ({
			...prev,
			[EDIT_ORDER_BUYER_CONSTANT.modal_state]: modal_state,
			[EDIT_ORDER_BUYER_CONSTANT.modal_type]: modal_type,
		}));
	};

	const handle_get_status_action = (data: any) => {
		const document_type_data: any = document_type === document.DocumentTypeEnum.ORDER ? document?.ORDER_ACTIONS : document?.QUOTE_ACTIONS;
		const show_change_attributes = document_type_data[data?.document_status]?.modify_attributes;
		if (data?.document_status !== document?.DocumentStatus?.draft && document_type !== document.DocumentTypeEnum.ORDER) {
			dispatch(show_document_alert(false));
		} else if (document_type === document.DocumentTypeEnum.QUOTE) {
			dispatch(show_document_alert(false));
		}
		set_show_edit_cta(show_change_attributes);
	};

	const handle_drawer_type = (props_type: string) => {
		set_drawer_type(props_type);
	};

	const handle_reset_state = () => {
		set_edit_order_buyer_data(initial_edit_order_buyer_state);
	};

	const get_line_items = (unit: string) => {
		const line_items: any = _.cloneDeep(cart_details?.items);
		_.forEach(_.keys(line_items), (product_id: string) => {
			_.forEach(_.keys(line_items[product_id]), (key: string) => {
				if (isUUID(key)) {
					line_items[product_id][key] = {
						...line_items[product_id][key],
						item_volume_unit: unit,
						item_volume: cart_details?.products?.[product_id]?.volume,
					};
				}
			});
		});
		return line_items;
	};

	const handle_update_document_cart = async (containers: any[] = [], container_is_display = false) => {
		set_container_loading(true);
		const discount_data = cart_details?.charges?.find((c: any) => c?.charge_type === 'discount');

		let items = containers?.length === 0 ? cart_details?.items : get_line_items(_.head(containers)?.unit);
		Object?.keys(items)?.forEach((key) => {
			// Delete the 'id' and 'parent_id' properties from each object
			delete items[key].id;
			delete items[key].parent_id;
		});

		try {
			const payload = {
				cart_id,
				buyer_id,
				items,
				containers, //: [{ ...containers, unit: cart_container_config?.tenant_container_default_unit }],
				charges: discount_data ? [discount_data] : [],
				document_id,
				container_is_display,
			};

			// const response: any =
			await cart_management.update_document(payload, false);

			// set_is_primary_loading(false);
			// navigate_to_document(response.type, document_id, response?.document_status);
		} catch (error: any) {
			// set_is_primary_loading(false);
			if (error?.response?.status === 404) {
				// set_cart_loading(false);
				// set_show_alert(true);
				// set_refetch_data(!refetch_data);
				// set_is_error_modal_open(true);
			}
			// toggle_toast({ show: true, message: error?.message, title: 'Something Went Wrong', status: 'warning' });
		} finally {
			set_container_loading(false);
		}
		// set_cart({});
		// handle_no_product_cart();
	};

	const handle_update_document = async (attr: any, additional_callback?: () => void, set_btn_loading?: (value: boolean) => void) => {
		handle_reset_state();
		handle_loading_state(LOADING_CONSTANT.update_document_loader, true);
		let updated_document_attributes: any = attr;
		const is_email_keys = _.keys(attr)?.includes(SPECIAL_DOCUMENT_ATTRIBUTE.notification_email_ids);
		if (!is_email_keys) {
			updated_document_attributes = _.mapValues(attr, (item: any) => (_.isArray(item) ? _.join(item, ',') : item));
		}
		api_requests.order_management
			.update_document_attributes({
				document_id,
				attributes: updated_document_attributes,
			})
			.then((res: any) => {
				if (res.status === 200) {
					set_drawer_state(false);
					set_section_mode(default_sections_mode);
					set_document_attributes((prev: any) => {
						return {
							...prev,
							...updated_document_attributes,
						};
					});

					// [Suyash 26/09/24] commentted for testing, do not delete
					// set_refetch((prev) => !prev);
					handle_loading_state(LOADING_CONSTANT.update_document_loader, false);
					set_btn_loading(false);
					if (additional_callback) {
						additional_callback();
					}
				}
			})
			.catch((err) => {
				handle_loading_state(LOADING_CONSTANT.update_document_loader, false);
				console.log(err);
			})
			.finally(() => {
				if (set_btn_loading) set_btn_loading(false);
			});
	};

	const handle_backend_update_document = async () => {
		try {
			let updated_document_attributes: any = document_attributes;
			const is_email_keys = _.keys(document_attributes)?.includes(SPECIAL_DOCUMENT_ATTRIBUTE.notification_email_ids);
			if (!is_email_keys) {
				updated_document_attributes = _.mapValues(document_attributes, (item: any) => (_.isArray(item) ? _.join(item, ',') : item));
			}
			await api_requests.order_management.update_document_attributes({
				document_id,
				attributes: updated_document_attributes,
			});
		} catch (err) {
			console.log(err);
		}
	};

	const handle_show_order = (updated_quote: any) => {
		const new_document_id = updated_quote?.new_document_id;
		navigate(`${RouteNames.product.review.routing_path}order/${new_document_id}`, { replace: true });
		dispatch(show_document_alert(true));
	};

	const handle_validate_fields = () => {
		let is_valid: boolean = validate_fields?.some((ele: any) => allValuesEmpty(document_attributes[ele]));
		return is_valid;
	};

	const handle_show_cta_loader = (status: any) => {
		return status === 'cancel' && document_details?.document_status === 'pending-approval';
	};

	const handle_convert_action = (updated_quote: any) => {
		handle_show_order(updated_quote);
		handle_loading_state(LOADING_CONSTANT.secondary_loader, false);
		dispatch(toggle_edit_quote(false));
		set_show_confirmation_modal(false);
	};

	const handle_update_cart = async () => {
		try {
			const response_data: any = await cart_management.get_cart({ buyer_id, is_guest_buyer: false });
			const response: any = await cart_management.get_cart_details({ cart_id: response_data?.data?.[0]?.id });
			const { cart: cart_response } = response;
			dispatch<any>(set_buyer({ buyer_id, is_guest_buyer: false }));
			const { items = {}, products: res_product = {} } = cart_response;

			if (items && Object.keys(items)?.length > 0) {
				for (let item in items) {
					// eslint-disable-next-line @typescript-eslint/no-shadow
					const { id, parent_id } = res_product[item];
					items[item].parent_id = parent_id;
					items[item].id = id;
				}
			}
			dispatch(
				initializeCart({
					id: cart_response?.id,
					products: items,
					products_details: res_product,
					document_items: cart_response?.document_items || {},
				}),
			);
		} catch (error) {
			console.error('Error fetching user list:', error);
		}
	};
	const handle_status_actions = (status: any) => {
		const route = `/review/${document_type}/${document_id}/${status}`;
		const handle_route = () => {
			handle_loading_state(LOADING_CONSTANT.secondary_loader, false);
			set_is_end_state(false);
			navigate(route, {
				replace: true,
				state: {
					from: from_cart ? 'cart-summary' : undefined,
				},
			});
			set_refetch((prev) => !prev);
		};
		!is_ultron && handle_update_cart();
		if (status === 'reject' || status === 'pending-approval') {
			handle_loading_state(LOADING_CONSTANT.loader, true);
			setTimeout(() => {
				handle_loading_state(LOADING_CONSTANT.loader, false);
			}, 1500);
		} else if (doc_status === 'pending-approval' && status === 'confirm') {
			handle_loading_state(LOADING_CONSTANT.loader, false);
		}
		handle_route();
	};

	const handle_update_document_status = async (status: any) => {
		const updated_quote = await api_requests.order_management.update_document_status(
			skip_order_approval ? 'confirm' : status,
			{
				document_id,
				is_auto_trigger: email_checkbox,
				override_to_emails: is_store_front ? undefined : email_data.to_emails,
			},
			false,
		);
		//show toast for every status except confirm and submit
		if (status !== 'confirm' && status !== 'submit') {
			is_ultron && dispatch(show_document_toast(true));
		}
		//if status is convert, navigate to converted to order page
		if (status === document.DocumentAction.convert && document_type === document.DocumentTypeEnum.QUOTE) {
			handle_convert_action(updated_quote);
			//perfom action for these statues
		} else if (['submit', 'confirm', 'cancel', 'reject', 'expire', 'pending-approval'].includes(status)) {
			handle_status_actions(status);
		} else {
			//fallback case
			handle_loading_state(LOADING_CONSTANT.secondary_loader, false);
			navigate(RouteNames.order_management.order_list.path);
		}
		set_show_confirmation_modal(false);
	};

	const handle_failure_actions = (err: any, show_error_modal = true) => {
		console.log(err);
		set_show_confirmation_modal(false);
		set_loader((prev) => ({ ...prev, is_primary_loading: false, is_secondary_loading: false }));
		set_is_end_state(false);
		if (show_error_modal) {
			set_is_error_modal_open(true);
			set_is_discount_campaign_error(true);
			set_is_discount_campaign_error(
				err?.response?.data?.cart_errors?.meta?.cart_products_unavailable ||
					err?.response?.data?.cart_errors?.meta?.discount_campaign_not_valid,
			);
		}
	};

	const handle_document_status = async (status: any) => {
		dispatch(show_document_alert(false));

		if (!status || handle_show_cta_loader(status)) {
			handle_loading_state(LOADING_CONSTANT.primary_loader, true);
		} else if (['submit', 'confirm', 'convert', 'pending-approval'].includes(status)) {
			//validate fields for these statues
			if (handle_validate_fields()) {
				set_show_error(true);
				set_show_confirmation_modal(false);
				return;
			}
			handle_loading_state(LOADING_CONSTANT.secondary_loader, true);
		} else if (['cancel', 'reject', 'expire'].includes(status)) {
			set_is_end_state(true);
		}

		if (is_ultron) {
			try {
				//handle success
				await handle_backend_update_document();
			} catch (err) {
				//handle error
				handle_failure_actions(err);
			}
		}
		if (!status) {
			//if status doesn't exist
			handle_loading_state(LOADING_CONSTANT.primary_loader, false);
			dispatch(show_document_toast(true));
			navigate(RouteNames.order_management.order_list.path);
			set_show_confirmation_modal(false);
			return;
		}

		if (handle_show_cta_loader(status)) {
			handle_loading_state(LOADING_CONSTANT.primary_loader, false);
		}

		if (status) {
			try {
				//handle success
				await handle_update_document_status(status);
			} catch (err: any) {
				//handle error
				if (err?.response?.status === 402) {
					const { title = '', message = '' } = err?.response?.data;
					set_success_toast({
						open: true,
						title,
						subtitle: message,
						state: 'warning',
					});

					handle_failure_actions(err, false);
				} else {
					handle_failure_actions(err);
				}
			}
		}
	};

	const handle_delete_document_api = () => {
		order_management
			.update_document_status('delete', {
				document_id: document_details?.id,
			})
			.then((res: any) => {
				if (res?.status === 200) {
					set_success_toast({
						open: true,
						title: `${document_type === 'order' ? 'Order' : 'Quote'} deleted successfully `,
						subtitle: '',
						state: 'success',
					});

					setTimeout(() => {
						navigate(RouteNames.order_management.order_list.path);
					}, 1000);
				}
			})
			.catch((err) => {
				console.error(err);
			});
	};

	const handle_navigation_to_draft = (id = buyer_id, type = 'repeat') => {
		handle_loading_state(LOADING_CONSTANT.loader, true);
		handle_loading_state(LOADING_CONSTANT.document_change_loader, true);
		const payload =
			document_details?.entity_source === 'website' && document_details?.source === 'Website'
				? {
						document_id: document_details?.id,
						buyer_id: id,
				  }
				: {
						document_id: document_details?.id,
						buyer_id: id,
						reference_user_id: document_details?.created_by,
				  };
		order_management
			.get_duplicate_document(payload)
			.then((response: any) => {
				if (response?.status_code === 200) {
					set_success_toast({
						open: true,
						title: `${type === 'repeat' ? 'Repeating' : 'Duplicating'} ${document_type}`,
						subtitle: '',
						state: 'success',
					});
					setTimeout(() => {
						handle_loading_state(LOADING_CONSTANT.loader, false);
						navigate(`/checkout/${document_type}/${response?.data?.document_id}?step=review`, {
							replace: true,
						});
					}, 2000);
					handle_loading_state(LOADING_CONSTANT.document_change_loader, false);
				}
			})
			.catch((err) => {
				set_success_toast({
					open: true,
					title: `${type === 'repeat' ? 'Repeating' : 'Duplicating'} ${document_type} failed`,
					subtitle: '',
					state: 'warning',
				});
				console.error(err);
				handle_loading_state(LOADING_CONSTANT.document_change_loader, false);
				handle_loading_state(LOADING_CONSTANT.loader, false);
			});
	};

	const handle_edit_quote = () => {
		handle_loading_state(LOADING_CONSTANT.primary_loader, true);
		dispatch(toggle_edit_quote(false));
		navigate(`/review/${document_type}/${document_id}`, {
			state: { from: 'submitted_quote' },
		});
		handle_loading_state(LOADING_CONSTANT.primary_loader, false);
		set_show_confirmation_modal(false);
	};

	const handle_update_pending_order = async (status_type: string) => {
		if (handle_validate_fields()) {
			set_show_error(true);
			return;
		}
		const update_key = status_type === document.DocumentStatus?.confirmed ? 'confirm-update' : 'pending-approval-update';

		handle_loading_state(LOADING_CONSTANT.primary_loader, true);
		try {
			await handle_backend_update_document();
			await api_requests.order_management.update_document_status(
				update_key,
				{ document_id, is_auto_trigger: email_checkbox, override_to_emails: email_data?.to_emails || [] },
				false,
			);
			dispatch(toggle_edit_pending_order(true));
			navigate(`/review/${document_type}/${document_id}/${status_type}`, {
				state: {
					from: 'edited_pending_order',
				},
			});
			handle_loading_state(LOADING_CONSTANT.primary_loader, false);
		} catch (err) {
			handle_loading_state(LOADING_CONSTANT.primary_loader, false);
			console.log(err);
		}
	};

	const handle_re_submit_quote = async (status: string) => {
		const route = `/review/${document_type}/${document_id}/${status}`;
		if (handle_validate_fields()) {
			set_show_error(true);
			return;
		}
		handle_loading_state(LOADING_CONSTANT.primary_loader, true);
		dispatch(show_document_alert(false));
		set_show_confirmation_modal(false);

		try {
			await handle_backend_update_document();
			await api_requests.order_management.update_document_status(
				'resubmit',
				{ document_id, is_auto_trigger: email_checkbox, override_to_emails: email_data?.to_emails || [] },
				false,
			);
			handle_loading_state(LOADING_CONSTANT.primary_loader, false);

			navigate(route, {
				replace: true,
				state: {
					from: from_cart ? 'cart-summary' : undefined,
				},
			});

			dispatch(toggle_edit_quote(false));
		} catch (err) {
			console.log(err);
			handle_loading_state(LOADING_CONSTANT.primary_loader, false);
		}
	};

	const handle_get_sections = (sections: any) => {
		if (is_ultron) {
			const validate_field_arr: any[] = sections?.flatMap((item: any) =>
				item?.attributes?.filter((attr: any) => attr?.required)?.map((attr: any) => attr?.id),
			);
			set_validate_fields(validate_field_arr);
		} else {
			const validate_field_arr: any[] = sections
				?.flatMap((item: any) => {
					if (item?.is_display) {
						return item?.attributes?.filter((attr: any) => attr?.required && attr?.is_display)?.map((attr: any) => attr?.id);
					}
				})
				?.filter((item: any) => item !== undefined);
			set_validate_fields(validate_field_arr);
		}

		const notes_section = _.find(sections, { key: DOCUMENT_SECTION.notes });
		const type_specific_section = _.find(sections, { key: DOCUMENT_SECTION.order_details });
		const user_details_section = _.filter(sections, (item) => BUYER_INFO_SECTION.includes(item.key));
		const payment_section = _.filter(
			sections,
			(item) =>
				![
					...NON_PAYMENT_SECTION,
					...BUYER_INFO_SECTION,
					...PAYMENT_METHOD_SECTION,
					DOCUMENT_SECTION.customer_consent,
					DOCUMENT_SECTION.sales_rep_details,
				].includes(item?.key),
		);
		const payment_method_section = _.find(sections, { key: SPECIAL_DOCUMENT_ATTRIBUTE.payment_method_v2 });
		const terms_and_conditions_section = _.filter(sections, (item) => item?.key === DOCUMENT_SECTION.terms_and_conditions);
		const customer_consent = _.find(sections, { key: DOCUMENT_SECTION.customer_consent });
		const sales_rep_details_section = _.find(sections, { key: DOCUMENT_SECTION.sales_rep_details });

		let transformed_section: any = {
			notes: notes_section,
			specific_section: type_specific_section,
			user_details: user_details_section,
			payment_method: payment_method_section,
			other_section: {
				payment_section,
				terms_and_conditions_section,
			},
			customer_consent,
			sales_rep_details_section,
		};
		set_section(transformed_section);
	};

	const get_addresses = (addresses: any, also_needs_id: boolean = false) => {
		return addresses?.map((address: any) => {
			const transformedAddress: any = {};
			_.forEach(address?.attributes, (attr) => {
				const value = _.get(attr, 'value');
				if (_.get(attr, 'id') === 'country') {
					transformedAddress[attr.id] = value;
				} else if (value !== null && value !== undefined) {
					transformedAddress[attr.id] = value;
				}
			});
			if (also_needs_id) {
				return { ...transformedAddress, id: address?.id };
			} else {
				return transformedAddress;
			}
		});
	};

	const handle_get_buyer_details = async (_buyer_id: any, document_status: string = '') => {
		set_buyer_section_loading(true);
		try {
			const res: any = await api_requests.buyer.get_buyer_details(_buyer_id);
			if (res?.status === 200) {
				set_buyer_section_data(res?.data);
				set_buyer_section_loading(false);
				const buyer_addresses_temp = _.find(res?.data?.sections, (item: any) => item?.key === 'addresses')?.addresses || [];
				set_buyer_addresses(get_addresses(buyer_addresses_temp));
				if (document_status === 'draft') {
					set_document_attributes((prev: any) => {
						const address_with_id = get_addresses(buyer_addresses_temp, true);

						const updated_billing_address = _.find(address_with_id, { id: prev?.billing_address.id }) || prev?.billing_address;
						const updated_shipping_address = _.find(address_with_id, { id: prev?.shipping_address.id }) || prev?.shipping_address;
						if (!_.isEqual(updated_billing_address, prev?.billing_address)) {
							handle_update_document({ billing_address: updated_billing_address });
							prev.billing_address = updated_billing_address;
						}
						if (!_.isEqual(updated_shipping_address, prev?.shipping_address)) {
							handle_update_document({ shipping_address: updated_shipping_address });
							prev.shipping_address = updated_shipping_address;
						}

						return prev;
					});
				}
			}
		} catch (err) {
			console.log(err);
		} finally {
			set_buyer_section_loading(false);
		}
	};

	const handle_update_order = () => {
		switch (edit_order_modal_type) {
			case SPECIAL_DOCUMENT_ATTRIBUTE.primary_contact:
			case SPECIAL_DOCUMENT_ATTRIBUTE.billing_address:
			case SPECIAL_DOCUMENT_ATTRIBUTE.shipping_address:
				handle_update_document({ [SPECIAL_DOCUMENT_ATTRIBUTE[drawer_type]]: edit_order_payload });
				break;
			case SPECIAL_DOCUMENT_ATTRIBUTE.notes_settings:
				handle_update_document({ [SPECIAL_DOCUMENT_ATTRIBUTE.notes_settings]: edit_order_payload });
				break;
			default:
				handle_update_document(edit_order_payload);
				break;
		}
	};

	const handle_update_buyer_order_details = async (data: any) => {
		handle_update_edit_order_data(EDIT_ORDER_BUYER_CONSTANT.loader, true);
		api_requests.order_management
			.update_buyer_order_details(data, document_details?.type)
			.then((res: any) => {
				if (res?.status === 200) {
					handle_update_edit_order_data(EDIT_ORDER_BUYER_CONSTANT.loader, false);
					handle_update_order();
				}
			})
			.catch((err) => {
				console.log(err);
				handle_update_edit_order_data(EDIT_ORDER_BUYER_CONSTANT.loader, false);
			});
	};

	const checking_order_close_for_editing = (res: any) => {
		if (['pending-approval', 'confirmed', 'cancelled'].includes(res?.document_status) && url_status?.length < 7) {
			return true;
		} else {
			return false;
		}
	};

	const handle_get_document_details = async () => {
		handle_loading_state(LOADING_CONSTANT.loader, true);
		api_requests.order_management
			.get_document_details({ document_id })
			.then((res: any) => {
				if (res?.status === 200) {
					if (checking_order_close_for_editing(res)) {
						dispatch<any>(
							show_toast({
								open: true,
								showCross: true,
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
								state: types.WARNING_STATE,
								title: 'Order is already closed',
								subtitle: '',
								showActions: false,
							}),
						);
						navigate('/all-products');
					}
					if (is_store_front && res?.document_status === 'draft') {
						dispatch(
							initializeCart({
								id: res?.cart_id,
								products: res?.cart_details?.items,
								products_details: res?.cart_details?.products,
								document_items: res?.document_items || {},
							}),
						);
					}
					const attr = _.get(res, 'attributes', {});
					const send_emails_on_order = _.get(attr, 'send_emails_on_order', true);
					const _customer_consent_box = _.get(attr, 'customer_consent', false);
					const _signature_file = _.get(attr, 'signature', '');
					set_buyer_id(res?.buyer_id);
					set_document_attributes(res?.attributes);
					set_document_details(res);
					const errors = handle_get_errors(res?.cart_details);
					set_cart_errors(errors);
					set_send_email_check(send_emails_on_order);
					set_customer_consent_box(_customer_consent_box ?? false);
					set_signature_file(_signature_file);
					handle_get_status_action(res);
					handle_get_buyer_details(res?.buyer_id, res?.document_status);
					if (from_submitted_quote || (from_cart && res?.document_status === document?.DocumentStatus?.submitted && !doc_status)) {
						dispatch(toggle_edit_quote(true));
					} else if (
						from_pending_order ||
						(from_cart && res?.document_status === document?.DocumentStatus?.pendingApproval && !doc_status)
					) {
						dispatch(toggle_edit_pending_order(true));
					} else if (
						from_edit_confirm_order ||
						(from_cart && res?.document_status === document?.DocumentStatus?.confirmed && !doc_status)
					) {
						dispatch(toggle_edit_pending_order(true));
					} else {
						dispatch(toggle_edit_quote(false));
						dispatch(toggle_edit_pending_order(false));
					}
				}
			})
			.catch((err) => {
				handle_loading_state(LOADING_CONSTANT.loader, false);
				console.log(err);
				set_status_404(true);
			});

		api_requests.order_management
			.get_document_setting(document_type)
			.then((res: any) => {
				if (res?.status === 200) {
					handle_get_sections(res?.sections);
					set_original_section_data(res?.sections);
				}
			})
			.catch((err) => {
				handle_loading_state(LOADING_CONSTANT.loader, false);
				console.log(err);
			});

		api_requests.buyer
			.get_main_buyer_details_form()
			.then((res: any) => {
				if (res?.status === 200) {
					set_buyer_details_form(res?.data);
				}
			})
			.catch((err) => {
				console.log(err);
			});
		handle_loading_state(LOADING_CONSTANT.loader, false);
	};

	const handle_edit_cart_navigation = (from_route: any) => {
		if (from_submitted_quote) {
			navigate(`${RouteNames.cart.path}?is_document_cart=true`, {
				state: {
					from: 'submitted_quote',
				},
			});
		} else if (from_pending_order && !from_route) {
			navigate(`${RouteNames.cart.path}?is_document_cart=true`, {
				state: {
					from: 'pending_order',
				},
			});
		} else if (from_route) {
			navigate(`${RouteNames.cart.path}?is_document_cart=true`, {
				state: {
					from: from_route,
				},
			});
		} else {
			navigate(`${RouteNames.cart.path}?is_document_cart=true`);
		}
	};

	const handle_edit = async (from_route?: string) => {
		try {
			const resync_data: any = await cart_management.resync_cart(cart_id);
			if (resync_data?.status === 200) {
				const response_cart: any = await edit_cart({ buyer_id, cart_id });
				dispatch(update_buyer({ buyer_cart: response_cart?.buyer_cart, buyer_info: response_cart?.buyer_info }));
				handle_edit_cart_navigation(from_route);
				set_show_confirmation_modal(false);
			}
		} catch (err) {
			console.error(err);
		} finally {
			handle_loading_state(LOADING_CONSTANT.edit_cart_loading, false);
		}
	};

	const handle_go_to_order = async () => {
		if (!linked_id) {
			return;
		}

		let type =
			child?.type ||
			(document_type === document.DocumentTypeEnum?.ORDER
				? t('OrderManagement.useOrderManagement.Quote')
				: t('OrderManagement.useOrderManagement.Order'));

		const { document_status }: any = await get_document_details_api(linked_id, true);

		const path =
			document_status !== document?.DocumentStatus?.draft
				? `${RouteNames.product.review.routing_path}${type}/${linked_id}/${document_status}`
				: `${RouteNames.product.review.routing_path}order/${linked_id}`;

		if (document_status) {
			navigate(path, {
				replace: true,
				state: {
					from: document_status !== document?.DocumentStatus?.draft ? 'order-listing' : undefined,
				},
			});
		}
	};

	const handle_navigate_back = async () => {
		if (from_dashboard || from_buyer_dashboard || from_order_listing) {
			navigate(-1);
			return;
		}

		const { document_end_status_flag, document_status }: any = await get_document_details_api(document_id, true);

		if (document_status === document?.DocumentStatus?.submitted && from_cart && doc_status) {
			handle_edit('submitted_quote_page');
			return;
		}

		if (document_end_status_flag || edited_pending_order) {
			is_ultron ? navigate(RouteNames.order_management.order_list.path) : navigate(RouteNames.account.orders.path);
			return;
		}
		if (from_cart && document_status === document?.DocumentStatus?.pendingApproval) {
			is_ultron ? navigate(RouteNames.order_management.order_list.path) : navigate(RouteNames.account.orders.path);
			return;
		}

		if ((from_cart || from_submitted_quote || from_pending_order) && !document_end_status_flag) {
			handle_edit();
			return;
		}

		if ((from_cart || from_submitted_quote) && document_end_status_flag) {
			set_toast_data({
				toast_state: true,
				toast_message: t('OrderManagement.useOrderManagement.NotEditable', { status: document_status }),
			});
			return;
		}
		navigate(-1);
	};

	const handle_edit_cart = async (from_route?: string) => {
		handle_reset_catalog_mode();
		handle_loading_state(LOADING_CONSTANT.edit_cart_loading, true);
		const { document_status, document_end_status_flag }: any = await get_document_details_api(document_id, true);
		if (!document_end_status_flag) {
			handle_edit(from_route);
		} else if (is_confirmed_edit && _.find(user_permissions, { slug: 'edit_confirmed_orders' })?.toggle) {
			handle_edit(document_status);
		} else {
			set_toast_data({
				toast_state: true,
				toast_message: t('OrderManagement.useOrderManagement.NotEditable', { status: document_status }),
			});
			handle_loading_state(LOADING_CONSTANT.edit_cart_loading, true);
		}
	};

	const get_order_summary_ultron = (tenant_id: any, download_type: string) => {
		order_management
			.get_order_summary(tenant_id, document_id, download_type)
			.then((response: any) => {
				if (response?.data) {
					dispatch(set_notification_feedback(true));
					set_show_tear_sheet(false);
					handle_loading_state(LOADING_CONSTANT.download_loader, false);
				}
			})
			.catch((error: any) => {
				console.error(t('OrderManagement.useOrderManagement.ErrorDownloading'), error);
				dispatch(
					show_document_toast_message({
						title: t('OrderManagement.useOrderManagement.Error'),
						sub: t('OrderManagement.useOrderManagement.TryAgain'),
					}),
				);
				dispatch(show_document_toast(true));
				handle_loading_state(LOADING_CONSTANT.download_loader, false);
			});
	};

	const get_order_summary_store_front = (tenant_id: string, download_type: string) => {
		set_show_tear_sheet(false);
		order_management
			.get_order_summary_v2(tenant_id, document_id, download_type || download_file_type)
			.then((response: any) => {
				if (response?.data) {
					dispatch(set_notification_feedback(true));
					handle_loading_state(LOADING_CONSTANT.download_loader, false);
					window.open(response?.data?.url, '_blank');
				}
			})
			.catch((error: any) => {
				console.error(t('OrderManagement.useOrderManagement.ErrorDownloading'), error);
				dispatch(
					show_document_toast_message({
						title: t('OrderManagement.useOrderManagement.Error'),
						sub: t('OrderManagement.useOrderManagement.TryAgain'),
					}),
				);
				dispatch(show_document_toast(true));
				handle_loading_state(LOADING_CONSTANT.download_loader, false);
			});
	};

	const handle_get_order_summary = (tenant_id: any, download_type: any) => {
		is_ultron ? get_order_summary_ultron(tenant_id, download_type) : get_order_summary_store_front(tenant_id, download_type);
	};

	const get_order_summary = (tenant_id: any, download_type: string) => {
		set_download_file_type(download_type);
		dispatch(
			show_document_toast_message({
				title: t('OrderManagement.useOrderManagement.Downloading'),
				sub: t('OrderManagement.useOrderManagement.DownloadInProgress'),
			}),
		);
		dispatch(show_document_toast(true));
		handle_get_order_summary(tenant_id, download_type);
	};

	const close_contact_sheet = () => {
		set_show_contact_sheet_detail(_.cloneDeep(initial_show_contact_sheet_detail));
	};

	const close_address_sheet = () => {
		set_show_address_sheet_detail(_.cloneDeep(initial_show_address_sheet_detail));
	};

	const handle_update_document_entity = useCallback(
		(
			entities: DocumentEntity[],
			selected_entity_id: string | null,
			entity_type: string,
			edited_data: any,
			is_clear = false,
			additional_callback?: () => void,
			set_btn_loading?: (value: boolean) => void,
		) => {
			const entity = _.find(entities, { id: selected_entity_id }) as DocumentEntity | undefined;

			let updated_attributes_data;

			if (!entity) {
				// If the entity is not found, create the payload with id and edited_data
				updated_attributes_data = { ...edited_data, ...(selected_entity_id ? { id: selected_entity_id } : {}) };
			} else {
				// If the entity is found, create the payload with the existing enity and edited_data
				const id = entity?.id;
				const attrs: any = {};

				_.map(entity?.attributes, (attr) => {
					attrs[attr?.id] = edited_data?.[attr?.id] || _.find(edited_data?.attributes, { id: attr?.id })?.value;
				});

				updated_attributes_data = {
					id,
					...attrs,
				};
			}
			// This is a special case of clear, where we need to remove the entity if the selected_entity_id is null
			if (selected_entity_id === null && is_clear) {
				updated_attributes_data = null;
			}
			handle_update_document({ [SPECIAL_DOCUMENT_ATTRIBUTE[entity_type]]: updated_attributes_data }, additional_callback, set_btn_loading);
		},
		[document_id],
	);

	const handle_contact_add = async (key: string, value: any, set_btn_loading?: (value: boolean) => void) => {
		if (set_btn_loading) set_btn_loading(true);
		const is_edit = !!add_edit_contact_data?.data;
		let payload = _.cloneDeep(value);
		payload = _.mapValues(
			{
				..._.omit(payload, is_edit ? ['is_primary'] : ['id', 'is_primary']),
			},
			(val: any) => (_.isArray(val) ? _.join(val, ',') : val),
		);
		const { [DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_KEY]: save_changes_to_customer_profile = true, ...buyer_payload } = payload;
		const should_save_to_customer_profile = utils.should_sync_to_customer(add_edit_contact_data, save_changes_to_customer_profile, is_edit);
		const should_remove_id =
			(buyer_payload?.id &&
				_.get(payload, DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_VALUE_KEY, false) &&
				_.get(payload, DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_KEY, true)) ||
			_.includes(buyer_payload?.id, 'temp_');
		try {
			const contact_section = _.find((buyer_section_data as any).sections, { key: BUYER_SECTIONS.contact });
			const all_contacts = contact_section?.contacts || [];
			const document_payload = {
				...buyer_payload,
				[DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_VALUE_KEY]: !should_save_to_customer_profile,
			};

			if (!should_save_to_customer_profile) {
				delete document_payload.id;
			}
			let updated_contact_id;
			if (should_save_to_customer_profile) {
				if (_.has(buyer_payload, DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_VALUE_KEY)) {
					delete buyer_payload[DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_VALUE_KEY];
				}
				if (should_remove_id) {
					delete buyer_payload.id;
				}
				const api_request =
					is_edit && buyer_payload?.id
						? api_requests.buyer.update_buyer_contact(buyer_id, buyer_payload)
						: api_requests.buyer.add_buyer_contact(buyer_id, buyer_payload);
				const res: any = await api_request;
				if (res?.success) {
					updated_contact_id = res?.contact_id || res?.data?.contact_id;
					set_fetch_buyer_details(!fetch_buyer_details);
				}
			}
			handle_update_document_entity(
				all_contacts,
				should_save_to_customer_profile ? updated_contact_id : crypto?.randomUUID(),
				SPECIAL_DOCUMENT_ATTRIBUTE.primary_contact,
				document_payload,
				false, // for clear action
				close_contact_sheet,
				set_btn_loading,
			);
		} catch (error) {
			console.error(error);
			if (set_btn_loading) set_btn_loading(false);
		}
	};

	const handle_address_add = async (key: string, value: any, set_btn_loading: (value: boolean) => void) => {
		if (set_btn_loading) set_btn_loading(true);
		let payload = _.cloneDeep(value);
		const is_edit = !!add_edit_address_data?.data;
		payload = _.mapValues(
			{
				..._.omit(payload, is_edit ? ['is_primary'] : ['id', 'is_primary']),
			},
			(val: any) => (_.isArray(val) ? _.join(val, ',') : val),
		);

		const { [DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_KEY]: save_changes_to_customer_profile = true, ...buyer_payload } = payload;
		const should_save_to_customer_profile = utils.should_sync_to_customer(add_edit_address_data, save_changes_to_customer_profile, is_edit);
		const should_remove_id =
			(buyer_payload?.id &&
				_.get(payload, DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_VALUE_KEY, false) &&
				_.get(payload, DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_KEY, true)) ||
			_.includes(buyer_payload?.id, 'temp_');
		try {
			const address_section = _.find((buyer_section_data as any).sections, { key: BUYER_SECTIONS.address });
			const all_addresses = address_section?.addresses || [];
			const address_data = _.filter(all_addresses, (address) => {
				const type_obj = _.find(address.attributes, { id: 'type' });
				return type_obj?.value === (BUYER_ADDRESS_TYPE as any)[payload?.type];
			});
			const document_payload = {
				...buyer_payload,
				[DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_VALUE_KEY]: !should_save_to_customer_profile,
			};
			if (!should_save_to_customer_profile) {
				delete document_payload.id;
			}
			let updated_address_id;
			if (should_save_to_customer_profile) {
				if (_.has(buyer_payload, DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_VALUE_KEY)) {
					delete buyer_payload[DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_VALUE_KEY];
				}
				if (should_remove_id) {
					delete buyer_payload.id;
				}
				const api_request =
					is_edit && buyer_payload?.id
						? api_requests.buyer.update_buyer_address(buyer_id, buyer_payload)
						: api_requests.buyer.add_buyer_address(buyer_id, buyer_payload);
				const response: any = await api_request;
				if (response?.success) {
					updated_address_id = response?.address_id || response?.data?.address_id;
					set_fetch_buyer_details(!fetch_buyer_details);
				}
			}
			handle_update_document_entity(
				address_data,
				should_save_to_customer_profile ? updated_address_id : crypto?.randomUUID(),
				(BUYER_ADDRESS_TYPE_ATTRIBUTE_MAP as any)[payload?.type],
				document_payload,
				false, // for clear action
				close_address_sheet,
				set_btn_loading,
			);
		} catch (error) {
			console.error(error);
			if (set_btn_loading) set_btn_loading(false);
		}
	};

	const handle_set_section_mode = (key: any, mode: any) => {
		set_section_mode((prev: any) => {
			const updatedModes = Object?.keys(prev)?.reduce((newState: any, currentKey: any) => {
				newState[currentKey] = currentKey === key && mode === 'edit' ? 'edit' : 'view';
				return newState;
			}, {});
			return updatedModes;
		});
	};
	const get_order_info = (data: any, use_default_date_format: boolean = false) => {
		const date_format = use_default_date_format ? constants.DATE_FORMAT : 'DD MMM YYYY';
		const update_on = convert_date_to_timezone(data?.updated_at, date_format);
		const created_on = convert_date_to_timezone(data?.created_at, date_format);
		const expired_on = convert_date_to_timezone(data?.expired_at, date_format);
		const updated_by = data?.updated_by_name;
		const created_by = data?.created_by_name;
		return { update_on, created_on, expired_on, updated_by, created_by };
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

	const handle_default_case = (val: any, confirmation: boolean) => {
		if (confirmation) {
			set_show_confirmation_modal(confirmation);
		} else {
			handle_document_status(val);
		}
	};

	const handle_click_cta = (val: any, confirmation: boolean, action: any, action_type_new?: any) => {
		set_action_type(action_type_new);
		dispatch(show_document_toast_message(document?.Actions[action]?.message));

		switch (val) {
			case 'edit':
				set_confirmation_action('');
				handle_edit_quote();
				break;
			default:
				set_confirmation_action(action);
				handle_default_case(val, confirmation);
				break;
		}
	};

	const get_country_label = (value: string) => {
		const attributes = _.find(buyer_details_form?.sections, { key: 'addresses' })?.addresses?.[0]?.attributes;
		const options = _.find(attributes, { id: 'country' })?.options;
		const label = _.find(options, { value })?.label || value;
		return label;
	};

	const handle_back_change_fields = (payload_data: any) => {
		const document_attribute = document_details?.attributes;
		const filtered_data = _.pickBy(payload_data, (value, key) => {
			return !_.isEqual(document_attribute[key], value) && payload_data[key];
		});
		return filtered_data;
	};

	const handle_order_section = (ele: any) => {
		let payload_keys: any = {};
		ele?.attributes?.forEach((attr: any) => {
			if (!document_attributes[attr?.id]) {
				payload_keys[attr?.id] = document_attributes[attr?.id] ?? attr?.value ?? '';
			}
		});
		let payload = handle_back_change_fields(payload_keys);
		return payload;
	};

	const handle_other_section = (ele: any) => {
		let payload_keys: any = {};
		const payment_section = _.get(ele, 'payment_section', []);
		const terms_and_conditions_section = _.get(ele, 'terms_and_conditions_section', []);
		const arr = _.concat(payment_section, terms_and_conditions_section);
		arr?.forEach((props_data: any) => {
			if (props_data?.is_display !== false) {
				props_data?.attributes?.forEach((attr: any) => {
					if (!document_attributes[attr?.id]) {
						payload_keys[attr?.id] = document_attributes[attr?.id] ?? attr?.value ?? '';
					}
				});
			}
		});
		let payload = handle_back_change_fields(payload_keys);
		return payload;
	};

	const handle_get_default_value = (type: any, ele: any) => {
		switch (type) {
			case 'order_section':
				return handle_order_section(ele);
			case 'other_section':
				return handle_other_section(ele);
		}
	};

	const handle_update_section_to_default_value = (data: any) => {
		let payload_keys: any = {};
		data?.forEach((ele: any) => {
			let payload_data = handle_get_default_value(ele?.type, ele);
			payload_keys = {
				...payload_keys,
				...payload_data,
			};
		});
		if (!_.isEmpty(payload_keys)) handle_update_document({ ...payload_keys });
	};

	const handle_stepper = (pages: any[], initial_key: string) => {
		if (is_store_front && !doc_status) {
			const queryParams: any = new URLSearchParams(location.search);
			const key = queryParams.get('step');
			const current_step = _.find(pages, { key });
			if (current_step && key) {
				handle_update_stepper(current_step?.priority - 1, current_step?.key);
			} else {
				handle_update_stepper(0, initial_key);
			}
		}
	};

	const get_styles = () => {
		let status_style =
			doc_status &&
			(document_type === 'quote'
				? document?.QUOTE_ACTIONS[document_details?.document_status]?.style
				: document?.ORDER_ACTIONS[document_details?.document_status]?.style);
		if (is_store_front && document_type === 'order' && doc_status) {
			status_style = {
				background:
					theme?.order_management?.order_end_status_container?.background ||
					theme?.order_management?.fallback_order_end_status_container?.background,
			};
		}
		return status_style || {};
	};

	const handle_get_terms_data = () => {
		const terms = _.get(section, 'other_section.terms_and_conditions_section', []);
		const attribute = _.get(_.head(terms), 'attributes', []);

		if (_.isEmpty(terms)) {
			return true;
		} else {
			return _.some(attribute, (item: any) => {
				const data = _.get(document_attributes, item.id, '');
				return _.isEmpty(data);
			});
		}
	};

	const handle_get_wizshop_settings = async () => {
		api_requests.order_management
			.get_wizshop_order_settings('wizshop_order_sections')
			.then((res: any) => {
				if (res?.status === 200) {
					const data = res?.data;
					const sorted_pages = {
						pages: _.sortBy(data?.pages, 'priority'),
					};
					const initial_stepper_key = _.head(sorted_pages?.pages);
					set_wizshop_settings(data);
					handle_stepper(data?.pages, initial_stepper_key?.key);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handle_shipment_form = async () => {
		try {
			const res = await order_management.get_fulfillment_form();
			set_ful_fillment_form(res);
			set_fulfilment_status_modal(true);
		} catch (err) {
			console.error(err);
		}
	};

	const handle_manual_payment_form = async () => {
		try {
			if (manual_payment_status_form && !_.isEmpty(manual_payment_status_form)) {
				set_manual_payment_status_modal(true);
				return;
			}
			set_is_status_form_loading(true);
			const res = await order_management.get_payment_status_form();
			set_manual_payment_status_form(res);
			set_manual_payment_status_modal(true);
		} catch (err) {
			console.error(err);
		} finally {
			set_is_status_form_loading(false);
		}
	};

	const handle_document_tag_form = async () => {
		try {
			const res: any = await order_management.get_document_tags();
			set_document_tag_form(res);
		} catch (err) {
			console.error(err);
		}
	};

	const get_email_config_info = (get_only_data: boolean = false) => {
		const status = _.get(document_details, 'document_status');
		const action = doc_status ?? status === document?.DocumentStatus?.confirmed ? 'confirm' : status;
		const payload = { entity: document_type, action, document_id };

		order_management
			.get_email_config_info(payload)
			.then((res: any) => {
				set_email_data(res?.data);
				if (get_only_data === false) {
					set_email_checkbox(res?.data?.is_auto_trigger);
					handle_drawer_state(true);
					handle_drawer_type(DRAWER_TYPES.notification_email_ids);
					set_send_email(true);
				}
			})
			.catch((err) => console.error(err));
	};

	useEffect(() => {
		get_table_data();
		is_store_front && handle_get_wizshop_settings();
		handle_document_tag_form();
	}, []);

	useEffect(() => {
		handle_get_document_details();
		handle_get_payment_config();
		get_table_data();
	}, [refetch, document_id]);

	useEffect(() => {
		get_email_config_info(true);
	}, [document_details]);

	useEffect(() => {
		if (document_type) {
			dispatch<any>(getCartCheckoutConfig(document_type));
		}
	}, [document_type]);

	useEffect(() => {
		if (buyer_id) {
			handle_get_buyer_details(buyer_id);
		}
	}, [fetch_buyer_details]);

	const handle_edit_address = useCallback(
		(address: DocumentEntity, show_sync_back_checkbox: boolean, show_sync_back_info: boolean, is_shipping_type: boolean) => {
			const mapped_address: FormValuesObj | null = utils.map_attrs_to_form_data(address);
			if (!mapped_address) return;
			set_add_edit_address_data({
				show_sync_back_checkbox,
				show_sync_back_info,
				data: {
					...mapped_address,
					[DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_VALUE_KEY]: address?.[DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_VALUE_KEY] || false,
				},
			});
			set_show_address_sheet_detail({ is_open: true, index: -1, is_shipping_type });
		},
		[],
	);

	return {
		drawer: {
			drawer_state,
			drawer_type,
		},
		attribute_data: document_attributes,
		section_data: section,
		document_data: document_details,
		buyer_data: buyer_section_data,
		buyer_id,
		loader,
		toast_data,
		show_edit_cta,
		is_end_state,
		section_mode,
		show_confirmation_modal,
		show_tear_sheet,
		show_contact_sheet_detail,
		show_address_sheet_detail,
		buyer_details_form,
		buyer_section_loading,
		show_error,
		buyer_info_data,
		linked_id,
		action_type,
		show_add_card,
		is_error_modal_open,
		table_data,
		edit_order_buyer_data,
		set_document_details,
		handle_update_edit_order_data,
		handle_update_edit_order_modal,
		previous_action,
		set_previous_action,
		set_is_error_modal_open,
		is_discount_campaign_error,
		set_is_discount_campaign_error,
		handle_update_buyer_order_details,
		set_buyer_info_data,
		get_order_info,
		handle_loading_state,
		set_show_tear_sheet,
		set_show_error,
		get_order_summary,
		set_show_contact_sheet_detail,
		set_show_address_sheet_detail,
		close_address_sheet,
		close_contact_sheet,
		handle_drawer_state,
		set_toast_data,
		set_is_end_state,
		handle_edit_cart,
		handle_go_to_order,
		handle_drawer_type,
		handle_navigate_back,
		handle_update_document,
		handle_document_status,
		handle_edit_quote,
		handle_re_submit_quote,
		handle_set_section_mode,
		set_show_confirmation_modal,
		handle_address_add,
		handle_contact_add,
		format_default_values,
		handle_update_pending_order,
		set_action_type,
		handle_update_order,
		set_show_add_card,
		handle_click_cta,
		set_refetch,
		is_transaction_complete_modal_visible,
		set_is_transaction_modal_visible,
		transaction_data,
		success_toast,
		set_success_toast,
		isPolling,
		setIsPolling,
		complete,
		customer_id,
		set_customer_id,
		get_table_data,
		payment_config,
		buyer_addresses,
		is_terminal_modal_visible,
		set_is_terminal_modal_visible,
		confirmation_action,
		set_confirmation_action,
		handle_update_document_cart,
		container_loading,
		send_email_check,
		set_send_email_check,
		get_country_label,
		document_id,
		document_type,
		doc_status,
		handle_update_section_to_default_value,

		active_step,
		set_active_step,
		handle_update_stepper,
		get_styles,
		handle_get_terms_data,
		set_download_file_type,
		download_file_type,
		handle_navigation_to_draft,
		original_section_data,
		set_original_section_data,
		wizshop_settings,
		cart_errors,
		handleChange,
		expanded,
		set_expanded,
		status_404,
		handle_delete_document_api,
		signature_file,
		customer_consent_box,
		set_customer_consent_box,
		set_signature_file,
		fulfilment_status_modal,
		set_fulfilment_status_modal,
		ful_fillment_form,
		set_ful_fillment_form,
		handle_shipment_form,
		email_data,
		set_email_data,
		email_checkbox,
		set_email_checkbox,
		set_payment_email_modal,
		payment_email_modal,
		payment_email_payload,
		set_payment_email_payload,
		cart_metadata,
		customer_metadata,
		document_tag_form,
		set_document_tag_form,
		document_tag_modal,
		set_document_tag_modal,
		sync_loading,
		set_sync_loading,
		get_email_config_info,
		send_email,
		set_send_email,
		add_edit_address_data,
		set_add_edit_address_data,
		add_edit_contact_data,
		set_add_edit_contact_data,
		handle_edit_address,
		handle_update_document_entity,
		is_payment_email_submit_loading,
		set_is_payment_email_submit_loading,
		handle_manual_payment_form,
		manual_payment_status_form,
		manual_payment_status_modal,
		set_manual_payment_status_modal,
		is_status_updating,
		set_is_status_updating,
		is_status_form_loading,
		currency,
		ach_modal,
		set_ach_modal,
		selected_payment_opt,
		set_selected_payment_opt,
		set_saved_payment_methods_data,
		saved_payment_methods_data,
		set_review_modal,
		review_modal,
		isview,
		set_isview,
		refetch_payment_options,
		set_refetch_payment_options,
		optional_payment,
		set_optional_payment,
	};
};

export default useOrderManagement;
