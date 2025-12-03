import React, { useEffect } from 'react';
import { Avatar, Box, Grid, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import isEmpty from 'lodash/isEmpty';
import capitalize from 'lodash/capitalize';
import size from 'lodash/size';
import map from 'lodash/map';
import filter from 'lodash/filter';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { useTheme } from '@mui/material';
import RenderOrderDetails from './RenderOrderDetails';
import RenderInvoiceDetails from './RenderInvoiceDetails';
import useStyles from '../styles';
import { useSelector } from 'react-redux';
import { get_currency, get_formatted_price_with_currency } from 'src/utils/common';
import PaymentMethods from './PaymentMethods';
import InputField from 'src/common/@the-source/atoms/Input';
import constants from '../constants';
import RefundForm from './RefundForm';
import { useNavigate } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import { PERMISSIONS } from 'src/casl/permissions';
import Can from 'src/casl/Can';
import AuthorizeForm from './AuthorizeForm';
import _ from 'lodash';
import SubscriptionForm from './SubscriptionForm';
import { colors } from 'src/utils/theme';
import { secondary } from 'src/utils/light.theme';

interface Props {
	form_data: any;
	form_section: any;
	order_flow: boolean | any;
	buyer_flow: boolean | any;
	show_invoice: boolean;
	set_show_invoice: (val: boolean) => any;
	checked_invoice: any;
	set_checked_invoice: (val: any) => any;
	methods: any;
	payment_config: any;
	payment_method_data: any;
	set_payment_method_attrs: any;
	email_data: any;
	set_email_data: any;
	set_email_checkbox: any;
	get_email_config_info?: any;
	set_show_buyer_panel: (val: boolean) => any;
	buyer_data: any;
	set_buyer_data: (val: any) => any;
	set_selected_payment_method_type: (val: any) => any;
	set_payment_method_data: (val: any) => any;
	handle_get_payment_charges: () => void;
	selected_radio_btn: any;
	payment_ids: any;
	set_payment_ids: any;
	input_value: any;
	set_input_value: any;
	set_form_data: any;
	is_direct_payment_refund: boolean;
	is_direct_flow: boolean;
	is_buyer_payment: boolean;
	handle_get_buyer_payment_details: any;
	has_both_collect_payment_permission: boolean;
	all_addresses: any[];
	added_card_id: any;
	set_added_card_id: (id: any) => any;
	set_is_authorized: (val: boolean) => void;
	set_success_toast: any;
	edit_form_details: any;
	has_void_authorization_permission: boolean;
	is_refund_flow?: boolean;
	set_ach_modal: (val: boolean) => any;
	ach_modal: boolean;
	set_selected_opt: (val: any) => void;
	selected_opt: any;
	open_drawer: boolean;
	set_open_drawer: (val: boolean) => void;
	create_recurring_payment_schedule: any;
	schedule_loading: boolean;
	subscription_data: any;
	set_selected_payment_method_id: any;
	selected_payment_method_id: string;
	set_subscription_data: any;
}

const RenderPaymentForm = ({
	form_data,
	form_section,
	buyer_flow,
	order_flow,
	set_show_invoice,
	show_invoice,
	checked_invoice,
	set_checked_invoice,
	methods,
	payment_config,
	payment_method_data,
	set_payment_method_attrs,
	email_data,
	set_email_data,
	set_email_checkbox,
	get_email_config_info,
	set_show_buyer_panel,
	buyer_data,
	set_buyer_data,
	set_selected_payment_method_type,
	set_payment_method_data,
	handle_get_payment_charges,
	selected_radio_btn,
	payment_ids,
	set_payment_ids,
	input_value,
	set_input_value,
	set_form_data,
	is_direct_payment_refund,
	is_direct_flow,
	is_buyer_payment,
	handle_get_buyer_payment_details,
	has_both_collect_payment_permission,
	all_addresses,
	added_card_id,
	set_added_card_id,
	set_is_authorized,
	set_success_toast,
	edit_form_details,
	has_void_authorization_permission,
	is_refund_flow,
	set_ach_modal,
	ach_modal,
	set_selected_opt,
	selected_opt,
	open_drawer,
	set_open_drawer,
	create_recurring_payment_schedule,
	schedule_loading,
	subscription_data,
	set_selected_payment_method_id,
	selected_payment_method_id,
	set_subscription_data,
}: Props) => {
	const currency = useSelector((state: any) => state?.settings?.currency);
	const classes = useStyles();
	const navigate = useNavigate();
	const show_payment_method_fields = order_flow || buyer_flow || !isEmpty(buyer_data);
	const is_authorization_flow = selected_radio_btn?.value === 'authorize';
	const { reset, setValue } = methods;
	const theme: any = useTheme();
	const payment_footer = document?.getElementById('payment_footer');

	useEffect(() => {
		if (is_direct_payment_refund && form_data?.buyer_display_name) {
			setValue('buyer_info', form_data?.buyer_display_name);
		}
	}, [is_direct_payment_refund, form_data]);

	const handle_remove_buyer = () => {
		set_buyer_data({});
		set_payment_method_data({});
		reset();
		set_form_data({});
		set_added_card_id(null);
		set_subscription_data((prev: any) => ({ ...prev, schedule_payment: {} }));

		if (is_buyer_payment) {
			navigate(RouteNames.payment.direct_payment.path, { replace: true });
		}
		if (is_authorization_flow) {
			set_input_value(0);
		}
	};

	const handle_get_style = (type: string) => {
		switch (type) {
			case 'text':
				return {
					fontSize: '16px',
					height: 'auto',
					'& .MuiOutlinedInput-root': {
						height: '48px',
					},
				};

			case 'amount':
				return {
					fontSize: '14px',
					padding: '8px 12px 8px 0px',
					height: '30px',
					'& .MuiInputBase-root': {
						padding: '8px 12px 8px 0px',
					},
					'& .MuiOutlinedInput-root': {
						height: '30px',
					},
				};
			default:
				return {};
		}
	};

	const get_styles = (key: string) => {
		if (key === 'order_invoice_amount') {
			return {
				background: '#F7F8FA',
				padding: '8px 12px',
				borderRadius: '12px',
			};
		}
		return {};
	};

	//render common form
	const handle_render_form = (section: any, key?: string) => {
		const name = key ? `${key}.${section?.id}` : section?.id;
		const type = section?.type === 'number' && key === 'transaction_summary' ? 'amount' : section?.type;

		const order_amount = section?.id === 'order_invoice_amount';
		const total_amount_due = form_data?.total_amount_due;

		const get_default_value = () => {
			if (order_amount) {
				if (parseFloat(total_amount_due) === 0) {
					return 0;
				}
				return total_amount_due || 0;
			}
			return section?.value;
		};

		return (
			<FormBuilder
				name={name}
				options={section?.options}
				label={section?.label}
				show_asterisk={false}
				placeholder={section?.placeholder}
				enable_capitalization={section?.id !== 'tracking_link'}
				style={handle_get_style(type)}
				validations={{
					required: Boolean(section?.required),
					email: section?.type === 'email',
					...section?.validations,
				}}
				inputProps={{
					autoComplete: 'off',
				}}
				InputProps={
					key === 'transaction_summary' && {
						style: {
							backgroundColor: colors.white,
						},
						startAdornment: (
							<Grid color={secondary[900]} pr={1.25}>
								{key === 'transaction_summary' && get_currency(currency)}
							</Grid>
						),
					}
				}
				start_icon={key === 'transaction_summary' && get_currency(currency)}
				defaultValue={get_default_value()}
				type={type}
				disabled={is_direct_payment_refund}
			/>
		);
	};

	//customer form
	const handle_render_selected_customer = (_buyer_data: any) => {
		const buyer_name = _buyer_data?.buyer_display_name || _buyer_data?.buyer_name;
		const location_key = _buyer_data?.buyer_address || _buyer_data;
		const buyer_location =
			_buyer_data?.location || `${location_key?.city || ''} ${location_key?.country ? capitalize(location_key?.country) : ''}`.trim();

		const _buyer_name = _(buyer_name)
			.split(' ')
			.map((part) => part.charAt(0))
			.slice(0, 2)
			.join('')
			.toUpperCase();

		return (
			<Grid display='flex' justifyContent='space-between' className={classes.customer_details_section}>
				<Grid display='flex' gap={1}>
					<Avatar
						variant='circular'
						size='large'
						className={classes.avatar}
						isImageAvatar={false}
						content={
							<CustomText type='H3' color={theme?.payments?.warning}>
								{_buyer_name || ''}
							</CustomText>
						}
					/>
					<Box display='flex' flexDirection='column' justifyContent='center' gap={0.8}>
						<CustomText type='Subtitle'>{buyer_name}</CustomText>

						<CustomText color={theme?.payments?.grey_700} type='Caption'>
							{isEmpty(buyer_location) ? 'No location added' : buyer_location}
						</CustomText>
					</Box>
				</Grid>

				{!buyer_flow && !order_flow && <Icon className={classes.icon_style} iconName='IconX' onClick={handle_remove_buyer} />}
			</Grid>
		);
	};

	const handle_render_search_customer_field = (field: any, index: number, show_divider: boolean) => {
		return (
			<Grid key={field?.name}>
				<InputField
					label={field?.label}
					placeholder={field?.placeholder}
					variant='outlined'
					id={field?.name}
					sx={{
						width: '100%',
						pointerEvents: 'auto',
						cursor: 'pointer',
						'& .MuiOutlinedInput-root': {
							height: '48px',
						},
					}}
					InputProps={{
						startAdornment: <Icon iconName='IconUser' color={theme?.payments?.grey_500} sx={{ mr: 1 }} />,
						endAdornment: <Icon iconName='IconSearch' color={theme?.payments?.grey_500} />,
						readOnly: true,
						sx: {
							pointerEvents: 'none',
							color: theme?.payments?.black,
						},
					}}
					onClick={() => {
						set_show_buyer_panel(true);
					}}
					children={null}></InputField>
				{index === 0 && show_divider && has_both_collect_payment_permission && (
					<React.Fragment>
						<Grid display='flex' alignItems='center' justifyContent='center' my={1.5}>
							<hr style={{ width: '20%' }} />
							<CustomText type='Subtitle' style={{ margin: '0 24px' }}>
								OR
							</CustomText>
							<hr style={{ width: '20%' }} />
						</Grid>
					</React.Fragment>
				)}
			</Grid>
		);
	};

	const handle_render_customer_field = (attributes: any) => {
		const show_divider = size(attributes) !== 1;
		return map(attributes, (field, index: number) => {
			if (field?.name === 'search_customer') {
				if (is_refund_flow || is_authorization_flow) {
					return handle_render_search_customer_field(field, index, show_divider);
				} else {
					return (
						<Can I={PERMISSIONS.customer_pay.slug} a={PERMISSIONS.customer_pay.permissionType}>
							{handle_render_search_customer_field(field, index, show_divider)}
						</Can>
					);
				}
			}

			return (
				<Can I={PERMISSIONS.direct_payment.slug} a={PERMISSIONS.direct_payment.permissionType}>
					<Grid key={field?.name}>{handle_render_form(field)}</Grid>
				</Can>
			);
		});
	};

	//render form field content
	const handle_render_field_content = (item: any, key: string) => {
		switch (key) {
			case 'transaction_summary':
				return (
					<Grid display='flex' alignItems='center' gap={1} xs={6} sm={6} md={6} lg={6} xl={6}>
						{handle_render_form(item, key)}
					</Grid>
				);
			case 'notes':
				return (
					<Grid display='flex' alignItems='center' xs={12} sm={12} md={12} lg={12} xl={12}>
						{handle_render_form(item, key)}
					</Grid>
				);
			default:
				return (
					<Grid display='flex' alignItems='center' xs={6} sm={6} md={6} lg={6} xl={6}>
						{handle_render_form(item, key)}
					</Grid>
				);
		}
	};

	//render form field
	const handle_render_fields = (attributes: any, key: string) => {
		return map(attributes, (item: any) => {
			const order_amount = item?.id === 'order_invoice_amount';

			return (
				<Grid container my={1} key={item?.id} alignItems='center' justifyContent='space-between' style={get_styles(item?.id)}>
					{key !== 'notes' && (
						<CustomText type='Body' key={item.id}>
							{order_amount ? (
								<React.Fragment>
									{item?.name}
									<span style={{ color: 'red' }}>*</span>
								</React.Fragment>
							) : (
								item?.name
							)}
						</CustomText>
					)}

					{handle_render_field_content(item, key)}
				</Grid>
			);
		});
	};

	//render form section
	const handle_render_sections = (sections: any) => {
		const total_charge = handle_get_payment_charges();
		return map(sections, (section) => {
			const render_section_content = () => {
				switch (section?.key) {
					case 'customer_details':
						const _buyer_data = buyer_flow || order_flow ? form_data : buyer_data;
						if (buyer_flow || order_flow || !isEmpty(buyer_data)) {
							return handle_render_selected_customer(_buyer_data);
						}
						return handle_render_customer_field(section?.attributes);

					case 'transaction_summary':
						return (
							<React.Fragment>
								{order_flow && <RenderOrderDetails data={form_data} currency={currency} />}
								{order_flow && !payment_config?.accept_payment_against_invoice_only && form_data?.invoices?.length > 0 && (
									<RenderInvoiceDetails
										data={form_data}
										currency={currency}
										set_show_invoice={set_show_invoice}
										show_invoice={show_invoice}
										set_checked_invoice={set_checked_invoice}
										checked_invoice={checked_invoice}
										methods={methods}
									/>
								)}
								{handle_render_fields(section?.attributes, section?.key)}
								<Grid className={classes.total_card}>
									<CustomText type='Subtitle'>Total amount</CustomText>
									<CustomText type='Subtitle'>{get_formatted_price_with_currency(currency, total_charge)}</CustomText>
								</Grid>
							</React.Fragment>
						);
					case 'payment_method':
						return (
							<PaymentMethods
								payment_config={payment_config}
								payment_method_data={payment_method_data}
								set_payment_method_attrs={set_payment_method_attrs}
								email_data={email_data}
								set_success_toast={set_success_toast}
								set_email_data={set_email_data}
								set_email_checkbox={set_email_checkbox}
								get_email_config_info={get_email_config_info}
								set_selected_payment_method_type={set_selected_payment_method_type}
								methods={methods}
								buyer_data={buyer_data}
								ach_modal={ach_modal}
								buyer_flow={buyer_flow}
								order_flow={order_flow}
								form_data={form_data}
								show_select_payment_method={selected_radio_btn?.value !== 'subscription'}
								handle_get_buyer_payment_details={handle_get_buyer_payment_details}
								set_payment_method_data={set_payment_method_data}
								all_addresses={all_addresses}
								added_card_id={added_card_id}
								set_added_card_id={set_added_card_id}
								set_ach_modal={set_ach_modal}
								set_is_authorized={set_is_authorized}
								set_selected_opt={set_selected_opt}
								selected_opt={selected_opt}
								set_selected_payment_method_id={set_selected_payment_method_id}
								selected_payment_method_id={selected_payment_method_id}
							/>
						);
					case 'payment_details':
						return (
							<SubscriptionForm
								attributes={section?.attributes}
								methods={methods}
								open_drawer={open_drawer}
								set_open_drawer={set_open_drawer}
								create_recurring_payment_schedule={create_recurring_payment_schedule}
								schedule_loading={schedule_loading}
								schedule_payment_data={subscription_data?.schedule_payment}
								payment_method_data={payment_method_data}
								selected_payment_method_id={selected_payment_method_id}
							/>
						);
					default:
						return <React.Fragment>{handle_render_fields(section?.attributes, section?.key)}</React.Fragment>;
				}
			};

			if ((is_direct_flow || !show_payment_method_fields) && section?.key === 'payment_method') {
				return;
			}

			return (
				<Grid className={classes.container} key={section?.key}>
					<CustomText type='H3' style={{ marginBottom: section?.key === 'customer_details' ? 12 : 16 }}>
						{section?.name}
						{(section?.key === 'payment_method' || section?.key === 'payment_details') && <span style={{ color: 'red' }}>*</span>}
					</CustomText>
					{render_section_content()}
				</Grid>
			);
		});
	};

	const render_content_by_type = () => {
		const selected_action = selected_radio_btn?.value;
		switch (selected_action) {
			case 'refund':
				const customer_details_section = [
					{
						...constants.customer_details,
						attributes: filter(constants.customer_details?.attributes, (attr) =>
							(is_direct_payment_refund ? attr.id !== 'search_customer' : attr.id !== 'buyer_info'),
						),
					},
				];
				return (
					<>
						{handle_render_sections(customer_details_section)}
						{!isEmpty(form_data) && (
							<RefundForm
								form_data={form_data}
								methods={methods}
								payment_ids={payment_ids}
								set_payment_ids={set_payment_ids}
								input_value={input_value}
								set_input_value={set_input_value}
								is_order_flow={order_flow}
								is_direct_payment_refund={is_direct_payment_refund}
							/>
						)}
					</>
				);
			case 'authorize':
				const customer_detail_section = [
					{
						...constants.customer_details,
						attributes: filter(constants.customer_details?.attributes, (attr) => attr.id !== 'buyer_info'),
					},
				];
				return (
					<>
						{handle_render_sections(customer_detail_section)}
						{!isEmpty(form_data) && (
							<AuthorizeForm
								form_data={form_data}
								buyer_data={buyer_data}
								input_value={input_value}
								set_input_value={set_input_value}
								set_toast={set_success_toast}
								payment_method_data={payment_method_data}
								all_addresses={all_addresses}
								payment_config={payment_config}
								set_payment_method_data={set_payment_method_data}
								set_payment_method_attrs={set_payment_method_attrs}
								edit_form_details={edit_form_details}
								has_void_authorization_permission={has_void_authorization_permission}
							/>
						)}
					</>
				);
			case 'subscription':
				const customer_section = [
					{
						...constants.customer_details,
						attributes: filter(constants.customer_details?.attributes, (attr) => attr.id !== 'buyer_info'),
					},
				];

				return (
					<React.Fragment>
						{handle_render_sections(customer_section)}
						{!isEmpty(buyer_data) && handle_render_sections([subscription_data?.form_section, constants.payment_method])}
					</React.Fragment>
				);
			default:
				return handle_render_sections(form_section?.sections);
		}
	};

	return (
		<Grid display='flex' flexDirection='column' gap={2} mb={`${payment_footer?.scrollHeight}px` || 10}>
			{render_content_by_type()}
		</Grid>
	);
};

export default RenderPaymentForm;
