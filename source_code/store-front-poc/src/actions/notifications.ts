import { TASK_UPDATED, TASK_DISMISSED, SET_TASKS, SHOW_NOTIFICATION_FEEDBACK } from './reduxConstants'; // Import SET_TASKS

export const taskUpdated = (task_id: string, task: any) => ({
	type: TASK_UPDATED,
	payload: { task_id, task },
});

export const taskDismissed = (task_id: string) => ({
	type: TASK_DISMISSED,
	payload: { task_id },
});

export const setTasks = (tasks: any) => ({
	type: SET_TASKS,
	payload: {
		tasks,
	},
});

export const set_notification_feedback = (visible: boolean, x?: number | string, y?: number | string) => ({
	type: SHOW_NOTIFICATION_FEEDBACK,
	payload: { x, y, visible },
});
