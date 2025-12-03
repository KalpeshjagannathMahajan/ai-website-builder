// import FallbackImage from 'src/assets/images/fallback.png';
const ALL_ENV = {
	STAGING: 'staging',
	PRE_PROD: 'pre-prod',
	PRODUCTION: 'production',
};

const { VITE_APP_API_URL, VITE_APP_REPO, VITE_APP_FILE_SERVICE_API_URL } = import.meta.env;
const new_url = VITE_APP_API_URL;

const is_ultron = VITE_APP_REPO === 'ultron';
const WORDPRESS_URL = 'https://wp-g-s.sourcerer.tech';
const FALLBACK_IMAGE = is_ultron
	? 'https://frontend-bucket.vercel.app/images/fallback.png'
	: 'https://frontend-bucket.vercel.app/images/store_front_img_not_found.svg';

const ENDPOINT = new_url;
const POSTMAN_MOCK = 'https://e06f6a5f-4c44-4f2b-b203-94d9469288b5.mock.pstmn.io';
const POSTMAN_ENDPOINT = 'https://528cdc15-33b6-407f-a746-332085f87a93.mock.pstmn.io';

const LOGIN: `${typeof ENDPOINT}/users/v1/login` = `${ENDPOINT}/users/v1/login`;
const START_TRIAL: `${typeof ENDPOINT}/internal_dashboard/v1/tenant/trial-mode-tenant` = `${ENDPOINT}/internal_dashboard/v1/tenant/trial-mode-tenant`;
const SWITCH_TENANT: `${typeof ENDPOINT}/users/v1/switch` = `${ENDPOINT}/users/v1/switch`;
const REFRESH_TOKEN: `${typeof ENDPOINT}/auth/refresh` = `${ENDPOINT}/auth/refresh`;
const VERIFY_TOKEN: `${typeof ENDPOINT}/auth/token/verify/` = `${ENDPOINT}/auth/token/verify/`;
const ENABLE_2FA: `${typeof ENDPOINT}/auth/email/activate/` = `${ENDPOINT}/auth/email/activate/`;
const VALIDATE_2FA: `${typeof ENDPOINT}/auth/email/activate/confirm/` = `${ENDPOINT}/auth/email/activate/confirm/`;
const SET_PASSWORD: `${typeof ENDPOINT}/users/v1/password_reset` = `${ENDPOINT}/users/v1/password_reset`;
const LOGOUT_API: `${typeof ENDPOINT}/auth/logout` = `${ENDPOINT}/auth/logout`;
const RESET_PASSWORD: `${typeof ENDPOINT}/users/v1/password_reset_confirm/` = `${ENDPOINT}/users/v1/password_reset_confirm/`;
const DEACTIVATE_2FA: `${typeof ENDPOINT}/auth/email/deactivate/` = `${ENDPOINT}/auth/email/deactivate/`;
const LOGIN_2FA: `${typeof ENDPOINT}/auth/email/deactivate/` = `${ENDPOINT}/auth/email/deactivate/`;
const BLACKLIST_TOKEN: `${typeof ENDPOINT}/auth/token/blacklist/` = `${ENDPOINT}/auth/token/blacklist/`;
const GET_USER: `${typeof ENDPOINT}/users/v1/me` = `${ENDPOINT}/users/v1/me`;
const GET_WIZSHOP_BUYER_FORM: `${typeof ENDPOINT}/wizshop/v1/configuration/wizshop_create_buyer_form` = `${ENDPOINT}/wizshop/v1/configuration/wizshop_create_buyer_form`;
const GET_CONFIG_SETTINGS: string = 'https://frontend-bucket.vercel.app/config-settings.json';
const GET_WIZSHOP_BUYER_SECTION: `${typeof ENDPOINT}/wizshop/v1/configuration/wizshop_buyer_sections` = `${ENDPOINT}/wizshop/v1/configuration/wizshop_buyer_sections`;
const GET_WIZSHOP_UPLOAD_FILE: `${typeof ENDPOINT}/wizshop/v1/artifact/upload` = `${ENDPOINT}/wizshop/v1/artifact/upload`;
const GET_CART: `${typeof ENDPOINT}/cart/` = `${ENDPOINT}/cart/`;
const GET_ENTITIES: `${typeof ENDPOINT}/cart/entities` = `${ENDPOINT}/cart/entities`;
const CART: `${typeof ENDPOINT}/cart` = `${ENDPOINT}/cart`;
const BULK_GET: `${typeof ENDPOINT}/cart/bulk` = `${ENDPOINT}/cart/bulk`;
const CREATE_QUTATION: `${typeof ENDPOINT}/quotation/create/` = `${ENDPOINT}/quotation/create/`;
const CONFIRM_QUTATION: `${typeof ENDPOINT}/quotation/confirm/` = `${ENDPOINT}/quotation/confirm/`;
const GET_ACCOUNT_LIST: `${typeof ENDPOINT}/settings/account/list` = `${ENDPOINT}/settings/account/list`;
const GET_ACCOUNT_USERS: `${typeof ENDPOINT}/settings/account/details/create/cart` = `${ENDPOINT}/settings/account/details/create/cart`;
const CREATE_ACCOUNT: `${typeof ENDPOINT}/settings/account/add` = `${ENDPOINT}/settings/account/add`;
const SHORT_URL: `${typeof ENDPOINT}/users/v1/wizshop/short_url/` = `${ENDPOINT}/users/v1/wizshop/short_url/`;

