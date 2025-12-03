/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import FinixAchForm from './FinixAchForm';
import { finix_env, payment_gateways } from 'src/screens/BuyerLibrary/AddEditBuyerFlow/constants';
import api_requests from 'src/utils/api_requests';
import { FormProvider, useForm } from 'react-hook-form';
import CheckboxEditField from 'src/common/@the-source/atoms/FieldsNew/CheckboxEditField';
import { t } from 'i18next';
import CustomText from 'src/common/@the-source/CustomText';
import EditAchPaymentFields from './EditAchPaymentFields';
import { isEmpty, isString } from 'lodash';
import { useTheme } from '@mui/styles';
import { useMediaQuery } from '@mui/material';
const { VITE_APP_ENV } = import.meta.env;

interface Props {
	web_token: any;
	is_visible: boolean;
	close: (res?: any) => void;
	buyer_id: string;
	edit_mode?: boolean;
	ach_payment_values?: any;
	handle_update_form?: (key: string, data: any, data_key?: any) => void;
	primary_card_id?: string;
	delete_card?: (flag: string) => void;
	handle_confirm?: (res: any) => void;
	customer_id?: string;
	payment_method_id?: string | any;
	is_from_app?: boolean;
	payment_source?: string;
	access_token?: string;
	width?: number;
	height?: string;
	is_default?: boolean;
	is_first_payment_method?: boolean;
	base_url?: string;
	is_clickoutside_to_close?: boolean;
	source_id?: string;
	show_primary?: boolean;
	set_success_toast?: any;
	payment_method_ids?: any[];
	all_accounts?: number;
	set_refetch_payment_options?: any;
}

