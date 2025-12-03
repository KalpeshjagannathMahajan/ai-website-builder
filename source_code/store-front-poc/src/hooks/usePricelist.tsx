import { find, isEmpty } from 'lodash';
import { useSelector } from 'react-redux';

const usePricelist = () => {
	const buyer_catalog_value = useSelector((state: any) => state?.buyer?.buyer_info?.pricelist);
	const { catalog_mode, catalog_selected_pricelist } = useSelector((state: any) => state?.catalog_mode);
	const catalog_data = useSelector((state: any) => state?.catalog?.catalog_data);

	return catalog_mode && !isEmpty(catalog_selected_pricelist?.value)
		? find(catalog_data, (catalog: any) => catalog?.value === catalog_selected_pricelist?.value)
		: find(catalog_data, (catalog: any) => catalog?.value === buyer_catalog_value);
};

export default usePricelist;
