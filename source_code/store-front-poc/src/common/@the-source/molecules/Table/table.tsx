/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useMemo, useEffect } from 'react';
import { Avatar, Button, Icon } from '../../atoms';
import { AgGridReact } from 'ag-grid-react';
import _ from 'lodash';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './Styles.css';
import { Box, Grid, Typography, Tooltip } from '@mui/material';
import { AgGridTableContext } from './context';
import { AgGridTableProvider } from '.';
import { GridReadyEvent } from 'ag-grid-community';
import { applyCustomRenderer, applySSRMCustomRenderer } from './TableComponent/CustomRendering';
import { MyDataContext } from '../ManageColumns/context';
import ManageColumn from '../ManageColumns/ManageColumn';
import CustomLeftStatusBar from './TableComponent/CustomLeftStatusBar';
import ResetFilterStatusBar from 'src/common/@the-source/molecules/Table/TableComponent/ResetFilterStatusBar';
import CustomRightStatusBar from './TableComponent/CustomRightStatusBar';
import ImageLinks from 'src/assets/images/ImageLinks';
import { useTheme } from '@mui/material/styles';
const { VITE_APP_REPO } = import.meta.env;
const is_ultron = VITE_APP_REPO === 'ultron';

type AgGridTableProps = {
	rowData: any[];
	columnDefs: any;
	containerStyle?: Object;
	tableId?: string;
	showSWHeader?: boolean;
	endRows?: any;
	onCellChange?: any;
	onError?: any; // TODO: Implement Error Handling Functionality
	hideDefaultBodyStyle?: boolean;
	dataSource?: any;
	onSelectionChanged?: (event: any) => void;
	onGridReady?: (event: GridReadyEvent) => void;
	getRowId?: (params: any) => string;
	suppressFieldDotNotation?: boolean;
	allColumns?: any;
	onConfirm?: any;
	totalRows?: any;
	summary?: any;
	column_id?: any;
	onFirstDataRendered?: (params: any) => void;
	customRowName?: string;
	title?: string | React.ReactNode;
	primaryBtn?: React.ReactNode;
	secondaryBtn?: React.ReactNode;
	has_serials?: boolean;
	pinned_columns?: any;
	hideManageColumn?: boolean;
	get_total_rows?: any;
	pagination?: boolean;
	paginationPageSize?: number;
	gridOptions?: any;
	onPaginationChanged?: (event: any) => void;
	children?: React.ReactNode;
	alertMessage?: string | React.ReactNode;
	showStatusBar?: boolean;
	components?: any;
	getRowStyle?: any;
	className?: string;
	onRowDragEnd?: any;
	showSWHeaderStyle?: any;
	rowStyle?: any;
	onDragStopped?: any;
	onFilterChanged?: any;
	cacheBlockSize?: number;
	onColumnPinned?: (event: any) => void;
};

const commonStyle = {
	marginLeft: '1rem',
	backgroundColor: '#F7F8F8',
	cursor: 'pointer',
	boxShadow: '0px 0px 12px 1px rgba(0, 0, 0, 0.06)',
};

const tootip_style = {
	width: '40px',
	height: '40px',
	backgroundColor: 'white',
	borderRadius: '50%',
	padding: 0,
	border: '1px solid rgba(0, 0, 0, 0.06)',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	cursor: 'pointer',
};

const TableImportExport = () => {
	return (
		<Avatar
			style={commonStyle}
			isImageAvatar={false}
			content={<Icon color='black' iconName='IconCloudUpload' sx={{ fontSize: 20 }} />}
			size='large'
			variant='circular'
		/>
	);
};

export const TableManageColumns = () => {
	const context_value = useContext(MyDataContext);

	const set_open_manage_column = context_value?.set_open_manage_column;
	const handle_manage_column_click = () => {
		if (set_open_manage_column) {
			set_open_manage_column(true);
		}
	};

	return (
		<Avatar
			style={commonStyle}
			isImageAvatar={false}
			content={<Icon onClick={handle_manage_column_click} color='black' iconName='IconLayoutSidebar' sx={{ fontSize: 20 }} />}
			size='large'
			variant='circular'
		/>
	);
};

const TableBulkEdit = () => {
	return (
		<Button sx={{ marginLeft: '1rem' }}>
			<Icon iconName='IconEdit' color='inherit' sx={{ marginRight: '8px' }} /> Edit
		</Button>
	);
};

