import { Menu, MenuItem } from '@mui/material';
import _ from 'lodash';
import { useState } from 'react';
import { Icon } from 'src/common/@the-source/atoms';

const MenuCellRenderer = (params: any) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const { status } = params.data;
	const { handle_open_drawer, handle_delete } = params?.cellRendererParams;

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleMenuItemClick = (action: string) => {
		handleClose();
		if (action === 'edit') {
			handle_open_drawer(params);
		} else if (action === 'delete') {
			handle_delete(params);
		} else {
			return Promise.resolve();
		}
	};

	const getMenuActions = (status_item: string) => {
		if (status_item === 'Active' || status_item === 'Inactive') {
			return [{ label: 'Edit', value: 'edit' }];
		} else {
			return [
				{ label: 'Edit', value: 'edit' },
				{ label: 'Delete', value: 'delete' },
			];
		}
	};

	const menuActions = getMenuActions(status);

	return (
		<>
			<Icon sx={{ cursor: 'pointer', mt: 1.5 }} iconName='IconDotsVertical' onClick={handleClick} />
			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
				{_.map(menuActions, (action) => (
					<MenuItem key={action?.value} onClick={() => handleMenuItemClick(action?.value)}>
						{action?.label}
					</MenuItem>
				))}
			</Menu>
		</>
	);
};

export default MenuCellRenderer;
