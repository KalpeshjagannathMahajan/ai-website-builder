import { default as ForgotPasswordTheSource } from 'src/common/@the-source/molecules/ForgotPassword';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { forgot_password_action, forgot_password_email_action } from 'src/actions/login';
import { useTranslation } from 'react-i18next';
import { close_toast, show_toast } from 'src/actions/message';
import { validate_email } from 'src/utils/common';
import types from 'src/utils/types';
import ImageLinks from 'src/assets/images/ImageLinks';
import { Mixpanel } from 'src/mixpanel';
import ForgotSkeleton from './ForgotSkeleton';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
import Events from 'src/utils/events_constants';

const ForgotPassword = () => {
	const { t } = useTranslation();
	const login = useSelector((state: any) => state?.login);
	const pre_login = useSelector((state: any) => state?.preLogin);
	const auth_loading: any = useSelector((state: any) => state?.preLogin?.auth_loading);
	const [emailValidation, setValidation] = useState(false);
	const [mailSent, setMailSent] = useState(false);
	const [redirect, setRedirect] = useState(false);

	useEffect(() => {
		if (login.forgotPasswordEmail.length === 0) {
			setValidation(false);
		} else {
			setValidation(!validate_email(login.forgotPasswordEmail));
		}
	}, [login.forgotPasswordEmail]);

	const dispatch = useDispatch();

	const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(forgot_password_email_action(event.target.value));
	};

	const supportEmailClick = () => {
		window.location.href = types.SUPPORT_EMAIL;
	};

	const onSubmit = () => {
		const data = {
			email: login.forgotPasswordEmail,
		};
		Mixpanel.track(Events.RESET_LINK_SENT_CLICKED, {
			email: login?.forgotPasswordEmail,
			page_name: 'reset_password_page',
			tab_name: '',
			section_name: '',
		});
		setValidation(!validate_email(login.forgotPasswordEmail));
		if (!validate_email(login.forgotPasswordEmail)) {
			return dispatch<any>(
				show_toast({
					open: true,
					showCross: true,
					anchorOrigin: {
						vertical: types.VERTICAL_TOP,
						horizontal: types.HORIZONTAL_CENTER,
					},
					autoHideDuration: 5000,
					onClose: (_event: React.SyntheticEvent<Element, Event>, reason: String) => {
						if (reason === types.REASON_CLICK) {
							return;
						}
						dispatch(close_toast(login.forgotPasswordEmail));
					},
					state: types.ERROR_STATE,
					title: types.ERROR_TITLE,
					subtitle: login.forgotPasswordEmail.length === 0 ? t('AuthFlow.Login.ErrorEmptyField') : t('AuthFlow.Login.EmailNotValid'),
					showActions: false,
				}),
			);
		}
		dispatch<any>(forgot_password_action(data));
		setMailSent(true);
	};
	const backToLogin = () => {
		Mixpanel.track(Events.BACK_TO_LOGIN_BUTTON_CLICKED, {
			email: login?.forgotPasswordEmail,
			page_name: 'reset_password_page',
			tab_name: '',
			section_name: '',
		});
		setRedirect(true);
	};
	if (redirect) {
		return <Navigate to='/user-login' />;
	}
	return (
		<>
			{auth_loading ? (
				<ForgotSkeleton />
			) : (
				<ForgotPasswordTheSource
					email={login.forgotPasswordEmail}
					companyDesc='A link to reset your password will be shared to your email'
					logoUrl={is_ultron ? ImageLinks.LogoWithText : pre_login?.logo_with_name}
					emailError={emailValidation}
					onEmailChange={onEmailChange}
					supportEmail={t('AuthFlow.ResetPassword.SupportEmail')}
					supportEmailClick={supportEmailClick}
					// disabled={emailValidation}
					onSubmit={onSubmit}
					illustrationImg='https://sourcerer.tech/assets/043dc1f4-d99f-4811-8e5b-81d521586338'
					submitText={mailSent ? 'Resend Link' : 'Send Reset Link'}
					backToLogin={backToLogin}
				/>
			)}
		</>
	);
};

export default ForgotPassword;
