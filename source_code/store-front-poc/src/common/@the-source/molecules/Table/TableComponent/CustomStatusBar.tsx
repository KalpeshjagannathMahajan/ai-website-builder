import { useContext, useEffect, useState } from 'react';
import { AgGridTableContext } from '../context';
import { Typography } from 'src/common/@the-source/atoms';

function CustomStatusBar(params: any) {
	const [total_rows, set_total_rows] = useState(null);

	const { rows, customRowCountName, get_total_rows } = useContext<any>(AgGridTableContext);

	function getFilteredData() {
		const displayedRowCount = params?.api.getDisplayedRowCount();
		const filteredRowData: any = [];
		params?.api.forEachNodeAfterFilter((node: any) => {
			filteredRowData.push(node.data);
		});
		set_total_rows(displayedRowCount);
		if (get_total_rows) get_total_rows(displayedRowCount);
	}

	useEffect(() => {
		if (rows) {
			set_total_rows(rows?.length);
		}

		params.api.addEventListener('filterChanged', () => {
			getFilteredData();
		});
	}, [params?.api, rows]);

	return (
		<Typography sx={{ marginTop: 1.4, fontSize: '1.4rem', fontWeight: 400, marginRight: 1 }} variant='h6'>
			{customRowCountName}: <span style={{ fontWeight: 700 }}>{total_rows}</span>
		</Typography>
	);
}

export default CustomStatusBar;
