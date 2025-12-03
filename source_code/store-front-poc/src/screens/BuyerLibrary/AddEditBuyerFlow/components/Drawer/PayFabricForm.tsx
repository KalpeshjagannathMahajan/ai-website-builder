import { useState, useEffect } from 'react';
import { get, isEmpty } from 'lodash';
import { Box, Grid } from 'src/common/@the-source/atoms';
import CircularProgressBar from 'src/common/@the-source/atoms/ProgressBar/CircularProgressBar';
import order_management from 'src/utils/api_requests/orderManagment';
import buyer from 'src/utils/api_requests/buyer';
import { payments } from 'src/utils/api_requests/payment';
import { payment_gateways } from '../../constants';
import { payfabric_loader } from './AddPaymentHelpers';
import { transform_form_data } from '../helper/helper';

interface PayfabricFormProps {
	buyer_id: string;
	base_url: string;
	is_from_app: boolean;
	is_edit_flow: boolean;
	access_token?: string;
	show_primary?: boolean;
	payment_source: string;
	primary_card_id?: string;
	from_buyer_page?: boolean;
	payment_method_id: string;
	payment_method_ids?: any[];
	close?: any;
	handle_add_edit_card_payment?: any;
	handle_update_form?: any;
	handle_confirm?: any;
}

const PayfabricForm: React.FC<PayfabricFormProps> = ({
	buyer_id,
	base_url,
	is_from_app,
	is_edit_flow,
	show_primary,
	access_token,
	payment_source,
	primary_card_id,
	from_buyer_page,
	payment_method_id,
	payment_method_ids,
	close,
	handle_confirm,
	handle_update_form,
	handle_add_edit_card_payment,
}) => {
	const [is_loading, set_is_loading] = useState<boolean>(true);
	const [show_circle_loader, set_show_circle_loader] = useState<boolean>(false);
	const [iframe_url, set_iframe_url] = useState<string | null>(null);

	const handle_add_card = async (wallet_id: string) => {
		set_show_circle_loader(true);
		try {
			const payload = {
				buyer_id,
				payment_method_id: wallet_id,
				payment_method_type: 'card',
				provider: payment_source,
			};
			const response: any = await order_management.add_card(payload, access_token, base_url);
			if (response?.status === 200) {
				if (from_buyer_page) {
					if (show_primary) {
						const default_payment_method_id = get(response, 'is_default', false) ? response?.id : primary_card_id;
						handle_update_form && handle_update_form('payment_methods.default_payment_method_id', default_payment_method_id);
					}
					const updated_data = {
						id: response?.id,
						source_id: response?.external_id,
						source: payment_source,
					};
					const form_data = transform_form_data(response);
					handle_add_edit_card_payment &&
						handle_add_edit_card_payment(response?.id, {
							...form_data,
							is_default: get(response, 'is_default', false),
						});
					handle_update_form && handle_update_form('payment_methods.payment_method_ids', [...(payment_method_ids ?? []), updated_data]);
					handle_update_form && handle_update_form(`payment_methods.saved_payment_methods.${response?.id}`, form_data),
						'saved_payment_methods';
				}
				if (is_from_app && handle_confirm) {
					handle_confirm({
						action: 'add',
						meta: {
							...response,
							is_default: response?.is_default || false,
							card_last_four: response?.last_four_digits,
							card_type: response?.card_scheme,
						},
					});
				}
			}
		} catch (error) {
			console.error(error);
		} finally {
			set_show_circle_loader(false);
			if (!is_from_app) {
				close();
			}
		}
	};

	const handle_update_card = async () => {
		set_show_circle_loader(true);
		try {
			const payload = {
				buyer_id,
				payment_method_id,
				payment_method_type: 'card',
				source: payment_source,
			};
			const response: any = await buyer.edit_payment_card_address(payload, access_token, base_url);
			if (response?.status === 200) {
				const form_data = transform_form_data(response);
				if (from_buyer_page) {
					if (show_primary) {
						const default_payment_method_id = get(response, 'is_default', false) ? response?.id : primary_card_id;
						handle_update_form && handle_update_form('payment_methods.default_payment_method_id', default_payment_method_id);
					}
					handle_add_edit_card_payment &&
						handle_add_edit_card_payment(payload.payment_method_id, {
							...form_data,
							is_default: response?.is_default ?? false,
						});
					handle_update_form && handle_update_form(`payment_methods.saved_payment_methods.${payload?.payment_method_id}`, form_data);
				}
				if (is_from_app && handle_confirm) {
					handle_confirm({
						action: 'edit',
						meta: {
							...response,
							...form_data,
							card_name: response?.person_name,
							payment_method_id: payload?.payment_method_id,
							is_default: response?.is_default || false,
							card_last_four: response?.last_four_digits,
							card_type: response?.card_scheme,
						},
					});
				}
			}
		} catch (error) {
			console.error(error);
		} finally {
			set_show_circle_loader(false);
			if (!is_from_app) {
				close();
			}
		}
	};

	const handle_iframe_load = () => {
		if (is_loading) {
			set_is_loading(false);
		}
	};

	useEffect(() => {
		const fetch_hosted_page_url = async () => {
			try {
				const payload = {
					buyer_id,
					provider: payment_gateways.PAYFABRIC,
					...(is_edit_flow && {
						payment_method_id,
						action: 'update',
					}),
				};
				const response: any = await payments.get_pretoken_transaction(payload, base_url, access_token);
				if (response?.status === 200) {
					const form_url = get(response, 'form_url', '');
					if (!isEmpty(form_url)) {
						const decoded = atob(form_url);
						const decoded_url = decodeURIComponent(decoded);
						set_iframe_url(decoded_url);
					}
				}
			} catch (error) {
				console.error(error);
				set_is_loading(false);
				if (!is_from_app) {
					close();
				}
			}
		};

		fetch_hosted_page_url();
	}, []);

	useEffect(() => {
		// Define the event listener for messages from the iframe
		const message_handler = (event: any) => {
			// Ensure the message comes from the correct PayFabric domain
			if (!event.origin.includes('payfabric.com')) {
				console.warn('Blocked message from unknown origin:', event.origin);
				return;
			}

			try {
				const data = JSON.parse(event?.data);
				// Check the event type and handle accordingly
				if (data.Event === 'processingCallback') {
					console.log(`Wallet processing callback: ${JSON.stringify(data)}`);
				} else if (data.Event === 'successCallback') {
					if (is_edit_flow) {
						handle_update_card();
					} else if (!isEmpty(data?.CardId)) {
						handle_add_card(data?.CardId);
					}
				} else if (data.Event === 'failCallback') {
					console.error('Wallet creation failed.');
				} else if (data.Event === 'validationFailCallback') {
					console.warn('Wallet validation failed.');
				}
			} catch (error) {
				console.error('Error parsing message from iframe:', error);
			}
		};

		// Attach the event listener
		window.addEventListener('message', message_handler);

		// Cleanup function to remove the event listener when component unmounts
		return () => {
			window.removeEventListener('message', message_handler);
		};
	}, []);

	return (
		<Grid container height={'500px'}>
			{is_loading && payfabric_loader()}
			{show_circle_loader && (
				<Box width={'100%'} display='flex' justifyContent='center' alignItems='center' height='100%'>
					<CircularProgressBar />
				</Box>
			)}
			{iframe_url && !show_circle_loader && (
				<iframe
					src={iframe_url}
					width='100%'
					height='500px'
					onLoad={handle_iframe_load}
					title='Hosted Wallet Page'
					style={{ border: 'none' }}
					loading='lazy'
				/>
			)}
		</Grid>
	);
};

export default PayfabricForm;
