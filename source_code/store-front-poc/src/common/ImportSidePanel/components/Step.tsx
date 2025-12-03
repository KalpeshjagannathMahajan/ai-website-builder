import { makeStyles } from '@mui/styles';

import CircularProgressBar from 'src/common/@the-source/atoms/ProgressBar/CircularProgressBar';
import { Typography, Image } from 'src/common/@the-source/atoms';
import ImageLinks from 'src/assets/images/ImageLinks';
import { StepStatus } from 'src/@types/manage_data';

const useStyles = makeStyles(() => ({
	text_container: {
		display: 'flex',
		flexDirection: 'column',
	},
	container: {
		display: 'flex',
		alignItems: 'center',
		gap: '8px',
	},
	step_number_box: {
		width: '24px',
		height: '24px',
		borderRadius: '50%',
		alignItems: 'center',
		display: 'flex',
		justifyContent: 'center',
	},
}));

interface Props {
	title: string;
	subtitle?: string;
	status: StepStatus;
	step_number?: number;
}

const Step = ({ title, subtitle, status, step_number }: Props) => {
	const classes = useStyles();

	if (status === StepStatus.Done) {
		return (
			<div className={classes.container}>
				<Image src={ImageLinks.done} width={24} height={24} />

				<div>
					<Typography variant='subtitle1' sx={{ fontSize: '16px', fontWeight: 700 }} color='rgba(0, 0, 0, 0.87)'>
						{title}
					</Typography>
					<Typography variant='body2' sx={{ fontSize: '14px', fontWeight: 400 }} color='rgba(0, 0, 0, 0.60)'>
						{subtitle}
					</Typography>
				</div>
			</div>
		);
	}

	if (status === StepStatus.InProgress) {
		return (
			<div className={classes.container}>
				<CircularProgressBar style={{ width: '24px', height: '24px' }} />
				<div>
					<Typography variant='subtitle1' sx={{ fontSize: '16px', fontWeight: 700 }} color='rgba(0, 0, 0, 0.87)'>
						{title}
					</Typography>
					<Typography variant='body2' sx={{ fontSize: '14px', fontWeight: 400 }} color='rgba(0, 0, 0, 0.60)'>
						{subtitle}
					</Typography>
				</div>
			</div>
		);
	}

	if (status === StepStatus.Error) {
		return (
			<div className={classes.container}>
				<Image src={ImageLinks.warning} width={24} height={24} />

				<div>
					<Typography variant='subtitle1' sx={{ fontSize: '16px', fontWeight: 700 }} color='#D74C10'>
						{title}
					</Typography>
				</div>
			</div>
		);
	}

	if (status === StepStatus.Pending) {
		return (
			<div className={classes.container}>
				<div className={classes.step_number_box} style={{ background: '#B5BBC3' }}>
					<Typography variant='subtitle2' sx={{ fontSize: '14px', fontWeight: 700 }} color='white'>
						{step_number}
					</Typography>
				</div>
				<div>
					<Typography variant='subtitle1' sx={{ fontSize: '16px', fontWeight: 700 }} color='rgba(0, 0, 0, 0.60)'>
						{title}
					</Typography>
				</div>
			</div>
		);
	}

	if (status === StepStatus.TakeAction) {
		return (
			<div className={classes.container}>
				<div className={classes.step_number_box} style={{ background: '#16885F' }}>
					<Typography variant='subtitle2' sx={{ fontSize: '14px', fontWeight: 700 }} color='white'>
						{step_number}
					</Typography>
				</div>
				<div>
					<Typography variant='subtitle1' sx={{ fontSize: '16px', fontWeight: 700 }} color='rgba(0, 0, 0, 0.87)'>
						{title}
					</Typography>
				</div>
			</div>
		);
	}

	return null;
};

export default Step;
