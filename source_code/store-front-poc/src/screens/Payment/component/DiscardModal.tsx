import { t } from 'i18next';
import { Button, Grid, Modal, Typography } from 'src/common/@the-source/atoms';

interface Props {
	on_close: any;
	is_open_alert: boolean;
	on_proceed: any;
}

const DiscardModal = ({ on_close, is_open_alert = false, on_proceed }: Props) => {
	return (
		<Modal
			open={is_open_alert}
			onClose={on_close}
			title={t('Payment.ProgressWillBeLost')}
			footer={
				<Grid display='flex' gap={2.5}>
					<Button fullWidth variant='outlined' onClick={on_close}>
						Cancel
					</Button>
					<Button fullWidth onClick={on_proceed}>
						Proceed
					</Button>
				</Grid>
			}
			children={
				<Typography sx={{ fontSize: 14 }} variant='body1'>
					{t('Payment.ProgressLostModalText')}
				</Typography>
			}
		/>
	);
};

export default DiscardModal;
