import _ from 'lodash';
import { useSelector } from 'react-redux';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid } from 'src/common/@the-source/atoms';
import useSortedCharges from 'src/hooks/useSortedCharges';
import { CHARGE_TYPE, CHARGE_VALUE_TYPES } from 'src/screens/OrderManagement/constants';
import { get_currency, get_formatted_price_with_currency } from 'src/utils/common';
import useStyles from '../../../styles';
interface Props {
	charges: any;
	total_amount_with_discount: number;
	total_amount_without_charges: number;
	currency_symbol: string;
}

const ShowCharges = ({ charges, total_amount_with_discount, total_amount_without_charges, currency_symbol }: Props) => {
	const config = useSelector((state: any) => state.configSettings?.cart_checkout_config);
	const classes = useStyles();
	const sorted_charges = useSortedCharges(charges);

	return (
		<>
			{_.map(sorted_charges, (charge, key) => {
				const { value, value_type, charge_type, name } = charge;

				const is_tax = charge_type === CHARGE_TYPE.tax;
				const base_value = is_tax && !config?.charge_pre_discount ? total_amount_with_discount : total_amount_without_charges;

				let charge_amount = value;
				if (value_type === CHARGE_VALUE_TYPES.percentage) {
					charge_amount = (value / 100) * base_value;
				}

				return (
					<Grid display='flex' justifyContent='space-between' key={`charge${key}`}>
						<CustomText type='Title'>
							{name} ({value_type === CHARGE_VALUE_TYPES.percentage ? `${value}%` : get_currency(currency_symbol)})
						</CustomText>
						<CustomText className={name === 'Discount' ? classes.discount_color_valid : classes.discount_color_invalid} type='H3'>
							{!is_tax && '-'} {get_formatted_price_with_currency(currency_symbol, charge_amount)}
						</CustomText>
					</Grid>
				);
			})}
		</>
	);
};

export default ShowCharges;
