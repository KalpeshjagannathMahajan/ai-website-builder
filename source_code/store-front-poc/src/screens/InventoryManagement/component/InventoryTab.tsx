import { useContext, useMemo, useState } from 'react';
import { Avatar, Grid, Menu, Image } from 'src/common/@the-source/atoms';
import { AgGridSSRMTableContainer } from 'src/common/@the-source/molecules/Table';
import React from 'react';
import InventoryManagementContext from '../context';
import inventory from 'src/utils/api_requests/inventory';
import EmptyTableComponent from 'src/common/@the-source/EmptyTableComponent';
import './styles.css';
import { useStyles } from '../style';
import ImageLinks from 'src/assets/images/ImageLinks';
import { Entity } from 'src/@types/manage_data';
import ImportSidePanel from 'src/common/ImportSidePanel/ImportSidePanel';
import LabelTableSkeleton from 'src/screens/LabelManagement/LabelsGrid/LabelTableSkeleton';
import { useSelector } from 'react-redux';
import { PERMISSIONS } from 'src/casl/permissions';
import _ from 'lodash';
import utils from 'src/utils/utils';
import CustomText from 'src/common/@the-source/CustomText';

const InventoryTab = () => {
	const classes = useStyles();
	const { all_columns, handle_get_column_def, loading, start_import, set_start_import, menu_options, handle_click } =
		useContext(InventoryManagementContext);
	const default_columns = all_columns?.filter((column: any) => column?.default)?.map((column: any) => column?.name);

	const [rows, set_rows] = useState<number>(0);
	const [show_empty, set_show_empty] = useState<boolean>(false);

	const permissions = useSelector((state: any) => state?.login?.permissions);
	const import_export = permissions.find((item: any) => item.slug === PERMISSIONS?.import_export?.slug);

	const default_filters = {};

	const transformData = (data: any) => {
		return data.map((item: any) => {
			return {
				...item,
				'inventory.backorder_allowed': item['inventory.backorder_allowed'] ? 'Yes' : 'No',
				'inventory.inventory_tracking_enabled': item['inventory.inventory_tracking_enabled'] ? 'Yes' : 'No',
				'inventory.inventory_status':
					item['inventory.inventory_status'] === 'OUT_OF_STOCK'
						? 'Out of stock'
						: item['inventory.inventory_status'] === 'BACKORDER'
						? 'Back order'
						: 'In stock',
			};
		});
	};

	const transformFilterModel = (filterModel: any) => {
		let updatedFilterModel = _.cloneDeep(filterModel);

		// Iterate over the keys in the filter model
		for (let key in updatedFilterModel) {
			if (updatedFilterModel?.hasOwnProperty(key)) {
				const filter = updatedFilterModel?.[key];

				// Check if the filter has values and if it's an array
				if (filter?.values && Array.isArray(filter?.values)) {
					filter.values = filter?.values.map((value: any) => {
						if (value === 'Yes') return true;
						if (value === 'No') return false;
						if (value === 'Out of stock') return 'OUT_OF_STOCK';
						if (value === 'In stock') return 'IN_STOCK';
						if (value === 'Back order') return 'BACKORDER';
						return value; // Return the value as is if it's neither "Yes" nor "No"
					});
				}

				if (_.get(updatedFilterModel, key)?.filterType === 'date') {
					const { dateFrom, dateTo, type } = _.get(updatedFilterModel, key);
					const { from, to } = utils.getRange(dateFrom, dateTo, type);
					_.set(updatedFilterModel, key, {
						filterType: 'number',
						type: 'inRange',
						filter: from,
						filterTo: to,
					});
				}
			}
		}

		return updatedFilterModel;
	};

	const createDataSource = () => {
		return {
			getRows(params?: any) {
				const { startRow, sortModel, endRow, filterModel } = params.request;

				const sortData = sortModel?.length > 0 ? sortModel : [];

				const transformedFilterModel = transformFilterModel(filterModel);

				const payload = {
					startRow,
					endRow,
					sortModel: sortData,
					filterModel: {
						...default_filters,
						...transformedFilterModel,
					},
				};
				inventory
					.get_inventory_post(payload)
					.then((response: any) => {
						const { data } = response;
						const newData = transformData(data?.data);
						params.success({
							rowData: newData,
							rowCount: data?.total,
							startRow: data?.startRow,
							endRow: data?.endRow,
						});
						set_rows(data?.total);
						set_show_empty(data?.total === 0);
					})
					.catch((error) => {
						console.error(error);
						params.fail();
					});
			},
		};
	};

	const data_source = useMemo(() => createDataSource(), []);

	const getRowStyle = (params: any) => {
		if (params?.data?.['inventory.inventory_tracking_enabled'] === 'No') {
			return { opacity: 0.5 };
		}
		return {};
	};

	return (
		<Grid>
			{!loading ? (
				<React.Fragment>
					<AgGridSSRMTableContainer
						rowData={[]}
						customRowName='Total Products'
						totalRows={rows}
						columnDefs={handle_get_column_def()}
						dataSource={data_source}
						showStatusBar
						showSWHeader
						hideManageColumn
						title={<CustomText type='H2'>Inventory</CustomText>}
						primaryBtn={
							import_export?.toggle && (
								<Avatar
									className={classes.commonStyle}
									style={{ margin: '0rem' }}
									isImageAvatar={false}
									content={
										<Menu
											LabelComponent={
												<Image style={{ cursor: 'pointer' }} src={ImageLinks.icon_import_export} width='25px' height='25px' />
											}
											menu={menu_options}
											onClickMenuItem={handle_click}
											closeOnItemClick={true}
										/>
									}
									size='large'
									variant='circular'
								/>
							)
						}
						suppressFieldDotNotation={true}
						allColumns={all_columns}
						showSWHeaderStyle={{
							margin: '1.6rem 0rem',
						}}
						containerStyle={{ height: 'calc(100vh - 15rem)' }}
						pinned_columns={default_columns}
						getRowStyle={getRowStyle}
					/>
					{show_empty && <EmptyTableComponent top={'22rem'} height={'calc(100vh - 300px)'} children={undefined} width='95%' />}
				</React.Fragment>
			) : (
				<LabelTableSkeleton />
			)}
			{start_import && (
				<ImportSidePanel entity={Entity.Inventory} show_drawer={start_import} entity_ids={[]} toggle_drawer={set_start_import} />
			)}
		</Grid>
	);
};

export default InventoryTab;
