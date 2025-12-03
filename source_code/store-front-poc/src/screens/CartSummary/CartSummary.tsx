/* eslint-disable  */
import React, { useContext, useEffect, useState } from 'react';
import { PageHeader, Grid, Modal, Button, Icon } from 'src/common/@the-source/atoms';
import SelectBuyerPanel from 'src/common/SelectBuyerPanel/SelectBuyerPanel';
import { Export, BuyerSwitch, PageTitle, CatalogSwitch } from 'src/common/PageHeaderComponents';
import CustomToast from 'src/common/CustomToast';
import ProductList from './components/ProductList';
import ProductListHeader from './components/ProductListHeader';
import CartSummaryCard from './components/CartSummaryCard';
import EmptyCart from './components/EmptyCart';
import ErrorCart from './components/ErrorCart';
import LoadingPage from './components/LoadingPage';
import CartSummaryContext from './context';
import useCartSummary from './useCartSummary';
import useStyles from './styles';
import AddQuickBuyer from '../BuyerLibrary/AddEditBuyerFlow/components/AddQuickBuyer/AddQuickBuyer';
import { Alert as MuiAlert, Drawer, Switch, useTheme } from '@mui/material';
import RouteNames from 'src/utils/RouteNames';
import { updateBreadcrumbs } from 'src/actions/topbar';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import ConfirmationCartModal from './components/ConfirmationModal';
import NoteModal from './components/NoteModal';
import OfferDiscountModal from './components/OfferDiscountModal';
import CustomText from 'src/common/@the-source/CustomText';
import Alert from 'src/common/@the-source/atoms/Alert/Alert';
import { removedProductsCount } from 'src/actions/cart';
import TearSheetDrawer from 'src/common/TearSheet/TearSheetDrawer';
import ContainerisedCart from './components/ContainerisedCart';
import settings from 'src/utils/api_requests/setting';
import { cartContainerConfig } from 'src/actions/setting';
import _ from 'lodash';
import cart_management from 'src/utils/api_requests/cartManagement';
import PDFView from 'src/common/@the-source/molecules/PDFViewer/PDFView';
import StoreCartSummary from './StoreFrontComp/StoreCartSummary';
import AddCustomItemDrawer from './components/AddCustomItem';
import CustomContainerModal from './components/CustomContainerModal';
import { format_cart_details_response, get_items, handle_get_errors } from './helper';
import ManageCustomGroups from './components/ManageCustomGroups';
import constants from 'src/utils/constants';
import VariantDrawer from 'src/common/@the-source/molecules/VariantDrawer';
import SimilarDrawer from 'src/common/@the-source/molecules/SimilarDrawer';
import { all_product_card_template } from '../ProductListing/mock/card_template';
import utils from 'src/utils/utils';
import { text_colors } from 'src/utils/light.theme';
import { Mixpanel } from 'src/mixpanel';
import EditPriceModalComponent from './components/EditPriceModal';
import Events from 'src/utils/events_constants';
import CustomProductDrawer from '../CustomProduct/CustomProductDrawer';
import { ISelectedFilters } from 'src/common/@the-source/molecules/FiltersAndChips/interfaces';
import Loading from './components/Loading';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
import UpdatePriceModal from './components/UpdatePriceModal';
// import mock_data from './mock.json';

