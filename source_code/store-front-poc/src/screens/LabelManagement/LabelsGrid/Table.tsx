/* eslint-disable */
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AgGridSSRMTableContainer } from 'src/common/@the-source/molecules/Table/table';
import api_requests from 'src/utils/api_requests';
import { Box, Button, Checkbox, Icon, Modal, Grid, TextArea } from 'src/common/@the-source/atoms';
import { useSelector } from 'react-redux';
import { AgGridTableContext } from 'src/common/@the-source/molecules/Table';
import { Alert } from '@mui/material';
import './styles.css';
import utils from 'src/utils/utils';
import LabelTableSkeleton from './LabelTableSkeleton';
import { usePapaParse } from 'react-papaparse';
import EmptyTableComponent from 'src/common/@the-source/EmptyTableComponent';
import ImageComp from './ImageComp';
import CustomText from 'src/common/@the-source/CustomText';
import { useTheme } from '@mui/material/styles';

const LabelHeader = ({ set_selected_row }: any) => {
	const { gridRef } = useContext(AgGridTableContext);
	const theme: any = useTheme();
	const areAllRowsSelected = () => {
		const currentPage = gridRef?.current?.api?.paginationGetCurrentPage();
		const pageSize = 100;
		let allSelected = true;
		let countSelected = 0;

		gridRef?.current?.api?.forEachNode((node: any) => {
			if (node.rowIndex >= currentPage * pageSize && node.rowIndex < (currentPage + 1) * pageSize) {
				if (!node.selected) {
					allSelected = false;
				} else {
					countSelected++;
				}
			}
		});

		if (allSelected) return 2;
		if (countSelected > 0) return 1;
		return 0;
	};

	const handleSelectAllClick = () => {
		const currentPage = gridRef?.current?.api?.paginationGetCurrentPage();
		// const pageSize = gridRef?.current?.api?.paginationGetPageSize();

		let currentRowsIds: any = [];

		gridRef?.current?.api?.forEachNode((node: any) => {
			if (node.rowIndex >= currentPage * 100 && node.rowIndex < (currentPage + 1) * 100) {
				currentRowsIds.push(node?.data?.id);
			}
		});

		if (areAllRowsSelected() === 2) {
			gridRef?.current?.api?.deselectAllOnCurrentPage();
			set_selected_row((prevSelectedRow: any) => {
				return prevSelectedRow.filter((id: any) => !currentRowsIds.includes(id));
			});
		} else {
			gridRef?.current?.api?.selectAllOnCurrentPage();
			set_selected_row((prevSelectedRow: any) => {
				const combined = new Set([...prevSelectedRow, ...currentRowsIds]);
				return [...combined];
			});
		}
	};
	return (
		<div
			style={{
				marginLeft: '-44px',
				position: 'absolute',
				zIndex: 1000,
			}}>
			<Box mr={2} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={handleSelectAllClick}>
				<Checkbox
					checked={areAllRowsSelected() === 2}
					indeterminate={areAllRowsSelected() === 1}
					sx={{
						color: theme?.label?.table?.checkbox?.color, // Change the color of the checkbox
					}}
				/>
			</Box>
		</div>
	);
};

