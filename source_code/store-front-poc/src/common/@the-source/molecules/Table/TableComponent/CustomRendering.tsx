import CustomCellRenderer from './CustomCellRenderer';
import CustomCellEditor from './CustomCellEditor';
import formatValueByDtype from '../Helpers/formatValueByDtype';
import CustomTooltip from './CustomTooltip';

interface Props {
	filterType: string;
	children?: Props[];
	headerClass?: string;
	cellRenderer: any;
	cellEditor: any;
	menuTabs?: string[];
	cellRendererParams?: { type: string; [key: string]: any };
	filter?: string | boolean;
	floatingFilter?: string | boolean;
	dtype?: string;
	cellStyle: any;
	cellEditorPopup: any;
	valueFormatter: any;
	field: string;
	type?: any;
	compositeKey?: string;
	flex?: any;
	tooltipComponent?: any;
	minWidth?: number;
	lockPosition?: boolean | string;
	hideFilter?: boolean;
	filterParams: any;
	tooltipField: any;
	headerComponentParams?: any;
}

const columnFilterLookup: { [key: string]: { filter: string | boolean; floatingFilter?: string } } = {
	text: { filter: 'agTextColumnFilter', floatingFilter: 'agTextColumnFilter' },
	imageText2: { filter: 'agTextColumnFilter', floatingFilter: 'agTextColumnFilter' },
	image: { filter: false },
	price: { filter: 'agMultiColumnFilter', floatingFilter: 'agNumberColumnFilter' },
	tag: { filter: 'agMultiColumnFilter', floatingFilter: 'agTextColumnFilter' },
	tags: { filter: 'agMultiColumnFilter', floatingFilter: 'agTextColumnFilter' },
	tags2: { filter: 'agMultiColumnFilter', floatingFilter: 'agNumberColumnFilter' },
	table: { filter: false },
	textarea: { filter: 'agMultiColumnFilter', floatingFilter: 'agTextColumnFilter' },
	date: { filter: 'agDateColumnFilter', floatingFilter: 'agDateColumnFilter' },
	singleSelect: { filter: 'agMultiColumnFilter', floatingFilter: 'agTextColumnFilter' },
	multiSelect: { filter: 'agMultiColumnFilter', floatingFilter: 'agTextColumnFilter' },
	size: { filter: 'agMultiColumnFilter', floatingFilter: 'agTextColumnFilter' },
	uom: { filter: 'agMultiColumnFilter', floatingFilter: 'agTextColumnFilter' },
	url: { filter: 'agMultiColumnFilter', floatingFilter: 'agTextColumnFilter' },
	html: { filter: 'agMultiColumnFilter', floatingFilter: 'agTextColumnFilter' },
	composition: { filter: 'agMultiColumnFilter', floatingFilter: 'agTextColumnFilter' },
	number: { filter: 'agNumberColumnFilter', floatingFilter: 'agNumberColumnFilter' },
	decimal: { filter: 'agMultiColumnFilter', floatingFilter: 'agNumberColumnFilter' },
	range: { filter: 'agMultiColumnFilter', floatingFilter: 'agNumberColumnFilter' },
	currency: { filter: 'agMultiColumnFilter', floatingFilter: 'agNumberColumnFilter' },
	status: { filter: 'agSetColumnFilter', floatingFilter: 'agTextColumnFilter' },
	internal_status: { filter: 'agSetColumnFilter', floatingFilter: 'agTextColumnFilter' },
};

const columnSSRMFilterLookup: { [key: string]: { filter: string | boolean; floatingFilter?: string; filterParams?: any } } = {
	text: { filter: 'agTextColumnFilter' },
	imageText2: { filter: 'agTextColumnFilter' },
	image: { filter: false },
	price: { filter: 'agNumberColumnFilter' },
	bulkPricing: { filter: false },
	tags: { filter: 'agSetColumnFilter' },
	tag: { filter: 'agSetColumnFilter' },
	tags2: { filter: 'agNumberColumnFilter' },
	table: { filter: false },
	textarea: { filter: 'agTextColumnFilter' },
	date: { filter: 'agDateColumnFilter' },
	unixdate: { filter: 'agDateColumnFilter' },
	singleselect: { filter: 'agSetColumnFilter' },
	singleSelect: { filter: 'agSetColumnFilter' },
	multiselect: { filter: 'agSetColumnFilter' },
	size: { filter: false },
	uom: { filter: 'agTextColumnFilter' },
	url: { filter: 'agTextColumnFilter' },
	html: { filter: 'agTextColumnFilter' },
	composition: { filter: 'agTextColumnFilter' },
	number: { filter: 'agNumberColumnFilter' },
	decimal: { filter: 'agNumberColumnFilter' },
	range: { filter: 'agNumberColumnFilter' },
	length: { filter: 'agNumberColumnFilter' },
	width: { filter: 'agNumberColumnFilter' },
	height: { filter: 'agNumberColumnFilter' },
	unit: { filter: 'agTextColumnFilter' },
	value: { filter: 'agNumberColumnFilter' },
	status: { filter: 'agSetColumnFilter' },
	internal_status: { filter: 'agSetColumnFilter' },
	currency: {
		filter: 'agNumberColumnFilter',
	},
};

