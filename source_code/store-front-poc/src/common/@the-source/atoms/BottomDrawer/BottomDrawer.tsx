import { Box, Drawer as MuiDrawer, DrawerProps as MuiDrawerProps } from '@mui/material';
import styles from './BottomDrawer.module.css';
import { Grid, Icon, Typography } from '..';

type DrawerBaseProps = Pick<MuiDrawerProps, 'open' | 'onClose' | 'anchor'>;

export interface DrawerProps extends DrawerBaseProps {
	open: boolean;
	onClose: any;
	anchor?: any;
	height?: number;
	title?: string;
	content: any;
	style?: any;
}

const BottomDrawer = ({ open, style, onClose, anchor, height, title, content, ...rest }: DrawerProps) => (
	<MuiDrawer style={style} open={open} onClose={onClose} anchor={anchor} {...rest}>
		<Box height={height} className={styles.bottom_container}>
			<Grid className={styles.header_component}>
				<Typography variant='h5'>{title}</Typography>
				<Icon iconName='IconX' onClick={onClose} sx={{ cursor: 'pointer' }} />
			</Grid>
			<Grid className={styles.content_container}>{content}</Grid>
		</Box>
	</MuiDrawer>
);

BottomDrawer.defaultProps = { anchor: 'bottom', height: 1000, style: {} };

export default BottomDrawer;
