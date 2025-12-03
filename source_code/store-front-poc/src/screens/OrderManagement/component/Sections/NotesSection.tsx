import { Box, Button, Checkbox, Grid } from 'src/common/@the-source/atoms';
import React, { useContext, useState } from 'react';
import _ from 'lodash';
import Convert from 'ansi-to-html';
import { EDIT_ORDER_BUYER_CONSTANT, SPECIAL_DOCUMENT_ATTRIBUTE, STEPPER_CONSTANTS } from '../../constants';
import OrderManagementContext from '../../context';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Can from 'src/casl/Can';
import { PERMISSIONS } from 'src/casl/permissions';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from '../../styles';
import { useTheme } from '@mui/material/styles';
import { FormProvider, useForm } from 'react-hook-form';
import TextEditField from 'src/common/@the-source/atoms/FieldsNew/TextEditField';

const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';
const is_store_front = VITE_APP_REPO === 'store_front';

interface Props {
	data: any;
	is_accordion?: boolean;
	style?: any;
}

// const text_style = {
// 	fontSize: 14,
// 	fontWeight: 700,
// 	color: 'grey',
// };
// const value_text = {
// 	fontSize: 14,
// 	fontWeight: 400,
// 	color: 'grey',
// };

const text_over_flow_style = {
	maxWidth: '100%',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
};

const CUSTOMER_NOTES = {
	notes: 'customer_notes.notes',
	share_this_note_with_buyer: 'notes.share_this_note_with_buyer',
};

