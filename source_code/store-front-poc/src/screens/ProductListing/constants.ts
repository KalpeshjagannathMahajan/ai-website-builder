import styled from '@emotion/styled';

export const scrollCont = {
	overflowX: 'scroll',
	'&::-webkit-scrollbar': {
		display: 'none',
	},
};

export const StyledDivScroll = styled.div`
	width: 100%;
	overflow-y: hidden;
	overflow-x: scroll;
	scrollbar-width: none; /* For Firefox */
	-ms-overflow-style: none; /* For IE and Edge */
	&::-webkit-scrollbar {
		display: none; /* For Chrome, Safari, and Opera */
	}
	display: flex;
	flex-direction: row;
	gap: 20px;
	margin: 0;
	margin-right: 16px;
`;

export const StyledDiv = styled.div`
	width: 100%;
	overflow-y: hidden;
	overflow-x: auto;
	scrollbar-width: none; /* For Firefox */
	-ms-overflow-style: none; /* For IE and Edge */
	&::-webkit-scrollbar {
		display: none; /* For Chrome, Safari, and Opera */
	}
	display: flex;
	flex-direction: row;
	gap: 0.75em;
`;

export const InnerDiv = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	gap: 0.75em;
	margin: 0 auto;
`;

interface MediaItem {
	type: string;
	url: string;
}

interface MetaData {
	category_id: number;
	Level: number;
	category_name: string;
	parent_category_id: number;
	Image_url: string;
}

export interface CardData {
	media: MediaItem[];
	created_at: string;
	meta: MetaData;
	updated_at: string;
	level: number;
	status: string;
	reference_id: string;
	source_id: string;
	children: string;
	path: string;
	tenant_id: string;
	name: string;
	parent_id: string;
	id: string;
	product_count: number;
}

interface MediaItem {
	type: string;
	view_type: string;
	url: string;
}

export interface CardDataCollections {
	priority: number;
	name: string;
	media: MediaItem[] | []; // Since 'media' can be an object or an array of MediaItem
	id: string;
	product_count: number;
}

export const card_template = {
	template_id: 2,
	rows: [
		[
			{
				key: 'name',
				style: {
					fontSize: '14px',
					color: 'rgba(0, 0, 0, 0.87)',
					width: '80%',
				},
			},
		],
		[
			{
				key: 'sku_id',
				style: {
					fontSize: '14px',
					color: 'rgba(0, 0, 0, 0.60)',
					width: '50%',
				},
			},
			{
				key: 'pricing::variant_price_range::final_range',
				style: {
					fontSize: '14px',
					color: 'rgba(0, 0, 0, 0.87)',
					width: '50%',
					fontWeight: '700',
					textAlign: 'end',
				},
			},
		],
	],
	attributes: {
		keys: [
			'custom_attributes::802826a3-b462-4585-b3ea-4b0bd365a781::value',
			'custom_attributes::159f705d-4980-43e1-8b0b-86cbf4ba6f81::value',
			'custom_attributes::35b307d5-1643-40a8-85ce-f09830617d86::value',
			'custom_attributes::5b3fae07-2291-4ff4-ac76-e1c8da3ee267::value',
		],
		style: {
			font_size: 24,
			color: '#fffff',
		},
	},
};

export interface CategoryData {
	id: string;
	name: string;
	parent_id: string;
	meta: any; // You can replace 'any' with a more specific type if you have information about the 'meta' field.
	tenant_id: string;
	reference_id: string;
	source_id: string;
	path: string;
	children: null | CategoryData[]; // Recursive structure for children categories
	level: number;
	media: {
		type: string;
		url: string;
	}[];
	created_at: string;
	updated_at: string;
	status: string;
	product_count: number;
}

export const ChevronAvatar = { width: '4rem', height: '4rem', cursor: 'pointer', transition: '0.2ms ease-in-out' };
export const ALL_PRODUCTS_FILTERS_STORAGE_KEY = 'all_products_filters_url';
export const FILTERS_INITIAL_STATE = { filters: {}, range_filters: {} };
export const PRODUCTS_PER_PAGE = {
	EXPLORE_ALL: 50,
	COLLECTIONS_PAGE: 50,
	CATEGORIES_PAGE: 50,
	WISHLIST_PAGE: 50,
};
export const PAGE_TYPE_MAP = {
	CATEGORY: 'category',
	COLLECTION: 'collection',
};
export const VISIBLE_PAGES_COUNT = 5;
export const FILTER_KEYS = {
	SORT: 'sort',
	FILTERS: 'filters',
	SELECT_FILTER: 'select_filter',
};
export const MAX_HITS_LIMIT = 10000;
