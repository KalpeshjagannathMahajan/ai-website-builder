import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { PageHeader, Button, Grid, Toaster } from 'src/common/@the-source/atoms';
import { BuyerSwitch } from 'src/common/PageHeaderComponents';
import SelectBuyerPanel from 'src/common/SelectBuyerPanel/SelectBuyerPanel';
import TimeRange from 'src/common/TimeRange/TimeRange';
import Analytics from 'src/common/Analytics/Analytics';
import { set_buyer } from 'src/actions/buyer';
import RouteNames from 'src/utils/RouteNames';
import useStyles from './styles';
import useDashboard from './useDashboard';
import { updateBreadcrumbs } from 'src/actions/topbar';
import { useTranslation } from 'react-i18next';
import DashboardEmptyScreen from 'src/common/@the-source/molecules/DashboardEmptyScreen';
import { useSelector } from 'react-redux';
import { PERMISSIONS } from 'src/casl/permissions';
import SalesRep from 'src/common/SelectSalesRepPanel/SelectSalesRep';
import CommonOrderTable from './components/CommonOrderTable';
import DirectPaymentDrawer from './components/DirectPaymentDrawer';
import Can from 'src/casl/Can';
import DashboardSkeleton from './components/DashboardSkeleton';
import { useTheme } from '@mui/material';
// import { BuyerSwitch, Cart } from 'src/common/PageHeaderComponents';
import storefront from 'src/utils/api_requests/storefront';
import LeadRails from './LeadsRails';
import StorefrontLeadExistCustomer from '../Storefront/Drawer/StorefrontLeadExistCustomer';
import api_requests from 'src/utils/api_requests';
import DirectPaymentModal from './components/DirectPaymentModal';
import { initializeSettings } from 'src/actions/setting';
import useCatalogActions from 'src/hooks/useCatalogActions';

