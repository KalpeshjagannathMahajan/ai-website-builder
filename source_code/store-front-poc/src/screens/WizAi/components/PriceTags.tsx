import { useTheme } from '@mui/material';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import CustomText from 'src/common/@the-source/CustomText';
import styles from 'src/common/@the-source/molecules/Table/TableComponent/Cell.module.css';
import { get_formatted_price_with_currency } from 'src/utils/common';

const PriceTags = ({ value, id }: any) => {
	const currency = useSelector((state: any) => state?.settings?.currency);
	const final_price = _.includes(value, '-')
		? `-${get_formatted_price_with_currency(currency, value.replace('-', ''))}`
		: `${get_formatted_price_with_currency(currency, value)}`;
	const theme: any = useTheme();
	const get_style = () => {
		if (_.includes(id, '$ change')) {
			return { color: value > 0 ? theme?.insights?.more_color : theme?.insights?.less_color };
		} else {
			return { color: theme?.insights?.black_color };
		}
	};
	return (
		<div className={styles.agGridCustomCell}>
			{value ? <CustomText style={get_style()}>{final_price}</CustomText> : <CustomText>--</CustomText>}
		</div>
	);
};

export default PriceTags;
