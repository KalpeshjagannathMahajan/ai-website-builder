/* eslint-disable @typescript-eslint/no-unused-vars */
import { t } from 'i18next';
import ImageLinks from 'src/assets/images/ImageLinks';
import CustomText from 'src/common/@the-source/CustomText';
import { useTheme } from '@mui/material/styles';
import { Button, Chip, Grid, Icon, Image, Modal } from 'src/common/@the-source/atoms';
import Alert from 'src/common/@the-source/atoms/Alert';
import { get_short_name } from 'src/screens/Wishlist/utils';
import { get_formatted_price_with_currency } from 'src/utils/common';

import { secondary, text_colors } from 'src/utils/light.theme';
import { colors } from 'src/utils/theme';

interface Props {
	is_visible: boolean;
	set_is_transaction_modal_visible: (state: boolean) => void;
	transaction_data: any;
	close: () => void;
	currency: string;
	payment_source?: string;
}

const TransactionCompleteComp = ({ is_visible, transaction_data, close, currency, payment_source }: Props) => {
	const theme: any = useTheme();
	const handle_render_content = () => {
		return (
			<Grid display='flex' direction='column' p={1.6} gap={1.1}>
				<Grid width='100%' display='flex' gap={2} alignItems='center'>
					<Image
						src={
							transaction_data?.transaction_status === 'success'
								? ImageLinks.payment_successful
								: transaction_data?.transaction_status === 'pending'
								? ImageLinks.payment_pending
								: ImageLinks.payment_failed
						}
						width={127}
						height={127}
					/>
					<Grid display='flex' direction='column' flex={1} gap={0.9}>
						{transaction_data?.display_id && (
							<CustomText type='Subtitle'>
								{t('Common.TransactionCompleteModal.PaymentId', { id: transaction_data?.display_id })}
							</CustomText>
						)}
						<CustomText type='Subtitle'>
							{t('Common.TransactionCompleteModal.Amount', {
								price: get_formatted_price_with_currency(currency, transaction_data?.transaction_amount),
							})}
						</CustomText>
						{transaction_data?.transaction_status !== 'failed' && payment_source === 'card' && (
							<Grid display='flex' gap={1.6} direction='row'>
								{transaction_data?.title && <CustomText type='Title'>{transaction_data?.title}</CustomText>}
								{transaction_data?.logo && <Image src={transaction_data?.logo} width={40} height={24} />}
							</Grid>
						)}

						{transaction_data?.transaction_status !== 'failed' && payment_source === 'ach' && (
							<Grid>
								<Grid display='flex' gap={1.6} direction='row'>
									{transaction_data?.title && (
										<CustomText type='Title' color={secondary.main}>
											{get_short_name(transaction_data?.title, 18)}
										</CustomText>
									)}
									{transaction_data?.bank_account_type && (
										<Chip
											size={'small'}
											bgColor={theme?.palette?.info[100]}
											sx={{ padding: '0px 4px' }}
											icon={<Icon iconName='IconBuildingBank' color={theme?.palette?.info?.main} />}
											label={
												<CustomText color={colors.black_8} type='Caption'>
													{transaction_data?.bank_account_type ?? 'Business checking'}
												</CustomText>
											}
										/>
									)}
								</Grid>
								{transaction_data?.sub_title && <CustomText color={colors.black_8}>{transaction_data?.sub_title}</CustomText>}
							</Grid>
						)}
					</Grid>
				</Grid>
				{transaction_data?.transaction_status === 'success' && payment_source === 'ach' ? (
					<Alert
						icon={<></>}
						style={{ padding: '0px' }}
						open={true}
						severity='info'
						message={transaction_data?.transaction_message ?? t('Common.TransactionCompleteModal.ACHSuccessBody')}
					/>
				) : transaction_data?.transaction_header === 'Partial Payment Success' ? (
					<Alert
						style={{ color: text_colors.black }}
						icon={<Icon color={theme?.palette?.error?.main} iconName='IconAlertTriangleFilled' />}
						message={transaction_data?.transaction_message}
						severity={'success'}
						open={true}
						is_cross={false}
					/>
				) : (
					<CustomText type='Body' color='rgba(0, 0, 0, 0.6)'>
						{transaction_data?.transaction_message
							? transaction_data.transaction_message
							: transaction_data.transaction_status === 'pending'
							? t('Common.TransactionCompleteModal.PendingMessage')
							: transaction_data.transaction_status === 'failed'
							? t('Common.TransactionCompleteModal.FailedMessage')
							: null}
					</CustomText>
				)}
			</Grid>
		);
	};

	const render_footer = () => {
		switch (transaction_data?.transaction_status) {
			case 'success':
				return (
					<Grid container justifyContent='flex-end' gap={2}>
						<Button onClick={close}>{t('Common.TransactionCompleteModal.Done')}</Button>
					</Grid>
				);
			case 'pending':
				return (
					<Grid container justifyContent='flex-end' gap={2}>
						<Button onClick={close}>{t('Common.TransactionCompleteModal.Okay')}</Button>
					</Grid>
				);
			default:
				return (
					<Grid container justifyContent='flex-end' gap={2}>
						<Button onClick={close}>{t('Common.TransactionCompleteModal.Okay')}</Button>
					</Grid>
				);
		}
	};

	return (
		<Modal
			width={520}
			open={is_visible}
			onClose={close}
			title={
				transaction_data?.transaction_header ||
				t('Common.TransactionCompleteModal.PaymentStatus', { status: transaction_data?.transaction_status })
			}
			footer={render_footer()}
			children={handle_render_content()}
		/>
	);
};

const TransactionCompleteModal = (props: any) => {
	const { is_visible } = props;
	if (!is_visible) {
		return null;
	}
	return <TransactionCompleteComp {...props} />;
};

export default TransactionCompleteModal;
