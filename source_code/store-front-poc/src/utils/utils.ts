/* eslint-disable */
import _ from 'lodash';
import jsonLogic from 'json-logic-js';
import { AxiosRequestConfig } from 'axios';
import mocks from './mocks/mocks';
import AuthorizedRequests from 'src/utils/AuthorizedRequests';
import store from 'src/store';
import { set_cart } from 'src/actions/buyer';
import { close_toast, show_toast } from 'src/actions/message';
import types from './types';
import naylas_config from './api_requests/email_config';
import { nylas_clear, nylas_config } from 'src/actions/nylas';
import constants from './constants';
import { TABLE_CONSTANTS } from 'src/common/@the-source/molecules/Table/constants';
import RouteNames from './RouteNames';
import { document } from 'src/screens/OrderManagement/mock/document';
import { parsePhoneNumber } from 'awesome-phonenumber';
import { t } from 'i18next';
import { currency_number_format_no_sym, formatNumberWithCommas, get_formatted_price_with_currency } from './common';
import { Attribute, DocumentEntity, FormValuesObj, MappedAddressContact } from 'src/@types/common_types';
import { CountryISOData } from './countryISO';
import { DOCUMENT_LEVEL_ATTRS_KEY_MAP } from 'src/screens/OrderManagement/constants';
import { colors } from './theme';
import { secondary } from './light.theme';
import { Product } from 'src/screens/ProductListing/mock/ProductInterface';
import { PRODUCT_DETAILS_TYPE } from 'src/screens/ProductDetailsPage/constants';
import TIMEZONES from './timezone';
const { VITE_APP_ENV } = import.meta.env;
import { useTheme } from '@mui/material/styles';

const { CATALOG_STATUS_KEYS } = constants;
interface Request_Props extends AxiosRequestConfig {
	show_error?: boolean;
	mock_id?: string;
	mock?: boolean;
	cancel_token?: { cancel: Function };
	response_array?: boolean;
	show_custom_error_title?: boolean;
	// base?: string; // [Suyash] remove this later, added temp for User Management
}

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
interface Customer_Metadata_Props {
	catalog_name?: string;
	linked_catalog_name?: string;
	is_loggedin?: boolean;
	tenant_name?: string;
}

