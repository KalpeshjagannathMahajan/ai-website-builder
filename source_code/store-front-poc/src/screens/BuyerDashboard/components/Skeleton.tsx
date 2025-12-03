import React from 'react';
import { Box, Grid, Skeleton } from 'src/common/@the-source/atoms';
import useStyles from '../styles';
import TableSkeleton from 'src/common/TableSkeleton';

function BuyerDashboardSkeleton() {
	const style = useStyles();
	const analytics_card_arr = [1, 2, 3, 4];

	return (
		<React.Fragment>
			<Grid className={style.skeleton_container_style} my={1.6} width='100%'>
				<Box className={style.skeleton_container_style} gap={1}>
					<Skeleton variant='text' width='28rem' height='2.5rem' />
				</Box>

				<Box className={style.skeleton_container_style}>
					<Skeleton variant='rounded' width='12rem' height='4rem' />
				</Box>
			</Grid>

			<Grid container flexDirection='row' justifyContent='space-between' bgcolor='white' borderRadius={1}>
				<Grid display='flex' flexDirection={'column'} mx={2.6} my={1.6} gap={1} mt={2.5}>
					<Skeleton variant='text' width='22rem' />
					<Skeleton variant='text' width='22rem' />
				</Grid>
				<Grid display='flex' flexDirection='column' mx={2.6} my={1.6} gap={1}>
					<Skeleton variant='text' width='22rem' />

					<Grid display='flex' gap={2} mr={0.4}>
						<Box display='flex' gap={1}>
							<Skeleton variant='circular' width='30px' height={'30px'} />
							<Skeleton variant='text' width='10rem' />
						</Box>
						<Box display='flex' gap={1}>
							<Skeleton variant='circular' width='30px' height={'30px'} />
							<Skeleton variant='text' width='15.5rem' />
						</Box>
					</Grid>
				</Grid>
			</Grid>

			<Grid className={style.skeleton_container_style} my={1.6} width='100%'>
				<Box className={style.skeleton_container_style} gap={1}>
					<Skeleton variant='text' width='8rem' height='2.5rem' />
				</Box>

				<Box className={style.skeleton_container_style} gap={1}>
					<Skeleton variant='rounded' width='10rem' height='4rem' />
					<Skeleton variant='rounded' width='12.6rem' height='4rem' />
				</Box>
			</Grid>

			<Grid className={style.skeleton_container_style}>
				{analytics_card_arr?.map((item) => (
					<Skeleton key={item} variant='rectangular' width='32rem' height='12.5rem' sx={{ borderRadius: 2.5 }} />
				))}
			</Grid>

			<Grid mx={1} my={1.2}>
				<Skeleton variant='text' width='10rem' />
			</Grid>

			<Grid mx={1} my={1}>
				<TableSkeleton />
			</Grid>
		</React.Fragment>
	);
}

export default BuyerDashboardSkeleton;
