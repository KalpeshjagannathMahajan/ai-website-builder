/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { map } from 'lodash';
import { Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { get_currency, get_formatted_price_with_currency } from 'src/utils/common';
import { useSelector } from 'react-redux';
import useStyles from '../styles';
import CustomText from 'src/common/@the-source/CustomText';
import { colors } from 'src/utils/theme';
import { secondary } from 'src/utils/light.theme';
import PaymentSchedule from './PaymentSchedule';
import { Divider } from '@mui/material';
import dayjs from 'dayjs';

interface Props {
	attributes: any;
	methods: any;
	open_drawer: boolean;
	set_open_drawer: (val: boolean) => void;
	create_recurring_payment_schedule: any;
	schedule_loading: boolean;
	schedule_payment_data: any;
	payment_method_data: any;
	selected_payment_method_id: string;
}

const SubscriptionForm = ({
	attributes,
	methods,
	open_drawer,
	set_open_drawer,
	create_recurring_payment_schedule,
	schedule_loading,
	schedule_payment_data,
	payment_method_data,
	selected_payment_method_id,
}: Props) => {
	const tenant_timezone = useSelector((state: any) => state?.login?.userDetails?.timezone) || 'UTC';
	const currency = useSelector((state: any) => state?.settings?.currency);
	const classes = useStyles();
	const [form_state, set_form_state] = useState<any>({});
	const { watch, setValue } = methods;

	const start_date = watch('start_date');
	const total_amount = watch('total_amount');
	const frequency = watch('frequency');
	const end_date = watch('end_date');

	const selected_payment_data = payment_method_data?.saved_payment_methods?.[selected_payment_method_id];
	const is_disabled = !total_amount || parseFloat(total_amount) === 0 || !start_date || !end_date || !frequency;
	const has_all_details = start_date && end_date && frequency && parseFloat(total_amount) !== 0;

	const input_styles: any = {
		text: {
			fontSize: '16px',
			height: 'auto',
		},
		amount: {
			fontSize: '14px',
			padding: '8px 12px 8px 0px',
			height: '30px',
			'& .MuiInputBase-root': { padding: '8px 12px 8px 0px' },
			'& .MuiOutlinedInput-root': { height: '30px' },
		},
	};

	const get_style = (type: string) => input_styles[type] || {};

	const handle_view_payment_schedule = () => {
		set_open_drawer(true);
	};

	const handle_get_min_date = (field: any) => {
		if (field?.id === 'start_date') return dayjs().tz(tenant_timezone).add(1, 'day').startOf('day');
		if (field?.id === 'end_date') return start_date ? dayjs(start_date).tz(tenant_timezone) : null;
	};

	const handle_disabled = (field: any) => {
		if (field?.id === 'end_date') return !start_date;
		return field?.disabled;
	};

	const handle_disable_past = (field: any) => {
		if (field?.id === 'start_date') return true;
		if (field?.id === 'end_date') return !start_date;
	};

	const render_form_field = (field: any) => (
		<FormBuilder
			key={field?.id}
			name={field?.id}
			id={field?.id}
			options={field?.options}
			label={field?.id !== 'total_amount' && field?.id !== 'name' ? field?.name : ''}
			show_asterisk={false}
			placeholder={field?.name}
			disableHighlightToday={true}
			validations={{
				required: Boolean(field?.required),
				email: field?.type === 'email',
				...field?.validations,
			}}
			inputProps={{
				autoComplete: 'off',
			}}
			format='DD-MM-YYYY'
			inputFormat='DD-MM-YYYY'
			minDate={handle_get_min_date(field)}
			sort_option={false}
			disabled={handle_disabled(field)}
			disablePast={handle_disable_past(field)}
			defaultValue={field?.id === 'total_amount' ? 0 : form_state?.[field?.id]}
			InputProps={
				field?.id === 'total_amount' && {
					style: {
						backgroundColor: colors.white,
					},
					startAdornment: (
						<Grid color={secondary[900]} pr={1.25}>
							{field?.id === 'total_amount' && get_currency(currency)}
						</Grid>
					),
				}
			}
			style={get_style(field?.type)}
			type={field?.type}
		/>
	);

	const render_attr_fields = (filter_func: (field: any) => boolean, render_func: (field: any) => any, wrapper_class?: string) => (
		<Grid className={wrapper_class}>{map(attributes, (field) => filter_func(field) && render_func(field))}</Grid>
	);

	const render_attributes = (field: any) => (
		<React.Fragment key={field?.id}>
			<Grid className={classes.payable_amount_section}>
				<CustomText type='Body' color='#25282D' style={{ padding: '8px' }}>
					{field?.name}
					<span style={{ color: 'red' }}>*</span>
				</CustomText>
				{render_form_field(field)}
			</Grid>
			<hr style={{ marginTop: '16px' }} />
		</React.Fragment>
	);

	const render_amount_section = () => render_attr_fields((field) => ['total_amount'].includes(field?.id), render_attributes);

	const render_date_section = () => (
		<React.Fragment>
			<CustomText color='rgba(0, 0, 0, 0.60)' type='Subtitle' style={{ marginBottom: '12px' }}>
				Schedule
			</CustomText>
			{render_attr_fields((field) => ['start_date', 'end_date'].includes(field?.id), render_form_field, classes.date_section)}
		</React.Fragment>
	);

	const render_subsciption_name = () =>
		render_attr_fields((field: any) => field?.id === 'name', render_form_field, classes.frequency_section);

	const render_dropdown_section = () =>
		render_attr_fields((field: any) => field?.id === 'frequency', render_form_field, classes.frequency_section);

	const render_payment_schedule_section = () => (
		<Grid container gap={2}>
			<Grid container justifyContent='space-between' className={classes.total_amount}>
				<CustomText type='Subtitle' color='#000000DE'>
					Recurring amount
				</CustomText>
				<CustomText type='Subtitle'>
					{schedule_payment_data?.recurring_amount
						? get_formatted_price_with_currency(currency, schedule_payment_data?.recurring_amount)
						: '--'}
				</CustomText>
			</Grid>
			<Button variant='text' loading={schedule_loading} onClick={handle_view_payment_schedule} disabled={is_disabled}>
				{schedule_loading ? 'Creating payment schedule...' : 'View payment schedule'}
			</Button>
		</Grid>
	);

	const handle_close = () => set_open_drawer(false);

	const render_header = (
		<Grid className='drawer-header'>
			<CustomText type='H2'>Payment schedule</CustomText>
			<Icon size='24' iconName='IconX' sx={{ cursor: 'pointer' }} onClick={handle_close} />
		</Grid>
	);

	const render_footer = (
		<Grid className='drawer-footer'>
			<Grid container display={'flex'} justifyContent={'flex-end'}>
				<Grid item display={'flex'} gap={1.5}>
					<Button onClick={handle_close}>Okay</Button>
				</Grid>
			</Grid>
		</Grid>
	);

	const handle_drawer_content = (
		<Grid className='drawer-container'>
			{render_header}
			<Divider className='drawer-divider' />
			<Grid className='drawer-body' gap={0}>
				<PaymentSchedule
					scheduled_data={schedule_payment_data?.schedule}
					selected_payment_data={selected_payment_data}
					edit_schedule={false}
					render_title={
						<Grid className={classes.recurring_amount} mb={2.5}>
							<CustomText type='Body' color='#000000DE'>
								Recurring amount
							</CustomText>
							<CustomText type='Subtitle'>
								{get_formatted_price_with_currency(currency, schedule_payment_data?.recurring_amount)}
							</CustomText>
						</Grid>
					}
				/>
			</Grid>
			<Divider className='drawer-divider' />
			{render_footer}
		</Grid>
	);

	useEffect(() => {
		if (has_all_details) {
			create_recurring_payment_schedule();
		}
		if (start_date && end_date && frequency) {
			set_form_state({
				start_date,
				end_date,
				frequency,
			});
		}

		if (!start_date && end_date) {
			setValue('end_date', null);
		}

		return () => create_recurring_payment_schedule.cancel();
	}, [start_date, end_date, frequency, total_amount, create_recurring_payment_schedule]);

	useEffect(() => {
		if (schedule_payment_data?.recurring_amount) {
			setValue('recurring_amount', schedule_payment_data?.recurring_amount);
		}
	}, [schedule_payment_data?.recurring_amount]);

	useEffect(() => {
		if (end_date < start_date) {
			setValue('end_date', null);
		}
	}, [start_date]);

	return (
		<React.Fragment>
			{render_subsciption_name()}
			{render_amount_section()}
			{render_date_section()}
			{render_dropdown_section()}
			{render_payment_schedule_section()}

			{open_drawer && <Drawer width={480} open={open_drawer} onClose={handle_close} content={handle_drawer_content} />}
		</React.Fragment>
	);
};

export default SubscriptionForm;