const utils = {
	request: ({
		show_error = true,
		response_array = false,
		mock_id,
		mock,
		cancel_token = { cancel: () => {} },
		show_custom_error_title = false,
		// base = '',
		...config
	}: Request_Props) => {
		return new Promise(async (resolve, reject) => {
			try {
				cancel_token.cancel = () => {
					resolve(null);
				};

				if (mock_id && mock) {
					return resolve(mocks[mock_id]);
				}

				const res = await AuthorizedRequests.request(config);

				if (response_array) return resolve({ data: res?.data, status: res?.status });

				return resolve({ ...(res?.data || {}), status: res?.status });
			} catch (error: any) {
				console.log('error', error);
				if (error?.response && error?.response?.status === 401) {
					setTimeout(() => {
						// localStorage.clear(); // <-- add your var
						//   window.location('/'); // <-- add your path
						localStorage.clear();
						sessionStorage.clear();
						localStorage.setItem('logout-event', `logout${Math.random()}`);
					}, 3000);
				}

				if (show_error) {
					if (error?.response?.status === 404 || error?.response?.status === 400) {
						const { data } = error?.response;

						const error_codes = [
							'CART__NOT_FOUND',
							'CATEGORY__NOT_FOUND',
							'CART_PRODUCT__NOT_FOUND',
							'CART_NOT_OPEN',
							'CART_IS_NOT_GUEST_CART',
						];

						if (_.indexOf(error_codes, data.error_code) >= 0) {
							const buyer: any = _.get(store.getState(), 'buyer');

							store.dispatch<any>(set_cart({ buyer_id: buyer?.buyer_id, is_guest_buyer: buyer?.is_guest_buyer }));

							store.dispatch<any>(
								show_toast({
									open: true,
									showCross: false,
									anchorOrigin: {
										vertical: types.VERTICAL_TOP,
										horizontal: types.HORIZONTAL_CENTER,
									},
									autoHideDuration: 3000,
									onClose: (event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
										console.log(event);
										if (reason === types.REASON_CLICK) {
											return;
										}
										store.dispatch(close_toast(''));
									},
									state: types.WARNING_STATE,
									title: 'Refreshing cart',
									subtitle: 'Please wait.',
									showActions: false,
								}),
							);
						} else if (error?.response?.data?.message !== 'catalog not found') {
							const default_title = "Oops! It's not you, it's us.";
							const error_res_title = _.get(error, 'response.data.title', '');
							const title = show_custom_error_title && error_res_title ? error_res_title : default_title;
							store.dispatch<any>(
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
										store.dispatch(close_toast(''));
									},
									state: types.WARNING_STATE,
									title,
									subtitle: `${show_custom_error_title ? '' : `Error ${error?.response?.status}:`} ${
										error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong!'
									}`,
									showActions: false,
									capitalize_subtitle: !show_custom_error_title,
								}),
							);
						}
					} else {
						// store.dispatch<any>(
						// 	show_toast({
						// 		open: true,
						// 		showCross: false,
						// 		anchorOrigin: {
						// 			vertical: types.VERTICAL_TOP,
						// 			horizontal: types.HORIZONTAL_CENTER,
						// 		},
						// 		autoHideDuration: 5000,
						// 		onClose: (event: React.ChangeEvent<HTMLInputElement>, reason: String) => {
						// 			console.log(event);
						// 			if (reason === types.REASON_CLICK) {
						// 				return;
						// 			}
						// 			store.dispatch(close_toast(''));
						// 		},
						// 		state: types.WARNING_STATE,
						// 		title: "Oops! It's not you, it's us.",
						// 		subtitle: `Error ${error?.response?.status}: ${
						// 			error?.response?.data?.message ? error?.response?.data?.message : 'Something went wrong!'
						// 		}`,
						// 		showActions: false,
						// 	}),
						// );
						// @todo: 500 error case
					}
					// @todo show error
				}

				return reject(error);
			}
		});
	},

	//TODO: refactor this later
	get_reordered_column_config: (column_def: any, columnState: any) => {
		const completed_order: any = [];
		let updated_config: any = _.map(column_def, (group: any) => {
			completed_order.push(group?.field);
			if (group?.children) {
				let parent_ind = 0;

				let children = _.map(group?.children, (child: any, ind: number) => {
					if (!_.includes(completed_order, child?.field)) {
						const index = _.findIndex(columnState, { colId: child?.field });
						if (ind === 0) parent_ind = index;
						completed_order.push(child?.field);
						return { ...child, priority: index };
					} else {
						const count = _.countBy(completed_order, (o) => o === child?.field).true;
						const index = _.findIndex(columnState, { colId: `${child?.field}_${count}` });
						if (ind === 0) parent_ind = index;
						completed_order.push(child?.field);
						return { ...child, priority: index };
					}

					// }
				});

				children = _.sortBy(children, ['priority']);
				return { ...group, children, priority: parent_ind };
			} else {
				const index = _.findIndex(columnState, { colId: group?.field });
				return { ...group, priority: index };
			}
		});

		updated_config = _.sortBy(updated_config, ['priority']);

		updated_config = _.map(updated_config, (group: any, index: number) => {
			if (group?.children) {
				const children = _.map(group?.children, (child: any, ind: number) => {
					return { ...child, priority: ind };
				});

				return { ...group, children };
			}
			return { ...group, priority: index };
		});

		return updated_config;
	},

	format_price_range: (_temp: any, _keys: any[], currency: string, price: any, min: number, max: number) => {
		let new_temp = _.cloneDeep(_temp);

		const formatted_price =
			min >= max
				? get_formatted_price_with_currency(currency, price)
				: `${get_formatted_price_with_currency(currency, min)} - ${get_formatted_price_with_currency(currency, max)}`;

		for (const key_item of _keys || []) {
			// eslint-disable-next-line no-prototype-builtins
			if (new_temp && new_temp?.hasOwnProperty(key_item)) {
				if (_.isEqual(key_item, 'final_range')) {
					new_temp = formatted_price;
				} else {
					new_temp = new_temp[key_item];
				}
			} else {
				new_temp = undefined;
				if (_.isEqual(key_item, 'final_range') || _.isEqual(key_item, 'variant_price_range') || _.isEqual(key_item, 'pricing')) {
					new_temp = formatted_price;
				}
				break;
			}
		}

		return new_temp;
	},

	format_price: (value: number, validate_decimal = true) => {
		const has_decimal = value - Math.floor(value) > 0;
		if (validate_decimal) {
			return has_decimal ? formatNumberWithCommas(currency_number_format_no_sym(value), true) : value;
		} else {
			return formatNumberWithCommas(currency_number_format_no_sym(value), true);
		}
	},

	transform_column_display: (column: any, product: any, product_price?: any) => {
		const _keys = column?.key ? column?.key?.split('::') : column?.split('::');
		let _temp = JSON.parse(JSON.stringify(product));
		const currency = _.get(_temp, 'pricing.currency', '$');
		const price = product_price ?? _.get(_temp, 'pricing.price', 0);

		const min = _.get(_temp, 'pricing.variant_price_range.min_value', 0);
		const max = _.get(_temp, 'pricing.variant_price_range.max_value', 0);

		if (_keys?.includes('pricing')) {
			return get_formatted_price_with_currency(currency, price);
		}

		_temp = utils.format_price_range(_temp, _keys, currency, price, min, max);

		if (_keys[0] === 'pricing' && _keys[1] === 'price') {
			return get_formatted_price_with_currency(currency, _temp);
		}
		return _temp || '';
	},

	get_column_display_value: (column: any, product: any, price: any, data_values: any) => {
		const is_price = column?.type === 'price';
		const _keys = !is_price ? (column?.key ? column?.key?.split('::') : column?.split('::')) : utils.get_price_keys(column, data_values);

		let _temp = JSON.parse(JSON.stringify(product));
		const currency = _.get(product, 'pricing.currency', '$');

		const min = _.get(_temp, 'pricing.variant_price_range.min_value', 0);
		const max = _.get(_temp, 'pricing.variant_price_range.max_value', 0);

		if (!is_price && _keys?.includes('pricing')) {
			return min === max
				? `${get_formatted_price_with_currency(currency, price)}`
				: `${get_formatted_price_with_currency(currency, _.floor(min))} - 
					${get_formatted_price_with_currency(currency, _.ceil(max))}`;
		}

		_temp = utils.format_price_range(_temp, _keys, currency, price, min, max);

		if (is_price && _keys.includes('price')) {
			_temp = `${get_formatted_price_with_currency(currency, _temp)}`;
		}

		return _temp || '';
	},

	get_icon_info: (status: string) => {
		let stateType = status?.toLowerCase();
		switch (stateType) {
			case 'complete':
				return { icon_name: 'IconCircleCheck', color: '#7DA50E' };
			case 'partial':
				return { icon_name: 'IconCircleHalf2', color: '#676D77' };
			default:
				return { icon_name: '', color: 'black' };
		}
	},
	get_chip_color_by_tag: (status: string) => {
		let stateType = status?.toLowerCase();
		const theme: any = useTheme();
		switch (stateType) {
			case 'quote':
			case 'captured':
				return { textColor: '#16885F', bgColor: '#E8F3EF' };
			case 'order':
				return { textColor: 'white', bgColor: '#97B73E' };
			case 'yes':
				return { textColor: '#FFFFFF', bgColor: '#97B73E' };
			case 'no':
				return { textColor: 'black', bgColor: '#D1D6DD' };
			case 'self':
			case 'self with assigned':
				return { textColor: 'black', bgColor: '#f9dfac' };
			case 'all':
				return { textColor: 'black', bgColor: '#e5edcf' };
			case 'paid':
				return { textColor: '#5B7C00', bgColor: '#F2F6E7' };
			case 'pull':
			case 'invoice':
				return { textColor: '#4578C4', bgColor: '#F0F6FF' };
			case 'not_paid':
				return { textColor: '#D74C10', bgColor: '#FBEDE7' };
			case 'completed':
			case 'success':
				return { textColor: 'rgba(22, 136, 95, 1)', bgColor: 'rgba(232, 243, 239, 1)' };
			case 'not-paid':
			case 'refunded':
			case 'authorized':
				return { textColor: 'rgba(107, 166, 254, 1)', bgColor: 'rgba(240, 246, 255, 1)' };
			case 'partially-paid':
			case 'partially_paid':
			case 'partially paid':
				return { textColor: 'rgba(152, 119, 222, 1)', bgColor: 'rgba(239, 231, 255, 1)' };
			case 'payment pending':
			case 'due-paid':
			case 'pending':
			case 'voided':
			case 'push':
				return { textColor: '#CE921E', bgColor: '#FEF7EA' };
			case 'failed':
				return { textColor: 'rgba(215, 76, 16, 1)', bgColor: 'rgba(251, 237, 231, 1)' };
			case 'partially refunded':
			case 'partially_refunded':
			case 'expired':
				return { textColor: 'rgba(0, 0, 0, 0.6)', bgColor: 'rgba(247, 248, 250, 1)' };
			case 'overpaid':
				return { textColor: 'rgba(225, 29, 72, 1)', bgColor: 'rgba(253, 242, 248, 1)' };
			case 'active':
			case 'inactive':
			case 'invited':
				return { textColor: 'black', bgColor: 'white' };
			case 'new customer':
				return { textColor: '#FFFFFF', bgColor: '#F0AF30' };
			case 'existing customer':
				return { textColor: '#FFFFFF', bgColor: '#6BA6FE' };
			case 'high':
				return { textColor: '#4578C4', bgColor: '#F0F6FF' };
			case 'medium':
			case 'mid':
				return { textColor: '#CE921E', bgColor: '#FEF7EA' };
			case 'low':
			case 'opp':
				return { textColor: '#676D77', bgColor: '#F2F4F7' };
			case 'emailed':
				return { textColor: '#CE921E', bgColor: '#FEF7EA' };
			case 'called':
				return { textColor: '#096645', bgColor: '#E8F3EF' };
			case 'requirement':
				return { textColor: '#676D77', bgColor: '#F2F4F7' };
			case 'follow_up':
				return { textColor: '#4578C4', bgColor: '#F0F6FF' };
			case 'in_person_visit':
				return { textColor: '#5B7C00', bgColor: '#F2F6E7' };
			case CATALOG_STATUS_KEYS.GENERATED:
				return { textColor: colors.grey_800, bgColor: theme?.palette?.success[100] };
			case CATALOG_STATUS_KEYS.NOT_GENERATED:
				return { textColor: colors.grey_800, bgColor: secondary[100] };
			case CATALOG_STATUS_KEYS.IN_PROGRESS:
				return { textColor: colors.grey_800, bgColor: secondary[200] };
			case CATALOG_STATUS_KEYS.FAILED:
				return { textColor: colors.grey_800, bgColor: theme?.palette?.error[50] };
			default:
				return { textColor: 'black', bgColor: 'grey' };
		}
	},
	get_color: (ind: any) => {
		switch (ind) {
			case 0:
				return '#F0F6FF';
			case 1:
				return '#F2F6E7';
			case 2:
				return '#FEF7EA';
			default:
				return 'grey';
		}
	},
	get_attachment_validation: (attachments: any, config: any) => {
		const attachmentSize = _.size(attachments) || 0;
		const min = config?.attachment_min_entites || 0;
		const max = config?.attachment_max_entities || 9999;

		if (attachmentSize === 0) {
			if (config?.is_attachments_required) {
				return {
					id: 'other_details.attachments',
					message: 'Please add attachments',
					type: 'error',
				};
			}
		} else if (attachmentSize < min) {
			return {
				id: 'other_details.attachments',
				message: `Attachments should be at least ${min}`,
				type: 'error',
			};
		} else if (attachmentSize > max) {
			return {
				id: 'other_details.attachments',
				message: `Attachments should be less than ${max}`,
				type: 'error',
			};
		}

		return {};
	},
	get_copied_address: ({ config, address, state_options }: any) => {
		let result: any = {};

		if (!config || _.size(config) === 0) {
			console.warn('Payment address rules are not defined or empty!');
			return result; // Return empty object instead of nothing
		}
		jsonLogic.add_operation('regex_match', (value, pattern) => {
			if (typeof value !== 'string' || typeof pattern !== 'string') {
				return false;
			}
			const regex = new RegExp(pattern);
			return regex.test(value);
		});
		jsonLogic.add_operation('customStateHandling', (state, state_options) => {
			const foundState = _.find(state_options, { label: state })?.value ?? state;
			return foundState;
		});
		jsonLogic.add_operation('iso_2_code', (country, iso_code) => {
			const country_code = _.toUpper(country);
			let foundCountry = country_code;
			if (country_code.length === 2) {
				foundCountry = _.find(iso_code, { alpha2Code: country_code })?.alpha2Code ?? country_code;
			} else if (country_code.length === 3) {
				foundCountry = _.find(iso_code, { alpha3Code: country_code })?.alpha2Code ?? country_code;
			}
			return foundCountry;
		});
		jsonLogic.add_operation('iso_3_code', (country, iso_code) => {
			const country_code = _.toUpper(country);
			let foundCountry = country_code;
			if (country_code.length === 2) {
				foundCountry = _.find(iso_code, { alpha2Code: country_code })?.alpha3Code ?? country_code;
			} else if (country_code.length === 3) {
				foundCountry = _.find(iso_code, { alpha3Code: country_code })?.alpha3Code ?? country_code;
			}
			return foundCountry;
		});
		try {
			_.mapKeys(config, (logic: any, key: any) => {
				let value: any;
				if (key === 'state') {
					value = jsonLogic.apply(logic, { state: address.state, state_options });
				} else if (key === 'country') {
					value = jsonLogic.apply(logic, { country: address.country, iso_code: CountryISOData });
				} else {
					value = jsonLogic.apply(logic, address);
				}

				result[key] = value || '';
			});
		} catch (error) {
			console.error('Error in applying json-logic rules:', error);
		}
		return result;
	},

	handle_get_status: (status: string) => {
		switch (status) {
			case 'submitted':
				return 'submit';
			case 'confirmed':
				return 'confirm';
			case 'rejected':
				return 'reject';
			case 'cancelled':
				return 'cancel';
			case 'expired':
				return 'expire';
			case 'accepted':
				return 'convert';
			case 'pending-approval':
			case 'Under review':
				return 'pending-approval';
		}
	},

	get_chip_color_by_status: (status: string) => {
		let stateType = status?.toLowerCase();
		switch (stateType) {
			case 'aborted':
			case 'back order':
			case 'draft':
			case 'payment pending':
				return '#F0AF30';
			case 'sent':
				return '#3563A6';
			case 'submitted':
				return '#88B8FE';
			case 'pending-approval':
				return '#0369A1';
			case 'confirmed':
			case 'success':
				return '#16885F';
			case 'completed':
			case 'active':
			case 'in stock':
			case 'open':
			case 'paid':
			case 'approved':
			case 'accepted':
				return '#7DA50E';
			case 'failed':
			case 'out of stock':
			case 'cancelled':
			case 'rejected':
				return '#D74C10';
			case 'inactive':
				return '#F0AF30';
			case 'Partially Fulfilled':
				return 'rgba(79, 85, 94, 1)';
			case 'under review':
				return 'rgba(53, 99, 166, 1)';
			case 'invited':
				return '#4578C4';
			case 'yet to be invited':
				return '#F0AF30';
			case 'viewed':
				return '#4578C4';
			default:
				return 'grey';
		}
	},
	get_json_editor_links: () => {
		switch (VITE_APP_ENV) {
			case 'staging':
				return constants.JSON_EDITORS.STAGING;
			case 'preprod':
			case 'pre-prod':
				return constants.JSON_EDITORS.PREPROD;
			case 'prod':
			case 'production':
				return constants.JSON_EDITORS.PROD;
			default:
				return constants.JSON_EDITORS.STAGING;
		}
	},
	get_discount_detail: (data: any, discount_data?: any) => {
		if (_.isEmpty(data)) return { is_discount_applied: false, item_length: 0 };
		const cartItemIds = _.keys(data)?.filter((key) => key !== 'id' && key !== 'parent_id');

		const is_discount_applied = _.some(cartItemIds, (cart_item_id) => {
			const item = data[cart_item_id];
			const discount_campaign_applied = item?.discount_campaign_id;

			return (
				(discount_data ? discount_campaign_applied !== discount_data?.id : true) &&
				(item?.discount_type === 'percentage' || item?.discount_type === 'value')
			);
		});

		return { is_discount_applied, item_length: cartItemIds.length };
	},
	get_non_discount_keys: (data: any, cart_product: any, product_id?: any, discount_data?: any) => {
		const id = product_id ?? _.get(data, 'id');
		if (cart_product[id]) {
			const filtered_keys = Object?.keys(cart_product[id])?.filter((key) => {
				const value = cart_product[id][key];
				const discount_campaign_applied = value?.discount_campaign_id;
				const discount_applied = value?.discount_type === 'percentage' || value?.discount_type === 'value';
				return (
					key !== 'parent_id' &&
					key !== 'id' &&
					(discount_data
						? discount_campaign_applied === discount_data?.id && discount_applied
						: value?.discount_type === null && value?.discount_value === null)
				);
			});

			return !_.isEmpty(filtered_keys) ? filtered_keys[0] : null;
		}
	},
	get_cart_items: (product_id: string, cart: any) => {
		const product = cart?.products?.[product_id];
		if (!product) return 0; // Return 0 if the product with the given id does not exist

		return Object.values(product).reduce((total, item: any) => {
			// Ensure that the item is an object and has a 'quantity' property
			if (item && typeof item === 'object' && typeof item?.quantity === 'number') {
				return total + item?.quantity;
			}
			return total;
		}, 0);
	},
	//custom fns
	update_item_list: (list: any, item: any, action: string) => {
		let new_list = _.cloneDeep(list);
		let item_index;

		switch (action) {
			case 'ADD': {
				new_list.unshift(item);
				break;
			}

			case 'DELETE': {
				let index = _.findIndex(list, item);
				if (index > -1) new_list.splice(index, 1);
				break;
			}

			case 'UPDATE': {
				item_index = _.findIndex(new_list, { id: item.id });
				if (item_index !== -1) {
					new_list.splice(item_index, 1, item);
				}
				break;
			}

			default:
				break;
		}

		return new_list;
	},

	create_serial_number_config: (name?: string): any => {
		return {
			headerName: name,
			field: '',
			valueGetter: 'node.rowIndex + 1',
			hideFilter: true,
			width: 80,
			flex: 1,
			minWidth: 60,
			cellStyle: {
				textAlign: 'center',
				width: 80,
				minWidth: 60,
				borderRadius: '0px',
				background: 'transparent',
				borderWidth: '0px 1px 0px 0px',
				borderColor: '#ddd4d1',
			},
			suppressSizeToFit: true,
			pinned: 'left',
			lockPinned: true,
			resizable: false,
			visibility: true,
			suppressMenu: true,
			suppressMovable: true,
		};
	},

	create_action_config: (
		actions: any[],
		on_click_callback: (params: any, key?: any, event?: any) => any,
		header: string = '',
		navigationKey: string = '',
		isHyperLink: boolean = true,
	) => {
		return {
			headerName: header,
			field: 'action',
			editable: false,
			filter: false,
			dtype: 'action',
			lockPinned: true,
			resizable: false,
			pinned: 'right',
			cellStyle: {
				background: 'transparent',
				width: '120px',
				justifyContent: 'center',
				alignItems: 'center',
				minWidth: '120px',
				textAlign: 'center',
				borderRadius: '0px',
				borderWidth: '0px 0px 0px 1px',
				borderColor: '#ddd4d1',
			},
			sortable: false,
			headerStyle: {
				width: '120px',
			},
			width: 120,
			flex: 1,
			minWidth: 120,
			suppressMenu: true,
			isHyperLink,
			navigationKey,
			actions: {
				actions: actions.map((action) => ({
					...action,
					onClick: (params: any, key?: any, event?: any) => {
						if (event) {
							event.preventDefault();
							event.stopPropagation();
						}
						on_click_callback(params, key, event);
					},
				})),
				type: 'action',
			},
		};
	},

	delay: (ms: number) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(null);
			}, ms);
		});
	},

	format_phone_number: (phone_number: any, country_code: any) => {
		const cleaned_number =
			typeof phone_number === 'string' ? phone_number?.replace(/\D/g, '') : phone_number?.toString()?.replace(/\D/g, '');

		if (!cleaned_number) return;

		let formatted_number = '';
		if (cleaned_number?.length > 10) {
			const extra_digits = cleaned_number?.length - 10;
			formatted_number = `${cleaned_number?.slice(0, extra_digits)} ${cleaned_number?.slice(
				extra_digits,
				extra_digits + 3,
			)}-${cleaned_number?.slice(extra_digits + 3, extra_digits + 6)}-${cleaned_number?.slice(extra_digits + 6)}`;
		} else {
			formatted_number = `${cleaned_number?.slice(0, 3)}-${cleaned_number?.slice(3, 6)}-${cleaned_number?.slice(6)}`;
		}
		return `${country_code ?? ''} ${formatted_number}`.trim();
	},
	format_phone_number_e164: (phone_number: any) => {
		const pn = parsePhoneNumber(phone_number);
		if (pn?.valid) {
			return pn?.number?.international;
		}
		return 'Invalid Number';
	},
	extract_decimal_number: (value: any, maxDecimals = 2) => {
		const num_arr = String(value).replace(/[^0-9.]/g, '');
		let val: any = num_arr.substring(
			0,
			num_arr.indexOf('.') >= 0 ? (maxDecimals > 0 ? num_arr.indexOf('.') + 1 + maxDecimals : num_arr.indexOf('.')) : num_arr.length,
		);
		return val && !isNaN(val) ? parseFloat(val) : 0;
	},

	getRange: (FROM: any, TO: any, TYPE: any) => {
		const date = new Date(FROM + ' UTC')?.getTime() / 1000;
		let from, to;
		switch (TYPE) {
			case 'equals':
				from = date;
				to = date + 86400;
				break;
			case 'lessThan':
				from = 0;
				to = date;
				break;
			case 'lessThanOrEqual':
				from = 0;
				to = date + 86400;
				break;
			case 'greaterThan':
				from = date + 86400;
				to = new Date().getTime() / 1000;
				break;
			case 'greaterThanOrEqual':
				from = date;
				to = new Date().getTime() / 1000;
				break;
			case 'inRange':
				from = date;
				to = new Date(TO).getTime() / 1000 + 86400;
				break;
			default:
				break;
		}
		return { from, to };
	},

	sort_according_to_customise: (products: any, items: any): string[] => {
		const customise_products: string[] = [];
		const non_customise_products: string[] = [];

		const products_array = Array.isArray(products) ? products : Object.keys(products);

		for (const product_index of products_array) {
			const productLineItem = items[product_index];
			if (!productLineItem) continue;

			const is_custom = Object.values(productLineItem).some((value: any) => value?.is_custom_product);

			if (is_custom) {
				customise_products.push(product_index);
			} else {
				non_customise_products.push(product_index);
			}
		}

		return [...customise_products, ...non_customise_products];
	},
	get_label_for_type_select: (value: string, options: any) => {
		return _.find(options, { value })?.label || value;
	},

	get_address_object: (id: string, address_attributes: any) => {
		const first_name = _.find(address_attributes, {
			id: constants.BUYER_ADDRESS_FIELDS.first_name,
		})?.value;
		const last_name = _.find(address_attributes, {
			id: constants.BUYER_ADDRESS_FIELDS.last_name,
		})?.value;
		const email = _.find(address_attributes, {
			id: constants.BUYER_ADDRESS_FIELDS.email,
		})?.value;
		const country_code = _.find(address_attributes, {
			id: constants.BUYER_ADDRESS_FIELDS.country_code,
		})?.value;
		const phone = _.find(address_attributes, {
			id: constants.BUYER_ADDRESS_FIELDS.phone,
		})?.value;
		const street_address = _.find(address_attributes, {
			id: constants.BUYER_ADDRESS_FIELDS.street_address,
		})?.value;
		const city = _.find(address_attributes, {
			id: constants.BUYER_ADDRESS_FIELDS.city,
		})?.value;
		const state = _.find(address_attributes, {
			id: constants.BUYER_ADDRESS_FIELDS.state,
		})?.value;
		const pincode = _.find(address_attributes, {
			id: constants.BUYER_ADDRESS_FIELDS.pincode,
		})?.value;
		const country = _.find(address_attributes, {
			id: constants.BUYER_ADDRESS_FIELDS.country,
		})?.value;
		const address_line_2 = _.find(address_attributes, {
			id: constants.BUYER_ADDRESS_FIELDS.address_line_2,
		})?.value;

		const state_options = _.find(address_attributes, { id: constants.BUYER_ADDRESS_FIELDS.state })?.options;
		const country_options = _.find(address_attributes, { id: constants.BUYER_ADDRESS_FIELDS.country })?.options;

		const address_obj: any = {
			id,
			first_name,
			last_name,
			email,
			phone,
			street_address,
			city,
			state,
			state_label: utils.get_label_for_type_select(state, state_options),
			pincode,
			country,
			country_code,
			country_label: utils.get_label_for_type_select(country, country_options),
			additional_field_values: {},
			address_line_2,
		};

		_.map(address_attributes, (attr) => {
			if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(attr.id)) {
				address_obj.additional_field_values[attr.id] = attr.value;
			}
		});

		return address_obj;
	},
	handle_connected_account: async (dispatch: any) => {
		try {
			const response: any = await naylas_config.get_connected_acccount();
			dispatch(nylas_config(response?.data));
		} catch (err) {
			console.error(err);
			dispatch(nylas_clear());
		}
	},
	handle_get_dtype: (name: any, dtype: any) => {
		if (name === 'Order value') {
			return 'currency';
		}
		if (name === 'Reference ID') {
			return 'imageText2';
		}

		if (TABLE_CONSTANTS.INTERNAL_STATUS_HEADER_NAME.includes(name) && dtype === 'tags') {
			return 'internal_status';
		}
		if (name === 'Payment Status') {
			return 'status';
		}
		return dtype;
	},
	get_search_string_result: (items: any, search_string: any, valueAccessor: any) => {
		const searchStringLower = _.toLower(_.trim(search_string)) || '';
		return _.filter(items, (item) => {
			const valueToCheck = _.toLower(valueAccessor(item));
			return _.includes(valueToCheck, searchStringLower);
		});
	},
	get_price_keys: (column: any, data_values: any) => {
		const _key = data_values?.is_variant ? column?.variant_key : column?.product_key;
		return _key.split('::');
	},
	base_price_conditions: (column: any, data_values: any, price: number, base_price: number) => {
		return (
			_.includes(utils.get_price_keys(column, data_values), 'price') &&
			!_.isEmpty(String(base_price)) &&
			!_.isNaN(String(base_price)) &&
			base_price > price
		);
	},

	get_sorted_array_on_selection: (selected_options_array: any, complete_array: any, valueAccessor: any, not_sorted?: boolean = false) => {
		if (not_sorted) {
			const difference = _.differenceBy(complete_array, selected_options_array, (item) => valueAccessor(item));

			return _.concat(selected_options_array, difference);
		}
		const selected_option_sort = _.sortBy(selected_options_array, (item) => _.toLower(valueAccessor(item)));
		const complete_array_sort = _.sortBy(complete_array, (item) => _.toLower(valueAccessor(item)));

		const difference = _.differenceBy(complete_array_sort, selected_option_sort, (item) => valueAccessor(item));

		return _.concat(selected_option_sort, difference);
	},
	get_screen_width: () => window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
	get_inc_acc_volume_tiers: (min: number, default_order_quantity: number, count: number, volume_tiers: any, increment: boolean = true) => {
		let closest_value = count !== 0 ? count : Math.max(min, default_order_quantity);

		const selected_tier = _.find(volume_tiers, (tier: any) => closest_value >= tier.start_quantity && closest_value <= tier.end_quantity);

		if (!_.isEmpty(selected_tier)) {
			if (increment) closest_value += selected_tier.ioq;
			const start_quantity = selected_tier?.start_quantity === 0 ? min : selected_tier?.start_quantity;

			if (closest_value > selected_tier.end_quantity) {
				// If closest_value goes to next tier, find the next tier and take its start_quantity
				const next_cloesest_tier = volume_tiers[volume_tiers.indexOf(selected_tier) + 1];
				closest_value = next_cloesest_tier ? next_cloesest_tier.start_quantity : closest_value;
			} else {
				// if same tier than validate value
				const diff = (closest_value - start_quantity) / selected_tier?.ioq;

				const floor_val = start_quantity + selected_tier?.ioq * Math.floor(diff);

				closest_value = _.isInteger(diff) ? closest_value : floor_val;
			}
		}

		return closest_value;
	},

	get_dec_acc_volume_tiers: (min: number, count: number, volume_tiers: any) => {
		let closest_value = count;

		const selected_tier = _.find(volume_tiers, (tier: any) => closest_value >= tier.start_quantity && closest_value <= tier.end_quantity);

		if (!_.isEmpty(selected_tier)) {
			let adjusted_qty = closest_value - selected_tier.ioq;

			if (adjusted_qty < selected_tier.start_quantity) {
				// If adjusted_qty goes to previous tier, find the previous tier and calculate valid quantity
				const prev_tier = volume_tiers[volume_tiers.indexOf(selected_tier) - 1];

				const diff = (prev_tier?.end_quantity - prev_tier?.start_quantity) / prev_tier?.ioq;

				adjusted_qty = prev_tier?.start_quantity + prev_tier?.ioq * Math.floor(diff);
			}
			closest_value = adjusted_qty;
		}

		return Math.max(min, closest_value);
	},
	get_closest_increment: (min: number, increment: number, value: number, default_order_quantity: number) => {
		if (value < min) {
			if (default_order_quantity > min && (default_order_quantity - min) % increment === 0) {
				return default_order_quantity;
			}
			return min;
		}

		if ((value - min) % increment === 0) return value + increment;

		let curr_value = min;
		while (curr_value < value) {
			curr_value += increment;
		}
		return curr_value;
	},
	find_tier: (volume_tiers: any, value: number) => {
		return _.find(volume_tiers, (tier: any) => value >= tier.start_quantity && value <= tier.end_quantity);
	},
	get_custom_hyper_link: (colDef: any, data: any) => {
		const { headerName, dtype, field, hasViewPermission = false } = colDef;
		switch (dtype) {
			case 'imageText2':
			case 'action':
				return headerName === 'Reference ID' || constants.HYPERLINK_FIELDS.includes(field) ? generate_document_url(data) : '';
			case 'text':
				return constants.HYPERLINK_FIELDS.includes(field) ? get_buyer_navigation_url(data?.id, hasViewPermission) : '';
			default:
				return '';
		}
	},
	get_common_action_link: (colDef: any, data: any) => {
		const { navigationKey = '' } = colDef;
		switch (navigationKey) {
			case constants.BUYER_LIST_KEY:
				return `${RouteNames.buyer_library.edit_buyer.routing_path}/${data?.id}`;
			default:
				return '';
		}
	},
	prevent_default_link_click: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
		const should_prevent = should_handle_click(event);
		if (should_prevent) {
			event?.preventDefault();
		}
	},

	show_grouping_data: (cart_grouping_config: any, cart_group_data: any) => {
		return cart_grouping_config?.enabled && !_.isEmpty(cart_group_data);
	},

	format_base_url: (_url: string) => {
		if (_url.slice(-1) === '/') {
			return _url.slice(0, -1);
		}

		return _url;
	},

	parse_and_check_json: (json_string: string) => {
		if (!_.isString(json_string)) {
			return {};
		}

		try {
			const _temp = JSON.parse(json_string);
			return _temp;
		} catch (e) {
			return {};
		}
	},

	is_prelogin_price: (is_logged_in: boolean) => {
		const wizshop_settings: any = localStorage.getItem('wizshop_settings');
		const pre_login_settings = JSON.parse(wizshop_settings);
		if (is_logged_in || (!is_logged_in && pre_login_settings?.prelogin_price)) {
			return true;
		}

		return false;
	},

	check_prelogin_price: (is_small_screen: boolean): string => {
		const active_free_trial = JSON.parse(localStorage.getItem('wizshop_settings') || '{}')?.active_free_trial === true;
		if (active_free_trial) {
			return is_small_screen ? t('PDP.Common.SignupForAccess') : t('PDP.Common.SignupForFullAccess');
		} else {
			return is_small_screen ? t('PDP.Common.LockPriceV2') : t('PDP.Common.LockPrice');
		}
	},

	handle_active_free_trial_navigate: () => {
		const active_free_trial = JSON.parse(localStorage.getItem('wizshop_settings') || '{}')?.active_free_trial === true;
		if (active_free_trial) {
			return RouteNames?.free_trial?.path;
		} else {
			return RouteNames?.user_login?.path;
		}
	},

	is_prelogin_inventory: (is_logged_in: boolean) => {
		const wizshop_settings: any = localStorage.getItem('wizshop_settings');
		const pre_login_settings = JSON.parse(wizshop_settings);
		if (
			(!is_logged_in && pre_login_settings?.prelogin_inventory) ||
			(pre_login_settings?.postlogin_inventory && is_logged_in) ||
			(is_logged_in && is_ultron)
		) {
			return true;
		}

		return false;
	},

	handle_filtered_facets: (facets: any[], is_logged_in: boolean) => {
		const wizshop_settings: any = localStorage.getItem('wizshop_settings');
		const pre_login_settings = JSON.parse(wizshop_settings);
		const filters_to_omit = [];

		if (!utils.is_prelogin_price(is_logged_in)) {
			filters_to_omit.push('price');
		}

		if (!utils.is_prelogin_inventory(is_logged_in)) {
			filters_to_omit.push('inventory_status');
		}

		if (!_.isEmpty(pre_login_settings?.hide_postlogin_filters)) {
			_.forEach(pre_login_settings?.hide_postlogin_filters, (filter_config: any, filter_key: any) => {
				if (_.has(facets, filter_key)) {
					// If buckets are defined in the config, filter them out
					if (_.isArray(filter_config?.buckets)) {
						facets[filter_key].buckets = _.reject(facets[filter_key].buckets, (bucket) => _.includes(filter_config?.buckets, bucket.key));
					}
				}
			});
		}

		const facets_data = _.omit(facets, filters_to_omit);

		return facets_data;
	},

	get_pre_login_inventory_status_filter: (is_logged_in: boolean) => {
		const wizshop_settings: any = localStorage.getItem('wizshop_settings');
		const pre_login_settings = JSON.parse(wizshop_settings);

		if (!_.isEmpty(pre_login_settings?.prelogin_inventory_status_filter) && !is_logged_in) {
			return pre_login_settings?.prelogin_inventory_status_filter;
		}

		if (!_.isEmpty(pre_login_settings?.postlogin_inventory_status_filter) && is_logged_in) {
			return pre_login_settings?.postlogin_inventory_status_filter;
		}

		return [];
	},

	is_prelogin_add_to_cart_button: (is_logged_in: boolean) => {
		const wizshop_settings: any = localStorage.getItem('wizshop_settings');
		const pre_login_settings = JSON.parse(wizshop_settings);
		if (is_logged_in || (!is_logged_in && pre_login_settings?.prelogin_price)) {
			return true;
		}

		return false;
	},

	map_attrs_to_form_data: (entity_data: DocumentEntity): FormValuesObj | null => {
		if (!entity_data) return null;
		const initial_data: FormValuesObj = entity_data.id ? { id: entity_data.id } : {};

		return _.reduce(
			entity_data?.attributes,
			(agg, attr: Attribute) => ({
				...agg,
				[attr?.id]: attr?.value,
			}),
			initial_data,
		);
	},
	// Utility functions for determining visibility
	can_perform_attribute_action: (document_entity_permission: boolean, customer_permission: boolean, back_saving_permitted: boolean) => {
		return document_entity_permission && (customer_permission || back_saving_permitted);
	},

	document_entity_checkbox_visible: (document_entity_permission: boolean, customer_permission: boolean, back_saving_permitted: boolean) => {
		return document_entity_permission && customer_permission && back_saving_permitted;
	},

	document_entity_info_visible: (document_entity_permission: boolean, customer_permission: boolean, back_saving_permitted: boolean) => {
		return document_entity_permission && !customer_permission && back_saving_permitted;
	},
	get_processed_document_entity: (
		document_data: DocumentEntity,
		key: string,
		entity_data: DocumentEntity | undefined,
	): DocumentEntity | undefined => {
		if (!document_data) return;
		const attribute_data = _.get(document_data, key);
		if (attribute_data && attribute_data?.[DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_VALUE_KEY]) {
			const updated_attr_obj = {
				attributes: _.map(entity_data?.attributes || [], (attr) => {
					return {
						...attr,
						value: attribute_data[attr?.id] ?? '',
					};
				}),
				[DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_VALUE_KEY]: true,
				id: attribute_data?.id,
			};
			return updated_attr_obj;
		}
		return;
	},
	get_contact_attributes_values: (keys: string[], item: DocumentEntity) => {
		return keys.reduce((acc, key) => {
			(acc[key] as any) = _.find(item.attributes, { id: key })?.value ?? '';
			return acc;
		}, {} as Record<string, string>);
	},
	get_active_variants: (variant_data_map: any) => {
		return _.filter(variant_data_map, (e: any) => e?.is_active);
	},
	should_sync_to_customer: (add_edit_data: MappedAddressContact, checkbox_value: boolean, is_edit: boolean) => {
		if (add_edit_data?.show_sync_back_info) {
			return false;
		}

		if (!is_edit && !add_edit_data?.show_sync_back_checkbox) {
			return checkbox_value;
		}

		if (add_edit_data?.show_sync_back_checkbox) {
			return checkbox_value;
		}

		if (is_edit && !add_edit_data?.show_sync_back_info && !add_edit_data?.show_sync_back_checkbox) {
			return checkbox_value;
		}

		return false;
	},
	check_disabled_for_add_all_to_cart: (products: any, cart: any) => {
		return products.every((product: any) => cart.hasOwnProperty(product.id));
	},
	handle_check_display: (data: any) => {
		const display_count = _.some(data?.attributes, (item) => item?.is_display);
		return data?.is_display && display_count;
	},
	format_address_section_to_values: (data: any) => {
		return _.map(data, (item) => {
			const obj: any = {};
			_.forEach(item?.attributes, (attribute) => {
				obj[attribute?.id] = attribute?.value;
			});
			obj.id = item?.id;
			return obj;
		});
	},
	check_valid_number: (value: any) => {
		return /^(|\d+\.?\d{0,2}|\.\d{0,2})$/.test(value);
	},
};

