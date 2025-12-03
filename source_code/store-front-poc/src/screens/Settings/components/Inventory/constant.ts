export const INVENTORY_COLUMNS = [
	{
		suppressMenu: true,
		field: 'name',
		headerName: 'Name',
		flex: 1,
		dtype: 'text',
		editable: false,
		hideFilter: true,
	},
	{
		suppressMenu: true,
		field: 'key',
		headerName: 'Alias',
		flex: 1,
		dtype: 'text',
		editable: false,
		hideFilter: true,
	},
	{
		suppressMenu: true,
		field: 'entries',
		headerName: 'Entries',
		flex: 1,
		dtype: 'text',
		editable: false,
		hideFilter: true,
	},
	{
		suppressMenu: true,
		field: 'show',
		headerName: 'Show',
		flex: 1,
		cellRenderer: 'agCheckboxCellRenderer',
		cellEditor: 'agCheckboxCellEditor',
		editable: false,
		disable: true,
	},
];

export const INVENTORY_FORM = [
	{ name: 'Name', id: 'name', type: 'text' },
	{ name: 'Entries', id: 'entries', type: 'number' },
];
