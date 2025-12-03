import { Fragment, useContext, useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import { Grid, Icon } from 'src/common/@the-source/atoms';
import { ListGrid, MENU_ITEMS, USER_MENU_ITEMS } from '../utils/constants';
import CustomText from 'src/common/@the-source/CustomText';
import { Collapse, ListItem, ListItemText } from '@mui/material';
import classes from './../Settings.module.css';
import _ from 'lodash';
import { useNavigate } from 'react-router-dom';
import SettingsContext from '../context';

const Sidebar = () => {
	const { configure, setting_to_customer } = useContext(SettingsContext);
	const user_menu = configure?.settings_configuration?.config || USER_MENU_ITEMS;
	const menu = setting_to_customer ? user_menu : MENU_ITEMS;
	const initializeOpenSubMenu = () => {
		const initialState: any = {};
		menu.forEach((item) => {
			initialState[item.id] = false;
		});
		return initialState;
	};
	const [openSubMenu, setOpenSubMenu] = useState<any>(initializeOpenSubMenu);

	const navigate = useNavigate();
	const handleClick = (id: any) => {
		setOpenSubMenu((prev: any) => ({ ...prev, [id]: !prev[id] }));
	};
	const handle_navigate = (item: any) => {
		navigate(item.link);
	};

	useEffect(() => {
		const id = _.find(menu, (item: any) => _.includes(location.pathname, item.id))?.id;
		setOpenSubMenu((prev: any) => ({ ...prev, [id]: true }));
	}, [location.pathname]);

	return (
		<Grid className={classes.sidebar_container}>
			<CustomText type='H2' style={{ margin: '0px 24px 12px' }}>
				Settings
			</CustomText>
			<Divider sx={{ mx: 2.4, width: 'calc(100% - 40px)' }} />
			<Grid className={classes.sidebar_content}>
				{_.map(menu, ({ title, children, id, is_display }) => {
					const sub_menus = _.filter(children, (item: any) => item.is_display);
					const is_all_item_visible = _.some(children, (item: any) => item.is_display);
					if (is_display && is_all_item_visible) {
						return (
							<Fragment key={title}>
								<ListItem className={classes.sidebar_list_item} onClick={() => handleClick(id)}>
									<Icon iconName={openSubMenu[id] ? 'IconChevronUp' : 'IconChevronRight'} />
									<ListItemText primary={<CustomText type={openSubMenu[id] ? 'H6' : 'Title'}>{title}</CustomText>} />
								</ListItem>
								<Collapse sx={{ width: '100%' }} in={openSubMenu[id]} timeout='auto' unmountOnExit>
									<Grid>
										{_.map(sub_menus, (item: any) => (
											<Grid mx={2} onClick={() => handle_navigate(item)}>
												<ListGrid sx={{ background: _.includes(location.pathname, item.link) ? '#E8F3EF' : '' }} variant='text'>
													{item?.title}
												</ListGrid>
											</Grid>
										))}
									</Grid>
								</Collapse>
							</Fragment>
						);
					}
				})}
			</Grid>
		</Grid>
	);
};

export default Sidebar;