const UPDATE_QUICK_SETTINGS: `${typeof ENDPOINT}/settings/` = `${ENDPOINT}/settings/`;
const GET_QUICK_SETTINGS: `${typeof ENDPOINT}/settings` = `${ENDPOINT}/settings`;
const ATTRIBUTE_DATE_FORMAT = "DD MMM' YY";
const GET_PRODUCT_DETAILS: (id: string) => string = (id) => `${ENDPOINT}/pim/entity/${id}`;
const GET_PRODUCTS: (params: string | undefined) => string = (params) => `${ENDPOINT}/pim/entity/search${params ? `?${params}` : ''}`;
const GET_ALL_FILTERS: `${typeof ENDPOINT}/pim/entity/filters` = `${ENDPOINT}/pim/entity/filters`;
const GET_PRODUCT_VARIANTS: (productId: string) => string = (productId) => `${ENDPOINT}/pim/entity/variants/${productId}`;
const GET_PRICE_LEVEL_LIST: `${typeof ENDPOINT}/entity/v1/product/price_list` = `${ENDPOINT}/entity/v1/product/price_list`;
const GET_CREATE_ACCOUNTS_FORM: `${typeof ENDPOINT}/settings/account/details/create/main` = `${ENDPOINT}/settings/account/details/create/main`;
const POST_CREATE_ACCOUNT: `${typeof ENDPOINT}/settings/account/add` = `${ENDPOINT}/settings/account/add`;
const GET_PERMISSIONS: `${typeof ENDPOINT}/users/v2/permission` = `${ENDPOINT}/users/v2/permission`;

const SMART_SEARCH_UPLOAD_IMAGE: `${typeof ENDPOINT}/files/upload` = `${VITE_APP_FILE_SERVICE_API_URL}/files/upload`;

const BUYER_ADDRESS_FIELDS = {
	id: 'id',
	first_name: 'first_name',
	last_name: 'last_name',
	country_code: 'country_code',
	phone: 'phone',
	email: 'email',
	country: 'country',
	state: 'state',
	pincode: 'pincode',
	type: 'type',
	street_address: 'street_address',
	city: 'city',
	default_shipping_address: 'default_shipping_address',
	default_billing_address: 'default_billing_address',
	address_line_2: 'address_line_2',
};

const EXCLUDED_FACETS_LABELS = ['CATEGORY', 'COLLECTIONS', 'INVENTORY STATUS'];

export const STATUS = {
	SUCCESS: 'success',
};

const HYPERLINK_FIELDS = ['company_name', 'action'];
const BUYER_LIST_KEY = 'buyer_list';

const ATTRIBUTE_DISPLAY_CONFIG = {
	HINGE: 'show_hinges',
	CUSTOM: 'show_custom',
	HIDDEN: 'hidden',
};