function AddAchPaymentModal({
	web_token,
	is_visible,
	close,
	edit_mode,
	ach_payment_values,
	buyer_id,
	handle_update_form,
	primary_card_id,
	delete_card,
	handle_confirm,
	show_primary = true,
	set_success_toast,
	payment_method_id,
	payment_method_ids = [],
	access_token = '',
	width = 480,
	base_url = '',
	is_default = false,
	is_first_payment_method = false,
	is_from_app = false,
	source_id,
	all_accounts,
	height,
	customer_id,
	payment_source = 'finix',
	is_clickoutside_to_close = false,
	set_refetch_payment_options,
}: Props) {
	const [finix_form, set_finix_form] = useState<any>(null);
	const [disable_save, set_disable_save] = useState(true);
	const [loading, set_loading] = useState(false);
	const [show_delete_modal, set_show_delete_modal] = useState(false);
	const { PRODUCTION, LIVE, SANDBOX } = finix_env;
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));

	const is_edit_flow = edit_mode || payment_method_id || source_id ? true : false;

	const methods = useForm({
		defaultValues: {
			is_primary:
				(isEmpty(payment_method_ids) && !is_from_app) || (is_edit_flow ? ach_payment_values?.payment_method_id === primary_card_id : false),
		},
	});

	const { watch } = methods;
	const value = watch('is_primary');

	const transform_form_data = (response: any) => {
		return {
			payment_method_type: 'ach',
			payment_method_id: response?.id,
			bank_account_type: response?.bank_account_type,
			title: response?.person_name,
			sub_title: `XXXXXX${response?.last_four_digits}`,
			is_default: value,
			is_selected: response?.is_selected,
			is_usable_in_vt: response?.is_usable_in_vt,
			is_tokenized: response?.response,
			country: response?.address_country,
			country_label: response?.country_label,
			source_id: response?.external_id,
		};
	};

	const handle_update = () => {
		if (value && handle_update_form) {
			handle_update_form('payment_methods.default_payment_method_id', ach_payment_values?.payment_method_id);
		}

		if (is_from_app && handle_confirm) {
			handle_confirm({
				action: 'edit',
				meta: {
					payment_method_id,
					is_default: value,
				},
			});
		} else {
			close && close();
		}
	};

	const handle_delete = () => {
		if (is_from_app && handle_confirm) {
			handle_confirm({
				action: 'delete',
				meta: { payment_method_id, source_id },
			});
		} else {
			delete_card && delete_card(ach_payment_values?.payment_method_id);
			set_show_delete_modal(false);
			close && close();
		}
	};

	const handle_save_bank_account = async (token: string) => {
		if (!token) return;
		const payload = {
			buyer_id,
			payment_method_id: token,
			payment_method_type: 'ach',
			is_default: value,
			provider: payment_gateways.FINIX,
		};
		try {
			const response: any = await api_requests.order_management.add_card(payload, access_token, base_url, false);
			const form_data: any = transform_form_data(response);

			if (response?.status === 200 && is_from_app && handle_confirm) {
				handle_confirm({
					action: response?.is_duplicate ? 'edit' : 'add',
					meta: {
						...response,
						is_default: payload?.is_default || false,
						account_last_four: response?.last_four_digits,
					},
				});
			}

			if (handle_update_form) {
				handle_update_form(`payment_methods.saved_bank_accounts.${response?.id}`, form_data, 'saved_bank_accounts');
				handle_update_form('payment_methods.payment_method_ids', [
					...payment_method_ids,
					{
						source: payment_gateways.FINIX,
						payment_method_type: form_data?.payment_method_type,
						id: form_data?.payment_method_id,
						source_id: form_data?.source_id,
					},
				]);
				if (value) {
					handle_update_form('payment_methods.default_payment_method_id', form_data?.payment_method_id);
				}
			}
			if (set_refetch_payment_options) set_refetch_payment_options((prev: any) => !prev);
			set_success_toast &&
				set_success_toast({
					open: true,
					title: 'Account added successfully',
					subtitle: '',
					state: 'success',
					callback: null,
				});
			if (!is_from_app) {
				close(response);
			}
		} catch (err: any) {
			if (is_from_app) {
				handle_confirm &&
					handle_confirm({
						action: 'add',
						meta: {
							...err?.response?.data,
						},
					});
			}
			set_success_toast &&
				set_success_toast({
					open: true,
					title: 'Account verification failed',
					subtitle: 'Please try again',
					state: 'warning',
					callback: null,
				});
			if (!is_from_app) {
				close();
			}
		} finally {
			set_loading(false);
		}
	};

	const handle_save = () => {
		set_loading(true);
		const _env = VITE_APP_ENV === PRODUCTION ? LIVE : SANDBOX;
		if (finix_form) {
			finix_form?.submit(_env, web_token, (err: any, res: any) => {
				if (err) {
					set_success_toast &&
						set_success_toast({
							open: true,
							title: 'Account verification failed',
							subtitle: 'Please try again',
							state: 'warning',
							callback: null,
						});
					handle_confirm &&
						handle_confirm({
							action: 'add',
							meta: {
								message: 'Account verification failed',
								...err,
							},
						});
					set_loading(false);
					return;
				}
				const token_data = res?.data || {};
				const token = token_data?.id;
				handle_save_bank_account(token);
			});
		}
	};

	const edit_flow_check =
		(is_edit_flow && isString(ach_payment_values?.payment_method_id) && ach_payment_values.payment_method_id === primary_card_id) ||
		(isEmpty(payment_method_ids) && !is_from_app);

	const handle_default_value = () => is_default || edit_flow_check;

	const handle_disable = () => is_default || is_first_payment_method || edit_flow_check;

	const handle_render_checkbox = () => {
		return (
			<Grid style={{ visibility: show_primary ? 'visible' : 'hidden' }}>
				<FormProvider {...methods}>
					<CheckboxEditField
						color={ach_payment_values?.payment_method_id === primary_card_id ? 'rgba(0, 0, 0, 0.5)' : ''}
						name='is_primary'
						key='is_primary'
						defaultValue={handle_default_value()}
						disabled={handle_disable()}
						checkbox_value={true}
						label={<CustomText type='Body'>{t('Payment.MarkAsDefault')}</CustomText>}
					/>
				</FormProvider>
			</Grid>
		);
	};

	return (
		<>
			<Modal
				key='card_modal'
				title={`${is_edit_flow ? 'Edit' : 'Add'} account`}
				width={width ? width : 420}
				height={is_from_app ? height : 'auto'}
				open={is_visible}
				onClose={() => close(null)}
				footer={
					<Grid container flexDirection={is_small_screen ? 'column' : 'row'} alignItems={'start'} justifyContent='space-between'>
						{handle_render_checkbox()}
						{is_edit_flow ? (
							<Grid
								display={'flex'}
								width={is_small_screen ? '100%' : 'max-content'}
								flexDirection={'row'}
								alignItems={'center'}
								gap={1}
								justifyContent={'flex-end'}>
								<Button variant='outlined' onClick={() => set_show_delete_modal(true)}>
									Delete
								</Button>
								<Button variant='contained' onClick={handle_update}>
									Update
								</Button>
							</Grid>
						) : (
							<Grid justifyContent='flex-end'>
								<Button loading={loading} disabled={loading || disable_save} variant='contained' onClick={handle_save}>
									Add
								</Button>
							</Grid>
						)}
					</Grid>
				}
				children={
					is_edit_flow ? (
						<EditAchPaymentFields ach_payment_values={ach_payment_values} />
					) : (
						<FinixAchForm height='40vh' set_finix_form={set_finix_form} set_disable_save={set_disable_save} />
					)
				}
				is_clickoutside_to_close={false}
			/>

			<Modal
				width={is_from_app ? width - 40 : 420}
				key='delete_modal'
				_height={is_from_app ? 'auto' : '215px'}
				open={show_delete_modal}
				onClose={() => set_show_delete_modal(false)}
				title='Delete bank account'
				footer={
					<Grid container justifyContent='flex-end' gap={2}>
						<Button variant='outlined' onClick={() => set_show_delete_modal(false)}>
							{t('Common.AddPaymentModal.Cancel')}
						</Button>
						<Button onClick={handle_delete}>{t('Common.AddPaymentModal.Delete')}</Button>
					</Grid>
				}
				children={<CustomText type='Body'>{t('Common.AddPaymentModal.ConfirmACHDelete')}</CustomText>}
			/>
		</>
	);
}

export default AddAchPaymentModal;
