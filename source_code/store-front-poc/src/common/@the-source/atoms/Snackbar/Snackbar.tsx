import { Snackbar as MuiSnackbar, SnackbarContent, SnackbarProps as MuiSnackbarProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Icon from '../Icon/Icon';

export interface SnackbarProps extends MuiSnackbarProps {
	message?: React.ReactNode;
	action?: React.ReactNode;
	autoHideDuration?: number;
	anchorOrigin?: {
		vertical: 'top' | 'bottom';
		horizontal: 'left' | 'center' | 'right';
	};
	onClose?: () => void;
	open?: boolean;
}

const Snackbar = ({
	message,
	action,
	autoHideDuration = 3000,
	anchorOrigin = { vertical: 'top', horizontal: 'right' },
	onClose = () => {},
	open = false,
	...rest
}: SnackbarProps) => {
	const theme: any = useTheme();
	return (
		<MuiSnackbar
			id={'snackbar_id'}
			style={{ borderRadius: theme?.banner_?.borderRadius }}
			open={open}
			autoHideDuration={autoHideDuration}
			onClose={onClose}
			anchorOrigin={anchorOrigin}
			{...rest}>
			<SnackbarContent
				sx={{
					width: '100%',
					margin: '0px',
					padding: '0px',
					display: 'block',
					background: 'none',
				}}
				message={message}
				action={action}
			/>
		</MuiSnackbar>
	);
};

Snackbar.defaultProps = {
	message: 'Message',
	action: <Icon color='white' iconName='IconX' />,
	autoHideDuration: 3000,
	onClose: () => {},
	open: true,
	anchorOrigin: {
		vertical: 'top',
		horizontal: 'right',
	},
};

export default Snackbar;
