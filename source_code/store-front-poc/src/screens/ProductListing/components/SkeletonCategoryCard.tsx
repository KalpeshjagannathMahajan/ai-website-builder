import { Card } from '@mui/material';
import { Grid, Skeleton } from 'src/common/@the-source/atoms';

const SkeletonCategoryCard = () => {
	const arr = [1, 2, 3, 4];
	return (
		<>
			<Grid container justifyContent={'space-between'} sx={{ padding: '1.4rem' }} alignItems={'center'}>
				<Grid width={'fit-content'}>
					<Skeleton height={'2rem'} variant='text' width={'10.7rem'} />
					<Skeleton height={'1.9rem'} variant='text' width={'10.7rem'} />
				</Grid>
				<Grid container display={'flex'} justifyContent={'space-between'} gap={1} width={'fit-content'}>
					<Skeleton height={'4rem'} variant='rounded' width={'14.7rem'} />
					<Skeleton height={'4rem'} variant='rounded' width={'4rem'} />
				</Grid>
			</Grid>
			<Grid container direction='row' margin='0px'>
				<Grid container direction='row' flexWrap='wrap' spacing={2.4} alignItems='stretch'>
					{arr.map((a) => (
						<Grid xs={12} sm={6} md={4} lg={3} xl={3} item>
							<Card
								key={a}
								style={{
									width: '28.6rem',
									height: '29.2rem',
									margin: '0.2rem 1rem',
									background: 'none',
									border: 'none',
									boxShadow: 'none',
								}}>
								<Skeleton variant='rounded' width='36.7rem' height='20rem' />
								<Grid container direction='column' justifyContent='flex-end' margin='14px 0px'>
									<Skeleton height={'2rem'} variant='text' width={'11.7rem'} />
									<Skeleton height={'2rem'} variant='text' width={'10.7rem'} />
								</Grid>
							</Card>
						</Grid>
					))}
				</Grid>
			</Grid>
		</>
	);
};

export default SkeletonCategoryCard;
