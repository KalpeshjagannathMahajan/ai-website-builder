import React from 'react';
import { Grid, Skeleton } from 'src/common/@the-source/atoms';

function BuyerInfoSkeleton() {
	return (
		<React.Fragment>
			<Grid container gap={2}>
				<Grid item>
					<Skeleton variant='rounded' width={60} height={60} sx={{ mb: 2 }} />
				</Grid>
				<Grid item mt={1}>
					<Skeleton variant='rounded' width={250} height={10} sx={{ mb: 2 }} />
					<Skeleton variant='rounded' width={250} height={10} sx={{ mb: 2 }} />
				</Grid>
			</Grid>
		</React.Fragment>
	);
}

export default BuyerInfoSkeleton;
