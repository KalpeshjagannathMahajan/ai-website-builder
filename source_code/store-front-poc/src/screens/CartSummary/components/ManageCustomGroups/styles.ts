import { makeStyles } from '@mui/styles';
import { colors } from 'src/utils/theme';

export const DRAWER_WIDTH = 480;

export const useStyles = makeStyles(() => ({
	container: {
		width: `${DRAWER_WIDTH}px`,
		height: '100vh',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		background: colors.white,
	},
	header: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	groupped_items: {
		flex: 1,
		overflowY: 'auto',
		background: 'white',
		padding: '1rem 1.5rem 1rem 1rem',
	},
	footer: {
		display: 'flex',
		justifyContent: 'flex-end',
		background: 'white',
	},
	product_list: {
		display: 'flex',
		alignItems: 'center',
		border: `1px solid ${colors.grey_300}`,
		borderRadius: '0.8rem',
		padding: '0.5rem 1.5rem',
		margin: '0.8rem 0',
		gap: '2.5rem',
	},
	draggable_group: {
		marginBottom: '0.5rem',
		padding: '1rem 0',
	},
	draggable_group_header: {
		border: `1px solid ${colors.grey_500}`,
		padding: '1rem 1.2rem',
		borderRadius: '0.8rem',
		background: colors.grey_300,
		gap: '1.5rem',
	},
	plus_icon: {
		marginRight: '0.5rem',
	},
	product_list_img: {
		width: 48,
		height: 45,
		borderRadius: '0.8rem',
		border: `1px solid ${colors.grey_300}`,
		padding: '0.5rem',
	},
}));
