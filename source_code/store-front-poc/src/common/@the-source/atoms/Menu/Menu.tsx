// import { ContentCut } from '@mui/icons-material';
import {
	ListItemIcon,
	ListItemText,
	Menu as MUIMenu,
	MenuItem as MUIMenuItem,
	MenuItemProps as MUIMenuItemProps,
	MenuProps as MUIMenuProps,
	Typography,
} from '@mui/material';
import { useState } from 'react';
import { IconNames } from '../Icon/baseTypes';
import Icon from '../Icon/Icon';
import React from 'react';
import CircularProgressBar from '../ProgressBar/CircularProgressBar';

type MenuBase = Pick<MUIMenuProps, 'onClick' | 'className'>;
type MenuItemBase = Pick<MUIMenuItemProps, 'value' | 'onClick'>;

export interface MenuProps extends MenuBase {
	onClick?: any;
	menu: MenuListProps[];
	LabelComponent: React.ReactNode;
	btnStyle?: any;
	onClickMenuItem?: any;
	loading?: boolean;
	disabled?: boolean;
	closeOnItemClick?: any;
	menuItemStyle?: any;
}

interface MenuListProps {
	label: string;
	icon?: IconNames | string;
	subText?: string;
	onClick?: () => any;
}

export interface MenuItemProps extends MenuItemBase {
	children?: string;
	label: string;
	subText?: string;
	onClick?: any;
	menu: MenuListProps[];
}

const Menu = ({
	menu,
	LabelComponent,
	onClick,
	btnStyle,
	onClickMenuItem,
	closeOnItemClick,
	loading,
	disabled,
	menuItemStyle,
	...rest
}: MenuProps) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Typography
				sx={{
					...btnStyle,
				}}
				onClick={handleClick}>
				{LabelComponent}
			</Typography>
			<MUIMenu anchorEl={anchorEl} {...rest} onClose={handleClose} open={open}>
				{menu?.map(
					(item: any): JSX.Element => (
						<MUIMenuItem
							disabled={item?.disabled || false}
							sx={menuItemStyle}
							onClick={(e) => {
								onClickMenuItem(item.label);
								handleClose();
								if (item?.onClick) {
									item?.onClick();
								}
								e.stopPropagation();
							}}
							key={item.label}>
							{item?.icon && (
								<Icon
									iconName={item?.icon}
									sx={{
										paddingRight: '1rem',
									}}
								/>
							)}
							{item?.img && (
								<ListItemIcon>
									<img src={item?.img} alt='img' />
								</ListItemIcon>
							)}
							{loading && (
								<CircularProgressBar style={{ width: '25px', height: '25px', marginRight: 15, color: '#4f4b4b' }} variant='indeterminate' />
							)}
							<ListItemText
								style={{ pointerEvents: disabled || item?.disabled ? 'none' : 'auto', opacity: disabled ? 0.5 : 1 }}
								primary={item?.label}
								secondary={item?.subText}
							/>
						</MUIMenuItem>
					),
				)}
			</MUIMenu>
		</>
	);
};

Menu.defaultProps = {
	onClick: () => {},
	subText: '',
	btnStyle: { background: 'none' },
	onClickMenuItem: () => {},
	closeOnItemClick: false,
};
export default Menu;
