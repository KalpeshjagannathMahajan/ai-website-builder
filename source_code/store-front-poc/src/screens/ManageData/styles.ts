import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
	page_container: {
		display: 'flex',
		flexDirection: 'column',
		gap: '8px',
		paddingTop: '1.6rem',
	},
	page_container_section: {
		display: 'flex',
		flexDirection: 'column',
		gap: '18px',
	},
	data_cards_row: {
		display: 'flex',
		justifyContent: 'center',
		gap: '16px',
	},
	data_cards_container: {
		padding: '20px 0px',
		background: theme?.import_export?.data_cards_container?.background,
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '24px',
		borderRadius: '12px',
	},
	button_container: {
		display: 'flex',
		gap: '16px',
	},
	page_container_section2: {
		minHeight: '40vh',
		display: 'flex',
		flexDirection: 'column',
		gap: '10px',
		justifyContent: 'center',
		alignItems: 'center',
	},
	icon_circle: {
		width: '144px',
		height: '144px',
		color: theme?.import_export?.icon_circle?.color,
	},
	text1: {
		fontSize: '18px',
		fontWeight: '700',
	},
	text2: {
		fontSize: '16px',
		fontWeight: '400',
	},
}));

export default useStyles;
