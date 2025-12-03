export const INCREMENTAL_SYNC_COLUMN_DEF = [
	{
		field: 'created_at',
		headerName: 'Timestamp',
		flex: 1,
		dtype: 'date',
		format: 'MM/DD/YYYY [at] HH:mm A',
		editable: false,
		clickable: false,
		minWidth: 200,
		width: 200,
		isVisible: true,
		hideFilter: true,
		cellStyle: {
			minWidth: 200,
		},
	},
	{
		field: 'sync_type',
		headerName: 'Sync Type',
		flex: 2,
		dtype: 'tags',
		editable: false,
		clickable: false,
		minWidth: 300,
		width: 300,
		isVisible: true,
		hideFilter: true,
		cellStyle: {
			minWidth: 300,
		},
		valueFormatter: (params: any) => {
			return params?.value === 'integration_pull' ? 'Pull' : 'Push';
		},
	},
	{
		field: 'task_status',
		headerName: 'Status',
		flex: 1,
		dtype: 'status',
		editable: false,
		clickable: false,
		minWidth: 200,
		width: 200,
		isVisible: true,
		hideFilter: true,
		cellStyle: {
			minWidth: 200,
		},
	},
];

export const INCREMENTAL_SYNC_SETTINGS_KEYS = {
	MANUAL_PULL_ENABLED: 'manual_pull_enabled',
	MANUAL_PUSH_ENABLED: 'manual_push_enabled',
	INTEGRATION_TYPE: 'integration_type',
};

export const STARTED_INCREMENTAL_SYNC_TASK_STATUSES = ['in-progress', 'started'];
