import Pusher from 'pusher-js';
import { ChannelScope } from 'src/@types/manage_data';
import { Notification } from 'src/@types/manage_data';

function validate_and_create_channel_name(tid: string, channelScope: string, userId = null) {
	let channelName = `${ChannelScope.TENANT}.${tid}`;

	if (channelScope === ChannelScope.USER) {
		if (!userId) {
			console.error('userId can not be empty!');
			return null;
		}
		channelName += `_${ChannelScope.USER}.${userId}`;
	}

	return channelName;
}

export function subscribe(tid: string, channelScope: ChannelScope, userId = null) {
	const channelName = validate_and_create_channel_name(tid, channelScope, userId);
	const { VITE_APP_PUSHER_CLUSTER, VITE_APP_PUSHER_KEY } = import.meta.env;
	// eslint-disable-next-line no-undef
	const pusher = new Pusher(`${VITE_APP_PUSHER_KEY}`, {
		// eslint-disable-next-line no-undef
		cluster: `${VITE_APP_PUSHER_CLUSTER}`,
	});

	if (channelName) {
		const channel_instance = pusher.subscribe(channelName);
		return channel_instance;
	}
	return null;
}

const set_notification = (task: Notification) => {
	const hash = `${task.id}-${task.task_status}`;
	try {
		const hash_exists = JSON.parse(localStorage.getItem(hash) || 'false');
		if (!hash_exists) {
			localStorage.setItem('newNotification', JSON.stringify(true));
			localStorage.setItem(hash, JSON.stringify(true));
		}
	} catch (error) {
		console.log(error);
	}
};

const notifications_init = (tasks: Notification[]) => {
	const notifications_from_api = tasks.reduce((acc: any, task: Notification) => {
		const hash = `${task.id}-${task.task_status}`;
		acc[hash] = true;
		return acc;
	}, {});

	console.log(notifications_from_api);
};

export default {
	subscribe,
	ChannelScope,
	set_notification,
	notifications_init,
};
