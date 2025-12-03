/* eslint-disable  */
import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { PageHeader, Button, Grid, Icon, Modal, Menu, Image, Accordion } from 'src/common/@the-source/atoms';
import { Cart, PageTitle, Wishlist } from 'src/common/PageHeaderComponents';
import TimeRange from 'src/common/TimeRange/TimeRange';
import Analytics from 'src/common/Analytics/Analytics';
import RouteNames from 'src/utils/RouteNames';
import BuyerInfoCard from './components/BuyerInfoCard';
import useBuyerDashboard from './useBuyerDashboard';
import useStyles from './styles';
import { updateBreadcrumbs } from 'src/actions/topbar';
import Status from 'src/common/Status';
import cart_management from 'src/utils/api_requests/cartManagement';
import { useTranslation } from 'react-i18next';
import { all_product_card_template } from '../ProductListing/mock/card_template';
import PreviousOrderRail from '../ProductListing/components/PreviousOrderRail';
import { useSelector } from 'react-redux';
import { PERMISSIONS } from 'src/casl/permissions';
import { IPermission } from 'src/@types/permissions';
import _ from 'lodash';
// import SalesRep from 'src/common/SelectSalesRepPanel/SelectSalesRep';
import RecommendedRail from '../ProductListing/components/RecomendedRail';
import BuyerDashboardSkeleton from './components/Skeleton';
import CustomText from 'src/common/@the-source/CustomText';
import Can from 'src/casl/Can';
import AddCreditsDrawer from './components/AddCreditsDrawer';
import TransactionCompleteModal from '../OrderManagement/component/Drawer/TransactionCompleteModal';
import ShareReceiptModal from '../OrderManagement/component/Drawer/ShareReceiptModal';
import CustomToast from 'src/common/CustomToast';
import AddPaymentModal from '../BuyerLibrary/AddEditBuyerFlow/components/Drawer/AddPaymentModal';
import TerminalModal from './components/TerminalModal';
import BuyerTables from './components/BuyerTables';
import wiz_ai from 'src/utils/api_requests/wizAi';
import Insights from './components/Insights';
import EditActivity from '../WizAi/drawer/EditActivity';
import AbandonedCartRail from './components/AbondonedCartRail';
import { useTheme } from '@mui/material';
import utils, { check_permission, get_customer_metadata } from 'src/utils/utils';
import api_requests from 'src/utils/api_requests';
import EmailModalContent from '../OrderManagement/component/Common/EmailModalContent';
import SendMailDrawer from '../OrderManagement/component/Drawer/SendMailDrawer';
import { EmailData } from 'src/common/Interfaces/EmailData';
import { get_formatted_price_with_currency, get_initials } from 'src/utils/common';
import ImageLinks from 'src/assets/images/ImageLinks';
import AbandonedCartDrawer from '../OrderManagement/component/AbandonedCart/AbandonedCartDrawer';

import { get_duration, get_random_color } from '../OrderManagement/helper/helper';
import { get_wishlist_default_sort_data } from '../Wishlist/utils';
import { wishlist_sort } from '../Wishlist/constants';
import wishlist from 'src/utils/api_requests/wishlist';
import usePricelist from 'src/hooks/usePricelist';

import { colors } from 'src/utils/theme';
import { error, success } from 'src/utils/light.theme';

import useTenantSettings from 'src/hooks/useTenantSettings';
import constants from 'src/utils/constants';
// import Card from 'src/common/@the-source/atoms/Card';

