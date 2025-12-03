/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import cartManagement from 'src/utils/api_requests/cartManagement';
import { RootState } from 'src/store';
import { get_unit_price_of_product } from 'src/utils/common';
import {
	create_document_type,
	create_document_selected_buyer,
	set_cart as set_cart_action,
	edit_cart,
	update_buyer,
	update_catalog,
} from 'src/actions/buyer';
import {
	get_cart_total_on_change_quantity,
	format_cart_details_response,
	is_quantity_zero,
	PRODUCT_DEFAULT_TYPE,
	get_items,
	get_discounted_value,
} from './helper';
import api_requests from 'src/utils/api_requests';
import RouteNames from 'src/utils/RouteNames';
import { set_document_data, show_document_alert, toggle_edit_quote } from 'src/actions/document';
import _ from 'lodash';
import { document } from '../OrderManagement/mock/document';
import { EMPTY_QUOTE_OR_ORDER } from 'src/reducers/document';
import { get_document_details_api } from '../OrderManagement/component/Api/getDocumentDetails';
import { initializeCart } from 'src/actions/cart';
// import catalogs from 'src/utils/api_requests/catalog';
import { set_notification_feedback } from 'src/actions/notifications';
import cart_management from 'src/utils/api_requests/cartManagement';
import { isUUID } from '../Settings/utils/helper';
import { allValuesEmpty, get_cart_metadata, get_customer_metadata, get_product_metadata } from 'src/utils/utils';
import { Group, MappedCustomGroup } from 'src/@types/manage_custom_groups';
import constants from 'src/utils/constants';
import { Mixpanel } from 'src/mixpanel';
import { EditPriceModal } from 'src/@types/edit_product_price';
import Events from 'src/utils/events_constants';
import { json_cart_calc_rule_config, util_function } from 'src/utils/CartRule';

import rule_setting from 'src/utils/api_requests/setting';
import { master_discount_rule, valid_discount_for_cart_document } from 'src/utils/DiscountEngineRule';

import { util_function as shipping_util_function } from 'src/utils/ShippingRule';

const { CUSTOM_GROUPING } = constants.CART_GROUPING_KEYS;

type UpdatePriceType = {
	open: boolean;
	data?: any;
	action: 'SINGLE' | 'BULK';
};

