import React from 'react';
import styles from '../Cell.module.css';
import { get_formatted_price_with_currency } from 'src/utils/common';

interface Props {
	value: any;
	valueFormatted?: any;
}

const PriceCellRenderer: React.FC<Props> = ({ value, ...rest }) => {
	const { valueFormatted } = rest;

	return (
		<div className={styles.agGridCustomCell}>
			{valueFormatted?.amount && valueFormatted?.currency && (
				<div suppressContentEditableWarning>{get_formatted_price_with_currency(valueFormatted?.currency, valueFormatted?.amount)}</div>
			)}
		</div>
	);
};

export default PriceCellRenderer;
