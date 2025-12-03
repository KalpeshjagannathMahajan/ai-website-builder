import { difference, find, get, isEmpty, keys, size } from 'lodash';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
	set_edit_catalog_data,
	set_is_edit_fetched,
	reset_catalog_mode,
	set_catalog_products,
	set_edit_catalog_id,
	set_edit_mode,
	set_selected_pricelist,
	update_catalog_mode,
} from 'src/actions/catalog_mode';
import { close_toast, show_toast } from 'src/actions/message';
import { PRODUCT_DETAILS_TYPE } from 'src/screens/ProductDetailsPage/constants';
import presentation from 'src/utils/api_requests/presentation';
import { product_listing } from 'src/utils/api_requests/productListing';
import RouteNames from 'src/utils/RouteNames';
import types from 'src/utils/types';
import CatalogFactory from 'src/utils/catalog.utils';

const useCatalogActions = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { catalog_mode, price_lists } = useSelector((state: any) => state?.catalog_mode);
	const buyer = useSelector((state: any) => state?.buyer);

	const get_mapped_price_list = () => {
		const current_selected_price_list: any = get(buyer, 'catalog.value');
		const selected_price_list = find(price_lists, (item) => item?.value === current_selected_price_list);
		return selected_price_list;
	};

	const handle_initialise_create_mode = useCallback(() => {
		const mapped_price_list = get_mapped_price_list();
		if (mapped_price_list) {
			dispatch(set_selected_pricelist(mapped_price_list));
		}
	}, [dispatch, price_lists, buyer]);

	const handle_download = useCallback(
		(url: string) => {
			if (!url) return;
			window.open(url, '_blank');
		},
		[dispatch],
	);

	const handle_show_toast = useCallback(
		({ state, title, subtitle }: { state: string; title: string; subtitle: string }) => {
			dispatch<any>(
				show_toast({
					open: true,
					showCross: false,
					anchorOrigin: {
						vertical: types.VERTICAL_TOP,
						horizontal: types.HORIZONTAL_CENTER,
					},
					autoHideDuration: 5000,
					onClose: (_event: React.ChangeEvent<HTMLInputElement>, rea: String) => {
						if (rea === types.REASON_CLICK) {
							return;
						}
						dispatch(close_toast(''));
					},
					state,
					title,
					subtitle,
					showActions: false,
				}),
			);
		},
		[dispatch],
	);

	const handle_navigate_to_edit = useCallback(
		(catalog_id: string) => {
			if (!catalog_id) return;
			const path = `${RouteNames.product.all_products.review.edit.routing_path}${catalog_id}`;
			navigate(path);
		},
		[navigate, dispatch],
	);

	const enable_edit_mode = useCallback(
		(catalog_id: string) => {
			dispatch(set_edit_mode(true));
			dispatch(set_edit_catalog_id(catalog_id));
			dispatch(update_catalog_mode({ catalog_mode: true }));
			dispatch(set_edit_catalog_data(null));
			dispatch(set_is_edit_fetched(false));
		},
		[navigate, dispatch, price_lists],
	);

	const handle_regenerate_catalog_pdf = useCallback(async (id: string | undefined) => {
		if (!id) return;
		try {
			const response: any = await presentation.regenerate_presentation_pdf(id);
			if (response?.status === 200) {
				handle_show_toast({
					state: types.SUCCESS_STATE,
					title: t('Presentation.ToastMsg.GeneratingCatalog'),
					subtitle: '',
				});
			}
		} catch (error) {
			console.error(error);
		}
	}, []);

	const handle_copy_to_clipboard = useCallback(
		(text: string) => {
			try {
				if (!text) return;
				navigator.clipboard.writeText(text);
				handle_show_toast({
					state: types.SUCCESS_STATE,
					title: t('Common.Common.CopiedToClipboard'),
					subtitle: '',
				});
			} catch (error) {
				console.error('failed to copy text', error);
			}
		},
		[dispatch],
	);

	const handle_selection_limit_toast = (product_limit: number) => {
		handle_show_toast({
			state: types.WARNING_STATE,
			title: t('Common.Common.ProductLimitReached'),
			subtitle: `Can't select more than ${product_limit} products`,
		});
	};

	const handle_get_products = async ({ product_ids, pricelist, response_keys = [] }: any) => {
		const payload = {
			filters: {
				type: PRODUCT_DETAILS_TYPE.variant,
				id: product_ids,
			},
			catalog_ids: [pricelist?.value],
			page_size: size(product_ids),
			response_keys,
		};
		const response: any = await product_listing.get_product_list(payload);
		return response;
	};

	const handle_pricelist_change_in_catalog = useCallback(
		async ({ pricelist, set_show_modal, set_applying }: any) => {
			const catalog_products = CatalogFactory.PRODUCT.get_products();
			try {
				if (!catalog_mode || !pricelist) return;
				if (isEmpty(catalog_products)) {
					dispatch(set_selected_pricelist(pricelist));
					set_show_modal(false);
					return;
				}
				set_applying(true);
				const payload = {
					filters: {
						type: PRODUCT_DETAILS_TYPE.variant,
						id: catalog_products,
					},
					catalog_ids: [pricelist?.value],
					page_size: size(catalog_products),
					response_keys: ['id'],
				};
				const response: any = await product_listing.get_product_list(payload);
				const { hits } = response?.data || {};
				// Extract the product IDs from the hits using lodash
				const hits_product_ids = keys(hits);
				// Identify which product IDs are missing from the hits using lodash
				const missing_product_ids = difference(catalog_products, hits_product_ids);
				if (!isEmpty(missing_product_ids)) {
					const missing_products_count = size(missing_product_ids);
					handle_show_toast({
						state: types.WARNING_STATE,
						title: 'Pricelist changed',
						subtitle: `${missing_products_count} products removed`,
					});
					dispatch(set_catalog_products(hits_product_ids));
					dispatch(set_selected_pricelist(pricelist));
				}
				dispatch(set_catalog_products(hits_product_ids));
				dispatch(set_selected_pricelist(pricelist));
			} catch (error) {
				console.error(error);
			} finally {
				set_applying(false);
				set_show_modal(false);
			}
		},
		[dispatch, catalog_mode],
	);

	const handle_reset_catalog_mode = useCallback(() => {
		dispatch(reset_catalog_mode());
	}, [dispatch]);

	return {
		handle_download,
		handle_show_toast,
		handle_navigate_to_edit,
		handle_copy_to_clipboard,
		handle_regenerate_catalog_pdf,
		handle_selection_limit_toast,
		handle_pricelist_change_in_catalog,
		enable_edit_mode,
		handle_get_products,
		handle_reset_catalog_mode,
		handle_initialise_create_mode,
	};
};

export default useCatalogActions;
