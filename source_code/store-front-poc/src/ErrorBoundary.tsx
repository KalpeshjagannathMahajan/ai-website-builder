import React from 'react';
import * as Sentry from '@sentry/react';
import { Button } from './common/@the-source/atoms';
import { useDispatch } from 'react-redux';
import { logout_click } from './actions/login';
import ErrorPage from './common/@the-source/molecules/ErrorPages/Error';
const { VITE_APP_ENV } = import.meta.env;
interface Props {
	children: React.ReactNode;
}

interface State {
	hasError: boolean;
	error: {
		message: string;
		stack: string;
	};
	info: {
		componentStack: string;
	};
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LoginButton = () => {
	const dispatch = useDispatch();

	const handle_click = () => {
		dispatch<any>(logout_click());
	};

	return (
		<Button onClick={handle_click} sx={{ margin: '0 1rem' }} size='large' variant='contained'>
			Login
		</Button>
	);
};

class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: any) {
		super(props);
		this.state = {
			hasError: false,
			error: { message: '', stack: '' },
			info: { componentStack: '' },
		};
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	static getDerivedStateFromError(error: any) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error: any, info: any) {
		// You can also log the error to an error reporting service
		if (VITE_APP_ENV && VITE_APP_ENV !== 'development') {
			this.setState({ error, info }, () => {
				Sentry.captureMessage(error?.message || error);
			});
		}
		console.log(error, info);
	}

	render() {
		if (this.state.hasError) {
			return <ErrorPage />;
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
