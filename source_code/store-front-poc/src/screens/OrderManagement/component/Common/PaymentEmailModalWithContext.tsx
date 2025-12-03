import { useContext } from 'react';
import OrderManagementContext from '../../context';
import PaymentEmailModal from 'src/common/PaymentEmailModal';

const PaymentEmailModalWithContext = ({ handle_submit, currency }: any) => {
	const {
		set_payment_email_modal,
		payment_email_modal,
		payment_email_payload,
		email_data,
		set_email_data,
		email_checkbox,
		set_email_checkbox,
		handle_drawer_state,
		handle_drawer_type,
		is_payment_email_submit_loading,
		set_is_payment_email_submit_loading,
	} = useContext(OrderManagementContext);

	return (
		<PaymentEmailModal
			handle_submit={handle_submit}
			currency={currency}
			payment_email_modal={payment_email_modal}
			set_payment_email_modal={set_payment_email_modal}
			payment_email_payload={payment_email_payload}
			email_data={email_data}
			set_email_data={set_email_data}
			email_checkbox={email_checkbox}
			set_email_checkbox={set_email_checkbox}
			handle_drawer_state={handle_drawer_state}
			handle_drawer_type={handle_drawer_type}
			is_payment_email_submit_loading={is_payment_email_submit_loading}
			set_is_payment_email_submit_loading={set_is_payment_email_submit_loading}
		/>
	);
};

export default PaymentEmailModalWithContext;
