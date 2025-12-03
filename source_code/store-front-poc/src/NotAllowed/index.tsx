import { Typography, Grid, Button, Image, Box } from 'src/common/@the-source/atoms';

import { useEffect, useState } from 'react';
import Loading from 'src/screens/Loading/Loading';
import RouteNames from 'src/utils/RouteNames';
import { useLocation } from 'react-router-dom';

const NotAllowed = () => {
	const [loading, set_loading] = useState(true);
	const location_url = useLocation();
	const NotFound = 'https://frontend-bucket.vercel.app/images/notFound.svg';

	const handle_redirect = () => {
		if (location_url?.pathname === '/user-login') {
			const prev_url: any = localStorage.getItem('prev_url');
			const redirect_url = prev_url ? `${origin}${prev_url}` : RouteNames.product.all_products.path;
			window.location.href = redirect_url;
			// localStorage.removeItem('prev_url');
		}
	};

	const handle_click = () => {
		window.location.href = window?.location?.origin;
	};

	useEffect(() => {
		handle_redirect();
		const timeout = setTimeout(() => {
			set_loading(false);
		}, 3000);
		return () => clearTimeout(timeout);
	}, []);

	return loading ? (
		<Loading />
	) : (
		<Grid justifyContent='center' display='flex' alignContent='center' alignItems='center' height='90vh'>
			<Grid item xs={8}>
				<Grid display='flex' justifyContent='center' alignItems='center'>
					<Image src={NotFound} alt='Not Found' style={{ borderRadius: 16, height: '70%', width: '70%', margin: '25px 0px' }} />
				</Grid>

				<Grid justifyContent='center' display='flex'>
					<Typography sx={{ fontWeight: '700', fontSize: '2.5rem' }}>like something is missing...</Typography>
				</Grid>

				<Grid sx={{ margin: '1rem 0' }} justifyContent='center' display='flex'>
					<Typography sx={{ fontSize: '1.4rem' }}>You can try refreshing the page again or go back to the previous page</Typography>
				</Grid>

				<Box display='flex' justifyContent='center' gap={2} my={2.5}>
					<Button size='large' onClick={handle_click} variant='contained'>
						Go to home
					</Button>
					<Button size='large' variant='outlined' onClick={() => window.location.reload()}>
						Refresh
					</Button>
				</Box>
			</Grid>
		</Grid>
	);
};

export default NotAllowed;
