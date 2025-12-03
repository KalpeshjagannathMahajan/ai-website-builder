import { Radio, useTheme } from '@mui/material';
import _ from 'lodash';
import React from 'react';
import { Box, Grid, Switch } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import { get_formatted_price_with_currency } from 'src/utils/common';
import useStyles from '../styles';

interface Props {
	data: any;
	currency: string;
	show_invoice: boolean;
	set_show_invoice: (val: boolean) => any;
	checked_invoice: string;
	set_checked_invoice: (val: string) => any;
	methods: any;
}

const RenderInvoiceDetails = ({ data, currency, set_show_invoice, show_invoice, set_checked_invoice, checked_invoice, methods }: Props) => {
	const { setValue } = methods;
	const classes = useStyles();
	const theme: any = useTheme();

	const handle_change = (item: any) => {
		set_checked_invoice(item?.id);
		setValue('transaction_summary.order_invoice_amount', item?.remaining_amount);
	};

	const handle_toggle_switch = () => {
		set_show_invoice((prev: boolean) => {
			if (!show_invoice) {
				const item: any = _.head(data?.invoices);
				setValue('transaction_summary.order_invoice_amount', item?.remaining_amount);
				set_checked_invoice(item?.id);
			} else {
				setValue('transaction_summary.order_invoice_amount', data?.total_amount_due);
				set_checked_invoice('');
			}
			return !prev;
		});
	};

	const AmountDisplay = ({ label, amount }: any) => {
		if (amount <= 0) return null;

		return (
			<Grid container justifyContent='space-between'>
				<CustomText type='Body' style={{ marginLeft: 35, color: theme?.payments?.grey_dark }}>
					{label}
				</CustomText>
				<CustomText type='Body'>{get_formatted_price_with_currency(currency, amount)}</CustomText>
			</Grid>
		);
	};

	return (
		<React.Fragment>
			<Box bgcolor={theme?.payments?.grey_400} borderRadius={1.5} p={1.5}>
				<Grid container justifyContent='space-between' alignItems='center' mb={show_invoice ? 2 : 0}>
					<CustomText type='H6'>Payment against Invoice</CustomText>
					<Switch checked={show_invoice} onChange={handle_toggle_switch} />
				</Grid>

				{show_invoice && (
					<Grid container gap={1} bgcolor={theme?.payments?.grey_400}>
						{_.map(data?.invoices, (item: any) => {
							const active = item?.id === checked_invoice;

							return (
								<Grid container bgcolor={theme?.payments?.white} gap={1} className={classes.invoice_item} key={item?.id}>
									<Grid container justifyContent='space-between' key={item?.id}>
										<Box display='flex' gap={2}>
											<Radio
												sx={{ padding: '0' }}
												checked={item.id === checked_invoice}
												onClick={() => handle_change(item)}
												name={item?.display_id}
											/>
											<CustomText type={active ? 'Subtitle' : 'Body'}>{item?.display_id}</CustomText>
										</Box>
										<CustomText type='Subtitle'>{get_formatted_price_with_currency(currency, item?.total_amount)}</CustomText>
									</Grid>
									<AmountDisplay label='Amount collected' amount={item?.total_collected} />
									<AmountDisplay label='Amount refunded' amount={item?.total_refunded} />
								</Grid>
							);
						})}
					</Grid>
				)}
			</Box>
			<hr style={{ margin: '16px 0px' }}></hr>
		</React.Fragment>
	);
};

export default RenderInvoiceDetails;
