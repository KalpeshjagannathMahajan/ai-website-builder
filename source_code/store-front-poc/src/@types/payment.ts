import { PAYMENT_METHODS } from 'src/screens/BuyerLibrary/constants';

interface TransactionsConfig {
	key: string;
	name: string;
	visible: boolean;
	type: string;
	isFilterable: boolean;
	isSortable: boolean;
	filterType: string;
	filterParams?: any;
	filter?: any;
}

interface TransactionsOutputObject {
	headerName: string;
	field: string;
	resizable?: boolean;
	headerStyle?: {} | undefined;
	isVisible?: boolean;
	dtype: string;
	sortable?: boolean;
	filter?: any;
	filterParams?: any;
	editable?: boolean;
	cellStyle?: React.CSSProperties;
	width?: number;
	suppressMenu?: boolean;
	actions?: any;
	flex?: 1;
	pinned?: any;
	minWidth?: number;
}

interface RefundTransactionsProps {
	transactions: any[];
	set_payment_ids: (ids: string[]) => void;
	set_input_value: (value: number) => void;
	payment_method_ids: Record<string, any>;
	currency: string;
}

interface AuthorizeFormProps {
	form_data: any;
	buyer_data: any;
	input_value: number;
	all_addresses: any[];
	set_toast: any;
	payment_method_data: any;
	payment_config: any;
	set_payment_method_data: any;
	set_input_value: (value: number) => void;
	set_payment_method_attrs: any;
	edit_form_details: any;
	has_void_authorization_permission: boolean;
}

interface VoidAuthModalProps {
	open_void_auth_modal: boolean;
	transaction: any;
	set_toast: any;
	set_open_void_auth_modal: (val: boolean) => void;
	callback?: () => void;
}

export type { TransactionsConfig, TransactionsOutputObject, RefundTransactionsProps, AuthorizeFormProps, VoidAuthModalProps };
export type PaymentMethodsKeys = keyof typeof PAYMENT_METHODS;
export type PaymentMethodsValues = (typeof PAYMENT_METHODS)[PaymentMethodsKeys];
