import { DEFAULT_SSRM_CONFIG } from 'src/screens/Settings/utils/constants';
import { USER_LOGOUT, USER_SWITCH } from '../actions/reduxConstants';
interface Settings {
	item_level_discount: boolean;
	Edit_Disallowed_After_Pending_Approval: boolean;
	cart_container_config: any;
	is_tenant_settings_fetched: boolean;
	default_ssrm_config: any;
	cart_grouping_config: any;
	product_listing_config: any;
	presentation_config: any;
	hide_backorder_error_on_cart: any;
}

const initialState: Settings = {
	item_level_discount: false,
	Edit_Disallowed_After_Pending_Approval: false,
	cart_container_config: {},
	is_tenant_settings_fetched: false,
	default_ssrm_config: DEFAULT_SSRM_CONFIG,
	cart_grouping_config: {},
	product_listing_config: {
		filters: [],
		config: [],
		sorts: [],
		search_in_config: [],
		global_sorts: [],
		default_filters: [],
	},
	presentation_config: {},
	hide_backorder_error_on_cart: false,
};

const setting_reducer = (state: any = initialState, action: any) => {
	switch (action?.type) {
		case 'INITIALIZE_SETTING':
			return { ...state, ...action?.data };
		case USER_SWITCH:
		case USER_LOGOUT:
			return { ...initialState };
		case 'CART_CONTAINER_CONFIG':
			return { ...state, cart_container_config: action?.data };
		case 'INVENTORY_ICON_CONFIG':
			return {
				...state,
				inventory_icon_config: action?.data,
			};
		case 'CART_GROUPING_CONFIG':
			return {
				...state,
				cart_grouping_config: action?.data,
			};
		case 'UPDATE_PRODUCT_LISTING_CONFIG':
			return {
				product_listing_config: action?.data,
			};
		default:
			return state;
	}
};

export default setting_reducer;
