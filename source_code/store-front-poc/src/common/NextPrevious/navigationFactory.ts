import { NavigationType } from './navigationType';

const filterNavigationHandler = (url: String, queryParams: URLSearchParams) => {
	const params = ['search', 'sort', 'referer_value', 'referer_type'];
	let newUrl = url;
	newUrl = newUrl.includes('?') ? `${newUrl}&` : `${newUrl}?`;
	params.forEach((param) => {
		if (queryParams.has(param)) {
			newUrl += `${param}=${queryParams.get(param)}&`;
		}
	});
	queryParams.forEach((value, key) => {
		if (key.startsWith('filter') || key.startsWith('range_filters')) {
			newUrl += `${key}=${value}&`;
		}
	});
	return newUrl.slice(0, -1);
};

const defaultNavigationHandler = (url: String, referer_value: String, referer_type: NavigationType) => {
	if (url.includes('?')) {
		return `${url}&referer_value=${referer_value}&referer_type=${referer_type}`;
	}
	return `${url}?referer_value=${referer_value}&referer_type=${referer_type}`;
};

export const navigationFactory = (type: NavigationType) => {
	switch (type) {
		case NavigationType.Filters:
			return filterNavigationHandler;
		case NavigationType.RecommendedProducts:
		case NavigationType.SimilarProducts:
		case NavigationType.Cart:
			return defaultNavigationHandler;
		default:
			throw new Error(`Unsupported navigation type: ${type}`);
	}
};
