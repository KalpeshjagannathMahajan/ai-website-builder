// import Loader from "react-loader-spinner";
// import LoadingGif from '../../assets/images/loading.gif';
import Lottie from 'react-lottie';
import Animations from 'src/assets/animations/Animations';
import { Grid } from 'src/common/@the-source/atoms';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

const Loading = () => {
	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: Animations.aeroplane_animation,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice',
		},
	};

	return (
		<Grid container display='flex' width='100%' justifyContent='center'>
			<Grid
				sx={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'center',
					height: is_ultron ? '80vh' : 'calc(100vh - 50px)',
					alignItems: 'center',
				}}>
				{is_ultron ? (
					<img src='https://frontend-bucket.vercel.app/images/loading.gif' alt='loadingState' width={200} height={200} />
				) : (
					<Lottie
						options={defaultOptions}
						style={{
							height: 200,
							width: 200,
						}}
					/>
				)}
			</Grid>
		</Grid>
	);
};

export default Loading;
