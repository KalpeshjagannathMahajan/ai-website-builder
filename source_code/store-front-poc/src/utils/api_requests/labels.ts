import _ from 'lodash';
import utils from '../utils';

const labels = {
	get_temeplates: () => {
		return utils.request({
			url: 'label/v2/template',
			method: 'GET',
		});
	},
	post_Pdf: (data: any) => {
		let _temp = _.cloneDeep(data);
		return utils.request({
			url: 'label/v3/',
			method: 'POST',
			data: _temp,
		});
	},
	get_labels_all_columns: () => {
		return utils.request({
			url: 'entity/v2/ssrm/config/all',
			method: 'GET',
		});
	},
	get_specific_columns: (data: any) => {
		return utils.request({
			url: 'entity/v2/ssrm/config',
			method: 'POST',
			data,
		});
	},
	get_data_sources: (data: any) => {
		return utils.request({
			url: 'entity/v2/ssrm/search',
			method: 'POST',
			data,
		});
	},
};

export default labels;
