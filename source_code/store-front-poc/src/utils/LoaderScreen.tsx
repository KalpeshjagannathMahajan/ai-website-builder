import Lottie from 'react-lottie';
import { makeStyles } from '@mui/styles';
import Animations from 'src/assets/animations/Animations';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

const useStyles = makeStyles({
	lottieContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: 'calc(100vh - 50px)',
		width: '100%',
	},
});

const LoaderScreen = () => {
	const classes = useStyles();
	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: is_ultron ? Animations.loader_animation : Animations.aeroplane_animation,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid slice',
		},
	};

	const get_style = () => {
		if (is_ultron) {
			return {
				height: 100,
				width: 100,
			};
		} else {
			return {
				height: 200,
				width: 200,
			};
		}
	};

	return (
		<div className={classes.lottieContainer}>
			<Lottie options={defaultOptions} style={{ ...get_style() }} />
		</div>
	);
};

export default LoaderScreen;
