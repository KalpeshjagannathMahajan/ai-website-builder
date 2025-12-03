/* eslint-disable @typescript-eslint/no-unused-vars */
import StatusChip from 'src/common/@the-source/atoms/Chips/StatusChip';
import { Box, Chip, Grid, Icon, Menu, PageHeader, Button, Image, Drawer } from 'src/common/@the-source/atoms';
import utils from '../../../../utils/utils';
import OrderManagementContext from '../../context';
import { document, ORDER_SOURCE_FOR_EDIT_ORDER } from '../../mock/document';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { show_document_toast_message } from 'src/actions/document';
import { useDispatch } from 'react-redux';
import {
	DRAWER_TYPES,
	LOADING_CONSTANT,
	STEPPER_CONSTANTS,
	ORDER_ENTITY_SRC_CONTAINER,
	COMMON_TEXT_WRAP_STYLE_HEADER,
} from '../../constants';
import _ from 'lodash';
import CircularProgressBar from 'src/common/@the-source/atoms/ProgressBar/CircularProgressBar';
import Can from 'src/casl/Can';
import { PERMISSIONS } from 'src/casl/permissions';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';
import SelectBuyerPanel from 'src/common/SelectBuyerPanel/SelectBuyerPanel';
import AddQuickBuyer from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/AddQuickBuyer/AddQuickBuyer';
import IconExcel from 'src/assets/images/IconExcel.png';
import IconPdf from 'src/assets/images/icons/iconPdf.svg';
import useIsNewTab from 'src/hooks/useIsNewTab';
import useMediaQuery from '@mui/material/useMediaQuery';
import { colors } from 'src/utils/theme';
import { close_toast, show_toast } from 'src/actions/message';
import types from 'src/utils/types';
import { get_entity_img_src } from '../../helper/helper';
import { Mixpanel } from 'src/mixpanel';
import useTenantSettings from 'src/hooks/useTenantSettings';
import constants from 'src/utils/constants';
import Events from 'src/utils/events_constants';
import RouteNames from 'src/utils/RouteNames';
import ImageLinks from 'src/assets/images/ImageLinks';

interface Props {
	style?: any;
	payment_status_chip_label?: any;
}

const download_options = [
	{ label: 'Excel sheet', value: 'excel', img: IconExcel },
	{ label: 'PDF', value: 'pdf', img: IconPdf },
];

const { TENANT_SETTINGS_KEYS } = constants;

