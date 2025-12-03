import { createTheme } from '@mui/material';
import commonTheme from './common.theme';

export const primary = {
	main: '#16885F',
	contrastText: 'white',
	50: '#E8F3EF',
	100: '#D0E7DF',
	200: '#A2CFBF',
	300: '#73B89F',
	400: '#6AB399',
	500: '#16885F',
	600: '#096645',
	700: '#01442C',
	800: '#01442C',
	900: '#002D1D',
};

export const secondary = {
	main: '#25282D',
	contrastText: 'white',
	50: '#FAFAFA',
	100: '#F2F4F7',
	200: '#F2F4F7',
	300: '#EEF1F6',
	400: '#D1D6DD',
	500: '#B5BBC3',
	600: '#9AA0AA',
	700: '#676D77',
	800: '#4F555D',
	900: '#25282D',
};

const darkTheme = (font_config: any) => {
	const common: any = commonTheme(font_config);

	return createTheme({
		...common,
		palette: {
			...common.palette,
			primary,
			secondary,
			background: {
				default: '#181923',
				paper: '#1E1E1E',
			},
			divider: '#ff1b0a',
		},
		typography: {
			...common.typography,
			color: 'white',
			transition: '0.2ms ease-in-out',
		},
		skeleton: {
			background: 'grey',
		},
		//Product
		product: {
			product_card: {
				background: '#242b35',
				border: 'none',
				color: 'white',
				transition: '0.2ms ease-in-out',
			},
			product_variant_chip: {
				color: 'white',
				border: '1px solid rgba(255, 255, 255, 0.5)',
				transition: '0.2ms ease-in-out',
			},
			view_similar_chip: {
				color: 'white',
				background: '#242b35',
				border: '1px solid #242b35',
				boxShadow: '0px 4px 8px 0px rgb(227 218 218 / 10%)',
				transition: '0.2ms ease-in-out',
			},
			filter: {
				filter_container: {
					background: '#181923',
				},
			},
		},
		cart_summary: {
			background: '#fff',
			container_cart: {
				primary: '#fff',
				container_info: '#F2F4F7',
				icon_color: '#4F555E',
			},
			summary_card: {
				seperator: '#B5BBC3',
				avatar_box: '#F9DFAC',
				blocked: '#FEF7EA',
			},
			customize_cart: {
				container_bg: '#F7F8FA',
				label_color: '#4F555E',
				icon_color: '#D9D9D9',
			},
			modal_product: {
				border: '#0000003d',
			},
			offer_discount: {
				border: '#16885F',
				toggle_border: 'rgba(0, 0, 0, 0.12)',
			},
			product_card: {
				discount_bar_bg: 'linear-gradient(90deg, #F2F6E7 1.82%, rgba(231, 241, 246, 0.65) 73.18%)',
				discount_header_color: 'var(--Secondary-text, rgba(0, 0, 0, 0.60))',
				discount_icon: 'linear-gradient( #16885F, #97B73E)',
				custom_image_text: 'rgba(0, 0, 0, 0.45)',
				dicsount_img: '#4F555E',
				product_name_color: 'rgba(0, 0, 0, 0.87)',
				notes_color: 'rgba(0, 0, 0, 0.60) !important',
				attr_color: '#D9D9D9 !important',
			},
		},
		components: {
			...common.components,
			MuiMenuItem: {
				styleOverrides: {
					root: () => ({
						// ...(ownerState.variant === 'contained' &&
						// 	ownerState.color === 'primary' && {
						// 		backgroundColor: '#202020',
						// 		color: '#fff',
						// 	}),
						backgroundColor: '#fff',
						'&:hover': {
							backgroundColor: 'rgba(0, 0, 0, 0.04)',
						},
						// '&:selected': {
						// 	backgroundColor: 'green',
						// },
					}),
				},
			},
			MuiList: {
				styleOverrides: {
					root: () => ({
						borderRadius: '8px',
						// filter: 'drop-shadow(0px 4px 30px rgba(0, 0, 0, 0.1))',
						background: 'white',
						boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.1)',
						border: '1px solid #f5f5f5',
					}),
				},
			},
			MuiAccordion: {
				styleOverrides: {
					root: () => ({
						boxShadow: '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12)',
					}),
				},
			},
			MuiToggleButton: {
				styleOverrides: {
					root: () => ({
						'&:hover': {
							backgroundColor: '#D0E7DF',
							color: '#25282D',
						},
						'&.Mui-selected, &.Mui-selected:hover': {
							backgroundColor: '#6AB399',
							color: '#FFFFFF',
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
						background: '#242b35',
					}),
				},
			},
			MuiSelect: {
				styleOverrides: {
					root: () => ({
						border: '',
						'&:hover': {
							border: 'none',
						},
					}),
				},
			},
			MuiDrawer: {
				styleOverrides: {
					paper: {
						background: '#242b35',
					},
				},
			},
		},
	});
};

export default darkTheme;
