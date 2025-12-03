import { Menu, MenuItem } from '@mui/material';
import { filter, get, includes, isEmpty, map } from 'lodash';
import { useMemo, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid, Icon, Tooltip } from 'src/common/@the-source/atoms';
import { ACTION_KEYS, DISABLED_STATUS } from 'src/screens/Presentation/constants';
import { custom_stepper_text_color, text_colors } from 'src/utils/light.theme';

interface MenuProps {
	name: string;
	icon: string;
	key: string;
}

const CustomActionRenderer = (params: any) => {
	const pdf_status = get(params, 'data.pdf_status');
	const pdf_link = get(params, 'data.pdf_link');
	const [anchorEl, setAnchorEl] = useState(null);
	const { handle_catalog_actions } = params?.cellRendererParams;

	const primary_actions: MenuProps[] = useMemo(() => {
		let actions = [
			{ name: 'Download', icon: 'IconDownload', key: ACTION_KEYS.DOWNLOAD, disable: includes(DISABLED_STATUS, pdf_status) },
			// { name: 'Send', icon: 'IconMail', key: 'mail' },  // [KEPT for later use
		];

		if (pdf_status === 'Failed') {
			// Remove "Download" option if the status is 'Failed'
			actions = filter(actions, (action) => action.key !== ACTION_KEYS.DOWNLOAD);
			actions.splice(1, 0, { name: 'Regenerate', icon: 'IconReload', key: 'regenerate', disable: false });
		}

		return actions;
	}, [pdf_status]);

	const secondary_actions: MenuProps[] = useMemo(() => {
		const actions = [
			{ name: 'Edit', icon: 'IconEdit', key: ACTION_KEYS.EDIT },
			{ name: 'Copy Link', icon: 'IconLink', key: ACTION_KEYS.COPY_LINK },
			{ name: 'Mail', icon: 'IconMail', key: ACTION_KEYS.MAIL },
		];

		if (isEmpty(pdf_link)) {
			actions.splice(1, 1);
		}

		return actions;
	}, [pdf_link]);

	// const disable_links = includes(DISABLED_STATUS, pdf_status);

	const handleClick = (event: any) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleMenuItemClick = (action: string) => {
		setAnchorEl(null);
		handle_catalog_actions && handle_catalog_actions(params, action);
	};

	const handleIconClick = (action: any) => {
		if (action === ACTION_KEYS.DOWNLOAD && action?.disable) {
			return;
		}
		handle_catalog_actions && handle_catalog_actions(params, action);
	};

	return (
		<Grid display={'flex'} direction={'row'} gap={'16px'} alignItems={'center'} justifyContent={'flex-end'}>
			{map(primary_actions, (action: any) => {
				return (
					<Tooltip title={action?.name} arrow placement='bottom' key={action?.key}>
						<div>
							<Icon
								sx={{ cursor: 'pointer', mt: 1.5 }}
								color={action?.disable && action?.key === ACTION_KEYS.DOWNLOAD ? text_colors?.grey : custom_stepper_text_color?.grey}
								iconName={action?.icon}
								onClick={() => handleIconClick(action?.key)}
							/>
						</div>
					</Tooltip>
				);
			})}
			<div>
				<Icon sx={{ cursor: 'pointer', mt: 1.5 }} iconName='IconDotsVertical' onClick={handleClick} />
			</div>
			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
				{map(secondary_actions, (action: any) => (
					<MenuItem key={action?.key} onClick={() => handleMenuItemClick(action?.key)}>
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

export default CustomActionRenderer;
