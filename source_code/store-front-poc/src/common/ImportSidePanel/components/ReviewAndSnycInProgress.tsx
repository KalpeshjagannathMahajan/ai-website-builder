import { makeStyles } from '@mui/styles';

import CircularProgressBar from 'src/common/@the-source/atoms/ProgressBar/CircularProgressBar';
import { Typography } from 'src/common/@the-source/atoms';
import { t } from 'i18next';

const useStyles = makeStyles(() => ({
	container: {
		justifyContent: 'space-between',
		padding: '16px',
		borderRadius: '12px',
		background: '#F7F8FA',
		display: 'flex',
		gap: '12px',
		flexDirection: 'column',
	},
	task_box: {
		display: 'flex',
		alignItems: 'center',
		gap: '8px',
		borderRadius: '74px',
		padding: '7px 10px',
		width: 'fit-content',
		background: 'linear-gradient(240deg, #E8F0FC 0%, rgba(201, 228, 223, 0.48) 100%)',
	},
}));

const ReviewAndSnycInProgress = () => {
	const classes = useStyles();

	return (
		<div className={classes.container}>
			<Typography sx={{ fontSize: '16px', fontWeight: 700 }} variant='body2' color='rgba(0, 0, 0, 0.87)'>
				{t('ManageData.ReviewAndSnycInProgress.Syncing')}
			</Typography>

			<Typography sx={{ fontSize: '14px', fontWeight: 400 }} variant='body2' color='rgba(0, 0, 0, 0.87)'>
				{t('ManageData.ReviewAndSnycInProgress.MoreDetails')}
			</Typography>

			<div className={classes.task_box}>
				<CircularProgressBar style={{ width: '18px', height: '18px' }} />
				<Typography sx={{ fontSize: '14px', fontWeight: 700 }} variant='subtitle2' color='rgba(0, 0, 0, 0.87)'>
					{t('ManageData.ReviewAndSnycInProgress.InProgress')}
				</Typography>
			</div>
		</div>
	);
};

export default ReviewAndSnycInProgress;
