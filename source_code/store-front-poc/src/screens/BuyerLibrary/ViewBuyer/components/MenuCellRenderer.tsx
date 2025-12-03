import { Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { wizshop_constants } from '../helper';
import { Icon } from 'src/common/@the-source/atoms';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { check_permission } from 'src/utils/utils';

const MenuCellRenderer = (params: any) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const { id = '' } = useParams();
	const { status } = params.data;
	const { set_toggle_toast, handle_action_click, fetch_data } = params?.cellRendererParams;
	const permissions = useSelector((state: any) => state?.login?.permissions);

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleMenuItemClick: any = (action: string) => {
		handleClose();
		return handle_action_click(action, id, params);
	};

	const getMenuActions = (action_item: string) => {
		switch (action_item) {
			case wizshop_constants.Inactive:
				return [
					{ label: 'Edit', value: 'edit' },
					// { label: 'Resend invite', value: 'resend_invite' },
					{ label: 'Mark as active', value: 'mark_as_active' },
				];
			case wizshop_constants.Active:
				const temp2 = [
					{ label: 'Edit', value: 'edit' },
					{ label: 'Mark as Inactive', value: 'mark_as_inactive' },
				];
				check_permission(permissions, ['invite_wizshop_user']) &&
					temp2.push(
						{ label: 'Resend invite', value: 'resend_invite' },
						{ label: 'Copy invite', value: 'copy_invite' },
						{ label: 'Set new password', value: 'set_password' },
					);

				return temp2;

			case wizshop_constants.YET_TO_BE_INVITED:
				const temp1 = [
					{ label: 'Edit', value: 'edit' },
					{ label: 'Delete User', value: 'delete_user' },
				];
				check_permission(permissions, ['invite_wizshop_user']) &&
					temp1.push({ label: 'Send Invite', value: 'send_invite' }, { label: 'Set new password', value: 'set_password' });
				return temp1;

			case wizshop_constants.Invited:
				const temp = [
					{ label: 'Edit', value: 'edit' },
					{ label: 'Delete User', value: 'delete_user' },
				];
				check_permission(permissions, ['invite_wizshop_user']) &&
					temp.push(
						{ label: 'Resend invite', value: 'resend_invite' },
						{ label: 'Copy invite', value: 'copy_invite' },
						{ label: 'Set new password', value: 'set_password' },
					);
				return temp;
			default:
				return [];
		}
	};

	const menuActions = getMenuActions(status);

	const handle_click = (value: string) => {
		handleMenuItemClick(value)
			?.then(() => {
				if (value === 'send_invite' || value === 'resend_invite') {
					set_toggle_toast({
						show: true,
						message: 'Invitation sent successfully',
						title: 'Success',
						status: 'success',
					});
				}
				fetch_data(id);
			})
			.catch((err: any) => {
				console.error(err);
			});
	};

	return (
		<>
			<Icon sx={{ cursor: 'pointer', mt: 1.5 }} iconName='IconDotsVertical' onClick={handleClick} />
			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
				{_.map(menuActions, (action) => (
					<MenuItem key={action.value} onClick={() => handle_click(action.value)}>
						{action.label}
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

export default MenuCellRenderer;
