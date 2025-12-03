import { get_formatted_price_with_currency } from 'src/utils/common';
import _ from 'lodash';
import { useSelector } from 'react-redux';

interface Props {
	value: any;
	valueFormatted?: any;
	node?: any;
	item_name?: string;
}

const agGridCustomCell = {
	width: '100%',
	height: '100%',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	marginTop: '0.2rem',
	cursor: 'pointer',
};

const PaymentAmountComp: React.FC<Props> = ({ value, node, item_name }) => {
	let currency = useSelector((state: any) => state?.settings?.currency);
	const transaction_mode = _.get(node, 'data.transaction_mode');

	const helper = () => {
		switch (node?.data?.table_type) {
			case 'payment':
			case 'transactions':
				return _.includes(['purchase', 'buyer_purchase', 'authorize', 'recurring_payment'], transaction_mode)
					? { style: { color: 'rgba(125, 165, 14, 1)' }, sign: '+' }
					: { style: { color: 'rgba(215, 76, 16, 1)' }, sign: '-' };
			case 'credit':
				return _.includes(['refund', 'add_credits', 'authorize'], transaction_mode)
					? { style: { color: 'rgba(125, 165, 14, 1)' }, sign: '+' }
					: { style: { color: 'rgba(215, 76, 16, 1)' }, sign: '-' };
			case 'invoice':
				return item_name === 'Amount'
					? { style: { color: 'black', fontWeight: 500 } }
					: { style: { color: value < 0 ? '#065906' : '#af0505', fontWeight: 500 } };
			default:
				return { style: { color: 'rgba(125, 165, 14, 1)' }, sign: '+' };
		}
	};
	const { style, sign }: any = helper();

	return (
		<div style={{ ...agGridCustomCell }}>
			{value ? (
				<span style={{ ...style }}>
					{sign} {get_formatted_price_with_currency(currency, value)}
				</span>
			) : (
				'--'
			)}
		</div>
	);
};

export default PaymentAmountComp;
