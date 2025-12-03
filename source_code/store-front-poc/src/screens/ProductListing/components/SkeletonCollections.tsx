import { Grid, Skeleton } from 'src/common/@the-source/atoms';

const SkeletonCollections = () => {
	const arr = [1, 2, 3];
	return (
		<>
			<Grid container direction='row' flexWrap='nowrap'>
				{arr.map((a) => (
					<Grid key={a} style={{ margin: '10px', width: '340px', height: '200px' }}>
						<Skeleton variant='rounded' width='340px' height='200px' />
						<Skeleton variant='text' width='10.5rem' height='1.5rem' sx={{ marginTop: -3, marginLeft: 1 }} />
					</Grid>
				))}
			</Grid>
		</>
	);
};

export default SkeletonCollections;
