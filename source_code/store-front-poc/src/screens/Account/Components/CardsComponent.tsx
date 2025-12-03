import { Grid, Pagination } from 'src/common/@the-source/atoms';
import { OrderCard } from './OrderCard';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import order_listing from 'src/utils/api_requests/orderListing';
import _ from 'lodash';
import React from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { useTheme } from '@mui/material/styles';
import EmptyTableComponent from 'src/common/@the-source/EmptyTableComponent';
import MyOrdersSkeleton from 'src/screens/OrderManagement/component/Common/MyOrdersSkeleton';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
	customCardStyle: {
		paddingTop: '1rem',
		gap: '12px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'stretch',
	},
}));

const CardsComponent = () => {
	const classes = useStyles();
	const [_page, set_page] = useState(0);
	const [pages, set_pages] = useState(0);
	const [nbhits, set_nbhits] = useState(0);
	const [data, set_data] = useState<any>([]);
	const [is_loading, set_is_loading] = useState(true);
	const [searchParams]: any = useSearchParams();
	const theme: any = useTheme();

	const scrollToTop = () => {
		const rootContainer = document.getElementById('account-container') as HTMLElement | null;
		if (rootContainer) {
			rootContainer.scrollIntoView({ behavior: 'smooth' });
		}
	};

	const get_products = useCallback(async () => {
		try {
			const hits_per_page = 15;
			const current_page = parseInt(searchParams?.get('page')) || 1;
			const startRow = (current_page - 1) * hits_per_page;
			const endRow = startRow + hits_per_page;
			const payload = {
				startRow,
				endRow,
				sortModel: [],
				filterModel: {},
			};
			const response: any = await order_listing.get_document_list(payload);

			if (_.get(response, 'status') === 200) {
				const { data: all_hits = [], total: total_hits = 0 } = response?.data || {};
				const total_pages = Math.ceil(total_hits / hits_per_page);

				set_data(all_hits);
				set_page(current_page);
				set_nbhits(all_hits.length);
				set_pages(total_pages);
				set_is_loading(false);
				let newUrl = `?page=${current_page}`;
				window.history.replaceState({ path: newUrl }, '', newUrl);
				scrollToTop();
			}
		} catch (error) {
			console.error(error);
			set_is_loading(false);
			set_data([]);
		}
	}, []);

	const handle_page_change = (e: any, pg: any) => {
		set_is_loading(true);
		searchParams?.set('page', pg);
		set_page(pg);
		scrollToTop();
		get_products();
	};

	useEffect(() => {
		get_products();
	}, []);

	return (
		<React.Fragment>
			{is_loading ? (
				<MyOrdersSkeleton />
			) : !_.isEmpty(data) ? (
				<>
					{!is_loading && <CustomText style={{ margin: '16px 4px', ...theme?.order_count_gap }}>Showing {nbhits} orders</CustomText>}
					{nbhits > 0 && (
						<>
							<Grid className={classes.customCardStyle} spacing={1.6} columns={{ xs: 12, sm: 12, md: 12, lg: 15, xl: 15 }}>
								{_.map(data, (_data: any) => (
									<OrderCard key={_data?.id} data={_data} />
								))}
							</Grid>
							{pages > 1 && (
								<Grid p={1} mx='auto' my={1} display='flex' justifyContent='center'>
									<Pagination
										count={pages}
										page={_page}
										onChange={handle_page_change}
										sx={{ margin: '2px' }}
										size='small'
										siblingCount={0}
										boundaryCount={1}
									/>
								</Grid>
							)}
						</>
					)}
				</>
			) : (
				<EmptyTableComponent top={'130px'} height={'calc(100vh - 275px)'} />
			)}
		</React.Fragment>
	);
};

export default CardsComponent;
