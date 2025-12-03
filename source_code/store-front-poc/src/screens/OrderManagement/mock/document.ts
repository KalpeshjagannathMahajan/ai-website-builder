const is_store_front = import.meta.env.VITE_APP_REPO === 'store_front';

export const document: any = {
	DocumentTypeEnum: {
		ORDER: 'order',
		QUOTE: 'quote',
	},
	DocumentAction: {
		submit: 'submit',
		cancel: 'cancel',
		convert: 'convert',
		reject: 'reject',
		expire: 'expire',
		confirm: 'confirm',
		pendingApproval: 'pending-approval',
		draft: 'draft',
	},
	DocumentStatus: {
		draft: 'draft',
		submitted: 'submitted',
		cancelled: 'cancelled',
		expired: 'expired',
		accepted: 'accepted',
		rejected: 'rejected',
		pendingApproval: 'pending-approval',
		confirmed: 'confirmed',
	},
	Actions: {
		RefundAction: {
			label: 'Refund',
			value: 'refund',
			require_confirmation: false,
		},
		SubmitQuoteAction: {
			label: 'Submit quote',
			value: 'submit',
			require_confirmation: true,
			modal_message: {
				title: 'Submit quote confirmation',
				sub: 'Are you sure you want to submit the quote?',
			},
			message: {
				title: 'Quote submitted successfully',
				sub: 'The details will be updated on your Dashboard',
				show_icon: true,
				is_custom: true,
			},
			cta: {
				current: {
					label: 'Cancel',
					value: null,
				},
				next: {
					label: 'Submit',
					value: 'submit',
				},
			},
		},
		ReSubmitQuoteAction: {
			label: 'Re-submit quote',
			value: 'resubmit',
			require_confirmation: true,
			modal_message: {
				title: 'Submit quote confirmation',
				sub: 'Are you sure you want to submit the quote?',
			},
			message: {
				title: 'Quote submitted successfully',
				sub: 'The details will be updated on your Dashboard',
				show_icon: true,
				is_custom: true,
			},
			cta: {
				current: {
					label: 'Cancel',
					value: null,
				},
				next: {
					label: 'Re-submit',
					value: 'resubmit',
				},
			},
		},
		EditQuoteAction: {
			label: 'Edit quote',
			value: 'edit',
			require_confirmation: false,
			message: {
				title: 'Quote saved successfully',
				sub: 'You can come back anytime to work on this',
				show_icon: true,
			},
		},
		SendEmailAction: {
			label: 'Send email',
			value: 'send_email',
			require_confirmation: false,
		},
		EditOrderAction: {
			label: 'Edit order',
			value: 'edit_order',
			require_confirmation: false,
		},
		RepeatOrderAction: {
			label: 'Repeat order',
			value: 'repeat_order',
			require_confirmation: true,
			modal_message: {
				title: 'Repeat order',
				sub: 'A duplicate order will be created for the same customer. Would you like to procced? ',
			},
			cta: {
				current: {
					label: 'Cancel',
					value: null,
				},
				next: {
					label: 'Proceed',
					value: 'repeat_order',
				},
			},
		},
		RepeatQuoteAction: {
			label: 'Repeat quote',
			value: 'repeat_quote',
			require_confirmation: true,
			modal_message: {
				title: 'Repeat quote',
				sub: 'A duplicate quote will be created for the same customer. Would you like to procced ? ',
			},
			cta: {
				current: {
					label: 'Cancel',
					value: null,
				},
				next: {
					label: 'Proceed',
					value: 'repeat_quote',
				},
			},
		},
		DuplicateOrderAction: {
			label: 'Duplicate order',
			value: 'duplicate_order',
			require_confirmation: false,
		},
		DuplicateQuoteAction: {
			label: 'Duplicate quote',
			value: 'duplicate_quote',
			require_confirmation: false,
		},
		DeleteOrderAction: {
			label: 'Delete order',
			value: 'delete_order',
			require_confirmation: true,
			modal_message: {
				title: 'Delete Order',
				sub: 'Are you sure you want to delete this order?',
			},
			cta: {
				current: {
					label: 'Cancel',
					value: null,
				},
				next: {
					label: 'Delete Order',
					value: 'delete_order',
				},
			},
		},
		DeleteQuoteAction: {
			label: 'Delete quote',
			value: 'delete_quote',
			require_confirmation: true,
			modal_message: {
				title: 'Delete Quote',
				sub: 'Are you sure you want to delete this quote?',
			},
			cta: {
				current: {
					label: 'Cancel',
					value: null,
				},
				next: {
					label: 'Delete Quote',
					value: 'delete_quote',
				},
			},
		},
		CancelQuoteAction: {
			label: 'Cancel quote',
			value: 'cancel',
			require_confirmation: true,
			modal_message: {
				title: 'Cancel quote confirmation',
				sub: 'Are you sure you want to cancel this quote?',
			},
			cta: {
				current: {
					label: 'Go back',
					value: null,
				},
				next: {
					label: 'Cancel Quote',
					value: 'cancel',
				},
			},
			message: {
				title: 'Quote Cancelled',
				sub: 'Your cancellation request has been successfully processed',
				show_icon: false,
			},
		},
		ConvertToOrderAction: {
			label: 'Convert to order',
			value: 'convert',
			require_confirmation: true,
			message: {
				title: 'Quote converted to order',
				sub: 'You can find it on the Orders page',
				show_icon: true,
			},
			modal_message: {
				title: 'Convert quote to order',
				sub: 'Are you sure you want to convert this quote to order?',
			},
			cta: {
				current: {
					label: 'Cancel',
					value: null,
				},
				next: {
					label: 'Convert',
					value: 'convert',
				},
			},
		},
		RejectQuoteAction: {
			label: 'Reject quote',
			value: 'reject',
			require_confirmation: true,
			message: {
				title: 'Quote Rejected',
				sub: 'Your rejection request has been successfully processed',
				show_icon: false,
			},
			modal_message: {
				title: 'Reject quote confirmation',
				sub: 'Are you sure you want to reject this quote? ',
			},
			cta: {
				current: {
					label: 'Cancel',
					value: null,
				},
				next: {
					label: 'Reject Quote',
					value: 'reject',
				},
			},
		},
		RejectOrderAction: {
			label: 'Cancel',
			value: 'cancel',
			require_confirmation: true,
			message: {
				title: 'Success',
				sub: 'Your order has been successfully cancelled',
				show_icon: false,
			},
			modal_message: {
				title: 'Cancel order',
				sub: 'Are you sure you want to cancel this order?',
			},
			cta: {
				current: {
					label: 'Go back',
					value: null,
				},
				next: {
					label: 'Cancel order',
					value: 'cancel',
				},
			},
		},
		RejectOrderRefundAction: {
			label: 'Refund order',
			value: 'cancel',
			modal_message: {
				title: "Can't perform this action",
				sub: 'Please refund all payments before cancellation.',
			},
			cta: {
				current: {
					label: 'Cancel',
					value: null,
				},
				next: {
					label: 'Refund',
					value: 'refund',
				},
			},
		},
		ExpireQuoteAction: {
			label: 'Expire quote',
			value: 'expire',
			require_confirmation: false,
		},
		QuoteAcceptedAction: {
			label: 'Quote accepted',
			value: 'accepted',
			require_confirmation: false,
		},
		ConfirmOrderAction: {
			label: 'Submit order',
			value: 'confirm',
			require_confirmation: true,
			modal_message: {
				title: 'Submit order confirmation',
				sub: 'Are you sure you want to submit the order?',
			},
			add_card_modal_message: {
				title: 'Please add card details to proceed',
				sub: "Your card won't be charged until our team review the order and get back to you .",
			},
			message: {
				title: 'Order confirmed successfully',
				sub: 'The details will be updated on your Dashboard',
				show_icon: true,
				is_custom: true,
			},
			card_cta: {
				current: {
					label: 'Go Back',
					value: null,
				},
				next: {
					label: 'Add card',
					value: 'confirm',
				},
			},
			cta: {
				current: {
					label: 'Cancel',
					value: null,
				},
				next: {
					label: 'Submit',
					value: 'confirm',
				},
			},
		},
		UpdateOrderAction: {
			label: 'Update order',
			value: 'confirm-update',
			require_confirmation: true,
			message: {
				title: 'Order saved successfully',
				sub: 'You can come back anytime to work on this',
				show_icon: true,
			},
			modal_message: {
				title: 'Update order confirmation',
				sub: 'Are you sure you want to update the order?',
			},
			cta: {
				current: {
					label: 'Cancel',
					value: null,
				},
				next: {
					label: 'Update',
					value: 'confirm-update',
				},
			},
		},
		CancelOrderAction: {
			label: 'Cancel order',
			value: 'cancel',
			require_confirmation: true,
			message: {
				title: 'Order Cancelled',
				sub: 'Your cancellation request has been successfully processed',
				show_icon: false,
			},
			modal_message: {
				title: 'Cancel order confirmation',
				sub: 'Are you sure you want to cancel this order?',
			},
			cta: {
				current: {
					label: 'Go back',
					value: null,
				},
				next: {
					label: 'Cancel Order',
					value: 'cancel',
				},
			},
		},
		ApprovalPendingAction: {
			label: 'Send for approval',
			value: 'pending-approval',
			require_confirmation: is_store_front ? false : true,
			message: {
				title: 'Approval request sent',
				sub: 'Approval pending for this order',
				show_icon: true,
				is_custom: true,
			},
			modal_message: {
				title: 'Order approval confirmation',
				sub: 'Are you sure you want to send this order for approval?',
			},
			cta: {
				current: {
					label: 'Cancel',
					value: null,
				},
				next: {
					label: 'Send for approval',
					value: 'pending-approval',
				},
			},
		},
		ConfirmPendingOrderAction: {
			label: 'Approve',
			value: 'confirm',
			require_confirmation: true,
			message: {
				title: 'Order confirmed successfully',
				sub: 'The details will be updated on your Dashboard',
				show_icon: true,
				is_custom: true,
			},
			modal_message: {
				title: 'Order approval confirmation',
				sub: 'Are you sure you want to approve this order?',
			},
			cta: {
				current: {
					label: 'Cancel',
					value: null,
				},
				next: {
					label: 'Approve',
					value: 'confirm',
				},
			},
		},
		PendingApprovalOrderAction: {
			label: 'Resend for approval',
			value: 'pending-approval',
			require_confirmation: false,
		},
		DraftQuoteAction: {
			label: 'Save for later',
			value: '',
			require_confirmation: false,
			message: {
				title: 'Quote saved successfully',
				sub: 'You can come back anytime to work on this',
				show_icon: true,
			},
		},
		DraftOrderAction: {
			label: 'Save for later',
			value: '',
			require_confirmation: false,
			message: {
				title: 'Order saved successfully',
				sub: 'You can come back anytime to work on this',
				show_icon: true,
			},
		},
		AddCardQuoteOrderAction: {
			is_payment_action: true,
			payment_added: {
				label: 'Edit payment',
			},
			payment_not_added: {
				label: 'Add payment',
			},
			key: 'payment_card',
			require_confirmation: false,
		},
		RefundQuoteOrderAction: {
			is_payment_action: true,
			label: 'Refund',
			key: 'refund_payment',
			require_confirmation: false,
		},
		AddCreditsOrderAction: {
			is_payment_action: true,
			label: 'Add Credits',
			key: 'add_credits',
			require_confirmation: false,
		},
		AuthorisedCardsOrderAction: {
			is_payment_action: true,
			label: 'Authorise card',
			key: 'auth_card',
			require_confirmation: false,
		},
		// VoidAuthorizationOrderAction: {
		// 	is_payment_action: true,
		// 	label: 'Void authorization',
		// 	key: 'void_auth_card',
		// 	require_confirmation: false,
		// },
	},
	QUOTE_ACTIONS: {
		draft: {
			next: 'SubmitQuoteAction',
			previous: ['CancelQuoteAction'],
			current: 'DraftQuoteAction',
			modify_attributes: true,
			edit_cart: true,
			show_toast: true,
			allow_payment_actions: false,
		},
		submitted: {
			next: 'ConvertToOrderAction',
			previous: ['RejectQuoteAction'],
			current: 'EditQuoteAction',
			modify_attributes: false,
			edit_cart: false,
			show_toast: false,
			allow_payment_actions: true,
			style: {
				// backgroundColor: '#F2F6E7',
				background: 'linear-gradient(to bottom, #F2F6E7 0, #F2F6E7 28rem, white 28rem, white 100%)',
			},
			PENDING: {
				previous: ['RejectQuoteAction'],
			},
			PARTIALLY_PAID: {
				previous: ['RefundQuoteOrderAction', 'RejectQuoteAction'],
			},
			PAID: {
				previous: ['RefundQuoteOrderAction', 'RejectQuoteAction'],
			},

			PARTIALLY_REFUNDED: {
				previous: ['RejectQuoteAction'],
			},
			REFUNDED: {
				previous: ['RejectQuoteAction'],
			},
		},
		cancelled: {
			next: null,
			previous: [],
			current: null,
			modify_attributes: false,
			edit_cart: false,
			show_toast: true,
			allow_payment_actions: false,
			style: {
				// backgroundColor: '#FBEDE7',
				background: 'linear-gradient(to bottom, #FBEDE7 0, #FBEDE7 28rem, white 28rem, white 100%)',
			},
		},
		expired: {
			next: null,
			previous: [],
			current: null,
			modify_attributes: false,
			edit_cart: false,
			allow_payment_actions: false,
			show_toast: true,
			style: {
				// backgroundColor: 'rgba(227,227,228)',
				background: 'linear-gradient(to bottom, rgba(227,227,228) 0, rgba(227,227,228) 28rem, white 28rem, white 100%)',
			},
		},
		accepted: {
			next: null,
			previous: null,
			current: null,
			modify_attributes: false,
			edit_cart: false,
			allow_payment_actions: false,
			show_toast: true,
			style: {
				// backgroundColor: '#F2F6E7',
				background: 'linear-gradient(to bottom, #F2F6E7 0, #F2F6E7 28rem, white 28rem, white 100%)',
			},
		},
		rejected: {
			next: null,
			previous: [],
			current: null,
			edit_cart: false,
			modify_attributes: false,
			allow_payment_actions: false,
			show_toast: true,
			style: {
				// backgroundColor: 'rgba(227,227,228)',
				background: 'linear-gradient(to bottom, rgba(227,227,228) 0, rgba(227,227,228) 28rem, white 28rem, white 100%)',
			},
		},
	},
	ORDER_ACTIONS: {
		draft: {
			approval_mode_on: {
				next: 'ConfirmOrderAction',
				current: 'DraftOrderAction',
			},
			approval_mode_off: {
				next: 'ApprovalPendingAction',
				current: 'DraftOrderAction',
			},
			force_pending_approval_flow_on: {
				next: 'ApprovalPendingAction',
				current: 'DraftOrderAction',
			},
			force_pending_approval_flow_off: {
				next: 'ConfirmOrderAction',
				current: 'DraftOrderAction',
			},
			previous: ['DraftOrderAction', 'CancelOrderAction'],
			modify_attributes: true,
			edit_cart: true,
			show_toast: true,
			allow_payment_actions: true,
			PENDING: {
				previous: ['DraftOrderAction', 'CancelOrderAction'],
			},
			PARTIALLY_PAID: {
				previous: ['AddCardQuoteOrderAction', 'RefundQuoteOrderAction', 'CancelOrderAction'],
			},
			PAID: {
				previous: ['AddCardQuoteOrderAction', 'RefundQuoteOrderAction', 'CancelOrderAction'],
			},
			PARTIALLY_REFUNDED: {
				previous: ['AddCardQuoteOrderAction', 'RefundQuoteOrderAction', 'CancelOrderAction'],
			},
			REFUNDED: {
				previous: ['AddCardQuoteOrderAction', 'CancelOrderAction'],
			},
			OVERPAID: {
				previous: ['AddCardQuoteOrderAction', 'RefundQuoteOrderAction', 'CancelOrderAction'],
			},
		},
		'pending-approval': {
			approval_mode_on: {
				next: 'ConfirmPendingOrderAction',
				current: 'RejectOrderAction',
			},
			approval_mode_off: {
				next: null,
				current: null,
			},
			force_pending_approval_flow_off: {
				next: null,
				current: null,
			},
			force_pending_approval_flow_on: {
				next: 'ConfirmPendingOrderAction',
				current: 'RejectOrderAction',
			},
			previous: ['AddCardQuoteOrderAction', 'CancelOrderAction', 'AuthorisedCardsOrderAction'],
			modify_attributes: false,
			edit_cart: false,
			show_toast: true,
			allow_payment_actions: true,
			style: {
				// backgroundColor: '#E1EDFF',
				background: 'linear-gradient(to bottom, #E1EDFF 0, #E1EDFF 28rem, white 28rem, white 100%)',
			},
			PENDING: {
				previous: [
					'AddCardQuoteOrderAction',
					'CancelOrderAction',
					'AuthorisedCardsOrderAction',
					// 'VoidAuthorizationOrderAction'
				],
			},
			PARTIALLY_PAID: {
				previous: [
					'AddCardQuoteOrderAction',
					'CancelOrderAction',
					'AuthorisedCardsOrderAction',
					// 'VoidAuthorizationOrderAction'
				],
			},
			PAID: {
				previous: ['AddCardQuoteOrderAction', 'CancelOrderAction'],
			},
			PARTIALLY_REFUNDED: {
				previous: [
					'AddCardQuoteOrderAction',
					'CancelOrderAction',
					'AuthorisedCardsOrderAction',
					// 'VoidAuthorizationOrderAction'
				],
			},
			REFUNDED: {
				previous: [
					'AddCardQuoteOrderAction',
					'CancelOrderAction',
					'AuthorisedCardsOrderAction',
					// 'VoidAuthorizationOrderAction'
				],
			},
			OVERPAID: {
				previous: ['AddCardQuoteOrderAction', 'CancelOrderAction'],
			},
		},
		confirmed: {
			next: null,
			previous: [
				'RefundAction',
				'RejectOrderAction',
				'AddCardQuoteOrderAction',
				'AddCreditsOrderAction',
				'RefundQuoteOrderAction',
				'AuthorisedCardsOrderAction',
				// 'VoidAuthorizationOrderAction',
			],
			current: null,
			modify_attributes: false,
			edit_cart: false,
			show_toast: false,
			allow_payment_actions: true,
			style: {
				// backgroundColor: '#F2F6E7',
				background: 'linear-gradient(to bottom, #F2F6E7 0, #F2F6E7 28rem, white 28rem, white 100%)',
			},
			PENDING: {
				previous: [
					'AddCardQuoteOrderAction',
					'AddCreditsOrderAction',
					'RefundQuoteOrderAction',
					'AuthorisedCardsOrderAction',
					// 'VoidAuthorizationOrderAction',
					'RejectOrderAction',
				],
			},
			PARTIALLY_PAID: {
				previous: [
					'AddCardQuoteOrderAction',
					'RefundQuoteOrderAction',
					'AddCreditsOrderAction',
					'AuthorisedCardsOrderAction',
					// 'VoidAuthorizationOrderAction',
					'RejectOrderAction',
				],
			},
			PAID: {
				previous: [
					'AddCardQuoteOrderAction',
					'RefundQuoteOrderAction',
					'RejectOrderAction',
					'AuthorisedCardsOrderAction',
					// 'VoidAuthorizationOrderAction',
					'AddCreditsOrderAction',
				],
			},
			PARTIALLY_REFUNDED: {
				previous: [
					'AddCardQuoteOrderAction',
					'RefundQuoteOrderAction',
					'AddCreditsOrderAction',
					'AuthorisedCardsOrderAction',
					// 'VoidAuthorizationOrderAction',
					'RejectOrderAction',
				],
			},
			REFUNDED: {
				previous: [
					'AddCardQuoteOrderAction',
					'AddCreditsOrderAction',
					'RefundQuoteOrderAction',
					'AuthorisedCardsOrderAction',
					// 'VoidAuthorizationOrderAction',
					'RejectOrderAction',
				],
			},
			OVERPAID: {
				previous: [
					'AddCardQuoteOrderAction',
					'RefundQuoteOrderAction',
					'RejectOrderAction',
					'AuthorisedCardsOrderAction',
					// 'VoidAuthorizationOrderAction',
					'AddCreditsOrderAction',
				],
			},
		},
		cancelled: {
			next: null,
			previous: ['RefundQuoteOrderAction'],
			current: null,
			modify_attributes: false,
			allow_payment_actions: false,
			edit_cart: false,
			show_toast: true,
			style: {
				// backgroundColor: '#FBEDE7',
				background: 'linear-gradient(to bottom, #FBEDE7 0, #FBEDE7 28rem, white 28rem, white 100%)',
			},
			PARTIALLY_PAID: {
				previous: ['RefundQuoteOrderAction'],
			},
			PAID: {
				previous: ['RefundQuoteOrderAction'],
			},
			PARTIALLY_REFUNDED: {
				previous: ['RefundQuoteOrderAction'],
			},
			OVERPAID: {
				previous: ['RefundQuoteOrderAction'],
			},
		},
	},
};

