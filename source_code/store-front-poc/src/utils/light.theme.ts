/* eslint-disable @typescript-eslint/no-unused-vars */
import { createTheme } from '@mui/material';
import commonTheme from './common.theme';
import _ from 'lodash';

const original_colors = {
	primaryColor: '#2D323A',
	secondaryColor: '#25282D',
	bodyTextColor: '#171717',
	accentColor: '#D74C10',
	backgroundColor: '#F7F8FA',
	harpColor: '#E8F3EF',
	edgeWaterColor: '#D0E7DF',
	shadowGreenColor: '#A2CFBF',
	silverTreeColor: '#73B89F',
	silverTreeColor2: '#6AB399',
	salemColor: '#096645',
	codGrayColor: '#1E1E1E',
	burnHamColor: '#002D1D',
	brownWarningIcon: '#684500',
	whiteColor: '#ffffff',
	whiteColor2: '#FFF',
	blackColor: '#000000',
	alabasterColor: '#FAFAFA',
	silverChaliceColor: '#A3A3A3',
	secTextColor: '#00000099',
	catskillWhiteColor: '#EEF1F7',
	catskillWhiteColor2: '#EEF1F6',
	athensGrayColor: '#F2F4F7',
	mischkaColor: '#D1D6DD',
	bombayColor: '#B5BBC3',
	grayChateauColor: '#9AA0AA',
	NevadaColor: '#676D77',
	greyColor: '#4F555E',
	aluminiumGreyColor: '#a9acb2',
	solitudeColor: '#E1EDFF',
	solitude2Color: '#E0EDFF',
	mineShaftColor: '#262626',
	iconColor: '#7DA50E',
	athsSpecialColor: '#E5EDCF',
	subTitleColor: '#737373',
	peachYellowColor: '#F9DFAC',
	geebungColor: '#CE921E',
	indigoColor: '#4578C4',
	fireColor: '#AE3500',
	altoColor: '#D9D9D9',
	alto2Color: '#e0e0e0',
	fileVideoNotIncludeColor: '#FEF7EA',
	fileNotIncludeColor: '#F0AF30',
	fileVideoIncludeColor: '#fbede7',
	customTextColor: '#636364',
	zirconColor: '#f0f6ff',
	borderColor: '#ddd4d1',
	white_color: 'white',
	rgbaBlackColor: 'rgba(0, 0, 0, 0.87)',
	rgbaBlack2Color: 'rgba(0, 0, 0, 0.2)',
	rgbaBlack3Color: 'rgba(0, 0, 0, 0.14)',
	abbeyColor: '#4F555D',
	lightBlackColor: 'rgba(0, 0, 0, 0.6)',
	transparentBlackColor: 'rgba(0, 0, 0, 0.12)',
	lightGreyColor: 'rgba(0, 0, 0, 0.08)',
	darkGreyColor: 'rgba(103, 109, 119, 1)',
	disabledLightBlackColor: 'rgba(0, 0, 0, 0.3)',
	rgbaAliceBlueColor: 'rgba(240, 246, 255, 0.70)',
	emperorColor: '#525252',
	pureBlackColor: 'black',
	transparentColor: 'rgba(22, 136, 95, 0.08)',
	dividerColor: 'rgba(0,0,0,0.12)',
	pureLightColor: 'light',
	vividTangerineColor: '#FF8282',
	backGroundLightBlackColor: 'rgba(0, 0, 0, 0.11)',
	borderBlackColor: 'rgba(0,0,0,0.3)',
	customBlackColor: 'rgba(0, 0, 0, 0.60)',
	rgbLightGreenColor: 'rgb(22, 136, 95)',
	rgbLightGreen2Color: 'rgba(22, 136, 95, 1)',
	rgbIceBlueColor: 'rgb(209, 214, 221)',
	rgbaBorderBlackColor: 'rgba(0, 0, 0, 0.12)',
	mandysPinkColor: '#EFB79F',
	periwinkleColor: '#C4DBFF',
	selagoColor: '#F0E6FD',
	pearlLustaColor: '#FCEFD6',
	pureGreyColor: 'grey',
	textPrimaryColor: '#1A1A1A',
	shadowBlackColor: 'rgba(0,0,0,0.1)',
	textBlackColor: 'rgba(0,0,0,.6)',
	wildSandColor: '#f5f5f5',
	silverColor: '#cccccc',
	pureRedColor: 'red',
	pureGreenColor: 'green',
	mineColor: '#2d2d2d',
	lowSkyBlueColor: 'rgba(209, 214, 221,0.6)',
	doveGreyColor: '#666666',
	blackHazeColor: '#F7F8F8',
	whiteRockColor: '#EBEDD9',
	mediumBlackColor: 'rgba(0,0,0,0.6)',
	genoaColor: '#16885F',
	pureTransparentColor: 'transparent',
	loaferColor: '#F2F6E',
	whiteishColor: 'rgba(247, 248, 250, 1)',
	textYellowColor: 'rgba(206, 146, 30, 1)',
	rgbCreamColor: 'rgb(242, 246, 231)',
	tempBlackColor: 'rgba(0, 0, 0, 0.26)',
	priceTextBlackColor: 'rgba(0, 0, 0, 0.4)',
	offYellowColor: 'rgba(254, 247, 234, 1)',
	greenHazeColor: '#04AA6D',
	rgbHoverBlackColor: 'rgb(0, 0, 0)',
	blackSqueezeColor: 'rgba(231, 241, 246, 0.65)',
	rgbBlackColor: 'rgba(0, 0, 0, 0.45)',
	nominalDarkColor: 'rgba(0, 0, 0, 0.60)',
	sushiColor: '#97B73E',
	backWhiteColor: 'rgb(255, 255, 255)',
	rgbaLoferColor: 'rgba(242, 246, 231, 1)',
	blackSqueezeHashColor: '#ECF2F8',
	blackTextColor: '#000000DE',
	LavenderBlue: '#9369C3',
	BurntOrange: '#8A5D05',
	TransparentBlack2: '#0000008A',
	TransparentBlack3: 'rgba(0,0,0,0.2)',
	IndigoBlue: '#3563A6',
	Silver2: '#bcbcbc',
	MistyGray: '#cfcece',
	PumpkinOrange: '#df7041',
	SpringGreen: '#7ca50c',
	LimeGreen: '#b1c96e',
	SlateGray: '#6b7079',
	Charcoal: '#4f4b4b',
	VibrantGreen: 'rgba(125, 165, 14, 1)',
	SkyBlue: 'rgba(107, 166, 254, 1)',
	CornflowerBlue: '#6BA6FE',
	LightGray: 'rgba(210, 206, 206, 0.231)',
	BrightRed: 'rgb(218, 0, 0)',
	LightBlueGray: '#DADDE3',
	EmeraldGreen: '#14885F',
	SnowWhite: '#F7F7F7',
	Peach: '#F7DBCF',
	StormyGray: '#4f5655',
	SilverGray: '#bdbdbd',
	TranquilGray: '#9AA0AA66',
	blackColor2: 'rgb(37, 40, 45)',
	lightGreyColor2: '#CECECE',
	primaryGreen: '#065465',
	primaryGreenDisabled: 'rgba(6 , 54 , 65 , 0.4)',
	silverSand: '#c4c4c4',
	antiFlashWhite: '#E9F5F5',
	lotionWhite: '#FDFDFD',
	gradientColor: 'rgba(0, 0, 0, 0.07)',
	chipColor: '#f1f2f2',
	dividerColor2: '#cfcbcb',
	gradientColor2: 'rgba(209, 214, 221, 1)',
	lightWhite: '#F0F6FF',
	nudgeBackground: '#F2F6E7',
};

const fallback_colors = {
	...original_colors,
};

export const primary = {
	main: fallback_colors?.primaryColor,
	contrastText: fallback_colors?.white_color,
	50: fallback_colors?.harpColor,
	100: fallback_colors?.edgeWaterColor,
	200: fallback_colors?.shadowGreenColor,
	300: fallback_colors?.silverTreeColor,
	400: fallback_colors?.silverTreeColor2,
	500: fallback_colors?.primaryColor,
	600: fallback_colors?.salemColor,
	700: fallback_colors?.codGrayColor,
	800: fallback_colors?.codGrayColor,
	900: fallback_colors?.burnHamColor,
};

export const colors: any = {
	primary_500: fallback_colors?.primaryColor,
	primary_600: fallback_colors?.salemColor,
	white: fallback_colors?.whiteColor,
	black: fallback_colors?.blackColor,
	red: fallback_colors?.accentColor,
	text_50: fallback_colors?.alabasterColor,
	text_400: fallback_colors?.silverChaliceColor,
	text_900: fallback_colors?.bodyTextColor,
	secondary_text: fallback_colors?.secTextColor,
	grey_300: fallback_colors?.catskillWhiteColor,
	grey_500: fallback_colors?.catskillWhiteColor,
	grey_600: fallback_colors?.backgroundColor,
	black_8: fallback_colors?.rgbaBlackColor,
};

export const secondary = {
	main: fallback_colors?.secondaryColor,
	contrastText: fallback_colors?.white_color,
	50: fallback_colors?.alabasterColor,
	100: fallback_colors?.athensGrayColor,
	200: fallback_colors?.athensGrayColor,
	300: fallback_colors?.catskillWhiteColor2,
	400: fallback_colors?.mischkaColor,
	500: fallback_colors?.bombayColor,
	600: fallback_colors?.grayChateauColor,
	700: fallback_colors?.NevadaColor,
	800: fallback_colors?.abbeyColor,
	900: fallback_colors?.secondaryColor,
};

export const text_colors = {
	primary: fallback_colors?.lightBlackColor,
	secondary: fallback_colors?.catskillWhiteColor,
	tertiary: fallback_colors?.transparentBlackColor,
	green: fallback_colors?.primaryColor,
	grey: fallback_colors?.aluminiumGreyColor,
	light_grey: fallback_colors?.lightGreyColor,
	dark_grey: fallback_colors?.darkGreyColor,
	disabled: fallback_colors?.disabledLightBlackColor,
	black: 'rgba(0, 0, 0, 0.87)',
};

export const warning = {
	main: '#F0AF30',
	contrastText: 'white',
	50: '#FEF7EA',
	100: '#FCEFD6',
	200: '#F9DFAC',
	300: '#F6CF83',
	400: '#F3BF59',
	500: '#F0AF30',
	600: '#CE921E',
	700: '#AC7710',
	800: '#8A5D05',
	900: '#684500',
};
export const error = {
	main: '#D74C10',
	contrastText: 'white',
	50: '#FBEDE7',
	100: '#F7DBCF',
	200: '#EFB79F',
	300: '#E79470',
	400: '#DF7040',
	500: '#D74C10',
	600: '#AE3500',
	700: '#852800',
	800: '#5D1C00',
	900: '#481702',
};
export const success = {
	main: '#7DA50E',
	contrastText: 'white',
	50: '#F2F6E7',
	100: '#E5EDCF',
	200: '#CBDB9F',
	300: '#B1C96E',
	400: '#97B73E',
	500: '#7DA50E',
	600: '#5B7C00',
	700: '#3D5300',
	800: '#2C3C01',
	900: '#212D01',
};

export const background_colors = {
	primary: fallback_colors?.whiteColor,
	secondary: fallback_colors?.backgroundColor,
	alice_blue: fallback_colors?.rgbaAliceBlueColor,
	accordion: '#EFF3E1',
	radiant_color: '#eff7e0',
};

export const border_colors = {
	primary: fallback_colors?.primaryColor,
};

export const custom_stepper_text_color = {
	primary: fallback_colors?.emperorColor,
	secondary: fallback_colors?.pureBlackColor,
	grey: fallback_colors?.greyColor,
	anchor_link: fallback_colors?.indigoColor,
};

export const custom_stepper_bg_color = {
	primary: fallback_colors?.catskillWhiteColor,
};

export const accordion_colors = {
	background: '#000000',
	text: '#808080',
};

export const manage_data_export_select_color = fallback_colors?.transparentColor;
export const select_colors = {
	primary: '#FFF',
	secondary: '#D74C10',
	text: 'rgba(0, 0, 0, 0.60)',
};

const handle_font_config_data = (font_mapping: any, font_config: any) => {
	const default_font = { fontFamily: 'Satoshi' };
	const configured_fonts: any = {};

	for (const [key, value] of Object.entries(font_config)) {
		configured_fonts[`${key}_font`] = font_mapping?.[value] || default_font;
	}

	return configured_fonts;
};

const handle_map_colors = (original_color_data: any, color_mapping_data: any, linked_color_data: any) => {
	if (_.isEmpty(linked_color_data)) {
		return original_color_data;
	}
	const mapped_colors: any = {};
	for (const [key, value] of Object.entries(original_color_data)) {
		mapped_colors[key] = color_mapping_data[value] || value;
	}
	return mapped_colors;
};

const transform_linked_colors = (linked_color: any, fixedColor: any) => {
	return _.transform(
		linked_color,
		(result: any, category_values: any, category_key: any) => {
			_.forEach(category_values, (value: any, shade_key: any) => {
				const newKey = `${category_key}_${shade_key}`;
				result[newKey] = _.get(fixedColor, value.replace('fixed_color?.', ''), value);
			});
		},
		{},
	);
};

