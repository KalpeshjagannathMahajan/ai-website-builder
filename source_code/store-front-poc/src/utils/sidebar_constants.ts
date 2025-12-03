export function get_firs_path_segment() {
	const path = window.location.pathname;
	const segments = path?.split('/') || [];
	return segments?.[1] || 'Products';
}

export const tabs_clicked_from_page: any = {
	['dashboard']: 'Dashboard',
	['all-products']: 'Products',
	['buyer-library']: 'Customers',
	['order-listing']: 'Sales',
	['cart-summary']: 'Cart Summary',
	['user-management']: 'User Management',
	['metabase-reports']: 'Reports',
	['manage-data']: 'Import - Export',
	labels: 'Labels',
	inventory: 'Inventory',
	['user-drive']: 'Files',
	settings: 'Settings',
};
