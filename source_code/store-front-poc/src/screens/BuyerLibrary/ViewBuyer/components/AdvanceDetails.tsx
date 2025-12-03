/* eslint-disable */
import React, { useState } from 'react';
import { Box, Chip, Grid, Icon, Image } from 'src/common/@the-source/atoms';
import { PAYMENT_METHODS, SECTIONS } from '../../constants';
import _, { isEmpty } from 'lodash';
import CustomText from 'src/common/@the-source/CustomText';
import { useTheme } from '@mui/material/styles';
import useStyles from '../../styles';
import AddressCard from '../../AddEditBuyerFlow/components/AddressCard';
import utils from 'src/utils/utils';
import { PERMISSIONS } from 'src/casl/permissions';
// import PaymentCard from '../../AddEditBuyerFlow/components/PaymentCard';
import ContactCard from '../../AddEditBuyerFlow/components/ContactCard';
import Can from 'src/casl/Can';
import dayjs from 'dayjs';
import uploaded_file from '../../../../assets/images/uploaded_img.svg';

import { formattedValue } from 'src/utils/common';
import AddAddressDrawer from '../../AddEditBuyerFlow/components/Drawer/AddAddressDrawer';
import ManageDrawer from './ManageDrawer';
import useAddEditBuyer from '../../AddEditBuyerFlow/components/AddEditBuyer/useAddEditBuyer';
import AddPaymentModal from '../../AddEditBuyerFlow/components/Drawer/AddPaymentModal';
import AddContactDrawer from '../../AddEditBuyerFlow/components/Drawer/AddContactDrawer';
import ViewStoreFront from './ViewStoreFront';
import { get_permission } from '../../AddEditBuyerFlow/components/helper/helper';
import DOMPurify from 'dompurify';
import { useSelector } from 'react-redux';
import PaymentMethods from './PaymentMethods';
import AddAchPaymentModal from 'src/screens/Payment/component/AddAchPaymentModal';
import { BUYER_SECTIONS } from 'src/screens/OrderManagement/constants';

interface Props {
	buyer_details: any;
	primary_contact_id?: string;
	billing_id?: string;
	shipping_id?: string;
	drawer?: boolean;
	fetch_buyer?: any;
	buyer_complete_attributes?: any;
	buyer_id?: string;
	set_refetch?: any;
	payment_gateway?: string;
	set_show_card_modal?: (val: boolean) => void;
	set_selected_payment_method?: (val: string) => void;
}

const text_style = { flex: 1, maxWidth: '70%', wordWrap: 'break-word' };

