import { filter, find, forEach, get, includes, map, size, sumBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Chip, Grid, Icon, Image } from 'src/common/@the-source/atoms';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material';
import RefundTransactions from './RefundTransactions';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import RadioGroup from 'src/common/@the-source/molecules/RadioGroup';
import CustomText from 'src/common/@the-source/CustomText';
import { get_currency, get_formatted_price_with_currency } from 'src/utils/common';
import useStyles from '../styles';
import RenderOrderDetails from './RenderOrderDetails';
import { useMemo } from 'react';
import utils from 'src/utils/utils';
import { colors } from 'src/utils/theme';
import { info } from 'src/utils/common.theme';

interface RefundFormProps {
	form_data: any;
	input_value: number;
	payment_ids: any;
	set_payment_ids: (ids: any[]) => void;
	set_input_value: (value: number) => void;
	methods: any;
	is_order_flow: boolean;
	is_direct_payment_refund: boolean;
}

const RefundForm = ({
	form_data,
	input_value,
	payment_ids,
	set_payment_ids,
	set_input_value,
	methods,
	is_order_flow,
	is_direct_payment_refund,
}: RefundFormProps) => {
	const permissions = useSelector((state: any) => state?.login?.permissions);
	const currency = useSelector((state: any) => state?.settings?.currency);
	const classes = useStyles();
	const { t } = useTranslation();
	const { watch, setValue } = methods;
	const refund_txns = get(form_data, 'payments');
	const selected_destination = watch('refund_destination') ?? 'source';
	const theme: any = useTheme();

	const check_disabled = () => {
		if (payment_ids?.length === 1) {
			const selected_payment = find(refund_txns, (payment: any) => includes(payment_ids, payment?.id));
			return selected_payment?.source === 'terminal' || !selected_payment?.partial_refund_allowed;
		}
		return true;
	};

	const update_selected_destination = (val: string) => {
		setValue('refund_destination', val);
	};

	const destination_options = useMemo(() => {
		const options: any = [];
		if (find(permissions, { slug: 'refund_source' })?.toggle) options.push({ value: 'source', label: t('Payment.RefundToSource') });
		if (find(permissions, { slug: 'refund_credits' })?.toggle && !is_direct_payment_refund)
			options.push({ value: 'wallet', label: t('Payment.RefundAsCredits') });
		return options;
	}, [permissions, is_direct_payment_refund]);

	const handle_input_change = (event: any) => {
		let entered_value = event.target.value.replace(/^0+/, '');
		if (entered_value === '' || entered_value[0] === '.') entered_value = 0 + entered_value;
		const filtered_payments = filter(refund_txns, (payment) => includes(payment_ids, payment?.id));
		const max_amount = sumBy(filtered_payments, 'amount');
		const is_valid_number = utils.check_valid_number(entered_value);
		if (is_valid_number) {
			if (!entered_value.endsWith('.')) {
				const numeric_value = Number(entered_value);
				if (numeric_value <= max_amount) {
					set_input_value(entered_value);
				}
			} else {
				set_input_value(entered_value);
			}
		}
	};

	const handle_render_list = () => {
		if (selected_destination === 'wallet') {
			return (
				<Grid display='flex' justifyContent='space-between' className={classes.refund_wallet}>
					<Grid display='flex' direction='column' gap={0.4}>
						<Grid display='flex' gap={0.6} alignItems='center'>
							<CustomText type='Body'>{t('Common.RefundPaymentDrawer.Credits')}</CustomText>
							<Icon iconName='IconWallet' color='rgba(103, 109, 119, 1)' />
						</Grid>
						<CustomText type='Body' color='rgba(0, 0, 0, 0.6)'>
							{t('Common.RefundPaymentDrawer.CurrentBalance', {
								price: get_formatted_price_with_currency(currency, form_data?.wallet_balance),
							})}
						</CustomText>
					</Grid>
					<CustomText type='H3'>{get_formatted_price_with_currency(currency, input_value)}</CustomText>
				</Grid>
			);
		} else {
			const temp: any = {};
			forEach(payment_ids, (payment_id) => {
				const item = find(refund_txns, (i) => i.id === payment_id);
				const payment_method_id = item?.payment_method_id;
				if (item?.source !== 'terminal') {
					if (temp[payment_method_id]) {
						temp[payment_method_id].amount += item?.amount;
					} else {
						temp[payment_method_id] = {
							...form_data?.payment_method_ids[payment_method_id],
							amount: item?.amount,
						};
					}
				} else {
					temp[payment_method_id] = form_data?.payment_method_ids[payment_method_id];
				}
			});

			return (
				<Grid display='flex' direction='column' gap={1.5}>
					{map(temp, (item, index) => {
						const show_ach_chip = item?.payment_method_type === 'ach' && item?.payment_method_id !== 'manual';
						const sub_title = item?.subtitle;
						return (
							<Grid key={index} className={classes.refund_list}>
								<Grid display='flex' direction='column' gap={0.4} flex={1}>
									<Grid display='flex' gap={1.5} alignItems='center'>
										<CustomText type='Title'>{item?.title}</CustomText>
										{show_ach_chip ? (
											<Chip
												size='small'
												bgColor='white'
												sx={{
													padding: '0px 8px',
												}}
												icon={<Icon iconName='IconBuildingBank' color={info.main} />}
												label={
													<CustomText color={colors.black_8} type='Caption'>
														{item?.bank_account_type}
													</CustomText>
												}
											/>
										) : (
											item?.logo && (
												<Image
													src={item?.logo}
													width={item?.payment_method_type === 'wallet' || item?.payment_method_id === 'manual' ? 24 : 40}
													height={24}
												/>
											)
										)}
									</Grid>
									<CustomText type='Body' color={theme?.payments?.grey_dark}>
										{item?.terminal_id ? `Refund request will be sent to ${item?.terminal_name}` : sub_title}
									</CustomText>
								</Grid>
								<CustomText type='H3' style={{ width: 'auto' }}>
									{get_formatted_price_with_currency(currency, check_disabled() ? item?.amount : input_value)}
								</CustomText>
							</Grid>
						);
					})}
				</Grid>
			);
		}
	};

	const render_divider = <hr style={{ margin: '0px' }}></hr>;

	return (
		<Grid container className={classes.refund_form_container}>
			{is_order_flow && (
				<RenderOrderDetails
					data={form_data}
					currency={currency}
					divider_style={{
						margin: '0px',
					}}
				/>
			)}

			<Grid item width='100%' pt={!is_order_flow ? 2 : 0}>
				<RefundTransactions
					set_payment_ids={set_payment_ids}
					set_input_value={set_input_value}
					transactions={refund_txns}
					payment_method_ids={form_data?.payment_method_ids}
					currency={currency}
				/>
			</Grid>

			{render_divider}

			<Grid item width='100%' pl={1} display='flex' justifyContent='space-between' alignItems='center'>
				<CustomText type='H6'>{t('Payment.Refund.AmountToBeRefunded')}</CustomText>
				<FormBuilder
					placeholder={t('Payment.Refund.AmountToBeRefunded')}
					name='amount'
					value={input_value}
					defaultValue={input_value}
					disabled={check_disabled()}
					onChange={handle_input_change}
					type='text'
					inputProps={{
						autoComplete: 'off',
					}}
					style={{
						width: '150px',
					}}
					size='small'
					start_icon={get_currency(currency)}
				/>
			</Grid>

			<Grid item width='100%' mt={1}>
				<FormBuilder
					label={t('Payment.Refund.ReasonForRefund')}
					placeholder={t('Payment.Refund.ReasonForRefund')}
					name='reason'
					type='text'
				/>
			</Grid>

			{render_divider}

			<Grid item display='flex' direction='column' gap={1}>
				<CustomText type='H6'>
					{t('Payment.Refund.ChooseRefundDestination')} <span style={{ color: theme?.payments?.red }}>*</span>
				</CustomText>
				<RadioGroup selectedOption={selected_destination} options={destination_options} onChange={update_selected_destination} />
			</Grid>

			{render_divider}

			{size(payment_ids) > 0 && (
				<Grid display='flex' direction='column' gap={2}>
					<CustomText type='Title'>{t('Payment.Refund.RefundDestinationInfo')}</CustomText>
					{handle_render_list()}
				</Grid>
			)}
		</Grid>
	);
};

export default RefundForm;