const FALLBACK_CONFIG_SETTINGS = {
	font_mapping: {
		Satoshi: {
			fontFamily: 'Satoshi',
			subsets: {
				normal: ['https://frontend-bucket.vercel.app/fonts/Satoshi-Regular.otf'],
				regular: ['https://frontend-bucket.vercel.app/fonts/Satoshi-Regular.woff2'],
				medium: ['https://frontend-bucket.vercel.app/fonts/Satoshi-Medium.woff2'],
				bold: ['https://frontend-bucket.vercel.app/fonts/Satoshi-Bold.woff2'],
			},
		},
		Bellefair: {
			fontFamily: 'Bellefair',
			subsets: {
				normal: ['https://frontend-bucket.vercel.app/fonts/Bellefair-Regular.otf'],
				regular: ['https://frontend-bucket.vercel.app/fonts/Bellefair-Regular.woff'],
			},
		},
		Brother1816: {
			fontFamily: 'Brother1816',
			subsets: {
				normal: ['https://frontend-bucket.vercel.app/fonts/Brother1816-Regular.otf'],
				regular: ['https://frontend-bucket.vercel.app/fonts/Brother1816-Regular.woff2'],
				700: [
					'https://frontend-bucket.vercel.app/fonts/Brother1816-Bold.woff2',
					'https://frontend-bucket.vercel.app/fonts/Brother1816-Bold.eot',
					'https://frontend-bucket.vercel.app/fonts/Brother1816-Bold.ttf',
					'https://frontend-bucket.vercel.app/fonts/Brother1816-Bold.woff',
				],
			},
		},
	},
	fonts: {
		primary: 'Brother1816',
		secondary: 'Satoshi',
		tertiary: 'Bellefair',
	},
	fixed_color: (() => {
		const adjustColorBrightness = (color: string, percent: number) => {
			const num = parseInt(color.slice(1), 16);
			const adjust = (component: number) => Math.min(255, Math.max(0, component + percent));
			const r = adjust(num >> 16);
			const g = adjust((num >> 8) & 0x00ff);
			const b = adjust(num & 0x0000ff);
			return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
		};

		const generateColorShades = (color: string) => ({
			lightest: adjustColorBrightness(color, 230),
			lighter: adjustColorBrightness(color, 30),
			regular: color,
			darker: adjustColorBrightness(color, -30),
			darkest: adjustColorBrightness(color, -60),
		});

		const primary = generateColorShades('#065465');
		const secondary = generateColorShades('#B17D30');

		return {
			primary: primary.regular,
			primary_light: primary.lightest,
			primary_dark: primary.darkest,
			secondary: secondary.regular,
			secondary_light: secondary.lightest,
			secondary_dark: secondary.darkest,
			info: '#3563A6',
			warning: '#F0AF30',
			success: '#7DA50E',
			error: '#AE3500',
			grey_0: '#FDFDFD',
			grey_1: '#F8F8F8',
			grey_2: '#F4F4F4',
			grey_3: '#EBEBEB',
			grey_4: '#CECECE',
			grey_5: '#929292',
			grey_6: '#424242',
			grey_7: '#1A1A1A',
		};
	})(),
	linked_color: {
		text: {
			primary: 'fixed_color?.grey_7',
			secondary: 'fixed_color?.grey_5',
			tertiary: 'fixed_color?.grey_3',
			contrast: 'fixed_color?.grey_0',
		},
		background: {
			primary: 'fixed_color?.grey_0',
			secondary: 'fixed_color?.grey_2',
			accent: 'fixed_color?.primary_light',
			dark: 'fixed_color?.primary_dark',
		},
		strokes: {
			primary: 'fixed_color?.grey_7',
			secondary: 'fixed_color?.grey_5',
			tertiary: 'fixed_color?.grey_3',
			contrast: 'fixed_color?.grey_0',
		},
	},
	border_radius: {
		button: {
			primary: '0px',
			secondary: '3px',
		},
		banner: {
			primary: '0px',
			secondary: '0px',
		},
		images: {
			primary: '0px',
			secondary: '5px',
		},
		thumbnail: {
			primary: '0px',
			secondary: '5px',
		},
		preview_image: {
			primary: '0px',
			secondary: '5px',
		},
		card: {
			primary: '0px',
			secondary: '4px',
		},
		chip: {
			primary: '0px',
			secondary: '40px',
		},
		dropdown: {
			primary: '0px',
			secondary: '2px',
		},
		table: {
			primary: '12px',
			secondary: '0px',
		},
		form_elements: {
			primary: '0px',
			secondary: '2px',
		},
		pagination: {
			primary: '0px',
			secondary: '2px',
		},
		filter: {
			primary: '0px',
			secondary: '2px',
		},
		modal: {
			primary: '0px',
			secondary: '8px',
		},
		skeleton: {
			primary: '0px',
			secondary: '2px',
		},
	},
	product_settings: {
		rails_settings: {
			show_rails: false,
		},
		breadcrumbs_settings: {
			fontSize: '14px',
		},
	},
	pdp_settings: {
		breakcrumbs_settings: {
			fontSize: '14px',
			fontWeight: '400',
		},
		main_image_settings: {
			width: 'auto',
			height: 'auto',
			border: '1px solid rgb(224, 224, 224)',
			objectFit: 'contain',
		},
		thumbnail_image_settings: {
			width: '160px',
			height: '160px',
			objectFit: 'contain',
			border: 'none',
		},
		thumbnail_conatiner: {
			overFlow: 'auto',
		},
		hinge_settings: {
			chips: {
				border: '1px solid var(--Grey-600, #9AA0AA)',
				boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.08)',
			},
			image_style: {
				border: 'none',
			},
			active_image_style: {
				border: '1px solid #25282D',
				background: '#F7F8FA',
				boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.08)',
			},
			active_chip: {
				background: '#2D323A',
				color: 'white',
				borderRadius: '0px',
				'&:hover': {
					background: '#2D323A',
				},
			},
			in_active_chip: {
				background: 'rgba(0, 0, 0, 0.12)',
				color: '#2D323A',
				borderRadius: '0px',
			},
			hinge_container: {
				margin: '2.4rem 0rem',
			},
			accordion_section: {
				color: '#4F555E',
				fontSize: '16px !important',
				fontWeight: '400 !important',
			},
		},
		rails_settings: {
			title: {
				color: '#25282D',
				fontSize: '36px',
				fontWeight: 400,
				textTransform: 'uppercase',
			},
			rails_container: {
				margin: '40px 0px',
				justifyContent: 'center',
			},
			rails_content_container: {
				flexDirection: 'column',
			},
			product_name: {
				fontSize: '18px !important',
			},
			product_sku_id: {
				fontSize: '12px',
			},
			product_image: {
				border: '1px solid #9AA0AA66',
				borderRadius: '0px',
			},
			product_card: {
				border: 'none',
				borderRadius: '0px',
			},
			product_attributes: {
				textAlign: 'start',
				fontWeight: '700',
				fontSize: '16px',
				lineHeight: '24px',
			},
			product_attributes_container: {
				margin: '0px',
			},
			card_template_row: {
				padding: '.5rem 0rem',
			},
		},
		header_container: {
			gap: '14px',
		},
		title: {
			color: '#25282D',
			fontSize: '26px !important',
			fontWeight: 'normal !important',
		},
		sku_id: {
			color: '#9AA0AA',
			fontSize: '14px !important',
			fontWeight: '400',
		},
		price: {
			fontSize: '20px',
			fontWeight: 700,
		},
	},
	account_settings: {
		tabs: [
			{
				key: 'profile',
				name: 'My Profile',
				pripority: 0,
				link: '/account/profile',
				show_tab: true,
			},
			{
				key: 'orders',
				name: 'My Orders',
				pripority: 1,
				link: '/account/orders',
				show_tab: true,
			},
			{
				key: 'invoices',
				name: 'Invoices',
				pripority: 2,
				link: '/account/invoices',
				show_tab: true,
			},
		],
	},
};

