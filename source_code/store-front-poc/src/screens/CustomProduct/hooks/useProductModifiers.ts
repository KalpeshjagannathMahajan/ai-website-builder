import { useState, useEffect } from 'react';
import { product_listing } from 'src/utils/api_requests/productListing';
import _ from 'lodash';

interface productProps {
	product_id: string;
	buyer_tenant_id: string;
	catalog_id: string;
}

const useProductModifiers = ({ product_id, buyer_tenant_id, catalog_id }: productProps) => {
	const [data, setData] = useState([]);
	const [is_loading, set_is_loading] = useState(true);

	useEffect(() => {
		if (!product_id || !buyer_tenant_id) return;

		const fetchModifiers = async () => {
			try {
				const params = { product_id, buyer_tenant_id, catalog_ids: catalog_id };
				const res: any = await product_listing.get_product_modifier(params);
				const sortedData: any = _.sortBy(res?.data, (item) => item.priority);
				setData(sortedData);
			} catch (err) {
				console.log(err);
			} finally {
				set_is_loading(false);
			}
		};

		fetchModifiers();
	}, [product_id, buyer_tenant_id]);

	return { data, is_loading };
};

export default useProductModifiers;
