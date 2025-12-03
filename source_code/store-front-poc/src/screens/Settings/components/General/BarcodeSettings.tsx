import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid } from 'src/common/@the-source/atoms';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import utils from 'src/utils/utils';
import { BARCODE } from './mock';
import AddEditBarcodeDrawer from '../Common/Drawer/AddEditBarcodeDrawer';
import { useContext, useEffect, useState } from 'react';
import SettingsContext from '../../context';
import _ from 'lodash';

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
	{
		name: 'Delete',
		action: 'delete',
		icon: 'IconTrash',
		key: 'delete',
	},
];

const BarcodeSettings = () => {
	const { configure, get_keys_configuration, get_attributes, update_configuration } = useContext(SettingsContext);
	const [attributes, set_attributes] = useState<any>([]);
	const [drawer, set_drawer] = useState<any>({ state: false, data: null, index: 0 });

	const handle_edit = (params: any, key: string) => {
		if (key === 'edit') {
			set_drawer({ state: true, data: params?.node?.data, index: params?.rowIndex });
		} else {
			let updated_barcodes = _.cloneDeep(configure?.barcode_scanner_settings);
			_.pullAt(updated_barcodes, params?.rowIndex);
			update_configuration('barcode_scanner_settings', updated_barcodes);
		}
	};

	const get_products = async () => {
		const res: any = await get_attributes('product');
		let temp: any = [];
		if (res) {
			temp = _.map(res, (att: any) => ({
				value: `transformed_attributes.${att?.id}`,
				label: att?.name,
			}));
		}
		set_attributes(temp);
	};

	const rowData = _.map(configure?.barcode_scanner_settings, (barcode: any) => ({
		...barcode,
		is_default: barcode?.is_default ?? false,
	}));
	const height = rowData?.length * 50;
	const should_disable_button = (data: any, key: string) => key === 'delete' && data?.is_default && rowData?.length > 1;

	const handle_get_column_config = () => {
		const table_config = _.map(BARCODE?.TABLE_CONFIG, (item) => {
			if (item?.headerName === 'Logic Type') {
				return {
					...item,
					cellRenderer: (params: any) => {
						const value = params?.value === 'sku_id' ? '--' : _.find(attributes, ['value', params?.node?.data?.filter_logic?.key])?.label;

						return value;
					},
				};
			} else {
				return item;
			}
		});
		return [...table_config, { ...utils.create_action_config(actions, handle_edit), cellRendererParams: { should_disable_button } }];
	};
	const columnDef = handle_get_column_config();

	useEffect(() => {
		get_keys_configuration('barcode_scanner_settings');
		get_products();
	}, []);

	const show_add_button = _.isEmpty(configure?.barcode_scanner_settings);

	return (
		<Grid className={classes.content}>
			<Grid className={classes.content_header}>
				<CustomText type='H2'>Barcode Settings</CustomText>
			</Grid>
			<Grid my={2}>
				<AgGridTableContainer
					columnDefs={columnDef}
					has_serials={false}
					hideManageColumn
					rowData={rowData}
					containerStyle={{ height: `${height + 50}px`, maxHeight: '700px', minHeight: '200px' }}
					showStatusBar={false}
					suppressFieldDotNotation
				/>
			</Grid>
			{show_add_button && (
				<Button variant='text' onClick={() => set_drawer({ state: true, data: null, index: configure?.barcode_scanner_settings?.length })}>
					+ Add new barcode type
				</Button>
			)}
			{drawer?.state && (
				<AddEditBarcodeDrawer
					is_visible={true}
					data={drawer?.data}
					close={() => set_drawer({ state: false, data: null, index: 0 })}
					options={attributes}
					barcodes_list={configure?.barcode_scanner_settings || []}
					index={drawer?.index}
				/>
			)}
		</Grid>
	);
};

export default BarcodeSettings;
