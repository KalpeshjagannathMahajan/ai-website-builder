import { Divider } from '@mui/material';
import { Box, Grid } from 'src/common/@the-source/atoms';
import { useContext } from 'react';
import ProductDetailsContext from '../context';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from '../styles';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';
import { get_formatted_price_with_currency } from 'src/utils/common';

interface Props {
	data: any[];
	currency: string;
}

const active_style = {
	backgroundColor: '#F7F8FA',
	borderRadius: 8,
};

const PriceTier: React.FC<Props> = ({ data, currency }) => {
	const { tier_final_price } = useContext(ProductDetailsContext);
	const { t } = useTranslation();
	const classes = useStyles();
	const theme: any = useTheme();

	const get_display_quantity = (start_quantity: number, end_quantity: number, key: number) => {
		if (start_quantity === end_quantity) {
			return start_quantity;
		}
		if (key !== 0) {
			if (key === _.size(data) - 1) {
				return `>=${start_quantity}`;
			}
			return `${start_quantity} - ${end_quantity}`;
		}

		return `<${end_quantity + 1}`;
	};

	return (
		<Grid display={'flex'} my={1.5}>
			{data?.map((ele: any, index: number) => {
				const { id = 0, end_quantity = 0, start_quantity = 0, price = 0 } = ele;
				return (
					<Box
						key={id}
						style={
							ele?.final_price === tier_final_price
								? { ...active_style, ...theme?.product_details.product_info_container?.active_style }
								: {}
						}
						className={classes.price_scale_item}>
						<CustomText type='Caption'>{get_display_quantity(start_quantity, end_quantity, index)}</CustomText>
						<Divider />
						<CustomText type='Subtitle' className={ele.final_price === tier_final_price ? classes.active_price_style : ''}>
							{t('PDP.Common.Price', { price: get_formatted_price_with_currency(currency, price) })}
						</CustomText>
					</Box>
				);
			})}
		</Grid>
	);
};

export default PriceTier;
