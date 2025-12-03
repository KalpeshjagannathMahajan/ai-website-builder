export const time_range_list = {
	all_time: {
		id: 'all_time',
		data: {
			label: 'All time',
			value: () => {
				return {};
			},
		},
	},
	today: {
		id: 'today',
		data: {
			label: 'Today',
			value: () => {
				return {
					gte: Math.floor(new Date(new Date().setHours(0, 0, 0, 0)).getTime()),
					lte: Math.floor(new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000).getTime()),
				};
			},
		},
	},

	last_week: {
		id: 'last_week',
		data: {
			label: 'Last week',
			// value: () => Math.floor(new Date(new Date() - 7 * 24 * 60 * 60 * 1000).getTime()),
			value: () => {
				return {
					gte: Math.floor(new Date(new Date().setHours(0, 0, 0, 0) - 6 * 24 * 60 * 60 * 1000).getTime()),
					lte: Math.floor(new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000).getTime()),
				};
			},
		},
	},
	last_30_days: {
		id: 'last_30_days',
		data: {
			label: 'Last 30 days',
			// value: () => Math.floor(new Date(new Date() - 30 * 24 * 60 * 60 * 1000).getTime()),
			value: () => {
				return {
					gte: Math.floor(new Date(new Date().setHours(0, 0, 0, 0) - 29 * 24 * 60 * 60 * 1000).getTime()),
					lte: Math.floor(new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000).getTime()),
				};
			},
		},
	},
	last_3_months: {
		id: 'last_3_months',
		data: {
			label: 'Last 3 months',
			// value: () => Math.floor(new Date(new Date() - 3 * 30 * 24 * 60 * 60 * 1000).getTime()), // Unix timestamp of 3 months ago
			value: () => {
				return {
					gte: Math.floor(new Date(new Date().setHours(0, 0, 0, 0) - 89 * 24 * 60 * 60 * 1000).getTime()),
					lte: Math.floor(new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000).getTime()),
				};
			},
		},
	},
	last_6_months: {
		id: 'last_6_months',
		data: {
			label: 'Last 6 months',
			// value: () => Math.floor(new Date(new Date() - 6 * 30 * 24 * 60 * 60 * 1000).getTime()), // Unix timestamp of 6 months ago
			value: () => {
				return {
					gte: Math.floor(new Date(new Date().setHours(0, 0, 0, 0) - 179 * 24 * 60 * 60 * 1000).getTime()),
					lte: Math.floor(new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000).getTime()),
				};
			},
		},
	},
	last_12_months: {
		id: 'last_12_months',
		data: {
			label: 'Last 12 months',
			// value: () => Math.floor(new Date(new Date() - 12 * 30 * 24 * 60 * 60 * 1000).getTime()), // Unix timestamp of 12 months ago
			value: () => {
				return {
					gte: Math.floor(new Date(new Date().setHours(0, 0, 0, 0) - 364 * 24 * 60 * 60 * 1000).getTime()),
					lte: Math.floor(new Date(new Date().setHours(0, 0, 0, 0) + 24 * 60 * 60 * 1000).getTime()),
				};
			},
		},
	},
};

export const sort_type_filters = {
	time_asc: {
		id: 'time_asc',
		data: {
			label: 'Last modified: Old to New',
			value: 'time_asc',
		},
	},
	time_desc: {
		id: 'time_desc',
		data: {
			label: 'Last modified: New to Old',
			value: 'time_desc',
		},
	},
	size_desc: {
		id: 'size_desc',
		data: {
			label: 'Storage Size: High to Low',
			value: 'size_desc',
		},
	},
	size_asc: {
		id: 'size_asc',
		data: {
			label: 'Storage Size: Low to High',
			value: 'size_asc',
		},
	},
	name_asc: {
		id: 'name_asc',
		data: {
			label: 'Name: A to Z',
			value: 'name_asc',
		},
	},
	name_desc: {
		id: 'name_desc',
		data: {
			label: 'Name: Z to A',
			value: 'name_desc',
		},
	},
};

export const columns = [
	{
		headerCheckboxSelection: true,
		checkboxSelection: true,
		width: 70,
		cellStyle: {
			textAlign: 'center',
			width: 100,
			borderRadius: '0px',
			background: 'transparent',
			borderWidth: '0px 0px 0px 1px',
			borderColor: '#ddd4d1',
		},
		suppressSizeToFit: true,
		pinned: 'left',
		menuTabs: [],
	},
	{
		headerName: 'Name',
		field: 'name',
		headerStyle: {},
		cellStyle: {},
		visibility: true,
		dtype: 'text',
		filterValues: [],
		sortable: true,
		editable: false,
		flex: 1,
		menuTabs: [],
	},
	{
		headerName: 'Role',
		field: 'userDesignation',
		headerStyle: {},
		cellStyle: {},
		visibility: true,
		dtype: 'text',
		filterValues: [],
		sortable: true,
		editable: false,
		flex: 1,
		menuTabs: [],
	},
	{
		headerName: 'Email',
		field: 'userEmail',
		headerStyle: {},
		cellStyle: {},
		visibility: true,
		dtype: 'text',
		filterValues: [],
		sortable: true,
		editable: false,
		flex: 1,
		menuTabs: [],
	},
	{
		field: 'grantAccess',
		headerName: 'Access',
		flex: 1,
		cellRenderer: 'agCheckboxCellRenderer',
		cellEditor: 'agCheckboxCellEditor',
		editable: true,
		menuTabs: [],
	},
];