const applyCustomProps = (column: Props): void => {
	const { dtype } = column;
	column.cellRenderer = column?.cellRenderer ? column.cellRenderer : CustomCellRenderer;
	column.cellEditor = column?.cellEditor ? column.cellEditor : CustomCellEditor;
	if (!column.menuTabs) column.menuTabs = ['generalMenuTab'];
	column.cellEditorPopup = true;
	column.valueFormatter = column?.valueFormatter ?? formatValueByDtype(dtype || '');
	if (dtype !== 'action') {
		column.cellStyle = { width: 200, ...column.cellStyle };
		column.minWidth = column?.minWidth ? column.minWidth : 120;
	}
	column.cellRendererParams = { type: dtype || '', ...column };
	column.tooltipComponent = CustomTooltip;
	column.headerComponentParams = {
		template: `<div class="ag-cell-label-container" role="presentation">
			<span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>
			<div ref="eLabel" class="ag-header-cell-label" role="presentation">
				<span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>
				<span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
				<span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon ag-hidden"></span>
				<span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon ag-hidden"></span>
				<span ref="eSortMixed" class="ag-header-icon ag-sort-mixed-icon ag-hidden"></span>
				<span ref="eSortNone" class="ag-header-icon ag-sort-none-icon ag-hidden"></span>
				<span ref="eSortOrder" class="ag-header-icon ag-sort-order ag-hidden"></span>
			</div>
		</div>`,
	};

	if (dtype && columnFilterLookup[dtype] && !column.filter) {
		const { filter, floatingFilter } = columnFilterLookup[dtype];
		column.filter = filter;
		column.floatingFilter = floatingFilter;
	}

	if (column.hideFilter) {
		column.filter = false;
		column.floatingFilter = false;
	}
	function getDate(value: string) {
		var dateParts = value.split('T')[0];
		var dateParts2 = dateParts.split('-');
		return new Date(Number(dateParts2[0]), Number(dateParts2[1]) - 1, Number(dateParts2[2]));
	}
	if (column.dtype === 'text') {
		column.filterParams = {
			filterOptions: ['contains', 'notContains', 'equals', 'blank', 'notBlank'],
			maxNumConditions: 1,
			...column?.filterParams,
		};
	} else if (column.dtype === 'date') {
		column.filterParams = {
			comparator: (filterDate: Date, cellValue: string) => {
				if (cellValue === null) return -1;
				return getDate(cellValue).getTime() - filterDate.getTime();
			},
			filterOptions: ['equals', 'lessThanOrEqual', 'greaterThanOrEqual', 'lessThan', 'greaterThan', 'inRange'],
			inRangeFloatingFilterDateFormat: 'D MMM YYYY',
			maxNumConditions: 1,
			...column?.filterParams,
		};
	} else if (column.dtype === 'number') {
		column.filterParams = {
			filterOptions: ['equals', 'lessThanOrEqual', 'greaterThanOrEqual', 'lessThan', 'greaterThan', 'inRange'],
			maxNumConditions: 1,
			...column?.filterParams,
		};
	}
	column.filterParams = {
		...column.filterParams,
		buttons: ['reset', 'apply'],
		closeOnApply: true,
	};
};

