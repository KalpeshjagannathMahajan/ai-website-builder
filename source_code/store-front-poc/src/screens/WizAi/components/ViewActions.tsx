import { Grid, Icon } from 'src/common/@the-source/atoms';
import Menu from 'src/common/Menu';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from '../style';
import { useContext } from 'react';
import WizAiContext from '../context';

const ViewActions = () => {
	const classes = useStyles();
	const { set_delete_modal, handle_duplicate_view, set_show_modal } = useContext(WizAiContext);

	const menu_list = [
		{
			id: 'duplicate',
			name: 'Duplicate view',
		},
		{
			id: 'rename',
			name: 'Rename',
		},
		{
			id: 'delete',
			name: 'Delete view',
		},
	];

	const handle_menu_click = (item: any) => {
		if (item?.id === 'delete') {
			set_delete_modal(true);
		} else if (item?.id === 'duplicate') {
			handle_duplicate_view();
		} else {
			set_show_modal(true);
		}
	};

	return (
		<Menu
			LabelComponent={
				<Grid className={classes.icon_style}>
					<Icon iconName='IconDotsVertical' className={classes.icon} />
				</Grid>
			}
			hideGreenBorder={true}
			closeOnItemClick={true}
			commonMenuComponent={(_item: any) => {
				return (
					<div className={classes.menu_action_container}>
						<CustomText type='Title' onClick={() => handle_menu_click(_item)}>
							{_item?.name}
						</CustomText>
					</div>
				);
			}}
			menu={menu_list}
		/>
	);
};

export default ViewActions;
