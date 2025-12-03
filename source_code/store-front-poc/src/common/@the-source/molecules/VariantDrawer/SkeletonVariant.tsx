import { Divider } from '@mui/material';
import { Grid, Skeleton } from '../../atoms';

interface Props {
	is_single?: boolean;
}

const SkeletonVariants = ({ is_single = false }: Props) => {
	const arr = is_single ? [1] : [1, 2, 3, 4, 5];
	return (
		<>
			<Grid>
				{arr.map((a) => (
					<Grid key={a} sx={{ margin: '10px 6px' }}>
						<Grid container width={'100%'} sx={{ minHeight: '145px' }}>
							<Grid container direction='row' justifyContent='space-between'>
								<Grid container direction='row' width={246}>
									<Skeleton variant='rounded' width={75} height={75} sx={{ borderRadius: '8px' }} />
									<Grid item width={163} sx={{ paddingLeft: '10px' }}>
										<Skeleton variant='text' sx={{ margin: '4px' }} />
										<Skeleton variant='text' sx={{ margin: '4px' }} />
										<Skeleton variant='text' sx={{ margin: '4px' }} />
									</Grid>
								</Grid>
								<Grid item direction='row' width={140} sx={{ marginRight: '30px' }}>
									<Skeleton variant='rounded' height={40} />
								</Grid>
							</Grid>
							<Grid container sx={{ width: 400, overflow: 'hidden' }} flexWrap='nowrap'>
								<Skeleton variant='text' width={400} />
							</Grid>
							<Grid container direction='row'>
								<Skeleton variant='text' width='60px' sx={{ marginLeft: '1rem' }} />
								<Skeleton variant='text' width='60px' sx={{ marginLeft: '1rem' }} />
								<Skeleton variant='text' width='60px' sx={{ marginLeft: '1rem' }} />
							</Grid>
						</Grid>
						<Divider sx={{ width: '100%' }} />
					</Grid>
				))}
			</Grid>
		</>
	);
};

export default SkeletonVariants;
