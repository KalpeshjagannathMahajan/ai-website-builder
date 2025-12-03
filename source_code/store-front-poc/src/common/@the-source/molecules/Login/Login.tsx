import { Box, Grid, IconButton, InputAdornment } from '@mui/material';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../atoms/Button/Button';
import Icon from '../../atoms/Icon/Icon';
import Image from '../../atoms/Image/Image';
import InputField from '../../atoms/Input/Input';
import styles from './login.module.css';
import CustomText from '../../CustomText';
import { useTheme } from '@mui/material/styles';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

export interface LoginProps {
	email: string;
	password: string;
	emailError: boolean;
	passwordError: boolean;
	logoUrl: string;
	forgotPasswordClick: any;
	onEmailChange: any;
	bookDemoClick: any;
	onSubmit: any;
	companyName: string;
	companyDesc: string;
	onPasswordChange: any;
	loading?: boolean;
	GetUpdates?: string;
}

const Login = ({
	email,
	password,
	companyName,
	emailError,
	logoUrl,
	passwordError,
	onEmailChange,
	forgotPasswordClick,
	companyDesc,
	onSubmit,
	bookDemoClick,
	onPasswordChange,
	loading,
	GetUpdates,
}: LoginProps) => {
	const { t } = useTranslation();
	const theme: any = useTheme();
	const [showPassword, setShowPassword] = useState(false);
	const [isAutoFill, setIsAutoFill] = useState(false);
	const passwordRef: any = useRef({ focus: () => {} });
	const emailRef = useRef({ focus: () => {} });

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const emailKeyPress = (event: any) => {
		if (event?.key === 'Enter') {
			passwordRef?.current?.focus();
			event.preventDefault();
		}
	};

	const handle_on_password_change = (event: any) => {
		passwordRef?.current?.focus();
		event.preventDefault();
		onPasswordChange(event);
	};

	return (
		<Box component='form' onSubmit={(e) => e.preventDefault()} className={is_ultron ? styles.container : styles.containerStorefront}>
			<Grid className={styles.layout}>
				<Grid className={is_ultron ? styles.innerContainer : styles.storefront_inner_container} container>
					<Grid xs={12} className={styles.companyLogo}>
						<Image src={logoUrl} imgClass={is_ultron ? styles.logoUltron : styles.logoStorefront} />
					</Grid>
					{is_ultron ? (
						<Grid xs={12} mt={1}>
							<CustomText type='H6' color={theme?.login?.primary} style={{ textAlign: 'center' }}>
								{companyDesc}
							</CustomText>
						</Grid>
					) : (
						<Grid>
							<Grid xs={12} mt={'40px'}>
								<CustomText type='H1' color={theme?.login?.secondary} style={{ textAlign: 'center', fontSize: '24px' }}>
									{t('AuthFlow.Login.LoginTo', { Company: companyName })}
								</CustomText>
							</Grid>
							<Grid xs={12} mt={'16px'}>
								<CustomText type='Body' color={theme?.login?.primary} style={{ textAlign: 'center' }}>
									{GetUpdates}
								</CustomText>
							</Grid>
						</Grid>
					)}
					<Grid container sx={is_ultron ? { marginTop: '6.4rem' } : { marginTop: '64px' }}>
						<Grid item xs={12}>
							<InputField
								sx={{
									width: '100%',
									background: theme?.login?.background,
								}}
								InputLabelProps={{ shrink: isAutoFill || undefined }}
								InputProps={{
									onAnimationStart: (e: React.AnimationEvent<HTMLDivElement>) => {
										e.animationName === 'mui-auto-fill' && setIsAutoFill(true);
									},
									onAnimationEnd: (e: React.AnimationEvent<HTMLDivElement>) =>
										e.animationName === 'mui-auto-fill-cancel' && setIsAutoFill(false),
									onFocus: () => setIsAutoFill(false),
									sx: { borderRadius: theme?.form_elements_?.borderRadius },
								}}
								id={'outlined-basic'}
								onChange={onEmailChange}
								handleKeyPress={emailKeyPress}
								label={t('AuthFlow.Login.Email')}
								ref={emailRef}
								error={emailError}
								variant='outlined'
								value={email}>
								{t('AuthFlow.Login.Email')}
							</InputField>
							<Grid item xs={12} sx={{ padding: '4px 15px' }}>
								<CustomText type='Body' color={theme?.login?.error}>
									{emailError ? t('AuthFlow.Login.EmailNotValid') : <>&nbsp;</>}
								</CustomText>
							</Grid>
						</Grid>
						<Grid xs={12} item sx={is_ultron ? { marginTop: '1.8rem' } : { marginTop: '4px' }}>
							<InputField
								onChange={handle_on_password_change}
								sx={{
									width: '100%',
									background: theme?.login?.background,
									borderRadius: theme?.authflow?.login?.border_radius,
								}}
								id={'outlined-basic'}
								error={passwordError}
								autoComplete=''
								ref={passwordRef}
								InputLabelProps={{ shrink: isAutoFill || undefined }}
								label={t('AuthFlow.Login.Password')}
								variant='outlined'
								type={showPassword ? 'text' : 'password'}
								value={password}
								InputProps={{
									onAnimationStart: (e: React.AnimationEvent<HTMLDivElement>) => {
										e.animationName === 'mui-auto-fill' && setIsAutoFill(true);
									},
									onAnimationEnd: (e: React.AnimationEvent<HTMLDivElement>) =>
										e.animationName === 'mui-auto-fill-cancel' && setIsAutoFill(false),
									onFocus: () => setIsAutoFill(false),
									endAdornment: (
										<InputAdornment position='end'>
											<IconButton onClick={handleShowPassword}>
												{showPassword ? (
													<Icon iconName='IconEye' color={theme?.login?.icon} />
												) : (
													<Icon iconName='IconEyeOff' color={theme?.login?.icon} />
												)}
											</IconButton>
										</InputAdornment>
									),
									sx: { borderRadius: theme?.form_elements_?.borderRadius },
								}}>
								{t('AuthFlow.Login.Password')}
							</InputField>
						</Grid>
					</Grid>
					{is_ultron ? (
						<Grid container className={styles.forgotPasswordGrid}>
							<Button onClick={forgotPasswordClick} variant='text'>
								{t('AuthFlow.Login.ForgotPassword')}
							</Button>
						</Grid>
					) : (
						<Grid container className={styles.forgotPasswordStorefrontGrid} style={{ ...theme?.custom_font_style }}>
							<span onClick={forgotPasswordClick}>{t('AuthFlow.Login.ForgotPassword')}</span>
						</Grid>
					)}
					<br />
					<Grid className={is_ultron ? styles.loginBtnGrid : styles.loginBtnStorefrontGrid} container>
						<Button id='ultron_login' fullWidth onClick={onSubmit} type='submit' loading={loading}>
							{t('AuthFlow.Login.Login')}
						</Button>
					</Grid>

					{is_ultron ? (
						<Grid className={styles.footer}>
							<CustomText type='Body'>{t('AuthFlow.Login.NewToCompany', { Company: companyName })} </CustomText>
							<Button variant='text' onClick={bookDemoClick}>
								{t('AuthFlow.Login.BookDemo')}
							</Button>
						</Grid>
					) : (
						<Grid className={styles.footerStorefront}>
							<CustomText type='Body'>
								{t('AuthFlow.Login.DontHaveAccount')}{' '}
								<span className={styles.storefrontSignup} onClick={bookDemoClick}>
									{t('AuthFlow.Login.Signup')}
								</span>{' '}
							</CustomText>
						</Grid>
					)}
				</Grid>
			</Grid>
		</Box>
	);
};

export default Login;
