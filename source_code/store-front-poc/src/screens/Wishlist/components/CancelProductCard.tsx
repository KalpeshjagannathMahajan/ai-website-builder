import { filter, get, isEmpty } from 'lodash';
import { useState } from 'react';
import ProductTemplateTwo from 'src/screens/ProductListing/components/ProductTemplate2';
import wishlist from 'src/utils/api_requests/wishlist';
import { get_product_id } from 'src/utils/utils';
import useWishlistActions from '../hooks/useWishlistActions';
import { wishlist_source } from '../constants';

export default function CancelProductCard({
	product,
	wishlist_for,
	set_products,
	set_nbhits,
	handle_error,
	product_template,
	discount_campaigns,
}: any) {
	const { update_wishlist } = useWishlistActions();
	const is_wizshop_source = get(wishlist_for, 'data.source', '') === wishlist_source.WIZSHOP;
	const [cancel_loader, set_cancel_loader] = useState(false);
	const handle_cancel = async (variant_id: string) => {
		if (cancel_loader) return;
		if (isEmpty(wishlist_for)) return;
		set_cancel_loader(true);
		try {
			await wishlist.remove_product_from_wishlist(variant_id, wishlist_for?.data?.id);
			set_products((prev: any) => filter(prev, (product_data: any) => get_product_id(product_data) !== variant_id));
			set_nbhits((count: number) => count - 1);
			update_wishlist(wishlist_for?.data?.id);
		} catch (err) {
			handle_error();
		} finally {
			set_cancel_loader(false);
		}
	};

	return (
		<ProductTemplateTwo
			product={product}
			cards_template={product_template}
			has_similar={false}
			from_wishlist_detail_page={true}
			on_handle_cancel={handle_cancel}
			card_loading={cancel_loader}
			is_wizshop_source={is_wizshop_source}
			discount_campaigns={discount_campaigns}
		/>
	);
}
