/* eslint-disable @typescript-eslint/no-unused-vars */
import { Card, CircularProgress, Divider } from '@mui/material';
import { Button, Drawer, Grid, Icon, Image, Skeleton } from '../../atoms';
import SimillarCard from '../SimillarCard/SimillarCard';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { product_listing } from 'src/utils/api_requests/productListing';
import { t } from 'i18next';
import _, { head } from 'lodash';
import { CartWithoutRedux } from '../../atoms/Counter/CounterWithoutRedux';
import { Buyer } from 'src/screens/BuyerDashboard/components/BuyerInterface';
import ImageLinks from 'src/assets/images/ImageLinks';
import CustomText from '../../CustomText';
// import CartSummaryContext from 'src/screens/CartSummary/context';
import { useTheme } from '@mui/material/styles';
import cart_management from 'src/utils/api_requests/cartManagement';
import { initializeCart } from 'src/actions/cart';
import { useDispatch } from 'react-redux';
import Backdrop from '../../atoms/Backdrop';
import utils from 'src/utils/utils';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
const is_storefront = VITE_APP_REPO === 'store_front';

interface SimilarDrawerProps {
	drawer: boolean;
	simillar: any;
	card_temp: any;
	setDrawer: any;
	buyer_data?: Buyer;
	cart_data?: CartWithoutRedux;
	set_cart?: any;
	from_redux?: boolean;
	catalog_ids?: any;
	from_cart?: boolean;
	handle_done?: any;
	wishlist_data?: any;
	discount_campaigns?: any;
}

