import _ from 'lodash';

export const transform_rails_for_app = (config: any) => {
	let updatedConfig = _.cloneDeep(config);
	if (updatedConfig?.rails) {
		updatedConfig.rails.forEach((element: any) => {
			if (element?.type === 'similar_product') {
				element.type = 'similar-products';
			}
			if (element?.type === 'frequently_bought_together') {
				element.type = 'frequently-bought-products';
			}
		});
	}
	return updatedConfig;
};