const PRE_LOGIN_ROUTES = [
	'/product-details/:id',
	'/all-products',
	'/all-products/category',
	'/all-products/collection',
	'/all-products/category/products/:category_name/:category_id',
	'/all-products/collection/products/:collection_name/:collection_id',
	'/all-products/search',
];

const FREE_TRIAL_ROUTES: any = ['/free-trial', '/confirmed-demo'];

const FONT_CONFIG = {
	primary: 'Satoshi',
	secondary: 'Brother1816',
	tertiary: 'Bellefair',
};

const CART_GROUPING_KEYS = {
	ENABLED: 'enabled',
	GROUP_BY: 'group_by',
	CUSTOM_GROUPING: 'custom_grouping',
	CUSTOM_GROUP_PRODUCT_KEYS: ['name', 'sku_id'],
	CART_SUMMARY_PAGE: 'CART_SUMMARY_PAGE',
	UNGROUPED_KEY: 'Ungrouped',
	ACTION_MODAL_MODES: {
		ADD: 'add',
		EDIT: 'edit',
		DELETE: 'delete',
	},
};

const DATA_TYPES = {
	STRING: 'string',
};

const DATE_FORMAT = 'MM/DD/YY';
const BUYER_CUSTOMER_MAP = {
	BUYERS: 'buyers',
	CUSTOMERS: 'customers',
};
// [TODO]: To be removed after driven from config
const CUSTOM_DATE_FORMATS = {
	MM_DD_YYYY: 'MM/DD/YYYY',
};
const TIME_FORMATS = {
	HOUR_12: 'h:mm A', // 12-hour format with AM/PM (e.g., 3:15 AM)
	HOUR_24: 'HH:mm', // 24-hour format (e.g., 15:15)
};
const TENANT_SETTINGS_KEYS = {
	DOCUMENT_TAGS_ENABLED: 'document_tags_enabled',
	INTEGRATION_ACCOUNT_SETTING_KEY: 'is_integration_account',
	PAYMENTS_ENABLED: 'is_payments_enabled',
	SHOW_CUSTOMER_UUID: 'show_customer_system_uuid',
	MANUAL_PAYMENT_STATUS_CHANGE: 'manual_payment_status_change',
	PRESENTATION_ENABLED: 'is_presentation_enabled',
	WISHLIST_ENABLED: 'enable_wishlist',
};

