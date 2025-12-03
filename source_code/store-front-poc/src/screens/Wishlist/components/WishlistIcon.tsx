import { makeStyles } from '@mui/styles';
import { Grid, Icon } from 'src/common/@the-source/atoms';
import { colors } from 'src/utils/theme';

interface WishlistIconProps {
	active: boolean;
	icon_size?: 'SMALL' | 'LARGE';
}

const useStyles = makeStyles(() => ({
	icon_container: {
		backgroundColor: colors.white,
		borderRadius: '200px',
		cursor: 'pointer',
		border: `1px solid ${colors.black_14}`,
	},
	icon_large: {
		width: '40px',
		height: '40px',
	},
	icon_small: {
		boxShadow: `0px 4.88px 14.64px 0px ${colors.black_14}`,
		width: '30px',
		height: '30px',
	},
	icon_active: {
		color: colors.red,
	},
	icon_inactive: {
		backgroundColor: colors.white,
	},
}));

const WishlistIcon = ({ active, icon_size = 'SMALL' }: WishlistIconProps) => {
	const classes = useStyles();
	return (
		<Grid
			container
			className={`${classes.icon_container} ${icon_size === 'SMALL' ? classes.icon_small : classes.icon_large}`}
			justifyContent={'center'}
			alignItems={'center'}>
			{active ? (
				<Icon iconName='IconHeartFilled' className={classes.icon_active} />
			) : (
				<Icon iconName='IconHeart' color={colors.grey_800} className={classes.icon_inactive} />
			)}
		</Grid>
	);
};

export default WishlistIcon;