const NotesSection: React.FC<Props> = ({ data, is_accordion = false, style }) => {
	const theme: any = useTheme();
	const convert = new Convert({ newline: true });
	const {
		attribute_data,
		handle_drawer_state,
		handle_drawer_type,
		show_edit_cta,
		section_mode,
		handle_update_document,
		handle_set_section_mode,
		handle_update_edit_order_modal,
		handle_update_edit_order_data,
		active_step,
		doc_status,
	} = useContext(OrderManagementContext);
	const { t } = useTranslation();
	const classes = useStyles();
	const title = _.get(data, 'name');
	const is_back_saving_permitted = _.get(data, 'attributes[0].back_saving_permitted');
	const field_id = _.get(data, 'attributes[0].id');
	const customer_notes = _.get(attribute_data[SPECIAL_DOCUMENT_ATTRIBUTE.notes_settings], 'customer_notes');
	const my_notes = _.get(attribute_data[SPECIAL_DOCUMENT_ATTRIBUTE.notes_settings], 'my_notes');
	const is_editable_quote = useSelector((state: any) => state?.document?.is_editable_quote);
	const is_editable_order = useSelector((state: any) => state?.document?.is_editable_order);
	const is_required_value = _.get(data, 'attributes[0].required', false);
	const is_editable = !_.get(data, 'attributes[0].disabled');

	const { notes_section } = section_mode;

	const default_value = attribute_data[SPECIAL_DOCUMENT_ATTRIBUTE.notes_settings];

	const get_initial_state = () => {
		const store_front_notes_data = {
			customer_notes: {
				notes: default_value?.customer_notes?.notes || '',
				share_this_note_with_buyer: default_value?.customer_notes?.share_this_note_with_buyer || true,
			},
		};
		return store_front_notes_data;
	};

	const methods = useForm({
		defaultValues: attribute_data[SPECIAL_DOCUMENT_ATTRIBUTE.notes_settings],
	});
	const { handleSubmit, watch } = methods;

	const form_notes = watch(CUSTOMER_NOTES.notes);
	const [notes_data, set_notes_data] = useState<any>(get_initial_state());

	const handle_text_change = (name: any, value: boolean) => {
		set_notes_data((prev: any) => ({ ...prev, [name]: { ...prev[name], notes: value } }));
	};

	const handle_ultron_click = () => {
		handle_drawer_state(true);
		handle_drawer_type('notes');
	};
	const customer_note = customer_notes?.notes && convert?.toHtml(customer_notes?.notes);
	const my_note = my_notes?.notes && convert?.toHtml(my_notes?.notes);

	const handle_confirm = (payload_data: any) => {
		if (_.isEmpty(payload_data)) {
			return;
		}

		if (is_back_saving_permitted) {
			handle_update_edit_order_modal(true, field_id);
		}

		if (!is_back_saving_permitted) {
			handle_update_document({ [SPECIAL_DOCUMENT_ATTRIBUTE.notes_settings]: notes_data });
		} else {
			handle_update_edit_order_data(EDIT_ORDER_BUYER_CONSTANT.payload, notes_data);
		}
	};

	//common
	const handle_render_notes = (_text_over_flow_style: any) => {
		return (
			<React.Fragment>
				{customer_notes?.notes && (
					<React.Fragment>
						<CustomText className={classes.section_notes_text_style} style={{ ..._text_over_flow_style }} type='H6'>
							{t('OrderManagement.NotesSection.CustomerNotes')}
						</CustomText>
						<div
							className={classes.section_notes_text_style}
							style={{ ..._text_over_flow_style }}
							dangerouslySetInnerHTML={{ __html: customer_note }}
						/>

						<Box className={classes.cartSummaryTitleContainer} gap={0} padding={0.2}>
							<Checkbox disabled checked={customer_notes?.share_this_note_with_buyer} />
							<CustomText type='Body' className={classes.section_notes_text_style}>
								{t('OrderManagement.NotesSection.ShareNote')}
							</CustomText>
						</Box>
						{is_ultron && <hr style={{ margin: 15 }}></hr>}
					</React.Fragment>
				)}

				{my_notes?.notes && is_ultron && (
					<React.Fragment>
						<CustomText className={classes.section_notes_text_style} style={{ ..._text_over_flow_style }} type='H6'>
							{t('OrderManagement.NotesSection.YourNote')}
						</CustomText>
						<div
							className={classes.section_notes_value_text}
							style={{ ..._text_over_flow_style }}
							dangerouslySetInnerHTML={{ __html: my_note }}
						/>

						<Box className={classes.cartSummaryTitleContainer} gap={0} padding={0.2}>
							<Checkbox disabled checked={my_notes?.share_this_note_with_buyer} />
							<CustomText type='Body' className={classes.section_notes_text_style}>
								{t('OrderManagement.NotesSection.ShareNote')}
							</CustomText>
						</Box>
					</React.Fragment>
				)}
			</React.Fragment>
		);
	};

	//ultron
	const handle_render_ultron_notes = () => {
		return (
			<React.Fragment>
				{_.isEmpty(customer_notes?.notes) && _.isEmpty(my_notes?.notes) && (
					<Grid item md={5} sm={5} xs={5.5}>
						<CustomText style={{ opacity: 0.6 }}>Not Added</CustomText>
					</Grid>
				)}

				{(!_.isEmpty(customer_notes?.notes) || !_.isEmpty(my_notes?.notes)) &&
					(!is_accordion ? (
						<Grid item md={5} sm={5} xs={5.5}>
							{handle_render_notes(text_over_flow_style)}
						</Grid>
					) : (
						<Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
							{handle_render_notes({})}
						</Grid>
					))}
			</React.Fragment>
		);
	};

	//store_front
	const handle_render_store_front_notes = () => {
		if (doc_status) {
			return (
				<Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
					<div className={classes.section_notes_text_style} dangerouslySetInnerHTML={{ __html: customer_note }} />
				</Grid>
			);
		}

		const _text_over_flow_style = !is_accordion ? text_over_flow_style : {};
		if (notes_section === 'view') {
			return (
				<Grid item md={6} sm={6} xs={10}>
					{customer_notes?.notes ? (
						<div
							className={classes.section_notes_value_text}
							style={{ ..._text_over_flow_style }}
							dangerouslySetInnerHTML={{ __html: customer_note }}
						/>
					) : (
						<CustomText type='Body'>Not Added</CustomText>
					)}
				</Grid>
			);
		} else {
			return (
				<Grid item md={6} sm={6} xs={12}>
					<FormProvider {...methods}>
						<TextEditField
							onChangeCapture={(e: any) => handle_text_change('customer_notes', e?.target?.value)}
							sx={{ width: '100%', my: 1 }}
							name={CUSTOMER_NOTES.notes}
							label={''}
							type={'text'}
						/>
					</FormProvider>
				</Grid>
			);
		}
	};

	//storefront
	const handle_get_title = () => {
		return (
			<React.Fragment>
				<CustomText
					type={'H6'}
					color={
						_.isEmpty(customer_notes?.notes) && is_required_value
							? theme?.order_management?.notes_section?.custom_valid_color
							: theme?.order_management?.notes_section?.custom_invalid_color
					}>
					{title}
				</CustomText>
				{_.isEmpty(customer_notes?.notes) && is_required_value && (
					<CustomText type='Caption' style={{ fontSize: 13 }} color={theme?.order_management?.notes_section?.custom_color}>
						{t('OrderManagement.UserDetailSection.Mandatory')}
					</CustomText>
				)}
			</React.Fragment>
		);
	};

	//ultron
	const handle_render_title = () => {
		return (
			<React.Fragment>
				{!is_accordion && (
					<Grid item md={3} sm={4} xs={4.5}>
						<CustomText
							type={'Subtitle'}
							color={
								_.isEmpty(my_notes?.notes) && _.isEmpty(customer_notes?.notes) && is_required_value
									? theme?.order_management?.notes_section?.custom_valid_color
									: theme?.order_management?.notes_section?.custom_invalid_color
							}>
							{title}
						</CustomText>
						{_.isEmpty(my_notes?.notes) && _.isEmpty(customer_notes?.notes) && is_required_value && (
							<CustomText type='Caption' style={{ fontSize: 13 }} color={theme?.order_management?.notes_section?.custom_color}>
								{t('OrderManagement.UserDetailSection.Mandatory')}
							</CustomText>
						)}
					</Grid>
				)}
			</React.Fragment>
		);
	};

	//store_front
	const handle_render_store_front_title = () => {
		return (
			<Grid xs={12} sm={12} md={12} lg={12} xl={12}>
				{!is_accordion && handle_get_title()}
			</Grid>
		);
	};

	//common
	const handle_render_action = () => {
		const handle_render_view_cta = () => {
			return (
				<Grid className={classes.textAlignmentContainer}>
					<Box className={classes.buttonContainer}>
						<Button variant='outlined' width='100px' onClick={() => handle_set_section_mode('notes_section', 'view')}>
							{t('OrderManagement.Buttons.Cancel')}
						</Button>
						<Button
							variant='contained'
							type='submit'
							disabled={_.isEmpty(form_notes)}
							loaderSize='20px'
							sx={{
								minWidth: '100px',
							}}
							onClick={handleSubmit(handle_confirm)}>
							{t('OrderManagement.Buttons.Save')}
						</Button>
					</Box>
				</Grid>
			);
		};

		const handle_click = () => {
			if (is_ultron) {
				handle_ultron_click();
			} else {
				handle_set_section_mode('notes_section', 'edit');
			}
		};

		return (
			<Can I={PERMISSIONS.edit_orders.slug} a={PERMISSIONS.edit_orders.permissionType}>
				{is_editable && (show_edit_cta || is_editable_quote || is_editable_order) && (is_store_front ? notes_section === 'view' : true) && (
					<Grid item md={is_ultron ? 4 : 6} sm={is_ultron ? 3 : 6} xs={2} className={classes.textAlignmentContainer}>
						<CustomText
							type='Subtitle'
							onClick={handle_click}
							color={theme?.button?.color}
							style={{
								cursor: 'pointer',
								textDecorationLine: theme?.order_management?.style?.text_decoration_line,
							}}>
							{!_.isEmpty(customer_notes?.notes) || !_.isEmpty(my_notes?.notes) ? 'Edit' : 'Add'}
						</CustomText>
					</Grid>
				)}
				{is_store_front && notes_section === 'edit' && handle_render_view_cta()}
			</Can>
		);
	};

	return (
		<Grid
			container
			className={is_ultron ? classes.gridContainerStyle : classes.storeFront_gridContainerStyle}
			p={is_accordion ? 1.2 : 'auto'}
			sx={{ ...style, mt: -2 }}
			mb={is_ultron ? (is_accordion ? 0 : 2) : 0}>
			{is_ultron ? handle_render_title() : handle_render_store_front_title()}
			{is_ultron ? handle_render_ultron_notes() : handle_render_store_front_notes()}
			{handle_render_action()}
			{!is_ultron && active_step?.stepper_key === STEPPER_CONSTANTS.REVIEW.key && (
				<hr
					style={{
						borderBottom: theme?.order_management?.order_manage_container?.hr_border_top,
						borderTop: '0',
						borderRadius: '0',
						marginInline: '0',
						marginTop: '32px',
						marginBottom: '32px',
					}}></hr>
			)}
		</Grid>
	);
};

export default NotesSection;