const ASSIGN_TAG_OPTIONS = [
	{ label: 'Yes', value: 'yes' },
	{ label: 'No', value: 'no' },
];

// [for TEMP fix]
const SAGEBROOK_TEMP_CONSTANTS = {
	TENANT_ID: '4bd1a53b-e30f-4abc-a917-6669da370d71',
	PHONE_CUSTOM_ATTR_ID: 'da57f34c-e7d7-459e-80e6-c3b2c7d0f69d',
};

const SAGEBROOK_TEMP_KEYS = {
	'4bd1a53b-e30f-4abc-a917-6669da370d71': 'da57f34c-e7d7-459e-80e6-c3b2c7d0f69d',
	'5c66253d-ff2d-496d-a49d-0cdc4df6233d': 'da57f34c-e7d7-459e-80e6-c3b2c7d0f69d',
};
const JSON_EDITORS = {
	STAGING: 'https://ultron-git-json-editor-staging-sourcewiz.vercel.app/',
	PREPROD: 'https://ultron-git-json-editor-preprod-sourcewiz.vercel.app/',
	PROD: 'https://ultron-git-json-editor-sourcewiz.vercel.app/',
};

const KALALOUE_ID = '9f044c2a-510e-4e68-8e80-dc36bc464137';

const PAYMENTS_KEY = 'Payments';

const DELETE_SKU_DRAWER_ITEM_PER_PAGE = 50;
const PRODUCT_CARD_TYPE = {
	REVIEW: 'REVIEW' as 'REVIEW',
	ACTION: 'ACTION' as 'ACTION',
	SELECTED: 'SELECTED' as 'SELECTED',
};
const VIEW_SKU_DRAWER_ITEM_PER_PAGE = 50;
const VARIANT_DRAWER_TYPES = {
	VIEW: 'VIEW' as 'VIEW',
	DELETE: 'DELETE' as 'DELETE',
};
const CATALOG_STATUS_KEYS = {
	GENERATED: 'generated',
	NOT_GENERATED: 'not generated',
	FAILED: 'failed',
	IN_PROGRESS: 'in progress',
};
const PRODUCT_DETAILS_CARD_TYPE = {
	REVIEW: 'REVIEW' as 'REVIEW',
	ACTION: 'ACTION' as 'ACTION',
};
const VARIANT_DETAILS_CARD_TYPE = {
	REVIEW: 'REVIEW' as 'REVIEW',
	ACTION: 'ACTION' as 'ACTION',
};
const RECOMMEND_CARD_TYPE = {
	REVIEW: 'REVIEW' as 'REVIEW',
	ACTION: 'ACTION' as 'ACTION',
};
const MAX_CATALOG_STORING_LIMIT_DEFAULT = 300;