export const check_permission = (permissions: any, paymentPermissions: string[] = []) => {
	return paymentPermissions?.some((permission) => _.find(permissions, { slug: permission })?.toggle);
};

export const allValuesEmpty = (input: any): boolean => {
	// Directly handle non-object inputs (string, null, undefined)
	if (typeof input === 'string') {
		return input === '';
	} else if (input === null || input === undefined) {
		return true;
	} else if (typeof input === 'object' && input !== null) {
		// Proceed with original logic for objects
		return Object.values(input).every((value) => {
			return (
				value === '' ||
				value === null ||
				value === undefined ||
				(_.isObject(value) && allValuesEmpty(value)) ||
				(_.isArray(value) && value.length === 0)
			);
		});
	} else if (typeof input === 'boolean' && input === false) {
		return true;
	}
	// For other types, consider them not empty; adjust this based on your needs
	return false;
};

// this function is used to check if the click event is a left click or not
export const should_handle_click = (event: any): boolean => {
	return !(event?.ctrlKey || event?.metaKey || event?.button === 1);
};

export const get_buyer_navigation_url = (buyer_id: any, hasViewPermission: boolean) => {
	let url: string = '';
	if (hasViewPermission) {
		url = `/buyer/dashboard/${buyer_id}`;
	} else {
		url = `${RouteNames.buyer_library.view_buyer.routing_path}${buyer_id}`;
	}
	return url;
};

