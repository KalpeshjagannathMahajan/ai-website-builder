import { makeStyles } from '@mui/styles';
import CustomText from 'src/common/@the-source/CustomText';

import { Icon } from 'src/common/@the-source/atoms';
import MenuHover from 'src/common/MenuHover';

// TODO: fix width styling
const useStyles = makeStyles(() => ({
	container: {
		width: '150px',
		display: 'flex',
		justifyContent: 'space-between',
	},
}));

const InventoryMenu = () => {
	const classes = useStyles();

	return (
		<MenuHover
			LabelComponent={
				<div style={{ cursor: 'pointer', border: 'none' }}>
					<Icon iconName='IconInfoCircle' color='#676D77' />
				</div>
			}
			commonMenuComponent={(_item: any) => {
				return (
					<div className={classes.container}>
						<CustomText type='Body' color='rgba(0, 0, 0, 0.87)'>
							{_item.data.label}
						</CustomText>
						<CustomText type='Subtitle' color='rgba(0, 0, 0, 0.87)'>
							{_item.data.number}
						</CustomText>
					</div>
				);
			}}
			menu={[
				{
					id: 'transit',
					data: {
						label: 'In Transit',
						number: 34,
					},
				},
				{
					id: 'hold',
					data: {
						label: 'On hold',
						number: 30,
					},
				},
				{
					id: 'reserved',
					data: {
						label: 'Reserved',
						number: 25,
					},
				},
			]}
		/>
	);
};

export default InventoryMenu;
