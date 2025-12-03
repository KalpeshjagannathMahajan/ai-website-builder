import { Grid, Icon } from 'src/common/@the-source/atoms';
import Menu from 'src/common/Menu';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from '../style';
import { useContext } from 'react';
import WizAiContext from '../context';
import { useTheme } from '@mui/material';

const ViewMenu = ({ is_default }: any) => {
	const classes = useStyles();
	const theme: any = useTheme();
	const { handle_view, handle_add_view, view_list, set_new_view, view } = useContext(WizAiContext);

	const menu_list = [...view_list.filter((item: any) => item?.is_default !== true)];

	if (view?.is_default === true) {
		menu_list.unshift({
			id: 'add',
			name: '+ Add view',
		});
	}
	const handle_menu_click = (item: any) => {
		if (item?.id === view?.id) {
			return;
		}
		if (item?.id === 'add') {
			set_new_view(true);
			handle_add_view();
		} else {
			handle_view(item?.id);
		}
	};

	return (
		<Menu
			LabelComponent={
				<Grid className={is_default ? classes.icon_style : classes.view_icon_style}>
					<Icon iconName='IconPlaylistAdd' className={classes.icon} />
				</Grid>
			}
			sx={{ maxHeight: '300px' }}
			hideGreenBorder={true}
			closeOnItemClick={true}
			selectedId={view?.id}
			commonMenuComponent={(_item: any) => {
				return (
					<div className={classes.menu_container} onClick={() => handle_menu_click(_item)}>
						<CustomText type={'Body'} color={_item?.id === 'add' ? theme?.insights?.add_color : theme?.insights?.black_color}>
							{_item?.name}
						</CustomText>
					</div>
				);
			}}
			menu={menu_list} //{_.filter(menu_list, (item) => item?.id !== view?.id)}
		/>
	);
};

export default ViewMenu;
