import BuyerCard from '../BuyerCard';

interface BuyerCardProps {
	search_results: any;
	set_buyer_data: any;
	selected_buyer_id: any;
	buyer_card_show_loading: any;
	dashboard_page: boolean;
	buyer: any;
	dashboard_buyer?: any;
	handle_buyer_change: any;
}

const BuyerCards = ({
	search_results,
	set_buyer_data,
	selected_buyer_id,
	buyer_card_show_loading,
	dashboard_page,
	buyer,
	dashboard_buyer = {},
	handle_buyer_change,
}: BuyerCardProps) => {
	return (
		<>
			{search_results?.map((buyers: any) => {
				const is_selected = !dashboard_page ? buyers?.id === buyer?.buyer_id : buyers?.id === dashboard_buyer?.id;
				return (
					<BuyerCard
						buyer={buyers}
						key={buyers?.id}
						set_buyer_data={set_buyer_data}
						selected={is_selected}
						selected_buyer_id={selected_buyer_id}
						buyer_card_show_loading={buyer_card_show_loading}
						handle_buyer_change={handle_buyer_change}
					/>
				);
			})}
		</>
	);
};

export default BuyerCards;