const Dashboard = () => {
	const classes = useStyles();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const permissions = useSelector((state: any) => state?.login?.permissions);
	const create_order_permission = permissions.find((item: any) => item.slug === PERMISSIONS?.create_orders.slug);
	const theme: any = useTheme();

	const {
		analytics,
		loading,
		time_range,
		handle_time_range,
		buyer_data,
		on_select_buyer,
		buyer_id,
		on_select_sales_rep,
		// cart_data,
		sales_rep,
		documents,
		selected_sales_rep,
	} = useDashboard();

	const [show_buyer_panel, toggle_buyer_panel] = useState(false);
	const [is_visible, set_is_visible] = useState<boolean>(false);
	const [_buyer_data, set_buyer_data] = useState();

	const [attr_drawer, set_attr_drawer] = useState(false);
	const [selectedLead, setSelectedLead] = useState<any>(null);
	const [storefront_leads, set_storefront_leads] = useState<any[]>([]);
	const [refetch, set_refetch] = useState<boolean>(false);
	const [show_toast, set_show_toast] = useState({ state: false, title: '', sub_title: '', type_status: 'success' });
	const [payment_config, set_payment_config] = useState<any>(null);
	const [is_modal_visible, set_is_modal_visible] = useState<boolean>(false);
	const settings = useSelector((state: any) => state?.settings);

	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';
	const currency = useSelector((state: any) => state?.settings?.currency);
	const { handle_reset_catalog_mode } = useCatalogActions();

	const breadCrumbList = [
		{
			id: 1,
			linkTitle: 'Dashboard',
			link: RouteNames.dashboard.path,
		},
	];

	const fetching_leads = async () => {
		try {
			const res: any = await storefront.get_storefront_lead();
			delete res?.status;
			//TODO: res?.data should be array of obj
			const temp_leads: any[] = [];
			_.mapValues(res, (value: any) => {
				temp_leads.push(value);
			});

			set_storefront_leads(temp_leads);
		} catch (err) {
			console.error(err);
		}
	};

	const handle_create_order = () => {
		const dispatch_payload =
			buyer_data.id === 'all_buyers' || buyer_data?.id === ''
				? {
						buyer_id: '',
						is_guest_buyer: true,
				  }
				: {
						buyer_id: buyer_data.id,
						is_guest_buyer: false,
				  };

		dispatch<any>(
			set_buyer({
				...dispatch_payload,
				callback: () => navigate(RouteNames.product.all_products.path),
			}),
		);
		handle_reset_catalog_mode();
	};
	const handle_naviagte_to_insight = () => {
		const newPath = RouteNames.wiz_insights.path;
		window.history.pushState({}, '', newPath);
		dispatch(initializeSettings({ ...settings, layout: !settings?.layout, pathname: newPath }));
	};
	const handleLeadClick = (lead: any) => {
		setSelectedLead(lead);
		set_attr_drawer(true);
	};
	const handle_lead_view_all = () => {
		navigate(RouteNames.buyer_library.leads.path);
	};

	const handle_get_payment_config = async () => {
		try {
			const response: any = await api_requests.buyer.get_payment_config({});
			if (response?.status === 200) {
				set_payment_config(response);
			}
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		dispatch(updateBreadcrumbs(breadCrumbList));
		fetching_leads();
	}, [refetch]);

	useEffect(() => {
		handle_get_payment_config();
		set_buyer_data(buyer_data);
	}, []);

	const handle_direct_payment_click = () => {
		navigate(RouteNames.payment.direct_payment.path);
	};

	if (loading) return <DashboardSkeleton />;
	return (
		<div className={classes.page_container}>
			<PageHeader
				leftSection={
					<div className={classes.page_header_left_section}>
						<BuyerSwitch
							custom_styles={{ background: theme?.dashboard?.buyer_switch?.custom_styles?.background }}
							onClick={() => toggle_buyer_panel(true)}
							title={buyer_data.name}
							show_filter={true}
						/>
						<TimeRange time_range={time_range} handle_time_range={handle_time_range} />
						<SalesRep repList={sales_rep} handleSelectRep={on_select_sales_rep} selectedRep={selected_sales_rep} />
					</div>
				}
				rightSection={
					<div className={classes.page_header_right_section}>
						{/* TODO: Create order naviagtion */}
						{/* {total_items !== 0 && <Cart data={{ buyer_id: cart_data?.cart?.buyer_id, items: total_items }} from_parent={true} />} */}
						<Can I={PERMISSIONS.direct_payment.slug} a={PERMISSIONS.direct_payment.permissionType}>
							<Button variant='outlined' onClick={handle_direct_payment_click}>
								Direct payment
							</Button>
						</Can>
						{create_order_permission.toggle ? <Button onClick={handle_create_order}>{t('Dashboard.Main.CreateOrder')}</Button> : null}
					</div>
				}
			/>

			<div className={classes.body_container}>
				<div className={classes.section}>
					<div className={classes.analytics_header}>
						<p className='header_title'>{t('Dashboard.Main.Analytics')}</p>
						<Can I={PERMISSIONS.view_insights.slug} a={PERMISSIONS.view_insights.permissionType}>
							<Button variant='text' onClick={handle_naviagte_to_insight} sx={{ padding: '0' }}>
								View customer insights
							</Button>
						</Can>
					</div>

					<Grid container spacing={2}>
						<Analytics
							time_range={time_range.id}
							buyer_data={buyer_data}
							footer_height={'54px'}
							analytics={analytics}
							show_details={true}
							show_revenue={true}
							selectedRep={selected_sales_rep}
							currency={currency}
						/>
					</Grid>

					{/* <RecommendedRail
						handle_navigate={(product_id: any) => navigate(`${RouteNames.product.product_detail.routing_path}${product_id}`)}
						type={''}
						title={'Recommended'}
						buyer_data={buyer_data}
						card_template={all_product_card_template}
						catalog_id={catalog_id}
					/> */}

					{/* {buyer_data.id !== 'all_buyers' && buyer_data.id !== '' && (
						<PreviousOrderRail
							title_style={{
								marginTop: '0.2rem',
							}}
							buyer_data={buyer_data}
							card_template={all_product_card_template}
							catalog_id={catalog_id}
						/>
					)} */}
				</div>

				<Can I={PERMISSIONS.view_wizshop_user.slug} a={PERMISSIONS.view_wizshop_user.permissionType}>
					{(allowed) => {
						if (allowed) {
							return (
								<LeadRails
									storefront_leads={storefront_leads}
									handle_lead_view_all={handle_lead_view_all}
									handleLeadClick={handleLeadClick}
								/>
							);
						}
					}}
				</Can>

				{documents?.length > 0 ? (
					<div className={classes.section}>
						<p className='header_title'>{t('Dashboard.Main.RecentActivity')}</p>
						<CommonOrderTable
							style={{
								marginTop: '10px',
							}}
							time_range={time_range?.id}
							buyer_id={buyer_id}
							sales_rep_id={selected_sales_rep?.id}
							from_dashboard={true}
							set_toast={set_show_toast}
						/>
					</div>
				) : (
					<DashboardEmptyScreen handle_create_order={handle_create_order} />
				)}
			</div>
			<DirectPaymentDrawer is_visible={is_visible} close={() => set_is_visible(false)} currency={currency} />
			<DirectPaymentModal
				is_modal_visible={is_modal_visible}
				payment_config={payment_config}
				set_is_modal_visible={set_is_modal_visible}
				currency={currency}
			/>
			{is_ultron && (
				<SelectBuyerPanel
					show_add_quick_buyer={false}
					show_guest_buyer={false}
					show_drawer={show_buyer_panel}
					toggle_drawer={toggle_buyer_panel}
					show_all_buyer={true}
					change_app_wide={false}
					on_select_buyer={on_select_buyer}
					dashboard_page={true}
					buyer_data={_buyer_data}
					set_buyer_data={set_buyer_data}
				/>
			)}
			{attr_drawer && (
				<StorefrontLeadExistCustomer
					drawer={attr_drawer}
					set_drawer={set_attr_drawer}
					data={selectedLead}
					set_refetch={set_refetch}
					set_show_toast={set_show_toast}
				/>
			)}
			<Toaster
				open={show_toast.state}
				showCross={false}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				autoHideDuration={5000}
				onClose={() => set_show_toast({ state: false, title: '', sub_title: '', type_status: show_toast?.type_status })}
				state={show_toast?.type_status === 'error' ? 'error' : 'success'}
				title={show_toast.title}
				subtitle={show_toast.sub_title}
				showActions={false}
			/>
		</div>
	);
};

export default Dashboard;
