import { Typography, Image, Grid, Button } from 'src/common/@the-source/atoms';
import ImageLinks from 'src/assets/images/ImageLinks';
import { makeStyles } from '@mui/styles';
import { t } from 'i18next';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles(() => ({
	container: {
		height: 'calc(100vh - 80px)',
		overflow: 'hidden',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
	},
}));

const CustomError = ({ set_show_customise }: any) => {
	const styles = useStyles();
	const theme: any = useTheme();

	const custom_error: any = theme?.product?.custom_product_drawer?.custom_error;

	return (
		<Grid
			container
			className={styles.container}
			sx={{
				background: custom_error?.background,
			}}>
			<Image src={ImageLinks.ErrorLogo} width={325} height={252} />
			<Typography variant='h5' sx={{ fontSize: '20px' }}>
				{t('ErrorScreens.CustomError.UnavailableProduct')}
			</Typography>
			<Typography variant='body2' sx={{ fontSize: '16px', width: '400px', textAlign: 'center', color: custom_error?.color }}>
				{t('ErrorScreens.CustomError.ErrorMessage')}
			</Typography>
			<Button onClick={() => set_show_customise(false)} sx={{ marginTop: '20px' }}>
				{t('ErrorScreens.CustomError.GoBack')}
			</Button>
		</Grid>
	);
};

export default CustomError;
