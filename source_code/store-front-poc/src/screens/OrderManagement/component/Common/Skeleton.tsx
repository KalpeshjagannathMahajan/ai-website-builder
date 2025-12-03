import React from 'react';
import { Grid, Skeleton } from 'src/common/@the-source/atoms';

const SkeletonContainer = () => {
	return (
		<React.Fragment>
			<Grid container justifyContent={'space-between'}>
				<Grid item md={12} sm={12} lg={7.9} xl={7.9}>
					{Array.from({ length: 6 }).map((ele: any) => (
						<Skeleton key={ele} sx={{ width: '100%', marginBottom: '1rem' }} height={'10rem'} variant='rounded' />
					))}
				</Grid>
				<Grid item md={12} sm={12} lg={4} xl={4}>
					<Skeleton height={'50vh'} variant='rounded' width={'100%'} />
				</Grid>
			</Grid>
		</React.Fragment>
	);
};

export default SkeletonContainer;
