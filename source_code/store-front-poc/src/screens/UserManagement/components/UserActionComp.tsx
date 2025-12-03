import { Menu, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import map from 'lodash/map';
import size from 'lodash/size';
import head from 'lodash/head';
import { useMemo, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid, Icon, Tooltip } from 'src/common/@the-source/atoms';
import useTenantSettings from 'src/hooks/useTenantSettings';
import { custom_stepper_text_color } from 'src/utils/light.theme';

interface MenuProps {
	name: string;
	icon: string;
	key: string;
}

const ACTION_KEYS = {
	EDIT: 'edit',
	RESET_PASSWORD: 'reset_password',
};

const useStyles = makeStyles({
	iconStyle: {
		cursor: 'pointer',
		color: '#676D77',
		margin: '8px',
		marginTop: '12px',
		transition: '0.2s ease-in-out',
		'&:hover': {
			color: 'black',
			transform: 'scale(1.2)',
		},
	},
});

const UserActionComp = (
	params: any,
	handle_user_actions: (params: any) => void,
	handle_action_click: (params: any, type: string) => void,
) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const { can_reset_password } = useTenantSettings({ ['can_reset_password']: false });
	const classes = useStyles();

	const secondary_actions: MenuProps[] = useMemo(() => {
		const actions = [{ name: 'Edit', icon: 'IconEdit', key: ACTION_KEYS.EDIT }];
		can_reset_password &&
			params?.node?.data?.status === 'active' &&
			actions.push({ name: 'Copy reset link', icon: 'IconCopy', key: ACTION_KEYS.RESET_PASSWORD });

		return actions;
	}, [can_reset_password]);

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleIconClick = (action: any) => {
		switch (action) {
			case ACTION_KEYS.EDIT:
				handle_action_click && handle_action_click(params, 'user');
				break;
			case ACTION_KEYS.RESET_PASSWORD:
				handle_user_actions && handle_user_actions(params);
				break;
		}
		setAnchorEl(null);
	};

	return size(secondary_actions) === 1 ? (
		<Grid display={'flex'} direction={'row'} alignItems={'center'} justifyContent={'center'}>
			<Tooltip title={head(secondary_actions)?.name} placement='right' textStyle={{ fontSize: '1.2rem' }} arrow>
				<div>
					<Icon
						className={classes.iconStyle}
						onClick={() => handleIconClick(head(secondary_actions)?.key)}
						iconName={'IconEdit'}
						size='large'
					/>
				</div>
			</Tooltip>
		</Grid>
	) : (
		<Grid display={'flex'} direction={'row'} alignItems={'center'} justifyContent={'center'}>
			<Icon sx={{ cursor: 'pointer', mt: 1.5 }} iconName='IconDotsVertical' onClick={handleClick} />
			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
				{map(secondary_actions, (action: any) => (
					<MenuItem key={action?.key} onClick={() => handleIconClick(action?.key)}>
						<Grid display={'flex'} direction={'row'} gap={'8px'} alignItems={'center'}>
							<Icon color={custom_stepper_text_color?.grey} sx={{ cursor: 'pointer' }} iconName={action?.icon} />
							<CustomText>{action?.name}</CustomText>
						</Grid>
					</MenuItem>
				))}
			</Menu>
		</Grid>
	);
};

export default UserActionComp;