const applySSRMCustomProps = (column: Props): void => {
	const { dtype, compositeKey } = column;

	column.cellRenderer = column?.cellRenderer ? column.cellRenderer : CustomCellRenderer;
	column.cellEditor = column?.cellEditor ? column.cellEditor : CustomCellEditor;
	if (!column.menuTabs) column.menuTabs = ['generalMenuTab'];
	column.cellEditorPopup = true;
	column.valueFormatter = formatValueByDtype(dtype || '');
	if (dtype !== 'action') {
		column.cellStyle = { width: 200, minWidth: 200, ...column.cellStyle };
		column.minWidth = column?.minWidth ? column.minWidth : 120;
	}

	column.cellRendererParams = { type: dtype || '', ...column };
	column.tooltipComponent = CustomTooltip;
	column.headerComponentParams = {
		template: `<div class="ag-cell-label-container" role="presentation">
			<span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>
			<div ref="eLabel" class="ag-header-cell-label" role="presentation">
				<span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>
				<span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
				<span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon ag-hidden"></span>
				<span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon ag-hidden"></span>
				<span ref="eSortMixed" class="ag-header-icon ag-sort-mixed-icon ag-hidden"></span>
				<span ref="eSortNone" class="ag-header-icon ag-sort-none-icon ag-hidden"></span>
				<span ref="eSortOrder" class="ag-header-icon ag-sort-order ag-hidden"></span>
			</div>
		</div>`,
	};

	if (dtype === 'imageText2') {
		column.tooltipField = column?.field;
	}

	if (column.dtype === 'number' || column.dtype === 'currency') {
		column.filterParams = {
			filterOptions: ['equals', 'lessThanOrEqual', 'greaterThanOrEqual', 'lessThan', 'greaterThan', 'inRange'],
			...column?.filterParams,
		};
	} else if ((column.dtype === 'text' || dtype === 'imageText2') && column.filterType !== 'set') {
		column.filterParams = {
			filterOptions: ['contains', 'notContains', 'equals', 'blank', 'notBlank'],
		};
	} else if (column.dtype === 'unixdate' || column.dtype === 'date') {
		column.filterParams = {
			...column?.filterParams,
			filterOptions: ['equals', 'lessThanOrEqual', 'greaterThanOrEqual', 'lessThan', 'greaterThan', 'inRange'],
			inRangeFloatingFilterDateFormat: 'D MMM YYYY',
		};
	} else {
		column.filterParams = {
			filterOptions: ['contains'],
			...column?.filterParams,
		};
	}
	column.filterParams = {
		...column.filterParams,
		buttons: ['reset', 'apply'],
		closeOnApply: true,
		maxNumConditions: 1,
	};

	if (dtype && columnSSRMFilterLookup[dtype] && !column.filter) {
		let key = dtype;
		if (compositeKey) {
			key = compositeKey;
		}
		if (columnSSRMFilterLookup[key]) {
			const { filter } = columnSSRMFilterLookup[key];
			column.filter = filter;
		} else {
			column.filter = false;
		}
	}

	if (dtype === 'action') {
		column.minWidth = 120;
	}

	if (column.hideFilter) {
		column.filter = false;
		column.floatingFilter = false;
	}
	if (column.filterType === 'set') column.filter = 'agSetColumnFilter';
};

export const applyCustomRenderer = (columns: Props[], subColumnClass: string, parentColor: number | null = null): Props[] => {
	let alternateColorIndex = parentColor ? parentColor + 1 : 0;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const applyAlternateColor = (_col: Props): void => {
		columns.forEach((column: Props) => {
			if (column.children && column.children.length > 0) {
				column.headerClass = 'custom-group-header-color';
			}
			if (subColumnClass) {
				column.headerClass = subColumnClass;
			} else {
				// Apply the alternate color to the current column
				column.headerClass = `custom-header-color-${alternateColorIndex % 2 === 0 ? 'even' : 'odd'}`;
				alternateColorIndex++;
			}
		});
	};

	columns.forEach(applyAlternateColor);
	columns.forEach((column: Props) => {
		alternateColorIndex++;
		if (column.children && column.children.length > 0) {
			// Apply cell renderer recursively to the children columns
			applyCustomRenderer(column.children, 'sub-custom-header-color');
		} else {
			applyCustomProps(column);
		}
	});
	return columns;
};

export const applySSRMCustomRenderer = (columns: Props[], parentColor: number | null = null): Props[] => {
	let alternateColorIndex = parentColor ? parentColor + 1 : 0;

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const applyAlternateColor = (_col: Props, index: number): void => {
		columns.forEach((column: Props) => {
			if (column.children && column.children.length > 0) {
				column.headerClass = 'custom-group-header-color';
			}
			// Apply the alternate color to the current column
			column.headerClass = `custom-header-color-${alternateColorIndex % 2 === 0 ? 'even' : 'odd'}`;
			alternateColorIndex++;
		});
	};

	columns.forEach(applyAlternateColor);
	columns.forEach((column: Props) => {
		alternateColorIndex++;
		if (column.children && column.children.length > 0) {
			// Apply cell renderer recursively to the children columns
			applySSRMCustomRenderer(column.children);
		} else {
			applySSRMCustomProps(column);
		}
	});
	return columns;
};
