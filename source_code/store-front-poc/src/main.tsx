import ReactDOM from 'react-dom/client';
import App from './App';
import * as Sentry from '@sentry/react';
import { getSentryConfig } from './config';

const { VITE_APP_SENTRY_DSN, VITE_APP_ENV } = import.meta.env;
const sentryConfig = getSentryConfig(VITE_APP_ENV, VITE_APP_SENTRY_DSN);

if (sentryConfig) {
	Sentry.init(sentryConfig);
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(<App />);
