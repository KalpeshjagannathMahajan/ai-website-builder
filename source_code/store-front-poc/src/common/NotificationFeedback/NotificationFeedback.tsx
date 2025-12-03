import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { set_notification_feedback } from 'src/actions/notifications';
import Flying from '../../assets/images/icons/flying_animation.svg';
import './styles.css';

interface Props {
	notification_feedback: {
		x: string | number;
		y: string | number;
		visible: boolean;
	};
}

function NotificationFeedback({ notification_feedback }: Props) {
	const { x, y } = notification_feedback;
	const dispatch = useDispatch();

	useEffect(() => {
		if (notification_feedback?.visible) {
			setTimeout(() => {
				dispatch(set_notification_feedback(false));
			}, 1000);
		}
	}, [notification_feedback?.visible]);

	return (
		<>
			<div style={{ position: 'fixed', right: x, top: y }} className='flying_feedback'>
				<img className='flying_image' src={Flying} />
			</div>
		</>
	);
}

export default NotificationFeedback;