const generate_document_url = (data: any) => {
	const type = _.get(data, 'type');
	const id = _.get(data, 'id');
	const document_status = _.get(data, 'document_status');
	const get_document_status = utils.handle_get_status(document_status);
	const base_url = `${RouteNames.product.review.routing_path}${type}/`;
	if (!get_document_status && document_status === document.DocumentStatus.draft) {
		return `${base_url}${id}`;
	} else {
		return `${base_url}${id}/${get_document_status}`;
	}
};

export const get_attributes_mapping = (product_card_config: any, product: any) => {
	const attributes_cofig_display_rows = _.filter(
		product_card_config,
		(config: any) => config?.display !== constants.ATTRIBUTE_DISPLAY_CONFIG.HIDDEN && config?.custom_attributes?.length > 0,
	);

	if (_.size(attributes_cofig_display_rows) === 0) {
		return [];
	}
	return _.map(attributes_cofig_display_rows, (attr_row: any) => {
		if (attr_row?.display === constants.ATTRIBUTE_DISPLAY_CONFIG.HINGE) {
			return {
				attributes: {
					keys: _.map(product?.variants_meta?.hinge_attributes, (v: any) => `custom_attributes::${v?.id}::value`),
				},
			};
		} else if (attr_row?.display === constants.ATTRIBUTE_DISPLAY_CONFIG.CUSTOM) {
			return {
				attributes: {
					keys: _.map(attr_row?.custom_attributes, (v: any) => `custom_attributes::${v}::value`),
				},
			};
		} else {
			return {};
		}
	});
};

