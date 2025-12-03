import { Box, Grid, Skeleton } from 'src/common/@the-source/atoms';
import { Divider } from '@mui/material';

interface props {
	data: any;
}

const StorefrontSkeletonDrawer = ({ data }: props) => {
	const SkeletonHeader = () => (
		<Grid className='drawer-header'>
			<Box display={'flex'} flexDirection={'row'} gap={'12px'}>
				<Skeleton variant='text' width={100} height={30} />
				<Skeleton variant='text' width={100} height={30} />
				{data?.lead_status !== 'open' && (
					<div>
						<Skeleton variant='text' width={80} height={30} />
					</div>
				)}
			</Box>
			<Skeleton variant='circular' width={24} height={24} />
		</Grid>
	);

	const SkeletonInfoItem = () => (
		<Grid container spacing={2} alignItems='center'>
			<Grid item>
				<Skeleton variant='circular' width={40} height={40} />
			</Grid>
			<Grid item>
				<Skeleton variant='text' width={100} height={15} />
				<Skeleton variant='text' width={100} height={15} />
			</Grid>
		</Grid>
	);

	const SkeletonBodyExist = () => (
		<Grid className='drawer-body' display={'flex'} flexDirection={'column'} gap={'24px'} paddingBottom={'24px'}>
			{/* <Skeleton variant='rectangular' width='80%' height={20} /> */}
			<SkeletonInfoItem />
			<Grid display={'flex'} flexDirection={'row'} gap={'4px'}>
				<SkeletonInfoItem />
				<SkeletonInfoItem />
			</Grid>
			<SkeletonInfoItem />
			<SkeletonInfoItem />
		</Grid>
	);
	const SkeletonBodyNew = () => (
		<Grid className='drawer-body' display={'flex'} flexDirection={'column'} gap={'24px'}>
			<Skeleton variant='rounded' width={150} height={20} />
			<Skeleton variant='rounded' width='100%' height={300} />
			<Skeleton variant='rounded' width={150} height={20} />
			<Skeleton variant='rounded' width='100%' height={300} />
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
			<SkeletonBodyExist />

			{data?.customer_type === 'new_customer' && (
				<>
					<Divider className='drawer-divider' />
					<SkeletonBodyNew />
				</>
			)}
			{data?.lead_status === 'open' && (
				<>
					<Divider className='drawer-divider' />
					<SkeletonFooter />
				</>
			)}
		</Grid>
	);
};

export default StorefrontSkeletonDrawer;
