import React, { useCallback, useContext, useEffect } from 'react';
import CartSummary from '../Cart/CartSummary';
import { Button, Grid, Modal, Toaster } from 'src/common/@the-source/atoms';
import UserDetailSection from '../Sections/UserDetailSection';
import NotesSection from '../Sections/NotesSection';
import OrderQuoteDetailSection from '../Sections/OrderQuoteDetailsSection';
import ShowMoreSection from '../Sections/ShowMoreSection';
import Drawer from '../Drawer/index';
import OrderManagementContext from '../../context';
import AddContactDrawer from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/Drawer/AddContactDrawer';
import AddAddressDrawer from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/Drawer/AddAddressDrawer';
import _ from 'lodash';
import { useTheme } from '@mui/material/styles';

import {
	BUYER_SECTIONS,
	DOCUMENT_SECTION,
	EDIT_ORDER_BUYER_CONSTANT,
	ORDER_SECTION,
	OTHER_SECTION,
	SPECIAL_DOCUMENT_ATTRIBUTE,
} from '../../constants';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import PaymentMethodSection from '../Sections/PaymentMethodSection';
import { isUUID } from 'src/screens/Settings/utils/helper';
import CheckoutManagementContainer from 'src/screens/Checkout/components/CheckoutManagementContainer';
import CustomerConsent from '../Sections/CustomerConsent';
import TagHeader from './TagHeader';
import { Mixpanel } from 'src/mixpanel';
import SalesRepDetailsSection from '../Sections/SalesRepDetailsSection';
import CustomerFieldToggle from './CustomerFieldToggle';
import { DocumentLevelAttributeChangeInfo } from './CommonDocumentComponents';
import { useParams } from 'react-router-dom';
import Events from 'src/utils/events_constants';
import utils from 'src/utils/utils';

