import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ALL_TABS from '../constants';
import { useDispatch } from 'react-redux';
import RouteNames from 'src/utils/RouteNames';
import { Tab, Tabs } from '@mui/material';
import { Box, Button, Grid, Icon } from 'src/common/@the-source/atoms';
import CustomToast from 'src/common/CustomToast';
import { show_document_toast, show_document_toast_message } from 'src/actions/document';
import CustomText from 'src/common/@the-source/CustomText';
import { PERMISSIONS } from 'src/casl/permissions';
import { IPermission } from 'src/@types/permissions';
import OrderListing from './OrderListing';
import { updateBreadcrumbs } from 'src/actions/topbar';
import { set_catalog_products, update_catalog_mode } from 'src/actions/catalog_mode';
import CatalogFactory from '../../../utils/catalog.utils';
import { CatalogPreviewModal } from 'src/screens/Presentation/components/CatalogPreview';
import useCatalogActions from 'src/hooks/useCatalogActions';
import { get_active_tab_info } from '../helper/helper';
import { colors } from 'src/utils/theme';
import { t } from 'i18next';
import MessageModal from 'src/screens/UserDrive/components/MessageModal';
import { EmailModal } from 'src/screens/UserDrive/components/EmailModal';
import set from 'src/utils/api_requests/setting';

