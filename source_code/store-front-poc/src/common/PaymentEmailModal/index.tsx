import { Modal } from 'src/common/@the-source/atoms';
import { Button, Grid } from 'src/common/@the-source/atoms';
import { t } from 'i18next';
import { get_formatted_price_with_currency } from 'src/utils/common';
import EmailModalContent from 'src/screens/OrderManagement/component/Common/EmailModalContent';
import get from 'lodash/get';
import { format_payment_schedule_date } from 'src/screens/Payment/utils';
import { convert_date_to_timezone } from 'src/utils/dateUtils';

const PaymentEmailModal = ({
	handle_submit,
	currency,
	payment_email_modal,
	set_payment_email_modal,
	payment_email_payload,
	email_data,
	set_email_data,
	email_checkbox,
	set_email_checkbox,
	handle_drawer_state,
	handle_drawer_type,
	is_payment_email_submit_loading,
	set_is_payment_email_submit_loading,
	selected_option,
}: any) => {
	const { payment_type = '', input_value = 0, payload = {}, drawer_type = '' } = payment_email_payload;
	const payment_action = get(payload, 'action', '');

	const modal_message =
		payment_type === 'payment_success'
			? payment_action === 'recurring_payment_created'
				? {
						title: t('Common.CollectPaymentDrawer.ConfirmSubsPaymentTitle'),
						sub: t('Common.CollectPaymentDrawer.ConfirmSubsPaymentSubTitle', {
							total_amount: get_formatted_price_with_currency(currency, parseFloat(payload?.subscription_data?.total_amount)),
							recurring_amount: get_formatted_price_with_currency(currency, payload?.subscription_data?.recurring_amount),
							start_date: format_payment_schedule_date(convert_date_to_timezone(payload?.subscription_data?.start_date, 'DD-MM-YYYY')),
							end_date: format_payment_schedule_date(convert_date_to_timezone(payload?.subscription_data?.end_date, 'DD-MM-YYYY')),
						}),
				  }
				: payment_action === 'payment_authorization'
				? {
						title: t('Common.CollectPaymentDrawer.ConfirmAuthorizePaymentTitle'),
						sub: t('Common.CollectPaymentDrawer.ConfirmAuthorizePaymentSubTitle', {
							price: get_formatted_price_with_currency(currency, input_value),
						}),
				  }
				: {
						title: t('Common.CollectPaymentDrawer.CollectPayment'),
						sub:
							selected_option === 'ach'
								? t('Common.CollectPaymentDrawer.ConfirmCollectPaymentACH', {
										price: get_formatted_price_with_currency(currency, input_value),
								  })
								: t('Common.CollectPaymentDrawer.ConfirmCollectPayment', {
										price: get_formatted_price_with_currency(currency, input_value),
								  }),
				  }
			: payment_action === 'recurring_payment_updated'
			? {
					title: t('Common.RecurringPaymentDrawer.SaveChanges'),
					sub: t('Common.RecurringPaymentDrawer.ConfirmUpdate'),
			  }
			: {
					title: t('Common.RefundPaymentDrawer.RefundPayment'),
					sub: t('Common.RefundPaymentDrawer.ConfirmRefund', { price: get_formatted_price_with_currency(currency, input_value) }),
			  };

	return (
		<Modal
			width={500}
			open={payment_email_modal}
			onClose={() => set_payment_email_modal(false)}
			title={modal_message?.title}
			footer={
				<Grid display='flex' justifyContent='flex-end' gap={1.2}>
					<Button onClick={() => set_payment_email_modal(false)} variant='outlined'>
						Cancel
					</Button>
					<Button
						onClick={() => {
							set_is_payment_email_submit_loading(true);
							handle_submit(drawer_type);
						}}
						loading={is_payment_email_submit_loading}>
						Confirm
					</Button>
				</Grid>
			}
			children={
				<EmailModalContent
					modal_message={modal_message}
					payload={payload}
					email_data={email_data}
					set_email_data={set_email_data}
					email_checkbox={email_checkbox}
					set_email_checkbox={set_email_checkbox}
					handle_drawer_state={handle_drawer_state}
					handle_drawer_type={handle_drawer_type}
				/>
			}
		/>
	);
};

export default PaymentEmailModal;
