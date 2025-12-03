import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Chip, Grid, Icon, Image, Menu, PageHeader } from 'src/common/@the-source/atoms';
import BuyerSkeleton from '../AddEditBuyerFlow/components/Skeleton';
import BasicDetails from './components/BasicDetails';
import { PageTitle } from 'src/common/PageHeaderComponents';
import buyer from 'src/utils/api_requests/buyer';
import { SECTIONS } from '../constants';
import useStyles from '../styles';
import _ from 'lodash';
import '../style.css';
import RouteNames from 'src/utils/RouteNames';
import { PERMISSIONS } from 'src/casl/permissions';
import Can from 'src/casl/Can';
import { transformData } from './helper';
import ImageLinks from 'src/assets/images/ImageLinks';
import { check_permission } from 'src/utils/utils';
import { useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import AdvanceDetails from './components/AdvanceDetails';
import { useDispatch } from 'react-redux';
import { show_toast } from 'src/actions/message';
import types from 'src/utils/types';
import ConfirmationModal from 'src/common/@the-source/molecules/ConfirmationModal/ConfirmationModal';
// import classes from '../../OrderManagement/OrderManagement.module.css';
// import ViewStoreFront from './components/ViewStoreFront';
import api_requests from 'src/utils/api_requests';
import { get_formatted_price_with_currency } from 'src/utils/common';
import { useBuyerData } from 'src/hooks/useBuyerData';
import CustomToast from 'src/common/CustomToast';
// const credit_chip = {
// 	borderRadius: '31px',
// 	border: '2px solid #FFF',
// 	background: 'var(--info-50, #F0F6FF)',
// 	fontSize: '14px',
// 	fontWeight: 700,
// 	lineHeight: '18px',
// };
import ViewCardDetails from './components/ViewCardDetails';

const ViewBuyer = () => {
	const classes = useStyles();
	const theme: any = useTheme();
	const { id } = useParams();
	const [is_loading, set_is_loading] = useState(false);
	const [sync_loading, set_sync_loading] = useState(false);
	const [buyer_details, set_buyer_details] = useState([]);
	const [reference_id, set_reference_id] = useState<string | null>(null);

	const [wallet_balance, set_wallet_balance] = useState(0);
	const [deleting, set_deleting] = useState<boolean>(false);
	const permissions = useSelector((state: any) => state?.login?.permissions);
	const { buyer_deletion_allowed = false } = useSelector((state: any) => state?.settings);
	const [show_delete_confirm, set_show_delete_confirm] = useState<boolean>(false);
	const [menu_data, set_menu_data] = useState<any>([]);
	const [fetch_buyer_attributes, set_fetch_buyer_attributes] = useState<any>([]);
	const [payment_config, set_payment_config] = useState<any>(null);
	const [show_card_modal, set_show_card_modal] = useState<boolean>(false);
	const [selected_payment_method, set_selected_payment_method] = useState<string>('');

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const location = useLocation();
	const params = useParams();
	const credits = location?.state?.credits;
	const currency = useSelector((state: any) => state?.settings?.currency);

	const fetch_buyer = (customer_id: string) => {
		buyer
			.get_buyer_details(customer_id)
			.then((res: any) => {
				set_buyer_details(res?.data?.sections);
				set_wallet_balance(res?.data?.wallet_balance || 0);
				if (buyer_deletion_allowed === true && check_permission(permissions, ['delete_buyers'])) {
					set_menu_data([{ label: 'Delete' }]);
				}
				set_is_loading(false);
			})
			.catch((err) => {
				set_is_loading(false);
				console.error(err);
			});
	};

	const fetch_buyer_attributes_id = async () => {
		const response: any = await api_requests.buyer.get_main_buyer_details_form('create');
		if (response?.status === 200) {
			set_fetch_buyer_attributes(response?.data);
		}
	};

	useEffect(() => {
		set_is_loading(true);
		if (id) {
			fetch_buyer(id);
			fetch_buyer_attributes_id();
		} else {
			set_is_loading(false);
		}
	}, []);
	// console.log(buyer_details);
	const settings = useSelector((state: any) => state?.settings);
	const [success_toast, set_success_toast] = useState<any>({ open: false, title: '', subtitle: '', state: '' });

	const basic_details: any = buyer_details?.find((item: any) => item?.key === SECTIONS.basic_details);
	const contacts: any = buyer_details?.find((item: any) => item?.key === SECTIONS.contact);
	const addresses: any = buyer_details?.find((item: any) => item?.key === SECTIONS.address);
	const billing_id = addresses?.default_billing_address;
	const shipping_id = addresses?.default_shipping_address;
	const tax_section: any = buyer_details?.find((item: any) => item?.key === SECTIONS.tax_section);
	const find_my_primary = () => {
		return contacts?.contacts?.find((item: any) => item?.id === contacts?.primary_contact) ?? _.head(contacts?.contacts) ?? [];
	};
	const primary_contact: any = find_my_primary();
	const display_contact: boolean = contacts?.is_display !== false;
	const payment: any = buyer_details?.find((item: any) => item?.key === SECTIONS.payment_methods);
	const primary_card_id = payment?.attributes?.find((i: any) => i?.id === 'default_payment_method_id')?.value ?? '';
	const primary_card: any = payment?.saved_payment_methods?.[primary_card_id] ?? payment?.saved_bank_accounts?.[primary_card_id] ?? [];
	const buyer_name = _.get(basic_details, 'attributes[1].value') || _.get(basic_details, 'attributes[0].value');
	const from_dashboard = location?.state?.from === 'buyer_dashboard';
	const from_buyer_form = location?.state?.from === 'buyer_form';
	const show_tax_info: any = _.find(buyer_details, (item: any) => item?.key === SECTIONS.tax_section)?.is_display !== false;
	const { handle_create_order, order_btn_loading, buyer_data_loading } = useBuyerData(id, false);

	const handle_navigate = () => {
		if (from_dashboard) {
			navigate(-1);
		} else if (from_buyer_form) {
			navigate(`/buyer/dashboard/${id}`);
		} else {
			navigate(RouteNames?.buyer_library.buyer_list.path);
		}
	};

	const handle_delete_click = () => {
		set_show_delete_confirm(true);
	};

	const handle_delete = async () => {
		set_deleting(true);
		try {
			const response: any = await buyer.delete_buyer(id || '');
			if (response?.status === 200) {
				dispatch<any>(
					show_toast({
						open: true,
						showCross: false,
						anchorOrigin: {
							vertical: types.VERTICAL_TOP,
							horizontal: types.HORIZONTAL_CENTER,
						},
						autoHideDuration: 5000,
						// onClose: (event: React.SyntheticEvent<Element, Event>, reason: string) => handle_close_toast(event, reason),
						state: types.SUCCESS_STATE,
						title: types.SUCCESS_TITLE,
						subtitle: response?.message,
						showActions: false,
					}),
				);
				navigate(RouteNames.buyer_library.buyer_list.path);
			}
		} catch (error: any) {
			dispatch<any>(
				show_toast({
					open: true,
					showCross: false,
					anchorOrigin: {
						vertical: types.VERTICAL_TOP,
						horizontal: types.HORIZONTAL_CENTER,
					},
					autoHideDuration: 5000,
					// onClose: (event: React.SyntheticEvent<Element, Event>, reason: string) => handle_close_toast(event, reason),
					state: types.ERROR_STATE,
					title: types.ERROR_TITLE,
					subtitle: _.get(error, 'response.data.message'),
					showActions: false,
				}),
			);
		} finally {
			set_deleting(false);
		}
	};

	const handle_menu_click = (menu_item: any) => {
		switch (menu_item) {
			case 'Delete':
				handle_delete_click();
				break;
		}
	};

	const handle_render_menu = () => {
		if (_.size(menu_data) === 0) {
			return;
		}
		return (
			<Menu
				LabelComponent={
					<Box className={classes.iconContainer}>
						<Icon className={classes.iconStyle} iconName='IconDotsVertical' />
					</Box>
				}
				btnStyle={{ border: 'none', padding: 0 }}
				menu={menu_data}
				onClickMenuItem={(e: any) => handle_menu_click(e)}
			/>
		);
	};

	const get_buyer = () => {
		set_is_loading(true);
		if (id) {
			buyer
				.get_buyer_details(id)
				.then((res: any) => {
					set_buyer_details(res?.data?.sections);
					set_reference_id(res?.data?.reference_id);
					set_wallet_balance(res?.data?.wallet_balance || 0);
					if (buyer_deletion_allowed === true && check_permission(permissions, ['delete_buyers'])) {
						set_menu_data([{ label: 'Delete' }]);
					}
					set_is_loading(false);
				})
				.catch((err) => {
					set_is_loading(false);
					console.error(err);

					if (err?.response?.status === 404) navigate('/404', { replace: true });
				});
		} else {
			set_is_loading(false);
		}
	};

	const handle_sync_buyer = () => {
		if (sync_loading) return;

		set_sync_loading(true);

		buyer
			.sync_buyer({ buyer_id: id })
			.then((response: any) => {
				if (response?.status === 200) {
					set_sync_loading(false);
					get_buyer();
				}
			})
			.catch((e) => {
				set_sync_loading(false);
				console.error(e);
			});
	};

	// const handle_edit = () => {
	// 	navigate(`/buyer-library/edit-buyer/${id}`, {
	// 		state: {
	// 			from: from_dashboard ? 'buyer_dashboard' : 'buyer_listing',
	// 		},
	// 	});
	// };

	const fetch_payment_config = async () => {
		try {
			const response: any = await api_requests.order_management.get_payment_config({});
			if (response?.status === 200) {
				set_payment_config(response);
			}
		} catch (error) {
			console.error(payment_config);
		}
	};

	useEffect(() => {
		get_buyer();
		fetch_payment_config();
	}, []);

	return (
		<Box sx={{ width: '100%' }}>
			{is_loading || buyer_data_loading ? (
				<BuyerSkeleton />
			) : (
				<Box>
					<PageHeader
						leftSection={
							<PageTitle
								handle_navigate={handle_navigate}
								title={buyer_name}
								title_style={{
									fontSize: '20px',
								}}
							/>
						}
						rightSection={
							<Grid container justifyContent='right'>
								{check_permission(permissions, ['wallet_view']) && credits > 0 && (
									<Grid item mr={1}>
										<Chip
											avatar={<Image src={ImageLinks.info} />}
											size={'medium'}
											label={`Unused Credits: ${get_formatted_price_with_currency(currency, credits)}`}
											bgColor={theme?.view_buyer?.header?.credits?.background}
											textColor={theme?.view_buyer?.header?.credits?.text}
											className={classes.credit_chip}
										/>
									</Grid>
								)}
								<Grid item>
									{settings?.integration_buyer_resync_enabled && (
										<Button onClick={handle_sync_buyer} variant='outlined' sx={{ background: 'white', marginRight: '1rem' }}>
											{sync_loading ? (
												<Image src={ImageLinks.sync_now} width={20} height={20} style={{ marginRight: '5px' }} />
											) : (
												<Icon iconName='IconRefresh' sx={{ color: '#16885F', marginRight: '5px' }} />
											)}
											{sync_loading ? 'Syncing...' : 'Sync'}
										</Button>
									)}
									<Button
										sx={{ marginRight: '1rem' }}
										variant='contained'
										loading={order_btn_loading}
										onClick={() => handle_create_order(set_success_toast)}>
										Create order
									</Button>
									<Can I={PERMISSIONS.edit_buyers.slug} a={PERMISSIONS.edit_buyers.permissionType}>
										<Button
											variant='contained'
											onClick={() => {
												navigate(`/buyer-library/edit-buyer/${id}`, {
													state: {
														from: from_dashboard ? 'buyer_dashboard' : 'buyer_listing',
													},
												});
											}}>
											<Icon sx={{ color: theme?.view_buyer?.header?.text, mr: 1 }} iconName='IconEdit' /> Edit
										</Button>
									</Can>
								</Grid>
								<Grid item ml={1}>
									{handle_render_menu()}
								</Grid>
							</Grid>
						}
					/>

					<Grid container mt={1}>
						<Grid item xs={12} sm={12} md={5} lg={3} className={classes.buyer_user_details_container} p={1.6}>
							<BasicDetails
								data={basic_details}
								primary_contact={primary_contact}
								primary_card={primary_card}
								display_contact={display_contact}
								credits={wallet_balance}
								buyer_details={buyer_details}
								tax_info={transformData(tax_section)}
								contact_field={contacts?.contacts?.[0]?.attributes}
								show_tax_info={show_tax_info}
								reference_id={reference_id}
								customer_id={_.get(params, 'id')}
							/>
						</Grid>

						<Grid item xs={12} md={0.2}></Grid>

						<Grid
							item
							xs={12}
							sm={12}
							md={6.8}
							lg={8.8}
							bgcolor={theme?.view_buyer?.basic_details?.background}
							borderRadius={'12px'}
							py={0.6}
							px={1.6}
							mb={10}
							className='buyer-details-container'>
							<AdvanceDetails
								buyer_details={buyer_details}
								buyer_complete_attributes={fetch_buyer_attributes}
								primary_contact_id={primary_contact?.id}
								billing_id={billing_id}
								shipping_id={shipping_id}
								fetch_buyer={fetch_buyer}
								payment_gateway={payment_config?.payment_gateway}
								set_show_card_modal={set_show_card_modal}
								set_selected_payment_method={set_selected_payment_method}
							/>
						</Grid>
					</Grid>
				</Box>
			)}

			<ConfirmationModal
				title='Delete customer'
				show={show_delete_confirm}
				primary_button={
					<Button loading={deleting} color='error' onClick={handle_delete}>
						Delete
					</Button>
				}
				secondary_button={
					<Button variant='outlined' color='secondary' onClick={() => set_show_delete_confirm(false)}>
						Cancel
					</Button>
				}
				content='This action will permanently delete the customer.'
				set_show={set_show_delete_confirm}
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
			{show_card_modal && (
				<ViewCardDetails show_modal={show_card_modal} set_show_modal={set_show_card_modal} payment_method_id={selected_payment_method} />
			)}
		</Box>
	);
};

export default ViewBuyer;
