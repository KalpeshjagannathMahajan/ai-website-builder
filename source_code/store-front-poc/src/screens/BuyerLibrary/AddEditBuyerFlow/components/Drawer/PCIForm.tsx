import isEmpty from 'lodash/isEmpty';
import { useEffect } from 'react';

const PCIFormRenderer = ({ pci_secrets, on_token_success }: any) => {
	const { VITE_APP_ENV } = import.meta.env;

	useEffect(() => {
		if (isEmpty(pci_secrets)) return;
		if ((window as any)?.pcd_form) {
			const form_element = document.getElementById('pcd_form');
			(window as any).pcd_form(form_element, {
				submit_secret: pci_secrets?.secret,
				submit_url: `/v1/capture/${pci_secrets?.reference}`,
				testing: VITE_APP_ENV !== 'production',
				success_callback: (result: any, data: any) => {
					on_token_success(result, data);
				},
				error_callback: (error: any, data: any) => {
					console.error(error, data);
				},
				strip_spaces: true,
				show_card: true,
			});
		}
	}, [pci_secrets]);

	return (
		<div
			id='pcd_form'
			style={{
				maxHeight: '75vh',
				overflowY: 'auto',
			}}></div>
	);
};

export default PCIFormRenderer;
