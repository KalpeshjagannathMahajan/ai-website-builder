/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { useSelector } from 'react-redux';
import { FormProvider } from 'react-hook-form';
import UsePaymentDetails from '../UsePaymentDetails';
import RenderFormFooter from './RenderFormFooter';
import RenderPaymentForm from './RenderPaymentForm';
import PaymentSkeleton from './PaymentSkeleton';
import SelectBuyerPanel from 'src/common/SelectBuyerPanel/SelectBuyerPanel';
import PaymentEmailModal from 'src/common/PaymentEmailModal';
import TransactionCompleteModal from 'src/screens/OrderManagement/component/Drawer/TransactionCompleteModal';
import CustomToast from 'src/common/CustomToast';
import { useNavigate, useParams } from 'react-router-dom';
import HeaderRadioButton from './HeaderRadioButton';
import DirectPaymentModal from 'src/screens/Dashboard/components/DirectPaymentModal';
import RouteNames from 'src/utils/RouteNames';
import AddEditEmailDrawer from './AddEditEmailDrawer';
import usePaymentsPermissions from 'src/hooks/usePaymentsPermissions';
import Backdrop from 'src/common/@the-source/atoms/Backdrop';
import CircularProgressBar from 'src/common/@the-source/atoms/ProgressBar/CircularProgressBar';
import DiscardModal from './DiscardModal';

