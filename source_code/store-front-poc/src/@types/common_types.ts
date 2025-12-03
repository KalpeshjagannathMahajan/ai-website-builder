interface Option {
	label: string;
	value: string;
}

interface Attribute {
	id: string;
	name: string;
	type: string;
	value: string | number | boolean | null;
	priority: number;
	required: boolean;
	is_editable: boolean;
	is_display: boolean;
	is_quick_add: boolean;
	is_taking_full_row?: boolean;
	disabled?: boolean;
	options?: Option[];
	updated_at?: string;
	created_at?: string;
	is_display_exclusion_type?: any[];
	required_exclusion_type?: any[];
	validations?: Record<string, any>;
}

interface DocumentEntity {
	attributes: Attribute[];
	id?: string;
	for_document_only?: boolean;
	[key: string]: any;
}

interface FormValuesObj {
	[key: string]: string | number | boolean | null;
}

interface MappedAddressContact {
	data: FormValuesObj | null;
	show_sync_back_checkbox: boolean;
	show_sync_back_info: boolean;
}

type ErrorReason = {
	id: string;
	submitTimeUtc: string;
	status: string;
	reason: string;
	message: string;
	details: Array<{
		field: string;
		reason: string;
	}>;
	[key: string]: any; // This allows any additional keys in the `reason` object
} | null;

interface AddCardErrorModalData {
	is_modal_visible: boolean;
	subtitle: string | null;
	reason?: ErrorReason;
}
interface ErrorModalProps {
	modal_data: AddCardErrorModalData;
}

interface PaymentStatusPayload {
	document_id: string;
	payment_status: string;
}

export type {
	Attribute,
	DocumentEntity,
	FormValuesObj,
	MappedAddressContact,
	AddCardErrorModalData,
	ErrorModalProps,
	PaymentStatusPayload,
};
