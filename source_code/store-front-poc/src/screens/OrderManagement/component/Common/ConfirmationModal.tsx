import { Modal } from 'src/common/@the-source/atoms';
import { useNavigate } from 'react-router-dom';
import { Button, Grid } from 'src/common/@the-source/atoms';
import { useContext, useEffect } from 'react';
import OrderManagementContext from '../../context';
import { document, submitted_document } from '../../mock/document';
import { useSelector } from 'react-redux';
import { show_document_toast_message } from 'src/actions/document';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
// import { DRAWER_TYPES } from '../../constants';
import EmailModalContent from './EmailModalContent';

import CustomText from 'src/common/@the-source/CustomText';
const ConfirmationModal = () => {
	const {
		set_show_confirmation_modal,
		show_confirmation_modal,
		handle_document_status,
		loader,
		handle_edit_cart,
		document_data,
		action_type,
		handle_edit_quote,
		is_end_state,
		confirmation_action,
		handle_drawer_state,
		handle_drawer_type,
		set_refetch,
		previous_action,
		set_previous_action,
		handle_navigation_to_draft,
		handle_delete_document_api,
		handle_re_submit_quote,
		handle_update_pending_order,
		email_data,
		set_email_data,
		email_checkbox,
		set_email_checkbox,
	} = useContext(OrderManagementContext);
	const is_editable_quote = useSelector((state: any) => state?.document.is_editable_quote);
	const user_permissions = useSelector((state: any) => state?.login?.permissions);
	const approval_access_data = _.find(user_permissions, { slug: 'approve_orders' });
	const dispatch = useDispatch();
	const { document_status, type, id } = document_data;
	const navigate = useNavigate();

	const { is_primary_loading, is_secondary_loading } = loader;

	const check_quote = (flag: boolean) => {
		return (
			document_status === document?.DocumentStatus?.submitted &&
			(flag ? is_editable_quote : !is_editable_quote) &&
			action_type !== 'previous'
		);
	};

	const handle_get_action = (action_data: any) => {
		if (previous_action) {
			return document?.Actions[previous_action];
		}

		if (confirmation_action) return document?.Actions[confirmation_action];

		if (check_quote(true)) {
			return submitted_document.review_page;
		}

		if (check_quote(false)) {
			return submitted_document?.confirm_page;
		}

		return document?.Actions[action_data];
	};

	let document_type_data: any = type === document.DocumentTypeEnum.ORDER ? document?.ORDER_ACTIONS : document?.QUOTE_ACTIONS;

	const handle_get_action_state = (status: any) => {
		if (status === document?.DocumentStatus?.pendingApproval && approval_access_data?.toggle) {
			return document_type_data[document_status]?.approval_mode_on?.[action_type];
		}

		if (status === document?.DocumentStatus?.draft && type === document.DocumentTypeEnum.ORDER) {
			const mode = approval_access_data?.toggle ? 'approval_mode_on' : 'approval_mode_off';
			return document_type_data[document_status]?.[mode]?.[action_type];
		}

		return document_type_data[document_status]?.[action_type];
	};

	let action = handle_get_action_state(document_status);
	const clicked_action = handle_get_action(action);
	const modal_cta = clicked_action?.cta;

	const modal_message = clicked_action?.modal_message;

	const current_cta = modal_cta?.current;

	const next_cta = modal_cta?.next;

	const handle_close_modal = () => {
		set_show_confirmation_modal(false);
	};

	const handle_update_document_status = (message: any, val: any) => {
		dispatch(show_document_toast_message(message));
		handle_document_status(val);
		if (val === 'reject') {
			set_refetch((flag: boolean) => !flag);
		}
	};

	const handle_next_click = (message: any, val: any) => {
		switch (val) {
			case 'convert':
			case 'cancel':
			case 'reject':
			case 'confirm':
			case 'submit':
			case 'pending-approval':
				handle_update_document_status(message, val);
				break;
			case 'repeat_order':
			case 'repeat_quote':
				handle_close_modal();
				handle_navigation_to_draft();
				break;
			case 'delete_order':
			case 'delete_quote':
				handle_close_modal();
				handle_delete_document_api();
				break;
			case 'refund':
				handle_close_modal();
				// handle_drawer_state(true);
				// handle_drawer_type(DRAWER_TYPES.refund_payment);
				navigate(`/payment/form/refund/order/${document_data?.id}`, {
					state: {
						document_route: location.pathname,
					},
				});
				break;
			case 'resubmit':
				handle_re_submit_quote('submit');
				break;
			case 'confirm-update':
				document_status && handle_update_pending_order(document_status);
				break;
		}
	};

	const handle_current_click = (val: any) => {
		switch (val) {
			case 'edit_quote':
				return handle_edit_quote();
			case 'edit_cart':
				return handle_edit_cart('submitted_quote_page');
			default:
				return handle_close_modal();
		}
	};

	const render_email_content = (
		<EmailModalContent
			modal_message={modal_message}
			payload={{
				action:
					next_cta?.value === 'confirm-update'
						? document_status === document.DocumentStatus?.confirmed
							? 'confirm-update'
							: 'pending-approval-update'
						: next_cta?.value,
				document_id: id,
				entity: type,
			}}
			email_data={email_data}
			set_email_data={set_email_data}
			email_checkbox={email_checkbox}
			set_email_checkbox={set_email_checkbox}
			handle_drawer_state={handle_drawer_state}
			handle_drawer_type={handle_drawer_type}
		/>
	);

	const get_content_by_action = () => {
		switch (true) {
			case _.isEqual(previous_action, 'RejectOrderRefundAction'):
				return <CustomText type='Body'>{modal_message?.sub}</CustomText>;
			default:
				return render_email_content;
		}
	};

	useEffect(() => {
		if (previous_action && !show_confirmation_modal) {
			set_previous_action(null);
		}
	}, [show_confirmation_modal]);

	return (
		<Modal
			width={500}
			open={show_confirmation_modal}
			onClose={() => set_show_confirmation_modal(false)}
			title={modal_message?.title}
			_height={next_cta?.key ? '22rem' : 'auto'}
			footer={
				<Grid display='flex' justifyContent='flex-end' gap={1.2}>
					<Button
						disabled={is_primary_loading || is_secondary_loading || is_end_state}
						onClick={() => handle_current_click(current_cta?.value)}
						variant='outlined'>
						{current_cta?.label}
					</Button>
					<Button
						disabled={is_primary_loading || is_secondary_loading || is_end_state}
						loading={is_primary_loading || is_secondary_loading}
						onClick={() => handle_next_click(clicked_action?.message, next_cta?.value)}>
						{next_cta?.label}
					</Button>
				</Grid>
			}
			children={get_content_by_action()}
		/>
	);
};

export default ConfirmationModal;
