// import { MOCK_IDS } from '../mocks/mocks';
import utils from '../utils';

export interface SSRMFilterModel {
	values?: string[];
	filterType: string;
	customType?: string;
	filter: string | number;
	filterTo: string | number | null;
	type: string;
}

export interface SSRMSortModel {
	colId: string;
	sort: string;
}

export interface SSRMSortModelDict {
	[key: string]: SSRMSortModel;
}

export interface SSRMFilterModelDict {
	[key: string]: SSRMFilterModel;
}

export interface SSRMInput {
	startRow: number;
	endRow: number;
	sortModel: SSRMSortModel[];
	filterModel: SSRMFilterModelDict;
}

const order_listing = {
	get_document_config: (params?: any, signal?: any) => {
		let new_url = 'document/v2/ssrm/config';
		if (params) {
			new_url = `${new_url}${params}`;
		}
		return utils.request({
			url: new_url,
			method: 'GET',
			response_array: true,
			mock: false,
			signal,
		});
	},
	get_document_list: (data: SSRMInput, signal?: any) => {
		return utils.request({
			url: 'document/v2/ssrm/search',
			method: 'POST',
			data,
			response_array: true,
			mock: false,
			signal,
		});
	},
	get_document_details_mobile: (data: any) => {
		return utils.request({
			url: 'document/v2/s/search',
			method: 'POST',
			data,
		});
	},
	get_invoice: (id: any) => {
		return utils.request({
			url: `invoice/v1/${id}/pdf`,
			method: 'GET',
		});
	},
	get_abandoned_cart: () => {
		return utils.request({
			url: '/cart/v3/abandoned_cart/config',
			method: 'GET',
			// mock: true,
			// mock_id: MOCK_IDS.mock_abandoned_cart,
		});
	},
	get_abandoned_cart_row_data: (payload: any) => {
		return utils.request({
			url: '/cart/v3/abandoned_cart/search',
			method: 'POST',
			data: payload,
			// mock: true,
			// mock_id: MOCK_IDS.mock_abandoned_cart_data,
		});
	},
	update_abandoned_cart_data: (payload: any) => {
		return utils.request({
			url: '/cart/v3/update_abandoned_cart',
			method: 'PUT',
			data: payload,
			// mock: true,
			// mock_id: MOCK_IDS.mock_abandoned_cart_data,
		});
	},
	add_abandoned_cart: (data: any) => {
		return utils.request({
			url: 'cart/v3/add_all_to_cart',
			method: 'POST',
			data,
		});
	},
};

export default order_listing;
