import utils from '../utils';

const wiz_ai = {
	get_list: (): any => {
		return utils.request({
			url: 'analytics/v1/views/',
			method: 'GET',
		});
	},
	get_activity_history: (buyer_id: string): any => {
		return utils.request({
			url: `buyer/v2/buyer-activity/${buyer_id}`,
			method: 'GET',
		});
	},
	get_insight_config: (): any => {
		return utils.request({
			url: 'analytics/v1/dashboard/config?type=buyer_dashboard',
			method: 'GET',
		});
	},
	get_latest_version: (): any => {
		return utils.request({
			url: 'analytics/v1/views/latest-version',
			method: 'GET',
		});
	},
	create_view: (data: any): any => {
		return utils.request({
			url: 'analytics/v1/views/',
			method: 'POST',
			data,
		});
	},
	update_view: (data: any, id: string): any => {
		return utils.request({
			url: `analytics/v1/views/${id}`,
			method: 'PATCH',
			data,
		});
	},

	update_view_version: (id: string): any => {
		return utils.request({
			url: `analytics/v1/views/${id}/update-version`,
			method: 'PATCH',
		});
	},
	update_buyer_activity: (data: any): any => {
		return utils.request({
			url: '/buyer/v2/buyer-activity/',
			method: 'POST',
			data,
		});
	},
	delete_buyer_activity: (buyer_id: any): any => {
		return utils.request({
			url: `buyer/v2/buyer-activity/${buyer_id}/archive`,
			method: 'DELETE',
		});
	},
	delete_view: (id: string): any => {
		return utils.request({
			url: `analytics/v1/views/${id}`,
			method: 'DELETE',
		});
	},
	view_config: (id: string): any => {
		return utils.request({
			url: `analytics/v1/views/${id}/config`,
			method: 'GET',
		});
	},
	get_view_data: (id: string, data: any): any => {
		return utils.request({
			url: `analytics/v2/views/${id}`,
			method: 'POST',
			data,
		});
	},
	update_view_accessed: (id: string): any => {
		return utils.request({
			url: `analytics/v1/views/${id}/mark-last-accessed`,
			method: 'GET',
		});
	},
	get_buyer_dashboard: (id: string): any => {
		return utils.request({
			url: `analytics/v1/dashboard/${id}`,
			method: 'GET',
		});
	},
	export_insight: (view_id: any): any => {
		return utils.request({
			url: `analytics/v2/views/${view_id}/export`,
			method: 'GET',
		});
	},
};

export default wiz_ai;
