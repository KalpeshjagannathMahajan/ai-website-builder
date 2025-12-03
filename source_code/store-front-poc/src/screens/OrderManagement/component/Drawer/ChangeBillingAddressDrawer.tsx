import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import { Box, Button, Grid, Image, Radio, Icon } from 'src/common/@the-source/atoms';
import {
	BUYER_ADDRESS_TYPE,
	BUYER_SECTIONS,
	DOC_LEVEL_ATTRS,
	DOCUMENT_ATTR_PERMISSION_KEYS,
	SPECIAL_DOCUMENT_ATTRIBUTE,
} from '../../constants';
import DrawerSkeletonContainer from '../Common/DrawerSkeleton';
import utils from 'src/utils/utils';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';
import { get_permission } from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/helper/helper';
import EditActionIcon from './EditActionIcon';
import { AttributeHeader, ClearEntityButton, DocumentLevelAttributeRenderer } from '../Common/CommonDocumentComponents';
import { DocumentEntity } from 'src/@types/common_types';
import { SECTIONS } from 'src/screens/BuyerLibrary/constants';
import { useSelector } from 'react-redux';
import { secondary } from 'src/utils/light.theme';
import useMediaQuery from '@mui/material/useMediaQuery';
import OrderManagementContext from '../../context';
import { formattedValue } from 'src/utils/common';
// import { isUUID } from 'src/screens/Settings/utils/helper';

const { ADD_PERMISSION, EDIT_PERMISSION, BACK_SAVING_PERMITTED } = DOCUMENT_ATTR_PERMISSION_KEYS;
const style = {
	width: '100%',
	cursor: 'pointer',
};

const text_style = {
	color: secondary[700],
	fontSize: 16,
	marginBottom: 0.8,
};
const bold_text_style = {
	...text_style,
	fontWeight: 'bold',
	color: '#000',
	marginBottom: '8px',
};