const AgGridTable: React.FC<AgGridTableProps> = ({
	containerStyle,
	tableId,
	showSWHeader,
	onSelectionChanged,
	onGridReady,
	getRowId,
	primaryBtn,
	secondaryBtn,
	title,
	onRowDragEnd,
	showStatusBar = true,
	onDragStopped,
	alertMessage,
	onFirstDataRendered,
	onFilterChanged: onFilterChangedProp,
}) => {
	const { rows, columns, gridRef, statusBar, onFilterChanged, handleCellValueChanged } = useContext(AgGridTableContext);

	let tableStyle = {
		height: '100%',
		width: '100%',
	};

	if (!_.isEmpty(containerStyle)) {
		tableStyle = { ...tableStyle, ...containerStyle };
	}

	useEffect(() => {
		const loadCss = async () => {
			if (is_ultron) {
				await import('./UltronStyles.css');
			} else {
				await import('./StoreStyles.css');
			}
		};
		loadCss();
	}, []);

	const defaultColDef = useMemo(
		() => ({
			cellClassRules: {
				'cell-red': (params: any) => {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { colDef, value } = params;
					const { field } = colDef;
					return false;

					if (field === 'delete' || field === 'image') {
						return false;
					}
					if (field === 'action') {
						return false;
					}
					// const { errors = {} } = rowData;
					if (!value || value?.length === 0) {
						return true;
					} else {
						return false;
					}
				},
			},
		}),
		[],
	);

	const gridOptions = {
		icons: {
			filter: `<img height='30px' src="${ImageLinks.custom_filter_icon}" />`,
		},
	};

	const handleFilterChanged = (params: any) => {
		onFilterChanged(params);
		if (onFilterChangedProp) {
			onFilterChangedProp(params);
		}
	};

	return (
		<Grid id={tableId ? tableId : 'myGrid'} style={tableStyle} className='ag-theme-alpine'>
			{showSWHeader ? (
				<Grid className='sw-aggrid-header'>
					{title}
					<Grid display='flex'>
						{/* <TableManageColumns /> */}
						{primaryBtn ? (
							primaryBtn
						) : (
							<>
								<Avatar
									style={commonStyle}
									isImageAvatar={false}
									content={<Icon color='black' iconName='IconRefresh' sx={{ fontSize: 20 }} />}
									size='large'
									variant='circular'
								/>
								<TableImportExport />
								<TableBulkEdit />
							</>
						)}
						{secondaryBtn}
					</Grid>
				</Grid>
			) : null}
			{alertMessage}
			<AgGridReact
				ref={gridRef}
				rowData={rows}
				onRowDragEnd={onRowDragEnd}
				columnDefs={columns}
				defaultColDef={defaultColDef}
				enableRangeSelection={true}
				statusBar={showStatusBar ? statusBar : null}
				onFilterChanged={handleFilterChanged}
				rowSelection={'multiple'}
				rowDragManaged={true}
				gridOptions={gridOptions}
				onSelectionChanged={onSelectionChanged}
				onGridReady={onGridReady}
				getRowId={getRowId}
				onCellValueChanged={(e) => {
					if (e?.source === 'edit') {
					} else {
						handleCellValueChanged;
					}
				}}
				onCellEditingStopped={handleCellValueChanged}
				suppressColumnVirtualisation={true}
				suppressRowClickSelection={true}
				headerHeight={40}
				suppressDragLeaveHidesColumns={true}
				animateRows={true}
				groupHeaderHeight={40}
				floatingFiltersHeight={40}
				rowHeight={50}
				tooltipShowDelay={0}
				tooltipHideDelay={1000}
				onDragStopped={onDragStopped}
				onFirstDataRendered={onFirstDataRendered}
			/>
		</Grid>
	);
};

