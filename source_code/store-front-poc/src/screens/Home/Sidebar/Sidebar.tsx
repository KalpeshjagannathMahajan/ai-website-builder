import React from 'react';
import { default as SWSidebar } from 'src/common/@the-source/molecules/Sidebar';
import { default as Grid } from 'src/common/@the-source/atoms/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import { logout_click, set_wizpay_url } from 'src/actions/login';
import ImageLinks from 'src/assets/images/ImageLinks';
import { PERMISSIONS } from 'src/casl/permissions';
import { useEffect, useState } from 'react';
import ConfigureEmailDrawer from '../EmailSetting/ConfigureEmailDrawer';
import api_requests from 'src/utils/api_requests';
import { Mixpanel } from 'src/mixpanel';
import { tabs_clicked_from_page, get_firs_path_segment } from 'src/utils/sidebar_constants';
import Events from 'src/utils/events_constants';
import { initializeSettings } from 'src/actions/setting';
import _ from 'lodash';

const Sidebar = () => {
	const is_internal_app = import.meta.env.VITE_APP_INTERNAL_TOOL === 'true';
	const show_settings = useSelector((state: any) => state?.settings?.enable_org_settings);
	const segment = get_firs_path_segment();
	const tab_from = tabs_clicked_from_page[segment] || 'Products';
	const settings = useSelector((state: any) => state?.settings);

	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const nylas_connect = location?.state?.from === 'nylas_loading';
	const [active, setActive] = useState<string>('2');
	const [open, set_open] = useState<boolean>(false);
	const permission = useSelector((state: any) => state?.login?.permissions);
	const view_user = permission?.find((item: any) => item?.slug === PERMISSIONS?.view_user?.slug)?.toggle;
	const view_role = permission?.find((item: any) => item?.slug === PERMISSIONS?.view_role?.slug)?.toggle;
	const slug_permission_user_management = view_user ? PERMISSIONS.view_user.slug : view_role ? PERMISSIONS.view_role.slug : 'null';
	const type_permission_user_management = view_user
		? PERMISSIONS.view_user.permissionType
		: view_role
		? PERMISSIONS.view_role.permissionType
		: 'null';
	const access_token = useSelector((state: any) => state?.persistedUserData?.auth_access_token);
	const odoo_enabled = useSelector((state: any) => state?.settings?.odoo_enabled);

	const handle_setting_drawer = () => {
		Mixpanel.track(Events.TAB_CLICKED, {
			clicked_tab_name: 'Mail',
			page_name: '',
			tab_name: tab_from,
			section_name: '',
		});
		set_open(true);
	};

	const get_wizpay_url = async () => {
		api_requests.order_management
			.get_wizpay_url()
			.then((res: any) => {
				if (res?.status === 200 && res?.login_url) {
					dispatch(set_wizpay_url(res?.login_url));
				}
			})
			.catch((err) => {
				console.log(err);
				return '';
			});
	};

	const handle_navigation = (link: string, module_name: string) => {
		dispatch(initializeSettings({ ...settings, layout: !settings.layout }));
		Mixpanel.track(Events.TAB_CLICKED, {
			clicked_tab_name: module_name,
			page_name: '',
			tab_name: tab_from,
			section_name: '',
		});
		navigate(link);
	};

	const sidebarItems = [
		{
			id: '1',
			icon: 'IconLayout',
			title: 'Dashboard',
			link: RouteNames.dashboard.path,
			slug: PERMISSIONS.view_dashboard.slug,
			type: PERMISSIONS.view_dashboard.permissionType,
			onIconClick: () => handle_navigation(RouteNames.dashboard.path, 'Dashboard'),
			set_active: true,
		},
		{
			id: '2',
			icon: 'IconListDetails',
			title: 'Products',
			link: RouteNames.product.all_products.path,
			onIconClick: () => handle_navigation(`${RouteNames.product.all_products.path}?search=`, 'Products'),
			set_active: true,
		},
		{
			id: '3',
			icon: 'IconReceipt2',
			title: 'Sales',
			link: RouteNames.order_management.path,
			slug: PERMISSIONS.view_orders.slug,
			type: PERMISSIONS.view_orders.permissionType,
			onIconClick: () => handle_navigation(RouteNames.order_management.order_list.path, 'Sales'),
			set_active: true,
		},
		{
			id: '4',
			icon: 'IconUsers',
			title: 'Customers',
			link: RouteNames.buyer_library.path,
			slug: PERMISSIONS.view_buyers.slug,
			type: PERMISSIONS.view_buyers.permissionType,
			onIconClick: () => handle_navigation(RouteNames.buyer_library.buyer_list.path, 'Customer'),
			set_active: true,
		},
		{
			id: '5',
			icon: ImageLinks.insights,
			title: 'Insights',
			is_icon: false,
			icon_active: ImageLinks.insight_white,
			link: RouteNames.wiz_insights.path,
			slug: PERMISSIONS.view_insights.slug,
			type: PERMISSIONS.view_insights.permissionType,
			onIconClick: () => {
				const newPath = RouteNames.wiz_insights.path;
				window.history.pushState({}, '', newPath);
				dispatch(initializeSettings({ ...settings, layout: !settings.layout }));
			},
			set_active: true,
		},
		{
			id: '6',
			icon: 'IconFileReport',
			title: 'Reports',
			link: 'metabase',
			slug: PERMISSIONS.view_reports.slug,
			type: PERMISSIONS.view_reports.permissionType,
			onIconClick: () => handle_navigation(RouteNames.reports.sales_report.path, 'Reports'),
			set_active: true,
		},
		{
			id: '7',
			icon: 'IconCloudUpload',
			title: 'Import - Export',
			link: RouteNames.manage_data.path,
			slug: PERMISSIONS.import_export.slug,
			type: PERMISSIONS.import_export.permissionType,
			onIconClick: () => handle_navigation(RouteNames.manage_data.path, 'Import - Export'),
			set_active: true,
		},
		{
			id: '8',
			icon: 'IconUserCog',
			title: 'User management',
			link: RouteNames.user_management.path,
			slug: slug_permission_user_management,
			type: type_permission_user_management,
			onIconClick: () =>
				(view_user
					? handle_navigation(RouteNames.user_management.users.path, 'User management')
					: handle_navigation(RouteNames.user_management.roles.path, 'User management')),
			set_active: true,
		},
		{
			id: '9',
			icon: 'IconTag',
			title: 'Labels',
			link: RouteNames.labels.path,
			slug: PERMISSIONS.create_labels.slug,
			type: PERMISSIONS.create_labels.permissionType,
			onIconClick: () => handle_navigation(RouteNames.labels.path, 'Labels'),
			set_active: true,
		},
		{
			id: '10',
			icon: 'IconUserPlus',
			title: 'Customer group',
			link: RouteNames.buyer_group.path,
			slug: PERMISSIONS.view_buyer_group.slug,
			type: PERMISSIONS.view_buyer_group.permissionType,
			onIconClick: () => handle_navigation(RouteNames.buyer_group.view_group.path, 'Customer group'),
			set_active: true,
		},

		//TODO: Has to be changed
		{
			id: '11',
			icon: 'IconCoins',
			title: 'Catalog Manager',
			link: RouteNames.catelog_manager.path,
			slug: PERMISSIONS.view_catalog.slug,
			type: PERMISSIONS.view_catalog.permissionType,
			onIconClick: () => handle_navigation(RouteNames.catelog_manager.path, 'Catalog Manager'),
			set_active: true,
		},
		{
			id: '12',
			icon: 'IconBox',
			title: 'Inventory',
			link: RouteNames.inventory.path,
			slug: PERMISSIONS.view_inventory.slug,
			type: PERMISSIONS.view_inventory.permissionType,
			onIconClick: () => handle_navigation(RouteNames.inventory.path, 'Inventory'),
			set_active: true,
		},
		{
			id: '13',
			icon: 'IconFolder',
			title: 'Files',
			link: RouteNames.user_drive.path,
			slug: PERMISSIONS.view_files_dam.slug,
			type: PERMISSIONS.view_files_dam.permissionType,
			onIconClick: () => handle_navigation(RouteNames.user_drive.path, 'Files'),
			set_active: true,
		},
		{
			id: '14',
			icon: 'IconCash',
			title: 'WizPay',
			link: RouteNames.payment.path,
			slug: PERMISSIONS.view_payment_history.slug,
			type: PERMISSIONS.view_payment_history.permissionType,
			onIconClick: () => handle_navigation(RouteNames.payment.transactions.path, 'Payments'),
			set_active: true,
		},
		...(odoo_enabled
			? [
					{
						id: '15',
						icon: 'IconFilePencil',
						title: 'Enquiry',
						link: '#',
						onIconClick: () => window.open(`https://enquiry.wizcommerce.com/auto-login?token=${access_token}`),
						set_active: false,
					},
			  ]
			: []),
	];

	const actions = {
		id: '16',
		icon: ImageLinks.mail_setting,
		// icon: 'IconMail',
		title: 'Mail',
		link: '#',
		slug: PERMISSIONS.mail_setting.slug,
		type: PERMISSIONS.mail_setting.permissionType,
		onClick: () => handle_setting_drawer(),
	};
	const BOTTOM_ACTION = [
		...(is_internal_app
			? [
					{
						id: '17',
						icon: 'IconSettings',
						title: 'Settings',
						link: RouteNames.settings.path,
						onIconClick: () => handle_navigation(RouteNames.settings.general.company_info.path, 'Settings'),
						set_active: true,
					},
			  ]
			: show_settings
			? [
					{
						id: '18',
						icon: 'IconSettings',
						title: 'Settings',
						link: RouteNames.settings.path,
						slug: PERMISSIONS.org_settings.slug,
						type: PERMISSIONS.org_settings.permissionType,
						onIconClick: () => handle_navigation(RouteNames.settings.general.company_info.path, 'Settings'),
						set_active: true,
					},
			  ]
			: []),

		{
			id: '19',
			icon: 'IconLogout',
			title: 'Logout',
			link: '#',
			onIconClick: () => {
				dispatch<any>(logout_click());
				navigate('/');
				window.location.reload();
			},
		},
	];

	const permissions = useSelector((state: any) => state?.login?.permissions);

	const hasDashboardPermission = permissions.find((item: any) => item.slug === PERMISSIONS.view_dashboard.slug)?.toggle;
	if (active === '1' && hasDashboardPermission === false) {
		setActive('2');
	}

	useEffect(() => {
		if (permission.length > 0) {
			get_wizpay_url();
		}
	}, [permission]);

	useEffect(() => {
		if (_.includes(settings?.pathname, '/wiz_insights') && _.includes(window.location.pathname, '/wiz_insights')) {
			setActive('5');
			return;
		}
		if (location.pathname === '/') {
			setActive('2');
			return;
		}
		const activeTab = [...sidebarItems, ...BOTTOM_ACTION].find((item) => location.pathname.includes(item.link) && item.link !== '/')?.id;

		if (typeof activeTab === 'string') {
			setActive(activeTab);
		}
	}, [location.pathname, settings?.layout]);

	useEffect(() => {
		if (nylas_connect) {
			const timeoutId = setTimeout(() => {
				set_open(nylas_connect);
			}, 3000);

			return () => clearTimeout(timeoutId);
		}
	}, [nylas_connect]);

	return (
		<React.Fragment>
			<Grid container>
				<Grid item position='fixed' width={85} zIndex='drawer'>
					<SWSidebar
						active={active}
						logo={ImageLinks.LogoWithText}
						sidebarItems={sidebarItems}
						actions={actions}
						bottomActions={BOTTOM_ACTION}
					/>
				</Grid>
				{open && <ConfigureEmailDrawer open={open} set_open={set_open} />}
			</Grid>
		</React.Fragment>
	);
};

export default Sidebar;
