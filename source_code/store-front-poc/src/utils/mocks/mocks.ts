import { response } from './AddUserFormMock';
import { listing_config_mock } from './listing_page_configuration';
import { response as user_list_response } from './usersList';
import { response as mock_product_listing } from './mock_product_listing';
import { response as mock_card_template } from './mock_card_template';
import { response as cart_response } from './cart';
import { col_response as collection_list_response, cat_response as category_list_response, wiz_ai_data_mock } from './collection';
import { response as mock_recommended_products } from './mock_recommended_products';
import { response as mock_previous_ordered } from './mock_previous_ordered';
import { response as mock_variants } from './mock_variants';
import { pdp_response, pdp_config_response } from './collection';
import { response as mock_simillar } from './mock_simillar_prdoucts';
import { response as mock_document } from './mock_document_details';
import { permissions } from './mock_permissions';
import { response as mock_edit_catalog } from './mock_edit_catalog';
import { response as mock_create_catalog } from './mock_create_catalog';
import { response as mock_manage } from './mock_manage';
import { response as mock_buyer } from './mock_buyer';
import { response_options, response_columns, response_product_columns, response_product_datasource } from './catalog';

export const MOCK_IDS = {
	add_user_form: 'add_user_form',
	user_list: 'user_list',
	listing_page_config: 'listing_page_config',
	product_listing: 'product_listing',
	card_template: 'card_template',
	cart: 'cart',
	category_list: 'category_list',
	collection_list: 'collection_list',
	pdp_details: 'pdp_details',
	pdp_config: 'pdp_config_response',
	recommended_products: 'recommended_products',
	prev_order_products: 'prev_order_products',
	product_variants: 'product_variants',
	simillar_products: 'simillar_products',
	get_document: 'get_document',
	get_permissions: 'get_pedrmissions',
	mock_edit_catalog: 'mock_edit_catalog',
	mock_create_catalog: 'mock_create_catalog',
	catalog_data_source: 'catalog_data_source',
	catalog_columns: 'catalog_columns',
	product_columns: 'product_columns',
	product_datasource: 'product_datasource',
	options: 'options',
	manage_response: 'manage_response',
	mock_buyer: 'mock_buyer',
	wiz_ai_data_mock: 'wiz_ai_data_mock',
};

const mocks = {
	[MOCK_IDS.add_user_form]: response,
	[MOCK_IDS.user_list]: user_list_response,
	[MOCK_IDS.listing_page_config]: listing_config_mock,
	[MOCK_IDS.product_listing]: mock_product_listing,
	[MOCK_IDS.card_template]: mock_card_template,
	[MOCK_IDS.cart]: cart_response,
	[MOCK_IDS.category_list]: category_list_response,
	[MOCK_IDS.collection_list]: collection_list_response,
	[MOCK_IDS.pdp_details]: pdp_response,
	[MOCK_IDS.pdp_config]: pdp_config_response,
	[MOCK_IDS.recommended_products]: mock_recommended_products,
	[MOCK_IDS.prev_order_products]: mock_previous_ordered,
	[MOCK_IDS.product_variants]: mock_variants,
	[MOCK_IDS.simillar_products]: mock_simillar,
	[MOCK_IDS.get_document]: mock_document,
	[MOCK_IDS.get_permissions]: permissions,
	[MOCK_IDS.mock_edit_catalog]: mock_edit_catalog,
	[MOCK_IDS.mock_create_catalog]: mock_create_catalog,
	[MOCK_IDS.catalog_columns]: response_columns,
	[MOCK_IDS.product_columns]: response_product_columns,
	[MOCK_IDS.product_datasource]: response_product_datasource,
	[MOCK_IDS.options]: response_options,
	[MOCK_IDS.manage_response]: mock_manage,
	[MOCK_IDS.mock_buyer]: mock_buyer,
	[MOCK_IDS.wiz_ai_data_mock]: wiz_ai_data_mock,
};

export default mocks;
