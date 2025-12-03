import utils from '../utils';

interface PostActionProps {
	user_id: string;
	buyer_id: string;
	action: 'active' | 'inactive' | 'delete';
}

const wizshop = {
	post_action: ({ user_id, buyer_id, action }: PostActionProps) => {
		return utils.request({
			url: `/users/v1/wizshop/${user_id}/action/${action}`,
			data: {
				buyer_id,
			},
			method: 'POST',
		});
	},
	edit_user: (data: any, user_id: string) => {
		return utils.request({
			url: `users/v1/wizshop/${user_id}`,
			method: 'PUT',
			data,
		});
	},
	get_users: () => {
		return utils.request({
			url: 'users/v1/wizshop/',
			method: 'GET',
		});
	},
	send_email: (data: any) => {
		return utils.request({
			url: 'users/v1/wizshop/email',
			method: 'POST',
			data,
		});
	},
	get_copy_invite: (data: any) => {
		return utils.request({
			url: 'users/v1/wizshop/reset-password-link',
			method: 'POST',
			data,
		});
	},
	create_user: (data: any) => {
		return utils.request({
			url: 'users/v1/wizshop/',
			method: 'POST',
			data,
		});
	},
	validate_email: (email: string) => {
		return utils.request({
			url: 'users/v1/validate_email',
			method: 'GET',
			params: { email, channel: 'wizshop' },
		});
	},
};

export default wizshop;
