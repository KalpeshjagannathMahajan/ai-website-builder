import { makeStyles } from '@mui/styles';
import { Dialog as MUIDialog } from '@mui/material';

import { Typography, Icon } from 'src/common/@the-source/atoms';

const useStyles = makeStyles((theme: any) => ({
	container: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		borderRadius: '12px',
		background: 'white',
		...theme?.modal_,
	},
	title: {
		background: '#FFF',
		padding: '16px 24px 16px 24px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		alignSelf: 'stretch',
		fontSize: '1.6rem',
		'@media (max-width: 600px)': {
			padding: '16px 16px 16px 16px',
		},
	},
	body: {
		paddingTop: '12px',
		paddingBottom: '12px',
		paddingLeft: '24px',
		paddingRight: '24px',
	},
	footer: {
		padding: '16px 24px 16px 24px',
		display: 'flex',
		justifyContent: 'flex-end',
		gap: '12px',
		width: '100%',
		'@media (max-width: 600px)': {
			padding: '16px 16px 16px 16px',
		},
	},
}));

export const DialogContainer = ({ children }: any) => {
	const classes = useStyles();

	return <div className={classes.container}>{children}</div>;
};

export const DialogTitle = ({ value, handle_close, show_close }: any) => {
	const classes = useStyles();
	return (
		<div className={classes.title}>
			<Typography color='rgba(0, 0, 0, 0.87)' variant='subtitle1' sx={{ fontWeight: 700 }}>
				{value}
			</Typography>
			{show_close && (
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<Icon iconName='IconX' color='#4F555E' sx={{ cursor: 'pointer' }} onClick={handle_close} />
				</div>
			)}
		</div>
	);
};

export const DialogBody = ({ value }: any) => {
	const classes = useStyles();
	return (
		<div className={classes.body}>
			<Typography color='#171717' sx={{ fontWeight: 400, fontSize: '14px' }}>
				{value}
			</Typography>
		</div>
	);
};

export const DialogFooter = ({ children }: any) => {
	const classes = useStyles();

	return <div className={classes.footer}>{children}</div>;
};

export const DialogSeperator = () => {
	return <div style={{ width: '100%', background: '#EEF1F7', height: '1px' }} />;
};

const CustomDialog = ({ show_modal, handle_close, children, style = {} }: any) => {
	return (
		<MUIDialog
			onClose={handle_close}
			open={show_modal}
			PaperProps={{
				style: { background: 'none', ...style },
			}}>
			{children}
		</MUIDialog>
	);
};

export default CustomDialog;
