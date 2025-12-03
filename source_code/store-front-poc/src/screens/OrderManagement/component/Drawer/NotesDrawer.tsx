import { Box, Button, Checkbox, Grid } from 'src/common/@the-source/atoms';
import TextEditField from 'src/common/@the-source/atoms/FieldsNew/TextEditField';
import { FormProvider, useForm } from 'react-hook-form';
import React, { useContext, useState } from 'react';
import OrderManagementContext from '../../context';
import { EDIT_ORDER_BUYER_CONSTANT, SPECIAL_DOCUMENT_ATTRIBUTE } from '../../constants';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from '../../styles';

const NOTES = {
	notes: 'notes.notes',
	share_this_note_with_buyer: 'notes.share_this_note_with_buyer',
};

const MY_NOTES = {
	notes: 'my_notes.notes',
	share_this_note_with_buyer: 'my_notes.share_this_note_with_buyer',
};

const CUSTOMER_NOTES = {
	notes: 'customer_notes.notes',
	share_this_note_with_buyer: 'customer_notes.share_this_note_with_buyer',
};

const NotesDrawer = ({ _data }: any) => {
	const { handle_drawer_state, handle_update_document, attribute_data, handle_update_edit_order_modal, handle_update_edit_order_data } =
		useContext(OrderManagementContext);
	const default_value = attribute_data[SPECIAL_DOCUMENT_ATTRIBUTE.notes_settings];
	const { t } = useTranslation();
	const is_back_saving_permitted = _.get(_data, 'attributes[0].back_saving_permitted');
	const field_id = _.get(_data, 'attributes[0].id');
	const classes = useStyles();
	const { VITE_APP_REPO } = import.meta.env;
	const is_store_front = VITE_APP_REPO === 'store_front';

	const methods = useForm({
		defaultValues: attribute_data[SPECIAL_DOCUMENT_ATTRIBUTE.notes_settings],
	});

	const get_initial_state = () => {
		const store_front_notes_data = {
			notes: {
				notes: default_value?.notes?.notes || '',
				share_this_note_with_buyer: default_value?.notes?.share_this_note_with_buyer || false,
			},
		};
		const ultron_notes_data = {
			my_notes: {
				notes: default_value?.my_notes?.notes || '',
				share_this_note_with_buyer: default_value?.my_notes?.share_this_note_with_buyer || false,
			},
			customer_notes: {
				notes: default_value?.customer_notes?.notes || '',
				share_this_note_with_buyer: default_value?.customer_notes?.share_this_note_with_buyer || false,
			},
		};
		return is_store_front ? store_front_notes_data : ultron_notes_data;
	};

	const [notes_data, set_notes_data] = useState<any>(get_initial_state());

	const { handleSubmit, watch } = methods;
	const notes = watch(NOTES.notes);
	const my_notes = watch(MY_NOTES.notes);
	const customer_notes = watch(CUSTOMER_NOTES.notes);

	const handle_close = () => {
		handle_drawer_state(false);
	};

	const handle_confirm = (data: any) => {
		if (_.isEmpty(data)) {
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

	const handle_checkbox_change = (name: any, value: boolean) => {
		set_notes_data((prev: any) => ({ ...prev, [name]: { ...prev[name], share_this_note_with_buyer: value } }));
	};

	const handle_text_change = (name: any, value: boolean) => {
		set_notes_data((prev: any) => ({ ...prev, [name]: { ...prev[name], notes: value } }));
	};

	const check_disabled = () => {
		return is_store_front ? _.isEmpty(notes) && !default_value : _.isEmpty(my_notes) && _.isEmpty(customer_notes) && !default_value;
	};

	return (
		<React.Fragment>
			<Box className={classes.drawerContentContainer}>
				<Box padding={1}>
					<FormProvider {...methods}>
						{is_store_front ? (
							<React.Fragment>
								<CustomText>{t('OrderManagement.NotesDrawer.Notes')}</CustomText>
								<TextEditField
									onChangeCapture={(e: any) => handle_text_change('notes', e.target.value)}
									sx={{ width: '100%', my: 1 }}
									name={NOTES.notes}
									label={''}
									type={'text'}
									multiline={true}
								/>
							</React.Fragment>
						) : (
							<React.Fragment>
								<CustomText>{t('OrderManagement.NotesDrawer.CustomerNotes')}</CustomText>
								<TextEditField
									onChangeCapture={(e: any) => handle_text_change('customer_notes', e.target.value)}
									sx={{ width: '100%', my: 1 }}
									name={CUSTOMER_NOTES.notes}
									label={''}
									type={'text'}
									multiline={true}
								/>
								<Box className={classes.cartSummaryTitleContainer} gap={0} padding={0.2} mb={2}>
									<Checkbox
										onChange={(e: any) => handle_checkbox_change('customer_notes', e.target?.checked)}
										checked={notes_data?.customer_notes?.share_this_note_with_buyer}
									/>
									<CustomText>{t('OrderManagement.NotesDrawer.ShareNote')}</CustomText>
								</Box>

								<CustomText>{t('OrderManagement.NotesDrawer.YourNotes')}</CustomText>
								<TextEditField
									onChangeCapture={(e: any) => handle_text_change('my_notes', e.target.value)}
									sx={{ width: '100%', my: 1 }}
									name={MY_NOTES.notes}
									label={''}
									type={'text'}
									multiline={true}
								/>
								<Box className={classes.cartSummaryTitleContainer} gap={0} padding={0.2}>
									<Checkbox
										onChange={(e: any) => handle_checkbox_change('my_notes', e.target?.checked)}
										checked={notes_data?.my_notes?.share_this_note_with_buyer}
									/>
									<CustomText>{t('OrderManagement.NotesDrawer.ShareNote')}</CustomText>
								</Box>
							</React.Fragment>
						)}
					</FormProvider>
				</Box>
			</Box>
			<Box className={classes.drawerFooterContainer}>
				<Grid className={classes.buttonAlignmentContainer} gap={1}>
					<React.Fragment>
						<Button variant='outlined' onClick={handle_close}>
							{t('OrderManagement.NotesDrawer.Cancel')}
						</Button>
						<Button variant='contained' disabled={check_disabled()} onClick={handleSubmit(handle_confirm)}>
							{t('OrderManagement.NotesDrawer.Done')}
						</Button>
					</React.Fragment>
				</Grid>
			</Box>
		</React.Fragment>
	);
};

export default NotesDrawer;
