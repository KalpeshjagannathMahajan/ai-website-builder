/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSelector } from 'react-redux';
import NotAllowed from './NotAllowed';
import constants from './utils/constants';

interface ProtectedRouteProps {
	children: React.ReactNode;
	allow_all?: boolean;
	path?: string;
}

const AuthRoute = ({ children, allow_all, path }: ProtectedRouteProps) => {
	const login = useSelector((state: any) => state?.login);
	const is_logged_in = login?.status?.loggedIn;
	const wizshop_settings: any = localStorage.getItem('wizshop_settings');
	const pre_login_settings = JSON.parse(wizshop_settings);

	if (allow_all && !is_logged_in) {
		return children;
	}

	if (!pre_login_settings?.active_free_trial && constants.FREE_TRIAL_ROUTES.includes(path)) {
		return <NotAllowed />;
	}

	return !is_logged_in ? children : <NotAllowed />;
};

export default AuthRoute;
