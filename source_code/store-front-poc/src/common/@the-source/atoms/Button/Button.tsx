import { Button as MuiButton, ButtonProps as MuiButtonProps, styled, useTheme } from '@mui/material';
import CircularProgressBar from '../ProgressBar/CircularProgressBar';
import Box from '../Box';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

type ButtonBaseProps = Pick<
	MuiButtonProps,
	| 'variant'
	| 'size'
	| 'color'
	| 'fullWidth'
	| 'href'
	| 'disabled'
	| 'startIcon'
	| 'endIcon'
	| 'onClick'
	| 'disableRipple'
	| 'disableTouchRipple'
	| 'className'
	| 'sx'
>;

export interface ButtonProps extends ButtonBaseProps {
	children?: any;
	tonal?: boolean;
	width?: string;
	disableRipple?: boolean;
	sx?: object;
	loading?: boolean;
	loaderSize?: string;
	id?: string;
}

const TonalButton = styled(MuiButton)(({ theme }: any) => ({
	color: theme?.button?.tonal_color,
	borderRadius: theme?.button_?.borderRadius,
	backgroundColor: theme?.button?.tonal_bg_color,
	border: 0,
	textTransform: 'none',
	textDecoration: 'none',
	fontWeight: 700,
	':hover': {
		backgroundColor: theme?.button?.tonal_hover_bg_color,
		boxShadow: 'none',
		textDecoration: 'none',
	},
}));

const Button = ({
	color,
	tonal,
	children,
	width,
	disableRipple,
	disableTouchRipple,
	sx,
	loading,
	disabled,
	loaderSize,
	className,
	id = '',
	...rest
}: ButtonProps) => {
	const { variant } = rest;
	const theme: any = useTheme();
	const default_style = {
		':hover': {
			backgroundColor: theme?.button?.hover_bg_color,
			color: theme?.button?.hover_color,
			boxShadow: 'none',
			textDecoration: 'none',
			'& .MuiIcon-root': {
				color: theme?.button?.hover_color,
				textDecoration: 'none',
			},
		},
		backgroundColor: theme?.button?.bg_color2 || theme?.button?.hover_bg,
		color: theme?.button?.hover_color,
		textDecoration: 'none',
	};

	const handle_get_style = () => {
		switch (variant) {
			case 'contained':
				return {
					color: theme?.button?.contained_color,
					backgroundColor: theme?.button?.contained_bg_color,
					':hover': {
						textDecoration: 'none',
						backgroundColor: theme?.button?.container_hover_bg_color,
						boxShadow: 'none',
					},
					border: '1px solid transparent',
				};
			case 'outlined':
				return {
					color: theme?.button?.outlined_color,
					border: `1px solid ${theme?.button?.outlined_color}`,
					backgroundColor: theme?.button?.outlined_bg_color,
					boxShadow: 'none',
					':hover': {
						textDecoration: 'none',
					},
				};
			case 'text':
				return {
					color: theme?.button?.text_color,
					backgroundColor: theme?.button?.text_bg_color,
					boxShadow: 'none',
					':hover': {
						textDecoration: 'none',
					},
				};
			default:
				return default_style;
		}
	};

	const env_style: any = is_ultron ? {} : { lineHeight: 'normal', padding: '10px 24px' };

	const combined_style = {
		textDecoration: 'none',
		...handle_get_style(),
		...sx,
		...env_style,
	};

	return tonal ? (
		<TonalButton
			id={id}
			disableRipple={disableRipple}
			disableTouchRipple={disableTouchRipple}
			sx={sx}
			color={color}
			className={className}
			{...rest}>
			{children}
		</TonalButton>
	) : (
		<MuiButton
			id={id}
			disabled={disabled || loading}
			style={{ boxShadow: 'none', textTransform: 'none', fontWeight: 700, width }}
			sx={{ ...combined_style, borderRadius: theme?.button_?.borderRadius }}
			color={color}
			className={className}
			disableRipple={disableRipple}
			disableTouchRipple={disableTouchRipple}
			{...rest}>
			{loading && (
				<Box display='flex' alignItems='center'>
					<CircularProgressBar
						style={{ width: loaderSize, height: loaderSize, marginRight: 15, color: '#4f4b4b' }}
						variant='indeterminate'
					/>
				</Box>
			)}
			{children}
		</MuiButton>
	);
};

Button.defaultProps = {
	tonal: false,
	variant: 'contained',
	size: 'medium',
	color: 'primary',
	disabled: false,
	children: 'Click me',
	type: 'button',
	width: '',
	disableRipple: false,
	disableTouchRipple: false,
	loaderSize: '25px',
};
export default Button;
