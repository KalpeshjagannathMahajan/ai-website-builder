import { TASK_UPDATED, TASK_DISMISSED, SET_TASKS, SHOW_NOTIFICATION_FEEDBACK, USER_SWITCH } from '../actions/reduxConstants';
import { USER_LOGOUT } from '../actions/reduxConstants';

interface Notifications {
	data: any;
	notification_feedback: {
		x: string | number;
		y: string | number;
		visible: boolean;
	};
}

const initialState: Notifications = {
	data: {},
	notification_feedback: {
		x: '180px',
		y: '46vh',
		visible: false,
	},
};

const notificationsReducer = (state = initialState, action: { type: string; payload: any }) => {
	switch (action.type) {
		case SET_TASKS: {
			const { tasks } = action.payload;

			return {
				...state,
				data: tasks,
			};
		}

		case TASK_UPDATED: {
			const { task, task_id } = action.payload;

			return {
				...state,
				data: {
					...state.data,
					[task_id]: task,
				},
			};
		}

		case TASK_DISMISSED: {
			const { task_id } = action.payload;
			const new_data = { ...state.data };
			delete new_data[task_id];

			return { ...state, data: new_data };
		}
		case USER_SWITCH:
		case USER_LOGOUT:
			return { ...initialState };
		case SHOW_NOTIFICATION_FEEDBACK: {
			const { x, y, visible } = action.payload;
			return {
				...state,
				notification_feedback: {
					...state.notification_feedback,
					x: x ? x : state.notification_feedback.x,
					y: y ? y : state.notification_feedback.y,
					visible,
				},
			};
		}
		default:
			return state;
	}
};
export default notificationsReducer;