export default function OrderListingLayout() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();

	const { wizshop_abandoned_cart_enabled = false } = useSelector((state: any) => state?.settings);
	const permissions = useSelector((state: any) => state?.login?.permissions);
	const settings = useSelector((state: any) => state?.settings);
	const [value, set_value] = useState<string>('orders');
	const [active_index, set_active_index] = useState<number>(0);
	const [show_catalog_preview, set_show_catalog_preview] = useState<boolean>(false);
	const [preview_data, set_preview_data] = useState<any>(null);
	const [toast, set_toast] = useState({ show: false, message: '', title: '', status: '' });

	const [search_params] = useSearchParams();
	const new_search_params = new URLSearchParams();
	const { catalog_mode } = useSelector((state: any) => state?.catalog_mode);
	const [action_message, set_action_message] = useState('');
	const [show_action_icon, set_show_action_icon] = useState(false);
	const [open_message_modal, set_open_message_modal] = useState(false);
	const [open_email_modal, set_open_email_modal] = useState(false);
	const [file_to_share, set_file_to_share] = useState<any>([]);
	const [user_detail, set_user_detail] = useState<any>({});

	let buyer_id: any = search_params.get('buyer_id');
	new_search_params.append('buyer_id', buyer_id);

	const document_state = useSelector((state: any) => state?.document);
	const create_order_permission = permissions.find((item: IPermission) => item.slug === PERMISSIONS?.create_orders.slug);

	const document_toast = document_state?.show_toast;
	const document_message = document_state?.toast_message;

	const get_show_tab = (tab_name: string) => {
		if (tab_name === ALL_TABS.payments.value) {
			return _.find(permissions, (item) => item?.slug === 'view_payment_history')?.toggle;
		}
		if (tab_name === ALL_TABS.invoices.value) {
			return _.find(permissions, (item) => item?.slug === 'view_invoice')?.toggle;
		}
		if (tab_name === ALL_TABS.catalogs.value) {
			return settings?.is_presentation_enabled;
		}
		// if (tab_name === ALL_TABS.abandoned_cart.value) {
		// 	return true;
		// }
		return true;
	};

	const filtered_tabs = useMemo(() => {
		return _.filter(ALL_TABS, (tab) => {
			return !wizshop_abandoned_cart_enabled ? tab?.value !== 'abandoned_cart' && get_show_tab(tab?.value) : get_show_tab(tab?.value);
		});
	}, [permissions, settings]);

	const [active_tab_index, set_active_tab_index] = useState<number>(_.findIndex(filtered_tabs, (tab) => tab?.value === 'orders'));
	const { handle_reset_catalog_mode, handle_initialise_create_mode } = useCatalogActions();

	const getTabpanel = (val: string) => {
		switch (val) {
			case 'all':
				return <></>;

			default:
				return <Box />;
		}
	};

	const handle_navigate = (url: any) => {
		navigate(url);
	};

	const handle_value = (path: string): string => {
		switch (path) {
			// case RouteNames.order_management.all_list.path:
			// 	return 'all';
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
			case RouteNames.order_management.catalogs.path:
				return ALL_TABS.catalogs.value;
			case RouteNames.order_management.abandoned_carts.path:
				return ALL_TABS.abaondoned_cart.value;
			default:
				return 'orders';
		}
	};

	const handle_change = (name: string) => {
		switch (name) {
			// case 'all':
			// 	handle_navigate(RouteNames.order_management.all_list.path);
			// 	break;
			case 'orders':
				handle_navigate(RouteNames.order_management.order_list.path);
				break;
			case 'quotes':
				handle_navigate(RouteNames.order_management.quote_list.path);
				break;
			case 'drafts':
				handle_navigate(RouteNames.order_management.draft_list.path);
				break;
			case 'invoices':
				handle_navigate(RouteNames.order_management.invoices.path);
				break;
			case 'payments':
				handle_navigate(RouteNames.order_management.payments.path);
				break;
			case ALL_TABS.abaondoned_cart.value:
				handle_navigate(RouteNames.order_management.abandoned_carts.path);
				break;
			case ALL_TABS.catalogs.value:
				handle_navigate(RouteNames.order_management.catalogs.path);
				break;
			default:
				handle_navigate(RouteNames.order_management.order_list.path);
				break;
		}
		set_value(name);
		const active_tab_info = get_active_tab_info(filtered_tabs, name);
		if (active_tab_info?.tab) {
			set_active_index(active_tab_info?.index);
			set_active_tab_index(active_tab_info?.index);
		}
	};

	const handle_close = () => {
		dispatch(show_document_toast(false));
		dispatch(
			show_document_toast_message({
				title: '',
				sub: '',
				is_custom: false,
				show_icon: false,
			}),
		);
	};

	const handle_render_toast = () => {
		return (
			<CustomToast
				open={document_toast}
				showCross={true}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				show_icon={document_message?.show_icon}
				is_custom={document_message?.is_custom}
				custom_icon={document_message?.is_custom && 'IconConfetti'}
				autoHideDuration={3000}
				onClose={handle_close}
				state='success'
				title={document_message?.title}
				subtitle={document_message?.sub}
				showActions={false}
			/>
		);
	};

	const handle_create_catalog = () => {
		handle_initialise_create_mode();
		CatalogFactory.MODE.activate_catalog_mode();
		dispatch(set_catalog_products([]));
		dispatch(update_catalog_mode({ catalog_mode: true }));
		navigate(RouteNames.product.all_products.path);
	};

	useLayoutEffect(() => {
		let name = handle_value(location.pathname);
		set_value(name);

		const active_tab_info = get_active_tab_info(filtered_tabs, name);
		if (active_tab_info?.tab) {
			set_active_index(active_tab_info?.index);
			set_active_tab_index(active_tab_info?.index);
		}
	}, [location.pathname, filtered_tabs]);

	const handle_navigate_back = () => {
		let name = handle_value(location.pathname);
		let params: any = sessionStorage.getItem('params_data');
		if (params) {
			try {
				params = JSON.parse(params);
				delete params[name];
				sessionStorage.setItem('params_data', JSON.stringify(params));
			} catch (err) {}
		}
		navigate(`/buyer/dashboard/${buyer_id}`);
	};
	const breadCrumbList = [
		{
			id: 1,
			linkTitle: 'Dashboard',
			link: '/',
		},
		{
			id: 2,
			linkTitle: 'Sales',
			link: `${RouteNames.order_management.order_list.path}`,
		},
		{
			id: 2,
			linkTitle: _.upperFirst(value),
			link: `${RouteNames.order_management.order_list.path}`,
		},
	];

	const handle_create_order = () => {
		navigate(RouteNames.product.all_products.path);
		handle_reset_catalog_mode();
	};

	useEffect(() => {
		dispatch(updateBreadcrumbs(breadCrumbList));
	}, [value]);

	useEffect(() => {
		let clear_open_message_timeout = setTimeout(() => {
			set_open_message_modal(false);
		}, 2000);
		return () => clearTimeout(clear_open_message_timeout);
	}, [open_message_modal]);

	const handle_user_info = () => {
		set
			.get_general_settings()
			.then((res: any) => {
				if (res?.status === 200) {
					set_user_detail(res?.data);
				}
			})
			.catch((err: any) => {
				console.error(err);
			});
	};

	useEffect(() => {
		handle_user_info();
	}, []);

	return (
		<React.Fragment>
			{document_toast && !_.isEmpty(document_message?.title) && handle_render_toast()}
			<Grid container pt={2} alignItems='stretch'>
				{buyer_id && (
					<Grid sx={{ cursor: 'pointer' }} onClick={handle_navigate_back}>
						<Icon iconName='IconArrowLeft' sx={{ paddingTop: '0.5rem' }} />
					</Grid>
				)}
				<Grid item>
					<Tabs
						value={active_tab_index}
						style={{
							marginTop: '-8px',
						}}
						TabIndicatorProps={{ style: { height: '3px' } }}
						aria-label='basic tabs example'>
						{_.map(filtered_tabs, (tab) => (
							<Tab
								onClick={() => handle_change(tab?.value)}
								sx={{ textTransform: 'unset' }}
								label={<CustomText type='H2'>{tab?.text}</CustomText>}
							/>
						))}
					</Tabs>
				</Grid>
				<Grid item ml='auto' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					{active_index === _.indexOf(Object?.keys(ALL_TABS), 'catalogs') && settings?.is_presentation_enabled && !catalog_mode && (
						<Button variant='outlined' sx={{ background: colors.white }} onClick={handle_create_catalog}>
							{t('OrderManagement.OrderListing.CreateCatalog')}
						</Button>
					)}
					{create_order_permission.toggle && <Button onClick={handle_create_order}>Create Order</Button>}
				</Grid>
			</Grid>
			{getTabpanel(value)}
			<Grid sx={{ position: 'relative' }}>
				{filtered_tabs.map((tab: any, index: number) => {
					return (
						<div
							style={{
								display: active_index === index ? 'block' : 'none',
								position: 'absolute',
								top: 0,
								left: 0,
								width: '100%',
								height: '100%',
								zIndex: active_index === index ? 13 : 0,
							}}
							key={tab.name}>
							<OrderListing
								set_show_catalog_preview={set_show_catalog_preview}
								set_preview_data={set_preview_data}
								value={tab.value}
								active_index={tab.index}
								set_toast={set_toast}
								set_open_email_modal={set_open_email_modal}
								set_file_to_share={set_file_to_share}
							/>
						</div>
					);
				})}
			</Grid>
			{show_catalog_preview && (
				<CatalogPreviewModal
					is_edit_mode={true}
					file_data={preview_data}
					from_listing_page={true}
					open_modal={show_catalog_preview}
					set_open_modal={set_show_catalog_preview}
					max_pages={1}
					set_file_to_share={set_file_to_share}
					set_open_email_modal={set_open_email_modal}
				/>
			)}
			<CustomToast
				open={toast?.show}
				showCross={true}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				show_icon={true}
				is_custom={false}
				autoHideDuration={3000}
				onClose={() => set_toast({ show: false, message: '', title: '', status: toast?.status })}
				state={toast?.status}
				title={toast?.title}
				subtitle={toast?.message}
				showActions={false}
			/>
			<MessageModal show_action_icon={show_action_icon} open_message_modal={open_message_modal} message={action_message} />
			{open_email_modal && (
				<EmailModal
					open_email_modal={open_email_modal}
					user_info={user_detail}
					set_open_email_modal={set_open_email_modal}
					file_links_to_share={file_to_share}
					set_action_message={set_action_message}
					set_show_action_icon={set_show_action_icon}
					set_open_message_modal={set_open_message_modal}
				/>
			)}
		</React.Fragment>
	);
}
