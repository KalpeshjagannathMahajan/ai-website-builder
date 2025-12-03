/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Grid, Icon, Counter, Button } from 'src/common/@the-source/atoms';
import React, { useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import ProductDetailsContext from '../context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { PRODUCT_DETAILS_TYPE } from '../constants';
import cart_management from 'src/utils/api_requests/cartManagement';
import { initializeCart } from 'src/actions/cart';
import { get_formatted_price_with_currency, get_unit_price_of_product } from 'src/utils/common';
import { format_cart_details_response, get_discounted_value } from 'src/screens/CartSummary/helper';
import { useTranslation } from 'react-i18next';
import types from 'src/utils/types';
import { from_max_quantity, get_max_quantity } from 'src/screens/ProductListing/utils';
import { Product } from 'src/screens/ProductListing/mock/ProductInterface';
import InventoryStatus from 'src/common/@the-source/molecules/Inventory/InventoryStatus';
import { INVENTORY_STATUS } from 'src/common/@the-source/molecules/Inventory/constants';
import CustomText from 'src/common/@the-source/CustomText';
import utils from 'src/utils/utils';
import CartDrawer from 'src/common/@the-source/molecules/CartItemDrawer/CartDrawer';
import CustomProductDrawer from 'src/screens/CustomProduct/CustomProductDrawer';
import VariantDrawer from 'src/common/@the-source/molecules/VariantDrawer';
import CustomProductModal from 'src/screens/CustomProduct/CustomProductModal';
import useStyles from '../styles';
import { useMediaQuery, useTheme } from '@mui/material';
import _ from 'lodash';
import useIsCustomization from 'src/hooks/useIsCustomization';
import constants from 'src/utils/constants';
import CatalogFactory from 'src/utils/catalog.utils';
import { useCatalogSelection } from 'src/hooks/useCatalogSelection';
import { colors } from 'src/utils/light.theme';
import { valid_discount_for_product } from 'src/utils/DiscountEngineRule';
// import CustomToast from 'src/common/CustomToast';

interface Props {
	currency: any;
	custom_variant_template: any;
}
interface VariantData {
	quantity: number;
	parent_id: string;
	id: string;
}

const ProductActionSection: React.FC<Props> = ({ currency, custom_variant_template }) => {
	const is_retail_mode = localStorage.getItem('retail_mode') === 'true';
	const login = useSelector((state: any) => state.login);
	const is_logged_in = login?.status?.loggedIn;
	const [item_quantity, set_item_quantity] = useState<any>(1);
	const [show_customise, set_show_customise] = useState(false);
	const [show_modal, set_show_modal] = useState(false);
	const [cart_drawer, set_cart_drawer] = useState(false);
	const [error, set_error] = useState(false);
	const [current_variant_data, set_current_variant_data] = useState<{ [variantId: string]: VariantData }>({});
	const { t } = useTranslation();
	const classes = useStyles();
	const theme: any = useTheme();
	const navigate = useNavigate();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const [variant_value, set_variant_value] = useState<any>();

	//context
	const {
		set_drawer,
		product_details,
		set_tier_final_price,
		price,
		drawer,
		handle_total_price,
		open,
		set_open,
		set_cart_data,
		delete_action_active,
		set_delete_action_active,
		selected_skus,
		set_selected_skus,
		set_selected_filters,
		selected_filters,
		set_show_delete_product_modal,
		discount_campaigns,
	} = useContext(ProductDetailsContext);
	const { type, parent_id, variants_meta, inventory, pricing }: Product = product_details;
	const { variant_data_map = [] } = variants_meta;

	const { is_customization_required = false, customize_id = product_details?.id } = useIsCustomization(product_details);
	//redux state
	const buyer = useSelector((state: any) => state.buyer);
	const master_discount_rule = useSelector((state: any) => state?.json_rules?.master_discount_rule);
	const selected_discount_campaign = valid_discount_for_product(master_discount_rule, discount_campaigns, product_details, buyer);
	const cart = useSelector((state: any) => state.cart);
	const all_cart_data = useSelector((state: any) => state.cart?.products);
	const documents = useSelector((state: any) => state.cart?.document_items);
	const dispatch = useDispatch();
	const params: any = useParams();
	const { id } = params;
	const discounted_products: any = utils.get_discount_detail(all_cart_data?.[id], selected_discount_campaign);
	const filtered_keys: any = utils.get_non_discount_keys(product_details, all_cart_data, product_details?.id, selected_discount_campaign);
	const product_id = type === PRODUCT_DETAILS_TYPE.variant ? id : _.get(_.head(variant_data_map), 'product_id');
	const active_variants = utils.get_active_variants(variant_data_map)?.length;

	const variant_cta_style = {
		padding: '10px 12px',
		borderRadius: 8,
		backgroundColor: theme?.product_details?.product_info_container?.variant_cta_style?.backgroundColor,
	};
	const { catalog_mode, catalog_products } = useSelector((state: any) => state.catalog_mode);
	const variant_ids = _.map(utils.get_active_variants(variant_data_map), (item: any) => item?.product_id);
	const selected_variants: number = useMemo(() => {
		return CatalogFactory.PRODUCT.check_multiple_products(variant_ids, catalog_products).stored_product_count;
	}, [variant_data_map, catalog_products]);
	const { selected, set_selected, handle_select_variant } = useCatalogSelection();

	const handleDiscountProduct = () => {
		set_cart_drawer(true);
	};

	const render_cart_counter = () => {
		return (
			<Grid
				container
				style={{
					whiteSpace: 'nowrap',
					display: 'flex', // Use flex display
					width: '106%',
					justifyContent: 'space-between',
				}}
				alignItems='center'
				wrap='nowrap'>
				<Icon color='primary' iconName='IconMinus' fontSize='small' onClick={handleDiscountProduct} className={classes.remove_icon} />
				<Grid
					item
					alignItems='center'
					xl={8}
					lg={8}
					md={8}
					sm={8}
					xs={8}
					style={{
						flex: '1', // Let this item grow as needed
					}}>
					<input
						readOnly={true}
						className={classes.show_count}
						type='number'
						value={utils.get_cart_items(product_details?.id, { products: all_cart_data }) as any}
						onClick={handleDiscountProduct}
					/>
				</Grid>
				<Icon color={'primary'} iconName='IconPlus' fontSize='small' className={classes.add_icon} onClick={handleDiscountProduct} />
			</Grid>
		);
	};

	const open_drawer = () => {
		set_drawer(true);
		set_delete_action_active(false);
	};

	const handle_render_variant_cta = () => {
		const length1 = Object.keys(current_variant_data)?.length;

		return (
			<Grid display='flex' flexDirection='row' flexWrap='nowrap' width='100%' gap={1}>
				{(!catalog_mode || active_variants > 1) && (
					<Box className={`${classes.header_container_value} ${catalog_mode ? classes.header_container_value_catalog_mode : ''}`} mb={2}>
						{utils?.is_prelogin_add_to_cart_button(is_logged_in) && !catalog_mode && (
							<CustomText type='Body' style={{ fontWeight: 700 }}>
								{!is_retail_mode &&
									t('PDP.ProductActionSection.Value', { price: get_formatted_price_with_currency(currency, variant_value) })}
							</CustomText>
						)}

						{active_variants > 1 && (
							<Box className={classes.header_container_variant} style={{ cursor: 'pointer' }} onClick={open_drawer}>
								<CustomText type='Body' color={theme?.button?.color}>
									{catalog_mode
										? t('PDP.ProductActionSection.CatalogSelected', {
												length1: selected_variants,
												length2: active_variants,
										  })
										: t(length1 > 1 ? 'PDP.ProductActionSection.ShowingVariants_other' : 'PDP.ProductActionSection.ShowingVariants_one', {
												length1,
												length2: active_variants,
										  })}
								</CustomText>
								<Icon iconName='IconChevronRight' sx={{ color: theme?.button?.color }} />
							</Box>
						)}
					</Box>
				)}
			</Grid>
		);
	};

	const handle_validate = () => {
		if (item_quantity <= pricing?.min_order_quantity && item_quantity >= pricing?.max_order_quantity) {
			set_error(true);
		} else if (item_quantity >= inventory?.stock) {
			set_error(true);
		} else {
			set_error(false);
		}
	};

	const handle_get_price_tier = () => {
		const { unit_price = 0 } = get_unit_price_of_product({ ...product_details, quantity: item_quantity });
		set_tier_final_price(unit_price);
	};

	const filter_variants_in_cart = (data1: any, data2: any) => {
		const product_ids = data1?.map((item: any) => item?.product_id);

		const filtered_data = product_ids?.reduce((filteredObj: any, prd_id: any) => {
			// eslint-disable-next-line no-prototype-builtins
			if (data2?.hasOwnProperty(prd_id)) {
				filteredObj[prd_id] = data2?.[prd_id];
			}
			return filteredObj;
		}, {});

		return filtered_data;
	};

	const handle_calculate_price = () => {
		let variants_in_cart = filter_variants_in_cart(variant_data_map, all_cart_data);
		set_current_variant_data(variants_in_cart);
		handle_get_price_tier();
		handle_validate();
	};

	const handle_change = (count: any) => {
		count ? set_item_quantity(count) : set_item_quantity(1);
	};

	const handle_get_cart_details = async () => {
		const { buyer_cart } = buyer;
		const first_item: any = _.head(buyer_cart?.data);
		const cart_id = first_item?.id || buyer_cart?.id;
		const is_guest_buyer = first_item?.is_guest_cart;

		cart_management
			.get_cart_details({ cart_id, is_guest_buyer })
			.then((response: any) => {
				if (response?.status === 200) {
					const { cart: cart_response } = response;
					const data = format_cart_details_response(cart_response);
					set_cart_data(data);
					const { items = {}, products: res_product = {} } = cart_response;

					if (items && Object.keys(items)?.length > 0) {
						for (let item in items) {
							// eslint-disable-next-line @typescript-eslint/no-shadow
							const { id, parent_id } = res_product[item];
							items[item].parent_id = parent_id;
							items[item].id = id;
						}
					}
					dispatch(
						initializeCart({
							id: cart_id,
							products: items,
							products_details: res_product,
							document_items: cart_response?.document_items || {},
						}),
					);
				}
			})
			.catch((err: any) => {
				console.error(err);
			});
	};

	useEffect(() => {
		handle_calculate_price();
	}, [item_quantity, all_cart_data, price, product_details]);

	useEffect(() => {
		is_logged_in && handle_get_cart_details();
		set_item_quantity(cart?.products[product_id ?? product_details?.id]?.[filtered_keys]?.quantity ?? 1);
		handle_calculate_price();
	}, []);

	useLayoutEffect(() => {
		set_selected(CatalogFactory.PRODUCT.check_product(product_id));
	}, [catalog_products, catalog_mode]);

	useEffect(() => {
		let total = 0;
		let variant_value_temp = 0;
		if (variant_data_map && cart?.products) {
			variant_ids?.forEach((product: any) => {
				const product_data = _.get(cart?.products_details, product, '');
				const cart_data = _.get(all_cart_data, product, '');
				if (!_.isEmpty(cart_data)) {
					Object?.entries(cart_data)?.forEach((item: any) => {
						const _variant_value: any = _.nth(item, 1);
						const quantity = _variant_value?.quantity ?? 0;
						const product_price: any = get_unit_price_of_product({ ...product_data, quantity });
						const unit_price = product_price?.unit_price;
						const discountPrice =
							unit_price - get_discounted_value(_variant_value?.discount_type, _variant_value?.discount_value, unit_price);
						total += discountPrice * quantity;
						if (cart_data?.id === customize_id) {
							variant_value_temp += discountPrice * quantity;
						}
					});
				}
			});
		}

		handle_total_price(total);
		set_variant_value(total);
	}, [cart, product_details, customize_id]);

	const reserved_quantity = documents?.[product_details.id]?.total_reserved ?? 0;
	const total_available = product_details?.inventory?.total_available ?? 0;
	const out_of_stock_threshold = product_details?.inventory?.out_of_stock_threshold ?? 0;
	const is_not_in_stock = reserved_quantity + total_available <= out_of_stock_threshold;
	const max_quantity = get_max_quantity(product_details, reserved_quantity);
	const disable_counter = product_details?.inventory?.inventory_status === INVENTORY_STATUS.out_of_stock && is_not_in_stock;

	const handle_customization = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		set_show_customise(true);
	};

	const handle_select = () => {
		if (_.size(variant_data_map) > 1 && type === PRODUCT_DETAILS_TYPE.product) {
			set_drawer(true);
			return;
		}
		handle_select_variant(product_id);
	};

	return (
		<React.Fragment>
			<Grid my={2} sx={theme?.product_details?.product_info_container?.button_container}>
				{handle_render_variant_cta()}
				<Box
					gap={1}
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: '100%',
						...theme?.product_details?.product_info_container?.custom_style,
					}}>
					{utils.is_prelogin_inventory(is_logged_in) && product_details?.inventory?.inventory_tracking_enabled && (
						<Grid display='flex' alignItems='center' className={classes.inventory_container}>
							<InventoryStatus data={product_details} style={{ height: '4rem' }} showBg={true} />
						</Grid>
					)}

					{utils?.is_prelogin_add_to_cart_button(is_logged_in) && (
						<React.Fragment>
							{catalog_mode ? (
								<Button
									variant='contained'
									id={`add_to_cart_${product_details?.id}`}
									sx={{
										height: '40px',
										boxShadow: 'none',
										maxWidth: product_details?.inventory?.inventory_tracking_enabled ? '400px' : 'auto',
									}}
									onClick={handle_select}
									fullWidth
									tonal={selected}>
									<Grid>
										{selected ? (
											<Grid container alignItems={'center'} gap={1}>
												<Icon iconName='check' color={colors.primary_500} />
												Selected
											</Grid>
										) : (
											'Select'
										)}
									</Grid>
								</Button>
							) : !discounted_products?.is_discount_applied ? (
								<Grid
									flex={1}
									sx={{
										minWidth: '35%',
										width: '43%',
										flex: '1',
										whiteSpace: 'nowrap',
									}}>
									<Counter
										is_responsive={true}
										disabled={disable_counter}
										step={pricing?.step_increment || types.STEP_INCREMENT}
										initialCount={0}
										value={item_quantity}
										error={error}
										cart_item_key={filtered_keys}
										min={pricing?.min_order_quantity}
										max={max_quantity}
										from_max={from_max_quantity(max_quantity, pricing?.max_order_quantity ?? types.DEFAULT_ORDER_QUANTITY)}
										handle_count={(value: any) => handle_change(value)}
										product_id={product_id}
										parent_id={type === PRODUCT_DETAILS_TYPE.variant ? parent_id : id}
										product={product_details}
										containerStyle={{
											width: '100%',
											justifyContent: 'space-between',
										}}
										inputStyle={{
											minWidth: '40px',
											width: '100%',
										}}
										className={classes.add_to_cart_button}
										is_capitalize={true}
										default_order_quantity={pricing?.default_order_quantity || 0}
										volume_tiers={pricing?.volume_tiers || []}
										is_customization_required={is_customization_required}
										handle_customization={handle_customization}
										page_name='product_details_page'
										section_name=''
										discount_applied={selected_discount_campaign}
									/>
								</Grid>
							) : (
								render_cart_counter()
							)}
						</React.Fragment>
					)}
					{!utils?.is_prelogin_price(is_logged_in) && (
						<Button
							fullWidth
							className='lock_price_button'
							startIcon={<Icon iconName='IconLock' />}
							onClick={() => navigate(utils?.handle_active_free_trial_navigate())}>
							{utils?.check_prelogin_price(is_small_screen)}
						</Button>
					)}
				</Box>
			</Grid>
			<hr style={{ margin: '0px' }}></hr>
			{show_customise && (
				<CustomProductDrawer
					show_customise={show_customise}
					set_show_customise={set_show_customise}
					set_show_modal={set_show_modal}
					product_id={customize_id}
					default_sku_id={product_details?.sku_id}
					handle_get_cart_details={handle_get_cart_details}
					open={open}
					set_open={set_open}
					base_price={product_details?.pricing?.price}
					currency={currency}
					page_name={'product_details_page'}
					section_name={''}
					product_data={product_details}
				/>
			)}

			{cart_drawer && (
				<CartDrawer
					show={cart_drawer}
					set_show={set_cart_drawer}
					data={product_details}
					cart_product_id={id}
					discount_campaigns={discount_campaigns}
				/>
			)}
			{drawer && (
				<VariantDrawer
					type={delete_action_active ? constants.VARIANT_DRAWER_TYPES.DELETE : constants.VARIANT_DRAWER_TYPES.VIEW}
					handle_get_total_price={(val: any) => handle_total_price(val)}
					set_drawer={set_drawer}
					drawer={drawer}
					id={parent_id}
					attribute_template={custom_variant_template}
					parent_product={product_details}
					selected_skus={selected_skus}
					set_selected_skus={set_selected_skus}
					set_selected_filters={set_selected_filters}
					selected_filters={selected_filters}
					set_show_delete_product_modal={set_show_delete_product_modal}
					discount_campaigns={discount_campaigns}
				/>
			)}
			{show_modal && <CustomProductModal show_modal={show_modal} set_show_modal={set_show_modal} set_show_customise={set_show_customise} />}
		</React.Fragment>
	);
};

export default ProductActionSection;
