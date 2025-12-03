import React from 'react';
import { Box, Grid, Skeleton } from 'src/common/@the-source/atoms';

const SkeletonLoader = () => {
	return (
		<React.Fragment>
			<Grid container>
				<Grid md={12} sm={12}>
					<Skeleton sx={{ width: '100%' }} height={'40vh'} variant='rounded' />
					<Box display='flex' justifyContent='center'>
						<Skeleton sx={{ width: '92%' }} height={'80vh'} variant='rectangular' />
					</Box>
				</Grid>
			</Grid>
		</React.Fragment>
	);
};

export default SkeletonLoader;
