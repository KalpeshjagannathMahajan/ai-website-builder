import utils from '../utils';

const wizshop_settings: any = localStorage.getItem('wizshop_settings');
const pre_login_settings = JSON.parse(wizshop_settings);
const is_pre_login_allowed = pre_login_settings?.prelogin_allowed || false;
const prelogin_buyer_tenant_id = pre_login_settings?.buyer_tenant_id;

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

export const product_listing = {
	get_category: (query_params = '') => {
		return utils.request({
			url: is_ultron
				? is_pre_login_allowed
					? '/wizshop/v1/category/'
					: `/entity/v3/category${query_params}`
				: is_pre_login_allowed
				? '/wizshop/v1/category/'
				: `/entity/v3/category${query_params}`,
			method: 'GET',
			data: {},
		});
	},
	get_collection: (query_params = '') => {
		return utils.request({
			url: is_ultron
				? is_pre_login_allowed
					? '/wizshop/v1/collection/'
					: `/entity/v3/collection/search${query_params}`
				: is_pre_login_allowed
				? '/wizshop/v1/collection/'
				: `/entity/v3/collection/search${query_params}`,
			method: 'GET',
			data: {},
		});
	},
	get_listing_configuration: (key: string) => {
		return utils.request({
			url: is_pre_login_allowed ? `wizshop/v1/configuration/${key}` : `setting/v1/configuration/${key}`,
			method: 'GET',
			data: {},
			// mock_id: MOCK_IDS.listing_page_config,
			// mock: true,
		});
	},
	get_listing_configuration_variant: (key: string) => {
		return utils.request({
			url: is_pre_login_allowed ? `wizshop/v1/configuration/${key}` : `entity/v2/product/${key}`,
			method: 'GET',
			data: {},
			// mock_id: MOCK_IDS.listing_page_config,
			// mock: true,
		});
	},
	// add payload later
	get_product_list: (data: any) => {
		return utils.request({
			url: is_pre_login_allowed ? '/wizshop/v1/product/search' : '/entity/v2/product/search',
			method: 'POST',
			data: { ...data },
			// mock_id: MOCK_IDS.product_listing,
			// mock: true,
		});
	},
	get_smart_search_products: (data: any) => {
		return utils.request({
			url: '/recommended/v2/smart_search/products',
			method: 'POST',
			data: { ...data },
		});
	},

	get_recommended_products: ({ tenent_id, product_id, filter_params, price_level_id, limit = -1, catalog_ids = [], is_logged_in }: any) => {
		let url =
			is_pre_login_allowed && !is_logged_in
				? `wizshop/v1/recommended/buyer_tenant/${prelogin_buyer_tenant_id}/product/`
				: `recommended/v2/buyer_tenant/${tenent_id}/product/`;
		let optional_added: boolean = false;
		if (product_id) {
			url = `${url}${product_id}`;
		}

		// [TODO] [Suyash]
		// Change as below
		// const search = new URLSearchParams();
		// for(let key in data) {
		// 	search.append(key, data[key]);
		// }
		if (limit > 0) {
			url = `${url}?limit=${limit}`;
			optional_added = true;
		}
		if (price_level_id) {
			url = `${url}${optional_added ? '&' : '?'}price_level_id=${price_level_id}`;
			optional_added = true;
		}
		if (catalog_ids?.length > 0 && catalog_ids[0] !== '') {
			url = `${url}${optional_added ? '&' : '?'}catalog_ids=${encodeURIComponent(catalog_ids[0])}`;
			optional_added = true;
		}
		return utils.request({
			url,
			method: 'GET',
			params: filter_params,
		});
	},
	get_frequent_products: (id: string, product_id: string, catalog_ids: string[] = [], is_logged_in: boolean) => {
		let new_id = is_pre_login_allowed && !is_logged_in ? prelogin_buyer_tenant_id : id;
		let new_url = is_pre_login_allowed ? 'wizshop/v1/product/recommended/buyer_tenant' : 'recommended/v2/buyer_tenant';
		let url = `${new_url}/${new_id}/product/${product_id}?limit=10&type=frequently-bought-products`;
		if (catalog_ids?.length > 0 && catalog_ids[0] !== '') {
			url = `${url}&catalog_ids=${encodeURIComponent(catalog_ids[0])}`;
		}
		return utils.request({
			url,
			method: 'GET',
			data: {},
		});
	},

	// Change the URL and props and for related Product Rail
	get_related_products: (buyer_id: string, id: string, catalog_ids: string[] = [], is_logged_in: boolean) => {
		let new_id = is_pre_login_allowed && !is_logged_in ? prelogin_buyer_tenant_id : buyer_id;
		let new_url = is_pre_login_allowed ? 'wizshop/v1/product/recommended/buyer_tenant' : 'recommended/v2/buyer_tenant';
		let url = `/${new_url}/${new_id}/product/${id}?limit=10&type=related-products`;
		if (catalog_ids?.length > 0 && catalog_ids[0] !== '') {
			url = `${url}&catalog_ids=${encodeURIComponent(catalog_ids[0])}`;
		}
		return utils.request({
			url,
			method: 'GET',
			data: {},
			// mock_id: MOCK_IDS.simillar_products,
			// mock: true,
		});
	},
	get_all_related_products: (buyer_id: string, id: string, catalog_ids: string[] = [], is_logged_in: boolean) => {
		let new_id = is_pre_login_allowed && !is_logged_in ? prelogin_buyer_tenant_id : buyer_id;
		let new_url = is_pre_login_allowed ? 'wizshop/v1/product/recommended/buyer_tenant' : 'recommended/v2/buyer_tenant';
		let url = `/${new_url}/${new_id}/product/${id}?type=related-products`;
		if (catalog_ids?.length > 0 && catalog_ids[0] !== '') {
			url = `${url}&catalog_ids=${encodeURIComponent(catalog_ids[0])}`;
		}
		return utils.request({
			url,
			method: 'GET',
			data: {},
		});
	},

	get_simillar_products: (buyer_id: string, id: string, catalog_ids: string[] = [], is_logged_in: boolean) => {
		let new_id = is_pre_login_allowed && !is_logged_in ? prelogin_buyer_tenant_id : buyer_id;
		let new_url = is_pre_login_allowed ? 'wizshop/v1/product/recommended/buyer_tenant' : 'recommended/v2/buyer_tenant';
		let url = `/${new_url}/${new_id}/product/${id}?limit=10&type=similar-products`;
		if (catalog_ids?.length > 0 && catalog_ids[0] !== '') {
			url = `${url}&catalog_ids=${encodeURIComponent(catalog_ids[0])}`;
		}
		return utils.request({
			url,
			method: 'GET',
			data: {},
			// mock_id: MOCK_IDS.simillar_products,
			// mock: true,
		});
	},
	get_previous_ordered_product: (id: string, catalog_ids: string[] = [], limit: number = -1) => {
		let url = `/recommended/v2/buyer_tenant/${id}/product/`;
		if (limit > 0) {
			url = `${url}?limit=${limit}&type=previously-ordered-products`;
		} else {
			url = `${url}?type=previously-ordered-products`;
		}
		if (catalog_ids?.length > 0 && catalog_ids[0] !== '') {
			url = `${url}&catalog_ids=${encodeURIComponent(catalog_ids[0])}`;
		}
		return utils.request({
			url,
			method: 'GET',
			data: {},
			// mock_id: MOCK_IDS.simillar_products,
			// mock: true,
		});
	},
	get_variants_product: (payload: any) => {
		return utils.request({
			url: is_pre_login_allowed ? 'wizshop/v1/product/search' : '/entity/v2/product/search',
			method: 'POST',
			data: payload,
		});
	},
	get_filters: () => {
		return utils.request({
			url: '/filter/v1/',
			method: 'GET',
			data: {},
		});
	},

	get_products_by_config: (config: any, page: number, page_size: number, buyer_id: string, catalog_ids: string[] = []) => {
		let url = `/rail/v2/custom?page_number=${page}&page_size=${page_size}&buyer_tenant_id=${buyer_id}`;
		if (catalog_ids?.length > 0 && catalog_ids[0] !== '') {
			url = `${url}&catalog_ids=${encodeURIComponent(catalog_ids[0])}`;
		}
		return utils.request({
			url,
			method: 'POST',
			data: config,
		});
	},

	get_price_lists: () => {
		return utils.request({
			url: '/entity/v2/product/price_list',
			method: 'GET',
		});
	},
	get_product_modifier: (params: any) => {
		return utils.request({
			url: '/modifier/v1/detail',
			method: 'GET',
			params,
		});
	},
	get_analytics_rail: (id: any) => {
		return utils.request({
			url: `analytics/v1/dashboard/${id}/abandon-cart/`,
			method: 'GET',
		});
	},
};
