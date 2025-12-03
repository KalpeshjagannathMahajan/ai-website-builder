import { useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Button from '../../atoms/Button/Button';
import Icon from '../../atoms/Icon/Icon';
import Image from '../../atoms/Image/Image';
import InputField from '../../atoms/Input/Input';
import styles from './forgotPassword.module.css';
import CustomText from '../../CustomText';
import { useTheme } from '@mui/material/styles';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

export interface ForgotPaswordProps {
	email: string;
	emailError: boolean;
	onSubmit: any;
	companyDesc: string;
	backToLogin: any;
	logoUrl: string;

	supportEmailClick: any;
	onEmailChange: any;
	supportEmail: string;
	submitText: string;
	illustrationImg: string;
}

const ForgotPasword = ({
	email,
	emailError,
	onEmailChange,
	logoUrl,
	backToLogin,
	companyDesc,
	onSubmit,
	supportEmailClick,
	supportEmail,
	submitText,
	illustrationImg,
}: ForgotPaswordProps) => {
	const { t } = useTranslation();
	const theme: any = useTheme();
	useEffect(() => {
		window.scroll({
			top: 0,
		});
	}, []);
	return (
		<Box
			onSubmit={(e) => e.preventDefault()}
			component='form'
			className={styles.container}
			bgcolor={is_ultron ? 'linear-gradient(170.8deg, #e8f3ef 6.97%, #eff7e0 123.36%)' : '#ffffff'}>
			<Grid className={styles.layout}>
				<Grid className={is_ultron ? styles.innerContainer : styles.storefront_inner_container} container>
					<Grid className={styles.companyLogo} justifyContent='center' width='100%' display='flex'>
						<Image imgClass={is_ultron ? styles.companyLogoMain : styles.companyLogoMainStorefront} src={logoUrl} />
					</Grid>
					{is_ultron && (
						<Grid justifyContent='center' display='flex' container className={styles.illustration}>
							<Image imgClass={styles.illustrationImg} src={illustrationImg} />
						</Grid>
					)}
					<Grid className={styles.companyDesc} container display='flex' justifyContent='center' width='100%'>
						<CustomText color='rgba(0, 0, 0, 0.6)' type='Body' style={{ textAlign: 'center' }}>
							{companyDesc}
						</CustomText>
					</Grid>
					<Grid className={styles.emailGrid}>
						<InputField
							id={'outlined-basic'}
							onChange={onEmailChange}
							label={t('AuthFlow.ForgotPassword.Email')}
							error={emailError}
							variant='outlined'
							sx={{ width: '100%' }}
							InputProps={{ sx: { borderRadius: theme?.form_elements_?.borderRadius } }}
							autoComplete='new-password'
							value={email}>
							{t('AuthFlow.ForgotPassword.Email')}
						</InputField>
						<Grid item xs={12} sx={{ padding: '4px 15px' }}>
							<CustomText type='Body' color='#D74C10'>
								{emailError ? t('AuthFlow.ForgotPassword.EmailNotValid') : <>&nbsp;</>}
							</CustomText>
						</Grid>
					</Grid>
					<Grid container className={styles.submitBtn}>
						<Button width='100%' onClick={onSubmit} type='submit'>
							{submitText}
						</Button>
					</Grid>
					<Grid className={styles.footer}>
						<Grid className={styles.backToLoginBtn}>
							<Grid sx={{ marginRight: '1.6rem' }} display='flex'>
								<Button variant='text' onClick={backToLogin}>
									<Icon iconName='IconArrowLeft' />
									&nbsp;{t('AuthFlow.ForgotPassword.BackToLogin')}
								</Button>
							</Grid>
						</Grid>
					</Grid>
					{is_ultron && (
						<Grid container display='flex' className={styles.footerText} alignItems='center' justifyContent='center'>
							<CustomText type='Body' style={{ fontWeight: 500 }}>
								{t('AuthFlow.ForgotPassword.StillFacingIssue')}
							</CustomText>
						</Grid>
					)}
					{is_ultron && (
						<Grid container display='flex' alignItems='center' justifyContent='center'>
							<CustomText type='Body' style={{ fontWeight: 500 }}>
								{t('AuthFlow.ForgotPassword.ReachOutTo')}
							</CustomText>
							<Button onClick={supportEmailClick} variant='text'>
								{supportEmail}
							</Button>
						</Grid>
					)}
				</Grid>
			</Grid>
		</Box>
	);
};

export default ForgotPasword;
