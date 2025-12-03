import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { initializeCart } from 'src/actions/cart';
import cart_management from 'src/utils/api_requests/cartManagement';

interface ProductDetails {
	id: string;
	parent_id: string;
	is_customizable?: boolean;
	grouping_identifier?: string;
}

const useIsCustomization = (product_details: ProductDetails) => {
	const [is_customization_required, set_is_customization_required] = useState<boolean>(false);
	const [grouping_identifier, set_grouping_identifier] = useState<string>('');
	const [customize_id, set_customize_id] = useState<string>('');
	const buyer = useSelector((state: any) => state.buyer);
	const dispatch = useDispatch();

	const get_and_initialize_cart = useCallback(async () => {
		const { buyer_cart, is_guest_buyer } = buyer;
		const cart_id = buyer_cart?.id;
		if (!cart_id) {
			console.error('cart_id is missing.');
			return;
		}
		try {
			const response: any = await cart_management.get_cart_details({ cart_id, is_guest_buyer });
			if (response?.status === 200) {
				const { cart: cart_response } = response;
				// const data = format_cart_details_response(cart_response);
				// set_cart_data(data);
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
		} catch (error) {
			console.error(error);
		}
	}, [buyer]);

	useEffect(() => {
		if (!product_details) return;
		const { is_customizable = false } = product_details || {};
		const needs_customization = is_customizable;
		set_is_customization_required(needs_customization);

		const customize_id_to_set = product_details?.id;
		set_customize_id(customize_id_to_set);

		const group_identifier = product_details?.grouping_identifier;
		if (group_identifier) {
			set_grouping_identifier(group_identifier);
		}
	}, [product_details]);

	return { is_customization_required, customize_id, grouping_identifier, get_and_initialize_cart };
};

export default useIsCustomization;
