import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
	main_cont: {
		height: '80vh',
		display: 'flex',
		justifyContent: 'center',
		borderRadius: 10,
		overflow: 'hidden',
	},
	lft_cont: {
		backgroundColor: theme?.user_drive?.pdf_viewer?.style?.lft_cont_background_color,
		display: 'flex',
		width: '12vw',
		height: '80vh',
		alignItems: 'center',
		flexDirection: 'column',
		overflowY: 'scroll',
	},
	thumbnail_cont: {
		width: 'fit-content',
		margin: '1vh 0',
		position: 'relative',
		borderRadius: 10,
		overflow: 'hidden',
	},
	right_cont: {
		backgroundColor: theme?.user_drive?.pdf_viewer?.style?.right_cont_background_color,
		display: 'flex',
		width: '89vw',
		height: '80vh',
		alignItems: 'center',
		flexDirection: 'column',
		overflowY: 'scroll',
		paddingTop: 20,
	},
	page_number: {
		position: 'absolute',
		bottom: '0.5vh',
		left: '0.5vw',
		backgroundColor: theme?.user_drive?.pdf_viewer?.style?.page_number_background_color,
		borderRadius: '50%',
		height: '1.5vw',
		width: '1.5vw',
		justifyContent: 'center',
		alignItems: 'center',
		display: 'flex',
		color: theme?.user_drive?.pdf_viewer?.style?.page_number_color,
	},
	cursor_style: {
		cursor: 'default',
	},
}));

export default useStyles;
