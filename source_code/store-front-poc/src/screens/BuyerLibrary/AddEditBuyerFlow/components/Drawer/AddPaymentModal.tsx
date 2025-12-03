import { t } from 'i18next';
import _, { isString } from 'lodash';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Button, Grid, Modal, Skeleton, Stepper } from 'src/common/@the-source/atoms';
import CheckboxEditField from 'src/common/@the-source/atoms/FieldsNew/CheckboxEditField';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import api_requests from 'src/utils/api_requests';
import PaymentDrawerSkeleton from './PaymentDrawerSkeleton';
import { CARD_URLS } from 'src/utils/common';
import CustomText from 'src/common/@the-source/CustomText';
import AddressCard from './AddressCard';
import { useDispatch } from 'react-redux';
import { close_toast, show_toast } from 'src/actions/message';
import types from 'src/utils/types';
import Can from 'src/casl/Can';
import { PERMISSIONS } from 'src/casl/permissions';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import ErrorPage from 'src/common/@the-source/molecules/ErrorPages/Error';
import { finix_env, finix_stepper_steps, payment_gateways, payment_stepper_steps, stepper_fields_gateways } from '../../constants';
import PaymentFields from './PaymentFields';
const { VITE_APP_ENV } = import.meta.env;
import { FinixForm } from './FinixForm';
import Lottie from 'react-lottie';
import LoaderLottie from 'src/assets/animations/redirect_loader.json';
import { colors } from 'src/utils/theme';
import { get_retrieved_card_data, transform_form_data, transform_pci_form_data } from '../helper/helper';
import { RootState } from 'src/store';
// import constants from 'src/utils/constants';
import utils from 'src/utils/utils';
import settings from 'src/utils/api_requests/setting';
import { DEFAULT_JSON_RULE_PAYMENT_ADDRESS } from 'src/screens/Settings/utils/constants';
import { set_error_modal_data } from 'src/actions/errorModal';
import PCIFormRenderer from './PCIForm';
import PayfabricForm from './PayFabricForm';

// const { SAGEBROOK_TEMP_CONSTANTS } = constants;
const DEFAULT_COUNTRY = 'USA';

const common_stepper_styles = {
	'& .MuiStepIcon-text': {
		fontSize: '1.4rem', // size of the step index text here
	},
	width: { xs: '100%', md: '70%' },
};

interface CardDetails {
	card_number_label: string;
	expiry: string;
	card_holder_name: string;
	logo: string;
	last_four?: string;
	card_type?: string;
}

interface PaymentValidation {
	card_number?: boolean;
	cvv?: boolean;
}

interface Props {
	all_address?: any[] | [];
	customer_id?: string;
	web_token?: string;
	is_visible: boolean;
	close: (res?: any) => void;
	all_cards?: any;
	payment_method_id?: string | any;
	primary_card_id?: string;
	handle_update_form?: (key: string, data: any, data_key?: any) => void;
	delete_card?: (index: string) => void;
	show_primary?: boolean;
	buyer_id?: any;
	edit_data?: any;
	source?: string;
	is_from_app?: boolean;
	access_token?: string;
	width?: number;
	height?: string;
	payment_source?: string;
	is_default?: boolean;
	is_first_payment_method?: boolean;
	base_url?: string;
	is_clickoutside_to_close?: boolean;
	handle_confirm?: (response: any) => any;
	source_id?: string;
	payment_delete_permission?: boolean;
	address_country_options?: any;
	is_direct_payment_flow?: boolean;
	handle_add_edit_card_payment?: any;
}

