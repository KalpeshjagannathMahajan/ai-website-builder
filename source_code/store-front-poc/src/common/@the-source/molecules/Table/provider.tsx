import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AgGridTableContext, Change } from '.'; // adjust the path as needed
import ResetFilterStatusBar from 'src/common/@the-source/molecules/Table/TableComponent/ResetFilterStatusBar';
import _ from 'lodash';
import CustomStatusBar from './TableComponent/CustomStatusBar';

interface AgGridTableProviderProps {
	children: React.ReactNode;
	rowData: any[];
	columnDefs: any[];
	onCellChange?: any;
	onError: any;
	columnRenderer?: any;
	customRowCountName: any;
	allColumns?: any;
	totalRows?: any;
	summary?: any;
	column_id?: any;
	get_total_rows?: any;
	endRows?: any;
}

export const AgGridTableProvider: React.FC<AgGridTableProviderProps> = ({
	children,
	rowData,
	columnDefs,
	onCellChange,
	onError,
	columnRenderer,
	customRowCountName,
	totalRows,
	summary,
	allColumns,
	column_id,
	get_total_rows,
	endRows,
}) => {
	const [rows, setRows] = useState<any[]>(rowData);
	const [columns, setColumns] = useState<any[]>(columnDefs);
	const [all_columns, set_all_columns] = useState<any[]>(allColumns);
	const [showFilter, setShowFilter] = useState(false);
	const [undoStack, setUndoStack] = useState<Change[]>([]);
	const [redoStack, setRedoStack] = useState<Change[]>([]);
	const [total_rows, set_total_rows] = useState<any>(null);
	const [gridReady, setGridReady] = useState(false);
	const gridRef = useRef<any>(null);

	useEffect(() => {
		if (rowData) {
			setRows(rowData);
		}
	}, [rowData]);

	useEffect(() => {
		if (_.isEmpty(totalRows)) {
			set_total_rows(totalRows);
		}
	}, [totalRows]);

	useEffect(() => {
		if (columnDefs) {
			let col = columnRenderer(columnDefs);

			setColumns(col);
		}
	}, [columnDefs, columnRenderer]);

	useEffect(() => {
		if (allColumns) {
			set_all_columns(allColumns);
		}
	}, [allColumns]);

	// const custom_status_bar = (params: any) => {
	// 	let total_row_data = params?.api?.getModel().getRowCount();
	// 	return (
	// 		<Typography sx={{ marginTop: 1.4, fontSize: '1.4rem', fontWeight: 400, marginRight: 1 }} variant='h6'>
	// 			{customRowCountName}: <span style={{ fontWeight: 700 }}>{total_row_data}</span>
	// 		</Typography>
	// 	);
	// };

	const statusBar = useMemo(() => {
		return {
			statusPanels: [
				{
					statusPanel: customRowCountName ? CustomStatusBar : 'agTotalRowCountComponent',
					align: 'left',
				},
				{
					statusPanel: 'agFilteredRowCountComponent',
					align: 'left',
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
				{
					statusPanel: 'agSelectedRowCountComponent',
					align: 'left',
				},
			],
		};
	}, [showFilter]);

	const onFilterChanged = useCallback(() => {
		const filterModel = gridRef?.current?.api?.getFilterModel();
		const statusBarComponent = gridRef.current.api.getStatusPanel('resetFilter');
		const shouldShowFilter = Object.keys(filterModel).length > 0 || false;
		statusBarComponent?.setVisible(shouldShowFilter);
		gridRef?.current?.api?.refreshCells({ columns: ['delete'] });
	}, []);

	const handleCellValueChanged = async (event: any) => {
		const { rowIndex, colDef, newValue } = event;
		onCellChange && onCellChange(rowIndex, colDef, newValue, event);
		// debouncedOnChange(rowIndex, colDef, newValue, event);
	};

	const value = {
		rows,
		columns,
		showFilter,
		undoStack,
		redoStack,
		setRows,
		setColumns,
		setShowFilter,
		setUndoStack,
		setRedoStack,
		statusBar,
		gridRef,
		onFilterChanged,
		onCellChange,
		onError,
		handleCellValueChanged,
		all_columns,
		total_rows,
		summary,
		set_all_columns,
		set_total_rows,
		customRowCountName,
		column_id,
		get_total_rows,
		endRows,
		gridReady,
		setGridReady,
	};

	return <AgGridTableContext.Provider value={value}>{children}</AgGridTableContext.Provider>;
};
// TODO: convert the provider to useHook
