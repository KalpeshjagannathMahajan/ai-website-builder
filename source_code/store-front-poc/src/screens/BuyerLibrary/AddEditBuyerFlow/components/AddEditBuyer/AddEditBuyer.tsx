/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormProvider } from 'react-hook-form';
import { Box, Button, Grid, Icon, PageHeader } from 'src/common/@the-source/atoms';
import CustomToast from 'src/common/CustomToast';
import BasicDetails from '../BasicDetails';
import OtherDetails from '../OtherDetails';
import Preferences from '../Preferences';
import useAddEditBuyer from './useAddEditBuyer';
import { PAYMENT_METHODS, SECTIONS } from '../../../constants';
import { useNavigate, useParams } from 'react-router-dom';
import TabsSection from '../Tabs';
import { useDispatch } from 'react-redux';
import RouteNames from 'src/utils/RouteNames';
import React, { useEffect, useState } from 'react';
import { updateBreadcrumbs } from 'src/actions/topbar';
import ContactCard from '../ContactCard';
import AddContactCard from '../AddContactCard';
import AddressCard from '../AddressCard';
import AddAddressCard from '../AddAddressCard';
import AddContactDrawer from '../Drawer/AddContactDrawer';
import AddAddressDrawer from '../Drawer/AddAddressDrawer';
import { BuyerFormSkeleton } from '../BuyerFormSkeleton';
import AddPaymentCard from '../AddPaymentCard';
import AddPaymentModal from '../Drawer/AddPaymentModal';
import DiscardModal from '../DiscardModal';
import CustomText from 'src/common/@the-source/CustomText';
import { t } from 'i18next';
import Can from 'src/casl/Can';
import { PERMISSIONS } from 'src/casl/permissions';
import '../../../style.css';
import _, { debounce } from 'lodash';
import TaxPreferences from '../TaxPreferences';
import { clubAdditionals } from 'src/screens/BuyerLibrary/ViewBuyer/helper';
import useStyles from '../../../styles';
import { useTheme } from '@mui/material/styles';
import StoreFrontTable from '../StoreFrontTable';
import StoreFrontAddUser from '../StoreFrontAddUser';
import { get_permission } from '../helper/helper';
import CustomerEmailModal from '../../CustomerEmailModal';
import PaymentMethods from 'src/screens/BuyerLibrary/ViewBuyer/components/PaymentMethods';
import AddAchPaymentModal from 'src/screens/Payment/component/AddAchPaymentModal';
import { Divider } from '@mui/material';
import { payment_gateways } from '../../constants';

