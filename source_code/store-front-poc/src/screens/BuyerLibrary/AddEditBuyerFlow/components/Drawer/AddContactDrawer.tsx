import { ReactNode, useState } from 'react';
import _ from 'lodash';
import { Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm } from 'react-hook-form';
import { Box, Button, Drawer, Grid, Icon, Modal } from 'src/common/@the-source/atoms';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import CopyContactDrawer from './CopyContactDrawer';
import CheckboxEditField from 'src/common/@the-source/atoms/FieldsNew/CheckboxEditField';
import { SECTIONS } from 'src/screens/BuyerLibrary/constants';
import CustomText from 'src/common/@the-source/CustomText';
import { isUUID } from 'src/screens/Settings/utils/helper';
import { useTheme } from '@mui/material/styles';
import useStyles from '../../../styles';
import '../../../style.css';

interface Props {
	contact_index: number;
	all_contacts: [];
	close: () => void;
	handle_update_form: (key: string, data: any, optional_callback?: (value: boolean) => void) => void;
	delete_contact: (index: number) => void;
	buyer_fields: any;
	primary_contact_id: string;
	selected_value?: any;
	is_visible: boolean;
	show_primary?: boolean;
	edit_mode?: boolean;
	contact_delete_permission?: boolean;
	close_on_submit?: boolean;
	extra_fields?: ReactNode;
	validate_field_id?: boolean;
	show_delete?: boolean;
}

