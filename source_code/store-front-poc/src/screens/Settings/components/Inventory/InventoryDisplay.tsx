import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { Grid } from 'src/common/@the-source/atoms';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import utils from 'src/utils/utils';
import { useContext, useEffect, useState } from 'react';
import SettingsContext from '../../context';
import _ from 'lodash';
import { INVENTORY_COLUMNS } from './constant';
import UpdateInventoryDisplay from '../Common/Drawer/UpdateInventoryDisplay';
import { INVENTORY_ICON_META } from 'src/common/@the-source/molecules/Inventory/constants';

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
];

const initial_state = { state: false, data: null, index: 0 };

const InventoryDisplay = () => {
	const { configure, get_keys_configuration } = useContext(SettingsContext);
	const [row_data, set_row_data] = useState<any>([]);
	const [drawer, set_drawer] = useState<any>(initial_state);

	const handle_edit = (params: any) => {
		set_drawer({ state: true, data: params?.node?.data, index: params?.rowIndex });
	};

	const height = row_data?.length * 50 || 200;

	const columnDef = [...INVENTORY_COLUMNS, { ...utils.create_action_config(actions, handle_edit) }];

	const get_row_data = () => {
		const config = configure?.inventory_i_button_settings || INVENTORY_ICON_META;
		const data_temp = _.map(config, (value, key) => {
			return {
				key,
				name: value?.label,
				show: value?.show,
				entries: value?.entries,
			};
		});

		set_row_data(data_temp);
	};

	useEffect(() => {
		get_keys_configuration('inventory_i_button_settings');
	}, []);

	useEffect(() => {
		get_row_data();
	}, [configure?.inventory_i_button_settings]);

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>Inventory Display Settings</CustomText>
			</Grid>
			<Grid my={2}>
				<AgGridTableContainer
					columnDefs={columnDef}
					has_serials={false}
					hideManageColumn
					rowData={row_data}
					containerStyle={{ height: `${height + 50}px`, maxHeight: '700px', minHeight: '200px' }}
					showStatusBar={false}
				/>
			</Grid>
			{drawer?.state && <UpdateInventoryDisplay open={drawer?.state} data={drawer?.data} close={() => set_drawer(initial_state)} />}
		</Grid>
	);
};

export default InventoryDisplay;