export const Table = ({ set_drawer_open, selected_row, set_selected_row }: any) => {
	const { readString } = usePapaParse();
	const [columns_defs, set_columns_defs] = useState();
	const [all_columns, set_all_columns] = useState([]);
	const [is_loading, set_is_loading] = useState(false);
	const [gridApi, setGridApi] = useState<any>(null);
	const [totalData, setTotalData] = useState(0);
	const [selectedAll, setSelectedAll] = useState(false);
	const [is_modal_open, set_is_modal_open] = useState(false);
	const [bulk_ids_string, set_bulk_ids_string] = useState('');
	const [bulk_ids, set_bulk_ids] = useState([]);
	const [bulk_ids_response, set_bulk_ids_response] = useState({});
	const [show_empty, set_show_empty] = useState(false);
	const theme: any = useTheme();

	const default_filters = {};

	const default_sort: any = [{ sort: 'asc', colId: 'sku_id' }];

	const createDataSource = () => {
		return {
			getRows(params?: any) {
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

				payload.filterModel.sku_id = [
					...(filterModel.sku_id ? [filterModel.sku_id] : []),
					...(Object.keys(bulk_ids_response).length > 0 ? [bulk_ids_response] : []),
				];

				for (const key in payload.filterModel) {
					if (!Array.isArray(payload.filterModel[key])) {
						// If it's not an array, wrap it in an array
						payload.filterModel[key] = [payload.filterModel[key]];
					}
				}

				api_requests.labels
					.get_data_sources(payload)
					.then((response: any) => {
						const { data } = response;

						if (data.total === 0) set_show_empty(true);
						else set_show_empty(false);

						//filter ids
						if (Object.keys(bulk_ids_response).length > 0) {
							set_show_empty(data?.total === 0);

							gridApi?.forEachNode((node: any) => {
								if (selected_row.includes(node?.data?.id)) node.setSelected(true);
								else node.setSelected(false);
							});
						}
						params.success({
							rowData: data?.data,
							rowCount: data?.total,
							startRow: data?.startRow,
							endRow: data?.endRow,
						});

						setTotalData(data?.total);
					})
					.catch((error) => {
						console.error(error);
						params.fail();
					});
			},
		};
	};

	useEffect(() => {
		set_is_loading(true);
		api_requests.labels
			.get_specific_columns([])
			.then((res: any) => {
				set_columns_defs(res?.data);
			})
			.catch((err) => {
				console.error(err);
			})
			.finally(() => {
				set_is_loading(false);
			});

		api_requests.labels
			.get_labels_all_columns()
			.then((res: any) => {
				set_all_columns(res?.data);
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	useEffect(() => {
		const get_columns = localStorage.getItem('persist_columns');
		if (get_columns) {
			const parsedColumns = JSON.parse(get_columns);
			const columnKeys = parsedColumns?.map((column: any) => column?.key);

			api_requests.labels.get_specific_columns(columnKeys).then((res: any) => {
				set_columns_defs(res?.data);
			});
		}
	}, []);

	useEffect(() => {
		if (bulk_ids?.length > 0) {
			set_bulk_ids_response({
				filterType: 'text',
				type: 'bulk_search',
				values: bulk_ids,
			});
		}
	}, [bulk_ids]);

	const data_source = useMemo(() => createDataSource(), [bulk_ids, bulk_ids_response?.values]);

	const transformColumns = (columns: any) => {
		if (!columns) return [];

		const transformColumn = (column: any) => {
			let column_props = {};
			if (column?.key === 'media.1.url') {
				column_props = {
					sortable: false,
					minWidth: 85,
					width: 80,
					resizable: false,
					cellStyle: {
						borderRadius: '0px',
						background: 'transparent',
						borderWidth: '0px 1px 0px 0px',
						minWidth: 85,
						width: 85,
						borderColor: theme?.label?.table?.transform_column?.borderColor,
					},
					pinned: 'left',
				};
			} else if (column?.key === 'sku_id') {
				column_props = {
					minWidth: 200,
					flex: 1,
				};
			} else {
				column_props = {
					flex: 1,
					minWidth: 200,
				};
			}

			const transformedColumn = {
				...column,
				...column_props,
				headerName: column?.name,
				field: column?.key,
				dtype: column?.type,
				suppressMenu: true,
				suppressMovable: true,
			};

			if (column?.children) {
				transformedColumn.children = column?.children?.map(transformColumn);
			}

			if (transformedColumn.key === 'media.1.url') {
				return {
					...transformedColumn,
					cellRenderer: ImageComp,
				};
			}
			return transformedColumn;
		};

		return columns.map(transformColumn);
	};

	const columnDefs = [
		{
			headerCheckboxSelection: true,
			checkboxSelection: true,
			width: 50,
			minWidth: 50,
			resizable: false,
			field: '',
			headerName: '',
			cellStyle: {
				textAlign: 'center',
				width: 50,
				minWidth: 50,
				borderRadius: '0px',
				background: 'transparent',
				borderWidth: '0px 0px 0px 0px',
			},
			suppressSizeToFit: true,
			unSortIcon: true,
			pinned: 'left',
			lockPinned: true,
			visible: true,
			suppressMenu: true,
			suppressMovable: true,
		},
		{ ...utils.create_serial_number_config('S. No') },
		...transformColumns(columns_defs),
	];

	const handleSelectionChanged = (params: any) => {
		const currentPage = gridApi.paginationGetCurrentPage();

		const prevSelectedSet = new Set(selected_row);

		params.api.forEachNode((node: any) => {
			if (node.rowIndex >= currentPage * 100 && node.rowIndex < (currentPage + 1) * 100) {
				if (node.selected) {
					prevSelectedSet.add(node?.data?.id);
				} else {
					prevSelectedSet.delete(node?.data?.id);
				}
			}
		});

		set_selected_row([...prevSelectedSet]);
	};

	const getRowId = (params: any) => {
		return params.data.id;
	};

	const onConfirm = (filteredData: any) => {
		const columnKeys = filteredData?.map((column: any) => column?.key);
		set_is_loading(true);
		api_requests.labels.get_specific_columns(columnKeys).then((res: any) => {
			set_columns_defs(res?.data);
			set_is_loading(false);
		});
	};

	const default_columns = all_columns?.filter((column: any) => column?.default)?.map((column: any) => column?.name);
	const tenant_id = useSelector((state: any) => state.login.userDetails.tenant_id);

	const handlePageChanged = () => {
		if (!gridApi) return;
		//This only gets executed if not the entire page was previously selected
		gridApi?.forEachNode((node: any) => {
			if (selected_row.includes(node?.data?.id)) {
				node.setSelected(true);
			} else {
				node.setSelected(false);
			}
		});
	};

	const gridReady = useCallback(
		(params: any) => {
			params.api!.setServerSideDatasource(data_source);
			setTimeout(() => {
				if (Array.isArray(selected_row))
					selected_row.forEach((id) => {
						let rowNode = params.api.getRowNode(id);
						if (rowNode) {
							rowNode.setSelected(true);
						} else {
							console.error(`Couldn't find row with ID ${id}.`);
						}
					});
			}, 500);
		},
		[selected_row],
	);

	const clearAllSelection = () => {
		set_selected_row([]);
		if (gridApi) {
			gridApi.deselectAll();
			gridApi.setFilterModel(null);
		}
		setSelectedAll(false);
		set_bulk_ids_string('');
		set_bulk_ids_response({});
		set_show_empty(false);
		set_is_modal_open(false);
	};

	const alertMessage = () => {
		if (selected_row.length === 0 || show_empty) {
			return null;
		}

		//TODO:  Needed later
		const handleSelectAllClick = () => {
			if (gridApi) {
				gridApi.selectAll();
			}
			setSelectedAll(true);
		};

		return (
			<Alert
				icon={<Icon sx={{ mr: -1, opacity: 0.8 }} iconName='IconCircleCheck' />}
				sx={{ my: 1, width: '100%', height: '40px', display: 'flex', alignItems: 'center' }}
				severity='success'
				color='info'>
				<div style={{ display: 'flex' }}>
					<div style={{ fontWeight: 400, color: theme?.label?.table?.product_selected?.color }}>
						{selectedAll ? `All ${totalData}` : selected_row.length} Products Selected
					</div>
					<div
						onClick={clearAllSelection}
						style={{ marginLeft: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: 700, opacity: 0.8 }}>
						<Icon sx={{ mr: 0.5, opacity: 0.8 }} iconName='IconCircleX' />
						<p>Clear Selection</p>
					</div>
					{/* {!selectedAll && (
						<div onClick={handleSelectAllClick} style={{ marginLeft: 'auto', cursor: 'pointer', color: '#16885F', fontWeight: 700 }}>
							<strong>Select All {totalData} products</strong>
						</div>
					)} */}
				</div>
			</Alert>
		);
	};

	const handle_close_modal = () => {
		if (Object.keys(bulk_ids_response).length <= 0) set_bulk_ids_string('');
		set_is_modal_open(false);
	};

	const handle_change = (e: any) => {
		set_bulk_ids_string(e.target.value);
	};

	const handle_ids = () => {
		if (bulk_ids_string.trim().length === 0) {
			clearAllSelection();
			set_is_modal_open(false);
			return;
		}

		readString(bulk_ids_string.trim(), {
			worker: true,
			complete: (results) => {
				const mergedArray = results?.data.reduce((acc: any, arr: any) => {
					const trimmedArray = arr.map((val: any) => (typeof val === 'string' ? val.trim() : val));
					return acc.concat(trimmedArray);
				}, []);

				// API call using merged array to set selected_row payload endRows maximum
				const payload = {
					startRow: 0,
					endRow: 10000,
					sortModel: default_sort,
					filterModel: {
						...default_filters,
						sku_id: [{ filterType: 'text', type: 'bulk_search', values: mergedArray }],
					},
				};

				api_requests.labels
					.get_data_sources(payload)
					.then((response: any) => {
						const { data } = response;

						const ids = data?.data?.map((curr: any) => curr?.id) || [];
						set_selected_row(ids);
						set_bulk_ids(mergedArray);
					})
					.catch((error) => {
						console.error(error);
					});
			},
		});
		set_is_modal_open(false);
	};

	const handle_render_modal = () => {
		return (
			<Modal
				width={500}
				open={is_modal_open}
				onClose={handle_close_modal}
				title={'Search by SKU ID'}
				footer={
					<Grid container justifyContent='end'>
						<Button
							disabled={!Object.keys(bulk_ids_response).length}
							variant='outlined'
							sx={{ marginRight: '1rem' }}
							onClick={() => clearAllSelection()}>
							Clear
						</Button>
						<Button disabled={!bulk_ids_string} onClick={() => handle_ids()}>
							Search
						</Button>
					</Grid>
				}
				children={
					<React.Fragment>
						<CustomText type='Body'>
							Manually enter the SKUs or copy and paste them from the CSV file in order to search for the respective labels
						</CustomText>
						<TextArea
							rows={4}
							placeholder={'Enter the SKU IDs'}
							value={bulk_ids_string}
							handleChange={handle_change}
							sx={{ width: '100%', marginTop: '10px' }}
						/>
					</React.Fragment>
				}
			/>
		);
	};

	const components = useMemo(() => {
		return {
			agColumnHeader: (params: any) => {
				if (params?.column?.userProvidedColDef?.checkboxSelection) {
					return <LabelHeader set_selected_row={set_selected_row} />;
				}

				return params?.displayName;
			},
		};
	}, []);

	return (
		<Box pt={2} sx={{ position: 'relative' }}>
			{handle_render_modal()}
			{!is_loading ? (
				<React.Fragment>
					<AgGridSSRMTableContainer
						className='hide-select-all'
						hideManageColumn
						has_serials={false}
						columnDefs={columnDefs}
						rowData={[]}
						dataSource={data_source}
						containerStyle={{ height: selected_row.length > 0 ? 'calc(100vh - 200px)' : 'calc(100vh - 140px)' }}
						getRowId={getRowId}
						onSelectionChanged={handleSelectionChanged}
						onFirstDataRendered={(params) => {
							setGridApi(params.api);
						}}
						totalRows={totalData}
						showSWHeader
						allColumns={all_columns}
						onConfirm={onConfirm}
						customRowName='Total Label'
						suppressFieldDotNotation={true}
						title={<CustomText type='H2'>Labels</CustomText>}
						primaryBtn={
							<Button variant='outlined' onClick={() => set_is_modal_open(true)}>
								{Object.keys(bulk_ids_response).length > 0 && (
									<span
										style={{
											width: '8px',
											height: '8px',
											backgroundColor: theme?.label?.table?.btn?.backgroundColor,
											borderRadius: '50%',
											display: 'inline - block',
											marginRight: '10px',
										}}></span>
								)}
								Search by SKU ID
							</Button>
						}
						secondaryBtn={
							<Button onClick={() => set_drawer_open(true)} sx={{ ml: 2 }} variant='contained'>
								<Icon color={theme?.label?.table?.icon?.color} iconName='IconDownload' sx={{ mr: 1 }} /> Labels
							</Button>
						}
						alertMessage={alertMessage()}
						pinned_columns={default_columns}
						pagination
						paginationPageSize={100}
						onPaginationChanged={handlePageChanged}
						onGridReady={gridReady}
						showStatusBar={false}
						components={components}
					/>
					{show_empty && (
						<EmptyTableComponent top={'180px'} height={'calc(100vh - 350px)'}>
							<Button size='large' tonal sx={{ boxShadow: 'none' }} onClick={() => clearAllSelection()}>
								Clear Filter
							</Button>
						</EmptyTableComponent>
					)}
				</React.Fragment>
			) : (
				<LabelTableSkeleton />
			)}
		</Box>
	);
};