const AddContactComp = ({
	contact_index,
	is_visible,
	all_contacts,
	selected_value,
	buyer_fields,
	primary_contact_id,
	close,
	handle_update_form,
	delete_contact,
	show_primary = true,
	edit_mode,
	contact_delete_permission,
	close_on_submit = true,
	extra_fields = null,
	validate_field_id = true,
	show_delete = true,
}: Props) => {
	const classes = useStyles();
	const theme: any = useTheme();
	let contact_object = _.find(buyer_fields?.sections, { key: SECTIONS?.contact });
	let source = _.get(contact_object, SECTIONS?.contact, [])?.[0];

	const [show_sheet, set_show_sheet] = useState(false);
	const [distinct_id, set_distinct_id] = useState(`temp_${crypto.randomUUID()}`);
	const [show_modal, set_show_modal] = useState(false);
	const [btn_loading, set_btn_loading] = useState(false);
	const { t } = useTranslation();

	const methods = useForm({
		defaultValues: {
			...selected_value,
		},
	});

	const { handleSubmit, reset, control, getValues, setValue } = methods;

	const handle_copied_contact = (contact: any) => {
		const _contact = _.cloneDeep(contact);
		const new_id = `temp_${crypto.randomUUID()}`;
		const new_contact: any = {};
		_.map(source?.attributes, (item: any) => {
			if (item?.is_display !== false) {
				new_contact[item?.id] = _contact[item?.id];
			}
		});
		new_contact.id = new_id;

		set_distinct_id(new_id);
		reset(new_contact);
		set_show_sheet(false);
	};

	const handle_confirm = (data: any) => {
		if (_.isEmpty(data)) {
			return;
		}
		if (show_primary) {
			const primary_value = data.is_primary ? data.id : primary_contact_id === selected_value?.id ? '' : primary_contact_id;
			handle_update_form('contacts.primary_contact', primary_value);
			delete data.is_primary;
		}

		const new_phone_number = data.phone?.slice(data.country_code?.length - 1) || '';
		handle_update_form(`contacts.values.${contact_index}`, { ...data, phone: new_phone_number }, set_btn_loading);
		if (close_on_submit) {
			close();
		}
	};

	const handle_cancel_delete = () => {
		if (!_.isEmpty(selected_value)) {
			set_show_modal(true);
			return;
		}
		close();
	};

	const handle_copy_sheet_close = () => {
		set_show_sheet(false);
	};

	const handle_filter_contact = () => {
		return _.filter(all_contacts, (item: any) => item.status !== 'archived') || [];
	};

	const handle_disable = () => {
		// if (id && selected_value?.id === primary_contact_id && handle_filter_contact()?.length <= 1) {
		// 	return true;
		// } else {
		// 	return false;
		// }
		return false;
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer'>
				<Box style={{ visibility: show_primary ? 'visible' : 'hidden' }}>
					<FormProvider {...methods}>
						<CheckboxEditField
							name='is_primary'
							key='is_primary'
							defaultValue={handle_filter_contact()?.length === 0 ? true : selected_value?.id === primary_contact_id}
							checkbox_value={true}
							label='Set as primary'
							disabled={handle_filter_contact()?.length === 0 || selected_value?.id === primary_contact_id}
						/>
					</FormProvider>
				</Box>

				<Grid mt={1} className='checkbox-container'>
					{contact_delete_permission && show_delete && (
						<Button disabled={handle_disable()} onClick={handle_cancel_delete} sx={{ marginRight: '1rem' }} variant='outlined'>
							{_.isEmpty(selected_value) ? 'Cancel' : 'Delete'}
						</Button>
					)}
					{!show_delete && (
						<Button disabled={handle_disable()} onClick={() => close()} sx={{ marginRight: '1rem' }} variant='outlined'>
							Cancel
						</Button>
					)}
					<Button onClick={handleSubmit(handle_confirm)} type='submit' loading={btn_loading}>
						{_.isEmpty(selected_value) || !show_delete ? 'Save' : 'Update'}
					</Button>
				</Grid>
			</Grid>
		);
	};

	const handle_render_type = (name: any, attribute: any) => {
		if (name === 'phone' && attribute?.type !== 'phone_e164') {
			return 'phone';
		} else {
			return attribute.type;
		}
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<Grid>
					<Grid container width={0} height={0} visibility='hidden' flexDirection='row' gap={2.5}>
						<FormBuilder
							placeholder={'id'}
							label={'id'}
							name={'id'}
							validations={{ required: validate_field_id }}
							defaultValue={_.isEmpty(selected_value) ? distinct_id : selected_value.id}
							type={'text'}
						/>
					</Grid>
					<Grid className={classes.contact_drawer_container}>
						{_.map(source?.attributes, (attribute: any, i: any) => {
							const name = `${attribute.id}`;
							if ((name === 'salutation' || name === 'first_name' || name === 'last_name') && attribute?.is_display !== false)
								return (
									<Grid key={`${attribute.name}-${i}`}>
										<FormBuilder
											placeholder={attribute.name}
											label={name === 'salutation' ? '' : attribute?.name}
											name={name}
											style={{ gap: '1rem' }}
											validations={{
												required: Boolean(attribute.required),
												...attribute?.validations,
											}}
											show_copy_drawer={show_sheet}
											defaultValue={attribute.value}
											type={handle_render_type(name, attribute)}
											options={attribute.options}
											control={control}
											is_edit_mode={edit_mode}
											register={methods.register}
											getValues={getValues}
											setValue={setValue}
										/>
									</Grid>
								);
						})}
					</Grid>
					<Grid>
						{_.filter(source?.attributes, (att: any) => isUUID(att?.id) || att?.is_display !== false).map((attribute: any, i: any) => {
							const name = `${attribute.id}`;
							if (name === 'salutation' || name === 'country_code' || name === 'first_name' || name === 'last_name') return;

							return (
								<Grid key={`${attribute.name}-${i}`} my={2.5}>
									<FormBuilder
										placeholder={attribute.name}
										label={attribute.name}
										name={name}
										autoFocus={name === 'first_name' && true}
										validations={{
											required: Boolean(attribute.required),
											number: attribute.type === 'number',
											email: attribute.id === 'email' || attribute.type === 'email',
											phone: attribute.id === 'phone' || attribute.type === 'phone',
											...attribute?.validations,
										}}
										disabled={attribute.disabled}
										show_copy_drawer={show_sheet}
										defaultValue={attribute.value}
										type={handle_render_type(name, attribute)}
										options={attribute.options}
										control={control}
										is_edit_mode={edit_mode}
										register={methods.register}
										getValues={getValues}
										setValue={setValue}
									/>
								</Grid>
							);
						})}
					</Grid>
				</Grid>
			</Grid>
		);
	};

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H2'>
					{_.isEmpty(selected_value) ? t('Common.AddEditContactDrawer.AddContact') : t('Common.AddEditContactDrawer.EditContact')}
				</CustomText>
				{handle_filter_contact()?.length > 0 && (
					<Grid display='flex' ml={2} onClick={() => set_show_sheet(true)}>
						<Icon iconName='IconCopy' color={theme?.quick_add_buyer?.copy} sx={{ cursor: 'pointer' }} />
						<CustomText
							type='Subtitle'
							style={{
								cursor: 'pointer',
							}}
							color={theme?.quick_add_buyer?.copy}>
							Copy from
						</CustomText>
					</Grid>
				)}
				<Icon iconName='IconX' sx={{ cursor: 'pointer', marginLeft: 'auto' }} onClick={close} />
			</Grid>
		);
	};

	const handle_render_drawer = () => {
		return (
			<Grid className='drawer-container'>
				{handle_render_header()}
				<Divider className='drawer-divider' />
				<FormProvider {...methods}>
					{handle_render_drawer_content()}
					{extra_fields}
				</FormProvider>
				<Divider className='drawer-divider' />
				{handle_render_footer()}
			</Grid>
		);
	};

	const handle_delete_contact = () => {
		delete_contact(contact_index);
		close();
	};

	return (
		<>
			<Drawer open={is_visible} onClose={close} content={handle_render_drawer()} />
			<CopyContactDrawer
				is_visible={show_sheet}
				close={handle_copy_sheet_close}
				all_contacts={handle_filter_contact()}
				handle_copied_contact={handle_copied_contact}
				primary_contact_id={primary_contact_id}
				buyer_fields={buyer_fields}
			/>
			<Modal
				open={show_modal}
				onClose={() => set_show_modal(false)}
				title={'Delete contact'}
				footer={
					<Grid container justifyContent='flex-end' gap={2}>
						<Button variant='outlined' onClick={() => set_show_modal(false)}>
							Cancel
						</Button>
						<Button onClick={handle_delete_contact}>Delete</Button>
					</Grid>
				}
				children={<CustomText type='Body'>Are you sure, want to delete contact ?</CustomText>}
			/>
		</>
	);
};

const AddContactDrawer = (props: any) => {
	const { is_visible } = props;
	if (!is_visible) {
		return null;
	}
	return <AddContactComp {...props} />;
};

export default AddContactDrawer;
