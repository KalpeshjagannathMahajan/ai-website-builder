import { find, head } from 'lodash';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { update_catalog } from 'src/actions/buyer';
import { update_catalog_data, update_catalog_data_loader } from 'src/actions/catalog';
import { set_price_lists_data } from 'src/actions/catalog_mode';
import { update_linked_catalog, update_linked_catalog_data } from 'src/actions/linked_catalog';
import catalogs from 'src/utils/api_requests/catalog';

export default function usePricelistActions() {
	const buyer = useSelector((state: any) => state?.buyer);
	const login = useSelector((state: any) => state?.login);

	const dispatch = useDispatch();

	const get_selected_or_default = (data: any) => {
		return (
			head(data?.filter((_p: any) => _p?.value === buyer?.buyer_info?.pricelist)) ||
			head(data?.filter((_p: any) => _p?.is_default === true))
		);
	};

	const update_catalogs_everywhere = (data: any) => {
		dispatch(set_price_lists_data(data)); // being used in catalog mode
		const _selected: any = get_selected_or_default(data);

		dispatch<any>(update_linked_catalog({ label: _selected?.label, value: _selected?.value }));
		if (buyer?.catalog?.value === '' || buyer?.catalog?.label === '') {
			dispatch<any>(update_catalog({ catalog: { value: _selected?.value, label: _selected?.label } }));
		}
	};

	const get_catalogs = async () => {
		try {
			dispatch<any>(update_catalog_data_loader({ loader: true }));
			const { status_code, data }: any = await catalogs.get_catalog_list();
			if (status_code === 200) {
				dispatch<any>(update_catalog_data({ catalog_data: data }));
				dispatch<any>(update_catalog_data_loader({ loader: false }));
				update_catalogs_everywhere(data);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const get_linked_catalog = async () => {
		try {
			const { status_code, data }: any = await catalogs.get_catalog_list(buyer?.buyer_id);

			if (status_code === 200) {
				dispatch(update_linked_catalog_data({ linked_catalog_data: data }));
				const default_catalog = find(data, (_p: any) => _p?.is_default === true);
				dispatch(update_linked_catalog({ label: default_catalog?.label, value: default_catalog?.value }));
			}
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		if (!login.status.loggedIn) return;
		get_catalogs();
		if (!buyer?.is_guest_buyer) get_linked_catalog();
	}, [login.status.loggedIn, buyer?.catalog, buyer?.buyer_id, buyer?.is_guest_buyer]);
}
