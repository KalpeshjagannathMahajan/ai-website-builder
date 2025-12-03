import dayjs from 'dayjs';
import _ from 'lodash';
import { isoToUnixTimestamp } from 'src/utils/common';

interface Props {
	value: any;
	node?: any;
}

const DateComp: React.FC<Props> = ({ value, ...rest }) => {
	const { node } = rest;

	const newValue = value || isoToUnixTimestamp(node?.data?.updated_at);

	const formattedDate = _.attempt(() => {
		return dayjs.unix(newValue).format('MM/DD/YYYY');
	});

	const safeFormattedDate = _.isError(formattedDate) ? 'NA' : formattedDate;

	return <div>{safeFormattedDate}</div>;
};

export default DateComp;
