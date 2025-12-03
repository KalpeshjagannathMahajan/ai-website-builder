import { Box, Grid } from 'src/common/@the-source/atoms';
import { Skeleton } from '@mui/material';

const SkeletonComp = () => {
	return (
		<Grid
			justifyContent='space-between'
			alignItems='center'
			sx={{ width: '100%', maxWidth: '580px', margin: 'auto', paddingTop: '130px', overflowY: 'auto' }}>
			<Box display='flex' flexDirection='row' gap='16px' sx={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
				<Skeleton variant='rectangular' width='300px' height='50px' />
			</Box>
			<Box
				display='flex'
				flexDirection={'column'}
				gap='20px'
				sx={{ justifyContent: 'center', alignItems: 'center', margin: 'auto', marginTop: '49px' }}>
				<Skeleton variant='rectangular' width='400px' height='30px' />
				<Skeleton variant='rectangular' width='100%' height='18px' />
			</Box>
			<Box
				display='flex'
				flexDirection={'column'}
				gap='34px'
				sx={{ justifyContent: 'center', alignItems: 'center', margin: 'auto', marginTop: '65px' }}>
				<Skeleton variant='rectangular' width='100%' height='55px' />
				<Skeleton variant='rectangular' width='100%' height='55px' />
			</Box>
			<Box display='flex' flexDirection={'column'} mt={'6px'} gap='34px'>
				<Skeleton variant='rectangular' width='150px' height='25px' style={{ alignSelf: 'end' }} />
			</Box>
			<Box
				display='flex'
				flexDirection={'column'}
				gap='20px'
				sx={{ justifyContent: 'center', alignItems: 'center', margin: 'auto', marginTop: '30px' }}>
				<Skeleton variant='rectangular' width='100%' height='40px' />
				<Skeleton variant='rectangular' width='350px' height='20px' />
			</Box>
		</Grid>
	);
};

const LoginSkeleton = () => {
	return (
		<Grid>
			<SkeletonComp />
		</Grid>
	);
};

export default LoginSkeleton;
