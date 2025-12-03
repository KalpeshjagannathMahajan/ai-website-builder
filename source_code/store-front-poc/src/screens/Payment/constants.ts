import { info } from 'src/utils/common.theme';
import { error, primary, secondary, warning } from 'src/utils/light.theme';
import { colors } from 'src/utils/theme';

const constants: any = {
	all_tabs: {
		TRANSACTIONS: {
			value: 'transactions',
			label: 'Transactions',
			permission: {},
		},
		RECURRING_PAYMENTS: {
			value: 'recurring_payments',
			label: 'Recurring Payments',
		},
	},
	account_type: {
		BUSINESS_CHECKING: {
			key: 'BUSINESS_CHECKING',
			label: 'Bussiness checking',
		},
		BUSINESS_SAVINGS: {
			key: 'BUSINESS_SAVINGS',
			label: 'Bussiness savings',
		},
		PERSONAL_SAVINGS: {
			key: 'PERSONAL_SAVINGS',
			label: 'Personal savings',
		},
		PERSONAL_CHECKING: {
			key: 'PERSONAL_CHECKING',
			label: 'Personal checking',
		},
	},

	schedule_header: [
		{
			key: 'date',
			label: 'Date',
			style: {
				flex: '40%',
			},
		},
		{
			key: 'payment_method',
			label: 'Payment method',
			style: {
				flex: '55%',
			},
		},
		{
			key: 'status',
			label: 'Status',
			style: {
				flex: '25%',
			},
		},
	],
	radio_buttons: [
		{
			label: 'Collect Payment',
			value: 'direct',
			route: '/payment/form/direct',
		},
		// To be released later
		// {
		// 	label: 'Credits',
		// 	value: 'credits',
		// 	route: '/payment/form/credit',
		// },
		{
			label: 'Refunds',
			value: 'refund',
			route: '/payment/form/refund',
		},
		{
			label: 'Pre authorize',
			value: 'authorize',
			route: '/payment/form/authorize',
		},
		{
			label: 'Recurring payments',
			value: 'subscription',
			route: '/payment/form/subscription',
		},
	],
	payment_charges: [
		{
			label: 'Miscellaneous Charge',
			key: 'miscellaneous_charge',
		},
		{
			label: 'Order/Invoice Amount',
			key: 'order_invoice_amount',
		},
		{
			label: 'Shipping Charge',
			key: 'shipping_charge',
		},
	],
	notes: {
		key: 'notes',
		name: 'Notes',
		priority: 1,
		attributes: [
			{
				id: 'notes',
				name: 'Notes',
				type: 'text',
				priority: 0,
				required: false,
				is_editable: true,
				is_display: true,
			},
		],
		is_display: true,
		is_quick_add: true,
	},
	customer_details: {
		key: 'customer_details',
		name: 'Customer details',
		priority: 0,
		attributes: [
			{
				id: 'search_customer',
				name: 'search_customer',
				placeholder: 'Search customer',
				label: '',
				type: 'select',
				required: true,
				options: [],
			},
			{
				id: 'buyer_info',
				name: 'buyer_info',
				placeholder: 'Enter customer detail manually',
				label: '',
				type: 'text',
				required: true,
			},
		],
		is_display: true,
		is_quick_add: true,
	},
	payment_method: {
		key: 'payment_method',
		name: 'Payment method',
		priority: 1,
		attributes: [],
		is_display: true,
	},
	payment_order_details: [
		{ key: 'order_total', label: 'Order Total' },
		{ key: 'all_payment_received_total', label: 'Amount collected' },
		{ key: 'all_payment_refunded_total', label: 'Amount refunded' },
	],
	payment_method_data_keys: {
		ach: 'saved_bank_accounts',
		card: 'saved_payment_methods',
	},
	method_types: {
		card: 'card',
		payment_link: 'payment_link',
		manual: 'manual',
		terminal: 'terminal',
		ach: 'ach',
	},
	status: {
		ACTIVE: 'active',
		INACTIVE: 'inactive',
		CLOSED: 'closed',
	},
	MIN_TXNS_COUNT: 5,
	MIN_AUTH_TXNS_COUNT: 5,
	PAYMENT_EMAIL_ACTIONS: {
		buyer: 'buyer_purchase_success',
		auth: 'payment_authorization',
		order: 'payment_success',
		refund: 'payment_refund',
		recurring_payment_updated: 'recurring_payment_updated',
		recurring_payment: 'recurring_payment_created',
	},
};

const ssrm_constants: any = {
	settlement_status: {
		unknown: {
			label: 'Unknown',
			value: 'unknown',
			text_color: secondary[700],
			bg_color: secondary[200],
		},
		pending: {
			label: 'Pending',
			value: 'pending',
			text_color: warning[600],
			bg_color: warning[100],
		},
		awaiting_approval: {
			label: 'Awaiting Approval',
			value: 'awaiting_approval',
			text_color: info.main,
			bg_color: info[100],
		},
		approved: {
			label: 'Approved',
			value: 'approved',
			text_color: primary.main,
			bg_color: primary[50],
		},
		cancelled: {
			label: 'Cancelled',
			value: 'cancelled',
			text_color: error.main,
			bg_color: error[50],
		},
		failed: {
			label: 'Failed',
			value: 'failed',
			text_color: error.main,
			bg_color: error[50],
		},
		completed: {
			label: 'Completed',
			value: 'completed',
			text_color: primary.main,
			bg_color: primary[50],
		},
		rejected: {
			label: 'Rejected',
			value: 'rejected',
			text_color: error.main,
			bg_color: error[50],
		},
	},
	recurring_payment_status: {
		Active: colors.primary_500,
		Inactive: warning.main,
		Closed: info[600],
	},
};

const payment_details = [
	{
		label: 'Recurring amount',
		key: 'recurring_payment_amount',
	},
	{
		label: 'Total payable amount',
		key: 'total_amount',
		type: 'Subtitle',
	},
	{
		label: 'Amount collected',
		key: 'total_collected',
	},
	{
		label: 'Amount refunded',
		key: 'total_refunded',
	},
];

export default { ...constants, ssrm_constants, payment_details };