const AddEditBuyer = ({ quick_buyer_data, set_is_detailed, edit_buyer_id, is_filled }: any) => {
	const {
		on_submit,
		handle_scroll_to_section,
		active_tab,
		set_active_tab,
		buyer_fields,
		methods,
		show_toast,
		set_show_toast,
		on_add_new_contact,
		on_edit_contact,
		close_contact_sheet,
		handle_update_form,
		delete_contact,
		delete_card,
		handle_blur,
		all_contacts,
		show_contact_sheet_detail,
		all_address,
		show_address_sheet_detail,
		all_cards,
		show_payment_sheet_detail,
		close_payment_sheet,
		on_add_new_address,
		on_edit_address,
		on_edit_payment_method,
		on_edit_ach_payment_method,
		on_add_new_card,
		close_address_sheet,
		delete_address,
		all_attachments,
		delete_attachment,
		handle_added_files,
		is_loading,
		on_add_new_ach_card,
		show_payment_ach_sheet_detail,
		upload_loader,
		set_display_name_changed,
		edit_buyer_details,
		uploaded_files,
		edit_mode,
		payment_config,
		is_open_alert,
		set_is_open_alert,
		btn_loading,
		sorted_data,
		close_ach_payment_sheet,
		open_storefront_user,
		set_open_storefront_user,
		all_wizshop_users,
		setValue,
		handle_final_submit,
		is_button_loading,
		is_modal_open,
		set_is_modal_open,
		email_data,
		set_email_data,
		email_checkbox,
		set_email_checkbox,
	} = useAddEditBuyer(quick_buyer_data, edit_buyer_id);
	const [storefront_edit_user, set_storefront_edit_user] = useState({ index: null, user: null });
	const navigate = useNavigate();
	const classes = useStyles();
	const theme: any = useTheme();

	const {
		handleSubmit,
		formState: { errors, isDirty },
	} = methods;

	const dispatch = useDispatch();
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
			linkTitle: 'Customer Edit',
			link: `${RouteNames.buyer_library.edit_buyer.path}`,
		},
	];

	const get_section_position = (section_id: any) => {
		const section = document.getElementById(section_id);
		const container: any = document.getElementById('rootContainer');
		const tabs: any = document.getElementById('tabs');

		if (section && container && tabs) {
			const rect = section.getBoundingClientRect();
			const scrollTop = container?.pageYOffset || document.documentElement.scrollTop;
			const sectionTop = rect.top + scrollTop;
			return sectionTop - tabs?.offsetHeight - 150;
		}

		return null;
	};

	const is_scroll_below_section = (section_id: any) => {
		const sectionTop = get_section_position(section_id);
		const container: any = document.getElementById('rootContainer');
		if (sectionTop !== null && container) {
			const scrollTop = container?.pageYOffset || document.documentElement.scrollTop;
			return scrollTop > sectionTop;
		}
		return false;
	};

	const is_scroll_above_section = (section_id: any) => {
		const sectionTop = get_section_position(section_id);
		const container: any = document.getElementById('rootContainer');
		if (sectionTop !== null && container) {
			const scrollTop = container?.pageYOffset || document.documentElement.scrollTop;
			return scrollTop < sectionTop;
		}

		return false;
	};

	const handle_scroll = () => {
		if (sorted_data) {
			const arr = sorted_data?.map((sections) => {
				const is_below = is_scroll_below_section(sections?.key);
				const is_above = is_scroll_above_section('contacts');
				return {
					key: sections?.key,
					name: sections?.name,
					is_below,
					is_above,
				};
			});
			const section_key = arr.filter((ele: any) => ele.is_below);
			set_active_tab(section_key.length ? section_key[section_key?.length - 1]?.key : 'basic_details');
		}
	};

	//TODO: add id={item?.name} to each sections and add id={item?.key} to each section title

	// useEffect(() => {
	// 	const container: any = document.getElementById('rootContainer');
	// 	const debounced_handle_scroll = debounce(handle_scroll, 30);
	// 	container.addEventListener('scroll', debounced_handle_scroll);
	// 	return () => {
	// 		container.removeEventListener('scroll', debounced_handle_scroll);
	// 	};
	// }, [sorted_data]);

	useEffect(() => {
		dispatch(updateBreadcrumbs(breadCrumbList));
	}, []);

	const params = useParams();
	const { id } = params;

	const handle_render_toaster = () => {
		return (
			<CustomToast
				open={show_toast.state}
				showCross={true}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				show_icon={true}
				autoHideDuration={5000}
				onClose={() => set_show_toast((prev: any) => ({ ...prev, state: false }))}
				state={show_toast?.type ? show_toast?.type : 'warning'}
				title={show_toast.title}
				subtitle={show_toast.sub_title}
				showActions={false}
			/>
		);
	};

	const on_close = () => set_is_open_alert(false);

	const go_back = () => {
		on_close();
		navigate(-1);
	};

	const handle_cancel = () => {
		if (id) {
			navigate(-1);
			set_is_detailed(false);
		} else if (isDirty || is_filled) {
			set_is_open_alert(true);
		} else {
			set_is_detailed(false);
		}
	};

	const on_cancel = () => {
		if (isDirty || is_filled) {
			set_is_open_alert(true);
		} else {
			go_back();
		}
	};

	if (edit_buyer_id && _.isEmpty(edit_buyer_details)) {
		return null;
	}

	const basic_details: any = sorted_data?.find((item: any) => item?.key === SECTIONS.basic_details);
	const buyer_name = _.get(basic_details, 'attributes[1].value') || _.get(basic_details, 'attributes[0].value');
	const contact_section = _.find(buyer_fields?.sections, { key: SECTIONS?.contact });
	const address_section = _.find(buyer_fields?.sections, { key: SECTIONS?.address });

	const wizshop_attributes = _.find(buyer_fields?.sections, { key: SECTIONS.wizshop_users });
	const user_attributes = _.get(wizshop_attributes, SECTIONS.wizshop_users, [])?.[0]?.attributes || [];

	const excluded_attributes = ['status', 'send_invite'];
	const filter_wizshop_attributes = _.filter(user_attributes, (attr: any) => !excluded_attributes.includes(attr?.id));
	const send_invite_attribute = _.find(user_attributes, { id: 'send_invite' });
	const payment_section = _.find(buyer_fields?.sections, { key: SECTIONS?.payment_methods });

	const is_contact_required: boolean = contact_section?.required || false;
	const is_address_required: boolean = address_section?.required || false;

	const available_address = _.filter(all_address?.values, (item: any) => item.status !== 'archived');
	const billing_address = _.filter(available_address, (item: any) => item.type === 'billing');
	const shipping_address = _.filter(available_address, (item: any) => item.type === 'shipping');

	const contact_permission = get_permission(contact_section, edit_buyer_id);

	const billing_address_permission = get_permission(address_section, edit_buyer_id, 'billing');
	const shipping_address_permission = get_permission(address_section, edit_buyer_id, 'shipping');

	const payment_permission = get_permission(payment_section, edit_buyer_id);

	const paymeny_length = _.keys(all_cards?.saved_payment_methods)?.length || 0;
	const payment_account_length = _.keys(all_cards?.saved_bank_accounts)?.length || 0;

	const buyer_form_tabs = _.map(sorted_data, (item) => {
		switch (item?.key) {
			case SECTIONS.contact:
				if (all_contacts?.values?.length === 0 ? contact_permission?.is_add : true) {
					return item;
				} else {
					return null;
				}
			case SECTIONS.address:
				if (all_address?.values?.length === 0 ? billing_address_permission?.is_add || shipping_address_permission?.is_add : true) {
					return item;
				} else {
					return null;
				}
			case SECTIONS.payment_methods:
				if (paymeny_length === 0 ? payment_permission?.is_add : true) {
					return item;
				} else {
					return null;
				}
			default:
				return item;
		}
	}).filter((item) => item !== null);

	const handle_show_toast = (obj: any) => {
		set_show_toast({ state: true, title: obj?.title, sub_title: obj.subtitle, type: obj?.state });
	};

	return (
		<FormProvider {...methods}>
			{is_loading ? (
				<BuyerFormSkeleton />
			) : (
				<React.Fragment>
					<PageHeader
						leftSection={
							<Grid container>
								<Grid sx={{ cursor: 'pointer', marginTop: '2.8px' }}>
									<Icon color={theme?.quick_add_buyer?.header?.text} onClick={on_cancel} iconName='IconArrowLeft' />
								</Grid>
								<Grid item ml={1}>
									<CustomText type='H2'>{id ? buyer_name : 'Add customer'}</CustomText>
								</Grid>
							</Grid>
						}
						rightSection={
							<Grid container justifyContent={'right'}>
								<Grid item>
									<Button variant='outlined' onClick={handle_cancel}>
										Cancel
									</Button>
								</Grid>
								<Grid sx={{ cursor: 'pointer' }} item ml={1}>
									<Button
										loading={btn_loading}
										disabled={!_.isEmpty(errors) || upload_loader}
										variant='contained'
										onClick={handleSubmit(on_submit)}>
										Save
									</Button>
								</Grid>
							</Grid>
						}
					/>

					{/* <Grid className='edit-buyer-tab' sx={{ width: '100%' }} item xs={12} sm={12} md={12}>
						<Grid container alignItems='center' justifyContent='center'>
							<Grid item id='tabs' className='tab_item_container' lg={8}>
								<TabsSection
									sections={buyer_form_tabs}
									handle_scroll_to_section={handle_scroll_to_section}
									active_tab={active_tab}
									set_active_tab={set_active_tab}
									errors={errors}
								/>
								<Box sx={{ marginLeft: 0, marginRight: 0, marginBottom: '16px' }} className='view-buyer-tab-line' mt={-2.2} />
							</Grid>
						</Grid>
					</Grid> */}

					<Grid id='container' overflow='scroll' container justifyContent='center'>
						<Grid item md={8} xs={11} sx={{ mb: 'calc(100vh - 75rem)' }}>
							{_.map(sorted_data, (item: any, i: number) => {
								const error_keys = _.keys(errors);

								return (
									<Box key={item.key} bgcolor={theme?.quick_add_buyer?.background} borderRadius={'12px'}>
										{item.key === SECTIONS.basic_details && item?.is_display !== false && (
											<section id={item?.name}>
												<CustomText id={item?.key} type='H2' className={classes.text}>
													{item.name}
												</CustomText>

												<BasicDetails
													handle_blur={handle_blur}
													item={item}
													is_loading={is_loading}
													set_display_name_changed={set_display_name_changed}
													setValue={setValue}
												/>
											</section>
										)}
										{item?.key === SECTIONS.contact &&
											item?.is_display !== false &&
											(all_contacts?.values?.length === 0 ? contact_permission?.is_add : true) && (
												<section id={item?.name}>
													<CustomText
														id={item?.key}
														type='H2'
														color={error_keys?.includes(item?.key) ? '#D74C10' : 'black'}
														className={classes.text}>
														{item.name}
														{is_contact_required && '*'}
													</CustomText>
													{error_keys?.includes(item?.key) && (
														<CustomText type='Caption' color='#D74C10' style={{ paddingLeft: '20px' }}>
															Contact is mandatory
														</CustomText>
													)}
													<Grid className='add-details-card-container' mb={2} padding={2}>
														{_.map(all_contacts.values, (contact_item, contact_index: number) => {
															if (contact_item?.status === 'archived') {
																return;
															}

															return (
																<ContactCard
																	key={`contact_card_${contact_index}`}
																	is_editable={contact_permission?.is_edit}
																	item={contact_item}
																	primary_contact_id={all_contacts.primary_contact}
																	on_edit_press={() => on_edit_contact(contact_index)}
																	buyer_fields={buyer_fields}
																/>
															);
														})}

														{all_contacts?.values.length < (contact_section?.max_entities || Infinity) && contact_permission?.is_add && (
															<AddContactCard on_card_press={on_add_new_contact} />
														)}
													</Grid>
												</section>
											)}

										{item.key === SECTIONS.address &&
											item?.is_display !== false &&
											(all_address?.values?.length === 0
												? billing_address_permission?.is_add || shipping_address_permission?.is_add
												: true) && (
												<section id={item?.name}>
													{_.size(item?.is_display_exclusion_type) !== 2 && (
														<>
															<CustomText
																id={item?.key}
																type='H2'
																color={error_keys?.includes(item?.key) ? '#D74C10' : 'black'}
																className={classes.text}>
																Addresses
															</CustomText>
															{error_keys?.includes(item?.key) && (
																<CustomText type='Caption' color='#D74C10' style={{ paddingLeft: '20px' }}>
																	Address is mandatory
																</CustomText>
															)}
														</>
													)}

													{!_.some(item?.is_display_exclusion_type, (val) => val === 'billing') &&
														(billing_address?.length === 0 ? billing_address_permission?.is_add : true) && (
															<>
																<CustomText type='H2' color='rgba(0, 0, 0, 0.6)' className={classes.text} style={{ marginTop: 0 }}>
																	Billing Address
																	{!_.some(item?.required_exclusion_type, (val) => val === 'billing') && is_address_required && '*'}
																</CustomText>
																{error_keys?.includes('billing') && (
																	<CustomText type='Caption' color='#D74C10' style={{ paddingLeft: '20px' }}>
																		Billing Address is mandatory
																	</CustomText>
																)}

																<Grid className='add-details-card-container' padding={2}>
																	{_.map(all_address.values, (address_item, address_index: number) => {
																		if (address_item.type !== 'billing') return;
																		if (address_item?.status === 'archived') {
																			return;
																		}

																		let transformed_address = _.cloneDeep(address_item);
																		transformed_address = clubAdditionals(transformed_address);
																		return (
																			<AddressCard
																				key={`address_card_${address_index}`}
																				is_editable={billing_address_permission?.is_edit}
																				item={transformed_address}
																				is_shipping_type={false}
																				primary_address_id={all_address.default_billing_address}
																				on_edit_press={() => on_edit_address(false, address_index)}
																				buyer_fields={buyer_fields}
																			/>
																		);
																	})}
																	{billing_address?.length < (address_section?.billing_max_entities || Infinity) &&
																		billing_address_permission?.is_add && (
																			<AddAddressCard is_shipping_type={false} on_card_press={() => on_add_new_address(false)} />
																		)}
																</Grid>
															</>
														)}

													<hr></hr>

													{!_.some(item?.is_display_exclusion_type, (val) => val === 'shipping') &&
														(shipping_address?.length === 0 ? shipping_address_permission?.is_add : true) && (
															<>
																<CustomText type='H2' color='rgba(0, 0, 0, 0.6)' className={classes.text} style={{ marginTop: 0 }}>
																	Shipping Address
																	{!_.some(item?.required_exclusion_type, (val) => val === 'shipping') && is_address_required && '*'}
																</CustomText>
																{error_keys?.includes('shipping') && (
																	<CustomText type='Caption' color='#D74C10' style={{ paddingLeft: '20px' }}>
																		Shipping Address is mandatory
																	</CustomText>
																)}

																<Grid className='add-details-card-container' padding={2}>
																	{_.map(all_address.values, (address_item, address_index: number) => {
																		if (address_item.type !== 'shipping') return;
																		if (address_item?.status === 'archived') {
																			return;
																		}

																		let transformed_address = _.cloneDeep(address_item);
																		transformed_address = clubAdditionals(transformed_address);
																		return (
																			<AddressCard
																				key={`address_card_${address_index}`}
																				is_editable={shipping_address_permission?.is_edit}
																				item={transformed_address}
																				is_shipping_type={true}
																				primary_address_id={all_address.default_shipping_address}
																				on_edit_press={() => on_edit_address(true, address_index)}
																				buyer_fields={buyer_fields}
																			/>
																		);
																	})}
																	{shipping_address?.length < (address_section?.shipping_max_entities || Infinity) &&
																		shipping_address_permission?.is_add && (
																			<AddAddressCard is_shipping_type={true} on_card_press={() => on_add_new_address(true)} />
																		)}
																</Grid>
															</>
														)}
												</section>
											)}

										{item.key === SECTIONS.tax_section && item?.is_display !== false && (
											<section id={item?.name}>
												<CustomText
													type='H2'
													id={item?.key}
													style={{ marginTop: '2rem', fontSize: '1.8rem', paddingTop: '1rem', paddingLeft: '1.8rem' }}>
													{item.name}
												</CustomText>

												<TaxPreferences items={item} />
											</section>
										)}

										{(paymeny_length === 0 ? payment_permission?.is_add : true) && (
											<Can I={PERMISSIONS.view_payment.slug} a={PERMISSIONS.view_payment.permissionType}>
												{item.key === SECTIONS.payment_methods && item?.is_display !== false && (
													<section style={{ display: 'flex', flexDirection: 'column', marginTop: '16px' }} id={item?.name}>
														<CustomText id={item?.key} type='H2' className={classes.text}>
															{t('OrderManagement.CartCheckoutCard.PaymentMethods')}
														</CustomText>
														<PaymentMethods
															type={PAYMENT_METHODS.CARD}
															container_style={{ padding: '16px' }}
															title='Card'
															list_container_class='add-details-card-container'
															add_payment_method={
																paymeny_length < (payment_section?.max_entities || Infinity) &&
																payment_permission?.is_add && (
																	<Can I={PERMISSIONS.add_payment.slug} a={PERMISSIONS.add_payment.permissionType}>
																		<AddPaymentCard type={PAYMENT_METHODS.CARD} on_card_press={on_add_new_card} />
																	</Can>
																)
															}
															payment_methods={all_cards?.saved_payment_methods}
															is_editable={payment_permission?.is_edit}
															on_edit_press={on_edit_payment_method}
															primary_card_id={all_cards.default_payment_method_id}
														/>
														{payment_config?.payment_gateway !== payment_gateways.PCI_VAULT && (
															<>
																<Divider sx={{ borderStyle: 'dashed', borderColor: '#B5BBC3' }} />
																<Grid sx={{ padding: '0px 16px' }}>
																	<PaymentMethods
																		type={PAYMENT_METHODS.ACH}
																		container_style={{ padding: '16px 0px' }}
																		title='ACH'
																		list_container_class='add-details-card-container'
																		add_payment_method={
																			paymeny_length < (payment_section?.max_entities || Infinity) &&
																			payment_permission?.is_add && (
																				<Can I={PERMISSIONS.add_payment.slug} a={PERMISSIONS.add_payment.permissionType}>
																					<AddPaymentCard type={PAYMENT_METHODS.ACH} on_card_press={on_add_new_ach_card} />
																				</Can>
																			)
																		}
																		payment_methods={all_cards?.saved_bank_accounts}
																		is_editable={payment_permission?.is_edit}
																		on_edit_press={on_edit_ach_payment_method}
																		primary_card_id={all_cards.default_payment_method_id}
																	/>
																</Grid>
															</>
														)}
													</section>
												)}
											</Can>
										)}

										{item.key === SECTIONS.preferences && item?.is_display !== false && (
											<section id={item?.name}>
												<CustomText type='H2' id={item?.key} className={classes.text}>
													{item.name}
												</CustomText>
												<Preferences item={item} />
											</section>
										)}

										{item.key === SECTIONS.other_details && item?.is_display !== false && (
											<section id={item?.name}>
												<CustomText type='H2' id={item?.key} className={classes.text}>
													{item.name}
												</CustomText>
												<OtherDetails
													set_show_toast={set_show_toast}
													all_attachments={all_attachments}
													delete_attachment={delete_attachment}
													handle_added_files={handle_added_files}
													item={item}
													uploaded_files={uploaded_files}
													is_loading={upload_loader}
													set_value={setValue}
												/>
											</section>
										)}
										{item.key === SECTIONS.wizshop_users && item?.is_display !== false && (
											<section id={item?.name} style={{ paddingBottom: '24px' }}>
												<CustomText type='H2' id={item?.key} className={classes.text}>
													{item.name}
												</CustomText>
												<StoreFrontTable
													set_open_storefront_user={set_open_storefront_user}
													set_storefront_edit_user={set_storefront_edit_user}
													all_wizshop_users={all_wizshop_users}
													handle_update_form={handle_update_form}
												/>
											</section>
										)}
										{buyer_fields?.sections?.length === i + 1 ? null : <Box />}
									</Box>
								);
							})}
						</Grid>
					</Grid>

					<DiscardModal is_open_alert={is_open_alert} on_close={on_close} go_back={go_back} />

					{open_storefront_user && (
						<StoreFrontAddUser
							wizshop_attributes={filter_wizshop_attributes}
							checkbox_attributes={send_invite_attribute}
							open={open_storefront_user}
							set_open={set_open_storefront_user}
							storefront_edit_user={storefront_edit_user}
							set_storefront_edit_user={set_storefront_edit_user}
							handle_update_form={handle_update_form}
							all_wizshop_users={all_wizshop_users}
						/>
					)}

					<AddContactDrawer
						is_visible={show_contact_sheet_detail?.is_open}
						close={close_contact_sheet}
						all_contacts={all_contacts?.values}
						buyer_fields={buyer_fields}
						contact_index={show_contact_sheet_detail?.index}
						selected_value={all_contacts?.values[show_contact_sheet_detail?.index]}
						primary_contact_id={all_contacts?.primary_contact}
						handle_update_form={handle_update_form}
						delete_contact={delete_contact}
						edit_mode={edit_mode}
						contact_delete_permission={contact_permission?.is_delete}
					/>
					<AddAddressDrawer
						edit_buyer_id={edit_buyer_id}
						show_address_sheet_detail={show_address_sheet_detail}
						close={close_address_sheet}
						all_address={all_address?.values}
						buyer_fields={buyer_fields}
						selected_value={all_address.values[show_address_sheet_detail?.index]}
						primary_address_id={
							show_address_sheet_detail?.is_shipping_type ? all_address?.default_shipping_address : all_address?.default_billing_address
						}
						handle_update_form={handle_update_form}
						delete_address={delete_address}
						edit_mode={edit_mode}
					/>
					<AddPaymentModal
						all_address={all_address?.values}
						buyer_id={edit_buyer_id}
						customer_id={all_cards?.customer_id}
						web_token={payment_config?.web_token}
						is_visible={show_payment_sheet_detail.is_open}
						close={close_payment_sheet}
						all_cards={all_cards}
						payment_method_id={show_payment_sheet_detail.payment_method_id}
						primary_card_id={all_cards.default_payment_method_id}
						handle_update_form={handle_update_form}
						delete_card={delete_card}
						payment_delete_permission={payment_permission?.is_delete}
						// edit_mode={edit_mode}
						edit_data={{
							buyer_id: edit_buyer_id || '',
							customer_id: all_cards?.customer_id || '',
							payment_method_id: all_cards.payment_method_ids.find((item: any) => item?.id === show_payment_sheet_detail?.payment_method_id)
								?.id,
							...all_cards.payment_method_ids.find((item: any) => item?.id === show_payment_sheet_detail?.payment_method_id),
						}}
						payment_source={payment_config?.payment_gateway}
					/>
					{handle_render_toaster()}
					<CustomerEmailModal
						is_modal_open={is_modal_open}
						set_is_modal_open={set_is_modal_open}
						is_button_loading={is_button_loading}
						handle_final_submit={handle_final_submit}
						email_data={email_data}
						set_email_data={set_email_data}
						email_checkbox={email_checkbox}
						set_email_checkbox={set_email_checkbox}
					/>
					{show_payment_ach_sheet_detail?.is_open && (
						<AddAchPaymentModal
							payment_method_ids={all_cards?.payment_method_ids}
							delete_card={delete_card}
							buyer_id={id ?? ''}
							handle_update_form={handle_update_form}
							is_visible={show_payment_ach_sheet_detail?.is_open}
							close={close_ach_payment_sheet}
							set_success_toast={handle_show_toast}
							web_token={payment_config?.web_token}
							edit_mode={show_payment_ach_sheet_detail?.edit_mode}
							ach_payment_values={show_payment_ach_sheet_detail?.ach_payment_values}
							primary_card_id={all_cards?.default_payment_method_id}
							payment_method_id={show_payment_ach_sheet_detail?.ach_payment_values?.payment_method_id}
							all_accounts={payment_account_length}
						/>
					)}
				</React.Fragment>
			)}
		</FormProvider>
	);
};

export default AddEditBuyer;
