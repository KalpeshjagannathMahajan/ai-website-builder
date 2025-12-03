import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { useParams } from 'react-router-dom';
import { Divider } from '@mui/material';
import { Box, Button, Grid, Checkbox } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from '../styles';
import { useSelector } from 'react-redux';
import { get_formatted_price_with_currency } from 'src/utils/common';
import { t } from 'i18next';
import { PERMISSIONS } from 'src/casl/permissions';
import Can from 'src/casl/Can';

interface Props {
	buyer_data: any;
	methods: any;
	onSubmit: (data: any) => any;
	form_data: any;
	use_credit: boolean;
	set_use_credit: (val: boolean | ((prev: boolean) => boolean)) => any;
	payment_method_attrs: any;
	email_data: any;
	btn_loading: boolean;
	handle_get_payment_charges: any;
	selected_radio_btn: any;
	payment_ids: any;
	set_is_modal_visible: any;
	is_direct_flow: boolean;
	input_value: number;
	is_back_drop_visible: boolean;
	is_transaction_complete_modal_visible: boolean;
	schedule_loading?: boolean;
}

const RenderFooter = ({
	buyer_data,
	methods,
	onSubmit,
	form_data,
	set_use_credit,
	use_credit,
	payment_method_attrs,
	email_data,
	btn_loading = true,
	handle_get_payment_charges,
	selected_radio_btn,
	payment_ids,
	set_is_modal_visible,
	is_direct_flow,
	input_value,
	is_back_drop_visible,
	is_transaction_complete_modal_visible,
	schedule_loading,
}: Props) => {
	const classes = useStyles();
	const currency = useSelector((state: any) => state?.settings?.currency);
	const {
		handleSubmit,
		getValues,
		watch,
		formState: { errors },
	} = methods;
	const wallet_balance = form_data?.wallet_balance;
	const amount = handle_get_payment_charges();
	const credits_used = use_credit ? Math.min(wallet_balance, amount) : 0;
	const selected_option = getValues('payment_method_type');
	const payable_amount = getValues('total_amount') || 0;
	const buyer_name = getValues('buyer_info');
	const { source, id } = useParams();
	const is_refund_flow = source === 'refund' || selected_radio_btn?.value === 'refund';
	const is_authorization_flow = source === 'authorize' || selected_radio_btn?.value === 'authorize';
	const is_subscription_flow = selected_radio_btn?.value === 'subscription';
	const recurring_amount = watch('recurring_amount');
	const recurring_payment_name = watch('name');

	const handle_disable_subscription = () => {
		return Number(payable_amount) === 0 || !payable_amount;
	};

	const check_charge_disabled = () => {
		const attributes = payment_method_attrs;

		if (is_refund_flow) {
			if (!id && isEmpty(buyer_data)) return true;
			return isEmpty(payment_ids) || Number(input_value) === 0;
		}
		if (is_authorization_flow) {
			return isEmpty(payment_method_attrs?.payment_method_id) || Number(input_value) === 0;
		}
		if (!isEmpty(errors)) {
			return true;
		}

		if (is_subscription_flow) {
			if (handle_disable_subscription()) return true;
			return (
				schedule_loading ||
				!recurring_amount ||
				!recurring_payment_name ||
				!attributes?.payment_method_id ||
				attributes.payment_method_id === ''
			);
		}

		if (Number(amount) === 0 && !is_subscription_flow) return true;
		if (selected_option === 'ach') return !attributes?.payment_method_id || attributes.payment_method_id === '';
		if (selected_option === 'card') return !attributes?.payment_method_id || attributes.payment_method_id === '';
		if (selected_option === 'payment_link') return !email_data?.to_emails || email_data?.to_emails.length === 0;
		if (selected_option === 'manual') return !attributes?.payment_mode || !attributes?.collection_date;
		return false;
	};

	const get_button_copy = () => {
		switch (true) {
			case is_refund_flow:
				return t('Payment.Refund.RefundButtonText');

			case is_authorization_flow:
				return t('Payment.Footer.Authorize');

			case use_credit && Number(amount) === credits_used:
				return t('Common.CollectPaymentDrawer.UseCredits');

			case selected_option === 'card' || selected_option === 'terminal' || selected_option === 'ach':
				return t('Common.CollectPaymentDrawer.Charge');

			case selected_option === 'payment_link':
				return t('Payment.SendLink');

			case is_subscription_flow:
				return 'Create';

			default:
				return t('Payment.Save');
		}
	};

	const handle_get_charge = () => {
		const charge = is_subscription_flow ? Number(payable_amount).toString() : (Number(amount) - Number(credits_used)).toString();
		return get_formatted_price_with_currency(currency, charge);
	};

	return (
		<Grid container className={classes.payment_footer_section} id='payment_footer'>
			<Grid item className={classes.payment_footer_container} xs={10} sm={9} md={7} lg={4} xl={6}>
				{!is_refund_flow && !is_authorization_flow && (
					<Can I={PERMISSIONS.collect_payment_credits.slug} a={PERMISSIONS.collect_payment_credits.permissionType}>
						{id && wallet_balance > 0 && (
							<React.Fragment>
								<Grid className={classes.use_credits}>
									<Box display='flex' alignItems='center'>
										<Checkbox
											name='use_credit'
											key='use_credit'
											disabled={Number(amount) === 0 || form_data?.wallet_balance === 0}
											checked={use_credit}
											onChange={() => set_use_credit((prev: boolean) => !prev)}
										/>

										<CustomText type='Title'>Use available credits</CustomText>
									</Box>

									<Box display='flex' alignItems='flex-end' flexDirection={'column'}>
										<CustomText type='H6'>{get_formatted_price_with_currency(currency, form_data?.wallet_balance)}</CustomText>

										{credits_used > 0 && (
											<Grid display='flex' justifyContent='space-between'>
												<CustomText type='Title' style={{ marginRight: 10 }}>
													{t('Common.CollectPaymentDrawer.CreditsUsed')}{' '}
												</CustomText>
												<CustomText type='Title'>{get_formatted_price_with_currency(currency, credits_used)}</CustomText>
											</Grid>
										)}
									</Box>
								</Grid>
								<Divider sx={{ my: 2 }} />
							</React.Fragment>
						)}
					</Can>
				)}

				<Grid
					className={classes.footer_action}
					sx={{
						justifyContent: is_refund_flow || is_authorization_flow ? 'flex-end' : 'space-between',
					}}>
					{!is_refund_flow && !is_authorization_flow && (
						<Box className={classes.total_charge} gap={2}>
							<CustomText type='H3'>{is_subscription_flow ? 'Total' : 'Charge'}</CustomText>
							<CustomText type='H3'>{handle_get_charge()}</CustomText>
						</Box>
					)}
					{is_direct_flow && (
						<Button disabled={Number(amount) === 0 || !buyer_name} onClick={() => set_is_modal_visible(true)}>
							Proceed
						</Button>
					)}
					{!is_direct_flow && (
						<Button
							loading={is_back_drop_visible || is_transaction_complete_modal_visible || is_authorization_flow ? false : btn_loading}
							onClick={handleSubmit(onSubmit)}
							disabled={check_charge_disabled() || is_back_drop_visible || btn_loading}
							variant='contained'>
							{get_button_copy()}
						</Button>
					)}
				</Grid>
			</Grid>
		</Grid>
	);
};

export default RenderFooter;
