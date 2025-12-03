import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: any) => ({
	retail_mode: {
		display: 'flex',
		flexDirection: 'column',
		padding: '4px 8px 8px 16px',
		background: theme?.retail_mode?.background,
	},
	view_user_info: {
		display: 'flex',
		flexDirection: 'row',
		gap: '40px',
		alignItems: 'center',
		justifyContent: 'start',
		margin: '10px 0px',
		padding: '16px 0px',
		'@media (max-width: 800px)': {
			flexDirection: 'column',
			alignItems: 'start',
			gap: '10px',
		},
	},
	user_text: {
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',

		'@media (max-width: 800px)': {
			maxWidth: '25rem',
		},
	},
	user_info: {
		display: 'flex',
		flexDirection: 'row',
		gap: '10px',
		alignItems: 'center',
	},
	user_icon: {
		background: theme?.view_user_info?.user_icon?.background,
		padding: '8px',
		borderRadius: '50%',
	},
	create_password: {
		display: 'flex',
		gap: '8px',
		cursor: 'pointer',
		backgroundColor: `${theme?.create_password_style?.backgroundColor}`,
		height: '40px',
		width: '182px',
		alignItems: 'center',
		padding: '9px 20px 9px 16px',
		color: `${theme?.create_password_style?.color}`,
	},
	create_password_text: {
		display: 'flex',
		fontSize: '14px',
		fontWeight: 700,
		alignItems: 'center',
		justifyContent: 'center',
		gap: '8px',
	},
	create_password_icon: {
		width: '22px',
		height: '22px',
	},
	change_password_modal: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		borderRadius: `${theme?.authflow?.login?.border_radius}`,
	},
	change_password_modal_footer: {
		justifyContent: 'end',
		gap: '12px',
	},
	full_width_style: {
		width: '100%',
	},
}));

export default useStyles;
