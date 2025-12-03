import _ from 'lodash';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { update_catalog } from 'src/actions/buyer';
import { initializeCart } from 'src/actions/cart';
import api_requests from 'src/utils/api_requests';
import cart_management from 'src/utils/api_requests/cartManagement';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
import { get_customer_metadata } from 'src/utils/utils';

const useProductListingPageTemplate = () => {
	const [cart2] = useState({});
	const [discount_campaigns, set_discount_campaigns] = useState<any>([]);
	const [cart_loading, set_cart_loading] = useState(false);
	const dispatch = useDispatch();
	const buyer = useSelector((state: any) => state?.buyer);
	const linked_catalog = useSelector((state: any) => state.linked_catalog);

	const handle_attach_catalog_id = async () => {
		try {
			await cart_management.post_attach_catalog(buyer?.buyer_cart?.id, [linked_catalog?.value]);
			dispatch<any>(update_catalog({ catalog: { value: linked_catalog?.value, label: linked_catalog?.label } }));
		} catch (err) {
			console.log(err);
		}
	};

	const initialize_cart = async () => {
		set_cart_loading(true);
		const { buyer_cart, is_guest_buyer } = buyer;
		const local_id = localStorage.getItem('CartData') ? JSON.parse(localStorage.getItem('CartData') || '').id : null;
		const cart_id = is_ultron ? buyer_cart?.data?.[0]?.id : local_id ?? buyer_cart?.data?.[0]?.id;

		if (!cart_id) return;

		try {
			const response: any = await cart_management.get_cart_details({ cart_id, is_guest_buyer });

			if (response.status === 200) {
				const { cart } = response;
				const { items, products: _product } = cart;

				if (!_.isEmpty(linked_catalog?.value) && linked_catalog?.value !== buyer?.catalog?.value) {
					handle_attach_catalog_id();
				}

				if (cart?.catalog_ids?.length > 0 && cart?.catalog_ids?.[0] !== '' && cart?.catalog_ids?.[0] !== buyer?.catalog?.value) {
					dispatch<any>(update_catalog({ catalog: { value: cart?.catalog_ids[0], label: '' } }));
				}

				if (items && Object.keys(items)?.length > 0) {
					for (let _item in items) {
						const { id, parent_id } = _product[_item];

						items[_item].parent_id = parent_id;
						items[_item].id = id;
					}
				}
				if (cart?.document_status !== 'draft' && !_.isEmpty(cart?.document_status)) {
					//get cart -> get cart detail()-> set cart ->chill
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

						set_cart_loading(false);
					} catch {
						console.error('error');
					}
				} else {
					dispatch(
						initializeCart({
							id: cart_id,
							products: items,
							products_details: _product,
							document_items: cart?.document_items || {},
							container_data: cart?.container_data || {},
							meta: cart?.meta || {},
						}),
					);
					set_cart_loading(false);
				}
			}
		} catch (error: any) {
			console.error(error);
		}
	};
	// const handle_get_configuration = async () => {
	// 	try {
	// 		const response: any = await product_listing.get_listing_configuration();
	// 		set_cart(response.data);
	// 	} catch (e) {
	// 		console.log('get cart error');
	// 	} finally {
	// 		set_cart_loading(false);
	// 	}
	// };

	// useEffect(() => {
	// 	handle_get_configuration();
	// }, []);
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
	return {
		cart: { data: cart2, loading: cart_loading },
		initialize_cart,
		customer_metadata,
		discount_campaigns,
		get_discount_campaign,
	};
};

export default useProductListingPageTemplate;
