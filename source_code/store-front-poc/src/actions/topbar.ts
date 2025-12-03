export const updateBreadcrumbs = (new_breadcrumbs: any) => {
	return {
		type: 'UPDATE_BREADCRUMBS',
		payload: new_breadcrumbs,
	};
};
