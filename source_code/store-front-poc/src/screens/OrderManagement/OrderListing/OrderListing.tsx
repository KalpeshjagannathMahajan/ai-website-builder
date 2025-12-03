/* eslint-disable @typescript-eslint/no-unused-vars */
import _, { isEmpty } from 'lodash';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { AgGridSSRMTableContainer } from 'src/common/@the-source/molecules/Table';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import { useDispatch, useSelector } from 'react-redux';
import { show_document_alert } from 'src/actions/document';
import { document, payment_status_constants } from '../mock/document';
import utils, { should_handle_click } from 'src/utils/utils';
import { IPermission } from 'src/@types/permissions';
import { PERMISSIONS } from 'src/casl/permissions';

import ActionComp from '../component/ActionComp';
import ALL_TABS, { EXPORT_DRAWER_SALES_TYPES, INVOICE_TAB } from '../constants';
import { TABLE_CONSTANTS } from 'src/common/@the-source/molecules/Table/constants';
import PaymentAmountComp from 'src/screens/BuyerDashboard/components/PaymentAmountComp';
import { useTheme } from '@mui/material/styles';
import { colors } from 'src/utils/theme';
import { t } from 'i18next';
import useStyles from '../styles';
import PaymentActionComp from 'src/screens/BuyerDashboard/components/PaymentActionComp';
import ExportDrawer from './ExportDrawer';
import { close_toast, show_toast } from 'src/actions/message';
import types from 'src/utils/types';
import EmptyTableComponent from 'src/common/@the-source/EmptyTableComponent';
import TableSkeleton from 'src/common/TableSkeleton';
import { IServerSideGetRowsParams } from 'ag-grid-community';
import api_requests from 'src/utils/api_requests';
import { time_range_list } from 'src/common/TimeRange/helper';
import order_listing, { SSRMInput } from 'src/utils/api_requests/orderListing';
import { Button, Grid, Skeleton } from '@mui/material';
import CustomText from 'src/common/@the-source/CustomText';
import { Chip, Icon, Tooltip } from 'src/common/@the-source/atoms';
// import classes from './../OrderManagement.module.css';
import {
	get_field_of_session_storage_item,
	get_formatted_price_with_currency,
	remove_field_of_session_storage_item,
} from 'src/utils/common';
import CustomActionRenderer from './CustomActionRenderer';
import CatalogSearch from './CatalogSearch';
import useCatalogActions from 'src/hooks/useCatalogActions';
import { set_is_edit_fetched } from 'src/actions/catalog_mode';
import useDownloadInvoice from '../../../hooks/useDownloadInvoice';
import { ACTION_KEYS } from 'src/screens/Presentation/constants';
import RegenerateModal from './RegenerateModal';
import AbandonedCartDrawer from '../component/AbandonedCart/AbandonedCartDrawer';
import { secondary } from 'src/utils/light.theme';
import { ImageTextCellRenderer } from 'src/common/@the-source/molecules/Table/TableComponent/CellRendererComponent';
import AchCellRenderer from 'src/screens/Payment/component/AchCellRenderer';
import payment_constants from 'src/screens/Payment/constants';

const transformFilterModel = (filterModel: any) => {
	let updatedFilterModel = _.cloneDeep(filterModel);
	_.forEach(updatedFilterModel, (child, key) => {
		// if (_.has(child, 'values') && _.isArray(child.values)) {
		// 	updatedFilterModel[key].values = _.map(child.values, (value) => {
		// 		if (value === 'converted to order') {
		// 			return 'accepted';
		// 		}
		// 		return value === null ? '' : value;
		// 	});
		// }
		// if (child?.filterType === 'set') {
		// 	const values = child?.values?.map((value: any) => value ?? '') || [''];
		// 	updatedFilterModel[key] = {
		// 		filterType: 'set',
		// 		values,
		// 	};
		// }
		if (child?.filterType === 'date') {
			const { dateFrom, dateTo, type } = child;
			const { from, to }: any = utils.getRange(dateFrom, dateTo, type);
			updatedFilterModel[key] = {
				filterType: 'number',
				type: 'inRange',
				filter: from * 1000,
				filterTo: to * 1000,
			};
		}
		// if (child?.filterType === 'unixdate') {
		// 	const { dateFrom, dateTo, type } = child;
		// 	const { from, to }: any = utils.getRange(dateFrom, dateTo, type);
		// 	updatedFilterModel[key] = {
		// 		filterType: 'number',
		// 		type: 'inRange',
		// 		filter: from,
		// 		filterTo: to,
		// 	};
		// }
	});

	return updatedFilterModel;
};

interface DocumentConfig {
	key: string;
	name: string;
	visible: boolean;
	type: string;
	isFilterable: boolean;
	isSortable: boolean;
	filterType: string;
	filterParams?: any;
	filter?: any;
}

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: ACTION_KEYS.EDIT,
	},
];

interface DocumentConfig {
	key: string;
	name: string;
	visible: boolean;
	type: string;
	isFilterable: boolean;
	isSortable: boolean;
	filterType: string;
	filterParams?: any;
	filter?: any;
}

type OutputObject = {
	headerName: string;
	field: string;
	resizable?: boolean;
	headerStyle?: {} | undefined;
	isVisible?: boolean;
	dtype: string;
	sortable?: boolean;
	filter?: any;
	filterParams?: any;
	editable?: boolean;
	cellStyle?: React.CSSProperties;
	width?: number;
	suppressMenu?: boolean;
	actions?: any;
	flex?: 1;
	pinned?: any;
	minWidth?: number;
};