const CartSummaryComp = () => {
	const {
		show_error_page,
		show_buyer_panel,
		on_select_buyer,
		set_transfer_cart,
		toggle_buyer_panel,
		cart,
		show_error,
		set_show_error,
		toast,
		toggle_toast,
		get_cart_tear_sheet,
		catalog_list,
		show_tear_sheet,
		set_show_tear_sheet,
		show_price_on_tear_sheet,
		set_show_price_on_tear_sheet,
		cart_id,
		buyer,
		is_buyer_add_form,
		set_is_buyer_add_form,
		download_loader,
		set_download_loader,
		show_pre_exists_modal,
		set_pre_exsists_modal,
		handle_create_document,
		proceed_btn_loading,
		handle_discard_cart,
		show_discount_modal,
		set_show_discount_modal,
		set_cart,
		selected_product,
		set_show_note_modal,
		show_note_modal,
		set_show_alert,
		show_alert,
		buyer_data,
		set_buyer_data,
		multiple_template,
		selected_template,
		set_selected_template,
		handle_convert_to_order,
		container_config_data,
		container_is_display,
		selected_container,
		set_container_config_data,
		set_container_is_display,
		show_preview,
		set_show_preview,
		get_tearsheet_preview,
		preview_tearsheet_url,
		set_preview_tearsheet_url,
		preview_loader,
		set_toggle_button_value,
		toggle_button_value,
		open_custom_product,
		set_open_custom_product,
		set_adhoc_data,
		cart_errors,
		storefront_template_id,
		cart_group_by,
		calculate_data,
		set_loading,
		cart_group_data,
		variant_drawer,
		variant_data,
		set_variant_drawer,
		similar_drawer,
		set_similar_drawer,
		custom_groups,
		cart_metadata,
		customer_metadata,
		edit_price_modal_data,
		is_edit_modifiers,
		set_is_edit_modifiers,
		edit_product,
		show_error_only,
		set_show_error_only,
		show_only_price_updated,
		set_show_only_price_updated,
		edit_product_price_change,
		update_price_modal_data,
		set_update_price_modal_data,
		discount_campaigns,
	} = useContext(CartSummaryContext);

	const classes = useStyles();
	const enable_cart_message = useSelector((state: any) => state?.settings?.enable_cart_message) || false;
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const theme: any = useTheme();
	const { loading, data, refetch } = cart;
	const { container_data } = data;
	const { grouping_data = {} } = data?.meta || {};
	const is_retail_mode = localStorage.getItem('retail_mode') === 'true';
	const _cart = useSelector((state: any) => state?.cart);
	const cart_container_config = useSelector((state: any) => state?.settings?.cart_container_config) || {};
	const [container_loading, set_container_loading] = useState<boolean>(true);
	const [custom_container_modal, set_custom_container_modal] = useState(false);
	const [cart_error, set_cart_error] = useState<any>({});
	const [show_product_removed_alert, set_show_product_removed_alert] = useState<boolean>(false);
	const [show_custom_group_drawer, set_show_custom_group_drawer] = useState<boolean>(false);
	const [is_group_config_loading, set_group_config_loading] = useState<boolean>(false);
	const [selected_filters, set_selected_filters] = useState<ISelectedFilters>({ filters: {}, range_filters: {} });
	const { catalog_switching_enabled_at_buyer_level = false } = useSelector((state: any) => state?.settings);
	const { cart_grouping_config = {} } = useSelector((state: any) => state?.settings);
	const [search_params] = useSearchParams();
	const is_document_cart = search_params.get('is_document_cart');

	const { errors_count, unavailable_product_count, low_inventory_count } = cart_error;
	const products = data?.products ? Object.values(data?.products) : [];
	const breadCrumbList = [
		{
			id: 1,
			linkTitle: is_ultron ? 'Dashboard' : 'Home',
			link: RouteNames.dashboard.path,
		},
		{
			id: 2,
			linkTitle: 'Cart',
			link: `${RouteNames.cart.path}`,
		},
	];

	const is_data = Object.keys(data)?.length > 0 && products?.length > 0;

	const tenant_id = buyer?.is_guest_buyer ? undefined : buyer?.buyer_cart?.tenant_id;
	const catalog_id = useSelector((state: any) => state?.buyer?.catalog?.value);
	let cart_item_ids_count = Object(products)?.length;
	const { CART_GROUPING_KEYS } = constants;
	const show_grouping_data = utils.show_grouping_data(cart_grouping_config, cart_group_data);

	const handle_render_toast = () => {
		return (
			<CustomToast
				open={show_error}
				showCross={true}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				show_icon={true}
				autoHideDuration={5000}
				onClose={() => set_show_error(false)}
				state='warning'
				title={t('CartSummary.Main.EmptyFields')}
				subtitle={''}
				showActions={false}
			/>
		);
	};

	const handle_navigate = () => {
		navigate(-1);
	};

	const handle_export_click = () => {
		if (cart_item_ids_count === 0) {
			toggle_toast({ show: true, message: t('CartSummary.Main.AddItems'), title: t('CartSummary.Main.EmptyCart'), status: 'warning' });
		} else {
			is_ultron ? set_show_tear_sheet(true) : get_cart_tear_sheet(tenant_id, cart_id, show_price_on_tear_sheet);
		}
	};

	const handle_procced = () => {
		let is_pre_existing_cart = true;
		handle_create_document('quote', is_pre_existing_cart);
	};

	const handle_new_cart = () => {
		handle_discard_cart();
		set_pre_exsists_modal(false);
	};

	const handle_close = () => {
		set_pre_exsists_modal(false);
	};

	const handle_set_variables = (response_data: any) => {
		if (response_data?.tenant_container_enabled) {
			set_container_config_data(response_data);
			dispatch(cartContainerConfig(response_data));
		} else {
			dispatch(cartContainerConfig({ tenant_container_enabled: false }));
		}
	};

	const get_containers_detail = async () => {
		try {
			if (_.isEmpty(cart_container_config)) {
				const { data: response_data }: any = await settings.get_containers_data();
				handle_set_variables(response_data);
			} else {
				handle_set_variables(cart_container_config);
			}
		} catch (err) {
			console.error(err);
		}
	};

	const update_cart_container = async (_payload: any) => {
		const { display, container, unit, call_calculate } = _payload;
		try {
			const payload = {
				cart_id,
				container_is_display: display,
				selected_containers: [
					{
						container_name: container?.container_name,
						container_key: container?.container_key,
						container_volume: container?.container_volume_data?.[unit],
					},
				],
				cart_volume_unit: unit,
			};
			const response: any = await cart_management.post_cart_container_update(payload);

			if (response?.status_code === 200) {
				const { container_data: _data } = response?.data;
				set_cart((prev_cart: any) => {
					return {
						...prev_cart,
						container_data: _data,
					};
				});
				const is_custom_grouping = cart_grouping_config?.enabled && cart_group_by === CART_GROUPING_KEYS.CUSTOM_GROUPING;
				if (call_calculate) {
					calculate_data(
						_.head(_data?.containers),
						_data?.container_is_display,
						_data?.cart_volume_unit,
						cart_group_by,
						set_container_loading,
						get_items(cart),
						is_custom_grouping ? custom_groups : [],
					);
				} else {
					set_container_is_display(_data?.container_is_display);
					set_toggle_button_value(_data?.cart_volume_unit);
				}
			}
		} catch (err) {
			console.error(err);
		}
	};

	const custom_variant_template = {
		attributes: {
			keys: _.map(variant_data?.variants_meta?.hinge_attributes, (v: any) => `custom_attributes::${v?.id}::value`),
		},
	};

	const handle_products_removed = () => {
		set_show_product_removed_alert(false);
		dispatch(removedProductsCount(0));
	};

	const convert_to_order = () => {
		handle_convert_to_order();
	};

	const handle_change = (type: string, changed_value: any) => {
		let _payload = {
			display: container_is_display,
			container: selected_container,
			unit: toggle_button_value,
			call_calculate: !_.includes(['display', 'container'], type) ? false : true,
		};

		_payload = {
			..._payload,
			[type]: changed_value,
		};

		update_cart_container(_payload);
	};

	const handle_preview_pdf = (template_id: string) => {
		set_preview_tearsheet_url('');
		set_selected_template(template_id);
		get_tearsheet_preview(tenant_id, cart_id, show_price_on_tear_sheet, template_id);
		Mixpanel.track(Events.PDF_PREVIEW_CLICKED, {
			tab_name: 'Home',
			page_name: 'cart_page',
			section_name: 'download_side_&_bottom_sheet',
			subtab_name: '',
			customer_metadata,
			cart_metadata,
		});
	};

	const show_preview_handler = () => {
		set_show_preview(true);
		handle_preview_pdf(selected_template);
	};

	const handle_download_pdf = () => {
		get_cart_tear_sheet(tenant_id, cart_id, show_price_on_tear_sheet);
		Mixpanel.track(Events.PDF_DOWNLOAD_CLICKED, {
			tab_name: 'Home',
			page_name: 'cart_page',
			section_name: 'download_side_&_bottom_sheet',
			subtab_name: '',
			cart_metadata,
			customer_metadata,
		});
	};

	const handle_close_add_item = () => {
		set_open_custom_product(false);
		set_adhoc_data({});
	};
	const handle_open_add_item = () => {
		set_open_custom_product(false);
		set_adhoc_data({});
		setTimeout(() => {
			set_open_custom_product(true);
		}, 0);
	};

	const handle_cart_error = () => {
		return (
			<Alert
				style={{ background: theme?.cart?.cart_custom_item_error?.background, marginBottom: '10px', alignItems: 'center' }}
				icon={<Icon iconName='IconAlertTriangle' color={theme?.cart?.cart_custom_item_error?.color} />}
				is_cross={false}
				message={
					<div className={classes.error_message}>
						<CustomText type='Subtitle' color={theme?.cart?.cart_custom_item_error?.color}>
							<Trans i18nKey='Adhoc.Errors' count={errors_count}>
								{{ errors_count }}
							</Trans>
						</CustomText>
						<CustomText>
							{low_inventory_count > 0 && (
								<strong>
									<Trans i18nKey='Adhoc.ShowingLowProducts' count={low_inventory_count}>
										{{ low_inventory_count }}
									</Trans>
								</strong>
							)}
							{low_inventory_count > 0 && unavailable_product_count > 0 && ' and '}
							{unavailable_product_count > 0 && (
								<strong>
									<Trans i18nKey='Adhoc.ShowingUnavailableProducts' count={unavailable_product_count}>
										{{ unavailable_product_count }}
									</Trans>
								</strong>
							)}
							{t('Adhoc.UpdateCart')}
						</CustomText>
						<CustomText>Show only products with error</CustomText>
						<Switch
							checked={show_error_only}
							onChange={() => {
								set_show_error_only(!show_error_only);
							}}
						/>
					</div>
				}
				severity={'warning'}
				open={show_alert}
				handle_close={() => set_show_alert(false)}
			/>
		);
	};

	const handle_price_all = () => {
		const modal_data = {
			open: true,
			action: 'BULK',
			data: {
				cart_total: cart?.data?.cart_total,
				modified_cart_total: cart?.data?.modified_cart_total,
				products: edit_product_price_change?.length,
				currency: cart?.data?.meta?.pricing_info?.currency_symbol,
			},
		};
		set_update_price_modal_data(modal_data);
	};

	const handle_edit_product_price_change = () => {
		return (
			<MuiAlert
				icon={<Icon iconName='IconInfoCircle' />}
				sx={{ background: '#FCEFD6', mb: 2, padding: '0px 8px', alignItems: 'center' }}
				action={
					<CustomText
						onClick={handle_price_all}
						type='Body2'
						color='#16885F'
						style={{ cursor: 'pointer', marginRight: '10px', fontWeight: 800 }}>
						Update
					</CustomText>
				}>
				<Grid container alignItems='center' gap={1} p={0}>
					<Grid item>
						<CustomText type='Body'>
							Price of{' '}
							<strong>
								{edit_product_price_change?.length} product{edit_product_price_change?.length > 1 ? 's' : ''}{' '}
							</strong>
							has changed.
						</CustomText>
					</Grid>
					<Grid item>
						<CustomText>Show only products with price changed</CustomText>
					</Grid>
					<Grid item>
						<Switch
							checked={show_only_price_updated && !show_error_only}
							onChange={() => {
								set_show_only_price_updated(!show_only_price_updated);
							}}
						/>
					</Grid>
				</Grid>
			</MuiAlert>
		);
	};

	// method to check if custom grouping is enabled and to set custom groups in state

	useEffect(() => {
		dispatch(updateBreadcrumbs(breadCrumbList));
		if (cart_errors) {
			const errors = handle_get_errors({ errors: cart_errors });
			set_cart_error(errors);
		}

		if (!_.isEmpty(data?.errors)) {
			set_show_alert(true);
		} else {
			set_show_alert(false);
			set_show_error_only(false);
		}
	}, [cart_errors]);

	useEffect(() => {
		if (Object.keys(data)?.length > 0) {
			const product_ids = Object.keys(data?.products || {});

			const out_of_stock_ids = data?.validations?.out_of_stock || [];
			const filtered_out_of_stock = out_of_stock_ids?.filter((id: any) => product_ids?.includes(id));
			set_cart({
				...data,
				validations: {
					...data?.validations,
					out_of_stock: filtered_out_of_stock,
				},
			});
		}
	}, [products?.length]);

	useEffect(() => {
		if (!cart_grouping_config?.enabled) return;

		if (!_.isNull(cart_group_by)) {
			set_group_config_loading(false);
		} else {
			set_group_config_loading(true);
		}
	}, [cart_grouping_config, cart_group_by]);

	useEffect(() => {
		if (_.isEmpty(cart_grouping_config)) {
			return;
		}
		const _items = get_items(cart);
		const grouping_enabled = cart_grouping_config?.enabled;
		const is_custom_grouping = grouping_enabled && cart_group_by === CART_GROUPING_KEYS.CUSTOM_GROUPING;
		if (!_.isEmpty(_items)) {
			const default_or_assigned_grouping = !_.isEmpty(grouping_data?.group_by)
				? grouping_data?.group_by
				: _.find(cart_grouping_config?.options, { is_default: true })?.value || 'none';
			// const grouping_enabled = cart_grouping_config?.enabled || false;
			if (container_config_data?.tenant_container_enabled && container_config_data?.containers?.length > 0) {
				const is_container_key_present =
					container_data?.containers?.length > 0 &&
					_.filter(
						container_config_data?.containers,
						(container) => container.container_key === _.head(container_data?.containers)?.container_key,
					).length !== 0;

				const default_or_assigned_container = is_container_key_present
					? _.head(container_data?.containers)
					: _.find(container_config_data?.containers, { is_default_container: true }) || _.head(container_config_data?.containers);

				calculate_data(
					default_or_assigned_container,
					container_data?.container_is_display ?? container_config_data?.tenant_container_enabled,
					container_data?.cart_volume_unit ?? container_config_data?.tenant_container_default_unit,
					!_.isEmpty(cart_group_by) ? cart_group_by : default_or_assigned_grouping,
					set_container_loading,
					_items,
					is_custom_grouping ? custom_groups : [],
				);
			} else {
				calculate_data(
					selected_container,
					container_is_display,
					toggle_button_value,
					!_.isEmpty(cart_group_by) ? cart_group_by : default_or_assigned_grouping,
					set_loading,
					_items,
					is_custom_grouping ? custom_groups : [],
				);
			}
		}
		// else if (grouping_enabled === false || (grouping_enabled === true && _.isNull(cart_group_by))) {
		// 	set_group_config_loading(false);
		// }
	}, [cart_grouping_config, container_config_data, data?.items]);

	useEffect(() => {
		get_containers_detail();
	}, []);

	const handle_edit_groups = () => {
		set_show_custom_group_drawer(true);
	};

	const calculate_cart_total = (cart_items: any, items_with_unit_prices: any) => {
		let cart_total = 0;

		_.forEach(cart_items, (product_data: any) => {
			_.forEach(product_data, (cart_item_data: any, cart_item_id: any) => {
				if (_.isObject(cart_item_data)) {
					if (cart_item_data?.discount_type) {
						cart_total += cart_item_data?.final_total || 0;
					} else {
						const unit_price = items_with_unit_prices?.[cart_item_id] || 0;
						cart_total += unit_price * (cart_item_data?.quantity || 0);
					}
				}
			});
		});

		return cart_total;
	};

	const handle_update_cart = () => {
		const cart_data = { ...cart?.data };
		const cart_from_redux = { ..._cart };

		const merged_cart = {
			...cart_data,
			items: {
				...cart_data?.items,
				...cart_from_redux?.products,
			},
			products: {
				...cart_data?.products,
				...cart_from_redux?.products_details,
			},
		};

		const formatted_cart_data = format_cart_details_response(merged_cart);
		const cart_total = calculate_cart_total(formatted_cart_data?.items, formatted_cart_data?.items_with_unit_prices);
		const updated_cart_state = {
			...formatted_cart_data,
			cart_total,
			total: cart_total,
		};
		set_cart(updated_cart_state);
	};

	return (
		<div className={classes.page_container}>
			{!_.isEmpty(edit_product_price_change) && <Loading />}
			<PageHeader
				leftSection={<PageTitle title={'Cart'} handle_navigate={handle_navigate} />}
				rightSection={
					<div className={classes.page_header_right_section}>
						{is_ultron ? (
							<div>
								{!is_document_cart && (
									<BuyerSwitch
										onClick={() => {
											set_transfer_cart(false);
											toggle_buyer_panel(true);
										}}
									/>
								)}
								{(catalog_switching_enabled_at_buyer_level || buyer?.is_guest_buyer) && <CatalogSwitch />}
							</div>
						) : null}

						{cart_item_ids_count > 0 && (is_ultron || storefront_template_id) && !is_retail_mode && (
							<Export onClick={() => handle_export_click()} />
						)}
					</div>
				}
			/>

			{show_error_page ? (
				<ErrorCart />
			) : (
				<>
					{loading || is_group_config_loading ? (
						<LoadingPage />
					) : is_data ? (
						<>
							{show_product_removed_alert === true && (
								<Alert
									style={{ background: '#f9ecca' }}
									icon={false}
									message={
										<CustomText type='Body'>
											<span style={{ fontWeight: 700 }}>{_cart?.products_removed} products removed</span> {buyer?.buyer_info?.name} does not
											have access to some products
										</CustomText>
									}
									severity={'warning'}
									open={show_product_removed_alert}
									handle_close={() => handle_products_removed()}
								/>
							)}

							<div className={classes.body_container}>
								<Grid item md={7.85} sm={12} xs={12} xl={7.85}>
									{errors_count > 0 && show_alert && handle_cart_error()}
									{is_ultron && edit_product_price_change?.length > 0 && handle_edit_product_price_change()}
									<Grid className={classes.left_container}>
										<ProductListHeader cart_length={cart_item_ids_count} handle_edit_groups={handle_edit_groups} />
										<ProductList
											products={data?.products}
											items={data?.items}
											items_with_unit_prices={data?.items_with_unit_prices}
											errors={cart_errors}
											show_grouping_data={show_grouping_data}
											show_errors_only_product={show_error_only}
										/>
									</Grid>
								</Grid>
								<Grid item md={4} sm={12} xs={12} xl={4} mb={2} className={classes.cart_summary}>
									<Grid className={classes.right_container}>
										{is_ultron ? (
											<CartSummaryCard tenant_container_enabled={container_config_data?.tenant_container_enabled} />
										) : (
											<StoreCartSummary
												selected_container={selected_container}
												container_is_display={container_is_display}
												tenant_container_enabled={container_config_data?.tenant_container_enabled}
											/>
										)}
										{(is_ultron || enable_cart_message) && (
											<Grid container className={classes.disclaimer_container}>
												<Grid display='flex' alignSelf='center' style={{ marginRight: '0.5rem' }}>
													<Icon color={text_colors.dark_grey} iconName='IconInfoCircle' />
												</Grid>
												<Grid display='flex' gap={1}>
													<CustomText color={text_colors.dark_grey} type='Subtitle'>
														{t('OrderManagement.CartCommonNotification.Title')}
													</CustomText>
													<CustomText color={text_colors.dark_grey} type='Body'>
														{t('OrderManagement.CartCommonNotification.SubTitle')}
													</CustomText>
												</Grid>
											</Grid>
										)}

										{container_config_data?.tenant_container_enabled && is_ultron && (
											<ContainerisedCart
												container_loading={container_loading}
												switch_toggle={container_is_display}
												container_data={container_config_data?.containers || []}
												selected_container={selected_container}
												set_custom_container_modal={set_custom_container_modal}
												toggle_button_value={toggle_button_value}
												handle_change={handle_change}
											/>
										)}
										<CustomContainerModal
											custom_container_modal={custom_container_modal}
											set_custom_container_modal={set_custom_container_modal}
											selected_container={selected_container}
											toggle_button_value={toggle_button_value}
											container_data={container_config_data?.containers}
											handle_change={handle_change}
										/>
									</Grid>
								</Grid>
							</div>
						</>
					) : (
						<EmptyCart handle_custom_product={() => set_open_custom_product(true)} />
					)}
				</>
			)}

			{handle_render_toast()}
			{is_ultron && update_price_modal_data?.open && <UpdatePriceModal handle_get_cart_details={refetch} />}
			{is_ultron && (
				<SelectBuyerPanel
					set_is_buyer_add_form={set_is_buyer_add_form}
					on_select_buyer={on_select_buyer}
					show_drawer={show_buyer_panel}
					toggle_drawer={toggle_buyer_panel}
					buyer_data={buyer_data}
					set_buyer_data={set_buyer_data}
				/>
			)}
			{is_buyer_add_form && (
				<Drawer
					PaperProps={{ sx: { width: 600, background: '#fff' } }}
					anchor='right'
					open={is_buyer_add_form}
					onClose={() => set_is_buyer_add_form(false)}>
					<AddQuickBuyer
						handle_submit_callback={on_select_buyer}
						is_detailed={false}
						from_cart
						set_is_buyer_add_form={set_is_buyer_add_form}
						set_buyer_data={set_buyer_data}
					/>
				</Drawer>
			)}
			{toast?.show && (
				<CustomToast
					open={toast?.show}
					showCross={true}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					show_icon={true}
					is_custom={false}
					autoHideDuration={3000}
					onClose={() => toggle_toast({ show: false, message: '', title: '', status: '' })}
					state={toast?.status}
					title={toast?.title}
					subtitle={toast?.message}
					showActions={false}
				/>
			)}
			<ConfirmationCartModal handle_convert_to_order={convert_to_order} />
			{show_tear_sheet ? (
				<TearSheetDrawer
					open={show_tear_sheet}
					onClose={() => set_show_tear_sheet(false)}
					onSubmit={() => {
						Mixpanel.track(Events.PDF_DOWNLOAD_CLICKED, {
							tab_name: 'Home',
							page_name: 'cart_page',
							section_name: 'download_side_&_bottom_sheet',
							subtab_name: '',
							cart_metadata,
							customer_metadata,
						});
						set_download_loader(true);
						get_cart_tear_sheet(tenant_id, cart_id, show_price_on_tear_sheet);
					}}
					options={catalog_list}
					selected_option={catalog_id}
					checked={show_price_on_tear_sheet}
					on_switch_change={() => set_show_price_on_tear_sheet(!show_price_on_tear_sheet)}
					show_toggle
					loading={download_loader}
					show_catalog_selector
					data={multiple_template}
					selected_template={selected_template}
					set_selected_template={set_selected_template}
					show_preview_handler={show_preview_handler}
				/>
			) : null}
			{show_preview && (
				<PDFView
					open={show_preview}
					onClose={() => set_show_preview(false)}
					file_url={preview_tearsheet_url}
					options={multiple_template}
					selected_option={selected_template}
					onChange={(option: string) => handle_preview_pdf(option)}
					preview_loader={preview_loader}
					handle_download_click={() => handle_download_pdf()}
					download_loader={download_loader}
				/>
			)}

			{variant_drawer && (
				<VariantDrawer
					drawer={variant_drawer}
					set_drawer={set_variant_drawer}
					id={variant_data?.id}
					attribute_template={custom_variant_template}
					parent_product={variant_data}
					from_cart={true}
					set_selected_filters={set_selected_filters}
					selected_filters={selected_filters}
					handle_done={handle_update_cart}
				/>
			)}
			{similar_drawer && (
				<SimilarDrawer
					drawer={similar_drawer}
					setDrawer={set_similar_drawer}
					simillar={variant_data?.id}
					card_temp={all_product_card_template}
					from_cart={true}
					handle_done={handle_update_cart}
					discount_campaigns={discount_campaigns}
				/>
			)}
			{open_custom_product && (
				<AddCustomItemDrawer open={open_custom_product} on_close={handle_close_add_item} on_reopen={handle_open_add_item} />
			)}
			{show_discount_modal && (
				<OfferDiscountModal
					product_data={selected_product || {}}
					show_modal={show_discount_modal}
					toggle_modal={() => set_show_discount_modal((prev: any) => !prev)}
				/>
			)}
			<NoteModal data={selected_product || {}} set_show_note_modal={set_show_note_modal} show_note_modal={show_note_modal} />
			{show_pre_exists_modal && (
				<Modal
					open={show_pre_exists_modal}
					onClose={handle_close}
					title='Pre-existing cart found'
					children={
						<React.Fragment>
							<CustomText type='Body'>{t('CartSummary.Main.OrderAlreadyCreated')}</CustomText>
						</React.Fragment>
					}
					footer={
						<div className={classes.modal_footer}>
							<Button onClick={handle_new_cart} variant='outlined'>
								{t('CartSummary.Main.NewCart')}
							</Button>
							<Button loading={proceed_btn_loading} onClick={handle_procced} variant='contained'>
								{t('CartSummary.Main.Proceed')}
							</Button>
						</div>
					}
				/>
			)}
			{show_custom_group_drawer && (
				<ManageCustomGroups
					show_custom_group_drawer={show_custom_group_drawer}
					set_show_custom_group_drawer={set_show_custom_group_drawer}
				/>
			)}
			{edit_price_modal_data?.show_modal && <EditPriceModalComponent />}
			{is_edit_modifiers && (
				<CustomProductDrawer
					show_customise={is_edit_modifiers}
					set_show_customise={set_is_edit_modifiers}
					product_id={edit_product?.parent_id}
					set_show_modal={() => {}}
					default_sku_id={edit_product?.created_from_parent_sku_id}
					set_open={() => {}}
					is_edit={true}
					product_data={edit_product}
					handle_get_cart_details={refetch}
					base_price={edit_product?.pricing?.parent_base_price || 0}
					currency={edit_product?.pricing?.currency}
					page_name={'cart_page'}
					section_name={'download_side_&_bottom_sheet'}
				/>
			)}
		</div>
	);
};

const CartSummary = () => {
	const value = useCartSummary();
	return (
		<CartSummaryContext.Provider value={value}>
			<CartSummaryComp />
		</CartSummaryContext.Provider>
	);
};

export default CartSummary;
