import { makeStyles } from '@mui/styles';
const useStyles = makeStyles((theme: any) => ({
	filter_box: {
		display: 'inline-flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		minWidth: '150px',
		height: '42px !important',
		backgroundColor: theme?.filters?.date?.background_color,
		padding: '0.75em 1em',
		cursor: 'pointer',
		whiteSpace: 'nowrap',
		'&:hover': {
			border: theme?.product?.filter?.date_filter?.border,
		},
		...theme?.product?.filter?.date_filter,
	},
	selected_filter_box: {
		display: 'inline-flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		minWidth: '150px',
		height: '42px !important',
		backgroundColor: theme?.filters?.date?.background_color,
		padding: '0.7em 1em',
		borderRadius: theme?.filters?.date?.border_radius,
		cursor: 'pointer',
		whiteSpace: 'nowrap',
		border: `1px solid ${theme?.filters?.date?.border}`,
	},
	menu_item: {
		width: '240px',
		height: '48px',
	},
	selected_item: {
		width: '240px',
		height: '48px',
		background: theme?.filters?.date?.selected_color,
	},
	accordion_date_options: {
		display: 'flex',
		flexDirection: 'row',
		width: '360px',
		height: '48px',
		alignItems: 'center',
	},
	date_container: {
		display: 'flex',
		flexDirection: 'row-reverse',
	},
	accordion_date_container: {
		display: 'flex',
		flexDirection: 'column-reverse',
		width: '100%',
	},
	date_fields: {
		width: '282px',
		display: 'flex',
		flexDirection: 'column',
		padding: '16px',
		gap: '20px',
		borderLeft: `1px solid ${theme?.filters?.date?.border_color}`,
	},
	accordion_date_fields: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		padding: '16px',
		gap: '20px',
		borderTop: `1px solid ${theme?.filters?.date?.border_color}`,
	},
	button_container: {
		display: 'flex',
		flexDirection: 'row',
		padding: '0 10px',
		gap: '10px',
		borderTop: `1px solid ${theme?.filters?.date?.border_color}`,
	},
	clear_button: {
		fontSize: '16px',
		marginRight: 'auto',
	},
	button: {
		fontSize: '16px',
	},
	red_dot: {
		height: '0.5em',
		width: '0.5em',
		backgroundColor: '#d74c10',
		borderRadius: ' 50%',
		display: 'inline-block',
		marginRight: '0.5em',
		marginBottom: '0.1em',
	},
}));

export default useStyles;