export const AgGridTableContainer: React.FC<AgGridTableProps> = ({
	rowData,
	columnDefs,
	containerStyle,
	tableId,
	showSWHeader,
	onCellChange,
	onError,
	hideDefaultBodyStyle,
	onSelectionChanged,
	onGridReady,
	getRowId,
	customRowName,
	has_serials,
	primaryBtn,
	secondaryBtn,
	title,
	get_total_rows,
	onRowDragEnd,
	showStatusBar,
	onDragStopped,
	alertMessage,
	onFirstDataRendered,
	onFilterChanged,
}) => {
	const newColDefs = [
		...(has_serials
			? [
					{
						headerName: '',
						valueGetter: 'node.rowIndex + 1',
						pinned: 'left',
						lockPinned: true,
						width: 50,
						dtype: 'number',
						sortable: false,
						hideFilter: true,
						cellStyle: {
							minWidth: 50,
						},
					},
			  ]
			: []),
		...columnDefs,
	];
	return (
		<AgGridTableProvider
			columnRenderer={applyCustomRenderer}
			rowData={rowData}
			customRowCountName={customRowName}
			columnDefs={newColDefs}
			onCellChange={onCellChange}
			onError={onError}
			get_total_rows={get_total_rows}>
			<div className={hideDefaultBodyStyle ? '' : 'default-table-body-style'}>
				<AgGridTable
					showStatusBar={showStatusBar}
					onRowDragEnd={onRowDragEnd}
					rowData={rowData}
					columnDefs={columnDefs}
					containerStyle={containerStyle}
					tableId={tableId}
					title={title}
					showSWHeader={showSWHeader}
					primaryBtn={primaryBtn}
					secondaryBtn={secondaryBtn}
					onSelectionChanged={onSelectionChanged}
					onGridReady={onGridReady}
					getRowId={getRowId}
					onDragStopped={onDragStopped}
					alertMessage={alertMessage}
					onFirstDataRendered={onFirstDataRendered}
					onFilterChanged={onFilterChanged}
				/>
			</div>
		</AgGridTableProvider>
	);
};

