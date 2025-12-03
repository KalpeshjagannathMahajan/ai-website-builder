import { Grid, Skeleton } from 'src/common/@the-source/atoms';

interface Props {
	height: string;
	width: number;
}

const AchFormSkeleton = ({ height, width }: Props) => {
	return (
		<Grid
			width='100%'
			sx={{ height, width: `${width}px`, overflow: 'hidden', maxHeight: height }}
			display={'flex'}
			direction='column'
			gap={'40px'}>
			<Grid display='flex' direction='column' gap={'25px'} maxHeight={'50vh'}>
				<Skeleton height={'50px'} variant='rounded' width={'450px'} />
				<Skeleton height={'50px'} variant='rounded' width={'450px'} />
				<Skeleton height={'50px'} variant='rounded' width={'450px'} />
				<Skeleton height={'50px'} variant='rounded' width={'450px'} />
				<Skeleton height={'50px'} variant='rounded' width={'450px'} />
			</Grid>
		</Grid>
	);
};
export default AchFormSkeleton;
