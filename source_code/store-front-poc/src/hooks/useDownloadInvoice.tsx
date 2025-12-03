import { useState } from 'react';

import api_requests from 'src/utils/api_requests';

const useDownloadInvoice = () => {
	const [download_loader, set_download_loader] = useState(false);

	const handle_download_invoice = (invoice_id: string) => {
		if (download_loader) return;
		set_download_loader(true);
		api_requests.order_listing
			.get_invoice(invoice_id)
			.then((res: any) => {
				if (res?.status === 200) {
					window.open(res?.data?.url, 'blank');
				}
			})
			.catch((err) => console.error(err))
			.finally(() => set_download_loader(false));
	};

	return {
		download_loader,
		set_download_loader,
		handle_download_invoice,
	};
};

export default useDownloadInvoice;
