import { Box, Grid, Skeleton } from 'src/common/@the-source/atoms';
import useStyles from '../styles';
import React from 'react';
import TableSkeleton from 'src/common/TableSkeleton';

const DashboardSkeleton = () => {
	const style = useStyles();

	const analytics_card_arr = [1, 2, 3, 4];

	return (
		<React.Fragment>
			<Grid className={style.skeleton_container_style} my={2} mx={1} width='100%'>
				<Box className={style.skeleton_container_style} gap={1}>
					<Skeleton variant='rounded' width='13.8rem' height='4rem' />
					<Skeleton variant='rounded' width='9.2rem' height='4rem' />
					<Skeleton variant='rounded' width='12.5rem' height='4rem' />
				</Box>

				<Box className={style.skeleton_container_style} gap={1} mr={2}>
					<Skeleton variant='rounded' width='13rem' height='4rem' />
					<Skeleton variant='rounded' width='12rem' height='4rem' />
				</Box>
			</Grid>
			<Grid mx={1}>
				<Skeleton variant='text' width='10rem' />
			</Grid>
			<Grid className={style.skeleton_container_style} my={1} mx={1}>
				{analytics_card_arr?.map((item) => (
					<Skeleton key={item} variant='rectangular' width='31.5rem' height='15.5rem' sx={{ borderRadius: 2.5 }} />
				))}
			</Grid>

			<Grid mx={1} my={1.5}>
				<Skeleton variant='text' width='10rem' />
			</Grid>

			<Grid mx={1} my={2}>
				<TableSkeleton />
			</Grid>
		</React.Fragment>
	);
};

export default DashboardSkeleton;
