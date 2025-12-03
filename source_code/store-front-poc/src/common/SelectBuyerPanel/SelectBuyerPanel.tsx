import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, CustomInput, Sort } from 'src/common/@the-source/atoms';
import { create_document_selected_buyer, create_document_type, set_buyer, update_catalog } from 'src/actions/buyer';
import { AddBuyerCard, GuestBuyerCard, AllBuyerCard } from './BuyerCard';
import Drawer from './Drawer';
import buyerApis from 'src/utils/api_requests/buyer';
import order_management from 'src/utils/api_requests/orderManagment';
import cart_management from 'src/utils/api_requests/cartManagement';
import _, { debounce } from 'lodash';
import { Trans, useTranslation } from 'react-i18next';
import SkeletonLoader from './Skeleton';
import { PERMISSIONS } from 'src/casl/permissions';
import { get_default_sort } from '../@the-source/molecules/FiltersAndChips/helper';
import { DRAWER_WIDTH, searchInput, search_result, useStyles } from './styles';
import BuyerToastMessage from './Components/BuyerToastMessage';
import BuyerModal from './Components/BuyerModal';
import BuyerInfiniteScroll from './Components/BuyerInfiniteScroll';
import api_requests from 'src/utils/api_requests';
import CustomText from '../@the-source/CustomText';
import { is_object_empty } from './utils';
import { removedProductsCount } from 'src/actions/cart';
import { useTheme } from '@mui/material/styles';
// import { clear_filters_from_session_storage } from 'src/screens/ProductListing/utils';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
import { Mixpanel } from 'src/mixpanel';
import { get_customer_metadata } from 'src/utils/utils';
import Events from 'src/utils/events_constants';
import usePricelist from 'src/hooks/usePricelist';

interface BuyerPanelProps {
	show_drawer: boolean;
	toggle_drawer: (value: boolean) => void;
	show_add_quick_buyer?: boolean;
	show_guest_buyer?: boolean;
	show_all_buyer?: boolean;
	change_app_wide?: boolean;
	on_select_buyer?: (value: any) => void;
	set_is_buyer_add_form?: any;
	dashboard_page?: boolean;
	[key: string]: any;
	buyer_data?: any;
	set_buyer_data?: any;
	from_order_confirm?: boolean;
	type?: string;
	from_ums?: boolean;
	handle_selected_buyer_wizshop?: any;
	on_buyer_change?: () => any;
	set_is_existing_customer?: () => void;
	payment_buyer_flow?: boolean;
	handle_payment_close?: () => void;
}

