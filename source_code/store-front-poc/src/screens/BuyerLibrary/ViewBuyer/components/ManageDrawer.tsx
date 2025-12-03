import { Divider } from '@mui/material';
import _ from 'lodash';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon, Image, SingleSelect } from 'src/common/@the-source/atoms';
import AddressCard from '../../AddEditBuyerFlow/components/AddressCard';
import { clubAdditionals } from '../helper';
import PaymentCard from '../../AddEditBuyerFlow/components/PaymentCard';
import { t } from 'i18next';
import { useTheme } from '@mui/material/styles';
import ContactCard from '../../AddEditBuyerFlow/components/ContactCard';
import { get_permission } from '../../AddEditBuyerFlow/components/helper/helper';
import { SECTIONS } from '../../constants';
import { BUYER_ADDRESS_TYPE } from 'src/screens/OrderManagement/constants';
import { useEffect, useState } from 'react';
import { payments } from 'src/utils/api_requests/payment';
import { useSelector } from 'react-redux';

interface Props {
	is_visible: boolean;
	close: any;
	type: string;
	all_address?: any;
	all_contacts?: any;
	on_add_new_address: any;
	on_add_new_contact: any;
	on_edit_contact?: any;
	on_edit_address: any;
	buyer_fields: any;
	show_address_sheet_detail: any;
	on_submit: any;
	handleSubmit: any;
	on_edit_payment_method: any;
	on_edit_ach_payment_method: any;
	all_cards: any;
	on_add_new_card: any;
	on_add_new_ach_card?: any;
	btn_loading: boolean;
	initial_state: any;
	contact_permission?: any;
	payment_permission?: any;
	buyer_details?: any;
	buyer_id?: string;
}

