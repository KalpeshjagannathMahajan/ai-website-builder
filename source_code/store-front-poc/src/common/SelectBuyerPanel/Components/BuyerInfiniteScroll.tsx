import InfiniteScroll from 'react-infinite-scroll-component';
import { Grid } from 'src/common/@the-source/atoms';
import CircularProgressBar from 'src/common/@the-source/atoms/ProgressBar/CircularProgressBar';
import { useStyles } from '../styles';
import BuyerCards from './BuyerCards';
import BuyerCardSkeleton from './BuyerCardSkeleton';
import { useTheme } from '@mui/material/styles';

interface BuyerInfiniteScrollProps {
	is_searching: boolean;
	search_results: any;
	handle_scroll: any;
	has_more_data: boolean;
	buyer: any;
	buyer_card_show_loading: boolean;
	dashboard_page: boolean;
	dashboard_buyer: boolean;
	loading: boolean;
	selected_buyer_id: string;
	set_buyer_data: any;
	handle_buyer_change: any;
}

const BuyerInfiniteScroll = ({
	is_searching,
	search_results,
	handle_scroll,
	has_more_data,
	buyer,
	buyer_card_show_loading,
	dashboard_page,
	dashboard_buyer,
	loading,
	set_buyer_data,
	selected_buyer_id,
	handle_buyer_change,
}: BuyerInfiniteScrollProps) => {
	const classes = useStyles();
	const theme: any = useTheme();

	return !is_searching ? (
		<InfiniteScroll
			dataLength={search_results?.length}
			next={handle_scroll}
			style={{ overflow: 'none' }}
			hasMore={has_more_data}
			loader={
				has_more_data && (
					<Grid container justifyContent='center'>
						<CircularProgressBar
							style={{
								width: '50px',
								height: '50px',
								marginRight: 15,
								...theme?.select_buyer_panel?.infinite_scrollbar?.circular_progress_bar,
							}}
							variant='indeterminate'
						/>
					</Grid>
				)
			}
			scrollableTarget='scroll-infinite'>
			<div className={classes.buyer_list}>
				{search_results?.length > 0 ? (
					<BuyerCards
						search_results={search_results}
						set_buyer_data={set_buyer_data}
						buyer={buyer}
						selected_buyer_id={selected_buyer_id}
						buyer_card_show_loading={buyer_card_show_loading}
						dashboard_page={dashboard_page}
						handle_buyer_change={handle_buyer_change}
					/>
				) : (
					<BuyerCardSkeleton loading={loading} />
				)}
			</div>
		</InfiniteScroll>
	) : (
		<div className={classes.buyer_list}>
			{search_results?.length > 0 ? (
				<BuyerCards
					search_results={search_results}
					set_buyer_data={set_buyer_data}
					buyer={buyer}
					selected_buyer_id={selected_buyer_id}
					buyer_card_show_loading={buyer_card_show_loading}
					dashboard_page={dashboard_page}
					dashboard_buyer={dashboard_buyer}
					handle_buyer_change={handle_buyer_change}
				/>
			) : (
				<BuyerCardSkeleton loading={loading} />
			)}
		</div>
	);
};

export default BuyerInfiniteScroll;
