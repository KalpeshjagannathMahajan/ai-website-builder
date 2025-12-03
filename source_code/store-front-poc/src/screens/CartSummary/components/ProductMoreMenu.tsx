import { useContext } from 'react';
import { makeStyles } from '@mui/styles';
import { Icon } from 'src/common/@the-source/atoms';
import Menu from 'src/common/Menu';
import CartSummaryContext from '../context';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import { useTheme } from '@mui/material/styles';
import { Mixpanel } from 'src/mixpanel';
import { ADHOC_ITEM } from '../helper';
import { check_permission, get_product_metadata } from 'src/utils/utils';
import { useSelector } from 'react-redux';
import { PERMISSIONS } from 'src/casl/permissions';
import Events from 'src/utils/events_constants';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

const useStyles = makeStyles(() => ({
	container: {
		width: '120px',
	},
}));

const ProductMoreMenu = ({ apply_discount, entity_id, is_note_there, product, cart_item_id, error, enable_custom_line_item }: any) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const theme: any = useTheme();
	const permissions = useSelector((state: any) => state?.login?.permissions);

	const {
		handle_delete_entity,
		handle_remove_note,
		set_show_discount_modal,
		set_selected_product,
		set_show_note_modal,
		handle_remove_discount,
		set_adhoc_data,
		set_open_custom_product,
		cart_metadata,
		customer_metadata,
		set_edit_price_modal_data,
	} = useContext(CartSummaryContext);

	const can_edit_product_price =
		check_permission(permissions, [PERMISSIONS.cart_price_override.slug]) &&
		product?.product_state !== ADHOC_ITEM &&
		!(product?.discount_type && product?.discount_value) &&
		!product?.is_custom_product;

	const handle_edit_adhoc_item = () => {
		set_adhoc_data(product);
		set_open_custom_product(true);
	};
	const menu_list = [
		{
			id: 'delete',
			data: {
				label: t('CartSummary.ProductMoreMenu.DeleteItem'),
			},
			onClick: () => handle_delete_entity(entity_id, cart_item_id),
		},
	];

	if (is_ultron) {
		menu_list.push({
			id: 'add-edit-note',
			onClick: () => {
				if (!error) {
					set_show_note_modal(true);
					set_selected_product(product);
					const product_metadata = get_product_metadata(product);
					Mixpanel.track(Events.ADD_PRODUCT_NOTE_OPTION_CLICKED, {
						tab_name: 'Home',
						page_name: 'cart_page',
						section_name: 'product_more_options',
						subtab_name: '',
						cart_metadata,
						customer_metadata,
						product_metadata,
					});
				}
			},
			data: {
				label: is_note_there ? t('CartSummary.ProductMoreMenu.EditNote') : t('CartSummary.ProductMoreMenu.AddNote'),
			},
		});
	}

	if (is_note_there && is_ultron) {
		menu_list.push({
			id: 'delete-note',
			data: {
				label: t('CartSummary.ProductMoreMenu.RemoveNote'),
			},
			onClick: () => !error && handle_remove_note(entity_id, cart_item_id),
		});
	}
	if (product?.product_state === ADHOC_ITEM && enable_custom_line_item) {
		menu_list.push({
			id: 'edit_adhoc_product',
			data: {
				label: t('CartSummary.ProductMoreMenu.EditAdhocItem'),
			},
			onClick: () => !error && handle_edit_adhoc_item(),
		});
	}

	if (apply_discount && product?.product_state !== ADHOC_ITEM && !product?.is_price_modified && is_ultron) {
		menu_list?.unshift({
			id: 'add-offer-discount',
			onClick: () => {
				if (!error) {
					set_show_discount_modal((prev: any) => !prev);
					set_selected_product(product);
					const product_metadata = get_product_metadata(product);
					Mixpanel.track(Events.OFFER_DISCOUNT_OPTION_CLICKED, {
						tab_name: 'Home',
						page_name: 'cart_page',
						section_name: 'product_more_options',
						subtab_name: '',
						cart_metadata,
						customer_metadata,
						product_metadata,
					});
				}
			},
			data: {
				label:
					product?.discount_value && product?.discount_type
						? t('CartSummary.ProductMoreMenu.EditDiscount')
						: t('CartSummary.ProductMoreMenu.Discount'),
			},
		});
	}

	if (product?.discount_type && product?.discount_value && is_ultron) {
		menu_list?.unshift({
			id: 'remove-offer-discount',
			onClick: () => {
				if (!error) {
					handle_remove_discount(product || {});
				}
			},
			data: {
				label: t('CartSummary.ProductMoreMenu.RemoveDiscount'),
			},
		});
	}
	// Need to memoise menu items to avoid unnecessary re-renders
	if (can_edit_product_price) {
		menu_list.push({
			id: 'edit-product-price',
			onClick: () => {
				if (error) return;
				const data_to_set = {
					show_modal: true,
					product,
				};
				set_edit_price_modal_data(data_to_set);
			},
			data: {
				label: t('CartSummary.ProductMoreMenu.EditPrice'),
			},
		});
	}

	return (
		<Menu
			LabelComponent={
				<div style={{ cursor: 'pointer' }}>
					<Icon iconName='IconDotsVertical' color={theme?.menu_item?.color} />
				</div>
			}
			hideGreenBorder={true}
			closeOnItemClick={true}
			commonMenuComponent={(_item: any) => {
				return (
					<div className={classes.container}>
						<CustomText type='Body' color={error && _item?.id !== 'delete' ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.87)'}>
							{_item.data?.label}
						</CustomText>
					</div>
				);
			}}
			menu={menu_list}
		/>
	);
};

export default ProductMoreMenu;
