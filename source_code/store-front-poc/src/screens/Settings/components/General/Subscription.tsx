import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid } from 'src/common/@the-source/atoms';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import utils from 'src/utils/utils';
import EditRailDrawer from '../Common/Drawer/EditRailDrawer';
import { useContext, useEffect, useState } from 'react';
import SettingsContext from '../../context';
import _ from 'lodash';
import {
	ORDER_TAG,
	ADD_ALL_TO_CART,
	EDIT_PRODUCT_PRICE_KEY,
	INTERCOM,
	TENANT_CONSTANTS,
	columnDef,
	DOWNLOAD_INVOICE,
	CHANGE_FULLFILLMENT_STATUS,
	DELETE_CUSTOMER,
	ENABLED_WISHLIST,
	DETOKENIZE,
	PAYMENT_INSTRUMENTS,
	PHYSICAL_COUNT_MODULE,
} from './mock';

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
];
//Subscriptions handling

const Subscription = () => {
	const [drawer, set_drawer] = useState<any>({ state: false, data: null });
	const { configure, update_configuration, get_keys_configuration } = useContext(SettingsContext);
	const [row_data, set_row_data] = useState<any>([]);
	const { tenant_settings } = configure;

	const should_disable_button = (data: any, key: string) =>
		(data?.name === 'WizPay' || data?.name === 'Show Payment Status') &&
		!_.find(row_data, { name: 'Payments' })?.is_active &&
		key === 'edit';

	const handle_edit = (params: any) => {
		set_drawer({ state: true, data: params?.node?.data });
	};

	const column_def = [
		...columnDef,
		{ ...utils.create_action_config(actions, handle_edit, 'Actions'), cellRendererParams: { should_disable_button } },
	];

	const handle_save = (data: any) => {
		const is_detokenize_active = _.find(data, (item) => item?.name === DETOKENIZE && item?.is_active);
		const is_payments_active = _.find(data, (item) => item?.name === 'Payments' && item?.is_active);
		const get_updated_data = () => {
			switch (data?.name) {
				case 'DAM':
				case 'Credits':
				case 'Invoices':
				case 'Reports':
				case 'WizAI':
				case 'Import / Export':
				case 'Product':
					if (data?.is_active) {
						return {
							...tenant_settings,
							excluded_permission_submodules: _.filter(
								tenant_settings?.excluded_permission_submodules,
								(submodule: string) => !_.includes(TENANT_CONSTANTS[data?.name]?.submodules, submodule),
							),
							excluded_permission_modules: _.filter(
								tenant_settings?.excluded_permission_modules,
								(module: string) => !_.includes(TENANT_CONSTANTS[data?.name]?.modules, module),
							),
						};
					} else {
						return {
							...tenant_settings,
							excluded_permission_submodules: _.union(
								tenant_settings?.excluded_permission_submodules,
								TENANT_CONSTANTS[data?.name]?.submodules,
							),
							excluded_permission_modules: _.union(tenant_settings?.excluded_permission_modules, TENANT_CONSTANTS[data?.name]?.modules),
						};
					}
				case 'Payments':
					if (data?.is_active) {
						return {
							...tenant_settings,
							enable_payment_status_change: true,
							excluded_permission_submodules: _.filter(
								tenant_settings?.excluded_permission_submodules,
								(submodule: string) => !_.includes(TENANT_CONSTANTS[data?.name]?.submodules, submodule),
							),
							excluded_permission_modules: _.filter(
								tenant_settings?.excluded_permission_modules,
								(module: string) =>
									!_.includes(TENANT_CONSTANTS[data?.name]?.modules, module) &&
									!_.includes(TENANT_CONSTANTS[PAYMENT_INSTRUMENTS]?.modules, module),
							),
							excluded_permission_slugs: _.union(tenant_settings?.excluded_permission_slugs, TENANT_CONSTANTS[DETOKENIZE]),
						};
					} else {
						return {
							...tenant_settings,
							enable_payment_status_change: false,
							excluded_permission_submodules: _.union(
								tenant_settings?.excluded_permission_submodules,
								TENANT_CONSTANTS[data?.name]?.submodules,
							),
							excluded_permission_modules: _.union(
								tenant_settings?.excluded_permission_modules,
								TENANT_CONSTANTS[data?.name]?.modules,
								!is_detokenize_active ? TENANT_CONSTANTS[PAYMENT_INSTRUMENTS]?.modules : [],
							),
						};
					}
				case 'Abandoned Cart':
					if (data?.is_active) {
						return {
							...tenant_settings,
							wizshop_abandoned_cart_enabled: true,
							excluded_permission_submodules: _.filter(
								tenant_settings?.excluded_permission_submodules,
								(submodule: string) => !_.includes(TENANT_CONSTANTS[data?.name]?.submodules, submodule),
							),
							excluded_permission_modules: _.filter(
								tenant_settings?.excluded_permission_modules,
								(module: string) => !_.includes(TENANT_CONSTANTS[data?.name]?.modules, module),
							),
						};
					} else {
						return {
							...tenant_settings,
							wizshop_abandoned_cart_enabled: false,
							excluded_permission_submodules: _.union(
								tenant_settings?.excluded_permission_submodules,
								TENANT_CONSTANTS[data?.name]?.submodules,
							),
							excluded_permission_modules: _.union(tenant_settings?.excluded_permission_modules, TENANT_CONSTANTS[data?.name]?.modules),
						};
					}
				case 'Labels':
				case 'WizPay':
				case EDIT_PRODUCT_PRICE_KEY:
					if (data?.is_active) {
						return {
							...tenant_settings,
							excluded_permission_slugs: _.filter(
								tenant_settings?.excluded_permission_slugs,
								(item: string) => !_.includes(TENANT_CONSTANTS[data?.name], item),
							),
						};
					} else {
						return {
							...tenant_settings,
							excluded_permission_slugs: _.union(tenant_settings?.excluded_permission_slugs, TENANT_CONSTANTS[data?.name]),
						};
					}
				case 'Offline mode':
					return {
						...tenant_settings,
						offline_feature_enabled: data?.is_active,
					};
				case 'Line item discount':
					return { ...tenant_settings, item_level_discount: data?.is_active };
				case 'Adhoc line item':
					return { ...tenant_settings, enable_custom_line_item: data?.is_active };
				case 'Excel templates':
					return { ...tenant_settings, enable_excel_sheet_format: data?.is_active };
				case 'Pricelist Switcher':
					return { ...tenant_settings, catalog_switching_enabled_at_buyer_level: data?.is_active };
				case 'Edit Confirm Order':
					return { ...tenant_settings, enable_confirmed_order_editing: data?.is_active };
				case 'Duplicate Customer':
					return { ...tenant_settings, is_duplicate_customer_allowed: data?.is_active };
				case 'Org Settings':
					return { ...tenant_settings, enable_org_settings: data?.is_active };
				case 'Duplicate Order':
					return { ...tenant_settings, duplicate_document_enabled: data?.is_active };
				case 'Repeat Order':
					return { ...tenant_settings, repeat_document_enabled: data?.is_active };
				case 'Delete Order':
					return { ...tenant_settings, enable_delete_cancelled_order: data?.is_active };
				case DELETE_CUSTOMER:
					return {
						...tenant_settings,
						buyer_deletion_allowed: data?.is_active,
						excluded_permission_slugs: data?.is_active
							? _.filter(tenant_settings?.excluded_permission_slugs, (item: string) => !_.includes(TENANT_CONSTANTS[data?.name], item))
							: _.union(tenant_settings?.excluded_permission_slugs, TENANT_CONSTANTS[data?.name]),
					};
				case CHANGE_FULLFILLMENT_STATUS:
					return {
						...tenant_settings,
						enable_fulfillment_status_change: data?.is_active,
						excluded_permission_slugs: data?.is_active
							? _.filter(tenant_settings?.excluded_permission_slugs, (item: string) => !_.includes(TENANT_CONSTANTS[data?.name], item))
							: _.union(tenant_settings?.excluded_permission_slugs, TENANT_CONSTANTS[data?.name]),
					};
				case 'Catalogs':
					return { ...tenant_settings, is_presentation_enabled: data?.is_active };
				case 'Show Payment Status':
					return { ...tenant_settings, enable_payment_status_change: data?.is_active };
				case 'MOQ Break':
					return { ...tenant_settings, moq_break_enabled: data?.is_active };
				case ORDER_TAG:
					return {
						...tenant_settings,
						document_tags_enabled: data?.is_active,
						excluded_permission_slugs: data?.is_active
							? _.filter(tenant_settings?.excluded_permission_slugs, (item: string) => !_.includes(TENANT_CONSTANTS[data?.name], item))
							: _.union(tenant_settings?.excluded_permission_slugs, TENANT_CONSTANTS[data?.name]),
					};
				case INTERCOM:
					return { ...tenant_settings, intercom_enabled: data?.is_active };
				case PHYSICAL_COUNT_MODULE:
					return { ...tenant_settings, physical_count_module: data?.is_active };
				case ADD_ALL_TO_CART:
					return { ...tenant_settings, add_all_to_cart: data?.is_active };
				case DOWNLOAD_INVOICE:
					return { ...tenant_settings, invoice_download_enabled: data?.is_active };
				case ENABLED_WISHLIST:
					return { ...tenant_settings, enable_wishlist: data?.is_active };
				case DETOKENIZE:
					if (data?.is_active) {
						return {
							...tenant_settings,
							excluded_permission_submodules: _.union(
								tenant_settings?.excluded_permission_submodules,
								TENANT_CONSTANTS.Payments?.submodules,
							),
							excluded_permission_modules: _.filter(
								_.union(tenant_settings?.excluded_permission_modules || [], TENANT_CONSTANTS.Payments?.modules || []),
								(module: string) => !_.includes(TENANT_CONSTANTS[PAYMENT_INSTRUMENTS]?.modules || [], module),
							),
							excluded_permission_slugs: _.filter(
								tenant_settings?.excluded_permission_slugs,
								(item: string) => !_.includes(TENANT_CONSTANTS[data?.name], item),
							),
						};
					} else {
						return {
							...tenant_settings,
							excluded_permission_slugs: _.union(tenant_settings?.excluded_permission_slugs, TENANT_CONSTANTS[data?.name]),
							excluded_permission_modules: _.union(
								tenant_settings?.excluded_permission_modules,
								!is_payments_active ? TENANT_CONSTANTS[PAYMENT_INSTRUMENTS]?.modules : [],
							),
						};
					}
			}
		};
		if (data?.name === 'Container') {
			update_configuration('cart_container_config', { ...configure?.cart_container_config, tenant_container_enabled: data?.is_active });
			return;
		}
		if (data?.name === 'Show Referal Banner') {
			update_configuration('banner_config', { ...configure?.banner_config, show_referral_banner: data?.is_active });
			return;
		}

		const updated_data = get_updated_data();
		update_configuration('tenant_settings', updated_data);
	};
	const height = row_data?.length * 50;

	const create_data = () => {
		const data = [
			{
				name: 'Abandoned Cart',
				is_active: tenant_settings?.wizshop_abandoned_cart_enabled ?? false,
			},
			{
				name: 'Catalogs',
				is_active: tenant_settings?.is_presentation_enabled ?? false,
			},
			{
				name: 'Payments',
				is_active: !_.includes(tenant_settings?.excluded_permission_modules, 'Payments'),
			},
			{
				name: 'Product',
				is_active: !_.includes(tenant_settings?.excluded_permission_modules, 'Product'),
			},
			{
				name: 'WizPay',
				is_active:
					!_.includes(tenant_settings?.excluded_permission_modules, 'Payments') &&
					!_.some(TENANT_CONSTANTS.WizPay, (item: string) => _.includes(tenant_settings?.excluded_permission_slugs, item)),
			},
			{
				name: 'Credits',
				is_active: !_.includes(tenant_settings?.excluded_permission_submodules, 'Credits'),
			},
			{
				name: 'Show Payment Status',
				is_active: tenant_settings?.enable_payment_status_change ?? false,
			},
			{
				name: 'Invoices',
				is_active: !_.includes(tenant_settings?.excluded_permission_modules, 'Invoice'),
			},
			{
				name: 'DAM',
				is_active: !_.includes(tenant_settings?.excluded_permission_modules, 'Files'),
			},
			{
				name: 'Offline mode',
				is_active: tenant_settings?.offline_feature_enabled ?? false,
			},
			{
				name: 'Show Referal Banner',
				is_active: configure?.banner_config?.show_referral_banner ?? false,
			},
			{
				name: 'Line item discount',
				is_active: tenant_settings?.item_level_discount ?? false,
			},
			{
				name: 'Pricelist Switcher',
				is_active: tenant_settings?.catalog_switching_enabled_at_buyer_level ?? false,
			},
			{
				name: 'Labels',
				is_active: !_.some(TENANT_CONSTANTS.Labels, (item: string) => _.includes(tenant_settings?.excluded_permission_slugs, item)),
			},
			{
				name: 'Reports',
				is_active: !_.includes(tenant_settings?.excluded_permission_modules, 'Report'),
			},
			{
				name: 'WizAI',
				is_active: !_.includes(tenant_settings?.excluded_permission_modules, 'WizAI'),
			},
			{
				name: 'Container',
				is_active: configure?.cart_container_config?.tenant_container_enabled ?? false,
			},
			{
				name: 'Import / Export',
				is_active: !_.includes(tenant_settings?.excluded_permission_modules, 'Import / Export'),
			},
			{
				name: 'Edit Confirm Order',
				is_active: tenant_settings?.enable_confirmed_order_editing ?? false,
			},
			{
				name: 'Adhoc line item',
				is_active: tenant_settings?.enable_custom_line_item ?? false,
			},
			{
				name: 'Excel templates',
				is_active: tenant_settings?.enable_excel_sheet_format ?? false,
			},
			{
				name: 'Org Settings',
				is_active: tenant_settings?.enable_org_settings ?? false,
			},
			{
				name: 'Duplicate Order',
				is_active: tenant_settings?.duplicate_document_enabled ?? false,
			},
			{
				name: 'Repeat Order',
				is_active: tenant_settings?.repeat_document_enabled ?? false,
			},
			{
				name: 'Duplicate Customer',
				is_active: tenant_settings?.is_duplicate_customer_allowed ?? false,
			},
			{
				name: 'Delete Order',
				is_active: tenant_settings?.enable_delete_cancelled_order ?? false,
			},
			{
				name: 'Delete Customer',
				is_active: tenant_settings?.buyer_deletion_allowed ?? false,
			},
			{
				name: 'Change Fulfillment Status',
				is_active: tenant_settings?.enable_fulfillment_status_change ?? false,
			},
			{
				name: 'MOQ Break',
				is_active: tenant_settings?.moq_break_enabled ?? false,
			},
			{
				name: EDIT_PRODUCT_PRICE_KEY,
				is_active: !_.some(TENANT_CONSTANTS[EDIT_PRODUCT_PRICE_KEY], (item: string) =>
					_.includes(tenant_settings?.excluded_permission_slugs, item),
				),
			},
			{
				name: ORDER_TAG,
				is_active: tenant_settings?.document_tags_enabled ?? false,
			},
			{
				name: INTERCOM,
				is_active: tenant_settings?.intercom_enabled ?? false,
			},
			{
				name: ADD_ALL_TO_CART,
				is_active: tenant_settings?.add_all_to_cart ?? false,
			},
			{
				name: DOWNLOAD_INVOICE,
				is_active: tenant_settings?.invoice_download_enabled ?? false,
			},
			{
				name: ENABLED_WISHLIST,
				is_active: tenant_settings?.enable_wishlist ?? false,
			},
			{
				name: DETOKENIZE,
				is_active: !_.some(TENANT_CONSTANTS[DETOKENIZE], (item: string) => _.includes(tenant_settings?.excluded_permission_slugs, item)),
			},
			{
				name: PHYSICAL_COUNT_MODULE,
				is_active: tenant_settings?.physical_count_module ?? false,
			},
		];
		set_row_data(data);
	};

	useEffect(() => {
		create_data();
	}, [configure?.tenant_settings, configure?.cart_container_config, configure?.banner_config]);

	useEffect(() => {
		get_keys_configuration('tenant_settings');
		get_keys_configuration('banner_config');
		get_keys_configuration('cart_container_config');
	}, []);

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header} mb={2}>
				<CustomText type='H2'>Subscription</CustomText>
			</Grid>
			<AgGridTableContainer
				columnDefs={column_def}
				hideManageColumn
				rowData={row_data}
				containerStyle={{ height: `${height + 100}px`, minHeight: '200px', maxHeight: '700px' }}
				showStatusBar={false}
			/>
			{drawer?.state && (
				<EditRailDrawer
					is_visible={drawer?.state}
					data={drawer?.data}
					close={() => set_drawer({ state: false, data: null })}
					handle_save={handle_save}
					entity='subscription'
				/>
			)}
		</Grid>
	);
};

export default Subscription;
