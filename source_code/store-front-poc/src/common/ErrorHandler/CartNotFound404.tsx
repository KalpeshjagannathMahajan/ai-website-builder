import { Button, Grid, Modal, Typography } from '../@the-source/atoms';
import { useTranslation } from 'react-i18next';

export default function CartNotFound404() {
	const { t } = useTranslation();

	return (
		<Modal
			open={true}
			onClose={() => {}}
			title={'Invalid Cart'}
			footer={
				<Grid container justifyContent='end'>
					<Button variant='outlined' onClick={() => {}} sx={{ marginRight: '1rem' }}>
						{t('ErrorScreens.CartNotFoundScreen.StartNewCart')}
					</Button>
					<Button onClick={() => {}}>{t('ErrorScreens.CartNotFoundScreen.PreviousCart')}</Button>
				</Grid>
			}
			children={
				<Typography sx={{ fontSize: 14 }} variant='body1'>
					{t('ErrorScreens.CartNotFoundScreen.ErrorMessage')}
				</Typography>
			}
		/>
	);
}
