import { useEffect } from 'react';
import { makeStyles } from '@mui/styles';

import { Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import { ImportDrawerData, Notification } from 'src/@types/manage_data';
import NotificationCard from './Components/NotificationCard';
import CustomText from 'src/common/@the-source/CustomText';
import { t } from 'i18next';

const useStyles = makeStyles(() => ({
	cross: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '16px 20px 12px',
		background: 'white',
		cursor: 'pointer',
		top: 0,
		zIndex: 999,
		position: 'sticky',
		borderBottom: '1px solid #F7F8FA',
	},
	notification_container: {
		minHeight: '90vh',
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		color: '#B5BBC3',
	},
	logo_container: {
		display: 'grid',
		placeItems: 'center',
		borderRadius: '50%',
		width: '56px',
		height: '56px',
		background: 'white',
	},
	icon: {
		width: '38px',
		height: '38px',
		color: '#B5BBC3',
	},
}));

interface TaskManagerDrawerProps {
	data: Notification[];
	drawer: boolean;
	setNotificationDrawer: (value: boolean) => void;
	setImportDrawer: (value: boolean) => void;
	setImportDrawerData: (value: ImportDrawerData) => void;
}

const TaskManagerDrawer: React.FC<TaskManagerDrawerProps> = ({
	data,
	drawer,
	setNotificationDrawer,
	setImportDrawer,
	setImportDrawerData,
}) => {
	const classes = useStyles();

	useEffect(() => {
		if (drawer) localStorage.setItem('newNotification', JSON.stringify(false));
	}, [drawer]);

	return (
		<>
			{drawer && (
				<Drawer
					anchor='right'
					width={480}
					open={drawer}
					onClose={() => {
						setNotificationDrawer(false);
					}}
					content={
						<Grid container sx={{ background: '#F7F8FA' }}>
							<Grid container className={classes.cross}>
								<CustomText type='H2'>{t('Notifications.Notifications')}</CustomText>
								<Icon
									iconName='IconX'
									onClick={() => {
										setNotificationDrawer(false);
									}}
								/>
							</Grid>
							<Grid container padding={0.8}>
								{data?.length > 0 ? (
									data?.map((item: Notification) => (
										<NotificationCard
											key={item?.id}
											content={item}
											setNotificationDrawer={setNotificationDrawer}
											setImportDrawer={setImportDrawer}
											setImportDrawerData={setImportDrawerData}
										/>
									))
								) : (
									<Grid className={classes.notification_container}>
										<Grid className={classes.logo_container}>
											<Icon iconName='IconBell' className={classes.icon}></Icon>
										</Grid>
										<CustomText type='H2'>{t('Notifications.NoNewNotifications')}</CustomText>
									</Grid>
								)}
							</Grid>
						</Grid>
					}
				/>
			)}
		</>
	);
};

export default TaskManagerDrawer;
