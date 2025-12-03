import { useState } from 'react';
import { get, size } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import {
	add_multiple_catalog_products,
	add_single_catalog_product,
	remove_multiple_catalog_products,
	remove_single_catalog_product,
} from 'src/actions/catalog_mode';
import useCatalogActions from './useCatalogActions';
import constants from 'src/utils/constants';

export const useCatalogSelection = () => {
	const dispatch = useDispatch();
	const product_limit = useSelector((state: any) =>
		get(state, 'settings.presentation_config.product_limit', constants.MAX_CATALOG_STORING_LIMIT_DEFAULT),
	);
	const { catalog_mode, catalog_products_length } = useSelector((state: any) => state.catalog_mode);
	const { handle_selection_limit_toast } = useCatalogActions();
	const [selected, set_selected] = useState(false);

	const handle_select_all = (products: any[]) => {
		if (catalog_mode) {
			if (selected) {
				dispatch(remove_multiple_catalog_products(products));
			} else {
				if (catalog_products_length + size(products) > product_limit) {
					handle_selection_limit_toast(product_limit);
					return;
				}
				dispatch(add_multiple_catalog_products(products));
			}
			set_selected((prev: boolean) => !prev);
		}
	};

	const handle_select_variant = (variant_id: string) => {
		if (selected) {
			dispatch(remove_single_catalog_product(variant_id));
		} else {
			if (catalog_products_length >= product_limit) {
				handle_selection_limit_toast(product_limit);
				return;
			}
			dispatch(add_single_catalog_product(variant_id));
		}
		set_selected((prev: boolean) => !prev);
	};

	return {
		selected,
		set_selected,
		handle_select_all,
		handle_select_variant,
	};
};
