/* eslint-disable @typescript-eslint/no-unused-vars */
import { createTheme } from '@mui/material';
import commonTheme from './common.theme';
import constants from './constants';

const white = 'white';
const black = 'black';
const red = 'red';
const grey = 'grey';
const navyBlue = '#16885F';
const mintCream = '#E8F3EF';
const paleTeal = '#D0E7DF';
const lightSeafoam = '#A2CFBF';
const darkForest = '#002D1D';
const whiteSnow = '#ffffff';
const burntOrange = '#D74C10';
const lightSilver = '#FAFAFA';
const blackShadowTransparent = '#00000099';
const softLavender = '#EEF1F7';
const lightSilverGray = '#F7F8FA';
const gradientColor1 = 'rgba(0, 0, 0, 0.87)';
const darkSlateGray = '#25282D';
const paleSilver = '#F2F4F7';
const paleLime = '#EAEDD9';
const lightSteel = '#D1D6DD';
const mistyGrey = '#B5BBC3';
const slateGrey = '#9AA0AA';
const steelGrey = '#676D77';
const gradientColor2 = 'rgba(0, 0, 0, 0.4)';
const gradientColor3 = 'rgba(0, 0, 0, 0.12)';
const gradientColor4 = 'rgba(0, 0, 0, 0.08)';
const gradientColor5 = 'rgba(103, 109, 119, 1)';
const slateBlue = '#4F555E';
const skyBlue = '#4578C4';
const white2 = '#fff';
const babyBlue = '#E1EDFF';
const charcoalGrey = '#262626';
const oliveGreen = '#7DA50E';
const lightLime = '#E5EDCF';
const mediumGrey = '#737373';
const burntSienna = '#AE3500';
const paleApricot = '#F9DFAC';
const goldenrod = '#CE921E';
const frostBlue = '#F0F6FF';
const lightGray = '#D9D9D9';
const goldenYellow = '#F0AF30';
const peachCream = '#fbede7';
const ivoryCream = '#FEF7EA';
const charcoalGrey2 = '#636364';
const gradientColor6 = 'rgba(22, 136, 95, 1)';
const softTaupe = '#ddd4d1';
const frostWhite = '#F6FAF9';
const paleLemon = '#F2F6E7';
const gradientColor7 = 'rgba(242, 246, 231, 1)';
const gradientColor8 = 'rgba(254, 247, 234, 1)';
const turquoiseColor = '#73B89F';
const lightSeaGreen = '#6AB399';
const darkGreenishGray = '#096645';
const darkCharcoal = '#1E1E1E';
const darkGray = '#A3A3A3';
const chineseBlack = '#171717';
const gradientColor9 = 'rgb(209, 214, 221)';
const lightTan = '#EFB79F';
const mediumGray = '#525252';
const veryLightIvory = '#FCEFD6';
const black2 = '#000000DE';
const whiteSmoke = '#f5f5f5';
const lightSkyBlue = '#e0edff';
const offWhite = '#EBEDD9';
const tealGreen = '#14885F';
const gray2 = '#808080';
const lightGray2 = '#f7f8f8';
const Magenta = '#04AA6D';
const genoaColor = '#16885F';
const customBlackColor = 'rgba(0, 0, 0, 0.60)';
const brownWarningColor = '#684500';

export const primary = {
	main: navyBlue,
	contrastText: white,
	50: mintCream,
	100: paleTeal,
	200: lightSeafoam,
	300: turquoiseColor,
	400: lightSeaGreen,
	500: navyBlue,
	600: darkGreenishGray,
	700: darkCharcoal,
	800: darkCharcoal,
	900: darkForest,
};

export const colors = {
	primary_500: primary?.main,
	primary_600: darkGreenishGray,
	white: whiteSnow,
	black: '#000000',
	red: burntOrange,
	text_50: lightSilver,
	text_400: darkGray,
	text_900: chineseBlack,
	secondary_text: blackShadowTransparent,
	grey_300: softLavender,
	grey_500: softLavender,
	grey_600: lightSilverGray,
	black_8: gradientColor1,
};

export const secondary = {
	main: darkSlateGray,
	contrastText: white,
	50: lightSilver,
	100: paleSilver,
	200: paleSilver,
	300: paleLime,
	400: lightSteel,
	500: mistyGrey,
	600: slateGrey,
	700: steelGrey,
	800: '#4F555D',
	900: darkSlateGray,
};

export const text_colors = {
	primary: gradientColor2,
	secondary: softLavender,
	tertiary: gradientColor3,
	green: primary?.main,
	grey: '#a9acb2',
	light_grey: gradientColor4,
	dark_grey: gradientColor5,
	disabled: gradientColor2,
};

export const background_colors = {
	primary: whiteSnow,
	secondary: lightSilverGray,
	alice_blue: 'rgba(240, 246, 255, 0.70)',
};

export const border_colors = {
	primary: primary?.main,
};

export const custom_stepper_text_color = {
	primary: mediumGray,
	secondary: black,
	grey: slateBlue,
	anchor_link: skyBlue,
};

export const custom_stepper_bg_color = {
	primary: softLavender,
};

