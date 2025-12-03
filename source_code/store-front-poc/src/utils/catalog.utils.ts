import _ from 'lodash';
import { CatalogTemplate, EditedCatalogData, SortOption } from 'src/@types/presentation';
import { ICatalog } from 'src/reducers/buyer';

const catalog_key = 'catalog_mode';
const catalog_products_key = 'catalog_mode_products';
const catalog_selected_pricelist_key = 'catalog_mode_pricelist';
const catalog_selected_sort_key = 'catalog_mode_sort';
const catalog_id_key = 'catalog_id';
const edit_catalog_mode_key = 'edit_catalog_mode';
const is_edit_fetched_key = 'is_edit_fetched';
const edit_catalog_data = 'edit_catalog_data';

const MODE = {
	activate_catalog_mode: () => {
		sessionStorage.setItem(catalog_key, 'true');
	},
	remove_catalog_mode: () => {
		sessionStorage.setItem(catalog_key, 'false');
	},
	get_catalog_mode_state: (): boolean => {
		return sessionStorage.getItem(catalog_key) === 'true';
	},
	update_catalog_mode_state: (state: boolean) => {
		sessionStorage.setItem(catalog_key, String(state));
	},
	set_selected_pricelist: (pricelist: ICatalog) => {
		sessionStorage.setItem(catalog_selected_pricelist_key, JSON.stringify(pricelist));
	},
	set_selected_sort: (sort: SortOption | {}) => {
		sessionStorage.setItem(catalog_selected_sort_key, JSON.stringify(sort));
	},
	get_selected_pricelist: (): ICatalog => {
		const stored_pricelist = sessionStorage.getItem(catalog_selected_pricelist_key);
		const data: any = _.isEmpty(stored_pricelist) ? JSON.stringify({}) : stored_pricelist;
		return JSON.parse(data);
	},
	get_selected_sort: (): SortOption => {
		const stored_sort = sessionStorage.getItem(catalog_selected_sort_key);
		const data: any = _.isEmpty(stored_sort) ? JSON.stringify({}) : stored_sort;
		return JSON.parse(data);
	},
	set_edit_catalog_mode: (value: boolean) => {
		sessionStorage.setItem(edit_catalog_mode_key, JSON.stringify(value));
	},
	get_edit_catalog_mode: (): boolean => {
		const storedValue = sessionStorage.getItem(edit_catalog_mode_key);
		return storedValue ? JSON.parse(storedValue) : false; // Default to false if not found
	},
	set_catalog_id: (catalog_id: string | null) => {
		sessionStorage.setItem(catalog_id_key, JSON.stringify(catalog_id));
	},
	get_catalog_id: (): string | null => {
		const storedCatalogId = sessionStorage.getItem(catalog_id_key);
		return storedCatalogId ? JSON.parse(storedCatalogId) : null; // Default to null if not found
	},
	set_catalog_data: (catalog_data: any | null) => {
		sessionStorage.setItem(edit_catalog_data, JSON.stringify(catalog_data));
	},
	get_catalog_data: (): any | null => {
		const storedCatalogData = sessionStorage.getItem(edit_catalog_data);
		return storedCatalogData ? JSON.parse(storedCatalogData) : null; // Default to null if not found
	},
	get_default_catalog_values: (edit_data: EditedCatalogData, catalog_templates: CatalogTemplate[], catalog_products: any[]) => {
		// Check if template exists, otherwise default to an empty template_id
		const template_id = _.some(catalog_templates, (template) => template.id === edit_data?.template_id) ? edit_data?.template_id : '';
		return {
			name: edit_data?.name ?? '',
			sort_by: '',
			template_id,
			catalog_id: edit_data?.catalog_id,
			show_price: edit_data?.show_price,
			product_ids: catalog_products || [],
		};
	},
	store_is_edit_fetched: (value: boolean) => {
		sessionStorage.setItem(is_edit_fetched_key, JSON.stringify(value));
	},
	get_is_edit_fetched: (): boolean => {
		const stored_value = sessionStorage.getItem(is_edit_fetched_key);
		return stored_value ? JSON.parse(stored_value) : false;
	},
};

const PRODUCT = {
	fetch_products: (): string[] => {
		const storage = sessionStorage.getItem(catalog_products_key);
		const data: any = _.isEmpty(storage) ? JSON.stringify([]) : storage;
		let products: string[];
		try {
			products = JSON.parse(data);
		} catch {
			products = [];
		}
		return products;
	},
	PUBLIC: {
		add_product: (productId: string) => {
			const products = PRODUCT.fetch_products();
			if (!_.includes(products, productId)) {
				products.push(productId);
				sessionStorage.setItem(catalog_products_key, JSON.stringify(products));
			}
		},
		check_multiple_products: (product_ids: string[], stored_products: string[]) => {
			const is_complete = _.every(product_ids, (id) => stored_products.includes(id));
			const is_partial = _.some(product_ids, (id) => stored_products.includes(id));
			const stored_product_ids = _.filter(product_ids, (id) => stored_products.includes(id));
			return {
				is_complete: _.size(product_ids) === 0 ? false : is_complete,
				is_partial,
				stored_product_count: _.size(stored_product_ids),
			};
		},
		remove_product: (productId: string) => {
			let products = PRODUCT.fetch_products();
			products = _.filter(products, (item: string) => item !== productId);
			sessionStorage.setItem(catalog_products_key, JSON.stringify(products));
		},
		check_product: (productId: string): boolean => {
			const products = PRODUCT.fetch_products();
			return _.includes(products, productId);
		},
		get_products: () => {
			return PRODUCT.fetch_products();
		},
		remove_all_products: () => {
			sessionStorage.removeItem(catalog_products_key);
		},
		save_catalog_products: (product_ids: string[]) => {
			sessionStorage.setItem(catalog_products_key, JSON.stringify(product_ids));
		},
	},
};

export default {
	MODE,
	PRODUCT: PRODUCT.PUBLIC,
};
