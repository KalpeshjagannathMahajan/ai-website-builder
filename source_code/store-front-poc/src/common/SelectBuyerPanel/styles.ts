import { makeStyles } from '@mui/styles';

export const DRAWER_WIDTH = '421px';

export const useStyles = makeStyles(() => ({
	container: {
		width: DRAWER_WIDTH,
		height: '100vh',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		background: 'white',
	},
	header_section: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '16px 20px',
	},
	body_section: {
		marginTop: '20px',
	},
	footer_section: {
		display: 'flex',
		justifyContent: 'flex-end',
		gap: '8px',
		marginTop: '32px',
	},
	seperator: {
		height: '10px',
		width: '100%',
		background: 'black',
	},
	guest_buyer: {
		display: 'flex',
		flexDirection: 'column',
		gap: '12px',
		paddingLeft: '20px',
		paddingRight: '20px',
		paddingTop: '16px',
		paddingBottom: '16px',
	},
	buyer_body: {
		display: 'flex',
		flexDirection: 'column',
		paddingLeft: '2rem',
		paddingRight: '2rem',
	},
	buyer_list: {
		display: 'flex',
		flexDirection: 'column',
		gap: '1.2rem',
		paddingBottom: '1.2rem',
	},
	search_box: {
		paddingTop: '1.6rem',
		zIndex: 3,
		background: 'white',
		position: 'sticky',
		top: 0,
		display: 'flex',
		gap: 10,
		alignItems: 'center',
	},
	scroll_section: {
		height: '100%',
		overflow: 'scroll',
	},
}));

export const searchInput = { background: 'white', padding: '.2rem', flex: 1 };
export const search_result = { fontSize: '14px', margin: '15px 0', fontWeight: 400 };
