export const default_cart_grouping = {
	enabled: false,
	options: [
		{
			is_default: false,
			value: 'inventory_status',
			label: 'Inventory Status',
			is_active: false,
		},
		{
			is_default: false,
			value: 'inventory_status_with_date',
			label: 'Inventory Status & Arrival Date',
			is_active: false,
		},
		{
			is_default: false,
			value: 'inventory_status_with_month',
			label: 'Inventory Status & Arrival Month',
			is_active: false,
		},
		{
			is_default: false,
			value: 'custom_grouping',
			label: 'Custom Grouping',
			is_active: false,
		},
		{
			is_default: true,
			value: 'none',
			label: 'None',
			is_active: true,
		},
	],
	formatting_settings: {
		date_formats: {
			full: "%d{ordinal} %b'%y",
			month: "%b'%y",
		},
		prefixes: {
			arriving_by: 'Earliest arriving by',
			arriving_in: 'Earliest arriving by',
			no_eta: 'ETA Unknown',
		},
		label_mappings: {
			IN_STOCK: 'In Stock',
			BACKORDER: 'Backorder',
			OUT_OF_STOCK: 'Out of Stock',
		},
	},
};
