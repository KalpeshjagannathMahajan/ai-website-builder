import { Box, Grid } from 'src/common/@the-source/atoms';
import { Skeleton } from '@mui/material';

const SkeletonComp = () => {
	return (
		<Grid
			justifyContent='space-between'
			alignItems='center'
			sx={{ width: '100%', maxWidth: '415px', margin: 'auto', paddingTop: '135px', overflowY: 'auto' }}>
			<Box display='flex' flexDirection='row' gap='16px' sx={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
				<Skeleton variant='rectangular' width='300px' height='50px' />
			</Box>
			<Box mt={'15px'} display={'flex'} sx={{ justifyContent: 'center' }}>
				<Skeleton variant='rectangular' width='84%' height='18px' />
			</Box>
			<Box mt={'35px'} display={'flex'} sx={{ justifyContent: 'center' }}>
				<Skeleton variant='rectangular' width='100%' height='55px' />
			</Box>
			<Box mt={'35px'} display={'flex'} sx={{ justifyContent: 'center' }}>
				<Skeleton variant='rectangular' width='100%' height='40px' />
			</Box>
			<Box mt={'25px'} display={'flex'} sx={{ justifyContent: 'center' }}>
				<Skeleton variant='rectangular' width='30%' height='20px' />
			</Box>
		</Grid>
	);
};

const UnderReviewSkeleton = () => {
	return (
		<Grid>
			<SkeletonComp />
		</Grid>
	);
};

export default UnderReviewSkeleton;
