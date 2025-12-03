import utils from '../utils';

const version = {
	get_version: () => {
		return utils.request({
			url: '/version',
			method: 'GET',
			mock: false,
		});
	},
};

export default version;