export const fulfilment_status_constants: any = {
	PARTIALLY_FULFILLED: {
		key: 'PARTIALLY_FULFILLED',
		label: 'Partially Fulfilled',
	},
	UNFULFILLED: {
		key: 'UNFULFILLED',
		label: 'UnFulfilled',
	},
	OUT_FOR_DELIVERY: {
		key: 'OUT_FOR_DELIVERY',
		label: 'Out for delivery',
	},
	IN_TRANSIT: {
		key: 'IN_TRANSIT',
		label: 'In Transit',
	},
	FULFILLED: {
		key: 'FULFILLED',
		label: 'Fulfilled',
	},
	DELIVERED: {
		key: 'DELIVERED',
		label: 'Delivered',
	},
	PARTIALLY_DELIVERED: {
		label: 'Partially Delivered',
		key: 'PARTIALLY_DELIVERED',
	},
};

export const submitted_document = {
	review_page: {
		modal_message: {
			title: 'All set to proceed?',
			sub: 'Do you wish to add/remove any selected item from the customer"s cart?',
		},
		cta: {
			current: {
				label: 'Edit cart',
				value: 'edit_cart',
			},
			next: {
				label: 'Convert to order',
				value: 'convert',
			},
		},
		message: {
			title: 'Quote converted to order',
			sub: 'You can find it on the Orders page',
			show_icon: true,
		},
	},

	confirm_page: {
		modal_message: {
			title: 'Are you sure?',
			sub: 'Are you sure you want to convert this quote to an order? You might need to add additional information in order review page',
		},
		cta: {
			current: {
				label: 'No, Edit quote',
				value: 'edit_quote',
			},
			next: {
				label: 'Yes, Convert to order',
				value: 'convert',
				key: 'quote_to_order',
			},
		},
		message: {
			title: 'Quote converted to order',
			sub: 'You can find it on the Orders page',
			show_icon: true,
		},
	},
};