const ChangeBillingAddressDrawer = ({ data, is_ultron = true, is_store_front = false }: any) => {
	const {
		drawer,
		buyer_data,
		attribute_data,
		set_show_address_sheet_detail,
		buyer_section_loading,
		set_add_edit_address_data,
		handle_edit_address,
		handle_update_document_entity,
		buyer_details_form,
	} = useContext(OrderManagementContext);
	const [selected_address_id, set_selected_address_id] = useState(attribute_data[SPECIAL_DOCUMENT_ATTRIBUTE.billing_address]?.id);
	const [btn_loading, set_btn_loading] = useState<boolean>(false);
	const { drawer_type } = drawer;

	const empty_address = 'https://frontend-bucket.vercel.app/images/empty_address.svg';
	const { document_type } = useParams();
	const classes = useStyles();
	const theme: any = useTheme();
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));

	const address_section = _.find(buyer_data.sections, { key: BUYER_SECTIONS.address });
	const all_addresses = address_section?.addresses || [];
	const default_billing_address_id = address_section?.default_billing_address;
	const { t } = useTranslation();
	// const field_id = _.get(data, 'attributes[0].id');
	const is_doc_add_permission = _.get(data, `attributes[0].${ADD_PERMISSION}`, true);
	const is_doc_edit_permission = _.get(data, `attributes[0].${EDIT_PERMISSION}`, true);
	const back_saving_permitted = _.get(data, `attributes[0].${BACK_SAVING_PERMITTED}`, true);
	const billing_permission = get_permission(address_section, 'add', 'billing');
	const has_customer_edit_permission: boolean = get_permission(address_section, 'edit', 'billing')?.is_edit;
	const billing_addresses = _.filter(all_addresses, (address) => {
		const type_obj = _.find(address.attributes, { id: 'type' });
		return type_obj?.value === BUYER_ADDRESS_TYPE.billing;
	});
	const add_permission = billing_addresses?.length < (address_section?.billing_max_entities || Infinity) && billing_permission?.is_add;

	const should_render_edit_btn = utils.can_perform_attribute_action(
		is_doc_edit_permission,
		has_customer_edit_permission,
		back_saving_permitted,
	);
	const should_render_add_btn = utils.can_perform_attribute_action(
		is_doc_add_permission,
		billing_permission?.is_add,
		back_saving_permitted,
	);
	const show_sync_back_add_checkbox = utils.document_entity_checkbox_visible(is_doc_add_permission, add_permission, back_saving_permitted);
	const show_sync_back_edit_checkbox = utils.document_entity_checkbox_visible(
		is_doc_edit_permission,
		has_customer_edit_permission,
		back_saving_permitted,
	);
	const show_sync_back_add_info = utils.document_entity_info_visible(is_doc_add_permission, add_permission, back_saving_permitted);
	const show_sync_back_edit_info = utils.document_entity_info_visible(
		is_doc_edit_permission,
		has_customer_edit_permission,
		back_saving_permitted,
	);
	const addresses_object = _.find(buyer_details_form?.sections, { key: SECTIONS?.address });
	const address_attrs: DocumentEntity | undefined = _.head(_.get(addresses_object, SECTIONS?.address, []));
	const attribute_type = billing_addresses?.length > 1 ? DOC_LEVEL_ATTRS.ADDRESSES : DOC_LEVEL_ATTRS.ADDRESS;
	const doc_level_address: DocumentEntity | undefined = useMemo(
		() => utils.get_processed_document_entity(attribute_data, SPECIAL_DOCUMENT_ATTRIBUTE.billing_address, address_attrs),
		[attribute_data, all_addresses],
	);

	const address_display_setting = useSelector((state: any) => _.get(state, 'settings.display_priority.addresses', []));
	const renderFieldsByPriority = (item: any) => {
		const sortedPriorities = _.sortBy(address_display_setting, 'display_priority');
		const groupedPriorities = _.groupBy(sortedPriorities, (field: any) => Math.floor(field.display_priority || 0));

		return _.map(groupedPriorities, (group: any, priority: number) => {
			const renderedFields = group
				.map((field: any) => {
					const value = _.find(item, { id: field?.key })?.value || '';
					const country_code = _.find(item, { id: 'country_code' })?.value || '';
					if (!value) return null;
					if (value === 'billing' || value === 'shipping') {
						return null;
					}
					if (field?.key === 'country_code') return null;
					let formatted_value;

					// Check if the field is a phone number
					if (field?.key === 'phone' && country_code) {
						formatted_value = utils?.format_phone_number(value, country_code);

						const buyerField = _.find(
							buyer_details_form?.sections,
							(section: any) => section?.key === 'addresses',
						)?.addresses?.[0]?.attributes?.find((attr: any) => attr.id === field.key);

						if (buyerField?.is_label_display) {
							const label = buyerField.name || '';
							formatted_value = (
								<>
									<strong style={priority < 1 ? bold_text_style : text_style}>{label}</strong> : {formatted_value}
								</>
							);
						}
					} else {
						const buyerField = _.find(
							buyer_details_form?.sections,
							(section: any) => section?.key === 'addresses',
						)?.addresses?.[0]?.attributes?.find((attr: any) => attr?.id === field?.key);
						formatted_value = formattedValue(value, buyerField);

						// If is_label_display is true, show the label and value
						if (buyerField?.is_label_display) {
							const label = buyerField.name || field.key;
							formatted_value = (
								<>
									<strong style={priority < 1 ? bold_text_style : text_style}>{label}</strong> : {formatted_value}
								</>
							);
						}
					}

					if (!formatted_value) return null;
					return <React.Fragment key={field.key}>{formatted_value}</React.Fragment>;
				})
				.filter(Boolean);

			const textType = priority >= 0 && priority < 1 ? 'H3' : 'Title';
			const textStyle = priority >= 0 && priority < 1 ? bold_text_style : text_style;
			const maxWidthStyle = { ...textStyle, maxWidth: '350px' };
			return (
				<CustomText key={priority} type={textType} style={maxWidthStyle}>
					{renderedFields.length > 0
						? renderedFields.reduce((prev: any, curr: any) => (
								<>
									{prev}
									{priority < 1 ? ' ' : ', '}
									{curr}
								</>
						  ))
						: null}
				</CustomText>
			);
		});
	};

	const handle_add_address_drawer = () => {
		set_add_edit_address_data({
			data: null,
			show_sync_back_info: show_sync_back_add_info,
			show_sync_back_checkbox: show_sync_back_add_checkbox,
		});
		set_show_address_sheet_detail({ is_open: true, index: -1, is_shipping_type: false });
	};

	const handle_confirm = (selected_card_id?: string) => {
		set_btn_loading(true);
		const _address_id = selected_card_id || selected_address_id;
		const is_doc_level_selected = doc_level_address?.id === _address_id;
		const payload_data = is_doc_level_selected
			? attribute_data?.[SPECIAL_DOCUMENT_ATTRIBUTE?.billing_address]
			: _.find(billing_addresses, { id: _address_id });
		handle_update_document_entity(
			billing_addresses,
			_address_id,
			is_store_front ? SPECIAL_DOCUMENT_ATTRIBUTE?.billing_address : drawer_type,
			payload_data,
			!_address_id && true,
			undefined,
			set_btn_loading,
		);
	};

	const handle_clear = () => {
		set_selected_address_id(null);
	};

	const handle_render_empty_state = () => {
		if (is_store_front || (drawer?.drawer_type === 'billing_address' && drawer?.drawer_state)) {
			return (
				<Grid container className={classes.empty_address}>
					<Icon iconName='IconReceipt' sx={{ height: '32px', width: '32px', color: theme?.order_management?.empty_address?.color }} />
					<CustomText type='Body'>{t('OrderManagement.ChangeAddressDrawer.NoBillingAddress')}</CustomText>
				</Grid>
			);
		} else {
			return (
				<Grid container justifyContent={'center'} flexDirection={'column'} gap={2} alignItems={'center'}>
					<Image height={250} style={{ marginTop: '10rem' }} width={250} src={empty_address} alt='empty address' />
					<CustomText type='Subtitle'>{t('OrderManagement.ChangeAddressDrawer.NoAddress')}</CustomText>
					{should_render_add_btn && (
						<Button variant='contained' onClick={handle_add_address_drawer}>
							{t('OrderManagement.ChangeAddressDrawer.Add')}
						</Button>
					)}
				</Grid>
			);
		}
	};

	const handle_click = (id: any) => {
		set_selected_address_id(id);
		is_store_front && id !== selected_address_id && handle_confirm(id);
	};

	const billing_address_button = ({ sx = {} }) => {
		return (
			<Button sx={sx} startIcon={<Icon iconName='IconPlus' />} variant='outlined' onClick={handle_add_address_drawer}>
				{t('OrderManagement.Drawers.BillingAddress')}
			</Button>
		);
	};

	const address_not_found = () => {
		const is_address_present = _.some(billing_addresses, { id: selected_address_id });

		return (
			is_store_front &&
			_.size(billing_addresses) > 0 &&
			!is_address_present &&
			selected_address_id !== default_billing_address_id &&
			!doc_level_address?.id
		);
	};
	useEffect(() => {
		if (attribute_data[SPECIAL_DOCUMENT_ATTRIBUTE.billing_address]?.id) {
			set_selected_address_id(attribute_data[SPECIAL_DOCUMENT_ATTRIBUTE.billing_address]?.id);
		}

		if (address_not_found()) {
			handle_confirm(default_billing_address_id);
			set_selected_address_id(default_billing_address_id);
		}
	}, [billing_addresses?.length]);
	useEffect(() => {
		if (is_store_front && billing_address_button?.length > 0 && _.isEmpty(selected_address_id)) {
			handle_confirm(default_billing_address_id);
			set_selected_address_id(default_billing_address_id);
		}
	}, [default_billing_address_id]);
	useEffect(() => {
		if (is_store_front && doc_level_address) {
			set_selected_address_id(doc_level_address?.id);
		}
		if (doc_level_address && !selected_address_id) {
			set_selected_address_id(doc_level_address?.id);
		}
	}, [doc_level_address]);

	const render_address_box = useCallback(
		(address: DocumentEntity | undefined, key: number | string) => {
			if (!address) return null;
			const id = address?.id;

			return (
				<Box
					key={`billing_address${key}`}
					style={{ ...theme?.card_, ...style }}
					className={selected_address_id === id ? classes.ultron_active_card_style : classes.ultron_card_style}
					my={2}
					onClick={() => handle_click(id)}>
					<Grid container padding={'1.5rem 1rem 0rem 1rem'} key={`address${key}`}>
						{is_ultron && (
							<Grid item md={1.5} sm={1.5}>
								<Radio checked={id === selected_address_id} />
							</Grid>
						)}

						{is_store_front && is_small_screen && (
							<Grid container flexDirection='column' justifyContent='space-between' alignItems='end' item md={0.5} sm={0.5} lg={1} xl={1}>
								<Radio
									style={{ padding: '0', ...theme?.radio }}
									checked={id === selected_address_id ? true : false}
									onChange={function noRefCheck() {}}
								/>
							</Grid>
						)}

						<Grid item mb={'1.5rem'} md={is_ultron ? 9.5 : 11.5} sm={is_ultron ? 9.5 : 11} lg={is_ultron ? 8 : 11} xl={is_ultron ? 8 : 11}>
							{renderFieldsByPriority(address?.attributes)}
						</Grid>

						{is_store_front && !is_small_screen && (
							<Grid container flexDirection='column' justifyContent='space-between' alignItems='end' item md={0.5} sm={0.5} lg={1} xl={1}>
								<Radio
									style={{ padding: '0', ...theme?.radio }}
									checked={id === selected_address_id ? true : false}
									onChange={function noRefCheck() {}}
								/>
							</Grid>
						)}

						{should_render_edit_btn && is_ultron && (
							<EditActionIcon
								on_edit_click={() => handle_edit_address(address, show_sync_back_edit_checkbox, show_sync_back_edit_info, false)}
							/>
						)}
					</Grid>

					{is_ultron && (
						<Box width={'100%'} display={'flex'} justifyContent={'flex-end'}>
							{default_billing_address_id === id && (
								<Box className={classes.default} bgcolor={theme?.view_buyer?.other_details?.card?.default_background}>
									<CustomText type='Subtitle' color={theme?.order_management?.change_address?.chip_text_color}>
										Default
									</CustomText>
								</Box>
							)}
						</Box>
					)}
				</Box>
			);
		},
		[selected_address_id, doc_level_address, buyer_data],
	);

	return (
		<React.Fragment>
			{is_store_front && (
				<Grid container justifyContent={'space-between'} mb={2}>
					<CustomText type={is_ultron ? 'H2' : 'H3'}>{t('OrderManagement.Drawers.BillingAddress')}</CustomText>
					{!is_small_screen && should_render_add_btn && billing_address_button({})}
				</Grid>
			)}

			{is_ultron ? (
				<Box overflow={'scroll'} className={classes.drawerContentContainer}>
					{_.isEmpty(billing_addresses) && !buyer_section_loading && handle_render_empty_state()}
					{buyer_section_loading ? (
						<DrawerSkeletonContainer is_ultron={is_ultron} />
					) : (
						<>
							{doc_level_address && is_ultron && (
								<DocumentLevelAttributeRenderer
									handle_click={() => set_selected_address_id(doc_level_address?.id)}
									render_body={() => render_address_box(doc_level_address, 0)}
									header={t('OrderManagement.OrderManagementContainer.DocumentLevelAttributeHeader', {
										doc_type: _.capitalize(document_type) || document_type,
										attribute_type: DOC_LEVEL_ATTRS.ADDRESS,
									})}
									sub_header={t('OrderManagement.OrderManagementContainer.DocumentLevelAttributeSubHeader', {
										doc_type: document_type,
										attribute_type: _.capitalize(DOC_LEVEL_ATTRS.ADDRESS),
									})}
									render_divider={!_.isEmpty(billing_addresses)}
								/>
							)}
							{_.map(billing_addresses, (address, index: number) => {
								const header = t('OrderManagement.OrderManagementContainer.CustomerLevelAttributeHeader', {
									attribute_type,
								});
								const sub_header = t('OrderManagement.OrderManagementContainer.CustomerLevelAttributeSubHeader', {
									attribute_type: _.capitalize(attribute_type),
								});
								return (
									<Grid container px={1}>
										{index === 0 && <AttributeHeader header={header} sub_header={sub_header} />}
										{render_address_box(address, index + 1)}
									</Grid>
								);
							})}
						</>
					)}
				</Box>
			) : (
				<React.Fragment>
					{_.isEmpty(billing_addresses) && !buyer_section_loading && handle_render_empty_state()}
					{buyer_section_loading ? (
						<DrawerSkeletonContainer is_ultron={is_ultron} />
					) : (
						<Grid container columnGap={2} alignItems='stretch'>
							{is_store_front && doc_level_address && (
								<Grid container alignItems='stretch' xs={12} sm={5} md={12} lg={3.8} xl={3.8}>
									{render_address_box(doc_level_address, 0)}
								</Grid>
							)}

							{_.map(billing_addresses, (address, key) => {
								return (
									<Grid container alignItems='stretch' xs={12} sm={5} md={12} lg={3.8} xl={3.8}>
										{render_address_box(address, key + 1)}
									</Grid>
								);
							})}
						</Grid>
					)}
				</React.Fragment>
			)}

			{is_small_screen && billing_address_button({ sx: { width: '100%' } })}

			{is_ultron && (
				<Box className={classes.drawerFooterContainer}>
					<Grid className={classes.buttonAlignmentContainer} gap={1}>
						<React.Fragment>
							<ClearEntityButton disabled={!selected_address_id} handle_on_click={handle_clear} />
							{should_render_add_btn && (
								<Button variant='outlined' onClick={handle_add_address_drawer}>
									{t('OrderManagement.ChangeAddressDrawer.AddAddress')}
								</Button>
							)}
							<Button variant='contained' onClick={() => handle_confirm()} loading={btn_loading}>
								{t('OrderManagement.ChangeAddressDrawer.Done')}
							</Button>
						</React.Fragment>
					</Grid>
				</Box>
			)}
		</React.Fragment>
	);
};

export default ChangeBillingAddressDrawer;
