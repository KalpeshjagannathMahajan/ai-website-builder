import { Grid } from '@mui/material';

import Button from '../../atoms/Button/Button';
import Image from '../../atoms/Image/Image';
import styles from './resetPasswordConfimation.module.css';
import { t } from 'i18next';
import CustomText from '../../CustomText';

export interface ResetPasswordConfimationProps {
	onSubmit: any;
	logoUrl: string;
	confirmationText: string;
	illustrationImg: string;
	submitBtnText: string;
	supportEmail: string;
	supportEmailClick: any;
}

const ResetPasswordConfimation = ({
	logoUrl,
	onSubmit,
	confirmationText,
	submitBtnText,
	illustrationImg,
	supportEmail,
	supportEmailClick,
}: ResetPasswordConfimationProps) => (
	<Grid className={styles.container} container>
		<Grid className={styles.layout}>
			<Grid className={styles.innerContainer} container>
				<Grid sx={{ marginBottom: '2.4rem' }} justifyContent='center' width='100%' display='flex'>
					<Image height='34px' width='auto' src={logoUrl} />
				</Grid>
				<Grid justifyContent='center' display='flex' container className={styles.illustrationImgGrid}>
					<Image imgClass={styles.illustrationImg} src={illustrationImg} />
				</Grid>
				<Grid className={styles.confirmationText} container display='flex' justifyContent='center' width='100%'>
					<CustomText color='rgba(0, 0, 0, 0.6)' type='H6'>
						{confirmationText}
					</CustomText>
				</Grid>
				<Grid className={styles.footer}>
					<Grid className={styles.backToLoginBtn}>
						<Grid sx={{ marginLeft: '0.32rem' }} display='flex'>
							<Button width='40rem' onClick={onSubmit}>
								{submitBtnText}
							</Button>
						</Grid>
					</Grid>
				</Grid>
				<Grid container display='flex' className={styles.footerText} alignItems='center' justifyContent='center'>
					<CustomText type='Body' style={{ fontWeight: 500 }}>
						{t('AuthFlow.ResetPassword.StillFacingIssue')}
					</CustomText>
				</Grid>
				<Grid container display='flex' alignItems='center' justifyContent='center'>
					<CustomText type='Body' style={{ fontWeight: 500 }}>
						{t('AuthFlow.ResetPassword.ReachOutTo')}
					</CustomText>
					<Button onClick={supportEmailClick} variant='text'>
						{supportEmail}
					</Button>
				</Grid>
			</Grid>
		</Grid>
	</Grid>
);

export default ResetPasswordConfimation;
