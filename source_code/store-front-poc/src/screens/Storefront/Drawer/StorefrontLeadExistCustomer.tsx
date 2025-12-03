/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { t } from 'i18next';
import CustomText from 'src/common/@the-source/CustomText';
import { Drawer, Grid, Icon, Button, Modal, Tooltip } from 'src/common/@the-source/atoms';
import { Divider, Typography } from '@mui/material';
import _ from 'lodash';
import useStyles from 'src/screens/Dashboard/styles';
import { SECTIONS } from 'src/screens/BuyerLibrary/constants';
import AdvanceDetails from 'src/screens/BuyerLibrary/ViewBuyer/components/AdvanceDetails';
import storefront from 'src/utils/api_requests/storefront';
import dayjs from 'dayjs';
import StorefrontSkeletonDrawer from 'src/screens/Storefront/Skeleton/StorefrontSkeletonDrawer';
import SelectBuyerPanel from 'src/common/SelectBuyerPanel/SelectBuyerPanel';
import AddUserExistCustomer from './AddUserExistCustomer';
import { useNavigate } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import AddQuickBuyer from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/AddQuickBuyer/AddQuickBuyer';
import Can from 'src/casl/Can';
import { PERMISSIONS } from 'src/casl/permissions';
import constants from 'src/utils/constants';
import EmailModalContent from 'src/screens/OrderManagement/component/Common/EmailModalContent';
import { EmailData } from 'src/common/Interfaces/EmailData';
import { colors } from 'src/utils/theme';

interface Props {
	drawer: boolean;
	set_drawer: (state: boolean) => void;
	data: any;
	set_refetch?: any;
	set_show_toast: any;
}

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

