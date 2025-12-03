export const extra_form_fields = {
	default_billing_address: 'default_billing_address',
	default_shipping_address: 'default_shipping_address',
};

export const multi_select_keys = {
	sales_reps: 'sales_reps',
	catalog_group: 'catalog_group',
};

export const basic_details_keys = ['display_name', 'company_name', 'sales_reps', 'catalog_group'];

export const preferences_keys = ['payment_mode', 'payment_terms'];
export const named_keys = ['salutation', 'first_name', 'last_name'];
export const payment_stepper_steps = [
	{
		label: 'Address',
	},
	{
		label: 'Card details',
	},
];
export const stepper_fields_gateways = ['worldpay', 'cybersource'];
export const payment_attributes = {
	card_number: 'card_number',
	cvv: 'cvv',
	expiry: 'expiry',
};

export const payment_gateways = {
	FINIX: 'finix',
	WORLDPAY: 'worldpay',
	STAX: 'stax',
	CYBERSOURCE: 'cybersource',
	ACH: 'ach',
	PCI_VAULT: 'pci_vault',
	PAYFABRIC: 'payfabric',
};

export const finix_env = {
	PRODUCTION: 'production',
	LIVE: 'live',
	SANDBOX: 'sandbox',
};

export const finix_stepper_steps = [
	{
		label: 'Card details',
	},
	{
		label: 'Address',
	},
];

export const street_address_fields_map = {
	city: 'city',
	pincode: 'zip_code',
	state: 'state',
	street_address: 'street_address',
	address_line_2: 'address_2',
};
