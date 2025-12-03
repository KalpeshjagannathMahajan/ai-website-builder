import { Divider } from '@mui/material';
import { useEffect } from 'react';
import { Box, Grid, Skeleton } from 'src/common/@the-source/atoms';

let dummyArray = [1, 2, 3, 4, 5, 6, 7, 8];
const SkeletonLoader = () => {
	useEffect(() => {
		window.scroll({
			top: 0,
		});
	}, []);
	return (
		<Grid container>
			<Grid item md={6} sm={6}>
				<Skeleton height={'calc(85vh - 15rem)'} variant='rounded' width={'100%'} />
				<Box display={'flex'} my={2} gap={2}>
					{dummyArray.map((ele: number) => (
						<Skeleton key={ele} height={'6rem'} variant='rounded' width={100} />
					))}
				</Box>
			</Grid>
			<Grid item md={0.2} sm={0.2}></Grid>
			<Grid item md={5.8} sm={5.8} justifyContent='space-between'>
				<Skeleton variant='text' width={'14rem'} />
				<Skeleton height={50} variant='text' width={'8rem'} />
				<Skeleton height={40} variant='text' width={'7rem'} />
				<Box display={'flex'} my={2} gap={2}>
					{Array.from({ length: 4 }).map((ele: any) => (
						<Grid alignItems='center' justifyContent='space-between' direction='column'>
							<Skeleton key={ele} height={'6em'} variant='rounded' width={80} />
							<Skeleton key={ele} height={'1rem'} variant='rounded' width={60} sx={{ margin: '.4rem' }} />
						</Grid>
					))}
				</Box>
				<Skeleton height={40} variant='text' width={'8rem'} />
				<Box display={'flex'} my={2} gap={2}>
					{Array.from({ length: 2 }).map((ele: any) => (
						<Skeleton key={ele} height={'3em'} variant='rounded' width={75} />
					))}
				</Box>
				{Array.from({ length: 3 }).map((ite: any) => (
					<Skeleton key={ite} variant='text' width={'100%'} />
				))}
				<Skeleton variant='text' width={'60%'} />
				<Skeleton height={'15vh'} variant='text' width={'100%'} />
				<Grid direction='column' justifyContent='space-between'>
					<Skeleton variant='rounded' height={'4rem'} width={'60%'} />
					<Divider sx={{ margin: '1rem' }} />
					<Skeleton variant='rounded' height={'3rem'} width={'40%'} />
					<Divider sx={{ margin: '1rem' }} />
					<Skeleton variant='rounded' height={'2rem'} width={'30%'} />
				</Grid>
			</Grid>
		</Grid>
	);
};

export default SkeletonLoader;
