/* eslint-disable*/
import { Divider, InputAdornment, TextField } from '@mui/material';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Avatar, Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import SavedCardListing from 'src/common/@the-source/molecules/SavedCardListing';
import api_requests from 'src/utils/api_requests';
import { t } from 'i18next';
import { makeStyles } from '@mui/styles';
import { PERMISSIONS } from 'src/casl/permissions';
import Can from 'src/casl/Can';
import MarkAsPaid from 'src/screens/OrderManagement/component/Common/MarkAsPaid';
import PosPayment from 'src/screens/OrderManagement/component/Common/PosPayment';
import PaymentLink from 'src/screens/OrderManagement/component/Common/PaymentLink';
import CollectDrawerSkeleton from 'src/screens/OrderManagement/component/Drawer/CollectDrawerSkeleton';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { AddCreditsDrawerProps } from '../interfaces';
import order_management from 'src/utils/api_requests/orderManagment';
import { get_currency, get_formatted_price_with_currency } from 'src/utils/common';

const useStyles = makeStyles(() => ({
	handle_add_card: {
		marginTop: '2.4rem',
		cursor: 'pointer',
	},
}));

const AddCreditsComp = ({
	is_visible,
	close,
	set_is_payment_modal_visible,
	payment_config,
	set_customer_id,
	buyer_id = '',
	document_id = '',
	set_data,
	active,
	set_attributes,
	selected_payment_method_id,
	data,
	set_saved_payment_methods,
	set_selected_payment_method_id,
	input_value,
	set_input_value,
	attributes,
	is_button_loading,
	saved_payment_methods,
	set_active,
	set_order_info,
	order_info,
	from = '',
	handle_add_credit,
	set_payment_email_modal,
	set_payment_email_payload,
	set_is_modal_open,
	set_email_data,
	set_email_checkbox,
	email_data,
	currency,
}: AddCreditsDrawerProps) => {
	const [disabled, set_disabled] = useState<boolean>(false);
	const user_permissions = useSelector((state: any) => state?.login?.permissions);
	const classes = useStyles();
	const theme: any = useTheme();
	const [is_loading, set_is_loading] = useState<boolean>(true);
	const email_config_payload = {
		entity: 'payment',
		action: 'payment_success',
		buyer_id,
		additional_info: {
			payment_entity: 'buyer',
		},
	};

	const get_config = () => {
		api_requests.order_management
			.get_payment_details({ buyer_id, document_id, payment_entity: 'buyer' })
			.then((res: any) => {
				if (res?.status === 200) {
					set_data(res);
					set_customer_id(res?.customer_id);
				}
			})
			.catch((err: any) => {
				console.error(err);
			})
			.finally(() => {
				set_is_loading(false);
			});
	};

	useEffect(() => {
		get_config();
		set_email_data([]);
	}, []);

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
		if (active === 'card') set_attributes({ payment_method_id: selected_payment_method_id });
		else if (active === 'payment_link') {
			get_email_config_info({ ...email_config_payload, action: 'payment_link' });
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

	const handle_next_click = () => {
		if (active === 'payment_link') {
			handle_add_credit();
			close();
		} else if (from === 'buyer_dashboard') {
			close();
			set_is_modal_open(true);
		} else {
			close();
			set_payment_email_payload &&
				set_payment_email_payload({
					payment_type: 'payment_success',
					input_value,
					payload: email_config_payload,
					drawer_type: 'add_credit',
				});
			set_payment_email_modal && set_payment_email_modal(true);
		}
	};

	useEffect(() => {
		const temp = check_charge_disabled();
		set_disabled(temp);
	}, [active, input_value, attributes, selected_payment_method_id, email_data]);

	const handleInputChange = (event: any) => {
		let inputValue = event.target.value.replace(/^0+/, '');
		if (inputValue === '' || inputValue[0] === '.') inputValue = 0 + inputValue;
		const isValidNumber = /^(|\d+\.?\d{0,2}|\.\d{0,2})$/.test(inputValue);
		if (isValidNumber) {
			if (!inputValue.endsWith('.')) {
				set_input_value(inputValue);
			} else {
				set_input_value(inputValue);
			}
		}
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>{t('Common.CollectPaymentDrawer.AddCredits')}</CustomText>
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
					sx={{ background: theme?.payments?.add_credits?.footer?.background, borderRadius: '8px' }}>
					<CustomText type='H3'>{t('Common.CollectPaymentDrawer.Charge')}</CustomText>
					<CustomText type='H3' color={theme?.payments?.add_credits?.footer?.text}>
						{get_formatted_price_with_currency(currency, input_value)}
					</CustomText>
				</Grid>
				<Button disabled={disabled} loading={is_button_loading} onClick={handle_next_click} sx={{ padding: '10px 24px' }}>
					{active === 'card' || active === 'terminal'
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
									border={theme?.payments?.add_credits?.tabs?.[key === active ? 'border_active' : 'border_inactive']}
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
										background: theme?.payments?.add_credits?.tabs?.[key === active ? 'background_active' : 'background_inactive'],
										boxShadow: theme?.payments?.add_credits?.tabs?.[key === active ? 'boxshadow_active' : 'boxshadow_inactive'],
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
										color={theme?.payments?.add_credits?.tabs?.[key === active ? 'icon_active' : 'icon_inactive']}
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

	const check_permission = (paymentPermissions: string[] = []) => {
		return paymentPermissions.some((permission) => _.find(user_permissions, { slug: permission })?.toggle);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<Grid
					borderRadius={1.2}
					sx={{ background: theme?.payments?.add_credits?.content?.background }}
					display='flex'
					direction='column'
					p={2.4}
					gap={2.4}>
					<Grid display='flex' gap={2} alignItems='center'>
						<Avatar
							variant='circular'
							backgroundColor={theme?.payments?.add_credits?.content?.avatar?.background}
							color={theme?.payments?.add_credits?.content?.avatar?.color}
							size='large'
							style={{
								padding: 4,
							}}
							isImageAvatar={false}
							content={
								<CustomText type='H2' color={theme?.payments?.add_credits?.content?.avatar?.text}>
									{_(data?.buyer_display_name || '- -')
										.split(' ')
										.map((part) => part.charAt(0))
										.join('')
										.toUpperCase()}
								</CustomText>
							}
						/>
						<Grid>
							<CustomText type='H6'>{data?.buyer_display_name || '--'}</CustomText>
							<CustomText color={theme?.payments?.add_credits?.content?.text}>
								{!_.isEmpty(data?.buyer_address) ? `${data.buyer_address?.state} ${data.buyer_address?.country}` : '--'}
							</CustomText>
						</Grid>
					</Grid>
					{check_permission(['wallet_view']) && (
						<Grid display='flex' justifyContent='space-between'>
							<CustomText type='Subtitle'>{t('OrderManagement.CartCheckoutCard.AvailableCredits')}</CustomText>
							<CustomText type='Subtitle'>{get_formatted_price_with_currency(currency, data?.wallet_balance)}</CustomText>
						</Grid>
					)}
				</Grid>

				<TextField
					InputProps={{
						startAdornment: <InputAdornment position='start'>{get_currency(currency)}</InputAdornment>,
					}}
					onChange={handleInputChange}
					label='Amount to be collected'
					name='Amount to be collected'
					value={input_value}
					fullWidth
				/>

				<TextField onChange={(e) => set_order_info(e.target.value)} label='Order Info' name='Order Info' value={order_info} fullWidth />

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
								<Icon color={theme?.payments?.add_credits?.content?.card?.icon_color} sx={{ marginLeft: '-0.5rem' }} iconName='IconPlus' />
								<CustomText type='Subtitle' children='Add card' color={theme?.payments?.add_credits?.content?.card?.text_color} />
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
			</Grid>
		);
	};

	const handle_render_drawer = () => {
		return (
			<Grid className='drawer-container'>
				{handle_render_header()}
				<Divider className='drawer-divider' />
				{handle_render_drawer_content()}
				<Divider className='drawer-divider' />
				{handle_render_footer()}
			</Grid>
		);
	};

	return <Drawer width={480} open={is_visible} onClose={close} content={is_loading ? <CollectDrawerSkeleton /> : handle_render_drawer()} />;
};

const AddCreditsDrawer = (props: any) => {
	const { is_visible } = props;
	if (!is_visible) {
		return null;
	}
	return <AddCreditsComp {...props} />;
};

export default AddCreditsDrawer;
