import utils from '../utils';

const user = {
	login: () => {
		return utils.request({
			url: 'auth/login/',
			method: 'POST',
			data: {},
		});
	},
	wizshop_reset_password: (data: any) => {
		return utils.request({
			url: 'users/v1/wizshop/wizshop_reset_user_password',
			method: 'POST',
			data,
			show_error: false,
		});
	},
	refresh_token: () => {
		return utils.request({
			url: 'auth/token/refresh/',
			method: 'POST',
			data: {},
		});
	},
	set_password_wizshop: (data: any) => {
		return utils.request({
			url: '/users/v1/wizshop/set-password',
			method: 'POST',
			data,
		});
	},
	verify_token: () => {
		return utils.request({
			url: 'auth/token/verify/',
			method: 'POST',
			data: {},
		});
	},
	forgot_password: () => {
		return utils.request({
			url: 'users/password_reset/',
			method: 'POST',
			data: {},
		});
	},

	reset_password: (token: string) => {
		return utils.request({
			url: `users/password_reset_confirm/${token}`,
			method: 'POST',
			data: {},
		});
	},

	set_timezone: (timezone: string) => {
		return utils.request({
			url: 'users/v1/timezone',
			method: 'POST',
			data: {
				timezone,
			},
		});
	},
};

export default user;
