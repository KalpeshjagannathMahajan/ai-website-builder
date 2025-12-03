export const WishlistType = {
	SELF: 'self',
	BUYER: 'buyer',
};

export const WISHLIST_DATE_FORMAT = 'MM/DD/YYYY';

export const wishlist_details_menu_type = {
	CREATE_CATALOG: 'Create catalog',
	RENAME: 'Rename',
	DELETE: 'Delete',
};

export const wishlist_sort: any = [
	{
		label: 'Recent: New to Old',
		is_default: true,
		key: {
			field: 'created_at',
			order: 'desc',
		},
	},
	{
		label: 'Recent: Old to New',
		key: {
			field: 'created_at',
			order: 'asc',
		},
	},
	{
		label: 'A to Z',
		key: {
			field: 'name',
			order: 'asc',
		},
	},
	{
		label: 'Z to A',
		key: {
			field: 'name',
			order: 'desc',
		},
	},
];

export const wishlist_source = {
	SALES_REP: 'sales_rep',
	WIZSHOP: 'wizshop',
	BUYER_WIZSHOP: 'buyer_wizshop',
	BUYER_SALES_REP: 'buyer_sales_rep',
	BUYER: 'buyer',
};
