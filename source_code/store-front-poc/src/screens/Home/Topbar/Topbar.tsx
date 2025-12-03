import { useSelector } from 'react-redux';
import { Box, Image, TopBar as SWTopBar, Icon, Grid } from 'src/common/@the-source/atoms';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
// import { useLocation, useNavigate } from 'react-router-dom';
import ImageLinks from 'src/assets/images/ImageLinks';
import ImportSidePanel from 'src/common/ImportSidePanel/ImportSidePanel';
import TaskManagerDrawer from '../TaskManager/TaskManager';
import { ImportDrawerData } from 'src/@types/manage_data';
import { handle_multi_tenant, logout_click } from 'src/actions/login';
import store, { RootState } from 'src/store';
import useWebSocket from './useWebSocket';
import { useNavigate } from 'react-router-dom';
import CustomText from 'src/common/@the-source/CustomText';
import { Divider } from '@mui/material';
import _ from 'lodash';
import { custom_stepper_text_color, text_colors } from 'src/utils/light.theme';
import { save_persisted_data } from 'src/actions/persistedUserData';
import { PERSIST_REDUX_PATHS } from 'src/reducers/persistedUserData';
import EditTimeZoneModal from './EditTimeZoneModal';
import { get_default_timezone, get_formatted_timezone } from 'src/utils/utils';
import { t } from 'i18next';
import { colors } from 'src/utils/theme';

const truncate_text = {
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	width: '100%',
};

const wrap_text = {
	wordWrap: 'break-word',
	overflowWrap: 'break-word',
	whiteSpace: 'normal',
};

export default function Topbar() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const user_timezone = useSelector((state: any) => state?.login?.userDetails?.timezone);
	const formatted_timzone = useMemo(
		() => (_.isEmpty(user_timezone) ? get_default_timezone(true) : get_formatted_timezone(user_timezone)),
		[user_timezone],
	);

	const [notificationDrawer, setNotificationDrawer] = useState(false);
	const [importDrawer, setImportDrawer] = useState(false);
	const user_details = useSelector((state: RootState) => state?.login?.userDetails);
	const notification_feedback = useSelector((state: any) => state?.notifications?.notification_feedback);
	const token = _.get(store.getState(), 'persistedUserData.auth_access_token', '');
	const [importDrawerData, setImportDrawerData] = useState<ImportDrawerData | null>();
	const [edit_time_zone_modal, set_edit_time_zone_modal] = useState(false);
	const { notifications } = useWebSocket();

	const user = user_details?.first_name ? `${user_details?.first_name} ${user_details?.last_name}` : '';

	const handle_open_edit_timezone = () => {
		set_edit_time_zone_modal(true);
	};

	const profile_details = () => {
		return (
			<>
				<Grid>
					<CustomText type='H3' style={truncate_text}>
						{user}
					</CustomText>
					<CustomText type='Body' color={text_colors?.primary} style={wrap_text}>
						{user_details?.email}
					</CustomText>
					<CustomText type='Body' color={text_colors?.primary} style={truncate_text}>
						{user_details?.company_name}
					</CustomText>
				</Grid>
				<Divider sx={{ margin: '1rem 0rem 0rem', marginLeft: '-20px', width: 'calc(100% + 40px)' }} />
			</>
		);
	};

	const timezone_details = () => {
		return (
			<>
				<Grid>
					<Grid container flexDirection={'row'} alignItems={'center'} justifyContent={'space-between'}>
						<CustomText type='H3'>Timezone</CustomText>
						<Grid onClick={handle_open_edit_timezone}>
							<CustomText type='Subtitle' color={colors.primary_600}>
								{t('Common.Main.Edit')}
							</CustomText>
						</Grid>
					</Grid>
					<CustomText type='Body' color={text_colors?.primary} style={wrap_text}>
						{formatted_timzone}
					</CustomText>
				</Grid>
				<Divider sx={{ margin: '1rem 0rem 0rem', marginLeft: '-20px', width: 'calc(100% + 40px)' }} />
			</>
		);
	};

	const ProfileActions = [
		{
			label: profile_details(),
		},
		{
			label: timezone_details(),
		},
		_.size(user_details?.all_tenants) > 1
			? {
					icon: '',
					label: (
						<Grid container gap={1}>
							<Icon iconName='IconUserCircle' color={custom_stepper_text_color?.grey} /> <CustomText type='Body'>Switch company</CustomText>
						</Grid>
					),
					onClick: () => {
						handle_multi_tenant(dispatch, token);
						localStorage.setItem('switch-user', `switch${Math.random()}`);
						dispatch(save_persisted_data(PERSIST_REDUX_PATHS.temp_token, token));
						setTimeout(() => navigate('/'), 0);
					},
			  }
			: {},
		{
			icon: '',
			label: (
				<>
					<Grid container gap={1}>
						<Icon iconName='IconLogout' color={custom_stepper_text_color?.grey} /> <CustomText type='Body'>Logout</CustomText>
					</Grid>
				</>
			),
			onClick: () => {
				dispatch<any>(logout_click());
				navigate('/');
				window.location.reload();
			},
		},
	].filter((item) => !_.isEmpty(item));

	const render_notification = () => {
		const new_notification = localStorage.getItem('newNotification') || 'false';
		if (JSON.parse(new_notification))
			return (
				<Image
					imgClass={notification_feedback.visible ? 'unseen_nofitication_animation' : ''}
					width={24}
					height={24}
					src={ImageLinks.unseen_notification}
					onClick={() => setNotificationDrawer(true)}
				/>
			);
		return <Icon iconName='IconBell' onClick={() => setNotificationDrawer(true)}></Icon>;
	};

	const breadCrumbList = useSelector((state: any) => state.breadcrumb.breadcrumbs);
	return (
		<Box
			sx={{
				width: '100%',
				padding: '0rem',
			}}>
			<SWTopBar
				breadCrumbList={breadCrumbList}
				menu={ProfileActions}
				username={user}
				notificationNode={render_notification()}
				setNotificationDrawer={setNotificationDrawer}
				// handleCart={() => {
				//   navigate(RouteNames.user_management.users.path);
				//   alert('cart');
				// }}
				// handleQuickSettings={() => {
				//   // dispatch(openQuickSettings(true));
				// }}
				// handleChange={() => {}}
			/>
			{notificationDrawer && (
				<TaskManagerDrawer
					data={notifications}
					drawer={notificationDrawer}
					setNotificationDrawer={setNotificationDrawer}
					setImportDrawer={setImportDrawer}
					setImportDrawerData={setImportDrawerData}
				/>
			)}
			{importDrawer && importDrawerData && (
				<ImportSidePanel
					task_id={importDrawerData?.taskId}
					show_drawer={true}
					toggle_drawer={setImportDrawer}
					entity={importDrawerData?.entity}
					selected_sub_entity={importDrawerData?.sub_entity}
				/>
			)}
			<EditTimeZoneModal open={edit_time_zone_modal} handle_close={() => set_edit_time_zone_modal(false)} />
		</Box>
	);
}