const ManageComp = ({
	is_visible,
	close,
	type,
	all_address,
	all_contacts,
	on_add_new_address,
	on_add_new_contact,
	on_edit_address,
	buyer_fields,
	on_submit,
	handleSubmit,
	on_edit_contact,
	on_edit_payment_method,
	on_edit_ach_payment_method,
	all_cards,
	on_add_new_card,
	on_add_new_ach_card,
	btn_loading,
	initial_state,
	contact_permission,
	payment_permission,
	buyer_details,
	buyer_id,
}: Props) => {
	const theme: any = useTheme();
	const header = _.replace(_.capitalize(type), '_', ' ');
	const [payment_methods, set_payment_methods] = useState<{ label: string; value: string }[]>([]);
	const [selected_payment, set_selected_payment] = useState<any>(null);
	const address_section = _.find(buyer_details, { key: SECTIONS?.address });
	const contact_section = _.find(buyer_details, { key: SECTIONS?.contact });
	const payment: any = _.find(buyer_details, { key: SECTIONS.payment_methods });
	const billing_address_permission = get_permission(address_section, buyer_id, 'billing');
	const shipping_address_permission = get_permission(address_section, buyer_id, 'shipping');
	const shipping_addresses: any = _.filter(all_address, (address: any) => {
		const type_obj = _.find(address.attributes, { id: 'type' });
		return type_obj?.value === BUYER_ADDRESS_TYPE.shipping;
	});
	const buyer_id_from_redux = useSelector((state: any) => state?.buyer?.buyer_info?.id);
	const billing_addresses = _.filter(all_address, (address) => {
		const type_obj = _.find(address.attributes, { id: 'type' });
		return type_obj?.value === BUYER_ADDRESS_TYPE.billing;
	});
	const empty_address = 'https://frontend-bucket.vercel.app/images/empty_address.svg';
	const empty_address_condition = () =>
		_.filter(
			all_address?.values,
			(address: any) => address?.type === (type === 'shipping_address' ? 'shipping' : 'billing') && address?.status !== 'archived',
		)?.length > 0;
	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>{header}</CustomText>
				<Icon iconName='IconX' sx={{ cursor: 'pointer' }} onClick={close} />
			</Grid>
		);
	};

	const handle_payment_mode_change = (data: any) => {
		set_selected_payment(data?.value);
	};

	useEffect(() => {
		const fetchPaymentMethods = async () => {
			const response: any = await payments.get_payment_methods(buyer_id || buyer_id_from_redux);
			const methods = response?.data?.payment_methods;

			const methodsArray = _.map(_.keys(methods), (key) => ({
				label: _.get(methods, [key, 'label']),
				value: key,
			}));
			set_payment_methods(methodsArray);
			set_selected_payment(_.get(methodsArray, [0, 'value']) || 'card');
		};
		if (type === 'payment_methods') fetchPaymentMethods();
	}, []);

	const permission_based_button: any = () => {
		switch (type) {
			case 'billing_address':
				return billing_address_permission?.is_add && billing_addresses.length < (address_section?.billing_max_entities || Infinity);
			case 'shipping_address':
				return shipping_address_permission?.is_add && shipping_addresses.length < (address_section?.shipping_max_entities || Infinity);
			case 'contacts':
				return contact_permission?.is_add && all_contacts?.values?.length < (contact_section?.max_entities || Infinity);
			case 'payment_methods':
				return payment_permission?.is_add && _.keys(all_cards?.saved_payment_methods)?.length < (payment?.max_entities || Infinity);
			default:
				return true;
		}
	};
	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				{permission_based_button() && (
					<Button
						disabled={btn_loading}
						onClick={() =>
							(type === 'shipping_address' || type === 'billing_address'
								? on_add_new_address(type === 'shipping_address')
								: type === 'contacts'
								? on_add_new_contact()
								: selected_payment === 'ach'
								? on_add_new_ach_card()
								: on_add_new_card())
						}
						variant='outlined'>
						Add new
					</Button>
				)}
				<Button
					loading={btn_loading}
					onClick={handleSubmit(on_submit)}
					disabled={_.isEqual(initial_state, type === 'payment_methods' ? all_cards : type === 'contacts' ? all_contacts : all_address)}>
					Done
				</Button>
			</Grid>
		);
	};

	const render_content_by_type = () => {
		switch (type) {
			case 'billing_address':
			case 'shipping_address':
				return (
					<>
						{empty_address_condition() ? (
							_.map(all_address.values, (address_item, address_index: number) => {
								if (address_item.type !== (type === 'shipping_address' ? 'shipping' : 'billing')) return;
								if (address_item?.status === 'archived') {
									return;
								}
								let transformed_address = _.cloneDeep(address_item);
								transformed_address = clubAdditionals(transformed_address);
								return (
									<AddressCard
										style={{ ...theme?.view_buyer?.custom_card_style, ...theme?.card_ }}
										key={`address_card_${address_index}`}
										is_editable={type === 'shipping_address' ? shipping_address_permission?.is_edit : billing_address_permission?.is_edit}
										item={transformed_address}
										is_shipping_type={type === 'shipping_address'}
										primary_address_id={all_address?.[type === 'shipping_address' ? 'default_shipping_address' : 'default_billing_address']}
										on_edit_press={() => on_edit_address(type === 'shipping_address', address_index)}
										buyer_fields={buyer_fields}
									/>
								);
							})
						) : (
							<Grid flex={1} display='flex' direction='column' justifyContent='center' alignItems='center'>
								<Image height={250} width={250} src={empty_address} alt='empty address' />
								<CustomText type='Subtitle'>{t('OrderManagement.ChangeAddressDrawer.NoAddress')}</CustomText>
							</Grid>
						)}
					</>
				);
			case 'payment_methods':
				return (
					<>
						<SingleSelect
							useDefaultValue
							options={payment_methods}
							defaultValue={selected_payment}
							handleChange={handle_payment_mode_change}
						/>
						{selected_payment === 'card' && (
							<>
								{!_.isEmpty(all_cards?.saved_payment_methods) ? (
									<>
										{_.map(all_cards?.saved_payment_methods, (value, key) => {
											return (
												<PaymentCard
													style={{ ...theme?.view_buyer?.custom_card_style, ...theme?.card_ }}
													key={`payment_card_${key}`}
													item={value}
													primary_card_id={all_cards.default_payment_method_id}
													is_editable={payment_permission?.is_edit}
													on_edit_press={() => on_edit_payment_method(key)}
												/>
											);
										})}
									</>
								) : (
									<Grid flex={1} display='flex' direction='column' justifyContent='center' alignItems='center'>
										<Image height={250} width={250} src={empty_address} alt='empty card' />
										<CustomText type='Subtitle'>{t('OrderManagement.ChangeAddressDrawer.NoCards')}</CustomText>
									</Grid>
								)}
							</>
						)}
						{selected_payment === 'ach' && (
							<>
								{!_.isEmpty(all_cards?.saved_bank_accounts) ? (
									<>
										{_.map(all_cards?.saved_bank_accounts, (value, key) => {
											return (
												<PaymentCard
													style={{ ...theme?.view_buyer?.custom_card_style, ...theme?.card_ }}
													key={`payment_card_${key}`}
													item={value}
													primary_card_id={all_cards.default_payment_method_id}
													is_editable={payment_permission?.is_edit}
													on_edit_press={() => on_edit_ach_payment_method(value)}
													type='ACH'
												/>
											);
										})}
									</>
								) : (
									<Grid flex={1} display='flex' direction='column' justifyContent='center' alignItems='center'>
										<Image height={250} width={250} src={empty_address} alt='empty card' />
										<CustomText type='Subtitle'>{t('Payment.EmptyAch')}</CustomText>
									</Grid>
								)}
							</>
						)}
					</>
				);
			case 'contacts':
				return (
					<>
						{!_.isEmpty(all_contacts?.values) ? (
							_.map(all_contacts.values, (contact_item: any, contact_index: number) => {
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
							})
						) : (
							<Grid flex={1} display='flex' direction='column' justifyContent='center' alignItems='center'>
								<Image height={250} width={250} src={empty_address} alt='empty address' />
								<CustomText type='Subtitle'>{t('OrderManagement.ChangeAddressDrawer.NoContact')}</CustomText>
							</Grid>
						)}
					</>
				);
		}
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body' pt={1}>
				{render_content_by_type()}
			</Grid>
		);
	};

	const handle_render_drawer = () => {
		return (
			<Grid className='drawer-container'>
				{handle_render_header()}
				<Divider className='drawer-divider' />
				{handle_render_drawer_content()}
				<Divider className='drawer-divider' />
				{handle_render_footer()}
			</Grid>
		);
	};

	return <Drawer width={420} open={is_visible} onClose={close} content={handle_render_drawer()} />;
};

const ManageDrawer = (props: any) => {
	const { is_visible } = props;
	if (!is_visible) {
		return null;
	}
	return <ManageComp {...props} />;
};

export default ManageDrawer;
