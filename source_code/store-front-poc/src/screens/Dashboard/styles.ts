import { makeStyles } from '@mui/styles';
import { info } from 'src/utils/common.theme';

const useStyles = makeStyles((theme: any) => ({
	page_container: {
		display: 'flex',
		gap: '0px',
		flexDirection: 'column',
		padding: '0 8px',
	},
	skeleton_container_style: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	page_header_left_section: {
		display: 'flex',
		gap: '10px',
	},
	truncate: {
		maxWidth: '16ch',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	page_header_right_section: {
		display: 'flex',
		gap: '10px',
	},
	body_container: {
		display: 'flex',
		flexDirection: 'column',
		paddingTop: '22px',
		gap: '10px',
	},
	section: {
		display: 'flex',
		flexDirection: 'column',
	},
	analytics_list: {
		display: 'flex',
		justifyContent: 'space-between',
		gap: '16px',
	},
	analytics_header: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: '10px',
	},
	storefront_leads_header: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginTop: '16px',
	},
	title: {
		fontSize: '16px',
		fontWeight: '700',
	},
	reject_modal_content: {
		display: 'flex',
		flexDirection: 'column',
		gap: '22px',
		fontSize: '16px',
		fontWeight: '400',
	},
	reject_modal_content_bottom: {
		display: 'flex',
		flexDirection: 'row',
		gap: '10px',
		padding: '4px 12px 4px 12px',
		backgroundColor: '#F0F6FF',
	},
	reject_modal_footer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		// padding: '16px 24px 16px 24px',
		gap: '12px',
	},
	reject_modal_btn1: {
		backgroundColor: 'white',
		color: '#4F555E',
		fontSize: '14px',
		fontWeight: '700',
		border: '1px solid #676D77',
		'&:hover': {
			// border: '1px solid #D74C10',
			backgroundColor: 'white',
		},
	},
	reject_modal_btn2: {
		backgroundColor: '#D74C10',
		color: '#FFFFFF',
		fontSize: '14px',
		fontWeight: '700',
		'&:hover': {
			// border: '1px solid #D74C10',
			backgroundColor: '#D74C10',
		},
	},

	view_all: {
		cursor: 'pointer',
		fontSize: '16px',
		fontWeight: '700',
		color: 'rgba(22, 136, 95, 1)',
	},

	header_title: {
		width: '380px',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		fontSize: '18px',
		fontWeight: '700',
		gap: '12px',
	},
	drawer_container: {
		backgroundColor: 'white',
		height: '100vh',
		display: 'flex',
		flexDirection: 'column',
	},
	approved_drawer_divider: {
		// width: 'calc(100% + 40px)',
		marginLeft: '-20px',
	},
	drawer_divider: {
		width: '440px',
	},
	header_tile: {
		width: '440px',
		display: 'flex',
		padding: '3px 10px 3px 10px',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: '14px',
		fontWeight: '400',
		color: '#4F555E',
	},

	view: {
		display: 'flex',
		color: '#16885F',
		gap: '5px',
		cursor: 'pointer',
	},
	newCustomer: {
		backgroundColor: '#F0AF30',
		display: 'flex',
		alignItems: 'center',
		padding: '2px 8px 2px 8px',
		borderRadius: '20px',
		fontSize: '14px',
		fontWeight: '700',
		color: 'white',
	},
	existingCustomer: {
		backgroundColor: 'rgba(107, 166, 254, 1)',
		padding: '2px 8px 2px 8px',
		borderRadius: '20px',
		display: 'flex',
		alignItems: 'center',
		fontSize: '14px',
		fontWeight: '700',
		color: 'white',
	},
	text: {
		fontSize: '12px',
		fontWeight: '400',
		lineHeight: '18px',
		color: '#676D77',
	},
	rejected: {
		color: '#D74C10',
		border: '1px solid #D74C10',
		'&:hover': {
			border: '1px solid #D74C10',
		},
	},
	user_text: {
		fontSize: '16px',
		fontWeight: '700',
		lineHeight: '24px',
		color: '#525252',
	},
	text_up_down: {
		display: 'flex',
		flexDirection: 'column',
		gap: '4px',
	},
	name_container: {
		display: 'flex',
		flexDirection: 'row',
		gap: '32px',
	},
	full_name_hr: {
		marginBlock: '4px',
		borderRight: '2px solid rgba(0, 0, 0, 0.12)',
	},
	footer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-end',
		width: '100%',
	},
	footer_existing_customer: {
		background: info[50],
		display: 'flex',
		padding: '16px 20px',
		borderTopLeftRadius: '20px',
		borderTopRightRadius: '20px',
		alignItems: 'center',
	},
	footer_cta: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-end',
		gap: '12px',
		padding: '16px 20px',
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
	reorder_card_container: {
		display: 'flex',
		alignItems: 'center',
		borderBottom: theme?.product?.reorder_card?.border,
		padding: '0px 16px',
	},
	footer_container: {
		display: 'flex',
		justifyContent: 'space-between',
		width: '100%',
		padding: '12px 16px',
		alignItems: 'center',
		borderTop: theme?.product?.reorder_card?.border,
	},
}));

export default useStyles;
