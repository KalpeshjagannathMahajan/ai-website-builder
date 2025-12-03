import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import { colors } from 'src/utils/theme';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

const useStyles = makeStyles(() => {
	const theme: any = useTheme();
	return {
		page_container: {
			display: 'flex',
			gap: '0px',
			flexDirection: 'column',
		},
		error_message: {
			display: 'flex',
			flexDirection: 'row',
			gap: '8px',
			width: '100%',
			alignItems: 'center',
		},
		body_container: {
			display: 'flex',
			gap: '20px',
			width: '100%',
			margin: '8px 0px',
		},
		'@media (max-width: 900px)': {
			body_container: {
				flexDirection: 'column',
			},
		},
		left_container: {
			padding: is_ultron ? '20px' : '0px',
			width: '100%',
			borderRadius: '12px',
			background: theme?.cart_summary?.container_cart?.primary,
			display: 'flex',
			flexDirection: 'column',
			gap: '1rem',
		},
		page_header_right_section: {
			display: 'flex',
			gap: '10px',
		},
		modal_footer: {
			display: 'flex',
			gap: '10px',
			justifyContent: 'flex-end',
		},
		cart_summary: {
			width: '100%',
			position: 'sticky',
			top: '74px',
		},
		right_container: {
			display: 'flex',
			flexDirection: 'column',
			gap: '2rem',
		},
		container_cart: {
			display: 'flex',
			flexDirection: 'column',
			gap: '1rem',
			padding: '1rem 1.5rem',
			background: theme?.cart_summary?.container_cart?.primary,
			borderRadius: '12px',
			height: 'fit-content',
		},
		container_info: {
			display: 'flex',
			flexDirection: 'row',
			gap: '1rem',
			alignItems: 'center',
			background: theme?.cart_summary?.container_cart?.container_info,
			padding: '1rem',
			borderRadius: '8px',
		},
		icon_delivery: {
			color: theme?.cart_summary?.container_cart?.icon_color,
		},
		total_cbm_info: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},
		divider_style: {
			margin: '1rem 0rem 0.5rem',
			background: 'repeating-linear-gradient(90deg,#D1D6DD 0 4px,#0000 0 8px)',
		},
		text_secondary: {
			color: theme?.cart_summary?.container_cart?.icon_color,
		},
		text_primary: {
			color: theme?.cart_summary?.container_cart?.icon_color,
			fontWeight: 500,
		},
		disclaimer_container: {
			backgroundColor: colors.light_yellow,
			borderRadius: '12px',
			padding: '1rem',
			justifyContent: is_ultron ? 'left' : 'center',
		},
		note_container: {
			padding: '2rem 2.4rem',
			'@media (max-width: 600px)': {
				padding: '1rem 1.4rem',
			},
		},
	};
});

export default useStyles;
