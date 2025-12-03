import { makeStyles } from '@mui/styles';
import { Grid, Skeleton } from 'src/common/@the-source/atoms';

const useStyles = makeStyles((theme: any) => ({
	card_container: {
		borderRadius: theme?.wishlist_style?.border_radius,
		flex: 1,
		height: '100%',
		width: '100%',
		overflow: 'hidden',
	},
}));

const WishlistCardSkeleton = () => {
	const classes = useStyles();

	return (
		<Grid className={classes.card_container}>
			<Skeleton variant='rectangular' height={'100%'} />
		</Grid>
	);
};

export default WishlistCardSkeleton;
