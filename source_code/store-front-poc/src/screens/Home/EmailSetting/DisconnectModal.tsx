import { Alert } from '@mui/material';
import classes from './EmailSetting.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import { useDispatch } from 'react-redux';
import { handle_disconnect } from './helper';
import { t } from 'i18next';

const DisconnectModal = ({ open_modal, set_modal, set_open }: any) => {
	const dispatch = useDispatch();

	return (
		<Modal
			open={open_modal}
			onClose={() => {
				set_modal(false);
			}}
			title={t('ConfigureEmail.DisConnectModal.Title')}
			children={
				<>
					<CustomText type='Body'>{t('ConfigureEmail.DisConnectModal.Body')}</CustomText>
					<Alert sx={{ my: 1 }} severity='warning'>
						<div dangerouslySetInnerHTML={{ __html: t('ConfigureEmail.DisConnectModal.AlertMessage') }} />
					</Alert>
				</>
			}
			footer={
				<Grid container justifyContent='end' gap={1}>
					<Button variant='outlined' onClick={() => set_modal(false)}>
						{t('ConfigureEmail.DisConnectModal.Cancel')}
					</Button>
					<Button
						className={classes.disconnect_button}
						onClick={() => {
							handle_disconnect(dispatch, set_open);
							set_modal(false);
						}}>
						{t('ConfigureEmail.DisConnectModal.DisConnect')}
					</Button>
				</Grid>
			}
		/>
	);
};

export default DisconnectModal;