const AgGridSSRMTable: React.FC<AgGridTableProps> = ({
	containerStyle,
	tableId,
	showSWHeader,
	dataSource,
	suppressFieldDotNotation = false,
	onSelectionChanged,
	getRowId,
	allColumns,
	onConfirm,
	onGridReady,
	customRowName,
	onFirstDataRendered,
	title,
	primaryBtn,
	secondaryBtn,
	pinned_columns,
	hideManageColumn,
	column_id,
	pagination = false,
	paginationPageSize,
	onPaginationChanged,
	alertMessage,
	showStatusBar = true,
	components,
	getRowStyle,
	className,
	showSWHeaderStyle,
	rowStyle = {},
	onDragStopped,
	cacheBlockSize,
	onColumnPinned,
}) => {
	const { columns, setColumns, gridRef, onFilterChanged, handleCellValueChanged, showFilter, gridReady, setGridReady } =
		useContext(AgGridTableContext);
	const theme: any = useTheme();

	const _getRowStyle = (params: any) => {
		let temp: any = {};
		if (getRowStyle) {
			temp = getRowStyle(params);
		}
		return { ...temp, 'border-radius': theme?.table_?.borderRadius };
	};

	useEffect(() => {
		if (!is_ultron && gridReady) {
			const agRootWrapper: any = document.querySelector('.ag-root-wrapper');
			const agHeaders: any = document.querySelector('.ag-header');
			const custom_header_even_color: any = document.querySelectorAll('.custom-header-color-even');
			const custom_header_odd_color: any = document.querySelectorAll('.custom-header-color-odd');
			if (agRootWrapper) {
				agRootWrapper.style.setProperty('border-radius', theme?.table_?.borderRadius);
				agRootWrapper.style.setProperty('font-family', theme?.table_?.fontFamily, 'important');
			}

			if (agHeaders) {
				agHeaders.style.setProperty('border-radius', theme?.table_?.borderRadius);
			}
			custom_header_even_color.forEach((element: any) => {
				element.style.setProperty('background-color', theme?.table_?.header_background || '', 'important');
			});

			custom_header_odd_color.forEach((element: any) => {
				element.style.setProperty('background-color', theme?.table_?.header_background || '', 'important');
			});
		}
	}, [gridReady]);

	const handle_grid_ready = (params: any) => {
		setGridReady(true);
		onGridReady && onGridReady(params);
	};

	useEffect(() => {
		const loadCss = async () => {
			if (is_ultron) {
				await import('./UltronStyles.css');
			} else {
				await import('./StoreStyles.css');
			}
		};
		loadCss();
	}, []);

	const context_value = useContext(MyDataContext);
	const open_manage_column = context_value?.open_manage_column;
	const set_open_manage_column = context_value?.set_open_manage_column;

	const handle_event = () => {
		let tempData = gridRef.current.columnApi.getAllGridColumns();

		const updatedColumns = columns.map((column) => ({ ...column }));

		// Create a map to store the column objects by their field value for easier access
		const columnMap: { [key: string]: any } = {};
		updatedColumns.forEach((column) => {
			columnMap[column.field] = column;
		});

		// Iterate through tempData and update the corresponding properties in the columns
		tempData.forEach((temColumn: any) => {
			const { colId, pinned } = temColumn;
			const columnToUpdate = columnMap[colId];

			if (columnToUpdate) {
				// Update only existing properties in the columnToUpdate object
				if (typeof pinned !== 'undefined') {
					columnToUpdate.pinned = pinned;
				}
				// Add other properties to update as needed
			}
		});

		// Maintain the order of columns based on tempData
		const updated_aggrid = tempData.map((item: any, index: number) => {
			if (item.originalParent && item.originalParent.children.length > 1) {
				return {
					// Define properties for cases where originalParent has children
					item: item.originalParent.colGroupDef,
					// Add other properties as needed...
				};
			} else {
				const { pinned } = item;
				let style;
				if (index > 0) {
					style = { autoSize: true, width: 200 };
				}
				return {
					// Define properties based on the value of "item"
					item: { ...item.userProvidedColDef, pinned, cellStyle: { ...item.cellStyle, width: 200 }, ...style },
					// Add other properties as needed...
				};
			}
		});

		// Use a Set to ensure unique elements directly, avoiding duplicates
		const obsData = Array.from(new Set(updated_aggrid.map((item: any) => item.item)));
		setColumns(obsData);
	};

	const handle_manage_column_click = () => {
		if (set_open_manage_column) {
			set_open_manage_column(true);
		}
		handle_event();
	};
	const handle_close_manage_column = () => {
		if (set_open_manage_column) {
			set_open_manage_column(false);
		}
	};

	let tableStyle = {
		height: '100%',
		width: '100%',
	};

	if (!_.isEmpty(containerStyle)) {
		tableStyle = { ...tableStyle, ...containerStyle };
	}

	const defaultColDef = useMemo(
		() => ({
			resizable: true,
			sortable: true,
			floatingFilter: true,
			cellClassRules: {
				'cell-red': (params: any) => {
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
					const { colDef, value } = params;
					const { field } = colDef;

					if (field === 'delete') {
						return false;
					}
					// const { errors = {} } = rowData;
					if (!value || value?.length === 0) {
						return true;
					} else {
						return false;
					}
				},
			},
		}),
		[],
	);

	const gridOptions: any = {
		icons: {
			filter: `<img height='30px' src="${ImageLinks.custom_filter_icon}" />`,
		},
		statusBar: {
			statusPanels: showStatusBar
				? [
						{
							statusPanel: customRowName ? CustomLeftStatusBar : 'agTotalRowCountComponent',
							align: 'left',
						},
						{
							statusPanel: CustomRightStatusBar,
							align: 'right',
						},
						{
							statusPanel: ResetFilterStatusBar,
							key: 'resetFilter',
							align: 'left',
							statusPanelParams: {
								filterModel: gridRef?.current?.api?.getFilterModel(),
								showFilter,
							},
						},
				  ]
				: null,
		},
	};
	return (
		<Grid id={tableId ? tableId : 'myGrid'} style={tableStyle} className='ag-theme-alpine ssrm-table'>
			{showSWHeader ? (
				<Grid className='sw-aggrid-header' style={showSWHeaderStyle}>
					{title}
					<Grid display='flex' ml={'auto'} mt={0.3}>
						{/* <Avatar
							style={commonStyle}
							isImageAvatar={false}
							content={<Icon color='black' iconName='IconRefresh' sx={{ fontSize: 20 }} />}
							size='large'
							variant='circular'
						/>
						<TableImportExport /> */}
						{!hideManageColumn && (
							<Tooltip arrow title={<Typography sx={{ fontSize: '12px', fontWeight: 700 }}>Manage columns</Typography>} placement='bottom'>
								<Box
									sx={tootip_style}
									onClick={() => {
										handle_manage_column_click();
									}}>
									<Icon iconName='IconLayoutSidebarRight' sx={{ fontSize: 20 }} />
								</Box>
							</Tooltip>
						)}
						{primaryBtn}

						{/* <TableBulkEdit /> */}
						{secondaryBtn}
					</Grid>
				</Grid>
			) : null}
			{alertMessage}
			<AgGridReact
				serverSideDatasource={dataSource}
				ref={gridRef}
				columnDefs={columns}
				defaultColDef={defaultColDef}
				enableRangeSelection={true}
				onFilterChanged={onFilterChanged}
				rowSelection={'multiple'}
				onCellValueChanged={handleCellValueChanged}
				// suppressColumnVirtualisation={true}
				suppressRowClickSelection={true}
				suppressFieldDotNotation={suppressFieldDotNotation}
				headerHeight={40}
				groupHeaderHeight={40}
				floatingFiltersHeight={40}
				rowHeight={is_ultron ? 50 : 58}
				rowStyle={rowStyle}
				suppressDragLeaveHidesColumns={true}
				// cacheBlockSize={100}
				gridOptions={gridOptions}
				rowModelType='serverSide'
				serverSideStoreType='partial'
				onGridReady={handle_grid_ready}
				tooltipShowDelay={0}
				tooltipHideDelay={1000}
				animateRows={true}
				onSelectionChanged={onSelectionChanged}
				getRowId={getRowId}
				onFirstDataRendered={onFirstDataRendered}
				pagination={pagination}
				paginationPageSize={paginationPageSize}
				onPaginationChanged={onPaginationChanged}
				components={components}
				getRowStyle={_getRowStyle}
				onColumnPinned={onColumnPinned}
				className={className}
				onDragStopped={onDragStopped}
				cacheBlockSize={cacheBlockSize}
			/>
			<ManageColumn on_close={handle_close_manage_column} pinned_columns={pinned_columns} onConfirm={onConfirm} />
		</Grid>
	);
};

