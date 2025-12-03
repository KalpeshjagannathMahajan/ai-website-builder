import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from 'src/store';
import moment from 'moment';

import { taskUpdated, setTasks } from 'src/actions/notifications';
import NotificationsApi from 'src/utils/api_requests/notifications';
import { Notification, EventType, ChannelScope } from 'src/@types/manage_data';
import TopBarUtils from './helper';

const useWebSocket = () => {
	const notifications = useSelector((state: RootState) => state.notifications.data);

	const dispatch = useDispatch();

	const user_id = useSelector((state: RootState) => state.login.userDetails.id);
	const tenant_id = useSelector((state: RootState) => state.login.userDetails.tenant_id);

	const on_task_updated = (data: Notification) => {
		data.created_at = data?.created_at?.trim();
		TopBarUtils.set_notification(data);
		dispatch(taskUpdated(data.id, data));
	};

	const on_task_started = (data: Notification) => {
		data.created_at = data?.created_at?.trim();
		dispatch(taskUpdated(data.id, data));
	};

	const fetchTasks = async () => {
		try {
			const response: any = await NotificationsApi.get_task_list();
			const formated_task_list = response?.data?.reduce((acc: any, task: Notification) => {
				TopBarUtils.set_notification(task);
				acc[task.id] = task;
				return acc;
			}, {});

			dispatch(setTasks(formated_task_list));
		} catch (error) {
			console.error('Error fetching notifications:', error);
		}
	};

	useEffect(() => {
		fetchTasks();
	}, []);

	useEffect(() => {
		if (tenant_id && user_id) {
			const tenant_channel_instance = TopBarUtils.subscribe(tenant_id, ChannelScope.TENANT);
			const user_channel_instance = TopBarUtils.subscribe(tenant_id, ChannelScope.USER, user_id);
			if (tenant_channel_instance) {
				tenant_channel_instance.bind(EventType.TASK_UPDATED, on_task_updated);
				tenant_channel_instance.bind(EventType.TASK_CREATED, on_task_started);
			}
			if (user_channel_instance) {
				user_channel_instance.bind(EventType.TASK_UPDATED, on_task_updated);
				user_channel_instance.bind(EventType.TASK_CREATED, on_task_started);
			}
		}
	}, [user_id, tenant_id]);

	// TODO: sort it

	const notifications_list = Object.values(notifications);

	const sorted_notifications_list = notifications_list.sort((left: any, right: any) => {
		return moment.utc(right.created_at).diff(moment.utc(left.created_at));
	});

	return {
		notifications: sorted_notifications_list,
	};
};

export default useWebSocket;
