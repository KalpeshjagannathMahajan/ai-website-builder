import { Dispatch } from 'react';
import packageJson from '../../package.json';
const { VITE_APP_ENV, VITE_APP_REPO } = import.meta.env;

const compareVersions = (version1: string, version2: string) => {
	if (version1 === version2) return true;

	const parts1 = version1.split('.').map(Number);
	const parts2 = version2.split('.').map(Number);

	// Compare each part
	for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
		const num1 = parts1[i] || 0;
		const num2 = parts2[i] || 0;

		if (num1 > num2) return true; // version1 is greater
		if (num1 < num2) return false; // version2 is greater
	}
	return true;
};

export const update_web_to_latest_version = () => async (dispatch: Dispatch) => {
	const is_store_front = VITE_APP_REPO === 'store_front';
	try {
		if ((VITE_APP_ENV && VITE_APP_ENV !== 'production') || is_store_front) {
			return;
		}
		const api_call = await fetch('https://frontend-bucket.vercel.app/ultron-web-version.json');

		if (api_call?.status === 200) {
			//checking if web is updated to the latest version or not
			const { version } = await api_call.json();
			const update_status = compareVersions(packageJson.version, version);

			dispatch({
				type: 'UPDATE_TO_LATEST_VERSION',
				data: update_status,
			});
		}
	} catch (error) {
		console.log(error);
	}
};
