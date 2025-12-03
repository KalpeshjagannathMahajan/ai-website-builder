import _ from 'lodash';
import { background_colors } from './light.theme';

type ImageDimensions = {
	width?: number;
	height?: number;
	background?: string;
	fit?: string;
};
type ImageType =
	| 'PRODUCT_CARD'
	| 'PDP'
	| 'PDP_THUMBNAIL'
	| 'PDP_ZOOM'
	| 'VARIANT_HINGE'
	| 'SIMILAR_CARD'
	| 'SIMILAR_DRAWER_CARD'
	| 'FBT'
	| 'RECOMMENDED_RAIL_CARD'
	| 'CATEGORY_RAIL'
	| 'CATEGORY_CARD'
	| 'CATEGORY_FILTER'
	| 'COLLECTIONS_RAIL'
	| 'COLLECTIONS_CARD'
	| 'PREVIOUSLY_ORDERED_RAILS'
	| 'VARIANT_DRAWER'
	| 'CART_SUMMARY_PAGE'
	| 'LABEL'
	| 'LABEL_EXPANDED'
	| 'CATALOG_MANAGER'
	| 'CATALOG_MANAGER_EXPANDED'
	| 'ORDER_END'
	| 'TEAR_SHEET'
	| 'TOAST';

const IMAGE_DIMENSIONS: Record<ImageType, ImageDimensions> = {
	TOAST: {
		width: 30,
		height: 32,
		background: 'white',
		fit: 'contain',
	},
	PRODUCT_CARD: {
		width: 280,
		height: 250,
		background: 'white',
		fit: 'contain',
	},
	PDP: {
		width: 730,
		height: 550,
		background: 'white',
		fit: 'contain',
	},
	PDP_THUMBNAIL: {
		width: 160,
		height: 160,
		background: 'white',
		fit: 'contain',
	},
	PDP_ZOOM: {
		width: 2200,
		height: 1650,
		background: 'white',
		fit: 'contain',
	},
	VARIANT_HINGE: {
		width: 78,
		height: 78,
		background: 'white',
		fit: 'contain',
	},
	SIMILAR_CARD: {
		width: 277,
		height: 250,
		background: 'white',
		fit: 'contain',
	},
	SIMILAR_DRAWER_CARD: {
		width: 184,
		height: 164,
		background: 'white',
		fit: 'contain',
	},
	FBT: {
		width: 277,
		height: 250,
		background: 'white',
		fit: 'contain',
	},
	RECOMMENDED_RAIL_CARD: {
		width: 184,
		height: 164,
		background: 'white',
		fit: 'contain',
	},
	CATEGORY_RAIL: {
		width: 200,
		height: 182,
		background: 'white',
		fit: 'contain',
	},
	CATEGORY_CARD: {
		width: 250,
		height: 250,
		background: 'white',
		fit: 'contain',
	},
	COLLECTIONS_RAIL: {
		width: 340,
		height: 200,
		background: 'white',
		fit: 'contain',
	},
	COLLECTIONS_CARD: {
		width: 340,
		height: 200,
		background: 'white',
		fit: 'contain',
	},
	CATEGORY_FILTER: {
		width: 60,
		height: 60,
		background: 'white',
		fit: 'contain',
	},
	PREVIOUSLY_ORDERED_RAILS: {
		width: 216,
		height: 225,
		background: 'white',
		fit: 'contain',
	},
	VARIANT_DRAWER: {
		width: 75,
		height: 75,
		background: 'white',
		fit: 'contain',
	},
	CART_SUMMARY_PAGE: {
		width: 87,
		height: 87,
		background: 'white',
		fit: 'contain',
	},
	LABEL: {
		width: 40,
		height: 40,
		background: 'white',
		fit: 'contain',
	},
	LABEL_EXPANDED: {
		width: 500,
		height: 500,
		background: 'white',
		fit: 'contain',
	},
	CATALOG_MANAGER: {
		width: 40,
		height: 40,
		background: 'white',
		fit: 'contain',
	},
	CATALOG_MANAGER_EXPANDED: {
		width: 500,
		height: 500,
		background: 'white',
		fit: 'contain',
	},
	ORDER_END: {
		width: 90,
		height: 85,
		background: 'white',
		fit: 'contain',
	},
	TEAR_SHEET: {
		width: 85,
		height: 105,
		background: `${background_colors.alice_blue}`,
		fit: 'contain',
	},
};

// const { VITE_APP_API_URL } = import.meta.env;
// const IMAGE_URL = `${VITE_APP_API_URL}/artifact/v1/file/`;

// const isUUID = (str = '') => {
// 	const regex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
// 	return regex.test(str);
// };

// export const SRC = (id: any, url: any, type: ImageType): string => {
// 	const DEFAULT_DIMENSIONS = IMAGE_DIMENSIONS.PDP;
// 	const dimensions = IMAGE_DIMENSIONS[type] || DEFAULT_DIMENSIONS;
// 	const {
// 		width = DEFAULT_DIMENSIONS.width,
// 		height = DEFAULT_DIMENSIONS.height,
// 		fit = DEFAULT_DIMENSIONS.fit,
// 		background = DEFAULT_DIMENSIONS.background,
// 	} = dimensions;
// 	return isUUID(id) ? `${IMAGE_URL}${id}?width=${width}&height=${height}&fit=${fit}&background_color=${background}` : url ?? '';
// };

export const transform_image_url = (url: string, type: ImageType) => {
	const DEFAULT_DIMENSIONS = IMAGE_DIMENSIONS.PDP;
	const dimensions = IMAGE_DIMENSIONS[type] || DEFAULT_DIMENSIONS;
	const {
		width = DEFAULT_DIMENSIONS.width,
		height = DEFAULT_DIMENSIONS.height,
		fit = DEFAULT_DIMENSIONS.fit,
		background = DEFAULT_DIMENSIONS.background,
	} = dimensions;
	if (url && url.includes('sourcerer.tech')) {
		return `${
			_.split(url, '?')[0]
		}?transforms=[["resize",{"width":${width},"height":${height},"fit":"${fit}","background":"${background}"}]]`;
	}
	return url;
};

export const get_product_image = (product: any, type: any) => {
	const image_media = product?.media?.find((_m: any) => _m.type === 'image');
	return transform_image_url(image_media?.url, type);
	// return SRC(image_media?.media_id, image_media?.url, type);
};

export default get_product_image;
