import { Box, Grid, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';

interface Props {
	on_card_press?: () => void;
	is_shipping_type?: boolean;
}

const AddAddressCard = ({ on_card_press, is_shipping_type }: Props) => {
	const classes = useStyles();
	const theme: any = useTheme();
	return (
		<Grid container overflow='hidden' className={classes.add_details_card} onClick={on_card_press}>
			<Box textAlign={'center'}>
				<Icon className={classes.icon_style} iconName={is_shipping_type ? 'IconShip' : 'IconReceipt'} />
				<CustomText type='Subtitle' color={theme?.quick_add_buyer?.card_text}>
					{`Add ${is_shipping_type ? 'shipping' : 'billing'} address`}
				</CustomText>
			</Box>
		</Grid>
	);
};

export default AddAddressCard;
