/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { Drawer, Grid, Icon, Button, Checkbox } from 'src/common/@the-source/atoms';
import { Divider } from '@mui/material';
import _ from 'lodash';
import useStyles from 'src/screens/Dashboard/styles';
import StorefrontSkeletonDrawer from 'src/screens/Storefront/Skeleton/StorefrontSkeletonDrawer';
import CustomText from 'src/common/@the-source/CustomText';
import { useTheme } from '@mui/material/styles';
import cartManagement from 'src/utils/api_requests/cartManagement';
import CartSkeleton from 'src/screens/OrderManagement/component/AbandonedCart/CartSkeleton';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { t } from 'i18next';
import { RootState } from 'src/store';
import ReOrderCard from './ReOrderCardComponent';
import { Mixpanel } from 'src/mixpanel';
import Events from 'src/utils/events_constants';
import api_requests from 'src/utils/api_requests';
import usePricelist from 'src/hooks/usePricelist';
import useProductDetails from 'src/screens/ProductDetailsPage/useProductDetails';

interface Props {
	drawer: boolean;
	on_close: any;
	data?: any;
	set_success_toast: any;
}

const QuickViewDrawer = ({ drawer, on_close, data, set_success_toast }: Props) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const [details, set_details] = useState<any>(null);
	const [loading, set_loading] = useState(true);
	const [bulk_load, set_bulk_load] = useState(false);
	const _theme: any = useTheme();
	const cart_from_local = JSON.parse(localStorage.getItem('CartData') || '{}');
	const cartDataFromStorage = JSON.parse(localStorage.getItem('CartData') || '{}');
	const cart_id_value = useSelector((state: RootState) => state?.cart?.id) || cartDataFromStorage?.id;
	const buyer = useSelector((state: RootState) => state.buyer);
	const redux_cart_id = useSelector((state: RootState) => state?.buyer?.buyer_cart?.id);
	const cart_id = !_.isEmpty(cart_id_value) ? cart_id_value : redux_cart_id;
	const [selected_products, set_selected_products] = useState<{ [key: string]: boolean }>({});
	const [select_all, set_select_all] = useState(false);
	const cart = useSelector((state: any) => state?.cart?.products);
	const cart_product_details = useSelector((state: any) => state?.cart?.products_details);
	const [cart_products, set_cart_products] = useState<any>(cart);
	const [cart_product_details_data, set_cart_products_details_data] = useState<any>(cart_product_details);
	const [search_data, set_search_data] = useState<any>({});
	const [all_products_in_cart, set_all_products_in_cart] = useState(false);
	const pricelist_value = usePricelist();
	const { discount_campaigns } = useProductDetails();

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header' style={{ padding: '16px 20px' }}>
				<Grid container flexDirection={'row'} gap={1} alignItems={'center'}>
					<CustomText type='H3'>{t('Common.QuickViewDrawer.DrawerHeader')}</CustomText>
					<CustomText type='Body' color={_theme?.product?.similar_drawer?.sub_title?.color}>
						({data?.system_id})
					</CustomText>
				</Grid>
				<Icon iconName='IconX' onClick={on_close} sx={{ cursor: 'pointer' }} />
			</Grid>
		);
	};

	const is_product_error = (product_info: any, details: any, product_id: string, search?: any): boolean => {
		const website_display_setting = search
			? _.get(search?.[product_id], 'website_display_setting')
			: _.get(search_data?.[product_id], 'website_display_setting');

		const is_custom_product = _.some(details?.items?.[product_id], { is_custom_product: true });
		const not_in_search = !_.get(search || search_data, is_custom_product ? product_info?.parent_id : product_id);

		return (
			!_.get(search?.[product_id] || search_data?.[product_id] || product_info, 'is_active') ||
			_.get(search?.[product_id] || search_data?.[product_id] || product_info, 'status') === 'archived' ||
			_.get(search?.[product_id] || search_data?.[product_id] || product_info, 'product_state') === 'DISCONTINUED' ||
			_.get(search?.[product_id] || search_data?.[product_id] || product_info, 'inventory.inventory_status', false) === 'OUT_OF_STOCK' ||
			_.get(details, `errors.${product_id}.length`, 0) > 0 ||
			website_display_setting === 'DontShow' ||
			not_in_search ||
			_.get(product_info, 'product_state') === 'ADHOC'
		);
	};

	const is_product_in_cart = (item: any, product_info: any) => {
		if (_.isEmpty(cart_products)) {
			return false;
		}

		return _.some(_.entries(cart_products), ([key, value]) => {
			if (!value) return false;

			return _.some(_.keys(value as any), (productKey) => {
				const cartproduct = _.get(value as any, productKey);
				const local_detail = _.get(cart_product_details_data, key);

				if (!cartproduct) return false;

				const cart_parent_id =
					_.get(cartproduct, 'meta.product_details.parent_id') || _.get(cartproduct, 'parent_id') || _.get(local_detail, 'parent_id');

				if (cart_parent_id !== _.get(product_info, 'parent_id')) {
					return false;
				}

				const cartModifiers = _.values(_.get(cartproduct, 'applied_modifiers', {}));
				const docModifiers = _.flatten(_.map(_.values(item), (product) => _.values(_.get(product, 'applied_modifiers', {}))));

				const sortedCartModifiers = _.sortBy(cartModifiers, 'label');
				const sortedDocModifiers = _.sortBy(docModifiers, 'label');

				return _.isEqual(sortedCartModifiers, sortedDocModifiers);
			});
		});
	};

	const handle_add_all_to_cart = async () => {
		const items_array: any[] = [];
		_.map(details?.items, (item: any, item_id: string) => {
			const quantity = _.reduce(item, (sum: number, { quantity = 0 }: any) => sum + quantity, 0);
			const product = details?.products?.[item_id];
			const new_product_id = product?.id;

			const is_custom_product = _.some(item, { is_custom_product: true });
			const already_in_cart = is_custom_product ? is_product_in_cart(item, product) : false;

			if (!selected_products?.[new_product_id] || cart_products?.[new_product_id] || already_in_cart) return;

			let product_moq = product?.pricing?.min_order_quantity;

			if (cart_from_local?.products?.[product?.id]) {
				const product_entries: any = _.values(_.get(cart_from_local, ['products', product?.id], {}));
				if (_.size(product_entries) > 0) {
					product_moq = _.get(_.head(product_entries), 'quantity', product?.pricing?.min_order_quantity);
				}
			}

			// const product_available_quantity = product?.inventory?.inventory_tracked ? product?.inventory?.total_available : 10000;
			const product_error = _.get(product, 'product_state') === 'ADHOC';
			_.map(item, (cart_item: any) => {
				const product_cart_item = cart_item?.is_custom_product
					? {
							product_id: crypto.randomUUID(),
							cart_id,
							cart_item_id: crypto.randomUUID(),
							quantity: quantity || cart_item?.quantity,
							is_custom_product: cart_item?.is_custom_product,
							applied_modifiers: cart_item?.applied_modifiers,
							created_from_parent_id: product?.parent_id,
							sku_id: product?.sku_id,
							meta: {
								product_details: {
									...product,
									product_id: product_error ? crypto.randomUUID() : product?.id,
								},
							},
					  }
					: {
							product_id: product?.id,
							cart_id,
							quantity: quantity || cart_item?.quantity,
							is_custom_product: false,
							meta: {
								product_details: {
									...product,
								},
							},
					  };

				if (!product_error) {
					items_array.push(product_cart_item);
				}
			});
		});

		const payload: any = {
			products: items_array,
		};
		try {
			set_bulk_load(true);
			const response: any = await cartManagement.update_bulk_item(payload, true);
			if (response?.status === 200) {
				set_success_toast({
					open: true,
					title: 'All products added to cart',
					subtitle: '',
					state: 'success',
				});
				setTimeout(() => {
					navigate('/cart-summary');
					on_close();
				}, 1000);
			}
		} catch (err) {
			console.error(err, 'error while adding bulk items');
			set_success_toast({
				open: true,
				title: 'Could not add products to cart',
				subtitle: '',
				state: 'error',
			});
		} finally {
			set_bulk_load(false);
			Mixpanel.track(Events.REORDER_ADD_TO_CART_CLICKED, {
				tab_name: 'My Orders',
				page_name: 'Reorder Sidesheet',
				section_name: '',
			});
		}
	};

	const handle_get_cart = async () => {
		try {
			if (_.isEmpty(_.get(details, 'items'))) {
				set_all_products_in_cart(false);
				return;
			}
			const all_in_cart = _.every(_.keys(details?.items), (product_id) => {
				return _.get(cart_products, product_id) === true;
			});
			set_all_products_in_cart(all_in_cart);
		} catch (error: any) {
			console.error('Error while fetching cart details:', error?.message);
		}
	};

	const get_document_details = async () => {
		try {
			set_loading(true);
			const response: any = await api_requests.order_management.get_document_details({ document_id: data?.id });
			const productIds = _.map(_.values(_.get(response, 'cart_details.products', {})), (product) =>
				_.get(product, 'product_state') === 'CUSTOM' ? _.get(product, 'parent_id') : _.get(product, 'id'),
			);
			const payload = {
				buyer_tenant_id: buyer?.buyer_info?.id,
				search: '',
				filters: {
					id: productIds,
					// type: 'variant',
				},
				range_filters: {},
				sort: [
					{
						field: 'created_at',
						order: 'desc',
					},
				],
				attributes_list: [],
				search_field: '',
				catalog_ids: pricelist_value?.value ? [pricelist_value?.value] : [],
			};
			const product_response: any = await api_requests.order_management.get_product_list(payload);
			set_search_data(product_response?.data?.hits);
			set_details(response?.cart_details);

			const initialSelectedProducts = _.reduce(
				response?.cart_details?.items,
				(acc: any, item: any, product_id: string) => {
					const product_info = response?.cart_details?.products?.[product_id];

					const new_product_id = product_info?.id;

					const product_error = _.get(product_info, 'product_state') === 'ADHOC'; // is_product_error(product_info, response?.cart_details, new_product_id, product_response?.data?.hits);
					acc[new_product_id] = product_error ? false : true;
					return acc;
				},
				{},
			);
			set_selected_products(initialSelectedProducts);
			set_select_all(true);
		} catch (error: any) {
			throw new Error(`Failed to fetch document details: ${error?.message}`);
		} finally {
			set_loading(false);
		}
	};
	const handle_select_all = () => {
		if (select_all) {
			Mixpanel.track(Events.REORDER_UNSELECT_PRODUCT_CLICKED, {
				tab_name: 'My Orders',
				page_name: 'Reorder Sidesheet',
				section_name: '',
			});
		} else {
			Mixpanel.track(Events.REORDER_SELECT_PRODUCT_CLICKED, {
				tab_name: 'My Orders',
				page_name: 'Reorder Sidesheet',
				section_name: '',
			});
		}
		const newSelectAll = !select_all;
		set_select_all(newSelectAll);
		const newSelectedProducts = _.reduce(
			details?.items,
			(acc: any, item: any, product_id: string) => {
				const product_info = details?.products?.[product_id];
				// const is_custom_product = _.some(item, { is_custom_product: true });
				const new_product_id = product_info?.id;
				const has_error = _.get(product_info, 'product_state') === 'ADHOC'; // is_product_error(product_info, details, new_product_id);
				acc[new_product_id] = (newSelectAll && !has_error) || cart_products?.[new_product_id];
				return acc;
			},
			{} as { [key: string]: boolean },
		);
		set_selected_products(newSelectedProducts);
	};

	const handle_product_select = (product_id: string) => {
		let product_info = details?.products?.[product_id];
		if (!product_info) {
			product_info = _.find(_.values(_.get(details, 'products', {})), (product: any) => {
				return _.get(product, 'parent_id') === product_id;
			});
		}
		// const has_error = is_product_error(product_info, details, product_id);
		if (_.get(product_info, 'product_state') === 'ADHOC') {
			return;
		}
		set_selected_products((prevSelectedProducts) => {
			const newSelectedProducts = {
				...prevSelectedProducts,
				[product_id]: !prevSelectedProducts?.[product_id],
			};

			if (newSelectedProducts[product_id]) {
				Mixpanel.track(Events.REORDER_SELECT_PRODUCT_CLICKED, {
					tab_name: 'My Orders',
					page_name: 'Reorder Sidesheet',
					section_name: '',
				});
			} else {
				Mixpanel.track(Events.REORDER_UNSELECT_PRODUCT_CLICKED, {
					tab_name: 'My Orders',
					page_name: 'Reorder Sidesheet',
					section_name: '',
				});
			}

			const allSelected = _.every(_.keys(newSelectedProducts), (key) => _.get(newSelectedProducts, key) || _.get(cart_products, key));
			set_select_all(allSelected);
			return newSelectedProducts;
		});
	};

	useEffect(() => {
		if (_.isEmpty(cart)) {
			set_cart_products(cart_from_local?.products);
			set_cart_products_details_data(cart_from_local?.products_details);
		}
		handle_get_cart();
		get_document_details();
	}, []);

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				{loading ? (
					<Grid my={1}>
						<CartSkeleton />
					</Grid>
				) : (
					<Grid my={1}>
						{_.map(details?.items, (product: any, product_key: any) => {
							const quantity = _.reduce(product, (sum: number, { quantity = 0 }: any) => sum + quantity, 0);
							const is_custom_product = _.some(product, { is_custom_product: true });
							const product_info = details?.products?.[product_key];
							const new_product_id = product_info?.id;
							const cart_error = is_product_error(product_info, details, new_product_id);
							const is_adhoc_product = _.get(product_info, 'product_state') === 'ADHOC';
							const already_in_cart = is_custom_product ? is_product_in_cart(product, product_info) : false;
							return (
								<Grid key={product_key} flexDirection={'column'} gap={1}>
									<Grid className={classes.reorder_card_container} mb={1}>
										<Checkbox
											onChange={() => handle_product_select(new_product_id)}
											checked={selected_products?.[new_product_id] || cart_products?.[new_product_id]}
											disabled={is_adhoc_product || cart_products?.[new_product_id]}
											inputRef={{ value: product_info?.id }}
											size='small'
											sx={{
												'&.Mui-checked': { ..._theme?.product?.filter?.category_filter?.checkbox },
												'&.Mui-disabled': {
													color: _theme?.product?.reorder_card?.disabled_checkbox,
												},
											}}
										/>
										<ReOrderCard
											product={{
												...product_info,
												is_customizable: is_custom_product ?? false,
												id: is_custom_product ? product_info?.parent_id : product_info?.id,
											}}
											page_name='ReOrder'
											section_name='ReOrder'
											cart_item={{ ...product, quantity }}
											cart_error={cart_error}
											already_in_cart={already_in_cart || cart_products?.[new_product_id]}
											search_data={search_data}
											discount_campaigns={discount_campaigns}
										/>
									</Grid>
								</Grid>
							);
						})}
					</Grid>
				)}
			</Grid>
		);
	};

	const handle_render_footer = () => {
		const is_select_all_disabled = _.every(_.keys(details?.items || {}), (product_id) => {
			const product_info = details?.products?.[product_id];
			const new_product_id = product_info?.id;
			// const has_error = is_product_error(product_info, details, new_product_id);
			return _.get(product_info, 'product_state') === 'ADHOC' || cart_products?.[new_product_id];
		});
		return (
			<Grid
				className='drawer-footer'
				style={{ display: 'flex', flexDirection: 'column', gap: '0px', boxShadow: _theme?.product?.reorder_card?.boxShadow }}>
				<Grid container px={2} sx={{ background: _theme?.product?.reorder_card?.footer_background, display: 'flex', alignItems: 'center' }}>
					<Checkbox
						onChange={handle_select_all}
						checked={select_all || all_products_in_cart}
						disabled={is_select_all_disabled}
						size='small'
						sx={{
							'&.Mui-checked': { ..._theme?.product?.filter?.category_filter?.checkbox },
							'&.Mui-disabled': {
								color: _theme?.product?.reorder_card?.disabled_checkbox,
							},
						}}
					/>
					<CustomText>{t('Common.QuickViewDrawer.SelectAll')}</CustomText>
				</Grid>
				<Grid className={classes.footer_container}>
					<Grid sx={{ background: _theme?.product?.reorder_card?.footer_background, padding: '4px 16px' }}>
						<CustomText>
							{_.size(_.filter(selected_products, Boolean))} {_.size(_.filter(selected_products, Boolean)) <= 1 ? 'product' : 'products'}{' '}
							selected
						</CustomText>
					</Grid>
					<Grid>
						<Button variant='contained' loading={bulk_load} onClick={handle_add_all_to_cart}>
							{t('Common.QuickViewDrawer.AddAllToCart')}
						</Button>
					</Grid>
				</Grid>
			</Grid>
		);
	};

	const handle_render_drawer = () => {
		return (
			<Grid className={classes.drawer_container}>
				{handle_render_header()}
				<Divider className={classes.drawer_divider} />
				{handle_render_drawer_content()}
				{handle_render_footer()}
			</Grid>
		);
	};

	const handleSkeleton = () => {
		return <StorefrontSkeletonDrawer data={data} />;
	};

	return (
		<>
			<Drawer
				anchor='right'
				width={440}
				open={drawer}
				onClose={on_close}
				content={<React.Fragment>{false ? handleSkeleton() : handle_render_drawer()}</React.Fragment>}
			/>
		</>
	);
};
export default QuickViewDrawer;
