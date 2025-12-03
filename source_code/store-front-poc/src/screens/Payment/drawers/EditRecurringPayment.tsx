/* eslint-disable @typescript-eslint/no-unused-vars */
import { Divider } from '@mui/material';
import { t } from 'i18next';
import { find, head, indexOf, isEmpty, join, map, sortBy, split, values } from 'lodash';
import React, { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Button, Chip, Drawer, Grid, Icon, Switch } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import SavedCardListing from 'src/common/@the-source/molecules/SavedCardListing';
import { colors } from 'src/utils/theme';
import constants from '../constants';
import { secondary } from 'src/utils/light.theme';
import { info } from 'src/utils/common.theme';
import EditRecurringDrawerSkeleton from '../component/EditRecurringDrawerSkeleton';
import AddPaymentModal from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/Drawer/AddPaymentModal';
import UsePaymentDetails from '../UsePaymentDetails';
import { makeStyles } from '@mui/styles';
import PaymentSchedule from '../component/PaymentSchedule';
import { payments } from 'src/utils/api_requests/payment';
import { format_payment_schedule_date } from '../utils';
import { get_formatted_price_with_currency } from 'src/utils/common';
import { useSelector } from 'react-redux';
import PaymentEmailModal from 'src/common/PaymentEmailModal';
import { EmailData } from 'src/common/Interfaces/EmailData';
import AddEditEmailDrawer from '../component/AddEditEmailDrawer';
import { convert_date_to_timezone } from 'src/utils/dateUtils';

const useStyles = makeStyles(() => ({
	status_container: {
		backgroundColor: colors.grey_600,
		borderRadius: '16px',
		padding: '8px 16px',
	},
	payment_method_container: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-end',
	},
	payment_details_container: {
		backgroundColor: '#F7F8FA',
		padding: '16px',
		borderRadius: '12px',
		gap: '16px',
		display: 'flex',
		flexDirection: 'column',
	},
	payment_details_items: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	space_between_container: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	disabled_form: {
		'& > *': {
			opacity: 0.4,
		},
	},
	button_style: {
		width: 'max-content',
		display: 'flex',
		alignItems: 'center',
		gap: '4px',
	},
}));

interface Props {
	open: boolean;
	on_close: () => void;
	recurring_payment_id: string;
	buyer_id: string;
	handle_update?: (id: string, status?: string, payment_method_info?: any, notification_email_ids?: string) => void;
	set_toast?: (data: any) => any;
	edit_flow: boolean;
}

