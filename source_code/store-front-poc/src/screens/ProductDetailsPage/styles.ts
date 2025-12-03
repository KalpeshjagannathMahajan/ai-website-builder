import { makeStyles } from '@mui/styles';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

const useStyles = makeStyles((theme: any) => ({
	container: {
		// marginTop: '0.5rem',
		position: 'sticky',
		borderRadius: '16px',
		padding: is_ultron ? '1.2rem' : '.8rem 0rem',
		background: theme?.product_details?.container?.background,
	},
	download_cta: {
		...theme?.order_management?.download_tearsheet,
	},
	chevron_left: {
		...theme?.product_details?.product_info_container?.rail_styles?.chevron_left,
		...theme?.product_details?.similar_product_container,
	},
	chevron_right: {
		...theme?.product_details?.product_info_container?.rail_styles?.chevron_right,
		...theme?.product_details?.similar_product_container,
	},
	breadcrumbs_style: {
		...theme?.product_details?.breadcrumbs_style,
	},
	header_container_value_catalog_mode: {
		justifyContent: 'flex-end',
	},
	section_title: {
		...theme?.product_details?.product_info_container?.section_title,
	},
	custom_btn: {
		textWrap: 'nowrap',
		alignItems: 'baseline',
		...theme?.product_details?.product_info_container?.custom_color,
	},
	header_container: {
		display: 'flex',
		flexGrow: '1',
		justifyContent: 'space-between',
		...theme?.product_details?.product_info_container?.header_container,
	},
	variant_hinge_container: {
		...theme?.product_details?.product_info_container?.variant_hinge_container,
	},
	header_container_value: {
		display: 'flex',
		flexGrow: '1',
		minWidth: '37%',
		justifyContent: 'space-between',
		maxWidth: '100%',
		cursor: 'pointer',
		padding: '10px 12px',
		...theme?.product_details?.product_info_container?.header_container_value,
		...theme?.card_,
	},
	header_container_variant: {
		display: 'flex',
		justifyContent: 'space-between',
	},
	name_container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
		marginBottom: '4px',
		alignItems: 'flex-start',
		...theme?.product_details?.product_info_container?.name_container,
	},

	details_container: {
		padding: '0px',

		[theme?.breakpoints?.up('md')]: {
			padding: '0rem 1rem 0rem 2rem',
			'&::-webkit-scrollbar': {
				display: 'none',
			},

			[theme?.breakpoints?.down('sm')]: {
				paddingTop: '1rem',
			},
		},
	},

	image_container: {
		...theme?.product_details?.product_image_container?.card,
		[theme?.breakpoints?.up('md')]: {
			zIndex: 1,
			position: 'relative',
		},
	},

	primary_color: {
		...theme?.product_details.product_info_container.primary_color,
	},

	sku_id: {
		...theme?.product_details?.product_info_container?.sku_id,
	},

	medium_grey: {
		...theme?.product_details?.product_info_container?.medium_grey,
	},

	terinary_color: {
		color: '#8C8C8C',
	},

	dark_grey: {
		color: '#1F1F1F',
	},

	light_color: {
		color: 'rgba(0, 0, 0, 0.60)',
	},

	secondary_color: {
		...theme?.product_details?.product_info_container?.secondary_color,
	},

	composite_label: {
		...theme?.product_details?.product_info_container?.composite_label,
	},

	active_price_style: {
		...theme?.product_details?.product_info_container?.active_price_style,
	},

	icon_style: {
		...theme?.product_details?.icon_style,
	},

	icon_container: {
		borderRadius: '8px',
		display: 'flex',
		padding: '0.8rem',
		alignItems: 'center',
		...theme?.product_details?.product_info_container?.icon_container,
	},

	/* price section */
	price_scale_item: {
		width: '12rem',
		alignItems: 'center',
		display: 'flex',
		flexDirection: 'column',
		gap: '0.5rem',
		padding: '1rem 0rem',
	},

	item_price: {
		...theme?.product_details?.product_info_container?.item_price,
		fontWeight: '700',
	},

	/* variant */
	variant_container: {
		display: 'flex',
		alignItems: 'flex-start',
		columnGap: '1rem',
		rowGap: '0rem',
		marginBottom: '1rem',
		maxWidth: '60rem',
		flexWrap: 'wrap',
	},

	variant_color_item: {
		width: '10rem',
		height: 'auto',
		cursor: 'pointer',
		textAlign: 'center',
		padding: '0.6rem',
		...theme?.product_details?.product_info_container?.variant_color_item,
	},

	variant_color_item_text: {
		...theme?.product_details?.product_info_container?.variant_color_item_text,
	},

	inventory_container: {
		...theme?.product_details?.product_info_container?.inventory_container,
	},

	stock_container: {
		padding: '1rem 1.2rem',
		borderRadius: '8px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		...theme?.product_details?.product_info_container?.stock_container,
	},

	inventory_menu: {
		display: 'flex',
		width: '25rem',
		justifyContent: 'space-between',
	},

	custom_inventory_menu: {
		width: '100%',
		borderRadius: '4px',
		padding: '0.4rem 1rem',
	},

	/* Drawer */
	drawer_header_container: {
		position: 'sticky',
		top: '0',
		zIndex: '2',
		display: 'flex',
		justifyContent: 'space-between',
		padding: '1.2rem 1.5rem',
		...theme?.product_details?.product_info_container?.drawer_header_container,
	},

	drawer_variant_container: {
		display: 'grid',
		gridTemplateColumns: 'repeat(2, 2fr)',
		gap: '1.2rem',
	},

	drawer_variant_container_item: {
		display: 'flex',
		alignItems: 'center',
		borderRadius: '8px',
		cursor: 'pointer',
		gap: '1.2rem',
		height: '8rem',
		padding: '1.2rem',
		...theme?.product_details?.product_info_container?.drawer_variant_container_item,
	},

	drawer_content_container: {
		minHeight: '100vh',
		padding: '1rem 1.5rem',
		background: theme?.product_details?.container?.background,
	},

	drawer_footer_container: {
		position: 'sticky',
		bottom: '0',
		zIndex: '1',
		padding: '1.6rem 2.4rem',
		...theme?.product_details?.product_info_container?.drawer_header_container,
	},
	remove_icon: {
		border: 'none',
		color: 'grey',
		width: '20px',
		height: '20px',
		padding: '7px',
		borderRadius: '50px',
		cursor: 'pointer',
		marginRight: '6px',
		...theme?.product_details?.product_info_container?.remove_icon,
	},
	add_icon: {
		border: 'none',
		width: '2rem',
		height: '2rem',
		padding: '0.7rem',
		borderRadius: '5rem',
		cursor: 'pointer',
		marginLeft: '0.6rem',
		...theme?.product_details?.product_info_container?.add_icon,
	},
	show_count: {
		outline: 'none',
		fontSize: '16px',
		fontWeight: '700',
		height: '34px',
		borderRadius: '10px',
		width: '100%',
		cursor: 'pointer',
		textAlign: 'center',
		...theme?.product_details?.product_info_container?.show_count,
	},

	customize_box2: {
		padding: '1rem',
		borderRadius: '8px',
		minWidth: 'auto',
		flexGrow: '1',
		display: 'flex',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		alignItems: 'center',
		justifyContent: 'center',
		height: '4rem',
		cursor: 'pointer',
		...theme?.product_details?.product_info_container?.customize_box,
		...theme?.product_details?.product_info_container?.customize_box2,
		border: `1px solid ${theme?.button?.color}`,
	},
	customize_box: {
		padding: '1rem',
		borderRadius: theme?.product?.custom_product_drawer?.button?.borderRadius,
		minWidth: 'auto',
		display: 'flex',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		alignItems: 'center',
		marginRight: '0.5rem',
		flexGrow: '1',
		justifyContent: 'center',
		height: '4rem',
		cursor: 'pointer',
		...theme?.product_details?.product_info_container?.customize_box,
		border: `1px solid ${theme?.button?.color}`,
	},

	custom_icon: {
		transform: 'scale(1.2)',
		...theme?.product_details?.product_info_container?.custom_icon,
	},

	tear_sheet_text: {
		...theme?.product_details?.product_info_container?.custom_icon,
	},

	tearsheet_button: {
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'center',
		height: '40px',
		cursor: 'pointer',
		border: `1px solid ${theme?.page_header_component?.tear_sheet}`,
	},

	price_container: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		gap: '8px',
	},

	rails_container: {
		...theme?.product_details?.product_info_container?.rails_container,
	},

	rails_title: {
		...theme?.product_details?.product_info_container?.rails_title,
	},

	add_to_cart_button: {
		...theme?.product_details?.add_to_cart_button,
	},

	show_more_text: {
		...theme?.product_details?.product_info_container?.show_more_text,
	},

	accordion_attributes: {
		...theme?.product_details?.product_info_container?.secondary_color,
		display: 'flex',
		padding: '0',
		'@media (max-width: 600px)': {
			maxWidth: '60%',
			wordBreak: 'break-word',
			flexWrap: 'wrap',
		},
	},
}));

export default useStyles;
