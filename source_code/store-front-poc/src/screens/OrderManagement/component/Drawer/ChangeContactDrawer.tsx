import { Box, Button, Grid, Image, Radio } from 'src/common/@the-source/atoms';
import OrderManagementContext from '../../context';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import {
	BUYER_SECTIONS,
	DOC_LEVEL_ATTRS,
	DOCUMENT_ATTR_PERMISSION_KEYS,
	DOCUMENT_LEVEL_ATTRS_KEY_MAP,
	SPECIAL_DOCUMENT_ATTRIBUTE,
} from '../../constants';
import DrawerSkeletonContainer from '../Common/DrawerSkeleton';
import { useTranslation } from 'react-i18next';
import utils from 'src/utils/utils';
import CustomText from 'src/common/@the-source/CustomText';
import { isUUID } from 'src/screens/Settings/utils/helper';
import { formattedValue } from 'src/utils/common';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';
import { get_permission } from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/helper/helper';
import { DocumentEntity } from 'src/@types/common_types';
import EditActionIcon from './EditActionIcon';
import { AttributeHeader, ClearEntityButton, DocumentLevelAttributeRenderer } from '../Common/CommonDocumentComponents';
import { SECTIONS } from 'src/screens/BuyerLibrary/constants';
import { useSelector } from 'react-redux';
import { secondary } from 'src/utils/light.theme';

const { ADD_PERMISSION, EDIT_PERMISSION, BACK_SAVING_PERMITTED } = DOCUMENT_ATTR_PERMISSION_KEYS;
const text_style = {
	color: secondary[700],
	marginBottom: 0.4,
};

const bold_text_style = {
	...text_style,
	fontWeight: 'bold',
	color: '#000',
	marginBottom: '8px',
};

const style = {
	width: '100%',
	cursor: 'pointer',
};

