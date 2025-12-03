import { Card } from '@mui/material';
import _ from 'lodash';
import React from 'react';
import { Grid, Skeleton } from 'src/common/@the-source/atoms';
import useStyles from '../styles';

function PaymentSkeleton() {
	const classes = useStyles();

	return (
		<React.Fragment>
			<Card className={classes.card_style}>
				<Grid>
					<Grid p={2}>
						<Skeleton
							variant='text'
							width='120px'
							sx={{
								marginBottom: 2,
							}}
						/>
						<Skeleton variant='rounded' width='100%' height='80px' />
					</Grid>
				</Grid>
			</Card>
			{_.map([1, 2, 3], (item) => (
				<Card key={item} className={classes.card_style} style={{ height: '250px' }}>
					<Grid>
						<Grid p={2}>
							<Skeleton variant='rounded' width='100%' height='100px' />
						</Grid>
					</Grid>
				</Card>
			))}
		</React.Fragment>
	);
}

export default PaymentSkeleton;
