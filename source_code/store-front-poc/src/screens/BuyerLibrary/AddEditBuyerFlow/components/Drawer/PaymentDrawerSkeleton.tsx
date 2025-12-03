import { Grid, Skeleton } from 'src/common/@the-source/atoms';

interface Props {
	height: string;
	width: number;
}

const PaymentDrawerSkeleton = ({ height, width }: Props) => {
	return (
		<Grid
			width='100%'
			sx={{ height, width: `${width}px`, overflow: 'hidden', maxHeight: height }}
			display={'flex'}
			direction='column'
			gap={'40px'}>
			<Grid display='flex' direction='column' gap={'50px'} maxHeight={'70vh'}>
				<Skeleton height={'53px'} variant='rounded' width={'437px'} />
				<Skeleton height={'53px'} variant='rounded' width={'437px'} />
				<Skeleton height={'53px'} variant='rounded' width={'437px'} />
				<Skeleton height={'53px'} variant='rounded' width={'437px'} />
				<Skeleton height={'53px'} variant='rounded' width={'437px'} />
				<Skeleton height={'53px'} variant='rounded' width={'437px'} />
				<Skeleton height={'53px'} variant='rounded' width={'437px'} />
				<Skeleton height={'53px'} variant='rounded' width={'437px'} />
				<Skeleton height={'53px'} variant='rounded' width={'437px'} />
			</Grid>
			{/* <Grid width='100%' display='flex' justifyContent='flex-end' gap='20px'>
				<Skeleton height={'35px'} variant='rounded' width={'75px'} />
				<Skeleton height={'35px'} variant='rounded' width={'75px'} sx={{ bgcolor: '#04AA6D' }} />
			</Grid> */}
		</Grid>
	);
};
export default PaymentDrawerSkeleton;
