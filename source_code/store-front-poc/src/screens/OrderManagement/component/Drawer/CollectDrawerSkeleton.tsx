import { Grid, Skeleton } from 'src/common/@the-source/atoms';
import { useTheme } from '@mui/material/styles';
const CollectDrawerSkeleton = () => {
	const theme: any = useTheme();
	return (
		<Grid p={2} width='100%' height='100vh' display='flex' direction='column' gap={2.4}>
			<Grid display='flex' justifyContent='space-between'>
				<Skeleton height={'30px'} variant='rounded' width={'150px'} />
				<Skeleton height={'30px'} variant='rounded' width={'30px'} />
			</Grid>
			<Skeleton height={'53px'} variant='rounded' />
			<Skeleton height={'20px'} variant='rounded' />
			<Skeleton height={'53px'} variant='rounded' />
			<Skeleton height={'30px'} variant='rounded' />
			<Grid display='flex' justifyContent='space-between'>
				<Skeleton height={'56px'} variant='rounded' width={'140px'} />
				<Skeleton height={'56px'} variant='rounded' width={'140px'} />
				<Skeleton height={'56px'} variant='rounded' width={'140px'} />
			</Grid>
			<Skeleton height={'30px'} variant='rounded' />
			<Skeleton height={'200px'} variant='rounded' />
			<Grid width='100%' marginTop='auto' display='flex' justifySelf={'flex-end'} justifyContent='flex-end' gap='20px'>
				<Skeleton height={'35px'} variant='rounded' width={'75px'} />
				<Skeleton height={'35px'} variant='rounded' width={'75px'} sx={{ bgcolor: theme?.order_management?.collect_drawer_skeleton }} />
			</Grid>
		</Grid>
	);
};

export default CollectDrawerSkeleton;
