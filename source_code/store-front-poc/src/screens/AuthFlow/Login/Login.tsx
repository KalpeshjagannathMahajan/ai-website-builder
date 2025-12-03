import { default as SW_Login } from 'src/common/@the-source/molecules/Login';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { change_email, login_action } from 'src/actions/login';
import { close_toast, show_toast } from 'src/actions/message';
import { validate_email } from 'src/utils/common';
import RouteNames from 'src/utils/RouteNames';
import types from 'src/utils/types';
import Image from 'src/common/@the-source/atoms/Image/Image';
import ImageLinks from 'src/assets/images/ImageLinks';
import { Mixpanel } from 'src/mixpanel';
import { Box, Button, Grid, Modal } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import { useTheme } from '@mui/material/styles';
import LoginSkeleton from './LoginSkeleton';
import { useMediaQuery } from '@mui/material';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
const is_store_front = VITE_APP_REPO === 'store_front';
import { get_customer_metadata } from 'src/utils/utils';
import Events from 'src/utils/events_constants';

interface login_state {
	email: string;
	password: string;
}

const Login = () => {
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('md'));
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [emailValidation, setValidation] = useState(false);
	const [passowrdValidation, setPwdValidation] = useState(false);
	const [redirect, setRedirect] = useState(false);
	const [password, SetPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [modal_open, set_modal_open] = useState(false);
	const login = useSelector((state: { login: login_state }) => state.login);
	const pre_login = useSelector((state: any) => state?.preLogin);
	const auth_loading = useSelector((state: any) => state?.preLogin?.auth_loading);
	const logo_url = is_store_front ? pre_login?.logo_with_name : ImageLinks.LogoWithText;
	const active_free_trial = JSON.parse(localStorage.getItem('wizshop_settings') || '{}')?.active_free_trial === true;

	const customer_metadata = get_customer_metadata({ is_loggedin: true });
	useEffect(() => {
		if (login.email.length === 0) {
			setValidation(false);
		} else {
			setValidation(!validate_email(login.email));
		}
	}, [login.email]);

	useEffect(() => {
		setPwdValidation(false);
	}, [password]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		dispatch(change_email(event.target.value));
	};
	const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		SetPassword(event.target.value);
	};

	const onSubmit = () => {
		if (login.email.length !== 0 && password.length !== 0) setLoading(true);
		login.email.length === 0 && setValidation(true);
		password.length === 0 && setPwdValidation(true);
		Mixpanel.track(Events.LOGIN_BUTTON_CLICKED, {
			email: login?.email?.toLowerCase(),
			page_name: 'login_page',
			tab_name: '',
			section_name: '',
			subtab_name: '',
			customer_metadata,
		});
		if (emailValidation || passowrdValidation) {
			setLoading(false);
			return dispatch<any>(
				show_toast({
					open: true,
					showCross: true,
					anchorOrigin: {
						vertical: types.VERTICAL_TOP,
						horizontal: types.HORIZONTAL_CENTER,
					},
					autoHideDuration: 5000,
					onClose: (event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
						console.log(event);
						if (reason === types.REASON_CLICK) {
							return;
						}
						dispatch(close_toast(login.email));
					},
					state: types.ERROR_STATE,
					title: types.ERROR_TITLE,
					subtitle: emailValidation ? t('AuthFlow.Login.EmailVerify') : t('AuthFlow.Login.PasswordVerify'),
					showActions: false,
				}),
			);
		}

		const rest_parameters = is_store_front
			? {
					user_type: 'wizshop',
			  }
			: {};

		dispatch<any>(
			login_action({
				email: login?.email?.toLowerCase(),
				password,
				set_loading: setLoading,
				...rest_parameters,
			}),
		);
	};

	const bookDemoClick = () => {
		if (is_store_front) {
			if (active_free_trial) {
				navigate(`${RouteNames.free_trial.path}`);
			} else {
				set_modal_open(true);
			}
			return;
		}

		Mixpanel.track(Events.BOOK_DEMO_CLICKED, {
			email: login?.email,
			page_name: 'login_page',
			tab_name: '',
			section_name: '',
		});
		window.open(types.DEMO);
	};

	const forgotPasswordClick = () => {
		Mixpanel.track(Events.FORGOT_PASSWORD_CLICKED, {
			email: login?.email,
			page_name: 'login_page',
			tab_name: '',
			section_name: '',
		});
		setRedirect(true);
	};
	if (redirect) {
		return <Navigate to={RouteNames.forgot_password.path} />;
	}

	const handle_signup = (action: string) => {
		navigate(`${RouteNames.signup.routing_path}/${action}`);
	};

	return (
		<>
			{auth_loading ? (
				<LoginSkeleton />
			) : (
				<SW_Login
					email={login.email}
					onEmailChange={onEmailChange}
					emailError={emailValidation}
					passwordError={passowrdValidation}
					companyName={is_ultron ? 'WizCommerce' : pre_login?.company_name}
					companyDesc={t('AuthFlow.Login.CompanyDescription')}
					onPasswordChange={onPasswordChange}
					forgotPasswordClick={forgotPasswordClick}
					onSubmit={onSubmit}
					password={password}
					bookDemoClick={bookDemoClick}
					logoUrl={logo_url}
					loading={loading}
					GetUpdates={pre_login?.company_announcement}
				/>
			)}
			{modal_open && (
				<Modal
					open={modal_open}
					onClose={() => set_modal_open(false)}
					title={'Choose customer type'}
					width={is_small_screen ? 345 : 400}
					slotProps={{
						backdrop: {
							onClick: () => set_modal_open(false),
						},
					}}
					children={
						<Box
							sx={{
								p: 1,
								display: 'flex',
								flexDirection: 'column',
								alignItems: 'center',
								gap: 1.5,
								borderRadius: theme?.authflow?.login?.border_radius,
							}}>
							<Grid>
								<Image src={logo_url} style={{ width: 'auto', height: '47px' }} />
							</Grid>
							<CustomText style={{ textAlign: 'center', marginTop: '31px' }} type='H2'>
								Are you an existing customer or new to {pre_login?.company_name}?
							</CustomText>
							<CustomText
								style={{ textAlign: 'center', marginTop: '16px', color: theme?.authflow?.login?.modal_subtitle_color }}
								type='Body'>
								<div dangerouslySetInnerHTML={{ __html: t('AuthFlow.Login.companyTagLine') }} />
							</CustomText>
							<Button sx={{ mt: '48px' }} variant='contained' fullWidth onClick={() => handle_signup('new')}>
								New Customer
							</Button>
							<Button variant='outlined' fullWidth onClick={() => handle_signup('existing')}>
								Existing Customer
							</Button>
						</Box>
					}
				/>
			)}
		</>
	);
};

export default Login;
