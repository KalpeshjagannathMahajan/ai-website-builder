import { makeStyles } from '@mui/styles';
import { Typography } from 'src/common/@the-source/atoms';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles(() => ({
	status_box: {
		display: 'flex',
		height: 24,
		padding: '0px 12px 0px 8px',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 8,
		borderRadius: '40px',
		width: 'fit-content',
	},
	dot: {
		width: '10px',
		height: '10px',
		borderRadius: '50%',
	},
}));

const Status = ({ text, color }: any) => {
	const classes = useStyles();
	const theme: any = useTheme();
	return (
		<div className={classes.status_box} style={theme?.status}>
			<div className={classes.dot} style={{ background: color }} />
			<Typography color={theme?.palette?.colors?.black_8} sx={{ fontSize: '14px', fontWeight: 400 }}>
				{text}
			</Typography>
		</div>
	);
};

export default Status;
