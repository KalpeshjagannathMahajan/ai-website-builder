import { Divider, InputAdornment, TextField } from '@mui/material';
import _ from 'lodash';
import { useContext, useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Checkbox, Drawer, Grid, Icon, Image } from 'src/common/@the-source/atoms';
import PaymentLink from '../Common/PaymentLink';
import Invoices from '../Common/Invoices';
import SavedCardListing from 'src/common/@the-source/molecules/SavedCardListing';
import OrderManagementContext from '../../context';
import api_requests from 'src/utils/api_requests';
import CollectDrawerSkeleton from './CollectDrawerSkeleton';
import { t } from 'i18next';
import MarkAsPaid from '../Common/MarkAsPaid';
import { makeStyles } from '@mui/styles';
import { PERMISSIONS } from 'src/casl/permissions';
import Can from 'src/casl/Can';
import PosPayment from '../Common/PosPayment';
import ImageLinks from 'src/assets/images/ImageLinks';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { get_currency, get_formatted_price_with_currency } from 'src/utils/common';
import { CollectPaymentDrawerProps } from '../../interfaces';
import order_management from 'src/utils/api_requests/orderManagment';

const useStyles = makeStyles(() => ({
	handle_add_card: {
		marginTop: '2.4rem',
		cursor: 'pointer',
	},
}));

