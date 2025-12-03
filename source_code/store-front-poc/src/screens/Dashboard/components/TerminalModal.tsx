import { Divider } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import ImageLinks from 'src/assets/images/ImageLinks';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid, Icon, Image, Modal } from 'src/common/@the-source/atoms';
import { get_formatted_price_with_currency } from 'src/utils/common';

interface Props {
	is_visible: boolean;
	close: any;
	transaction_data: any;
	retry: any;
	currency: string;
}

const TerminalComp = ({ is_visible, close, transaction_data, retry, currency }: Props) => {
	const [timer, setTimer] = useState<number>(transaction_data?.expiry_time);
	useEffect(() => {
		if (timer === 0) return;
		const intervalId = setInterval(() => {
			setTimer(timer - 1);
		}, 1000);
		return () => clearInterval(intervalId);
	}, [timer]);

	const minutes = Math.floor(timer / 60);
	const seconds = timer % 60;
	const timerString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

	const handle_render_content = () => {
		return (
			<Grid key={transaction_data?.transaction_status}>
				{transaction_data?.transaction_status === 'pending' && (
					<>
						<Grid width='100%' display='flex' justifyContent='space-between' alignItems='center' mt={-2} pb={1.6}>
							<CustomText type='H3'>{transaction_data?.transaction_header}</CustomText>
							<CustomText type='Subtitle' color='rgba(0, 0, 0, 0.6)'>
								Expires in {timerString}
							</CustomText>
						</Grid>
						<Divider className='drawer-divider' />
					</>
				)}
				<Grid width='100%' display='flex' gap={2} alignItems='center'>
					<Image
						src={
							transaction_data?.transaction_status === 'pending'
								? ImageLinks.Terminal
								: transaction_data?.transaction_status === 'success'
								? ImageLinks.payment_successful
								: ImageLinks.payment_failed
						}
						width={127}
						height={127}
					/>
					{transaction_data?.transaction_status !== 'pending' ? (
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
							{transaction_data?.transaction_status !== 'failed' && (
								<Grid display='flex' gap={1.6} direction='row'>
									{transaction_data?.title && <CustomText type='Title'>{transaction_data?.title}</CustomText>}
									{transaction_data?.logo && <Image src={transaction_data?.logo} width={40} height={24} />}
								</Grid>
							)}
						</Grid>
					) : (
						<CustomText type='Subtitle' color='rgba(0, 0, 0, 0.6)'>
							{transaction_data?.transaction_message}
						</CustomText>
					)}
				</Grid>
				{transaction_data?.transaction_status !== 'pending' && (
					<Grid display='flex' direction='column' gap={1}>
						{transaction_data?.transaction_message && (
							<CustomText type='Body' color='rgba(0, 0, 0, 0.6)'>
								{transaction_data?.transaction_message}
							</CustomText>
						)}
						<Grid
							display='flex'
							alignItems='center'
							gap={0.8}
							px={1}
							py={0.6}
							borderRadius={0.8}
							sx={{ background: 'rgba(254, 247, 234, 1)' }}>
							<Icon iconName='IconInfoCircle'></Icon>
							<CustomText type='Body'>{t('Common.CollectPaymentDrawer.TransactionDetails')}</CustomText>
						</Grid>
					</Grid>
				)}
			</Grid>
		);
	};

	const handle_button = () => {
		switch (transaction_data?.transaction_status) {
			case 'success':
				return (
					<Button sx={{ marginLeft: 'auto' }} onClick={close}>
						{t('Common.TransactionCompleteModal.Close')}
					</Button>
				);
			case 'failed':
				return (
					<Button sx={{ marginLeft: 'auto' }} onClick={retry}>
						{t('Common.TransactionCompleteModal.Retry')}
					</Button>
				);
		}
	};

	const render_footer = () => {
		return (
			<Grid container>
				{transaction_data?.transaction_status === 'pending' && (
					<Grid
						display={'flex'}
						justifyContent={'space-between'}
						sx={{ background: 'rgba(254, 247, 234, 1)', borderRadius: '12px', padding: '12px 16px', marginLeft: 'auto' }}
						width={186}>
						<CustomText type='H3'>Amount</CustomText>
						<CustomText type='H3'>{get_formatted_price_with_currency(currency, transaction_data?.transaction_amount)}</CustomText>
					</Grid>
				)}
				{transaction_data?.transaction_status !== 'pending' && handle_button()}
			</Grid>
		);
	};

	return (
		<Modal
			width={480}
			showHeader={transaction_data?.transaction_status !== 'pending'}
			open={is_visible}
			onClose={close}
			title={transaction_data?.transaction_header}
			footer={render_footer()}
			children={handle_render_content()}
		/>
	);
};

const TerminalModal = (props: any) => {
	const { is_visible } = props;
	if (!is_visible) {
		return null;
	}
	return <TerminalComp {...props} />;
};

export default TerminalModal;