export const get_product_metadata = (product: any, count?: number) => {
	const { id, sku_id, parent_id, name, type, cart_item_id, category, collections, pricing } = product;
	const _store: any = store.getState();
	const cart: any = _store.cart;
	const cart_quantity = count || cart?.products?.[id]?.[cart_item_id]?.quantity || 0;
	return {
		sku_id,
		parent_id,
		name,
		type,
		category,
		collections,
		price: pricing?.price,
		cart_quantity,
		product_uuid: id,
		initial_count: cart?.products?.[id]?.[cart_item_id]?.quantity || 0,
		final_count: cart_quantity,
	};
};

const default_values: Customer_Metadata_Props = {
	catalog_name: '',
	linked_catalog_name: '',
	is_loggedin: false,
	tenant_name: '',
};
export const get_customer_metadata = (props: Customer_Metadata_Props = default_values) => {
	const { catalog_name = '', linked_catalog_name = '', is_loggedin = false, tenant_name = '' } = props;
	const _store: any = store.getState();
	const buyer: any = _store?.buyer;
	const login: any = _store?.login;
	const linked_catalog: any = _store?.linked_catalog;
	const catalog_value = catalog_name || buyer?.catalog?.value;
	const linked_catalog_value = linked_catalog_name ?? linked_catalog?.label;
	return {
		customer_type: buyer?.buyer_id,
		customer_id: buyer?.buyer_id,
		customer_name: buyer?.is_guest_buyer ? 'Guest Customer' : buyer?.buyer_info?.name,
		catalog_id: catalog_value,
		catalog_name: buyer?.catalog?.label,
		linked_catalog_id: linked_catalog?.value,
		linked_catalog_name: linked_catalog_value,
		is_web: true,
		is_loggedin,
		user_email: login?.email,
		user_id: login?.userDetails?.user_id,
		user_first_name: login?.userDetails?.first_name,
		user_last_name: login?.userDetails?.last_name,
		tenant_id: buyer?.buyer_cart?.tenant_id,
		tenant_name,
	};
};

