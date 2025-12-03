/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Box, Button, Checkbox, Grid, Icon, SingleSelect, Skeleton } from 'src/common/@the-source/atoms';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import _, { filter, isEmpty } from 'lodash';
import SavedCardListing from 'src/common/@the-source/molecules/SavedCardListing';
import OrderManagementContext from '../../context';
import { payments } from 'src/utils/api_requests/payment';
import { PERMISSIONS } from 'src/casl/permissions';
import Can from 'src/casl/Can';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';
import PAYMENT_CONSTANTS from '../../../Payment/constants';
import { SPECIAL_DOCUMENT_ATTRIBUTE } from '../../constants';
import { check_permission } from 'src/utils/utils';
import { permissions } from 'src/utils/mocks/mock_permissions';
import { useSelector } from 'react-redux';

interface Props {
	is_ultron?: boolean;
	is_store_front?: boolean;
}

const AddEditPayment = ({ is_ultron = true, is_store_front = false }: Props) => {
	const { t } = useTranslation();

	const {
		handle_drawer_state,
		set_show_add_card,
		document_data,
		handle_update_document,
		set_customer_id,
		set_ach_modal,
		selected_payment_opt,
		set_saved_payment_methods_data,
		saved_payment_methods_data,
		attribute_data,
		show_add_card,
		drawer,
		refetch_payment_options,
		optional_payment,
		set_optional_payment,
	} = useContext(OrderManagementContext);
	const { payment_method_v2 } = document_data?.attributes || {};
	const { buyer_id } = document_data;
	const [loading, set_loading] = useState<boolean>(true);
	const [btn_loading, set_btn_loading] = useState<boolean>(false);
	const classes = useStyles();
	const theme: any = useTheme();
	const [mark_as_default, set_mark_as_default] = useState<boolean>(false);
	const [selected_payment, set_selected_payment] = useState<any>(null);
	const [payment_methods, set_payment_methods] = useState<{ label: string; value: string }[]>([]);
	const [selected_payment_method_id, set_selected_payment_method_id] = useState<string>('');
	const [default_payment_method_id, set_default_payment_method_id] = useState<string>('');
	const [temp_selected_card, set_temp_selected_card] = useState<any>('');
	const [default_payment_data, set_default_payment_data] = useState<any>({});
	const make_payment_card_optional = useSelector((state: any) => state?.settings?.make_payment_card_optional) || {};
	const [refetch, setRefetch] = useState<boolean>(false);
	const is_ach_enabled: boolean = check_permission(permissions, [PERMISSIONS.collect_payment_ach.slug]) || false;

	const optional_payment_active = React.useMemo(() => {
		if (_.isEmpty(make_payment_card_optional) || !make_payment_card_optional?.enabled) {
			return false;
		}
		if (_.isEmpty(make_payment_card_optional?.check_fields_to_not_show)) {
			return true;
		}

		const { id, value } = make_payment_card_optional?.check_fields_to_not_show;
		if (attribute_data?.[id] && attribute_data?.[id] === value) {
			return false;
		}

		return true;
	}, [make_payment_card_optional]);

	const selected_payment_methods_data = useMemo(() => {
		const payment_method_key = PAYMENT_CONSTANTS.payment_method_data_keys?.[selected_payment];
		const payment_method_key_data = saved_payment_methods_data?.[payment_method_key] || {};

		const payment_type =
			selected_payment === PAYMENT_CONSTANTS.method_types.card ? PAYMENT_CONSTANTS.method_types.card : PAYMENT_CONSTANTS.method_types.ach;

		return filter(payment_method_key_data, (method: any) => method?.payment_method_type === payment_type);
	}, [saved_payment_methods_data, selected_payment]);

	const get_payment_options_data = (data: { saved_bank_accounts: any[]; saved_payment_methods: any[] }) => {
		return [...data?.saved_bank_accounts, ...data?.saved_payment_methods];
	};

	const payment_method_details = attribute_data[SPECIAL_DOCUMENT_ATTRIBUTE.payment_method_v2] || {};

	const handle_payment_mode_change = (data: any) => {
		set_selected_payment(data?.value);
	};

	const handle_mark_as_default = () => {
		set_mark_as_default((state) => !state);
	};

	const get_options = (payment_options: any) => {
		return payment_options?.map((option: any) => {
			return {
				label: option?.label,
				value: option?.key,
			};
		});
	};

	const handle_close = () => {
		handle_drawer_state(false);
	};

	const handle_done = (id?: any) => {
		const _id = id ? id : selected_payment_method_id;
		set_temp_selected_card(_id);
		set_btn_loading(true);
		if (_id === 'skip') {
			handle_update_document(
				{
					payment_method_v2: {},
				},
				undefined,
				set_btn_loading,
			);
			return;
		}
		const payments_options_data = [
			...(saved_payment_methods_data?.saved_payment_methods ?? []),
			...(saved_payment_methods_data?.saved_bank_accounts ?? []),
		];
		const selected_method_details: any = payments_options_data?.find((method: any) => method.payment_method_id === _id);
		if (selected_method_details) {
			handle_update_document(
				{
					payment_method_v2: is_store_front
						? { ...selected_method_details, is_default: false }
						: { ...selected_method_details, is_default: mark_as_default },
				},
				undefined,
				set_btn_loading,
			);
		}
	};

	const transform_saved_methods = (methods: any) => {
		return [
			...(_.isEmpty(optional_payment) || !optional_payment_active
				? []
				: [{ ...optional_payment, is_selected: temp_selected_card === 'skip' }]),
			..._.map(methods, (method: any) => (method.payment_method_id === payment_method_v2?.payment_method_id ? { ...method } : method)),
		];
	};

	const get_payment_methods = async () => {
		set_loading(true);
		try {
			const response: any = await payments.get_payment_methods(buyer_id);
			if (response.status_code === 200) {
				const temp_payment_methods: any = Object.values(response?.data?.payment_methods) || [];
				set_payment_methods(get_options(temp_payment_methods));

				const _saved_payment_methods = transform_saved_methods(Object.values(response?.data?.saved_payment_methods));
				const _saved_bank_accounts = transform_saved_methods(Object.values(response?.data?.saved_bank_accounts));

				set_saved_payment_methods_data({
					saved_payment_methods: _saved_payment_methods,
					saved_bank_accounts: _saved_bank_accounts,
				});

				const default_payment_method_data = _.find([...(_saved_payment_methods || []), ...(_saved_bank_accounts || [])], {
					is_default: true,
				});

				set_default_payment_data(default_payment_method_data || { payment_method_type: 'card' });

				set_customer_id(response?.data?.customer_id);
				set_loading(false);
			}
		} catch (error) {
			console.error(error);
			set_loading(false);
		}
	};

	const handle_add_click = () => {
		set_show_add_card({ state: true, refetch: false });
		handle_drawer_state(false);
	};

	const handle_account_add_click = () => {
		set_ach_modal(true);
		handle_drawer_state(false);
		setRefetch((state) => !state);
	};

	const handle_selection_change = (id: string) => {
		if (id === 'skip') {
			// set_selected_payment_opt({ mode: 'add', type: 'card' })
			set_optional_payment({ ...optional_payment, is_selected: true });
			set_temp_selected_card(id);
		} else {
			set_optional_payment({ ...optional_payment, is_selected: false });
			set_temp_selected_card(id);
		}
		set_selected_payment_method_id(id);
		if (is_store_front) {
			handle_done(id);
		}
	};

	useEffect(() => {
		set_mark_as_default(selected_payment_method_id === default_payment_method_id);
	}, [selected_payment_method_id]);

	useEffect(() => {
		const filtered_saved = _.filter(selected_payment_methods_data, (option: any) => option?.payment_method_type === selected_payment);
		const assigned_payment_method = _.find(filtered_saved, (method) => method.is_selected);
		const default_payment_method = _.find(filtered_saved, (method) => method.is_default);
		const is_optional_payment = optional_payment?.is_selected || false;

		const get_selected_payment_method_id = () =>
			(is_optional_payment
				? optional_payment?.payment_method_id
				: payment_method_details?.payment_method_id ||
				  assigned_payment_method?.payment_method_id ||
				  default_payment_method?.payment_method_id ||
				  '');

		const temp_payment_method_id = get_selected_payment_method_id();

		if (default_payment_method || payment_method_details?.payment_method_id) {
			handle_selection_change(
				is_optional_payment
					? optional_payment?.payment_method_id
					: default_payment_method?.payment_method_id || payment_method_details?.payment_method_id,
			);
		}
		set_default_payment_method_id(default_payment_method?.payment_method_id);
		set_selected_payment_method_id(temp_payment_method_id);
		set_temp_selected_card(temp_payment_method_id);
		set_mark_as_default(false);
		if (is_store_front) {
			handle_done(temp_payment_method_id);
		}
	}, [selected_payment, selected_payment_methods_data]);

	useEffect(() => {
		if (selected_payment_opt?.mode === 'edit') {
			set_selected_payment(selected_payment_opt?.type);
		} else if (selected_payment_opt?.mode === 'add' && !isEmpty(default_payment_data)) {
			set_selected_payment(default_payment_data?.payment_method_type || _.head(payment_methods)?.value);
		}
		if (is_ultron && default_payment_data?.payment_method_type) {
			set_selected_payment(default_payment_data?.payment_method_type);
		}
	}, [payment_methods, default_payment_data]);

	useEffect(() => {
		if ((!show_add_card?.state && show_add_card?.refetch) || drawer?.drawer_state) {
			get_payment_methods();
		}
	}, [show_add_card?.state, show_add_card?.refetch, refetch, refetch_payment_options]);

	if (loading) {
		return (
			<Box className={classes.drawerContentContainer}>
				<Skeleton
					variant='text'
					width='100%'
					height={30}
					sx={{ lineHeight: '24px', fontWeight: '400', fontSize: '16px', paddingTop: '1rem' }}
				/>
				<Skeleton variant='text' width='100%' height={100} sx={{ marginTop: '1rem' }} />
				<Skeleton variant='text' width='50%' height={30} sx={{ marginTop: '1rem' }} />
				<Skeleton variant='text' width='70%' height={50} sx={{ marginTop: '1rem' }} />
				<Skeleton variant='text' width='70%' height={50} sx={{ marginTop: '1rem' }} />
				<Skeleton variant='text' width='70%' height={50} sx={{ marginTop: '1rem' }} />
			</Box>
		);
	}

	return (
		<React.Fragment>
			{is_ultron && (
				<Box className={classes.drawerContentContainer}>
					<CustomText children={t('Payment.SelectPayment')} type='Body' style={{ paddingTop: '1rem' }} />

					<Grid sx={{ marginTop: '1.4rem' }}>
						<SingleSelect
							useDefaultValue
							options={payment_methods}
							defaultValue={selected_payment}
							handleChange={handle_payment_mode_change}
						/>
					</Grid>

					{selected_payment_methods_data?.filter((method: any) => method.payment_method_type === selected_payment).length > 0 && (
						<SavedCardListing
							render_type={selected_payment}
							section_heading='Available payment options'
							default_payment_id={selected_payment_method_id}
							saved_payment_methods={selected_payment_methods_data?.filter(
								(method: any) => method.payment_method_type === selected_payment,
							)}
							update_selected_payment_method={handle_selection_change}
							set_temp_selected_card={set_temp_selected_card}
							is_drawer={true}
							drawer={true}
							methods={payment_methods}
						/>
					)}
					{
						<Can I={PERMISSIONS.edit_orders.slug && PERMISSIONS.add_payment.slug} a={PERMISSIONS.add_payment.permissionType}>
							<Grid display='flex' sx={{ marginTop: '2.4rem' }}>
								<Icon
									sx={{ color: theme?.order_management?.add_edit_payment?.icon_color, fontWeight: '700', cursor: 'pointer' }}
									iconName='IconPlus'
									onClick={handle_add_click}
								/>
								<CustomText
									type='Subtitle'
									style={{ cursor: 'pointer' }}
									children={selected_payment === 'card' ? 'Add card' : 'Add account'}
									color={theme?.order_management?.add_edit_payment?.custom_color}
									onClick={selected_payment === 'card' ? handle_add_click : handle_account_add_click}
								/>
							</Grid>
						</Can>
					}
				</Box>
			)}

			{is_ultron && (
				<Box className={classes.drawerFooterContainer}>
					<Grid display='flex'>
						{(selected_payment === 'card' || selected_payment === 'ach') && (
							<Grid display='flex' width='-webkit-fill-available'>
								<Checkbox
									checked={mark_as_default}
									onChange={handle_mark_as_default}
									disabled={selected_payment_method_id === default_payment_method_id}
								/>
								<CustomText
									style={{ display: 'grid', alignContent: 'center' }}
									children={selected_payment === 'card' ? 'Mark card as default' : 'Mark as default'}
								/>
							</Grid>
						)}
						<Grid className={classes.buttonAlignmentContainer} gap={1}>
							<React.Fragment>
								<Button variant='outlined' onClick={handle_close}>
									{t('OrderManagement.SendMailDrawer.Cancel')}
								</Button>
								<Button
									disabled={selected_payment_method_id === ''}
									loading={btn_loading}
									variant='contained'
									onClick={() => handle_done()}>
									{t('OrderManagement.SendMailDrawer.Done')}
								</Button>
							</React.Fragment>
						</Grid>
					</Grid>
				</Box>
			)}
			{is_store_front && (
				<SavedCardListing
					render_type={selected_payment}
					section_heading={is_ach_enabled ? 'Available payment options' : 'Available cards'}
					default_payment_id={selected_payment_method_id}
					saved_payment_methods={get_payment_options_data(saved_payment_methods_data)}
					update_selected_payment_method={handle_selection_change}
					handle_add_click={handle_add_click}
					handle_account_add_click={handle_account_add_click}
					temp_selected_card={temp_selected_card}
					set_temp_selected_card={set_temp_selected_card}
					is_drawer={false}
					methods={payment_methods}
				/>
			)}
		</React.Fragment>
	);
};

export default AddEditPayment;
