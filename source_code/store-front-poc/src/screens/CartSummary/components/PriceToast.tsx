import { Divider, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box, Grid, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import { get_formatted_price_with_currency } from 'src/utils/common';
import { colors } from 'src/utils/theme';

interface Props {
	base_price?: number | null;
	sale_price: number;
	offered_price: number;
	currency?: string;
}

const useStyles = makeStyles(() => ({
	tooltip: {
		zIndex: 1,
		padding: 0,
		backgroundColor: colors.white,
		border: `1px solid ${colors.dark_midnight_blue}`,
	},
	arrow: {
		color: colors.white,
		'&::before': {
			border: `1px solid ${colors.dark_midnight_blue}`,
		},
	},
	info_icon: {
		height: '16px',
		width: '16px',
	},
}));

const PriceToast = ({ base_price, sale_price, offered_price, currency = '$' }: Props) => {
	return (
		<Box p={1} width={'250px'}>
			<CustomText type='H3'>Price details</CustomText>
			<Divider sx={{ margin: '0.5rem 0rem' }} />
			<Grid container direction='column' spacing={1}>
				{base_price && (
					<Grid item container justifyContent='space-between' alignItems='center'>
						<Grid item>
							<CustomText type='Body'>Base price:</CustomText>
						</Grid>
						<Grid item>
							<CustomText type='Body'>
								<strong>{get_formatted_price_with_currency(currency, base_price)}</strong>
							</CustomText>
						</Grid>
					</Grid>
				)}
				<Grid item container justifyContent='space-between' alignItems='center'>
					<Grid item>
						<CustomText type='Body'>Sale price:</CustomText>
					</Grid>
					<Grid item>
						<CustomText type='Body'>
							<strong>{get_formatted_price_with_currency(currency, sale_price)}</strong>
						</CustomText>
					</Grid>
				</Grid>
				<Grid item container justifyContent='space-between' alignItems='center'>
					<Grid item>
						<CustomText type='Body'>Offered price:</CustomText>
					</Grid>
					<Grid item>
						<CustomText type='Body'>
							<strong>{get_formatted_price_with_currency(currency, offered_price)}</strong>
						</CustomText>
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
};

const PriceTooltip = ({ base_price, sale_price, offered_price, currency }: Props) => {
	const classes = useStyles();
	return (
		<Tooltip
			componentsProps={{
				tooltip: {
					className: classes.tooltip,
				},
				arrow: {
					className: classes.arrow,
				},
			}}
			placement='bottom'
			title={<PriceToast sale_price={sale_price} base_price={base_price} offered_price={offered_price} currency={currency} />}>
			<div style={{ position: 'relative', display: 'flex' }}>
				<Icon iconName='IconInfoCircle' className={classes.info_icon} />
			</div>
		</Tooltip>
	);
};

export default PriceTooltip;
