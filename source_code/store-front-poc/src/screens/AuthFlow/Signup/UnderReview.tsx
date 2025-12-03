import { useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import Image from 'src/common/@the-source/atoms/Image/Image';
import CustomText from 'src/common/@the-source/CustomText';
import Button from 'src/common/@the-source/atoms/Button/Button';
import UnderReviewSkeleton from './UnderReviewSkeleton';

const useStyles = makeStyles(() => ({
	container: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		overflow: 'auto',
	},
	layout: {
		maxWidth: '800px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		background: '#ffffff',
		margin: '1.6rem 0',
		padding: '4.8rem 1.6rem',
		borderRadius: '3.2rem',
	},
	innerContainer: {
		padding: '1.6rem 6.4rem',
		width: '100%',
	},
	companyLogo: {
		justifyContent: 'center',
		width: '100%',
		display: 'flex',
	},
	logo: {
		height: '47px',
		width: 'auto',
	},
	illustrationImg: {
		height: '96px',
		width: '96px',
	},
	illustration: {
		marginTop: '50px',
	},
}));
const UnderReview = () => {
	// const { t } = useTranslation();
	const styles = useStyles();
	const pre_login = useSelector((state: any) => state?.preLogin);
	const auth_loading: any = useSelector((state: any) => state?.preLogin?.auth_loading);
	useEffect(() => {
		window.scroll({
			top: 0,
		});
	}, []);
	const illustrationImg = 'https://frontend-bucket.vercel.app/images/tick_icon.svg';

	const handle_button_click = () => {
		window.location.href = window.location.origin;
	};

	return (
		<>
			{auth_loading ? (
				<UnderReviewSkeleton />
			) : (
				<Box onSubmit={(e) => e.preventDefault()} component='form' className={styles.container} bgcolor={'#ffffff'}>
					<Grid className={styles.layout}>
						<Grid className={styles.innerContainer} container>
							<Grid className={styles.companyLogo}>
								<Image imgClass={styles.logo} src={pre_login?.logo_with_name} />
							</Grid>

							<Grid justifyContent='center' display='flex' container className={styles.illustration}>
								<Image imgClass={styles.illustrationImg} src={illustrationImg} />
							</Grid>

							<Grid mt={'32px'} display='flex' justifyContent='center' width='100%'>
								<CustomText color='rgba(0, 0, 0, 0.87)' type='H1' style={{ textAlign: 'center' }}>
									Request submitted. Your application is under review.
								</CustomText>
							</Grid>
							<Grid mt={'6px'} display='flex' justifyContent='center' width='100%'>
								<CustomText color='rgba(0, 0, 0, 0.6)' type='Body' style={{ textAlign: 'center' }}>
									This might take few hours. You will be notified when your profile gets verified.
								</CustomText>
							</Grid>
							<Grid mt={'64px'} container display='flex' justifyContent='center' width='100%'>
								<Button variant='contained' width='285px' onClick={handle_button_click}>
									Back to home
								</Button>
							</Grid>
						</Grid>
					</Grid>
				</Box>
			)}
		</>
	);
};

export default UnderReview;
