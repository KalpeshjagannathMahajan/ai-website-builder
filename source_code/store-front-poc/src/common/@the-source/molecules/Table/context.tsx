import React from 'react';

export interface Change {
	rowIndex: number;
	colDef: any; // Replace 'any' with the actual type
	oldValue: any; // Replace 'any' with the actual type
	newValue: any; // Replace 'any' with the actual type
}

interface AgGridTableState {
	rows: any[];
	columns: any[];
	all_columns?: any[];
	set_all_columns?: React.Dispatch<React.SetStateAction<any[]>>;
	undoStack: Change[];
	redoStack: Change[];
	showFilter: boolean;
	setRows: React.Dispatch<React.SetStateAction<any[]>>;
	setColumns: React.Dispatch<React.SetStateAction<any[]>>;
	setShowFilter: React.Dispatch<React.SetStateAction<boolean>>;
	setUndoStack: React.Dispatch<React.SetStateAction<Change[]>>;
	setRedoStack: React.Dispatch<React.SetStateAction<Change[]>>;
	statusBar: any;
	gridRef: any;
	onFilterChanged: any;
	onCellChange: any;
	onError: any;
	total_rows: any;
	summary: any;
	set_total_rows: any;
	handleCellValueChanged: any;
	customRowCountName?: any;
	column_id: any;
	endRows?: any;
	gridReady?: boolean;
	setGridReady?: any;
}

const initialState: AgGridTableState = {
	rows: [] as any[],
	columns: [] as any[],
	all_columns: [] as any[],
	set_all_columns: () => {},
	undoStack: [] as Change[],
	redoStack: [] as Change[],
	showFilter: false,
	setRows: () => {},
	setColumns: () => {},
	setShowFilter: () => {},
	setUndoStack: () => {},
	setRedoStack: () => {},
	statusBar: () => {},
	gridRef: null,
	total_rows: null,
	summary: null,
	set_total_rows: () => {},
	onFilterChanged: () => {},
	onCellChange: () => {},
	onError: () => {},
	customRowCountName: null,
	column_id: null,
	handleCellValueChanged: () => {},
	endRows: null,
	gridReady: false,
	setGridReady: () => {},
};

export const AgGridTableContext = React.createContext(initialState);
