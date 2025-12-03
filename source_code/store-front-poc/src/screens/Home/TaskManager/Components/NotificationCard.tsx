import React, { useState } from 'react';
import { isoToDateDay } from 'src/utils/common';
import { makeStyles } from '@mui/styles';

import { Grid } from 'src/common/@the-source/atoms';
import { ImportDrawerData, Notification } from 'src/@types/manage_data';
import Logo from './Logo';
import TaskCard from './TaskCard';
import CustomText from 'src/common/@the-source/CustomText';
import { t } from 'i18next';

const useStyles = makeStyles(() => ({
	taskcard_container: {
		color: 'grey',
		display: 'flex',
		flexDirection: 'column',
		gap: '4px',
	},
	notification_card_container: {
		background: 'white',
		padding: '12px',
		marginBottom: '8px',
		borderRadius: '8px',
		display: 'flex',
		flexDirection: 'row',
		transition: 'box-shadow 0.2s',
		'&:hover': {
			boxShadow: 'rgba(0, 0, 0, 0.16) 0px 4px 7px 1px',
		},
	},
	notification_card_container2: {
		boxShadow: 'rgba(0, 0, 0, 0.16) 0px 4px 7px 1px',
		padding: '12px',
		marginBottom: '8px',
		borderRadius: '8px',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		background: 'rgba(255, 255, 255, 0.8)',
		zIndex: 10,
		fontWeight: 700,
		fontSize: '16px',
		color: 'grey',
	},
}));

interface Props {
	content: Notification;
	setNotificationDrawer: (value: boolean) => void;
	setImportDrawer: (value: boolean) => void;
	setImportDrawerData: (value: ImportDrawerData) => void;
}

const NotificationCard = React.memo(({ content, setNotificationDrawer, setImportDrawer, setImportDrawerData }: Props) => {
	const classes = useStyles();
	const date = isoToDateDay(content.created_at, "DD MMM YY' [at] hh:mm A");

	const [clicked, setClicked] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const handleClicked = () => {
		setClicked(true);
	};

	const handleMouseEnter = () => {
		setIsHovered(true);
	};

	const handleMouseLeave = () => {
		setIsHovered(false);
	};

	return (
		<Grid style={{ position: 'relative', width: '100%', transition: 'all 0.6s ease-out', opacity: clicked ? 0 : 1 }}>
			<Grid className={classes.notification_card_container} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
				<Grid item>
					<Logo task_status={content.task_status} entity={content.entity} />
				</Grid>
				<Grid item container className={classes.taskcard_container} justifyContent={'center'}>
					<TaskCard
						isHovered={isHovered}
						clicked={clicked}
						handleClicked={handleClicked}
						setNotificationDrawer={setNotificationDrawer}
						setImportDrawer={setImportDrawer}
						setImportDrawerData={setImportDrawerData}
						content={content}
					/>
					<Grid>
						<CustomText type='Body' color='grey'>{`${date}, by ${content.created_by_email}`}</CustomText>
					</Grid>
				</Grid>
			</Grid>
			{clicked && <div className={classes.notification_card_container2}>{t('Notifications.NotificationDismissed')}</div>}
		</Grid>
	);
});

export default NotificationCard;
