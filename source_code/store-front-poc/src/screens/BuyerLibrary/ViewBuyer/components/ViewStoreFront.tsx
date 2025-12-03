import _ from 'lodash';
import { useState } from 'react';
import { Button, Grid, Icon, Modal, Toaster } from 'src/common/@the-source/atoms';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import api_requests from 'src/utils/api_requests';
import AddWizshopUser from './AddWizshopUser';
import MenuCellRenderer from './MenuCellRenderer';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from 'src/screens/BuyerLibrary/styles';
import SetPasswordModal from '../../BuyerList/SetPasswordModal';

interface ViewStoreFrontProps {
	item: any;
	fetch_buyer: (id: string) => void;
}

export const wizshop_col_def = [
	{
		headerName: 'Name',
		field: 'name',
		editable: false,
		width: 300,
		dtype: 'text',
		type: 'text',
		hideFilter: true,
	},
	{
		headerName: 'Email',
		field: 'email',
		editable: false,
		width: 330,
		dtype: 'text',
		type: 'text',
		hideFilter: true,
	},
	{
		headerName: 'Phone',
		field: 'phone',
		editable: false,
		width: 215,
		dtype: 'text',
		type: 'phone',
		hideFilter: true,
	},
	{
		headerName: 'Status',
		field: 'status',
		editable: false,
		width: 215,
		dtype: 'text',
		type: 'text',
		hideFilter: true,
	},
	{
		headerName: '',
		field: 'menu',
		editable: false,
		width: 100,
		maxWidth: 100,
		dtype: 'icon',
		type: 'icon',
		cellRenderer: 'menuCellRenderer',
		hideFilter: true,
		pinned: 'right',
	},
];

const transform_user_data: any = (users: any) => {
	return _.map(users, (user: any) => {
		const attributes = user.attributes.reduce((acc: any, attr: any) => {
			acc[attr.id] = attr.value;
			return acc;
		}, {});

		return {
			name: `${attributes?.first_name} ${attributes?.last_name}`,
			email: attributes?.email,
			status: attributes?.status,
			phone: attributes?.phone,
			country_code: attributes?.country_code,
			id: user?.id || '',
		};
	});
};

