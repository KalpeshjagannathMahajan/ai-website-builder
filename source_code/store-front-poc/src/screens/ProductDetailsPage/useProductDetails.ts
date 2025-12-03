/* eslint-disable */
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import api_requests from 'src/utils/api_requests';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import RouteNames from 'src/utils/RouteNames';
// import { download_pdf } from 'src/utils/common';
import { product_listing } from 'src/utils/api_requests/productListing';
import { PRODUCT_DETAILS_TYPE } from './constants';
import cart_management from 'src/utils/api_requests/cartManagement';
import { useDispatch } from 'react-redux';
import { initializeCart } from 'src/actions/cart';
import { useTranslation } from 'react-i18next';
import { Product } from '../ProductListing/mock/ProductInterface';
import { update_catalog } from 'src/actions/buyer';
import { set_notification_feedback } from 'src/actions/notifications';
import { ISelectedFilters } from 'src/common/@the-source/molecules/FiltersAndChips/interfaces';
import { get_customer_metadata } from 'src/utils/utils';
import { format_cart_details_response } from '../CartSummary/helper';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
import usePricelist from 'src/hooks/usePricelist';

const useProductDetails = () => {
	const { t } = useTranslation();
	const [product_details, set_product_details] = useState<Product>({} as Product);
	const [product_section, set_product_section] = useState([]);
	const [open, set_open] = useState(false);
	const [drawer, set_drawer] = useState<Boolean>(false);
	const [variant_drawer, set_variant_drawer] = useState({
		state: false,
		attribute_type: '',
		type: '',
		key: 0,
		hinge_id: '',
		active_hinge: '',
	});
	const [loading, set_loading] = useState(false);
	const show_discount_engine = useSelector((state: any) => state?.settings?.enable_discount_engine) ?? false;
	const [tier_final_price, set_tier_final_price] = useState(null);
	const [price, set_price] = useState(0);
	const [catalog_list, set_catalog_list] = useState<any[]>([]);
	const [discount_campaigns, set_discount_campaigns] = useState<any>([]);
	const [frequent_products, set_frequent_products] = useState<any[]>();
	const [similar_products, set_similar_products] = useState<any[]>();
	const [related_products, set_related_products] = useState<any[]>();
	const [tear_sheet_catalog_id, set_tear_sheet_catalog_id] = useState('');
	const [show_tear_sheet, set_show_tear_sheet] = useState(false);
	const [show_price_on_tear_sheet, set_show_price_on_tear_sheet] = useState(false);
	const [download_loader, set_download_loader] = useState(false);
	const [toast, toggle_toast] = useState({ show: false, message: '', title: '', status: 'success' });
	const [showEmptyState, setShowEmptyState] = useState(false);
	const [empty_state_text, set_empty_state_text] = useState<string>('Product not found in this Pricelist');
	const [selected_template, set_selected_template] = useState<string>('');
	const [multiple_template, set_multiple_template] = useState<any>([]);
	const [show_delete_product_modal, set_show_delete_product_modal] = useState(false);
	const [delete_action_active, set_delete_action_active] = useState(false);
	const [selected_skus, set_selected_skus] = useState([]);
	const [cart_data, set_cart_data] = useState<any>([]);
	const [selected_filters, set_selected_filters] = useState<ISelectedFilters>({ filters: {}, range_filters: {} });
	const linked_catalog = useSelector((state: any) => state?.linked_catalog);

	const login = useSelector((state: any) => state?.login);
	const buyer = useSelector((state: any) => state?.buyer);
	const catalog_id = useSelector((state: any) => state?.buyer?.buyer_info?.pricelist);
	const tenant_id = buyer?.is_guest_buyer ? undefined : buyer?.buyer_cart?.tenant_id;
	const template_id = useSelector((state: any) => state?.settings?.tear_sheet_templates?.['tear-sheet']);
	const wizshop_settings: any = localStorage.getItem('wizshop_settings');
	const prelogin_settings = JSON.parse(wizshop_settings);
	const is_pre_login_allowed = prelogin_settings?.prelogin_allowed || false;
	const is_logged_in = login?.status?.loggedIn;
	const params = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();
	const { id } = params;
	const _page = location?.state || 1;
	const pricelist_value = usePricelist();
	const presisted_data = JSON.parse(localStorage.getItem('persist:root') || '');
	const customer_information = presisted_data?.buyer?.buyer_id;
	const buyer_id = customer_information || buyer?.buyer_id || buyer?.buyer_info?.id;

	const get_below_hinges = (variant_data_map: any, selected_hinges: any, product_id: string, hinge_id: string) => {
		const hinge_value = (_.find(variant_data_map, { product_id }) || {})?.[hinge_id];
		const new_product = _.find(
			variant_data_map,
			(item) => _.isMatch(item, { ...selected_hinges, [hinge_id]: hinge_value }) && (item.is_active === true || !_.has(item, 'is_active')),
		);
		if (new_product === undefined) {
			return _.toString(_.find(variant_data_map, { ...selected_hinges, is_active: true }))?.[hinge_id];
		} else {
			return hinge_value;
		}
	};

	const handle_render_variant = (index: number, hinge_id: string, hinge: { value: string }, is_select: boolean = false) => {
		const { variants_meta, type } = product_details;
		const { hinge_attributes, variant_data_map = [] }: any = variants_meta;

		const selected_hinges = { [hinge_id]: hinge.value };
		const sorted_hinge_attributes = _.orderBy(hinge_attributes, 'priority');

		if (type === PRODUCT_DETAILS_TYPE.variant) {
			const _length = is_select === true ? sorted_hinge_attributes?.length : index;
			for (let i = 0; i < _length; i++) {
				if (i === index) {
					continue;
				}
				const hinge_attribute = sorted_hinge_attributes[i];
				const to_show =
					i > index && is_select
						? get_below_hinges(variant_data_map, selected_hinges, id || '', hinge_attribute.id)
						: (_.find(variant_data_map, (item) => item.product_id === id && (item.is_active === true || !_.has(item, 'is_active'))) || {})[
								hinge_attribute.id
						  ];

				if (!to_show) {
					continue;
				}

				selected_hinges[hinge_attribute.id] = to_show;
			}
		}

		const product_id = _.find(
			variant_data_map,
			(item) => _.isMatch(item, { ...selected_hinges }) && (item.is_active === true || !_.has(item, 'is_active')),
		)?.product_id;
		return product_id;
	};

	const handle_nagivate_to_variants = (index: number, hinge_id: string, hinge: any) => {
		const product_id = handle_render_variant(index, hinge_id, hinge, true);
		if (product_id) {
			navigate(`${RouteNames.product.product_detail.routing_path}${product_id}`, { replace: true });
		}
	};

	const transform_data_to_state = (props_data: any) => {
		const initial_state: any = {};
		props_data.forEach((item: any) => {
			initial_state[item.id] = {};
		});
		return initial_state;
	};

	const handle_url = (variant_type: any, variants: any) => {
		if (variant_type === 'product' && !_.isEmpty(variants)) {
			const select_variant_id = variants[0]?.product_id;
			if (select_variant_id) {
				const newUrl = `/product-details/${select_variant_id}`;
				navigate(newUrl, { state: _page, replace: true });
			}
		}
	};

	const handle_get_product_details = async (new_id: any) => {
		set_loading(true);
		api_requests.product_details
			.get_pdp_details(new_id, buyer_id, [pricelist_value?.value || ''], is_pre_login_allowed)
			.then((res: any) => {
				if (res.status === 200) {
					const { type, variants_meta, is_active } = res?.data;
					const variant_data_map = _.get(variants_meta, 'variant_data_map');
					handle_url(type, variant_data_map);
					set_product_details(res?.data);
					let data = res?.data?.variants_meta?.hinge_attributes;
					transform_data_to_state(data);
					if (is_active === false) {
						setShowEmptyState(true);
						set_empty_state_text('This product is discontinued');
					} else {
						setShowEmptyState(false);
					}
					setTimeout(() => set_loading(false), 0);
					// set_loading(false);
				}
			})
			.catch((err: any) => {
				setShowEmptyState(true);
				setTimeout(() => set_loading(false), 0);
				// set_loading(false);
				console.log(err);
			});

		api_requests.product_details
			.get_pdp_config()
			.then((res: any) => {
				if (res.status === 200) {
					set_product_section(res?.data);
					set_loading(false);
				}
			})
			.catch((err: any) => {
				console.log(err);
				set_loading(false);
			});
	};

	const handle_total_price = (_price: any) => {
		set_price(_price);
	};

	const get_tear_sheet_store_front = (product_id: string, show_price: boolean) => {
		set_show_tear_sheet(false);
		api_requests.product_details
			.post_product_tear_sheet_v2(product_id, buyer?.buyer_id, [catalog_id], show_price, template_id)
			.then((response: any) => {
				if (response?.data) {
					set_download_loader(false);
					set_tear_sheet_catalog_id(catalog_id);
					window.open(response?.data?.url, '_blank');
				} else {
					console.error(t('PDP.useProductDetails.Invalid'));
					set_download_loader(false);
					set_tear_sheet_catalog_id(catalog_id);
					toggle_toast({ show: true, message: t('PDP.useProductDetails.WrongResponse'), title: 'Try Again', status: 'warning' });
				}
			})
			.catch((error: any) => {
				console.error(t('PDP.useProductDetails.ErrorDownloading'), error);
				set_download_loader(false);
				toggle_toast({ show: true, message: error?.message, title: t('PDP.useProductDetails.SomethingWentWrong'), status: 'warning' });
			});
	};

	const get_tear_sheet_ultron = (product_id: string, show_price: boolean) => {
		api_requests.product_details
			.post_product_tear_sheet_v3(
				product_id,
				tenant_id,
				tear_sheet_catalog_id !== '' ? [tear_sheet_catalog_id] : [],
				show_price,
				selected_template,
			)
			.then((response: any) => {
				if (response?.data) {
					dispatch(set_notification_feedback(true));
					set_show_tear_sheet(false);
					set_download_loader(false);
					set_tear_sheet_catalog_id(catalog_id);
				} else {
					console.error(t('PDP.useProductDetails.Invalid'));
					toggle_toast({ show: true, message: t('PDP.useProductDetails.WrongResponse'), title: 'Try Again', status: 'warning' });
					set_show_tear_sheet(false);
					set_download_loader(false);
					set_tear_sheet_catalog_id(catalog_id);
				}
			})
			.catch((error: any) => {
				console.error(t('PDP.useProductDetails.ErrorDownloading'), error);
				set_download_loader(false);
				toggle_toast({ show: true, message: error?.message, title: t('PDP.useProductDetails.SomethingWentWrong'), status: 'warning' });
			});
	};

	const get_product_tear_sheet = (product_id: any, show_price: boolean) => {
		toggle_toast({ show: true, message: t('PDP.useProductDetails.DownloadInProgress'), title: 'Downloading', status: 'success' });
		is_ultron ? get_tear_sheet_ultron(product_id, show_price) : get_tear_sheet_store_front(product_id, show_price);
	};

	const get_frequently_bought_products = (set_loading_product: any) => {
		if (id) {
			product_listing
				.get_frequent_products(buyer_id, id, catalog_id ? [catalog_id] : [], is_logged_in)
				.then((response: any) => {
					set_loading_product(true);
					set_frequent_products(response?.data);
				})
				.catch((err) => {
					console.error(err);
				});
		}
	};
	const get_similar_products = async () => {
		if (id) {
			await product_listing
				.get_simillar_products(buyer_id, id, catalog_id ? [catalog_id] : [], is_logged_in)
				.then((response: any) => {
					set_similar_products(response?.data);
				})
				.catch((err) => {
					console.error(err);
				});
		}
	};

	const get_related_products = async () => {
		if (id) {
			await product_listing
				.get_related_products(buyer_id, id, catalog_id ? [catalog_id] : [], is_logged_in)
				.then((response: any) => {
					set_related_products(response?.data);
				})
				.catch((err) => {
					console.error(err);
				});
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

	const initialize_cart = async (_buyer: any) => {
		const { buyer_cart, is_guest_buyer } = _buyer;
		const local_id = localStorage.getItem('CartData') ? JSON.parse(localStorage.getItem('CartData') || '')?.id : null;
		const cart_id = is_ultron ? buyer_cart?.id : local_id ?? (buyer_cart?.id || buyer_cart?.data?.[0]?.id);

		try {
			const response: any = await cart_management.get_cart_details({ cart_id, is_guest_buyer });

			if (!_.isEmpty(linked_catalog?.value) && linked_catalog?.value !== buyer?.catalog?.value) {
				handle_attach_catalog_id();
			}

			if (response.status === 200) {
				const { cart } = response;
				if (cart?.document_status !== 'draft' && !_.isEmpty(cart?.document_status)) {
					try {
						const get_new_cart: any = await cart_management.get_cart({
							buyer_id: cart?.buyer_id,
							is_guest_buyer: false,
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

						return;
					} catch {
						console.error('error');
					}
				}

				const { items, products: _product } = cart;
				const data = format_cart_details_response(cart);
				set_cart_data(data);

				if (cart?.catalog_ids?.length > 0 && cart?.catalog_ids?.[0] !== '' && cart?.catalog_ids?.[0] !== buyer?.catalog?.value) {
					dispatch<any>(update_catalog({ catalog: { value: cart?.catalog_ids?.[0], label: '' } }));
				}

				if (items && Object.keys(items)?.length > 0) {
					for (let _item in items) {
						// eslint-disable-next-line @typescript-eslint/no-shadow
						const { id, parent_id } = _product[_item];

						items[_item].parent_id = parent_id;
						items[_item].id = id;
					}
				}
				dispatch(
					initializeCart({
						id: cart_id,
						products: items,
						products_details: _product,
						document_items: cart?.document_items || {},
					}),
				);
			}
		} catch (error) {
			console.error(error);
		}
	};

	// const get_multiple_tearsheet_templates = () => {
	// 	api_requests.product_details
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

	const customer_metadata = get_customer_metadata({ is_loggedin: true });
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
	useEffect(() => {
		if (show_price_on_tear_sheet) {
			set_tear_sheet_catalog_id(catalog_id);
		} else {
			set_tear_sheet_catalog_id('');
		}
	}, [show_price_on_tear_sheet, catalog_id]);

	useEffect(() => {
		if (show_discount_engine) {
			get_discount_campaign();
		}
		handle_get_product_details(id);
	}, [id, buyer_id, pricelist_value?.value, show_discount_engine]);

	// useEffect(() => {
	// 	is_ultron && get_multiple_tearsheet_templates();
	// }, []);

	return {
		product_details,
		product_section,
		loading,
		drawer,
		price,
		tier_final_price,
		variant_drawer,
		catalog_list,
		buyer,
		show_tear_sheet,
		show_price_on_tear_sheet,
		catalog_id,
		frequent_products,
		similar_products,
		related_products,
		download_loader,
		toast,
		toggle_toast,
		set_download_loader,
		set_tear_sheet_catalog_id,
		set_show_tear_sheet,
		set_show_price_on_tear_sheet,
		set_drawer,
		handle_total_price,
		set_variant_drawer,
		handle_render_variant,
		handle_nagivate_to_variants,
		set_tier_final_price,
		get_product_tear_sheet,
		get_frequently_bought_products,
		get_similar_products,
		get_related_products,
		initialize_cart,
		showEmptyState,
		empty_state_text,
		open,
		set_open,
		multiple_template,
		selected_template,
		set_selected_template,
		tear_sheet_catalog_id,
		template_id,
		customer_metadata,
		show_delete_product_modal,
		set_show_delete_product_modal,
		delete_action_active,
		set_delete_action_active,
		selected_skus,
		set_selected_skus,
		selected_filters,
		set_selected_filters,
		cart_data,
		set_cart_data,
		_page,
		discount_campaigns,
	};
};

export default useProductDetails;
