import React, { useContext } from 'react';
import { TABLE_CONSTANTS } from '../constants';
import { AgGridTableContext } from '../context';
import { Box, Grid, Icon, Typography } from 'src/common/@the-source/atoms';
import { formatNumberWithCommas } from 'src/utils/common';

const CustomRightStatusBar = () => {
	const { total_rows, column_id, summary } = useContext(AgGridTableContext);
	const container_style = {
		display: 'flex',
		alignItems: 'center',
		gap: 5,
	};

	const handle_render_status_bar = () => {
		if (column_id === TABLE_CONSTANTS.BUYER_CUSTOM_STATUS_BAR) {
			return (
				<React.Fragment>
					{column_id && (
						<Grid gap={2} container>
							<Box style={container_style}>
								<Icon iconName='IconFileText' />
								<Typography>
									Total Orders: <span style={{ fontWeight: 700 }}>{formatNumberWithCommas(summary?.Order ?? 0)}</span>{' '}
								</Typography>
							</Box>

							<Box style={container_style}>
								<Icon iconName='IconReceiptTax' />
								<Typography>
									Total Quotes: <span style={{ fontWeight: 700 }}>{formatNumberWithCommas(summary?.Quote ?? 0)}</span>{' '}
								</Typography>
							</Box>

							<Box style={container_style}>
								<Icon iconName='IconReceiptTax' />
								<Typography>
									Total Drafts: <span style={{ fontWeight: 700 }}>{formatNumberWithCommas(summary?.Draft ?? 0)}</span>{' '}
								</Typography>
							</Box>
						</Grid>
					)}
				</React.Fragment>
			);
		} else if (
			column_id === TABLE_CONSTANTS.DASHBOARD_CUSTOM_STATUS_BAR ||
			column_id === TABLE_CONSTANTS.ORDER_LISTING_STATUS_BAR.ORDERS ||
			column_id === TABLE_CONSTANTS.ORDER_LISTING_STATUS_BAR.QUOTES ||
			column_id === TABLE_CONSTANTS.ORDER_LISTING_STATUS_BAR.DRAFTS
		) {
			return (
				<React.Fragment>
					<Grid container gap={2} mx={2}>
						<React.Fragment>
							{(column_id === TABLE_CONSTANTS.ORDER_LISTING_STATUS_BAR.ORDERS ||
								column_id === TABLE_CONSTANTS.ORDER_LISTING_STATUS_BAR.DRAFTS) && (
								<Box style={container_style}>
									<Icon iconName='IconFileText' />
									<Typography>
										Total Orders: <span style={{ fontWeight: 700 }}>{formatNumberWithCommas(summary?.order ?? 0)}</span>{' '}
									</Typography>
								</Box>
							)}
							{(column_id === TABLE_CONSTANTS.ORDER_LISTING_STATUS_BAR.QUOTES ||
								column_id === TABLE_CONSTANTS.ORDER_LISTING_STATUS_BAR.DRAFTS) && (
								<Box style={container_style}>
									<Icon iconName='IconReceiptTax' />
									<Typography>
										Total Quotes: <span style={{ fontWeight: 700 }}>{formatNumberWithCommas(summary?.quote ?? 0)}</span>{' '}
									</Typography>
								</Box>
							)}
						</React.Fragment>

						<Box style={{ ...container_style, borderRadius: '20px', backgroundColor: '#F2F4F7', padding: '0.5rem 1.2rem' }}>
							<Icon iconName='IconCurrencyDollar' />
							<Typography>
								Total value:{' '}
								<span style={{ fontWeight: 700 }}>
									{formatNumberWithCommas((summary?.order_total_value ?? 0) + (summary?.quote_total_value ?? 0) + 0, true)}
								</span>{' '}
							</Typography>
						</Box>
					</Grid>
				</React.Fragment>
			);
		} else return <React.Fragment></React.Fragment>;
	};

	return <React.Fragment>{column_id && total_rows !== 0 && handle_render_status_bar()}</React.Fragment>;
};

export default CustomRightStatusBar;