const AddPaymentComp = ({
	all_address = [],
	payment_method_id,
	is_visible,
	all_cards,
	close,
	delete_card,
	handle_update_form,
	buyer_id,
	show_primary = true,
	primary_card_id,
	edit_data,
	web_token,
	source = 'buyer',
	customer_id,
	is_from_app = false,
	access_token,
	handle_confirm,
	width = 480,
	height = '87%',
	payment_source = 'stax',
	is_default = false,
	is_first_payment_method = false,
	base_url = '',
	is_clickoutside_to_close = false,
	source_id = '',
	payment_delete_permission,
	address_country_options = [],
	is_direct_payment_flow = false,
	handle_add_edit_card_payment,
}: Props) => {
	const { FINIX, WORLDPAY, STAX, CYBERSOURCE, PCI_VAULT, PAYFABRIC } = payment_gateways;
	const { PRODUCTION, LIVE, SANDBOX } = finix_env;
	const is_edit_flow = payment_method_id || source_id ? true : false;
	const [fields, set_fields] = useState({});
	const json_engine_rules = useSelector((state: RootState) => state?.json_rules);
	const distinct_id = `temp_${crypto.randomUUID()}`;
	const [show_modal, set_show_modal] = useState(false);
	const [disable_save, set_disable_save] = useState(false);
	const [staxJs, set_staxjs] = useState<any>(null);
	const [finix_form, set_finix_form] = useState(null);
	const [address_rules, set_address_rules] = useState<any>(json_engine_rules.payment_address_rule || {});
	const [loading, set_loading] = useState<boolean>(false);
	const [customerId, setCustomerId] = useState<string>(customer_id || '');
	const [is_form_loading, set_is_form_loading] = useState<boolean>(payment_source !== FINIX || is_edit_flow);
	const [stax_validations, set_stax_validations] = useState<any>({ number: false, cvv: false });
	const [state_options, set_state_options] = useState<any>();
	const [copy_modal, set_copy_modal] = useState<boolean>(false);
	const [country, set_country] = useState<string>('United States');
	const [step_fields, set_step_fields] = useState<any>([]);
	const [active_step, set_active_step] = useState<number>(0);
	const [iframe_url, set_iframe_url] = useState<string | null>(null);
	const [show_redirecting, set_show_redirecting] = useState<boolean>(false);
	const [is_iframe_loading, set_is_iframe_loading] = useState<boolean>(true);
	const [finix_method_id, set_finix_method_id] = useState<string | null>(null);
	const [added_card_details, set_added_card_details] = useState<CardDetails | null>(null);
	const [cyber_source_form, set_cyber_source_form] = useState<any>(null);
	const [cyber_source_unique_id, set_cyber_source_unique_id] = useState<string>('');
	const [cyber_source_validations, set_cyber_source_validations] = useState<PaymentValidation>({});
	const [pci_secrets, set_pci_secrets] = useState<any>(null);
	const [pci_method_id, set_pci_method_id] = useState<string>('');
	const [pci_add_response, set_pci_add_response] = useState<any>(null);
	const user_permissions = useSelector((state: any) => state?.login?.permissions);
	const payment_method_ids = all_cards?.payment_method_ids || [];
	const dispatch = useDispatch();
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const methods = useForm({
		defaultValues: { id: is_edit_flow ? payment_method_id || source_id || '' : distinct_id },
	});
	const is_stepper_field = stepper_fields_gateways.includes(payment_source);
	// const tenant_id = useSelector((state: RootState) => _.get(state?.login?.userDetails, 'tenant_id'));

	// [suyash] error state - temp fix
	const [is_error, set_error] = useState<boolean>(false);

	const { handleSubmit, control, getValues, setValue, reset, watch } = methods;

	const get_states = (e: any, clear: boolean = false) => {
		if (clear) {
			setValue('address_1', '');
			setValue('address_2', '');
			setValue('state', '');
			setValue('city', '');
			setValue('zip', '');
		}
		api_requests.buyer
			.get_country_states({ country_code: e.target.value }, access_token, base_url)
			.then((res: any) => {
				if (res?.status === 200) {
					set_country(res?.country?.label);
					set_state_options(res?.states);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const process_common_fields = (res: any) => {
		// United States -> United States of America
		const countryAttribute = res?.attributes?.find((item: any) => item?.id === 'country');
		if (countryAttribute && countryAttribute?.options) {
			const index = _.findIndex(countryAttribute?.options, { value: 'USA' });
			if (index !== -1) {
				countryAttribute.options[index] = {
					label: 'United States of America',
					value: 'USA',
				};
			}
			// Sort the options array by label
			countryAttribute.options = _.sortBy(countryAttribute.options, 'label');
		}

		get_states({ target: { value: res?.attributes?.find((item: any) => item?.id === 'country')?.value || 'USA' } });
		const attributes_map = ['address_1', 'city', 'zip'];

		attributes_map.forEach((attr: any) => {
			const value = res?.attributes?.find((item: any) => item?.id === attr)?.value || '';
			setValue(attr, value);
		});
	};

	const handle_stax_fields = (res: any) => {
		const StaxJs = window?.StaxJs;
		const newStaxJs = new StaxJs(web_token, {
			number: {
				id: 'staxjs-number',
				placeholder: 'Enter card number',
				style: 'width: calc(100% - 27px); height:53px; border-radius: 8px; border: 1px solid #ccc; font-size: 91%; padding: 0 12px;',
			},
			cvv: {
				id: 'staxjs-cvv',
				placeholder: 'Enter CVV',
				style: 'width: calc(100% - 27px); height:53px; border-radius: 8px; border: 1px solid #ccc; font-size: 91%; padding: 0 12px;',
			},
		});
		process_common_fields(res);

		set_stax_validations({ number: newStaxJs.validNumber, cvv: newStaxJs.validCvv });
		set_staxjs(newStaxJs);
		set_fields(res?.attributes);
	};

	const handle_worldpay_fields = (res: any) => {
		process_common_fields(res);
		if (!is_edit_flow) {
			const address_fields = res?.address?.attributes;
			set_step_fields(address_fields);
			set_fields(res);
			return;
		}
		set_fields(res?.attributes);
	};

	const handle_finix_fields = (res: any) => {
		process_common_fields(res);
		if (!is_edit_flow) {
			const address_fields = res?.address?.attributes;
			set_fields(address_fields);
			return;
		}
		set_fields(res?.attributes);
	};

	const initialize_cyber_source_form = (token: string) => {
		const flex = new (window as any).Flex(token);
		const myStyles = {
			input: {
				'font-size': '14px',
				'font-family': '"Roboto", "Helvetica", "Arial", sans-serif',
				color: colors.black_8,
				'box-shadow': 'none',
				':focus': {
					color: colors.black_8,
					'border-color': colors.primary_500,
				},
				':disabled': {
					cursor: 'not-allowed',
					'background-color': colors.light_grey,
				},
				valid: {
					color: colors.primary_500,
					'border-color': colors.primary_500,
				},
				invalid: {
					color: colors.red,
					'border-color': colors.red,
				},
			},
		};
		const microform = flex.microform({
			styles: { ...myStyles },
		});
		set_cyber_source_form(microform);
	};

	const handle_cyber_source_fields = (response: any) => {
		process_common_fields(response);
		if (is_edit_flow) {
			set_fields(response?.attributes);
		} else {
			const address_attrs = response?.address?.attributes;
			const card_attrs = response?.card?.attributes;
			set_step_fields(address_attrs);
			set_fields(card_attrs);
		}
	};

	const handle_pci_vault_fields = (response: any) => {
		process_common_fields(response);
		if (is_edit_flow) {
			set_fields(response?.attributes);
		} else {
			const address_attrs = response?.address?.attributes;
			const card_attrs = response?.card?.attributes?.map((item: any) => ({ ...item, disabled: false }));
			set_step_fields(card_attrs);
			set_fields(address_attrs);
		}
	};

	const handle_cyber_source_validations = useCallback((data: any, field: string) => {
		set_cyber_source_validations((prev) => ({
			...(prev || {}),
			[field]: data?.valid || false,
		}));
	}, []);

	const get_pci_secrets = async () => {
		try {
			const response: any = await api_requests.buyer.get_pci_vault_secrets(access_token, base_url);
			if (response?.status === 200) {
				const data = response?.data;
				set_pci_secrets(data);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		if (!cyber_source_form) return;
		const card_number = cyber_source_form.createField('number', {
			placeholder: 'Enter card number',
		});
		card_number.load('#number-container');
		card_number.on('change', (data: any) => handle_cyber_source_validations(data, 'card_number'));

		const cvv_field = cyber_source_form.createField('securityCode', {
			placeholder: 'Enter CVV',
		});
		cvv_field.load('#securityCode-container');
		cvv_field.on('change', (data: any) => handle_cyber_source_validations(data, 'cvv'));
	}, [cyber_source_form]);

	const handle_form_fields_by_gateway = (response: any) => {
		switch (payment_source) {
			case STAX:
				handle_stax_fields(response);
				break;
			case WORLDPAY:
				handle_worldpay_fields(response);
				break;
			case FINIX:
				handle_finix_fields(response);
				break;
			case CYBERSOURCE:
				handle_cyber_source_fields(response);
				break;
			case PCI_VAULT:
				handle_pci_vault_fields(response);
				break;
			default:
				break;
		}
	};

	const get_form = async () => {
		let payload: any = {};
		set_disable_save(true);
		if (source === 'buyer' || is_from_app) {
			payload = { flow: is_edit_flow ? 'edit' : 'add', payment_method_type: 'card' };
			if (is_edit_flow) {
				if (payment_source === STAX) {
					if (payment_method_id?.includes('temp') || source_id)
						payload = {
							...payload,
							source: payment_source,
							source_id: all_cards?.payment_method_ids?.find((i: any) => i?.id === payment_method_id)?.source_id || source_id,
						};
					// Editing newly added card
					else payload = { ...payload, buyer_id, payment_method_id };
				} else {
					payload = {
						...payload,
						provider: payment_source,
						payment_method_id,
					};
				}
			}
		} else if (source === 'collect_payment') {
			payload = { flow: 'add', payment_method_type: 'card' };
		}
		if (!customer_id && payment_source === STAX) {
			api_requests.buyer
				.get_random_customer_id(access_token, base_url)
				.then((res: any) => {
					if (res?.status === 200) {
						setCustomerId(res?.data?.customer_id);
					}
				})
				.catch((err) => {
					console.log(err);
				});
		}
		api_requests.buyer
			.get_add_card_form(payload, access_token, base_url)
			.then((res: any) => {
				if (res?.status === 200) {
					handle_form_fields_by_gateway(res);
				}
			})
			.catch((err) => {
				set_error(true);
				console.log(err);
			})
			.finally(() => {
				set_is_form_loading(false);
				if (is_edit_flow || payment_source === PCI_VAULT) {
					set_disable_save(false);
				}
			});
	};

	const handle_error_with_toast = (message = '') => {
		dispatch<any>(
			show_toast({
				open: true,
				showCross: false,
				anchorOrigin: {
					vertical: types.VERTICAL_TOP,
					horizontal: types.HORIZONTAL_CENTER,
				},
				autoHideDuration: 5000,
				onClose: (event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
					console.log(event);
					if (reason === types.REASON_CLICK) {
						return;
					}
					dispatch(close_toast(''));
				},
				state: types.ERROR_STATE,
				title: types.ERROR_TITLE,
				subtitle: message || 'Failed adding card, try again',
				showActions: false,
			}),
		);
	};

	// method to handle states after getting response from iframe
	const handle_add_card_worldpay = (res_data: any = {}) => {
		try {
			const { payment_method = {}, success } = res_data;
			set_show_redirecting(true);

			setTimeout(() => {
				set_show_redirecting(false);
				if (!is_from_app) {
					close();
				}
			}, 4000);

			if (!success) {
				if (!is_from_app) {
					close();
					handle_error_with_toast();
					return;
				}
			}
			const update_form_with_payment_method = (updated_data: any, id: string) => {
				try {
					handle_update_form && handle_update_form(`payment_methods.saved_payment_methods.${id}`, updated_data, 'saved_payment_methods');
				} catch (error) {
					console.error(error);
				}
			};

			const build_updated_data = () => ({
				id: payment_method?.id,
				payment_method_type: 'card',
				title: `Ending in ${payment_method?.last_four_digits}`,
				sub_title: `Expiry ${payment_method?.expiry_formatted}`,
				logo: CARD_URLS?.[payment_method?.card_scheme],
				card_type: payment_method?.card_type,
				is_default: true,
				is_selected: true,
				card_name: payment_method?.person_name,
				address_1: payment_method?.address_1,
				address_2: payment_method?.address_2,
				city: payment_method?.address_city,
				state: payment_method?.address_state,
				zip: payment_method?.address_zip,
				country: payment_method?.address_country,
			});

			if (source === 'buyer') {
				if (is_edit_flow) {
					const updated_form_data = {
						...all_cards?.saved_payment_methods?.[payment_method_id],
						address_1: payment_method?.address_1,
						address_2: payment_method?.address_2,
						city: payment_method?.city,
						state: payment_method?.state,
						country: payment_method?.country,
						zip: payment_method?.zip,
					};
					update_form_with_payment_method(updated_form_data, payment_method_id);
				} else {
					const updated_data = build_updated_data();
					try {
						handle_update_form &&
							handle_update_form('payment_methods.payment_method_ids', [...all_cards?.payment_method_ids, updated_data]);
						update_form_with_payment_method(updated_data, payment_method?.id);
					} catch (error) {
						console.error('Error updating form for new payment method:', error);
					}
				}
			}

			const confirm_action_app = (action: any, meta: any) => {
				try {
					handle_confirm && handle_confirm({ action, meta });
				} catch (error) {
					console.error(error);
				}
			};

			const app_action = payment_method?.is_duplicate ? 'edit' : 'add';
			if (is_from_app) {
				if (source === 'buyer') {
					confirm_action_app(app_action, {
						...payment_method,
						card_last_four: payment_method?.last_four_digits,
						card_type: payment_method?.card_scheme,
					});
				} else if (source === 'collect_payment') {
					const meta_data = {
						buyer_id,
						payment_method_id: payment_method?.id,
						payment_method_type: payment_method?.method || 'card',
						provider: payment_method?.provider || payment_source,
						card_type: payment_method?.card_scheme,
					};
					confirm_action_app(app_action, meta_data);
				}
			}
		} catch (error: any) {
			console.error(error);
			set_show_redirecting(false);
			if (!is_from_app) {
				close();
				handle_error_with_toast();
			} else {
				handle_confirm &&
					handle_confirm({
						action: 'add',
						is_modal_close: true,
						meta: {
							...error?.response?.data,
						},
					});
			}
		}
	};
	const handle_payment_address_rules = async () => {
		try {
			const rule_res: any = await settings.get_default_tenant_config('json_rule_payment_address', access_token, base_url);
			if (rule_res?.status_code === 200) {
				if (!_.isEmpty(rule_res?.data)) {
					set_address_rules(rule_res?.data);
				} else {
					set_address_rules(DEFAULT_JSON_RULE_PAYMENT_ADDRESS);
				}
			}
		} catch (error) {
			console.error(error, 'payment address rules error');
		}
	};

	useEffect(() => {
		get_form();
		if (is_from_app) {
			handle_payment_address_rules();
		}
		if (payment_source === PCI_VAULT && !is_edit_flow) {
			get_pci_secrets();
		}
	}, []);

	// event listener for worldpay response coming from the app
	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			try {
				// Check if the origin is as expected
				if (event.origin?.includes('https://payment-gateway-integration-brown.vercel.app')) {
					set_loading(false);
					// Attempt to parse the event data
					let parsed_data;
					if (typeof event.data === 'string') {
						parsed_data = JSON.parse(event.data);
					} else {
						parsed_data = event.data;
					}
					// Ensure the parsed data is valid
					if (parsed_data) {
						handle_add_card_worldpay(parsed_data);
					} else {
						console.error('Parsed data is invalid:', parsed_data);
					}
				}
			} catch (error) {
				// Handle any parsing errors
				console.error(error);
			}
		};

		window.addEventListener('message', handleMessage);

		return () => {
			window.removeEventListener('message', handleMessage);
		};
	}, []);

	useEffect(() => {
		if (staxJs) {
			staxJs?.showCardForm();

			staxJs?.on('card_form_complete', (message: any) => {
				console.log('completed', message, staxJs);
				set_disable_save(false);
				set_stax_validations({ number: message?.validNumber, cvv: message?.validCvv });
			});

			staxJs?.on('card_form_uncomplete', (message: any) => {
				console.log('uncompleted', message, staxJs);
				set_disable_save(true);
				set_stax_validations({ number: message?.validNumber, cvv: message?.validCvv });
			});
		}
	}, [staxJs]);

	useEffect(() => {
		const _state = getValues('state');
		if (_state !== '' && state_options?.length > 0) {
			if (_.indexOf(state_options, (state: any) => state?.value === _state) === -1) {
				const _temp = _.find(state_options, (state: any) => state?.value === _state);
				setValue('state', _temp?.value || '');
			}
		}
	}, [state_options]);

	const get_address_data = useMemo(() => {
		return {
			first_name: getValues('first_name'),
			last_name: getValues('last_name'),
			street_address: getValues('address_1'),
			address_line_2: getValues('address_2'),
			city: getValues('city'),
			state: getValues('state'),
			country: getValues('country'),
			pincode: getValues('zip'),
			email: getValues('email'),
			phone: getValues('phone'),
		};
	}, [iframe_url, cyber_source_form]);

	const handle_submit = async (data: any) => {
		set_loading(true);
		if (source === 'buyer') {
			if (is_edit_flow) {
				let payload = {
					...edit_data,
					attributes: {
						address_1: data?.address_1,
						address_2: data?.address_2,
						city: data?.city,
						country: data?.country,
						state: data?.state,
						zip: data?.zip,
					},
					source: payment_source || STAX,
				};
				const worldpay_payload = {
					id: payment_method_id,
				};
				if (is_from_app) {
					if (payment_method_id) {
						payload.payment_method_id = payment_method_id;
					}
					if (buyer_id) {
						payload.buyer_id = buyer_id;
					}
					if (customer_id) {
						payload.customer_id = customer_id;
					}
					if (source_id) {
						payload.source_id = source_id;
					}
					if (stepper_fields_gateways?.includes(payment_source)) {
						payload = { ...payload, ...worldpay_payload };
					}
				}

				api_requests.buyer
					.edit_payment_card_address(payload, access_token, base_url)
					.then((response: any) => {
						if (response?.status === 200) {
							if (is_from_app && handle_confirm) {
								handle_confirm({
									action: 'edit',
									meta: {
										...payload?.attributes,
										source_id: payload?.source_id,
										payment_method_id: payload?.payment_method_id,
										is_default: data?.is_primary,
										country_label: response?.country_label,
										state_label: response?.state_label,
										...(stepper_fields_gateways?.includes(payment_source) ? worldpay_payload : {}),
									},
								});
							} else {
								if (show_primary) {
									const primary_value = data?.is_primary ? data?.id : primary_card_id;
									handle_update_form && handle_update_form('payment_methods.default_payment_method_id', primary_value);
									delete data?.is_primary;
								}
								const temp = {
									...all_cards?.saved_payment_methods?.[payment_method_id],
									address_1: data?.address_1,
									address_2: data?.address_2,
									city: data?.city,
									state: data?.state,
									country: data?.country,
									zip: data?.zip,
									country_label: response?.country_label,
									state_label: response?.state_label,
								};
								handle_update_form && handle_update_form(`payment_methods.saved_payment_methods.${payment_method_id}`, temp);
							}
						}
					})
					.catch((err: any) => {
						console.error(err);
						if (is_from_app) {
							handle_confirm &&
								handle_confirm({
									action: 'edit',
									is_modal_close: true,
									meta: {
										...err?.response?.data,
									},
								});
						}
					})
					.finally(() => {
						close && close();
					});
			} else {
				const expiry = _.get(data, 'expiry', '');
				const parts = _.split(expiry, '/', 2);
				let extraDetails = {
					customer_id: customerId,
					total: 1,
					firstname: data?.first_name,
					lastname: data?.last_name,
					month: parts?.[0] || '01',
					year: `20${parts?.[1] || '01'}`,
					address_1: data?.address_1,
					address_2: data?.address_2,
					address_state: data?.state,
					address_city: data?.city,
					address_zip: data?.zip,
					address_country: data?.country,
					url: 'https://app.staxpayments.com/#/bill/',
					method: 'card',
					validate: false,
				};

				staxJs
					?.tokenize(extraDetails)
					.then((result: any) => {
						if (is_from_app && handle_confirm) {
							handle_confirm({
								action: 'add',
								meta: {
									...result,
									is_default: data?.is_primary,
								},
							});
						} else {
							if (show_primary) {
								const primary_value = data?.is_primary ? data?.id : primary_card_id;
								handle_update_form && handle_update_form('payment_methods.default_payment_method_id', primary_value);
								delete data?.is_primary;
							}
							const updatedData = {
								id: data?.id,
								source_id: result?.id,
								source: STAX,
							};
							const temp = {
								payment_method_type: 'card',
								payment_method_id: data?.id,
								title: `Ending in ${result?.card_last_four}`,
								sub_title: `Expiry ${data?.expiry}`,
								logo: CARD_URLS[result?.card_type],
								card_type: result?.card_type,
								is_default: true,
								is_selected: true,
								card_name: `${data?.first_name} ${data?.last_name}`,
								address_1: data?.address_1,
								address_2: data?.address_2,
								city: data?.city,
								state: data?.state,
								zip: data?.zip,
								country: data?.country,
							};
							handle_update_form && handle_update_form('payment_methods.customer_id', result?.customer_id);
							handle_update_form &&
								handle_update_form('payment_methods.payment_method_ids', [...all_cards?.payment_method_ids, updatedData]);
							handle_update_form && handle_update_form(`payment_methods.saved_payment_methods.${data?.id}`, temp);
						}
					})
					.then(() => {
						if (!is_from_app) {
							close();
						}
					})
					.catch((err: any) => {
						console.log(err);
						if (is_from_app) {
							handle_confirm &&
								handle_confirm({
									action: 'add',
									is_modal_close: true,
									meta: {
										...err?.response?.data,
									},
								});
						}
						close();
					});
			}
		} else if (source === 'collect_payment') {
			const expiry = _.get(data, 'expiry', '');
			const parts = _.split(expiry, '/', 2);
			let extraDetails = {
				customer_id: customerId,
				total: 1,
				firstname: data?.first_name,
				lastname: data?.last_name,
				month: parts?.[0] || '01',
				year: `20${parts?.[1] || '01'}`,
				address_1: data?.address_1,
				address_2: data?.address_2,
				address_state: data?.state,
				address_city: data?.city,
				address_zip: data?.zip,
				address_country: data?.country,
				url: 'https://app.staxpayments.com/#/bill/',
				method: 'card',
				validate: false,
			};

			staxJs
				?.tokenize(extraDetails)
				.then(async (result: any) => {
					const payload = {
						buyer_id,
						payment_method_id: result?.id,
						payment_method_type: 'card',
						customer_id: result?.customer_id,
						is_default: data?.is_primary ? true : false,
						provider: STAX,
					};
					const response: any = await api_requests.order_management.add_card(payload, access_token, base_url);

					if (response?.status === 200 && is_from_app && handle_confirm) {
						handle_confirm({
							action: 'add',
							meta: { ...payload },
						});
					}
				})
				.then(() => {
					if (!is_from_app) {
						close();
					}
				})
				.catch((err: any) => {
					console.log(err);
					if (!is_from_app) {
						close();
						handle_error_with_toast();
					} else {
						handle_confirm &&
							handle_confirm({
								action: 'add',
								is_modal_close: true,
								meta: {
									...err?.response?.data,
								},
							});
					}
				});
		}
	};

	const handle_cancel_delete = (is_cancel: boolean = false) => {
		if (is_edit_flow && !is_cancel) {
			set_show_modal(true);
			return;
		}
		close(false);
	};

	const handle_response_by_gateway = (response: any) => {
		switch (payment_source) {
			case WORLDPAY:
				const setup_id = response?.data?.transaction_setup_id;
				set_is_iframe_loading(true);
				set_active_step((prev) => prev + 1);
				const iframe_url_to_render = `https://payment-gateway-integration-brown.vercel.app/?transaction_setup_id=${encodeURIComponent(
					setup_id,
				)}`;
				set_iframe_url(iframe_url_to_render);
				break;
			case CYBERSOURCE:
				const { transaction_setup_id = '', payment_method_id: unique_id = '' } = response?.data || {};
				initialize_cyber_source_form(transaction_setup_id);
				set_cyber_source_unique_id(unique_id);
				set_step_fields(fields);
				set_active_step((prev) => prev + 1);
				break;
			default:
				break;
		}
	};

	const handle_stepper_next = async (data: any) => {
		try {
			set_loading(true);
			let payload: any = {
				buyer_id,
				first_name: data?.first_name,
				last_name: data?.last_name,
				address_1: data?.address_1,
				address_2: data?.address_2,
				country: data?.country,
				state: data?.state,
				city: data?.city,
				zip: data?.zip,
				provider: payment_source,
			};
			if (payment_source === CYBERSOURCE) {
				payload = {
					...payload,
					phone: data?.phone,
					email: data?.email,
				};
			}
			const response: any = await api_requests.buyer.get_transaction_setup_id(payload, access_token, base_url);
			if (response?.status === 200) {
				handle_response_by_gateway(response);
			}
		} catch (error) {
			console.error(error);
		} finally {
			set_loading(false);
		}
	};

	const save_finix_card = async (token: string) => {
		if (!token) return;
		const payload = {
			buyer_id,
			payment_method_id: token,
			payment_method_type: 'card',
			customer_id: '',
			is_default: getValues()?.is_primary,
			provider: payment_source,
		};
		try {
			const response: any = await api_requests.order_management.add_card(payload, access_token, base_url);
			set_finix_method_id(response?.id || token);
			const card_details = {
				card_number_label: response?.last_four_digits,
				expiry: response?.card_exp,
				card_holder_name: response?.person_name,
				logo: CARD_URLS?.[response?.card_scheme],
			};
			set_added_card_details(card_details);
			if (response?.status === 200 && is_from_app && handle_confirm) {
				handle_confirm({
					action: response?.is_duplicate ? 'edit' : 'add',
					is_modal_close: false, // to prevent closing iframe in app
					meta: {
						...response,
						is_default: payload?.is_default || false,
						card_last_four: response?.last_four_digits,
						card_type: response?.card_scheme,
					},
				});
			}

			if (source === 'buyer' || is_direct_payment_flow) {
				if (show_primary) {
					const primary_value = getValues()?.is_primary ? response?.id : primary_card_id;
					handle_update_form && handle_update_form('payment_methods.default_payment_method_id', primary_value);
				}
				const updated_data = {
					id: response?.id,
					source_id: response?.external_id,
					source: payment_source || FINIX,
				};
				const form_data = transform_form_data(response);
				handle_update_form &&
					handle_update_form('payment_methods.payment_method_ids', [...(all_cards?.payment_method_ids || []), updated_data]);
				handle_update_form && handle_update_form(`payment_methods.saved_payment_methods.${response?.id}`, form_data),
					'saved_payment_methods';
			}
			set_active_step((prev) => prev + 1);
			set_loading(false);
		} catch (error: any) {
			console.error(error);
			handle_error_with_toast();
			close();
			if (is_from_app) {
				handle_confirm &&
					handle_confirm({
						action: 'add',
						is_modal_close: true,
						meta: {
							...error?.response?.data,
						},
					});
			}
		} finally {
			set_loading(false);
		}
	};

	const handle_finix_tokenization = async () => {
		try {
			set_loading(true);
			const _env = VITE_APP_ENV === PRODUCTION ? LIVE : SANDBOX;
			finix_form?.submit(_env, web_token, (err: any, res: any) => {
				if (err) {
					console.error(err);
					set_loading(false);
					return;
				}
				const tokenData = res?.data || {};
				const token = tokenData?.id;
				save_finix_card(token);
			});
		} catch (error) {
			console.error(error);
		}
	};

	const handle_finix_update_address = async (data: any) => {
		try {
			set_loading(true);
			const payload = {
				buyer_id,
				payment_method_id: finix_method_id,
				payment_method_type: 'card',
				source: payment_source,
				attributes: {
					address_1: data?.address_1,
					address_2: data?.address_2,
					country: data?.country,
					state: data?.state,
					city: data?.city,
					zip: data?.zip,
				},
			};
			const response: any = await api_requests.buyer.edit_payment_card_address(payload, access_token, base_url);
			if (is_from_app && handle_confirm) {
				const { attributes, ...rest } = payload;
				handle_confirm({
					action: 'edit',
					meta: {
						...attributes,
						...rest,
						country_label: response?.country_label,
						state_label: response?.state_label,
					},
				});
			} else {
				const updated_form_data = {
					...(all_cards?.saved_payment_methods?.[payload?.payment_method_id || ''] || {}),
					address_1: data?.address_1,
					address_2: data?.address_2,
					city: data?.city,
					state: data?.state,
					country: data?.country,
					zip: data?.zip,
					country_label: response?.country_label,
					state_label: response?.state_label,
				};
				handle_update_form && handle_update_form(`payment_methods.saved_payment_methods.${payload?.payment_method_id}`, updated_form_data);
			}
		} catch (error: any) {
			console.error(error);
			if (is_from_app) {
				handle_confirm &&
					handle_confirm({
						action: 'edit',
						is_modal_close: true,
						meta: {
							...error?.response?.data,
						},
					});
			}
		} finally {
			set_loading(false);
			if (!is_from_app) {
				close(data);
			}
		}
	};

	const handle_cyber_source_submit = async (data: any) => {
		try {
			set_loading(true);
			const [exp_month, exp_year] = (getValues('expiry') as string).split('/');
			const formatted_exp_year = `20${exp_year}`;
			const options: { expirationMonth: string; expirationYear: string } = {
				expirationMonth: exp_month,
				expirationYear: formatted_exp_year,
			};
			// Wrapping the token creation in a Promise to use async/await
			const createToken = (form_options: { expirationMonth: string; expirationYear: string }) =>
				new Promise<string>((resolve, reject) => {
					cyber_source_form.createToken(form_options, (err: any, token: string) => {
						if (err) {
							reject(err);
						} else {
							resolve(token);
						}
					});
				});

			const token: string = await createToken(options);
			const payload = {
				buyer_id,
				payment_method_id: cyber_source_unique_id,
				payment_method_type: 'card',
				is_default: data?.is_primary ? true : false,
				provider: CYBERSOURCE,
				external_token: token,
			};
			const response: any = await api_requests.order_management.add_card(payload, access_token, base_url, false); // passing false to not show toast in case of errors as we're showing error modal in case of cybersource failure

			if (response?.status === 200 && is_from_app && handle_confirm) {
				handle_confirm({
					action: response?.is_duplicate ? 'edit' : 'add',
					meta: {
						...response,
						is_default: payload?.is_default || false,
						card_last_four: response?.last_four_digits,
						card_type: response?.card_scheme,
					},
				});
			}
			if (source === 'buyer') {
				if (show_primary) {
					const primary_value = getValues()?.is_primary ? response?.id : primary_card_id;
					handle_update_form && handle_update_form('payment_methods.default_payment_method_id', primary_value);
				}
				const updated_data = {
					id: response?.id,
					source_id: response?.external_id,
					source: CYBERSOURCE,
				};
				const form_data = transform_form_data(response);
				handle_update_form && handle_update_form('payment_methods.payment_method_ids', [...all_cards?.payment_method_ids, updated_data]);
				handle_update_form && handle_update_form(`payment_methods.saved_payment_methods.${response?.id}`, form_data);
			}
			if (!is_from_app) {
				set_loading(false);
				close();
			}
		} catch (error: any) {
			console.error(error);
			set_loading(false);
			if (!is_from_app) {
				const message = _.get(error, 'response.data.message');
				const reason_json = _.get(error, 'response.data.reason', null);
				const modal_data = {
					is_modal_visible: true,
					subtitle: message,
					reason: reason_json,
				};
				dispatch(set_error_modal_data(modal_data));
				close();
			} else {
				handle_confirm &&
					handle_confirm({
						action: 'add',
						is_modal_close: true, // to prevent closing iframe in app
						meta: {
							...error?.response?.data,
						},
					});
			}
		}
	};

	const handle_pci_update_address = async (data: any) => {
		try {
			set_loading(true);
			const payload = {
				buyer_id,
				payment_method_id: pci_method_id,
				payment_method_type: 'card',
				source: payment_source ?? PCI_VAULT,
				attributes: {
					address_1: data?.address_1,
					address_2: data?.address_2,
					country: data?.country,
					state: data?.state,
					city: data?.city,
					zip: data?.zip,
					card_holder: added_card_details?.card_holder_name,
					card_last_four_digits: added_card_details?.last_four,
					card_expiry: added_card_details?.expiry,
					card_scheme: added_card_details?.card_type,
				},
			};
			const response: any = await api_requests.buyer.edit_payment_card_address(payload, access_token, base_url);
			if (is_from_app && handle_confirm) {
				const { attributes, ...rest } = payload;
				handle_confirm({
					action: 'edit',
					meta: {
						...attributes,
						...rest,
						country_label: response?.country_label,
						state_label: response?.state_label,
					},
				});
			} else {
				if (source === 'buyer') {
					const updated_data = {
						id: pci_add_response?.id,
						source_id: pci_add_response?.external_id,
						source: payment_source ?? PCI_VAULT,
					};
					handle_update_form &&
						handle_update_form('payment_methods.payment_method_ids', [...(all_cards?.payment_method_ids || []), updated_data]);
					if (show_primary) {
						const primary_value = data?.is_primary ? payload?.payment_method_id : primary_card_id;
						handle_update_form && handle_update_form('payment_methods.default_payment_method_id', primary_value);
					}
				}
				const form_data = transform_pci_form_data({ ...(pci_add_response || {}), ...added_card_details });
				const updated_form_data = {
					...(all_cards?.saved_payment_methods?.[payload?.payment_method_id || ''] || {}),
					...form_data,
					address_1: data?.address_1,
					address_2: data?.address_2,
					city: data?.city,
					state: data?.state,
					country: data?.country,
					zip: data?.zip,
					country_label: response?.country_label,
					state_label: response?.state_label,
					payment_method_id: payload?.payment_method_id,
				};
				handle_update_form && handle_update_form(`payment_methods.saved_payment_methods.${payload?.payment_method_id}`, updated_form_data);
			}
		} catch (error: any) {
			console.error(error);
			if (is_from_app) {
				handle_confirm &&
					handle_confirm({
						action: 'edit',
						is_modal_close: true,
						meta: {
							...error?.response?.data,
						},
					});
			}
		} finally {
			set_loading(false);
			if (!is_from_app) {
				close(data);
			}
		}
	};

	const handle_next_action = () => {
		if (is_edit_flow) {
			handleSubmit(handle_submit)();
			return;
		}
		switch (payment_source) {
			case STAX:
				handleSubmit(handle_submit)();
				break;
			case WORLDPAY:
				if (active_step === 0) {
					handleSubmit(handle_stepper_next)();
				}
				break;
			case FINIX:
				if (active_step === 0) {
					handle_finix_tokenization();
				} else if (active_step === 1) {
					handleSubmit(handle_finix_update_address)();
				}
				break;
			case CYBERSOURCE:
				if (active_step === 0) {
					handleSubmit(handle_stepper_next)();
				} else {
					handleSubmit(handle_cyber_source_submit)();
				}
				break;
			case PCI_VAULT:
				if (active_step === 1) {
					handleSubmit(handle_pci_update_address)();
				}
				break;
			default:
				break;
		}
	};

	const handle_selected_place = (data: any) => {
		setValue('address_1', data?.address_1);
		setValue('address_2', data?.address_2);
		setValue('state', data?.state?.key);
		setValue('city', data?.city);
		setValue('zip', data?.zip_code);
	};

	const calculated_height = useMemo(() => {
		const extra_row = window.innerHeight <= 768 ? 45 : 0;
		if (window.innerHeight <= 768) {
			return '90vh';
		}
		const _height = `${parseInt(height.slice(0, -2)) - 160 - extra_row}px`;
		return _height;
	}, [height]);

	const form_styles = () => {
		return {
			height: is_edit_flow ? '70vh' : '55vh',
			maxHeight: height === '90%' ? '70vh' : calculated_height,
			overflowY: 'scroll',
			overflowX: 'hidden',
			'&::-webkit-scrollbar': {
				width: '0',
			},
		};
	};

	const get_add_card_footer_cta_text = () => {
		if (is_edit_flow) {
			return 'Update';
		}
		if (is_stepper_field || [FINIX, PCI_VAULT].includes(payment_source)) {
			return active_step === 0 ? 'Next' : 'Save';
		}
		return is_from_app ? 'Add' : 'Add card';
	};

	const handle_render_checkbox = () => {
		if (
			(payment_source === CYBERSOURCE && active_step !== 1 && !is_edit_flow) ||
			(is_stepper_field && payment_source !== CYBERSOURCE) ||
			(payment_source === FINIX && active_step === 1)
		) {
			return null;
		}

		const is_default_card_selected = isString(payment_method_id) && payment_method_id === primary_card_id;

		return (
			<Box style={{ visibility: show_primary ? 'visible' : 'hidden', textWrap: 'nowrap' }}>
				<FormProvider {...methods}>
					<CheckboxEditField
						color={
							(all_cards?.payment_method_ids?.length === 0 ||
								payment_method_id === primary_card_id ||
								is_default ||
								is_first_payment_method) &&
							!is_from_app
								? theme?.payments?.add_payment_modal?.disabled
								: ''
						}
						name='is_primary'
						key='is_primary'
						defaultValue={all_cards?.payment_method_ids?.length === 0 ? true : is_default ? true : is_default_card_selected}
						checkbox_value={true}
						label={is_from_app ? `${t('Payment.MarkAsDefault')}` : `${t('Payment.MarkCardAsDefault')}`}
						disabled={
							((is_first_payment_method || is_default) && is_from_app) ||
							((all_cards?.payment_method_ids?.length === 0 || is_default_card_selected) &&
								((source === 'buyer' && !is_from_app) || source === 'collect_payment'))
						}
					/>
				</FormProvider>
			</Box>
		);
	};

	const handle_render_footer = () => {
		if (
			(is_stepper_field && active_step === 1 && payment_source !== CYBERSOURCE) ||
			(!is_edit_flow && payment_source === PCI_VAULT && active_step === 0)
		)
			return null;
		return (
			<React.Fragment>
				{window.innerWidth <= 768 && <Grid display='flex'>{handle_render_checkbox()}</Grid>}
				<Grid display={'flex'} justifyContent={'space-between'} sx={{ background: 'white' }}>
					{window.innerWidth > 768 && handle_render_checkbox()}

					<Grid
						display='flex'
						width={window.innerWidth > 768 ? 'auto' : '100%'}
						justifyContent={'space-between'}
						marginLeft={window.innerWidth > 768 ? 'auto' : 'none'}
						pb={1}>
						{is_edit_flow ? (
							<React.Fragment>
								{payment_delete_permission && (
									<Can I={PERMISSIONS.delete_payment.slug} a={PERMISSIONS.delete_payment.permissionType}>
										<Button
											onClick={() => handle_cancel_delete()}
											sx={{ marginRight: '1rem' }}
											variant='outlined'
											width={window.innerWidth > 768 ? 'auto' : '50%'}>
											Delete
										</Button>
									</Can>
								)}
								{!_.find(user_permissions, { slug: 'delete_payment_method' })?.toggle && payment_delete_permission && (
									<Button
										onClick={() => handle_cancel_delete(is_from_app ? false : true)}
										sx={{ marginRight: '1rem' }}
										variant='outlined'
										width={window.innerWidth > 768 ? 'auto' : '50%'}>
										{is_from_app ? 'Delete' : 'Cancel'}
									</Button>
								)}
							</React.Fragment>
						) : (
							<Button
								onClick={() => handle_cancel_delete(true)}
								sx={{ marginRight: '1rem' }}
								variant='outlined'
								width={window.innerWidth > 768 ? 'auto' : '50%'}>
								Cancel
							</Button>
						)}
						<Button
							loading={loading}
							onClick={handle_next_action}
							type='submit'
							disabled={disable_save}
							width={window.innerWidth > 768 ? 'auto' : '50%'}>
							{get_add_card_footer_cta_text()}
						</Button>
					</Grid>
				</Grid>
			</React.Fragment>
		);
	};

	const render_form_fields = (form_fields: any) => {
		return (
			<React.Fragment>
				<FormProvider {...methods}>
					<Grid sx={form_styles()}>
						<Grid container width={0} height={0} visibility='hidden' flexDirection='row' gap={2.5}>
							<FormBuilder
								placeholder={'id'}
								label={'id'}
								name={'id'}
								validations={{ required: true }}
								// defaultValue={is_edit_flow ? payment_method_id || source_id || '' : distinct_id}
								type={'text'}
							/>
						</Grid>
						<Grid display={'flex'} flexWrap={'wrap'} gap={'16px'} mt={payment_source === PCI_VAULT ? 1 : 0} pb={3}>
							<PaymentFields
								fields={form_fields}
								is_edit_flow={is_edit_flow}
								stax_validations={stax_validations}
								is_from_app={is_from_app}
								width={width}
								all_address={all_address}
								get_states={get_states}
								control={control}
								set_copy_modal={set_copy_modal}
								copy_modal={copy_modal}
								handle_selected_place={handle_selected_place}
								getValues={getValues}
								country={country}
								watch={watch}
								state_options={state_options}
								methods={methods}
								setValue={setValue}
								payment_source={payment_source}
								active_step={active_step}
								added_card_details={added_card_details}
								cyber_source_validations={cyber_source_validations}
							/>
						</Grid>
					</Grid>
				</FormProvider>
			</React.Fragment>
		);
	};

	const iframe_loading_skeleton = () => (
		<Grid mt={1}>
			<Skeleton height={80} />
			<Box display='flex' justifyContent='space-between'>
				<Skeleton height={80} width={'48%'} />
				<Skeleton height={80} width={'48%'} />
			</Box>
			<Box display='flex' justifyContent='flex-end' mt={1}>
				<Skeleton width={90} height={60} />
			</Box>
		</Grid>
	);

	const redirect_component = () => (
		<Grid>
			<Box display='flex' justifyContent='center' alignItems='center' height='100%'>
				<Lottie
					options={{
						loop: true,
						autoplay: true,
						animationData: LoaderLottie,
						rendererSettings: {
							preserveAspectRatio: 'xMidYMid slice',
						},
					}}
					height={100}
					width={200}
				/>
			</Box>
			<Grid textAlign='center'>
				<CustomText type='H6'>Redirecting ...</CustomText>
			</Grid>
		</Grid>
	);

	const render_card_fields = iframe_url && (
		<Grid>
			{!show_redirecting && (
				<AddressCard
					item={get_address_data}
					on_card_press={() => {}}
					address_country_options={address_country_options}
					access_token={access_token}
					base_url={base_url}
				/>
			)}
			{is_iframe_loading && iframe_loading_skeleton()}
			<iframe
				src={iframe_url}
				style={{ border: 'none' }}
				width={'100%'}
				height={show_redirecting ? 90 : 210}
				onLoad={() => set_is_iframe_loading(false)}
				onError={() => set_is_form_loading(false)}
			/>
			{show_redirecting && redirect_component()}
		</Grid>
	);

	const render_stepper_content = (form_fields: any) => {
		switch (payment_source) {
			case WORLDPAY:
				return active_step === 1 ? render_card_fields : render_form_fields(form_fields);
			case CYBERSOURCE:
				if (active_step === 1) {
					return (
						<>
							<AddressCard
								item={get_address_data}
								on_card_press={() => {}}
								address_country_options={address_country_options}
								access_token={access_token}
								base_url={base_url}
							/>
							{render_form_fields(form_fields)}
						</>
					);
				} else {
					return render_form_fields(form_fields);
				}
			default:
				return null;
		}
	};

	const form_fields_with_stepper = (form_fields: any) => {
		return (
			<React.Fragment>
				<Grid container mb={2} justifyContent='center' display='flex'>
					{!show_redirecting && (
						<Stepper
							steps={payment_stepper_steps}
							activeStep={active_step}
							sx={{
								...common_stepper_styles,
							}}
						/>
					)}
				</Grid>
				{render_stepper_content(form_fields)}
			</React.Fragment>
		);
	};

	const common_stepper_renderer = (
		<Grid container display='flex' justifyContent='center' mb={2}>
			<Stepper steps={finix_stepper_steps} activeStep={active_step} sx={{ ...common_stepper_styles }} />
		</Grid>
	);

	const render_with_stepper = (content: JSX.Element) => (
		<>
			{common_stepper_renderer}
			{content}
		</>
	);

	const finix_form_render = (form_fields: any) =>
		render_with_stepper(
			active_step === 0 ? (
				<FinixForm height={height} set_disable_save={set_disable_save} set_finix_form={set_finix_form} is_from_app={is_from_app} />
			) : (
				render_form_fields(form_fields)
			),
		);

	const handle_pci_token_success = async (res: any) => {
		try {
			const payload: any = {
				buyer_id,
				payment_method_id: res?.token,
				payment_method_type: 'card',
				customer_id: res?.reference,
				provider: PCI_VAULT,
			};
			const response: any = await api_requests.order_management.add_card(payload, access_token, base_url);
			if (response && response?.status === 200) {
				set_pci_add_response(response);
				set_pci_method_id(response?.id || res?.token);
				const card_data: any = await get_retrieved_card_data(response);
				const card_details = {
					...(card_data || {}),
					card_number_label: card_data?.last_four,
					expiry: card_data?.expiry,
					card_holder_name: card_data?.card_holder,
					logo: CARD_URLS?.[card_data?.card_type],
				};
				set_added_card_details(card_details);
				if (is_from_app && handle_confirm) {
					handle_confirm({
						action: response?.is_duplicate ? 'edit' : 'add',
						is_modal_close: false, // to prevent closing iframe in app
						meta: {
							...response,
							is_default: payload?.is_default || false,
							card_last_four: card_data?.last_four,
							card_type: card_data?.card_type,
						},
					});
				}
				set_active_step(1);
			}
		} catch (error: any) {
			console.error(error);
			if (is_from_app) {
				handle_confirm &&
					handle_confirm({
						action: 'add',
						is_modal_close: true,
						meta: {
							...error?.response?.data,
						},
					});
			} else {
				const message = _.get(error, 'response.data.message');
				const reason_json = _.get(error, 'response.data.reason', null);
				const modal_data = {
					is_modal_visible: true,
					subtitle: message,
					reason: reason_json,
				};
				dispatch(set_error_modal_data(modal_data));
				close();
			}
		}
	};

	const pci_form_renderer = () =>
		render_with_stepper(
			active_step === 0 ? (
				<PCIFormRenderer pci_secrets={pci_secrets} on_token_success={handle_pci_token_success} />
			) : (
				render_form_fields(fields)
			),
		);

	const handle_render_drawer_content = () => {
		switch (payment_source) {
			case STAX:
				return render_form_fields(fields);
			case WORLDPAY:
			case CYBERSOURCE:
				if (is_edit_flow) return render_form_fields(fields);
				return form_fields_with_stepper(step_fields);
			case FINIX:
				if (is_edit_flow) return render_form_fields(fields);
				return finix_form_render(fields);
			case PCI_VAULT:
				if (is_edit_flow) return render_form_fields(fields);
				return pci_form_renderer();
			case PAYFABRIC:
				return (
					<PayfabricForm
						buyer_id={buyer_id}
						base_url={base_url}
						is_from_app={is_from_app}
						is_edit_flow={is_edit_flow}
						show_primary={show_primary}
						access_token={access_token}
						primary_card_id={primary_card_id}
						payment_source={payment_source ?? PAYFABRIC}
						payment_method_id={payment_method_id}
						from_buyer_page={source === 'buyer'}
						payment_method_ids={payment_method_ids}
						close={close}
						handle_confirm={handle_confirm}
						handle_add_edit_card_payment={handle_add_edit_card_payment}
						handle_update_form={handle_update_form}
					/>
				);
			default:
				return render_form_fields(fields);
		}
	};

	const handle_delete_card = () => {
		if (is_from_app && handle_confirm) {
			handle_confirm({
				action: 'delete',
				meta: { payment_method_id, source_id },
			});
		} else {
			delete_card && delete_card(payment_method_id);
			close();
		}
	};

	const handle_copied_address = (address: any) => {
		const copied_country = _.get(address, 'country', DEFAULT_COUNTRY);
		const country_value = _.isEmpty(copied_country) ? DEFAULT_COUNTRY : copied_country;
		get_states({ target: { value: _.toUpper(country_value) } });
		const new_address = utils.get_copied_address({ config: address_rules, address, state_options });
		const _address: any = {
			...getValues(),
			id: is_edit_flow ? payment_method_id : distinct_id,
			...new_address,
			country: _.isEmpty(new_address?.country) ? DEFAULT_COUNTRY : new_address?.country,
		};
		reset(_address);
		set_copy_modal(false);
	};

	const handle_render_copy_modal_content = () => {
		const relevantKeys = ['city', 'state', 'country', 'pincode', 'street_address'];
		const updated_addresses = _.uniqWith(all_address, (a, b) => {
			return _.isEqual(_.pick(a, relevantKeys), _.pick(b, relevantKeys));
		});

		return (
			<Grid
				m={1}
				minHeight={'70vh'}
				display='flex'
				direction='column'
				gap={1.6}
				sx={{
					overflowY: 'scroll',
					'&::-webkit-scrollbar': {
						width: '0',
					},
				}}
				maxHeight={'70vh'}>
				<CustomText type='Body' color={theme?.payments?.add_payment_modal?.disabled}>
					<Trans i18nKey='Payment.ShowingAddress' count={(updated_addresses?.length || 0) <= 1 ? 1 : updated_addresses?.length}>
						Showing {updated_addresses?.length} address
					</Trans>
				</CustomText>
				{_.map(updated_addresses, (addr_item, addr_index) => {
					if (_.isEmpty(addr_item)) return;
					return (
						<Box mb={1} sx={{ cursor: 'pointer' }}>
							<AddressCard
								key={`addr_card_${addr_index}`}
								item={addr_item}
								on_card_press={() => handle_copied_address(addr_item)}
								address_country_options={address_country_options}
								access_token={access_token}
								base_url={base_url}
							/>
						</Box>
					);
				})}
			</Grid>
		);
	};

	const get_finix_form_height = () =>
		(is_edit_flow ? height : active_step === 0 ? 'max-content' : active_step === 1 ? 'max-content' : '100%');

	const get_modal_height = () => {
		if (payment_source === CYBERSOURCE && active_step === 0) return 'max-content';
		if (payment_source === CYBERSOURCE && active_step === 1) return '67vh';
		if (is_stepper_field && active_step === 1) return 'max-content';
		if (payment_source === PCI_VAULT && active_step === 0 && !is_edit_flow) return '95%';
		return payment_source === FINIX ? get_finix_form_height() : 'max-content';
	};

	return (
		<>
			<Modal
				container_style={{ background: theme?.payment?.add_payment_modal?.primary }}
				width={is_small_screen ? width - 100 : width}
				_height={height}
				open={copy_modal}
				onClose={() => set_copy_modal(false)}
				title={'Copy address from'}
				children={handle_render_copy_modal_content()}
			/>

			<Modal
				key='card_modal'
				width={is_small_screen ? width - 100 : width}
				_height={get_modal_height()}
				container_style={
					is_stepper_field && active_step === 1
						? { maxHeight: '430px', background: theme?.payment?.add_payment_modal?.primary }
						: { paddingBottom: is_small_screen ? '8rem' : '4rem', background: theme?.payment?.add_payment_modal?.primary }
				}
				open={is_visible}
				onClose={() => close()}
				title={`${is_edit_flow ? 'Edit' : 'Add'} card`}
				footer={!is_form_loading && !is_error && payment_source !== PAYFABRIC && handle_render_footer()}
				children={
					is_form_loading ? (
						<PaymentDrawerSkeleton width={width} height={calculated_height} />
					) : is_error ? (
						<ErrorPage is_modal={true} />
					) : (
						handle_render_drawer_content()
					)
				}
				is_clickoutside_to_close={is_clickoutside_to_close}
			/>
			<Modal
				width={width - 40}
				key='delete_modal'
				_height={height === '90%' ? 'auto' : '215px'}
				open={show_modal}
				onClose={() => set_show_modal(false)}
				title={'Delete card'}
				footer={
					<Grid container justifyContent='flex-end' gap={2} mb={1.5}>
						<Button variant='outlined' onClick={() => set_show_modal(false)}>
							{t('Common.AddPaymentModal.Cancel')}
						</Button>
						<Button onClick={handle_delete_card}>{t('Common.AddPaymentModal.Delete')}</Button>
					</Grid>
				}
				children={<CustomText type='Body'>{t('Common.AddPaymentModal.ConfirmDelete')}</CustomText>}
			/>
		</>
	);
};

const AddPaymentModal = (props: Props) => {
	const { is_visible } = props;
	if (!is_visible) {
		return null;
	}
	return <AddPaymentComp {...props} />;
};

export default AddPaymentModal;
