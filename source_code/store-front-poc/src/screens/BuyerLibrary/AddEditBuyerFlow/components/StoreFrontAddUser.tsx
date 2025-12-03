import { Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import _ from 'lodash';
import { useForm, FormProvider } from 'react-hook-form';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import CheckboxEditField from 'src/common/@the-source/atoms/FieldsNew/CheckboxEditField';
import api_requests from 'src/utils/api_requests';
import React, { useEffect, useState } from 'react';

interface AddUserProps {
	open: boolean;
	set_open: (open: boolean) => void;
	buyer_fields?: any;
	storefront_edit_user?: any;
	set_storefront_edit_user?: any;
	handle_update_form?: (key: string, value: any) => void;
	wizshop_attributes?: any;
	checkbox_attributes?: any;
	all_wizshop_users?: any;
	from_ums?: boolean;
	fetch_data?: any;
	set_toggle_toast?: any;
}

const useStyles = makeStyles(() => ({
	drawer: {
		background: '#fff',
		height: '100vh',
	},
	header: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '12px',
	},
	content: {
		padding: '12px',
		display: 'flex',
		flexDirection: 'column',
		gap: '12px',
		width: '100%',
	},
	checkbox_container: {
		position: 'fixed',
		bottom: '76px',
		marginLeft: '12px',
		borderRadius: '8px',
		background: '#F7F8FA',
		width: '370px',
		padding: '8px 10px ',
	},
	footer: {
		position: 'fixed',
		bottom: 0,
		width: '400px',
		backgroundColor: '#fff',
		display: 'flex',
		justifyContent: 'flex-end',
		padding: '12px',
		gap: '12px',
		borderTop: '1px solid #e0e0e0',
	},
	icon_name: {
		display: 'flex',
		alignItems: 'center',
		gap: '8px',
		fontSize: '14px',
		fontWeight: '700',
	},
	icon_name_icon: {
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer',
		justifyContent: 'space-between',
		backgroundColor: '#F0F6FF',
		borderRadius: '12px',
		padding: '6px 10px',
		marginTop: '12px',
	},
	customer: {
		marginInline: '12px',
	},
}));

const remove_checkbox_status = ['active', 'inactive'];

