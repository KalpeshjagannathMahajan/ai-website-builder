import { Image, Grid, Button } from 'src/common/@the-source/atoms';
import ImageLinks from 'src/assets/images/ImageLinks';

import CustomText from './@the-source/CustomText';

const NotFound404 = () => {
	const handleClick = () => {
		window.location.href = window.location.origin;
	};
	return (
		<Grid container justifyContent='center' alignItems='center' sx={{ height: 'calc(100vh - 150px)' }}>
			<Grid
				sx={{
					padding: '4rem 8rem',
					borderRadius: '8px',
					background: 'white',
					textAlign: 'center',
				}}>
				<Image src={ImageLinks.not_found_404} width={370} height={290} />
				<CustomText type='H6' style={{ marginTop: '1rem' }}>
					Error 404 : Page not found
				</CustomText>

				<Button onClick={handleClick} sx={{ marginTop: '20px' }}>
					Go to home
				</Button>
			</Grid>
		</Grid>
	);
};

export default NotFound404;
