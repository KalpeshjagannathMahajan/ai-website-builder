import { useState } from 'react';
import { isEmpty } from 'lodash';
import { useTranslation } from 'react-i18next';
import { VoidAuthModalProps } from 'src/@types/payment';
import { Box, Button, Grid, Modal } from '../@the-source/atoms';
import CustomText from '../@the-source/CustomText';
import AuthorizedTxnRenderer from './AuthorizedTransaction';
import api_requests from 'src/utils/api_requests';
import types from 'src/utils/types';

const VoidAuthModal: React.FC<VoidAuthModalProps> = ({
	transaction,
	open_void_auth_modal,
	callback,
	set_open_void_auth_modal,
	set_toast,
}) => {
	const [is_loading, set_is_loading] = useState<boolean>(false);
	const { t } = useTranslation();

	const handle_close_modal = () => {
		set_open_void_auth_modal(false);
	};

	const handle_void_auth = async () => {
		if (isEmpty(transaction?.id)) return;
		try {
			set_is_loading(true);
			const response: any = await api_requests.order_management.void_auth({ transaction_id: transaction?.id });
			if (response?.status === 200) {
				set_toast({
					open: true,
					title: t('Payment.VoidAuthModal.SuccessToastTitle'),
					message: '',
					subtitle: '',
					state: types.SUCCESS_STATE,
				});
				if (callback) {
					callback();
				}
			}
		} catch (error) {
			set_toast({ open: true, title: t('Payment.VoidAuthModal.ErrorToastTitle'), message: '', subtitle: '', state: types.WARNING_STATE });
			console.error(error);
		} finally {
			set_is_loading(false);
			set_open_void_auth_modal(false);
		}
	};

	const render_content = (
		<Box>
			<CustomText type='Title'>{t('Payment.VoidAuthModal.SubTitle')}</CustomText>
			<AuthorizedTxnRenderer transaction={transaction} full_width />
		</Box>
	);

	const render_footer = (
		<Grid container justifyContent='flex-end' spacing={2}>
			<Grid item>
				<Button variant='outlined' onClick={handle_close_modal}>
					{t('Payment.VoidAuthModal.Cancel')}
				</Button>
			</Grid>
			<Grid item>
				<Button loading={is_loading} onClick={handle_void_auth} variant='contained'>
					{t('Payment.VoidAuthModal.Yes')}
				</Button>
			</Grid>
		</Grid>
	);

	return (
		<Modal
			open={open_void_auth_modal}
			onClose={handle_close_modal}
			title={t('Payment.VoidAuthModal.Title')}
			children={render_content}
			footer={render_footer}
			width={482}
		/>
	);
};

export default VoidAuthModal;
