import * as Sentry from '@sentry/react';

interface SentryConfig {
	dsn: string;
	integrations?: any[];
	environment?: string;
	tracesSampleRate?: number;
	autoSessionTracking: any;
	replaysOnErrorSampleRate?: number;
	replaysSessionSampleRate?: number;
}

export const getSentryConfig = (VITE_APP_ENV: string, VITE_APP_SENTRY_DSN: string): SentryConfig | null => {
	if (VITE_APP_ENV && VITE_APP_ENV !== 'development') {
		return {
			dsn: VITE_APP_SENTRY_DSN,
			integrations: [new Sentry.BrowserTracing()],
			environment: VITE_APP_ENV,
			tracesSampleRate: 1.0,
			replaysOnErrorSampleRate: 1.0,
			replaysSessionSampleRate: 0.1,
			autoSessionTracking: true,
		};
	}
	return null;
};
