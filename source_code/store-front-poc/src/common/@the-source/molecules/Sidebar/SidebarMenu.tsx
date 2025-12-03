import { Menu, MenuItem, MenuList } from '@mui/material';

import Typography from '../../atoms/Typography/Typography';

export interface SidebarMenuProps {
	title: string;
	childItems: any;
	open: boolean;
	setAnchorEl: any;
	anchorEl: any;
	selected?: any;
	handleClick: (id: number | string) => {};
}
const SidebarMenu = ({ title, childItems, open, anchorEl, setAnchorEl, selected, handleClick }: SidebarMenuProps) => {
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<Menu
			sx={{
				left: 68,
				boxShadow: 'none',
			}}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
			onClose={handleClose}
			open={open}
			anchorEl={anchorEl}>
			<MenuList sx={{ width: 150, padding: 0, mt: '-.5em', mb: '-.5em', boxShadow: 'none' }}>
				<MenuItem
					disableRipple
					disableTouchRipple
					sx={{
						'&:hover': {
							backgroundColor: '#096645',
						},
						cursor: 'auto',
						background: '#096645',
						paddingY: 1,
						border: 'none',
						borderRadius: '8px',
						boxShadow: 'none',
					}}>
					<Typography noWrap variant='h6' color='#FFF' sx={{ pl: 0.5 }}>
						{title}
					</Typography>
				</MenuItem>
				{childItems?.map((child: any) => (
					<MenuItem
						key={child.id}
						sx={
							selected === child?.id
								? {
										background: '#E8F3EF',
										'&:hover': {
											backgroundColor: '#E8F3EF',
										},
										boxShadow: 'none',
								  }
								: {
										'&:hover': {
											backgroundColor: '#FFF',
										},
										boxShadow: 'none',
								  }
						}
						onClick={(event) => {
							event.stopPropagation();
							handleClick(child?.id);
							child?.onIconClick();
							handleClose();
						}}>
						<Typography
							noWrap
							variant={selected === child?.id ? 'h6' : 'subtitle1'}
							color={selected === child?.id ? '#16885F' : '#4F555E'}
							sx={{ cursor: 'pointer', pl: 2 }}>
							{child?.title}
						</Typography>
					</MenuItem>
				))}
			</MenuList>
		</Menu>
	);
};

SidebarMenu.defaultProps = {
	selected: undefined,
};
export default SidebarMenu;
