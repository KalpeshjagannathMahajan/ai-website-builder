import utils from '../utils';

const document = {
	get_analytics: (data) => {
		return utils.request({
			url: 'document/v2/s/analytics',
			method: 'POST',
			data,
			mock: false,
		});
	},
	serach_documents: (data) => {
		return utils.request({
			url: 'document/v2/s/search',
			method: 'POST',
			data,
			mock: false,
		});
	},
};

export default document;