const OrderListing = ({
	value,
	active_index,
	set_show_catalog_preview,
	set_preview_data,
	set_toast,
	set_file_to_share,
	set_open_email_modal,
}: any) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const location = useLocation();

	const [facets, set_facets] = useState<any>(null);
	const [is_modal_open, set_is_modal_open] = useState<boolean>(false);
	const [search_input, set_search_input] = useState<string>('');
	const [is_searched, set_is_searched] = useState<boolean>(true);
	const [summary, set_summary] = useState<any>(null);
	const [end_rows, set_end_rows] = useState<any>(null);
	const [document_config, set_document_config] = useState<DocumentConfig[]>([]);
	const [is_loading, set_is_loading] = useState<boolean>(true);
	const [count_loading, set_count_loading] = useState(true);
	const [payload_info, set_payload_info] = useState({});
	const [transform_info, set_transform_info] = useState({});
	const [open, set_open] = useState(false);
	const [total_count, set_total_count] = useState(0);
	const [total_rows, set_total_rows] = useState<any>(null);
	const [grid_api, set_grid_api] = useState<any>(null);
	const [is_filter_active, set_is_filter_active] = useState(false);
	const [refetch, set_refetch] = useState<boolean>(false);
	const [modal_data, set_modal_data] = useState({});
	const [is_refetch, set_is_refetch] = useState(0);
	const [in_progress_rows, set_in_progress_rows] = useState<any>([]);

	const currency = useSelector((state: any) => state?.settings?.currency);
	const [abaondoned_drawer, set_abandoned_drawer] = useState<any>({ state: false, data: {} });
	const [is_abandoned_changed_to_view, set_is_abandoned_changed_to_view] = useState<any>({});
	const {
		handle_download,
		handle_copy_to_clipboard,
		handle_navigate_to_edit,
		handle_regenerate_catalog_pdf,
		enable_edit_mode,
		handle_reset_catalog_mode,
	} = useCatalogActions();
	const { handle_download_invoice } = useDownloadInvoice();

	const classes = useStyles();
	const theme: any = useTheme();
	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';
	const default_ssrm_config = useSelector((state: any) => state.settings.default_ssrm_config);
	const { invoice_download_enabled = false } = useSelector((state: any) => state.settings);

	const permissions = useSelector((state: any) => state?.login?.permissions);

	const [search_params, set_search_params] = useSearchParams();
	let new_search_params = new URLSearchParams();

	let buyer_id: any = search_params.get('buyer_id');
	new_search_params.append('buyer_id', buyer_id);

	let buyer_name: any = search_params.get('buyer');
	new_search_params.append('buyer', buyer_name);

	let date: any = search_params.get('date');
	new_search_params.append('date', date);

	let sales_rep_id: any = search_params.get('sales_rep');
	new_search_params.append('sales_rep', sales_rep_id);

	const formattedDate: any = {
		today: time_range_list.today.data.value(),
		last_week: time_range_list.last_week.data.value(),
		last_30_days: time_range_list.last_30_days.data.value(),
		last_3_months: time_range_list.last_3_months.data.value(),
		last_6_months: time_range_list.last_6_months.data.value(),
		last_12_months: time_range_list.last_12_months.data.value(),
		all_time: time_range_list.all_time.data.value(),
	};

	let isFirstRender = true;

	const default_filters = useMemo(
		() => [
			{},
			{
				type: {
					filterType: 'text',
					type: 'equals',
					filter: 'order',
					filterTo: null,
				},
			},
			{
				type: {
					filterType: 'text',
					type: 'equals',
					filter: 'quote',
					filterTo: null,
				},
			},
			{
				document_status: {
					filterType: 'text',
					type: 'equals',
					filter: 'draft',
					filterTo: null,
				},
			},
			{
				type: {
					filterType: 'text',
					type: 'equals',
					filter: 'invoice',
					filterTo: null,
				},
			},
			{},
		],
		[],
	);

	const created_at_filter = date
		? {
				[value === 'payments' ? 'record_date_milliseconds' : 'created_at_milliseconds']: {
					filterType: 'number',
					type: 'greaterThan',
					filter: Math.floor(formattedDate[date]),
				},
		  }
		: {};

	const sales_rep_filter = sales_rep_id
		? value === 'payments'
			? {
					sales_rep_info: {
						filterType: 'set',
						values: [sales_rep_id],
					},
			  }
			: {
					'user_details.id': {
						filterType: 'text',
						type: 'equals',
						filter: sales_rep_id,
					},
			  }
		: {};

	const buyer_filter =
		buyer_id && value === 'payments'
			? {
					buyer_info: {
						filterType: 'set',
						values: [buyer_id],
					},
			  }
			: value === ALL_TABS.abaondoned_cart.value
			? {
					customer_info: {
						filterType: 'set',
						values: [buyer_id],
					},
			  }
			: {};

	const buyer_name_filter =
		buyer_name && value !== ALL_TABS.abaondoned_cart.value
			? {
					'buyer_details.name': {
						filterType: 'text',
						type: 'equals',
						filter: buyer_name,
					},
			  }
			: {};

	const get_default_sorting = (type: any) => {
		switch (type) {
			case 'payments':
				// return _.get(default_ssrm_config, 'sorting.payment_ssrm', []);
				return [];
			case ALL_TABS.abaondoned_cart.value:
				return _.get(default_ssrm_config, 'sorting.abandoned_ssrm', []);
			case 'invoices':
				return _.get(default_ssrm_config, 'sorting.invoice_ssrm', []);
			case 'catalogs':
				return _.get(default_ssrm_config, 'sorting.catalog_ssrm', []);
			default:
				return _.get(default_ssrm_config, 'sorting.order_ssrm', []);
		}
	};

	const show_download_icon = EXPORT_DRAWER_SALES_TYPES.includes(value);

	const transformData = (data: any) => {
		return data?.map((item: any) => {
			let total_value_temp = 0;
			try {
				total_value_temp = parseFloat((Math.floor(item?.total_value * 100) / 100)?.toFixed(2));
			} catch {
				console.error('Unable to calculate the total value');
			}
			const getNameOrEmail = (firstName: string, lastName: string, email: string) => {
				if (firstName || lastName) {
					return `${firstName || ''} ${lastName || ''}`.trim();
				}
				return email;
			};
			let firstName = _.get(item, 'user_details.first_name');
			let lastName = _.get(item, 'user_details.last_name');
			let email = _.get(item, 'user_details.email');
			const name = getNameOrEmail(firstName, lastName, email);
			const payment_status = payment_status_constants[_.get(item, 'payment_status')]?.label;
			if (value === 'catalogs') {
				return {
					...item,
					updated_at_milliseconds: item?.updated_at_milliseconds / 1000,
					created_at_milliseconds: item?.created_at_milliseconds / 1000,
				};
			}
			return {
				...item,
				total_value: total_value_temp,
				table_type: value === 'payments' ? 'payment' : 'invoice',
				name,
				source: item?.source === 'wizshop' ? 'Website' : item?.source || '',
				payment_status,
			};
		});
	};

	// const getValueFromCurrentURL = () => {
	// 	const path = window.location.pathname;
	// 	const parts = path.split('/');
	// 	return parts[parts.length - 1];
	// };

	const handle_navigate_on_click = (params: any) => {
		if (value === ALL_TABS.abaondoned_cart.value) {
			set_abandoned_drawer({ state: true, data: params?.node?.data });
		}
		// check if the click is cmd or ctrl click
		if (params?.event && !should_handle_click(params?.event)) return;

		if (_.get(params, 'node.data.type') === 'invoice') {
			let invoice_url = _.get(params, 'node.data.invoice_url');
			if (invoice_download_enabled) {
				const row_data = _.get(params, 'node.data');
				handle_download_invoice(row_data?.id);
			} else if (invoice_url) {
				window.open(invoice_url, '_blank');
				handle_reset_catalog_mode();
			} else {
				dispatch<any>(
					show_toast({
						open: true,
						showCross: false,
						anchorOrigin: {
							vertical: types.VERTICAL_TOP,
							horizontal: types.HORIZONTAL_CENTER,
						},
						autoHideDuration: 3000,
						onClose: () => dispatch(close_toast('')),
						state: types.WARNING_STATE,
						title: t('OrderManagement.Invoices.InvalidInvoiceUrlTitle'),
						subtitle: '',
						showActions: false,
					}),
				);
			}
			return;
		}

		if (_.get(params, 'node.data.id') && _.get(params, 'node.data.type')) {
			let status = _.get(params, 'node.data.document_status');
			let get_document_status = utils.handle_get_status(status);

			const route = is_ultron ? RouteNames.product.review.routing_path : RouteNames.product.checkout.routing_path;
			if (!get_document_status && status === document?.DocumentStatus?.draft) {
				navigate(`${route}${_.get(params, 'node.data.type')}/${_.get(params, 'node.data.id')}`);
				dispatch(show_document_alert(false));
				handle_reset_catalog_mode();
				return;
			}
			navigate(
				`${RouteNames.product.review.routing_path}${_.get(params, 'node.data.type')}/${_.get(
					params,
					'node.data.id',
				)}/${get_document_status}`,
				{
					state: {
						from: 'order-listing',
					},
				},
			);
			dispatch(show_document_alert(false));
			handle_reset_catalog_mode();
		}
	};

	const handle_get_dtype = (name: any, dtype: any, key: any) => {
		if (name === 'Order value' || name === 'Amount') {
			return 'currency';
		}
		if (name === 'Reference ID') {
			return 'imageText2';
		}

		if (key === 'transaction_status') {
			return 'tags';
		}

		if (TABLE_CONSTANTS.INTERNAL_STATUS_HEADER_NAME.includes(name) && dtype === 'tags') {
			return 'internal_status';
		}

		return dtype;
	};

	const handle_refetch = () => {
		set_refetch((prev: boolean) => !prev);
	};

	const handle_catalog_actions = (params: any, key: string) => {
		const pdf_link = _.get(params, 'data.pdf_link', '');
		const name = _.get(params, 'data.name', '');
		switch (key) {
			case ACTION_KEYS.COPY_LINK:
				handle_copy_to_clipboard(pdf_link);
				break;
			case ACTION_KEYS.EDIT:
				if (!params?.data?.id) return;
				dispatch(set_is_edit_fetched(false));
				handle_navigate_to_edit(params?.data?.id);
				enable_edit_mode(params?.data?.id);
				break;
			case ACTION_KEYS.DOWNLOAD:
				handle_download(pdf_link);
				break;
			case ACTION_KEYS.REGENERATE:
				handle_regenerate_catalog_pdf(params?.data?.id);
				set_is_refetch((prev) => prev + 1);
				set_in_progress_rows([{ ...params?.data, pdf_status: 'In Progress' }]);
				break;
			case ACTION_KEYS.MAIL:
				set_file_to_share([
					{
						fileLink: pdf_link,
						txt: name,
					},
				]);
				set_open_email_modal(true);
				break;
			default:
				break;
		}
	};

	const handle_catalog_view = (params: any) => {
		const pdf_url = _.get(params, 'data.pdf_link', '');
		const pdf_status = _.get(params, 'data.pdf_status', '');

		if (pdf_status === 'Failed') return;

		if (_.isEmpty(pdf_url)) {
			dispatch<any>(
				show_toast({
					open: true,
					showCross: false,
					anchorOrigin: {
						vertical: types.VERTICAL_TOP,
						horizontal: types.HORIZONTAL_CENTER,
					},
					autoHideDuration: 3000,
					onClose: () => dispatch(close_toast('')),
					state: types.WARNING_STATE,
					title: 'No preview available',
					subtitle: '',
					showActions: false,
				}),
			);
			return;
		}
		const mapped_data = {
			id: _.get(params, 'data.id', ''),
			name: _.get(params, 'data.name', ''),
			url: pdf_url,
			show_price: _.get(params, 'data.show_price', false),
			template_id: _.get(params, 'data.template_id', null),
			product_ids: _.get(params, 'data.product_ids', []),
			pdf_status: _.get(params, 'data.pdf_status', ''),
		};
		set_preview_data(mapped_data);
		set_show_catalog_preview(true);
	};

	const convertToNewStructure = (inputArray: DocumentConfig[], order_edit_permission: any): OutputObject[] => {
		if (_.isNull(facets)) return [];

		let newArray: OutputObject[] = inputArray.map((item) => {
			let column_props = {};

			const formatValue = (val: any, key: string, constants: any) => {
				if (!val || val.key === '') {
					return '(Blanks)';
				}
				if (val.key === 'accepted') {
					return 'converted to order';
				}
				if (key === 'payment_status' && constants[val.key]) {
					return `${constants[val.key].label}`;
				}
				return val?.label || val.key;
			};

			if (item?.key === 'buyer_details.name') {
				column_props = {
					headerName: 'Customer',
				};
			}

			if (item?.key === 'record_date_milliseconds') {
				column_props = {
					format: 'DD/MM/YY hh:mm A',
				};
			}

			if (value === ALL_TABS.abaondoned_cart.value && item?.key === 'total_skus') {
				column_props = {
					cellRenderer: (params: any) => {
						const items = params?.data;

						return (
							<Chip
								size={'medium'}
								label={
									<Grid display='flex' flex-direction='row' gap={1}>
										<CustomText type='Subtitle'>{`${items?.total_skus || 'N/A'} ${items?.total_skus > 1 ? 'SKUs' : 'SKU'}`} </CustomText>
										<span className='text-sm text-gray-500 font-light'>
											{`(${items?.total_units || 'N/A'} ${items?.total_units > 1 ? 'units' : 'unit'})`}
										</span>
									</Grid>
								}
								bgColor={secondary[100]}
								textColor={colors.black}
							/>
						);
					},
				};
			}
			if (value === ALL_TABS.abaondoned_cart.value && item?.key === 'cart_total') {
				column_props = {
					cellRenderer: (params: any) => {
						const items = params?.data;

						return (
							<Grid display='flex' flex-direction='row' gap={1}>
								<CustomText type='Subtitle'>{get_formatted_price_with_currency(currency, items?.cart_total)} </CustomText>
							</Grid>
						);
					},
				};
			}
			if (item?.name === 'Amount' || item?.name === 'Balance due') {
				column_props = {
					cellRenderer: (params: any) => <PaymentAmountComp item_name={item?.name} {...params} />,
				};
			}
			if (item?.key === 'name' && value === 'catalogs') {
				column_props = {
					cellRenderer: (params: any) => {
						return <CustomText type='Subtitle'>{params?.value}</CustomText>;
					},
					onCellClicked: (params: any) => {
						if (!should_handle_click(params?.event)) return;

						if (params?.data?.pdf_status !== 'Failed') handle_catalog_view(params);
						else set_modal_data(params?.data);
					},
				};
			}

			if (item.filterType === 'set') {
				column_props = {
					filterParams: {
						values: facets?.[item.key],
						keyCreator: (params: any) => params?.value?.key,
						valueFormatter: (params: any) => {
							const formattedValue = formatValue(params.value, item.key, payment_status_constants);
							const count = params?.value?.doc_count;
							return count ? `${formattedValue} (${count})` : formattedValue;
						},
					},
				};
			}

			if (item.filterType === 'range') {
				column_props = {
					filterParams: {
						values: facets?.[item.key],
						keyCreator: (params: any) => params?.value?.key,
						valueFormatter: (params: any) => {
							const formattedValue = formatValue(params.value, item.key, payment_status_constants);
							const count = params?.value?.doc_count;
							return count ? `${formattedValue} (${count})` : formattedValue;
						},
					},
				};
			}

			if (value === ALL_TABS?.payments?.value) {
				if (item?.key === 'settlement_status_info') {
					column_props = {
						...column_props,
						cellRenderer: (params: any) => {
							const settlement_config =
								payment_constants.ssrm_constants.settlement_status[_.isEmpty(params?.value?.value) ? 'unknown' : params?.value?.value];
							return (
								<Chip textColor={settlement_config?.text_color} label={settlement_config?.label} bgColor={settlement_config?.bg_color} />
							);
						},
					};
				}

				if (item?.key === 'payment_method_info') {
					column_props = {
						...column_props,
						cellRenderer: (params: any) => {
							const payment_method_type = params?.data?.payment_method_type;
							const source = params?.data?.source;
							const sub_title = params?.data?.sub_title;
							if (
								(payment_method_type !== 'ach' && !_.isEmpty(payment_method_type)) ||
								(payment_method_type === 'ach' && source === 'manual')
							) {
								return <ImageTextCellRenderer valueFormatted={params?.value} value={params?.value} />;
							}
							if (payment_method_type === 'ach' && (source === 'ach' || !_.isEmpty(sub_title))) {
								return <AchCellRenderer value={params?.data?.sub_title} />;
							} else return '--';
						},
					};
				}
			}

			return {
				headerName: item.name,
				field: item?.key,
				resizable: true,
				headerStyle: {},
				unSortIcon: true,
				lockPinned: item.name === 'Reference ID' || item.name === 'Invoice ID',
				clickable: item.name === 'Reference ID' || item.name === 'Invoice ID',
				hide: !item.visible,
				type: handle_get_dtype(item?.name, item?.type, item?.key),
				dtype: handle_get_dtype(item?.name, item?.type, item?.key),
				filter: item?.filter,
				sortable: item?.isSortable,
				hideFilter: !item?.isFilterable,
				minWidth: 200,
				editable: false,
				isHyperLink: item?.name === 'Reference ID' || item?.name === 'Invoice ID',
				onCellClicked:
					item.name === 'Reference ID' || item.name === 'Invoice ID'
						? (params: any) => {
								handle_navigate_on_click(params);
						  }
						: '',
				...column_props,
			};
		});

		newArray = [utils.create_serial_number_config(), ...newArray];

		if (value !== 'invoices' && value !== 'payments' && value !== 'catalogs' && order_edit_permission?.toggle) {
			let actionColumn: any = utils.create_action_config(actions, handle_navigate_on_click);
			actionColumn = { ...actionColumn, cellRenderer: ActionComp };
			newArray.push(actionColumn);
		}

		if ((value === 'invoices' || value === 'payments') && value !== 'catalogs') {
			const actionColumn: any = {
				headerName: 'Actions',
				field: 'action',
				editable: false,
				filter: false,
				dtype: 'action',
				lockPinned: true,
				resizable: false,
				pinned: 'right',
				cellStyle: {
					background: theme?.order_management?.order_listing?.cell_background_color,
					width: '120px',
					justifyContent: 'center',
					alignItems: 'center',
					minWidth: '120px',
					textAlign: 'center',
					borderRadius: '0px',
					borderWidth: '0px 0px 0px 1px',
					borderColor: '#ddd4d1',
				},
				sortable: false,
				headerStyle: {
					width: '120px',
				},
				width: 120,
				flex: 1,
				minWidth: 120,
				suppressMenu: true,
				cellRenderer: PaymentActionComp,
				cellRendererParams: {
					set_toast,
					refetch: handle_refetch,
				},
			};
			newArray.push(actionColumn);
		}
		if (value === 'catalogs') {
			const actionColumn: any = {
				headerName: 'Actions',
				field: 'action',
				editable: false,
				filter: false,
				dtype: 'action',
				lockPinned: true,
				resizable: false,
				pinned: 'right',
				cellStyle: {
					background: 'transparent',
					width: '120px',
					justifyContent: 'center',
					alignItems: 'center',
					minWidth: '120px',
					textAlign: 'center',
					borderRadius: '0px',
					borderWidth: '0px 0px 0px 1px',
					borderColor: '#ddd4d1',
				},
				sortable: false,
				headerStyle: {
					width: '120px',
				},
				width: 120,
				flex: 1,
				minWidth: 120,
				suppressMenu: true,
				cellRenderer: CustomActionRenderer,
				cellRendererParams: {
					handle_catalog_actions,
				},
			};
			newArray.push(actionColumn);
		}

		if (newArray.length > 0) {
			_.set(newArray, '[0].flex', 1);
		}
		if (newArray.length > 1) {
			_.set(newArray, '[1].flex', 1);
		}

		return newArray;
	};

	const edit_order_permission = permissions.find((item: IPermission) => item.slug === PERMISSIONS?.edit_orders.slug);

	const handle_value = (path: string): string => {
		const value_from_path = path.split('?')[0];
		switch (value_from_path) {
			case RouteNames.order_management.order_list.path:
				return 'orders';
			case RouteNames.order_management.quote_list.path:
				return 'quotes';
			case RouteNames.order_management.draft_list.path:
				return 'drafts';
			case RouteNames.order_management.invoices.path:
				return 'invoices';
			case RouteNames.order_management.payments.path:
				return 'payments';
			case RouteNames.order_management.abandoned_carts.path:
				return ALL_TABS.abaondoned_cart.value;
			case RouteNames.order_management.catalogs.path:
				return ALL_TABS.catalogs.value;
			default:
				return 'orders';
		}
	};

	const create_datasource = () => {
		return {
			getRows(params: IServerSideGetRowsParams) {
				let name = handle_value(window.location.pathname);
				let params_from_url = new URLSearchParams(window.location.search);
				let storedParams: any = sessionStorage.getItem('params_data');
				let filter: any = {
					value,
					params: '',
				};
				if (typeof storedParams === 'string') {
					try {
						storedParams = JSON.parse(storedParams);
						filter = storedParams[value];
					} catch (err) {}
				}
				set_count_loading(true);

				const check_buyer_id: boolean = params_from_url.get('buyer_id') !== null;
				const check_buyer_name: boolean = params_from_url.get('buyer') !== null;
				const check_date: boolean = params_from_url.get('date') !== null;
				const check_sales_rep = params_from_url.get('sales_rep') !== null;

				const default_sorting = get_default_sorting(value);
				const urlParams = new URLSearchParams(window?.location?.search);
				let filtersParam: string = new URLSearchParams(filter?.params).get('filter') ?? '';
				if (name === value) {
					if (
						(params_from_url.get('filter') && params_from_url.get('filter') !== '') ||
						check_buyer_id ||
						check_date ||
						check_sales_rep ||
						check_buyer_name
					) {
						filtersParam = params_from_url.get('filter') ?? '';
					}
				}
				const paramFiltering = utils.parse_and_check_json(filtersParam);

				let { startRow, endRow, filterModel, sortModel } = params.request;

				let filterData = { ...paramFiltering, ...filterModel };
				if (name === value) {
					if (check_buyer_name) {
						filterData = {
							...buyer_name_filter,
							...filterModel,
						};
					}
					if (check_buyer_id) {
						filterData = {
							...buyer_filter,
							...filterModel,
						};
					}
					if (check_date) {
						filterData = {
							...created_at_filter,
							...filterModel,
						};
					}
					if (check_sales_rep) {
						filterData = {
							...sales_rep_filter,
							...filterModel,
						};
					}
				}

				const condition = isFirstRender || check_date || check_buyer_id || check_sales_rep || check_buyer_name;
				const transformedFilterModel = transformFilterModel(condition ? filterData : filterModel);

				let payload: any = {
					startRow,
					endRow,
					sortModel: _.isEmpty(sortModel) ? default_sorting : sortModel,
					filterModel: {
						...default_filters[active_index],
						...transformedFilterModel,
					},
				};

				if (name === value) {
					if (check_buyer_name) {
						payload = {
							...payload,
							filterModel: {
								...payload.filterModel,
								...buyer_name_filter,
							},
						};
					}
					if (check_buyer_id) {
						payload = {
							...payload,
							filterModel: {
								...payload.filterModel,
								...buyer_filter,
							},
						};
					}
					if (check_date) {
						payload = {
							...payload,
							filterModel: {
								...payload.filterModel,
								...created_at_filter,
							},
						};
					}
					if (check_sales_rep) {
						payload = {
							...payload,
							filterModel: {
								...payload.filterModel,
								...sales_rep_filter,
							},
						};
					}
					if (urlParams.get('search')) {
						if (value === 'catalogs') {
							payload = { ...payload, search_field: 'product_sku_ids', search: search_input || urlParams.get('search') || '' };
						}
					} else if (value === 'catalogs') {
						payload = { ...payload, search_field: 'product_sku_ids', search: search_input || urlParams.get('search') || '' };
					}
				}

				if (filtersParam && filtersParam !== '') {
					set_is_filter_active(true);
				}

				if (name === value) {
					let paramsToCache: any = paramFiltering;
					if (!_.isEmpty(transformedFilterModel)) {
						params_from_url.set('filter', JSON.stringify(transformedFilterModel));
						window.history.pushState({}, '', `${window.location.pathname}?${params_from_url.toString()}`);
						paramsToCache = params_from_url.toString();
						set_is_filter_active(true);
					} else if (name === value) {
						window.history.pushState({}, '', `${window.location.pathname}`);
						paramsToCache = '';
						set_is_filter_active(false);
					}
					if (value === 'catalogs') {
						urlParams.set('search', search_input || '');
						window.history.pushState({}, '', `${window.location.pathname}?${urlParams.toString()}`);
						paramsToCache = urlParams.toString();
					}

					if (!check_buyer_id && !check_date && !check_sales_rep) {
						let cache = {
							[value]: {
								value,
								params: paramsToCache,
								search: search_input || '',
							},
						};
						if (typeof storedParams === 'object') {
							sessionStorage.setItem(
								'params_data',
								JSON.stringify({
									...storedParams,
									...cache,
								}),
							);
						} else {
							sessionStorage.setItem('params_data', JSON.stringify(cache));
						}
					}
				}

				set_payload_info(payload);

				set_transform_info(transformedFilterModel);

				const get_api: any = () => {
					switch (value) {
						case 'invoices':
							return api_requests.buyer.get_invoices_ssrm;
						case 'payments':
							return api_requests.buyer.get_payments_ssrm;
						case ALL_TABS.abaondoned_cart.value:
							return order_listing.get_abandoned_cart_row_data;
						case ALL_TABS.catalogs.value:
							return api_requests.buyer.get_presentations_ssrm;
						default:
							return api_requests.order_listing.get_document_list;
					}
				};
				get_api()(payload as SSRMInput)
					.then((res: any) => {
						if (_.get(res, 'status') === 200) {
							let data: any;
							if (
								value === 'invoices' ||
								value === 'payments' ||
								value === ALL_TABS.abaondoned_cart.value ||
								value === ALL_TABS.catalogs.value
							)
								data = res;
							else data = res?.data;
							const newData = transformData(data?.data);
							if (value === ALL_TABS.abaondoned_cart.value) {
								_.map(newData, (items, index) => {
									if (
										_.values(is_abandoned_changed_to_view).length > 0 &&
										is_abandoned_changed_to_view?.id === items?.id &&
										is_abandoned_changed_to_view?.updated_at_milliseconds === items?.updated_at_milliseconds
									) {
										newData[index].status = 'viewed';
									}
								});
							}

							if (_.isEmpty(transformedFilterModel)) set_total_count(data?.total);
							if (_.isEmpty(sortModel) && default_sorting) {
								params.columnApi.applyColumnState({
									state: default_sorting,
									defaultState: { sort: default_sorting },
								});
							}
							if (endRow && endRow >= 10000) {
								set_toast({
									show: true,
									message: t('OrderManagement.OrderListing.ToastMessage', { type: value }),
									title: '',
									status: 'warning',
								});
							}
							set_total_rows(data?.total);
							set_count_loading(false);
							set_end_rows(endRow);
							set_facets(data?.facet);
							set_summary(data?.summary);
							if (data) {
								params.success({ rowData: newData as DocumentConfig[], rowCount: data?.total > 10000 ? 10000 : data?.total });
							}

							if (value === 'catalogs') {
								const in_progress: any = _.filter(newData, (item: any) => item?.pdf_status === 'In Progress');
								set_in_progress_rows(in_progress);
								if (_.size(in_progress) > 0) set_is_refetch((prev) => prev + 1);
							}

							isFirstRender = false;
						}
					})
					.catch(() => {
						params.fail();
						isFirstRender = false;
					});
			},
		};
	};

	const data_source = useMemo(() => create_datasource(), [is_searched, refetch]);

	useEffect(() => {
		if (is_refetch === 0 || value !== 'catalogs' || _.isEmpty(payload_info)) return;

		let updated_ids_in_progress: any = [];
		let updated_ids_not_in_progress: any = [];

		const fetchData = () => {
			if (is_refetch === 0 || value !== 'catalogs') return;
			api_requests.buyer
				.get_presentations_ssrm(payload_info)
				.then((res: any) => {
					if (_.get(res, 'status') === 200) {
						let data: any;
						if (value === 'invoices' || value === 'payments' || value === ALL_TABS.catalogs.value) data = res;
						else data = res?.data;
						const newData = transformData(data?.data);

						let ids: any = in_progress_rows.map((item: any) => item.id);

						newData.forEach((item: any) => {
							if (ids.includes(item.id)) {
								if (item?.pdf_status === 'In Progress') {
									updated_ids_in_progress.push(item);
								} else {
									updated_ids_not_in_progress.push(item);
								}
							}
						});

						grid_api?.api?.applyServerSideTransactionAsync({
							update: [...updated_ids_in_progress, ...updated_ids_not_in_progress],
						});

						if (_.size(updated_ids_not_in_progress) > 0) {
							set_facets(data?.facet);
						}

						set_in_progress_rows(updated_ids_in_progress);

						if (_.size(updated_ids_in_progress) > 0) {
							set_is_refetch((prev) => prev + 1);
						} else {
							set_is_refetch(0);
						}
					}
				})
				.catch((err) => console.error(err));
		};

		const intervalId = setInterval(() => {
			fetchData();
		}, 5000);

		return () => clearInterval(intervalId);
	}, [is_refetch]);

	const on_first_data_rendered = (params: any) => {
		let paramsData: any = get_field_of_session_storage_item('params_data', value);
		let filter = _.get(paramsData, 'params', '');
		const urlParams = new URLSearchParams(window.location.search);
		const filtersParam =
			(handle_value(location.pathname) === value && urlParams.get('filter') ? urlParams.get('filter') : false) ||
			new URLSearchParams(filter).get('filter') ||
			'';
		const paramFiltering = utils.parse_and_check_json(filtersParam);
		if (paramFiltering) params.api.setFilterModel(paramFiltering);
	};

	useEffect(() => {
		let params: any;
		if (INVOICE_TAB === location.pathname) {
			params = '?type=invoice';
		}
		const get_api: any = () => {
			switch (value) {
				case 'invoices':
					return api_requests.buyer.get_invoices_config();
				case 'payments':
					return api_requests.buyer.get_payments_config();
				case ALL_TABS.abaondoned_cart.value:
					return order_listing.get_abandoned_cart();
				case ALL_TABS.catalogs.value:
					return api_requests.buyer.get_presentations_listing_config();
				default:
					return api_requests.order_listing.get_document_config(params);
			}
		};
		get_api()
			.then((res: any) => {
				if (_.get(res, 'status') === 200) {
					if (
						value === 'invoices' ||
						value === 'payments' ||
						value === ALL_TABS.abaondoned_cart.value ||
						value === ALL_TABS.catalogs.value
					) {
						const data = Object.values(res).filter((column: any) => typeof column === 'object' && column.key);
						if (Array.isArray(data)) {
							set_document_config(data as DocumentConfig[]);
						} else {
							console.error('Invalid response format for columns_defs');
						}
					} else {
						let data: any = _.get(res, 'data');
						if (data) {
							const user_details = _.findIndex(data, { key: 'user_details.first_name' });
							if (user_details) {
								_.set(data, `[${user_details}].key`, 'name');
							}
							if (Array.isArray(data)) data = _.uniqBy(data, 'key');
							if (Array.isArray(data)) {
								set_document_config(data as DocumentConfig[]);
							}
						}
					}
					set_is_loading(false);
				}
			})
			.finally(() => {
				set_is_loading(false);
			});
	}, []);

	const handle_get_tab = (val: any) => {
		switch (val) {
			// case 'all':
			// 	return 'Rows';
			case 'orders':
				return 'Orders';
			case 'quotes':
				return 'Quotes';
			case 'drafts':
				return 'Drafts';
			case 'invoices':
				return 'Invoices';
			case 'payments':
				return 'Payments';
			case ALL_TABS.abaondoned_cart.value:
				return 'Abandoned Cart';
			case ALL_TABS.catalogs.value:
				return ALL_TABS.catalogs.text;
		}
	};

	const update_param_values = () => {
		buyer_id = search_params.get('buyer_id');
		buyer_name = search_params.get('buyer');
		date = search_params.get('date');
		sales_rep_id = search_params.get('sales_rep');
		new_search_params = new URLSearchParams();
	};

	const handle_clear_filter = () => {
		if (is_filter_active || value === 'catalogs') {
			set_search_params('');
			remove_field_of_session_storage_item('params_data', value);
			update_param_values();
			grid_api?.api?.setFilterModel(null);
			grid_api?.api?.onFilterChanged();
		}
	};
	const column_data = convertToNewStructure(document_config, edit_order_permission);
	// useMemo(
	// 	() =>,
	// 	[document_config, edit_order_permission, facets],
	// );
	useLayoutEffect(() => {
		let params: any = sessionStorage.getItem('params_data');
		let urlParams = new URLSearchParams(window.location.search);
		if (typeof params === 'string') {
			try {
				params = JSON.parse(params);
				if (
					handle_value(location.pathname) === value &&
					!urlParams.get('filter') &&
					!urlParams.get('buyer_id') &&
					!urlParams.get('buyer') &&
					!urlParams.get('date') &&
					!urlParams.get('sales_rep')
				) {
					if (value in params && params[value].params) {
						set_search_params(params[value].params);
					}
					if (value === 'catalogs') {
						set_search_input(params[value].search);
					}
				}
			} catch (err) {}
		}
	}, [location.pathname]);

	const render_table_title = () => {
		return (
			<Grid
				sx={{
					display: 'flex',
					alignItems: 'flex-end',
					gap: 1,
				}}>
				{!count_loading ? (
					<Grid display={'flex'} alignItems={'center'} gap={1}>
						<CustomText type='Body' color={colors.secondary_text}>
							{total_rows > 10000
								? t('OrderManagement.OrderListing.LimitShowing', { type: value })
								: t('OrderManagement.OrderListing.Showing', { count: total_rows ?? 0 })}
						</CustomText>
						{total_rows > 10000 && (
							<Tooltip title={t('OrderManagement.OrderListing.ShowingTooltip')} placement='right' arrow>
								<div>
									<Icon iconName='IconInfoCircle' color={colors.secondary_text} />
								</div>
							</Tooltip>
						)}
						{!count_loading && is_filter_active && (
							<Button
								onClick={handle_clear_filter}
								sx={{
									fontSize: 14,
									fontWeight: '600',
									textTransform: 'inherit',
								}}>
								<CustomText type='Subtitle' color={colors.primary_600}>
									Clear filters
								</CustomText>
							</Button>
						)}
					</Grid>
				) : (
					<Skeleton variant='rounded' width={170} height={20} />
				)}
			</Grid>
		);
	};

	return (
		<React.Fragment>
			{value === 'catalogs' && (
				<Grid>
					<CatalogSearch
						is_modal_open={is_modal_open}
						set_is_modal_open={set_is_modal_open}
						search_input={search_input}
						set_search_input={set_search_input}
						set_search_clicked={set_is_searched}
						handle_clear_filter={handle_clear_filter}
					/>
				</Grid>
			)}
			{!is_loading ? (
				<Grid mt={1}>
					<AgGridSSRMTableContainer
						onGridReady={(params) => set_grid_api(params)}
						getRowId={(params) => params.data.id}
						showSWHeader
						rowData={[]}
						totalRows={total_rows}
						summary={summary}
						endRows={end_rows}
						column_id={value}
						customRowName={`Total ${handle_get_tab(value)}`}
						columnDefs={column_data}
						containerStyle={{ height: 'calc(100vh - 170px)' }}
						suppressFieldDotNotation={true}
						dataSource={data_source}
						hideManageColumn
						onFirstDataRendered={on_first_data_rendered}
						title={render_table_title()}
						primaryBtn={
							value === 'catalogs' && (
								<Button variant='outlined' onClick={() => set_is_modal_open(true)}>
									{_.size(search_input) > 0 && (
										<span
											style={{
												width: '8px',
												height: '8px',
												backgroundColor: 'red',
												borderRadius: '50%',
												display: 'inline - block',
												marginRight: '10px',
											}}></span>
									)}
									Search by SKU ID
								</Button>
							)
						}
						secondaryBtn={
							show_download_icon &&
							!count_loading && <Icon iconName='IconDownload' className={classes.download_icon} onClick={() => set_open(true)} />
						}
					/>
					{total_rows === 0 && <EmptyTableComponent top={'138px'} height={'calc(100vh - 300px)'} />}
				</Grid>
			) : (
				<TableSkeleton />
			)}
			{abaondoned_drawer?.state && (
				<AbandonedCartDrawer
					is_visible={abaondoned_drawer?.state}
					close={() => set_abandoned_drawer({ state: false, data: {} })}
					data={abaondoned_drawer?.data}
					set_refetch={set_refetch}
					set_is_abandoned_changed_to_view={set_is_abandoned_changed_to_view}
				/>
			)}
			{open && (
				<ExportDrawer
					open={open}
					set_open={set_open}
					total_count={total_count}
					total_rows={total_rows}
					value={value}
					transform_info={transform_info}
					payload_info={payload_info}
					set_toast={set_toast}
				/>
			)}
			{!isEmpty(modal_data) && (
				<RegenerateModal
					open={modal_data}
					close={() => set_modal_data({})}
					handle_regenerate_catalog_pdf={handle_regenerate_catalog_pdf}
					set_is_refetch={set_is_refetch}
					set_in_progress_rows={set_in_progress_rows}
				/>
			)}
		</React.Fragment>
	);
};

export default OrderListing;