export const get_cart_metadata = (_count?: number) => {
	const _store: any = store.getState();
	const cart: any = _store?.cart ?? {};
	const _containers = _.get(cart, 'container_data.containers');
	const first_container = _.head(_containers);
	const container_volume_data = _.get(first_container, 'container_volume_data');
	const cart_item_count = _count || _.size(cart?.products) || 0;
	return {
		cart_id: cart?.id,
		cart_item_count,
		cart_value: cart?.total,
		cart_value_without_charge: [],
		cart_value_with_discount: [],
		container_unit: cart?.container_data?.cart_volume_unit,
		container_volume: container_volume_data,
		containers: cart?.container_data?.containers,
		grouping_data: cart?.meta?.grouping_data,
	};
};

export const get_product_id = (product: Product) => {
	const variants_count = _.filter(product?.variants_meta?.variant_data_map, (e: any) => e.is_active !== false)?.length;
	const variant_id =
		product?.type === PRODUCT_DETAILS_TYPE.variant || variants_count === 0
			? _.get(product, 'id', '')
			: _.get(product, 'variants_meta.variant_data_map[0].product_id', '');
	return variant_id;
};

export const get_formatted_timezone = (timezone: string) => {
	const offset = _.find(TIMEZONES, (timezone_data) => timezone_data.value === timezone)?.label;
	return `${offset} ${timezone}`;
};

export const get_default_timezone = (formatting?: boolean): string => {
	const timezone: string = _.find(TIMEZONES, (timezone: any) => timezone.is_default)?.value || _.head(TIMEZONES)?.value;
	return formatting ? get_formatted_timezone(timezone) : timezone;
};

export default utils;