const AdvanceDetails = ({
	buyer_details,
	primary_contact_id,
	billing_id,
	shipping_id,
	drawer: ParentDrawerState = false,
	fetch_buyer,
	buyer_complete_attributes,
	payment_gateway,
	set_show_card_modal = () => {},
	set_selected_payment_method = () => {},
	buyer_id,
	set_refetch,
}: Props) => {
	const classes = useStyles();
	const theme: any = useTheme();
	const { VITE_APP_API_URL, VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';
	const is_store_front = VITE_APP_REPO === 'store_front';
	const [drawer, set_drawer] = useState<any>({ state: ParentDrawerState, type: '' });
	const preferences: any = buyer_details?.find((item: any) => item?.key === SECTIONS.preferences);
	const contact_section = buyer_details?.find((item: any) => item?.key === SECTIONS.contact);
	const payment: any = buyer_details?.find((item: any) => item?.key === SECTIONS.payment_methods);
	const default_payment_id = payment?.attributes?.find((i: any) => i?.id === 'default_payment_method_id')?.value;
	const primary_card: any =
		payment?.saved_payment_methods?.[default_payment_id] ?? payment?.saved_bank_accounts?.[default_payment_id] ?? [];

	const contact_permission = get_permission(contact_section, buyer_id);
	const payment_permission = get_permission(payment, buyer_id);
	const manage_permission = useSelector((state: any) => state?.settings?.excluded_profile_manage_permissions) || [];

	const {
		show_address_sheet_detail,
		edit_mode,
		handle_update_form,
		all_address,
		all_contacts,
		all_cards,
		on_add_new_address,
		on_edit_address,
		delete_address,
		close_address_sheet,
		buyer_fields,
		on_submit,
		payment_config,
		on_edit_contact,
		show_payment_sheet_detail,
		close_payment_sheet,
		delete_card,
		on_edit_payment_method,
		on_add_new_card,
		on_add_new_ach_card,
		show_payment_ach_sheet_detail,
		close_ach_payment_sheet,
		on_add_new_contact,
		show_contact_sheet_detail,
		close_contact_sheet,
		methods,
		initial_addresses,
		initial_cards,
		btn_loading,
		delete_contact,
		on_edit_ach_payment_method,
	} = useAddEditBuyer({}, buyer_id, set_refetch);

	const { handleSubmit } = methods;

	const style1 = is_store_front ? { margin: '24px 0 12px 0' } : {};
	const style2 = is_store_front ? { marginBottom: '32px' } : { marginBottom: '16px' };

	const handle_empty_state = (icon: any, label: string) => {
		return (
			<Grid className={classes.view_details_card_container} mb={3}>
				<Grid
					className={`${classes.view_details_card}} ${classes.empty_card_style}`}
					style={{ ...theme?.view_buyer?.custom_card_style, ...theme?.card_, gap: '8px' }}>
					<Icon iconName={icon} sx={{ transform: 'scale(1.8)' }} color={theme?.view_buyer?.other_details?.empty_state?.icon} />
					<CustomText type='Body' color={theme?.view_buyer?.other_details?.empty_state?.text}>
						{label}
					</CustomText>
				</Grid>
			</Grid>
		);
	};

	const render_divider = <hr className='divider-line-style' />;

	const handle_render_upload = (item: any) => {
		const attachment_attributes = _.get(item, 'attachments', []);
		const custom_attributes = _.get(item, 'custom_attributes', []);
		const excluded_wizshop_attributes = _.get(item, 'exclude_wizshop_attributes', []);

		let is_custom_attributes_empty = true;
		_.map(custom_attributes, (attribute) => {
			if (attribute?.value) {
				is_custom_attributes_empty = false;
			}
		});

		if (_.isEmpty(attachment_attributes) && is_custom_attributes_empty) {
			return null;
		}

		const handle_render_date = (date: any) => {
			const parsed_date = dayjs(date);
			const formatted_date = parsed_date.format('DD MMM YYYY');
			return formatted_date;
		};

		const handle_view_image = (attachment_id: any) => {
			let url = `${VITE_APP_API_URL}artifact/v1/file/${attachment_id}`;
			window.open(url, '_blank');
		};

		const handle_view_url = (url: string) => {
			window.open(url, '_blank');
		};

		const handleClick = (attachment_item: any) => {
			if (attachment_item?.file_url) {
				handle_view_url(attachment_item?.file_url);
			} else {
				handle_view_image(attachment_item?.file_id);
			}
		};

		return (
			<React.Fragment>
				<CustomText type='H3' style={{ margin: '8px 0' }}>
					{item?.name}
				</CustomText>
				{!_.isEmpty(attachment_attributes) && (
					<Grid py={1.5} className={drawer ? 'add-details-card-container' : 'storefront_add-details-card-container'}>
						{_.map(attachment_attributes, (attachment_item, attachment_index) => {
							if (attachment_item?.status === 'archived') return;
							return (
								<Grid
									display='flex'
									flexWrap='wrap'
									height='auto'
									key={attachment_index}
									className={classes.uploaded_item}
									sx={{ cursor: 'pointer' }}
									onClick={() => handleClick(attachment_item)}>
									{attachment_item?.file_url ? (
										<Image
											width={50}
											// onClick={() => handle_view_url(attachment_item?.file_url)}
											height={50}
											style={{ cursor: 'pointer', marginRight: 10, borderRadius: 8, maxHeight: '50px' }}
											src={attachment_item?.file_url}
											fallbackSrc={uploaded_file}
										/>
									) : (
										<Image
											width={50}
											// onClick={() => handle_view_image(attachment_item?.file_id)}
											height={50}
											style={{ cursor: 'pointer', marginRight: 10, borderRadius: 8 }}
											src={uploaded_file}
											fallbackSrc={uploaded_file}
										/>
									)}
									<Box display='flex' flexDirection='column' flexWrap='wrap' p={1}>
										<CustomText type='Body' color={theme?.view_buyer?.other_details?.upload?.primary}>
											{attachment_item?.file_name || 'Uploaded File'}
										</CustomText>
										<CustomText type='Caption' color={theme?.view_buyer?.other_details?.upload?.secondary}>
											{attachment_item?.created_at && handle_render_date(attachment_item?.created_at)}
										</CustomText>
									</Box>
								</Grid>
							);
						})}
					</Grid>
				)}
				{!is_custom_attributes_empty && (
					<Grid py={1.5}>
						{_.map(custom_attributes, (attribute: any, index: any) => {
							if (is_store_front && _.includes(excluded_wizshop_attributes, attribute?.id)) return;
							const formatted_value = formattedValue(attribute?.value, attribute);
							if (attribute?.type === 'html') {
								return (
									<Grid key={`attribute${index}`} display='flex' gap={1} alignItems={'center'} p={'4px 0px'}>
										<CustomText type='Body' style={{ flex: 0.35 }}>
											{attribute?.name}
										</CustomText>
										<CustomText type='Body' style={text_style}>
											<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(attribute?.value) }} className='html-div' />
										</CustomText>
									</Grid>
								);
							} else
								return (
									<Grid key={`attribute${index}`} display='flex' gap={1} alignItems={'center'} p={'4px 0px'}>
										<CustomText type='Body' style={{ flex: 0.35 }}>
											{attribute?.name}
										</CustomText>
										<CustomText type='Body' style={text_style}>
											{formatted_value || '--'}
										</CustomText>
									</Grid>
								);
						})}
					</Grid>
				)}
			</React.Fragment>
		);
	};

	const handle_refetch_contacts = () => {
		if (!all_contacts) return;

		const _all_contacts = _.cloneDeep(all_contacts);
		if (_all_contacts && _all_contacts?.values) {
			_all_contacts.values = _.map(_all_contacts.values, (contact) => {
				if (contact.status === 'archived') {
					return { ...contact, status: '' };
				}
				return contact;
			});
		}
		handle_update_form(BUYER_SECTIONS.contact, _all_contacts);
	};

	const handle_render_single_chip = (chip_value: any, options: any[]) => {
		let filtered_data = _.filter(options, { value: chip_value });
		let chip_label = _.map(filtered_data, 'label') || chip_value;
		if (chip_value) {
			return (
				<Chip
					size='small'
					bgColor={theme?.view_buyer?.other_details?.chip?.background}
					label={
						<CustomText color={theme?.view_buyer?.other_details?.chip?.text} type='Body'>
							{chip_label}
						</CustomText>
					}
				/>
			);
		}
	};

	const has_manage_permission = (type: string) => {
		return !_.includes(manage_permission, type);
	};

	const handle_render_manage = (item: any, type: string) => {
		return is_store_front ? (
			<CustomText
				onClick={() => {
					if (type === 'contacts') {
						handle_refetch_contacts();
					}
					set_drawer({ type, state: true });
				}}
				type='Subtitle'
				style={{
					cursor: 'pointer',
					color: theme?.button?.color,
					textDecorationLine: theme?.order_management?.style?.text_decoration_line,
				}}>
				Manage
			</CustomText>
		) : null;
	};

	const handle_close = () => {
		handle_update_form(
			drawer.type === 'payment_methods' ? 'payment_methods' : 'addresses',
			drawer.type === 'payment_methods' ? initial_cards : initial_addresses,
		);
		set_drawer({ state: false, type: '' });
	};

	return (
		<Grid>
			{_.map(buyer_details, (item: any, key: number) => {
				let billing_arr = [],
					shipping_arr = [];

				if (item.key === SECTIONS.address) {
					for (let i = 0; i < item.addresses.length; i++) {
						const element = item.addresses[i];
						const addr_type = _.find(element?.attributes, { id: 'type' })?.value;
						if (addr_type === 'billing') billing_arr?.push(element);
						else if (addr_type === 'shipping') shipping_arr?.push(element);
					}
				}
				return (
					<Grid key={`section${key}`}>
						{item?.key === SECTIONS?.contact && item?.is_display !== false && (
							<React.Fragment>
								<Grid display='flex' justifyContent='space-between' sx={style1} alignItems={'center'}>
									<CustomText type='H3' style={{ margin: '8px 0px' }}>
										{item?.name}
									</CustomText>
									{has_manage_permission('contacts') && handle_render_manage(item, 'contacts')}
								</Grid>
								{_.isEmpty(item?.contacts) && handle_empty_state('user', 'No Contact added')}
								{!_.isEmpty(item?.contacts) && (
									<Grid
										className={drawer ? classes.view_details_card_container : classes.storefront_drawer_view_details_card_container}
										mb={'32px'}>
										{_.map(item.contacts, (contact_item, contact_index) => {
											const contact_obj: any = {
												id: contact_item.id,
											};
											_.forEach(contact_item?.attributes, (attribute: any) => {
												if (attribute?.id) contact_obj[attribute?.id] = attribute?.value;
											});
											return (
												<ContactCard
													key={`contact_card_${contact_index}`}
													is_editable={false}
													item={contact_obj}
													style={{
														height: 'auto',
													}}
													primary_contact_id={primary_contact_id}
													buyer_fields={buyer_complete_attributes}
												/>
											);
										})}
									</Grid>
								)}
							</React.Fragment>
						)}

						{item?.key === SECTIONS?.address && item?.is_display !== false && (
							<React.Fragment>
								{!_.includes(item?.is_display_exclusion_type, 'billing') && (
									<>
										<Grid display='flex' justifyContent='space-between' sx={style1} alignItems={'center'}>
											<CustomText type='H3' style={{ margin: '8px 0' }}>
												Billing Address
											</CustomText>
											{has_manage_permission('billing_address') && handle_render_manage(item, 'billing_address')}
										</Grid>
										{_.isEmpty(billing_arr) && handle_empty_state('IconReceipt', 'Billing address not added')}
										{!_.isEmpty(billing_arr) && (
											<Grid
												className={drawer ? classes.view_details_card_container : classes.storefront_drawer_view_details_card_container}
												mb={'16px'}
												sx={style2}>
												{_.map(billing_arr, (address_item, address_index) => {
													const { id: address_id, attributes } = address_item;
													const address_obj = utils.get_address_object(address_id, attributes);

													return (
														<AddressCard
															key={`address_card_${address_index}`}
															is_editable={false}
															item={address_obj}
															style={{ height: 'auto', ...theme?.view_buyer?.custom_card_style }}
															is_shipping_type={false}
															primary_address_id={billing_id}
															buyer_fields={buyer_complete_attributes}
														/>
													);
												})}
											</Grid>
										)}
									</>
								)}

								{item?.key === SECTIONS?.address && render_divider}

								{!_.includes(item?.is_display_exclusion_type, 'shipping') && (
									<>
										<Grid display='flex' justifyContent='space-between' sx={style1} alignItems={'center'}>
											<CustomText type='H3' style={{ margin: '8px 0' }}>
												Shipping Address
											</CustomText>
											{has_manage_permission('shipping_address') && handle_render_manage(item, 'shipping_address')}
										</Grid>
										{_.isEmpty(shipping_arr) && handle_empty_state('IconTruckDelivery', 'Shipping address not added')}
										{!_.isEmpty(shipping_arr) && (
											<Grid
												className={drawer ? classes.view_details_card_container : classes.storefront_drawer_view_details_card_container}
												mb={'16px'}
												sx={style2}>
												{_.map(shipping_arr, (address_item, address_index) => {
													const { id: address_id, attributes } = address_item;
													const address_obj = utils?.get_address_object(address_id, attributes);
													return (
														<AddressCard
															style={{
																height: 'auto',
																...theme?.view_buyer?.custom_card_style,
															}}
															key={`address_card_${address_index}`}
															is_editable={false}
															item={address_obj}
															is_shipping_type={true}
															primary_address_id={shipping_id}
															buyer_fields={buyer_complete_attributes}
														/>
													);
												})}
											</Grid>
										)}
									</>
								)}
							</React.Fragment>
						)}

						<Can I={PERMISSIONS.view_payment.slug} a={PERMISSIONS.view_payment.permissionType}>
							{item?.key === SECTIONS.payment_methods && item?.is_display !== false && (
								<React.Fragment>
									<Grid display='flex' justifyContent='space-between' sx={style1} alignItems={'center'}>
										<CustomText type='H3' style={{ margin: '8px 0px' }}>
											{item?.name}
										</CustomText>
										{has_manage_permission('payment_methods') && handle_render_manage(item, 'payment_methods')}
									</Grid>
									{_.isEmpty(item?.saved_bank_accounts) &&
										_.isEmpty(item?.saved_payment_methods) &&
										handle_empty_state('IconCreditCard', 'Payment method not added')}
									{!_.isEmpty(item?.saved_payment_methods) && (
										<PaymentMethods
											type={PAYMENT_METHODS.CARD}
											title={is_ultron ? 'Card' : ''}
											list_container_class={drawer ? 'view-details-card-container' : 'storefront-drawer-view-details-card-container'}
											payment_methods={item.saved_payment_methods}
											primary_card_id={primary_card.payment_method_id}
											empty_state={handle_empty_state('IconCreditCard', 'No Card added')}
											payment_gateway={payment_gateway}
											set_show_card_modal={set_show_card_modal}
											set_selected_payment_method={set_selected_payment_method}
											drawer={drawer}
										/>
									)}
									{!isEmpty(item?.saved_bank_accounts) && !isEmpty(item?.saved_payment_methods) && <Grid mt={3}>{render_divider}</Grid>}
									{!_.isEmpty(item?.saved_bank_accounts) && (
										<PaymentMethods
											type={PAYMENT_METHODS.ACH}
											title={'ACH'}
											list_container_class={drawer ? 'view-details-card-container' : 'storefront-drawer-view-details-card-container'}
											payment_methods={item?.saved_bank_accounts}
											primary_card_id={primary_card.payment_method_id}
											empty_state={handle_empty_state('IconBuildingBank', 'No ACH added')}
										/>
									)}
								</React.Fragment>
							)}
						</Can>

						{item?.key === SECTIONS.preferences && item?.is_display !== false && (
							<React.Fragment>
								{render_divider}
								<Grid container display='flex' justifyContent='space-between' my={is_store_front ? '22px' : ''}>
									<Grid flex={1} className={is_store_front ? classes.store_front_preferences : ''}>
										{_.map(preferences?.attributes, (ele: any) => {
											let data = ele?.value?.split(',');
											if (ele.is_display !== false)
												return (
													<Grid
														sx={{
															padding: '8px 0px',
															display: 'flex',
															flexDirection: is_store_front ? 'column' : 'row',
															gap: 1,
															flex: 1,
														}}>
														<Grid item xs={6} sm={3} md={3} lg={3} xl={3}>
															<CustomText type={is_store_front ? 'H3' : 'Body'}>{ele?.name}</CustomText>
														</Grid>
														{_.isEmpty(data) && '--'}
														{!_.isEmpty(data) ? (
															<Grid
																item
																xs={9}
																sm={9}
																md={9}
																lg={9}
																xl={9}
																height={'auto'}
																display={'flex'}
																rowGap={1.2}
																columnGap={1.2}
																flexWrap={'wrap'}>
																{data?.map((chip: any, index: number) => {
																	if (chip) {
																		const options = _.get(ele, 'options');
																		let filtered_data = _.filter(options, { value: chip });
																		let chip_label = !_.isEmpty(filtered_data) ? _.map(filtered_data, 'label') : chip;

																		return (
																			<Chip
																				key={`chip${index}`}
																				size='small'
																				bgColor={theme?.view_buyer?.other_details?.chip?.background}
																				label={
																					<CustomText color={theme?.view_buyer?.other_details?.chip?.text} type='Body'>
																						{chip_label || '--'}
																					</CustomText>
																				}
																			/>
																		);
																	}
																})}
															</Grid>
														) : (
															<Grid
																item
																xs={9}
																sm={9}
																md={9}
																lg={9}
																xl={9}
																height={'auto'}
																display={'flex'}
																rowGap={1.2}
																columnGap={1.2}
																flexWrap={'wrap'}>
																{handle_render_single_chip(ele?.value, ele?.options)}
															</Grid>
														)}
													</Grid>
												);
										})}
									</Grid>
									{/* {_.some(preferences?.attributes, (attr: any) => attr?.is_display !== false) && handle_render_manage(item, 'preferences')} */}
								</Grid>
							</React.Fragment>
						)}

						{item?.key === SECTIONS?.other_details && item?.is_display !== false && handle_render_upload(item)}

						{item?.key === SECTIONS.wizshop_users && item?.id_display !== false && item?.[SECTIONS.wizshop_users]?.length > 0 && (
							<>
								{render_divider}
								<CustomText type='H3' style={{ marginBottom: '8px', marginTop: '8px' }}>
									{item?.name}
								</CustomText>
								<ViewStoreFront item={item} fetch_buyer={fetch_buyer} />
							</>
						)}
						{item?.is_display !== false &&
							item?.key !== SECTIONS?.basic_details &&
							item?.key !== SECTIONS.payment_methods &&
							key < buyer_details?.length - 1 &&
							has_manage_permission(item?.key) &&
							render_divider}
					</Grid>
				);
			})}
			<AddAddressDrawer
				edit_buyer_id={false}
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

			<AddPaymentModal
				all_address={all_address?.values}
				buyer_id={buyer_id}
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
				payment_source={payment_config?.payment_gateway}
				edit_data={{
					buyer_id: buyer_id || '',
					customer_id: all_cards?.customer_id || '',
					payment_method_id: _.find(all_cards?.payment_method_ids, (item: any) => item?.id === show_payment_sheet_detail?.payment_method_id)
						?.id,
					..._.find(all_cards?.payment_method_ids, (item: any) => item?.id === show_payment_sheet_detail?.payment_method_id),
				}}
			/>
			<ManageDrawer
				is_visible={drawer.state}
				type={drawer.type}
				all_address={all_address}
				all_contacts={all_contacts}
				initial_state={drawer.type === 'payment_methods' ? initial_cards : initial_addresses}
				close={handle_close}
				on_add_new_address={on_add_new_address}
				on_add_new_contact={on_add_new_contact}
				on_edit_address={on_edit_address}
				on_edit_contact={on_edit_contact}
				buyer_fields={buyer_fields}
				on_submit={on_submit}
				handleSubmit={handleSubmit}
				on_edit_payment_method={on_edit_payment_method}
				on_edit_ach_payment_method={on_edit_ach_payment_method}
				all_cards={all_cards}
				on_add_new_card={on_add_new_card}
				on_add_new_ach_card={on_add_new_ach_card}
				btn_loading={btn_loading}
				contact_permission={contact_permission}
				payment_permission={payment_permission}
				buyer_details={buyer_details}
				buyer_id={buyer_id}
			/>
			{show_payment_ach_sheet_detail?.is_open && (
				<AddAchPaymentModal
					payment_method_ids={all_cards?.payment_method_ids}
					delete_card={delete_card}
					buyer_id={buyer_id ?? ''}
					handle_update_form={handle_update_form}
					is_visible={show_payment_ach_sheet_detail?.is_open}
					close={close_ach_payment_sheet}
					web_token={payment_config?.web_token}
					edit_mode={show_payment_ach_sheet_detail?.edit_mode}
					ach_payment_values={show_payment_ach_sheet_detail?.ach_payment_values}
					primary_card_id={all_cards?.default_payment_method_id}
					payment_method_id={show_payment_ach_sheet_detail?.ach_payment_values?.payment_method_id}
				/>
			)}
		</Grid>
	);
};

export default AdvanceDetails;