const StoreFrontAddUser = ({
	open,
	set_open,
	wizshop_attributes,
	// checkbox_attributes,
	storefront_edit_user,
	set_storefront_edit_user,
	handle_update_form,
	all_wizshop_users,
	from_ums = false,
	fetch_data,
	set_toggle_toast,
}: // storefront_buyer,
AddUserProps) => {
	const [btn_loading, set_btn_loading] = useState(false);
	const styles = useStyles();

	const methods = useForm({
		defaultValues: storefront_edit_user?.user || {},
	});

	const is_edit = storefront_edit_user?.index !== null;
	const is_fe_created = storefront_edit_user?.user?.id?.startsWith('temp') || false;

	const show_checkbox = is_edit && !remove_checkbox_status.includes(storefront_edit_user?.user?.status?.toLowerCase());

	const { getValues, reset, handleSubmit, clearErrors, setError, control, setValue, watch } = methods;

	const handle_back = () => {
		set_storefront_edit_user({ index: null, user: null });
		reset();
		set_open(false);
	};

	const handle_add_wizshop_user = (data: any) => {
		const { email, first_name, last_name, country_code, phone, buyer_id, send_invite, reference_id } = data;

		const payload = {
			email,
			first_name,
			last_name,
			buyer_id,
			send_invite,
			country_code,
			phone,
		};

		if (is_edit) {
			api_requests.wizshop
				.edit_user(payload, reference_id)
				.then(() => {
					fetch_data();
					set_toggle_toast({
						show: true,
						message: 'User edited successfully',
						title: 'Success',
						status: 'success',
					});
					handle_back();
				})
				.catch((e) => console.error(e));
		} else {
			api_requests.wizshop
				.create_user(payload)
				.then(() => {
					fetch_data();
					set_toggle_toast({
						show: true,
						message: 'User added successfully',
						title: 'Success',
						status: 'success',
					});
					handle_back();
				})
				.catch((e) => console.error(e));
		}
	};

	const onSubmit = async (data: any) => {
		try {
			set_btn_loading(true);
			clearErrors('email');
			const response: any = await api_requests.wizshop.validate_email(data?.email || '');

			if (response?.data?.is_duplicate) {
				if (!is_edit || (is_edit && is_fe_created)) {
					setError('email', { type: 'custom', message: 'This email already exists' });
					set_btn_loading(false);
					return;
				}
			}
			if (all_wizshop_users && all_wizshop_users?.length > 0) {
				const user_email = all_wizshop_users?.find((user: any) => user?.email === data?.email);
				if (user_email && !is_edit && is_fe_created) {
					setError('email', { type: 'custom', message: 'This email already exists' });
					set_btn_loading(false);
					return;
				}
			}

			if (from_ums) {
				const new_phone_number = data?.phone?.slice(data?.country_code?.length - 1) || '';
				const new_data: any = { ...data, phone: new_phone_number, last_name: data?.last_name || '' };
				handle_add_wizshop_user(new_data);
				set_btn_loading(false);
				return;
			}

			const updatedUsers = _.cloneDeep(all_wizshop_users || []);
			const editIndex = storefront_edit_user?.index;

			if (editIndex !== null && editIndex !== undefined) {
				const new_phone_number = data?.phone?.slice(data?.country_code?.length - 1) || '';
				updatedUsers[editIndex] = { ...data, phone: new_phone_number };
			} else {
				const new_phone_number = data?.phone?.slice(data?.country_code?.length - 1) || '';
				const append_status = { ...data, phone: new_phone_number, status: 'yet to be invited', id: `temp_${crypto.randomUUID()}` };
				updatedUsers.push(append_status);
			}
			handle_update_form && handle_update_form('wizshop_users.values', updatedUsers);
			handle_back();
			set_btn_loading(false);
		} catch (err) {
			console.error(err);
		}
	};

	const get_values = getValues();

	const handle_change_customer = () => {
		if (is_edit) return;
		set_storefront_edit_user({
			index: storefront_edit_user?.index ?? null,
			user: {
				...get_values,
				buyer_id: '',
				company_name: '',
			},
		});
	};

	useEffect(() => {
		if (!is_edit && !from_ums) {
			reset({
				first_name: '',
				last_name: '',
				email: '',
				phone: '',
				send_invite: true,
			});
		}
	}, [is_edit, from_ums]);

	const content = (
		<FormProvider {...methods}>
			<div className={styles.drawer}>
				<div className={styles.header}>
					<CustomText type='H3'>{is_edit ? 'Edit' : 'Add'} User</CustomText>
					<Icon iconName='IconX' sx={{ cursor: 'pointer' }} onClick={handle_back} />
				</div>
				<Divider />
				{
					<Grid className={styles.customer}>
						{from_ums && (
							<div className={styles.icon_name_icon} onClick={handle_change_customer}>
								<div className={styles.icon_name}>
									<Icon iconName='user' color='rgba(79, 85, 94, 1)' />
									<span>Customer: {storefront_edit_user?.user?.company_name}</span>
								</div>
								{!is_edit && <Icon iconName='IconChevronRight' color='rgba(79, 85, 94, 1)' onClick={() => {}} />}
							</div>
						)}
					</Grid>
				}
				<div className={styles.content}>
					{_.map(wizshop_attributes, (attribute: any) => {
						if (attribute?.id === 'country_code') return;

						return (
							<React.Fragment key={attribute?.id}>
								<FormBuilder
									placeholder={attribute.name}
									label={attribute?.name}
									name={attribute?.id}
									validations={{
										required: attribute?.required,
										email: attribute?.type === 'email',
									}}
									disabled={is_edit && !is_fe_created && attribute?.type === 'email'}
									defaultValue={watch(attribute?.id)}
									type={attribute?.type}
									options={attribute?.options}
									control={control}
									register={methods.register}
									getValues={getValues}
									setValue={setValue}
									// FormHelperTextProps={{
									// 	style: { marginTop: '-6px' },
									// }}
								/>
							</React.Fragment>
						);
					})}
				</div>

				{(!is_edit || show_checkbox) && (
					<div className={styles.checkbox_container}>
						<FormProvider {...methods}>
							<CheckboxEditField name={'send_invite'} defaultValue={true} checkbox_value={true} label='Send invite on email' />
						</FormProvider>
					</div>
				)}

				<div className={styles.footer}>
					<Button variant='outlined' onClick={handle_back}>
						Cancel
					</Button>
					<Button loading={btn_loading} variant='contained' color='primary' type='submit' onClick={handleSubmit(onSubmit)}>
						Save
					</Button>
				</div>
			</div>
		</FormProvider>
	);

	return <Drawer title='Add User' content={content} width={400} open={open} onClose={handle_back} />;
};

export default StoreFrontAddUser;