export const payment_status_constants: any = {
	PARTIALLY_PAID: {
		key: 'PARTIALLY_PAID',
		label: 'Partially Paid',
	},
	PARTIALLY_REFUNDED: {
		key: 'PARTIALLY_REFUNDED',
		label: 'Partially Refunded',
	},
	PENDING: {
		key: 'PENDING',
		label: 'Payment Pending',
	},
	REFUNDED: {
		key: 'REFUNDED',
		label: 'Refunded',
	},
	PAID: {
		key: 'PAID',
		label: 'Paid',
	},
	OVERPAID: {
		key: 'OVERPAID',
		label: 'Overpaid',
	},
	VOIDED: {
		key: 'VOIDED',
		label: 'Voided',
	},
};

export const submit_form_column = {
	columns: [
		{
			name: 's_no',
			label: 'S.NO.',
			dtype: 'text',
			align: 'left',
		},
		{
			name: 'sku_id',
			label: '# Product ID',
			dtype: 'text',
			align: 'left',
		},
		{
			name: 'media',
			label: 'Image',
			dtype: 'image',
			align: 'left',
		},
		{
			name: 'name',
			label: 'Details',
			dtype: 'text',
			align: 'left',
		},
		{
			name: 'price',
			label: 'Price',
			dtype: 'price',
			align: 'right',
		},
		// {
		// 	name: 'offered_price',
		// 	label: 'Offered price',
		// 	dtype: 'price',
		// 	align: 'right',
		// },
		{
			name: 'quantity',
			label: 'Quantity',
			dtype: 'number',
			align: 'center',
		},
		{
			name: 'item_status',
			label: 'Item status',
			dtype: 'item_status',
			align: 'left',
		},
		{
			name: 'total',
			label: 'Total',
			dtype: 'price',
			align: 'right',
		},
	],
};

export const EMAIL_EXCLUDE_ACTIONS = ['repeat_order', 'repeat_quote', 'delete_order', 'delete_quote'];

export const ORDER_SOURCE_FOR_EDIT_ORDER = ['sales_rep', 'wizshop'];
