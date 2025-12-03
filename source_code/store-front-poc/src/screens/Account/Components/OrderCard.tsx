import { Grid } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import { StatusCellRenderer } from 'src/common/@the-source/molecules/Table/TableComponent/CellRendererComponent';
import { makeStyles } from '@mui/styles';
import { useContext } from 'react';
import AccountContext from '../context';
import { get_formatted_price_with_currency, isoToDateDay } from 'src/utils/common';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme: any) => ({
	container: {
		flexDirection: 'row',
		width: '100%',
		borderRadius: theme?.card_?.borderRadius,
		padding: '16px',
		gap: '12px',
		...theme?.myOrdersCardStyle,
		[theme.breakpoints.down(354)]: {
			flexDirection: 'column',
		},
		[theme.breakpoints.down(600)]: {
			padding: '12px',
		},
	},
	customTextStyle: {
		color: 'grey',
		borderRadius: '5px',
		padding: '4px',
		...theme?.myOrdersCardTextStyle,
	},
}));

export const OrderCard = ({ data }: any) => {
	const classes = useStyles();
	const { handle_navigate_on_click } = useContext(AccountContext);
	const buyer = useSelector((state: any) => state?.buyer);
	const currency_symbol = buyer?.buyer_cart?.meta?.pricing_info?.currency_symbol;

	return (
		<Grid display={'flex'} className={classes.container} onClick={() => handle_navigate_on_click({ node: { data } })}>
			<Grid container flexDirection={'column'} gap={1} sx={{ minWidth: '158px' }}>
				<Grid display={'inline-flex'}>
					<StatusCellRenderer value={[data?.document_status]} valueFormatted={data?.document_status} />
				</Grid>
				<Grid container flexDirection={'column'} gap={1}>
					<CustomText type='Subtitle'>{get_formatted_price_with_currency(currency_symbol, data?.total_value)}</CustomText>
					<CustomText type='Body' color='grey'>
						{data?.system_id}
					</CustomText>
				</Grid>
			</Grid>
			<Grid container flexDirection={'column'} gap={1}>
				<Grid display='flex' alignItems='center' gap={1}>
					<CustomText type='Caption'>Created on : </CustomText>
					<CustomText type='Caption' className={classes.customTextStyle}>
						{isoToDateDay(data?.created_at_milliseconds, "DD MMM' YY")}
					</CustomText>
				</Grid>
				<CustomText type='Caption'>Channel : {data?.source}</CustomText>
			</Grid>
		</Grid>
	);
};
