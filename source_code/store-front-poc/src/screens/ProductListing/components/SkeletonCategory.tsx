import React from 'react';
import { Grid, Skeleton } from 'src/common/@the-source/atoms';

const SkeletonCategory = () => {
	const arr = [1, 2, 3, 4, 5, 6];
	return (
		<React.Fragment>
			<Grid container direction='row' flexWrap='nowrap'>
				{arr.map((a) => (
					<Grid key={a} style={{ width: '200px', height: '216px', margin: '10px', background: 'none', boxShadow: 'none' }}>
						<Skeleton variant='rounded' width='200px' height='180px' />
						<Grid container direction='column' justifyContent='flex-end' alignItems='center'>
							<Skeleton variant='text' width='7.5rem' height='1.5rem' sx={{ lineHeight: '24px', fontWeight: '400', fontSize: '16px' }} />
						</Grid>
					</Grid>
				))}
			</Grid>
		</React.Fragment>
	);
};

export default SkeletonCategory;
