import React from 'react';
import { Alert as MuiAlert, useTheme } from '@mui/material';
import Icon from '../Icon/Icon';

interface AlertComponentProps {
	severity: any;
	message: any;
	open: boolean;
	handle_close?: any;
	variant?: any;
	icon?: any;
	style?: any;
	is_cross?: boolean;
	className?: any;
}

const Alert: React.FC<AlertComponentProps> = ({
	className,
	severity,
	message,
	icon,
	variant,
	open,
	handle_close,
	style,
	is_cross = true,
}) => {
	const theme: any = useTheme();

	if (!open) {
		return null;
	}

	const close_icon_style = {
		cursor: 'pointer',
		mt: 0.5,
	};

	return (
		<MuiAlert
			className={className}
			style={{ ...theme?.alert, ...style }}
			variant={variant}
			action={
				is_cross && handle_close && <Icon onClick={() => handle_close(!open)} color='#B5BBC3' sx={close_icon_style} iconName='IconX' />
			}
			icon={icon}
			severity={severity}>
			{message}
		</MuiAlert>
	);
};

Alert.defaultProps = {
	open: false,
};

export default Alert;
