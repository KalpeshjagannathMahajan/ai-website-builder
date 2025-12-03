import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import _ from 'lodash';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid, Modal, Skeleton } from 'src/common/@the-source/atoms';
import { finix_env } from 'src/screens/BuyerLibrary/AddEditBuyerFlow/constants';
import { colors } from 'src/utils/theme';
import api_requests from 'src/utils/api_requests';
import useDashboard from '../useDashboard';
import TerminalModal from './TerminalModal';
import { get_formatted_price_with_currency } from 'src/utils/common';

const { VITE_APP_ENV } = import.meta.env;
const { PRODUCTION, LIVE, SANDBOX } = finix_env;

interface PaymentConfig {
	web_token: string;
	payment_gateway: string;
	finix_merchant_id?: string;
}

interface DirectPaymentModalProps {
	is_modal_visible: boolean;
	payment_config: PaymentConfig;
	is_from_app?: boolean;
	access_token?: string;
	height?: string;
	width?: number;
	base_url?: string;
	is_clickoutside_to_close?: boolean;
	environment?: string;
	set_is_modal_visible?: (value: boolean) => void;
	handle_complete?: (response: any) => void;
	currency: string;
	form_data: any;
	handle_close?: (res: any) => any;
}

interface FinixFormProps {
	is_form_loading: boolean;
	set_finix_form: (value: any) => void;
	set_is_form_loading: (value: boolean) => void;
	set_is_submit_disabled: (value: boolean) => void;
}

interface SubmitChargePayload extends FieldValues {
	external_token: string;
}

const skeletons = [{ xs: 12 }, { xs: 12 }, { xs: 6 }, { xs: 6 }, { xs: 12 }, { xs: 6 }, { xs: 6 }, { xs: 6 }, { xs: 6 }];

const get_finix_session_key = (env: string, merchant_id: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		(window as any)?.Finix?.Auth(env, merchant_id, (session_key: string) => {
			if (session_key) {
				resolve(session_key);
			} else {
				reject(new Error('Failed to get session key'));
			}
		});
	});
};