const EditRecurringPayment = ({ open, on_close, recurring_payment_id, buyer_id, handle_update, set_toast, edit_flow }: Props) => {
	const { payment_config, all_addresses } = UsePaymentDetails(edit_flow);
	const classes = useStyles();

	const currency = useSelector((state: any) => state?.settings?.currency);

	const [payment_methods, set_payment_methods] = useState<any[]>([]);
	const [all_payment_methods, set_all_payment_methods] = useState<any>({});
	const [selected_payment_method, set_selected_payment_method] = useState('');
	const [payment_method_loader, set_payment_method_loader] = useState(true);
	const [is_loading, set_is_loading] = useState(true);
	const [update_loading, set_update_loading] = useState(false);
	const [recurring_payment_details, set_recurring_payment_details] = useState<any>({});
	const [is_add_card_modal, set_is_add_card_modal] = useState(false);
	const [payment_email_modal, set_payment_email_modal] = useState(false);
	const [is_submit_loading, set_is_submit_loading] = useState(false);
	const [email_checkbox, set_email_checkbox] = useState(false);
	const [email_data, set_email_data] = useState<EmailData>({
		to_emails: [],
		cc_emails: [],
		bcc_emails: [],
		is_auto_trigger: false,
		is_enable: false,
		user_permission_flag: false,
	});
	const [drawer_state, set_drawer_state] = useState(false);
	const [hide_recurring_payment_drawer, set_hide_recurring_payment_drawer] = useState(false);

	const handle_drawer_state = (state: boolean) => {
		set_hide_recurring_payment_drawer(state);
		set_drawer_state(state);
	};

	const methods = useForm({
		defaultValues: {
			recurring_payment_name: '',
			active: false,
		},
	});

	const is_closed = recurring_payment_details?.recurring_payment_status === constants.status.CLOSED;

	const { watch, setValue } = methods;

	const is_active = watch('active');
	const payment_status_enabled = is_closed || is_active;

	const disable_save =
		recurring_payment_details?.recurring_payment_status === (is_active ? constants.status.ACTIVE : constants.status.INACTIVE) &&
		selected_payment_method === recurring_payment_details?.payment_method_id;

	const render_name = () => {
		return (
			<FormBuilder
				name='recurring_payment_name'
				id='recurring_payment_name'
				validations={{ required: true }}
				type='text'
				label='Recurring Payment Name'
				disabled={true}
			/>
		);
	};

	const render_active_field = () => {
		return (
			<Grid className={`${classes.status_container} ${classes.space_between_container}`}>
				<CustomText type='Subtitle'>{t('Payment.EditRecurringPaymentDrawer.Active')}</CustomText>
				<Switch disabled={is_closed} checked={is_active || is_closed} onChange={(e) => setValue('active', e.target.checked)} />
			</Grid>
		);
	};

	const update_payment_method = (id: string) => {
		set_selected_payment_method(id);
	};

	const render_payment_methods = () => (
		<Grid>
			<CustomText type='H3'>{t('Payment.EditRecurringPaymentDrawer.PaymentDetails')}</CustomText>
			<Grid className={classes.payment_method_container}>
				<Button
					disabled={!is_active || is_closed}
					onClick={() => set_is_add_card_modal(true)}
					className={classes.button_style}
					variant='text'>
					<Icon color={is_active ? colors.primary_600 : secondary[500]} iconName='IconPlus' />
					{t('Payment.AddNewCard')}
				</Button>
				<SavedCardListing
					is_disabled={!is_active}
					section_heading={''}
					render_type={'card'}
					default_payment_id={selected_payment_method}
					update_selected_payment_method={update_payment_method}
					saved_payment_methods={payment_methods}
					component_type={'select'}
					section_heading_style={{ marginTop: '0rem' }}
					useDefaultValue={true}
				/>
			</Grid>
		</Grid>
	);

	const render_payment_details = () => {
		return (
			<Grid className={classes.payment_details_container}>
				{map(constants.payment_details, (detail: any, index: number) => {
					const price_value = recurring_payment_details?.[detail?.key];
					return (
						<React.Fragment key={detail?.key}>
							<Grid className={classes.payment_details_items}>
								<CustomText type={detail?.type}>{detail?.label}</CustomText>
								<CustomText type={detail?.type}>{price_value ? get_formatted_price_with_currency(currency, price_value) : '--'}</CustomText>
							</Grid>
							{index === 0 && <Divider sx={{ borderStyle: 'dashed' }} />}
						</React.Fragment>
					);
				})}
			</Grid>
		);
	};

	const upcoming_payment = () => (
		<PaymentSchedule
			render_title={
				<Grid mb={2} className={classes.space_between_container}>
					<CustomText type='H3'>
						{is_closed ? t('Payment.EditRecurringPaymentDrawer.PaymentSchedule') : t('Payment.EditRecurringPaymentDrawer.UpcomingPayment')}
					</CustomText>
					{!is_closed && (
						<Chip
							sx={{
								borderRadius: '8px',
							}}
							label={
								<Grid display={'flex'} flexDirection={'row'} gap={1} alignItems={'center'}>
									<Icon iconName='IconCalendar' color={info.main} />
									<CustomText color={colors.secondary_text}>
										{format_payment_schedule_date(convert_date_to_timezone(recurring_payment_details?.next_billing_date, 'DD-MM-YYYY'))}
									</CustomText>
								</Grid>
							}
							bgColor={info[50]}
						/>
					)}
				</Grid>
			}
			show_info_icon={true}
			edit_schedule={true}
			scheduled_data={sortBy(recurring_payment_details?.schedule ?? [], 'to_process_date')}
		/>
	);

	const render_body = (
		<Grid className='drawer-body' pt={1}>
			{is_loading ? (
				<EditRecurringDrawerSkeleton />
			) : (
				<FormProvider {...methods}>
					<Grid container flexDirection={'column'} gap={2}>
						{render_name()}
						{render_active_field()}
						<Grid className={`${!payment_status_enabled && classes.disabled_form}`} container flexDirection={'column'} gap={2}>
							<Divider sx={{ borderStyle: 'dashed' }} />
							{render_payment_methods()}
							{render_payment_details()}
							<Divider sx={{ borderStyle: 'dashed' }} />
							{upcoming_payment()}
						</Grid>
					</Grid>
				</FormProvider>
			)}
		</Grid>
	);

	const render_header = (
		<Grid className='drawer-header'>
			<CustomText type='H2'>{t('Payment.EditRecurringPaymentDrawer.Header')}</CustomText>
			<Icon size='24' iconName='IconX' sx={{ cursor: 'pointer' }} onClick={on_close} />
		</Grid>
	);

	const update_recurring_payment_details = async () => {
		if (isEmpty(recurring_payment_id)) return;
		try {
			set_update_loading(true);
			const updated_status = is_active ? constants.status.ACTIVE : constants.status.INACTIVE;
			const curr_payment_mthod_info = all_payment_methods?.saved_payment_methods?.[selected_payment_method];
			const payload = {
				...(selected_payment_method !== recurring_payment_details?.payment_method_id ? { payment_method_id: selected_payment_method } : {}),
				...(recurring_payment_details?.recurring_payment_status !== updated_status ? { status: updated_status } : {}),
				...(email_checkbox ? { email_ids: email_data.to_emails } : {}),
			};
			await payments.update_recurring_payment_details(recurring_payment_id, payload);
			set_recurring_payment_details((prev: any) => ({
				...prev,
				payment_method_id: selected_payment_method,
				recurring_payment_status: updated_status,
			}));
			handle_update &&
				handle_update(
					recurring_payment_details?.id,
					updated_status,
					{
						text_value: curr_payment_mthod_info?.title,
						image_src: curr_payment_mthod_info?.logo,
					},
					email_checkbox ? join(email_data.to_emails, ', ') : undefined,
				);
			set_toast &&
				set_toast({
					show: true,
					title: 'Recurring payment updated successfully',
					message: '',
					status: 'success',
				});
		} catch {
			set_toast &&
				set_toast({
					show: true,
					title: 'Failed to update recurring payment',
					message: '',
					status: 'warning',
				});
		} finally {
			set_update_loading(false);
			on_close();
		}
	};

	const render_footer = (
		<Grid className='drawer-footer'>
			<Grid container display={'flex'} justifyContent={'flex-end'}>
				<Grid item display={'flex'} gap={1.5}>
					<Button
						loading={update_loading}
						disabled={update_loading || is_loading || disable_save || is_closed}
						onClick={() => set_payment_email_modal(true)}>
						{t('Payment.EditRecurringPaymentDrawer.Save')}
					</Button>
				</Grid>
			</Grid>
		</Grid>
	);

	const handle_drawer_content = (
		<Grid className='drawer-container'>
			{render_header}
			<Divider className='drawer-divider' />
			{render_body}
			<Divider className='drawer-divider' />
			{render_footer}
		</Grid>
	);

	const get_buyer_payment_methods = async () => {
		try {
			const res: any = await payments.get_payment_methods(buyer_id);
			const saved_payment_methods = values(res?.data?.saved_payment_methods);
			set_payment_methods(saved_payment_methods);
			set_all_payment_methods(res?.data);
		} catch (err) {
			console.error(err);
		}
	};

	const handle_update_added_cards = async (key: string, value: any, data_key = 'saved_payment_methods') => {
		set_is_loading(true);
		const key_parts = split(key, '.');
		const saved_index = indexOf(key_parts, data_key);
		if (saved_index !== -1 && saved_index + 1 < key_parts.length) {
			const method_id = key_parts?.[saved_index + 1];
			if (method_id) {
				set_payment_methods((prevData: any) => [...prevData, value]);
			}
		}
		await get_buyer_payment_methods();
		set_is_loading(false);
	};

	const update_schedule = (prev_schedule: any[]) => {
		return map(prev_schedule, (schedule_data: any) => {
			const card_details: any = all_payment_methods?.saved_payment_methods?.[schedule_data?.payment_method_id];
			return {
				...schedule_data,
				card_type: schedule_data?.card_type ?? card_details?.card_type,
				title: schedule_data?.title ?? card_details?.title,
				card_logo: schedule_data?.card_logo ?? card_details?.logo,
			};
		});
	};

	const get_recurring_payment_details = async () => {
		if (isEmpty(recurring_payment_id)) return;
		try {
			set_is_loading(true);
			const res: any = await payments.get_recurring_payment_details(recurring_payment_id);
			const new_schedule = update_schedule(res?.data?.schedule);
			set_recurring_payment_details(
				!isEmpty(res?.data)
					? {
							...res?.data,
							schedule: new_schedule,
					  }
					: {},
			);
			setValue('active', res?.data?.recurring_payment_status === constants.status.ACTIVE);
			setValue('recurring_payment_name', res?.data?.name);
			const default_selected = find(payment_methods, (method: any) => method?.is_default) ?? head(payment_methods);
			set_selected_payment_method(res?.data?.payment_method_id ?? default_selected?.payment_method_id);
		} catch (err) {
			console.error(err);
		} finally {
			set_is_loading(false);
		}
	};

	const get_buyer_payment_methods_with_loader = async () => {
		try {
			set_payment_method_loader(true);
			await get_buyer_payment_methods();
		} catch (err) {
			console.error(err);
		} finally {
			set_payment_method_loader(false);
		}
	};

	const get_payment_email_payload = () => ({
		payload: {
			entity: 'recurring_payment',
			action: constants?.PAYMENT_EMAIL_ACTIONS?.recurring_payment_updated,
			buyer_id,
			additional_info: {
				payment_entity: 'buyer',
			},
		},
	});

	useEffect(() => {
		if (payment_method_loader) return;
		get_recurring_payment_details();
	}, [recurring_payment_id, payment_method_loader, payment_methods]);

	useEffect(() => {
		get_buyer_payment_methods_with_loader();
	}, [buyer_id]);

	return (
		<>
			<Drawer width={480} open={open && !hide_recurring_payment_drawer} onClose={on_close} content={handle_drawer_content} />

			{is_add_card_modal && (
				<AddPaymentModal
					all_address={all_addresses}
					customer_id=''
					web_token={payment_config?.web_token}
					is_visible={is_add_card_modal}
					close={() => set_is_add_card_modal(false)}
					source='collect_payment'
					buyer_id={buyer_id}
					payment_source={payment_config?.payment_gateway}
					handle_update_form={handle_update_added_cards}
					is_direct_payment_flow={false}
				/>
			)}

			{payment_email_modal && (
				<PaymentEmailModal
					handle_submit={update_recurring_payment_details}
					currency={currency}
					payment_email_modal={payment_email_modal}
					set_payment_email_modal={set_payment_email_modal}
					payment_email_payload={get_payment_email_payload()}
					email_data={email_data}
					set_email_data={set_email_data}
					email_checkbox={email_checkbox}
					set_email_checkbox={set_email_checkbox}
					is_payment_email_submit_loading={is_submit_loading}
					set_is_payment_email_submit_loading={set_is_submit_loading}
					handle_drawer_state={handle_drawer_state}
					handle_drawer_type={() => {}} // IMP : Don't remove
					selected_option={''}
				/>
			)}

			{drawer_state && (
				<AddEditEmailDrawer
					drawer_state={drawer_state}
					handle_drawer_state={handle_drawer_state}
					email_data={email_data}
					set_email_data={set_email_data}
					buyer_id={buyer_id}
				/>
			)}
		</>
	);
};

export default EditRecurringPayment;
