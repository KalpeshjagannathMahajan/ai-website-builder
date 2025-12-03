/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useMemo } from 'react';
import { FormProvider, Control } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { filter, find, flatten, get, indexOf, isEmpty, keys, map, split, values, head } from 'lodash';
import Can from 'src/casl/Can';
import { PERMISSIONS } from 'src/casl/permissions';
import { Box, Icon, Grid } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import SavedCardListing from 'src/common/@the-source/molecules/SavedCardListing';
import MarkAsPaid from 'src/screens/OrderManagement/component/Common/MarkAsPaid';
import PosPayment from 'src/screens/OrderManagement/component/Common/PosPayment';
import PaymentLink2 from 'src/screens/OrderManagement/component/Common/PaymentLink';
import AddPaymentModal from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/Drawer/AddPaymentModal';
import { colors } from 'src/utils/theme';
import useStyles from '../styles';
import PAYMENT_CONSTANTS from '../constants';
import { check_permission } from 'src/utils/utils';
import { useSelector } from 'react-redux';
import AddAchPaymentModal from './AddAchPaymentModal';

interface PaymentMethodsProps {
	payment_config: any;
	payment_method_data: any;
	set_payment_method_attrs: any;
	email_data: any;
	set_email_data: any;
	set_email_checkbox: any;
	get_email_config_info: any;
	set_selected_payment_method_type: (val: any) => any;
	methods: any;
	buyer_flow: boolean;
	order_flow: boolean;
	form_data: any;
	buyer_data: any;
	all_addresses: any[];
	set_payment_method_data: (val: any) => void;
	handle_get_buyer_payment_details: (val?: boolean) => void;
	added_card_id: any;
	set_added_card_id: any;
	set_is_authorized: (val: boolean) => void;
	set_ach_modal: any;
	ach_modal: boolean;
	set_selected_opt: (val: any) => void;
	selected_opt: any;
	set_success_toast?: any;
	show_select_payment_method?: boolean;
	set_selected_payment_method_id: any;
	selected_payment_method_id: string;
}

