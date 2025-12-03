import { Divider, TextField } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Avatar, Button, Drawer, Grid, Icon, Image, Modal } from 'src/common/@the-source/atoms';
import _ from 'lodash';
import { t } from 'i18next';
import ImageLinks from 'src/assets/images/ImageLinks';
import useBuyerDashboard from '../useBuyerDashboard';
import CollectDrawerSkeleton from 'src/screens/OrderManagement/component/Drawer/CollectDrawerSkeleton';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import RadioGroup from 'src/common/@the-source/molecules/RadioGroup';
import api_requests from 'src/utils/api_requests';
import { REFUND_OPTION_VALUES } from '../constants';
import { PERMISSIONS } from 'src/casl/permissions';
import { secondary } from 'src/utils/light.theme';
import { colors } from 'src/utils/theme';
import { get_formatted_price_with_currency } from 'src/utils/common';

const RefundCreditsComp = ({
	data,
	is_visible,
	close,
	handle_submit,
	set_is_modal_open,
	is_terminal_modal_open,
	set_is_terminal_modal_open,
	reason,
	set_reason,
	input_value,
	set_input_value,
	set_refund_drawer,
	is_credits_drawer,
	selected_refund_destination,
	set_selected_refund_destination,
	currency,
}: any) => {
	const { buyer_data } = useBuyerDashboard(data?.buyer_id);
	const [is_loading, set_is_loading] = useState<boolean>(true);
	const [refund_data, set_refund_data] = useState<any>(null);

	const user_permissions = useSelector((state: any) => state?.login?.permissions);
	const theme: any = useTheme();

	useEffect(() => {
		if (!data?.document_id || is_credits_drawer) return;
		(async function get_refund_data() {
			try {
				const response: any = await api_requests.order_management.get_refund_data({ document_id: data?.document_id });
				if (response?.status === 200) {
					set_refund_data(response);
				}
			} catch (error) {
				console.error(error);
			}
		})();
	}, [data, is_credits_drawer]);

	const handleInputChange = (event: any) => {
		let inputValue = event.target.value.replace(/^0+/, '');
		if (inputValue === '' || inputValue[0] === '.') inputValue = 0 + inputValue;
		const maxAmount = data?.refundable_amount;
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

	const refund_source_options = useMemo(() => {
		const permission_mapping = [
			{ slug: PERMISSIONS.refund_source.slug, value: REFUND_OPTION_VALUES.SOURCE, label: t('Payment.RefundToSource') },
			{ slug: PERMISSIONS.refund_credits.slug, value: REFUND_OPTION_VALUES.WALLET, label: t('Payment.RefundAsCredits') },
		];
		return permission_mapping
			.filter(({ slug }) => _.find(user_permissions, { slug })?.toggle)
			.map(({ value, label }) => ({ value, label }));
	}, [user_permissions]);

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H2'>{is_credits_drawer ? 'Refund credits' : 'Refund payment'}</CustomText>
				<Icon size='24' iconName='IconX' sx={{ cursor: 'pointer' }} onClick={close} />
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Button onClick={close} variant='outlined' sx={{ padding: '10px 24px' }}>
					{t('Common.RefundPaymentDrawer.Cancel')}
				</Button>
				<Button
					disabled={Number(input_value) === 0}
					onClick={() => {
						if (data.source === 'terminal') {
							set_is_terminal_modal_open(true);
							handle_submit();
						} else {
							set_refund_drawer((prev: any) => ({ ...prev, state: false }));
							set_is_modal_open(true);
						}
					}}
					sx={{ padding: '10px 24px' }}>
					{t('Common.RefundPaymentDrawer.Refund')}
				</Button>
			</Grid>
		);
	};

	const check_permission = (paymentPermissions: string[] = []) => {
		return paymentPermissions.some((permission) => _.find(user_permissions, { slug: permission })?.toggle);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<Grid
					display='flex'
					justifyContent='space-between'
					sx={{ background: theme?.payments?.refund_credits?.background, borderRadius: '12px', padding: '12px 16px' }}>
					<CustomText type='H3'>{is_credits_drawer ? 'Refundable credits' : 'Amount received'}</CustomText>
					<CustomText type='H3'>{get_formatted_price_with_currency(currency, data?.refundable_amount)}</CustomText>
				</Grid>

				<Grid
					borderRadius={1.2}
					sx={{ background: theme?.payments?.refund_credits?.buyer_details?.background }}
					display='flex'
					direction='column'
					p={2.4}
					gap={2.4}>
					<Grid display='flex' gap={2} alignItems='center'>
						<Avatar
							variant='circular'
							backgroundColor={theme?.payments?.refund_credits?.buyer_details?.avatar?.background}
							color={theme?.payments?.buyer_details?.avatar?.color}
							size='large'
							style={{
								padding: 4,
							}}
							isImageAvatar={false}
							content={
								<CustomText type='H2' color={theme?.payments?.refund_credits?.buyer_details?.avatar?.text}>
									{_(buyer_data?.name || '- -')
										.split(' ')
										.map((part) => part.charAt(0))
										.join('')
										.toUpperCase()}
								</CustomText>
							}
						/>
						<Grid>
							<CustomText type='H6'>{buyer_data?.name || '--'}</CustomText>
							<CustomText color={theme?.payments?.refund_credits?.buyer_details?.text}>{buyer_data?.location || '--'}</CustomText>
						</Grid>
					</Grid>
					{check_permission(['wallet_view']) && (
						<Grid display='flex' justifyContent='space-between'>
							<CustomText type='Subtitle'>{t('OrderManagement.CartCheckoutCard.AvailableCredits')}</CustomText>
							<CustomText type='Subtitle'>{get_formatted_price_with_currency(currency, buyer_data?.wallet_balance)}</CustomText>
						</Grid>
					)}
				</Grid>

				<hr></hr>

				<TextField
					onChange={handleInputChange}
					label={'Amount to be refunded'}
					name={'Amount'}
					value={input_value}
					required={true}
					fullWidth
				/>

				<TextField
					onChange={(e) => set_reason(e.target.value)}
					label={'Reason for refund '}
					name={'Write the reason here'}
					value={reason}
					fullWidth
					sx={{ label: { color: 'black' } }}
				/>

				<hr></hr>

				{!is_credits_drawer && Boolean(refund_source_options?.length) && (
					<>
						<Grid display='flex' direction='column' gap={2.4}>
							<CustomText type='Title'>
								Choose refund destination <span style={{ color: 'red' }}>*</span>
							</CustomText>
							<RadioGroup
								selectedOption={selected_refund_destination}
								options={refund_source_options}
								onChange={set_selected_refund_destination}
							/>
						</Grid>
						<hr></hr>
					</>
				)}

				<Grid display='flex' direction='column' gap={2.4}>
					<CustomText type='Title'>Amount will be refunded to the sources mentioned below</CustomText>
					<Grid display='flex' direction='column' gap={0.8}>
						<Grid
							display='flex'
							justifyContent='space-between'
							borderRadius='12px'
							sx={{ padding: '12px 16px', background: theme?.payments?.refund_credits?.background2 }}>
							{selected_refund_destination === REFUND_OPTION_VALUES.WALLET ? (
								<Grid display='flex' direction='column' gap={0.4} flex={1}>
									<Grid display='flex' gap={0.6} alignItems='center'>
										<CustomText type='Body'>{t('Common.RefundPaymentDrawer.Credits')}</CustomText>
										<Icon iconName='IconWallet' color={secondary[700]} />
									</Grid>
									{refund_data?.wallet_balance && (
										<CustomText type='Body' color={colors.secondary_text}>
											{t('Common.RefundPaymentDrawer.CurrentBalance', {
												price: get_formatted_price_with_currency(currency, refund_data?.wallet_balance),
											})}
										</CustomText>
									)}
								</Grid>
							) : (
								<Grid display='flex' direction='column' gap={0.4} flex={1}>
									<Grid display='flex' gap={0.6} alignItems='center'>
										<CustomText type='Body'>{data?.payment_method_info?.text_value}</CustomText>
										<Image
											width={35}
											height={35}
											style={{ borderRadius: 8, marginRight: 10 }}
											src={data?.payment_method_info?.image_src}
											alt='test'
										/>
									</Grid>
									<CustomText type='Body' color={theme?.payments?.refund_credits?.text}>
										{data?.source === 'terminal' ? `Refund request will be sent to ${data?.terminal_name}` : data?.sub_title}
									</CustomText>
								</Grid>
							)}

							<CustomText type='H3' style={{ width: 'auto' }}>
								{get_formatted_price_with_currency(currency, input_value)}
							</CustomText>
						</Grid>
					</Grid>
				</Grid>
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

	const handle_render_terminal_modal_content = () => {
		return (
			<Grid display='flex' direction='column' p={1.6} gap={3.6}>
				<Grid width='100%' display='flex' gap={2} alignItems='center'>
					<Image src={ImageLinks.Terminal} width={127} height={127} />
					<CustomText type='Subtitle' color={theme?.payments?.refund_credits?.text}>
						{t('Common.RefundPaymentDrawer.UseTerminal')}
					</CustomText>
				</Grid>
			</Grid>
		);
	};

	const handle_render_terminal_modal_footer = () => {
		return (
			<Grid
				display={'flex'}
				justifyContent={'space-between'}
				sx={{ background: theme?.payments?.refund_credits?.background, borderRadius: '12px', padding: '12px 16px' }}
				width={186}>
				<CustomText type='H3'>Amount</CustomText>
				<CustomText type='H3'>{get_formatted_price_with_currency(currency, input_value)}</CustomText>
			</Grid>
		);
	};

	useEffect(() => {
		if (buyer_data) set_is_loading(false);
	}, [buyer_data]);

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
			<Drawer width={480} open={is_visible} onClose={close} content={is_loading ? <CollectDrawerSkeleton /> : handle_render_drawer()} />;
		</>
	);
};

const RefundCreditsDrawer = (props: any) => {
	const { is_visible } = props;
	if (!is_visible) {
		return null;
	}
	return <RefundCreditsComp {...props} />;
};

export default RefundCreditsDrawer;