const OrderManagementContainer = () => {
	const {
		section_data,
		toast_data,
		show_contact_sheet_detail,
		show_address_sheet_detail,
		close_contact_sheet,
		close_address_sheet,
		format_default_values,
		buyer_data,
		drawer,
		buyer_details_form,
		handle_address_add,
		handle_contact_add,
		handle_update_order,
		edit_order_buyer_data,
		handle_update_edit_order_data,
		loader,
		handle_update_buyer_order_details,
		document_data,
		handle_update_section_to_default_value,
		cart_metadata,
		customer_metadata,
		add_edit_contact_data,
		add_edit_address_data,
	} = useContext(OrderManagementContext);
	const { drawer_type } = drawer;
	const { edit_order_modal_type, edit_order_payload, edit_order_modal_state, edit_order_loader } = edit_order_buyer_data;
	const { update_document_loader } = loader;
	const theme: any = useTheme();
	const { t } = useTranslation();
	const { VITE_APP_REPO } = import.meta.env;
	const is_ultron = VITE_APP_REPO === 'ultron';
	const { document_type = '' } = useParams();
	const {
		show_sync_back_checkbox: contact_sync_checkbox = false,
		show_sync_back_info: contact_sync_info = false,
		data: contact_edit_data = null,
	} = add_edit_contact_data;
	const {
		show_sync_back_checkbox: address_sync_checkbox = false,
		show_sync_back_info: address_sync_info = false,
		data: address_edit_data = null,
	} = add_edit_address_data;

	const handle_render_toast = () => {
		return (
			<Toaster
				open={toast_data?.toast_state}
				showCross={false}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				containerStyle={{
					justifyContent: 'center',
				}}
				state='warning'
				title={toast_data.toast_message}
				subtitle={t('OrderManagement.OrderManagementContainer.Reload')}
				showActions={true}
				primaryBtnName='Reload'
				handlePrimary={() => window.location.reload()}
				handleSecondry={null}
				secondryBtnName='Cancel'
			/>
		);
	};

	const contact_details = _.find(buyer_data?.sections, { key: BUYER_SECTIONS.contact }) || {};
	const address_details = _.find(buyer_data?.sections, { key: BUYER_SECTIONS.address }) || {};

	const all_contacts = format_default_values(_.get(contact_details, DOCUMENT_SECTION.contact, []));
	const all_address = format_default_values(_.get(address_details, DOCUMENT_SECTION.address, []));

	const primary_contact_id = contact_details?.primary_contact;
	const default_shipping_address_id = address_details?.default_shipping_address;
	const default_billing_address_id = address_details?.default_billing_address;

	const handle_get_payload = () => {
		switch (edit_order_modal_type) {
			case 'primary_contact':
			case 'billing_address':
			case 'shipping_address':
				return { [SPECIAL_DOCUMENT_ATTRIBUTE[drawer_type]]: edit_order_payload };
			case 'notification_email_ids':
				return { [drawer_type]: edit_order_payload };
			case 'notes_settings':
				return { [SPECIAL_DOCUMENT_ATTRIBUTE.notes_settings]: edit_order_payload };
			default:
				return edit_order_payload;
		}
	};

	const handle_update_buyer_order = () => {
		const payload_data = handle_get_payload();
		Object.keys(payload_data).map((item) => {
			if (isUUID(item)) {
				delete payload_data?.[item];
			}
		});
		const data = {
			buyer_id: document_data?.buyer_id,
			attributes: handle_get_payload(),
		};
		handle_update_buyer_order_details(data);
		handle_update_order();
		Mixpanel.track(Events.UPDATE_ORDER_CLICKED, {
			tab_name: 'Home',
			page_name: 'cart_page',
			section_name: '',
			subtab_name: '',
			cart_metadata,
			customer_metadata,
		});
	};

	useEffect(() => {
		let arr = [
			{ ...section_data?.specific_section, type: ORDER_SECTION },
			{ ...section_data?.other_section, type: OTHER_SECTION },
		];
		handle_update_section_to_default_value(arr);
	}, []);

	const handle_render_subtitle = () => {
		const filter_back_saving_permitted = _.map(_.keys(edit_order_payload), (key) => _.replace(key, /_/g, ' ')).filter(
			(item) => !isUUID(item),
		);
		const render_payment_names = filter_back_saving_permitted.map((element: any, index: number) => {
			return (
				<CustomText
					key={index}
					style={{
						mr: 0.5,
						fontWeight: 700,
					}}>
					{element}
					{index !== filter_back_saving_permitted.length - 1 && ','}
				</CustomText>
			);
		});

		return (
			<React.Fragment>
				<CustomText style={{ mr: 0.5 }}>{t('OrderManagement.EditBuyerModal.WantToSave')}</CustomText>
				{render_payment_names}
				{t('OrderManagement.EditBuyerModal.ChangesBuyerData')}
			</React.Fragment>
		);
	};

	const handle_render_modal = () => {
		return (
			<Modal
				open={edit_order_modal_state}
				onClose={() => handle_update_edit_order_data(EDIT_ORDER_BUYER_CONSTANT.modal_state, false)}
				title={t('OrderManagement.EditBuyerModal.Title')}
				footer={
					<Grid container justifyContent='flex-end' gap={2}>
						<Button
							loading={update_document_loader}
							disabled={update_document_loader || edit_order_loader}
							onClick={handle_update_order}
							variant='outlined'>
							{t('OrderManagement.EditBuyerModal.UpdateOrder')}
						</Button>
						<Button disabled={update_document_loader || edit_order_loader} loading={edit_order_loader} onClick={handle_update_buyer_order}>
							{t('OrderManagement.EditBuyerModal.UpdateBuyerOrder')}
						</Button>
					</Grid>
				}
				children={
					<CustomText style={{ fontSize: 14 }} type='Body'>
						{edit_order_modal_type === 'payment_section' ? handle_render_subtitle() : t('OrderManagement.EditBuyerModal.SubTitle')}
					</CustomText>
				}
			/>
		);
	};

	const handle_render_content = () => {
		if (is_ultron) {
			return (
				<React.Fragment>
					<TagHeader use_custom_grid={true} />
					<CartSummary />
					{section_data?.user_details && <UserDetailSection data={section_data?.user_details} />}
					{section_data?.specific_section && section_data?.specific_section?.is_display !== false && (
						<OrderQuoteDetailSection data={section_data?.specific_section} />
					)}
					{section_data?.sales_rep_details_section && utils.handle_check_display(section_data?.sales_rep_details_section) && (
						<SalesRepDetailsSection data={section_data?.sales_rep_details_section} />
					)}
					{section_data?.notes && section_data?.notes?.is_display !== false && <NotesSection data={section_data?.notes} />}
					{section_data?.payment_method && section_data?.payment_method?.is_display !== false && document_data.type === 'order' && (
						<PaymentMethodSection
							style={{
								borderRadius: '8px',
								backgroundColor: theme?.order_management?.order_manage_container?.background_color,
								padding: is_ultron ? '1.5rem 3rem' : '1rem 3rem',
								marginBottom: is_ultron ? '2rem' : '0rem',
							}}
							data={section_data?.payment_method}
						/>
					)}
					{section_data?.other_section && <ShowMoreSection data={section_data?.other_section} section_data={section_data} />}

					{!_.isEmpty(section_data?.customer_consent) && utils.handle_check_display(section_data?.customer_consent) && (
						<CustomerConsent data={section_data?.customer_consent} />
					)}
				</React.Fragment>
			);
		} else {
			return <CheckoutManagementContainer />;
		}
	};
	const render_contact_extra_fields = useCallback(() => {
		return contact_sync_checkbox ? (
			<CustomerFieldToggle
				defaultValue={true}
				label={
					contact_edit_data
						? t('OrderManagement.OrderManagementContainer.SaveChangesToCustomerProfile')
						: t('OrderManagement.OrderManagementContainer.AddToCustomerProfile')
				}
			/>
		) : contact_sync_info ? (
			<DocumentLevelAttributeChangeInfo doc_type={document_type} />
		) : null;
	}, [contact_edit_data, show_contact_sheet_detail]);

	const render_address_extra_fields = useCallback(() => {
		return address_sync_checkbox ? (
			<CustomerFieldToggle
				defaultValue={true}
				label={
					address_edit_data
						? t('OrderManagement.OrderManagementContainer.SaveChangesToCustomerProfile')
						: t('OrderManagement.OrderManagementContainer.AddToCustomerProfile')
				}
			/>
		) : address_sync_info ? (
			<DocumentLevelAttributeChangeInfo doc_type={document_type} />
		) : null;
	}, [add_edit_address_data, show_address_sheet_detail]);

	return (
		<Grid
			item
			xl={7.9}
			lg={7.9}
			md={7.9}
			sm={12}
			xs={12}
			mb={1.5}
			sx={{
				pb: { xl: 10, lg: 10, md: 0, sm: 0, xs: 0 },
			}}>
			{handle_render_content()}
			<Drawer />
			{handle_render_toast()}
			<AddContactDrawer
				is_visible={show_contact_sheet_detail?.is_open}
				close={close_contact_sheet}
				all_contacts={all_contacts}
				buyer_fields={buyer_details_form}
				contact_index={show_contact_sheet_detail?.index}
				selected_value={add_edit_contact_data?.data}
				primary_contact_id={primary_contact_id}
				show_primary={false}
				handle_update_form={handle_contact_add}
				delete_contact={close_contact_sheet}
				close_on_submit={false}
				extra_fields={render_contact_extra_fields()}
				validate_field_id={false}
				show_delete={false}
			/>
			<AddAddressDrawer
				show_address_sheet_detail={show_address_sheet_detail}
				close={close_address_sheet}
				all_address={all_address}
				buyer_fields={buyer_details_form}
				selected_value={add_edit_address_data?.data}
				show_primary={false}
				primary_address_id={show_address_sheet_detail?.is_shipping_type ? default_billing_address_id : default_shipping_address_id}
				handle_update_form={handle_address_add}
				delete_address={close_address_sheet}
				close_on_submit={false}
				extra_fields={render_address_extra_fields()}
				validate_field_id={false}
				show_delete={false}
			/>
			{handle_render_modal()}
		</Grid>
	);
};

export default OrderManagementContainer;
