import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ViewCardDetails from 'src/screens/BuyerLibrary/ViewBuyer/components/ViewCardDetails';

const ViewCardComponent = () => {
	const [search_params] = useSearchParams();

	const _props = {
		access_token: search_params.get('access_token'),
		payment_method_id: search_params.get('payment_method_id'),
		web_token: search_params.get('web_token'), // if not availavle return null
		show_modal: true,
		is_from_app: true,
		height: `${search_params.get('modal_height')}px`,
		width: parseInt(search_params.get('modal_width') || '480'),
		modal_width: '',
		is_clickoutside_to_close: true,
	};
	const handle_close = () => {
		const response = {
			action: 'cancel',
		};
		(window as any)?.ReactNativeWebView?.postMessage(JSON.stringify(response));
	};

	return (
		<React.Fragment>
			<ViewCardDetails {..._props} on_close={handle_close} />
		</React.Fragment>
	);
};

export default ViewCardComponent;
