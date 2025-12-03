import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { Tab, Tabs } from '@mui/material';
import { Grid, Icon, Skeleton } from 'src/common/@the-source/atoms';
import RouteNames from 'src/utils/RouteNames';
import _ from 'lodash';
import CustomText from 'src/common/@the-source/CustomText';
import AccountContext from './context';
import useAccount from './useAccount';
import { useContext, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import useStyles from './style';
import ChangePassword from './Components/ChangePassword';
import { t } from 'i18next';
import CustomToast from 'src/common/CustomToast';

const AccountComponent = () => {
	const theme: any = useTheme();
	const classes = useStyles();
	const navigate = useNavigate();
	const permissions = useSelector((state: any) => state?.login?.permissions);
	const [search_params] = useSearchParams();
	let url_filter_params = search_params.toString();
	const { user_details, get_value_from_current_url, set_is_loading, success_toast, set_success_toast } = useContext(AccountContext);
	const active_tab = get_value_from_current_url();
	const [modal_open, set_modal_open] = useState(false);

	const ALL_TABS = theme?.components?.settings?.account_config?.tabs_config;

	const first_name = user_details.first_name ? `${user_details.first_name} ` : '';
	const last_name = user_details.last_name ? user_details.last_name : '';
	const full_name = `${first_name}${last_name}`.trim();

	const handle_navigate = (url: any) => {
		if (url_filter_params) {
			navigate(`${url}?${url_filter_params}`, { replace: true });
		} else {
			navigate(url);
		}
	};

	const handle_change = (name: string) => {
		switch (name) {
			case 'profile':
				handle_navigate(RouteNames.account.profile.path);
				break;
			case 'orders':
				handle_navigate(RouteNames.account.orders.path);
				break;
			case 'invoices':
				set_is_loading(true);
				handle_navigate(RouteNames.account.invoices.path);
				break;
			case 'wishlist':
				set_is_loading(true);
				handle_navigate(RouteNames.account.wishlist.path);
				break;
			default:
				handle_navigate(RouteNames.account.profile.path);
				break;
		}
	};

	const get_show_tab = (tab_key: string) => {
		const tab = _.find(ALL_TABS, (_tab: any) => _tab?.key === tab_key);
		if (tab?.key === 'invoices') {
			return tab?.show_tab && _.find(permissions, (item: any) => item?.slug === 'view_invoice')?.toggle;
		}
		return tab?.show_tab;
	};

	const filtered_tabs = _.filter(ALL_TABS, (tab: any) => get_show_tab(tab?.key));

	const active_tab_index = _.findIndex(filtered_tabs, (tab: any) => tab?.key === active_tab);

	return (
		<Grid mt={3} id='account-container'>
			<Grid>
				<Grid container justifyContent='space-between'>
					<Grid>
						<CustomText style={{ fontSize: '24px', fontWeight: 700 }}>Account</CustomText>
						{user_details?.id ? (
							<CustomText type='Title'>{full_name}</CustomText>
						) : (
							<Grid display='flex' gap='5px'>
								<Skeleton variant='text' width='80px' />
								<Skeleton variant='text' width='80px' />
							</Grid>
						)}
					</Grid>
					<Grid className={classes.create_password} onClick={() => set_modal_open(true)}>
						<CustomText className={classes.create_password_text}>
							<Icon className={classes.create_password_icon} iconName='IconLock' />
							{t('AuthFlow.ResetPassword.ChangePassword')}
						</CustomText>
					</Grid>
				</Grid>
			</Grid>
			<Grid my={2} sx={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
				<Tabs value={active_tab_index} aria-label='basic tabs example' sx={{ borderBottom: 1, borderColor: 'divider' }}>
					{_.map(filtered_tabs, (tab: any) => {
						return (
							<Tab
								sx={{ textTransform: 'unset' }}
								onClick={() => handle_change(tab?.key)}
								label={
									<CustomText
										type='H3'
										style={
											active_tab === tab?.key
												? { fontWeight: '700', color: theme?.account_header_style?.color }
												: { color: 'rgba(79, 85, 94, 1)', fontWeight: '400' }
										}>
										{tab?.name}
									</CustomText>
								}
							/>
						);
					})}
				</Tabs>
			</Grid>
			<Outlet />
			<CustomToast
				open={success_toast?.open}
				showCross={true}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				show_icon={true}
				is_custom={false}
				autoHideDuration={3000}
				onClose={() => set_success_toast({ open: false, title: '', subtitle: '', state: success_toast?.state })}
				state={success_toast?.state}
				title={success_toast?.title}
				subtitle={success_toast?.subtitle}
				showActions={false}
			/>
			<ChangePassword modal_open={modal_open} set_modal_open={set_modal_open} />
		</Grid>
	);
};

const Account = () => {
	const value = useAccount();

	return (
		<AccountContext.Provider value={value}>
			<AccountComponent />
		</AccountContext.Provider>
	);
};

export default Account;