const SelectBuyerPanel = ({
	show_drawer,
	toggle_drawer,
	show_add_quick_buyer = true,
	show_guest_buyer = true,
	show_all_buyer = false,
	change_app_wide = true,
	on_select_buyer,
	dashboard_page = false,
	set_is_buyer_add_form,
	buyer_data = {},
	set_buyer_data,
	from_order_confirm = false,
	type,
	from_ums = false,
	handle_selected_buyer_wizshop,
	on_buyer_change = () => {},
	set_is_existing_customer,
	payment_buyer_flow,
	handle_payment_close,
	...args
}: BuyerPanelProps) => {
	const classes = useStyles();
	const theme: any = useTheme();
	const dispatch = useDispatch();
	const [search_results, set_search_results] = useState<any>([]);
	const [is_modal_open, set_is_modal_open] = useState(false);
	const [selected_buyer_id, set_selected_buyer_id] = useState('');

	const [has_cart, set_has_cart] = useState(false);
	const [toggle_toast, set_toggle_toast] = useState<any>({
		show: false,
		message: '',
		title: '',
		status: 'success',
	});
	const [page, set_page] = useState(1);
	const [paginator, set_paginator] = useState<any>({});
	const [is_searching, set_is_searching] = useState(false);
	const [has_more_data, set_has_more_data] = useState(true);
	const { t } = useTranslation();
	const [search, set_search] = useState<string>('');
	const [initial_fetch, set_initial_fetch] = useState(false);
	const [loading, set_loading] = useState(false);
	const [drawer_loader, set_drawer_loader] = useState(false);
	const [selected_buyer_name, set_selected_buyer_name] = useState('');

	const [confirm_loading, set_confirm_loading] = useState(false);
	const [buyer_card_show_loading, set_buyer_card_show_loading] = useState(false);
	const [sort_data, set_sort_data] = useState<any>([]);
	const [sort_data_search, set_sort_data_search] = useState<any>([]);
	const [selected_sort_option, set_selected_sort_option] = useState<any>(null);

	const buyer = useSelector((state: any) => state?.buyer);
	const dashboard_buyer = useSelector((state: any) => state?.dashboard?.buyer);
	const carts = useSelector((state: any) => state?.cart);

	const permissions = useSelector((state: any) => state?.login?.permissions);
	const is_buyer_add_form = permissions.find((item: any) => item?.slug === PERMISSIONS?.create_buyers.slug);
	const create_document_types = useSelector((state: any) => state?.buyer?.create_document_type);
	const [_params, set_params] = useState<any>({});
	const pricelist_value = usePricelist();

	const show_section = show_add_quick_buyer || show_guest_buyer || show_all_buyer;
	const buyerCount = paginator?.nbHits ?? 0;

	const get_page_name = (path: string) => {
		switch (true) {
			case _.includes(path, 'collection/products'):
				return 'collection_product_listing_page';
			case _.includes(path, 'collection'):
				return 'collection_listing_page';
			case _.includes(path, 'category/products'):
				return 'category_product_listing_page';
			case _.includes(path, 'category'):
				return 'category_listing_page';
			case _.includes(path, 'recommend'):
				return 'products_reco_listing_page';
			case _.includes(path, 'previously_ordered'):
				return 'previously_ordered_listing_page';
			case _.includes(path, 'cart'):
				return 'cart_page';
			case _.includes(path, 'product-details'):
				return 'product_details_page';
			case _.includes(path, 'all-products/search'):
				return 'product_search_page';
			default:
				return 'all_products_page';
		}
	};
	const page_name = get_page_name(window.location.pathname);

	const customer_metadata = get_customer_metadata({ is_loggedin: true });

	const clear_state = () => {
		set_search_results([]);
		set_page(1);
		set_search('');
		set_paginator({});
		set_selected_buyer_id('');
		set_selected_buyer_name('');
	};

	const handle_toast_message = (show_buyer_name: boolean = true) => {
		if (!buyer?.is_guest_buyer) {
			const _title = show_buyer_name
				? t('BuyerDashboard.SelectBuyerPanel.SwitchedBuyer', { BuyerName: buyer?.buyer_info?.name })
				: t('BuyerDashboard.SelectBuyerPanel.CustomerSwitchedSuccess');
			set_toggle_toast({
				show: true,
				message: '',
				title: _title,
				status: 'success',
			});
		}
	};

	const handle_fetch_buyer = async () => {
		page === 1 && set_drawer_loader(true);
		let params: any = {
			searchValue: search,
			pageNumber: page,
			pageSize: 15,
		};

		if (selected_sort_option) {
			params = {
				sortValue: [selected_sort_option],
				...params,
			};
		}
		if ((_.isEmpty(_params) || !_.isEqual(params, _params)) && show_drawer) {
			set_loading(true);
			set_params({ ...params });
		} else {
			return;
		}

		try {
			const response: any = await buyerApis.get_buyer_list(params); // Pass page as the first argument
			const results = response?.data?.hits || [];
			set_paginator(response?.paginator);

			if (page === 1) {
				set_search_results(results);
			} else {
				set_search_results((prevData: any[]) => {
					const prevDataID = prevData?.map((result: any) => result?.id);
					const newResults = results?.filter((result: any) => !prevDataID?.includes(result?.id));
					return [...prevData, ...newResults];
				});
			}

			if (page < response?.paginator?.nbPages) {
				set_has_more_data(true);
			} else {
				set_has_more_data(false);
			}
			set_initial_fetch(true);
			set_loading(false);
			set_drawer_loader(false);
		} catch (error: any) {
			set_loading(false);
			set_toggle_toast({ show: true, message: error?.message, title: 'Something Went Wrong', status: 'error' });
		}
	};

	const switch_buyer_cart = async (buyerId: string, cartId: string, catalog_ids: string[], is_create_document_flag?: boolean) => {
		try {
			const response: any = await order_management.update_buyer_cart({ cart_id: cartId, buyer_id: buyerId, catalog_ids });

			dispatch(removedProductsCount(response?.products_removed));

			if (is_create_document_flag) {
				dispatch(create_document_selected_buyer(true));
				dispatch(create_document_type(null));
			}

			if (response?.status === 200) {
				if (response?.cart?.catalog_ids?.[0] !== catalog_ids[0]) {
					dispatch<any>(update_catalog({ catalog: { value: response?.cart?.catalog_ids?.[0], label: '' } }));
				}
			}
			dispatch<any>(set_buyer({ buyer_id: buyerId, is_guest_buyer: false }));
			set_params({});
			set_initial_fetch(false);
			set_is_modal_open(false);
			set_is_buyer_add_form(false);
			handle_toast_message(false);
			toggle_drawer(false);
			set_confirm_loading(false);
		} catch (error: any) {
			set_toggle_toast({ show: true, message: error?.message, title: 'Something Went Wrong', status: 'error' });
		}
	};

	const handle_close_modal = () => {
		set_is_modal_open(false);
		set_selected_buyer_id('');
	};

	const handle_scroll = () => {
		if (show_drawer) {
			set_page((prevPage) => prevPage + 1);
		}
	};

	const handle_confirm_transfer = async (props_selected_buyer_id?: string) => {
		set_confirm_loading(true);
		const buyer_cart_id = _.get(buyer, 'buyer_cart.id');
		const catalog_ids: string[] = [pricelist_value?.value];
		const selected_buyer_id_data = selected_buyer_id || props_selected_buyer_id;

		if (selected_buyer_id_data) {
			try {
				await switch_buyer_cart(
					selected_buyer_id_data,
					buyer_cart_id,
					catalog_ids,
					create_document_types === 'quote' || create_document_types === 'order',
				);
				on_buyer_change && on_buyer_change();
			} catch (error: any) {
				set_toggle_toast({ show: true, message: error?.message, title: 'Something Went Wrong', status: 'error' });
			}
		}
	};

	const handle_cancel_transfer = () => {
		change_app_wide && dispatch<any>(set_buyer({ buyer_id: selected_buyer_id, is_guest_buyer: false }));
		handle_toast_message(false);
		set_params({});
		toggle_drawer(false);
		set_is_buyer_add_form(false);
		on_buyer_change && on_buyer_change();
		handle_close_modal();
	};

	const handle_on_click_all_buyer = () => {
		if (on_select_buyer) on_select_buyer({ buyer_id: 'all_buyers' });
		handle_toast_message(false);
		set_params({});
		toggle_drawer(false);
	};

	const handle_on_click_guest = () => {
		dispatch<any>(set_buyer({ buyer_id: '', is_guest_buyer: true }));
		handle_toast_message(false);
		set_params({});
		toggle_drawer(false);
		on_buyer_change && on_buyer_change();
	};

	const handle_new_buyer = async () => {
		if (buyer.is_guest_buyer) {
			set_is_buyer_add_form(true);
			set_params({});
			toggle_drawer(false);
			handle_toast_message();
		} else {
			set_is_buyer_add_form(true);
			if (set_is_existing_customer) set_is_existing_customer();
			set_params({});
			toggle_drawer(false);
		}
	};

	const handle_search = debounce((event: any) => {
		const value = event.target.value;
		set_search(value);
		set_is_searching(true);
		set_drawer_loader(true);
		let params: any = {
			searchValue: value,
		};
		const default_sort = _.find(sort_data_search, { is_default: true });
		if (default_sort) {
			const _key = default_sort?.key || _.head<any>(default_sort)?.key;
			_key?.field !== selected_sort_option?.field && set_selected_sort_option(_key);
			params = {
				sortValue: [_key],
				...params,
			};
		}

		buyerApis.get_buyer_list(params).then((res: any) => {
			set_search_results(res?.data?.hits);
			set_paginator(res?.paginator);
			set_is_searching(false);
			if (page < res?.paginator?.nbPages) {
				set_has_more_data(true);
			} else {
				set_has_more_data(false);
			}
			set_drawer_loader(false);
			const results = res?.data || [];

			if (results?.length === 0) {
				set_has_more_data(false);
			}
		});
	}, 500);

	const handle_get_buyer_settings = () => {
		api_requests.buyer
			.get_buyer_filter_config()
			.then((res: any) => {
				if (res?.status === 200) {
					const default_sort = _.find(res?.data?.sorting, { is_default: true });
					if (!default_sort) {
						return;
					}
					set_selected_sort_option(default_sort?.key || default_sort?.[0]?.key);
					set_sort_data(res?.data?.sorting);
					set_sort_data_search(_.get(res, 'data.search_sorting', []));
				}
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handle_get_cart_details_data = async (cart_data_id: any) => {
		try {
			const cart_details_response = await cart_management.get_cart_details({ cart_id: cart_data_id });
			return cart_details_response;
		} catch (error: any) {
			set_toggle_toast({ show: true, message: error?.message ? error?.message : '', title: 'Something Went Wrong', status: 'error' });
		}
	};

	const handle_get_cart_data = async (buyer_id: any, is_quest_buyer: boolean) => {
		try {
			const cart_details_response: any = await cart_management.get_cart({
				buyer_id,
				is_guest_buyer: is_quest_buyer,
			});
			return await handle_get_cart_details_data(cart_details_response?.data?.[0]?.id);
		} catch (error: any) {
			set_toggle_toast({ show: true, message: error?.message ? error?.message : '', title: 'Something Went Wrong', status: 'error' });
		}
	};

	const handle_buyer_change = async (new_buyer_data: any) => {
		if (payment_buyer_flow) {
			set_buyer_data(new_buyer_data);
			toggle_drawer(false);
			handle_payment_close && handle_payment_close();
			return;
		}

		if (buyer_card_show_loading) return;

		if (from_ums) {
			handle_selected_buyer_wizshop(new_buyer_data);
			return;
		}

		if (new_buyer_data?.id === selected_buyer_id || new_buyer_data?.id === buyer?.buyer_id) return;

		if (from_order_confirm) {
			set_buyer_data(new_buyer_data);
			handle_toast_message(false);
			set_params({});
			toggle_drawer(false);
			return;
		}

		set_selected_buyer_id(new_buyer_data?.id);
		set_buyer_card_show_loading(true);

		const new_cart_data_res: any = await handle_get_cart_data(new_buyer_data?.id, false);
		let curr_cart_data = carts;

		set_buyer_card_show_loading(false);

		if (new_cart_data_res?.status === 200) {
			const { cart: new_cart_data } = new_cart_data_res;

			const curr_cart_items = !is_object_empty(curr_cart_data?.products);
			const new_cart_items = !is_object_empty(new_cart_data?.items);

			if (curr_cart_data && curr_cart_items && !dashboard_page && !buyer?.buyer_cart?.document_id) {
				set_selected_buyer_name(new_buyer_data?.buyer_name || new_buyer_data?.name);
				set_has_cart(new_cart_items);
				if (
					(create_document_types === 'order' ||
						create_document_types === 'quote' ||
						create_document_types === 'catalog_enabled_document') &&
					!new_cart_items
				) {
					handle_confirm_transfer(new_buyer_data?.id);
					return;
				}
				set_is_modal_open(true);
			} else {
				// directly switch to new_buyer
				on_select_buyer && on_select_buyer({ buyer_id: new_buyer_data?.id, is_guest_buyer: false, ...new_buyer_data });
				change_app_wide && dispatch<any>(set_buyer({ buyer_id: new_buyer_data?.id, is_guest_buyer: false }));
				handle_toast_message(false);
				set_params({});
				toggle_drawer(false);
				on_buyer_change && on_buyer_change();
			}
		}
		Mixpanel.track(Events.CUSTOMER_SELECTED, {
			tab_name: 'Products',
			page_name,
			section_name: 'customer_switcher_side_&_bottom_sheet',
			subtab_name: '',
			customer_metadata,
		});
	};

	const handle_render_infinite_scroll = () => {
		return (
			<BuyerInfiniteScroll
				has_more_data={has_more_data}
				is_searching={is_searching}
				search_results={search_results}
				handle_scroll={handle_scroll}
				buyer={buyer}
				buyer_card_show_loading={buyer_card_show_loading}
				dashboard_buyer={dashboard_buyer}
				dashboard_page={dashboard_page}
				loading={loading}
				selected_buyer_id={selected_buyer_id}
				set_buyer_data={set_buyer_data}
				handle_buyer_change={handle_buyer_change}
			/>
		);
	};

	const handle_change = (key: any) => {
		set_selected_sort_option(key);
		set_page(1);
	};

	const handle_close = () => {
		set_params({});
		dispatch(create_document_type(null));
		toggle_drawer(false);
		set_page(1);
		Mixpanel.track(Events.CUSTOMER_SELECTION_CANCELLED, {
			tab_name: 'Products',
			page_name,
			section_name: 'customer_switcher_side_&_bottom_sheet',
			subtab_name: '',
			customer_metadata,
		});
	};

	useEffect(() => {
		if (!_.isEmpty(buyer_data) && buyer_data?.buyer_id !== 'all_buyers' && !from_order_confirm && is_ultron) {
			handle_buyer_change(buyer_data);
		}
	}, [buyer_data, pricelist_value]);

	useEffect(() => {
		handle_get_buyer_settings();
	}, []);

	useEffect(() => {
		if (!show_drawer) {
			clear_state();
		}

		set_search('');
	}, [show_drawer]);

	useEffect(() => {
		if ((show_drawer || (page === 1 && initial_fetch === false) || page > 1 || carts?.products?.length) && is_ultron) {
			handle_fetch_buyer();
		}
	}, [show_drawer, page, carts?.products?.length, selected_sort_option]);

	return (
		<React.Fragment>
			<BuyerToastMessage toggle_toast={toggle_toast} set_toggle_toast={set_toggle_toast} />
			<BuyerModal
				is_modal_open={is_modal_open}
				handle_close_modal={handle_close_modal}
				confirm_loading={confirm_loading}
				handle_confirm_transfer={handle_confirm_transfer}
				handle_cancel_transfer={handle_cancel_transfer}
				has_cart={has_cart}
				selected_buyer_name={selected_buyer_name}
			/>
			{show_drawer && (
				<Drawer
					PaperProps={{
						sx: { width: DRAWER_WIDTH, overflow: 'hidden' },
					}}
					anchor='right'
					open={show_drawer}
					onClose={handle_close}
					{...args}>
					<div className={classes.container}>
						<div className={classes.header_section} style={theme?.select_buyer_panel?.header_section}>
							<CustomText type='H2'>
								{from_order_confirm
									? t('BuyerDashboard.SelectBuyerPanel.Duplicate', { type })
									: t('BuyerDashboard.SelectBuyerPanel.SelectBuyer')}
							</CustomText>
							<Icon iconName='IconX' color={theme?.select_buyer_panel?.iconX} sx={{ cursor: 'pointer' }} onClick={handle_close} />
						</div>
						<div className={classes.scroll_section} id='scroll-infinite'>
							{from_order_confirm && (
								<CustomText type='Title' style={{ padding: '1rem 2rem 0rem' }}>
									{t('BuyerDashboard.SelectBuyerPanel.SelectCustomer', { type })}
								</CustomText>
							)}
							{show_section && (
								<div className={classes.guest_buyer} style={theme?.select_buyer_panel?.guest_buyer}>
									{show_all_buyer && <AllBuyerCard handle_on_click={handle_on_click_all_buyer} />}
									{show_add_quick_buyer && is_buyer_add_form && <AddBuyerCard handle_on_click={handle_new_buyer} />}
									{is_ultron && show_guest_buyer && !from_order_confirm && <GuestBuyerCard handle_on_click={handle_on_click_guest} />}
								</div>
							)}
							<div className={classes.buyer_body}>
								<div className={classes.search_box}>
									<CustomInput
										input_style={{
											flex: 1,
										}}
										size='small'
										sx={searchInput}
										onChange={handle_search}
										inputType='search'
										fullWidth
										children={undefined}
									/>
									{sort_data && (
										<Sort
											autoWidth
											parent={true}
											style={{
												width: '15%',
											}}
											showIcon={true}
											onChange={handle_change}
											options={_.isEmpty(search.trim()) ? sort_data : sort_data_search}
											defaultSort={get_default_sort(_.isEmpty(search.trim()) ? sort_data : sort_data_search, selected_sort_option)}
											size='small'
										/>
									)}
								</div>
								<div style={{ ...search_result, ...theme?.select_buyer_panel?.customer_count }}>
									<Trans i18nKey='BuyerDashboard.SelectBuyerPanel.ShowingBuyers' count={buyerCount <= 1 ? 1 : buyerCount}>
										Showing {{ buyerCount }} buyer
									</Trans>
								</div>
								{drawer_loader ? <SkeletonLoader /> : handle_render_infinite_scroll()}
							</div>
						</div>
					</div>
				</Drawer>
			)}
		</React.Fragment>
	);
};

export default SelectBuyerPanel;
