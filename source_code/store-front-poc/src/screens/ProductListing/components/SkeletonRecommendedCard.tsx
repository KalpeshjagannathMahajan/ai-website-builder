import { Card } from '@mui/material';
import React from 'react';
import { Grid, Skeleton } from 'src/common/@the-source/atoms';

const SkeletonRecommendedCard = () => {
	const arr = [1, 2, 3];
	return (
		<React.Fragment>
			<Skeleton variant='text' width='100px' sx={{ my: 1.5, mx: 1.2 }} />
			<Grid container direction='row' flexWrap='nowrap'>
				{arr.map((a) => (
					<Grid item key={a}>
						<Card style={{ width: '436px', height: '175px', padding: '8px', marginRight: '16px', boxShadow: 'none' }}>
							<Grid container direction='row' justifyContent='space-between'>
								<Grid>
									<Skeleton variant='rounded' width='184px' height='160px' />
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
					</Grid>
				))}
			</Grid>
		</React.Fragment>
	);
};

export default SkeletonRecommendedCard;
