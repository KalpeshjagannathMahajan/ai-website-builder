import React from 'react';
import { makeStyles } from '@mui/styles';
import { Divider } from '@mui/material';
import { Drawer, Grid, Icon, Button } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import CheckboxEditField from 'src/common/@the-source/atoms/FieldsNew/CheckboxEditField';
import { FormProvider, useForm } from 'react-hook-form';
import _ from 'lodash';
import storefront from 'src/utils/api_requests/storefront';
import api_requests from 'src/utils/api_requests';
//TODO: color from themes

const useStyles = makeStyles(() => ({
	header: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '12px',
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
		// whiteSpace:' nowrap',
		// overflow: 'hidden',
		// textOverflow:'ellipsis',
	},
	icon_name_icon: {
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer',
		justifyContent: 'space-between',
		backgroundColor: '#F0F6FF',
		borderRadius: '12px',
		padding: '6px 10px',
	},
	checkbox_container: {
		position: 'fixed',
		bottom: '76px',
		borderRadius: '8px',
		background: '#F7F8FA',
		padding: '8px 10px ',
		width: '400px',
	},
}));

interface Props {
	add_user: boolean;
	set_add_user: (state: boolean) => void;
	buyer_fields?: any;
	storefront_buyer: any;
	wizshop_lead_id?: string;
	data?: any;
	set_refetch?: any;
	set_attr_drawer?: any;
	set_is_buyer_exist_form?: any;
	set_drawer?: any;
	set_show_toast?: any;
	set_storefront_buyer?: any;
	set_buyer_data?: any;
	exist_customer?: boolean;
}

const AddUserExistCustomer = ({
	add_user,
	set_add_user,
	storefront_buyer,
	wizshop_lead_id,
	data,
	set_refetch,
	set_drawer,
	set_is_buyer_exist_form,
	set_show_toast,
	set_storefront_buyer,
	set_buyer_data,
	exist_customer = false,
}: Props) => {
	const styles = useStyles();

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>Add User</CustomText>
				<Icon iconName='IconX' onClick={() => set_add_user(false)} />
			</Grid>
		);
	};

	const handle_cancel = () => {
		set_add_user(false);
		set_drawer(false);
	};

	const methods = useForm({ defaultValues: data });
	const { getValues, setError, control, setValue } = methods;
	const handle_save_click = async () => {
		const values = getValues();
		const new_phone_number = values?.phone?.slice(values?.country_code?.length - 1) || '';
		let payload: any = {
			email: values?.email,
			first_name: values?.first_name,
			last_name: values?.last_name,
			buyer_id: storefront_buyer?.user?.buyer_id,
			send_invite: values?.is_primary,
			country_code: values?.country_code,
			phone: new_phone_number,
			wizshop_lead_id,
		};
		const response: any = await api_requests.wizshop.validate_email(values?.email || '');
		if (response?.data?.is_duplicate) {
			setError('email', { type: 'custom', message: 'This email already exists' });
			return;
		}

		try {
			await storefront.create_storefront_existing(payload);
			if (exist_customer && wizshop_lead_id) {
				try {
					await storefront.update_lead_status(wizshop_lead_id, 'existing_customer');
				} catch (err) {
					console.error(err);
				}
			}
			set_refetch((prev: any) => !prev);
			set_drawer(false);
			set_add_user(false);
			set_show_toast({ state: true, title: 'User has been created successfully', sub_title: '' });
		} catch (err) {
			console.error(err);
		}
	};

	const attributes = [
		{
			name: 'First Name',
			id: 'first_name',
			priority: 0,
			required: true,
			type: 'text',
			value: '',
		},
		{
			name: 'Last Name',
			id: 'last_name',
			priority: 1,
			required: false,
			type: 'text',
			value: '',
		},
		{
			name: 'Email',
			id: 'email',
			priority: 2,
			required: true,
			type: 'email',
			value: '',
		},
		{
			id: 'country_code',
			name: 'Country Code',
			priority: 2,
			required: true,
			type: 'text',
			value: '+1',
		},
		{
			id: 'phone',
			name: 'Phone number',
			priority: 3,
			required: true,
			type: 'phone',
			value: '',
		},
	];

	const handle_customer_pannel = () => {
		set_buyer_data({});
		set_storefront_buyer({ index: null, user: null });
		set_add_user(false);
		set_is_buyer_exist_form(true);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<Grid className={styles.icon_name_icon}>
					<Grid className={styles.icon_name}>
						<Icon iconName='user' color='rgba(79, 85, 94, 1)' />

						<span>Customer: {storefront_buyer?.user?.company_name}</span>
					</Grid>
					<Icon iconName='IconChevronRight' color='rgba(79, 85, 94, 1)' onClick={() => handle_customer_pannel()} />
				</Grid>
				<FormProvider {...methods}>
					{_.map(attributes, (attribute: any) => {
						if (attribute?.id === 'country_code') {
							return;
						}
						const values = getValues(attribute?.id) || '';

						return (
							<Grid key={attribute.id}>
								<FormBuilder
									placeholder={attribute.name}
									label={attribute?.name}
									name={attribute.id}
									validations={{
										required: attribute?.required,
										email: attribute?.type === 'email',
									}}
									defaultValue={values}
									type={attribute?.type}
									options={attribute?.options}
									control={control}
									register={methods.register}
									getValues={getValues}
									setValue={setValue}
								/>
							</Grid>
						);
					})}

					<Grid className={styles.checkbox_container}>
						<CheckboxEditField name='is_primary' key='is_primary' defaultValue={true} checkbox_value={true} label='Send invite on email' />
					</Grid>
				</FormProvider>
			</Grid>
		);
	};
	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer' style={{ justifyContent: 'flex-end' }}>
				<Grid className={styles.footer}>
					<Button variant='outlined' onClick={() => handle_cancel()}>
						Cancel
					</Button>

					<Button onClick={() => handle_save_click()}>Save</Button>
				</Grid>
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
	return (
		<>
			<Drawer
				anchor='right'
				width={440}
				open={add_user}
				onClose={() => set_add_user(false)}
				content={<React.Fragment>{handle_render_drawer()}</React.Fragment>}
			/>
		</>
	);
};

export default AddUserExistCustomer;
