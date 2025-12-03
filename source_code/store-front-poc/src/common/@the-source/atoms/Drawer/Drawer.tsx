import { Box, Drawer as MuiDrawer, DrawerProps as MuiDrawerProps } from '@mui/material';
import { useLayoutEffect, useState } from 'react';
import utils from 'src/utils/utils';

type DrawerBaseProps = Pick<MuiDrawerProps, 'open' | 'onClose' | 'anchor' | 'title'>;

export interface DrawerProps extends DrawerBaseProps {
	open: boolean;
	onClose: any;
	anchor?: any;
	width?: number;
	content?: any;
	style?: any;
}

const Drawer = ({ open, style, onClose, anchor, width, content, ...rest }: DrawerProps) => {
	const [drawerWidth, setDrawerWidth] = useState(width);

	useLayoutEffect(() => {
		const updateWidth = () => {
			const screenWidth = utils.get_screen_width();
			setDrawerWidth(screenWidth < (width ?? 420) ? screenWidth : width);
		};
		updateWidth();
		window.addEventListener('resize', updateWidth);
		return () => {
			window.removeEventListener('resize', updateWidth);
		};
	}, [width]);

	return (
		<MuiDrawer style={style} open={open} onClose={onClose} anchor={anchor} {...rest}>
			<Box width={drawerWidth}>{content}</Box>
		</MuiDrawer>
	);
};

Drawer.defaultProps = { anchor: 'right', width: 420, style: {} };

export default Drawer;
