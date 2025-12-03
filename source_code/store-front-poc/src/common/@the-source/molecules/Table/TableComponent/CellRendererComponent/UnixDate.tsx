import _ from 'lodash';

import styles from '../Cell.module.css';
import dayjs from 'dayjs';
import { convert_date_to_timezone } from 'src/utils/dateUtils';
import constants from 'src/utils/constants';

interface Props {
	value: any;
	valueFormatted?: any;
	colDef?: any;
}

const UnixDateCellRenderer: React.FC<Props> = ({ value, ...rest }) => {
	const { valueFormatted, colDef } = rest;

	const formattedDate = _.attempt(() => {
		if (valueFormatted) {
			const date_unix_convert = dayjs.unix(valueFormatted);
			const formatted_data = convert_date_to_timezone(date_unix_convert, colDef?.format || constants.ATTRIBUTE_DATE_FORMAT);
			return formatted_data;
		} else return 'NA';
	});

	const safeFormattedDate = _.isError(formattedDate) ? 'NA' : formattedDate;
	return <div className={styles.agGridCustomCell}>{safeFormattedDate}</div>;
};

export default UnixDateCellRenderer;
