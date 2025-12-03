import _ from 'lodash';
import store from 'src/store';

export const handle_breadcrumb = () => {
	let is_dashboard = false;
	const breadcrumbData = _.get(store.getState(), 'breadcrumb.breadcrumbs');
	const dashboard_breadcrumb: { id: number; linkTitle: string; link: string }[] | undefined = Array.isArray(breadcrumbData)
		? breadcrumbData
		: [];
	if (Array.isArray(dashboard_breadcrumb) && dashboard_breadcrumb.length > 0) {
		const lastBreadcrumb = dashboard_breadcrumb[dashboard_breadcrumb.length - 1];
		is_dashboard = lastBreadcrumb.linkTitle === 'Dashboard';
	}
	return is_dashboard;
};

export const is_object_empty = (obj: any) => {
	return Object.keys(obj).length === 0;
};
