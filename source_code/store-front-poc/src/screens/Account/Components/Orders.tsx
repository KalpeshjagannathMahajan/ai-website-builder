import AccountContext from '../context';
import { Grid, Skeleton } from 'src/common/@the-source/atoms';
import { AgGridSSRMTableContainer } from 'src/common/@the-source/molecules/Table';
import CustomText from 'src/common/@the-source/CustomText';
import { useContext } from 'react';
import EmptyTableComponent from 'src/common/@the-source/EmptyTableComponent';
import React from 'react';
import TableSkeleton from 'src/common/TableSkeleton';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import CardsComponent from './CardsComponent';
import ReviewCartModal from './ReviewCartModal';
import QuickViewDrawer from './QuickViewDrawer';

export const Orders = () => {
	const theme: any = useTheme();
	const {
		data_source,
		total_rows,
		summary,
		row_data,
		is_loading,
		document_config,
		convert_to_new_structure,
		count_loading,
		review_modal,
		set_review_modal,
		handle_reorder_flow,
		isview,
		set_isview,
		set_success_toast,
		re_order_loading,
	} = useContext(AccountContext);
	const is_small_screen = useMediaQuery(theme.breakpoints.down('sm'));

	if (!count_loading && total_rows === 0) {
		return (
			<Grid my='16px' sx={{ position: 'relative' }}>
				<EmptyTableComponent top={'35px'} height={'calc(100vh - 275px)'} table_type={'order_table'} />
			</Grid>
		);
	}

	return (
		<React.Fragment>
			{is_small_screen ? (
				<CardsComponent />
			) : (
				<Grid my='16px' sx={{ position: 'relative' }}>
					{count_loading ? (
						<Skeleton variant='text' width='150px' sx={{ margin: '16px 4px' }} />
					) : (
						<CustomText style={{ margin: '16px 4px', ...theme?.order_count_gap }}>Showing {total_rows} orders</CustomText>
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
						</React.Fragment>
					) : (
						<TableSkeleton />
					)}
				</Grid>
			)}
			{isview?.state && (
				<QuickViewDrawer
					drawer={isview?.state}
					on_close={() => set_isview({ state: false, data: null })}
					data={isview?.data}
					set_success_toast={set_success_toast}
				/>
			)}
			{review_modal?.state && (
				<ReviewCartModal
					open={review_modal?.state}
					data={review_modal?.data}
					on_close={() => set_review_modal({ state: false, data: null })}
					onSubmit={handle_reorder_flow}
					loading={re_order_loading?.loading}
				/>
			)}
		</React.Fragment>
	);
};
