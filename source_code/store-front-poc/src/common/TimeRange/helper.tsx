export const time_range_list = {
	all_time: {
		id: 'all_time',
		data: {
			label: 'All time',
			value: () => -1,
		},
	},
	today: {
		id: 'today',
		data: {
			label: 'Today',
			// value: () => Math.floor(new Date(new Date() - 24 * 60 * 60 * 1000).getTime()),
			value: () => Math.floor(new Date(new Date().setHours(0, 0, 0, 0)).getTime()),
		},
	},

	last_week: {
		id: 'last_week',
		data: {
			label: 'Last week',
			// value: () => Math.floor(new Date(new Date() - 7 * 24 * 60 * 60 * 1000).getTime()),
			value: () => Math.floor(new Date(new Date().setHours(0, 0, 0, 0) - 6 * 24 * 60 * 60 * 1000).getTime()),
		},
	},
	last_30_days: {
		id: 'last_30_days',
		data: {
			label: 'Last 30 days',
			// value: () => Math.floor(new Date(new Date() - 30 * 24 * 60 * 60 * 1000).getTime()),
			value: () => Math.floor(new Date(new Date().setHours(0, 0, 0, 0) - 29 * 24 * 60 * 60 * 1000).getTime()),
		},
	},
	last_3_months: {
		id: 'last_3_months',
		data: {
			label: 'Last 3 months',
			// value: () => Math.floor(new Date(new Date() - 3 * 30 * 24 * 60 * 60 * 1000).getTime()), // Unix timestamp of 3 months ago
			value: () => Math.floor(new Date(new Date().setHours(0, 0, 0, 0) - 89 * 24 * 60 * 60 * 1000).getTime()), // Unix timestamp of 3 months ago
		},
	},
	last_6_months: {
		id: 'last_6_months',
		data: {
			label: 'Last 6 months',
			// value: () => Math.floor(new Date(new Date() - 6 * 30 * 24 * 60 * 60 * 1000).getTime()), // Unix timestamp of 6 months ago
			value: () => Math.floor(new Date(new Date().setHours(0, 0, 0, 0) - 179 * 24 * 60 * 60 * 1000).getTime()), // Unix timestamp of 6 months ago
		},
	},
	last_12_months: {
		id: 'last_12_months',
		data: {
			label: 'Last 12 months',
			// value: () => Math.floor(new Date(new Date() - 12 * 30 * 24 * 60 * 60 * 1000).getTime()), // Unix timestamp of 12 months ago
			value: () => Math.floor(new Date(new Date().setHours(0, 0, 0, 0) - 364 * 24 * 60 * 60 * 1000).getTime()), // Unix timestamp of 12 months ago
		},
	},
};

export const ALL_TIME_ID = 'all_time';
