import { get_formatted_price_with_currency } from 'src/utils/common';
import { Box, Chip, Grid, Image } from '../@the-source/atoms';
import CustomText from '../@the-source/CustomText';
import { useSelector } from 'react-redux';
import { colors } from 'src/utils/theme';
import { get } from 'lodash';
import useStyles from './styles';
import { useTheme } from '@mui/material/styles';

const AuthorizedTxnRenderer = ({ transaction, full_width, index }: any) => {
	const currency = useSelector((state: any) => state?.settings?.currency);
	const classes = useStyles();
	const theme: any = useTheme();
	return (
		<Grid
			item
			className={full_width ? `${classes.auth_txn_item} ${classes.auth_txn_item_full_width}` : `${classes.auth_txn_item}`}
			mt={index !== 0 ? 2 : 0}>
			<Grid container display='flex' justifyContent='space-between' alignItems='center'>
				<Grid item>
					<Box>
						<CustomText type='Body'>{transaction?.display_id}</CustomText>
						<Box display='flex' gap={1} mt={1} alignItems='center'>
							<CustomText type='Body' color={colors.secondary_text}>
								{get(transaction, 'payment_method_info.title', '')}
							</CustomText>
							<Image src={get(transaction, 'payment_method_info.logo')} width={39} height={20} />
						</Box>
					</Box>
				</Grid>
				<Grid item>
					<Chip
						sx={{ fontWeight: '700' }}
						bgColor={theme?.palette?.warning[200]}
						label={`${get_formatted_price_with_currency(currency, transaction?.amount)} authorized`}
						textColor={theme?.palette?.warning[900]}
					/>
				</Grid>
			</Grid>
		</Grid>
	);
};

export default AuthorizedTxnRenderer;