const StorefrontLeadExistCustomer = ({ drawer, set_drawer, data, set_refetch, set_show_toast }: Props) => {
	const classes = useStyles();
	const navigate = useNavigate();
	const [is_buyer_add_form, set_is_buyer_add_form] = useState(false);
	const [reject_modal, set_reject_modal] = useState(false);
	const [reject_id, set_reject_id] = useState('');
	const [is_buyer_exist_form, set_is_buyer_exist_form] = useState<any>(false);
	const [leads, set_leads] = useState<any>([]);
	const [storefront_buyer, set_storefront_buyer] = useState<any>({ index: null, user: null });
	const [add_user, set_add_user] = useState<boolean>(false);
	const [loading, set_loading] = useState(true);
	const [email_data, set_email_data] = useState<EmailData>([]);
	const [email_checkbox, set_email_checkbox] = useState<boolean>(false);
	const [is_existing_customer, set_is_existing_customer] = useState<boolean>(true);

	const [buyer_data, set_buyer_data] = useState({});
	const [exist_select_buyer, set_exist_select_buyer] = useState<any>(false);

	const basic_details: any = _.find(leads?.data?.sections, { key: SECTIONS?.basic_details });
	const contacts: any = _.find(leads?.data?.sections, { key: SECTIONS?.contact });
	const primary_key: any = _.get(contacts, 'primary_contact');
	const primary_contact = _.find(contacts?.contacts, { id: primary_key });
	const first_name = _.find(primary_contact?.attributes, { id: 'first_name' })?.value || '--';
	const last_name = _.find(primary_contact?.attributes, { id: 'last_name' })?.value || '--';
	const email = _.find(primary_contact?.attributes, { id: 'email' })?.value || '--';
	const country_code = _.find(primary_contact?.attributes, { id: 'country_code' })?.value;
	const phone = _.find(primary_contact?.attributes, { id: 'phone' })?.value;
	const new_phone_number = phone ? `${country_code} ${phone}` : '--';
	const company_name = _.find(basic_details?.attributes, { id: 'company_name' })?.value || '--';
	const date = dayjs(data?.created_at)?.format(constants.ATTRIBUTE_DATE_FORMAT) || 'Invalid Date';
	const updated_date = dayjs(data?.updated_at)?.format(constants.ATTRIBUTE_DATE_FORMAT) || 'Invalid Date';
	const updated_first_name = data?.lead_updated_by?.first_name ?? '--';
	const updated_last_name = data?.lead_updated_by?.last_name ?? ' ';

	const handle_lead_view = () => {
		set_drawer(false);
		navigate(`${RouteNames.buyer_library.view_buyer.routing_path}${data?.buyer_id}`, {
			state: {
				from: 'buyer_dashboard',
			},
		});
	};

	const fetching_leads = async () => {
		try {
			const res: any = await storefront.get_storefront_leads_lead({ lead_id: data?.id });
			set_leads(res);
			set_loading(false);
		} catch (err) {
			set_show_toast({
				state: true,
				title: 'This Lead has some issue please come back later',
				sub_title: 'Internal server error',
				type_status: 'error',
			});
			console.error(err);
		}
	};

	useEffect(() => {
		fetching_leads();
	}, []);

	const handle_render_header = () => {
		const customer = data?.customer_type === 'new_customer' ? 'New customer' : 'Existing customer';
		return (
			<Grid className='drawer-header' style={{ padding: '16px 20px' }}>
				<Grid className={classes.header_title}>
					<CustomText type='H3' className={classes.truncate}>
						{company_name}
					</CustomText>
					<span className={data?.customer_type === 'new_customer' ? classes.newCustomer : classes.existingCustomer}>{customer}</span>
					{data?.lead_status === 'approved' && (
						<Tooltip title='View customer details'>
							<div className={classes.view} onClick={() => handle_lead_view()}>
								<Icon className={classes.view} iconName='IconExternalLink' />
							</div>
						</Tooltip>
					)}
				</Grid>

				<Icon iconName='IconX' onClick={() => set_drawer(false)} />
			</Grid>
		);
	};

	const InfoSection = ({ info_data }: any) => (
		<Grid container spacing={2} alignItems='center'>
			<Grid item>
				<Grid className={classes.userIconBack}>
					<Icon iconName={info_data?.icon} />
				</Grid>
			</Grid>
			<Grid className={classes.name_container} item>
				{_.map(info_data?.information, (item: any, index: number) => {
					return (
						<React.Fragment key={item?.value}>
							<Grid className={classes.text_up_down}>
								<Typography className={classes.text}>{item?.label}</Typography>
								<CustomText type='H3' color='#525252' className={classes.truncate} style={item?.style}>
									{item?.value}
								</CustomText>
							</Grid>
							{index < _.size(info_data?.information) - 1 && (
								<Grid className={classes.full_name_hr}>
									<hr></hr>
								</Grid>
							)}
						</React.Fragment>
					);
				})}
			</Grid>
		</Grid>
	);

	const customer_info_data: any[] = [
		{
			id: 'company_info',
			icon: 'IconBuildingCommunity',
			information: [
				{
					label: 'Customer name',
					value: company_name,
					style: { maxWidth: '30ch' },
				},
			],
		},
		{
			id: 'user_name',
			icon: 'user',
			information: [
				{
					label: 'First name',
					value: first_name,
					style: { maxWidth: '12ch' },
				},
				{
					label: 'Last name',
					value: last_name,
					style: { maxWidth: '12ch' },
				},
			],
		},
		{
			id: 'user_email',
			icon: 'IconMail',
			information: [
				{
					label: 'Email ID',
					value: email,
					style: { maxWidth: '30ch' },
				},
			],
		},
		{
			id: 'user_phone',
			icon: 'IconPhone',
			information: [
				{
					label: 'Phone Number',
					value: new_phone_number,
					style: { maxWidth: '22ch' },
				},
			],
		},
		{
			id: 'user_date',
			icon: 'IconCalendarEvent',
			information: [
				{
					label: 'Created on',
					value: date,
					style: { maxWidth: '22ch' },
				},
			],
		},
	];
	const handle_customer_information = () => {
		return (
			<React.Fragment>
				{_.map(customer_info_data, (item: any) => {
					return (
						<Grid key={item?.id}>
							<InfoSection info_data={item} />
						</Grid>
					);
				})}
			</React.Fragment>
		);
	};

	const handle_render_drawer_content = () => {
		return (
			<React.Fragment>
				{data?.lead_status !== 'open' && (
					<Grid className={classes.header_tile} bgcolor={data?.lead_status === 'approved' ? '#F2F6E7' : '#FBEDE7'}>
						<p>
							{data?.lead_status === 'approved' ? 'Lead approved on ' : 'Lead rejected on '}
							<span style={{ fontWeight: 'bold' }}>{updated_date}</span> by{' '}
							<span style={{ fontWeight: 'bold' }}>
								{' '}
								{updated_first_name} {updated_last_name}
							</span>
						</p>
					</Grid>
				)}

				<Grid className='drawer-body' sx={{ padding: '16px 20px' }}>
					<Grid display={'flex'} flexDirection={'column'} gap={'24px'}>
						{handle_customer_information()}
					</Grid>
					{data?.customer_type === 'new_customer' && (
						<Grid>
							<Grid>
								<hr></hr>
							</Grid>
							<AdvanceDetails buyer_details={leads?.data?.sections} drawer={false} buyer_complete_attributes={leads?.data} />
						</Grid>
					)}
				</Grid>
			</React.Fragment>
		);
	};

	const handle_rejected_click = () => {
		set_reject_modal(true);
		set_reject_id(data?.id);
	};

	const handle_rejected = async (id?: any) => {
		try {
			await storefront.reject_lead({
				lead_id: id || reject_id,
				override_to_emails: email_data?.to_emails || [],
				is_auto_trigger: email_checkbox,
			});
			set_reject_modal(false);
			set_show_toast({ state: true, title: 'Rejected', sub_title: 'Lead rejected successfully' });
			set_refetch((prev: any) => !prev);
			set_drawer(false);
		} catch (err) {
			console.error(err);
		}
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer' style={{ justifyContent: 'flex-end' }}>
				<Can I={PERMISSIONS.create_wizshop_user.slug} a={PERMISSIONS.create_wizshop_user.permissionType}>
					{(allowed) => {
						if (allowed) {
							return (
								<Grid className={classes.footer}>
									<Grid item className={classes.footer_existing_customer}>
										<Grid container>
											{data?.customer_type === 'new_customer' ? (
												<>
													<CustomText type='H6'>{t('Common.ExistingCustomer.ExistingCustomerTitle')}</CustomText>
													<CustomText type='Caption' color={colors.secondary_text}>
														{t('Common.ExistingCustomer.ExistingCustomerSubTitle')}
													</CustomText>
												</>
											) : (
												<CustomText type='Subtitle'>{t('BuyerDashboard.SelectBuyerPanel.LeadNewCustomer')}</CustomText>
											)}
										</Grid>
										<Button
											variant='text'
											sx={{ textWrap: 'nowrap', padding: '8px 32px' }}
											onClick={() => {
												if (data?.customer_type === 'new_customer') {
													set_is_buyer_exist_form(true);
													set_is_existing_customer(false);
												} else {
													set_reject_id(data?.id);
													set_is_existing_customer(false);
													set_is_buyer_add_form(true);
												}
											}}>
											{data?.customer_type === 'new_customer' ? 'Select customer' : t('BuyerDashboard.BuyerCard.AddBuyer')}
											<Icon iconName='IconChevronRight' color={colors.primary_500} />
										</Button>
									</Grid>
									<Grid item className={classes.footer_cta}>
										<Button variant='outlined' className={classes.rejected} onClick={() => handle_rejected_click()}>
											Reject
										</Button>
										<Button
											onClick={() => {
												set_reject_id(data?.id);
												if (data?.customer_type === 'new_customer') {
													set_is_buyer_add_form(true);
												} else if (data?.customer_type === 'existing_customer') {
													set_is_buyer_exist_form(true);
												}
											}}>
											{data?.customer_type === 'new_customer' ? t('Dashboard.Main.ApproveCustomer') : t('Dashboard.Main.ApproveUser')}
										</Button>
									</Grid>
								</Grid>
							);
						}
					}}
				</Can>
			</Grid>
		);
	};

	const handle_render_drawer = () => {
		return (
			<Grid className={classes.drawer_container}>
				{handle_render_header()}
				<Divider className={data?.lead_status === 'open' ? classes.drawer_divider : classes.approved_drawer_divider} />
				{handle_render_drawer_content()}
				{data?.lead_status === 'open' && <>{handle_render_footer()}</>}
			</Grid>
		);
	};

	const handleSkeleton = () => {
		return <StorefrontSkeletonDrawer data={data} />;
	};

	const handle_selected_buyer_wizshop = (buyer: any, type: any) => {
		set_is_buyer_exist_form(false);
		set_add_user(true);
		set_storefront_buyer((prev: any) => {
			return {
				index: prev.index ?? null,
				user: {
					...prev?.user,
					buyer_id: buyer?.id || '',
					company_name: type === 'create' ? buyer?.name : buyer?.buyer_name || '',
				},
			};
		});
	};

	return (
		<>
			<Drawer
				anchor='right'
				width={440}
				open={drawer}
				onClose={() => set_drawer(false)}
				content={<React.Fragment>{loading ? handleSkeleton() : handle_render_drawer()}</React.Fragment>}
			/>

			{is_buyer_exist_form && is_ultron && (
				<SelectBuyerPanel
					set_is_buyer_add_form={set_exist_select_buyer}
					from_ums={true}
					show_drawer={is_buyer_exist_form}
					buyer_data={buyer_data}
					set_buyer_data={set_buyer_data}
					toggle_drawer={set_is_buyer_exist_form}
					show_add_quick_buyer={is_existing_customer}
					set_is_existing_customer={() => set_is_existing_customer(false)}
					show_guest_buyer={false}
					handle_selected_buyer_wizshop={handle_selected_buyer_wizshop}
				/>
			)}
			{exist_select_buyer && (
				<Drawer
					anchor='right'
					width={600}
					// style={{ background: '#fff' }}
					open={exist_select_buyer}
					onClose={() => set_exist_select_buyer(false)}
					content={
						<AddQuickBuyer
							is_detailed={false}
							from_cart
							exist_lead={true}
							set_is_buyer_add_form={set_exist_select_buyer}
							set_buyer_data={set_buyer_data}
							set_add_drawer={set_add_user}
							handle_selected_buyer_wizshop_create={(buyer: any) => handle_selected_buyer_wizshop(buyer, 'create')}
							wizshop_lead_id={reject_id}
							exist_customer={is_existing_customer && is_buyer_exist_form}
							set_drawer={set_drawer}
							set_refetch={set_refetch}
						/>
					}
				/>
			)}

			{add_user && storefront_buyer?.user?.company_name && (
				<AddUserExistCustomer
					buyer_fields={leads?.data?.sections}
					add_user={add_user}
					set_add_user={set_add_user}
					storefront_buyer={storefront_buyer}
					wizshop_lead_id={data?.id}
					data={{
						first_name,
						last_name,
						email,
						phone,
						country_code,
					}}
					set_refetch={set_refetch}
					set_drawer={set_drawer}
					set_buyer_data={set_buyer_data}
					set_is_buyer_exist_form={set_is_buyer_exist_form}
					set_show_toast={set_show_toast}
					set_storefront_buyer={set_storefront_buyer}
					exist_customer={data?.id && !exist_select_buyer ? true : false}
				/>
			)}

			<Modal
				width={500}
				open={reject_modal}
				onClose={() => set_reject_modal(false)}
				title={t('Common.EmailModal.RejectTitle')}
				children={
					<EmailModalContent
						modal_message={{ sub: t('Common.EmailModal.RejectSubtitle') }}
						payload={{
							entity: 'wizshop',
							action: 'wizshop-reject-lead',
							additional_info: { lead_id: reject_id },
						}}
						email_data={email_data}
						set_email_data={set_email_data}
						email_checkbox={email_checkbox}
						set_email_checkbox={set_email_checkbox}
						add_edit_permission={false}
					/>
				}
				footer={
					<Grid className={classes.reject_modal_footer}>
						<Button className={classes.reject_modal_btn1} onClick={() => set_reject_modal(false)}>
							{t('Common.EmailModal.Cancel')}
						</Button>
						<Button className={classes.reject_modal_btn2} onClick={() => handle_rejected(reject_id)}>
							{t('Common.EmailModal.Reject')}
						</Button>
					</Grid>
				}
			/>

			{is_buyer_add_form && (
				<Drawer
					width={600}
					anchor='right'
					open={is_buyer_add_form}
					onClose={() => set_is_buyer_add_form(false)}
					content={
						<AddQuickBuyer
							is_detailed={false}
							from_cart
							set_is_buyer_add_form={set_is_buyer_add_form}
							wizshop_lead_id={reject_id}
							set_drawer={set_drawer}
							set_refetch={set_refetch}
							set_buyer_data={set_buyer_data}
							handle_selected_buyer_wizshop={handle_selected_buyer_wizshop}
							exist_customer={is_existing_customer ? true : data?.customer_type === 'new_customer' ? true : false}
						/>
					}
				/>
			)}
		</>
	);
};
export default StorefrontLeadExistCustomer;
