import { Box, Grid } from 'src/common/@the-source/atoms';
import { Skeleton } from '@mui/material';

const SkeletonComp = () => {
	return (
		<Grid
			justifyContent='space-between'
			alignItems='center'
			sx={{ width: '100%', maxWidth: '450px', margin: 'auto', paddingTop: '75px', overflowY: 'auto' }}>
			<Box display='flex' flexDirection='row' gap='16px' sx={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
				<Skeleton variant='rectangular' width='300px' height='50px' />
			</Box>
			<Box
				display='flex'
				flexDirection={'column'}
				gap='60px'
				sx={{ justifyContent: 'center', alignItems: 'center', margin: 'auto', marginTop: '34px' }}>
				<Skeleton variant='rectangular' width='40%' height='38px' />
				<Skeleton variant='rectangular' width='85%' height='18px' />
			</Box>
			<Box
				display='flex'
				flexDirection={'column'}
				gap='25px'
				sx={{ justifyContent: 'center', alignItems: 'center', margin: 'auto', marginTop: '80px' }}>
				<Skeleton variant='rectangular' width='100%' height='55px' />
				<Skeleton variant='rectangular' width='100%' height='55px' />
			</Box>

			<Box display='flex' sx={{ justifyContent: 'center', alignItems: 'center', marginTop: '55px' }}>
				<Skeleton variant='rectangular' width='100%' height='40px' />
			</Box>
		</Grid>
	);
};

const ResetSkeleton = () => {
	return (
		<Grid>
			<SkeletonComp />
		</Grid>
	);
};

export default ResetSkeleton;
