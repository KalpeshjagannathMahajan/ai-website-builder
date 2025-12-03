import { useEffect, useState } from 'react';
import { Grid } from 'src/common/@the-source/atoms';
import naylas_config from 'src/utils/api_requests/email_config';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import CustomToast from 'src/common/CustomToast';
import Lottie from 'react-lottie';
import Animations from 'src/assets/animations/Animations';
import utils from 'src/utils/utils';
import { useDispatch } from 'react-redux';

const defaultOptions = {
	loop: true,
	autoplay: true,
	animationData: Animations?.connecting,
	rendererSettings: {
		preserveAspectRatio: 'xMidYMid slice',
	},
};

const LoadingScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [open, set_open] = useState(false);
	const [err_open, set_err_open] = useState(false);
	const [token_exchange, set_token_exchange] = useState(false);
	const params = new URLSearchParams(window.location.search);

	const handle_token_exhange = async () => {
		try {
			naylas_config.get_token({ token: params.get('code') }).then((res: any) => {
				if (res.status === 200) {
					set_token_exchange(true);
					set_open(true);
				}
			});
		} catch (err: any) {
			console.error(err);
		}
	};

	const handle_navigate = () => {
		utils.handle_connected_account(dispatch);
		navigate('/', { state: { from: 'nylas_loading' } });
	};

	useEffect(() => {
		if (params.has('code')) {
			handle_token_exhange();
		}
	}, []);

	useEffect(() => {
		if (token_exchange) {
			const timeoutId = setTimeout(() => {
				handle_navigate();
			}, 3000);

			return () => clearTimeout(timeoutId);
		} else {
			const timeoutId = setTimeout(() => {
				set_err_open(true);
			}, 3000);
			return () => clearTimeout(timeoutId);
		}
	}, [token_exchange]);

	return (
		<Grid container display='flex' width='100%' height='100vh' justifyContent='center' alignItems='center'>
			<Lottie options={defaultOptions} height={500} width={500} />
			{open && (
				<CustomToast
					open={open}
					showCross={false}
					is_custom={false}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					show_icon={true}
					autoHideDuration={5000}
					onClose={() => set_open(false)}
					state={t('CustomProduct.Toast.State')}
					title={'Congratulations Account successfully connected!'}
					subtitle={''}
					showActions={false}
				/>
			)}
			{err_open && (
				<CustomToast
					open={err_open}
					showCross={false}
					is_custom={false}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					show_icon={true}
					autoHideDuration={3000}
					onClose={() => {
						set_err_open(false);
						navigate('/', { state: { from: 'nylas_loading' } });
					}}
					state={'warning'}
					title={'Oops! Account authentication failed!'}
					subtitle={''}
					showActions={false}
				/>
			)}
		</Grid>
	);
};

export default LoadingScreen;