export const AgGridSSRMTableContainer: React.FC<AgGridTableProps> = ({
	rowData,
	columnDefs,
	containerStyle,
	tableId,
	showSWHeader,
	onCellChange,
	onError,
	hideDefaultBodyStyle,
	dataSource,
	suppressFieldDotNotation,
	onSelectionChanged,
	getRowId,
	allColumns,
	onConfirm,
	onGridReady,
	totalRows,
	summary,
	onFirstDataRendered,
	customRowName,
	title,
	primaryBtn,
	endRows,
	secondaryBtn,
	has_serials,
	pinned_columns,
	hideManageColumn,
	column_id,
	pagination,
	paginationPageSize,
	gridOptions,
	onPaginationChanged,
	children,
	alertMessage,
	showStatusBar,
	components,
	getRowStyle,
	className,
	showSWHeaderStyle,
	rowStyle,
	onDragStopped,
	cacheBlockSize,
	onColumnPinned,
}) => {
	// TODO: Run Filters
	const newColDefs = [
		...(has_serials
			? [
					{
						headerName: '',
						valueGetter: 'node.rowIndex + 1',
						pinned: 'left',
						lockPinned: true,
						lockPosition: true,
						width: 60,
						minWidth: 60,
						dtype: 'number',
						sortable: false,
						hideFilter: true,
						cellStyle: {
							minWidth: 60,
							width: 60,
						},
					},
			  ]
			: []),
		...columnDefs,
	];

	return (
		<AgGridTableProvider
			columnRenderer={applySSRMCustomRenderer}
			rowData={rowData}
			columnDefs={newColDefs}
			onCellChange={onCellChange}
			customRowCountName={customRowName}
			onError={onError}
			totalRows={totalRows}
			summary={summary}
			column_id={column_id}
			endRows={endRows}
			allColumns={allColumns}>
			{children}
			<div className={hideDefaultBodyStyle ? '' : 'default-table-body-style'}>
				<AgGridSSRMTable
					hideManageColumn={hideManageColumn}
					rowData={rowData}
					columnDefs={columnDefs}
					containerStyle={containerStyle}
					tableId={tableId}
					customRowName={customRowName}
					showSWHeader={showSWHeader}
					dataSource={dataSource}
					column_id={column_id}
					showSWHeaderStyle={showSWHeaderStyle}
					suppressFieldDotNotation={suppressFieldDotNotation}
					onSelectionChanged={onSelectionChanged}
					getRowId={getRowId}
					allColumns={allColumns}
					onConfirm={onConfirm}
					onGridReady={onGridReady}
					onFirstDataRendered={onFirstDataRendered}
					title={title}
					primaryBtn={primaryBtn}
					secondaryBtn={secondaryBtn}
					pinned_columns={pinned_columns}
					pagination={pagination}
					paginationPageSize={paginationPageSize}
					gridOptions={gridOptions}
					onPaginationChanged={onPaginationChanged}
					alertMessage={alertMessage}
					showStatusBar={showStatusBar}
					components={components}
					getRowStyle={getRowStyle}
					className={className}
					rowStyle={rowStyle}
					onDragStopped={onDragStopped}
					cacheBlockSize={cacheBlockSize}
					onColumnPinned={onColumnPinned}
				/>
			</div>
		</AgGridTableProvider>
	);
};
