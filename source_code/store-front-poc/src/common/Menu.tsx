import { useState } from 'react';
import { Menu as MUIMenu, MenuItem as MUIMenuItem, MenuProps as MUIMenuProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';

type MenuBase = Pick<
	MUIMenuProps,
	'onClick' | 'className' | 'disablePortal' | 'anchorEl' | 'open' | 'onClose' | 'anchorOrigin' | 'transformOrigin'
>;

export interface Item {
	id: string;
	component?: React.ReactNode;
	onClick?: any;
	data?: any;
}

export interface MenuProps extends MenuBase {
	LabelComponent: React.ReactNode;
	menu: Item[];
	commonMenuComponent?: any;
	commonMenuOnClickHandler?: any;
	closeOnItemClick?: boolean;
	hover?: any;
	selectedId?: any;
	setValue?: any;
	position?: 'left' | 'right';
	hideGreenBorder?: boolean;
	onHover?: boolean;
	disable?: boolean;
}

const menuStyles = {
	boxShadow: '0px 8px 40px 0px rgba(0, 0, 0, 0.08)',
	background: '#FFF',
};

const Menu = ({
	menu,
	commonMenuComponent,
	LabelComponent,
	commonMenuOnClickHandler,
	closeOnItemClick,
	selectedId = '',
	setValue = () => {},
	position = 'left',
	hideGreenBorder = false,
	hover,
	onHover = false,
	disable,
	...rest
}: MenuProps) => {
	const theme: any = useTheme();
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

	const open = Boolean(anchorEl);

	const handleClick: React.MouseEventHandler<HTMLDivElement> = (event: React.MouseEvent<HTMLDivElement>) => {
		if (disable) return;
		setAnchorEl(event.currentTarget);
		setValue(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
		setValue(null);
	};

	const handleMenuItem = (item: Item) => {
		if (item.onClick) {
			item.onClick(item);
		}
		if (commonMenuOnClickHandler) commonMenuOnClickHandler(item);
		if (closeOnItemClick) handleClose();
	};

	const handle_hover_action = (params: any) => {
		if (onHover) {
			handleClick(params);
		} else {
			return null;
		}
	};
	const handle_click_action = (params: any) => {
		if (!onHover) {
			handleClick(params);
		} else {
			return null;
		}
	};
	return (
		<div>
			<div
				style={{ border: anchorEl && !selectedId && !hideGreenBorder ? '1px solid #16885f' : 'none', borderRadius: '10px' }}
				onMouseEnter={handle_hover_action}
				onClick={handle_click_action}>
				{LabelComponent}
			</div>
			<MUIMenu
				slotProps={{
					paper: {
						sx: {
							...menuStyles,
							borderRadius: theme?.dropdown_border_radius?.borderRadius,
							'& ul': {
								borderRadius: theme?.dropdown_border_radius?.borderRadius,
							},
						},
					},
				}}
				anchorEl={anchorEl}
				{...rest}
				onClose={handleClose}
				open={open}
				sx={{ margin: '.6rem', zIndex: '+10000' }}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: position,
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: position,
				}}>
				{menu?.map(
					(item: any): JSX.Element => (
						<MUIMenuItem
							disabled={item?.disabled}
							onClick={() => handleMenuItem(item)}
							key={item.id}
							sx={{
								background: `${selectedId === item?.id ? 'rgba(22, 136, 95, 0.08)' : 'transparent'} !important`,
								'&:hover': {
									backgroundColor: !hover && 'transparent', // This removes the hover background color
								},
							}}>
							{item.component ? item.component : commonMenuComponent(item)}
						</MUIMenuItem>
					),
				)}
			</MUIMenu>
		</div>
	);
};

Menu.defaultProps = {
	onClick: () => {},
	closeOnItemClick: false,
};
export default Menu;
