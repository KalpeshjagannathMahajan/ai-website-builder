import { Box } from '@mui/material';
import Lottie from 'react-lottie';
import Animations from 'src/assets/animations/Animations';

const defaultOptions = {
	loop: true,
	autoplay: true,
	animationData: Animations?.report_loading,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};
const SkeletonUI = () => {
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginTop: 2 }}>
			<Lottie options={defaultOptions} height={300} width={300} />
			{/* <Grid container>
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
			</Grid> */}
		</Box>
	);
};

export default SkeletonUI;
