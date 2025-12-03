import Intercom, { shutdown, onShow, onHide, onUnreadCountChange } from '@intercom/messenger-js-sdk';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import Draggable from 'react-draggable';
import './theme.css';
import { Image } from 'src/common/@the-source/atoms';
import ImageLinks from 'src/assets/images/ImageLinks';
import constants from 'src/utils/constants';

const { VITE_APP_INTERCOM_KEY, VITE_APP_ENV } = import.meta.env;

export default function IntercomComponent() {
	const user_details = useSelector((state: any) => state.login.userDetails);
	const intercom_permission = useSelector((state: any) => state.settings.intercom_enabled);
	const [is_dragged, set_is_dragged] = useState(false);
	const [unread, set_unread] = useState(0);
	const intercom_button = useRef<any>();
	const in_prod = VITE_APP_ENV === constants.ALL_ENV.PRODUCTION;
	const login_condition =
		!_.isEmpty(user_details?.first_name) &&
		!_.isEmpty(user_details?.email) &&
		!_.isEmpty(user_details?.created_at) &&
		!_.isEmpty(user_details?.id) &&
		!_.isEmpty(user_details.company_name) &&
		!_.isEmpty(user_details.organization_id) &&
		intercom_permission &&
		in_prod;
	const unread_messages = unread !== 0;

	const handle_state_on_show = () => {
		intercom_button.current.classList.add('rotate-left-to-right');
		intercom_button.current.classList.remove('intercom_show_btn');
		intercom_button.current.classList.remove('rotate-right-to-left');
		intercom_button.current.classList.add('intercom_hide_btn');
	};

	const handle_state_on_hide = () => {
		intercom_button.current.classList.remove('intercom_hide_btn');
		intercom_button.current.classList.remove('rotate-left-to-right');
		intercom_button.current.classList.add('rotate-right-to-left');
		intercom_button.current.classList.add('intercom_show_btn');
	};

	const handle_on_drag = () => {
		if (!is_dragged) set_is_dragged(true);
	};

	const handle_on_stop = () => {
		if (is_dragged) set_is_dragged(false);
	};

	const handle_unread_count = (notification: string) => {
		const unread_count: number = Number(notification);
		if (!_.isNaN(notification)) {
			set_unread(unread_count);
		} else set_unread(0);
	};

	useEffect(() => {
		if (login_condition) {
			Intercom({
				app_id: VITE_APP_INTERCOM_KEY,
				custom_launcher_selector: '.intercom-btn-container',
				name: `${user_details.first_name + (user_details?.last_name ? ` ${user_details.last_name}` : '')} - ${user_details.company_name}`,
				email: user_details.email,
				created_at: user_details.created_at,
				user_id: user_details.id,
				hide_default_launcher: true,
				company: user_details.company_name,
				companies: [
					{
						id: user_details.organization_id,
						name: user_details.company_name,
					},
				],
			});

			onShow(handle_state_on_show);
			onHide(handle_state_on_hide);
			onUnreadCountChange(handle_unread_count);
		} else {
			shutdown();
		}
	}, [user_details, intercom_permission]);

	return (
		login_condition && (
			<Draggable
				bounds='body'
				onDrag={handle_on_drag}
				onStop={handle_on_stop}
				defaultClassName={'intercom-btn-container intercom_draggable_container'}>
				<div className={'intercom_button_container'}>
					{is_dragged && <div className={'intercom_button_wrapper'}></div>}
					<button ref={intercom_button} className={'intercom-btn'}>
						{unread_messages && <div className='intercom-notification'></div>}
						<div className={'intercom_show_btn intercom_icon'}>
							<Image src={ImageLinks.intercom_icon} alt='Intercom' draggable={false} />
						</div>
					</button>
				</div>
			</Draggable>
		)
	);
}