const handle_color_config_data = (linked_color_data: any, fixed_color: any) => {
	const color_mapping: any = transform_linked_colors(linked_color_data, fixed_color);
	const mapped_colors = {
		// Blacks and Grays
		'#4F555E': color_mapping?.grey_0,
		'#2D323A': fixed_color?.primary,
		'#171717': color_mapping?.text_primary,
		'#1E1E1E': color_mapping?.text_primary,
		'#262626': color_mapping?.text_primary,
		'#2D2D2D': color_mapping?.text_primary,
		'#676D77': color_mapping?.grey_6,
		'#9AA0AA': color_mapping?.strokes_secondary,
		'#4F555D': color_mapping?.strokes_secondary,
		'#525252': color_mapping?.strokes_secondary,
		'#666666': color_mapping?.strokes_secondary,
		'#A3A3A3': color_mapping?.strokes_secondary,
		'#B5BBC3': color_mapping?.strokes_secondary,
		'#D1D6DD': color_mapping?.grey_4,
		'#F8F8F8': color_mapping?.grey_7,
		'#1A1A1A': color_mapping?.text_primary,
		'rgba(0, 0, 0, 0.87)': color_mapping?.text_primary,
		'rgba(0, 0, 0, 0.60)': color_mapping?.text_primary,
		'rgba(0, 0, 0, 0.40)': color_mapping?.strokes_tertiary,
		'rgba(0, 0, 0, 0.30)': color_mapping?.strokes_tertiary,
		'rgba(0, 0, 0, 0.26)': color_mapping?.strokes_tertiary,
		'rgba(0, 0, 0, 0.20)': color_mapping?.strokes_tertiary,
		'rgba(0, 0, 0, 0.14)': color_mapping?.grey_7,
		'rgba(0, 0, 0, 0.12)': color_mapping?.grey_7,
		'rgba(0, 0, 0, 0.11)': color_mapping?.grey_7,
		'rgba(0, 0, 0, 0.08)': color_mapping?.grey_7,
		'rgba(0, 0, 0, 0.07)': color_mapping?.grey_7,
		'rgba(231, 241, 246, 0.65)': color_mapping?.strokes_secondary,
		'rgba(22, 136, 95, 0.08)': color_mapping?.strokes_secondary,
		'rgba(240, 246, 255, 0.70)': color_mapping?.strokes_secondary,
		// Whites and Light Grays
		'#EEF1F7': color_mapping?.background_secondary,
		'#F7F8FA': color_mapping?.grey_1,
		'#FAFAFA': color_mapping?.background_primary,
		'#FFFFFF': color_mapping?.grey_0,
		'#F7F8F8': color_mapping?.background_primary,
		'#FFF': color_mapping?.background_primary,
		'#F0F6FF': color_mapping?.background_primary,
		'#EEF1F6': color_mapping?.background_secondary,
		'#F2F4F7': color_mapping?.background_secondary,
		'#F0E6FD': color_mapping?.background_secondary,
		'#FCEFD6': color_mapping?.background_secondary,
		'#F2F6E7': color_mapping?.background_secondary,
		'#F5F5F5': color_mapping?.background_secondary,
		'rgba(247, 248, 250, 1)': color_mapping?.background_secondary,
		'rgba(255, 255, 255, 1)': color_mapping?.background_primary,
		'rgba(242, 246, 231, 1)': color_mapping?.background_secondary,
		// Blues
		'#4578C4': color_mapping?.background_dark,
		'#C4DBFF': color_mapping?.background_accent,
		'#E1EDFF': color_mapping?.background_accent,
		'#E0EDFF': color_mapping?.background_accent,
		'#ECF2F8': color_mapping?.background_accent,
		'rgba(209, 214, 221, 0.60)': color_mapping?.strokes_secondary,
		'rgba(209, 214, 221, 1)': color_mapping?.strokes_secondary,
		// Greens
		'#04AA6D': color_mapping?.text_tertiary,
		'#096645': color_mapping?.text_tertiary,
		'#16885F': color_mapping?.text_tertiary,
		'#73B89F': color_mapping?.text_tertiary,
		'#6AB399': color_mapping?.text_tertiary,
		'#A2CFBF': color_mapping?.text_tertiary,
		'#D0E7DF': color_mapping?.text_tertiary,
		'#E8F3EF': color_mapping?.text_tertiary,
		'#97B73E': color_mapping?.text_tertiary,
		'#E5EDCF': color_mapping?.text_tertiary,
		'rgba(22, 136, 95, 1)': color_mapping?.text_tertiary,
		'rgb(22, 136, 95)': color_mapping?.text_tertiary,
		// Reds and Oranges
		'#D74C10': color_mapping?.warning,
		'#AE3500': color_mapping?.warning,
		'#CE921E': color_mapping?.warning,
		'#FF8282': color_mapping?.warning,
		'rgba(206, 146, 30, 1)': color_mapping?.warning,
		'rgba(254, 247, 234, 1)': color_mapping?.warning,
		// Browns and Neutrals
		'#002D1D': color_mapping?.background_dark,
		'#EFB79F': color_mapping?.background_secondary,
		// Occurring Once
		'#9369C3': color_mapping?.background_secondary,
		'#8A5D05': color_mapping?.background_secondary,
		'#0000008A': color_mapping?.text_primary,
		'rgba(0,0,0,0.2)': color_mapping?.text_primary,
		'#3563A6': color_mapping?.background_dark,
		'#bcbcbc': color_mapping?.background_secondary,
		'#cfcece': color_mapping?.background_secondary,
		'#df7041': color_mapping?.background_dark,
		'#7ca50c': color_mapping?.text_tertiary,
		'#b1c96e': color_mapping?.text_tertiary,
		'#6b7079': color_mapping?.strokes_secondary,
		'#4f4b4b': color_mapping?.strokes_secondary,
		'rgba(125, 165, 14, 1)': color_mapping?.text_tertiary,
		'rgba(107, 166, 254, 1)': color_mapping?.background_dark,
		'#6BA6FE': color_mapping?.background_dark,
		'rgba(210, 206, 206, 0.231)': color_mapping?.strokes_secondary,
		'rgb(218, 0, 0)': color_mapping?.strokes_tertiary,
		'#DADDE3': color_mapping?.grey_1,
		'#14885F': color_mapping?.text_tertiary,
		'#F7F7F7': color_mapping?.background_secondary,
		'#F7DBCF': color_mapping?.background_secondary,
		'#4f5655': color_mapping?.strokes_secondary,
		'#bdbdbd': color_mapping?.strokes_secondary,
		'#9AA0AA66': color_mapping?.strokes_secondary,
		'rgb(37, 40, 45)': color_mapping?.text_primary,
		'#065465': color_mapping?.primary,
		'#E9F5F5': fixed_color?.antiFlashWhite,
	};
	const color_data = handle_map_colors(original_colors, mapped_colors, linked_color_data);
	return color_data;
};

