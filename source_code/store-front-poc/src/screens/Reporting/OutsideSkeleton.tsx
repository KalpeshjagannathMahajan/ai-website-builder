import { Box, Grid, Skeleton } from '@mui/material';

const OutsideSkeletonUI = () => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginTop: 3 }}>
			<Grid container>
				<Skeleton width={'40%'} height={80} />
			</Grid>
			<Grid container spacing={{ xs: 1, md: 1 }} columns={{ xs: 6, sm: 12, md: 12 }}>
				<Grid item xs={12} sm={5.5}>
					<Skeleton variant='rounded' width='100%' height={270} />
				</Grid>
				<Grid item xs={12} sm={6.5}>
					<Skeleton variant='rounded' width='100%' height={270} />
				</Grid>
				<Grid item xs={12} sm={6.5}>
					<Skeleton variant='rounded' width='100%' height={270} />
				</Grid>
				<Grid item xs={12} sm={5.5}>
					<Skeleton variant='rounded' width='100%' height={270} />
				</Grid>
			</Grid>
		</Box>
	);
};

export default OutsideSkeletonUI;