const RAILS = {
	ALL_PRODUCTS_SECTION: 'all_products_section',
};
const PAYMENT_DEPENDENT_TABLES = ['payment', 'credit', 'transactions'];

const constants = {
	STATUS,
	ALL_ENV,
	FALLBACK_IMAGE,
	ATTRIBUTE_DATE_FORMAT,
	ENDPOINT,
	LOGIN,
	START_TRIAL,
	SWITCH_TENANT,
	REFRESH_TOKEN,
	VERIFY_TOKEN,
	ENABLE_2FA,
	VALIDATE_2FA,
	SET_PASSWORD,
	LOGOUT_API,
	RESET_PASSWORD,
	DEACTIVATE_2FA,
	LOGIN_2FA,
	BLACKLIST_TOKEN,
	GET_USER,
	GET_CART,
	GET_ENTITIES,
	CART,
	BULK_GET,
	CREATE_QUTATION,
	CONFIRM_QUTATION,
	GET_ACCOUNT_LIST,
	GET_ACCOUNT_USERS,
	CREATE_ACCOUNT,
	POSTMAN_MOCK,
	POSTMAN_ENDPOINT,
	UPDATE_QUICK_SETTINGS,
	GET_QUICK_SETTINGS,
	GET_WIZSHOP_BUYER_FORM,
	GET_WIZSHOP_BUYER_SECTION,
	GET_WIZSHOP_UPLOAD_FILE,
	GET_PRODUCT_DETAILS,
	GET_PRODUCTS,
	GET_ALL_FILTERS,
	GET_PRODUCT_VARIANTS,
	GET_PRICE_LEVEL_LIST,
	GET_CREATE_ACCOUNTS_FORM,
	POST_CREATE_ACCOUNT,
	GET_PERMISSIONS,
	BUYER_ADDRESS_FIELDS,
	WORDPRESS_URL,
	EXCLUDED_FACETS_LABELS,
	HYPERLINK_FIELDS,
	BUYER_LIST_KEY,
	ATTRIBUTE_DISPLAY_CONFIG,
	FALLBACK_CONFIG_SETTINGS,
	FONT_CONFIG,
	GET_CONFIG_SETTINGS,
	CART_GROUPING_KEYS,
	PRE_LOGIN_ROUTES,
	DATA_TYPES,
	DATE_FORMAT,
	BUYER_CUSTOMER_MAP,
	CUSTOM_DATE_FORMATS,
	TIME_FORMATS,
	TENANT_SETTINGS_KEYS,
	ASSIGN_TAG_OPTIONS,
	SAGEBROOK_TEMP_CONSTANTS,
	FREE_TRIAL_ROUTES,
	SAGEBROOK_TEMP_KEYS,
	JSON_EDITORS,
	PAYMENTS_KEY,
	DELETE_SKU_DRAWER_ITEM_PER_PAGE,
	PRODUCT_CARD_TYPE,
	KALALOUE_ID,
	VIEW_SKU_DRAWER_ITEM_PER_PAGE,
	VARIANT_DRAWER_TYPES,
	CATALOG_STATUS_KEYS,
	PRODUCT_DETAILS_CARD_TYPE,
	VARIANT_DETAILS_CARD_TYPE,
	RECOMMEND_CARD_TYPE,
	MAX_CATALOG_STORING_LIMIT_DEFAULT,
	RAILS,
	SMART_SEARCH_UPLOAD_IMAGE,
	PAYMENT_DEPENDENT_TABLES,
	SHORT_URL,
};

export default constants;