const Header: React.FC<Props> = ({ style, payment_status_chip_label }) => {
	const cartData: any = localStorage.getItem('CartData');
	const cart_value = JSON.parse(cartData);
	const cart_details = useSelector((state: any) => state?.cart);
	const { t } = useTranslation();
	const is_retail_mode = localStorage.getItem('retail_mode') === 'true';
	const [menu_data, set_menu_data] = useState<any>([]);
	const [show_buyer_panel, toggle_buyer_panel] = useState(false);
	const [is_buyer_add_form, set_is_buyer_add_form] = useState(false);
	const [buyer_data, set_buyer_data] = useState<any>({});
	const is_new_tab = useIsNewTab();
	const {
		document_data,
		handle_navigate_back,
		get_order_summary,
		buyer_id,
		email_data,
		is_end_state,
		handle_loading_state,
		handle_go_to_order,
		loader,
		linked_id,
		set_show_confirmation_modal,
		set_action_type,
		handle_drawer_state,
		handle_drawer_type,
		handle_click_cta,
		handle_document_status,
		set_confirmation_action,
		set_previous_action,
		active_step,
		handle_update_stepper,
		handle_navigation_to_draft,
		wizshop_settings,
		cart_errors,
		handle_delete_document_api,
		cart_metadata,
		customer_metadata,
		sync_loading,
		get_email_config_info,
		attribute_data,
		set_selected_payment_opt,
		set_download_file_type,
		set_isview,
	} = useContext(OrderManagementContext);
	const { document_status, type, payment_status } = document_data;

	const theme: any = useTheme();
	const is_small_screen = useMediaQuery('(max-width:900px)');
	const { payment_method_v2 } = attribute_data || {};

	const document_meta_data = {
		cart_id: document_data?.cart_id,
		cart_item_count: _.size(document_data?.cart_details?.items),
		cart_value: document_data?.cart_details?.cart_total,
		cart_value_with_discount: document_data?.cart_details?.total,
		cart_value_without_charge: document_data?.cart_details?.cart_total,
		catalog_id: _.head(document_data?.cart_details?.catalog_ids),
		catalog_name: document_data?.catalog_name,
		container_unit: document_data?.cart_details?.container_data?.cart_volume_unit,
		containers: document_data?.cart_details?.container_data?.containers,
		customer_consent: document_data?.customer_consent,
		customer_id: document_data?.buyer_id,
		customer_type: document_data?.buyer_id,
		document_id: document_data?.id,
		document_state: document_data?.status,
		document_type: document_data?.type,
		freight_terms: document_data?.attributes?.freight_terms,
		page_name: 'document_review_page',
		payment_method: document_data?.attributes?.payment_method,
		payment_method_v2: document_data?.attributes?.payment_method_v2,
		payment_status: document_data?.payment_status,
		payment_terms: document_data?.attributes?.payment_terms,
		primary_contact: document_data?.attributes?.primary_contact,
		shipping_address: document_data?.attributes?.shipping_address,
		billing_address: document_data?.attributes?.billing_address,
		shipping_terms: document_data?.attributes?.shipping_terms,
		signature: document_data?.attributes?.signature,
		system_id: document_data?.system_id,
		grouping_data: document_data?.cart_details?.meta?.grouping_data,
	};

	const params = useParams();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const classes = useStyles();
	const user_permissions = useSelector((state: any) => state?.login?.permissions);
	const is_edit_quote = useSelector((state: any) => state?.document?.is_editable_quote);
	const is_editable_order = useSelector((state: any) => state?.document.is_editable_order);
	const is_confirmed_edit = useSelector((state: any) => state?.settings?.enable_confirmed_order_editing);
	const { show_download_at_order_detail = true } = useSelector((state: any) => state?.settings);
	const repeat_document_enabled = useSelector((state) => _.get(state, 'settings.repeat_document_enabled', false));
	const duplicate_document_enabled = useSelector((state) => _.get(state, 'settings.duplicate_document_enabled', false));
	const enable_delete_cancelled_order = useSelector((state) => _.get(state, 'settings.enable_delete_cancelled_order', false));
	const edit_disallowed = useSelector((state: any) => state?.settings?.Edit_Disallowed_After_Pending_Approval);
	const force_pending_approval_flow = useSelector((state: any) => state?.settings?.force_pending_approval_flow);
	const payments_on_pending_approval = useSelector((state: any) => state?.settings?.payments_on_pending_approval);
	const enable_excel_sheet_format = useSelector((state: any) => state?.settings?.enable_excel_sheet_format);
	const { enable_reorder_flow = false, hide_integration_reorder = false } = useSelector((state: any) => state?.settings);
	const { document_type, doc_status, document_id } = params;
	const document_type_data: any = document_type === document.DocumentTypeEnum.ORDER ? document?.ORDER_ACTIONS : document?.QUOTE_ACTIONS;
	const tenant_settings_fetched = useSelector((state: any) => state?.settings?.is_tenant_settings_fetched);
	const { is_integration_account } = useTenantSettings({ [TENANT_SETTINGS_KEYS.INTEGRATION_ACCOUNT_SETTING_KEY]: false });

	const disallow_order_edit_after_shipment_creation = useSelector((state: any) =>
		_.get(state, 'settings.disallow_order_edit_after_shipment_creation', false),
	);

	const { is_primary_loading, is_secondary_loading, download_loader, edit_cart_loading } = loader;

	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';
	const is_store_front = VITE_APP_REPO === 'store_front';

	const current_step = _.find(wizshop_settings?.pages || STEPPER_CONSTANTS, { key: active_step?.stepper_key });

	const check_permission = (paymentPermissions: string[] = []) => {
		return paymentPermissions.some((permission) => _.find(user_permissions, { slug: permission })?.toggle);
	};

	const check_pending_approval_edit = () => {
		return (
			document_data?.document_status === document.DocumentStatus?.pendingApproval &&
			!is_editable_order &&
			!edit_disallowed &&
			_.find(user_permissions, { slug: 'edit_orders' })?.toggle
		);
	};
	const check_confirm_order_editable = () => {
		return (
			document_data?.document_status === document.DocumentStatus?.confirmed &&
			is_confirmed_edit &&
			_.find(user_permissions, { slug: 'edit_confirmed_orders' })?.toggle
		);
	};

	const check_edit_order_removal = (temp: any) => {
		return (
			(disallow_order_edit_after_shipment_creation &&
				!_.isEmpty(document_data?.fulfillment_details) &&
				_.includes(temp, 'EditOrderAction')) ||
			!ORDER_SOURCE_FOR_EDIT_ORDER.includes(document_data?.source)
		);
	};

	const handle_pending_approval = (temp: any) => {
		if (
			document_data?.document_status === document.DocumentStatus?.pendingApproval &&
			payments_on_pending_approval &&
			doc_status === document.DocumentStatus?.pendingApproval
		) {
			check_permission(['credit_top_up']) && temp.push('AddCreditsOrderAction');
			temp.push('RefundQuoteOrderAction');
		}
	};

	const handle_duplicate_repeat = (temp: any) => {
		if (type === 'order' && repeat_document_enabled) {
			temp.splice(1, 0, 'RepeatOrderAction');
		}
		if (type === 'order' && duplicate_document_enabled) {
			temp.splice(1, 0, 'DuplicateOrderAction');
		}

		if (type === 'quote' && repeat_document_enabled) {
			temp.unshift('RepeatQuoteAction');
		}

		if (type === 'quote' && duplicate_document_enabled) {
			temp.unshift('DuplicateQuoteAction');
		}
	};

	const handle_edit_order = (temp: any) => {
		if (check_pending_approval_edit()) {
			temp.unshift('EditOrderAction');
		}

		if (check_confirm_order_editable()) {
			temp.unshift('EditOrderAction');
		}

		if (check_edit_order_removal(temp)) {
			_.pull(temp, 'EditOrderAction');
		}
	};

	const handle_delete_document = (temp: any) => {
		if (
			(document_status === document.DocumentStatus.cancelled || document_status === document.DocumentStatus.rejected) &&
			enable_delete_cancelled_order
		) {
			temp.unshift(type === 'order' ? 'DeleteOrderAction' : 'DeleteQuoteAction');
		}
	};

	const handle_clear_menu = (temp: any) => {
		if (!doc_status) {
			_.remove(temp, (action: string) => action === 'EditOrderAction');
			_.remove(temp, (action: string) => action === 'AddCreditsOrderAction');
			_.remove(temp, (action: string) => action === 'RefundQuoteOrderAction');
		}
	};

	const handle_view_payment = (temp: any) => {
		if (!_.find(user_permissions, { slug: 'view_payment_method' })?.toggle) {
			_.remove(temp, (action: string) => action === 'AddCardQuoteOrderAction');
			_.remove(temp, (action: string) => action === 'DraftOrderAction');
		}
	};

	const handle_cancel_order = (temp: any) => {
		if (!_.find(user_permissions, { slug: 'cancel_orders' })?.toggle) {
			_.remove(temp, (action: string) => action === 'RejectOrderAction');
		}
	};
	const handle_auth_payment = (temp: any) => {
		if (!_.find(user_permissions, { slug: 'create_authorization' })?.toggle) {
			_.remove(temp, (action: string) => action === 'AuthorisedCardsOrderAction');
		}
		if (!_.find(user_permissions, { slug: 'void_authorization' })?.toggle) {
			_.remove(temp, (action: string) => action === 'VoidAuthorizationOrderAction');
		}
	};

	const handle_get_menu_item = () => {
		let temp;
		if (document_type_data?.[document_data?.document_status]?.allow_payment_actions) {
			const temp_doc_status = payment_status === '' ? 'PENDING' : payment_status;
			temp = document_type_data?.[document_data?.document_status]?.[temp_doc_status]?.previous || [];

			handle_edit_order(temp);
			handle_pending_approval(temp);
			handle_clear_menu(temp);
			handle_view_payment(temp);
			handle_cancel_order(temp);
			handle_auth_payment(temp);
		} else {
			temp = document_type_data[document_data?.document_status]?.previous || [];
		}

		// handle_send_email(temp);
		// if (should_send_email === true) {
		email_data?.is_enable && temp.push('SendEmailAction');
		// }
		handle_duplicate_repeat(temp);
		handle_delete_document(temp);
		return temp;
	};
	// [TODO] - Need to test and add dependencies as per requirement
	const previous_action = useMemo(
		() => !_.isEmpty(document_data) && handle_get_menu_item(),
		[document_data, tenant_settings_fetched, email_data],
	);
	const tenant_id = buyer_id;

	const approval_access_data = _.find(user_permissions, { slug: 'approve_orders' });

	const get_label_by_key = (action: any, key: any) => {
		switch (key) {
			case 'payment_card':
				return payment_method_v2?.payment_method_id ? action?.payment_added?.label : action?.payment_not_added?.label;
			default:
				return action?.label;
		}
	};

	const check_refund_condition = (has_refund_source_permission: boolean, has_refund_credits_permission: boolean, show_refund: boolean) => {
		return !((has_refund_source_permission || has_refund_credits_permission) && show_refund);
	};

	useEffect(() => {
		if (previous_action) {
			const updated_menu_data = _.map(previous_action, (menu_item: any) => {
				const is_payment_action = document?.Actions[menu_item]?.is_payment_action;
				if (is_payment_action) {
					let _label = get_label_by_key(document?.Actions[menu_item], document?.Actions[menu_item]?.key);
					return { label: _label };
				} else {
					return { label: document?.Actions[menu_item]?.label };
				}
			});

			const { all_payment_refundable_total } = document_data;
			const show_refund = all_payment_refundable_total > 0;
			// remove duplicate
			let temp = new Map();
			for (const tag of updated_menu_data) {
				if (user_permissions?.length && tag.label === 'Refund') {
					const has_refund_source_permission = _.find(user_permissions, { slug: 'refund_source' })?.toggle;
					const has_refund_credits_permission = _.find(user_permissions, { slug: 'refund_credits' })?.toggle;
					if (check_refund_condition(has_refund_source_permission, has_refund_credits_permission, show_refund)) {
						continue;
					}
				}
				if (
					user_permissions?.length &&
					tag.label === 'Add Credits' &&
					(!check_permission(['credit_top_up']) || !check_permission(['collect_payment_for_order']))
				)
					continue;

				temp.set(tag.label, tag);
			}
			let final = [...temp.values()];

			if (!_.isEmpty(updated_menu_data)) {
				set_menu_data(final);
			} else {
				set_menu_data(updated_menu_data);
			}
		}
	}, [previous_action, payment_status, doc_status, tenant_settings_fetched, email_data]);

	const handle_edit_pending_order = () => {
		navigate(`/review/${document_type}/${document_id}`, {
			state: { from: 'pending_order' },
		});
	};

	const handle_refund_click = () => {
		// handle_drawer_state(true);
		// handle_drawer_type(DRAWER_TYPES.refund_payment);
		navigate(`/payment/form/refund/order/${document_data?.id}`, {
			state: {
				document_route: location.pathname,
			},
		});
	};

	const handle_add_credits_click = () => {
		handle_drawer_state(true);
		handle_drawer_type(DRAWER_TYPES.add_credits);
	};
	const handle_auth_drawer = () => {
		// handle_drawer_state(true);
		// handle_drawer_type(DRAWER_TYPES.auth_card);
		navigate(`${RouteNames.payment.authorize.path}/buyer/${_.get(document_data, 'buyer_id', '')}`, {
			state: {
				document_id: document_data?.id,
				document_route: location.pathname,
			},
		});
	};

	const handle_void_auth_drawer = () => {
		handle_drawer_state(true);
		handle_drawer_type(DRAWER_TYPES.void_auth_card);
	};

	const handle_menu_click = (menu_item: any) => {
		let index = previous_action?.findIndex(
			(item: any) => get_label_by_key(document?.Actions[item], document?.Actions[item]?.key) === menu_item,
		);

		if (index === -1) return;

		//get the previous action based on document type and document status
		let action = document?.Actions[previous_action[index]];

		// if value is empty in example - case of save for later, update document attrr
		if (!action?.value && !action?.is_payment_action) {
			handle_document_status(action?.value);
			dispatch(show_document_toast_message(action?.message));
			return;
		}

		if (action?.is_payment_action) {
			switch (action?.key) {
				case 'payment_card':
					// eslint-disable-next-line @typescript-eslint/no-use-before-define
					handle_add_edit_payment_click();
					break;
				case 'refund_payment':
					handle_refund_click();
					break;
				case 'add_credits':
					handle_add_credits_click();
					break;
				case 'auth_card':
					handle_auth_drawer();
					break;
				case 'void_auth_card':
					handle_void_auth_drawer();
					break;
			}
			return;
		}

		//if the action required confirmation open confrim modal
		if (action?.require_confirmation) {
			// RejectOrderRefundAction
			const refund_dependent_actions = ['RejectOrderAction', 'CancelOrderAction'];
			const _action =
				_.includes(refund_dependent_actions, previous_action[index]) && document_data?.all_payment_refundable_total > 0
					? 'RejectOrderRefundAction'
					: previous_action[index];
			set_confirmation_action(_action);
			set_action_type('previous');
			if (menu_data?.length > 1) {
				if (_action === 'RejectOrderRefundAction') {
					set_previous_action('RejectOrderRefundAction');
				} else {
					set_previous_action(previous_action[index]);
				}
			}
			set_show_confirmation_modal(action?.require_confirmation);

			if (action?.value === 'repeat_order' || action?.value === 'repeat_quote') {
				Mixpanel.track(Events.REPEAT_DOCUMENT_CLICKED, {
					tab_name: 'Home',
					page_name: 'document_summary_page',
					section_name: 'document_summary_options',
					cart_metadata,
					customer_metadata,
					document_meta_data,
				});
			}
			return;
		}

		if (action?.value === 'edit_order') {
			handle_edit_pending_order();
			Mixpanel.track(Events.EDIT_DOCUMENT_CLICKED, {
				tab_name: 'Home',
				page_name: 'document_summary_page',
				section_name: 'document_summary_more_options',
				cart_metadata,
				customer_metadata,
				document_meta_data,
			});
		}

		if (action?.value === 'duplicate_order' || action?.value === 'duplicate_quote') {
			toggle_buyer_panel(true);
			Mixpanel.track(Events.DUPLICATE_DOCUMENT_CLICKED, {
				tab_name: 'Home',
				page_name: 'document_summary_page',
				section_name: 'document_summary_options',
				subtab_name: '',
				cart_metadata,
				customer_metadata,
				document_meta_data,
			});
		}

		if (action?.value === 'delete_order' || action?.value === 'delete_quote') {
			handle_delete_document_api();
		}

		if (action?.value === 'send_email') {
			get_email_config_info();
		}

		dispatch(show_document_toast_message(action?.message));
	};

	const { textColor, bgColor } = utils.get_chip_color_by_tag(document_data?.type);

	const handle_get_label = () => {
		if (document_data?.document_status === document.DocumentStatus?.accepted) {
			return _.capitalize('Converted to order');
		}
		if (document_data?.document_status === document.DocumentStatus?.pendingApproval && is_store_front) {
			return _.capitalize('Under review');
		}
		return _.capitalize(document_data?.document_status);
	};

	const status_chip = () => {
		return (
			<StatusChip
				label={handle_get_label()}
				sx={{
					height: 32,
					...theme?.order_management?.status_chip_style,
				}}
				statusColor={utils.get_chip_color_by_status(document_data?.document_status)}
			/>
		);
	};

	const handle_render_status_chip = () => {
		const is_confirmed = document_data?.document_status === document.DocumentStatus?.confirmed;

		if (!is_confirmed || !payment_status_chip_label || is_store_front) {
			return status_chip();
		}
		return null;
	};

	const handle_add_edit_payment_click = () => {
		const _type = payment_method_v2?.payment_method_type === 'ach' ? 'ach' : 'card';
		if (!_.isEmpty(payment_method_v2)) {
			set_selected_payment_opt({ mode: 'edit', type: _type });
		} else {
			set_selected_payment_opt({ mode: 'add', type: null });
		}
		handle_drawer_state(true);
		handle_drawer_type(DRAWER_TYPES.add_edit_payment);
	};

	const handle_collect_payment_click = () => {
		// handle_drawer_state(true);
		// handle_drawer_type(DRAWER_TYPES.collect_payment);
		navigate(`/payment/form/collect/order/${document_data?.id}`, {
			state: {
				document_route: location.pathname,
			},
		});
	};

	const handle_render_action_buttons = (_doc_status: string) => {
		let current_action = document_type_data[document_status]?.current;
		let next_action = document_type_data[_doc_status]?.next;

		if (document_type_data[_doc_status]?.approval_mode_on) {
			if (force_pending_approval_flow && document_type_data[_doc_status]?.force_pending_approval_flow_on && approval_access_data?.toggle) {
				next_action = document_type_data[_doc_status]?.force_pending_approval_flow_on?.next;
				current_action = document_type_data[_doc_status]?.force_pending_approval_flow_on?.current;
			} else if (approval_access_data?.toggle) {
				next_action = document_type_data[_doc_status]?.approval_mode_on?.next;
				current_action = document_type_data[_doc_status]?.approval_mode_on?.current;
			} else {
				next_action = document_type_data[_doc_status]?.approval_mode_off?.next;
				current_action = document_type_data[_doc_status]?.approval_mode_off?.current;
			}
		}

		if (next_action === 'ConvertToOrderAction' && is_edit_quote) {
			next_action = '';
		}

		const get_next_action_label = () => {
			if (is_ultron) {
				return document?.Actions[next_action]?.label;
			} else if (is_store_front && (next_action === 'ConfirmOrderAction' || next_action === 'SubmitQuoteAction')) {
				return 'Proceed';
			} else {
				return document?.Actions[next_action]?.label;
			}
		};

		return (
			<Grid container gap={1} sx={{ width: 'fit-content' }}>
				{type === 'order' && (
					<React.Fragment>
						{payments_on_pending_approval &&
							params?.doc_status === document.DocumentStatus?.pendingApproval &&
							document_status === document.DocumentStatus?.pendingApproval && (
								<Can I={PERMISSIONS.collect_payment_for_order.slug} a={PERMISSIONS.collect_payment_for_order.permissionType}>
									<Button onClick={handle_collect_payment_click} variant='contained'>
										Collect payment
									</Button>
								</Can>
							)}
						{document_status === document.DocumentStatus?.confirmed ? (
							<>
								{check_permission(['collect_payment_for_order']) ? (
									<>
										{(params?.doc_status === 'confirm' || params?.doc_status === 'confirmed') && (
											<Button
												onClick={handle_collect_payment_click}
												variant={next_action && !is_editable_order ? 'outlined' : 'contained'}
												disabled={sync_loading}>
												Collect payment
											</Button>
										)}
									</>
								) : (
									<>
										{check_permission(['credit_top_up']) && (
											<Button onClick={handle_add_credits_click} variant={next_action && !is_editable_order ? 'outlined' : 'contained'}>
												Add credits
											</Button>
										)}
									</>
								)}
							</>
						) : !_.find(user_permissions, { slug: 'view_payment_method' })?.toggle && current_action === 'DraftOrderAction' ? (
							<Button
								variant='outlined'
								disabled={is_primary_loading || edit_cart_loading || is_secondary_loading || is_end_state || cart_errors?.errors_count > 0}
								loading={is_primary_loading}
								onClick={() =>
									handle_click_cta(
										document?.Actions[current_action]?.value,
										document?.Actions[current_action]?.require_confirmation,
										current_action,
										'current',
									)
								}>
								{document?.Actions[current_action]?.label}
							</Button>
						) : (
							<>
								{document_status !== document.DocumentAction.pendingApproval &&
									document_status !== 'cancelled' &&
									payment_status === 'PENDING' && (
										<Can I={PERMISSIONS.edit_orders.slug && PERMISSIONS.view_payment.slug} a={PERMISSIONS.view_payment.permissionType}>
											<Button
												variant={next_action && !is_editable_order ? 'outlined' : 'contained'}
												onClick={handle_add_edit_payment_click}>
												{payment_method_v2?.payment_method_id ? 'Edit' : 'Add'} payment method
											</Button>
										</Can>
									)}
							</>
						)}
					</React.Fragment>
				)}

				{/* for pending approval flow - edit flow */}
				{is_editable_order && !current_action && !next_action && (
					<Button
						variant='outlined'
						disabled={is_primary_loading || edit_cart_loading || is_secondary_loading || is_end_state || cart_errors?.errors_count > 0}
						loading={is_primary_loading}
						sx={{
							marginX: 2,
						}}
						onClick={() => handle_click_cta('confirm-update', true, 'UpdateOrderAction', 'current')}>
						{t('OrderManagement.CartCheckoutCard.UpdateOrder')}
					</Button>
				)}

				{(current_action || next_action) && (
					<React.Fragment>
						{/* for submitted quote - edit flow */}
						{is_edit_quote && (
							<Button
								variant='outlined'
								disabled={is_primary_loading || edit_cart_loading || is_secondary_loading || is_end_state || cart_errors?.errors_count > 0}
								loading={is_primary_loading}
								onClick={() => handle_click_cta('re-submit', true, 'ReSubmitQuoteAction', 'current')}>
								{t('OrderManagement.CartCheckoutCard.ReSumbitQuote')}
							</Button>
						)}

						{/* for updating edited order - edit flow*/}
						{current_action && is_editable_order && (
							<Button
								variant='outlined'
								disabled={is_primary_loading || edit_cart_loading || is_secondary_loading || is_end_state || cart_errors?.errors_count > 0}
								loading={is_primary_loading}
								onClick={() => handle_click_cta('confirm-update', true, 'UpdateOrderAction', 'current')}>
								{t('OrderManagement.CartCheckoutCard.UpdateOrder')}
							</Button>
						)}

						{/* current action cta - no edit flow  */}
						{current_action && !is_edit_quote && !is_editable_order && type !== 'order' && (
							<Button
								variant='outlined'
								loading={is_primary_loading}
								disabled={
									is_primary_loading ||
									edit_cart_loading ||
									is_secondary_loading ||
									is_end_state ||
									document?.Actions[current_action]?.disabled
								}
								onClick={() =>
									handle_click_cta(
										document?.Actions[current_action]?.value,
										document?.Actions[current_action]?.require_confirmation,
										current_action,
										'current',
									)
								}>
								{document?.Actions[current_action]?.label}
							</Button>
						)}

						{/* next action cta - no edit flow  */}
						{next_action && !is_editable_order && (
							<Button
								variant='contained'
								loading={is_secondary_loading}
								disabled={
									is_primary_loading ||
									edit_cart_loading ||
									is_secondary_loading ||
									is_end_state ||
									document?.Actions[next_action]?.disabled
								}
								onClick={() =>
									handle_click_cta(
										document?.Actions[next_action]?.value,
										document?.Actions[next_action]?.require_confirmation,
										next_action,
										'next',
									)
								}>
								{get_next_action_label()}
							</Button>
						)}
					</React.Fragment>
				)}
			</Grid>
		);
	};

	const handle_render_menu = () => {
		return (
			<Menu
				LabelComponent={
					<Box className={classes.iconContainer}>
						<Icon className={classes.iconStyle} iconName='IconDotsVertical' />
					</Box>
				}
				loading={is_end_state}
				disabled={is_primary_loading || edit_cart_loading || is_secondary_loading || is_end_state || sync_loading}
				btnStyle={{ border: 'none', padding: 0 }}
				menu={menu_data}
				onClickMenuItem={(e: any) => handle_menu_click(e)}
			/>
		);
	};

	useEffect(() => {
		if (!_.isEmpty(buyer_data)) {
			set_is_buyer_add_form(false);
			toggle_buyer_panel(false);
			handle_navigation_to_draft(buyer_data?.id, 'duplicate');
		}
	}, [buyer_data]);

	const handle_render_tear_sheet = () => {
		const loader_style = {
			width: '25px',
			height: '25px',
			color: theme?.order_management?.header?.render_tear_color,
		};

		const handle_click = (download_type: string) => {
			handle_loading_state(LOADING_CONSTANT.download_loader, true);
			get_order_summary(tenant_id, download_type);
		};

		const handle_download = (value: string) => {
			const download_type: any = _.find(download_options, (item: any) => item.label === value);
			handle_click(download_type?.value);
		};

		if (enable_excel_sheet_format) {
			return (
				<Menu
					LabelComponent={
						<Box className={classes.iconContainer}>
							{download_loader ? (
								<CircularProgressBar style={loader_style} />
							) : (
								<Icon className={classes.iconStyle} iconName='IconFileDownload' />
							)}
						</Box>
					}
					disabled={is_primary_loading || edit_cart_loading || is_secondary_loading || is_end_state || sync_loading}
					btnStyle={{ border: 'none', padding: 0 }}
					menu={download_options}
					onClickMenuItem={(e: any) => handle_download(e)}
				/>
			);
		}

		return (
			<Box className={classes.iconContainer} onClick={() => handle_click('pdf')}>
				{download_loader ? (
					<CircularProgressBar style={loader_style} />
				) : (
					<Icon className={classes.iconStyle} iconName='IconFileDownload' />
				)}
			</Box>
		);
	};

	const copy_to_clipboard = async (link: string) => {
		await navigator.clipboard.writeText(link);
		dispatch<any>(
			show_toast({
				open: true,
				showCross: false,
				anchorOrigin: {
					vertical: types.VERTICAL_TOP,
					horizontal: types.HORIZONTAL_CENTER,
				},
				autoHideDuration: 5000,
				onClose: (reason: String) => {
					if (reason === types.REASON_CLICK) {
						return;
					}
					dispatch(close_toast(''));
				},
				state: types.SUCCESS_STATE,
				title: t('Common.Common.CopiedToClipboard'),
				subtitle: '',
				showActions: false,
			}),
		);
	};

	const render_document_entity_source = () => {
		if (!document_data?.entity_source) return null;
		const entity_img = get_entity_img_src(document_data?.entity_source);
		return (
			<Grid sx={ORDER_ENTITY_SRC_CONTAINER}>
				{entity_img && <Image width={20} height={20} style={{ marginRight: 8 }} src={entity_img} alt={document_data?.entity_source} />}
				<CustomText color={colors.grey_800} type='Body' style={{ lineHeight: '150%' }}>
					{_.capitalize(document_data?.entity_source)}
				</CustomText>
			</Grid>
		);
	};

	const handle_navigate = () => {
		if (is_ultron) {
			handle_navigate_back();
		} else {
			const pages = wizshop_settings?.pages || [];
			const current_index = _.findIndex(pages, { key: current_step?.key });
			if (current_index > 0) {
				handle_update_stepper(current_index - 1, pages[current_index - 1]?.key);
			} else {
				handle_navigate_back();
			}
		}
	};

	const handle_open_modal = (download_type: string) => {
		set_download_file_type(download_type);
		if (!download_loader) {
			handle_loading_state(LOADING_CONSTANT.download_loader, true);
			get_order_summary(buyer_id, download_type);
		}
	};

	const handle_reorder_button = () => {
		Mixpanel.track(Events.REORDER_DETAIL_CLICKED, {
			tab_name: 'Reorder',
			page_name: 'Order Detail',
			section_name: '',
		});
		set_isview({ state: true, data: document_data });
	};

	const handle_render_header = () => {
		if (is_ultron || doc_status) {
			return (
				<React.Fragment>
					<PageHeader
						style={{ ...style, alignItems: is_small_screen ? 'flex-start' : 'center' }}
						leftSection={
							<Grid container gap={1.5} alignItems='center'>
								<CustomText type='H6' style={{ display: 'flex', ...(is_new_tab && { paddingLeft: '2rem' }) }}>
									{!is_new_tab && (
										<Icon
											iconName='IconArrowLeft'
											sx={{
												cursor: 'pointer',
												paddingRight: '1rem',
											}}
											onClick={handle_navigate_back}
										/>
									)}
									{document_data?.system_id}
								</CustomText>

								{is_integration_account && !_.isNull(document_data?.reference_id) && (
									<Box
										display='flex'
										maxWidth={'20%'}
										onClick={() => copy_to_clipboard(document_data.reference_id)}
										sx={{ cursor: 'pointer' }}>
										<CustomText style={COMMON_TEXT_WRAP_STYLE_HEADER}>
											{'('}
											{document_data?.reference_id}
										</CustomText>
										<Icon iconName='IconCopy' color={colors.primary_500} />
										<CustomText style={COMMON_TEXT_WRAP_STYLE_HEADER}>{')'}</CustomText>
									</Box>
								)}
								{render_document_entity_source()}
								{!is_small_screen && handle_render_status_chip()}

								{document_data?.document_status === document.DocumentStatus?.draft && (
									<Chip
										textColor={textColor}
										bgColor={bgColor}
										label={_.capitalize(document_data?.type)}
										sx={{ marginRight: 1, fontSize: 12, border: theme?.order_management?.header?.chip_border }}
									/>
								)}
							</Grid>
						}
						rightSection={
							<Grid container justifyContent='right' alignItems={'center'} width={'100%'} gap={1}>
								{linked_id && doc_status && is_ultron && (
									<Box display='flex' alignItems='center' sx={{ cursor: 'pointer' }} onClick={handle_go_to_order}>
										<CustomText type='H6' color={theme?.order_management?.header?.box_custom_color} style={{ fontSize: 14, mr: 1 }}>
											View linked {document_type === document.DocumentTypeEnum?.ORDER ? 'quote' : 'order'}
										</CustomText>
										<Icon iconName='IconExternalLink' color={theme?.order_management?.header?.box_icon_color} />
									</Box>
								)}
								{is_ultron && (
									<React.Fragment>
										<Can I={PERMISSIONS.edit_orders.slug} a={PERMISSIONS.edit_orders.permissionType}>
											{handle_render_action_buttons(document_status)}
										</Can>
										<Can I={PERMISSIONS.edit_orders.slug} a={PERMISSIONS.edit_orders.permissionType}>
											{handle_render_tear_sheet()}
											{!_.isEmpty(menu_data) && handle_render_menu()}
										</Can>
									</React.Fragment>
								)}
								{is_store_front &&
									is_small_screen &&
									!is_retail_mode &&
									(show_download_at_order_detail ? (
										<CustomText type='H6' className={classes.download_cta} onClick={() => handle_open_modal('pdf')}>
											<Icon
												color={theme?.page_header_component?.tear_sheet}
												iconName='IconDownload'
												sx={{ height: '16px', marginTop: '3px' }}
											/>
											<span>{t('CartSummary.TearSheet.Download')}</span>
										</CustomText>
									) : (
										<Grid display='flex' alignItems='center' gap={2}>
											<CustomText
												type='H6'
												color={theme?.page_header_component?.pdf}
												className={classes.download_cta}
												onClick={() => handle_open_modal('pdf')}>
												<Icon iconName='IconDownload' sx={{ height: '16px' }} />
												<Image src={ImageLinks.pdf_icon} width={16} height={16} style={{ marginRight: '0.5rem' }} />
												<span>{t('OrderManagement.OrderEndStatusInfoContainer.PDF')}</span>
											</CustomText>
											<CustomText
												type='H6'
												color={theme?.page_header_component?.excel}
												className={classes.download_cta}
												onClick={() => handle_open_modal('excel')}>
												<Icon iconName='IconDownload' sx={{ height: '16px' }} />
												<Image src={ImageLinks.excel_icon} width={16} height={16} style={{ marginRight: '0.5rem' }} />

												<span>{t('OrderManagement.OrderEndStatusInfoContainer.Excel')}</span>
											</CustomText>
										</Grid>
									))}
								{is_store_front && !is_small_screen && (
									<Grid display={'flex'} gap={2}>
										<Button variant='outlined' onClick={() => navigate('/all-products')}>
											Continue Shopping
										</Button>
										{enable_reorder_flow && !hide_integration_reorder && (
											<Button onClick={handle_reorder_button}>{t('Common.ReOrderFlow.ReOrder')}</Button>
										)}
									</Grid>
								)}
							</Grid>
						}
					/>
					{is_ultron && (
						<SelectBuyerPanel
							show_drawer={show_buyer_panel}
							toggle_drawer={toggle_buyer_panel}
							buyer_data={buyer_data}
							set_buyer_data={set_buyer_data}
							from_order_confirm={true}
							set_is_buyer_add_form={set_is_buyer_add_form}
							is_buyer_add_form={is_buyer_add_form}
							type={type}
						/>
					)}
					<Drawer
						anchor='right'
						width={600}
						open={is_buyer_add_form}
						onClose={() => {
							set_is_buyer_add_form(false);
						}}
						content={
							<AddQuickBuyer is_detailed={false} from_cart set_is_buyer_add_form={set_is_buyer_add_form} set_buyer_data={set_buyer_data} />
						}
					/>
				</React.Fragment>
			);
		} else {
			return (
				<PageHeader
					style={{ ...theme?.order_management?.custom_style }}
					leftSection={
						<Grid container gap={1.5} alignItems='center'>
							<CustomText type='H2' style={{ display: 'flex', alignItems: 'center' }} onClick={handle_navigate}>
								<Icon iconName='IconArrowLeft' sx={{ cursor: 'pointer', paddingRight: '1rem' }} />
								{_.capitalize(current_step?.short_name)}
							</CustomText>
						</Grid>
					}
					rightSection={null}
				/>
			);
		}
	};

	return <React.Fragment>{handle_render_header()}</React.Fragment>;
};

export default Header;
