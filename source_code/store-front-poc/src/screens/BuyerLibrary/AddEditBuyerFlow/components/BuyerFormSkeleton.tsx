import { Divider } from '@mui/material';
import { Box, Grid, Skeleton } from 'src/common/@the-source/atoms';

export function BuyerFormSkeleton() {
	return (
		<Grid container justifyContent='center'>
			<Grid item lg={8} md={8} sm={8} mt={5}>
				<Skeleton variant='rounded' height={100} />
			</Grid>
			<Grid item lg={8} md={8} sm={8} mt={2}>
				<Skeleton variant='rounded' height={'calc(100vh - 8rem)'} />
			</Grid>
		</Grid>
	);
}

export function BuyerQuickFormSkeleton() {
	return (
		<Grid container justifyContent='center'>
			<Grid item lg={8} md={8} sm={8} mt={10}>
				<Skeleton variant='rounded' height={'60vh'} />
			</Grid>
		</Grid>
	);
}

export function LeadNewCustomerSkeleton() {
	const SkeletonHeader = () => (
		<Grid className='drawer-header'>
			<Box display={'flex'} flexDirection={'row'} gap={'12px'}>
				<Skeleton variant='text' width={150} height={35} />
			</Box>
			<Skeleton variant='circular' width={24} height={24} />
		</Grid>
	);

	const SkeletonBodyNew = () => (
		<Grid className='drawer-body' display={'flex'} flexDirection={'column'} gap={'20px'}>
			<Skeleton variant='rounded' width={150} height={40} />
			<Grid display={'flex'} gap={'30px'}>
				<Skeleton variant='rounded' width={250} height={50} />
				<Skeleton variant='rounded' width={250} height={50} />
			</Grid>
			<Grid display={'flex'} gap={'30px'}>
				<Skeleton variant='rounded' width={250} height={50} />
				<Skeleton variant='rounded' width={250} height={50} />
			</Grid>
			<Skeleton variant='rounded' width={150} height={40} />
			<Skeleton variant='rounded' width={150} height={40} />
			<Grid display={'flex'} gap={'30px'}>
				<Skeleton variant='rounded' width={250} height={150} />
				<Skeleton variant='rounded' width={250} height={150} />
			</Grid>
			<Skeleton variant='rounded' width={150} height={40} />
		</Grid>
	);
	const SkeletonFooter = () => (
		<Grid className='drawer-footer' style={{ justifyContent: 'flex-end' }}>
			<Skeleton variant='rounded' width={100} height={36} />
			<Skeleton variant='rounded' width={160} height={36} />
		</Grid>
	);
	return (
		<Grid className='drawer-container'>
			<SkeletonHeader />
			<Divider className='drawer-divider' />
			<SkeletonBodyNew />
			<Divider className='drawer-divider' />

			<SkeletonFooter />
		</Grid>
	);
}
