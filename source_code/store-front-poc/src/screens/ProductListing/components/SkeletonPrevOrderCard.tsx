import { Card } from '@mui/material';
import { Grid, Skeleton } from 'src/common/@the-source/atoms';

interface skeletonProps {
	is_rail?: boolean;
}
const SkeletonPrevOrderCard = ({ is_rail = true }: skeletonProps) => {
	const arr = [1, 2, 3, 4, 5];
	return (
		<>
			{is_rail ? (
				<>
					<Grid container justifyContent='space-between' direction='row'>
						<Grid item pl={'16px'} pt={'8px'}>
							<Skeleton variant='rounded' width='80px' height='12px' />
						</Grid>
					</Grid>
					<Grid container direction='row' flexWrap='nowrap'>
						{arr.map((a) => (
							<Grid item key={a}>
								<Card style={{ width: '456px', height: '200px', margin: '10px', padding: '8px', boxShadow: 'none' }}>
									<Grid container direction='row' justifyContent='space-between'>
										<Grid>
											<Skeleton variant='rounded' width='216px' height='190px' />
										</Grid>
										<Grid container direction='column' justifyContent='space-between' width='198px'>
											<Skeleton variant='rounded' height='40px' />
											<Skeleton variant='text' width='80px' />
											<Skeleton variant='text' width='80px' />
											<Skeleton variant='text' width='80px' />
											<Grid>
												<Skeleton variant='text' />
											</Grid>
											<Skeleton variant='rounded' height='30px' />
										</Grid>
									</Grid>
								</Card>
							</Grid>
						))}
					</Grid>
				</>
			) : (
				<Grid container direction='row' columns={{ xs: 12, sm: 12, md: 12, lg: 15, xl: 15 }}>
					{arr.map((a) => (
						<Grid xs={12} sm={9} md={6} lg={4.9} xl={4} item key={a}>
							<Card style={{ width: 'auto', height: '200px', margin: '10px', padding: '8px', boxShadow: 'none' }}>
								<Grid container direction='row' justifyContent='space-between'>
									<Grid>
										<Skeleton variant='rounded' width='45%' height='190px' />
									</Grid>
									<Grid container direction='column' justifyContent='space-between' width='52%'>
										<Skeleton variant='rounded' height='40px' />
										<Skeleton variant='text' width='80px' />
										<Skeleton variant='text' width='80px' />
										<Skeleton variant='text' width='80px' />
										<Grid>
											<Skeleton variant='text' />
										</Grid>
										<Skeleton variant='rounded' height='30px' />
									</Grid>
								</Grid>
							</Card>
						</Grid>
					))}
				</Grid>
			)}
		</>
	);
};

export default SkeletonPrevOrderCard;
