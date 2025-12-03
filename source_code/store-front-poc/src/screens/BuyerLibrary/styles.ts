import { makeStyles } from '@mui/styles';
import { info } from 'src/utils/common.theme';

const useStyles = makeStyles((theme: any) => ({
	view_details_card_container: {
		display: 'grid',
		gridTemplateColumns: 'repeat(3, 1fr)',
		gap: '1.6rem',
		[theme.breakpoints.down(1200)]: {
			gridTemplateColumns: 'repeat(3, 3fr)',
		},
		[theme.breakpoints.down(1100)]: {
			gridTemplateColumns: 'repeat(2, 3fr)',
		},
		[theme.breakpoints.down(600)]: {
			gridTemplateColumns: 'repeat(1, 3fr)',
		},
	},
	storefront_drawer_view_details_card_container: {
		display: 'grid',
		gap: '1.6rem',
		marginTop: '1.6rem',
		gridTemplateColumns: 'repeat(3, 1fr)',
		[theme.breakpoints.down(1200)]: {
			gridTemplateColumns: 'repeat(3, 3fr)',
		},
		[theme.breakpoints.down(1100)]: {
			gridTemplateColumns: 'repeat(2, 3fr)',
		},
		[theme.breakpoints.down(600)]: {
			gridTemplateColumns: 'repeat(1, 3fr)',
		},
	},
	view_details_card: {
		...theme?.chip_,
		width: '100%',
		border: theme?.view_buyer?.other_details?.card?.border,
	},
	add_details_card_container: {
		display: 'grid',
		gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
		gap: '2.5rem',
	},
	storefront_add_details_card_container: {
		display: 'grid',
		// gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
		gap: '2.5rem',
	},

	uploaded_item: {
		borderRadius: theme?.view_buyer?.other_details?.upload?.borderRadius,
		border: theme?.view_buyer?.other_details?.upload?.border,
		minHeight: '5.5rem',
		padding: '0px 16px',
		cursor: 'pointer',
	},
	buyer_user_details_container: {
		borderRadius: '12px',
		backgroundColor: theme?.view_buyer?.basic_details?.background,
		alignSelf: 'start',
		[theme.breakpoints.up(900)]: {
			position: 'sticky',
			top: '6.9rem',
		},
	},
	buyer_details_container: {
		background: theme?.view_buyer?.other_details?.background,
		[theme.breakpoints.down(900)]: {
			marginTop: '2rem !important',
		},
	},
	divider_line_style: {
		marginBottom: '0px',
	},
	edit_icon_style: {
		color: theme?.view_buyer?.other_details?.card?.icon,
		cursor: 'pointer',
		'&:hover': {
			transform: 'scale(1.2)',
			color: theme?.view_buyer?.other_details?.card?.icon_hover,
			transition: '0.2s ease-in',
		},
	},
	card_text: {
		color: theme?.view_buyer?.other_details?.card?.text,
		wordWrap: 'break-word',
	},
	link: {
		display: 'inline-block',
		color: theme?.view_buyer?.other_details?.link,
		textDecoration: 'none',
		'&:hover': {
			textDecoration: 'underline',
		},
	},
	chips_style: {
		cursor: 'pointer',
		fontSize: 12,
		border: theme?.view_buyer?.basic_details?.chip?.border,
		marginLeft: 'auto',
	},
	value_chips: {
		cursor: 'pointer',
		fontSize: 12,
		border: theme?.view_buyer?.basic_details?.chip?.border,
		minWidth: '25%',
		maxWidth: '35%',
	},
	count_chip: {
		cursor: 'pointer',
		fontSize: 12,
		border: theme?.view_buyer?.basic_details?.chip?.border,
		minWidth: '5rem',
		maxWidth: '5rem',
		marginLeft: 'auto',
	},
	empty_card_style: {
		borderRadius: '8px',
		width: '100%',
		border: theme?.view_buyer?.other_details?.card?.border,
		display: 'flex',
		flexDirection: 'column',
		gap: 2,
		justifyContent: 'center',
		alignItems: 'center',
		minHeight: '15rem',
		height: 'auto',
	},
	credit_chip: {
		borderRadius: '31px',
		border: theme?.view_buyer?.header?.credits?.border,
		fontSize: '14px',
		fontWeight: 700,
		lineHeight: '18px',
	},
	icon_style: {
		color: theme?.quick_add_buyer?.icon,
		transform: 'scale(1.8)',
		margin: '1rem',
	},
	footer: {
		position: 'fixed',
		zIndex: 999,
		bottom: 0,
		width: '600px',
		right: 0,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		padding: '0 16px',
		backgroundColor: theme?.quick_add_buyer?.background,
		boxShadow: theme?.quick_add_buyer?.box_shadow,
		flexDirection: 'column',
		borderTopLeftRadius: '20px',
		borderTopRightRadius: '20px',
	},
	footer_existing_customer_text: {
		display: 'flex',
		flexDirection: 'column',
	},
	footer_existing_customer: {
		width: '100%',
		background: info[50],
		display: 'flex',
		padding: '16px 20px',
		borderTopLeftRadius: '20px',
		borderTopRightRadius: '20px',
	},
	footer_btn: {
		display: 'flex',
		gap: '16px',
		marginLeft: 'auto',
		marginTop: '2rem',
		marginBottom: '2rem',
	},
	header: {
		position: 'fixed',
		zIndex: 999,
		top: 0,
		width: '60rem',
		right: 0,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		padding: '0 16px',
		backgroundColor: theme?.quick_add_buyer?.background,
		borderBottom: theme?.quick_add_buyer?.border,
		boxShadow: theme?.quick_add_buyer?.box_shadow,
	},
	header_title: {
		display: 'flex',
		gap: '16px',
		marginTop: '2rem',
		marginBottom: '2rem',
		width: '100%',
	},
	title: { fontSize: '20px', fontWeight: 700 },
	cursor: {
		cursor: 'pointer',
	},
	tax_section_title: {
		fontSize: '1.8rem',
		padding: '1rem 0 0 1.8rem',
	},
	add_details_card: {
		borderRadius: '8px',
		background: theme?.quick_add_buyer?.card_background,
		cursor: 'pointer',
		justifyContent: 'center',
		minHeight: '15rem',
		height: 'auto',
		alignItems: 'center',
	},
	upload_delete_icon: {
		cursor: 'pointer',
		transform: 'scale(1.5)',
		color: theme?.quick_add_buyer?.buyer_other_details?.secondary,
	},
	text: {
		marginTop: '12px',
		paddingTop: '10px',
		paddingLeft: '16px',
	},
	address_card_text: {
		color: theme?.quick_add_buyer?.secondary,
		wordWrap: 'break-word',
	},
	address_card_text_heading: {
		color: theme?.quick_add_buyer?.tertiary,
		wordWrap: 'break-word',
	},
	upload_file_icon: {
		cursor: 'pointer',
		transform: 'scale(2)',
	},
	buyer_copy_form_drawer_container: {
		height: '100vh',
		overflow: 'hidden',
		paddingTop: 0,
		background: theme?.quick_add_buyer?.background,
	},
	buyer_copy_form_drawer_content: {
		height: '100%',
		overflow: 'scroll',
		backgroundColor: theme?.quick_add_buyer?.background,
		'&::-webkit-scrollbar': {
			display: 'none',
		},
	},
	contact_drawer_container: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: '1rem',
		gap: '1rem',
	},
	checkbox_container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: '0.4rem',
	},
	store_front_preferences: {
		display: 'flex',
		gap: '10px',
		flexDirection: 'column',
	},
	iconContainer: {
		borderRadius: '8px',
		border: '1px solid rgba(0, 0, 0, 0.12)',
		background: '#fff',
		display: 'flex',
		padding: '0.8rem',
		alignItems: 'center',
	},

	iconStyle: {
		cursor: 'pointer',
		color: '#4f555e',
		transition: '0.2s ease-in-out',
		'&:hover': {
			color: 'rgb(0, 0, 0)',
			transform: 'scale(1.2)',
			transition: '0.2s ease-in-out',
		},
	},
	customer_tab: {
		color: theme?.quick_add_buyer?.customer_tab_color,
	},
	cancel_btn: {
		color: '#4F555E',
		border: '1px solid #B5BBC3',
		'&:hover': {
			border: '1px solid #B5BBC3',
		},
	},
	new_customer: {
		backgroundColor: '#F0AF30',
		display: 'flex',
		alignItems: 'center',
		padding: '2px 8px 2px 8px',
		borderRadius: '20px',
		fontSize: '14px',
		fontWeight: '700',
		color: `${theme?.quick_add_buyer?.background} !important`,
	},
	basic_details: {
		padding: '20px 0 0 16px',
	},
	basic_details_wizshop: {
		padding: '5px 0 0 16px',
	},
	modal_container: {
		display: 'flex',
		justifyContent: 'center',
		gap: '8px',
		flexDirection: 'row',
		alignItems: 'center',
	},
	modal_custom_text: {
		whiteSpace: 'nowrap',
		overflow: 'scroll',
		border: '1px solid black',
		padding: '8px',
		width: '70%',
		borderRadius: '4px',
	},
	button: {
		display: 'flex',
		gap: '4px',
		alignItems: 'center',
		flex: 1,
	},
	clear_filter_button: {
		fontSize: 14,
		fontWeight: '600',
		textTransform: 'inherit',
		marginBottom: 1,
	},
	sub_header_container: {
		display: 'flex',
		alignItems: 'center',
		gap: 1,
		marginBottom: 1,
	},
	default: {
		padding: '6px 12px',
		width: '100%',
		textAlign: 'right',
	},
	edit_icon: {
		position: 'absolute',
		top: '12px',
		right: '12px',
	},
}));

export default useStyles;
