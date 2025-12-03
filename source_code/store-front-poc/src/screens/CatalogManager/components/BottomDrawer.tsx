/* eslint-disable @typescript-eslint/no-shadow */
import { Avatar, Box, Button, Grid, Icon, Menu, Image } from 'src/common/@the-source/atoms';
import { AgGridSSRMTableContainer } from 'src/common/@the-source/molecules/Table';
import { useTranslation } from 'react-i18next';
import { commonStyle } from '../mock/constant';
import { useEffect, useMemo, useState } from 'react';
import TableSkeleton from 'src/common/TableSkeleton';
import api_requests from 'src/utils/api_requests';
import utils from 'src/utils/utils';
import { Container, Drawer, Typography } from '@mui/material';
import { colors } from 'src/utils/light.theme';
import ImageLinks from 'src/assets/images/ImageLinks';
import { useDispatch } from 'react-redux';
import { Entity } from 'src/@types/manage_data';
import { set_notification_feedback } from 'src/actions/notifications';
import ImportSidePanel from 'src/common/ImportSidePanel/ImportSidePanel';
import { useNavigate } from 'react-router-dom';
import RouteNames from 'src/utils/RouteNames';
import Can from 'src/casl/Can';
import { PERMISSIONS } from 'src/casl/permissions';
import ImageComp from 'src/screens/LabelManagement/LabelsGrid/ImageComp';

interface BottomSheetProps {
	title: string;
	open_drawer: boolean;
	on_close: () => void;
	catalog_id: string;
	is_edit?: boolean;
}

interface IRenderContent {
	selected_catalog_id: string;
	is_edit: boolean;
}