const CollectPaymentComp = ({
	document_id,
	is_visible,
	close,
	set_is_payment_modal_visible,
	handle_add_credits,
	set_data,
	set_input_value,
	set_collect_for_invoice,
	use_credit,
	data,
	input_value,
	set_attributes,
	set_is_authorised,
	attributes,
	set_use_credit,
	is_button_loading,
	set_active,
	handle_collect_payment,
	set_invoice_ids,
	active,
	collect_for_invoice,
	invoice_ids,
	email_data,
	set_email_data,
	set_email_checkbox,
	currency,
}: CollectPaymentDrawerProps) => {
	const classes = useStyles();
	const theme: any = useTheme();
	const user_permissions = useSelector((state: any) => state?.login?.permissions);
	const { document_data, set_customer_id, payment_config, set_payment_email_modal, set_payment_email_payload, payment_email_payload } =
		useContext(OrderManagementContext);
	const [selected_payment_method_id, set_selected_payment_method_id] = useState<string>('');
	const [saved_payment_methods, set_saved_payment_methods] = useState<any>([]);
	const [disabled, set_disabled] = useState<boolean>(false);
	const [is_loading, set_is_loading] = useState<boolean>(true);

	const get_config = () => {
		api_requests.order_management
			.get_payment_details({ document_id, payment_entity: 'order' })
			.then((res: any) => {
				if (res?.status === 200) {
					res.total_amount_due = res?.total_amount_due?.toFixed(2);
					set_data(res);
					set_input_value(res?.total_amount_due);
					set_customer_id(res?.customer_id);
					set_collect_for_invoice(payment_config?.accept_payment_against_invoice_only === true);
				}
			})
			.catch((err) => {
				console.log(err);
			})
			.finally(() => {
				set_is_loading(false);
			});
	};
	const credits_used = use_credit ? Math.min(data.wallet_balance, input_value) : 0;

	const handle_next_click = () => {
		if (active === 'payment_link') {
			handle_collect_payment();
			close();
		} else {
			close();
			set_payment_email_modal(true);
		}
	};

	const get_email_config_info = (payload: any) => {
		order_management
			.get_email_config_info(payload)
			.then((res: any) => {
				set_email_data(res?.data);
				set_email_checkbox(res?.data?.is_auto_trigger);
			})
			.catch((err) => console.error(err));
	};

	useEffect(() => {
		get_config();
		set_payment_email_payload({
			payment_type: 'payment_success',
			input_value,
			payload: {
				entity: 'payment',
				action: 'payment_success',
				document_id: document_data?.id,
				additional_info: {
					payment_entity: document_data?.type,
				},
			},
			drawer_type: 'collect_payment',
		});
		set_email_data([]);
	}, []);

	useEffect(() => {
		if (active === 'card') {
			set_attributes({ payment_method_id: selected_payment_method_id });
			const val = _.get(data?.saved_payment_methods, selected_payment_method_id)?.is_authorized ?? false;
			set_is_authorised(val);
		} else if (active === 'payment_link') {
			get_email_config_info({ ...payment_email_payload?.payload, action: 'payment_link' });
		}
	}, [active, selected_payment_method_id]);

	const selected_payment = 'card';

	useEffect(() => {
		const selected = _.filter(data?.saved_payment_methods, (value: any) => value.payment_method_type === selected_payment);
		set_saved_payment_methods(selected);
		const assigned_payment_method = _.find(selected, (method) => method.is_selected);
		const default_payment_method = _.find(selected, (method) => method.is_default);
		const random_payment_method = _.find(selected, () => true);
		set_selected_payment_method_id(
			assigned_payment_method?.payment_method_id ||
				default_payment_method?.payment_method_id ||
				random_payment_method?.payment_method_id ||
				'',
		);
	}, [data, selected_payment, active]);

	const check_charge_disabled = () => {
		if (Number(input_value) === 0) return true;
		if (active === 'card') return !attributes?.payment_method_id || attributes.payment_method_id === '';
		if (active === 'payment_link') return !email_data?.to_emails || email_data?.to_emails.length === 0;
		if (active === 'manual') return !attributes?.payment_mode || !attributes?.collection_date;
		return false;
	};

	useEffect(() => {
		const temp = check_charge_disabled();
		set_disabled(temp);
	}, [active, input_value, credits_used, attributes, selected_payment_method_id, email_data]);

	const handleInputChange = (event: any) => {
		let inputValue = event.target.value.replace(/^0+/, '');
		if (inputValue === '' || inputValue[0] === '.') inputValue = 0 + inputValue;
		const maxAmount =
			collect_for_invoice && invoice_ids?.length === 1
				? _.find(data?.invoices, (invoice: any) => invoice?.id === invoice_ids[0])?.amount
				: data?.total_amount_due;
		const isValidNumber = /^(|\d+\.?\d{0,2}|\.\d{0,2})$/.test(inputValue);
		if (isValidNumber) {
			if (!inputValue.endsWith('.')) {
				const numericValue = Number(inputValue);
				if (!collect_for_invoice) {
					if (!payment_config?.enforce_order_total_check || numericValue <= maxAmount) {
						set_input_value(inputValue);
					}
				} else if (numericValue <= maxAmount) {
					set_input_value(inputValue);
				}
			} else {
				set_input_value(inputValue);
			}
		}
	};

	useEffect(() => {
		if (Number(input_value) === 0) set_use_credit(false);
		set_payment_email_payload((prev: any) => ({
			...prev,
			input_value,
		}));
	}, [input_value]);

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>{t('Common.CollectPaymentDrawer.CollectPayment')}</CustomText>
				<Icon iconName='IconX' sx={{ cursor: 'pointer' }} onClick={close} />
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Grid
					display={'flex'}
					justifyContent={'space-between'}
					alignItems={'center'}
					width={'50%'}
					height={36}
					px={0.8}
					py={0.6}
					sx={{ background: theme?.payments?.collect_payment?.footer?.background, borderRadius: '8px' }}>
					<CustomText type='H3'>{t('Common.CollectPaymentDrawer.Charge')}</CustomText>
					<CustomText type='H3' color={theme?.payments?.collect_payment?.footer?.text}>
						{get_formatted_price_with_currency(currency, (Number(input_value) - Number(credits_used)).toString())}
					</CustomText>
				</Grid>
				<Button disabled={disabled} loading={is_button_loading} onClick={handle_next_click} sx={{ padding: '5px 24px' }}>
					{use_credit && Number(input_value) === credits_used
						? t('Common.CollectPaymentDrawer.UseCredits')
						: active === 'card' || active === 'terminal'
						? t('Common.CollectPaymentDrawer.Charge')
						: active === 'payment_link'
						? t('Payment.SendLink')
						: t('Payment.Save')}
				</Button>
			</Grid>
		);
	};

	const Tabs = () => {
		return (
			<Grid display='flex' direction='column' gap={2.4}>
				<CustomText type='Title'>{t('Common.CollectPaymentDrawer.SelectPaymentMethod')}</CustomText>
				<Grid container display={'flex'} gap={0.7}>
					{_.map(payment_config?.collect_payment_methods, (value, key) => {
						if (
							value.key === 'card' &&
							saved_payment_methods?.length === 0 &&
							!_.find(user_permissions, { slug: 'add_payment_method' })?.toggle
						)
							return <></>;
						return (
							<Can
								I={
									value.key === 'card'
										? PERMISSIONS.collect_payment_card.slug
										: value.key === 'payment_link'
										? PERMISSIONS.collect_payment_link.slug
										: value.key === 'terminal'
										? PERMISSIONS.collect_payment_pos.slug
										: PERMISSIONS.collect_payment_offline.slug
								}
								a={PERMISSIONS.collect_payment_credits.permissionType}>
								<Grid
									item
									display='flex'
									direction='column'
									justifyContent='center'
									alignItems='center'
									border={theme?.payments?.collect_payment?.tabs?.[key === active ? 'border_active' : 'border_inactive']}
									borderRadius={'12px'}
									p={0.8}
									gap={0.8}
									key={key}
									onClick={() => {
										if (active !== key) set_attributes({});
										set_active(key);
									}}
									width='49%'
									sx={{
										cursor: 'pointer',
										background: theme?.payments?.collect_payment?.tabs?.[key === active ? 'background_active' : 'background_inactive'],
										boxShadow: theme?.payments?.collect_payment?.tabs?.[key === active ? 'boxshadow_active' : 'boxshadow_inactive'],
									}}>
									<Icon
										iconName={
											value.key === 'card'
												? 'IconCreditCard'
												: value.key === 'payment_link'
												? 'IconLink'
												: value.key === 'terminal'
												? 'IconClick'
												: 'IconReplace'
										}
										sx={{ cursor: 'pointer' }}
										color={theme?.payments?.collect_payment?.tabs?.[key === active ? 'icon_active' : 'icon_inactive']}
									/>
									<CustomText type={key === active ? 'Subtitle' : 'Body'}>{value?.label}</CustomText>
								</Grid>
							</Can>
						);
					})}
				</Grid>
			</Grid>
		);
	};

	const handle_add_click = () => {
		set_is_payment_modal_visible(true);
		close();
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<Grid
					display={'flex'}
					justifyContent={'space-between'}
					sx={{ background: theme?.payments?.collect_payment?.content?.background, borderRadius: '12px', padding: '12px 16px' }}>
					<CustomText type='H3'>{t('Common.CollectPaymentDrawer.AmountDue')}</CustomText>
					<CustomText type='H3'>{get_formatted_price_with_currency(currency, data?.total_amount_due)}</CustomText>
				</Grid>

				{payment_config?.accept_payment_against_invoice_only && data?.invoices?.length === 0 ? (
					<Grid display='flex' direction='column' height='100%'>
						<CustomText type='H6' color={theme?.payments?.collect_payment?.content?.text}>
							{t('Common.CollectPaymentDrawer.NoInvoicesAvailable')}
						</CustomText>
						<Grid display='flex' direction='column' flex={1} justifyContent='center' alignItems='center'>
							<Image src={ImageLinks.advance_payment} width={200} height={200}></Image>
							<Can I={PERMISSIONS.credit_top_up.slug} a={PERMISSIONS.credit_top_up.permissionType}>
								<Button onClick={handle_add_credits}>{t('Common.CollectPaymentDrawer.AddCredits')}</Button>
							</Can>
						</Grid>
					</Grid>
				) : (
					<Grid display='flex' direction='column' gap={2.4} height={'100%'}>
						{!payment_config?.accept_payment_against_invoice_only && data?.invoices?.length > 0 && (
							<Grid display={'flex'} alignItems={'center'}>
								<Checkbox
									name='invoice'
									key='invoice'
									checked={collect_for_invoice}
									onChange={() => set_collect_for_invoice((prev: boolean) => !prev)}
								/>
								<CustomText type='Title'>{t('Common.CollectPaymentDrawer.CollectAgainstInvoice')}</CustomText>
							</Grid>
						)}

						{collect_for_invoice && (
							<Invoices set_invoice_ids={set_invoice_ids} data={data?.invoices} set_input_value={set_input_value} currency={currency} />
						)}

						<TextField
							InputProps={{
								startAdornment: <InputAdornment position='start'>{get_currency(currency)}</InputAdornment>,
							}}
							onChange={handleInputChange}
							label={'Amount to be collected'}
							name={'Amount to be collected'}
							value={input_value}
							disabled={collect_for_invoice && invoice_ids?.length !== 1}
							fullWidth
						/>

						<hr></hr>

						{Tabs()}

						{active === 'card' && (
							<Grid pl={0.1} mt={-2.4} sx={{ paddingLeft: '1rem' }}>
								{saved_payment_methods?.length > 0 && (
									<SavedCardListing
										section_heading={t('Payment.AvailableCards')}
										default_payment_id={selected_payment_method_id}
										saved_payment_methods={saved_payment_methods}
										update_selected_payment_method={set_selected_payment_method_id}
									/>
								)}
								<Can I={PERMISSIONS.add_payment.slug} a={PERMISSIONS.add_payment.permissionType}>
									<Grid display='flex' alignItems='center' className={classes.handle_add_card} onClick={handle_add_click}>
										<Icon
											color={theme?.payments?.collect_payment?.content?.card?.icon_color}
											sx={{ marginLeft: '-0.5rem' }}
											iconName='IconPlus'
										/>
										<CustomText type='Subtitle' children='Add card' color={theme?.payments?.collect_payment?.content?.card?.icon_color} />
									</Grid>
								</Can>
							</Grid>
						)}
						{active === 'payment_link' && <PaymentLink set_email_data={set_email_data} email_data={email_data} />}
						{active === 'manual' && (
							<MarkAsPaid set_attributes={set_attributes} fields={payment_config?.collect_payment_methods?.manual?.attributes} />
						)}
						{active === 'terminal' && (
							<PosPayment set_attributes={set_attributes} field={payment_config?.collect_payment_methods?.terminal?.attributes} />
						)}
						<Can I={PERMISSIONS.collect_payment_credits.slug} a={PERMISSIONS.collect_payment_credits.permissionType}>
							{data?.wallet_balance > 0 && (
								<Grid
									display='flex'
									direction='column'
									sx={{
										background: theme?.payments?.collect_payment?.content?.credits?.background,
										borderRadius: '12px',
										padding: '12px 16px',
										marginTop: 'auto',
									}}>
									<Grid display='flex' flex={1} justifyContent='space-between' alignItems='center'>
										<Grid display='flex' alignItems='center'>
											<Checkbox
												name='use_credit'
												key='use_credit'
												disabled={Number(input_value) === 0 || data?.wallet_balance === 0}
												checked={use_credit}
												onChange={() => set_use_credit((prev: boolean) => !prev)}
											/>
											<CustomText type='Title'>{t('Common.CollectPaymentDrawer.UseAvailableCredits')}</CustomText>
										</Grid>
										<CustomText type='H3'>{get_formatted_price_with_currency(currency, data?.wallet_balance)}</CustomText>
									</Grid>
									{credits_used > 0 && (
										<Grid display='flex' justifyContent='space-between' ml={4.8}>
											<CustomText type='Title'>{t('Common.CollectPaymentDrawer.CreditsUsed')}</CustomText>
											<CustomText type='Title'>{get_formatted_price_with_currency(currency, credits_used)}</CustomText>
										</Grid>
									)}
								</Grid>
							)}
						</Can>
					</Grid>
				)}
			</Grid>
		);
	};

	const handle_render_drawer = () => {
		return (
			<Grid className='drawer-container'>
				{handle_render_header()}
				<Divider className='drawer-divider' />
				{handle_render_drawer_content()}
				{!(payment_config?.accept_payment_against_invoice_only && data?.invoices?.length === 0) && (
					<Grid>
						<Divider sx={{ width: 'calc(100% + 40px)', margin: '0 0 16px -20px' }} />
						{handle_render_footer()}
					</Grid>
				)}
			</Grid>
		);
	};

	return <Drawer width={480} open={is_visible} onClose={close} content={is_loading ? <CollectDrawerSkeleton /> : handle_render_drawer()} />;
};

const CollectPaymentDrawer = (props: any) => {
	const { is_visible } = props;
	if (!is_visible) {
		return null;
	}
	return <CollectPaymentComp {...props} />;
};

export default CollectPaymentDrawer;
