import { Divider, Modal as MuiModal, ModalProps as MuiModalProps } from '@mui/material';
import CustomText from '../../CustomText';
import Box from '../Box/Box';
import Icon from '../Icon/Icon';
import Grid from '../Grid/Grid';
import './Modal.css';
import { useTheme } from '@mui/material/styles';

interface ModalProps extends MuiModalProps {
	title: string;
	onClose: () => void;
	footer?: React.ReactNode;
	open: boolean;
	width?: number;
	bgColor?: string;
	hideCloseIcon?: boolean;
	_height?: string;
	is_clickoutside_to_close?: boolean;
	showHeader?: boolean;
	container_style?: any;
}

const getModalStyle = (width: number = 400, bgColor: string = 'background.paper', height: string = '', theme: any) => ({
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	maxWidth: { xs: 300, sm: 450 },
	width, // Use the width provided
	height,
	bgcolor: bgColor,
	background: theme?.modal?.background,
	boxShadow: 24,
	borderRadius: '8px',
	p: '2rem 0rem',
});

const getBoxStyles = (theme: any) => ({
	position: 'absolute',
	width: '100%',
	minHeight: '40px',
	zIndex: 1,
	background: theme?.modal?.background,
	borderRadius: theme?.modal_?.borderRadius,
	bottom: 0,
});

const Modal: React.FC<ModalProps> = ({
	title,
	footer,
	onClose,
	children,
	width,
	bgColor,
	hideCloseIcon = false,
	_height = 'auto',
	is_clickoutside_to_close = false,
	showHeader = true,
	container_style,
	...modalProps
}: any) => {
	const theme: any = useTheme();
	const handle_close = (event: any, reason: any) => {
		if (is_clickoutside_to_close && reason && reason === 'backdropClick') {
			onClose();
		}
	};
	return (
		<MuiModal {...modalProps} onClose={handle_close}>
			<Box sx={{ ...getModalStyle(width, bgColor, _height, theme), ...theme?.modal_ }}>
				{showHeader && (
					<>
						<Grid container className='modal_header_container'>
							<CustomText type='H6' style={{ flex: 1 }}>
								{title}
							</CustomText>
							{!hideCloseIcon && <Icon onClick={onClose} color={theme?.modal?.icon_color} sx={{ cursor: 'pointer' }} iconName='IconX' />}
						</Grid>
						<Divider />
					</>
				)}

				<Box className='modal_content_container' sx={container_style}>
					{children}
				</Box>

				{footer && (
					<Box className='' sx={_height === 'auto' ? {} : getBoxStyles(theme)}>
						<Divider />
						<Box className='modal_footer_container'>{footer}</Box>
					</Box>
				)}
			</Box>
		</MuiModal>
	);
};

Modal.defaultProps = {};
export default Modal;