const FormSkeleton = () => {
	return (
		<Box component='form' noValidate autoComplete='off'>
			<Grid container spacing={3}>
				{_.map(skeletons, (skeleton) => (
					<Grid item xs={skeleton.xs} key={`${skeleton.xs}__${Math.random() * 100}`}>
						<Skeleton variant='rectangular' width='100%' height={48} sx={{ borderRadius: '8px' }} />
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

const FinixForm = ({ is_form_loading, set_finix_form, set_is_submit_disabled, set_is_form_loading }: FinixFormProps) => {
	const options = {
		showAddress: true,
		showLabels: true,
		labels: {
			name: 'Full Name',
		},
		showPlaceholders: true,
		placeholders: {
			name: 'Full Name',
			number: 'XXXX XXXX XXXX XXXX',
		},
		hideFields: ['address_line2'],
		requiredFields: ['name'],
		hideErrorMessages: false,
		errorMessages: {
			name: 'Please enter a valid name',
			address_city: 'Please enter a valid city',
		},
		styles: {
			default: {
				color: '#000',
				border: `1px solid ${colors.light_grey}`,
				borderRadius: '8px',
				padding: '8px 16px',
				fontSize: '12px',
				boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.03), 0px 2px 4px rgba(0, 0, 0, 0.03)',
			},
			error: {
				color: colors.red,
				border: `1px solid ${colors.red}`,
			},
		},
		onUpdate: (state: any, binInformation: any, formHasErrors: any) => {
			set_is_submit_disabled(formHasErrors);
		},
		onLoad: () => {
			set_is_form_loading(false);
		},
	};

	useEffect(() => {
		const initialise_finix_form = () => {
			if ((window as any).Finix && (window as any).Finix.CardTokenForm) {
				const form = (window as any).Finix.CardTokenForm('finix_form', options);
				set_finix_form(form);
			} else {
				console.error('Finix form is not defined yet');
			}
		};

		initialise_finix_form();
	}, []);

	return (
		<Grid height={'56vh'}>
			{is_form_loading && <FormSkeleton />}
			<div id='finix_form' />
		</Grid>
	);
};

const DirectPaymentModal: React.FC<DirectPaymentModalProps> = React.memo(
	({
		is_modal_visible,
		payment_config,
		is_from_app = false,
		access_token = '',
		height = 'auto',
		width = 500,
		base_url = '',
		is_clickoutside_to_close = false,
		environment = '',
		set_is_modal_visible,
		handle_complete,
		currency,
		form_data,
		handle_close,
	}) => {
		const [finix_form, set_finix_form] = useState<any>(null);
		const [is_btn_loading, set_is_btn_loading] = useState<boolean>(false);
		const [is_form_loading, set_is_form_loading] = useState<boolean>(true);
		const [is_submit_disabled, set_is_submit_disabled] = useState<boolean>(false);
		const [direct_payment_res, set_direct_payment_res] = useState();
		const { complete, setIsPolling, is_terminal_modal_visible, set_is_terminal_modal_visible, transaction_data } = useDashboard();
		const _env_val = is_from_app && !_.isEmpty(environment) ? environment : VITE_APP_ENV;
		const _env = _env_val === PRODUCTION ? LIVE : SANDBOX;
		const amount = form_data?.custom_amount_to_pay;

		const reset_states = () => {
			set_is_form_loading(true);
			set_is_btn_loading(false);
			set_is_submit_disabled(false);
		};

		useEffect(() => {
			if (!is_from_app) {
				if (!is_terminal_modal_visible) return;
				set_is_modal_visible && set_is_modal_visible(false);
				reset_states();
			}
		}, [is_terminal_modal_visible]);

		const handle_submit_charge = async (payload: SubmitChargePayload) => {
			try {
				set_is_btn_loading(true);
				const payload_to_be_sent = {
					...payload,
					collect_payment_method: 'card', // for now
				};
				const { finix_merchant_id = '' } = payment_config || {};
				// const _env = VITE_APP_ENV === PRODUCTION ? LIVE : SANDBOX;
				const session_key = await get_finix_session_key(_env, finix_merchant_id);
				const updated_payload = {
					...payload_to_be_sent,
					attributes: {
						fraud_session_id: session_key,
					},
				};
				const response: any = await api_requests.buyer.collect_direct_payment(updated_payload, access_token, base_url);
				set_direct_payment_res(response);
				if (response?.transaction_status === 'pending' && !is_from_app) {
					setIsPolling({ data: response, state: true });
				}
				if (is_from_app && handle_complete) {
					const updated_response = {
						action: 'submit',
						transaction_details: response,
					};
					handle_complete(updated_response);
				} else {
					complete(response);
				}
			} catch (error) {
				console.error(error);
				const _response = {
					transaction_status: 'failed',
					transaction_amount: '',
					transaction_header: 'Payment failed',
				};
				if (is_from_app && handle_complete) {
					handle_complete(_response);
				} else {
					complete(_response);
				}
			} finally {
				set_is_btn_loading(false);
			}
		};

		const handle_tokenize_card: SubmitHandler<FieldValues> = (values) => {
			try {
				set_is_btn_loading(true);
				// const _env = VITE_APP_ENV === PRODUCTION ? LIVE : SANDBOX;
				finix_form?.submit(_env, payment_config.web_token, (err: any, res: any) => {
					if (err) {
						console.error(err);
						set_is_btn_loading(false);
						return;
					}
					const tokenData = res?.data || {};
					const token = tokenData?.id;
					const final_payload: SubmitChargePayload = {
						...values,
						external_token: token,
					};
					handle_submit_charge(final_payload);
				});
			} catch (error) {
				console.error(error);
			}
		};

		const handle_next: SubmitHandler<FieldValues> = () => {
			handle_tokenize_card(form_data);
		};

		const render_card_fields = (
			<Grid mt={1}>
				<FinixForm
					is_form_loading={is_form_loading}
					set_finix_form={set_finix_form}
					set_is_form_loading={set_is_form_loading}
					set_is_submit_disabled={set_is_submit_disabled}
				/>
			</Grid>
		);

		const render_content = (
			<Grid id='direct-payment-content'>
				<Grid
					sx={{
						overflowY: 'scroll',
						'&::-webkit-scrollbar': {
							width: '0',
						},
						maxHeight: height ?? '90%',
					}}>
					{render_card_fields}
				</Grid>
			</Grid>
		);

		const render_footer = (
			<Grid container display='flex' justifyContent={'space-between'} alignItems='center'>
				<Grid
					item
					display='flex'
					justifyContent='space-between'
					width={'40%'}
					p={1.5}
					borderRadius={'8px'}
					alignItems='center'
					bgcolor={colors.grey_600}>
					<CustomText type='Subtitle'>Charge</CustomText>
					<CustomText type='Subtitle'>{get_formatted_price_with_currency(currency, amount)}</CustomText>
				</Grid>

				<Grid item>
					<Button disabled={is_submit_disabled || Number(amount) === 0} onClick={handle_next} loading={is_btn_loading}>
						{'Charge'}
					</Button>
				</Grid>
			</Grid>
		);

		const handle_close_modal = () => {
			reset_states();
			set_is_modal_visible && set_is_modal_visible(false);
			handle_close && handle_close(direct_payment_res);
			if (is_from_app && handle_complete) {
				const response = {
					action: 'cancel',
				};
				handle_complete(response);
			}
		};

		return (
			<React.Fragment>
				<Modal
					title='Enter details'
					open={is_modal_visible}
					onClose={handle_close_modal}
					children={render_content}
					footer={render_footer}
					width={width}
					is_clickoutside_to_close={is_clickoutside_to_close}
				/>
				{is_terminal_modal_visible && (
					<TerminalModal
						is_visible={is_terminal_modal_visible}
						transaction_data={transaction_data}
						close={() => {
							set_is_terminal_modal_visible(false);
							handle_close_modal();
						}}
						retry={() => set_is_terminal_modal_visible(false)}
						currency={currency}
					/>
				)}
			</React.Fragment>
		);
	},
);

export default DirectPaymentModal;
