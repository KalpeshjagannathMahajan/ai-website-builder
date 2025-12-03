import _ from 'lodash';
import { memo } from 'react';
import { formatNumberWithCommas, get_formatted_price_with_currency } from 'src/utils/common';
import AnalyticsCard from './AnalyticsCard';
import RouteNames from 'src/utils/RouteNames';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
// import { success } from 'src/utils/light.theme';

interface BuyerDetails {
	name: any;
}

interface Order {
	total_value: any;
	buyer_details: BuyerDetails;
}

interface AnalyticsProps {
	total_revenue: number;
	best_buyer_revenue: any;
	best_buyer_name: any;
	total_orders: number;
	biggest_order: Order;
	total_quotes: number;
	biggest_quote: Order;
	draft_documents: number;
	draft_orders: any;
	draft_quotes: any;
	total_abandoned_cart: any;
	max_cart_value: any;
	max_cart_value_buyer: any;
}

interface AnalyticsTempProps {
	analytics: AnalyticsProps | any;
	show_details: boolean;
	show_revenue: boolean;
	footer_height: string;
	buyer_data: any;
	time_range: any;
	selectedRep: any;
	currency: string;
}

const handle_render_path = (path: any, buyer_name: any, time_range: any, sales_rep: any, buyer_id: any) => {
	const params = [];
	if (buyer_name) params.push(`buyer=${buyer_name}`);
	if (buyer_id) params.push(`buyer_id=${buyer_id}`);
	if (time_range) params.push(`date=${time_range}`);
	if (sales_rep) params.push(`sales_rep=${sales_rep}`);
	return `${path}?${params.join('&')}`;
};

const get_transformed_data = (
	analytics: AnalyticsProps,
	buyer_name: any,
	time_range: any,
	sales_rep: any,
	buyer_id: any,
	theme: any,
	currency: string,
) => {
	const transformed_analytics = [
		{
			title: 'Total revenue',
			path: handle_render_path(RouteNames.order_management.order_list.path, buyer_name, time_range, sales_rep, buyer_id),
			subtitle: get_formatted_price_with_currency(currency, analytics?.total_revenue),
			band_color: theme?.dashboard?.analytics?.total_revenue?.band_color,
			icon_name: 'IconCoins',
			icon_color: theme?.dashboard?.analytics?.total_revenue?.icon_color,
			info: {
				title: 'Best customer :',
				value: analytics?.best_buyer_revenue,
				name: analytics?.best_buyer_name,
			},
			id: 'revenue',
		},
		{
			title: 'Total orders',
			path: handle_render_path(RouteNames.order_management.order_list.path, buyer_name, time_range, sales_rep, buyer_id),
			subtitle: formatNumberWithCommas(analytics?.total_orders?.toString() || ''),
			band_color: theme?.dashboard?.analytics?.total_orders?.band_color,
			icon_name: 'IconTruckDelivery',
			icon_color: theme?.dashboard?.analytics?.total_orders?.icon_color,
			info: {
				title: 'Biggest order :',
				value: analytics?.biggest_order?.total_value,
				name: analytics?.biggest_order?.buyer_details?.name,
			},
			id: 'orders',
		},
		{
			title: 'Total quotes',
			path: handle_render_path(RouteNames.order_management.quote_list.path, buyer_name, time_range, sales_rep, buyer_id),
			subtitle: formatNumberWithCommas(analytics?.total_quotes?.toString() || ''),
			band_color: theme?.dashboard?.analytics?.total_quotes?.band_color,
			icon_name: 'IconReceipt',
			icon_color: theme?.dashboard?.analytics?.total_quotes?.icon_color,
			info: {
				title: 'Biggest quote :',
				value: analytics?.biggest_quote?.total_value,
				name: analytics?.biggest_quote?.buyer_details?.name,
			},
			id: 'quotes',
		},
		{
			title: 'Drafts',
			path: handle_render_path(RouteNames.order_management.draft_list.path, buyer_name, time_range, sales_rep, buyer_id),
			subtitle: formatNumberWithCommas(analytics?.draft_documents?.toString() || ''),
			band_color: theme?.dashboard?.analytics?.drafts?.band_color,
			icon_name: 'IconFile',
			icon_color: theme?.dashboard?.analytics?.drafts?.icon_color,
			info: {
				orders: analytics?.draft_orders,
				quotes: analytics?.draft_quotes,
				type: 'DRAFTS',
			},
			id: 'drafts',
		},
		{
			title: 'Abandoned carts',
			path: handle_render_path(RouteNames.order_management.abandoned_carts.path, buyer_name, time_range, sales_rep, buyer_id),
			subtitle: formatNumberWithCommas(analytics?.total_abandoned_cart?.toString() || ''),
			band_color: theme.all_buyer_card.image_box,
			icon_name: 'IconShoppingCart',
			icon_color: '',
			info: {
				title: 'Maximum Value:',
				value: analytics?.max_cart_value,
				name: analytics?.max_cart_value_buyer,
			},
			id: 'abandoned_carts',
		},
	];
	return transformed_analytics;
};

const AnalyticsTemp = ({
	analytics,
	show_details,
	show_revenue,
	footer_height,
	buyer_data,
	time_range,
	selectedRep,
	currency,
}: AnalyticsTempProps) => {
	const buyer_name = _.get(buyer_data, 'id') === 'all_buyers' || _.get(buyer_data, 'id') === '' ? null : _.get(buyer_data, 'name');
	const buyer_id = _.get(buyer_data, 'id') === 'all_buyers' || _.get(buyer_data, 'id') === '' ? null : _.get(buyer_data, 'id');
	const sales_rep = _.get(selectedRep, 'id') === '' ? null : _.get(selectedRep, 'id');
	const time = time_range === 'all_time' ? null : time_range;
	const search_params = new URLSearchParams();
	const theme: any = useTheme();

	if (buyer_name) search_params.append('buyer', buyer_name);
	if (buyer_id) search_params.append('buyer', buyer_id);
	if (time) search_params.append('date', time);
	if (sales_rep) search_params.append('sales_rep', sales_rep);

	const transformed_analytics = get_transformed_data(analytics, buyer_name, time, sales_rep, buyer_id, theme, currency);
	const { wizshop_abandoned_cart_enabled = false } = useSelector((state: any) => state?.settings);
	return (
		<>
			{_.map(transformed_analytics, (data: any) => {
				if (data?.id === 'abandoned_carts' && !wizshop_abandoned_cart_enabled) {
					return null;
				}
				return (
					<AnalyticsCard
						data={data}
						key={data?.title}
						show_details={show_details}
						show_revenue={show_revenue}
						footer_height={footer_height}
						currency={currency}
					/>
				);
			})}
		</>
	);
};

const Analytics = memo(AnalyticsTemp);

export default Analytics;
