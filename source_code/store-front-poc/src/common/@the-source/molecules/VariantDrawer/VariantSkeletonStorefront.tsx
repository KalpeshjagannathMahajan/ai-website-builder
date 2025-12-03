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
								<Grid container direction='row' flexDirection={'row'} sx={{ justifyContent: 'space-between' }}>
									<Skeleton variant='rounded' width={50} height={75} sx={{ borderRadius: '8px' }} />
									<Grid display='flex' flexDirection={'column'} width={123} pt={0} gap={1}>
										<Skeleton variant='rectangular' />
										<Skeleton variant='rectangular' />
										<Skeleton variant='rectangular' />
									</Grid>
									<Skeleton variant='rounded' width={130} height={40} sx={{ borderRadius: '8px' }} />
								</Grid>
							</Grid>

							<Skeleton variant='rounded' width={215} height={21} sx={{ borderRadius: '8px' }} />
						</Grid>
						<Divider sx={{ width: '100%' }} />
					</Grid>
				))}
			</Grid>
		</>
	);
};

export default SkeletonVariants;
