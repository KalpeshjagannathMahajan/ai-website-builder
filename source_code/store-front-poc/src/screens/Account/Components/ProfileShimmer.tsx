import { Grid, Skeleton } from 'src/common/@the-source/atoms';

export const ProfileShimmer = () => {
	return (
		<Grid display='flex' direction='column' gap='20px'>
			<Grid display='flex' gap={2}>
				<Skeleton variant='rounded' width='200px' height='50px' />
				<Skeleton variant='rounded' width='200px' height='50px' />
				<Skeleton variant='rounded' width='200px' height='50px' />
				<Skeleton variant='rounded' width='200px' height='50px' />
			</Grid>
			<Grid display='flex' direction='column' gap='20px'>
				<Skeleton variant='rounded' width='100%' height='5px' />
				<Grid display='flex' justifyContent='space-between'>
					<Skeleton variant='rounded' width='100px' height='10px' />
					<Skeleton variant='rounded' width='60px' height='10px' />
				</Grid>
				<Skeleton variant='rounded' width='300px' height='100px'></Skeleton>
			</Grid>
			<Grid display='flex' direction='column' gap='20px'>
				<Skeleton variant='rounded' width='100%' height='5px' />
				<Grid display='flex' justifyContent='space-between'>
					<Skeleton variant='rounded' width='100px' height='10px' />
					<Skeleton variant='rounded' width='60px' height='10px' />
				</Grid>
				<Skeleton variant='rounded' width='300px' height='100px'></Skeleton>
			</Grid>
			<Grid display='flex' direction='column' gap='20px'>
				<Skeleton variant='rounded' width='100%' height='5px' />
				<Grid display='flex' justifyContent='space-between'>
					<Skeleton variant='rounded' width='100px' height='10px' />
					<Skeleton variant='rounded' width='60px' height='10px' />
				</Grid>
				<Skeleton variant='rounded' width='300px' height='100px'></Skeleton>
			</Grid>
			<Grid display='flex' direction='column' gap='20px'>
				<Skeleton variant='rounded' width='100%' height='5px' />
				<Grid display='flex' justifyContent='space-between'>
					<Skeleton variant='rounded' width='100px' height='10px' />
					<Skeleton variant='rounded' width='60px' height='10px' />
				</Grid>
				<Skeleton variant='rounded' width='300px' height='100px'></Skeleton>
			</Grid>
		</Grid>
	);
};
