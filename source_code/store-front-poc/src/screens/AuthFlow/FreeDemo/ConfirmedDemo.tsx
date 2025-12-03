import { useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import styles from './freetrial.module.css';
import { useSelector } from 'react-redux';
import Image from 'src/common/@the-source/atoms/Image/Image';
import CustomText from 'src/common/@the-source/CustomText';
import { useTranslation } from 'react-i18next';
import ImageLinks from 'src/assets/images/ImageLinks';
import NotAllowed from 'src/NotAllowed';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'src/common/@the-source/atoms';

const UnderReview = () => {
	const { t } = useTranslation();
	const pre_login = useSelector((state: any) => state?.preLogin);
	const location = useLocation();
	const from_free_trial = location?.state?.from === 'free-trail';
	const navigate = useNavigate();
	useEffect(() => {
		window.scroll({
			top: 0,
		});
	}, []);

	if (!from_free_trial) {
		return <NotAllowed />;
	}

	return (
		<>
			<Box onSubmit={(e) => e.preventDefault()} component='form' className={styles.container}>
				<Grid className={styles.layout}>
					<Grid className={styles.innerContainer} container>
						<Grid className={styles.companyLogo}>
							<Image imgClass={styles.logo} src={pre_login?.logo_with_name} />
						</Grid>
						<Grid container className={styles.illustration}>
							<Image imgClass={styles.illustrationImg} src={ImageLinks.illustrationImg} />
						</Grid>
						<Grid className={styles.titleGrid}>
							<CustomText className={styles.bodyText} type='H1'>
								{t('FreeTrial.ConfirmTitle')}
							</CustomText>
						</Grid>
						<Grid className={styles.bodyGrid}>
							<CustomText className={styles.bodyText} type='Body'>
								{t('FreeTrial.ConfirmSubTitle')}
							</CustomText>
						</Grid>
					</Grid>
					<Grid>
						<Button fullWidth onClick={() => navigate('/user-login')} type='submit'>
							Login
						</Button>
					</Grid>
				</Grid>
			</Box>
		</>
	);
};

export default UnderReview;
