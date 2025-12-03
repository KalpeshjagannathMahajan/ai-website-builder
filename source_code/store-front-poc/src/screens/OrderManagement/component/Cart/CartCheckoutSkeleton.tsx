import { Grid, Skeleton } from 'src/common/@the-source/atoms';

const CartCheckoutSkeleton = () => {
	return (
		<Grid container gap={2}>
			<Grid item>
				<Skeleton variant='circular' width={60} height={60} sx={{ mb: 2 }} />
			</Grid>
			<Grid item mt={1}>
				<Skeleton variant='rounded' width={250} height={10} sx={{ mb: 2 }} />
				<Skeleton variant='rounded' width={250} height={10} sx={{ mb: 2 }} />
			</Grid>
		</Grid>
	);
};

export default CartCheckoutSkeleton;
