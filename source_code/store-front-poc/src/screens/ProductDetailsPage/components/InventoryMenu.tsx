import { Icon, Box } from 'src/common/@the-source/atoms';
import Menu from 'src/common/Menu';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from '../styles';
interface Props {
	menu_data: any;
}

const InventoryMenu: React.FC<Props> = ({ menu_data }) => {
	const classes = useStyles();

	return (
		<Menu
			LabelComponent={<Icon iconName='IconInfoCircle' sx={{ color: '#9AA0AA', cursor: 'pointer' }} />}
			commonMenuComponent={(item: any) => {
				return (
					<Box className={classes.inventory_menu}>
						<CustomText style={{ fontWeight: 400 }} color='rgba(0, 0, 0, 0.87)'>
							{item.data.label}
						</CustomText>
						<CustomText type='Subtitle' style={{ fontWeight: 700 }} color='rgba(0, 0, 0, 0.87)'>
							{item.data.number}
						</CustomText>
					</Box>
				);
			}}
			menu={menu_data}
			hover={true}
		/>
	);
};

export default InventoryMenu;
