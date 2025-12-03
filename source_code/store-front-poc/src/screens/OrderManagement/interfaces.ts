export interface CollectPaymentDrawerProps {
	document_id: string;
	is_visible: boolean;
	use_credit: boolean;
	data: any;
	input_value: number;
	attributes: any;
	is_button_loading: boolean;
	active: string;
	collect_for_invoice: boolean;
	invoice_ids: any;
	email_data: any;
	close: () => void;
	set_is_payment_modal_visible: (val: boolean) => void;
	handle_add_credits: () => void;
	set_data: (val: any) => void;
	set_input_value: (val: number) => void;
	set_collect_for_invoice: (val: any) => void;
	set_attributes: (val: any) => void;
	set_is_authorised: (val: boolean) => void;
	set_active: (val: string) => void;
	handle_collect_payment: () => void;
	set_invoice_ids: (val: any) => void;
	set_use_credit: (val: boolean) => void;
	set_email_data: (val: any) => void;
	set_email_checkbox: (val: boolean) => void;
	currency: string;
}
