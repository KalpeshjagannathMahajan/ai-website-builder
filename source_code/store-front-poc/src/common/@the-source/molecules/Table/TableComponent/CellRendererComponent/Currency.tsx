import { get_formatted_price_with_currency } from 'src/utils/common';
import styles from '../Cell.module.css';
import { useSelector } from 'react-redux';

interface Props {
	value: any;
	valueFormatted?: any;
	node?: any;
}

const CurrencyIconCellRenderer: React.FC<Props> = ({ value, node, ...rest }) => {
	const { valueFormatted } = rest;
	let currency = useSelector((state: any) => state?.settings?.currency);
	return <div className={styles.agGridCustomCell}>{get_formatted_price_with_currency(currency, valueFormatted || value)}</div>;
};

export default CurrencyIconCellRenderer;
