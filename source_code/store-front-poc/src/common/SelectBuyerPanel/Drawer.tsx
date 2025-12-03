import { Drawer as MuiDrawer, DrawerProps as MuiDrawerProps } from '@mui/material';

type DrawerBaseProps = Pick<MuiDrawerProps, 'open' | 'onClose' | 'anchor'>;

export interface DrawerProps extends DrawerBaseProps {
	open: boolean;
	onClose: any;
	anchor?: any;
	width?: number;
	content: any;
	style?: any;
}

const Drawer = ({ open, style, onClose, anchor, width, content, children, ...rest }: DrawerProps) => (
	<MuiDrawer style={style} open={open} onClose={onClose} anchor={anchor} {...rest}>
		{children}
	</MuiDrawer>
);

Drawer.defaultProps = { anchor: 'right', width: 420, style: {} };

export default Drawer;
