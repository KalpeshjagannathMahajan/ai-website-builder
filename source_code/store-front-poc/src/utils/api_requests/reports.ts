import utils from '../utils';

const reports = {
	get_metabse_reports_url: (access_token?: string) => {
		return utils.request({
			url: 'metabase/v1/reports/get',
			method: 'POST',
			headers: {
				Authorization: access_token,
			},
		});
	},
};

export default reports;
