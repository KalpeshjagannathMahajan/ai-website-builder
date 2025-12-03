/* eslint-disable */
import React, { useState, CSSProperties, memo, useEffect, useContext } from 'react';
import { makeStyles } from '@mui/styles';
import { Image, Icon, Box, Grid } from 'src/common/@the-source/atoms';
import Counter from './Counter';
import ProductMoreMenu from './ProductMoreMenu';
import { get_initial_entity_error, get_entity_error, get_discounted_value, ADHOC_ITEM, BLOCK_CART_STATUS } from '../helper';
import { useTranslation } from 'react-i18next';
import { Product } from 'src/screens/ProductListing/mock/ProductInterface';
import get_product_image from 'src/utils/ImageConstants';
import InventoryStatus from 'src/common/@the-source/molecules/Inventory/InventoryStatus';
import { INVENTORY_STATUS } from 'src/common/@the-source/molecules/Inventory/constants';
import { useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import CustomText from 'src/common/@the-source/CustomText';
import ImageLinks from 'src/assets/images/ImageLinks';
import CartSummaryContext from '../context';
import _, { truncate } from 'lodash';
import utils, { get_attributes_mapping, get_product_metadata } from 'src/utils/utils';
import { get_max_quantity } from 'src/screens/ProductListing/utils';
import { get_formatted_price_with_currency } from 'src/utils/common';
import { Alert, useTheme } from '@mui/material';
import SimilarDrawer from 'src/common/@the-source/molecules/SimilarDrawer';
import { all_product_card_template } from 'src/screens/ProductListing/mock/card_template';
import { colors } from 'src/utils/theme';
import { custom_stepper_text_color, secondary } from 'src/utils/light.theme';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Mixpanel } from 'src/mixpanel';
import ModifiedPriceComponent from 'src/common/ModifiedPriceComponent';
import Events from 'src/utils/events_constants';
import NoteAndCustomize from './NoteAndCustomize';
import { initializeCart } from 'src/actions/cart';
import { useDispatch } from 'react-redux';

import './styles.css';
import PriceTooltip from './PriceToast';
export interface CartProduct extends Product {
	is_custom_product: any;
	quantity: number;
	cart_item_id: string;
	items: any;
	product_state?: any;
	final_price?: number;
	is_price_modified?: boolean;
}
const { VITE_APP_REPO } = import.meta.env;
const is_store_front = VITE_APP_REPO === 'store_front';
const is_ultron = VITE_APP_REPO === 'ultron';