const lightTheme = (config_data: any) => {
	const font_mapping = config_data?.font_mapping;
	const linked_color = config_data?.linked_color;
	const fixed_color = config_data?.fixed_color;
	const font_config = config_data?.fonts;
	//custom styles
	const product_settings = config_data?.product_settings;
	const pdp_settings = config_data?.pdp_settings;
	const border_radius = config_data?.border_radius;
	const account_settings = config_data?.account_settings;
	const order_settings = config_data?.order_settings;

	const common: any = commonTheme(font_config, font_mapping);

	//colors
	const color_config_data = handle_color_config_data(linked_color, fixed_color);
	//fonts
	const { primary_font, secondary_font, tertiary_font } = handle_font_config_data(font_mapping, font_config);

	return createTheme({
		...common,
		palette: {
			...common.palette,
			primary,
			secondary,
			colors,
			warning,
			text_colors,
			background_colors,
			background: {
				default: color_config_data?.whiteColor,
				paper: color_config_data?.athensGrayColor,
			},
			divider: color_config_data?.dividerColor,
			mode: color_config_data?.pureLightColor,
		},

		env_container: {
			backgroundColor: color_config_data?.vividTangerineColor,
		},
		insights: {
			dashboard: {
				background: '#FFF',
				text_color: '#676D77',
				chip_bg_color: '#EEF1F7',
			},
			action_color: '#ddd4d1',
			alert: {
				icon_color: '#3563A6',
				bg_color: '#F0F6FF',
			},
			header: {
				color: '#4F555E',
				bg_color: '#f5f5f5',
			},
			sorting: '#F7F8F8',
			chip_color: 'rgba(242, 244, 247, 1)',
			chip_border: '1px solid rgba(0, 0, 0, 0.12)',
			background: '#F2F4F7',
			container: '#E5E5E5',
			more_color: '#5B7C00',
			less_color: '#D74C10',
			black_color: '#000000',
			add_color: '#16885F',
		},
		typography: {
			...common?.typography,
			color: color_config_data?.pureBlackColor,
			transition: '0.2ms ease-in-out',
		},
		filters: {
			date: {
				selected_color: config_data?.fixed_color?.grey_3,
				border: config_data?.fixed_color?.grey_3,
				border_color: config_data?.fixed_color?.grey_3,
				background_color: '#FFFFFF',
				border_radius: config_data?.border_radius?.dropdown?.primary,
			},
		},
		button: {
			color: color_config_data?.primaryColor,
			bg_color: color_config_data?.primaryColor,
			hover_bg: color_config_data?.primaryColor,
			hover_bg_color: color_config_data?.primaryColor,
			hover_color: color_config_data?.whiteColor,
			btn_color: color_config_data?.whiteColor,
			contained_color: color_config_data?.whiteColor,
			contained_bg_color: color_config_data?.primaryColor,
			container_hover_bg_color: color_config_data?.primaryColor,
			outlined_color: color_config_data?.primaryColor,
			outlined_bg_color: color_config_data?.pureTransparentColor,
			text_color: color_config_data?.primaryColor,
			text_bg_color: color_config_data?.pureTransparentColor,
			tonal_color: color_config_data?.whiteColor,
			tonal_bg_color: color_config_data?.primaryColor,
			tonal_hover_bg_color: color_config_data?.primaryColor,
		},
		radio: {
			color: color_config_data?.primaryColor,
		},
		skeleton: {
			background: color_config_data?.backGroundLightBlackColor,
			transition: '0.2ms ease-in-out',
		},
		menu: {
			color: color_config_data?.backGroundLightBlackColor,
		},
		menu_item: {
			color: color_config_data?.grayChateauColor,
		},
		retail_mode: {
			background: color_config_data?.backgroundColor,
			text: color_config_data?.grey_7,
		},
		view_user_info: {
			user_icon: {
				background: color_config_data?.backgroundColor,
			},
		},
		button_width_align: {
			width: '93%',
		},
		login_stepper_style: {
			color: color_config_data?.primaryColor,
		},
		backwords_icon_style: {
			color: color_config_data?.greyColor,
		},
		signup_button_custom_style: {
			backgroundColor: color_config_data?.primaryColor,
			textTransform: 'none',
		},
		custom_font_style: {
			fontFamily: primary_font?.fontFamily,
			color: color_config_data?.primaryColor,
		},
		edit_field_error_style: {
			fontFamily: primary_font?.fontFamily,
		},
		login: {
			primary: color_config_data?.lightBlackColor,
			secondary: color_config_data?.rgbaBlackColor,
			background: color_config_data?.white_color,
			icon: color_config_data?.grayChateauColor,
			error: color_config_data?.accentColor,
		},
		page_header_component: {
			zIndex: 10,
			primary: color_config_data?.greyColor,
			secondary: color_config_data?.bodyTextColor,
			tear_sheet: color_config_data?.primaryColor,
			pdf: original_colors.BrightRed,
			excel: original_colors?.rgbLightGreen2Color,
			icon_container: {
				border: `1px solid ${color_config_data?.mischkaColor}`,
				background: color_config_data?.white_color,
			},
			tear_icon_container: {
				border: `1px solid ${color_config_data?.primaryColor}`,
				background: color_config_data?.white_color,
			},
			buyer_switch: {
				text: {
					color: color_config_data?.burnHamColor,
				},
				icon: {
					color: color_config_data?.NevadaColor,
				},
				buyer_container: {
					background: color_config_data?.solitudeColor,
					border: `1px solid ${color_config_data?.pureTransparentColor} !important`,
					'&:hover': {
						border: `1px solid ${color_config_data?.borderBlackColor}`,
					},
				},
				buyer_container2: {
					'&:hover': {
						border: `1px solid ${color_config_data?.blackColor} !important`,
					},
				},
				show_red_dot: {
					border: `1px solid ${color_config_data?.pureBlackColor}`,
				},
			},
		},

		select_buyer_panel: {
			iconX: color_config_data?.greyColor,
			customer_count: { color: color_config_data?.customBlackColor },
			infinite_scrollbar: {
				circular_progress_bar: { color: color_config_data?.rgbLightGreenColor },
			},
			header_section: {
				borderBottom: `1px solid ${color_config_data?.rgbIceBlueColor}`,
			},
			guest_buyer: {
				borderBottom: `1px dashed ${color_config_data?.rgbIceBlueColor}`,
			},
			container: {
				border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
			},
			cart_icon_container: {
				background: color_config_data?.white_color,
			},
			unselected_buyer_card: {
				border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
			},
			selected_buyer_card: {
				background: color_config_data?.transparentColor,
				border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
			},
			all_buyer_card: {
				text_color: color_config_data?.mineShaftColor,
				icon_color: color_config_data?.iconColor,
				image_box: {
					background: color_config_data?.athsSpecialColor,
				},
			},
			guest_buyer_card: {
				title: color_config_data?.mineShaftColor,
				subtitle: color_config_data?.subTitleColor,
				icon_color: color_config_data?.iconColor,
				image_box: {
					background: color_config_data?.athsSpecialColor,
				},
			},
			add_buyer_card: {
				title: color_config_data?.mineShaftColor,
				subtitle: color_config_data?.subTitleColor,
				icon_color: color_config_data?.primaryColor,
				image_box: {
					background: color_config_data?.edgeWaterColor,
				},
			},
			cart: {
				badge_style: {
					background: color_config_data?.accentColor,
					color: color_config_data?.white_color,
				},
				icon: {
					color: color_config_data?.grayChateauColor,
				},
			},
			buyer_card: {
				initials: {
					background: color_config_data?.mandysPinkColor,
					color: color_config_data?.fireColor,
				},
				buyer_data: {
					name: color_config_data?.mineShaftColor,
					location: color_config_data?.subTitleColor,
					sales: color_config_data?.mineShaftColor,
				},
				progress_bar: {
					color: color_config_data?.rgbLightGreenColor,
				},
				dummy_array: [
					{ background: color_config_data?.mandysPinkColor, color: color_config_data?.fireColor },
					{ background: color_config_data?.peachYellowColor, color: color_config_data?.geebungColor },
					{ background: color_config_data?.periwinkleColor, color: color_config_data?.indigoColor },
				],
			},
		},
		dashboard: {
			buyer_switch: {
				custom_styles: {
					background: color_config_data?.white_color,
				},
			},
			analytics: {
				total_revenue: {
					band_color: color_config_data?.edgeWaterColor,
					icon_color: color_config_data?.primaryColor,
				},
				total_orders: {
					band_color: color_config_data?.solitudeColor,
					icon_color: color_config_data?.indigoColor,
				},
				total_quotes: {
					band_color: color_config_data?.selagoColor,
					icon_color: color_config_data?.LavenderBlue,
				},
				drafts: {
					band_color: color_config_data?.pearlLustaColor,
					icon_color: color_config_data?.BurntOrange,
				},
			},
			analytics_card: {
				analytics_card_container: {
					background: color_config_data?.white_color,
				},
				icon_chev: {
					color: color_config_data?.TransparentBlack2,
				},
				custom_text: {
					color: color_config_data?.blackTextColor,
				},
			},
			time_range: {
				typography: {
					color: color_config_data?.burnHamColor,
				},
				icon: {
					color: color_config_data?.NevadaColor,
				},
				label_container: {
					background: color_config_data?.white_color,
					border: `1px solid ${color_config_data?.pureBlackColor}`,
				},
				red_dot: {
					background: color_config_data?.accentColor,
				},
			},
			sales_rep: {
				label_container: {
					background: color_config_data?.white_color,
					border: `1px solid ${color_config_data?.pureBlackColor}`,
				},
				red_dot: {
					background: color_config_data?.accentColor,
				},
				typography: {
					color: color_config_data?.burnHamColor,
				},
				icon: {
					color: color_config_data?.NevadaColor,
				},
			},
		},
		buyer_dashboard: {
			page_title: {
				color: color_config_data?.iconColor,
			},
			credits: {
				container: {
					borderTop: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
					borderBottom: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
				},
				primary: color_config_data?.darkGreyColor,
				secondary: color_config_data?.lightBlackColor,
			},
			buyer_info_card: {
				background: color_config_data?.whiteColor2,
				primary: color_config_data?.primaryColor,
				secondary: color_config_data?.edgeWaterColor,
				tertiary: color_config_data?.NevadaColor,
				text: color_config_data?.grayChateauColor,
				text2: color_config_data?.greyColor,
				border: `1px solid ${color_config_data?.TransparentBlack3}`,
			},
		},
		sub_value_style: {
			color: color_config_data.blackColor,
		},
		profile_style: {
			color: color_config_data?.greyColor,
		},
		wishlist_style: {
			border_radius: border_radius?.card?.primary,
			iconColor: color_config_data?.primaryColor,
			text_color: color_config_data?.primaryColor,
		},
		create_password_style: {
			backgroundColor: fixed_color?.primary_light,
			color: fixed_color?.primary,
		},
		change_password_style: {
			icon_color: color_config_data?.grayChateauColor,
		},
		account_header_style: {
			color: color_config_data?.text_primary,
		},
		account_border_style: {
			border: `1px solid ${color_config_data?.transparentBlackColor}`,
		},
		order_count_gap: {
			margin: '20px 0px',
		},
		view_buyer: {
			custom_card_style: {
				border: `1px solid ${color_config_data?.lightGreyColor2}`,
			},
			header: {
				text: color_config_data?.whiteColor2,
				credits: {
					background: `var(${color_config_data?.lightGreyColor2}, ${color_config_data?.zirconColor})`,
					text: color_config_data?.IndigoBlue,
					border: `2px solid ${color_config_data?.whiteColor2}`,
				},
			},
			basic_details: {
				primary: color_config_data?.secTextColor,
				secondary: color_config_data?.pureGreyColor,
				background: color_config_data?.white_color,
			},
			chip: {
				text: color_config_data?.pureBlackColor,
				background: color_config_data?.catskillWhiteColor,
				border: `2px solid ${color_config_data?.white_color}`,
			},
			avatar: {
				background: color_config_data?.peachYellowColor,
				color: color_config_data?.geebungColor,
			},
			other_details: {
				background: color_config_data?.white_color,
				link: color_config_data?.lightBlackColor,
				upload: {
					borderRadius: config_data?.border_radius?.form_elements?.primary,
					primary: color_config_data?.primaryColor,
					secondary: color_config_data?.grayChateauColor,
					border: `1px dashed ${color_config_data?.greyColor}`,
				},
				chip: {
					borderRadius: border_radius?.chip?.primary,
					background: color_config_data?.secondary,
					text: color_config_data?.pureBlackColor,
				},
				empty_state: {
					icon: color_config_data?.grayChateauColor,
					text: color_config_data?.greyColor,
				},
				card: {
					icon: color_config_data?.grayChateauColor,
					icon_hover: color_config_data?.pureBlackColor,
					text: color_config_data?.NevadaColor,
					border: `1px solid var(${color_config_data?.SilverGray} , ${color_config_data?.lightGreyColor2})`,
					primary_text: color_config_data?.iconColor,
					primary_background: color_config_data?.athsSpecialColor,
					default_text: color_config_data?.indigoColor,
					text_color: color_config_data?.primaryColor,
					default_background: `${fixed_color?.primary_light}`,
				},
			},
		},
		quick_add_buyer: {
			primary: color_config_data?.pureBlackColor,
			secondary: color_config_data?.lightBlackColor,
			tertiary: color_config_data?.bodyTextColor,
			error_text: color_config_data?.accentColor,
			background: color_config_data?.whiteColor2,
			box_shadow: `0 -2px 5px ${color_config_data?.shadowBlackColor}`,
			border: `1px solid ${color_config_data?.shadowBlackColor}`,
			new_customer_upload_text: color_config_data?.silverChaliceColor,
			header: {
				text: color_config_data?.greyColor,
			},
			icon: color_config_data?.silverTreeColor,
			card_text: color_config_data?.primaryColor,
			card_background: color_config_data?.backgroundColor,
			copy: color_config_data?.primaryColor,
			tax_preferences: {
				background1: color_config_data?.backgroundColor,
				background2: `var(${color_config_data?.lightGreyColor2} , ${color_config_data?.zirconColor})`,
				text: color_config_data?.textBlackColor,
			},
			buyer_other_details: {
				attachments_border: `1px dashed ${color_config_data?.silverSand}`,
				primary: color_config_data?.primaryColor,
				secondary: color_config_data?.grayChateauColor,
			},
			drop_zone: {
				fontFamily: secondary_font?.fontFamily,
				border: `1px dashed ${color_config_data?.silverSand}`,
				icon: color_config_data?.blackColor,
				text: color_config_data?.silverChaliceColor,
				new_customer_text: color_config_data?.bodyTextColor,
			},
			attachment_logo_style: {
				marginTop: '1rem',
			},
		},
		status: {
			border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
			background: color_config_data?.white_color,
		},
		stats: {
			custom_text: {
				color: color_config_data?.customBlackColor,
				background: color_config_data?.altoColor,
			},
		},
		one_column_forms: {
			form_container: {
				scrollbarColor: `${color_config_data?.Silver2} ${color_config_data?.wildSandColor}`,
				'&::-webkit-scrollbar-track': {
					backgroundColor: color_config_data?.wildSandColor,
				},
				'&::-webkit-scrollbar-thumb': {
					backgroundColor: color_config_data?.MistyGray,
					borderRadius: '4px',
				},
			},
			inner: {
				backgroundColor: color_config_data?.whiteColor,
			},
		},
		permissions_component: {
			border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
		},
		create_buyer_drawer: {
			icon: {
				color: color_config_data?.NevadaColor,
			},
		},
		user_drive: {
			upper_header: {
				icon_color: color_config_data?.white_color,
			},
			pdf_viewer: {
				border: `1px solid ${color_config_data?.grayChateauColor}`,
				style: {
					lft_cont_background_color: secondary?.[300],
					right_cont_background_color: color_config_data?.backgroundColor,
					page_number_background_color: color_config_data?.silverColor,
					page_number_color: color_config_data?.white_color,
				},
			},
			email_modal: {
				form_helper_color: color_config_data?.pureRedColor,
				fragment_color: color_config_data?.primaryColor,
			},
			file_component: {
				icon_color: color_config_data?.white_color,
				icon_file_color: color_config_data?.iconColor,
				file_include_color: color_config_data?.PumpkinOrange,
				file_not_include_color: color_config_data?.fileNotIncludeColor,
				file_video_color: color_config_data?.athsSpecialColor,
				file_video_include_color: color_config_data?.fileVideoIncludeColor,
				file_video_not_include_color: color_config_data?.fileVideoNotIncludeColor,
				box_border_color: color_config_data?.alto2Color,
				custom_text_color: color_config_data?.customTextColor,
				style: {
					label_container_background: color_config_data?.white_color,
					file_background_color: color_config_data?.whiteColor2,
					menu_label_background_color: color_config_data?.silverColor,
					email_box_background_color: color_config_data?.backgroundColor,
					email_container_background_color: color_config_data?.whiteColor2,
				},
			},
			message_modal: {
				background1: color_config_data?.mineColor,
				background2: color_config_data?.pureGreenColor,
				text: color_config_data?.white_color,
			},
			manage_access_modal: {
				background1: color_config_data?.white_color,
				background2: color_config_data?.solitude2Color,
				primary: color_config_data?.customBlackColor,
				secondary: color_config_data?.rgbLightGreen2Color,
			},
			upload_modal: {
				background: color_config_data?.white_color,
				box_shadow: `0px 4px 40px 0px ${color_config_data?.lightGreyColor}`,
				header_background: color_config_data?.doveGreyColor,
				primary: color_config_data?.white_color,
				secondary: color_config_data?.pureBlackColor,
				tertiary: color_config_data?.SpringGreen,
				failed: color_config_data?.pureRedColor,
			},
			file_preview: {
				active_hover_color: color_config_data?.NevadaColor,
				inactive_hover_color: color_config_data?.grayChateauColor,
				custom_text_color: color_config_data?.doveGreyColor,
			},
			preview_style: {
				background_color: color_config_data?.rgbaBlack2Color,
				primary_color: color_config_data?.white_color,
				secondary_color: color_config_data?.backgroundColor,
			},
			filter_section: {
				box_background_color: color_config_data?.backgroundColor,
				label_background_color: color_config_data?.white_color,
				custom_text_color: color_config_data?.burnHamColor,
				icon_color: color_config_data?.NevadaColor,
			},
			folder_component: {
				label_container_background: color_config_data?.white_color,
				container_background_color: color_config_data?.white_color,
				container_box_shadow: `0px 4px 24px 0px ${color_config_data?.lightGreyColor}`,
				icon_color: color_config_data?.LimeGreen,
				custom_text_color: color_config_data?.customTextColor,
				custom_icon_color: color_config_data?.altoColor,
				menu_color: color_config_data?.customTextColor,
			},
			user_drive_main: {
				icon_color: color_config_data?.white_color,
				custom_text_color: color_config_data?.customTextColor,
				box_icon_color: color_config_data?.customBlackColor,
				box_custom_color: color_config_data?.customBlackColor,
				tool_icon_color: color_config_data?.SlateGray,
				style: {
					hover_items_background_color: color_config_data?.pureRedColor,
					loader_background_color: color_config_data?.rgbaBlack2Color,
					empty_background_color: color_config_data?.white_color,
					selected_header_container_background_color: color_config_data?.backgroundColor,
					selected_header_background_color: color_config_data?.solitude2Color,
					folder_skeleton_background_color: color_config_data?.white_color,
					files_skeleton_background_color: color_config_data?.white_color,
				},
			},
		},
		import_export: {
			data_card: {
				border1: `1px solid ${color_config_data?.grayChateauColor}`,
				border2: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
				box_shadow: `0px 4px 24px 0px ${color_config_data.backGroundLightBlackColor}`,
			},
			date_filter_comp: {
				border: `1px solid ${color_config_data?.bombayColor}`,
				background: color_config_data?.transparentColor,
			},
			export_modal: {
				icon_color: color_config_data?.greyColor,
				background: color_config_data?.white_color,
			},
			data_cards_container: {
				background: color_config_data?.white_color,
			},
			icon_circle: {
				color: color_config_data?.whiteRockColor,
			},
		},
		check_box_style: {
			color: color_config_data?.primaryColor,
		},
		global_search: {
			outlined_input: {
				height: '46px',
				fontSize: '1.4rem',
				borderColor: color_config_data?.textPrimaryColor,
				background: `${color_config_data?.whiteColor} !important`,
			},
			input_dropdown_text: {
				borderLeft: `1px solid ${color_config_data?.dividerColor2}`,
				marginLeft: '8px',
				fontSize: '16px',
				color: color_config_data?.subTitleColor,
				fontWeight: '400',
				height: '46px',
			},
			dropdown_container: {
				boxShadow: `0 6px 18px ${color_config_data?.gradientColor}`,
			},
			default_chip: {
				borderRadius: '4px',
				background: `linear-gradient(270deg, ${fixed_color?.primary} 0%,  ${fixed_color?.primary_dark} 100%)`,
			},
			list_item_button: {
				borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
				padding: '16px',
			},
			list: {
				padding: '0px',
			},
			chip: {
				background: color_config_data?.chipColor,
				color: color_config_data?.NevadaColor,
			},
			previous_search_container: {
				zIndex: 1000,
			},
		},
		order_management: {
			custom_color_: {
				color: color_config_data?.genoaColor,
			},
			custom_text_color_style: {
				color: color_config_data?.customBlackColor,
			},
			finix_form: {
				fontFamily: primary_font?.fontFamily,
			},
			status_chip_style: {
				...order_settings?.status_chip_settings,
			},
			custom_price_align: {
				padding: '0.8rem',
				borderRadius: 0,
			},
			add_products_style: {
				border: `1px solid ${color_config_data?.primaryColor}`,
			},
			account_list: {
				color: color_config_data?.geebungColor,
			},
			active_card_style: {
				border: `1px solid ${color_config_data?.primaryColor}`,
			},
			fallback_order_end_status_container: {
				background: `linear-gradient(to bottom, ${fixed_color?.primary_light} 0, ${fixed_color?.primary_light} 28rem, white 28rem, white 100%)`,
			},
			card_style: {
				border: `1px solid ${color_config_data?.mischkaColor}`,
			},
			consolidated_container: {
				background: color_config_data?.blackHazeColor,
			},
			cart_checkout_card: {
				color: color_config_data?.geebungColor,
				background: color_config_data?.peachYellowColor,
				card_background: color_config_data?.white_color,
				grid_background: color_config_data?.alabasterColor,
				border: 'none',
				borderRadius: '8px',
				cart_color: color_config_data?.rgbaBlackColor,
				sub_discount_color: color_config_data?.mediumBlackColor,
				review_term_and_cond_color: color_config_data?.primaryColor,
				item_terms_and_conditions: color_config_data?.textPrimaryColor,
				text_decoration_line: 'none !important',
			},
			cart_border_style: {
				border: 'none',
			},
			cart_counter_style: {
				color: color_config_data?.black,
			},
			cart_summary_counter_style: {
				color: color_config_data?.greyColor,
			},
			custom_gap_style: {
				marginTop: '6px',
			},
			cart_summary: {
				color: color_config_data?.pureGreyColor,
				typo_color: color_config_data?.primaryColor,
				content_background: color_config_data?.white_color,
				title_background_color: color_config_data?.white_color,
			},
			cart_summary_item: {
				icon_color: color_config_data?.altoColor,
				custom_color: color_config_data?.whiteColor2,
			},
			charge_modal: {
				valid_color: color_config_data?.primaryColor,
				invalid_color: color_config_data?.grayChateauColor,
				label_color: color_config_data?.pureBlackColor,
				custom_color: color_config_data?.rgbaBlackColor,
				border: `1.4px solid ${color_config_data?.rgbaBorderBlackColor}`,
				borderBottom: `1px dashed ${color_config_data?.priceTextBlackColor}`,
				selected_background: color_config_data?.harpColor,
				unselected_background: color_config_data?.white_color,
			},
			custom_style: {
				paddingTop: '32px',
			},
			header: {
				render_tear_color: color_config_data?.Charcoal,
				icon_color: color_config_data?.greyColor,
				custom_color: color_config_data?.pureBlackColor,
				box_custom_color: color_config_data?.primaryColor,
				box_icon_color: color_config_data?.primaryColor,
				chip_border: `2px solid ${color_config_data?.white_color}`,
			},
			empty_address: {
				background: color_config_data?.backgroundColor,
				color: color_config_data?.NevadaColor,
				text: color_config_data?.secondaryColor,
			},
			payment_active_card: {
				border: `1px solid ${color_config_data?.primaryColor}`,
				small_screen_border: `1px solid ${color_config_data?.mischkaColor}`,
			},
			invoices: {
				grid_background: color_config_data?.whiteishColor,
			},
			order_end_status_container: {
				...order_settings?.confirmation_page_settings,
			},
			order_end_status_text_color: {
				color: color_config_data?.NevadaColor,
			},
			order_end_status_info_container: {
				custom_color: color_config_data?.greyColor,
				custom_text_color: color_config_data?.pureBlackColor,
				icon_color: color_config_data?.grayChateauColor,
				box_bgcolor: color_config_data?.fileVideoNotIncludeColor,
				custom_box_color: color_config_data?.geebungColor,
				custom_image_color: color_config_data?.whiteColor,
				box_icon_color: color_config_data?.altoColor,
				grid_custom_color: color_config_data?.customBlackColor,
				background_color: color_config_data?.white_color,
				custom_background_color: color_config_data?.pureTransparentColor,
				payment_background_color: color_config_data?.white_color,
				border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
				account_list_background_color: color_config_data?.white_color,
				accordion_content_background: color_config_data?.white_color,
				cart_checkout_card_background: color_config_data?.pureTransparentColor,
			},
			order_manage_container: {
				background_color: color_config_data?.white_color,
				hr_border_top: `1px solid ${color_config_data?.mischkaColor}`,
			},
			payment_link: {
				icon_style_color: color_config_data?.primaryColor,
				icon_dis_style_color: color_config_data?.tempBlackColor,
				icon_color: color_config_data?.greyColor,
			},
			payment_table: {
				icon_color: color_config_data?.greyColor,
				custom_color: color_config_data?.pureBlackColor,
				bg_color: color_config_data?.loaferColor,
				custom_text_color: color_config_data?.indigoColor,
				grid_custom_color: color_config_data?.accentColor,
				grid_payment_color: color_config_data?.rgbLightGreen2Color,
				grid_transaction_valid_color: color_config_data?.VibrantGreen,
				grid_transaction_invalid_color: color_config_data?.SkyBlue,
				border: `1px solid ${color_config_data?.rgbaBlack3Color}`,
			},
			payment_details_drawer_header: {
				padding: '1.6rem 2.4rem',
			},
			payment_details_drawer: {
				padding: '0.6rem 2.4rem',
			},
			download_icon: {
				background: color_config_data?.white_color,
			},
			add_edit_payment: {
				icon_color: color_config_data?.primaryColor,
				custom_color: color_config_data?.primaryColor,
			},
			change_address: {
				box_bg_color: color_config_data?.backgroundColor,
				chip_bg_color: color_config_data?.edgeWaterColor,
				chip_text_color: color_config_data?.primaryColor,
			},
			change_contact_drawer: {
				box_bg_color: color_config_data?.pureTransparentColor,
			},
			collect_drawer_skeleton: {
				bg_color: color_config_data?.greenHazeColor,
			},
			refund_drawer_skeleton: {
				bgcolor: color_config_data?.greenHazeColor,
			},
			refund_payment_drawer: {
				grid_background: color_config_data?.offYellowColor,
				text_field_color: color_config_data?.pureBlackColor,
				custom_color: color_config_data?.pureRedColor,
				grid_custom_color: color_config_data?.lightBlackColor,
			},
			send_mail_drawer: {
				chip_bg_color: color_config_data?.white_color,
				chip_text_color: color_config_data?.pureBlackColor,
				email_grid_chip_bg_color: color_config_data?.harpColor,
				email_grid_chip_text_color: color_config_data?.pureBlackColor,
				grid_chip_bg_color: color_config_data?.white_color,
				grid_chip_text_color: color_config_data?.pureBlackColor,
			},
			send_mail_drawer_form: {
				padding: '1rem 0 0',
			},
			send_order_confirmation_drawer: {
				chip_bg_color: color_config_data?.white_color,
				chip_border: `1px solid ${color_config_data?.greyColor}`,
				chip_text_color: color_config_data?.pureBlackColor,
				email_grid_chip_bg_color: color_config_data?.harpColor,
				email_grid_chip_text_color: color_config_data?.pureBlackColor,
				grid_chip_bg_color: color_config_data?.white_color,
				grid_chip_text_color: color_config_data?.pureBlackColor,
			},
			notes_section: {
				custom_valid_color: color_config_data?.accentColor,
				custom_invalid_color: color_config_data?.pureBlackColor,
				custom_color: color_config_data?.accentColor,
				cursor_custom_color: color_config_data?.primaryColor,
				fontFamily: primary_font?.fontFamily,
			},
			order_quote_section: {
				custom_color: color_config_data?.primaryColor,
				custom_valid_color: color_config_data?.accentColor,
				custom_invalid_color: color_config_data?.pureBlackColor,
			},
			payment_method_section: {
				custom_color: color_config_data?.customBlackColor,
				cursor_custom_color: color_config_data?.primaryColor,
				chip_color: color_config_data?.primaryColor,
			},
			terms_section: {
				custom_color: color_config_data?.accentColor,
				custom_valid_color: color_config_data?.accentColor,
				custom_invalid_color: color_config_data?.pureBlackColor,
				grid_container_bgcolor: color_config_data?.white_color,
				cursor_custom_color: color_config_data?.primaryColor,
			},
			user_detail_section: {
				empty_state_color: color_config_data?.greyColor,
				custom_valid_color: color_config_data?.accentColor,
				custom_invalid_color: color_config_data?.pureBlackColor,
				all_value_empty_color: color_config_data?.accentColor,
				email_custom_color: color_config_data?.NevadaColor,
				icon_color: color_config_data?.grayChateauColor,
				cursor_custom_color: color_config_data?.primaryColor,
			},
			action_comp: {
				icon_style_color: color_config_data?.NevadaColor,
				icon_hover_color: color_config_data?.pureBlackColor,
			},
			order_listing: {
				cell_background_color: color_config_data?.pureTransparentColor,
			},
			custom_margin: {
				margin: '32px 0px',
			},
			order_management: {
				icon_color: color_config_data?.CornflowerBlue,
				alert_background: color_config_data?.white_color,
			},
			location_search: {
				fontFamily: `${primary_font?.fontFamily} !important`,
			},
			location_search_container: {
				border: `1px solid ${color_config_data?.tempBlackColor}`,
			},
			ultron_active_card_style: {
				width: '100%',
				cursor: 'pointer',
				borderRadius: 12,
				background: color_config_data?.backgroundColor,
				border: `1px solid ${color_config_data?.primaryColor}`,
			},
			ultron_card_style: {
				width: '100%',
				cursor: 'pointer',
				borderRadius: 12,
				border: `1px solid ${color_config_data?.mischkaColor}`,
			},
			style: {
				text_style_color: color_config_data?.NevadaColor,
				checkbox_color: color_config_data?.primaryColor,
				change_billing_address_style_border: `1px solid ${color_config_data?.mischkaColor}`,
				primary_chip_bg_color: `${fixed_color?.primary_light}`,
				primary_chip_color: `${color_config_data?.primaryColor}`,
				primary_chip_border_radius: border_radius?.chip.secondary,
				change_shipping_address_style_border: `1px solid ${color_config_data?.mischkaColor}`,
				change_contact_drawer_style_border: `1px solid ${color_config_data?.primaryColor}`,
				charge_warning_background: color_config_data?.fileVideoNotIncludeColor,
				charge_error_background: color_config_data?.fileVideoIncludeColor,
				charge_warning_icon: color_config_data?.brownWarningIcon,
				charge_error_icon: color_config_data?.pureRedColor,
				charge_warning_color: color_config_data?.NevadaColor,
				section_notes_text_style_color: color_config_data?.pureGreyColor,
				user_details_section_icon_style_color: color_config_data?.grayChateauColor,
				section_notes_value_text_color: color_config_data?.pureGreyColor,
				charge_text_style_color: color_config_data?.primaryColor,
				discount_color_valid_color: color_config_data?.fireColor,
				discount_color_invalid_color: color_config_data?.pureBlackColor,
				grid_container_style_background_color: color_config_data?.white_color,
				icon_style_color: color_config_data?.greyColor,
				icon_style_hover_color: color_config_data?.rgbHoverBlackColor,
				icon_container_border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
				note_text_label_color: color_config_data?.customBlackColor,
				note_text_value_color: color_config_data?.customBlackColor,
				discount_bar_background: `linear-gradient(90deg, ${color_config_data?.loaferColor} 1.82%, ${color_config_data?.blackSqueezeColor} 73.18%)`,
				discount_header_color: `var(${color_config_data?.catskillWhiteColor}, ${color_config_data?.nominalDarkColor})`,
				custom_label_color: color_config_data?.white_color,
				text_color: color_config_data?.rgbaBlackColor,
				price_text_color: color_config_data?.priceTextBlackColor,
				discount_img_color: color_config_data?.greyColor,
				cart_item_text_container_color: color_config_data?.customBlackColor,
				cart_item_price_background_color: color_config_data?.backgroundColor,
				order_info_style_color: `var(${color_config_data?.NevadaColor} , ${color_config_data?.greyColor})`,
				order_end_status_icon_style_color: color_config_data?.grayChateauColor,
				view_details_card_border: `1px solid ${color_config_data?.mischkaColor}`,
				cart_checkout_card_background: color_config_data?.backgroundColor,
				cart_checkout_card_border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
				cart_checkout_total_price_background_color: color_config_data?.alabasterColor,
				order_more_section_container_background_color: color_config_data?.backWhiteColor,
				order_more_section_container_v2_background_color: color_config_data?.backWhiteColor,
				drawer_header_container_background_color: color_config_data?.white_color,
				drawer_header_container_border_bottom: `1px solid ${color_config_data?.catskillWhiteColor}`,
				drawer_content_container_background_color: color_config_data?.white_color,
				drawer_footer_container_border_top: `1px solid ${color_config_data?.catskillWhiteColor}`,
				drawer_footer_container_background_color: color_config_data?.backWhiteColor,
				hide_over_flowing_text_color: color_config_data?.emperorColor,
				end_status_info_container_background_color: color_config_data?.whiteColor2,
				submit_banner_icon_color: color_config_data?.VibrantGreen,
				cancel_banner_icon_color: color_config_data?.BrightRed,
				check_icon: color_config_data?.greyColor,
				step_separator_background: color_config_data?.mischkaColor,
				custom_tag_on_image_background: color_config_data?.rgbBlackColor,
				order_end_status_container_text_style_color: color_config_data?.lightBlackColor,
				container_cart_border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
				container_cart_background: color_config_data?.whiteColor2,
				container_info_background: color_config_data?.athensGrayColor,
				icon_delivery_color: color_config_data?.greyColor,
				text_primary_color: color_config_data?.greyColor,
				text_secondary_color: color_config_data?.greyColor,
				total_cbm_info_background: color_config_data?.zirconColor,
				cart_table_header_container_background_color: color_config_data?.antiFlashWhite,
				cart_shipped_product_header_background_color: color_config_data?.zirconColor,
				cart_table_header_container_v2_background_color: color_config_data?.antiFlashWhite,
				cart_item_container_border: `1px solid ${color_config_data?.transparentBlackColor}`,
				cart_shipped_container_border: `1px solid ${color_config_data?.transparentBlackColor}`,
				cart_item_container_v2_border: `1px solid ${color_config_data?.transparentBlackColor}`,
				grid_container_background: color_config_data?.whiteColor,
				grid_container_background_color: color_config_data?.harpColor,
				chip_hover_effect_background_color: color_config_data?.harpColor,
				icon_color: color_config_data?.genoaColor,
				text_decoration_line: 'underline',
			},
			saved_card: {
				container: {
					backgroundColor: color_config_data?.backgroundColor,
					small_screen_background: color_config_data?.white_color,
				},
				text_style: {
					color: color_config_data?.customBlackColor,
					small_screen_scolor: color_config_data?.NevadaColor,
				},
				icon_style: {
					color: color_config_data?.white_color,
				},
				background: color_config_data?.white_color,
			},
			tracking_message: {
				background: color_config_data?.backgroundColor,
			},
			stepper: {
				active: {
					color: color_config_data?.primaryColor,
				},
				active_step: {
					fontWeight: 'bold !important',
					fontSize: '16px',
					color: `${color_config_data?.primaryColor} !important`,
					fontFamily: `${primary_font?.fontFamily}`,
				},
				in_active: {
					color: color_config_data?.NevadaColor,
				},
				container: {
					background: color_config_data?.backgroundColor,
				},
				stepper_line: {
					color: color_config_data?.bombayColor,
				},
			},
			download_tearsheet: {
				color: color_config_data?.primaryColor,
				display: 'flex',
				alignItems: 'center',
				cursor: 'pointer',
			},
		},
		label: {
			image_comp: {
				background_color: color_config_data?.backgroundColor,
				color: color_config_data?.pureGreyColor,
			},
			label_management: {
				color: color_config_data?.BrightRed,
			},
			drawer_content: {
				background_color: color_config_data?.whiteColor2,
				webkit_scroll_thumb_color: color_config_data?.pureTransparentColor,
				border1: `1px solid ${color_config_data?.genoaColor}`,
				border2: `1px solid ${color_config_data?.LightBlueGray}`,
			},
			not_allowed: {
				background: color_config_data?.fileVideoNotIncludeColor,
			},
			allowed: {
				background: color_config_data?.zirconColor,
			},
			qr_template: {
				default_chip: {
					backgroundColor: color_config_data?.fileNotIncludeColor,
				},
				index: {
					color: color_config_data?.altoColor,
				},
				icon: {
					color: color_config_data?.whiteColor2,
				},
			},
			table: {
				checkbox: {
					color: color_config_data?.EmeraldGreen,
				},
				transform_column: {
					borderColor: color_config_data?.borderColor,
				},
				product_selected: {
					color: color_config_data?.color_config_data?.greyColor,
				},
				btn: {
					backgroundColor: color_config_data?.pureRedColor,
				},
				icon: {
					color: color_config_data?.whiteColor2,
				},
			},
		},
		inventory_management: {
			use_inventory: {
				borderColor: color_config_data?.borderColor,
				background: color_config_data?.pureTransparentColor,
			},
			common_style: {
				backgroundColor: color_config_data?.SnowWhite,
				boxShadow: `0px 0px 12px 1px ${color_config_data.rgbaBlack2Color}`,
			},
		},
		tabs: {
			active_color: color_config_data?.rgbaBlackColor,
			inactive_color: color_config_data?.bombayColor,
		},
		user_management: {
			deactivation_modal: {
				background: color_config_data?.whiteColor2,
			},
			tag_render: {
				text: color_config_data?.pureBlackColor,
				background: color_config_data?.catskillWhiteColor,
			},
			user_manage: {
				border_color: color_config_data?.borderColor,
				background: color_config_data?.pureTransparentColor,
			},
		},
		authflow: {
			token_expired_layout: {
				background: color_config_data?.whiteColor,
			},
			expired_link: {
				color: color_config_data?.rgbaBlackColor,
			},
			login: {
				modal_subtitle_color: color_config_data?.lightBlackColor,
				border_radius: border_radius?.form_elements?.primary,
			},
			signup: {
				custom_stepper: {
					active: {
						color: color_config_data?.primaryColor,
						border_color: color_config_data?.primaryColor,
						fill: color_config_data?.white_color,
					},
					before_active: {
						color: color_config_data?.antiFlashWhite,
						border_color: color_config_data?.NevadaColor,
						fill: color_config_data?.pureBlackColor,
					},
					after_active: {
						color: color_config_data?.whiteColor,
						border_color: color_config_data?.NevadaColor,
						fill: color_config_data?.pureBlackColor,
					},
					step_icon: {
						border: '1px solid',
						border_radius: '50px',
					},
					completed: {
						color: color_config_data?.whiteColor,
						borderColor: color_config_data?.greyColor,
					},
				},
			},
		},
		product: {
			discount_campaign: {
				color: fixed_color?.discount || fixed_color?.primary,
				padding: '3px 4px 0px 4px',
				border: `1px solid ${fixed_color?.discount || fixed_color?.primary}`,
			},
			discount_campaign_banner: {
				display: 'flex',
				flexDirection: 'row',
				gap: '4px',
				padding: '5px 8px 4px 6px',
				width: 'fit-content',
				background: fixed_color?.discount || fixed_color?.primary,
			},

			custom_color_style: {
				color: color_config_data?.rgbaBlackColor,
			},
			search_result_heading: {
				fontFamily: `${tertiary_font?.fontFamily} !important`,
				textTransform: 'uppercase',
			},
			product_show_items: {
				color: color_config_data?.pureGreyColor,
				fontFamily: `${primary_font?.fontFamily}`,
			},
			product_image: {
				borderRadius: '16x',
				...product_settings?.product_card_settings,
			},
			product_border: {
				borderRadius: border_radius?.card?.primary ? border_radius.card.primary : '16px',
			},
			bread_crumb_styles: {
				fontFamily: primary_font?.fontFamily,
				...product_settings?.breadcrumbs_settings,
				marginTop: '24px',
			},
			custom_item: {
				background: color_config_data?.primaryColor,
				color: color_config_data?.backgroundColor,
			},
			product_name: {
				fontFamily: `${primary_font?.fontFamily}`,
				fontWeight: '400',
			},
			filter_fab: {
				background: color_config_data?.white_color,
			},
			product_price: {
				fontFamily: `${primary_font?.fontFamily}`,
				fontWeight: '700',
			},
			hinge_product_detail: {
				fontFamily: `${primary_font?.fontFamily}`,
				fontSize: '12px !important',
				fontWeight: '400',
				color: color_config_data?.pureGreyColor,
			},
			product_id: {
				fontFamily: `${primary_font?.fontFamily}`,
				fontWeight: '400',
			},
			custom_item_CBM: {
				color: color_config_data?.backgroundColor,
				color2: color_config_data?.pureBlackColor,
				notSelected: color_config_data?.secondaryColor,
			},
			product_card: {
				fontFamily: `${primary_font?.fontFamily}`,
				background: color_config_data?.white_color,
				border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
				color: color_config_data?.pureBlackColor,
				transition: '0.2ms ease-in-out',
				'@media (max-width: 600px)': {
					border: 'none',
				},
			},
			product_card_image: {
				border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
			},
			product_variant_chip: {
				color: color_config_data?.pureBlackColor,
				border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
				transition: '0.2ms ease-in-out',
			},
			view_similar_chip: {
				color: color_config_data?.greyColor,
				background: color_config_data?.backgroundColor,
				boxShadow: `0px 4px 8px 0px ${color_config_data?.rgbaBorderBlackColor}`,
				border: `1px solid ${color_config_data?.mischkaColor}`,
				transition: '0.2ms ease-in-out',
			},
			view_similar_chip_text: {
				fontFamily: `${primary_font?.fontFamily}`,
			},
			category_image: {
				background: color_config_data?.white_color,
				border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
				transition: '0.2ms ease-in-out',
			},
			category: {
				border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
				transition: '0.2ms ease-in-out',
			},
			selected_category: {
				border: `2px solid ${color_config_data?.primaryColor} !important`,
				transition: '0.2ms ease-in-out',
			},
			sub_category: {
				background: color_config_data?.whiteColor,
			},
			selected_sub_category: {
				border: `1px solid ${color_config_data?.NevadaColor} !important`,
				background: color_config_data?.whiteColor,
			},
			category_rail: {
				not_selected: {
					border: `1px solid ${color_config_data?.mischkaColor} !important`,
				},
				selected: {
					border: `1px solid ${color_config_data?.textPrimaryColor} !important`,
				},
				imageContainer: {
					border: 'none',
					'&:hover': {
						border: `1px solid ${color_config_data?.textPrimaryColor} !important`,
					},
					width: '80px !important',
					height: '80px !important',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					borderRadius: '50%',
				},
			},
			collection: {
				color: color_config_data?.whiteColor2,
				collection_rail: {
					border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
				},
				header: {
					marginY: '20px',
					fontSize: '26px',
					fontWeight: '400',
					textTransform: 'uppercase',
					fontFamily: `${tertiary_font?.fontFamily}  !important`,
					color: color_config_data?.textPrimaryColor,
				},
			},
			recommanded: {
				card: {
					fontFamily: `${secondary_font?.fontFamily} !important`,
					border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
				},
				sku_id_text: {
					fontFamily: `${primary_font?.fontFamily}`,
					...pdp_settings?.rails_settings?.product_sku_id,
				},
				variant_value: {
					color: color_config_data?.textBlackColor,
					border: `1px solid var(${color_config_data.dividerColor}, ${color_config_data?.rgbaBorderBlackColor})`,
				},
				selected_variant_value: {
					color: color_config_data?.mediumBlackColor,
					border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
					background: color_config_data?.whiteColor2,
				},
				number_of_variants: {
					background: color_config_data?.whiteColor2,
				},
				remove_icon: {
					background: secondary?.[300],
					color: color_config_data?.pureGreyColor,
				},
				add_icon: {
					background: color_config_data?.primaryColor,
					color: color_config_data?.whiteColor2,
				},
				show_count: {
					borderRadius: config_data?.border_radius?.form_elements?.primary,
					background: color_config_data?.whiteColor2,
					color: color_config_data?.primaryColor,
					border: `1px solid ${color_config_data?.mischkaColor}`,
					fontFamily: `${primary_font?.fontFamily}`,
				},
				dot: {
					color: color_config_data?.altoColor,
				},
				add_to_cart: {
					disabled_color: color_config_data?.whiteColor2,
					disabled_background: color_config_data?.bombayColor,
				},
				button: {
					background: color_config_data?.primaryColor,
					...product_settings?.cart_button_settings,
					fontFamily: `${primary_font?.fontFamily}`,
				},
				attr_chip: {
					fontFamily: `${primary_font?.fontFamily}`,
				},
				prod_detail: {
					fontFamily: `${primary_font?.fontFamily}`,
				},
			},
			previous_ordered_card: {
				card_style: {
					border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
				},
				history: {
					background: color_config_data?.backgroundColor,
				},
				attr_icon: {
					color: color_config_data?.altoColor,
				},
				chip_style: {
					background: color_config_data?.loaferColor,
					color: color_config_data?.greyColor,
				},
				order_text: {
					color: color_config_data?.pureGreyColor,
				},
			},
			error_screen: {
				primary: color_config_data?.white_color,
			},
			product_template: {
				list_circle: {
					color: color_config_data?.altoColor,
				},
				date_chip: {
					border: `1px solid ${color_config_data?.white_color}`,
				},
				chip_style: {
					backgroud: color_config_data?.loaferColor,
					color: color_config_data?.greyColor,
				},
			},
			inventory_status: {
				status_container: {
					padding: '0px',
					justifyContent: 'start',
				},
				out_of_stock: {
					color: color_config_data?.greyColor,
					background: color_config_data?.transparentBlackColor,
					fontFamily: `${primary_font?.fontFamily}`,
					container_style: {
						boxShadow: `0px 1px 6px 0px ${color_config_data.rgbaBlack3Color}`,
						color: color_config_data?.accentColor,
						background: fixed_color?.error,
					},
				},
				out_of_stock_chip: {
					color: color_config_data?.whiteColor2,
				},
				custom_back_order: {
					background: color_config_data?.whiteColor,

					color: color_config_data?.greyColor,
				},
				product_list: {
					color: color_config_data?.backgroundColor,
				},
				product_listing_counter_style: {
					color: color_config_data?.blackColor,
				},

				back_order: {
					background: color_config_data?.whiteColor,
					color: color_config_data?.bodyTextColor,
				},
				available: {
					color: color_config_data?.greyColor,
					fontFamily: `${primary_font?.fontFamily}`,
				},

				default: {
					background: color_config_data?.whiteColor,
				},
			},
			inventory_menu: {
				custom_value_color: {
					color: color_config_data?.greyColor,
				},
				label_color: {
					color: color_config_data?.rgbaBlackColor,
				},
			},
			counter: {
				disabled_color: color_config_data?.whiteColor2,
				disabled_background: color_config_data?.primaryGreenDisabled,
				background: color_config_data?.primaryColor,
				hover_background: color_config_data?.primaryColor,
				decrement_icon: {
					background: color_config_data?.catskillWhiteColor,
					color: color_config_data?.NevadaColor,
				},
				input: {
					borderRadius: config_data?.border_radius?.form_elements?.primary,
					fontFamily: `${primary_font?.fontFamily}`,
					border: `1px solid ${color_config_data?.mischkaColor}`,
					color: color_config_data?.blackColor,
					background: color_config_data?.whiteColor2,
				},
				increment_icon: {
					error_style: {
						color: color_config_data?.bombayColor,
						background: color_config_data?.pureGreyColor,
					},
					style: {
						background: color_config_data?.primaryColor,
						color: color_config_data?.alabasterColor,
					},
				},
				error_style: {
					color: color_config_data?.indigoColor,
					background: color_config_data?.whiteishColor,
				},
				suggested_value: {
					color: color_config_data?.indigoColor,
				},
			},
			similar_drawer: {
				edit_icon: {
					color: color_config_data?.primaryColor,
				},
				container: {
					background: color_config_data?.white_color,
					overflowX: 'hidden',
				},
				header: {
					padding: '16px 24px',
				},
				similar_product_list: {
					padding: {
						xs: '11px 0px',
						sm: '11px',
					},
				},
				sub_title: {
					color: color_config_data?.greyColor,
				},
				chip_color: color_config_data?.rgbaBlack2Color,
			},
			variant_drawer: {
				container: {
					background: color_config_data?.white_color,
					padding: '16px 24px !important',
					'@media (max-width: 600px)': {
						padding: '16px 16px !important',
					},
				},
				custom_box: {
					background: color_config_data?.blackHazeColor,
				},
				footer: {
					background: color_config_data?.whiteColor,
				},
				title: {
					color: color_config_data?.secTextColor,
				},
				sub_title: {
					color: color_config_data?.primaryColor,
				},
				button: {
					background: color_config_data?.primaryColor,
				},
				divider: {
					width: 'calc(100% + 5rem)',
					marginLeft: '-3rem !important',
				},
				footer_divider: {
					width: 'calc(100% + 5rem)',
					marginLeft: '-3rem !important',
				},
			},
			variant_detail_card: {
				color: color_config_data?.NevadaColor,
				icon: {
					color: color_config_data?.borderBlackColor,
				},
				tool_tip: {
					color: color_config_data?.white_color,
				},
			},
			cart_drawer: {
				color: color_config_data?.zirconColor,
			},
			cart_item_card: {
				primary: color_config_data?.customBlackColor,
				secondary: color_config_data?.priceTextBlackColor,
				tertiary: color_config_data?.rgbaBlackColor,
				dark_grey: color_config_data?.greyColor,
				light: color_config_data?.white_color,
				discount_bar: {
					background: `linear-gradient(90deg, ${color_config_data?.loaferColor} 1.82%, ${color_config_data?.blackSqueezeColor} 73.18%)`,
				},
				discount_header: {
					color: `var(${color_config_data?.catskillWhiteColor}, ${color_config_data?.nominalDarkColor})`,
				},
				// discount_icon: {
				// 	color: 'linear-gradient( #2D323A, #97B73E)'
				// },
			},
			custom_product_drawer: {
				container: {
					background: color_config_data?.white_color,
				},
				searchAndSort: {
					paddingY: '0px !important',
				},
				header: {
					background: color_config_data?.whiteColor2,
					borderBottom: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
				},
				header_icon: {
					color: color_config_data?.StormyGray,
				},
				header_tooltip: {
					background: color_config_data?.athensGrayColor,
					borderRadius: border_radius?.chip?.primary,
				},
				footer: {
					background: color_config_data?.whiteColor2,
					flexDirection: 'row',
					// borderBottom: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
					padding: '24px 16px',
					boxShadow: '0 -2px 5px #00000014',
					'@media (max-width: 600px)': {
						padding: '12px 16px',
						flexDirection: 'column',
						gap: '12px',
					},
				},
				footer_text: {
					color: color_config_data?.white_color,
				},
				footer_left: {
					background: color_config_data?.zirconColor,
					borderRadius: border_radius?.chip?.primary,
					whiteSpace: 'nowrap',
					'@media (max-width: 600px)': {
						width: '100%',
					},
				},
				mandatory: {
					borderRadius: border_radius?.chip?.primary,
				},
				button: {
					borderRadius: border_radius?.chip?.primary,
				},
				body: {
					primary: fixed_color?.grey_5,
					secondary: color_config_data?.fileVideoIncludeColor,
					light: color_config_data?.athensGrayColor,
					grey: color_config_data?.NevadaColor,
					orange: color_config_data?.accentColor,
					light_grey: color_config_data?.greyColor,
					white: color_config_data?.zirconColor,
					textPrimary: color_config_data?.textPrimaryColor,
				},
				modifier_select_value: {
					color: color_config_data?.pureBlackColor,
					background: color_config_data?.backgroundColor,
					active_border: `1px solid ${color_config_data?.textPrimaryColor}`,
					unactive_border: `1px solid ${color_config_data?.mischkaColor}`,
				},
				no_option: {
					background: color_config_data?.backgroundColor,
				},
				chips: {
					chip_style: {
						background: color_config_data?.whiteColor2,
						boxShadow: `0px 1px 12px 0px ${color_config_data?.lightGreyColor}`,
					},
					border: `1px solid ${color_config_data?.pureBlackColor}`,
					active_border_color: color_config_data?.greyColor,
					border_color: color_config_data?.mischkaColor,
					borderRadius: border_radius?.chip?.primary,
				},
				drop_down: {
					color: color_config_data?.grayChateauColor,
					borderRadius: border_radius?.dropdown?.primary,
				},
				image: {
					selected_style: {
						border: `1px solid ${color_config_data?.greyColor}`,
						background: color_config_data?.backgroundColor,
						boxShadow: `0px 4px 12px 0px ${color_config_data?.lightGreyColor}`,
						borderRadius: border_radius?.image?.primary,
					},
					icon_style: {
						color: color_config_data?.primaryColor,
					},
				},
				custom_counter: {
					container_with_label: {
						border: `1px solid ${color_config_data?.color_config_data?.bombayColor}`,
					},
					container_with_label_input: {
						display: 'flex',
						alignItems: 'center',
						width: 'fit-content',
						borderRadius: border_radius?.form_elements?.primary,
						padding: '5px 10px',
						border: `1px solid ${color_config_data?.mischkaColor}`,
						marginTop: '1rem',
					},
					label_input: {
						background: color_config_data?.whiteColor2,
						color: color_config_data?.pureBlackColor,
					},
					decrement_icon: {
						background: color_config_data?.catskillWhiteColor,
						color: color_config_data?.NevadaColor,
					},
					error_style_color: {
						primary: color_config_data?.bombayColor,
						secondary: color_config_data?.primaryColor,
						tertiary: color_config_data?.catskillWhiteColor,
						dark_blue: color_config_data?.NevadaColor,
						light: color_config_data?.alabasterColor,
						grey: color_config_data?.NevadaColor,
						default: color_config_data?.primaryColor,
						light_grey: color_config_data?.pureGreyColor,
					},
				},
				custom_error: {
					color: color_config_data?.secTextColor,
					background: color_config_data?.white_color,
				},
			},
			chevron: {
				background: color_config_data?.white_color,
				color: color_config_data?.pureBlackColor,
				transition: '0.2ms ease-in-out',
			},
			filter: {
				filter_container: {
					background: color_config_data?.whiteColor,
					transition: '0.2ms ease-in-out',
				},
				filter_container_mb: {
					backgroundColor: color_config_data?.whiteColor,
					boxShadow: `0px 3px 5px -1px ${color_config_data?.rgbaBlack2Color}, 0px 6px 10px 0px ${color_config_data?.rgbaBlack3Color}, 0px 1px 18px 0px ${color_config_data?.rgbaBlack2Color}`,
					border: `1px solid ${color_config_data?.gradientColor2}`,
				},
				chevron: {
					background: color_config_data?.whiteColor2,
					shadow: `4px 0px 8px ${color_config_data?.lightGreyColor}`,
				},
				red_dot: {
					background: color_config_data?.accentColor,
				},
				sort: {
					container: {
						borderRadius: config_data?.border_radius?.filter?.primary,
						background: color_config_data?.white_color,
						fontFamily: `${primary_font?.fontFamily}`,
					},
					icon: {
						color: color_config_data?.NevadaColor,
					},
					menu: {
						'&:hover': {
							border: `1px solid ${color_config_data?.pureBlackColor}`,
						},
					},
					border_active: `1px solid ${color_config_data?.SpringGreen}`,
					border: `1px solid ${color_config_data?.tempBlackColor}`,
					...product_settings?.filter_settings,
				},
				all_products: {
					background: color_config_data?.catskillWhiteColor,
					border: `1px solid ${color_config_data.rgbIceBlueColor}`,
					icon: {
						color: color_config_data?.greyColor,
						transition: '0.2ms ease-in-out',
					},
				},
				chips: {
					background: color_config_data?.white_color,
					color: color_config_data?.rgbHoverBlackColor,
				},
				filter_icon: {
					container: {
						borderRadius: config_data?.border_radius?.filter?.primary,
						border: `1px solid ${color_config_data?.tempBlackColor}`,
						...product_settings?.filter_settings,
						background: color_config_data?.whiteColor2,
						'&:hover': {
							border: `1px solid ${color_config_data?.tempBlackColor}`,
						},
					},
					color: color_config_data?.rgbaBlackColor,
				},
				range_filter: {
					slider: {
						color: color_config_data?.primaryColor,
					},
					range_filter_box: {
						borderRadius: config_data?.border_radius?.filter?.primary,
						border: `1px solid ${color_config_data?.tempBlackColor}`,
						background: color_config_data?.whiteColor,
						...product_settings?.filter_settings,
					},
					borderRadius: config_data?.border_radius?.filter?.primary,
					red_dot: {
						borderRadius: '0px',
						background: color_config_data?.accentColor,
					},
					border: `1px solid ${color_config_data?.primaryColor}`,
					hover_border: `1px solid ${color_config_data?.tempBlackColor}`,
					fontFamily: `${primary_font?.fontFamily}`,
				},
				multi_select_filter: {
					checkbox: {
						color: color_config_data?.primaryColor,
					},
					background: color_config_data?.whiteColor,
					border: `1px solid ${color_config_data?.tempBlackColor}`,
					...product_settings?.filter_settings,
					container_border: `1px solid ${color_config_data?.tempBlackColor} !important`,
					color: color_config_data?.primaryColor,
					chip: {
						background: color_config_data?.blackHazeColor,
						color: color_config_data?.greyColor,
					},
					fontFamily: `${primary_font?.fontFamily}`,
					borderRadius: config_data?.border_radius?.filter?.primary,
				},
				category_filter: {
					checkbox: {
						color: color_config_data?.primaryColor,
					},
					category_filter_box: {
						borderRadius: config_data?.border_radius?.filter?.primary,
						border: `1px solid ${color_config_data?.tempBlackColor}`,
						...product_settings?.filter_settings,
						background: color_config_data?.whiteColor,
						'&:focus': {
							border: `2px solid ${color_config_data?.primaryColor}`,
						},
						fontFamily: `${primary_font?.fontFamily}`,
					},
					bottom_button_container: {
						background: color_config_data?.whiteColor,
					},
					icon_color: {
						primary: color_config_data?.grayChateauColor,
						secondary: color_config_data?.primaryColor,
					},
					border: `1px solid ${color_config_data?.primaryColor}`,
					hover_border: `1px solid ${color_config_data?.tempBlackColor}`,
				},
				date_filter: {
					borderRadius: config_data?.border_radius?.filter?.primary,
					border: `1px solid ${color_config_data?.tempBlackColor}`,
					...product_settings?.filter_settings,
					fontFamily: `${primary_font?.fontFamily}`,
				},
				filter_and_chips: {
					background: color_config_data?.white_color,
					icon_style: {
						color: color_config_data?.pureRedColor,
					},
					chip_style: {
						background: color_config_data?.whiteColor,
						color: color_config_data?.primaryColor,
					},
				},
				all_filter_drawer: {
					drawer_footer_container: {
						borderTop: `1px solid ${color_config_data?.catskillWhiteColor}`,
						background: color_config_data?.white_color,
						padding: '16px 24px !important',
					},
					background: color_config_data?.white_color,
					button: {
						background: color_config_data?.primaryColor,
					},
					hover_button: {
						background: color_config_data?.primaryColor,
					},
					drawer_header: {
						padding: '8px 24px 10px 14px',
						justifyContent: 'space-between',
						marginLeft: '10px',
					},
					header_padding: {
						paddingBottom: '8px',
					},
					drawer_content: {
						padding: '6px 0px 30px 10px',
						marginLeft: '-1rem',
					},
					paddingRight: '8px',
					marginLeft_: '-1rem',
					paddingBottom: '4rem',
					divider: {
						marginLeft: '-24px !important',
						width: 'calc(100% + 48px)',
					},
					divider_footer: {
						marginLeft: '-24px !important',
						width: 'calc(100% + 48px)',
					},
					skeleton_divider: {
						marginLeft: '-1rem',
						width: 'calc(100% + 2rem)',
					},
				},
				accordion_type_filter: {
					accordion_layout: {
						border: `1px solid ${color_config_data?.mischkaColor}`,
					},
					selected_filter: {
						color: color_config_data?.secTextColor,
					},
					clear_filter: {
						color: color_config_data?.primaryColor,
					},
					background: color_config_data?.white_color,
					borderRadius: `${config_data?.border_radius?.filter?.primary} !important`,
				},
				accordion_multi_type_filter: {
					background: color_config_data?.white_color,
					color: color_config_data?.primaryColor,
					checkbox: {
						color: color_config_data?.primaryColor,
					},
				},
				accordion_slider: {
					color: color_config_data?.primaryColor,
				},
				accordion_radio: {
					color: color_config_data?.primaryColor,
				},
				accordion_drawer: {
					width: '100%',
					background: color_config_data?.lotionWhite,
				},
				background: color_config_data?.white_color,
			},
			catalog_switch: {
				price_list_container: {
					background: color_config_data?.whiteColor2,
					border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
					'&:hover': {
						border: `1px solid ${color_config_data?.pureBlackColor}`,
					},
					transition: '0.2ms ease-in-out',
				},
				icon: {
					color: color_config_data?.NevadaColor,
				},
				selected_calatog: {
					color: color_config_data?.burnHamColor,
				},
				linked_catalog: {
					background: color_config_data?.zirconColor,
					color: color_config_data?.indigoColor,
				},
			},
			cart: {
				badge_style: {
					background: color_config_data?.accentColor,
					color: color_config_data?.white_color,
					border: `1px solid ${color_config_data?.pearlLustaColor}`,
				},
				active_style: {
					background: color_config_data?.pearlLustaColor,
					border: 'none',
				},
				color: color_config_data?.greyColor,
			},
			reorder_card: {
				footer_background: `${fixed_color?.primary_light}`,
				border: `1px solid ${color_config_data?.alto2Color}`,
				already_in_cart_background: color_config_data?.fileVideoNotIncludeColor,
				error_chip_background: color_config_data?.greyColor,
				disabled_checkbox: color_config_data?.greyColor,
				boxShadow: `0px 4px 8px 0px ${color_config_data?.disabledLightBlackColor}`,
			},
		},
		product_details: {
			product_section: {
				color: color_config_data?.greyColor,
			},
			card_custom_style: {
				flexDirection: 'column',
				...pdp_settings?.rails_settings?.rails_content_container,
			},
			breadcrumbs_style: {
				fontFamily: `${primary_font?.fontFamily}`,
				...pdp_settings?.breakcrumbs_settings,
			},
			product_name: {
				fontSize: '14px',
				fontFamily: `${primary_font?.fontFamily}`,
				...pdp_settings?.rails_settings?.product_name,
			},
			card_template_row: {
				padding: '.5rem 1rem',
				...pdp_settings?.rails_settings?.card_template_row,
			},
			product_card_info: {
				fontSize: '14px',
				fontFamily: `${primary_font?.fontFamily} `,
				fontWeight: '700',
				...pdp_settings?.rails_settings?.product_attributes,
			},
			container: {
				background: color_config_data?.whiteColor,
			},
			product_image_card: {
				borderRadius: border_radius?.card?.primary,
				fontFamily: `${primary_font?.fontFamily}`,
				...pdp_settings?.rails_settings?.product_card,
			},
			product_image: {
				...pdp_settings?.rails_settings?.product_image,
			},
			product_attributes: {
				...pdp_settings?.rails_settings?.product_attributes_container,
			},
			icon_style: {
				color: color_config_data?.greyColor,
				'&:hover': {
					color: color_config_data?.rgbHoverBlackColor,
					transform: 'scale(1.2)',
					transition: ' 0.2s ease-in-out',
				},
			},
			tearsheet_button: {
				fontFamily: `${primary_font?.fontFamily}`,
				'&:hover': {
					background: color_config_data?.whiteColor,
				},
			},
			tearsheet_drawer: {
				header: {
					padding: '16px 24px',
				},
				content: {
					padding: '6px 4px',
				},
			},
			similar_product_container: {
				boxShadow: `2px solid ${color_config_data?.blackColor}`,
			},
			product_image_container: {
				carosuel: {
					arrow: {
						boxShadow: `0 2px 4px ${color_config_data?.disabledLightBlackColor}`,
						background: color_config_data?.whiteColor2,
						color: color_config_data?.pureBlackColor,
					},
					thumb: {
						border: `1px solid ${color_config_data?.blackColor}`,
						height: '160px',
						width: '160px',
					},
					images: {
						border: `1px solid ${color_config_data?.alto2Color}`,
						'@media (max-width: 600px)': {
							border: 'none',
						},
						borderRadius: '0px',
					},
					magnifer: {
						border: `1px solid ${color_config_data?.Silver2}`,
						backgroundColor: color_config_data?.white_color,
					},
				},
				card: {
					border: 'none',
					'@media (max-width: 600px)': {
						border: `1px solid ${color_config_data?.alto2Color}`,
					},
				},
			},
			product_info_container: {
				custom_style: {
					flexDirection: 'row',
				},
				inventory_container: {
					marginRight: '20px',
				},
				full_width_style: {
					width: '100%',
				},
				header_container: {
					gap: '0px',
					...pdp_settings?.header_container,
				},
				rail_styles: {
					chevron_left: {
						zIndex: 5,
						marginRight: '-5rem',
						marginBottom: '125px',
					},
					chevron_right: {
						zIndex: 5,
						marginLeft: '-5rem',
						marginBottom: '125px',
					},
				},
				name_container: {
					marginBottom: '0px',
				},
				item_price: {
					fontSize: '20px',
					...pdp_settings?.price,
				},
				primary_color: {
					color: color_config_data?.secondaryColor,
					fontFamily: `${tertiary_font?.fontFamily} !important`,
					...pdp_settings?.title,
				},
				sku_id: {
					fontFamily: `${primary_font?.fontFamily}`,
					color: color_config_data?.grayChateauColor,
					...pdp_settings?.sku_id,
				},
				medium_grey: {
					color: color_config_data?.NevadaColor,
					fontFamily: `${primary_font?.fontFamily}`,
				},
				custom_color: {
					color: fallback_colors?.indigoColor,
				},
				secondary_color: {
					fontFamily: `${primary_font?.fontFamily}`,
					color: color_config_data?.secondaryColor,
				},
				composite_label: {
					fontFamily: `${primary_font?.fontFamily}`,
					color: color_config_data?.darkGreyColor,
				},
				section_title: {
					fontFamily: `${primary_font?.fontFamily}`,
					...pdp_settings?.hinge_settings?.accordion_section,
				},
				active_price_style: {
					color: color_config_data?.primaryColor,
					fontWeight: 700,
				},
				icon_container: {
					border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
					background: color_config_data?.whiteColor2,
				},
				rails_container: {
					...pdp_settings?.rails_settings?.rails_container,
				},
				header_container_value: {
					background: color_config_data?.lightWhite,
				},
				variant_color_item: {
					border: 'none',
					'&:hover': {
						padding: '0.6rem',
						border: `1px solid ${color_config_data?.pureBlackColor}`,
					},
				},
				variant_color_item_text: {
					fontSize: '12px',
				},
				rails_title: {
					fontSize: '16px',
					fontFamily: `${tertiary_font?.fontFamily} !important`,
					...pdp_settings?.rails_settings?.title,
				},
				stock_container: {
					backgroundColor: color_config_data?.backgroundColor,
				},
				drawer_header_container: {
					backgroundColor: color_config_data?.white_color,
					borderBottom: `1px solid ${color_config_data?.catskillWhiteColor}`,
				},
				drawer_variant_container_item: {
					border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
				},
				active_style: {
					backgroundColor: color_config_data?.backgroundColor,
				},
				remove_icon: {
					background: color_config_data?.whiteRockColor,
				},
				add_icon: {
					background: color_config_data?.primaryColor,
					color: color_config_data?.white_color,
				},
				show_count: {
					background: color_config_data?.whiteColor2,
					color: color_config_data?.primaryColor,
					border: `1px solid ${color_config_data?.mischkaColor}`,
				},
				custom_icon: {
					color: color_config_data?.primaryColor,
				},
				chip_style: {
					color: color_config_data?.greyColor,
					background: color_config_data?.white_color,
				},
				image_style: {
					border: `1px solid ${color_config_data?.rgbIceBlueColor}`,
					...pdp_settings?.hinge_settings?.image_style,
				},
				active_image_style: {
					background: color_config_data?.whiteishColor,
					boxShadow: `${color_config_data?.lightGreyColor} 0px 4px 12px 0px`,
					...pdp_settings?.hinge_settings?.active_image_style,
					border: `1px solid ${color_config_data?.blackColor2}`,
				},
				disabled_style: {
					'&:hover': {
						background: color_config_data?.backgroundColor,
						border: `1px solid ${color_config_data?.lowSkyBlueColor}`,
					},
				},
				variant_hinge_container: {
					margin: '1rem 0rem',
					...pdp_settings?.hinge_settings?.hinge_container,
				},
				button_container: {
					margin: '1rem 0rem',
					...pdp_settings?.hinge_settings?.hinge_container,
				},
				active_chip_style: {
					boxShadow: `${color_config_data?.lightGreyColor} 0px 4px 15px 0px`,
					color: color_config_data?.NevadaColor,
					borderRadius: '16px',
					border: `1px solid ${color_config_data?.primaryColor}`,
					fontFamily: `${primary_font?.fontFamily}`,
					...pdp_settings?.hinge_settings?.active_chip,
					background: color_config_data?.primaryColor,
					'&:hover': {
						background: color_config_data?.primaryColor,
					},
				},
				in_active_chip_style: {
					background: color_config_data?.whiteColor,
					color: color_config_data?.NevadaColor,
					borderRadius: '16px',
					border: `1px solid ${color_config_data?.rgbIceBlueColor}`,
					fontFamily: `${primary_font?.fontFamily}`,
					...pdp_settings?.hinge_settings?.in_active_chip,
				},
				variant_cta_style: {
					backgroundColor: color_config_data?.athensGrayColor,
				},
				customize_box: {
					color: color_config_data?.primaryColor,
				},
				customize_box2: {
					margin: '2.4rem 0rem',
					borderRadius: border_radius?.button?.primary,
				},
				add_to_cart_button: {
					fontFamily: `${primary_font?.fontFamily}`,
					textTransform: 'uppercase !important',
					...product_settings?.cart_button_settings,
				},
			},
		},
		copy_address_drawer: {
			copy_address_drawer_style: {
				border: `1px solid ${color_config_data?.mischkaColor}`,
			},
			copy_address_drawer_style_header: {
				padding: '16px 16px',
			},
			copy_address_drawer_style_card: {
				marginBottom: '40px',
				padding: '16px 24px',
			},
		},
		statusChip_: {
			border: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
			borderRadius: border_radius?.chip?.secondary,
		},
		banner_: {
			borderRadius: border_radius?.banner?.primary,
		},
		table_: {
			borderRadius: border_radius?.table?.primary,
			fontFamily: `${primary_font?.fontFamily}`,
			color: color_config_data?.primaryColor,
			header_background: `${fixed_color?.primary_light}`,
		},
		myOrdersCardStyle: {
			border: `1px solid ${color_config_data?.lightGreyColor2}`,
		},
		myOrdersCardTextStyle: {
			background: color_config_data?.wildSandColor,
		},
		dropdown_border_radius: {
			borderRadius: border_radius?.dropdown?.primary,
		},
		button_: {
			borderRadius: border_radius?.button?.primary,
		},
		chip_: {
			borderRadius: border_radius?.chip?.primary,
		},
		card_: {
			borderRadius: border_radius?.card?.primary,
		},
		image_: {
			borderRadius: border_radius?.images?.primary,
		},
		thumbnail_: {
			borderRadius: border_radius?.thumbnail?.primary,
		},
		form_elements_: {
			borderRadius: border_radius?.form_elements?.primary,
		},
		pagination_: {
			borderRadius: border_radius?.pagination?.primary,
		},
		modal_: {
			borderRadius: border_radius?.modal?.primary,
		},
		skeleton_: {
			borderRadius: border_radius?.skeleton?.primary,
		},
		alert: {
			border: `1px solid ${color_config_data?.whiteColor2}`,
			borderRadius: border_radius?.card?.primary,
			backgroundColor: color_config_data?.solitudeColor,
		},
		cart_summary: {
			background: color_config_data?.whiteColor2,
			container_cart: {
				primary: color_config_data?.whiteColor,
				container_info: color_config_data?.athensGrayColor,
				icon_color: color_config_data?.greyColor,
			},
			summary_card: {
				seperator: color_config_data?.bombayColor,
				avatar_box: color_config_data?.peachYellowColor,
				blocked: color_config_data?.fileVideoNotIncludeColor,
				background: color_config_data?.backgroundColor,
				box_shadow: 'none',
			},
			customize_cart: {
				container_bg: color_config_data?.backgroundColor,
				label_color: color_config_data?.greyColor,
				icon_color: color_config_data?.alto2Color,
			},
			modal_product: {
				border: color_config_data?.TransparentBlack2,
			},
			offer_discount: {
				border: color_config_data?.primaryColor,
				toggle_border: color_config_data?.transparentBlackColor,
			},
			divider: {
				margin: '20px 0px',
			},
			product_card: {
				discount_bar_bg: `linear-gradient(90deg, ${color_config_data?.loaferColor} 1.82%, ${color_config_data?.blackSqueezeColor} 73.18%)`,
				discount_header_color: `var(${color_config_data?.catskillWhiteColor}, ${color_config_data?.nominalDarkColor})`,
				discount_icon: `linear-gradient( ${primary?.main}, ${color_config_data?.sushiColor})`,
				custom_image_text: color_config_data?.rgbBlackColor,
				dicsount_img: color_config_data?.greyColor,
				product_name_color: color_config_data?.rgbaBlackColor,
				notes_color: `${color_config_data?.nominalDarkColor} !important`,
				attr_color: `${color_config_data?.alto2Color} !important`,
				fontFamily: `${secondary_font?.fontFamily} !important`,
				text_color: color_config_data?.blackTextColor,
				text_gray: color_config_data?.secTextColor,
			},
			image: {
				borderRadius: border_radius?.images?.primary,
				border: `1px solid ${color_config_data?.mischkaColor}`,
			},
			header: {
				text_color: color_config_data?.NevadaColor,
				border_color: color_config_data?.bombayColor,
			},
			discount: {
				color: color_config_data?.pureRedColor,
			},
			shipping_charge_container: {
				color: color_config_data?.blackTextColor,
				background: original_colors?.nudgeBackground,
			},
			disclaimer: {
				background: original_colors?.antiFlashWhite,
			},
			custom_cart_total: {
				border: `1px solid ${secondary?.[400]}`,
				background: background_colors?.accordion,
				padding: '0rem 1rem 1rem 1rem',
			},
			product_listing: {
				border: `1px solid ${secondary?.[400]}`,
				background: background_colors?.secondary,
				padding: '0rem 1rem',
				backgroundColor: background_colors?.secondary,
			},
			refetch_loader: {
				border: `1px solid ${color_config_data?.mischkaColor}`,
				background: 'rgba(127, 127, 127, 0.7)',
			},
		},
		custom_toast: {
			icon_color: {
				// primary: color_config_data?.SpringGreen,
				primary: color_config_data?.shadowGreenColor,
				secondary: color_config_data?.white_color,
				tertiary: color_config_data?.white_color,
				error: color_config_data?.accentColor,
				warning: color_config_data?.fileNotIncludeColor,
			},
			background: `${color_config_data?.mineColor} !important`,
			hover_primary: {
				'&:hover': {
					backgroundColor: color_config_data?.pureTransparentColor,
				},
			},
			hover_secondary: {
				background: color_config_data?.white_color,
				'&:hover': {
					backgroundColor: color_config_data?.white_color,
					opacity: '0.9',
				},
			},
		},
		payments: {
			card_text: color_config_data?.NevadaColor,
			add_credits: {
				tabs: {
					border_active: `1px solid ${color_config_data?.rgbLightGreen2Color}`,
					border_inactive: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
					background_active: `var(${color_config_data?.harpColor}, ${color_config_data?.harpColor})`,
					background_inactive: '',
					boxshadow_active: `0px 4px 24px 0px ${color_config_data?.shadowBlackColor}`,
					boxshadow_inactive: '',
					icon_active: color_config_data?.rgbLightGreen2Color,
					icon_inactive: '',
				},
				content: {
					background: color_config_data?.rgbaLoferColor,
					text: color_config_data?.darkGreyColor,
					avatar: {
						background: color_config_data?.peachYellowColor,
						color: color_config_data?.geebungColor,
						text: color_config_data?.textYellowColor,
					},
					card: {
						icon_color: color_config_data?.primaryColor,
						text_color: color_config_data?.primaryColor,
					},
				},
				footer: {
					background: color_config_data?.rgbaLoferColor,
					text: color_config_data?.lightBlackColor,
				},
			},
			collect_payment: {
				tabs: {
					border_active: `1px solid ${color_config_data?.rgbLightGreen2Color}`,
					border_inactive: `1px solid ${color_config_data?.rgbaBorderBlackColor}`,
					background_active: `var(${color_config_data?.harpColor}, ${color_config_data?.harpColor})`,
					background_inactive: '',
					boxshadow_active: `0px 4px 24px 0px ${color_config_data?.shadowBlackColor}`,
					boxshadow_inactive: '',
					icon_active: color_config_data?.rgbLightGreen2Color,
					icon_inactive: '',
				},
				content: {
					background: color_config_data?.offYellowColor,
					text: color_config_data?.lightBlackColor,
					card: {
						icon_color: color_config_data?.primaryColor,
						text_color: color_config_data?.primaryColor,
					},
					credits: {
						background: color_config_data?.rgbaLoferColor,
					},
				},
				footer: {
					background: color_config_data?.blackSqueezeHashColor,
					text: color_config_data?.lightBlackColor,
				},
			},
			direct_payment: {
				content: {
					background: color_config_data?.offYellowColor,
				},
				footer: {
					background: color_config_data?.blackSqueezeHashColor,
					text: color_config_data?.lightBlackColor,
				},
			},
			refund_payment: {
				background: color_config_data?.whiteishColor,
				text: color_config_data?.lightBlackColor,
				icon: color_config_data?.darkGreyColor,
			},
			refund_credits: {
				text: color_config_data?.lightBlackColor,
				background: color_config_data?.offYellowColor,
				buyer_details: {
					background: color_config_data?.rgbaLoferColor,
					avatar: {
						background: color_config_data?.peachYellowColor,
						color: color_config_data?.geebungColor,
						text: color_config_data?.textYellowColor,
					},
					text: color_config_data?.darkGreyColor,
				},
				background2: color_config_data?.whiteishColor,
			},
			add_payment_modal: {
				primary: color_config_data?.white_color,
				disabled: color_config_data?.lightBlackColor,
				warning: color_config_data?.accentColor,
				copy_from: color_config_data?.primaryColor,
			},
			share_receipt_modal: {
				delete: color_config_data?.greyColor,
				icon: color_config_data?.primaryColor,
				icon_disabled: color_config_data?.tempBlackColor,
			},
			terminal_modal: {
				text: color_config_data?.lightBlackColor,
				background: color_config_data?.offYellowColor,
			},
			copy_form_text: {
				color: color_config_data?.primaryColor,
			},
			white: color_config_data?.whiteColor2,
			grey_600: color_config_data?.greyColor,
			grey_300: color_config_data?.silverSand,
			grey_400: color_config_data?.backgroundColor,
			grey_500: color_config_data?.NevadaColor,
			grey_700: color_config_data?.subTitleColor,
			green: color_config_data?.genoaColor,
			light_green: color_config_data?.pearlLustaColor,
			light_blue: color_config_data?.zirconColor,
			light_yellow: color_config_data?.peachYellowColor,
			accent_yellow: color_config_data?.geebungColor,
			background: color_config_data?.backgroundColor,
			paper: color_config_data?.pearlLustaColor,
			transparent: color_config_data?.transparentBlackColor,
			green_100: color_config_data?.harpColor,
			grey: color_config_data?.pureGreyColor,
			grey_light: color_config_data?.whiteishColor,
			grey_dark: color_config_data?.lightBlackColor,
			primary_text: color_config_data?.darkGreyColor,
			red: color_config_data?.red,
			black: color_config_data?.blackColor,
			warning: color_config_data?.fileNotIncludeColor,
		},
		modal: {
			background: color_config_data?.white_color,
			icon_color: color_config_data?.greyColor,
		},
		cart: {
			cart_icon: {
				color: color_config_data?.greyColor,
			},
			cart_custom_item_error: {
				background: color_config_data?.fileVideoIncludeColor,
				color: color_config_data?.accentColor,
			},
		},
		settings: {
			import_export: {
				color: color_config_data?.geebungColor,
				text: color_config_data?.blackTextColor,
				span: {
					fontWeight: 500,
					cursor: 'pointer',
					color: color_config_data?.primaryColor,
					'&:hover': {
						color: color_config_data?.bombayColor,
					},
				},
			},
		},
		components: {
			...common?.components,
			MuiMenuItem: {
				styleOverrides: {
					root: () => ({
						backgroundColor: color_config_data?.whiteColor2,
						'&:hover': {
							backgroundColor: color_config_data?.rgbaBlack2Color,
						},
						// '&:selected': {
						// 	backgroundColor: pureGreenColor,
						// },
					}),
				},
			},
			MuiList: {
				styleOverrides: {
					root: () => ({
						borderRadius: border_radius?.dropdown?.primary,
						// filter: 'drop-shadow(0px 4px 30px rgba(0, 0, 0, 0.1))',
						background: color_config_data?.white_color,
						boxShadow: `0px 4px 30px ${color_config_data?.shadowBlackColor}`,
						border: `1px solid ${color_config_data?.wildSandColor}`,
					}),
				},
			},
			MuiAccordion: {
				styleOverrides: {
					root: () => ({
						borderRadius: `${border_radius?.dropdown?.primary} !important`,
						boxShadow: `0px 2px 1px -1px ${color_config_data?.rgbaBlack2Color}, 0px 1px 1px ${color_config_data?.rgbaBlack3Color}, 0px 1px 3px ${color_config_data?.rgbaBorderBlackColor}`,
					}),
				},
			},
			MuiToggleButton: {
				styleOverrides: {
					root: () => ({
						'&:hover': {
							backgroundColor: color_config_data?.edgeWaterColor,
							color: color_config_data?.secondaryColor,
						},
						'&.Mui-selected, &.Mui-selected:hover': {
							backgroundColor: color_config_data?.silverTreeColor2,
							color: color_config_data?.whiteColor,
						},
					}),
				},
			},
			MuiIconButton: {
				styleOverrides: {
					root: () => ({
						'&:hover': {
							backgroundColor: common?.palette?.success[50],
							color: color_config_data?.NevadaColor,
						},
					}),
				},
			},
			MuiCard: {
				styleOverrides: {
					root: () => ({
						background: color_config_data?.whiteColor,
					}),
				},
			},
			MuiSelect: {
				styleOverrides: {
					root: () => ({
						border: '',
						borderRadius: border_radius?.button?.primary,
						'&:hover': {
							border: 'none',
						},
					}),
				},
			},
			MuiDrawer: {
				styleOverrides: {
					paper: {
						background: color_config_data?.white_color,
					},
				},
			},
			settings: {
				rails_settings: {
					...product_settings?.rails_settings,
				},
				account_config: {
					tabs_config: !_.isEmpty(account_settings?.tabs) ? account_settings?.tabs : [],
				},
			},
		},
		light_box: {
			modal: {
				modifiers: {
					icon_color: color_config_data?.whiteColor,
					image_border: color_config_data?.mischkaColor,
				},
				overlay_config: {
					background: color_config_data?.textBlackColor,
				},
			},
		},
	});
};

export default lightTheme;
