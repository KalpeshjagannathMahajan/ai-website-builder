import { Card } from '@mui/material';
import { Grid, Skeleton } from 'src/common/@the-source/atoms';

const skeleton_card = { background: 'white', margin: '5px 15px 10px 0px', boxShadow: 'none' };

const SkeletonProductCard = () => {
	const b = [1, 2, 3];
	return (
		<Card sx={skeleton_card}>
			<Grid item>
				<Skeleton variant='rounded' height={300} width='100%' />
			</Grid>
			<Grid item>
				<Grid container>
					<Grid marginLeft='8px'>
						<Skeleton variant='text' width={150} height={20} />
						<Skeleton variant='text' width={120} height={20} />
						<Grid sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
							{b.map((item: any) => (
								<Skeleton key={item} width={40} height={10} />
							))}
						</Grid>
					</Grid>
				</Grid>
				<Grid container justifyContent='center' alignItems='center' margin='8px 2px'>
					<Skeleton variant='rounded' width='92%' height={30} sx={{ background: 'rgba(232, 243, 239, 1)' }} />
				</Grid>
			</Grid>
		</Card>
	);
};

export default SkeletonProductCard;
