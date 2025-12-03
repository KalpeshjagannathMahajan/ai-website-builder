import { default as ResetPasswordTheSource } from 'src/common/@the-source/molecules/ResetPassword';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom/dist';
import { useTranslation } from 'react-i18next';
import { reset_password_action, reset_status } from 'src/actions/login';
import { close_toast, show_toast } from 'src/actions/message';
import types from 'src/utils/types';
import ImageLinks from 'src/assets/images/ImageLinks';
import ResetSkeleton from './ResetSkeleton';
import storefront from 'src/utils/api_requests/storefront';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

// TODO: @gauravkalyan unnecessary dispatch are created in this file, please remove them
const ResetPassword = () => {
	const { t } = useTranslation();
	const login = useSelector((state: any) => state.login);
	const pre_login = useSelector((state: any) => state?.preLogin);
	const auth_loading: any = useSelector((state: any) => state?.preLogin?.auth_loading);
	const dispatch = useDispatch();
	const [password, SetPassword] = useState('');
	const [confirmPassword, SetConfirmPassword] = useState('');
	const navigate = useNavigate();

	const passwordChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
		// dispatch(change_password_reset(event.currentTarget.value));
		SetPassword(event.currentTarget.value);
	};
	const params = useParams();
	const onConfirmPasswordChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
		// dispatch(change_password_confirm_reset(event.currentTarget.value));
		SetConfirmPassword(event.currentTarget.value);
	};

	const supportEmailClick = () => {
		window.location.href = types.SUPPORT_EMAIL;
	};
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
	}, []);
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
				showCross: !is_ultron,
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
	if (login.resetSuccess) {
		if (!is_ultron) {
			return <Navigate to='/user-login' />;
		} else return <Navigate to='/reset-password-success' />;
	}
	return (
		<>
			{auth_loading ? (
				<ResetSkeleton />
			) : (
				<ResetPasswordTheSource
					password={password}
					confirmPassword={confirmPassword}
					passwordError={false}
					supportEmailClick={supportEmailClick}
					logoUrl={is_ultron ? ImageLinks.LogoWithText : pre_login?.logo_with_name}
					passwordErrorConfirm={false}
					illustrationImg='https://sourcerer.tech/assets/043dc1f4-d99f-4811-8e5b-81d521586338'
					onConfirmPasswordChange={onConfirmPasswordChange}
					onSubmit={submit}
					supportEmail={t('AuthFlow.ForgotPassword.SupportEmail')}
					onPasswordChange={passwordChange}
				/>
			)}
		</>
	);
};

export default ResetPassword;
