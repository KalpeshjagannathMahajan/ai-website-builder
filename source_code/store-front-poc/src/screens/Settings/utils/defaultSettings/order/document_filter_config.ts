export const DOCUMENT_FILTER_CONFIG = {
	filters: [
		{
			name: 'Customer Name',
			priority: 4,
			meta: { type: 'multi_select', index_type: 'multi-select', is_primary: false, key: 'buyer', dtype: 'buyer' },
			entity_id: null,
			entity_name: 'buyer',
		},
		{
			name: 'Document Status',
			priority: 4,
			meta: { type: 'multi_select', index_type: 'multi-select', is_primary: false, key: 'document_status', dtype: 'document_status' },
			entity_id: null,
			entity_name: 'document_status',
		},
		{
			name: 'Sales Rep',
			priority: 4,
			meta: { type: 'multi_select', index_type: 'multi-select', is_primary: false, key: 'sales_rep', dtype: 'email' },
			entity_id: null,
			entity_name: 'sales_rep',
		},
		{
			name: 'Total Value',
			priority: 3,
			meta: { type: 'range', index_type: null, is_primary: false, key: 'total_value', step_increment: 1 },
			entity_id: null,
			entity_name: 'total_value',
		},
		{
			name: 'Date',
			priority: 3,
			meta: { type: 'timestamp', index_type: null, is_primary: false, key: 'created_at', step_increment: 1 },
			entity_id: null,
			entity_name: 'created_at',
		},
	],
	sorting: [
		{ label: 'Recent - New to Old', is_default: false, key: { field: 'created_at', order: 'asc' }, value: 'Recent - New to Old' },
		{ label: 'Recent - Old to New', is_default: false, key: { field: 'created_at', order: 'desc' }, value: 'Recent - Old to New' },
		{ label: 'Order ID - Low to High', is_default: true, key: { field: 'system_id', order: 'asc' }, value: 'Order ID - Low to High' },
		{ label: 'Order ID - High to Low', is_default: false, key: { field: 'system_id', order: 'asc' }, value: 'Order ID - High to Low' },
		{
			label: 'Total Value - Low to High',
			is_default: false,
			key: { field: 'total_value', order: 'asc' },
			value: 'Total Value - Low to High',
		},
		{
			label: 'Total Value - High to Low',
			is_default: false,
			key: { field: 'total_value', order: 'desc' },
			value: 'Total Value - High to Low',
		},
	],
};
