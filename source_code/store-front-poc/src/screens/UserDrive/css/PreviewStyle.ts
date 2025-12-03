import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
	preview_box: {
		backgroundColor: theme?.user_drive?.preview_style?.background_color,
		position: 'fixed',
		left: 0,
		bottom: 0,
		height: '100vh',
		width: '100vw',
		zIndex: 10000,
		display: 'flex',
		alignItems: 'flex-end',
	},
	main_box: {
		backgroundColor: theme?.user_drive?.preview_style?.primary_color,
		width: '100%',
		height: '90vh',
		padding: '2vh 2vw',
	},
	preview_info: {
		flexDirection: 'row',
		display: 'flex',
		alignItems: 'center',
		marginBottom: 8,
	},
	preview_icons: {
		position: 'absolute',
		right: '3vw',
		marginTop: 9,
		display: 'flex',
		flexDirection: 'row',
		zIndex: 10001,
	},
	container: {
		width: 150,
		display: 'flex',
		paddingTop: 6,
		paddingBottom: 6,
		justifyContent: 'space-between',
	},
	label_container: {
		background: theme?.user_drive?.preview_style?.primary_color,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '10px 12px',
		borderRadius: 8,
		gap: 4,
		cursor: 'pointer',
	},
	hover_shadow_effect: {
		boxShadow: '0',
		borderRadius: '5px',
		backgroundColor: theme?.user_drive?.preview_style?.primary_color,
		margin: '0 0.2vw',
		padding: 1,
	},
	image: {
		width: '100%',
		height: '80vh',
		objectFit: 'contain',
		backgroundColor: theme?.user_drive?.preview_style?.secondary_color,
		padding: '2vh 0',
		borderRadius: 20,
	},
	details: {
		padding: 2,
		backgroundColor: theme?.user_drive?.preview_style?.primary_color,
		position: 'absolute',
		top: 50,
		right: 0,
		borderRadius: 10,
	},
	file_label: {
		display: 'flex',
		flexDirection: 'row',
		margin: '1vh 0',
		overflow: 'hidden',
	},
	file_data: {
		width: '7vw',
	},
	no_preview: {
		minHeight: '80vh',
		justifyContent: 'center',
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		backgroundColor: theme?.user_drive?.preview_style?.secondary_color,
	},
	video: {
		height: '80vh',
		backgroundColor: theme?.user_drive?.preview_style?.secondary_color,
		display: 'flex',
		alignItems: 'flex-end',
	},
	video_info: {
		width: '100%',
		height: '90%',
	},
}));

export default useStyles;