const primaryTheme = (config_data: any) => {
	const font_mapping = config_data?.font_mapping;
	const font_config = constants.FONT_CONFIG;
	const common: any = commonTheme(font_config, font_mapping);

	const primary_font = font_mapping?.[font_config?.primary] || { fontFamily: 'Satoshi' };

	return createTheme({
		...common,
		palette: {
			...common?.palette,
			primary,
			secondary,
			colors,
			background: {
				default: lightSilverGray,
				paper: paleSilver,
			},
			divider: gradientColor3,
			mode: 'light',
		},
		env_container: {
			backgroundColor: '#FF8282',
		},
		typography: {
			...common?.typography,
			color: black,
			transition: '0.2ms ease-in-out',
		},
		button: {
			color: primary?.main,
			bg_color: mintCream,
			hover_bg: 'rgb(22, 136, 95)',
			hover_bg_color: 'rgb(1, 68, 44)',
			hover_color: white2,
			btn_color: navyBlue,
			bg_color2: '#16885F',
			bg_color3: paleTeal,
			contained_color: white,
			contained_bg_color: 'navyBlue',
			container_hover_bg_color: 'rgb(1, 68, 44)',
			outlined_color: navyBlue,
			outlined_bg_color: 'transparent',
			text_color: navyBlue,
			text_bg_color: 'transparent',
			tonal_color: navyBlue,
			tonal_bg_color: 'rgb(232, 243, 239)',
			tonal_hover_bg_color: paleTeal,
		},
		skeleton: {
			background: gradientColor3,
			transition: '0.2ms ease-in-out',
		},
		page_header_component: {
			primary: slateBlue,
			icon_container: {
				border: `1px solid ${lightSteel}`,
				background: white,
			},
			zIndex: 150,
			buyer_switch: {
				text: {
					color: darkForest,
				},
				icon: {
					color: steelGrey,
				},
				buyer_container: {
					background: white,
					border: '1px solid transparent !important',
					'&:hover': {
						border: `1px solid ${gradientColor2}`,
					},
				},
				buyer_container2: {
					'&:hover': {
						border: `1px solid ${black} !important`,
					},
				},
				show_red_dot: {
					border: `1px solid ${black}`,
				},
			},
		},
		select_buyer_panel: {
			iconX: slateBlue,
			card_custom_style: {
				border: '1px solid rgba(0, 0, 0, 0.12)',
			},
			customer_count: { color: 'rgba(0, 0, 0, 0.60)' },
			infinite_scrollbar: {
				circular_progress_bar: { color: gradientColor6 },
			},
			header_section: {
				borderBottom: `1px solid ${gradientColor9}`,
			},
			guest_buyer: {
				borderBottom: `1px dashed ${gradientColor9}`,
			},
			container: {
				border: `1px solid ${gradientColor3}`,
			},
			cart_icon_container: {
				background: white,
			},
			unselected_buyer_card: {
				border: `1px solid ${gradientColor3}`,
			},
			selected_buyer_card: {
				background: gradientColor6,
				border: `1px solid ${gradientColor3}`,
			},
			all_buyer_card: {
				text_color: charcoalGrey,
				icon_color: oliveGreen,
				image_box: {
					background: lightLime,
				},
			},
			guest_buyer_card: {
				title: charcoalGrey,
				subtitle: mediumGrey,
				icon_color: oliveGreen,
				image_box: {
					background: lightLime,
				},
			},
			add_buyer_card: {
				title: charcoalGrey,
				subtitle: mediumGrey,
				icon_color: primary?.main,
				image_box: {
					background: paleTeal,
				},
			},
			cart: {
				badge_style: {
					background: burntOrange,
					color: white,
				},
				icon: {
					color: slateGrey,
				},
			},
			buyer_card: {
				initials: {
					background: lightTan,
					color: burntSienna,
				},
				buyer_data: {
					name: charcoalGrey,
					location: mediumGrey,
					sales: charcoalGrey,
				},
				progress_bar: {
					color: gradientColor6,
				},
				dummy_array: [
					{ background: lightTan, color: burntSienna },
					{ background: paleApricot, color: goldenrod },
					{ background: '#C4DBFF', color: skyBlue },
				],
			},
		},
		dashboard: {
			custom_button_style: {
				background: 'transparent',
				'&:hover': {
					background: '#eef3f4',
				},
			},
			buyer_switch: {
				custom_styles: {
					background: white,
				},
			},
			analytics: {
				total_revenue: {
					band_color: paleTeal,
					icon_color: primary?.main,
				},
				total_orders: {
					band_color: babyBlue,
					icon_color: skyBlue,
				},
				total_quotes: {
					band_color: '#F0E6FD',
					icon_color: '#9369C3',
				},
				drafts: {
					band_color: veryLightIvory,
					icon_color: '#8A5D05',
				},
			},
			analytics_card: {
				analytics_card_container: {
					background: white,
				},
				icon_chev: {
					color: '#0000008A',
				},
				custom_text: {
					color: black2,
				},
			},
			filters: {
				date: {
					selected_color: 'rgba(22, 136, 95, 0.08)',
					border: primary?.main,
					border_color: ' #B5BBC3',
					background_color: '#FFFFFF',
					borderRadius: '8px',
				},
			},
			time_range: {
				typography: {
					color: darkForest,
				},
				icon: {
					color: steelGrey,
				},
				label_container: {
					background: white,
					border: `1px solid ${black}`,
				},
				red_dot: {
					background: burntOrange,
				},
			},
			sales_rep: {
				label_container: {
					background: white,
					border: `1px solid ${black}`,
				},
				red_dot: {
					background: burntOrange,
				},
				typography: {
					color: darkForest,
				},
				icon: {
					color: steelGrey,
				},
			},
		},
		buyer_dashboard: {
			credits_button: {
				background: 'transparent',
			},
			inactive_tab_color: black,
			page_title: {
				color: oliveGreen,
			},
			credits: {
				container: {
					borderTop: `1px solid ${gradientColor3}`,
					borderBottom: `1px solid ${gradientColor3}`,
				},
				primary: gradientColor5,
				secondary: gradientColor2,
			},
			buyer_info_card: {
				background: white2,
				primary: primary?.main,
				secondary: paleTeal,
				tertiary: steelGrey,
				text: slateGrey,
				text2: slateBlue,
				border: `1px solid ${gradientColor2}`,
			},
		},
		view_buyer: {
			header: {
				text: white2,
				credits: {
					background: `var(--info-50, ${frostBlue})`,
					text: '#3563A6',
					border: `2px solid ${white2}`,
				},
			},
			basic_details: {
				primary: blackShadowTransparent,
				secondary: grey,
				background: white,
			},
			chip: {
				text: black,
				background: softLavender,
				border: `2px solid ${white}`,
			},
			status_chip_style: {
				border: '1px solid rgba(0, 0, 0, 0.12)',
				borderRadius: '40px',
			},
			avatar: {
				background: paleApricot,
				color: black,
			},
			other_details: {
				background: white,
				link: gradientColor2,
				upload: {
					primary: primary?.main,
					secondary: slateGrey,
					border: `1px dashed var(--grey-400, ${lightSteel})`,
				},
				chip: {
					background: lightSilverGray,
					text: black,
				},
				empty_state: {
					icon: slateGrey,
					text: slateBlue,
				},
				card: {
					icon: slateGrey,
					icon_hover: black,
					text: steelGrey,
					border: `1px solid var(--divider, ${gradientColor3})`,
					primary_text: oliveGreen,
					primary_background: lightLime,
					default_text: skyBlue,
					default_background: 'rgb(229, 237, 207)',
					text_color: 'rgb(125, 165, 14)',
					default_chip_bgColor: 'rgb(225, 237, 255)',
					default_chip_color: 'rgb(69, 120, 196)',
				},
			},
		},
		quick_add_buyer: {
			primary: black,
			secondary: 'rgba(0, 0, 0, 0.6)',
			tertiary: gradientColor2,
			customer_tab_color: black,
			error_text: burntOrange,
			error_text_hover: '#852800',
			background: white2,
			button_add_details: lightSilverGray,
			box_shadow: `0 -2px 5px ${gradientColor2}`,
			border: `1px solid ${gradientColor2}`,
			border_go_back: '1px solid rgb(22, 136, 95)',
			header: {
				text: slateBlue,
			},
			icon: turquoiseColor,
			card_text: navyBlue,
			card_background: lightSilverGray,
			copy: navyBlue,
			tax_preferences: {
				background1: lightSilverGray,
				background2: `var(--info-50, ${frostBlue})`,
				text: gradientColor2,
			},
			buyer_other_details: {
				primary: navyBlue,
				secondary: slateGrey,
			},
			drop_zone: {
				icon: navyBlue,
				text: darkGray,
			},
		},
		status: {
			border: `1px solid ${gradientColor3}`,
			background: white,
		},
		stats: {
			custom_text: {
				color: 'rgba(0, 0, 0, 0.6)',
				background: lightGray,
			},
		},
		one_column_forms: {
			form_container: {
				scrollbarColor: `#bcbcbc ${whiteSmoke}`,
				'&::-webkit-scrollbar-track': {
					backgroundColor: 'whiteSmoke',
				},
				'&::-webkit-scrollbar-thumb': {
					backgroundColor: '#cfcece',
					borderRadius: '4px',
				},
			},
			inner: {
				backgroundColor: whiteSnow,
			},
		},
		permissions_component: {
			border: `1px solid ${gradientColor3}`,
		},
		create_buyer_drawer: {
			icon: {
				color: steelGrey,
			},
		},
		user_drive: {
			upper_header: {
				icon_color: white,
			},
			pdf_viewer: {
				border: `1px solid ${slateGrey}`,
				style: {
					lft_cont_background_color: secondary?.[300],
					right_cont_background_color: lightSilverGray,
					page_number_background_color: lightGray,
					page_number_color: white,
				},
			},
			email_modal: {
				form_helper_color: red,
				fragment_color: navyBlue,
			},
			file_component: {
				icon_color: white,
				icon_file_color: oliveGreen,
				file_include_color: '#df7041',
				file_not_include_color: goldenYellow,
				file_video_color: lightLime,
				file_video_include_color: peachCream,
				file_video_not_include_color: ivoryCream,
				box_border_color: '#e0e0e0',
				custom_text_color: charcoalGrey2,
				style: {
					label_container_background: white,
					file_background_color: white2,
					menu_label_background_color: 'rgb(204, 204, 204)',
					email_box_background_color: lightSilverGray,
					email_container_background_color: white2,
				},
			},
			message_modal: {
				background1: '#2d2d2d',
				background2: 'green',
				text: white,
			},
			manage_access_modal: {
				background1: white,
				background2: lightSkyBlue,
				primary: gradientColor2,
				secondary: gradientColor6,
			},
			upload_modal: {
				background: white,
				box_shadow: `0px 4px 40px 0px ${gradientColor4}`,
				header_background: '#666666',
				primary: white,
				secondary: black,
				tertiary: '#7ca50c',
				failed: red,
			},
			file_preview: {
				active_hover_color: steelGrey,
				inactive_hover_color: slateGrey,
				custom_text_color: '#666666',
			},
			preview_style: {
				background_color: gradientColor2,
				primary_color: white,
				secondary_color: lightSilverGray,
			},
			filter_section: {
				box_background_color: lightSilverGray,
				label_background_color: white,
				custom_text_color: darkForest,
				icon_color: steelGrey,
			},
			folder_component: {
				label_container_background: white,
				container_background_color: white,
				container_box_shadow: `0px 4px 24px 0px ${gradientColor4}`,
				icon_color: '#b1c96e',
				custom_text_color: charcoalGrey2,
				custom_icon_color: lightGray,
				menu_color: charcoalGrey2,
			},
			user_drive_main: {
				modal_button_color: black,
				icon_color: white,
				custom_text_color: charcoalGrey2,
				box_icon_color: 'rgba(0, 0, 0, 0.6)',
				box_custom_color: 'rgba(0, 0, 0, 0.6)',
				tool_icon_color: '#6b7079',
				style: {
					hover_items_background_color: red,
					loader_background_color: gradientColor2,
					empty_background_color: white,
					selected_header_container_background_color: lightSilverGray,
					selected_header_background_color: lightSkyBlue,
					folder_skeleton_background_color: white,
					files_skeleton_background_color: white,
				},
			},
		},
		import_export: {
			data_card: {
				border1: `1px solid ${slateGrey}`,
				border2: `1px solid ${gradientColor3}`,
				box_shadow: `0px 4px 24px 0px ${gradientColor3}`,
			},
			date_filter_comp: {
				border: `1px solid ${mistyGrey}`,
				background: gradientColor6,
			},
			export_modal: {
				icon_color: slateBlue,
				background: white,
			},
			data_cards_container: {
				background: white,
			},
			icon_circle: {
				color: offWhite,
			},
		},
		label: {
			image_comp: {
				background_color: lightSilverGray,
				color: grey,
			},
			label_management: {
				color: '#684500',
			},
			drawer_content: {
				background_color: white2,
				webkit_scroll_thumb_color: 'transparent',
				border1: '1px solid {navyBlue}',
				border2: '1px solid #DADDE3',
			},
			not_allowed: {
				background: ivoryCream,
			},
			allowed: {
				background: frostBlue,
			},
			qr_template: {
				default_chip: {
					backgroundColor: goldenYellow,
				},
				index: {
					color: lightGray,
				},
				icon: {
					color: white2,
				},
			},
			table: {
				checkbox: {
					color: tealGreen,
				},
				transform_column: {
					borderColor: softTaupe,
				},
				product_selected: {
					color: slateBlue,
				},
				btn: {
					backgroundColor: red,
				},
				icon: {
					color: white2,
				},
			},
		},
		inventory_management: {
			use_inventory: {
				borderColor: softTaupe,
				background: 'transparent',
			},
			common_style: {
				backgroundColor: '#F7F7F7',
				boxShadow: `0px 0px 12px 1px ${gradientColor2}`,
			},
		},
		tabs: {
			active_color: gradientColor1,
			inactive_color: mistyGrey,
		},
		user_management: {
			deactivation_modal: {
				background: white2,
			},
			tag_render: {
				text: black,
				background: softLavender,
			},
			user_manage: {
				border_color: softTaupe,
				background: 'transparent',
			},
		},
		product: {
			custom_color_style: {
				color: gradientColor1,
			},
			product_image: {
				borderRadius: '1.2rem 1.2rem 0 0',
			},
			product_border: {
				borderRadius: '13px',
			},
			custom_item_CBM: {
				color: '#16885F',
				color2: '#E8F3EF',
				notSelected: '#9AA0AA',
			},
			product_card: {
				background: white,
				border: `1px solid ${gradientColor3}`,
				color: black,
				transition: '0.2ms ease-in-out',
			},
			product_variant_chip: {
				color: black,
				border: `1px solid ${gradientColor3}`,
				transition: '0.2ms ease-in-out',
			},
			view_similar_chip: {
				color: slateBlue,
				background: lightSilverGray,
				border: `1px solid ${lightSteel}`,
				transition: '0.2ms ease-in-out',
				boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.12)',
			},
			view_similar_chip_text: {
				color: black,
			},
			category_image: {
				background: white,
				border: `1px solid ${gradientColor3}`,
				transition: '0.2ms ease-in-out',
			},
			category: {
				border: `1px solid ${gradientColor3}`,
				transition: '0.2ms ease-in-out',
			},
			selected_category: {
				borderBottom: `2px solid ${primary?.main}`,
				transition: '0.2ms ease-in-out',
			},
			sub_category: {
				background: whiteSnow,
			},
			selected_sub_category: {
				border: '1px solid #676d77 !important',
				background: whiteSnow,
			},
			category_rail: {
				imageContainer: {
					width: '60px',
					height: '60px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: '50%',
				},
			},
			collection: {
				color: white2,
				collection_rail: {
					border: `1px solid ${gradientColor3}`,
				},
			},
			recommanded: {
				card: {
					border: `1px solid ${gradientColor3}`,
				},
				variant_value: {
					color: 'rgba(0,0,0,.6)',
					border: `1px solid var(--divider, ${gradientColor3})`,
				},
				selected_variant_value: {
					color: gradientColor2,
					border: `1px solid ${gradientColor3}`,
					background: paleApricot,
				},
				remove_icon: {
					background: secondary?.[300],
					color: grey,
				},
				add_icon: {
					background: primary?.main,
					color: white,
				},
				show_count: {
					borderRadius: '1rem',
					background: white2,
					color: primary?.main,
					border: `1px solid ${lightSteel}`,
					fontFamily: `${primary_font?.fontFamily}`,
				},
				dot: {
					color: lightGray,
				},
				add_to_cart: {
					disabled_color: white2,
					disabled_background: frostWhite,
				},
				view_all: {
					background: 'transparent',
				},
				button: {
					color: '#16885F',
					background: paleTeal,
				},
			},
			previous_ordered_card: {
				card_style: {
					border: `1px solid ${gradientColor3}`,
				},
				button: {
					background: paleTeal,
				},
				history: {
					background: lightSilverGray,
				},
				attr_icon: {
					color: lightGray,
				},
				chip_style: {
					background: paleLemon,
					color: slateBlue,
				},
				order_text: {
					color: grey,
				},
			},
			error_screen: {
				primary: white,
			},
			product_template: {
				align_custom_style: {
					fontSize: '14px',
					alignItems: 'center',
				},
				list_circle: {
					listStyle: 'none',
					color: lightGray,
				},
				date_chip: {
					border: `1px solid ${white}`,
				},
				chip_style: {
					backgroud: paleLemon,
					color: slateBlue,
				},
			},
			inventory_status: {
				product_list: {
					color: primary?.main,
				},
				status_container: {
					padding: '1rem',
					justifyContent: 'center',
				},
				out_of_stock: {
					color: burntOrange,
					background: peachCream,
					container_style: {
						boxShadow: `0px 1px 6px 0px ${gradientColor2}`,
						color: burntOrange,
						background: '#F7DBCF',
					},
				},
				back_order: {
					color: goldenrod,
					background: ivoryCream,
				},
				default: {
					background: lightSilverGray,
				},
			},
			inventory_menu: {
				custom_value_color: {
					color: slateBlue,
				},
				label_color: {
					color: gradientColor1,
				},
			},
			counter: {
				disabled_color: lightSeafoam,
				disabled_background: frostWhite,
				background: mintCream,
				hover_background: paleTeal,
				hover_color: navyBlue,
				decrement_icon: {
					background: paleLime,
					color: gray2,
				},
				input: {
					border: `1px solid ${lightSteel}`,
					color: primary?.main,
					background: white2,
					fontFamily: `${primary_font?.fontFamily}`,
				},
				increment_icon: {
					error_style: {
						color: mistyGrey,
						background: grey,
					},
					style: {
						background: navyBlue,
						color: lightSilver,
					},
				},
				error_style: {
					color: skyBlue,
					background: gradientColor7,
				},
				suggested_value: {
					color: skyBlue,
				},
			},
			similar_drawer: {
				edit_icon: {
					color: primary?.main,
				},
				container: {
					background: white,
					height: '100vh',
					gap: '8px',
				},
				header: {
					marginTop: '.7rem',
					padding: '4px 10px',
					height: '3rem',
				},
				sub_title: {
					color: slateBlue,
				},
			},
			variant_drawer: {
				container: {
					background: white,
				},
				custom_box: {
					background: lightGray2,
				},
				footer: {
					borderTop: `1px solid ${gradientColor3}`,
					background: whiteSnow,
				},
				title: {
					color: blackShadowTransparent,
				},
				sub_title: {
					color: primary?.main,
				},
				divider: {
					width: 'calc(100% + 2rem)',
					marginLeft: '-1rem',
				},
			},
			variant_detail_card: {
				color: gradientColor2,
				icon: {
					color: gradientColor2,
				},
				tool_tip: {
					color: white,
				},
			},
			cart_drawer: {
				color: frostBlue,
			},
			cart_item_card: {
				primary: gradientColor2,
				secondary: gradientColor2,
				tertiary: gradientColor1,
				dark_grey: slateBlue,
				light: white,
				discount_bar: {
					background: 'linear-gradient(90deg, paleLemon 1.82%, rgba(231, 241, 246, 0.65) 73.18%)',
				},
				discount_header: {
					color: `var(--Secondary-text, ${gradientColor2})`,
				},
				// discount_icon: {
				//  color: 'linear-gradient( #16885F, #97B73E)'
				// },
			},
			custom_product_drawer: {
				container: {
					background: white,
				},
				header: {
					background: white2,
					borderBottom: `1px solid ${gradientColor3}`,
				},
				header_icon: {
					color: '#4f5655',
				},
				mandatory: {
					borderRadius: '4px',
				},
				button: {
					borderRadius: '8px',
				},
				header_tooltip: {
					background: paleSilver,
					borderRadius: '6px',
				},
				footer: {
					background: white2,
					flexDirection: 'row',
					borderBottom: `1px solid ${gradientColor3}`,
					padding: '24px 16px',
					'@media (max-width: 600px)': {
						padding: '12px 16px',
						flexDirection: 'column',
						gap: '12px',
					},
				},
				footer_text: {
					color: white,
				},
				footer_left: {
					background: frostBlue,
					borderRadius: '8px',
					whiteSpace: 'nowrap',
					'@media (max-width: 600px)': {
						width: '100%',
					},
				},
				body: {
					primary: '#666',
					secondary: peachCream,
					light: paleSilver,
					grey: steelGrey,
					orange: burntOrange,
					light_grey: slateBlue,
					white: frostBlue,
				},
				modifier_select_value: {
					color: black,
					background: lightSilverGray,
					active_border: '1px solid rgb(79, 85, 94)',
				},
				no_option: {
					background: lightSilverGray,
				},
				chips: {
					chip_style: {
						background: white2,
						boxShadow: `0px 1px 12px 0px ${gradientColor4}`,
					},
					border: `1px solid ${black}`,
					active_border_color: slateBlue,
					border_color: lightSteel,
				},
				drop_down: {
					color: slateGrey,
				},
				image: {
					selected_style: {
						border: '1px solid rgb(79, 85, 94)',
						background: lightSilverGray,
						boxShadow: `0px 4px 12px 0px ${gradientColor4}`,
						borderRadius: '8px',
					},
					icon_style: {
						color: primary?.main,
					},
				},
				custom_counter: {
					container_with_label: {
						border: `1px solid ${frostWhite}`,
					},
					container_with_label_input: {
						display: 'flex',
						alignItems: 'center',
						border: `1px solid ${mistyGrey}`,
						width: 'fit-content',
						borderRadius: '8px',
						padding: '5px 10px',
						marginTop: '1rem',
					},
					label_input: {
						background: white,
						color: black,
					},
					decrement_icon: {
						background: paleLime,
						color: gray2,
					},
					error_style_color: {
						primary: frostWhite,
						secondary: navyBlue,
						tertiary: softLavender,
						dark_blue: steelGrey,
						light: lightSilver,
						grey: steelGrey,
						default: navyBlue,
						light_grey: grey,
					},
				},
				custom_error: {
					color: blackShadowTransparent,
					background: white,
				},
			},
			chevron: {
				background: white,
				color: black,
				transition: '0.2ms ease-in-out',
			},
			filter: {
				filter_container: {
					background: lightSilverGray,
					transition: '0.2ms ease-in-out',
				},
				chevron: {
					background: white2,
					shadow: `4px 0px 8px ${gradientColor4}`,
				},
				red_dot: {
					background: burntOrange,
				},
				sort: {
					container: {
						background: white,
					},
					icon: {
						color: steelGrey,
					},
					menu: {
						'&:hover': {
							border: `1px solid ${black}`,
						},
					},
					border_active: '1px solid green',
					border: `1px solid ${mistyGrey}`,
				},
				all_products_icon_style: {
					color: '#16885f',
				},
				all_products: {
					background: 'rgba(106, 179, 153, 0.2)',
					color: primary?.main,
					transition: '0.2ms ease-in-out',
				},
				chips: {
					background: white,
					color: black,
				},
				filter_icon: {
					container: {
						borderRadius: '8px',
						border: `1px solid ${mistyGrey}`,
						background: white2,
						'&:hover': {
							border: `1px solid ${black}`,
						},
					},
					color: gradientColor1,
				},
				range_filter: {
					range_filter_box: {
						borderRadius: '8px',
						background: whiteSnow,
					},
					red_dot: {
						background: burntOrange,
					},
					border: `1px solid ${primary?.main}`,
					hover_border: `1px solid ${black}`,
				},
				multi_select_filter: {
					background: whiteSnow,
					container_border: `1px solid ${primary?.main} !important`,
					color: primary?.main,
					chip: {
						background: lightGray2,
						color: slateBlue,
					},
				},
				category_filter: {
					category_filter_box: {
						// border: '1px #16885F solid',
						borderRadius: '8px',
						background: whiteSnow,
						'&:focus': {
							border: `2px solid ${primary?.main}`,
						},
					},
					bottom_button_container: {
						background: whiteSnow,
					},
					icon_color: {
						primary: slateGrey,
						secondary: primary?.main,
					},
					border: `1px solid ${primary?.main}`,
					hover_border: `1px solid ${black}`,
				},
				date_filter: {
					borderRadius: '8px',
					'&:hover': {
						border: `1px solid ${black}`,
					},
				},
				filter_and_chips: {
					background: white,
					icon_style: {
						color: red,
					},
					chip_style: {
						background: whiteSnow,
						color: primary?.main,
					},
				},
				all_filter_drawer: {
					drawer_footer_container: {
						borderTop: `1px solid ${softLavender}`,
						background: white,
						padding: '1.6rem 1rem',
					},
					button: {
						width: '50%',
					},
					background: white,
					marginLeft: '1em',
					header_padding: '0.5rem',
					divider: {
						marginLeft: '-1rem',
						width: 'calc(100% + 1rem)',
					},
				},
				accordion_type_filter: {
					accordion_layout: {
						border: '1px solid #bdbdbd',
					},
					selected_filter: {
						color: blackShadowTransparent,
					},
					clear_filter: {
						color: primary?.main,
					},
					background: white,
					borderRadius: '8px !important',
				},
				accordion_multi_type_filter: {
					background: white,
					color: primary?.main,
				},
				background: white,
			},
			catalog_switch: {
				price_list_container: {
					background: white2,
					border: `1px solid ${gradientColor3}`,
					'&:hover': {
						border: `1px solid ${black}`,
					},
					transition: '0.2ms ease-in-out',
				},
				icon: {
					color: steelGrey,
				},
				selected_calatog: {
					color: darkForest,
				},
				linked_catalog: {
					background: frostBlue,
					color: skyBlue,
				},
			},
			cart: {
				badge_style: {
					background: burntOrange,
					color: white,
					border: `1px solid ${veryLightIvory}`,
				},
				active_style: {
					background: veryLightIvory,
					border: 'none',
				},
				color: slateBlue,
			},
		},
		product_details: {
			container: {
				background: white2,
			},
			card_template_row: {
				height: '2rem',
				padding: '0.5rem 1rem',
			},
			product_name: {
				fontSize: '14px',
			},
			icon_style: {
				color: slateBlue,
				'&:hover': {
					color: 'rgb(0, 0, 0)',
					transform: 'scale(1.2)',
					transition: ' 0.2s ease-in-out',
				},
			},
			similar_product_container: {
				boxShadow: `2px solid ${black}`,
			},
			product_image_container: {
				carosuel: {
					arrow: {
						boxShadow: `0 2px 4px ${gradientColor2}`,
						background: white2,
						color: black,
					},
					thumb: {
						border: '1px solid #000000',
					},
					images: {
						border: '1px solid #E0E0E0',
						borderRadius: '8px',
					},
					magnifer: {
						border: `1px solid ${lightGray}`,
						backgroundColor: white,
					},
				},
			},
			product_info_container: {
				show_more_text: {
					color: gradientColor1,
				},
				header_container_value: {
					background: '#F0F6FF',
				},
				rail_styles: {
					chevron_left: {
						zIndex: 5,
						marginRight: '-5rem',
					},
					chevron_right: {
						zIndex: 5,
						marginLeft: '-5rem',
					},
				},
				active_price_style: {
					color: '#16885F',
					fontWeight: 500,
				},
				sku_id: {
					color: 'rgb(79, 85, 94)',
				},
				primary_color: {
					fontSize: '18px',
				},
				item_price: {
					fontSize: '24px',
				},
				secondary_color: {
					color: '#1F1F1F',
				},
				composite_label: {
					color: 'rgb(120, 120, 120)',
				},
				moq_color: {
					color: 'black',
				},
				icon_container: {
					border: `1px solid ${gradientColor3}`,
					background: white2,
				},
				variant_color_item: {
					border: '1px solid transparent',
					'&:hover': {
						padding: '0.6rem',
						border: `1px solid ${black}`,
						borderRadius: '8px',
					},
				},
				inventory_container: {
					minWidth: 120,
					width: 250,
					flex: '1',
				},
				variant_color_item_text: {
					fontSize: '14px',
				},
				stock_container: {
					backgroundColor: lightSilverGray,
				},
				drawer_header_container: {
					backgroundColor: white,
					borderBottom: `1px solid ${softLavender}`,
				},
				drawer_variant_container_item: {
					border: `1px solid ${gradientColor3}`,
				},
				active_style: {
					backgroundColor: lightSilverGray,
				},
				remove_icon: {
					background: offWhite,
				},
				add_icon: {
					background: primary?.main,
					color: white,
				},
				show_count: {
					background: white2,
					color: primary?.main,
					border: `1px solid ${lightSteel}`,
				},
				variant_hinge_container: {
					margin: '0rem',
				},
				button_container: {
					marginBottom: '16px',
				},
				custom_icon: {
					color: primary?.main,
				},
				chip_style: {
					color: slateBlue,
					background: white,
					border: `1px solid ${lightSteel}`,
				},
				image_style: {
					border: `1px solid ${lightSteel}`,
					boxShadow: `0px 0px 2px 2px ${gradientColor4}`,
					borderRadius: '8px',
				},
				active_image_style: {
					border: `1px solid ${darkSlateGray}`,
					background: lightSilverGray,
					boxShadow: `0px 4px 12px 0px ${gradientColor4}`,
					borderRadius: '8px',
				},
				disabled_style: {
					border: `1px solid ${gradientColor9}`,
					'&:hover': {
						background: lightSilverGray,
						border: `1px solid ${gradientColor9}`,
					},
				},
				active_chip_style: {
					border: `1px solid ${darkSlateGray}`,
					background: lightSilverGray,
					boxShadow: `0px 4px 15px 0px ${gradientColor4}`,
				},
				in_active_chip_style: {
					background: 'white',
					color: '#4F555E',
					border: '1px solid rgb(209, 214, 221)',
				},
				variant_cta_style: {
					backgroundColor: frostBlue,
				},
				customize_box: {
					color: primary?.main,
				},
				customize_box2: {
					margin: '1rem 0rem',
				},
			},
		},
		wishlist_style: {
			border_radius: '12px',
			iconColor: primary?.main,
			text_color: primary?.main,
		},
		copy_address_drawer: {
			copy_address_drawer_style_header: {
				padding: '16px 12px',
			},
			copy_address_drawer_style_card: {
				padding: '8px',
			},
		},
		alert: {
			border: `1px solid ${white2}`,
			borderRadius: '12px',
			backgroundColor: babyBlue,
		},
		cart_summary: {
			background: white2,
			container_cart: {
				primary: white2,
				container_info: paleSilver,
				icon_color: slateBlue,
			},
			summary_card: {
				seperator: mistyGrey,
				avatar_box: paleApricot,
				blocked: ivoryCream,
				background: white2,
				initial: goldenrod,
				location: steelGrey,
				buyer_name: chineseBlack,
			},
			customize_cart: {
				container_bg: lightSilverGray,
				label_color: slateBlue,
				icon_color: lightGray,
			},
			modal_product: {
				border: '#0000003d',
			},
			offer_discount: {
				border: primary?.main,
				toggle_border: gradientColor3,
			},
			product_card: {
				discount_bar_bg: 'linear-gradient(90deg, paleLemon 1.82%, rgba(231, 241, 246, 0.65) 73.18%)',
				discount_header_color: `var(--Secondary-text, ${gradientColor2})`,
				discount_icon: `linear-gradient( ${primary?.main}, #97B73E)`,
				custom_image_text: gradientColor2,
				dicsount_img: slateBlue,
				product_name_color: gradientColor1,
				notes_color: gradientColor2,
				attr_color: lightGray,
				text_color: black2,
				text_gray: blackShadowTransparent,
			},
			image: {
				borderRadius: '6px',
			},
			image_box: {
				width: '87px',
				height: '87px',
			},
			header: {
				text_color: tealGreen,
			},
			divider: {
				margin: '8px 0px',
			},
			discount: {
				color: red,
			},
			shipping_charge_container: {
				color: black2,
				background: paleLemon,
			},
			disclaimer: {
				background: '#E9F5F5',
			},
			custom_cart_total: {
				border: `1px solid ${lightSteel}`,
				background: '#EFF3E1',
				padding: '0rem 1rem 1rem 1rem',
			},
			product_listing: {
				border: `1px solid ${lightSteel}`,
				background: lightSilverGray,
				padding: '0rem 1rem',
				backgroundColor: lightSilverGray,
			},
			refetch_loader: {
				border: `1px solid ${lightSteel}`,
			},
		},
		custom_toast: {
			icon_color: {
				primary: '#8CB910',
				secondary: white,
				tertiary: gradientColor8,
				error: burntOrange,
				warning: goldenYellow,
			},
			background: '#2D2D2D !important',
			hover_primary: {
				'&:hover': {
					backgroundColor: 'transparent',
				},
			},
			hover_secondary: {
				background: white,
				'&:hover': {
					backgroundColor: white,
					opacity: '0.9',
				},
			},
		},
		payments: {
			card_text: steelGrey,
			add_credits: {
				tabs: {
					border_active: `1px solid ${gradientColor6}`,
					border_inactive: `1px solid ${gradientColor3}`,
					background_active: `var(--primary-50, ${mintCream})`,
					background_inactive: '',
					boxshadow_active: `0px 4px 24px 0px ${gradientColor2}`,
					boxshadow_inactive: '',
					icon_active: gradientColor6,
					icon_inactive: '',
				},
				content: {
					background: gradientColor7,
					text: gradientColor5,
					avatar: {
						background: paleApricot,
						color: goldenrod,
						text: 'rgba(206, 146, 30, 1)',
					},
					card: {
						icon_color: primary?.main,
						text_color: primary?.main,
					},
				},
				footer: {
					background: gradientColor8,
					text: gradientColor2,
				},
			},
			collect_payment: {
				tabs: {
					border_active: `1px solid ${gradientColor6}`,
					border_inactive: `1px solid ${gradientColor3}`,
					background_active: `var(--primary-50, ${mintCream})`,
					background_inactive: '',
					boxshadow_active: `0px 4px 24px 0px ${gradientColor2}`,
					boxshadow_inactive: '',
					icon_active: gradientColor6,
					icon_inactive: '',
				},
				content: {
					background: gradientColor8,
					text: gradientColor2,
					card: {
						icon_color: primary?.main,
						text_color: primary?.main,
					},
					credits: {
						background: gradientColor7,
					},
				},
				footer: {
					background: '#ecf2f8',
					text: gradientColor2,
				},
			},
			direct_payment: {
				content: {
					background: gradientColor8,
				},
				footer: {
					background: '#ecf2f8',
					text: gradientColor2,
				},
			},
			refund_payment: {
				background: gradientColor8,
				text: gradientColor2,
				icon: gradientColor5,
			},
			refund_credits: {
				text: gradientColor2,
				background: gradientColor8,
				buyer_details: {
					background: gradientColor7,
					avatar: {
						background: paleApricot,
						color: goldenrod,
						text: 'rgba(206, 146, 30, 1)',
					},
					text: gradientColor5,
				},
				background2: gradientColor8,
			},
			add_payment_modal: {
				disabled: gradientColor2,
				warning: burntOrange,
				copy_from: gradientColor6,
			},
			share_receipt_modal: {
				delete: slateBlue,
				icon: primary?.main,
				icon_disabled: gradientColor2,
			},
			terminal_modal: {
				text: gradientColor2,
				background: gradientColor8,
			},
			copy_form_text: {
				color: 'rgba(22, 136, 95, 1)',
			},
		},
		modal: {
			background: white,
			icon_color: slateBlue,
		},
		settings: {
			import_export: {
				color: goldenrod,
				text: '000000DE',
				span: {
					fontWeight: 500,
					cursor: 'pointer',
					color: primary?.main,
					'&:hover': {
						color: secondary[500],
					},
				},
			},
		},
		global_search: {
			outlined_input: {
				height: '42px',
				fontSize: '1.4rem',
				borderColor: '#1A1A1A',
				borderRadius: '8px',
			},
			input_dropdown_text: {
				borderLeft: '2px solid rgba(0,0,0,0.1)',
				marginLeft: '4px',
				fontSize: '14px',
				color: '#737373',
				fontWeight: '700',
				height: 'auto',
			},
			dropdown_container: {
				boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
				borderRadius: '12px',
				maxHeight: '200px',
			},
			previous_search_container: {
				zIndex: 1000,
				borderRadius: '12px',
				border: '1px solid #ccc',
				boxShadow: '0 2px 4px #0003',
				maxHeight: '200px',
				overflowY: 'auto',
			},
		},
		order_management: {
			custom_text_color_style: {
				color: customBlackColor,
			},
			custom_color_: {
				color: genoaColor,
			},
			status_chip_style: {
				borderRadius: '40px',
				border: '1px solid rgba(0, 0, 0, 0.12)',
			},
			cart_border_style: {
				border: '1px solid rgba(0, 0, 0, 0.12)',
			},
			account_list: {
				color: '#CE921E',
			},
			consolidated_container: {
				background: '#F7F8F8',
			},
			cart_checkout_card: {
				color: goldenrod,
				background: paleApricot,
				card_background: white,
				grid_background: lightSilver,
				border: `1px solid ${gradientColor3}`,
				cart_color: gradientColor1,
				sub_discount_color: gradientColor2,
			},
			cart_summary: {
				color: grey,
				typo_color: primary?.main,
				content_background: white,
				title_background_color: white,
			},
			cart_summary_item: {
				icon_color: lightGray,
				custom_color: white2,
			},
			charge_modal: {
				valid_color: primary?.main,
				invalid_color: slateGrey,
				label_color: black,
				custom_color: gradientColor1,
				border: `1.4px solid ${gradientColor3}`,
				borderBottom: `1px dashed ${gradientColor2}`,
				selected_background: mintCream,
				unselected_background: white,
			},
			header: {
				render_tear_color: '#4f4b4b',
				icon_color: slateBlue,
				custom_color: black,
				box_custom_color: primary?.main,
				box_icon_color: primary?.main,
				chip_border: `2px solid ${white}`,
			},
			invoices: {
				grid_background: gradientColor8,
			},
			order_end_status_container: {
				background: gradientColor7,
			},
			order_end_status_info_container: {
				custom_color: slateBlue,
				custom_text_color: black,
				icon_color: 'rgb(154, 160, 170)',
				box_bgcolor: ivoryCream,
				custom_box_color: goldenrod,
				custom_image_color: whiteSnow,
				box_icon_color: lightGray,
				grid_custom_color: gradientColor2,
				background_color: white,
				custom_background_color: 'transparent',
				payment_background_color: white,
				border: `1px solid ${gradientColor3}`,
				account_list_background_color: white,
				accordion_content_background: white,
				cart_checkout_card_background: white,
			},
			order_manage_container: {
				background_color: white,
				hr_border_top: `2px solid ${mistyGrey}`,
			},
			payment_link: {
				icon_style_color: primary?.main,
				icon_dis_style_color: gradientColor2,
				icon_color: slateBlue,
			},
			payment_table: {
				icon_color: slateBlue,
				custom_color: black,
				bg_color: paleLemon,
				custom_text_color: skyBlue,
				grid_custom_color: burntOrange,
				grid_payment_color: gradientColor6,
				grid_transaction_valid_color: 'rgba(125, 165, 14, 1)',
				grid_transaction_invalid_color: 'rgba(107, 166, 254, 1)',
				border: `1px solid ${gradientColor2}`,
			},
			download_icon: {
				background: white,
			},
			add_edit_payment: {
				icon_color: primary?.main,
				custom_color: primary?.main,
			},
			change_address: {
				box_bg_color: lightSilverGray,
				chip_bg_color: paleTeal,
				chip_text_color: primary?.main,
			},
			change_contact_drawer: {
				box_bg_color: paleLemon,
			},
			collect_drawer_skeleton: {
				bg_color: Magenta,
			},
			refund_drawer_skeleton: {
				bgcolor: Magenta,
			},
			refund_payment_drawer: {
				grid_background: gradientColor8,
				text_field_color: black,
				custom_color: red,
				grid_custom_color: gradientColor2,
			},
			send_mail_drawer: {
				chip_bg_color: white,
				chip_text_color: black,
				email_grid_chip_bg_color: mintCream,
				email_grid_chip_text_color: black,
				grid_chip_bg_color: white,
				grid_chip_text_color: black,
			},
			send_order_confirmation_drawer: {
				chip_bg_color: mintCream,
				chip_text_color: black,
				email_grid_chip_bg_color: mintCream,
				email_grid_chip_text_color: black,
				grid_chip_bg_color: white,
				grid_chip_text_color: black,
			},
			notes_section: {
				custom_valid_color: burntOrange,
				custom_invalid_color: black,
				custom_color: burntOrange,
				cursor_custom_color: primary?.main,
			},
			order_quote_section: {
				custom_color: primary?.main,
				custom_valid_color: burntOrange,
				custom_invalid_color: black,
			},
			payment_method_section: {
				custom_color: gradientColor2,
				cursor_custom_color: primary?.main,
				chip_color: '#F0AF30',
			},
			terms_section: {
				custom_color: burntOrange,
				custom_valid_color: burntOrange,
				custom_invalid_color: black,
				grid_container_bgcolor: white,
				cursor_custom_color: primary?.main,
			},
			user_detail_section: {
				empty_state_color: slateBlue,
				custom_valid_color: burntOrange,
				custom_invalid_color: black,
				all_value_empty_color: burntOrange,
				email_custom_color: steelGrey,
				icon_color: slateGrey,
				cursor_custom_color: primary?.main,
			},
			action_comp: {
				icon_style_color: steelGrey,
				icon_hover_color: black,
			},
			order_listing: {
				cell_background_color: 'transparent',
			},
			order_management: {
				icon_color: '#6BA6FE',
				alert_background: white,
			},
			location_search_container: {
				border: '1px solid rgba(0, 0, 0, 0.23)',
			},
			ultron_active_card_style: {
				width: '100%',
				cursor: 'pointer',
				borderRadius: 12,
				border: `1px solid ${lightSteel}`,
			},
			ultron_card_style: {
				width: '100%',
				cursor: 'pointer',
				borderRadius: 12,
				border: `1px solid ${lightSteel}`,
			},
			style: {
				text_style_color: black,
				tab_color: black,
				charge_warning_background: ivoryCream,
				charge_error_background: peachCream,
				charge_warning_icon: brownWarningColor,
				charge_error_icon: red,
				charge_warning_color: slateBlue,
				change_billing_address_style_border: `1px solid ${lightSteel}`,
				change_contact_drawer_style_border: `1px solid ${lightSteel}`,
				change_shipping_address_style_border: `1px solid ${lightSteel}`,
				section_notes_text_style_color: grey,
				user_details_section_icon_style_color: slateGrey,
				section_notes_value_text_color: grey,
				charge_text_style_color: primary?.main,
				discount_color_valid_color: burntSienna,
				discount_color_invalid_color: black,
				grid_container_style_background_color: white,
				icon_style_color: slateBlue,
				icon_style_hover_color: 'rgb(0, 0, 0)',
				icon_container_border: `1px solid ${gradientColor3}`,
				note_text_label_color: gradientColor2,
				note_text_value_color: gradientColor2,
				discount_bar_background: 'linear-gradient(90deg, paleLemon 1.82%, rgba(231, 241, 246, 0.65) 73.18%)',
				discount_header_color: `var(--Secondary-text, ${gradientColor2})`,
				custom_label_color: white,
				text_color: gradientColor1,
				price_text_color: gradientColor2,
				discount_img_color: slateBlue,
				cart_item_text_container_color: 'rgba(0, 0, 0, 0.64)',
				cart_item_price_background_color: 'rgba(210, 206, 206, 0.231)',
				order_info_style_color: `var(--grey-800, ${slateBlue})`,
				order_end_status_icon_style_color: slateGrey,
				view_details_card_border: `1px solid var(--divider, ${gradientColor3})`,
				cart_checkout_card_background: white,
				cart_checkout_card_border: `1px solid ${gradientColor3}`,
				cart_checkout_total_price_background_color: lightSilver,
				order_more_section_container_background_color: white,
				order_more_section_container_v2_background_color: white,
				drawer_header_container_background_color: white,
				drawer_header_container_border_bottom: `1px solid ${softLavender}`,
				drawer_content_container_background_color: white,
				drawer_footer_container_border_top: `1px solid ${softLavender}`,
				drawer_footer_container_background_color: white,
				hide_over_flowing_text_color: mediumGray,
				end_status_info_container_background_color: white2,
				submit_banner_icon_color: 'rgba(140, 185, 16, 1)',
				cancel_banner_icon_color: 'rgb(218, 0, 0)',
				check_icon: slateBlue,
				step_separator_background: lightSteel,
				custom_tag_on_image_background: gradientColor2,
				order_end_status_container_text_style_color: gradientColor2,
				container_cart_border: `1px solid ${gradientColor3}`,
				container_cart_background: white2,
				container_info_background: paleSilver,
				icon_delivery_color: slateBlue,
				text_primary_color: slateBlue,
				text_secondary_color: slateBlue,
				total_cbm_info_background: frostBlue,
				cart_table_header_container_background_color: frostBlue,
				cart_shipped_product_header_background_color: frostBlue,
				cart_table_header_container_v2_background_color: frostBlue,
				cart_item_container_border: `1px solid ${gradientColor3}`,
				cart_shipped_container_border: `1px solid ${gradientColor3}`,
				cart_item_container_v2_border: `1px solid ${gradientColor3}`,
				grid_container_background: whiteSnow,
				grid_container_background_color: mintCream,
				chip_hover_effect_background_color: mintCream,
				icon_color: navyBlue,
				text_decoration_line: 'none',
			},
			saved_card: {
				container: {
					backgroundColor: lightSilverGray,
				},
				text_style: {
					color: gradientColor2,
				},
				icon_style: {
					color: white,
				},
			},
			tracking_message: {
				background: lightSilverGray,
			},
			stepper: {
				active: {
					color: black2,
				},
				in_active: {
					color: steelGrey,
				},
				container: {
					background: lightSilverGray,
				},
				stepper_line: {
					color: mistyGrey,
				},
			},
		},
		components: {
			...common?.components,
			MuiMenuItem: {
				styleOverrides: {
					root: () => ({
						backgroundColor: white2,
						'&:hover': {
							backgroundColor: 'rgba(0, 0, 0, 0.04)',
						},
						// '&:selected': {
						//  backgroundColor: 'green',
						// },
					}),
				},
			},
			MuiList: {
				styleOverrides: {
					root: () => ({
						borderRadius: '8px',
						// filter: 'drop-shadow(0px 4px 30px rgba(0, 0, 0, 0.1))',
						background: white,
						boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.1)',
						border: '1px solid whiteSmoke',
					}),
				},
			},
			MuiAccordion: {
				styleOverrides: {
					root: () => ({
						borderRadius: '8px',
						boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px gradientColor3',
					}),
				},
			},
			MuiToggleButton: {
				styleOverrides: {
					root: () => ({
						'&:hover': {
							backgroundColor: paleTeal,
							color: darkSlateGray,
						},
						'&.Mui-selected, &.Mui-selected:hover': {
							backgroundColor: lightSeaGreen,
							color: whiteSnow,
						},
					}),
				},
			},
			MuiIconButton: {
				styleOverrides: {
					root: () => ({
						'&:hover': {
							backgroundColor: common?.palette?.success[50],
							color: secondary[700],
						},
					}),
				},
			},
			MuiCard: {
				styleOverrides: {
					root: () => ({
						background: whiteSnow,
					}),
				},
			},
			MuiSelect: {
				styleOverrides: {
					root: () => ({
						border: '',
						borderRadius: '8px',
						'&:hover': {
							border: 'none',
						},
					}),
				},
			},
			MuiDrawer: {
				styleOverrides: {
					paper: {
						background: white,
					},
				},
			},
		},
		light_box: {
			modal: {
				modifiers: {
					icon_color: '#ffffff',
					image_border: ' #D1D6DD',
				},
				overlay_config: {
					background: 'rgba(0, 0, 0, 0.8)',
				},
			},
		},
	});
};

export default primaryTheme;
