import { t } from 'i18next';
import { map } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Checkbox, Grid } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import CatalogFactory from 'src/utils/catalog.utils';
import { useCatalogSelection } from 'src/hooks/useCatalogSelection';
import { get_product_id } from 'src/utils/utils';

export default function SelectAll({ products }: any) {
	const [select_partial, set_select_partial] = useState(false);
	const { selected, set_selected, handle_select_all } = useCatalogSelection();
	const { catalog_mode, catalog_products } = useSelector((state: any) => state?.catalog_mode);
	const sku_ids = map(products, (product: any) => get_product_id(product));

	const handle_select_all_checkbox = () => {
		handle_select_all(sku_ids);
	};

	useEffect(() => {
		if (!catalog_mode) return;

		const check = CatalogFactory.PRODUCT.check_multiple_products(sku_ids, catalog_products);
		set_selected(check.is_complete);
		set_select_partial(!check.is_complete && check.is_partial);
	}, [catalog_mode, catalog_products, products]);

	return (
		<Grid sx={{ display: 'flex', alignItems: 'center' }}>
			<Checkbox checked={selected} indeterminate={select_partial} onChange={handle_select_all_checkbox} />
			<CustomText type='Subtitle'>{t('Common.VariantDrawer.SelectAll')}</CustomText>
		</Grid>
	);
}
