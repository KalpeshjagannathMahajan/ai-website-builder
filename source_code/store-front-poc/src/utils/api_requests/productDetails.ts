import constants from '../constants';
import { MOCK_IDS } from '../mocks/mocks';
import utils from '../utils';

const wizshop_settings: any = localStorage.getItem('wizshop_settings');
const pre_login_settings = JSON.parse(wizshop_settings);
const is_pre_login_allowed = pre_login_settings?.prelogin_allowed || false;

const product_details = {
	get_pdp_details: (id: string, buyer_id: string, catalog_ids: string[] = [], is_pre_login: boolean = false) => {
		let url = is_pre_login ? '/wizshop/v1/product/detail' : '/entity/v2/product/detail';
		// if (buyer_id) {
		// 	url = `${url}buyer_tenant_id=${buyer_id}`;
		// }
		// if (price_level_id) {
		// 	url = `${url}&price_level_id=${price_level_id}`;
		// }
		// if (catalog_ids?.length > 0 && catalog_ids[0] !== '') {
		// 	url = `${url}&catalog_ids=${encodeURIComponent(catalog_ids[0])}`;
		// }
		return utils.request({
			url,
			method: 'POST',
			data: {
				product_id: id,
				buyer_tenant_id: buyer_id,
				catalog_ids,
			},
		});
	},

	get_pdp_config: () => {
		return utils.request({
			url: is_pre_login_allowed ? '/wizshop/v1/configuration/pdp_page_config_web' : '/setting/v1/configuration/pdp_page_config_web',
			method: 'GET',
			mock: false,
			mock_id: MOCK_IDS.pdp_config,
		});
	},
	get_discount_campaign: (camapaign_type: string) => {
		return utils.request({
			url: `/discount_campaign/v1/rules/${camapaign_type}`,
			method: 'GET',
		});
	},
	get_discount_campaign_for_buyer: (buyer_id: string) => {
		return utils.request({
			url: `/discount_campaign/v1/cart/rules/${buyer_id}`,
			method: 'GET',
		});
	},
	get_product_tear_sheet: (tenant_id: any, product_id: any, price_level_id: any, show_price = false) => {
		let url = `/entity/v2/product/${product_id}/tear_sheet/pdf?show_price=${show_price}`;
		if (price_level_id) {
			url = `${url}&price_level_id=${price_level_id}`;
		}
		if (tenant_id) {
			url = `${url}&buyer_tenant_id=${tenant_id}`;
		}
		return utils.request({
			url,
			method: 'GET',
		});
	},

	post_product_tear_sheet_v2: (
		product_id: string,
		buyer_tenant_id: string,
		catalog_ids: string[] = [],
		show_price: boolean,
		template_db_id: string,
	) => {
		return utils.request({
			url: 'entity/v2/product/tear_sheet/pdf',
			method: 'POST',
			data: {
				product_id,
				buyer_tenant_id,
				catalog_ids,
				show_price,
				template_db_id,
			},
		});
	},
	post_product_tear_sheet_v3: (
		product_id: string,
		buyer_tenant_id: string,
		catalog_ids: string[] = [],
		show_price: boolean,
		template_db_id: string,
	) => {
		return utils.request({
			url: 'entity/v3/product/tear_sheet/pdf',
			method: 'POST',
			data: {
				product_id,
				buyer_tenant_id,
				catalog_ids,
				show_price,
				template_db_id,
			},
		});
	},
	get_multiple_tearsheets: () => {
		return utils.request({
			url: 'pdf/v1/templates/tear-sheet',
			method: 'GET',
		});
	},
	get_tearsheet_preview: (tenant_id: string, cart_id: string, catalog_ids: any, show_price = false, template_db_id = '') => {
		const payload = {
			buyer_tenant_id: tenant_id,
			cart_id,
			catalog_ids,
			show_price,
			template_db_id,
			is_preview: true,
		};
		return utils.request({
			url: 'cart/v2/tear_sheet/pdf',
			method: 'POST',
			data: payload,
		});
	},

	delete_product: (data: any) => {
		return utils.request({
			url: 'entity/v3/product/delete_product',
			method: 'POST',
			data,
		});
	},
};

export const get_price_list = (): Promise<any> => {
	return utils.request({ method: 'GET', url: constants.GET_PRICE_LEVEL_LIST });
};

export default product_details;
