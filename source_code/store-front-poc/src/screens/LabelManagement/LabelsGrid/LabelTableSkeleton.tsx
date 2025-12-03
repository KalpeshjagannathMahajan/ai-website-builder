import TableSkeleton from 'src/common/TableSkeleton';
import { Box, Grid, Skeleton } from 'src/common/@the-source/atoms';
import { makeStyles } from '@mui/styles';
import React from 'react';

const useStyles = makeStyles(() => ({
	top_container: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '20px 2px',
	},
	skeleton_container_style: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
}));

const LabelTableSkeleton = () => {
	const style = useStyles();
	return (
		<React.Fragment>
			<Grid className={style.skeleton_container_style} width='100%'>
				<Box className={style.skeleton_container_style} gap={1}>
					<Skeleton variant='text' width='100px' height='20px' />
				</Box>

				<Box className={style.skeleton_container_style} gap={2}>
					<Skeleton variant='rectangular' width='148px' height='38px' sx={{ borderRadius: 1 }} />
					<Skeleton variant='rectangular' width='100px' height='38px' sx={{ borderRadius: 1 }} />
				</Box>
			</Grid>
			<Grid mt={1.8}>
				<TableSkeleton />
			</Grid>
		</React.Fragment>
	);
};

export default LabelTableSkeleton;
