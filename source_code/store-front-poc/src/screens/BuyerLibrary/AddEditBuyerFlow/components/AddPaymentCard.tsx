import { Box, Grid, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import { t } from 'i18next';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';
import 'src/screens/BuyerLibrary/style.css';
import { PaymentMethodsValues } from 'src/@types/payment';
import { PAYMENT_METHODS } from '../../constants';

interface Props {
	on_card_press: () => void;
	type: PaymentMethodsValues;
}

const AddPaymentCard = ({ on_card_press, type }: Props) => {
	const classes = useStyles();
	const theme: any = useTheme();
	return (
		<Grid
			className={classes.add_details_card}
			container
			justifyContent={'center'}
			minHeight={type === PAYMENT_METHODS.CARD ? '15rem' : '12rem'}
			height={'auto'}
			alignItems={'center'}
			onClick={on_card_press}>
			<Box textAlign={'center'}>
				<Icon iconName={type === PAYMENT_METHODS.CARD ? 'IconCreditCard' : 'IconBuildingBank'} className={classes.icon_style} />
				<CustomText type='Subtitle' color={theme?.quick_add_buyer?.card_text}>
					{type === PAYMENT_METHODS.CARD ? t('Common.AddPaymentModal.AddCard') : t('Common.AddPaymentModal.AddAccount')}
				</CustomText>
			</Box>
		</Grid>
	);
};

export default AddPaymentCard;
