import { MOCK_IDS } from '../mocks/mocks';
import utils from '../utils';

const catalogs = {
	get_catalog_options: () => {
		return utils.request({
			url: 'entity/v2/ssrm/catalog/options',
			method: 'POST',
			mock_id: MOCK_IDS.options,
			mock: true,
		});
	},
	get_all_catalogs: () => {
		return utils.request({
			url: 'catalog/v1/list',
			method: 'GET',
		});
	},
	get_products_columns: () => {
		return utils.request({
			url: 'catalog/v1/ssrm/config',
			method: 'GET',
		});
	},
	get_product_data_sources: (data: any, catalog_id: any) => {
		return utils.request({
			url: `/catalog/v1/ssrm/search/${catalog_id}`,
			method: 'POST',
			data,
		});
	},
	get_create_catalog_form: () => {
		return utils.request({
			url: 'catalog/v1/form',
			method: 'GET',
			data: {},
		});
	},
	get_edit_catalog_form: (id: string) => {
		return utils.request({
			url: `catalog/v1/details/${id}`,
			method: 'GET',
			data: {},
		});
	},
	post_create_catalog: (data: any) => {
		return utils.request({
			url: 'catalog/v1/create',
			method: 'POST',
			data: { ...data },
		});
	},
	patch_edit_catalog: (data: any, id: string) => {
		return utils.request({
			url: `catalog/v1/${id}`,
			method: 'PATCH',
			data: { ...data },
		});
	},
	delete_catalog: (id: string) => {
		return utils.request({
			url: `catalog/v1/${id}`,
			method: 'DELETE',
		});
	},
	get_catalog_list: (buyer_tenant_id: string = '') => {
		let url = 'entity/v2/product/catalog_list';
		if (buyer_tenant_id !== '') {
			url = `${url}?buyer_tenant_id=${buyer_tenant_id}`;
		}
		return utils.request({
			url,
			method: 'GET',
		});
	},
};

export default catalogs;