const ChangeContactAddressDrawer = ({ data }: any) => {
	const {
		drawer,
		buyer_data,
		attribute_data,
		set_show_contact_sheet_detail,
		buyer_section_loading,
		set_add_edit_contact_data,
		handle_update_document_entity,
		buyer_details_form,
	} = useContext(OrderManagementContext);
	const empty_contact = 'https://frontend-bucket.vercel.app/images/empty_contact.svg';
	const { drawer_type } = drawer;
	const { t } = useTranslation();
	const classes = useStyles();
	// const field_id = _.get(data, 'attributes[0].id');
	const theme: any = useTheme();

	const [selected_contact_id, set_selected_contact_id] = useState(attribute_data[SPECIAL_DOCUMENT_ATTRIBUTE.primary_contact]?.id);
	const [btn_loading, set_btn_loading] = useState<boolean>(false);
	const styles = useStyles();
	const { document_type } = useParams();
	const is_doc_add_permission = _.get(data, `attributes[0].${ADD_PERMISSION}`, true);
	const is_doc_edit_permission = _.get(data, `attributes[0].${EDIT_PERMISSION}`, true);
	const back_saving_permitted = _.get(data, `attributes[0].${BACK_SAVING_PERMITTED}`, true);
	const contact_section = _.find(buyer_data.sections, { key: BUYER_SECTIONS.contact });
	const all_contacts = contact_section?.contacts || [];
	const primary_contact_id = contact_section?.primary_contact;
	const contact_permission = get_permission(contact_section, 'add');
	const has_customer_edit_permission: boolean = get_permission(contact_section, 'edit')?.is_edit;
	const contact_display_setting = useSelector((state: any) => _.get(state, 'settings.display_priority.contacts', []));

	const add_permission = all_contacts?.length < (contact_section?.max_entities || Infinity) && contact_permission?.is_add;
	const should_render_edit_btn = utils.can_perform_attribute_action(
		is_doc_edit_permission,
		has_customer_edit_permission,
		back_saving_permitted,
	);
	const should_render_add_btn = utils.can_perform_attribute_action(
		is_doc_add_permission,
		contact_permission?.is_add,
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
	const contact_object = _.find(buyer_details_form?.sections, { key: SECTIONS?.contact });
	const contact_attrs: DocumentEntity | undefined = _.head(_.get(contact_object, SECTIONS?.contact, []));
	const attribute_type = all_contacts?.length > 1 ? DOC_LEVEL_ATTRS.CONTACTS : DOC_LEVEL_ATTRS.CONTACT;

	const doc_level_contact: DocumentEntity | undefined = useMemo(
		() => utils.get_processed_document_entity(attribute_data, SPECIAL_DOCUMENT_ATTRIBUTE.primary_contact, contact_attrs),
		[attribute_data, all_contacts],
	);

	useEffect(() => {
		if (doc_level_contact && !selected_contact_id) {
			set_selected_contact_id(doc_level_contact?.id);
		}
	}, [doc_level_contact]);

	const handle_add_contact = () => {
		set_add_edit_contact_data({
			data: null,
			show_sync_back_info: show_sync_back_add_info,
			show_sync_back_checkbox: show_sync_back_add_checkbox,
		});
		set_show_contact_sheet_detail({ is_open: true, index: 0 });
	};

	const handle_confirm = () => {
		set_btn_loading(true);
		const is_doc_level_selected = doc_level_contact?.id === selected_contact_id;
		const payload_data = is_doc_level_selected
			? attribute_data?.[SPECIAL_DOCUMENT_ATTRIBUTE?.primary_contact]
			: _.find(all_contacts, { id: selected_contact_id });
		handle_update_document_entity(
			all_contacts,
			selected_contact_id,
			drawer_type,
			payload_data,
			!selected_contact_id,
			undefined,
			set_btn_loading,
		);
	};

	const handle_clear = () => {
		set_selected_contact_id(null);
	};

	const handle_render_empty_state = () => {
		return (
			<Grid container justifyContent={'center'} flexDirection={'column'} gap={2} alignItems={'center'}>
				<Image height={250} style={{ marginTop: '10rem' }} width={250} src={empty_contact} alt='empty contact' />
				<CustomText type='Body'>{t('OrderManagement.ChangeContactDrawer.NoContact')}</CustomText>
				{should_render_add_btn && (
					<Button variant='contained' onClick={handle_add_contact}>
						{t('OrderManagement.ChangeContactDrawer.Add')}
					</Button>
				)}
			</Grid>
		);
	};

	const handle_edit_contact = (item: DocumentEntity) => {
		if (!item) return;
		const mapped_contact_data = utils.map_attrs_to_form_data(item);
		if (!mapped_contact_data) return;
		set_add_edit_contact_data({
			show_sync_back_info: show_sync_back_edit_info,
			show_sync_back_checkbox: show_sync_back_edit_checkbox,
			data: {
				...mapped_contact_data,
				[DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_VALUE_KEY]: item?.[DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_VALUE_KEY] || false,
			},
		});
		set_show_contact_sheet_detail({ is_open: true, index: 0 });
	};

	const renderFieldsByPriority = (item: any) => {
		const sortedPriorities = _.sortBy(contact_display_setting, 'display_priority');
		const groupedPriorities = _.groupBy(sortedPriorities, (field: any) => Math.floor(field?.display_priority || 0));

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
							(section: any) => section?.key === 'contacts',
						)?.contacts?.[0]?.attributes?.find((attr: any) => attr.id === field.key);

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
							(section: any) => section?.key === 'contacts',
						)?.contacts?.[0]?.attributes?.find((attr: any) => attr?.id === field?.key);
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
			const maxWidthStyle = { ...textStyle, maxWidth: '250px' };
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

	const render_contact_box = useCallback(
		(item: DocumentEntity | null, key: string | number) => {
			if (!item) return null;
			const id = item?.id;
			const is_doc_level_contact = item?.[DOCUMENT_LEVEL_ATTRS_KEY_MAP.FORM_VALUE_KEY];
			const { first_name, last_name, email, phone, country_code, designation, ...rest } = utils.get_contact_attributes_values(
				['first_name', 'last_name', 'email', 'phone', 'country_code', 'designation'],
				item,
			);

			const additional_field_values: any = [];
			_.forEach(item?.attributes, (i) => {
				if (isUUID(i?.id)) {
					additional_field_values.push(i);
				}
			});

			if (is_doc_level_contact) {
				_.keys(rest).forEach((item_key: string) => {
					if (isUUID(item_key)) {
						additional_field_values.push({ id: item_key, value: rest?.[item_key] ?? '' });
					}
				});
			}
			return (
				<>
					<Box
						key={`contact_${key}`}
						style={{ ...theme?.card_, ...style }}
						className={selected_contact_id === id ? classes.ultron_contact_active_card_style : classes.ultron_contact_card_style}
						my={1}
						display={'flex'}
						flexDirection={'column'}
						alignItems={'top'}
						onClick={() => set_selected_contact_id(id)}>
						<Grid display={'flex'} flexDirection={'row'} width={'100%'}>
							<Grid item mt={1}>
								<Radio style={{ ...theme?.radio }} checked={id === selected_contact_id} />
							</Grid>
							<Grid container padding={'1.5rem 1.2rem'}>
								<Grid item md={9.5} sm={9.5}>
									{renderFieldsByPriority(item?.attributes)}
								</Grid>
								<Grid item md={2.5} sm={2.5}>
									<Box display={'flex'} justifyContent={'space-between'} flexDirection={'column'} height={'100%'}>
										{should_render_edit_btn && (
											<EditActionIcon
												styles={{
													alignSelf: 'flex-end',
													paddingRight: '2rem',
												}}
												on_edit_click={() => handle_edit_contact(item)}
											/>
										)}
									</Box>
								</Grid>
							</Grid>
						</Grid>
						<Box display='flex' justifyContent='flex-end' mt='auto' width='100%'>
							{primary_contact_id === id && (
								<Box
									sx={{ borderRadius: theme?.order_management?.style?.primary_chip_border_radius, minWidth: '70px' }}
									className={styles.default}
									bgcolor={theme?.order_management?.style?.primary_chip_bg_color}>
									<CustomText type='Subtitle' color={theme?.order_management?.style?.primary_chip_color}>
										Primary
									</CustomText>
								</Box>
							)}
						</Box>
					</Box>
				</>
			);
		},
		[selected_contact_id, doc_level_contact],
	);

	return (
		<React.Fragment>
			<Box overflow={'scroll'} className={classes.drawerContentContainer}>
				{_.isEmpty(all_contacts) && !doc_level_contact && !buyer_section_loading && handle_render_empty_state()}
				{buyer_section_loading ? (
					<DrawerSkeletonContainer is_ultron />
				) : (
					<>
						{doc_level_contact && (
							<DocumentLevelAttributeRenderer
								handle_click={() => set_selected_contact_id(doc_level_contact?.id)}
								render_body={() => render_contact_box(doc_level_contact, 0)}
								header={t('OrderManagement.OrderManagementContainer.DocumentLevelAttributeHeader', {
									doc_type: _.capitalize(document_type) || document_type,
									attribute_type: DOC_LEVEL_ATTRS.CONTACT,
								})}
								sub_header={t('OrderManagement.OrderManagementContainer.DocumentLevelAttributeSubHeader', {
									doc_type: document_type,
									attribute_type: _.capitalize(DOC_LEVEL_ATTRS.CONTACT),
								})}
								render_divider={!_.isEmpty(all_contacts)}
							/>
						)}
						{all_contacts?.map((item: any, index: number) => {
							const header = t('OrderManagement.OrderManagementContainer.CustomerLevelAttributeHeader', {
								attribute_type,
							});
							const sub_header = t('OrderManagement.OrderManagementContainer.CustomerLevelAttributeSubHeader', {
								attribute_type: _.capitalize(attribute_type),
							});
							return (
								<Grid container px={1}>
									{index === 0 && <AttributeHeader header={header} sub_header={sub_header} />}
									{render_contact_box(item, index + 1)}
								</Grid>
							);
						})}
					</>
				)}
			</Box>

			<Box className={classes.drawerFooterContainer}>
				<Grid className={classes.buttonAlignmentContainer} gap={1}>
					<React.Fragment>
						<ClearEntityButton disabled={!selected_contact_id} handle_on_click={handle_clear} />
						{should_render_add_btn && (
							<Button variant='outlined' onClick={handle_add_contact}>
								{t('OrderManagement.ChangeContactDrawer.AddContact')}
							</Button>
						)}
						<Button variant='contained' onClick={handle_confirm} loading={btn_loading}>
							{t('OrderManagement.ChangeContactDrawer.Done')}
						</Button>
					</React.Fragment>
				</Grid>
			</Box>
		</React.Fragment>
	);
};

export default ChangeContactAddressDrawer;
