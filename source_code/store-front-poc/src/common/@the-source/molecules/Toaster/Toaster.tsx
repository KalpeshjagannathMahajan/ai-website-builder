import { Grid, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Button from '../../atoms/Button/Button';
import { IconNames } from '../../atoms/Icon/baseTypes';
import Icon from '../../atoms/Icon/Icon';
import SnackBar, { SnackbarProps } from '../../atoms/Snackbar/Snackbar';
import Typography from '../../atoms/Typography/Typography';
import _ from 'lodash';

export interface ToasterProps extends SnackbarProps {
	width: string;
	message?: React.ReactNode;
	action?: React.ReactNode;
	autoHideDuration?: number;
	state: 'error' | 'warning' | 'success';
	title?: any;
	subtitle?: any;
	subtitle_font_variant?: string;
	iconColor?: string;
	handleSecondry?: any;
	handlePrimary?: any;
	showActions: boolean;
	containerStyle?: any;
	mainContainerStyle?: any;
	titleContainerStyle?: any;
	showCross: boolean;
	primaryBtnName?: string;
	secondryBtnName?: string;
	showIcon?: boolean;

	iconSize?: 'small' | 'medium' | 'large';

	anchorOrigin?: {
		vertical: 'top' | 'bottom';
		horizontal: 'left' | 'center' | 'right';
	};
	onClose?: () => void;
	open?: boolean;
	capitalize_subtitle?: boolean;
}

const Toaster = ({
	message,
	action,
	width = '324px',
	autoHideDuration = 3000,
	anchorOrigin = { vertical: 'top', horizontal: 'right' },
	onClose = () => {},
	open = false,
	state,
	iconColor,
	iconSize = 'large',
	title,
	subtitle,
	subtitle_font_variant = 'subtitle2',
	handleSecondry,
	primaryBtnName,
	showCross,
	secondryBtnName,
	handlePrimary,
	containerStyle,
	mainContainerStyle,
	titleContainerStyle,
	showActions = false,
	showIcon = true,
	capitalize_subtitle = true,
	...rest
}: ToasterProps) => {
	const theme: any = useTheme();

	const bodyResolver = () => {
		let color = theme?.custom_toast?.icon_color?.primary;
		let name: IconNames = 'IconCircleCheckFilled';
		if (state === 'error') {
			name = 'IconAlertCircleFilled';
			color = theme?.custom_toast?.icon_color?.error;
		} else if (state === 'warning') {
			color = theme?.custom_toast?.icon_color?.warning;
			name = 'IconAlertTriangleFilled';
		}

		const currentIconName: IconNames = name;
		const colorName = color;
		const comp = (
			<Grid sx={{ padding: '1.6rem', ...mainContainerStyle }}>
				{showIcon && (
					<Typography variant='h4' align='center'>
						<Icon size={iconSize} color={colorName} sx={{ fontSize: '36px' }} iconName={currentIconName} />
					</Typography>
				)}
				<Typography align='center' sx={titleContainerStyle} color={theme?.custom_toast?.icon_color?.secondary} variant='h5'>
					{title}
				</Typography>
				<Grid sx={{ marginTop: '10px' }}>
					<Typography align='center' color={theme?.custom_toast?.icon_color?.tertiary} variant={subtitle_font_variant}>
						{capitalize_subtitle ? _.capitalize(subtitle) : subtitle}
					</Typography>
				</Grid>
				{showActions && (
					<Grid
						sx={{
							width: '85%',
							display: 'flex',
							margin: '1.8rem auto 0',
							justifyContent: 'space-between',
							...containerStyle,
						}}>
						{handleSecondry && (
							<Button onClick={handleSecondry} sx={theme?.custom_toast?.hover_secondary} variant='outlined'>
								{secondryBtnName}
							</Button>
						)}
						{primaryBtnName && <Button onClick={handlePrimary}>{primaryBtnName}</Button>}
					</Grid>
				)}
			</Grid>
		);
		return comp;
	};
	return (
		<SnackBar
			style={{ borderRadius: theme?.banner_?.borderRadius }}
			open={open}
			message={bodyResolver()}
			action={
				<IconButton
					sx={{
						position: 'absolute',
						top: '5px',
						right: '5px',
						zIndex: 1000000,
						...theme?.custom_toast?.hover_primary,
					}}>
					{showCross ? <Icon onClick={onClose} color='white' iconName='IconX' /> : <> </>}
				</IconButton>
			}
			sx={{
				background: theme?.custom_toast?.background,
				borderRadius: '12px',
				width,
				zIndex: 99999,
			}}
			autoHideDuration={autoHideDuration}
			onClose={onClose}
			anchorOrigin={anchorOrigin}
			{...rest}
		/>
	);
};

Toaster.defaultProps = {
	message: 'Message',
	action: <Icon color='white' iconName='IconX' />,
	autoHideDuration: 3000,
	onClose: () => {},
	open: true,
	anchorOrigin: {
		vertical: 'top',
		horizontal: 'right',
	},
	title: 'title',
	subtitle: 'subtitle',
	primaryBtnName: 'primary',
	secondryBtnName: 'secondry',
	handleSecondry: () => {},
	handlePrimary: () => {},
	iconColor: '#8CB910',
	iconSize: 'small',
};

export default Toaster;
