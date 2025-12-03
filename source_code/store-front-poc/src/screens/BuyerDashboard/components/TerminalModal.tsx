import { Divider } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import ImageLinks from 'src/assets/images/ImageLinks';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid, Image, Modal } from 'src/common/@the-source/atoms';
import { useTheme } from '@mui/material/styles';
import { get_formatted_price_with_currency } from 'src/utils/common';

interface Props {
	is_visible: boolean;
	transaction_data: any;
	setIsPolling: any;
	set_is_terminal_modal_visible: (state: boolean) => void;
	set_is_drawer_visible: (state: boolean) => void;
	currency: string;
}

const TerminalComp = ({
	is_visible,
	transaction_data,
	setIsPolling,
	set_is_terminal_modal_visible,
	set_is_drawer_visible,
	currency,
}: Props) => {
	const [timer, setTimer] = useState<number>(transaction_data?.expiry_time);
	const theme: any = useTheme();

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
			<Grid>
				<Grid width='100%' display='flex' justifyContent='space-between' alignItems='center' mt={-2} pb={1.6}>
					<CustomText type='H3'>{transaction_data?.transaction_header}</CustomText>
					{transaction_data?.transaction_status === 'pending' && (
						<CustomText type='Subtitle' color={theme?.payments?.terminal_modal?.text}>
							Expires in {timerString}
						</CustomText>
					)}
				</Grid>
				<Divider className='drawer-divider' />
				<Grid display='flex' direction='column' p={1.6} gap={3.6}>
					<Grid width='100%' display='flex' gap={2} alignItems='center'>
						<Image src={ImageLinks.Terminal} width={127} height={127} />
						<CustomText type='Subtitle' color={theme?.payments?.terminal_modal?.text}>
							{transaction_data?.transaction_message}
						</CustomText>
					</Grid>
				</Grid>
			</Grid>
		);
	};

	const handle_cancel = () => {
		setIsPolling({ data: undefined, state: false });
		set_is_drawer_visible(false);
		set_is_terminal_modal_visible(false);
	};

	const handle_button = () => {
		switch (transaction_data?.transaction_status) {
			case 'success':
				return (
					<Button
						onClick={() => {
							set_is_drawer_visible(false);
							set_is_terminal_modal_visible(false);
						}}>
						{t('Common.TransactionCompleteModal.Close')}
					</Button>
				);
			case 'failed':
				return <Button onClick={() => set_is_terminal_modal_visible(false)}>{t('Common.TransactionCompleteModal.Retry')}</Button>;
			case 'pending':
				return <Button onClick={handle_cancel}>{t('Common.TransactionCompleteModal.Cancel')}</Button>;
		}
	};

	const render_footer = () => {
		return (
			<Grid container display='flex' justifyContent='space-between'>
				<Grid
					display={'flex'}
					justifyContent={'space-between'}
					sx={{ background: theme?.payments?.terminal_modal?.background, borderRadius: '12px', padding: '12px 16px' }}
					width={186}>
					<CustomText type='H3'>Amount</CustomText>
					<CustomText type='H3'>{get_formatted_price_with_currency(currency, transaction_data?.transaction_amount)}</CustomText>
				</Grid>
				{handle_button()}
			</Grid>
		);
	};

	return (
		<Modal
			width={480}
			showHeader={false}
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
