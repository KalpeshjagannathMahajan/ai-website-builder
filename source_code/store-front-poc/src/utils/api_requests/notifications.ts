import utils from '../utils';

const notifications = {
	get_task_list: () => {
		return utils.request({
			url: '/tasks/v1/list',
			method: 'GET',
			mock: false,
		});
	},
	notification_action: (action: string, task_id: string) => {
		return utils.request({
			url: '/tasks/v1/action',
			method: 'POST',
			data: {
				action,
				task_id,
			},
		});
	},
};

export default notifications;
