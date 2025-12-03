import { Divider, TextField } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon, Image, Modal } from 'src/common/@the-source/atoms';
import RadioGroup from 'src/common/@the-source/molecules/RadioGroup';
import Payments from '../Common/Payments';
import _ from 'lodash';
import OrderManagementContext from '../../context';
import RefundDrawerSkeleton from './RefundDrawerSkeleton';
import { t } from 'i18next';
import api_requests from 'src/utils/api_requests';
import { useSelector } from 'react-redux';
import ImageLinks from 'src/assets/images/ImageLinks';
import { useTheme } from '@mui/material/styles';
import { warning } from 'src/utils/common.theme';
import { RefundPaymentCompProps } from 'src/screens/BuyerDashboard/interfaces';
import { get_formatted_price_with_currency } from 'src/utils/common';

const terminal_footer = {
	background: warning[50],
	borderRadius: '12px',
	padding: '12px 16px',
};

const RefundPaymentComp = ({
	is_visible,
	close,
	document_id,
	set_data,
	set_input_value,
	data,
	payment_ids,
	selected_option,
	reason,
	input_value,
	is_button_loading,
	set_payment_ids,
	set_reason,
	update_selected_option,
	currency,
}: RefundPaymentCompProps) => {
	const { set_payment_email_modal, set_payment_email_payload } = useContext(OrderManagementContext);
	const [is_loading, set_is_loading] = useState<boolean>(true);
	const permissions = useSelector((state: any) => state?.login?.permissions);
	const [is_terminal_modal_open, set_is_terminal_modal_open] = useState<boolean>(false);
	const theme: any = useTheme();

	const get_refund_data = async () => {
		api_requests.order_management
			.get_refund_data({ document_id })
			.then((res: any) => {
				if (res?.status === 200) {
					set_data(res);
					set_input_value(res?.refundable_amount);
				}
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				set_is_loading(false);
			});
	};

	const check_condition = () => {
		return _.find(data?.payments, (payment: any) => payment_ids?.includes(payment?.id))?.source === 'terminal';
	};

	const handle_next_click = () => {
		if (check_condition()) {
			set_is_terminal_modal_open(true);
		} else {
			close();
			set_payment_email_payload({
				payment_type: 'payment_refund',
				input_value,
				payload: {
					entity: 'payment',
					action: 'payment_refund',
					document_id,
					additional_info: {
						payment_entity: 'order',
						refund_destination: selected_option,
					},
				},
				drawer_type: 'refund_payment',
			});
			set_payment_email_modal(true);
		}
	};

	const handleInputChange = (event: any) => {
		let inputValue = event.target.value.replace(/^0+/, '');
		if (inputValue === '' || inputValue[0] === '.') inputValue = 0 + inputValue;
		const filteredPayments = _.filter(data?.payments, (payment) => _.includes(payment_ids, payment?.id));
		const maxAmount = _.sumBy(filteredPayments, 'amount');
		const isValidNumber = /^(|\d+\.?\d{0,2}|\.\d{0,2})$/.test(inputValue);
		if (isValidNumber) {
			if (!inputValue.endsWith('.')) {
				const numericValue = Number(inputValue);
				if (numericValue <= maxAmount) {
					set_input_value(inputValue);
				}
			} else {
				set_input_value(inputValue);
			}
		}
	};

	const handle_destination = () => {
		const destinations: any = [];
		if (_.find(permissions, { slug: 'refund_source' })?.toggle) destinations.push({ value: 'source', label: t('Payment.RefundToSource') });
		if (_.find(permissions, { slug: 'refund_credits' })?.toggle)
			destinations.push({ value: 'wallet', label: t('Payment.RefundAsCredits') });
		return destinations;
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H2'>{t('Common.RefundPaymentDrawer.RefundPayment')}</CustomText>
				<Icon size='24' iconName='IconX' sx={{ cursor: 'pointer' }} onClick={close} />
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer' justifyContent='flex-end' gap={1.2}>
				<Button onClick={close} variant='outlined' sx={{ padding: '10px 24px' }}>
					{t('Common.RefundPaymentDrawer.Cancel')}
				</Button>
				<Button loading={is_button_loading} disabled={payment_ids?.length === 0} onClick={handle_next_click} sx={{ padding: '10px 24px' }}>
					{t('Common.RefundPaymentDrawer.Refund')}
				</Button>
			</Grid>
		);
	};

	const check_disabled = () => {
		if (payment_ids?.length === 1) {
			const selected_payment = _.find(data?.payments, (payment: any) => _.includes(payment_ids, payment?.id));
			return selected_payment?.source === 'terminal' || !selected_payment?.partial_refund_allowed;
		}
		return true;
	};

	const handle_render_list = () => {
		if (selected_option === 'wallet') {
			return (
				<Grid
					display='flex'
					justifyContent='space-between'
					sx={{ background: theme?.payments?.refund_payment?.background, borderRadius: '12px', padding: '12px 16px' }}>
					<Grid display='flex' direction='column' gap={0.4}>
						<Grid display='flex' gap={0.6} alignItems='center'>
							<CustomText type='Body'>{t('Common.RefundPaymentDrawer.Credits')}</CustomText>
							<Icon iconName='IconWallet' color={theme?.payments?.refund_payment?.icon} />
						</Grid>
						<CustomText type='Body' color={theme?.payments?.refund_payment?.text}>
							{t('Common.RefundPaymentDrawer.CurrentBalance', { price: get_formatted_price_with_currency(currency, data?.wallet_balance) })}
						</CustomText>
					</Grid>
					<CustomText type='H3'>{get_formatted_price_with_currency(currency, input_value)}</CustomText>
				</Grid>
			);
		} else {
			const temp: any = {};
			_.forEach(payment_ids, (payment_id) => {
				const item = _.find(data?.payments, (i) => i.id === payment_id);
				const payment_method_id = item?.payment_method_id;
				if (item?.source !== 'terminal') {
					if (temp[payment_method_id]) {
						temp[payment_method_id].amount += item?.amount;
					} else {
						temp[payment_method_id] = {
							...data?.payment_method_ids[payment_method_id],
							amount: item?.amount,
						};
					}
				} else {
					temp[payment_method_id] = data?.payment_method_ids[payment_method_id];
				}
			});

			return (
				<Grid display='flex' direction='column' gap={0.8}>
					{_.map(temp, (item, index) => (
						<Grid
							key={index}
							display='flex'
							justifyContent='space-between'
							borderRadius='12px'
							sx={{ padding: '12px 16px', background: theme?.payments?.refund_payment?.background }}>
							<Grid display='flex' direction='column' gap={0.4} flex={1}>
								<Grid display='flex' gap={0.6} alignItems='center'>
									<CustomText type='Body'>{item.title}</CustomText>
									<Image
										src={item?.logo}
										width={item?.payment_method_type === 'wallet' || item?.payment_method_id === 'manual' ? 24 : 40}
										height={24}
									/>
								</Grid>
								<CustomText type='Body' color={theme?.payments?.refund_payment?.text}>
									{item?.terminal_id ? `Refund request will be sent to ${item.terminal_name}` : item.subtitle}
								</CustomText>
							</Grid>
							<CustomText type='H3' style={{ width: 'auto' }}>
								{get_formatted_price_with_currency(currency, check_disabled() ? item?.amount : input_value)}
							</CustomText>
						</Grid>
					))}
				</Grid>
			);
		}
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<Grid
					display='flex'
					justifyContent='space-between'
					sx={{ background: 'rgba(254, 247, 234, 1)', borderRadius: '12px', padding: '12px 16px' }}>
					<CustomText type='H3'>{t('Common.RefundPaymentDrawer.RefundAmount')}</CustomText>
					<CustomText type='H3'>{get_formatted_price_with_currency(currency, data?.refundable_amount)}</CustomText>
				</Grid>

				<hr></hr>

				<Payments
					set_payment_ids={set_payment_ids}
					set_input_value={set_input_value}
					data={data?.payments}
					payment_method_ids={data?.payment_method_ids}
					currency={currency}
				/>

				<hr></hr>

				<TextField
					onChange={handleInputChange}
					label={'Amount to be refunded'}
					name={'Amount'}
					value={input_value}
					disabled={check_disabled()}
					required={true}
					fullWidth
				/>

				<TextField
					onChange={(e) => set_reason(e.target.value)}
					label={'Reason for refund '}
					name={'Write the reason here'}
					value={reason}
					fullWidth
					sx={{ label: { color: theme?.order_management?.refund_payment_drawer?.text_field_color } }}
				/>

				<hr></hr>

				<Grid display='flex' direction='column' gap={2.4}>
					<CustomText type='Title'>
						Choose refund destination <span style={{ color: theme?.order_management?.refund_payment_drawer?.custom_color }}>*</span>
					</CustomText>
					<RadioGroup selectedOption={selected_option} options={handle_destination()} onChange={update_selected_option} />
				</Grid>

				<hr></hr>

				{payment_ids?.length > 0 && (
					<Grid display='flex' direction='column' gap={2.4}>
						<CustomText type='Title'>Amount will be refunded to the sources mentioned below</CustomText>
						{handle_render_list()}
					</Grid>
				)}
			</Grid>
		);
	};

	const handle_render_drawer = () => {
		return (
			<Grid className='drawer-container'>
				{handle_render_header()}
				<Divider className='drawer-divider' />
				{handle_render_drawer_content()}
				<Divider className='drawer-divider' />
				{handle_render_footer()}
			</Grid>
		);
	};

	const handle_render_terminal_modal_footer = () => {
		return (
			<Grid display={'flex'} justifyContent={'space-between'} sx={terminal_footer} width={186}>
				<CustomText type='H3'>Amount</CustomText>
				<CustomText type='H3'>{get_formatted_price_with_currency(currency, input_value)}</CustomText>
			</Grid>
		);
	};

	const handle_render_terminal_modal_content = () => {
		return (
			<Grid display='flex' direction='column' p={1.6} gap={3.6}>
				<Grid width='100%' display='flex' gap={2} alignItems='center'>
					<Image src={ImageLinks.Terminal} width={127} height={127} />
					<CustomText type='Subtitle' color={theme?.order_management?.refund_payment_drawer?.grid_custom_color}>
						{t('Common.RefundPaymentDrawer.UseTerminal')}
					</CustomText>
				</Grid>
			</Grid>
		);
	};

	useEffect(() => {
		get_refund_data();
	}, []);

	return (
		<>
			<Modal
				width={430}
				open={is_terminal_modal_open}
				onClose={() => set_is_terminal_modal_open(false)}
				title={'Complete refund'}
				footer={handle_render_terminal_modal_footer()}
				children={handle_render_terminal_modal_content()}
			/>
			<Drawer width={480} open={is_visible} onClose={close} content={is_loading ? <RefundDrawerSkeleton /> : handle_render_drawer()} />;
		</>
	);
};

const RefundPaymentDrawer = (props: any) => {
	const { is_visible } = props;
	if (!is_visible) {
		return null;
	}
	return <RefundPaymentComp {...props} />;
};

export default RefundPaymentDrawer;
