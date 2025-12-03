import { Tab, Tabs } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Grid, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import constants from './constants';
import filter from 'lodash/filter';
import map from 'lodash/map';
import { findIndex, get, values } from 'lodash';
import RouteNames from 'src/utils/RouteNames';
import { useLocation, useNavigate } from 'react-router-dom';
import Transactions from './Transactions';
import usePaymentsPermissions from 'src/hooks/usePaymentsPermissions';
import Can from 'src/casl/Can';
import { t } from 'i18next';
import { colors } from 'src/utils/theme';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store';
import { PERMISSIONS } from 'src/casl/permissions';
import CustomToast from 'src/common/CustomToast';

const PaymentLayout = ({ persist_tabs = false }: any) => {
	const navigate = useNavigate();
	const location = useLocation();

	const wizpay_url = useSelector((state: RootState) => get(state, 'login.wizpay_url', ''));

	const [value, set_value] = useState(constants.all_tabs.TRANSACTIONS.value);
	const [toast, set_toast] = useState<any>({ show: false, message: '', title: '', status: '' });
	const {
		has_payments_access,
		has_any_collect_payment_permission,
		has_any_refund_permission,
		has_card_authorization_permission,
		has_recurring_payment_permission,
	} = usePaymentsPermissions();

	const validate_tab_permissions = (tab_value: any) => {
		if (tab_value === constants.all_tabs.RECURRING_PAYMENTS.value) return has_recurring_payment_permission;
		return true;
	};

	const filtered_tabs = useMemo(() => {
		return filter(values(constants.all_tabs), (tab_data: any) => validate_tab_permissions(tab_data?.value));
	}, [constants.all_tabs, has_recurring_payment_permission]);

	const active_tab_index = useMemo(() => findIndex(filtered_tabs, (tab: any) => tab?.value === value), [value, filtered_tabs]);

	const handle_get_value = (path: string) => {
		switch (true) {
			case path.includes(RouteNames.payment.transactions.path):
				return constants.all_tabs.TRANSACTIONS.value;
			case path.includes(RouteNames.payment.recurring_payments.path):
				return constants.all_tabs.RECURRING_PAYMENTS.value;
			default:
				return constants.all_tabs.TRANSACTIONS.value;
		}
	};

	const handle_navigate_path = (tab_value: string) => {
		switch (tab_value) {
			case constants.all_tabs.TRANSACTIONS.value:
				return RouteNames.payment.transactions.path;
			case constants.all_tabs.RECURRING_PAYMENTS.value:
				return RouteNames.payment.recurring_payments.path;
			default:
				return RouteNames.payment.transactions.path;
		}
	};

	const handle_change = (tab_value: string) => {
		const navigation_url = handle_navigate_path(tab_value);
		navigate(navigation_url);
		set_value(tab_value);
	};

	const get_component = (tab_value: string) => {
		switch (tab_value) {
			case constants.all_tabs.RECURRING_PAYMENTS.value:
				return (
					<Transactions set_toast={set_toast} handle_get_value={handle_get_value} value={constants.all_tabs.RECURRING_PAYMENTS.value} />
				);
			default:
				return <Transactions set_toast={set_toast} handle_get_value={handle_get_value} value={constants.all_tabs.TRANSACTIONS.value} />;
		}
	};

	const handle_persisted_components = () => {
		return map(filtered_tabs, (tab_data: any) => {
			return (
				<Grid
					key={tab_data?.value}
					sx={{
						display: tab_data?.value === value ? 'block' : 'none',
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						zIndex: tab_data?.value === value ? 13 : 0,
					}}>
					{get_component(tab_data?.value)}
				</Grid>
			);
		});
	};

	const handle_navigate = () => {
		switch (true) {
			case has_any_collect_payment_permission:
				navigate(RouteNames.payment.direct_payment.path);
				break;
			case has_any_refund_permission:
				navigate(RouteNames.payment.refund_payment.path);
				break;
			case has_card_authorization_permission:
				navigate(RouteNames.payment.authorize.path);
				break;
			default:
				break;
		}
	};

	const handle_close_toast = () => {
		if (toast?.callback) {
			toast.callback();
		}
		set_toast((prev: any) => ({ show: false, title: prev?.title, message: prev?.message, status: prev?.status }));
	};

	const handle_wizpay_navigation = () => {
		// Mixpanel.track(Events.TAB_CLICKED, { //TODO : To be added later
		// 	clicked_tab_name: 'WizPay',
		// 	page_name: '',
		// 	tab_name: tab_from,
		// 	section_name: '',
		// });
		if (wizpay_url) {
			window.open(wizpay_url, '_blank');
		}
	};

	useEffect(() => {
		const curr_value = handle_get_value(location.pathname);
		set_value(curr_value);
	}, [location.pathname]);

	return (
		<>
			<Grid container display={'flex'} justifyContent='space-between' alignItems='center' mt={2.5}>
				<Tabs
					value={active_tab_index}
					style={{
						marginTop: '-8px',
					}}
					TabIndicatorProps={{ style: { height: '3px' } }}
					aria-label='basic tabs example'>
					{map(filtered_tabs, (tab) => (
						<Tab
							onClick={() => handle_change(tab?.value)}
							sx={{ textTransform: 'unset' }}
							label={<CustomText type='H2'>{tab?.label}</CustomText>}
						/>
					))}
				</Tabs>
				<Grid display='flex' gap={3}>
					<Can I={PERMISSIONS.wizpay_dashboard_full_access.slug} a={PERMISSIONS.wizpay_dashboard_full_access.permissionType}>
						<Box display='flex' gap={0.4} alignItems='center' sx={{ cursor: 'pointer' }} onClick={handle_wizpay_navigation}>
							<CustomText type='H6' color={colors.primary_500} style={{ marginRight: 2 }}>
								{t('Payment.WizPayDashboard')}
							</CustomText>
							<Icon iconName='IconExternalLink' color={colors.primary_500} />
						</Box>
					</Can>
					{has_payments_access && <Button onClick={handle_navigate}>Payments</Button>}
				</Grid>
			</Grid>
			<Grid sx={{ position: 'relative' }}>{persist_tabs ? handle_persisted_components() : get_component(value)}</Grid>

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
				onClose={handle_close_toast}
				state={toast?.status}
				title={toast?.title}
				subtitle={toast?.message}
				showActions={false}
			/>
		</>
	);
};

export default PaymentLayout;
