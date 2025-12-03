import AccountContext from '../context';
import { Grid, Skeleton } from 'src/common/@the-source/atoms';
import { AgGridSSRMTableContainer } from 'src/common/@the-source/molecules/Table';
import CustomText from 'src/common/@the-source/CustomText';
import { useContext } from 'react';
import EmptyTableComponent from 'src/common/@the-source/EmptyTableComponent';
import TableSkeleton from 'src/common/TableSkeleton';
import React from 'react';
import { useTheme } from '@mui/material/styles';

export const Invoices = () => {
	const theme: any = useTheme();
	const { data_source, total_rows, summary, row_data, is_loading, document_config, convert_to_new_structure, count_loading } =
		useContext(AccountContext);

	return (
		<Grid my='16px' sx={{ position: 'relative' }}>
			{count_loading ? (
				<Skeleton variant='text' width='150px' sx={{ margin: '16px 4px' }} />
			) : (
				<CustomText style={{ margin: '16px 4px', ...theme?.order_count_gap }}>Showing {total_rows} invoices</CustomText>
			)}
			{!is_loading ? (
				<React.Fragment>
					<AgGridSSRMTableContainer
						showSWHeader={false}
						rowData={[]}
						totalRows={total_rows}
						summary={summary}
						endRows={row_data}
						columnDefs={convert_to_new_structure(document_config)}
						dataSource={data_source}
						containerStyle={{ height: 'calc(100vh - 170px)' }}
						suppressFieldDotNotation={true}
						showStatusBar={false}
						rowStyle={{ 'max-height': '50px', ...theme?.account_border_style }}
					/>
					{!count_loading && total_rows === 0 && <EmptyTableComponent top={'35px'} height={'calc(100vh - 275px)'} />}
				</React.Fragment>
			) : (
				<TableSkeleton />
			)}
		</Grid>
	);
};
