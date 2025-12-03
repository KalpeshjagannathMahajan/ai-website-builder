import { Grid, Skeleton } from 'src/common/@the-source/atoms';

const DirectPaymentDrawerSkeleton = () => {
	return (
		<Grid p={2} width='100%' height='100vh' display='flex' direction='column' gap={2.6}>
			<Grid display='flex' justifyContent='space-between'>
				<Skeleton height={'30px'} variant='rounded' width={'150px'} />
				<Skeleton height={'30px'} variant='rounded' width={'30px'} />
			</Grid>
			<Skeleton height={'1px'} variant='rounded' />
			<Skeleton height={'53px'} variant='rounded' />
			<Skeleton height={'53px'} variant='rounded' />
			<Skeleton height={'53px'} variant='rounded' />
			<Skeleton height={'1px'} variant='rounded' />
			<Skeleton height={'20px'} variant='rounded' />
			<Skeleton height={'30px'} variant='rounded' />
			<Skeleton height={'53px'} variant='rounded' />
			<Skeleton height={'100px'} variant='rounded' />
			<Grid width='100%' marginTop='auto' display='flex' justifySelf={'flex-end'} justifyContent='flex-end' gap='20px'>
				<Skeleton height={'35px'} variant='rounded' width={'75px'} />
				<Skeleton height={'35px'} variant='rounded' width={'75px'} sx={{ bgcolor: '#04AA6D' }} />
			</Grid>
		</Grid>
	);
};

export default DirectPaymentDrawerSkeleton;
