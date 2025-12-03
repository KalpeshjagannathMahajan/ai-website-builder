import i18next from 'i18next';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { login_success } from 'src/actions/login';
import { show_toast } from 'src/actions/message';
import { save_persisted_data } from 'src/actions/persistedUserData';
import { PERSIST_REDUX_PATHS } from 'src/reducers/persistedUserData';
import LoaderScreen from 'src/utils/LoaderScreen';
import types from 'src/utils/types';

const WizOrderLogin = () => {
	const dispatch: any = useDispatch();
	const { token, refresh_token } = useParams();

	const show_success_toast = () => {
		const message = {
			open: true,
			showCross: false,
			anchorOrigin: {
				vertical: types.VERTICAL_TOP,
				horizontal: types.HORIZONTAL_CENTER,
			},
			autoHideDuration: 3000,
			state: types.SUCCESS_STATE,
			title: types.SUCCESS_TITLE,
			subtitle: i18next.t('AuthFlow.Login.Success'),
			showActions: false,
		};
		dispatch(show_toast(message));
	};

	useEffect(() => {
		const login = async () => {
			localStorage.clear();
			show_success_toast();

			dispatch(save_persisted_data(PERSIST_REDUX_PATHS.auth_access_token, token));
			dispatch(save_persisted_data(PERSIST_REDUX_PATHS.auth_refresh_token, refresh_token));

			dispatch(login_success());

			setTimeout(() => {
				const origin = window.location.origin;
				const redirect_url = `${origin}/cart-summary`;
				Promise.resolve().then(() => {
					window.location.href = redirect_url;
				});
			}, 2000);
		};
		login();
	}, []);

	return <LoaderScreen />;
};

export default WizOrderLogin;