const useCartSummary = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [open_custom_product, set_open_custom_product] = useState<boolean>(false);
	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';
	const json_engine_rules = useSelector((state: RootState) => state?.json_rules);
	const show_discount_engine = useSelector((state: any) => state?.settings?.enable_discount_engine) ?? false;
	const [is_cart_global_error, toggle_global_error] = useState({});
	const [show_buyer_panel, toggle_buyer_panel] = useState(false);
	const [is_buyer_add_form, set_is_buyer_add_form] = useState(false);
	const [transfer_cart, set_transfer_cart] = useState(false);
	const [cart, set_cart] = useState<any>({});
	const [cart_loading, set_cart_loading] = useState(true);
	const [toast, toggle_toast] = useState({ show: false, message: '', title: '', status: 'success' });
	const [show_error_page, toggle_error_page] = useState(false);
	const [adhoc_data, set_adhoc_data] = useState<any>({});
	const [adhoc_count, set_adhoc_count] = useState(1);
	const [variant_drawer, set_variant_drawer] = useState(false);
	const [variant_data, set_variant_data] = useState({});
	//usecase for  similar btn
	const active_catalog_id = useSelector((state: any) => state?.buyer?.catalog?.value);
	const [similar_drawer, set_similar_drawer] = useState(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [buyer_details, set_buyer_details] = useState([]);
	const [catalog_list, set_catalog_list] = useState<any[]>([]);
	const [selected_catalog_id, set_catalog_id] = useState('');
	const [show_tear_sheet, set_show_tear_sheet] = useState(false);
	const [show_price_on_tear_sheet, set_show_price_on_tear_sheet] = useState(false);
	const [is_discount_campaign_error, set_is_discount_campaign_error] = useState(false);
	const [is_primary_loading, set_is_primary_loading] = useState(false);
	const [is_secondary_loading, set_is_secondary_loading] = useState(false);
	const [create_new_buyer, set_create_new_buyer] = useState(false);
	const [type, set_type] = useState('');
	const [show_error, set_show_error] = useState(false);
	const [download_loader, set_download_loader] = useState(false);
	const [show_pre_exists_modal, set_pre_exsists_modal] = useState(false);
	const [discount_campaigns, set_discount_campaigns] = useState<any>([]);
	const [buyer_discount_campaigns, set_buyer_discount_campaigns] = useState<any>([]);
	const master_discount_rule_config = useSelector((state: any) => state?.json_rules?.master_discount_rule);
	const [cart_discount_campaigns, set_cart_discount_campaigns] = useState<any>([]);
	const [selected_cart_discount, set_selected_cart_discount] = useState<any>({});
	const [proceed_btn_loading, set_proceed_btn_loading] = useState(false);
	const [flag_new_cart, set_flag_new_cart] = useState(false);
	const [is_error_modal_open, set_is_error_modal_open] = useState(false);
	const [show_confirmation_modal, set_show_confirmation_modal] = useState(false);
	const [show_discount_modal, set_show_discount_modal] = useState(false);
	const [selected_product, set_selected_product] = useState<any>({});
	const [show_note_modal, set_show_note_modal] = useState(false);
	const [discount_loader, set_discount_loader] = useState(false);
	const [refetch_data, set_refetch_data] = useState(false);
	const [show_alert, set_show_alert] = useState(false);
	const [buyer_data, set_buyer_data] = useState({});
	const storefront_template_id = useSelector((state: any) => state?.settings?.tear_sheet_templates?.cart);
	const [selected_template, set_selected_template] = useState<string>('');
	const [multiple_template] = useState<any>([]);
	const [show_preview, set_show_preview] = useState(false);
	const [preview_tearsheet_url, set_preview_tearsheet_url] = useState<string>('');
	const [preview_loader, set_preview_loader] = useState(false);
	const [show_error_only, set_show_error_only] = useState(false);
	const [show_only_price_updated, set_show_only_price_updated] = useState(false);
	const [cart_errors, set_cart_errors] = useState<any>({});
	const [is_edit_modifiers, set_is_edit_modifiers] = useState(false);
	const [edit_product, set_edit_product] = useState<any>('');
	const [nudge_data, set_nudge_data] = useState<any>({});
	const [cart_items, set_cart_items] = useState<any>({});
	const [know_more_data, set_know_more_data] = useState<any>([]);
	const linked_catalog = useSelector((state: any) => state?.linked_catalog);
	const location = useLocation();
	const partial_stock_there = cart?.validations?.partially_in_stock?.length > 0;
	const not_in_stock_there = cart?.validations?.not_in_stock?.length > 0;
	const from_submitted_quote = location?.state?.from === 'submitted_quote';
	const from_submitted_quote_page = location?.state?.from === 'submitted_quote_page';
	const from_checkout_page = location?.state?.from === 'checkout_page';
	const cartDataFromStorage = JSON.parse(localStorage.getItem('CartData') || '{}');
	const cart_id_value = useSelector((state: RootState) => state?.cart?.id) || cartDataFromStorage?.id;
	const redux_cart_id = useSelector((state: RootState) => state?.buyer?.buyer_cart?.id);
	const cart_id = !_.isEmpty(cart_id_value) ? cart_id_value : redux_cart_id;
	const impersonated_by = useSelector((state: RootState) => state?.login?.userDetails?.impersonated_by);
	const _cart = useSelector((state: RootState) => state?.cart);
	const buyer = useSelector((state: any) => state.buyer);
	const catalog = useSelector((state: any) => state.catalog);
	const create_document_flag = useSelector((state: RootState) => state?.buyer?.create_document_flag);
	const [cart_group_by, set_cart_group_by] = useState<string | null>(null);
	const [cart_group_data, set_cart_group_data] = useState([]);
	const [cart_error, set_cart_error] = useState<any>({});
	const settings = useSelector((state: any) => state?.settings);
	const { cart_container_config } = settings;
	const [custom_groups, set_custom_groups] = useState<Group[]>([]);
	const [edit_price_modal_data, set_edit_price_modal_data] = useState<EditPriceModal>({
		show_modal: false,
		product: null,
	});
	const [cart_validation_rule, set_cart_validation_rule] = useState({});
	const [charges_rule_config, set_charges_rule_config] = useState({});

	// containers
	const [container_config_data, set_container_config_data] = useState<any>({});
	// container display for
	const [container_is_display, set_container_is_display] = useState(cart_container_config?.tenant_container_enabled);
	// selected container
	const [selected_container, set_selected_container] = useState({});
	const [toggle_button_value, set_toggle_button_value] = useState(cart_container_config?.tenant_container_default_unit);
	const [modified_volumne, set_modified_volumne] = useState({});

	//EDIT PRODUCT PRICE CHANGE
	const [edit_product_price_change, set_edit_product_price_change] = useState([]);

	// MODAl for update price single | bulk
	const [update_price_modal_data, set_update_price_modal_data] = useState<UpdatePriceType>({ open: false, data: {}, action: '' });

	const is_edit_flow = cart?.cart_linked_to;

	const deleted_products: any[] = [];

	const buyer_info = useSelector((state: RootState) => {
		const is_guest_buyer = state?.buyer?.is_guest_buyer;
		return {
			is_guest_buyer,
			buyer_name: is_guest_buyer ? 'Guest Customer' : state?.buyer?.buyer_info?.name,
			location: state?.buyer?.buyer_info?.location,
			buyer_id: state?.buyer?.buyer_id ?? state?.buyer?.buyer_info?.id,
			catalog_id: state?.buyer?.catalog?.value,
		};
	});

	const buyer_id = buyer_info?.buyer_id;
	const is_guest_buyer = buyer_info?.is_guest_buyer;
	const catalog_id = buyer_info?.catalog_id;

	const document_id = cart?.document_id;
	const discount_data = cart?.charges?.find((c: any) => c?.charge_type === 'discount');
	const currency_symbol = cart?.meta?.pricing_info?.currency_symbol;

	const cart_summary_card = useMemo(() => {
		if (!cart.products) return null;

		let cart_check = 0;

		// TODO: Ultron 1.5
		// if (partial_stock_there && not_in_stock_there) {
		// 	cart_check = 3;
		// } else if (partial_stock_there) {
		// 	cart_check = 2;
		// } else if (not_in_stock_there) {
		// 	cart_check = 1;
		// }

		return {
			discount_data,
			currency_symbol,
			cart_total: cart?.cart_total,
			total: cart?.total,
			cart_check,
			buyer_info,
			document_type: cart?.cart_linked_to,
		};
	}, [
		discount_data,
		cart?.cart_linked_to,
		currency_symbol,
		cart?.total,
		cart?.cart_total,
		partial_stock_there,
		not_in_stock_there,
		buyer_id,
	]);

	const cart_metadata = get_cart_metadata();

	const _catalog_value = catalog_list?.find((item: any) => item?.value === cart?.catalog_ids?.[0])?.label || '';
	const customer_metadata = get_customer_metadata({ catalog_name: _catalog_value, is_loggedin: true });

	const navigate_to_document = (_document_type: any, _document_id: any, _document_status?: string) => {
		set_is_primary_loading(false);
		const route = is_ultron
			? `${RouteNames.product.review.routing_path}${_document_type}/${_document_id}`
			: `${RouteNames.product.checkout.routing_path}${_document_type}/${_document_id}?step=${from_checkout_page ? 'review' : 'shipping'}`;

		if (from_submitted_quote_page && _document_type === document?.DocumentTypeEnum?.QUOTE) {
			let doc_status = _document_status === document?.DocumentStatus?.submitted ? 'submit' : _document_status;
			navigate(`${RouteNames.product.review.routing_path}${_document_type}/${_document_id}/${doc_status}`, {
				state: { from: 'cart-summary' },
			});

			dispatch(toggle_edit_quote(false));
			return;
		}
		if (from_submitted_quote) {
			dispatch(toggle_edit_quote(true));
		}

		navigate(route, {
			state: { from: 'cart-summary' },
		});
	};

	const handle_update_document_attributes = async (_type: any, id: any) => {
		_type === 'quote' ? set_is_primary_loading(false) : set_is_secondary_loading(false);
		set_pre_exsists_modal(false);
		set_proceed_btn_loading(false);
		navigate_to_document(_type, id);
		set_cart_loading(false);
		dispatch<any>(set_cart_action({ buyer_id, is_guest_buyer: false }));
	};
	const handle_discount_check = () => {
		let status: boolean = false;
		const items = cart?.items;
		Object?.keys(items)?.forEach((key) => {
			// Delete the 'id' and 'parent_id' properties from each object
			delete items[key]?.id;
			delete items[key]?.parent_id;
		});
		Object?.keys(items)?.forEach((key: any) => {
			const products = items?.[key];
			Object.values(products)?.forEach((item: any) => {
				if (item.discount_type === 'value' && item?.discount_value) {
					if (item?.discount_value > cart?.products?.[key]?.pricing?.price) {
						status = true;
					}
				}
			});
		});
		return status;
	};
	const get_line_items = () => {
		const unit: string = container_config_data?.tenant_container_default_unit;
		if (_.isEmpty(selected_container) || !container_config_data?.tenant_container_enabled) {
			return cart?.items;
		}
		const line_items: any = _.cloneDeep(cart?.items);
		_.forEach(_.keys(line_items), (product_id: string) => {
			_.forEach(_.keys(line_items[product_id]), (key: string) => {
				if (isUUID(key)) {
					line_items[product_id][key] = {
						...line_items?.[product_id]?.[key],
						item_volume_unit: unit,
						item_volume: cart?.products?.[product_id]?.volume,
					};
				}
			});
		});
		return line_items;
	};

	const get_discount_campaign = async () => {
		try {
			const response: any = await api_requests.product_details.get_discount_campaign('product_discount_campaign');
			if (response?.status === 200) {
				set_discount_campaigns(response?.data);
			}
		} catch (err) {
			console.error(err, 'error while fetching discount campaigns');
		}
	};
	const get_buyer_discount_campaign = async (buyer_id_for_discount: string) => {
		//get_discount_campaign_for_buyer
		try {
			const response: any = await api_requests.product_details.get_discount_campaign_for_buyer(buyer_id_for_discount);
			if (response?.status === 200) {
				set_buyer_discount_campaigns(response?.data);
			}
		} catch (err) {
			console.error(err, 'error while fetching discount campaigns');
		}
	};
	const get_cart_discount_campaign = async () => {
		try {
			const response: any = await api_requests.product_details.get_discount_campaign('cart_discount_campaign');
			if (response?.status === 200) {
				set_cart_discount_campaigns(response?.data);
			}
		} catch (err) {
			console.error(err, 'error while fetching cart discount campaigns');
		}
	};
	const calculate_max_cart_discount = () => {
		if (!master_discount_rule_config || !cart_discount_campaigns?.length) {
			return null;
		}
		const discount_applied_on_cart = valid_discount_for_cart_document(
			is_guest_buyer ? cart_discount_campaigns : buyer_discount_campaigns || cart_discount_campaigns,
			master_discount_rule_config || master_discount_rule,
			{ ...cart },
			buyer,
		);
		set_selected_cart_discount(discount_applied_on_cart);
		return discount_applied_on_cart;
	};

	const handle_delete_cart_and_change_buyer = async () => {
		try {
			dispatch<any>(set_cart_action({ buyer_id, is_guest_buyer: is_ultron ? true : false }));
			set_cart({});
			set_adhoc_count(1);
		} catch (error) {
			console.error(error);
		}
	};

	const handle_create_document = async (doc_type: string, is_pre_existing_cart = false) => {
		let items = get_line_items();
		doc_type === 'quote' || doc_type === 'order' ? set_is_primary_loading(true) : set_is_secondary_loading(true);
		set_proceed_btn_loading(true);
		const json_cart_rule = json_engine_rules?.cart_calculations_rule;
		const cart_validation_rule_fallback = _.isEmpty(cart_validation_rule)
			? await fetch_cart_validation_rule(json_engine_rules)
			: cart_validation_rule;

		const containers = _.isEmpty(selected_container) ? [] : [{ ...selected_container }];
		const validation_payload = {
			cart_id,
			items,
			container_is_display,
			containers,
		};
		const grps: any = util_function_rule({
			data: { ...validation_payload, products: cart?.products },
			rule_config: json_cart_rule || json_cart_calc_rule_config,
			shipping_rule_config: cart_validation_rule_fallback,
		});

		const { cart_error: _cart_error } = grps;
		if (_cart_error) {
			set_cart_error(_cart_error);
		}
		if (_cart_error?.type === 'error') {
			set_proceed_btn_loading(false);
			set_is_primary_loading(false);
			set_is_secondary_loading(false);
			return;
		}

		Object.keys(items).forEach((key) => {
			// Delete the 'id' and 'parent_id' properties from each object
			delete items[key]?.id;
			delete items[key]?.parent_id;
		});

		if (is_pre_existing_cart) {
			let new_item_data = _.mapValues(items, (inner_obj) => {
				return _.mapKeys(inner_obj, () => crypto.randomUUID());
			});
			items = new_item_data;
		}

		try {
			if (handle_discount_check()) {
				toggle_toast({
					show: true,
					message: `${
						doc_type === 'quote' ? 'Quote' : 'Order'
					} cannot be created as discount is higher than price. Please edit discount for this product to proceed`,
					title: 'Excessive Discount',
					status: 'warning',
				});
			} else if (is_guest_buyer) {
				toggle_buyer_panel(true);
				set_transfer_cart(true);
			} else {
				const payload = {
					cart_id,
					buyer_id,
					items,
					charges: discount_data ? [discount_data] : [],
					discount_campaign_id: selected_cart_discount?.id,
					is_update_discount_campaign: show_discount_engine,
					container_is_display,
					containers,
					cart_volume_unit: toggle_button_value,
					cart_total: cart?.cart_total,
				};
				const new_document_data: any = await cartManagement.create_document(doc_type, payload);

				const new_document = _.cloneDeep(EMPTY_QUOTE_OR_ORDER);
				new_document.cart_id = new_document_data?.cart_id || null;
				new_document.system_id = new_document_data?.system_id || '';
				new_document.cart_details.items = _.cloneDeep(cart?.items);
				new_document.cart_details.products = _.cloneDeep(cart?.products);
				new_document.charges = new_document_data?.charges || [];
				new_document.buyer_id = buyer_id;
				new_document.document_status = document?.DocumentStatus?.draft;
				new_document.type = doc_type;
				new_document.id = new_document_data?.id;

				dispatch(
					set_document_data({
						new_document,
						id: new_document?.id,
						selected_buyer_id: buyer_id,
					}),
				);
				handle_update_document_attributes(doc_type, new_document_data?.id);
				setTimeout(() => {
					handle_delete_cart_and_change_buyer();
				}, 500);
			}
			Mixpanel.track(`create_${doc_type}_clicked`, {
				tab_name: 'Home',
				page_name: 'cart_page',
				section_name: '',
				subtab_name: '',
				cart_metadata,
				customer_metadata,
			});
		} catch (error: any) {
			doc_type === 'quote' ? set_is_primary_loading(false) : set_is_secondary_loading(false);
			set_proceed_btn_loading(false);
			if (error?.response?.status === 400) {
				set_pre_exsists_modal(true);
				set_flag_new_cart(true);
				return;
			}

			if (error?.response?.status === 404) {
				set_show_alert(true);
				set_refetch_data(!refetch_data);
				set_cart_loading(false);
				set_is_error_modal_open(true);
				set_is_discount_campaign_error(
					error?.response?.data?.cart_errors?.meta.cart_products_unavailable ||
						error?.response?.data?.cart_errors?.meta.discount_campaign_not_valid,
				);
				return;
			}
			toggle_toast({ show: true, message: error?.message, title: 'Something Went Wrong', status: 'warning' });
		}
	};

	const not_discount_nor_custom_check = (is_edit_discount: boolean, is_custom: boolean) => {
		return !is_edit_discount && !is_custom;
	};

	const handle_update_cart_discount = (payload: any) => {
		const { product_id, non_discounted_cart_item_id, is_edit_discount, cart_item_id, quantity, final_price, discount_type } = payload;

		const id = product_id;
		const discount_value = Number(payload?.discount_value) || payload?.discount_value;

		set_cart((prev_cart: any) => {
			const item_applied_discount_from = prev_cart?.items?.[id]?.[!is_edit_discount ? non_discounted_cart_item_id : cart_item_id];
			const is_custom = item_applied_discount_from?.is_custom_product;
			const prev_cart_item = prev_cart?.items?.[id]?.[cart_item_id];
			const unit_price = prev_cart?.items_with_unit_prices[non_discounted_cart_item_id];

			const cart_total = is_edit_discount
				? prev_cart?.cart_total - prev_cart_item?.final_total + final_price
				: prev_cart?.cart_total - unit_price * quantity + final_price;

			const updated_cart = {
				...prev_cart,
				items: {
					...prev_cart?.items,
					[id]: {
						...prev_cart?.items?.[id],
						[cart_item_id]: {
							...item_applied_discount_from,
							quantity,
							final_total: final_price,
							discount_type,
							discount_value,
						},
					},
				},
				items_with_unit_prices: {
					...prev_cart?.items_with_unit_prices,
					[cart_item_id]: unit_price,
				},
				cart_total,
			};

			if (not_discount_nor_custom_check(is_edit_discount, is_custom)) {
				updated_cart.items[id][non_discounted_cart_item_id] = {
					...item_applied_discount_from,
					quantity: item_applied_discount_from?.quantity - quantity,
				};
			}

			if (not_discount_nor_custom_check(is_edit_discount, is_custom) && item_applied_discount_from?.quantity === quantity) {
				delete updated_cart?.items?.[id]?.[non_discounted_cart_item_id];
			}

			return updated_cart;
		});
	};

	const handle_apply_item_discount = (payload: any) => {
		const { non_discounted_cart_item_id, final_price, ...rest } = payload;

		set_discount_loader(true);
		cartManagement
			.apply_item_discount(rest)
			.then((res: any) => {
				if (res.status === 200) {
					set_discount_loader(false);
					set_show_discount_modal(false);
					handle_update_cart_discount(payload);
				}
			})
			.catch((error: any) => {
				set_discount_loader(false);
				toggle_toast({ show: true, message: error?.message, title: 'Something Went Wrong', status: 'warning' });
			});
	};

	const handle_dispatch_document = () => {
		dispatch(create_document_selected_buyer(false));
		dispatch(create_document_type(null));
		set_cart_loading(false);
	};

	const util_function_rule = (payload: any) => {
		const new_groups = util_function(payload);
		return new_groups;
	};
	const calculate_data = async (
		container: any,
		flag: boolean = false,
		unit: string = '',
		group_by: string = '',
		set_container_loading: any,
		items: any,
		groups: MappedCustomGroup[] = [],
		should_call_with_no_items = false,
	) => {
		try {
			set_is_primary_loading(true);
			const json_cart_rule = json_engine_rules?.cart_calculations_rule;
			const cart_validation_rule_fallback = _.isEmpty(cart_validation_rule)
				? await fetch_cart_validation_rule(json_engine_rules)
				: cart_validation_rule;

			const grouping_enabled = settings?.cart_grouping_config?.enabled ?? false;
			const updated_options_group = _.filter(settings?.cart_grouping_config?.options, (option: any) => option?.is_active);
			const updated_group = _.find(updated_options_group, { value: group_by }) || _.find(updated_options_group, { is_default: true });
			const updated_group_value = updated_group?.value || '';

			const payload =
				!_.isEmpty(selected_cart_discount) && !_.includes(['pending-approval', 'confirmed'], cart?.document_status)
					? {
							cart_id,
							buyer_id,
							items,
							discount_campaign_id: selected_cart_discount?.id,
							is_update_discount_campaign: show_discount_engine,
							cart_total: cart?.cart_total,
							cart_volume_unit: toggle_button_value,
							container_is_display,
							charges: discount_data ? [discount_data] : [],
							document_id,
							cart_grouping_logic: {
								enabled: grouping_enabled,
								group_by: updated_group_value,
								groups: cart_group_data,
							},
					  }
					: {
							cart_id,
							buyer_id,
							items,
							cart_volume_unit: toggle_button_value,
							container_is_display,
							charges: discount_data ? [discount_data] : [],
							document_id,
							cart_grouping_logic: {
								enabled: grouping_enabled,
								group_by: updated_group_value,
								groups: cart_group_data,
							},
					  };

			if (items) {
				set_cart_items(items);
			}
			if (_.isEmpty(payload?.items) && !should_call_with_no_items) {
				// set_cart_group_by('');
				return;
			}
			if (updated_group_value) {
				set_cart_group_by(updated_group_value);
			}

			const grps: any = util_function_rule({
				data: { ...payload, products: cart?.products, currency: currency_symbol },
				rule_config: json_cart_rule || json_cart_calc_rule_config,
				shipping_rule_config: cart_validation_rule_fallback,
			});

			const { container_data: _container = {}, grouping_data: _grouping = {}, cart_error: _cart_error } = grps;
			if (_cart_error) {
				set_cart_error(_cart_error);
			}
			set_selected_container({
				..._.head(_container?.containers),
			});
			const custom_groups_data = updated_group_value === CUSTOM_GROUPING ? _grouping?.groups : [];
			set_container_is_display(_container?.container_is_display);
			set_toggle_button_value(_.head(_container?.containers)?.unit);
			set_cart_group_data(_grouping?.groups);
			set_custom_groups(custom_groups_data);
			const calculate_payload = _.isEmpty(selected_cart_discount)
				? {
						items,
						containers: [
							{
								container_name: container?.container_name || '',
								container_key: container?.container_key || '',
								container_volume: container?.container_volume_data?.[unit] || 0,
								unit,
							},
						],
						cart_id,
						container_is_display: flag,
						cart_grouping_logic: {
							enabled: grouping_enabled,
							group_by: updated_group_value,
							groups: _grouping?.groups,
						},
				  }
				: {
						items,
						discount_campaign_id: selected_cart_discount?.id,
						is_update_discount_campaign: show_discount_engine,
						discount_type: selected_cart_discount?.configuration?.type,
						discount_value: selected_cart_discount?.configuration?.value,
						containers: [
							{
								container_name: container?.container_name || '',
								container_key: container?.container_key || '',
								container_volume: container?.container_volume_data?.[unit] || 0,
								unit,
							},
						],
						cart_id,
						container_is_display: flag,
						cart_grouping_logic: {
							enabled: grouping_enabled,
							group_by: updated_group_value,
							groups: _grouping?.groups,
						},
				  };
			await cart_management.post_calculate_container_occupancy(calculate_payload);
		} catch (err: any) {
			console.error(err);
		} finally {
			set_is_primary_loading(false);
			set_cart_loading(false);
			set_container_loading && set_container_loading(false);
		}
	};

	const handle_attach_catalog_id = async () => {
		try {
			await cart_management.post_attach_catalog(buyer?.buyer_cart?.id, [linked_catalog?.value]);
			dispatch<any>(update_catalog({ catalog: { value: linked_catalog?.value, label: linked_catalog?.label } }));
		} catch (err) {
			console.log(err);
		}
	};

	const calculate_charge_value = (charge_data: any, index: number, total: number) => {
		const value = charge_data?.charge?.[index]?.value;
		const value_type = charge_data?.charge?.[index]?.value_type;
		if (value_type === 'fixed') {
			return value;
		}

		return total ? total * (value / 100) : 0;
	};

	const handle_nudge_data = (payload: any) => {
		const response = shipping_util_function(payload);

		if (_.isEmpty(response)) return;

		const charges = _.get(response, 'charge', []);
		let updated_cart_total = _.get(response, 'cart_total', 0);
		let updated_charges: any = [];

		_.forEach(charges, (charge, index) => {
			let charge_value = 0;

			if (charge?.charge_type === 'discount') {
				charge_value = calculate_charge_value(response, index, updated_cart_total);
				updated_cart_total -= charge_value;
			} else if (charge?.charge_type !== 'discount') {
				charge_value = calculate_charge_value(response, index, updated_cart_total);
			}

			updated_charges.push({
				...charge,
				calculated_value: charge_value,
			});
		});

		const valid_charges = _.filter(updated_charges, (charge) => charge?.calculated_value > 0);

		set_nudge_data({ ...response, charge: valid_charges });
	};

	const parse_shipping_rule = (rule_config: any) => {
		const shippingData: any[] = [];

		function get_shipping_discount(conditions: any): void {
			if (!conditions || conditions?.length === 0) return;

			const [condition, discount_value_if_true, discount_value_if_false] = conditions;
			let range = '';
			let discount = 0;
			let discountDisplay = '';

			const charge_discount = _.find(discount_value_if_true?.charges, (charge: any) => charge?.charge_type === 'charge_discount');
			discount = _.get(charge_discount, 'value', 0);

			if (charge_discount?.value_type === 'fixed') {
				discountDisplay = _.isInteger(discount) ? `${cart_summary_card?.currency_symbol}${discount}` : `${discount}`;
			} else {
				discountDisplay = `${discount}%`;
			}

			if (condition['<']) {
				range = `< ${cart_summary_card?.currency_symbol}${condition['<'][1]}`;
			} else if (condition['>=']) {
				range = `>= ${cart_summary_card?.currency_symbol}${condition['>='][1]}`;
			} else if (condition.and) {
				const lower_bound = _.get(
					_.find(condition?.and, (c: any) => c['>=']),
					['>=', 1],
				);
				const upper_bound = _.get(
					_.find(condition?.and, (c: any) => c['<']),
					['<', 1],
				);

				if (lower_bound && upper_bound) {
					range = `${cart_summary_card?.currency_symbol}${lower_bound} - ${cart_summary_card?.currency_symbol}${upper_bound - 1}`;
				} else if (lower_bound) {
					range = `>= ${cart_summary_card?.currency_symbol}${lower_bound}`;
				}
			}

			shippingData.push({
				orderValue: range,
				shippingDiscount: discountDisplay,
			});

			if (_.get(discount_value_if_false, 'if')) {
				get_shipping_discount(discount_value_if_false.if);
			}
		}

		const charge_rule = _.get(rule_config, 'charge_rule.if', []);
		if (charge_rule.length > 0) {
			get_shipping_discount(charge_rule);
		}

		return _.filter(
			shippingData,
			(item) => item?.shippingDiscount !== '0%' && item?.shippingDiscount !== `${cart_summary_card?.currency_symbol}0`,
		);
	};

	const handle_delete_entity = useCallback(
		async (entity_id: string, cart_item_id: any, quantity_zero_exist?: boolean, from_discount_modal?: boolean, _refetch_data?: boolean) => {
			if (_.includes(deleted_products, cart_item_id)) {
				return;
			}
			try {
				deleted_products.push(cart_item_id);
				set_edit_product_price_change((product_ids) => product_ids?.filter((product_id) => product_id !== entity_id));
				await cartManagement.remove_items({ cart_id, cart_item_ids: [cart_item_id] }, false);

				if (quantity_zero_exist) {
					set_refetch_data((prev) => !prev);
					return;
				}

				toggle_global_error((prev: any) => {
					const new_errors = { ...prev };
					delete new_errors[entity_id];
					return new_errors;
				});

				let should_call_calculate_data = false;

				set_cart((prev_cart: any) => {
					const { unit_price } = get_unit_price_of_product({ ...prev_cart.products[entity_id], quantity: 0 });
					const cart_total = get_cart_total_on_change_quantity(prev_cart, entity_id, 0, unit_price, cart_item_id);

					const new_products = { ...prev_cart?.products };
					const new_items = { ...prev_cart?.items };
					const new_errors = { ...prev_cart?.errors };
					const new_validations = { ...prev_cart?.validations };

					let product_cart_item = new_items?.[entity_id];
					let filtered_cart_item = _.pickBy(product_cart_item, _.isObject);

					if (_.size(filtered_cart_item) > 1) {
						delete new_items[entity_id][cart_item_id];
						new_errors?.[entity_id]?.[cart_item_id] && delete new_errors?.[entity_id]?.[cart_item_id];
					} else {
						delete new_products[entity_id];
						delete new_items[entity_id];
						new_errors?.[entity_id] && delete new_errors?.[entity_id];
						new_validations?.products?.[entity_id] && delete new_validations?.products?.[entity_id];

						const validation_keys = ['out_of_stock', 'partially_in_stock'];

						validation_keys.forEach((key: any) => {
							if (!_.isEmpty(new_validations?.[key])) {
								new_validations[key] = new_validations[key]?.filter((ids: any) => ids !== entity_id);
							}
						});
					}

					const new_items_with_unit_prices = { ...prev_cart?.items_with_unit_prices };
					delete new_items_with_unit_prices[cart_item_id];

					if ((_.isEmpty(new_products) || _.isEmpty(new_items)) && !from_discount_modal) {
						should_call_calculate_data = true;
					}

					set_cart_errors(new_errors);

					const cart_data = JSON.parse(localStorage.getItem('CartData') || '{}');
					localStorage.setItem(
						'CartData',
						JSON.stringify({
							...cart_data,
							products: new_products,
						}),
					);

					return {
						...prev_cart,
						products: new_products,
						items: new_items,
						items_with_unit_prices: new_items_with_unit_prices,
						cart_total,
						errors: new_errors,
						validations: new_validations,
					};
				});

				if (should_call_calculate_data) {
					const default_cart_group_by = (
						_.find(settings?.cart_grouping_config?.options, { is_default: true }) || _.head(settings?.cart_grouping_config?.options)
					)?.value;
					calculate_data(
						selected_container,
						container_is_display,
						toggle_button_value,
						default_cart_group_by,
						set_cart_loading,
						get_items(cart),
						[],
						true,
					);
				}

				if (from_discount_modal) {
					set_show_discount_modal(false);
				}

				if (_refetch_data) {
					set_refetch_data((prev) => !prev);
				}
			} catch (error: any) {
				deleted_products.pop();
				toggle_toast({ show: true, message: error?.message, title: 'Something Went Wrong', status: 'warning' });
			}
		},
		[],
	);
	const handle_get_cart = async () => {
		if (show_pre_exists_modal) {
			return;
		}

		try {
			set_cart_loading(true);
			set_edit_product_price_change([]);
			set_show_only_price_updated(false);
			if (show_error_page) toggle_error_page(false);

			const response: any = await cartManagement.get_cart_details({ cart_id }, false);

			const linked_catalog_id = linked_catalog?.value;

			// if (!_.isEmpty(linked_catalog?.value) && linked_catalog?.value !== buyer?.catalog?.value) {
			// 	handle_attach_catalog_id();
			// 	set_refetch_data((prev) => !prev);
			// }
			if (response?.cart?.document_id) {
				try {
					if (response?.cart?.document_status === 'draft' || response?.cart?.document_status === null) {
						const response_cart: any = await edit_cart({
							buyer_id: response?.cart?.buyer_id,
							cart_id: response?.cart?.id,
							is_update_discount_campaign: show_discount_engine,
						});
						dispatch(update_buyer({ buyer_cart: response_cart?.buyer_cart, buyer_info: response_cart?.buyer_info }));
					} else {
						const get_new_cart: any = await cart_management.get_cart({
							buyer_id: response?.cart?.buyer_id,
							is_guest_buyer: false,
							is_update_discount_campaign: show_discount_engine,
						});

						const new_cart_details: any = await cart_management.get_cart_details({
							cart_id: get_new_cart?.data?.[0]?.id,
							is_guest_buyer: false,
						});

						dispatch(
							initializeCart({
								id: new_cart_details?.cart?.id,
								products: new_cart_details?.cart?.items,
								products_details: new_cart_details?.cart?.products,
								document_items: new_cart_details?.cart?.document_items || {},
							}),
						);
						set_cart(format_cart_details_response(new_cart_details?.cart));
						return;
					}
				} catch (err) {
					console.error(err);
				}
			}
			if (!_.isEmpty(linked_catalog_id) && linked_catalog_id !== active_catalog_id) {
				try {
					await cart_management.post_attach_catalog(response?.cart?.id, [linked_catalog?.value]);
					dispatch<any>(update_catalog({ catalog: { value: linked_catalog?.value, label: linked_catalog?.label } }));
				} catch (err) {
					console.error(err);
				}
			}
			if (response?.cart?.cart_errors) {
				set_refetch_data(!refetch_data);
				set_cart_loading(false);
				set_is_error_modal_open(true);
				set_is_discount_campaign_error(
					response?.cart?.cart_errors?.meta?.cart_products_unavailable || response?.cart?.cart_errors?.meta?.discount_campaign_not_valid,
				);

				return;
			}
			const { items, products: res_product, meta = {} } = response?.cart;
			const is_custom_group = meta?.grouping_data?.group_by === CUSTOM_GROUPING;
			const grp_data = is_custom_group ? meta?.grouping_data?.groups || [] : [];
			set_cart_group_by(meta?.grouping_data?.group_by);
			set_custom_groups(grp_data);
			const is_quantity_zero_exist: any = is_quantity_zero(items);

			if (is_quantity_zero_exist) {
				const { parent_key, obj_key } = is_quantity_zero_exist;
				let quantity_zero_exist = true;
				try {
					await handle_delete_entity(parent_key, obj_key, quantity_zero_exist);
				} catch (error: any) {
					toggle_toast({ show: true, message: error?.message, title: 'Something Went Wrong', status: 'warning' });
				}
				return;
			}
			if (response?.cart?.document_status === 'confirmed' || response?.cart?.document_status === 'pending-approval') {
				const discount_on_cart =
					response?.cart?.discount_type === 'percentage'
						? (response?.cart?.cart_total * response?.cart?.discount_value) / 100
						: response?.cart?.discount_type
						? response?.cart?.discount_value > response?.cart?.cart_total
							? response?.cart?.cart_total
							: response?.cart?.discount_value
						: 0;
				set_selected_cart_discount({
					id: response?.cart?.discount_campaign_id,
					configuration: {
						type: response?.cart?.discount_type,
						value: response?.cart?.discount_value,
					},
					cart_eligibilty_rule: response?.cart?.cart_eligibility_rule,
					name: response?.cart?.discount_campaign_name,
					discount_value: discount_on_cart,
					discounted_value: response?.cart?.cart_total - discount_on_cart,
				});
			}

			const data = format_cart_details_response(response.cart);

			if (items && Object.keys(items)?.length > 0) {
				for (let item in items) {
					if (res_product[item]) {
						const { id, parent_id } = res_product[item];

						items[item].parent_id = parent_id;
						items[item].id = id;
					}
				}
			} else {
				set_cart_group_by('');
				set_cart_loading(false);
			}
			dispatch(
				initializeCart({
					id: response?.cart?.id,
					products: items,
					products_details: res_product,
					document_items: response?.cart?.document_items || {},
				}),
			);

			set_cart(data);
			set_cart_errors(data?.errors);
			if (create_document_flag && type && !is_guest_buyer && !_.isEmpty(res_product)) {
				handle_create_document(type);
			} else if (_.isEmpty(res_product) && !is_guest_buyer && create_document_flag && type) {
				handle_dispatch_document();
				toggle_toast({
					show: true,
					message: `Cart is empty please add products to create ${_.capitalize(type)}`,
					title: `Cannot Create ${_.capitalize(type)}`,
					status: 'warning',
				});
			} else if (!create_document_flag || !type) {
				handle_dispatch_document();
			}
		} catch (error: any) {
			toggle_toast({ show: true, message: error?.message, title: 'Something Went Wrong', status: 'warning' });
			toggle_error_page(true);
			set_cart_loading(false);
		}
	};

	// TODO: Ultron 1.5 (Validations)
	const handle_change_quantity = useCallback(
		_.debounce(async (entity_id: string, quantity: any, cart_item_id: any, is_custom_product?: boolean, custom_id?: string) => {
			const id: any = is_custom_product ? custom_id : entity_id;
			if (_.includes(deleted_products, cart_item_id)) {
				return;
			}
			try {
				const response: any = await cartManagement.update_item(
					{
						cart_id,
						product_id: id,
						quantity,
						cart_item_id,
					},
					false,
				);
				const new_quantity = response?.quantity;
				set_cart((prev_cart: any) => {
					const { unit_price } = get_unit_price_of_product({ ...prev_cart?.products?.[id], quantity: new_quantity });
					const cart_total = get_cart_total_on_change_quantity(prev_cart, id, new_quantity, unit_price, cart_item_id);
					const prev_cart_item = prev_cart?.items?.[id]?.[cart_item_id];
					let discount_value: any;

					if (prev_cart_item?.discount_type && prev_cart_item?.discount_value) {
						discount_value = get_discounted_value(
							prev_cart_item?.discount_type,
							prev_cart_item?.discount_value,
							prev_cart?.items_with_unit_prices?.[cart_item_id],
						);
					}

					return {
						...prev_cart,
						cart_total,
						items: {
							...prev_cart?.items,
							[id]: {
								...prev_cart?.items[id],
								[cart_item_id]: {
									...prev_cart?.items?.[id]?.[cart_item_id],
									quantity: new_quantity,
									product_state: response?.product?.product_state ?? PRODUCT_DEFAULT_TYPE,
									...(discount_value && { final_total: (unit_price - discount_value) * new_quantity }),
								},
							},
						},
						items_with_unit_prices: {
							...prev_cart?.items_with_unit_prices,
							[cart_item_id]: unit_price,
						},
						products: {
							...prev_cart?.products,
							[id]: response?.product ? response?.product : prev_cart?.products?.[id],
						},
					};
				});

				if (!response?.errors || !id) {
					set_cart_errors((prev_err: any) => {
						const product = prev_err?.[id];
						const temp = product?.filter((prod: any) => prod?.cart_item_id !== cart_item_id);

						if (_.isEmpty(temp)) {
							delete prev_err?.[id];

							return { ...prev_err };
						} else return { ...prev_err, [id]: [...temp] };
					});
				}
			} catch (error: any) {
				toggle_toast({ show: true, message: error?.message, title: 'Something Went Wrong', status: 'warning' });
			}
		}, 500),
		[cart_id],
	);

	const handle_update_note = async (entity_id: string, data: any, cart_item_id: string, product?: any, is_custom_product?: boolean) => {
		const notes = [];
		if (data?.customer_note?.value) notes.push(data?.customer_note);
		if (data?.sales_rep_note?.value) notes.push(data?.sales_rep_note);
		else notes.push(data);

		try {
			const response: any = await cartManagement.add_note({
				cart_id,
				product_id: entity_id,
				cart_item_id,
				meta: { notes },
			});
			if (!is_custom_product) {
				set_cart((prevCart: any) => ({
					...prevCart,
					items: {
						...prevCart?.items,
						[entity_id]: {
							...prevCart?.items?.[entity_id],
							[cart_item_id]: {
								...prevCart?.items?.[entity_id]?.[cart_item_id],
								meta: response?.meta,
							},
						},
					},
				}));
				set_selected_product((prev_product: any) => ({
					...prev_product,
					meta: response?.meta,
				}));
			}

			set_show_note_modal(false);
			const product_metadata = get_product_metadata(product);
			Mixpanel.track(Events.SAVE_NOTE_CLICKED, {
				tab_name: 'Home',
				page_name: 'cart_page',
				section_name: 'add_product_note_popup',
				subtab_name: '',
				cart_metadata,
				customer_metadata,
				product_metadata,
			});
		} catch (error: any) {
			toggle_toast({ show: true, message: error?.message, title: 'Something Went Wrong', status: 'warning' });
		}
	};

	const handle_remove_note = async (entity_id: string, cart_item_id: string) => {
		try {
			const response: any = await cartManagement.remove_note({
				cart_id,
				cart_item_id,
				product_id: entity_id,
				delete_all: true,
				delete_keys: [],
			});

			set_cart((prevCart: any) => ({
				...prevCart,
				items: {
					...prevCart?.items,
					[entity_id]: {
						...prevCart?.items?.[entity_id],
						[cart_item_id]: {
							...prevCart?.items?.[entity_id]?.[cart_item_id],
							meta: response?.meta,
						},
					},
				},
			}));
			set_selected_product((prev_product: any) => ({
				...prev_product,
				meta: response?.meta,
			}));
			set_show_note_modal(false);
		} catch (error: any) {
			toggle_toast({ show: true, message: error?.message, title: 'Something Went Wrong', status: 'warning' });
		}
	};

	const handle_discard_cart = async () => {
		try {
			await cartManagement.clear_cart({
				cart_id,
			});
			dispatch<any>(set_cart_action({ buyer_id, is_guest_buyer }));
			set_cart({});
			set_adhoc_count(1);
			handle_get_cart();
			Mixpanel.track(Events.DELETE_CART_OPTION_CLICKED, {
				tab_name: 'Home',
				page_name: 'cart_page',
				section_name: 'cart_more_options',
				subtab_name: '',
				cart_metadata,
				customer_metadata,
			});
		} catch (error) {
			console.error(error);
		}
	};

	const handle_remove_discount = async (product_data: any) => {
		const cart_item_id: any = _.findKey(product_data?.items, { discount_type: null, discount_value: null });
		const base_product_obj = product_data?.items?.[cart_item_id];
		// const discounted_product_obj = product_data?.items[product_data?.cart_item_id];
		// const base_product_quantity = base_product_obj?.quantity + discounted_product_obj?.quantity;
		// const discounted_cart_item_id = product_data?.cart_item_id;
		const is_custom_product: boolean = product_data?.is_custom_product ?? false;

		// const notes_data = {
		// 	value: _.head(discounted_product_obj?.meta?.notes)?.value || '',
		// };
		if (base_product_obj) {
			set_discount_loader(true);
			try {
				// await handle_change_quantity(product_data?.id, base_product_quantity || 1, cart_item_id);
				// await handle_delete_entity(product_data?.id, discounted_cart_item_id, false, true);
				await cart_management.remove_discount(product_data?.cart_item_id);
				set_discount_loader(false);
				set_refetch_data(!refetch_data);
			} catch (err) {
				set_discount_loader(false);
				console.error(err);
			}
		} else if (is_custom_product) {
			// let _cart_item_id = crypto.randomUUID();
			set_discount_loader(true);
			try {
				// await cart_management.update_item({
				// 	cart_id,
				// 	product_id: product_data?.id,
				// 	quantity: discounted_product_obj?.quantity,
				// 	cart_item_id: _cart_item_id,
				// 	is_custom_product,
				// 	applied_modifiers: product_data?.applied_modifiers || {},
				// 	created_from_parent_id: product_data?.parent_id,
				// });
				// if (discounted_product_obj?.meta?.notes) {
				// 	await handle_update_note(product_data?.id, notes_data, _cart_item_id, {}, true);
				// }
				// await handle_delete_entity(product_data?.id, discounted_cart_item_id, false, true, true);
				await cart_management.remove_discount(cart_item_id);
				set_discount_loader(false);
				set_refetch_data(!refetch_data);
			} catch (err) {
				set_discount_loader(false);
				console.error(err);
			}
		} else {
			// let _cart_item_id = crypto.randomUUID();
			set_discount_loader(true);
			try {
				// await cart_management.update_item({
				// 	cart_id,
				// 	product_id: product_data?.id,
				// 	quantity: discounted_product_obj?.quantity,
				// 	cart_item_id: _cart_item_id,
				// });
				// if (discounted_product_obj?.meta?.notes) {
				// 	await handle_update_note(product_data?.id, notes_data, cart_item_id);
				// }
				// await handle_delete_entity(product_data?.id, discounted_cart_item_id, false, true, true);
				// set_discount_loader(false);
				await cart_management.remove_discount(product_data?.cart_item_id);
				set_discount_loader(false);
				set_refetch_data(!refetch_data);
			} catch (err) {
				set_discount_loader(false);
				console.error(err);
			}
		}
	};

	const on_select_buyer = async (_buyer: any) => {
		if ((transfer_cart || _buyer?.transfer_cart) && _buyer?.buyer_id) {
			try {
				const response: any = await cartManagement.attach_cart_to_buyer({
					cart_id,
					buyer_id: _buyer?.buyer_id,
				});
				const data = format_cart_details_response(response.cart);
				set_cart(data);
				if (create_new_buyer) {
					dispatch(create_document_selected_buyer(true));
				}
			} catch (error: any) {
				if (error?.response?.status === 400) {
					set_pre_exsists_modal(true);
				} else {
					toggle_toast({ show: true, message: error?.message, title: 'Something Went Wrong', status: 'warning' });
				}
			} finally {
				set_transfer_cart(false);
			}
		}
	};

	const fetch_cart_validation_rule = async (json_engine_cart_rules: any) => {
		if (!_.isEmpty(impersonated_by)) {
			return {};
		}

		if (!_.isEmpty(json_engine_cart_rules?.cart_validation_rule)) {
			return json_engine_cart_rules?.cart_validation_rule;
		}

		try {
			const response = (await rule_setting?.get_default_tenant_config('json_cart_rule_validation')) || {};
			return _.get(response, 'data', {});
		} catch (error) {
			console.error(error);
		}
	};

	const fetch_charge_rule_config = async (json_engine_cart_rules: any) => {
		if (!_.isEmpty(json_engine_cart_rules?.json_rule_charges_config)) {
			return json_engine_cart_rules?.json_rule_charges_config;
		}

		try {
			const response = (await rule_setting?.get_default_tenant_config('json_rule_charges_config')) || {};
			return _.get(response, 'data', {});
		} catch (error) {
			console.error(error);
		}
	};

	const handle_update_document = async () => {
		set_is_primary_loading(true);

		let items = get_line_items();

		Object.keys(items).forEach((key) => {
			// Delete the 'id' and 'parent_id' properties from each object
			delete items[key]?.id;
			delete items[key]?.parent_id;
		});

		const containers = _.isEmpty(selected_container) ? [] : [{ ...selected_container }];
		const json_cart_rule = json_engine_rules?.cart_calculations_rule;
		const cart_validation_rule_fallback = _.isEmpty(cart_validation_rule)
			? await fetch_cart_validation_rule(json_engine_rules)
			: cart_validation_rule;

		const validation_payload = {
			cart_id,
			items,
			container_is_display,
			containers,
		};
		const grps: any = util_function_rule({
			data: { ...validation_payload, products: cart?.products },
			rule_config: json_cart_rule || json_cart_calc_rule_config,
			shipping_rule_config: cart_validation_rule_fallback,
		});

		const { cart_error: _cart_error } = grps;
		if (_cart_error) {
			set_cart_error(_cart_error);
		}
		if (_cart_error?.type === 'error') {
			set_is_primary_loading(false);
			return;
		}
		try {
			const payload = {
				cart_id,
				buyer_id,
				items,
				containers,
				discount_campaign_id: selected_cart_discount?.id,
				is_update_discount_campaign: show_discount_engine,
				cart_volume_unit: toggle_button_value,
				container_is_display,
				charges: discount_data ? [discount_data] : [],
				document_id,
				cart_total: cart?.cart_total,
			};
			const response: any = await cartManagement.update_document(payload, false);
			set_is_primary_loading(false);
			navigate_to_document(response?.type, document_id, response?.document_status);
			setTimeout(() => {
				handle_delete_cart_and_change_buyer();
			}, 500);
			Mixpanel.track(`update_${response?.type}_clicked`, {
				tab_name: 'Home',
				page_name: 'cart_page',
				section_name: '',
				subtab_name: '',
				cart_metadata,
				customer_metadata,
			});
		} catch (error: any) {
			set_is_primary_loading(false);
			if (error?.response?.status === 404) {
				set_cart_loading(false);
				set_show_alert(true);
				set_is_error_modal_open(true);
				set_is_discount_campaign_error(
					error?.response?.data?.cart_errors?.meta.cart_products_unavailable ||
						error?.response?.data?.cart_errors?.meta.discount_campaign_not_valid,
				);
				return;
			}
			set_refetch_data(!refetch_data);
			toggle_toast({ show: true, message: error?.message, title: 'Something Went Wrong', status: 'warning' });
		}
	};

	// const handle_bar_code = async () => {
	// 	console.log('handle_bar_code');
	// };

	const handle_get_buyer_details = async () => {
		api_requests.buyer
			.get_buyer_details(buyer_id, false)
			.then((res: any) => {
				if (res?.status === 200) {
					set_buyer_details(res?.data);
				}
			})
			.catch((error) => {
				if (error?.response?.status !== 404) {
					// TODO: Handling of not found buyer cart
					toggle_toast({ show: true, message: error?.message, title: 'Something Went Wrong', status: 'warning' });
				}
			});
	};

	const get_tear_sheet_store_front = (tenant_id: any, product_id: any, show_price: boolean) => {
		set_show_tear_sheet(false);
		cartManagement
			.get_cart_tear_sheet_v2(tenant_id, product_id, [selected_catalog_id], show_price, storefront_template_id)
			.then((response: any) => {
				if (response?.data) {
					dispatch(set_notification_feedback(true));
					set_download_loader(false);
					window.open(response?.data?.url, '_blank');
				} else {
					console.error('Invalid response format for PDF download.');
					toggle_toast({ show: true, message: 'Wrong response from Server', title: 'Try Again', status: 'warning' });
					set_show_tear_sheet(false);
				}
			})
			.catch((error: any) => {
				console.error('Error downloading PDF:', error);
				toggle_toast({ show: true, message: error?.message, title: 'Something Went Wrong', status: 'warning' });
			})
			.finally(() => {
				if (show_preview) {
					set_show_preview(false);
				}
			});
	};
	const get_cart_tear_sheet = (tenant_id: any, product_id: any, show_price: boolean) => {
		toggle_toast({ show: true, message: 'Downloading in Progress...', title: 'Downloading', status: 'success' });
		get_tear_sheet_store_front(tenant_id, product_id, show_price);
	};

	const handle_validate_sections = (document_attributes: any, document_section: any) => {
		const validate_field_arr: any[] = document_section?.sections?.flatMap((item: any) =>
			item?.attributes?.filter((attr: any) => attr?.required)?.map((attr: any) => attr?.id),
		);
		let is_valid: boolean = validate_field_arr?.some((ele: any) => allValuesEmpty(document_attributes[ele]));
		return is_valid;
	};

	const get_new_cart = async () => {
		try {
			dispatch<any>(set_cart_action({ buyer_id, is_guest_buyer: false }));
		} catch (error) {
			console.error(error);
		} finally {
			set_flag_new_cart(false);
		}
	};

	const handle_convert_to_order = async () => {
		set_is_secondary_loading(true);

		const items = get_line_items();

		Object.keys(items).forEach((key) => {
			// Delete the 'id' and 'parent_id' properties from each object
			delete items[key]?.id;
			delete items[key]?.parent_id;
		});

		try {
			let res: any = await cartManagement.update_document({
				cart_id,
				buyer_id,
				items,
				charges: discount_data ? [discount_data] : [],
				document_id,
				containers: _.isEmpty(selected_container) ? [] : [{ ...selected_container }],
				container_is_display,
				cart_volume_unit: toggle_button_value,
				cart_total: cart?.cart_total,
			});

			const { document_attributes, document_section }: any = await get_document_details_api(document_id);

			if (document_attributes && document_section && handle_validate_sections(document_attributes, document_section)) {
				set_is_secondary_loading(false);
				set_show_error(true);
				set_show_confirmation_modal(false);
				return;
			}

			if (res?.document_status !== document.DocumentStatus?.submitted && res?.document_status !== document.DocumentStatus?.accepted) {
				await api_requests.order_management.update_document_status('submit', { document_id });
			}

			const updated_quote: any = await api_requests.order_management.update_document_status('convert', {
				document_id,
			});
			set_is_secondary_loading(false);
			const new_document_id = updated_quote.new_document_id;
			navigate_to_document('order', new_document_id);
			dispatch(show_document_alert(true));
			set_show_confirmation_modal(false);
			setTimeout(() => {
				handle_delete_cart_and_change_buyer();
			}, 500);
		} catch (error: any) {
			set_is_secondary_loading(false);
			if (error?.response?.status === 404) {
				set_cart_loading(false);
				set_show_alert(true);
				set_refetch_data(!refetch_data);
				set_is_error_modal_open(true);
				set_is_discount_campaign_error(
					error?.response?.data?.cart_errors?.meta.cart_products_unavailable ||
						error?.response?.data?.cart_errors?.meta.discount_campaign_not_valid,
				);
				return;
			}
			toggle_toast({ show: true, message: error?.message, title: 'Something Went Wrong', status: 'warning' });
		}
	};

	const handle_pre_exists_proceed = () => {
		navigate(`/review/order/${cart_id}`);
	};

	// const get_multiple_tearsheet_templates = () => {
	// 	cartManagement
	// 		.get_multiple_tearsheets()
	// 		.then((res: any) => {
	// 			if (res?.status === 200) {
	// 				set_multiple_template(res?.data);
	// 				set_selected_template(_.find(res?.data, { is_default: true })?.id || '');
	// 			}
	// 		})
	// 		.catch((err: any) => {
	// 			console.error(err);
	// 		});
	// };

	const get_tearsheet_preview = (tenant_id: any, product_id: any, show_price: boolean, template_id: string) => {
		set_preview_loader(true);
		cartManagement
			.get_tearsheet_preview(tenant_id, product_id, [selected_catalog_id], show_price, template_id)
			.then((res: any) => {
				if (res?.status === 200) {
					set_preview_tearsheet_url(res?.data?.url || '');
					set_preview_loader(false);
				}
			})
			.catch((err: any) => {
				console.error(err);
				set_preview_loader(false);
			});
	};

	useEffect(() => {
		if (create_document_flag && !is_guest_buyer) {
			dispatch(create_document_selected_buyer(false));
			dispatch(create_document_type(null));
		}
		if (buyer_id) {
			handle_get_buyer_details();
			get_buyer_discount_campaign(buyer_id);
		}
	}, [buyer_id, refetch_data, buyer]);

	useEffect(() => {
		if (
			(_.size(cart_discount_campaigns) > 0 || _.size(buyer_discount_campaigns) > 0) &&
			cart &&
			!_.includes(['pending-approval', 'confirmed'], cart?.document_status)
		) {
			calculate_max_cart_discount();
		}
	}, [cart_discount_campaigns, buyer_discount_campaigns, buyer, cart]);

	useEffect(() => {
		if (!catalog.loader) {
			if (!_.isEmpty(catalog.catalog_data)) {
				set_catalog_list(catalog.catalog_data);
			}
		}
	}, [catalog.loader, catalog_id]);

	useEffect(() => {
		if (cart_id) {
			get_discount_campaign();
			get_cart_discount_campaign();
			handle_get_cart();
		}
	}, [cart_id, catalog_id, refetch_data]);

	useEffect(() => {
		if (show_price_on_tear_sheet) {
			set_catalog_id(catalog_id);
		} else {
			set_catalog_id('');
		}
	}, [show_price_on_tear_sheet, catalog_id]);

	useEffect(() => {
		if (flag_new_cart) {
			get_new_cart();
		}
	}, [flag_new_cart]);

	useEffect(() => {
		if (show_pre_exists_modal) {
			dispatch(
				initializeCart({
					id: cart_id,
					products: _cart?.products,
					products_details: _cart?.products_details,
					document_items: _cart?.document_items || {},
				}),
			);
		}
	}, [cart_id]);

	useEffect(() => {
		const initializeRules = async () => {
			const cart_validation_rule_response = await fetch_cart_validation_rule(json_engine_rules);
			const charge_rule_config = await fetch_charge_rule_config(json_engine_rules);

			set_cart_validation_rule(cart_validation_rule_response);
			set_charges_rule_config(charge_rule_config);
		};

		initializeRules();
	}, [json_engine_rules]);

	useEffect(() => {
		if (charges_rule_config) {
			const response = parse_shipping_rule(charges_rule_config);
			set_know_more_data(response);
		}
	}, [charges_rule_config, cart_summary_card?.currency_symbol]);

	useEffect(() => {
		if (!is_ultron && cart) {
			handle_nudge_data({ cart, buyer_details, rule_config: charges_rule_config, cart_items });
		}
	}, [cart, buyer_details, cart_summary_card, cart_items, charges_rule_config]);

	return {
		handle_delete_entity,
		handle_change_quantity,
		handle_update_note,
		handle_remove_note,
		handle_discard_cart,
		handle_create_document,
		handle_update_document,
		handle_remove_discount,
		set_is_secondary_loading,
		set_is_primary_loading,
		set_show_discount_modal,
		selected_product,
		set_selected_product,
		show_discount_modal,
		create_new_buyer,
		show_error,
		set_show_error,
		is_primary_loading,
		set_create_new_buyer,
		is_secondary_loading,
		cart_summary_card,
		// handle_bar_code,
		currency_symbol,
		toast,
		toggle_toast,
		is_edit_flow,
		show_error_page,
		show_buyer_panel,
		toggle_buyer_panel,
		on_select_buyer,
		set_transfer_cart,
		is_cart_global_error,
		toggle_global_error,
		type,
		set_type,
		is_buyer_add_form,
		set_is_buyer_add_form,
		handle_convert_to_order,
		cart: { data: cart, loading: cart_loading, refetch: handle_get_cart },
		set_cart,
		show_tear_sheet,
		show_price_on_tear_sheet,
		selected_catalog_id,
		catalog_list,
		set_catalog_id,
		show_note_modal,
		set_show_note_modal,
		set_show_tear_sheet,
		set_show_price_on_tear_sheet,
		get_cart_tear_sheet,
		download_loader,
		discount_loader,
		set_discount_loader,
		set_download_loader,
		handle_apply_item_discount,
		cart_id,
		buyer,
		show_pre_exists_modal,
		set_pre_exsists_modal,
		handle_pre_exists_proceed,
		proceed_btn_loading,
		set_proceed_btn_loading,
		is_error_modal_open,
		set_is_error_modal_open,
		show_confirmation_modal,
		set_show_confirmation_modal,
		handle_discount_check,
		show_alert,
		set_show_alert,
		refetch_data,
		set_refetch_data,
		buyer_data,
		set_buyer_data,
		multiple_template,
		selected_template,
		set_selected_template,
		// containers
		container_config_data,
		container_is_display,
		selected_container,
		set_container_config_data,
		set_container_is_display,
		set_selected_container,
		show_preview,
		set_show_preview,
		get_tearsheet_preview,
		preview_tearsheet_url,
		set_preview_tearsheet_url,
		preview_loader,
		toggle_button_value,
		set_toggle_button_value,
		set_modified_volumne,
		modified_volumne,
		open_custom_product,
		set_open_custom_product,
		adhoc_data,
		set_adhoc_data,
		adhoc_count,
		set_adhoc_count,
		variant_drawer,
		set_variant_drawer,
		variant_data,
		set_variant_data,
		similar_drawer,
		set_similar_drawer,
		cart_errors,
		set_cart_errors,
		storefront_template_id,
		cart_group_by,
		set_cart_group_data,
		cart_group_data,
		calculate_data,
		custom_groups,
		set_custom_groups,
		set_cart_loading,
		cart_metadata,
		customer_metadata,
		edit_price_modal_data,
		set_edit_price_modal_data,
		is_edit_modifiers,
		set_is_edit_modifiers,
		edit_product,
		set_edit_product,
		show_error_only,
		set_show_error_only,
		cart_error,
		nudge_data,
		know_more_data,
		show_only_price_updated,
		set_show_only_price_updated,
		edit_product_price_change,
		set_edit_product_price_change,
		update_price_modal_data,
		set_update_price_modal_data,
		discount_campaigns,
		set_discount_campaigns,
		cart_discount_campaigns,
		set_cart_discount_campaigns,
		selected_cart_discount,
		set_selected_cart_discount,
		buyer_discount_campaigns,
		set_buyer_discount_campaigns,
		is_discount_campaign_error,
		set_is_discount_campaign_error,
	};
};

export default useCartSummary;
