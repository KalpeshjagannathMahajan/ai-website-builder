import { useEffect, useRef, useState } from 'react';
import { Grid, IconButton, InputAdornment } from '@mui/material';
import styles from './CreatePassword.module.css';
import { Box, Button, Icon, Image } from 'src/common/@the-source/atoms';
import { useParams, useNavigate } from 'react-router-dom/dist';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { reset_password_action, reset_status } from 'src/actions/login';
import types from 'src/utils/types';
import { close_toast, show_toast } from 'src/actions/message';
import CustomText from 'src/common/@the-source/CustomText';
import InputField from 'src/common/@the-source/atoms/Input/Input';
import { useTheme } from '@mui/material/styles';
import ResetSkeleton from './../ResetPassword/ResetSkeleton';
import storefront from 'src/utils/api_requests/storefront';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

const CreatePassword = () => {
	const theme: any = useTheme();
	const { t } = useTranslation();
	const login = useSelector((state: any) => state.login);
	const pre_login = useSelector((state: any) => state?.preLogin);
	const auth_loading: any = useSelector((state: any) => state?.preLogin?.auth_loading);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [password, SetPassword] = useState('');
	const [confirmPassword, SetConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

	const confirmPasswordRef = useRef({ focus: () => {} });
	const params = useParams();

	const checking_token = async (access_token: any) => {
		try {
			const res: any = await storefront.validate_token(access_token);

			if (res?.status === 401 || res?.status === undefined) {
				navigate('/token-expired');
			}
		} catch (err) {
			console.log('error is tmp', err);
		}
	};

	useEffect(() => {
		window.scroll({
			top: 0,
		});
		const url = new URL(window.location.href);
		const pathSegments = url.pathname.split('/');
		const token = `${pathSegments[pathSegments.length - 1]}`;
		checking_token(token);
	}, []);
	useEffect(() => {
		dispatch(reset_status(null));
	}, [dispatch]);

	if (login.resetSuccess) {
		navigate('/');
	}

	const passwordChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
		SetPassword(event.currentTarget.value);
	};

	const onConfirmPasswordChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
		SetConfirmPassword(event.currentTarget.value);
	};

	const handleShowPasswordConfrim = () => {
		setShowPasswordConfirm(!showPasswordConfirm);
	};

	const handleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const keyPress = (event: any) => {
		if (event?.key === 'Enter' && !passwordError) {
			confirmPasswordRef?.current?.focus();
			event.preventDefault();
		}
	};

	const submit = () => {
		let error = false;
		let errorMsg = '';
		if (password === '') {
			error = true;
			errorMsg = t('AuthFlow.ResetPassword.EmptyPasswordErrorMessage');
		} else if (confirmPassword === '') {
			error = true;
			errorMsg = t('AuthFlow.ResetPassword.EmptyConfirmPasswordErrorMessage');
		} else if (password !== confirmPassword) {
			error = true;
			errorMsg = t('AuthFlow.ResetPassword.PasswordNotMatch');
		} else if (password.length < 8 || confirmPassword.length < 8) {
			error = true;
			errorMsg = t('AuthFlow.ResetPassword.PasswordLength');
		}
		if (error) {
			const message = {
				open: true,
				showCross: false,
				anchorOrigin: {
					vertical: types.VERTICAL_TOP,
					horizontal: types.HORIZONTAL_CENTER,
				},
				autoHideDuration: 5000,
				onClose: (_event: React.SyntheticEvent<HTMLInputElement>, reason: string) => {
					if (reason === types.REASON_CLICK) {
						return;
					}
					dispatch(close_toast(login.username));
				},
				state: types.ERROR_STATE,
				title: types.ERROR_TITLE,
				subtitle: errorMsg,
				showActions: false,
			};
			return dispatch<any>(show_toast(message));
		}
		dispatch<any>(
			reset_password_action(
				{
					password,
				},
				params.id as string,
				params.token as string,
			),
		);
	};

	const passwordError = false;
	const logoUrl = pre_login?.logo_with_name;

	return (
		<>
			{auth_loading ? (
				<ResetSkeleton />
			) : (
				<Box onSubmit={(e) => e.preventDefault()} className={styles.container} bgcolor={'#ffffff'} component='form'>
					<Grid className={styles.layout}>
						<Grid className={styles.innerContainer} container>
							<Grid container display='flex' justifyContent='center' width='100%'>
								<Image imgClass={is_ultron ? styles.logoMain : styles.logoMainStorefront} src={logoUrl} />
							</Grid>
							<Grid
								container
								className={is_ultron ? styles.resetPasswordTextGrid : styles.resetPasswordTextGridStorefront}
								display='flex'
								justifyContent='center'>
								<CustomText className={is_ultron ? styles.resetHeading : styles.resetHeadingStorefront}>Create Password</CustomText>
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
										onChange={passwordChange}
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
										error={false}
										ref={confirmPasswordRef}
										value={confirmPassword}
										autoComplete='new-password'
										InputProps={{
											endAdornment: (
												<InputAdornment position='end'>
													<IconButton onClick={handleShowPasswordConfrim}>
														{showPasswordConfirm ? (
															<Icon iconName='IconEye' color='#9AA0AA' />
														) : (
															<Icon iconName='IconEyeOff' color='#9AA0AA' />
														)}
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
								<Button fullWidth onClick={submit} type='submit'>
									Confirm and login
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Box>
			)}
		</>
	);
};

export default CreatePassword;
