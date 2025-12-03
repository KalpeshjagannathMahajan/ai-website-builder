import { Card, Divider } from '@mui/material';
import { Grid, Skeleton } from 'src/common/@the-source/atoms';

const CartSkeleton = () => {
	const arr = [1, 2, 3, 4];
	return (
		<>
			{arr.map((a) => (
				<Grid item key={a}>
					<Card style={{ width: '100%', height: '184px', margin: '10px', padding: '8px', boxShadow: 'none' }}>
						<Grid container direction='row' justifyContent='space-between'>
							<Grid>
								<Skeleton variant='rounded' width='164px' height='167px' />
							</Grid>
							<Grid container direction='column' justifyContent='space-between' width='220px'>
								<Grid container direction='row' justifyContent='space-between'>
									<Skeleton variant='text' sx={{ padding: '4px 0px ', width: '100px' }} />
									<Skeleton variant='text' sx={{ border: '1px solid rgba(0, 0, 0, 0.12)', fontSize: '10px', width: '50px' }} />
								</Grid>
								<Skeleton variant='text' width='80px' />
								<Skeleton variant='text' width='80px' />
								<Grid>
									<Skeleton variant='text' />
								</Grid>
								<Skeleton variant='rounded' height='30px' />
							</Grid>
						</Grid>
					</Card>
					<Divider />
				</Grid>
			))}
		</>
	);
};

export default CartSkeleton;
