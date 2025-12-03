import { Box, Grid, IconButton, InputAdornment } from '@mui/material';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../atoms/Button/Button';
import Icon from '../../atoms/Icon/Icon';
import Image from '../../atoms/Image/Image';
import InputField from '../../atoms/Input/Input';
import styles from './resetPassword.module.css';
import CustomText from '../../CustomText';
import { useTheme } from '@mui/material/styles';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

export interface ResetPasswordProps {
	password: string;

	confirmPassword: string;
	passwordError: boolean;

	logoUrl: string;
	supportEmail: string;
	passwordErrorConfirm: boolean;

	onConfirmPasswordChange: any;

	supportEmailClick: any;
	onSubmit: any;
	onPasswordChange: any;
	illustrationImg: string;
}

const ResetPassword = ({
	password,
	passwordError,
	confirmPassword,
	onConfirmPasswordChange,
	passwordErrorConfirm,
	onSubmit,
	supportEmail,
	logoUrl,
	supportEmailClick,
	onPasswordChange,
	illustrationImg,
}: ResetPasswordProps) => {
	const { t } = useTranslation();
	const theme: any = useTheme();
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
	const handleShowPasswordConfrim = () => {
		setShowPasswordConfirm(!showPasswordConfirm);
	};
	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};
	const confirmPasswordRef = useRef({ focus: () => {} });
	const keyPress = (event: any) => {
		if (event?.key === 'Enter' && !passwordError) {
			confirmPasswordRef?.current?.focus();
			event.preventDefault();
		}
	};
	return (
		<Box
			onSubmit={(e) => e.preventDefault()}
			className={styles.container}
			bgcolor={is_ultron ? 'linear-gradient(170.8deg, #e8f3ef 6.97%, #eff7e0 123.36%)' : '#ffffff'}
			component='form'>
			<Grid className={styles.layout}>
				<Grid className={styles.innerContainer} container>
					<Grid container display='flex' justifyContent='center' width='100%'>
						<Image imgClass={is_ultron ? styles.logoMain : styles.logoMainStorefront} src={logoUrl} />
					</Grid>
					{is_ultron && (
						<Grid container className={styles.illustrationImgGrid} display='flex' justifyContent='center'>
							<Image imgClass={styles.illustrationImg} src={illustrationImg} />
						</Grid>
					)}
					<Grid
						container
						className={is_ultron ? styles.resetPasswordTextGrid : styles.resetPasswordTextGridStorefront}
						display='flex'
						justifyContent='center'>
						<CustomText className={is_ultron ? styles.resetHeading : styles.resetHeadingStorefront}>
							{t('AuthFlow.ResetPassword.ResetPassword')}
						</CustomText>
					</Grid>
					{!is_ultron && (
						<Grid container display='flex' justifyContent='center' width='100%' mt='58px'>
							<CustomText color='rgba(0, 0, 0, 0.6)' type='Body' style={{ textAlign: 'center' }}>
								{t('AuthFlow.ResetPassword.ResetDescription')}
							</CustomText>
						</Grid>
					)}
					<Grid container className={is_ultron ? styles.inputsGrid : styles.inputsGridStorefront}>
						<Grid item sx={{ width: '100%' }}>
							<InputField
								sx={{ width: '100%' }}
								onChange={onPasswordChange}
								label={t('AuthFlow.ResetPassword.NewPassword')}
								error={passwordError}
								variant='outlined'
								id={'outlined-basic'}
								handleKeyPress={keyPress}
								value={password}
								type={showPassword ? 'text' : 'password'}
								autoComplete='new-password'
								InputProps={{
									endAdornment: (
										<InputAdornment position='end'>
											<IconButton onClick={handleShowPassword}>
												{showPassword ? <Icon iconName='IconEye' color='#9AA0AA' /> : <Icon iconName='IconEyeOff' color='#9AA0AA' />}
											</IconButton>
										</InputAdornment>
									),
									sx: { borderRadius: theme?.form_elements_?.borderRadius },
								}}>
								{t('AuthFlow.ResetPassword.Password')}
							</InputField>
						</Grid>
						<Grid item className={is_ultron ? styles.confirmPasswordGrid : styles.confirmPasswordGridStorefront}>
							<InputField
								sx={{ width: '100%' }}
								onChange={onConfirmPasswordChange}
								label='Confirm Password'
								variant='outlined'
								id={'outlined-basic'}
								type={showPasswordConfirm ? 'text' : 'password'}
								error={passwordErrorConfirm}
								ref={confirmPasswordRef}
								value={confirmPassword}
								autoComplete='new-password'
								InputProps={{
									endAdornment: (
										<InputAdornment position='end'>
											<IconButton onClick={handleShowPasswordConfrim}>
												{showPasswordConfirm ? <Icon iconName='IconEye' color='#9AA0AA' /> : <Icon iconName='IconEyeOff' color='#9AA0AA' />}
											</IconButton>
										</InputAdornment>
									),
									sx: { borderRadius: theme?.form_elements_?.borderRadius },
								}}>
								{t('AuthFlow.ResetPassword.ConfirmPassword')}
							</InputField>
						</Grid>
					</Grid>
					<Grid container className={is_ultron ? styles.resetPasswordGrid : styles.resetPasswordGridStorefront}>
						<Button fullWidth onClick={onSubmit} type='submit'>
							{t('AuthFlow.ResetPassword.ResetPassword')}
						</Button>
					</Grid>
					{is_ultron && (
						<Grid className={styles.footer}>
							<CustomText type='Body' style={{ fontWeight: 500 }}>
								{t('AuthFlow.ResetPassword.StillFacingIssue')}
							</CustomText>
							<Grid container display='flex' alignItems='center' justifyContent='center'>
								<CustomText type='Body' style={{ fontWeight: 500 }}>
									{t('AuthFlow.ResetPassword.ReachOutTo')}
								</CustomText>
								<Button onClick={supportEmailClick} variant='text'>
									{supportEmail}
								</Button>
							</Grid>
						</Grid>
					)}
				</Grid>
			</Grid>
		</Box>
	);
};
export default ResetPassword;
