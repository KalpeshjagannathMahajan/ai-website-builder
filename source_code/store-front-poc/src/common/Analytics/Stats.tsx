import { Tooltip } from 'src/common/@the-source/atoms';
import { useTheme } from '@mui/material/styles';
import { formatNumberWithCommas, get_formatted_price_with_currency } from 'src/utils/common';
import CustomText from '../@the-source/CustomText';

const styles = {
	overflow: {
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
};
const Stats = ({ info, show_details, currency }: any) => {
	const theme: any = useTheme();
	if (show_details && info?.type === 'DRAFTS') {
		const ordersCount = info?.orders ?? 0;
		const quotesCount = info?.quotes ?? 0;
		return (
			<div>
				<CustomText type='Body' color={theme?.palette?.colors?.black_8}>
					{/* <Trans i18nKey='BuyerDashboard.Stats.ShowingOrders' count={ordersCount <= 1 ? 1 : ordersCount}> */}
					{`${formatNumberWithCommas(ordersCount.toString())} order${ordersCount > 1 ? 's' : ''}`}
					{/* </Trans> */}
				</CustomText>
				<CustomText type='Body' color={theme?.palette?.colors?.black_8}>
					{/* <Trans i18nKey='BuyerDashboard.Stats.ShowingQuotes' count={quotesCount <= 1 ? 1 : quotesCount}> */}
					{`${formatNumberWithCommas(quotesCount.toString())} quote${quotesCount > 1 ? 's' : ''}`}
					{/* </Trans> */}
				</CustomText>
			</div>
		);
	}
	if (info?.type === 'DRAFTS') {
		const ordersCount = info?.orders ?? 0;
		const quotesCount = info?.quotes ?? 0;
		return (
			<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
				<CustomText type='Body' color={theme?.palette?.colors?.black_8}>
					{/* <Trans i18nKey='BuyerDashboard.Stats.ShowingOrders' count={ordersCount <= 1 ? 1 : ordersCount}> */}
					{`${formatNumberWithCommas(ordersCount.toString())} order${ordersCount > 1 ? 's' : ''}`}
					{/* </Trans> */}
				</CustomText>
				<div style={{ height: '8px', width: '8px', borderRadius: '50%', background: theme?.stats?.custom_text?.background }} />
				<CustomText type='Body' color={theme?.palette?.colors?.black_8}>
					{/* <Trans i18nKey='BuyerDashboard.Stats.ShowingQuotes' count={quotesCount <= 1 ? 1 : quotesCount}> */}
					{`${formatNumberWithCommas(quotesCount.toString())} quote${quotesCount > 1 ? 's' : ''}`}
					{/* </Trans> */}
				</CustomText>
			</div>
		);
	}

	if (show_details) {
		return (
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<Tooltip title={info?.name}>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<CustomText type='Body' color={theme?.stats?.custom_text?.color} style={{ whiteSpace: 'nowrap' }}>
							{info?.title}
						</CustomText>
						<CustomText type='Body' color={theme?.palette?.colors?.black_8} style={styles.overflow}>
							&nbsp;{get_formatted_price_with_currency(currency, info?.value)}
						</CustomText>
					</div>
					<CustomText type='Body1' color={theme?.palette?.colors?.black_8} style={styles.overflow}>
						{info?.name || 'NA'}
					</CustomText>
				</Tooltip>
			</div>
		);
	}

	return (
		<div style={{ display: 'flex' }}>
			<CustomText type='Body' color={theme?.stats?.custom_text?.black_8}>
				{info?.title}
			</CustomText>

			<CustomText type='Body' color={theme?.palette?.colors?.black_8}>
				&nbsp;{get_formatted_price_with_currency(currency, info?.value)}
			</CustomText>
		</div>
	);
};

export default Stats;
