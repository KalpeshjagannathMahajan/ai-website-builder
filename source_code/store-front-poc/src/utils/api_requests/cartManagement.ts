import utils from '../utils';
import { MOCK_IDS } from '../mocks/mocks';
import constants from '../constants';
import { ModifyPricePayload } from 'src/@types/edit_product_price';

const cart_management = {
	get_cart: ({ buyer_id, is_guest_buyer }: any) => {
		return utils.request({
			url: 'cart/v3/',
			method: 'POST',
			data: {
				buyer_id,
				is_guest_buyer,
			},
			mock: false,
		});
	},

	attach_cart_to_buyer: ({ buyer_id, cart_id }: any) => {
		return utils.request({
			url: 'cart/v3/attach/buyer',
			method: 'POST',
			data: {
				buyer_id,
				cart_id,
			},
			show_error: false,
		});
	},

	get_cart_details: (data: any, show_error = true) => {
		return utils.request({
			url: 'cart/v3/detail',
			method: 'POST',
			data,
			show_error,
		});
	},

	clear_cart: ({ cart_id }: any) => {
		return utils.request({
			url: 'cart/v2/',
			method: 'DELETE',
			data: { cart_id },
			mock_id: MOCK_IDS.cart,
			mock: false,
		});
	},

	update_item: (data: any, show_error = true) => {
		return utils.request({
			url: 'cart/v3/item',
			method: 'POST',
			data,
			show_error,
		});
	},
	update_bulk_item: (data: any, show_error = true) => {
		return utils.request({
			url: 'cart/v3/bulk_items',
			method: 'POST',
			data,
			show_error,
		});
	},

	apply_item_discount: (data: any) => {
		return utils.request({
			url: 'cart/v3/item_discount',
			method: 'POST',
			data,
		});
	},

	remove_items: ({ cart_id, product_ids = [], cart_item_ids = [] }: any, show_error = true) => {
		return utils.request({
			url: 'cart/v2/item',
			method: 'DELETE',
			data: {
				cart_id,
				product_ids,
				cart_item_ids,
			},
			show_error,
		});
	},

	add_charge: (data: any) => {
		return utils.request({
			url: 'cart/v2/charge',
			method: 'POST',
			data,
			show_error: false,
		});
	},

	remove_charge: ({ cart_id, charge_id }: any) => {
		return utils.request({
			url: 'cart/v2/charge',
			method: 'DELETE',
			data: {
				cart_id,
				charge_id,
			},
			mock: false,
		});
	},

	add_note: (data: any) => {
		return utils.request({
			url: 'cart/v2/note',
			method: 'POST',
			data,
			show_error: false,
		});
	},

	remove_note: (data: any) => {
		return utils.request({
			url: 'cart/v2/note',
			method: 'DELETE',
			data,
			show_error: false,
		});
	},

	download_cart: (data: any) => {
		return utils.request({
			url: 'cart/v2/download',
			method: 'POST',
			data,
			mock: false,
		});
	},

	get_cart_checkout_config: (document_type: string) => {
		let url = '	document/v3/document_review_page_cart_summary';
		if (document_type) {
			url += `?document_type=${document_type}`;
		}

		return utils.request({
			url,
			method: 'GET',
			mock: false,
		});
	},

	create_document: (type: string, data: any) => {
		return utils.request({
			url: `document/v3/${type}`,
			method: 'POST',
			data,
			show_error: false,
		});
	},
	update_document: (data: any, show_error = true) => {
		return utils.request({
			url: 'document/v3/cart',
			method: 'POST',
			data,
			show_error,
		});
	},
	get_cart_tear_sheet: (
		tenant_id: any,
		cart_id: any,
		catalog_ids: any,
		show_price = false,
		template_db_id = '',
		reference_user_id = '',
	) => {
		let url = '/cart/v3/tear_sheet/pdf';
		const payload = {
			buyer_tenant_id: tenant_id,
			cart_id,
			catalog_ids,
			show_price,
			template_db_id,
			reference_user_id,
		};
		// if (catalog_ids?.[0] !== '') {
		// 	url = `${url}&catalog_ids=${catalog_ids}`;
		// }
		// if (tenant_id) {
		// 	url = `${url}&buyer_tenant_id=${tenant_id}`;
		// }
		return utils.request({
			url,
			method: 'POST',
			data: payload,
			show_error: false,
		});
	},
	get_cart_tear_sheet_v2: (
		tenant_id: any,
		cart_id: any,
		catalog_ids: any,
		show_price = false,
		template_db_id = '',
		reference_user_id = '',
	) => {
		let url = '/cart/v2/tear_sheet/pdf';
		const payload = {
			buyer_tenant_id: tenant_id,
			cart_id,
			catalog_ids,
			show_price,
			template_db_id,
			reference_user_id,
		};
		// if (catalog_ids?.[0] !== '') {
		// 	url = `${url}&catalog_ids=${catalog_ids}`;
		// }
		// if (tenant_id) {
		// 	url = `${url}&buyer_tenant_id=${tenant_id}`;
		// }
		return utils.request({
			url,
			method: 'POST',
			data: payload,
			show_error: false,
		});
	},
	// get_cart_tear_sheet_v2: (tenant_id: any, cart_id: any, catalog_ids: any, show_price = false, template_db_id = '') => {
	// 	let url = '/cart/v2/tear_sheet/pdf';
	// 	const payload = {
	// 		buyer_tenant_id: tenant_id,
	// 		cart_id,
	// 		catalog_ids,
	// 		show_price,
	// 		template_db_id,
	// 	};
	// if (catalog_ids?.[0] !== '') {
	// 	url = `${url}&catalog_ids=${catalog_ids}`;
	// }
	// if (tenant_id) {
	// 	url = `${url}&buyer_tenant_id=${tenant_id}`;
	// }
	// 	return utils.request({
	// 		url,
	// 		method: 'POST',
	// 		data: payload,
	// 		show_error: false,
	// 	});
	// },
	post_attach_catalog: (cart_id: string, catalog_ids: string[]) => {
		return utils.request({
			url: 'cart/v3/attach/catalog',
			method: 'POST',
			data: { cart_id, catalog_ids },
		});
	},
	get_multiple_tearsheets: () => {
		return utils.request({
			url: 'pdf/v1/templates/cart',
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
	post_calculate_container_occupancy: (data: any) => {
		return utils.request({
			url: '/cart/v3/calculate',
			method: 'POST',
			data,
		});
	},

	post_cart_container_update: (data: any) => {
		return utils.request({
			url: '/cart/v3/container',
			method: 'POST',
			data,
		});
	},

	modify_cart_item_price: (data: ModifyPricePayload) => {
		return utils.request({
			url: '/cart/v3/modify_item_price',
			method: 'POST',
			data,
		});
	},

	bulk_update_cart_initial_price: (data: any) => {
		return utils.request({
			url: '/cart/v3/bulk_update_initial_price',
			method: 'POST',
			data,
		});
	},
	resync_cart: (cart_id: string) => {
		return utils.request({
			url: `/cart/v3/resync_cart/${cart_id}`,
			method: 'POST',
		});
	},
	remove_discount: (cart_item_id: string) => {
		return utils.request({
			url: `/cart/v3/discard_discount/${cart_item_id}`,
			method: 'POST',
		});
	},
};

export const get_price_list = (): Promise<any> => {
	return utils.request({ method: 'GET', url: constants.GET_PRICE_LEVEL_LIST });
};

export default cart_management;
