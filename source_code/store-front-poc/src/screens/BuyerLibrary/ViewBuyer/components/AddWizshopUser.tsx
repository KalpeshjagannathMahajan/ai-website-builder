import { Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import _ from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { Button, Drawer, Icon } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import api_requests from 'src/utils/api_requests';

type DrawerData = {
	open: boolean;
	index: number;
};

interface AddWizShopUserProps {
	open: boolean;
	set_open: ({ open, index }: DrawerData) => void;
	data: any;
	fetch_buyer: (id: string) => void;
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
}));

const AddWizshopUser = ({ open, set_open, data, fetch_buyer, set_toggle_toast }: AddWizShopUserProps) => {
	const styles = useStyles();
	const methods = useForm();
	const { id = '' } = useParams();
	const { control, handleSubmit, getValues, setValue } = methods;

	const excluded_attributes = ['status', 'send_invite'];
	const filter_attributes = _.filter(data?.attributes, (attr: any) => !excluded_attributes.includes(attr?.id));

	const on_close = () => {
		set_open({ open: false, index: null });
	};

	const onSubmit = (req_data: any) => {
		const new_phone_number = req_data?.phone?.slice(req_data?.country_code?.length - 1) || '';
		const payload = {
			...req_data,
			phone: new_phone_number,
			send_invite: false,
			buyer_id: id,
		};
		api_requests.wizshop
			.edit_user(payload, data?.id)
			.then(() => {
				on_close();
				set_toggle_toast({ show: true, message: 'User edited successfully', title: 'Success', status: 'success' });
				fetch_buyer(id);
			})
			.catch((e) => console.error(e));
	};

	const content = (
		<FormProvider {...methods}>
			<div className={styles.drawer}>
				<div className={styles.header}>
					<CustomText type='H3'>Edit User</CustomText>
					<Icon iconName='IconX' sx={{ cursor: 'pointer' }} onClick={on_close} />
				</div>
				<Divider />
				<div className={styles.content}>
					{_.map(filter_attributes, (attribute: any) => {
						if (attribute?.id === 'country_code') {
							// setValue('country_code', attribute?.value);
							return null;
						}
						const country_code = _.find(data?.attributes, { id: 'country_code' })?.value;
						const phone_value = attribute?.id === 'phone' ? `${country_code}${attribute?.value}` : attribute?.value;
						return (
							<FormBuilder
								key={attribute?.id}
								placeholder={attribute?.name}
								label={attribute?.name}
								name={attribute?.id}
								// style={{ gap: '1rem' }}
								validations={{
									required: attribute?.required,
									email: attribute?.type === 'email',
								}}
								disabled={attribute?.type === 'email'}
								defaultValue={attribute?.id === 'phone' ? phone_value : attribute?.value}
								type={attribute?.type}
								control={control}
								register={methods.register}
								getValues={getValues}
								setValue={setValue}
							/>
						);
					})}
				</div>
				<div className={styles.footer}>
					<Button variant='outlined' onClick={on_close}>
						Cancel
					</Button>
					<Button variant='contained' color='primary' type='submit' onClick={handleSubmit(onSubmit)}>
						Save
					</Button>
				</div>
			</div>
		</FormProvider>
	);

	return <Drawer title='Edit User' content={content} width={400} open={open} onClose={on_close} />;
};

export default AddWizshopUser;
