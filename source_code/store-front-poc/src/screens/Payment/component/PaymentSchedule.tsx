/* eslint-disable @typescript-eslint/no-unused-vars */
import { capitalize, isEmpty, map, split } from 'lodash';
import React from 'react';
import { Chip, Grid, Icon, Image, Tooltip } from 'src/common/@the-source/atoms';
import useStyles from '../styles';
import CustomText from 'src/common/@the-source/CustomText';
import PAYMENT_CONSTANTS from '../constants';
import { CARD_URLS } from 'src/utils/common';
import { format_payment_schedule_date } from '../utils';
import { colors } from 'src/utils/theme';
import { t } from 'i18next';
import VirtualList from 'src/common/VirtualList';
import { convert_date_to_timezone } from 'src/utils/dateUtils';

interface Props {
	render_title: any;
	scheduled_data: any[];
	edit_schedule: boolean;
	selected_payment_data?: any;
	show_info_icon?: boolean;
}

const PaymentSchedule = ({ render_title, scheduled_data, edit_schedule, selected_payment_data, show_info_icon = false }: Props) => {
	const classes = useStyles();

	const get_style_by_status = (status: string = 'pending') => {
		const styles: Record<string, { background: string; color: string; label: string }> = {
			pending: { background: '#FCEFD6', color: '#CE921E', label: 'Pending' },
			failed: { background: '#F7DBCF', color: '#D74C10', label: 'Failed' },
			paid: { background: '#E8F3EF', color: '#16885F', label: 'Paid' },
			on_hold: { background: '#F2F4F7', color: '#676D77', label: 'On Hold' },
			default: { background: '#F2F4F7', color: '#676D77', label: capitalize(split(status, '_').join(' ')) },
		};

		return styles[status] || styles.default;
	};

	const render_scheduled_subscription = (
		<Grid container mb={1.5}>
			<Grid className={classes.scheduled_header} width='100%'>
				{map(PAYMENT_CONSTANTS?.schedule_header, (item) => (
					<CustomText color='#00000099' style={item?.style} type='Subtitle' key={item?.key}>
						{item?.label}
					</CustomText>
				))}
			</Grid>
		</Grid>
	);

	const handle_render_scheduled_card = (item: any) => {
		const chip_style = get_style_by_status(edit_schedule ? item?.schedule_status : 'pending');
		const card_data = {
			card_logo: edit_schedule ? CARD_URLS[item?.card_type] : selected_payment_data?.logo,
			title: edit_schedule ? item?.title : selected_payment_data?.title,
		};

		const _formatted_date = format_payment_schedule_date(
			edit_schedule ? convert_date_to_timezone(item?.to_process_date, 'DD-MM-YYYY') : item?.date,
		);

		return (
			<Grid key={item?.date} className={classes.recurring_amount} width='100%' mb={1.5}>
				<CustomText color='#00000099' type='Subtitle' style={{ flex: '40%' }}>
					{_formatted_date}
				</CustomText>

				{edit_schedule || !isEmpty(selected_payment_data) ? (
					<Grid style={{ flex: '55%', display: 'flex' }}>
						<Image src={card_data?.card_logo} width='40' />
						<CustomText color='#00000099' type='Subtitle'>
							{card_data?.title}
						</CustomText>
					</Grid>
				) : (
					<Grid style={{ flex: '40%', display: 'flex', marginLeft: '45px' }}>--</Grid>
				)}

				<Grid
					style={{
						flex: '25%',
						display: 'flex',
						flexDirection: 'row',
						gap: '4px',
						alignItems: 'center',
					}}>
					<Chip
						size='small'
						bgColor={chip_style?.background}
						sx={{ padding: '0px 4px' }}
						label={
							<CustomText type='Caption' color={chip_style.color}>
								{edit_schedule ? chip_style?.label : 'Pending'}
							</CustomText>
						}
					/>
					{item?.schedule_status === 'failed' && show_info_icon && (
						<Tooltip
							arrow={true}
							placement='top'
							title={
								<CustomText type='CaptionBold' color='white'>
									{t('Payment.EditRecurringPaymentDrawer.FailedPaymentCopy')}
								</CustomText>
							}>
							<div>
								<Icon color={colors.secondary_text} iconName='IconInfoCircle' />
							</div>
						</Tooltip>
					)}
				</Grid>
			</Grid>
		);
	};

	const render_scheduled_row = (
		<Grid container gap={1.5}>
			<VirtualList
				list_style={{ overflowY: 'auto', width: '100%' }}
				render_item={handle_render_scheduled_card}
				data={scheduled_data}
				item_height={30}
				item_key={(item: any) => item?.date}
			/>
		</Grid>
	);

	return (
		<React.Fragment>
			{render_title}
			{render_scheduled_subscription}
			{render_scheduled_row}
		</React.Fragment>
	);
};

export default PaymentSchedule;
