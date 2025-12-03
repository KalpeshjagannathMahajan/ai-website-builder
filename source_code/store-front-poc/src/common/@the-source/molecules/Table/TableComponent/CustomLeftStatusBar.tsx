import { useContext } from 'react';
import { AgGridTableContext } from '../context';
import { Typography } from 'src/common/@the-source/atoms';
import { formatNumberWithCommas } from 'src/utils/common';

const CustomLeftStatusBar = () => {
	const { total_rows, customRowCountName } = useContext(AgGridTableContext);

	return (
		<div className='ag-status-name-value'>
			<Typography sx={{ fontSize: '1.4rem', fontWeight: 400, marginRight: 1 }} variant='h6'>
				{customRowCountName}: <span style={{ fontWeight: 700 }}>{formatNumberWithCommas(total_rows ?? 0)}</span>
			</Typography>
		</div>
	);
};

export default CustomLeftStatusBar;
