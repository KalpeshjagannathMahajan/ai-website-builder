import { Tab, Tabs } from '@mui/material';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Grid } from 'src/common/@the-source/atoms';
import Can from 'src/casl/Can';
import { PERMISSIONS } from 'src/casl/permissions';
import CustomText from 'src/common/@the-source/CustomText';
import { t } from 'i18next';
import RouteNames from 'src/utils/RouteNames';
import { ALL_TABS } from '../constants';
import _ from 'lodash';
import BuyerListContext from './context';
import UseBuyerList from './UseBuyerList';
import { check_permission } from 'src/utils/utils';
import { useSelector } from 'react-redux';
import BuyerListGrid from './BuyerList';
import WizShopList from './WizShopList';
import LeadList from './LeadList';
import { makeStyles } from '@mui/styles';
import useCatalogActions from 'src/hooks/useCatalogActions';

const useStyles = makeStyles(() => ({
	active_container: {
		position: 'absolute',
		top: '0%',
		left: '0%',
		width: '100%',
		height: '100%',
		display: 'block',
	},
	inactive_container: {
		position: 'absolute',
		top: '0%',
		left: '0%',
		width: '100%',
		height: '100%',
		display: 'none',
	},
}));

const BuyerListingComp = () => {
	const { set_drawer } = useContext(BuyerListContext);
	const navigate = useNavigate();
	const permissions = useSelector((state: any) => state?.login?.permissions);
	const classes = useStyles();
	const { handle_reset_catalog_mode } = useCatalogActions();

	const get_value_from_current_url = () => {
		const path = window.location.pathname;
		const parts = path.split('/');
		return parts[parts.length - 1];
	};

	const active_tab = get_value_from_current_url();
	const visible_tabs = _.filter(ALL_TABS, (tab: any) => check_permission(permissions, [tab?.permission?.slug]) === true);
	const active_tab_index = _.findIndex(visible_tabs, (tab: any) => tab?.value === active_tab);

	const handle_change = (val: any) => {
		switch (val) {
			case 'buyer_list':
				navigate(RouteNames.buyer_library.buyer_list.path);
				break;
			// case 'wiz_insights':
			// 	navigate(RouteNames.buyer_library.wiz_insights.path);
			// 	break;
			case 'leads':
				navigate(RouteNames.buyer_library.leads.path);
				break;
			case 'wizshop_users':
				navigate(RouteNames.buyer_library.wizshop_users.path);
				break;
			default:
				navigate(RouteNames.buyer_library.buyer_list.path);
				break;
		}
	};

	const handle_create_customer = () => {
		handle_reset_catalog_mode();
		navigate('/buyer-library/create-buyer');
	};

	const getButtons = (tab: string) => {
		switch (tab) {
			case 'buyer_list':
				return (
					<Can I={PERMISSIONS.create_buyers.slug} a={PERMISSIONS.create_buyers.permissionType} passThrough>
						{(allowed: any) =>
							(allowed ? <Button onClick={handle_create_customer}>{t('BuyerDashboard.BuyerList.CreateBuyer')}</Button> : null)
						}
					</Can>
				);
			case 'wizshop_users':
				return (
					<Grid container gap={1}>
						{/* <Grid item>
							<Button variant='outlined'>Bulk upload</Button>
						</Grid> */}
						<Grid item>
							<Can I={PERMISSIONS.create_wizshop_user.slug} a={PERMISSIONS.create_wizshop_user.permissionType} passThrough>
								{(allowed: any) =>
									(allowed ? (
										<Button variant='contained' onClick={() => set_drawer(true)}>
											+ Add user
										</Button>
									) : null)
								}
							</Can>
						</Grid>
					</Grid>
				);
			default:
				break;
		}
	};

	const handle_component = (value: string) => {
		switch (value) {
			case 'buyer_list':
				return <BuyerListGrid showActionItems={check_permission(permissions, ['edit_buyers'])} />;
			// case 'wiz_insights':
			// 	return <WizInsights />;
			case 'wizshop_users':
				return <WizShopList />;
			case 'leads':
				return <LeadList />;
			default:
				return <BuyerListGrid showActionItems={check_permission(permissions, ['edit_buyers'])} />;
		}
	};

	return (
		<React.Fragment>
			<Grid container pt={2} alignItems='center'>
				<Grid item>
					<Tabs value={active_tab_index} aria-label='basic tabs example'>
						{_.map(ALL_TABS, (tab) => (
							<Can I={tab?.permission?.slug} a={tab?.permission?.type} passThrough key={tab?.value}>
								{(allowed) =>
									(allowed ? (
										<Tab
											sx={{ textTransform: 'unset', opacity: '1' }}
											onClick={() => handle_change(tab?.value)}
											label={<CustomText type='H2'>{tab?.label}</CustomText>}
											key={tab.value}
										/>
									) : null)
								}
							</Can>
						))}
					</Tabs>
				</Grid>
				<Grid item ml='auto' sx={{ display: 'flex', alignItems: 'center' }}>
					{getButtons(active_tab)}
				</Grid>
			</Grid>
			<div style={{ position: 'relative' }}>
				{Object.keys(ALL_TABS).map((tab: any) => {
					return (
						<div
							className={active_tab === ALL_TABS[tab].value ? classes.active_container : classes.inactive_container}
							key={ALL_TABS[tab].value}>
							{handle_component(ALL_TABS[tab].value)}
						</div>
					);
				})}
			</div>
		</React.Fragment>
	);
};

const BuyerListing = () => {
	const value: any = UseBuyerList();

	return (
		<BuyerListContext.Provider value={value}>
			<BuyerListingComp />
		</BuyerListContext.Provider>
	);
};

export default BuyerListing;
