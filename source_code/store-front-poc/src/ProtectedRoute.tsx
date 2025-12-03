import { useSelector } from 'react-redux';
import { lazy } from 'react';
import constants from './utils/constants';

const Login = lazy(() => import('src/screens/AuthFlow/Login/Login'));

interface ProtectedRouteProps {
	children: React.ReactNode;
	allow_all?: boolean;
	path: string;
}

const ProtectedRoute = ({ children, allow_all, path }: ProtectedRouteProps) => {
	const login = useSelector((state: any) => state.login);
	const is_logged_in = login?.status?.loggedIn;
	const is_pre_login_route = constants.PRE_LOGIN_ROUTES.includes(path);

	const wizshop_settings: any = localStorage.getItem('wizshop_settings');
	const pre_login_settings = JSON.parse(wizshop_settings);

	const is_pre_login_allowed = pre_login_settings?.prelogin_allowed || false;

	if (allow_all || (!is_logged_in && is_pre_login_allowed && is_pre_login_route)) {
		return children;
	}

	return is_logged_in ? children : <Login />;
};

export default ProtectedRoute;
