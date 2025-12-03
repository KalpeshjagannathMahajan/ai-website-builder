import utils from '../utils';

const inventory = {
	get_inventory_ssrm_config: () => {
		return utils?.request({
			url: '/inventory/v1/ssrm/config',
			method: 'GET',
		});
	},
	get_inventory_post: (data: any) => {
		return utils?.request({
			url: '/inventory/v1/ssrm/search',
			method: 'POST',
			data,
		});
	},
};

export default inventory;
