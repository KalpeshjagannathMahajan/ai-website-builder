import { makeStyles } from '@mui/styles';
import { primary } from 'src/utils/light.theme';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

const useStyles = makeStyles((theme: any) => ({
	icon_container: {
		display: 'flex',
		alignItems: 'center',
		borderRadius: is_ultron ? '8px' : '0',
		flexDirection: 'row',
		justifyContent: 'center',
		height: '40px',
		cursor: 'pointer',
		background: 'transparent',
		border: `1px solid ${theme?.page_header_component?.tear_sheet}`,
		color: theme?.page_header_component?.tear_sheet,
	},
	textStyle: {
		[!is_ultron && theme?.breakpoints?.down(1050)]: {
			whiteSpace: 'normal !important',
		},
	},
	download_cta: {
		...theme?.order_management?.download_tearsheet,
	},
	orderConfirmationTextStyle: {
		[!is_ultron && theme?.breakpoints?.down('sm')]: {
			fontSize: '12px !important',
			lineHeight: '22px',
			...theme?.order_management?.order_end_status_text_color,
		},
	},

	mobile_cart_summary: {},
	container: {
		borderRadius: 12,
		[theme?.breakpoints?.down('sm')]: {
			overflow: 'scroll',
		},
	},
	textAlignmentContainer: {
		display: 'flex',
		justifyContent: 'flex-end',
		width: '100%',
	},
	buttonContainer: {
		display: 'flex',
		flexDirection: 'row',
		gap: '1rem',
	},
	span_terms_and_conditions: {
		color: theme?.order_management?.cart_checkout_card?.review_term_and_cond_color,
		cursor: 'pointer',
		textDecoration: 'underline',
		fontWeight: '700',
	},
	item_terms_and_conditions: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		color: theme?.order_management?.cart_checkout_card?.item_terms_and_conditions,
	},
	review_image: {
		maxHeight: '85px',
	},
	ultron_active_card_style: {
		...theme?.order_management?.ultron_active_card_style,
	},
	ultron_card_style: {
		...theme?.order_management?.ultron_card_style,
	},
	ultron_contact_active_card_style: {
		...theme?.order_management?.ultron_active_card_style,
		background: theme?.order_management?.change_contact_drawer?.box_bg_color,
	},
	ultron_contact_card_style: {
		...theme?.order_management?.ultron_card_style,
		background: theme?.order_management?.change_contact_drawer?.box_bg_color,
	},
	active_card_style: {
		width: '100%',
		cursor: 'pointer',
		borderRadius: 12,
		...theme?.order_management?.active_card_style,
	},
	card_style: {
		width: '100%',
		cursor: 'pointer',
		borderRadius: 12,
		...theme?.order_management?.card_style,
	},
	change_contact_drawer_style: {
		width: '100%',
		borderRadius: 12,
		border: theme?.order_management?.style?.change_contact_drawer_style_border,
		cursor: 'pointer',
	},
	user_details_section_label: {
		fontSize: 16,
		padding: 0,
		marginBottom: 2,
	},
	ultron_user_details_section_label: {
		fontSize: 14,
		padding: 0,
		marginBottom: 1,
	},
	section_notes_text_style: {
		fontSize: 14,
		fontWeight: 700,
		color: theme?.order_management?.style?.section_notes_text_style_color,
		fontFamily: theme?.order_management?.notes_section?.fontFamily,
	},
	user_details_section_icon_style: {
		color: theme?.order_management?.style?.user_details_section_icon_style_color,
		transform: 'scale(1.8)',
	},
	section_notes_value_text: {
		fontSize: 14,
		fontWeight: 400,
		color: theme?.order_management?.style?.section_notes_value_text_color,
		fontFamily: theme?.order_management?.notes_section?.fontFamily,
	},

	charge_text_style: {
		cursor: 'pointer',
		color: theme?.order_management?.style?.charge_text_style_color,
	},
	discount_color_valid: {
		color: theme?.order_management?.style?.discount_color_valid_color,
	},
	discount_color_invalid: {
		color: theme?.order_management?.style?.discount_color_invalid_color,
	},
	headerContainer: {
		display: 'flex',
		width: 'auto',
		gap: '1rem',
	},
	cartCheckoutContainer: {
		/* position: 'sticky', */
		zIndex: 1,
		top: '7.4rem',
		height: '42vh',
	},
	gridContainerStyle: {
		borderRadius: 8,
		backgroundColor: theme?.order_management?.style?.grid_container_style_background_color,
		padding: '1.5rem 3rem',
	},
	storeFront_gridContainerStyle: {
		// padding: '0rem 3rem',
		borderRadius: 8,
		backgroundColor: theme?.order_management?.style?.grid_container_style_background_color,
	},
	iconStyle: {
		cursor: 'pointer',
		color: theme?.order_management?.style?.icon_style_color,
		transition: '0.2s ease-in-out',
		'&:hover': {
			color: theme?.order_management?.style?.icon_style_hover_color,
			transform: 'scale(1.2)',
		},
	},
	charge_warning: {
		borderRadius: '8px',
		background: theme?.order_management?.style?.charge_warning_background,
		color: theme?.order_management?.style?.charge_warning_color,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		// marginLeft: '1rem',
		...theme?.card_,
	},
	card_warning: {
		borderRadius: '8px',
		background: theme?.order_management?.style?.charge_warning_background,
		color: theme?.order_management?.style?.charge_warning_color,
		justifyContent: 'flex-start',
		display: 'flex',
		flexFlow: 'row',
		...theme?.card_,
	},
	charge_warning_icon: {
		color: theme?.order_management?.style?.charge_warning_color,
		alignSelf: 'center',
	},
	iconContainer: {
		borderRadius: 8,
		border: theme?.order_management?.style?.icon_container_border,
		background: '#fff',
		display: 'flex',
		padding: '0.8rem',
		alignItems: 'center',
		width: 'max-content',
	},
	editContainer: {
		border: `1px solid ${theme?.retail_mode?.text}`,
		display: 'inline-block',
		background: theme?.insights?.dashboard?.background,
		padding: '0.8rem',
		verticalAlign: 'middle',
		// border-radius:" 8px",
	},
	placeCenter: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},

	/* Cart Summary  */
	box_container: {
		position: 'relative',
		width: '87px',
		height: '100%',
		borderRadius: '6px',
		padding: '2px 4px 4px 2px',
	},
	notes: {
		display: 'flex',
		flexDirection: 'row',
		gap: '4px',
		marginBottom: '.8rem',
	},
	note_text_label: {
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		color: theme?.order_management?.style?.note_text_label_color,
		fontWeight: 700,
		fontSize: '14px',
	},
	note_text_value: {
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		color: theme?.order_management?.style?.note_text_value_color,
		fontWeight: 400,
		fontSize: '14px',
	},
	discount_bar: {
		display: 'flex',
		padding: '6px 8px',
		marginBottom: '.8rem',
		justifyContent: 'space-between',
		alignItems: 'center',
		alignSelf: 'stretch',
		borderRadius: '8px',
		background: theme?.order_management?.style?.discount_bar_background,
	},
	discount_header: {
		display: 'flex',
		gap: '4px',
		alignItems: 'center',
		fontSize: '14px',
		fontWeight: 700,
		flexDirection: 'row',
		color: theme?.order_management?.style?.discount_header_color,
	},
	custom_label: {
		fontSize: '10px',
		fontStyle: 'normal',
		fontWeight: 700,
		color: theme?.order_management?.style?.custom_label_color,
	},
	text: {
		fontWeight: 700,
		fontSize: '14px',
		textWrap: 'nowrap',
		color: theme?.order_management?.style?.text_color,
	},
	price_text: {
		fontWeight: 700,
		fontSize: '12px',
		textWrap: 'nowrap',
		textDecoration: 'line-through',
		marginRight: '8px',
	},
	discount_img: {
		height: '24px',
		width: '24px',
		color: theme?.order_management?.style?.discount_img_color,
	},
	cartSummaryTitleContainer: {
		display: 'flex',
		alignItems: 'center',
		gap: '1.5rem',
		// padding: '0rem 0.8rem',
	},
	cartItemTextContainer: {
		display: 'flex',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		flexDirection: 'column',
		gap: '0.5rem',
		margin: '0rem 1.5rem',
		'& p': {
			color: theme?.order_management?.style?.cart_item_text_container_color,
			fontSize: 12,
		},
		cursor: 'pointer',
	},
	cartItemPrice: {
		backgroundColor: theme?.order_management?.style?.cart_item_price_background_color,
		padding: '0.8rem 6rem',
		borderRadius: 8,
		marginBottom: '0.5rem',
		textAlign: 'center',
	},
	order_info_style: {
		color: theme?.order_management?.style?.order_info_style_color,
		fontSize: '12px',
		fontStyle: 'normal',
		fontWeight: 400,
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	order_end_status_icon_style: {
		color: theme?.order_management?.style?.order_end_status_icon_style_color,
		transform: 'scale(1.8)',
	},
	viewDetailsCard: {
		borderRadius: 8,
		width: '100%',
		...theme?.card_,
		border: theme?.order_management?.style?.view_details_card_border,
	},
	cartItemDisablePrice: {
		textDecoration: 'line-through',
		opacity: 0.3,
		margin: '0.5rem',
	},

	cartCheckoutCard_isDraft: {
		background: theme?.order_management?.style?.cart_checkout_card_background,
		overflow: 'hidden',
		[theme?.breakpoints.up('md')]: {
			marginLeft: '1.6rem',
		},
		boxShadow: theme?.cart_summary?.summary_card?.box_shadow,
		...theme?.card_,
	},
	cartCheckoutCard: {
		borderRadius: 12,
		overflow: 'hidden',
		background: theme?.order_management?.order_end_status_info_container?.cart_checkout_card_background,
	},
	containerise_cart: {
		[theme?.breakpoints.up('md')]: {
			marginLeft: '1.6rem',
		},
	},
	cartCheckoutPriceContainer: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: '1px',
	},
	cartCheckoutTotalPrice: {
		paddingLeft: '1rem',
		paddingRight: '1rem',
		backgroundColor: theme?.order_management?.style?.cart_checkout_total_price_background_color,
	},

	orderMoreSectionContainer: {
		borderRadius: '8px',
		backgroundColor: theme?.order_management?.style?.order_more_section_container_background_color,
		padding: '1.5rem 3rem 2rem 3rem',
		[!is_ultron && theme?.breakpoints?.down('sm')]: {
			padding: '1.5rem 0rem 2rem 0rem',
		},
	},
	orderMoreSectionContainerV2: {
		borderRadius: '8px',
		backgroundColor: theme?.order_management?.style?.order_more_section_container_v2_background_color,
		padding: 0,
	},
	drawerHeaderContainer: {
		position: 'sticky',
		top: 0,
		zIndex: 2,
		display: 'flex',
		justifyContent: 'space-between',
		backgroundColor: theme?.order_management?.style?.drawer_header_container_background_color,
		padding: '1.2rem 1.5rem',
		borderBottom: theme?.order_management?.style?.drawer_header_container_border_bottom,
		...theme?.order_management?.payment_details_drawer_header,
	},
	drawerContentContainer: {
		minHeight: 'calc(100vh - 12rem)',
		padding: '0rem 1.5rem',
		backgroundColor: theme?.order_management?.style?.drawer_content_container_background_color,
		...theme?.order_management?.payment_details_drawer,
	},
	drawerFooterContainer: {
		position: 'sticky',
		bottom: 0,
		zIndex: 1,
		borderTop: theme?.order_management?.style?.drawer_footer_container_border_top,
		backgroundColor: theme?.order_management?.style?.drawer_footer_container_background_color,
		padding: '1.6rem 2.4rem',
	},
	buttonAlignmentContainer: {
		display: 'flex',
		width: '100%',
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
	},
	hideOverFlowingText: {
		color: theme?.order_management?.style?.hide_over_flowing_text_color,
		maxWidth: '100%',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
	},
	endStatusContainer: {
		padding: '0rem 6rem',
		[theme?.breakpoints?.down('sm')]: {
			padding: !is_ultron ? '0px' : '0rem 6rem',
		},
		height: is_ultron ? '28rem' : '100%',
	},
	endStatusHeroSection: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		marginBottom: '2rem',
	},
	endStatusInfoContainer: {
		backgroundColor: theme?.order_management?.style?.end_status_info_container_background_color,
		padding: '2rem',
		borderRadius: 16,
		height: 'fit-content',
		marginBottom: is_ultron ? '0' : '20px',
		...theme?.card_,
	},
	buyerInfoContainer: {
		backgroundColor: theme?.order_management?.style?.buyer_info_container_background_color,
		margin: '2rem 0rem',
		padding: '1rem',
		[theme.breakpoints.down('sm')]: {
			gap: '3rem',
		},
	},

	submit_banner_icon: {
		height: 20,
		width: 20,
		marginRight: 8,
		marginTop: 3,
		color: theme?.order_management?.style?.submit_banner_icon_color,
	},
	cancel_banner_icon: {
		height: 20,
		marginTop: 3,
		width: 20,
		marginRight: 8,
		color: theme?.order_management?.style?.cancel_banner_icon_color,
	},
	check_icon: {
		height: 20,
		width: 20,
		marginRight: 8,
		color: theme?.order_management?.style?.check_icon,
	},
	step_separator: {
		width: 1,
		minHeight: 34,
		background: theme?.order_management?.style?.step_separator_background,
	},
	custom_tag_on_image: {
		width: '100%',
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		zIndex: 1,
		background: theme?.order_management?.style?.custom_tag_on_image_background,
		backdropFilter: 'blur(1px)',
		textAlign: 'center',
		padding: '3px 0px',
	},

	notes_grid: {
		margin: 0,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		width: '100%',
		borderRadius: '0px 0px 12px 12px',
		background: theme?.palette?.background?.paper,
		padding: '0.5rem 1.5rem',
		cursor: 'pointer',
	},
	image_box: {
		position: 'relative',
		minWidth: '63px',
		width: 87,
		height: '100%',
		borderRadius: 8,
		padding: '2px 4px 2px 2px',
	},
	image_label: {
		fontSize: 10,
		fontStyle: 'normal',
		fontWeight: 700,
	},
	order_end_status_container_text_style: {
		fontSize: '14px',
		marginLeft: '3rem',
		fontWeight: 400,
		color: theme?.order_management?.style?.order_end_status_container_text_style_color,
	},
	text_style: {
		fontSize: 14,
		marginLeft: '3rem',
		fontWeight: 400,
		color: theme?.order_management?.style?.text_style_color,
	},
	parent_container: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
	},
	status_container: {
		padding: '0.5rem 1rem',
		borderRadius: 8,
		justifyContent: 'center',
	},
	container_cart: {
		display: 'flex',
		flexDirection: 'column',
		gap: '1rem',
		border: theme?.order_management?.style?.container_cart_border,
		padding: '1rem',
		background: theme?.order_management?.style?.container_cart_background,
		borderRadius: 12,
		width: 370,
		height: 'fit-content',
	},
	container_info: {
		display: 'flex',
		flexDirection: 'row',
		gap: '1rem',
		alignItems: 'center',
		background: theme?.order_management?.style?.container_info_background,
		padding: '1rem',
		borderRadius: 8,
	},
	icon_delivery: {
		color: theme?.order_management?.style?.icon_delivery_color,
	},
	text_primary: {
		color: theme?.order_management?.style?.text_primary_color,
		fontWeight: 500,
	},
	text_secondary: {
		color: theme?.order_management?.style?.text_secondary_color,
	},
	total_cbm_info: {
		background: theme?.order_management?.style?.total_cbm_info_background,
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '1rem',
		borderRadius: 4,
	},

	cartTableHeaderContainer: {
		background: is_ultron
			? theme?.order_management?.style?.cart_table_header_container_background_color
			: theme?.order_management?.order_end_status_container?.background ||
			  theme?.order_management?.fallback_order_end_status_container?.background,
		borderRadius: 8,
		height: '4rem',
		padding: '0rem 1rem',
		alignItems: 'center',
	},

	cartShippedProductHeader: {
		backgroundColor: theme?.order_management?.style?.cart_shipped_product_header_background_color,
		borderRadius: 8,
		height: '4rem',
		padding: '0rem 11rem 0rem 1rem',
		alignItems: 'center',
	},

	cartTableHeaderContainerV2: {
		background: is_ultron
			? theme?.order_management?.style?.cart_table_header_container_v2_background_color
			: theme?.order_management?.order_end_status_container?.background ||
			  theme?.order_management?.fallback_order_end_status_container?.background,
		borderRadius: 8,
		height: '4rem',
		padding: '0rem 1rem',
		alignItems: 'center',
	},

	cartItemContainer: {
		borderRadius: 12,
		border: theme?.order_management?.style?.cart_item_container_border,
		height: 'fit-content',
		padding: '12px 10px',
	},

	cartShippedContainer: {
		borderRadius: 12,
		border: theme?.order_management?.style?.cart_shipped_container_border,
		height: 'fit-content',
		padding: '12px 10px',
	},

	cartItemContainerV2: {
		borderRadius: 12,
		border: theme?.order_management?.style?.cart_item_container_v2_border,
		height: 'fit-content',
		padding: '12px 10px',
	},
	showing_result: {
		margin: '1rem 0rem',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	download_icon: {
		background: theme?.order_management?.download_icon?.background,
		padding: '0.8rem',
		borderRadius: '50%',
		cursor: 'pointer',
	},
	tracking_message: {
		backgroundColor: theme?.order_management?.tracking_message?.background,
		padding: '10px',
		borderRadius: '8px',
		margin: '0px 10px',
	},
	consolidated_container: {
		backgroundColor: theme?.order_management?.consolidated_container?.background,
		borderRadius: ' 12px',
		overflow: 'hidden',
		margin: '2rem 0rem',
		padding: '1rem',
	},
	grid_container: {
		position: 'absolute',
		background: theme?.order_management?.style?.grid_container_background,
		borderRadius: 8,
		zIndex: 100,
		top: '56px',
		padding: '1rem',
		flexDirection: 'row',
		gap: '1.2rem',
		alignItems: 'center',
		boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
		'&:hover': {
			backgroundColor: theme?.order_management?.style?.grid_container_background_color,
		},
	},
	empty_address: {
		height: '189px',
		background: theme?.order_management?.empty_address?.background,
		borderRadius: theme?.card_?.borderRadius || '8px',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		gap: '10px',
	},
	thankyou: {
		display: 'flex',
		gap: '48px',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	chip_hover_effect: {
		backgroundColor: theme?.order_management?.style?.chip_hover_effect_background_color,
		border: `1px solid ${theme.palette.common.white}`,
	},
	error_header_container: {
		display: 'flex',
		width: 'auto',
		gap: '1rem',
		opacity: '0.6',
	},
	icon: {
		color: theme?.order_management?.style?.icon_color,
		width: 25,
		height: 25,
	},
	clear_button: {
		alignSelf: 'flex-start',
		marginRight: 'auto',
	},
	chip_style: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '1.5rem 0.5rem',
		cursor: 'pointer',
	},
	default: {
		padding: '6px 12px',
		borderRadius: '0 0 8px 8px',
		width: '100%',
		textAlign: 'right',
	},
	tab_style: {
		color: theme?.order_management?.style?.tab_color,
	},
	product_card: {
		padding: '1rem 1rem',
		margin: '1rem 0',
		background: primary?.contrastText,
	},
	hinge_attr_value: {
		display: 'inline-flex',
		cursor: 'pointer',
		backgroundColor: `${theme?.order_management?.hinge_attribute?.backgroud}`,
		padding: '0.5rem 0.6rem',
		marginRight: '0.5rem',
		borderRadius: '0.4rem',
		overflow: 'auto',
	},
	fixedActionButtons: {},
	orderbuttonContainer: {},

	'@media (min-width: 900px)': {
		cartTableHeaderContainerV2: {
			display: 'none !important',
		},

		consolidated_container: {
			marginTop: '0rem',
			marginLeft: '1.6rem',
		},

		cartItemContainerV2: {
			display: 'none !important',
		},
	},
	'@media (max-width: 900px)': {
		cartTableHeaderContainer: {
			display: 'none !important',
		},
		cartItemContainer: {
			display: 'none !important',
		},
		cartTableHeaderContainerV2: {
			display: 'flex',
		},
		cartItemContainerV2: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'flex-start',
		},
		fixedActionButtons: {
			bottom: 0,
			left: 0,
			right: 0,
			border: 'none',
			borderTop: '1px solid #D1D6DD',
			zIndex: 1000,
			background: '#FFFFFF',
			padding: '12px 16px',
		},
		endStatusInfoContainer: {
			marginBottom: '90px !important',
		},

		orderbuttonContainer: {
			display: 'flex',
			gap: '20px',
			alignItems: 'center',
			justifyContent: 'center',
			flexDirection: 'row',
			width: '100%',
		},
		charge_warning: {
			marginLeft: '0px',
		},
	},
	'@media (max-width: 600px)': {
		buyerInfoContainer: {
			gap: '3rem',
		},
		user_details_section_label: {
			marginBottom: 14,
		},
		mobile_cart_summary: {
			padding: '0',
		},
		orderbuttonContainer: {
			flexDirection: 'column',
		},
	},

	truncateText: {
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		cursor: 'pointer',
	},
}));

export default useStyles;