const ViewStoreFront = ({ item, fetch_buyer }: ViewStoreFrontProps) => {
	const [copy_modal, set_copy_modal] = useState(false);
	const [open_set_pass_modal, set_open_set_pass_modal] = useState<boolean>(false);
	const [user_data, set_user_data] = useState<any>({});
	const [copy_url, set_copy_url] = useState('');
	const [drawer, set_drawer] = useState({ open: false, index: null });
	const [toggle_toast, set_toggle_toast] = useState({ show: false, message: '', title: '', status: 'success' });
	const [delete_modal, set_delete_modal] = useState(false);
	const [current_params, set_current_params] = useState({ user_id: '', buyer_id: '', action: '' });
	const classes = useStyles();

	const wizshop_users = _.get(item, 'wizshop_users', []);
	const transformed_data = transform_user_data(wizshop_users);
	const handle_drawer = (params: any) => {
		set_drawer({ open: true, index: params?.rowIndex });
	};
	const handle_copy_invite = () => {
		navigator.clipboard.writeText(copy_url);
		set_toggle_toast({
			show: true,
			message: '',
			title: 'URL Copied to Clipboard',
			status: '',
		});
		set_copy_modal(false);
	};

	const get_link = async (payload: any) => {
		try {
			const res: any = await api_requests?.wizshop?.get_copy_invite(_.head(payload?.email_invites));
			set_copy_url(res?.data?.reset_password_link);
			set_copy_modal(true);
		} catch (err) {
			console.log(err);
		}
	};
	const handle_action_click = (value: string, buyer_id: string, params: any) => {
		const payload = {
			email_invites: [
				{
					user_id: params?.data?.id || '',
					buyer_id,
				},
			],
		};
		switch (value) {
			case 'resend_invite':
				return api_requests.wizshop.send_email(payload);
			case 'send_invite':
				return api_requests.wizshop.send_email(payload);
			case 'mark_as_active':
				return api_requests.wizshop.post_action({
					user_id: params?.data?.id || '',
					buyer_id,
					action: 'active',
				});
			case 'mark_as_inactive':
				return api_requests.wizshop.post_action({
					user_id: params?.data?.id || '',
					buyer_id,
					action: 'inactive',
				});
			case 'delete_user':
				set_current_params({ user_id: params?.data?.id || '', buyer_id: buyer_id || '', action: 'delete' });
				return set_delete_modal(true);
			case 'copy_invite':
				get_link(payload);
				return;
			case 'set_password':
				set_user_data(params?.data);
				set_open_set_pass_modal(true);
				return;
			case 'edit':
				return handle_drawer(params);
			default:
				return Promise.resolve();
		}
	};

	const handle_delete_modal_btn = async () => {
		try {
			await api_requests.wizshop.post_action({
				user_id: current_params?.user_id,
				buyer_id: current_params?.buyer_id,
				action: 'delete',
			});
			set_delete_modal(false);

			set_toggle_toast({
				show: true,
				message: 'User deleted successfully',
				title: 'Success',
				status: 'success',
			});
			fetch_buyer(current_params?.buyer_id);
		} catch (err) {
			console.error(err);
		}
	};

	const transformed_columns = (wizshop_col_def as any).map((column: any) => {
		if (column.field === 'menu') {
			return {
				...column,
				cellRenderer: MenuCellRenderer,
				cellRendererParams: {
					set_toggle_toast,
					handle_action_click,
					fetch_data: fetch_buyer,
				},
			};
		}
		if (column.field === 'phone') {
			return {
				...column,
				cellRenderer: (params: any) => {
					const phone_number = params?.data?.phone;
					const country = params?.data?.country_code;
					const formatted_value = phone_number ? `${country} ${phone_number}` : '--';
					return <CustomText>{formatted_value}</CustomText>;
				},
			};
		}
		return column;
	});

	const height = transformed_data?.length * 50;

	return (
		<>
			<AgGridTableContainer
				columnDefs={transformed_columns}
				rowData={transformed_data}
				containerStyle={{
					height: `${height + 90}px`,
					maxHeight: '40vh',
					// width: '66vw',
					marginLeft: 'auto',
					marginRight: 'auto',
					marginTop: '20px',
				}}
			/>
			{drawer.open && (
				<AddWizshopUser
					open={drawer.open}
					set_open={set_drawer}
					data={wizshop_users[drawer?.index]}
					fetch_buyer={fetch_buyer}
					set_toggle_toast={set_toggle_toast}
				/>
			)}
			{toggle_toast?.show && (
				<Toaster
					open={toggle_toast?.show}
					showCross={true}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					autoHideDuration={3000}
					state={toggle_toast?.status}
					title={toggle_toast.title}
					onClose={() => set_toggle_toast({ show: false, message: '', title: '', status: '' })}
					subtitle={toggle_toast.message}
					showActions={false}
				/>
			)}

			{delete_modal && (
				<Modal
					open={delete_modal}
					onClose={() => set_delete_modal(false)}
					title={'Delete user?'}
					children={
						<Grid>
							<p>Are you sure you want to delete this user?</p>
						</Grid>
					}
					footer={
						<Grid sx={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
							<Button
								variant='outlined'
								sx={{
									color: '#4F555E',
									border: '1px solid #4F555E',
									'&:hover': {
										border: '1px solid #4F555E',
									},
								}}
								onClick={() => set_delete_modal(false)}>
								Cancel
							</Button>
							<Button variant='contained' color='error' onClick={handle_delete_modal_btn}>
								Yes,Delete
							</Button>
						</Grid>
					}
				/>
			)}
			{open_set_pass_modal && (
				<SetPasswordModal
					open={open_set_pass_modal}
					on_close={() => set_open_set_pass_modal(false)}
					data={user_data}
					set_reload={() => {}}
				/>
			)}
			{copy_modal && (
				<Modal
					width={500}
					open={copy_modal}
					onClose={() => set_copy_modal(false)}
					title={'Copy invite'}
					children={
						<Grid className={classes.modal_container}>
							<CustomText className={classes.modal_custom_text}>{copy_url}</CustomText>
							<Button variant='contained' onClick={handle_copy_invite} className={classes.button}>
								<Icon iconName='IconCopy' color='#FFF' />
								Copy
							</Button>
						</Grid>
					}
				/>
			)}
		</>
	);
};

export default ViewStoreFront;
