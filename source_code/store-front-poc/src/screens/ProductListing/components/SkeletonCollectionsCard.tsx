import { Card } from '@mui/material';
import { Grid, Skeleton } from 'src/common/@the-source/atoms';

const SkeletonCollectionsCard = () => {
	const arr = [1, 2, 3, 4];
	return (
		<>
			<Grid container display={'flex'} justifyContent={'space-between'} sx={{ padding: '3rem 2rem' }}>
				<Skeleton height={'10px'} variant='rounded' width={'6%'} />
				<Skeleton height={'10px'} variant='rounded' width={'10%'} />
			</Grid>
			<Grid container direction='row' margin='0px'>
				<Grid container direction='row'>
					{arr.map((a) => (
						<Grid xs={12} sm={6} md={4} lg={3} xl={3} item>
							<Card
								key={a}
								style={{
									// width: '286px',
									height: '200px',
									margin: '10px',
									border: 'none',
									boxShadow: 'none',
									borderRadius: '8px',
								}}>
								<Skeleton variant='rounded' height='200px' />
								<Grid container direction='column' justifyContent='flex-end' marginTop='-4rem' marginLeft='2rem'>
									<Skeleton variant='text' sx={{ fontWeight: '700', lineHeight: '20px', fontSize: '16px', width: '150px' }} />
								</Grid>
							</Card>
						</Grid>
					))}
				</Grid>
			</Grid>
		</>
	);
};

export default SkeletonCollectionsCard;