const BuyerDashboard = () => {
	const theme: any = useTheme();
	const classes = useStyles(theme);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const {
		analytics,
		buyer_data,
		loading,
		time_range,
		set_time_range,
		// sales_rep,
		selected_sales_rep,
		// on_select_sales_rep,
		pages,
		is_drawer_visible,
		set_is_drawer_visible,
		success_toast,
		set_success_toast,
		is_transaction_complete_modal_visible,
		set_is_transaction_modal_visible,
		transaction_data,
		is_terminal_modal_visible,
		payment_config,
		customer_id,
		setIsPolling,
		complete,
		set_customer_id,
		set_is_terminal_modal_visible,
		cart_data,
		set_cart_data,
		section,
		set_refetch,
		buyer_data_loading,
		handle_create_order,
		order_btn_loading,
		// set_buyer_data,
	} = useBuyerDashboard();

	const { wizshop_abandoned_cart_enabled = false } = useSelector((state: any) => state?.settings);
	const { enable_wishlist } = useTenantSettings({
		[constants.TENANT_SETTINGS_KEYS.WISHLIST_ENABLED]: false,
	});
	const users_permission = useSelector((state: any) => state?.login?.permissions);
	if (buyer_data && !_.get(buyer_data, 'buyer_id')) _.set(buyer_data, 'buyer_id', _.get(buyer_data, 'id'));
	// const [show_buyer_panel, toggle_buyer_panel] = useState(false);
	// const [cart_count, set_cart_count] = useState(0);
	const [catalog_ids, set_catalog_ids] = useState<string>('');
	const [is_abandoned_changed_to_view, set_is_abandoned_changed_to_view] = useState<any>({});
	// const [cart_data, set_cart_data] = useState<CartWithoutRedux | null>(null);
	const location = useLocation();

	const [insights, set_insights] = useState<any>();
	const [activity_drawer, set_activity_drawer] = useState<any>(false);
	const [activity_data, set_activity_data] = useState<any>();
	const buyer = useSelector((state: any) => state?.buyer);
	const permissions = useSelector((state: any) => state?.login?.permissions);
	const pricelist = usePricelist();
	const create_order_permission = permissions?.find((item: IPermission) => item?.slug === PERMISSIONS?.create_orders?.slug);
	const [is_button_loading, set_is_button_loading] = useState<boolean>(false);
	const [input_value, set_input_value] = useState<any>('');
	const [attributes, set_attributes] = useState<any>({});
	const [selected_payment_method_id, set_selected_payment_method_id] = useState<string>('');
	const [saved_payment_methods, set_saved_payment_methods] = useState<any>([]);
	const [data, set_data] = useState<any>();
	const [order_info, set_order_info] = useState<string>('');
	const [active, set_active] = useState<string>('card');
	const [abandoned_cart_data, set_abandoned_cart_data] = useState([]);
	const [refetch_adandoned, set_refetch_adandoned] = useState<boolean>(true);
	const [is_loading_abandoned, set_is_loading_abandoned] = useState<boolean>(false);
	const [email_data, set_email_data] = useState<EmailData>({
		to_emails: [],
		cc_emails: [],
		bcc_emails: [],
		is_auto_trigger: false,
		is_enable: false,
		user_permission_flag: false,
	});
	const [email_checkbox, set_email_checkbox] = useState<boolean>(false);
	const [email_drawer, set_email_drawer] = useState<boolean>(false);
	const [is_modal_open, set_is_modal_open] = useState<boolean>(false);
	const [abandoned_drawer, set_abandoned_drawer] = useState<any>({ state: false, data: {} });
	const [buyer_wishlists_loader, set_buyer_wishlists_loader] = useState(false);
	const [buyer_wishlists, set_buyer_wishlists] = useState<any[]>([]);

	const customer_cta_permissions = {
		customer_payment: check_permission(users_permission, [PERMISSIONS.customer_pay?.slug]),
		authorize_card: check_permission(users_permission, [PERMISSIONS.create_authorization?.slug]),
		recurring_payment: check_permission(users_permission, [PERMISSIONS.recurring_payment?.slug]),
	};

	const PAYMENT_MENU_ITEMS = [
		{
			label: 'Authorize card',
			permission: customer_cta_permissions?.authorize_card && customer_cta_permissions?.customer_payment,
			route: `${RouteNames.payment.authorize.path}/buyer/${buyer_data?.buyer_id}`,
		},
		{
			label: 'Recurring payment',
			permission:
				customer_cta_permissions?.recurring_payment &&
				(customer_cta_permissions?.customer_payment || customer_cta_permissions?.authorize_card),
			route: `${RouteNames.payment.subscription_payment.path}/buyer/${buyer_data?.buyer_id}`,
		},
	];

	const payments_menu: any[] = useMemo(() => {
		return _.filter(PAYMENT_MENU_ITEMS, (menu_item: any) => menu_item?.permission);
	}, [buyer_data, permissions]);

	const fetch_buyer_wishlist = async (disable_loader = false) => {
		try {
			!disable_loader && set_buyer_wishlists_loader(true);
			const wishlist_sort_data = get_wishlist_default_sort_data(wishlist_sort);
			const res: any = await wishlist.get_buyer_wishlist(buyer_data?.id ?? '', wishlist_sort_data, pricelist?.value);
			set_buyer_wishlists(res?.data ?? []);
		} catch (err) {
			console.error(err);
		} finally {
			!disable_loader && set_buyer_wishlists_loader(false);
		}
	};

	const on_create = (buyer_wishlist: any) => {
		set_buyer_wishlists((prev: any) => [buyer_wishlist, ...prev]);
	};

	const [wishlist_data, set_wishlist_data] = useState({
		id: buyer_data?.id,
		data: buyer_wishlists,
		loader: buyer_wishlists_loader,
		fetch_buyer_wishlist,
		on_create,
	});

	const [is_share_receipt_modal_visible, set_is_share_receipt_modal_visible] = useState<boolean>(false);
	const [is_payment_modal_visible, set_is_payment_modal_visible] = useState<boolean>(false);
	const currency = useSelector((state: any) => state?.settings?.currency);
	const pathname = location.pathname;
	const customerId = pathname.split('/').pop();
	const payload = {
		startRow: 0,
		endRow: 100,
		sortModel: [],
		filterModel: {
			customer_id: {
				filterType: 'text',
				type: 'contains',
				filter: customerId,
			},
			status: {
				values: ['open'],
				filterType: 'set',
			},
		},
	};

	const [tab_value, set_tab_value] = useState<string>('orders');

	const breadCrumbList = [
		{
			id: 1,
			linkTitle: 'Dashboard',
			link: RouteNames.dashboard.path,
		},
		{
			id: 2,
			linkTitle: 'Customers',
			link: `${RouteNames.buyer_library.buyer_list.path}`,
		},
		{
			id: 3,
			linkTitle: `${buyer_data?.name}`,
			link: `${RouteNames.buyer_dashboard.path}`,
		},
	];
	const contact_shown = _.find(section, { key: 'contacts' })?.is_display;

	const customer_metadata = get_customer_metadata({ is_loggedin: true });
	const address_data: any = _.find(section, { key: 'addresses' });
	const formatted_addresses = utils.format_address_section_to_values(address_data?.addresses);

	// const get_cart = async (id: string, catalog: ICatalog) => {
	const get_cart = async (id: string) => {
		try {
			const response_data: any = await cart_management.get_cart({
				buyer_id: id,
				is_guest_buyer: false,
				// catalog_ids: [catalog.value]
			});

			const cart_data_response: any = await cart_management.get_cart_details({ cart_id: response_data?.data?.[0]?.id });

			if (cart_data_response?.status === 200) {
				set_catalog_ids(cart_data_response?.cart?.catalog_ids?.[0]);
				// set_cart_count(Object.keys(cart_data_response?.cart?.items).length);
				const { cart } = cart_data_response;
				const { id: cart_id, items, products: _product } = cart;
				if (items && Object?.keys(items)?.length > 0) {
					for (let _item in items) {
						const { id, parent_id } = _product[_item];

						items[_item].parent_id = parent_id;
						items[_item].id = id;
					}
				}
				const data = {
					id: cart_id,
					products: items,
					products_details: _product,
				};
				set_cart_data(data);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const get_insights = async (id: string) => {
		try {
			const buyer_insights_response: any = await wiz_ai.get_buyer_dashboard(id);
			if (buyer_insights_response?.status === 200) {
				if (buyer_insights_response?.data) {
					set_insights(buyer_insights_response?.data);
					set_activity_data({
						buyer_activity_type: _.get(insights, 'buyer_activity_details[1].type') || '',
						note: _.get(insights, 'buyer_activity_details[1].value') || '',
						buyer_id: buyer_data?.id,
					});
				}
			}
		} catch (err) {
			console.error(err);
		}
	};

	const handle_activity = async (payload: any, clear_activity: any) => {
		try {
			clear_activity ? await wiz_ai.delete_buyer_activity(payload?.buyer_id) : await wiz_ai.update_buyer_activity(payload);
			buyer_data && get_insights(buyer_data?.id);
		} catch (err) {
			console.error(err);
		}
	};

	const _complete = (res: any) => {
		res?.transaction_status === 'success' && set_tab_value('credits');
		complete(res);
	};

	const reset_form_states = () => {
		set_active('card');
		set_input_value('');
		set_order_info('');
	};

	const handle_add_credit = () => {
		set_is_button_loading(true);
		let payload = {
			buyer_id: buyer_data?.buyer_id,
			document_id: '',
			order_info,
			custom_amount_to_pay: input_value,
			collect_payment_method: active,
			attributes: {
				...attributes,
				is_auto_trigger: email_checkbox,
				email_ids: email_data?.to_emails || [],
			},
		};
		api_requests.order_management
			.submit_add_credits_details(payload)
			.then((res: any) => {
				if ((res?.collect_payment_method === 'card' || res?.collect_payment_method === 'terminal') && res?.transaction_status === 'pending')
					setIsPolling({ data: res, state: true });
				_complete({ ...res, collect_payment_method: active });
			})
			.catch((err: any) => {
				console.error(err);
				_complete({
					transaction_status: 'failed',
					transaction_amount: input_value,
					collect_payment_method: active,
					transaction_message: 'Payment failed',
				});
			})
			.finally(() => {
				set_is_button_loading(false);
				set_is_modal_open(false);
				reset_form_states();
			});
	};
	const api_call_abandoned_cart = () => {
		set_is_loading_abandoned(true);
		api_requests.order_listing
			.get_abandoned_cart_row_data(payload)
			.then((res: any) => {
				_.map(res?.data, (items, index) => {
					if (
						_.values(is_abandoned_changed_to_view).length > 0 &&
						is_abandoned_changed_to_view?.id === items?.id &&
						is_abandoned_changed_to_view?.updated_at_milliseconds === items?.updated_at_milliseconds
					) {
						res.data.splice(index, 1);
					}
				});
				set_abandoned_cart_data(res?.data);
				set_is_loading_abandoned(false);
			})
			.catch((err: any) => {
				console.error(err);
			});
	};
	useEffect(() => {
		api_call_abandoned_cart();
	}, [refetch_adandoned]);
	useEffect(() => {
		dispatch(updateBreadcrumbs(breadCrumbList));
		if (buyer_data?.id) {
			// get_cart(buyer_data.id, buyer_data.catalog);
			get_cart(buyer_data?.id);
			fetch_buyer_wishlist();
			if (check_permission(permissions, ['view_insights'])) {
				get_insights(buyer_data?.id);
			}
		}
	}, [buyer_data, pricelist]);

	useEffect(() => {
		if (!enable_wishlist) return;
		fetch_buyer_wishlist();
	}, [buyer_data, pricelist, enable_wishlist]);

	useEffect(() => {
		set_wishlist_data({
			id: buyer_data?.id,
			data: buyer_wishlists,
			loader: buyer_wishlists_loader,
			fetch_buyer_wishlist,
			on_create,
		});
	}, [buyer_wishlists, buyer_wishlists_loader, pricelist]);

	// const on_select_buyer = (buyer: any) => {
	// 	navigate(`/buyer/dashboard/${buyer?.buyer_id}`);
	// };

	const handle_navigate_to_buyer_details = () => {
		if (location?.state?.from === 'insights') {
			navigate(RouteNames.wiz_insights.path);
		} else if (_.includes(pages, location?.state?.from)) {
			navigate(-1);
		} else {
			navigate(RouteNames.buyer_library.buyer_list.path);
		}
	};

	const handle_collect_payment = () => {
		navigate(`/payment/form/collect/buyer/${buyer_data?.buyer_id}`);
	};

	const handle_menu_click = (event_value: any) => {
		const navigation_route: any = _.find(PAYMENT_MENU_ITEMS, (menu_item: any) => menu_item?.label === event_value);
		navigate(navigation_route?.route ?? '');
	};

	const handle_render_payment_details = () => {
		const has_any_permission = _.some(_.values(customer_cta_permissions));
		if (!has_any_permission) return;

		return (
			<Grid p={2} my={3} bgcolor='white' display='flex' alignItems='center' borderRadius={1} gap={0.5}>
				<Grid display='flex' alignItems='center' gap={0.5} xs={2} sm={2} md={2} lg={2} xl={2}>
					<Icon iconName='IconWallet'></Icon>
					<CustomText type='Subtitle'>{t('Common.CollectPaymentDrawer.Payment')}</CustomText>
				</Grid>

				{/* <Grid display='flex' alignItems='center' gap={0.5}>
					{check_permission(permissions, ['wallet_view']) && (
						<React.Fragment>
							<CustomText color='rgba(103, 109, 119, 1)'>{t('Common.CollectPaymentDrawer.LastTransaction')}</CustomText>
							<CustomText type='Subtitle' color='rgba(0, 0, 0, 0.6)' style={{ marginRight: '5px' }}>
								{get_formatted_price_with_currency(currency, buyer_data?.wallet_balance)}
							</CustomText>
							<Card data={buyer_data?.payment_method} />
						</React.Fragment>
					)}
				</Grid> */}

				{customer_cta_permissions.customer_payment ? (
					<Button variant='text' onClick={handle_collect_payment} sx={{ marginLeft: 'auto' }}>
						{t('Common.CollectPaymentDrawer.CollectPayment')}
					</Button>
				) : customer_cta_permissions?.authorize_card ? (
					<Button
						variant='text'
						onClick={() => navigate(`${RouteNames.payment.authorize.path}/buyer/${buyer_data?.buyer_id}`)}
						sx={{ marginLeft: 'auto' }}>
						{t('Common.CollectPaymentDrawer.ConfirmAuthorizePaymentTitle')}
					</Button>
				) : (
					<Button
						variant='text'
						onClick={() => navigate(`${RouteNames.payment.subscription_payment.path}/buyer/${buyer_data?.buyer_id}`)}
						sx={{ marginLeft: 'auto' }}>
						{t('Common.CollectPaymentDrawer.ConfirmSubsPaymentTitle')}
					</Button>
				)}

				{!_.isEmpty(payments_menu) && (
					<Menu
						closeOnItemClick
						LabelComponent={<Icon iconName='IconDotsVertical' />}
						onClickMenuItem={handle_menu_click}
						btnStyle={{ marginTop: '0.5rem', cursor: 'pointer', padding: '0px' }}
						menu={payments_menu}
					/>
				)}
			</Grid>
		);
	};

	const get_duration_abandoned_cart = (created_at_milliseconds: number): React.ReactNode => {
		const data = get_duration(created_at_milliseconds);
		return (
			<>
				<CustomText type='Subtitle' color={colors.grey_800}>
					{data?.days < 1 ? (data?.hours === 0 ? 'a few moments ago' : `${data?.hours} hours ago`) : `${data?.days} days ago`}
				</CustomText>
				<CustomText type='Body'>{`(${data?.date})`}</CustomText>
			</>
		);
	};
	const handle_click_view = (payload: any) => {
		set_abandoned_drawer({ state: true, data: payload });
	};
	const handle_render_expendable = () => {
		return (
			<div>
				{_.map(abandoned_cart_data, (item: any) => {
					const random_color = get_random_color();
					return (
						<Grid id={item?.cart_id} className={classes.buyer_card} my={2} justifyContent={'space-between'}>
							<Grid display={'flex'} gap={1} alignItems={'center'}>
								<Grid>
									<Grid className={classes.image_box} style={{ background: `${random_color.background}` || error[200] }}>
										<CustomText type='H1' style={{ fontWeight: 'normal' }} color={`${random_color.color}` || error[600]}>
											{get_initials(item?.website_user_name, 2)}
										</CustomText>
									</Grid>
								</Grid>
								<Grid>
									<Grid display={'flex'} gap={0.5}>
										<CustomText type='Body' color={colors.charcoal_black}>
											{`${item?.website_user_name}  abandoned the cart`}
										</CustomText>
										{get_duration_abandoned_cart(item?.created_at_milliseconds)}
									</Grid>
									<Grid mt={0.5} display={'flex'} gap={0.5}>
										<CustomText type='Body' color={colors.charcoal_black}>
											{`${item?.total_skus || 0} SKUs (${item?.total_units || 0} units) worth`}
										</CustomText>
										<CustomText type='Subtitle'>{get_formatted_price_with_currency(currency, item?.cart_total)}</CustomText>
									</Grid>
								</Grid>
							</Grid>
							<Grid>
								<Button variant='outlined' className={classes.button_style} onClick={() => handle_click_view(item)}>
									{t('Catalog.View')}
								</Button>
							</Grid>
						</Grid>
					);
				})}
			</div>
		);
	};
	const handle_render_abandonded_cart = () => {
		const count = abandoned_cart_data.length;
		const expentable = handle_render_expendable();
		return count > 0 && !is_loading_abandoned ? (
			<Grid mt={3} bgcolor={success[50]} display='flex' alignItems='center' borderRadius={1} gap={0.5} justifyContent={'space-between'}>
				<Accordion
					id={'abandoned_cart'}
					content={[
						{
							title: (
								<CustomText type='Body'>
									<Grid display='flex' alignItems={'center'}>
										<Image src={ImageLinks.AbandonedCart} width={34} height={33} />
										<Grid display='flex' alignItems={'center'} gap={0.5} ml={2}>
											<CustomText type='Body'>{'You have'}</CustomText>
											<CustomText type='Subtitle'>{`${count} open abandoned carts`}</CustomText>
											<CustomText type='Body'>{'on website'}</CustomText>
										</Grid>
									</Grid>
								</CustomText>
							),
							expandedContent: expentable,
						},
					]}
					titleBackgroundColor={success[50]}
					contentBackground='white'
				/>
			</Grid>
		) : (
			<></>
		);
	};

	if (loading) return <BuyerDashboardSkeleton />;

	return (
		<div className={classes.page_container}>
			<PageHeader
				leftSection={
					<div className={classes.page_header_left_section}>
						<PageTitle
							// title={<BuyerSwitch onClick={() => toggle_buyer_panel(true)} title={buyer_data?.name} />}
							title={buyer_data?.name}
							additional_header_left={
								<Grid sx={{ paddingLeft: '8px' }}>
									<Status text='Approved' color={theme?.buyer_dashboard?.page_title?.color} />
								</Grid>
							}
							handle_navigate={handle_navigate_to_buyer_details}
						/>
						{/* <NavigatePage onClick={handle_navigate_to_buyer_details} /> */}
					</div>
				}
				rightSection={
					<div className={classes.page_header_right_section}>
						{/* TODO: Create order naviagtion */}
						{/* TODO: later (by Deepam) nbuyer_data.id !== 'all_buyers' && <Cart data={{buyer_id: buyer_data.id, items: buyer_data?.cart_items}} from_parent={true} />*/}
						{/* <Cart cart_length={{cart_count, buyer_id: cart_data?.cart?.buyer_id}} from_parent={true}  can_navigate={true} address={'cart-summary'} background={'#FCEFD6'} /> */}
						{buyer_data && enable_wishlist && <Wishlist buyer_id={buyer_data?.id} custom={true} />}
						{_.size(cart_data?.products) > 0 && buyer_data && (
							<Cart data={{ buyer_id: buyer_data?.id, items: _.size(cart_data?.products) }} from_parent={true} />
						)}
						{create_order_permission?.toggle ? (
							<Button
								loading={order_btn_loading}
								disabled={order_btn_loading || buyer_data_loading}
								onClick={() => handle_create_order(set_success_toast)}>
								{t('BuyerDashboard.Main.CreateOrder')}
							</Button>
						) : null}
					</div>
				}
			/>
			<div className={classes.body_container}>
				{buyer_data && <BuyerInfoCard buyer_card_info={buyer_data} contact_shown={contact_shown} />}
				{wizshop_abandoned_cart_enabled && handle_render_abandonded_cart()}
				{check_permission(permissions, ['wallet_view', 'credit_top_up']) && (
					<Grid p={2} mt={3} bgcolor='white' display='flex' alignItems='center' borderRadius={1} gap={0.5}>
						<Grid display='flex' alignItems='center' gap={0.5} xs={2} sm={2} md={2} lg={2} xl={2}>
							<Icon iconName='IconWallet'></Icon>
							<CustomText type='Subtitle'>{t('Common.CollectPaymentDrawer.Credits')}</CustomText>
						</Grid>

						<Grid display='flex' alignItems='center' gap={0.5}>
							<React.Fragment>
								<CustomText color={theme?.buyer_dashboard?.credits?.primary} style={{ marginLeft: '64px' }}>
									{t('Common.CollectPaymentDrawer.AvailableCredits')}
								</CustomText>

								<CustomText type='Subtitle' color={theme?.buyer_dashboard?.credits?.secondary} style={{ marginLeft: '5px' }}>
									{get_formatted_price_with_currency(currency, buyer_data?.wallet_balance)}
								</CustomText>
							</React.Fragment>
						</Grid>

						<Can I={PERMISSIONS.credit_top_up.slug} a={PERMISSIONS.credit_top_up.permissionType}>
							<Button
								variant={check_permission(permissions, ['wallet_view']) ? 'text' : 'contained'}
								onClick={() => set_is_drawer_visible(true)}
								sx={{ marginLeft: 'auto', ...theme?.buyer_dashboard?.credits_button }}>
								{t('Common.CollectPaymentDrawer.AddCredits')}
							</Button>
						</Can>
					</Grid>
				)}

				{handle_render_payment_details()}

				{insights?.priority && (
					<Can I={PERMISSIONS.view_insights.slug} a={PERMISSIONS.view_insights.permissionType}>
						{insights && <Insights insights={insights} set_drawer={set_activity_drawer} />}
					</Can>
				)}
				<div className={classes.section}>
					<div className={classes.analytics_header} style={{ margin: '10px 0px' }}>
						<p className='header_title'>{t('BuyerDashboard.Main.Analytics')}</p>
						<div className={classes.right_section}>
							<TimeRange time_range={time_range} handle_time_range={set_time_range} />
							{/* <SalesRep repList={sales_rep} handleSelectRep={on_select_sales_rep} selectedRep={selected_sales_rep} /> */}
						</div>
					</div>
					<Grid container spacing={2}>
						<Analytics
							time_range={time_range?.id}
							buyer_data={buyer_data}
							footer_height={'32px'}
							analytics={analytics}
							show_details={false}
							show_revenue={false}
							selectedRep={selected_sales_rep}
							currency={currency}
						/>
					</Grid>
				</div>
				{buyer_data && cart_data && (
					<Can I={PERMISSIONS.view_insights.slug} a={PERMISSIONS.view_insights.permissionType}>
						<AbandonedCartRail
							buyer_data={buyer_data}
							card_template={all_product_card_template}
							catalog_id={catalog_ids}
							cart_data={cart_data}
							title_style={{
								margin: '10px 0px',
							}}
							set_cart_data={set_cart_data}
							from_redux={false}
							wishlist_data={buyer?.buyer_id === buyer_data?.id ? null : wishlist_data}
						/>
					</Can>
				)}
				{buyer_data && cart_data && (
					<PreviousOrderRail
						buyer_data={buyer_data}
						card_template={all_product_card_template}
						catalog_id={catalog_ids}
						cart_data={cart_data}
						title_style={{
							margin: '10px 0px',
						}}
						set_cart_data={set_cart_data}
						from_redux={false}
						is_buyer_dashboard={true}
						customer_metadata={customer_metadata}
						wishlist_data={buyer?.buyer_id === buyer_data?.id ? null : wishlist_data}
					/>
				)}

				{buyer_data && cart_data && (
					<RecommendedRail
						handle_navigate={(product_id: any) => navigate(`${RouteNames.product.product_detail.routing_path}${product_id}`)}
						type={''}
						title={'Recommended'}
						card_template={all_product_card_template}
						catalog_id={catalog_ids}
						buyer_data={buyer_data}
						cart_data={cart_data}
						containerStyle={{
							margin: '10px 0px',
						}}
						set_cart_data={set_cart_data}
						from_redux={false}
						is_buyer_dashboard={true}
						wishlist_data={buyer?.buyer_id === buyer_data?.id ? null : wishlist_data}
					/>
				)}
				<BuyerTables
					time_range={time_range?.id}
					sales_rep_id={selected_sales_rep?.id}
					tab_value={tab_value}
					set_toast={set_success_toast}
					set_refetch={set_refetch}
				/>
			</div>
			{/* <SelectBuyerPanel
				show_add_quick_buyer={false}
				show_guest_buyer={false}
				show_drawer={show_buyer_panel}
				toggle_drawer={toggle_buyer_panel}
				on_select_buyer={on_select_buyer}
				change_app_wide={false}
				dashboard_page={true}
				buyer_data={buyer_data}
				set_buyer_data={set_buyer_data}
			/> */}
			{activity_drawer && (
				<EditActivity
					open={activity_drawer}
					close={() => set_activity_drawer(false)}
					data={activity_data}
					handle_activity={handle_activity}
				/>
			)}
			<AddCreditsDrawer
				is_visible={is_drawer_visible}
				close={() => set_is_drawer_visible(false)}
				set_is_payment_modal_visible={set_is_payment_modal_visible}
				payment_config={payment_config}
				set_customer_id={set_customer_id}
				buyer_id={buyer_data?.buyer_id}
				document_id={''}
				data={data}
				set_saved_payment_methods={set_saved_payment_methods}
				set_selected_payment_method_id={set_selected_payment_method_id}
				input_value={input_value}
				set_input_value={set_input_value}
				attributes={attributes}
				is_button_loading={is_button_loading}
				saved_payment_methods={saved_payment_methods}
				set_active={set_active}
				handle_add_credit={handle_add_credit}
				set_order_info={set_order_info}
				order_info={order_info}
				selected_payment_method_id={selected_payment_method_id}
				set_attributes={set_attributes}
				set_data={set_data}
				from={'buyer_dashboard'}
				active={active}
				set_is_modal_open={set_is_modal_open}
				email_data={email_data}
				set_email_data={set_email_data}
				set_email_checkbox={set_email_checkbox}
				currency={currency}
			/>
			<AddPaymentModal
				all_address={formatted_addresses}
				customer_id={customer_id}
				web_token={payment_config?.web_token}
				is_visible={is_payment_modal_visible}
				close={() => {
					set_is_payment_modal_visible(false);
					set_is_drawer_visible(true);
				}}
				source='collect_payment'
				buyer_id={buyer_data?.id}
				payment_source={payment_config?.payment_gateway}
			/>
			<TransactionCompleteModal
				is_visible={is_transaction_complete_modal_visible}
				set_is_transaction_modal_visible={set_is_transaction_modal_visible}
				transaction_data={transaction_data}
				close={() => {
					set_is_drawer_visible(false);
					set_is_transaction_modal_visible(false);
				}}
				currency={currency}
			/>
			<ShareReceiptModal
				is_visible={is_share_receipt_modal_visible}
				close={() => {
					set_is_share_receipt_modal_visible(false);
					set_is_drawer_visible(false);
				}}
				track_id={transaction_data?.track_id}
				prefilled_emails={email_data?.to_emails}
				transaction_id={transaction_data?.transaction_id}
			/>
			<TerminalModal
				is_visible={is_terminal_modal_visible}
				transaction_data={transaction_data}
				setIsPolling={setIsPolling}
				set_is_terminal_modal_visible={set_is_terminal_modal_visible}
				set_is_drawer_visible={set_is_drawer_visible}
				currency={currency}
			/>
			<CustomToast
				open={success_toast?.open}
				showCross={true}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				show_icon={true}
				is_custom={false}
				autoHideDuration={5000}
				onClose={() => set_success_toast({ open: false, title: '', subtitle: '', state: success_toast?.state })}
				state={success_toast?.state}
				title={success_toast?.title}
				subtitle={success_toast?.subtitle}
				showActions={false}
			/>
			<Modal
				width={500}
				open={is_modal_open}
				onClose={() => set_is_modal_open(false)}
				title={t('Common.CollectPaymentDrawer.CollectPayment')}
				footer={
					<Grid display='flex' justifyContent='flex-end' gap={1.2}>
						<Button onClick={() => set_is_modal_open(false)} variant='outlined'>
							{t('Common.RefundPaymentDrawer.Back')}
						</Button>
						<Button loading={is_button_loading} onClick={handle_add_credit}>
							{t('Common.RefundPaymentDrawer.Confirm')}
						</Button>
					</Grid>
				}
				children={
					<EmailModalContent
						modal_message={{
							sub: t('Common.CollectPaymentDrawer.ConfirmCollectPayment', {
								price: get_formatted_price_with_currency(currency, input_value),
							}),
						}}
						payload={{
							entity: 'payment',
							action: 'payment_success',
							buyer_id: buyer_data?.id,
							additional_info: {
								payment_entity: 'buyer',
							},
						}}
						email_data={email_data}
						set_email_data={set_email_data}
						email_checkbox={email_checkbox}
						set_email_checkbox={set_email_checkbox}
						set_email_drawer={set_email_drawer}
					/>
				}
			/>
			{email_drawer && (
				<SendMailDrawer
					email_drawer={email_drawer}
					set_email_drawer={set_email_drawer}
					email_data={email_data}
					set_email_data={set_email_data}
				/>
			)}
			{abandoned_drawer?.state && (
				<AbandonedCartDrawer
					is_visible={abandoned_drawer?.state}
					close={() => set_abandoned_drawer({ state: false, data: {} })}
					data={abandoned_drawer?.data}
					set_refetch={set_refetch_adandoned}
					set_is_abandoned_changed_to_view={set_is_abandoned_changed_to_view}
				/>
			)}
		</div>
	);
};

export default BuyerDashboard;