const RenderContent: React.FC<IRenderContent> = ({ selected_catalog_id, is_edit }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [product_columns, set_product_columns] = useState<any[]>([]);
	const [bottom_sheet_loading, set_bottom_sheet_loading] = useState<boolean>(true);
	const [product_total_rows, set_product_total_rows] = useState<number>(0);
	const [start_import, set_start_import] = useState<boolean>(false);
	const default_sort: any = [];
	const default_filters = {};

	const dispatch = useDispatch();
	// const { selected_catalog_id } = useContext(CatalogManagementContext);

	useEffect(() => {
		api_requests.catalogs
			.get_products_columns()
			.then((res: any) => {
				const data: any = Object.values(res).filter((column: any) => typeof column === 'object' && column.key);
				if (Array.isArray(data)) {
					set_product_columns(data);
				} else {
					console.error('Invalid response format for columns_defs');
				}
			})
			.catch((err) => {
				console.error(err);
			})
			.finally(() => {
				set_bottom_sheet_loading(false);
			});
	}, []);

	const transformColumns = (columns: any) => {
		if (!columns) return [];
		const transformColumn = (column: any) => {
			let column_props = {};
			const transformedColumn = {
				...column,
				...column_props,
				sortable: column?.isSortable,
				hideFilter: !column?.isFilterable,
				headerName: column?.name,
				unSortIcon: true,
				field: column?.key,
				dtype: column?.name === 'Price' ? 'currency' : column?.type,
				type: column?.name === 'Price' ? 'currency' : column?.type,
				suppressMenu: true,
				suppressMovable: true,
			};

			if (column?.children) {
				transformedColumn.children = column?.children?.map(transformColumn);
			}

			if (transformedColumn.key === 'media.1.url') {
				return {
					...transformedColumn,
					minWidth: 85,
					width: 80,
					resizable: false,
					cellStyle: {
						minWidth: 85,
						width: 85,
					},
					cellRenderer: ImageComp,
				};
			}

			return transformedColumn;
		};

		return columns.map(transformColumn);
	};

	const handle_render_col_def = () => {
		const columnDefs = transformColumns(product_columns);
		columnDefs.unshift(utils.create_serial_number_config());
		return columnDefs;
	};

	const createProductDataSource = () => {
		return {
			getRows(params: any) {
				const { startRow, sortModel, endRow, filterModel } = params.request;

				const sortData = sortModel?.length > 0 ? sortModel : default_sort;

				const payload = {
					startRow,
					endRow,
					sortModel: sortData,
					filterModel: {
						...default_filters,
						...filterModel,
					},
				};
				api_requests.catalogs
					.get_product_data_sources(payload, selected_catalog_id)
					.then((response: any) => {
						const { data, total, startRow, endRow } = response?.data;
						params.success({
							rowData: data,
							rowCount: total,
							startRow,
							endRow,
						});
						set_product_total_rows(total);
					})
					.catch((error) => {
						console.error(error);
						params.fail();
					});
			},
		};
	};

	const product_data_source = useMemo(() => createProductDataSource(), []);

	const menu_options = [
		{ value: 'import', label: 'Import Catalog' },
		{ value: 'export', label: 'Export Catalog' },
	];

	const handle_export = async () => {
		try {
			await api_requests.manage_data.export_module(Entity.Catalog, [selected_catalog_id as string]);
			dispatch(set_notification_feedback(true));
		} catch (error) {
			console.log(error);
		}
	};

	const handle_import = () => {
		set_start_import(true);
	};

	const handle_click = (event: string) => {
		if (event === 'Import Catalog') {
			handle_import();
		} else {
			handle_export();
		}
	};

	const handle_edit_click = () => {
		navigate(`${RouteNames.catalog.edit.routing_path}/${selected_catalog_id}`);
	};

	return (
		<Box m={1.5}>
			<ImportSidePanel
				entity={Entity.Catalog}
				show_drawer={start_import}
				entity_ids={[selected_catalog_id as string]}
				toggle_drawer={() => {
					set_start_import((prev) => !prev);
				}}
			/>
			<Container maxWidth='xl'>
				{!bottom_sheet_loading ? (
					<AgGridSSRMTableContainer
						has_serials={false}
						hideManageColumn={true}
						columnDefs={handle_render_col_def()}
						rowData={[]}
						// showStatusBar={false}
						totalRows={product_total_rows}
						dataSource={product_data_source}
						containerStyle={{ height: 'calc(100% - 10rem)' }}
						customRowName='Total Products'
						showSWHeader
						suppressFieldDotNotation={true}
						title={''}
						primaryBtn={
							<Can I={PERMISSIONS.edit_catalog.slug} a={PERMISSIONS.edit_catalog.permissionType}>
								<Avatar
									style={commonStyle}
									isImageAvatar={false}
									content={
										<Menu
											btnStyle={{ border: 'none' }}
											LabelComponent={
												<Image style={{ cursor: 'pointer' }} src={ImageLinks.icon_import_export} width='25px' height='25px' />
											}
											menu={menu_options}
											onClickMenuItem={(e: any) => handle_click(e)}
											closeOnItemClick={true}
										/>
									}
									size='large'
									variant='circular'
								/>
							</Can>
						}
						secondaryBtn={
							<Grid>
								<Can I={PERMISSIONS.edit_catalog.slug} a={PERMISSIONS.edit_catalog.permissionType}>
									{!is_edit && <Button onClick={handle_edit_click}>{t('CatalogManager.BottomSheet.Header.Button')}</Button>}
								</Can>
							</Grid>
						}
					/>
				) : (
					<TableSkeleton />
				)}
			</Container>
		</Box>
	);
};

const BottomSheet: React.FC<BottomSheetProps> = ({ on_close = () => {}, open_drawer, title, catalog_id, is_edit = false }) => {
	return (
		<>
			<Drawer anchor='bottom' open={open_drawer} onClose={on_close}>
				<Box sx={{ background: colors.grey_600, height: 'calc(100vh - 50px)' }}>
					<Box sx={{ background: 'white' }}>
						<Grid container alignItems='stretch' pt={2.5} pl={6}>
							<Grid item>
								<Typography sx={{ fontSize: '18px', fontWeight: 700 }}>{title}</Typography>
							</Grid>
							<Grid item ml='auto' mr={2} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
								<Icon sx={{ cursor: 'pointer' }} onClick={on_close} iconName='IconX' color='#676D77' />
							</Grid>
						</Grid>
						<Box sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)', py: 1 }} />
					</Box>

					<RenderContent selected_catalog_id={catalog_id} is_edit={is_edit} />
				</Box>
			</Drawer>
		</>
	);
};

export default BottomSheet;