const useStyles = makeStyles((theme: any) => ({
	container: {
		width: '100%',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		alignSelf: 'stretch',
		[!is_ultron && theme.breakpoints.down('sm')]: {
			marginBottom: '4px',
		},
	},
	sub_container: {
		display: 'flex',
		flexDirection: 'column',
		width: '70%',
	},
	similar_chip: {
		display: 'inline-flex',
		alignItems: 'center',
		gap: '2px',
		background: secondary?.[100],
		borderRadius: '32px',
		padding: '3px 6px',
		cursor: 'pointer',
		color: custom_stepper_text_color?.grey,
		height: '24px',
		[!is_ultron && theme.breakpoints.down('sm')]: {
			width: 'fit-content',
		},
	},
	image_container: {
		borderRadius: '6px',
		padding: '2px 4px 4px 2px',
	},
	section_1: {
		display: 'flex',
		overflow: 'hidden',
		cursor: 'pointer',
		alignItems: 'flex-start',
		gap: '14px',
		flex: '30',
		[!is_ultron && theme.breakpoints.down('sm')]: {
			gap: '8px',
		},
	},
	section_1_info: {
		display: 'flex',
		flexDirection: 'column',
		gap: '8px',
		overflow: 'hidden',
		width: 'calc(100% - 127px)',
		[!is_ultron && theme.breakpoints.down('sm')]: {
			width: '100%',
			gap: '4px',
		},
	},
	attributes_list: {
		display: 'flex',
		flexWrap: 'wrap',
		width: 'max-content',
	},
	section_2: {
		display: 'flex',
		flexDirection: 'column',
		gap: '1rem',
		flex: '11.11',
		[!is_ultron && theme.breakpoints.down('sm')]: {
			flex: '0',
		},
	},
	section_3: {
		display: 'flex',
		gap: '12px',
		flex: '22.22',
		[!is_ultron && theme.breakpoints.down('sm')]: {
			gap: '0px',
		},
	},
	section_3_box: {
		display: 'flex',
		justifyContent: 'flex-end',
	},
	row_action_icon: {
		display: 'flex',
		height: '40px',
		alignItems: 'center',
		cursor: 'pointer',
	},
	row_action_icon_1: {
		height: '40px',
		cursor: 'pointer',
		paddingRight: '8px',
	},
	notes: {
		display: 'flex',
		flexDirection: 'row',
		gap: '4px',
		width: '100%',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		[theme.breakpoints.down('sm')]: {
			marginTop: '8px',
		},
	},
	discount_bar: {
		marginTop: '8px',
		display: 'flex',
		padding: '6px 8px',
		justifyContent: 'space-between',
		alignItems: 'center',
		alignSelf: 'stretch',
		borderRadius: '8px',
		background: theme?.cart_summary?.product_card?.discount_bar_bg,
	},
	discount_header: {
		display: 'flex',
		gap: '4px',
		alignItems: 'center',
		fontSize: '14px',
		fontWeight: 700,
		flexDirection: 'row',
		color: theme?.cart_summary?.product_card?.discount_header_color,
	},
	discount_icon: {
		color: theme?.cart_summary?.product_card?.discount_icon,
		height: '24px',
		width: '24px',
		padding: 0,
		margin: 0,
	},
	custom_text_on_image: {
		width: '100%',
		position: 'absolute',
		top: '50%', // Center vertically
		left: '50%', // Center horizontally
		transform: 'translate(-50%, -50%)', // Adjust for centering
		zIndex: 1, // Ensure text is above the image
		background: theme?.cart_summary?.product_card?.custom_image_text,
		backdropFilter: 'blur(1px)',
		textAlign: 'center',
		padding: '3px 0px',
	},
	discount_img: {
		height: '24px',
		width: '24px',
		color: theme?.cart_summary?.product_card?.discount_img,
	},

	discount_container: {
		display: 'flex',
		flexDirection: 'row',
		gap: '1rem',
	},
	counter_div: {
		marginLeft: 'auto',
		display: 'flex',
		gap: '4px',
		flexDirection: 'column',
		[!is_ultron && theme.breakpoints.down('sm')]: {
			width: '113px',
		},
	},
	product_name: {
		width: '100%',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		fontWeight: 700,
		color: theme?.cart_summary?.product_card?.product_name_color,
	},
	image_box: {
		position: 'relative',
		borderRadius: '6px',
		padding: '2px 4px 4px 2px',
		display: 'flex',
		flexDirection: 'column',
		minWidth: 'fit-content',
		...theme?.cart_summary?.image_box,
	},
	notes_text: {
		fontWeight: 700,
		fontSize: '12px',
		color: theme?.cart_summary?.product_card?.notes_color,
	},
	custom_label: {
		fontSize: '10px',
		fontStyle: 'normal',
		fontWeight: 700,
		color: theme?.cart_summary?.background,
	},
	attr_dot: {
		verticalAlign: 'middle',
		transform: 'scale(0.72)',
		color: theme?.cart_summary?.product_card?.attr_color,
	},
	attribute: {
		marginTop: '0',
		display: 'inline-flex',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
	},
	hinge_attr_value: {
		display: 'inline-flex',
		cursor: 'pointer',
		backgroundColor: `${colors.grey_600}`,
		padding: '0.5rem 0.6rem',
		marginRight: '0.5rem',
		borderRadius: '0.4rem',
		overflow: 'auto',
	},
	attr_value: {
		maxWidth: '13.5rem',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
	card_icon: {
		fontSize: '11px',
		color: custom_stepper_text_color?.grey,
		width: '14px',
		height: '14px',
	},
	text: {
		lineHeight: 'normal',
		textAlign: 'center',
		textOverflow: 'ellipsis',
		overflow: 'hidden',
		color: custom_stepper_text_color?.grey,
	},
	variant_btn: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		cursor: 'pointer',
	},
	variant_icon: {
		height: '18px',
		width: '18px',
		marginBottom: '4px',
	},
	moq: {
		display: 'flex',
		[theme.breakpoints.down('sm')]: {
			display: 'none',
		},
	},
	cart_image: {
		maxHeight: '90px',
		width: '87px',
		[!is_ultron && theme.breakpoints.down('sm')]: {
			height: '60px',
			width: '60px',
		},
	},
	custom_grid_style1: {
		display: !is_ultron ? 'flex' : 'block',
		justifyContent: is_ultron ? 'flex-end' : 'start',
		flexDirection: 'column',
		[theme.breakpoints.down('sm')]: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'flex-start',
			gap: '8px',
		},
	},
	custom_grid_style2: {
		justifyContent: is_ultron ? 'space-between' : 'flex-end',
		alignItems: 'center',
	},
	custom_grid_style3: {
		justifyContent: 'space-between',
	},
	tooltip: {
		zIndex: 1,
		padding: 0,
		backgroundColor: colors.white,
		border: `1px solid ${colors.dark_midnight_blue}`,
	},
	arrow: {
		color: colors.white,
		'&::before': {
			border: `1px solid ${colors.dark_midnight_blue}`,
		},
	},
	info_icon: {
		height: '14px',
		width: '14px',
	},
	add_note: {
		display: ' flex',
		cursor: 'pointer',
		alignItems: 'center',
		margin: '5px 0px',
	},
	variant_count_style: {
		margin: '0 1rem',
		padding: '3px 4px 0px 10px !important',
	},
}));

