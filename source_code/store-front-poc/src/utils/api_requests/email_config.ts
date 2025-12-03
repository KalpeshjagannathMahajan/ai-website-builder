import utils from '../utils';

const naylas_config = {
	genrate_url: (data: any) => {
		return utils.request({
			url: 'nylas/v1/generate-auth-url',
			method: 'POST',
			data,
			show_error: false,
		});
	},
	get_connected_acccount: () => {
		return utils.request({
			url: 'nylas/v1/get-connected-account',
			method: 'POST',
			response_array: true,
			show_error: false,
		});
	},
	disconnected: () => {
		return utils.request({
			url: 'nylas/v1/disconnect-account',
			method: 'POST',
		});
	},
	get_token: (data: any) => {
		return utils.request({
			url: 'nylas/v1/exchange-mailbox-token',
			method: 'POST',
			data,
			show_error: false,
		});
	},
};

export default naylas_config;