interface PaymentMethodOption {
	label: string;
	value: string;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
	payment_config,
	payment_method_data,
	set_payment_method_attrs,
	email_data,
	set_email_data,
	set_email_checkbox,
	get_email_config_info,
	set_selected_payment_method_type,
	methods,
	buyer_flow,
	order_flow,
	ach_modal,
	form_data,
	buyer_data,
	set_payment_method_data,
	handle_get_buyer_payment_details,
	all_addresses,
	set_added_card_id,
	added_card_id,
	set_is_authorized,
	set_ach_modal,
	set_selected_opt,
	selected_opt,
	set_success_toast,
	show_select_payment_method = true,
	set_selected_payment_method_id,
	selected_payment_method_id,
}) => {
	const [options, set_options] = useState<PaymentMethodOption[]>([]);
	const [is_add_card_modal, set_is_add_card_modal_visible] = useState<boolean>(false);
	const { t } = useTranslation();
	const classes = useStyles();
	const { control, getValues, setValue, register } = methods;
	const { type, id } = useParams();
	const buyer_id = order_flow ? get(form_data, 'buyer_address.buyer_id') : buyer_flow ? id : get(buyer_data, 'id');
	const selected_option = !show_select_payment_method ? PAYMENT_CONSTANTS.method_types.card : getValues('payment_method_type');
	const is_direct_payment_flow = !buyer_id;

	const saved_bank_accounts_length = keys(payment_method_data?.saved_bank_accounts)?.length;

	const saved_payment_methods = useMemo(() => {
		const payment_method_key = PAYMENT_CONSTANTS.payment_method_data_keys?.[selected_option];
		const payment_method_key_data = payment_method_data?.[payment_method_key] || {};

		const payment_type =
			selected_option === PAYMENT_CONSTANTS.method_types.card ? PAYMENT_CONSTANTS.method_types.card : PAYMENT_CONSTANTS.method_types.ach;

		return filter(payment_method_key_data, (method: any) => method?.payment_method_type === payment_type);
	}, [payment_method_data, selected_option]);

	const permissions = useSelector((state: any) => state?.login?.permissions);

	const handle_close_add_card_modal = (res: any) => {
		set_is_add_card_modal_visible(false);
		if (!is_direct_payment_flow && !isEmpty(res)) {
			set_selected_opt({ mode: 'edit', type: PAYMENT_CONSTANTS.method_types.card });
			handle_get_buyer_payment_details(true);
		}
	};

	const handle_close_ach_modal = (res: any) => {
		if (!is_direct_payment_flow && !isEmpty(res)) {
			set_selected_opt({ mode: 'edit', type: PAYMENT_CONSTANTS.method_types.ach });
			handle_get_buyer_payment_details(true);
		}
		set_ach_modal(false);
	};

	const handle_payment_link_operations = async () => {
		try {
			const payload = {
				entity: 'payment',
				action: PAYMENT_CONSTANTS.method_types.payment_link,
				document_id: id,
				additional_info: {
					payment_entity: type,
				},
			};
			const config_response: any = await get_email_config_info(payload);
			set_email_data(config_response);
			set_email_checkbox(config_response?.is_auto_trigger);
		} catch (error) {
			console.error(error);
		}
	};

	const handle_update_added_cards = (key: string, value: any, data_key = 'saved_payment_methods') => {
		const key_parts = split(key, '.');
		const saved_index = indexOf(key_parts, data_key);
		if (saved_index !== -1 && saved_index + 1 < key_parts.length) {
			const method_id = key_parts?.[saved_index + 1];
			if (method_id) {
				set_payment_method_data((prevData: any) => ({
					...prevData,
					[data_key]: {
						...prevData?.[data_key],
						[method_id]: {
							...(prevData?.[method_id] || {}),
							...value,
						},
					},
				}));
				set_added_card_id((prev: any) => ({ ...prev, [selected_option]: method_id }));
			}
		}
	};

	useEffect(() => {
		const selected = filter(saved_payment_methods, (value: any) => value.payment_method_type === selected_option);
		const assigned_payment_method = find(selected, (method: any) => method.is_selected);
		const default_payment_method = find(selected, (method: any) => method.is_default);
		const random_payment_method = find(selected, () => true);
		set_selected_payment_method_id(
			added_card_id?.[selected_option] ||
				assigned_payment_method?.payment_method_id ||
				default_payment_method?.payment_method_id ||
				random_payment_method?.payment_method_id ||
				'',
		);
	}, [saved_payment_methods, selected_option]);

	useEffect(() => {
		if (isEmpty(payment_config?.collect_payment_methods)) return;

		const payment_method_options: PaymentMethodOption[] = map(keys(payment_config.collect_payment_methods), (methodKey) => {
			const permission_slug =
				methodKey === 'card'
					? PERMISSIONS.collect_payment_card.slug
					: methodKey === 'ach'
					? PERMISSIONS.collect_payment_ach.slug
					: methodKey === 'payment_link'
					? PERMISSIONS.collect_payment_link.slug
					: methodKey === 'terminal'
					? PERMISSIONS.collect_payment_pos.slug
					: PERMISSIONS.collect_payment_offline.slug;

			return {
				label: payment_config.collect_payment_methods[methodKey]?.label || methodKey,
				value: payment_config.collect_payment_methods[methodKey]?.key || methodKey,
				permission_slug: check_permission(permissions, [permission_slug]),
			};
		}).filter((option) => option.permission_slug);

		set_options(payment_method_options);
	}, [payment_config]);

	useEffect(() => {
		if (!selected_option) return;
		if (selected_option === PAYMENT_CONSTANTS.method_types.card || selected_option === PAYMENT_CONSTANTS.method_types.ach) {
			set_payment_method_attrs({ payment_method_id: selected_payment_method_id });
			const is_authorized_card = saved_payment_methods.some(
				(method) => method?.payment_method_id === selected_payment_method_id && method?.is_authorized,
			);
			set_is_authorized(is_authorized_card);
		} else if (selected_option === PAYMENT_CONSTANTS.method_types.payment_link) {
			handle_payment_link_operations();
		}
		set_selected_payment_method_type(selected_option);
	}, [selected_option, selected_payment_method_id]);

	const handle_render_section_header = (section: any, handle_click: any, permission_slug: any, permission_type: any) => {
		return (
			<Box display='flex' justifyContent={'space-between'} width='100%' alignItems='center' mb={1.5}>
				<Grid item>
					<CustomText type='H6' color='#00000099'>
						{section?.title}
					</CustomText>
				</Grid>

				<Can I={permission_slug} a={permission_type}>
					<Grid item display='flex' gap={1} alignItems='center' className={classes.add_new_card} onClick={handle_click}>
						<Icon color={colors.primary_500} iconName='IconPlus' />
						<CustomText type='H6' color={colors.primary_500}>
							{section?.sub_title}
						</CustomText>
					</Grid>
				</Can>
			</Box>
		);
	};

	const card_section = {
		title: t('Payment.SelectCard'),
		sub_title: t('Payment.AddNewCard'),
		empty_message: t('Payment.EmptyCard'),
	};

	const ach_section = {
		title: t('Payment.SelectACH'),
		sub_title: t('Payment.AddNewACH'),
		empty_message: t('Payment.EmptyAch'),
	};

	const handle_card_click = () => {
		set_is_add_card_modal_visible(true);
	};

	const handle_ach_click = () => {
		set_ach_modal(true);
	};

	const handle_render_saved_payment = (empty_message?: string) => {
		if (!isEmpty(saved_payment_methods)) {
			return (
				<SavedCardListing
					section_heading=''
					default_payment_id={selected_payment_method_id}
					style={{
						height: isEmpty(saved_payment_methods) ? '50px' : '60px',
					}}
					render_type={selected_option}
					saved_payment_methods={saved_payment_methods}
					update_selected_payment_method={set_selected_payment_method_id}
					component_type='select'
					useDefaultValue={true}
				/>
			);
		}
		return (
			<Grid display='flex' alignItems='center' pl={2} className={classes.empty_select_state}>
				<CustomText color={colors.grey_800} type='Title'>
					{empty_message}
				</CustomText>
			</Grid>
		);
	};

	const handle_render_banner = () => {
		return (
			<Grid className={classes.ach_banner} mt={2}>
				<Icon iconName='IconInfoCircle' color='#4F555E' />
				<CustomText type='Caption'>{t('Payment.AchAlert')}</CustomText>
			</Grid>
		);
	};

	const render_payment_method_fields = () => {
		const { method_types } = PAYMENT_CONSTANTS;
		switch (selected_option) {
			case method_types.card:
				return (
					<Grid container mb={1}>
						{handle_render_section_header(
							card_section,
							handle_card_click,
							PERMISSIONS.add_payment.slug,
							PERMISSIONS.add_payment.permissionType,
						)}
						{handle_render_saved_payment(card_section?.empty_message)}
					</Grid>
				);
			case method_types.ach:
				return (
					<Grid container mb={1}>
						{handle_render_section_header(
							ach_section,
							handle_ach_click,
							PERMISSIONS.add_payment.slug,
							PERMISSIONS.add_payment.permissionType,
						)}
						{handle_render_saved_payment(ach_section?.empty_message)}
						{handle_render_banner()}
					</Grid>
				);
			case method_types.payment_link:
				return <PaymentLink2 set_email_data={set_email_data} email_data={email_data} />;
			case method_types.manual:
				return (
					<MarkAsPaid set_attributes={set_payment_method_attrs} fields={payment_config?.collect_payment_methods?.manual?.attributes} />
				);
			case method_types.terminal:
				return (
					<PosPayment set_attributes={set_payment_method_attrs} field={payment_config?.collect_payment_methods?.terminal?.attributes} />
				);
			default:
				return null;
		}
	};

	const payment_method_ids = flatten([
		map(values(payment_method_data?.saved_payment_methods ?? {}), 'payment_method_id'),
		map(values(payment_method_data?.saved_bank_accounts ?? {}), 'payment_method_id'),
	]);

	return (
		<>
			<FormProvider {...methods}>
				{show_select_payment_method && (
					<React.Fragment>
						<FormBuilder
							name='payment_method_type'
							options={options}
							validations={{ required: true }}
							label=''
							defaultValue={selected_opt?.type || head(options)?.value}
							type='select'
							style={{
								height: '50px',
							}}
							control={control as unknown as Control}
							register={register}
							getValues={getValues}
							setValue={setValue}
							show_clear={false}
						/>
						<hr style={{ margin: '16px 0px' }}></hr>
					</React.Fragment>
				)}

				{render_payment_method_fields()}
			</FormProvider>

			{ach_modal && (
				<AddAchPaymentModal
					payment_method_ids={payment_method_ids || []}
					handle_update_form={handle_update_added_cards}
					buyer_id={buyer_data?.id}
					web_token={payment_config?.web_token}
					is_visible={ach_modal}
					close={handle_close_ach_modal}
					set_success_toast={set_success_toast}
					all_accounts={saved_bank_accounts_length}
				/>
			)}

			{is_add_card_modal && (
				<AddPaymentModal
					all_address={all_addresses}
					customer_id=''
					web_token={payment_config?.web_token}
					is_visible={is_add_card_modal}
					close={handle_close_add_card_modal}
					source='collect_payment'
					buyer_id={buyer_id}
					payment_source={payment_config?.payment_gateway}
					handle_update_form={handle_update_added_cards}
					is_direct_payment_flow={is_direct_payment_flow}
					all_cards={{
						...payment_method_data,
						payment_method_ids: [
							...values(payment_method_data?.saved_bank_accounts),
							...values(payment_method_data?.saved_payment_methods),
						],
					}}
				/>
			)}
		</>
	);
};

export default PaymentMethods;
