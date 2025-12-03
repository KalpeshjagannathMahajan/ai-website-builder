import _, { isString } from 'lodash';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import AddPaymentModal from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/Drawer/AddPaymentModal';
import utils from 'src/utils/utils';

const AddEditCardComponent = () => {
	const [search_params] = useSearchParams();

	const _props = {
		access_token: search_params.get('access_token'), // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOWY5ZWExMTItMjlhYS00ZmQ5LTk3NzUtNzM3ZDVhNmNiMTkwIiwidGVuYW50X2lkIjoiMjBhOTdhNTktNzMzMS00ZmJjLWJkYzctNDRiMDU0NTY2ZWU0Iiwib3JnYW5pemF0aW9uX2lkIjoiYTMwNzBiNmUtMWNhMC00NTEwLWI3NWEtOWY3YTE2YWU3MTc5IiwiZXhwIjoxNzAzNzM5MTk0fQ.zbWMnnOkdLsDgFDrycMUwmapCzim5POuH3U0wY3N-Ps
		buyer_id: search_params.get('buyer_id'),
		customer_id: search_params.get('stax_customer_id'),
		payment_method_id: search_params.get('payment_method_id'),
		web_token: search_params.get('web_token'), // if not availavle return null
		is_visible: true,
		is_from_app: true,
		payment_source: search_params.get('source') || 'stax',
		height: `${search_params.get('modal_height')}px`,
		width: parseInt(search_params.get('modal_width') || '480'),
		is_first_payment_method: isString(search_params.get('is_first_payment_method'))
			? search_params.get('is_first_payment_method') === 'true'
			: search_params.get('is_first_payment_method'),
		is_default: _.attempt(JSON.parse, search_params.get('is_default') || 'false'),
		base_url: utils.format_base_url(decodeURIComponent(search_params.get('base_url') || '')),
		source_id: search_params.get('source_id'),
		all_address: _.attempt(JSON.parse, decodeURIComponent(search_params.get('all_address') || '') || '[]'),
		address_display_settings: _.attempt(JSON.parse, decodeURIComponent(search_params.get('address_display_settings' || '') || '[]')),
		address_country_options: _.attempt(JSON.parse, decodeURIComponent(search_params.get('address_country_options' || '') || '[]')),
		modal_width: '',
		is_clickoutside_to_close: true,
		payment_delete_permission: _.attempt(JSON.parse, search_params.get('payment_delete_permission') || 'false'),
	};
	const handle_close = () => {
		const response = {
			action: 'cancel',
		};
		window?.ReactNativeWebView?.postMessage(JSON.stringify(response));
	};

	const handle_confirm = (response: any) => {
		window?.ReactNativeWebView?.postMessage(JSON.stringify(response));
	};

	return (
		<React.Fragment>
			<AddPaymentModal {..._props} close={handle_close} handle_confirm={handle_confirm} />
		</React.Fragment>
	);
};

export default AddEditCardComponent;
