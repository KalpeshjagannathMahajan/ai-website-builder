import axios, { AxiosRequestConfig } from 'axios';
import _ from 'lodash';
import store from 'src/store';

export const baseUrl = import.meta.env.VITE_APP_API_URL;
const folderURL = `${baseUrl}/folder/`;

export const download_multiple_files_api = (file_details: { name: any; file_handle: any; file_type: any }[] = []) => {
	return new Promise((resolve, reject) => {
		let data = JSON.stringify({
			file_details,
		});

		let config: AxiosRequestConfig = {
			method: 'post',
			maxBodyLength: Infinity,
			url: `${folderURL}download`,
			headers: {
				accept: 'application/json',
				'Content-Type': 'application/json',
				'ngrok-skip-browser-warning': 'any',
				Authorization: _.get(store.getState(), 'persistedUserData.auth_access_token'),
			},
			data,
			responseType: 'arraybuffer',
		};

		axios
			.request(config)
			.then((response: any) => {
				const blob = new Blob([response.data], { type: file_details?.length === 1 ? file_details?.[0]?.file_type : 'application/zip' });
				const blobUrl = window.URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = blobUrl;
				if (file_details?.length === 1) a.download = file_details?.[0]?.name ?? 'unknown file';
				else a.download = 'download.zip';
				a.click();
				window.URL.revokeObjectURL(blobUrl);
				resolve('success');
			})
			.catch((error) => {
				console.log(error);
				reject('error');
			});
	});
};