const SkeletonSimilar = () => {
	const arr = [1, 2, 3, 4];
	return (
		<>
			{arr.map((a) => (
				<Grid item key={a}>
					<Card style={{ width: '100%', height: '184px', margin: '10px', padding: '8px', boxShadow: 'none' }}>
						<Grid container direction='row' justifyContent='space-between'>
							<Grid>
								<Skeleton variant='rounded' width='184px' height='167px' />
							</Grid>
							<Grid container direction='column' justifyContent='space-between' width='220px'>
								<Grid container direction='row' justifyContent='space-between'>
									<Skeleton variant='text' sx={{ padding: '4px 0px ', width: '100px' }} />
									<Skeleton
										variant='text'
										// label={variants}
										sx={{ border: '1px solid rgba(0, 0, 0, 0.12)', fontSize: '10px', width: '50px' }}
									/>
								</Grid>
								<Skeleton variant='text' width='80px' />
								<Skeleton variant='text' width='80px' />
								<Grid>
									<Skeleton variant='text' />
								</Grid>
								<Skeleton variant='rounded' height='30px' />
							</Grid>
						</Grid>
					</Card>
					<Divider />
				</Grid>
			))}
		</>
	);
};
const SimilarDrawer: React.FC<SimilarDrawerProps> = ({
	catalog_ids,
	drawer,
	simillar = '',
	setDrawer,
	card_temp = {},
	from_redux = true,
	buyer_data,
	cart_data,
	set_cart,
	from_cart = false,
	handle_done,
	wishlist_data,
	discount_campaigns,
}) => {
	const dispatch = useDispatch();
	const catalog_mode = useSelector((state: any) => state?.catalog_mode?.catalog_mode);
	const buyer_from_redux = useSelector((state: any) => state?.buyer);
	const [simillar_products, set_simillar_products] = useState<any[]>([]);
	const add_all_to_cart = useSelector((state: any) => state.settings.add_all_to_cart) || false;
	const [is_loading, set_is_loading] = useState(false);
	const [backdrop, set_backdrop] = useState(false);
	const buyer = buyer_data ? buyer_data : buyer_from_redux;
	const catalog_id: string[] = [from_redux ? _.get(buyer_from_redux, 'buyer_info.pricelist', '') : _.head(catalog_ids) || ''];
	const cart = useSelector((state: any) => state?.cart);
	const [cart_item, set_cart_item] = useState<any>({});
	const login = useSelector((state: any) => state.login);
	const is_logged_in = login?.status?.loggedIn;
	const wizshop_settings = JSON.parse(localStorage.getItem('wizshop_settings') || '{}');

	const _theme: any = useTheme();
	const updated_cart = cart?.products;
	const cart_id = _.get(buyer?.buyer_cart, 'id', '');

	const presisted_data = JSON.parse(localStorage.getItem('persist:root') || '');
	const customer_information = presisted_data?.buyer?.buyer_id;
	const buyer_id = customer_information || buyer?.buyer_id || buyer?.buyer_info?.id;

	const get_simillar_products = async () => {
		set_is_loading(true);
		try {
			const updated_catalog_id: string[] = is_logged_in ? catalog_id : wizshop_settings?.wizshop_catalog_ids || [];
			const response: any = await product_listing.get_simillar_products(buyer_id, simillar, updated_catalog_id, is_logged_in);
			if (response?.status_code === 200) {
				if (is_storefront) {
					const in_stock_products: any[] = _.filter(
						response?.data,
						(product: any) => product?.inventory?.inventory_status !== 'OUT_OF_STOCK',
					);
					set_simillar_products(in_stock_products);
				} else {
					set_simillar_products(response?.data);
				}
			}
			set_is_loading(false);
		} catch (error) {
			set_is_loading(false);
			console.error(error);
		}
	};
	const handle_close = () => {
		let cart_changed = cart_item === cart?.products;

		if (!cart_changed && from_cart) {
			handle_done();
		}
		setDrawer(false);
	};

	useEffect(() => {
		if (from_cart) {
			set_cart_item(cart?.products);
		}
		get_simillar_products();
	}, []);

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer' justifyContent={'flex-end'} px={2} py={is_ultron ? 0 : 1}>
				<Button onClick={handle_close}>Done</Button>
			</Grid>
		);
	};

	const initialize_cart = async () => {
		const { is_guest_buyer } = buyer;

		if (!cart_id) return;

		try {
			const response: any = await cart_management.get_cart_details({ cart_id, is_guest_buyer });

			if (response.status === 200) {
				const { cart: _cart } = response;
				const { items, products: _product } = _cart;

				if (cart?.document_status !== 'draft' && !_.isEmpty(cart?.document_status)) {
					try {
						const get_new_cart: any = await cart_management.get_cart({
							buyer_id: _cart?.buyer_id,
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
					} catch {
						console.error('error');
					}
				} else {
					if (items && Object.keys(items)?.length > 0) {
						for (let _item in items) {
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
							document_items: _cart?.document_items || {},
							container_data: _cart?.container_data || {},
							meta: _cart?.meta || {},
						}),
					);
				}
			}
		} catch (error: any) {
			console.error(error);
		}
	};

	const handle_add_all_to_cart = async () => {
		set_backdrop(true);

		try {
			const promises = simillar_products.map((curr: any) => {
				const { min_order_quantity = 0, product_id = '' } = curr?.pricing;

				const payload = {
					cart_id,
					product_id,
					quantity: min_order_quantity > 0 ? min_order_quantity : 1,
					is_custom_product: false,
				};

				if (!updated_cart.hasOwnProperty(product_id)) {
					return cart_management.update_item(payload);
				}

				return Promise.resolve();
			});

			await Promise.all(promises);

			initialize_cart();
		} catch (error) {
			console.error('Error updating the cart:', error);
		}
		set_backdrop(false);
	};

	const handle_render_header = () => {
		return (
			<Grid
				container
				justifyContent='space-between'
				direction='row'
				sx={{ ..._theme?.product?.similar_drawer?.header, background: 'white' }}>
				<CustomText type='H6'>View Similar</CustomText>
				{!catalog_mode && _.size(simillar_products) > 0 && add_all_to_cart && (
					<Button
						sx={{ padding: 0 }}
						variant='text'
						onClick={handle_add_all_to_cart}
						disabled={utils.check_disabled_for_add_all_to_cart(simillar_products, updated_cart)}>
						{t('PDP.Common.AddAllToCart')}
					</Button>
				)}
				<Icon iconName='IconX' onClick={handle_close} />
			</Grid>
		);
	};

	const handle_render_drawer_content = () => {
		if (!_.size(simillar_products))
			return (
				<Grid
					className={from_cart ? 'drawer-body' : 'drawer-body-no-footer'}
					display='flex'
					justifyContent='center'
					alignItems='center'
					flexDirection='column'
					gap={1}>
					<Image src={ImageLinks.empty_similar_product_list} width='350px' height='200px' />
					<CustomText type='H2'>{t('Common.SimilarDrawer.NoProducts')}</CustomText>
					<CustomText type='Title'>{t('Common.SimilarDrawer.ExploreMore')}</CustomText>
					{is_ultron && (
						<Button variant='contained' onClick={handle_close} sx={{ my: 2 }} color='primary'>
							{t('Common.SimilarDrawer.ExporeAll')}
						</Button>
					)}
				</Grid>
			);

		return (
			<Grid
				className={from_cart ? 'drawer-body' : 'drawer-body-no-footer'}
				gap={0.5}
				sx={{ ..._theme?.product?.similar_drawer?.similar_product_list }}>
				{simillar_products.map((item: any) => (
					<Grid item key={item?.id}>
						<SimillarCard
							simillar={item}
							rec_card_template={card_temp}
							buyer_data={buyer_data}
							cart_data={cart_data}
							set_cart={set_cart}
							from_redux={from_redux}
							page_name='all_products_page'
							section_name='view_similar_side_&_bottom_sheet'
							wishlist_data={wishlist_data}
							discount_campaigns={discount_campaigns}
						/>
					</Grid>
				))}
			</Grid>
		);
	};

	const handle_render_drawer = () => {
		return (
			<Grid container sx={{ ..._theme?.product?.similar_drawer?.container, flexDirection: 'column' }}>
				{handle_render_header()}
				<Divider className='drawer-divider' />
				{handle_render_drawer_content()}
				{from_cart && (
					<>
						<Divider className='drawer-divider' />
						{handle_render_footer()}
					</>
				)}
				<Backdrop sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })} open={backdrop}>
					<CircularProgress color='inherit' />
				</Backdrop>
			</Grid>
		);
	};

	return (
		<Drawer
			anchor='right'
			width={is_ultron ? 480 : 456}
			open={drawer}
			onClose={handle_close}
			content={is_loading ? <SkeletonSimilar /> : handle_render_drawer()}
		/>
	);
};

export default SimilarDrawer;
