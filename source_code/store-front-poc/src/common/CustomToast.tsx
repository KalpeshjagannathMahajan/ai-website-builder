import { Icon } from 'src/common/@the-source/atoms';
import { IconNames } from 'src/common/@the-source/atoms/Icon/baseTypes';
import SnackBar, { SnackbarProps } from 'src/common/@the-source/atoms/Snackbar/Snackbar';
import CustomText from './@the-source/CustomText';
import { useTheme } from '@mui/material/styles';

export interface ToasterProps extends SnackbarProps {
	message?: React.ReactNode;
	action?: React.ReactNode;
	autoHideDuration?: number;
	state: 'error' | 'warning' | 'success' | string;
	title?: any;
	subtitle?: any;
	iconColor?: string;
	handleSecondry?: any;
	handlePrimary?: any;
	showActions: boolean;
	text_container_style?: any;
	container_style?: any;
	showCross: boolean;
	primaryBtnName?: string;
	secondryBtnName?: string;
	is_custom: boolean;
	custom_icon?: any;
	anchorOrigin?: {
		vertical: 'top' | 'bottom';
		horizontal: 'left' | 'center' | 'right';
	};
	show_icon: boolean;
	onClose?: () => void;
	open?: boolean;
}

const Toaster = ({
	message,
	action,
	autoHideDuration = 3000,
	anchorOrigin = { vertical: 'top', horizontal: 'right' },
	onClose = () => {},
	open = false,
	state,
	iconColor,
	title,
	subtitle,
	handleSecondry,
	primaryBtnName,
	showCross,
	secondryBtnName,
	handlePrimary,
	is_custom,
	show_icon,
	custom_icon,
	text_container_style,
	container_style,
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
			<div className='toaster-container' style={{ ...container_style }}>
				{show_icon && (
					<div className='icon-wrapper'>
						<Icon className='icon' color={colorName} iconName={is_custom ? custom_icon : currentIconName} />
					</div>
				)}
				<div className='text-container' style={{ ...text_container_style }}>
					<div className='title-container'>
						<CustomText color={theme?.custom_toast?.icon_color?.secondary} type='H2' className='title-text'>
							{title}
						</CustomText>
						{showCross ? (
							<Icon onClick={onClose} color={theme?.custom_toast?.icon_color?.secondary} iconName='IconX' className='cross-icon' />
						) : (
							<> </>
						)}
					</div>

					{subtitle && (
						<CustomText color={theme?.custom_toast?.icon_color?.secondary} type='Title' className='subtitle-text'>
							{subtitle}
						</CustomText>
					)}
				</div>
			</div>
		);
		return comp;
	};
	return (
		<SnackBar
			open={open}
			message={bodyResolver()}
			action={null}
			sx={{
				background: theme?.custom_toast?.background,
				zIndex: 1000000,
				width: '90%',
				maxWidth: '443px',
				borderRadius: theme?.banner_?.borderRadius,
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
	is_custom: false,
	subtitle: 'subtitle',
	primaryBtnName: 'primary',
	secondryBtnName: 'secondry',
	handleSecondry: () => {},
	handlePrimary: () => {},
	iconColor: '#8CB910',
	show_icon: true,
};

export default Toaster;
