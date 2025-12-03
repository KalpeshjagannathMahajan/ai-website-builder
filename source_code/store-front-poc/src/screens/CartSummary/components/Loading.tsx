import { makeStyles } from '@mui/styles';
import { Box, Grid, useMediaQuery } from '@mui/material';
import CustomText from 'src/common/@the-source/CustomText';
import Lottie from 'react-lottie';
import Animations from 'src/assets/animations/Animations';
import cart_management from 'src/utils/api_requests/cartManagement';
import { useContext, useEffect, useState } from 'react';
import CartSummaryContext from '../context';
import _ from 'lodash';
import { t } from 'i18next';
import { useTheme } from '@emotion/react';

const useStyles = makeStyles((theme: any) => ({
	container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'flex-start',
		height: '100vh',
		width: '100%',
		position: 'absolute',
		top: 0,
		left: 0,
		zIndex: 100,
		overflow: 'hidden',
	},
	blurBackground: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: theme?.cart_summary?.refetch_loader?.background,
		backdropFilter: 'blur(2px)',
		zIndex: -1,
	},
	loadingContent: {
		textAlign: 'center',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: theme?.cart_summary?.background,
		border: theme?.cart_summary?.refetch_loader?.border,
		padding: '2rem 4rem',
		margin: '0rem 3rem',
	},
}));

const LoadingPage = () => {
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('md'));
	const classes = useStyles();

	const { cart, set_edit_product_price_change, edit_product_price_change } = useContext(CartSummaryContext);

	const { refetch } = cart;

	const [loading, set_loading] = useState<boolean>(true);

	const handle_price_change = async () => {
		const payload = {
			cart_id: cart?.data?.id || '',
			product_ids: [],
		};

		try {
			const response: any = await cart_management.bulk_update_cart_initial_price(payload);
			if (response.status_code === 200) {
				set_loading(false);
				setTimeout(() => {
					set_edit_product_price_change([]);
					refetch();
				}, 3000);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!_.isEmpty(edit_product_price_change)) handle_price_change();
	}, []);

	return (
		<Grid container className={classes.container} sx={{ paddingTop: is_small_screen ? '6rem' : '10rem' }}>
			<Box className={classes.blurBackground} />
			<Box className={classes.loadingContent}>
				<Box display='flex' justifyContent='center' alignItems='center' height='100px'>
					<Lottie
						options={{
							loop: true,
							autoplay: true,
							animationData: loading ? Animations.aeroplane_animation : Animations.green_tick,
							rendererSettings: {
								preserveAspectRatio: 'xMidYMid slice',
							},
						}}
					/>
				</Box>
				<CustomText type='Title'>
					{loading ? t('CartSummary.PriceUpdateLoading.FetchingText') : t('CartSummary.PriceUpdateLoading.FetchComplete')}
				</CustomText>
			</Box>
		</Grid>
	);
};

export default LoadingPage;
