/* eslint-disable @typescript-eslint/no-unused-vars */
import { createTheme } from '@mui/material/styles';
import { FirstIcon, LastIcon, NextIcon, PrevIcon } from '../common/@the-source/atoms/Pagination/PaginationIcons';
import _ from 'lodash';

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

export const info = {
	main: '#6BA6FE',
	contrastText: 'white',
	50: '#F0F6FF',
	100: '#E1EDFF',
	200: '#C4DBFF',
	300: '#A6C9FE',
	400: '#88B8FE',
	500: '#6BA6FE',
	600: '#4578C4',
	700: '#3563A6',
	800: '#284F89',
	900: '#1C3C6C',
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

const create_style_overrides = (font_mapping: any) => {
	let styles = '';

	for (const font_name in font_mapping) {
		const font = font_mapping[font_name];
		const { fontFamily, subsets } = font;

		for (const weight in subsets) {
			const urls = subsets[weight];
			const variations = _.map(urls, (url: string) => {
				const format = _.last(_.split(url, '.'));
				return `url(${url}) format('${format}')`;
			}).join(', ');

			styles += `
				@font-face {
					font-family: '${fontFamily}';
					font-display: swap;
					font-style: normal;
					font-weight: ${weight};
					src: ${variations};
				}
			`;
		}
	}

	return styles;
};

const handle_apply_primary_font = (dynamic_styles: any, primaryFont: any) => {
	if (primaryFont?.fontFamily) {
		const styleTag = document.createElement('style');
		styleTag.innerHTML = `${dynamic_styles}
    		p {
      			font-family: '${primaryFont?.fontFamily}';
   			}
			body {
			    font-family: '${primaryFont?.fontFamily}';
			 }`;
		document.head.appendChild(styleTag);
	}

	if (typeof document !== 'undefined') {
		const styleTag = document.createElement('style');
		styleTag.innerHTML = dynamic_styles;
		document.head.appendChild(styleTag);
	}
};

const commonTheme = (fontConfig: any, font_mapping: any) => {
	const { primary } = fontConfig;
	const primaryFont = font_mapping[primary];

	const dynamic_styles = create_style_overrides(font_mapping);
	handle_apply_primary_font(dynamic_styles, primaryFont);

	return createTheme({
		palette: {
			success,
			error,
			warning,
			info,
		},
		shape: {
			borderRadius: 8,
		},
		typography: {
			fontFamily: primaryFont?.fontFamily,
			h1: {
				fontWeight: 700,
				fontSize: '4.8rem',
				lineHeight: '6.4rem',
			},
			h2: {
				fontWeight: 700,
				fontSize: '3.6rem',
				lineHeight: '4.8rem',
			},
			h3: {
				fontWeight: 700,
				fontSize: '2.8rem',
				lineHeight: '3.6rem',
			},
			h4: {
				fontWeight: 700,
				fontSize: '2.4rem',
				lineHeight: '3.2rem',
			},
			h5: {
				fontWeight: 700,
				fontSize: '2rem',
				lineHeight: '2.8rem',
			},
			h6: {
				fontWeight: 700,
				fontSize: '1.6rem',
				lineHeight: '2.4rem',
			},
			body1: {
				fontSize: '1.6rem',
			},
			body2: {
				fontSize: '1.4rem',
			},
			subtitle1: {
				fontSize: '1.6rem',
			},
			subtitle2: {
				fontSize: '1.4rem',
			},
		},
		components: {
			MuiTypography: {
				defaultProps: {
					variantMapping: {
						h1: 'h1',
						h2: 'h2',
						h3: 'h3',
						h4: 'h4',
						h5: 'h5',
						h6: 'h6',
						subtitle1: 'subtitle',
						body1: 'text',
					},
					fontFamily: primaryFont?.fontFamily,
				},
			},
			MuiPaginationItem: {
				defaultProps: {
					components: {
						previous: PrevIcon,
						next: NextIcon,
						last: LastIcon,
						first: FirstIcon,
					},
				},
			},
			MuiInputBase: {
				styleOverrides: {
					root: () => ({
						fontSize: '1.6rem',
						'&:hover': {
							border: 'none',
						},
					}),
				},
			},
			MuiFormLabel: {
				styleOverrides: {
					root: () => ({
						fontSize: '1.6rem',
					}),
				},
			},
			MuiButton: {
				styleOverrides: {
					root: () => ({
						fontSize: '1.4rem',
						boxShadow: 'none',
					}),
				},
			},
			MuiSvgIcon: {
				styleOverrides: {
					root: () => ({
						fontSize: '2rem',
						width: '2rem',
						height: '2rem',
					}),
				},
			},
			MuiTab: {
				styleOverrides: {
					root: () => ({
						fontSize: '1.4rem',
					}),
				},
			},
		},
	});
};

export default commonTheme;
