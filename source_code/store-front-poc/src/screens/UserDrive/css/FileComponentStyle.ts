import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
	container: {
		width: 150,
		display: 'flex',
		flexDirection: 'row',
		paddingTop: 6,
		paddingBottom: 6,
		justifyContent: 'space-between',
	},
	label_container: {
		background: theme?.user_drive?.file_component?.style?.label_container_background,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '10px 12px',
		borderRadius: 8,
		gap: 4,
		cursor: 'pointer',
	},
	file_container: {
		backgroundColor: theme?.user_drive?.file_component?.style?.file_background_color,
		borderRadius: '1rem',
		padding: '1.2rem',
		width: '100%',
	},
	upper_container: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		margin: '-10px 0 0 -10px',
	},
	menu_cont: {
		marginLeft: 'auto',
		alignItems: 'center',
	},
	menu_label: {
		marginLeft: 'auto',
		backgroundColor: theme?.user_drive?.file_component?.style?.menu_label_background_color,
		justifyContent: 'center',
		alignItems: 'center',
		display: 'flex',
		cursor: 'pointer',
	},
	file_name: {
		marginTop: 8,
		overflow: 'hidden',
		whiteSpace: 'nowrap',
		textOverflow: 'ellipsis',
		maxWidth: '98%',
	},
	date: {
		display: 'flex',
		alignItems: 'center',
	},
	detail: {
		justifyContent: 'center',
		alignItems: 'center',
		display: 'flex',
		height: '20vh',
	},
	image: {
		width: '100%',
		height: '100%',
		objectFit: 'contain',
	},
	/** Email Modal CSS **/
	email_input: {
		width: '100%',
		padding: '1vh 0 0 0',
	},
	email_box: {
		backgroundColor: theme?.user_drive?.file_component?.style?.email_box_background_color,
		padding: 24,
		position: 'absolute',
		bottom: 0,
		width: '100%',
	},
	email_container: {
		backgroundColor: theme?.user_drive?.file_component?.style?.email_container_background_color,
		padding: '0 14px 12px',
		marginTop: 8,
	},
	email_body: {
		fontSize: '1.6rem',
		resize: 'vertical',
		overflow: 'auto',
		height: '50vh',
		marginTop: '2vh',
	},
}));

export default useStyles;
