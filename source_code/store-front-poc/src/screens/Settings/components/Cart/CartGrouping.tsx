import { Alert, Divider } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Box, Grid, Icon, Switch } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import SettingsContext from '../../context';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import { table_column_def } from './helper';
import utils from 'src/utils/utils';
import GroupingDrawer from './GroupingDrawer';
import { isEmpty } from 'lodash';
import classes from '../../Settings.module.css';
import { useTheme } from '@mui/material/styles';
import { default_cart_grouping } from '../../utils/defaultSettings/cart/cart_grouping';

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
];

const CartGrouping = () => {
	const [grouping_data, set_grouping_data] = useState<any>({});
	const [row_data, set_row_data] = useState([]);
	const [open_drawer, set_open_drawer] = useState<boolean>(false);
	const [edit_data, set_edit_data] = useState<any>({});
	const { configure, update_configuration, get_keys_configuration } = useContext(SettingsContext);
	const theme: any = useTheme();

	const handle_edit = (params: any) => {
		set_edit_data(params?.node?.data);
		set_open_drawer(true);
	};

	const handle_toggle_grouping = (value: boolean) => {
		const payload = {
			...grouping_data,
			enabled: value,
		};

		update_configuration('cart_grouping_config', payload);
	};

	const handle_add_default = () => {
		const payload = configure?.cart_grouping_config || default_cart_grouping;
		update_configuration('cart_grouping_config', payload);
	};

	const columnDef = [...table_column_def, utils.create_action_config(actions, handle_edit)];

	useEffect(() => {
		get_keys_configuration('cart_grouping_config');
	}, []);

	useEffect(() => {
		if (configure?.cart_grouping_config) {
			set_row_data(configure?.cart_grouping_config?.options || []);
			set_grouping_data(configure?.cart_grouping_config || {});
		}
	}, [configure?.cart_grouping_config]);

	return (
		<Box p={3}>
			<Grid>
				<CustomText type='H3'>Grouping settings</CustomText>
			</Grid>
			<Divider sx={{ my: 2 }} />

			{isEmpty(configure?.cart_grouping_config) ? (
				<Grid mt={2}>
					<Alert
						severity={'warning'}
						icon={
							<Icon className={classes.icon_style} sx={{ color: theme?.settings?.import_export?.color }} iconName='IconAlertTriangle' />
						}
						className={classes.alert_style}
						sx={{
							border: `1px solid ${theme?.settings?.import_export?.color || 'transparent'}`,
						}}>
						<CustomText type='Body' color={theme?.settings?.import_export?.text}>
							Oops! It looks like the cart grouping configuration is missing. Click{' '}
							<span onClick={handle_add_default} style={theme?.settings?.import_export?.span}>
								here
							</span>{' '}
							to generate the default configuration.
						</CustomText>
					</Alert>
				</Grid>
			) : (
				<Box mt={2} p={2} sx={{ background: '#F0F6FF', borderRadius: '12px' }}>
					<Grid container>
						<Grid item xs={11}>
							<CustomText style={{ marginBottom: '8px' }} type='Subtitle'>
								Enable grouping on cart
							</CustomText>
							<CustomText type='Body2'>
								This enables you to see products in your cart in separate groups based on inventory, category or custom groups
							</CustomText>
						</Grid>
						<Grid item xs={1}>
							<Switch checked={configure?.cart_grouping_config?.enabled} onChange={() => handle_toggle_grouping(!grouping_data?.enabled)} />
						</Grid>
					</Grid>
				</Box>
			)}

			<Box mt={2}>
				<AgGridTableContainer columnDefs={columnDef} rowData={row_data} showStatusBar={false} />
			</Box>

			{open_drawer && (
				<GroupingDrawer
					open={open_drawer}
					set_open={set_open_drawer}
					data={edit_data}
					set_data={set_edit_data}
					grouping_data={grouping_data}
					update_configuration={update_configuration}
				/>
			)}
		</Box>
	);
};

export default CartGrouping;
