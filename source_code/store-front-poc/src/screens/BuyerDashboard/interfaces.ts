export interface AddCreditsDrawerProps {
	is_visible: boolean;
	payment_config: any;
	buyer_id: string;
	document_id: string;
	active: string;
	selected_payment_method_id: any;
	data: any;
	input_value: number;
	attributes: any;
	is_button_loading: boolean;
	saved_payment_methods: any;
	order_info: string;
	from: string;
	email_data: any;
	handle_add_credit: () => void;
	set_payment_email_modal: (val: boolean) => void;
	set_payment_email_payload: (val: any) => void;
	set_is_modal_open: (val: boolean) => void;
	close: () => void;
	set_is_payment_modal_visible: (val: boolean) => void;
	set_customer_id: (val: string) => void;
	set_data: (val: any) => void;
	set_attributes: (val: any) => void;
	set_saved_payment_methods: (val: any) => void;
	set_selected_payment_method_id: (val: string) => void;
	set_input_value: (val: number) => void;
	set_active: (val: string) => void;
	set_order_info: (val: string) => void;
	set_email_data: (val: any) => void;
	set_email_checkbox: (val: boolean) => void;
	currency: string;
}

export interface RefundPaymentCompProps {
	document_id: string;
	is_visible: boolean;
	payment_ids: any;
	selected_option: string;
	reason: string;
	data: any;
	input_value: number;
	is_button_loading: boolean;
	close: () => void;
	set_data: (val: any) => void;
	set_input_value: (val: number) => void;
	set_payment_ids: (val: any) => void;
	set_reason: (val: string) => void;
	update_selected_option: (val: string) => void;
	currency: string;
}