const RenderPaymentFormLayout = () => {
	const {
		form_data,
		loading,
		form_section,
		order_edit_flow,
		buyer_edit_flow,
		methods,
		set_use_credit,
		use_credit,
		set_show_invoice,
		show_invoice,
		checked_invoice,
		set_checked_invoice,
		payment_config,
		payment_method_data,
		set_payment_method_attrs,
		email_data,
		set_email_data,
		set_email_checkbox,
		get_email_config_info,
		set_show_buyer_panel,
		show_buyer_panel,
		set_buyer_data,
		buyer_data,
		selected_payment_method_type,
		set_selected_payment_method_type,
		email_checkbox,
		payment_email_modal,
		set_payment_email_modal,
		set_payment_email_payload,
		payment_email_payload,
		payment_method_attrs,
		handle_submit_payment,
		set_is_submit_loading,
		is_submit_loading,
		set_payment_method_data,
		is_transaction_complete_modal_visible,
		set_is_transaction_modal_visible,
		transaction_data,
		set_success_toast,
		success_toast,
		btn_loading,
		handle_get_payment_charges,
		selected_radio_btn,
		set_selected_radio_btn,
		payment_ids,
		set_payment_ids,
		input_value,
		set_input_value,
		set_form_data,
		set_is_modal_visible,
		is_direct_flow,
		is_modal_visible,
		handle_get_payload,
		is_buyer_payment,
		drawer_state,
		handle_drawer_state,
		handle_get_buyer_payment_details,
		all_addresses,
		handle_after_success_callback,
		is_back_drop_visible,
		set_added_card_id,
		added_card_id,
		set_is_authorized,
		edit_form_details,
		show_discard_modal,
		set_show_discard_modal,
		set_temp_selected_radio_btn,
		handle_switch_tab,
		is_auth_flow,
		is_payment_against_buyer,
		ach_modal,
		set_ach_modal,
		selected_option,
		set_selected_opt,
		selected_opt,
		open_drawer,
		set_open_drawer,
		create_recurring_payment_schedule,
		schedule_loading,
		subscription_data,
		selected_payment_method_id,
		set_selected_payment_method_id,
		set_subscription_data,
	} = UsePaymentDetails();
	const {
		has_any_collect_payment_permission,
		has_both_collect_payment_permission,
		has_any_refund_permission,
		has_card_authorization_permission,
		has_void_authorization_permission,
		has_recurring_payment_permission,
	} = usePaymentsPermissions();
	const currency = useSelector((state: any) => state?.settings?.currency);
	const navigate = useNavigate();
	const { source, type, id } = useParams();
	const is_refund_flow = source === 'refund' || selected_radio_btn?.value === 'refund';
	const is_direct_payment_refund = source === 'refund' && type === 'tenant';
	const is_subscription_flow = selected_radio_btn?.value === 'subscription';
	const payload = handle_get_payload();
	const buyer_id = is_payment_against_buyer ? id ?? buyer_data?.id : '';

	const handle_get_input_value = () => {
		if (is_auth_flow || is_refund_flow) {
			return input_value;
		}

		return handle_get_payment_charges();
	};

	const onSubmit = (data: any) => {
		set_payment_email_payload((prev: any) => ({
			...prev,
			payload: {
				...prev?.payload,
				...(is_subscription_flow ? { subscription_data: data } : {}),
				...(!prev?.payload?.buyer_id && { buyer_id: buyer_data?.id }),
			},
			input_value: handle_get_input_value(),
		}));

		const is_payment_link = selected_payment_method_type === 'payment_link';
		const show_email_modal = order_edit_flow || is_payment_against_buyer || is_auth_flow || is_refund_flow || is_subscription_flow;

		if (is_payment_link || !show_email_modal) {
			handle_submit_payment();
		} else {
			set_payment_email_modal(true);
		}
	};

	const handle_close_toast = () => {
		if (success_toast?.callback) {
			success_toast.callback();
		}
		set_success_toast((prev: any) => ({ open: false, title: prev?.title, subtitle: prev?.subtitle, state: prev?.state }));
	};

	return (
		<React.Fragment>
			<HeaderRadioButton
				buyer_data={buyer_data}
				is_buyer_payment={is_buyer_payment}
				selected_radio_btn={selected_radio_btn}
				set_selected_radio_btn={set_selected_radio_btn}
				has_any_refund_permission={has_any_refund_permission}
				has_any_collect_payment_permission={has_any_collect_payment_permission}
				has_card_authorization_permission={has_card_authorization_permission}
				has_recurring_payment_permission={has_recurring_payment_permission}
				set_show_discard_modal={set_show_discard_modal}
				set_temp_selected_radio_btn={set_temp_selected_radio_btn}
			/>

			{loading ? (
				<PaymentSkeleton />
			) : (
				<FormProvider {...methods}>
					<RenderPaymentForm
						form_data={form_data}
						form_section={form_section}
						order_flow={order_edit_flow}
						buyer_flow={buyer_edit_flow}
						set_show_invoice={set_show_invoice}
						show_invoice={show_invoice}
						checked_invoice={checked_invoice}
						set_checked_invoice={set_checked_invoice}
						methods={methods}
						is_buyer_payment={is_buyer_payment}
						is_direct_flow={is_direct_flow}
						payment_config={payment_config}
						payment_method_data={payment_method_data}
						email_data={email_data}
						set_email_data={set_email_data}
						set_email_checkbox={set_email_checkbox}
						set_payment_method_attrs={set_payment_method_attrs}
						get_email_config_info={get_email_config_info}
						set_show_buyer_panel={set_show_buyer_panel}
						buyer_data={buyer_data}
						set_buyer_data={set_buyer_data}
						set_selected_payment_method_type={set_selected_payment_method_type}
						set_payment_method_data={set_payment_method_data}
						handle_get_payment_charges={handle_get_payment_charges}
						selected_radio_btn={selected_radio_btn}
						payment_ids={payment_ids}
						set_payment_ids={set_payment_ids}
						input_value={input_value}
						set_input_value={set_input_value}
						set_form_data={set_form_data}
						ach_modal={ach_modal}
						is_direct_payment_refund={is_direct_payment_refund}
						handle_get_buyer_payment_details={handle_get_buyer_payment_details}
						has_both_collect_payment_permission={has_both_collect_payment_permission}
						all_addresses={all_addresses}
						set_added_card_id={set_added_card_id}
						added_card_id={added_card_id}
						is_refund_flow={is_refund_flow}
						set_is_authorized={set_is_authorized}
						set_success_toast={set_success_toast}
						has_void_authorization_permission={has_void_authorization_permission}
						edit_form_details={edit_form_details}
						set_ach_modal={set_ach_modal}
						set_selected_opt={set_selected_opt}
						selected_opt={selected_opt}
						open_drawer={open_drawer}
						set_open_drawer={set_open_drawer}
						create_recurring_payment_schedule={create_recurring_payment_schedule}
						schedule_loading={schedule_loading}
						subscription_data={subscription_data}
						set_selected_payment_method_id={set_selected_payment_method_id}
						selected_payment_method_id={selected_payment_method_id}
						set_subscription_data={set_subscription_data}
					/>
					<RenderFormFooter
						buyer_data={buyer_data}
						methods={methods}
						onSubmit={onSubmit}
						form_data={form_data}
						email_data={email_data}
						set_use_credit={set_use_credit}
						payment_method_attrs={payment_method_attrs}
						use_credit={use_credit}
						btn_loading={btn_loading}
						handle_get_payment_charges={handle_get_payment_charges}
						selected_radio_btn={selected_radio_btn}
						payment_ids={payment_ids}
						is_direct_flow={is_direct_flow}
						set_is_modal_visible={set_is_modal_visible}
						input_value={input_value}
						is_back_drop_visible={is_back_drop_visible}
						schedule_loading={schedule_loading}
						is_transaction_complete_modal_visible={is_transaction_complete_modal_visible}
					/>
				</FormProvider>
			)}
			{show_buyer_panel && (
				<SelectBuyerPanel
					show_drawer={show_buyer_panel}
					show_add_quick_buyer={false}
					show_guest_buyer={false}
					show_all_buyer={false}
					toggle_drawer={set_show_buyer_panel}
					set_is_buyer_add_form={() => {}}
					buyer_data={buyer_data}
					set_buyer_data={set_buyer_data}
					payment_buyer_flow={true}
					handle_payment_close={() => {
						if (is_direct_flow) {
							navigate(RouteNames.payment.collect_payment.path, { replace: true });
						}
					}}
				/>
			)}
			<PaymentEmailModal
				handle_submit={handle_submit_payment}
				currency={currency}
				payment_email_modal={payment_email_modal}
				set_payment_email_modal={set_payment_email_modal}
				payment_email_payload={payment_email_payload}
				email_data={email_data}
				set_email_data={set_email_data}
				email_checkbox={email_checkbox}
				set_email_checkbox={set_email_checkbox}
				is_payment_email_submit_loading={is_submit_loading}
				set_is_payment_email_submit_loading={set_is_submit_loading}
				handle_drawer_state={handle_drawer_state}
				handle_drawer_type={() => {}} // IMP : Don't remove
				selected_option={selected_option}
			/>
			<TransactionCompleteModal
				is_visible={is_transaction_complete_modal_visible}
				set_is_transaction_modal_visible={set_is_transaction_modal_visible}
				transaction_data={transaction_data}
				close={() => {
					set_is_transaction_modal_visible(false);
					handle_after_success_callback();
				}}
				payment_source={selected_payment_method_type}
				currency={currency}
			/>

			<DirectPaymentModal
				is_modal_visible={is_modal_visible}
				payment_config={payment_config}
				set_is_modal_visible={set_is_modal_visible}
				currency={currency}
				form_data={payload}
				handle_close={handle_after_success_callback}
			/>

			<DiscardModal on_close={() => set_show_discard_modal(false)} is_open_alert={show_discard_modal} on_proceed={handle_switch_tab} />

			<CustomToast
				open={success_toast.open}
				showCross={true}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				show_icon={true}
				is_custom={false}
				autoHideDuration={1000}
				onClose={handle_close_toast}
				state={success_toast.state}
				title={success_toast.title}
				subtitle={success_toast.subtitle}
				showActions={false}
			/>

			<AddEditEmailDrawer
				drawer_state={drawer_state}
				handle_drawer_state={handle_drawer_state}
				email_data={email_data}
				set_email_data={set_email_data}
				buyer_id={buyer_id}
			/>

			{is_back_drop_visible && (
				<Backdrop open={is_back_drop_visible} sx={{ zIndex: '9999', position: 'absolute', left: '-80px' }}>
					<CircularProgressBar style={{ color: 'inherit' }} />
				</Backdrop>
			)}
		</React.Fragment>
	);
};

export default RenderPaymentFormLayout;
