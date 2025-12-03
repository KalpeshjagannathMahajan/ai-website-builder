import { createTheme } from '@mui/material';

export const colors = {
	primary_500: '#16885F',
	primary_600: '#096645',
	white: '#ffffff',
	black: '#000000',
	red: '#D74C10',
	text_50: '#FAFAFA',
	text_400: '#A3A3A3',
	text_900: '#171717',
	secondary_text: '#00000099',
	grey_300: '#EEF1F7',
	grey_500: '#EEF1F7',
	grey_600: '#F7F8FA',
	grey_800: '#4F555E',
	black_8: 'rgba(0, 0, 0, 0.87)',
	light_green: '#EFF3E1',
	light_grey: '#CCCDCF',
	light_yellow: '#FEF5E4',
	black_40: '#00000066',
	black_65: '#000000A6',
	black_20: '#00000033',
	black_14: '#00000014',
	black_30: '#0000004D',
	charcoal_black: '#1F1F1F',
	dark_midnight_blue: '#0000001F',
	dark_charcoal: '#4f4b4b',
	warning: '#EEB544',
};

export const variables = {
	border_radius_large: '12px',
};

const basicTheme = createTheme({
	palette: {
		primary: {
			main: '#16885F',
		},
		secondary: {
			main: '#ffffff',
		},
	},
});

const theme = {
	// colors,
	...basicTheme,
};

export default theme;