interface ProductCardProps {
	toggle_global_error: (callback: (prev: any) => any) => void;
	unit_price: number;
	unit_volume?: any;
	item: any;
	cart_item_id: string;
	product: Product;
	handle_delete_entity: (entityId: string, cartItemId: string) => void;
	handle_change_quantity: (entityId: string, newQuantity: number, cartItemId: string, isCustomProduct?: boolean, customId?: string) => void;
	product_line_item: any;
	custom_id: string;
	cart_error?: any;
	is_discount_applied?: boolean;
}

const ProductCardTemp = ({
	toggle_global_error,
	unit_price,
	item,
	cart_item_id,
	product,
	handle_delete_entity,
	handle_change_quantity,
	product_line_item,
	custom_id,
	cart_error,
	unit_volume = {
		CBM: 0,
		CFT: 0,
	},
	is_discount_applied = false,
}: ProductCardProps) => {
	const product_data: CartProduct = { ...item, ...product, cart_item_id, items: product_line_item };
	const classes = useStyles();
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));
	const settings = useSelector((state: any) => state?.settings);
	// const { cart_container_config } = settings;
	const [search_params] = useSearchParams();
	const hide_view_similar = useSelector((state: any) => state?.settings?.hide_view_similar) || false;
	const _cart = useSelector((state: any) => state?.cart);
	const login = useSelector((state: any) => state.login);
	const is_logged_in = login?.status?.loggedIn;
	const documented_cart = !_.isEmpty(_cart?.document_items);
	const is_document_cart = search_params.get('is_document_cart') || documented_cart;
	const { cart_container_config = {}, product_card_config = [] } = settings;
	const document_state = useSelector((state: any) => state?.cart?.document_items);
	const current_product_reserved = document_state?.[product_data?.id]?.[cart_item_id]?.total_reserved || 0;
	const current_product_quantity = document_state?.[product_data?.id]?.[cart_item_id]?.quantity || 0;
	const [temp_quantity, set_quantity] = useState(product_data?.quantity);
	const [drawer, setDrawer] = useState(false);
	const entity_id = product_data?.id;
	const pricing = _.get(product_data, 'pricing', {});
	const volume_tiers = _.get(pricing, 'volume_tiers', []);
	const min = _.get(pricing, 'min_order_quantity', 0);
	const default_order_quantity = _.get(pricing, 'default_order_quantity', 0);
	const step = _.get(pricing, 'step_increment', 0);
	const is_retail_mode = localStorage.getItem('retail_mode') === 'true';
	const currency_symbol = _.get(pricing, 'currency', '$');
	const is_price_changed = product_data?.product_state !== ADHOC_ITEM ? item?.initial_price !== _.get(pricing, 'price', 0) : false;
	const price_per_unit = !_.isEmpty(volume_tiers) ? unit_price : is_price_changed ? item?.initial_price : _.get(pricing, 'price', 0);
	const base_price_per_unit = _.get(pricing, 'base_price', null);

	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const variants_count = _.filter(product?.variants_meta?.variant_data_map, (e: any) => e.is_active !== false)?.length;
	const is_custom_product = product_data?.is_custom_product;
	const is_price_modified = _.get(product_data, 'is_price_modified', false);
	const final_price = _.get(product_data, 'final_price', unit_price);
	const {
		cart,
		set_show_discount_modal,
		set_selected_product,
		toggle_button_value,
		set_adhoc_data,
		set_open_custom_product,
		set_variant_data,
		set_variant_drawer,
		set_similar_drawer,
		customer_metadata,
		set_is_edit_modifiers,
		set_edit_product,
		buyer,
		discount_campaigns,
		set_edit_product_price_change,
		set_update_price_modal_data,
		set_show_note_modal,
		handle_remove_note,
		cart_errors,
	} = useContext(CartSummaryContext);
	const [on_edit_price_change, set_on_edit_price_change] = useState(false);
	const product_total_quantity: number =
		(utils.get_cart_items(is_custom_product ? custom_id : product_data?.id, { products: cart?.data?.items }) as number) -
			Number(item?.quantity) || 0;
	const [error, set_error] = useState(
		get_initial_entity_error(product_data, product_total_quantity, current_product_reserved, 0, is_custom_product),
	);
	const product_disable_cart_error = _.includes(BLOCK_CART_STATUS, cart_error?.error_code);
	// error handling for documented cart items
	const totol_available = product_data?.inventory?.total_available ?? 0;
	const back_order_inventory = product_data?.inventory?.backorder_available_quantity ?? 0;
	const not_available_inventory = totol_available + current_product_reserved + back_order_inventory < current_product_quantity;
	const not_adhoc_product_status = product_data?.product_state !== ADHOC_ITEM;
	const is_out_of_stock_inventory = product_data?.inventory?.inventory_status === 'OUT_OF_STOCK';
	const disable_counter = not_adhoc_product_status && not_available_inventory && is_out_of_stock_inventory;
	const moq_break_enabled = _.get(
		useSelector((state: any) => state?.settings),
		'moq_break_enabled',
		false,
	);
	const handle_set_quantity = (event: any) => {
		const _value = event.target.value;
		const regex = /^[1-9]\d*$/;
		const isPositiveInteger = regex.test(_value);
		if (!isPositiveInteger && _value) return;
		const _error = get_entity_error(
			product_data,
			+_value,
			product_total_quantity,
			current_product_reserved,
			0,
			is_custom_product,
			moq_break_enabled,
			_.isEmpty(volume_tiers),
			is_discount_applied,
		);
		set_error(_error);
		if (!_error?.is_error && !product_disable_cart_error) {
			handle_change_quantity(entity_id, +_value, cart_item_id, is_custom_product, custom_id);
		}
		set_quantity(_value);
	};

	const handle_blur_quantity = (event: any) => {
		let _value = event.target.value;
		if (!_value) {
			_value = min;
		}
		const _error = get_entity_error(
			product_data,
			+_value,
			product_total_quantity,
			current_product_reserved,
			0,
			is_custom_product,
			moq_break_enabled,
			_.isEmpty(volume_tiers),
			is_discount_applied,
		);
		set_error(_error);
		if (!_error?.is_error && !product_disable_cart_error) {
			set_quantity(_value);
			handle_change_quantity(entity_id, +_value, cart_item_id, is_custom_product, custom_id);
		}
	};

	const handle_increment = () => {
		let new_quantity;

		if (!_.isEmpty(volume_tiers)) {
			new_quantity = utils.get_inc_acc_volume_tiers(min, default_order_quantity, temp_quantity, volume_tiers, temp_quantity !== 0);
		} else {
			new_quantity = temp_quantity < min ? min : utils.get_closest_increment(min, step, temp_quantity, default_order_quantity);
		}

		const _error = get_entity_error(
			product_data,
			+new_quantity,
			product_total_quantity,
			current_product_reserved,
			0,
			is_custom_product,
			moq_break_enabled,
			_.isEmpty(volume_tiers),
			is_discount_applied,
		);
		set_error(_error);
		if (!_error?.is_error && !product_disable_cart_error) {
			if (temp_quantity !== new_quantity) set_quantity(new_quantity);
			handle_change_quantity(entity_id, new_quantity, cart_item_id);
		}
	};

	const get_closest_decrement: any = (start_value: number, increment_value: number, value: number, max: number) => {
		let last_value = ((value - start_value) % increment_value === 0 && value - increment_value) ?? 0;

		let current_value = start_value;
		while (current_value + increment_value < value) {
			current_value += increment_value;
		}
		last_value = current_value;

		if (last_value > max) {
			return get_closest_decrement(start_value, increment_value, last_value, max);
		}
		return last_value;
	};

	const handle_decrement = () => {
		let new_quantity = 0;
		const reserved_quantity = product_data?.inventory?.total_reserved;
		const max_quantity_allowed = get_max_quantity(product, reserved_quantity);

		if (!_.isEmpty(volume_tiers)) {
			new_quantity = utils.get_dec_acc_volume_tiers(min, temp_quantity, volume_tiers);
		} else {
			new_quantity =
				temp_quantity > max_quantity_allowed
					? max_quantity_allowed
					: get_closest_decrement(
							min,
							step,
							temp_quantity,
							is_document_cart ? max_quantity_allowed : max_quantity_allowed - reserved_quantity,
					  );
		}

		const _error = get_entity_error(
			product_data,
			+new_quantity,
			product_total_quantity,
			current_product_reserved,
			0,
			is_custom_product,
			moq_break_enabled,
			_.isEmpty(volume_tiers),
			is_discount_applied,
		);
		set_error(_error);
		if (_error?.suggest) {
			if (temp_quantity !== _error?.suggest) set_quantity(_error?.suggest);
			handle_change_quantity(entity_id, _error?.suggest, cart_item_id, is_custom_product, custom_id);
			set_error({ is_error: false, message: '', id: 0 });
		}

		if (!_error?.is_error) {
			if (temp_quantity !== new_quantity) set_quantity(new_quantity);
			handle_change_quantity(entity_id, new_quantity, cart_item_id, is_custom_product, custom_id);
		}
	};
	const handle_edit_adhoc_item = () => {
		set_adhoc_data(product_data);
		set_open_custom_product(true);
	};

	const handle_navigate = () => {
		if (product_disable_cart_error) return;
		if (product_data?.product_state === ADHOC_ITEM) return handle_edit_adhoc_item();
		else {
			is_custom_product
				? navigate(`${RouteNames.product.product_detail.routing_path}${product?.parent_id}`)
				: navigate(`${RouteNames.product.product_detail.routing_path}${product?.id}`);
			window.scrollTo(0, 0);
		}
	};

	const get_product_name = () => {
		return (
			<CustomText type={is_small_screen && !is_ultron ? 'Caption' : 'Subtitle'} className={classes.product_name}>
				{`${product_data?.name || ''} ${is_custom_product ? 'Custom' : ''}`}
			</CustomText>
		);
	};

	const total_price = price_per_unit * temp_quantity;
	const total_modified_price = final_price * temp_quantity;
	const total_volume = (unit_volume?.[toggle_button_value] ?? 0) * temp_quantity;
	const discount_per_unit_price =
		get_discounted_value(item?.discount_type, item?.discount_value, price_per_unit) > price_per_unit
			? 0
			: price_per_unit - get_discounted_value(item?.discount_type, item?.discount_value, price_per_unit);

	const discount_price = (price_per_unit - get_discounted_value(item?.discount_type, item?.discount_value, price_per_unit)) * temp_quantity;

	const row_styles: CSSProperties =
		error.id === 1 || product_disable_cart_error || disable_counter ? { opacity: 0.5, pointerEvents: 'none' } : {};

	const attributes = get_attributes_mapping(product_card_config, product_data);
	const notesValue = _.get(product_data?.meta, 'notes[0].value', '');
	const is_note_there = item?.meta?.notes?.length > 0 && !_.isEmpty(notesValue);

	const handle_edit_offer_discount = () => {
		if (product_disable_cart_error) return;
		set_show_discount_modal(true);
		set_selected_product(product_data);
	};

	const get_discount_label = () => {
		if (item?.discount_type === 'value') {
			return t('CartSummary.DiscountAppliedValue', {
				discount_price: get_formatted_price_with_currency(currency_symbol, item?.discount_value),
			});
		}
		if (item?.discount_type === 'percentage') {
			return t('CartSummary.DiscountAppliedPercentage', {
				value: Number?.isInteger(item?.discount_value) ? item?.discount_value : item?.discount_value?.toFixed(2),
			});
		}
		return false;
	};

	const product_metadata = get_product_metadata(product);

	const handle_initialize_cart = () => {
		const { data } = cart;
		dispatch(
			initializeCart({
				id: data?.id,
				products: data?.items,
				products_details: data?.products,
				document_items: data?.document_items || {},
			}),
		);
	};

	const similarSW = (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => {
		set_variant_data(product);
		set_similar_drawer(true);
		e.stopPropagation();
		Mixpanel.track(Events.VIEW_SIMILAR_CLICKED, {
			tab_name: 'Products',
			page_name: 'cart_page',
			section_name: '',
			subtab_name: '',
			customer_metadata,
			product_metadata,
		});
		handle_initialize_cart();
	};

	const handle_variant = () => {
		set_variant_data(product);
		set_variant_drawer(true);
		handle_initialize_cart();
	};

	const handle_apply = () => {
		const state = {
			open: true,
			data: { item, product },
			action: 'SINGLE',
		};
		set_update_price_modal_data(state);
	};

	useEffect(() => {
		if (product_data?.product_state !== ADHOC_ITEM && _.isEmpty(volume_tiers)) {
			if (
				item?.initial_price !== product?.pricing?.price &&
				(!cart_errors?.[product_data?.id] || _.isEmpty(cart_errors?.[product_data?.id]))
			) {
				set_on_edit_price_change(true);

				set_edit_product_price_change((prev: any) => Array.from(new Set([...prev, product_data?.id])));
			}
		}
	}, [item]);

	useEffect(() => {
		const _error = get_entity_error(
			product_data,
			+product_data?.quantity,
			product_total_quantity,
			current_product_reserved,
			0,
			is_custom_product,
			moq_break_enabled,
			_.isEmpty(volume_tiers),
			is_discount_applied,
		);
		if (_.isEmpty(cart_error)) set_error(_error);
		set_quantity(product_data?.quantity);
	}, [product_data?.quantity]);

	useEffect(() => {
		toggle_global_error((prev: any) => {
			return {
				...prev,
				[entity_id]: error?.is_error,
			};
		});
	}, [error?.is_error]);

	const is_price_increased = _.isEmpty(volume_tiers) && item?.initial_price < product?.pricing?.price ? true : false;
	const new_price = product?.pricing?.price;

	const handle_render_view_similar = () => {
		return (
			<Grid className={classes.similar_chip} onClick={similarSW}>
				<Icon iconName='IconCards' className={classes.card_icon} />
				<CustomText type='CaptionBold' className={classes.text}>
					{t('Product.Similar')}
				</CustomText>
			</Grid>
		);
	};

	const handle_render_variant_chip = () => {
		return (
			variants_count > 1 &&
			!is_custom_product && (
				<Grid className={`${classes.similar_chip} ${classes.variant_count_style}`} onClick={handle_variant}>
					<CustomText
						color={is_store_front ? custom_stepper_text_color?.grey : theme?.order_management?.custom_color_?.color}
						type='CaptionBold'>
						{`Variants (${variants_count}) `}
					</CustomText>

					<Icon
						color={is_store_front ? custom_stepper_text_color?.grey : theme?.order_management?.custom_color_?.color}
						className={classes.variant_icon}
						iconName='IconChevronRight'
					/>
				</Grid>
			)
		);
	};

	const handle_product_menu = () => {
		return error.id === 1 || _.includes(BLOCK_CART_STATUS, cart_error?.error_code) || disable_counter ? (
			<div
				className={classes.row_action_icon}
				onClick={() => handle_delete_entity(is_custom_product ? custom_id : entity_id, cart_item_id)}>
				<Icon iconName='IconTrash' color={theme?.cart?.cart_icon?.color} />
			</div>
		) : (
			<div className={classes.row_action_icon}>
				<ProductMoreMenu
					apply_discount={settings?.item_level_discount && !is_custom_product && _.isEmpty(volume_tiers)}
					is_note_there={is_note_there}
					error={error?.is_error || product_data?.inventory?.inventory_status === INVENTORY_STATUS.out_of_stock}
					product={product_data}
					cart_item_id={cart_item_id}
					entity_id={is_custom_product ? custom_id : entity_id}
					enable_custom_line_item={settings?.enable_custom_line_item}
				/>
			</div>
		);
	};

	return (
		<React.Fragment>
			<div className={classes.container}>
				<div className={classes.section_1} style={row_styles} onClick={() => handle_navigate()}>
					<Box className={classes.image_box}>
						<Image
							width={90}
							height={85}
							onClick={() => handle_navigate()}
							style={{ ...theme?.cart_summary?.image }}
							src={get_product_image(product_data, 'CART_SUMMARY_PAGE')}
							alt='test'
							imgClass={classes.cart_image}
						/>
					</Box>
					<div className={classes.section_1_info}>
						{is_ultron && get_product_name()}
						{!is_small_screen && !is_ultron && get_product_name()}
						<CustomText
							type={is_small_screen && !is_ultron ? 'Caption' : 'Body'}
							className={classes.product_name}
							color={theme?.order_management?.custom_text_color_style?.color}>
							{t('CartSummary.ProductCard.Id', { id: product_data?.sku_id })}
						</CustomText>

						{is_small_screen && !is_ultron && utils.is_prelogin_inventory(is_logged_in) && (
							<CustomText className={classes.product_name}>
								<InventoryStatus
									data={product_data}
									style={{ height: '3rem', flex: 'none', width: 'fit-content', gap: '5px' }}
									showBg={false}
									fontSize={13}
									disable={product_disable_cart_error || disable_counter}
									show_icon={false}
								/>
							</CustomText>
						)}
						{!is_retail_mode && (
							<>
								{discount_per_unit_price !== price_per_unit ? (
									<Box display='flex' alignItems={'center'} gap={1}>
										<CustomText type='Subtitle'>
											{t('CartSummary.ProductCard.Price', {
												price: get_formatted_price_with_currency(currency_symbol, discount_per_unit_price),
											})}
										</CustomText>

										<CustomText type='CaptionBold' style={{ textDecoration: 'line-through' }} color='rgba(0, 0, 0, 0.4)'>
											{t('CartSummary.ProductCard.Price', {
												price: get_formatted_price_with_currency(
													currency_symbol,
													!_.isEmpty(item?.discount_campaign_id) ? price_per_unit : base_price_per_unit ?? price_per_unit,
												),
											})}
										</CustomText>
										{!_.isEmpty(item?.discount_campaign_id) && (
											<CustomText
												type='Caption'
												style={{
													...theme?.product?.discount_campaign,
												}}>
												{item?.discount_type === 'percentage'
													? `${item?.discount_value}% off`
													: ` ${get_formatted_price_with_currency(
															currency_symbol,
															item?.discount_value > price_per_unit ? price_per_unit : item?.discount_value,
													  )} off`}
											</CustomText>
										)}
										{_.isEmpty(item?.discount_campaign_id) && (
											<PriceTooltip
												base_price={base_price_per_unit}
												sale_price={price_per_unit}
												offered_price={discount_per_unit_price}
												currency={currency_symbol}
											/>
										)}
									</Box>
								) : (
									<Box display='flex' alignItems='center' gap={1}>
										<CustomText type='Subtitle'>
											{t('CartSummary.ProductCard.Price', {
												price: get_formatted_price_with_currency(currency_symbol, price_per_unit),
											})}
										</CustomText>
										{base_price_per_unit > 0 && price_per_unit < base_price_per_unit && (
											<CustomText type='CaptionBold' style={{ textDecoration: 'line-through' }} color='rgba(0, 0, 0, 0.4)'>
												{t('CartSummary.ProductCard.Price', {
													price: get_formatted_price_with_currency(currency_symbol, base_price_per_unit),
												})}
											</CustomText>
										)}
									</Box>
								)}
							</>
						)}
						{!is_small_screen &&
							!is_custom_product &&
							attributes?.map((row: any, _index: number) => (
								<p key={`attribute_row_${_index}`} className={classes.attribute}>
									{row?.attributes?.keys?.map((attr: any) => {
										const value = utils.transform_column_display(attr, product_data);
										if (!value) {
											return <></>;
										}
										return (
											<span className={classes.hinge_attr_value} key={attr}>
												<CustomText type='Caption' color={secondary[700]} className={classes.attr_value}>
													{value}
												</CustomText>
											</span>
										);
									})}
								</p>
							))}
					</div>
				</div>

				{!is_custom_product && (
					<div className={classes.section_2} style={row_styles}>
						{!is_small_screen && product_data && utils.is_prelogin_inventory(is_logged_in) && (
							<InventoryStatus
								data={product_data}
								style={{ height: '3rem', flex: 'none', width: 'fit-content', gap: '5px' }}
								showBg={true}
								fontSize={13}
								disable={product_disable_cart_error || disable_counter}
							/>
						)}

						{product?.inventory?.inventory_status !== 'OUT_OF_STOCK' && (
							<CustomText className={classes.moq} type='Body'>
								{t('Common.MOQ', { count: product?.pricing?.min_order_quantity })}
							</CustomText>
						)}
					</div>
				)}

				<div className={classes.section_3}>
					<div className={classes.counter_div}>
						<div className={classes.section_3_box} style={row_styles}>
							<Counter
								disabled={disable_counter || product_disable_cart_error}
								disabledDecrement={error?.id === 5 || disable_counter || product_disable_cart_error}
								disableIncrement={error.id === 2 || error.id === 4 || error.id === 5 || error.id === 6 || disable_counter}
								handleIncrement={handle_increment}
								handleDecrement={handle_decrement}
								handleSetQuantity={handle_set_quantity}
								handleBlurQuantity={handle_blur_quantity}
								quantity={temp_quantity}
								error={error?.id === 1 ? false : error?.is_error}
								moq={min}
								product={product_data}
								handle_delete_entity={() => handle_delete_entity(is_custom_product ? custom_id : entity_id, cart_item_id)}
								current_product_reserved={current_product_reserved}
								product_total_quantity={product_total_quantity}
								is_discount_applied={is_discount_applied}
							/>
						</div>
						{!is_retail_mode && (
							<div className={classes.section_3_box} style={{ ...row_styles, ...theme?.order_management?.custom_gap_style }}>
								{item?.discount_value && item?.discount_type ? (
									<React.Fragment>
										{/* <CustomText type='Subtitle' color='rgba(0, 0, 0, 0.4)' style={{ textDecoration: 'line-through', marginRight: '8px' }}>
											{t('CartSummary.ProductCard.Price', {
												price: get_formatted_price_with_currency(currency_symbol, total_price),
											})}
										</CustomText> */}
										<CustomText type='Subtitle' color='rgba(0, 0, 0, 0.87)'>
											{t('CartSummary.ProductCard.Price', {
												price: get_formatted_price_with_currency(currency_symbol, Math.max(discount_price, 0)),
											})}
										</CustomText>
									</React.Fragment>
								) : is_price_modified ? (
									<ModifiedPriceComponent
										modified_price={total_modified_price}
										unit_price={total_price}
										currency_symbol={currency_symbol}
										base_price={total_price}
										alignItems='flex-end'
									/>
								) : (
									<Box display='flex' alignItems='center' gap={1}>
										<CustomText type='Subtitle' color='rgba(0, 0, 0, 0.87)'>
											{t('CartSummary.ProductCard.Price', {
												price: get_formatted_price_with_currency(currency_symbol, total_price),
											})}
										</CustomText>
									</Box>
								)}
							</div>
						)}
						<div className={classes.section_3_box}>
							<CustomText type='Body' color={error?.is_error ? '#D74C10' : '#ff6f00'} style={{ fontWeight: 500 }}>
								{error?.id === 12 && settings?.hide_backorder_error_on_cart ? '' : (error?.message || cart_error?.error_message) ?? ''}
							</CustomText>
						</div>
						{/* {cart_container_config?.tenant_container_enabled && (
							<div className={classes.section_3_box} style={row_styles}>
								<CustomText type='Body'>
									{toggle_button_value?.toUpperCase()}: {_.isNumber(total_volume) ? total_volume.toFixed(2) : '0.00'}
								</CustomText>
							</div>
						)} */}
					</div>
					<div>{(!is_small_screen || is_ultron) && handle_product_menu()}</div>
				</div>
			</div>

			{!is_ultron && is_small_screen && (
				<div className={classes.container}>
					<div className={classes.sub_container}>
						<CustomText type={is_small_screen ? 'Caption' : 'Subtitle'} className={classes.product_name}>
							{`${product_data?.name || ''} ${is_custom_product ? 'Custom' : ''}`}
						</CustomText>
						{is_small_screen &&
							!is_custom_product &&
							attributes?.map((row: any, _index: number) => (
								<p key={`attribute_row_${_index}`} className={classes.attribute}>
									{row?.attributes?.keys?.map((attr: any) => {
										const value = utils.transform_column_display(attr, product_data);
										if (!value) {
											return <></>;
										}
										return (
											<span className={classes.hinge_attr_value} key={attr}>
												<CustomText type='Caption' color={secondary[700]} className={classes.attr_value}>
													{value}
												</CustomText>
											</span>
										);
									})}
								</p>
							))}

						{!is_small_screen && is_store_front && !hide_view_similar && handle_render_view_similar()}
					</div>
					<div>{handle_product_menu()}</div>
				</div>
			)}

			<Grid className={classes.custom_grid_style1} alignItems={'center'}>
				<Grid container justifyContent={'space-between'} alignItems={'center'} mt={1}>
					{is_store_front && !hide_view_similar && handle_render_view_similar()}
					{handle_render_variant_chip()}
				</Grid>

				<Grid
					display={'flex'}
					width='100%'
					className={is_custom_product || is_store_front ? classes.custom_grid_style2 : classes.custom_grid_style3}>
					{!is_custom_product && is_ultron && handle_render_view_similar()}
					<Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
						{!is_note_there && (
							<CustomText
								type='H6'
								onClick={() => {
									set_show_note_modal(true);
									set_selected_product(product_data);
								}}
								color={theme?.button?.text_color}
								className={classes.add_note}>
								<Icon iconName='IconNote' size='small' />
								<p>{t('CartSummary.ProductMoreMenu.AddNote')}</p>
							</CustomText>
						)}
					</Grid>
				</Grid>
			</Grid>

			<NoteAndCustomize
				product_data={product_data}
				set_is_edit_modifiers={set_is_edit_modifiers}
				set_edit_product={set_edit_product}
				cart_error={cart_error}
				show_edit_btn
				notesValue={notesValue}
				cart_item_id={cart_item_id}
				entity_id={is_custom_product ? custom_id : entity_id}
				set_show_note_modal={set_show_note_modal}
				set_selected_product={set_selected_product}
				handle_remove_note={handle_remove_note}
			/>
			{item?.discount_type && !item?.discount_campaign_id && (
				<div className={classes.discount_bar}>
					<div className={classes.discount_header}>
						<Image src={ImageLinks.DiscountIconChecked} imgClass={classes.discount_img} />
						<div className={classes.discount_container}>
							{get_discount_label()}
							{discount_per_unit_price < 0 && (
								<CustomText type='Body' color='red'>
									{t('CartSummary.ProductCard.DiscountError', {
										price: get_formatted_price_with_currency(currency_symbol, unit_price),
									})}
								</CustomText>
							)}
						</div>
					</div>
					<div>
						{settings?.item_level_discount && (
							<Icon
								iconName='IconEdit'
								color={error?.is_error || product_disable_cart_error ? '#a8a8a8' : custom_stepper_text_color?.grey}
								sx={{ cursor: 'pointer', pointerEvents: error?.is_error ? 'none' : 'all' }}
								onClick={handle_edit_offer_discount}
							/>
						)}
					</div>
				</div>
			)}
			{drawer && (
				<SimilarDrawer
					drawer={drawer}
					setDrawer={setDrawer}
					simillar={product?.id}
					card_temp={all_product_card_template}
					discount_campaigns={discount_campaigns}
				/>
			)}
			{is_ultron && on_edit_price_change && (
				<div style={{ marginTop: '12px' }}>
					<Alert
						icon={
							<Icon
								iconName={is_price_increased ? 'IconTrendingUp' : 'IconTrendingDown'}
								color={is_price_increased ? '#16885F' : '#D74C10'}
							/>
						}
						action={
							<CustomText onClick={handle_apply} type='Subtitle' color='#16885F' style={{ cursor: 'pointer', marginRight: '10px' }}>
								Apply
							</CustomText>
						}
						sx={{ background: '#FCEFD6', padding: '0px 10px' }}>
						<Grid container>
							<Grid item>
								<CustomText>
									Sale price: <strong>{get_formatted_price_with_currency(currency_symbol, new_price)}</strong>{' '}
								</CustomText>
							</Grid>
						</Grid>
					</Alert>
				</div>
			)}
		</React.Fragment>
	);
};

const ProductCard = memo(ProductCardTemp);
export default ProductCard;
