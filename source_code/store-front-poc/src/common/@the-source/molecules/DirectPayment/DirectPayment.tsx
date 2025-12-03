import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import DirectPaymentModal from 'src/screens/Dashboard/components/DirectPaymentModal';
import utils from 'src/utils/utils';

const DirectPayment = () => {
	const [search_params] = useSearchParams();
	const currency = useSelector((state: any) => state?.settings?.currency);

	const _props = {
		access_token: search_params.get('access_token') || '', // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiOWY5ZWExMTItMjlhYS00ZmQ5LTk3NzUtNzM3ZDVhNmNiMTkwIiwidGVuYW50X2lkIjoiMjBhOTdhNTktNzMzMS00ZmJjLWJkYzctNDRiMDU0NTY2ZWU0Iiwib3JnYW5pemF0aW9uX2lkIjoiYTMwNzBiNmUtMWNhMC00NTEwLWI3NWEtOWY3YTE2YWU3MTc5IiwiZXhwIjoxNzAzNzM5MTk0fQ.zbWMnnOkdLsDgFDrycMUwmapCzim5POuH3U0wY3N-Ps
		height: `${search_params.get('modal_height')}px`,
		width: parseInt(search_params.get('modal_width') || '480'),
		base_url: utils.format_base_url(decodeURIComponent(search_params.get('base_url') || '')),
		is_clickoutside_to_close: true,
		payment_config: JSON.parse(search_params.get('payment_config') || '{}'),
		environment: search_params.get('environment'),
		form_data: JSON.parse(search_params.get('form_data') || '{}'),
	};

	const handle_complete = (response: any) => {
		window?.ReactNativeWebView?.postMessage(JSON.stringify(response));
	};
	return (
		<DirectPaymentModal
			is_modal_visible={true}
			payment_config={_props.payment_config}
			is_from_app={true}
			access_token={_props.access_token}
			height={_props.height}
			width={_props.width}
			base_url={_props.base_url}
			environment={_props.environment || ''}
			handle_complete={handle_complete}
			currency={currency}
			form_data={_props?.form_data || {}}
		/>
	);
};

export default DirectPayment;
