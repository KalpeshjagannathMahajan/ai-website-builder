import { makeStyles } from '@mui/styles';
import { Image, Button } from 'src/common/@the-source/atoms';
import ErrorCartImage from 'src/assets/images/cart_error_page.png';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';

const useStyles = makeStyles(() => ({
	container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		gap: '20px',
		height: '60vh',
	},
}));

const EmptyCart = () => {
	const classes = useStyles();
	const { t } = useTranslation();

	const handle_retry = () => {
		if (window) window.location.reload();
	};
	return (
		<div className={classes.container}>
			<Image src={ErrorCartImage} width={'320px'} height={'auto'} />
			<CustomText type='H1'>{t('CartSummary.ErrorCart.Title1')}</CustomText>
			<CustomText type='Body'>{t('CartSummary.ErrorCart.Title2')}</CustomText>
			<Button onClick={handle_retry}>{t('CartSummary.ErrorCart.Retry')}</Button>
		</div>
	);
};

export default EmptyCart;
