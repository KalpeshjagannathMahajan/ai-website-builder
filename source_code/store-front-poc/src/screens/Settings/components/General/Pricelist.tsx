import { useContext, useEffect, useState } from 'react';
import { Button, Grid } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import utils from 'src/utils/utils';
import SettingsContext from '../../context';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import classes from '../../Settings.module.css';
import { pricelistColumDef } from './mock';
import AddEditPricelist from '../Common/Drawer/AddEditPricelist';

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
];

const Pricelist = () => {
	const [drawer, set_drawer] = useState<any>({ state: false, data: null });
	const { configure, get_keys_configuration, post_configs } = useContext(SettingsContext);
	const handle_edit = (params: any) => {
		set_drawer({ state: true, data: params?.node?.data });
	};

	const column_def = [...pricelistColumDef, { ...utils.create_action_config(actions, handle_edit, 'Actions') }];

	const rowData = configure?.pricelist || [];

	const height = rowData?.length * 50;

	const handle_save = (values: any) => {
		if ('is_active' in values) {
			values.status = values?.is_active ? 'active' : 'inactive';
			delete values.is_active;
		}

		let url = 'pricelist';

		if (values?.id) {
			url = `${url}/${values?.id}`;
		}
		post_configs(url, values);
	};

	useEffect(() => {
		get_keys_configuration('pricelist');
	}, []);

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header} mb={2}>
				<CustomText type='H2'>Pricelist</CustomText>
			</Grid>
			<AgGridTableContainer
				columnDefs={column_def}
				hideManageColumn
				rowData={rowData}
				containerStyle={{ height: `${height + 100}px`, minHeight: '200px', maxHeight: '700px' }}
				showStatusBar={false}
			/>
			<Grid mt={3}>
				<Button variant='text' onClick={() => set_drawer({ state: true, data: null })}>
					+ Add new
				</Button>
			</Grid>

			{drawer?.state && (
				<AddEditPricelist
					is_visible={drawer?.state}
					data={drawer?.data}
					close={() => set_drawer({ state: false, data: null })}
					handle_save={handle_save}
				/>
			)}
		</Grid>
	);
};

export default Pricelist;
