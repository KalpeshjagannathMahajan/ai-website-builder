import { Grid } from '@mui/material';
import _ from 'lodash';
import React from 'react';
import { Skeleton } from 'src/common/@the-source/atoms';

const DrawerSkeletonContainer = ({ is_ultron }: any) => {
	let arr = is_ultron ? [1, 2, 3, 4, 5, 6] : [1, 2, 3];

	return (
		<React.Fragment>
			{is_ultron ? (
				<Grid container my={1}>
					<Grid md={12} sm={12} item>
						{arr.map((ele: any) => (
							<Skeleton key={ele} sx={{ width: '100%', marginBottom: '1.2rem' }} height={'15rem'} variant='rounded' />
						))}
					</Grid>
				</Grid>
			) : (
				<Grid container gap={2} columns={{ xs: 12, sm: 12, md: 12, lg: 12, xl: 12 }} alignItems='stretch'>
					{_.map(arr, (ele) => {
						return (
							<Grid item xs={12} sm={5} md={12} lg={3.8} xl={3.8} key={ele}>
								<Skeleton key={ele} sx={{ width: '100%', marginBottom: '1.2rem' }} height={'15rem'} variant='rounded' />
								<Skeleton key={ele} sx={{ width: '100%', marginBottom: '1.2rem' }} height={'15rem'} variant='rounded' />
							</Grid>
						);
					})}
				</Grid>
			)}
		</React.Fragment>
	);
};

export default DrawerSkeletonContainer;
