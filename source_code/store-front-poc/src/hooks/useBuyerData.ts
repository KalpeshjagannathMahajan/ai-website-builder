import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { set_buyer } from 'src/actions/buyer';
import { Buyer } from 'src/screens/BuyerDashboard/components/BuyerInterface';
import buyerManagement from 'src/utils/api_requests/buyer';
import useCatalogActions from './useCatalogActions';
import RouteNames from 'src/utils/RouteNames';

export const useBuyerData = (buyer_id?: string, fetch_buyer = true) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { handle_reset_catalog_mode } = useCatalogActions();

	const [buyer_data_loading, set_buyer_data_loading] = useState(true);
	const [buyer_data, set_buyer_data] = useState<Buyer>();
	const [order_btn_loading, set_order_btn_loading] = useState(false);

	const handle_fetch_buyer_data = async () => {
		if (!buyer_id) return;
		try {
			const response: any = await buyerManagement.get_buyer_dashboard(buyer_id);
			return response;
		} catch (error) {
			throw error;
		}
	};

	const handle_create_order = async (set_success_toast?: (data: any) => any) => {
		if (order_btn_loading) return;
		set_order_btn_loading(true);
		if ((buyer_data?.id ?? buyer_id) !== 'all_buyers') {
			dispatch<any>(
				set_buyer({
					buyer_id: buyer_data?.id ?? buyer_id,
					is_guest_buyer: false,
					callback: () => {
						set_order_btn_loading(false);
						navigate(RouteNames.product.all_products.path);
					},
					fail_callback: () => {
						set_order_btn_loading(false);
						set_success_toast &&
							set_success_toast({
								open: true,
								title: 'Something went wrong',
								subtitle: 'Please try again',
								state: 'error',
							});
					},
				}),
			);
		} else {
			set_order_btn_loading(false);
			navigate(RouteNames.product.all_products.path);
		}
		handle_reset_catalog_mode();
	};

	useEffect(() => {
		if (!fetch_buyer) {
			set_buyer_data_loading(false);
			return;
		}
		set_buyer_data_loading(true);
		handle_fetch_buyer_data()
			.then((response) => {
				set_buyer_data(response?.data || {});
			})
			.catch(() => {})
			.finally(() => {
				set_buyer_data_loading(false);
			});
	}, [buyer_id, fetch_buyer]);

	return {
		buyer_data,
		set_buyer_data,
		handle_fetch_buyer_data,
		handle_create_order,
		order_btn_loading,
		buyer_data_loading,
	};
};
