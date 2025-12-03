import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
	header_title: {
		width: '380px',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: '12px',
	},
	status: {
		display: 'flex',
		color: '#16885F',
		gap: '5px',
		cursor: 'pointer',
	},
	userIconBack: {
		backgroundColor: '#F2F4F7',
		borderRadius: '100vw',
		width: '40px',
		height: '40px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	comment_section: {
		backgroundColor: '#F2F4F7',
		color: 'blue',
		borderRadius: '8px',
	},
}));

export default useStyles;
