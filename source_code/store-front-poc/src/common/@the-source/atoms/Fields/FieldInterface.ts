export interface FieldInterface {
	field_key: string;
	name: string;
	priority?: number;
	dType: string;
	refInput?: any;
	value: any;
	required: boolean;
	variant?: any;
	attribute_id?: string;
	handleChange?: (value: any) => void;
	onError?: (error: any) => void;
	onEmpty?: () => void;
	error?: boolean;
	empty?: boolean;
	options?: any[];
	direct?: boolean;
	decimalPlaces?: number;
	minDate?: Date;
	maxDate?: Date;
	style?: object;
	rows?: number;
}

export interface MultiSelectFieldInterface {
	complex: boolean;
	options: any[];
	field_key: string;
	name: string;
	priority?: number;
	dType: string;
	refInput: any;
	value: any;
	required: boolean;
	variant?: any;
	attribute_id?: string;
	composition?: object;
	handleChange?: (value: any) => void;
	onError?: (error: any) => void;
	onEmpty?: () => void;
	error?: boolean;
	empty?: boolean;
	style?: object;
}

export interface MultiSelectFilterFieldProps {
	filterName?: string;
	onClear: () => any;
	onUpdate: (val: string[]) => any;
	options: string[];
	field_key: string;
	name: string;
	priority?: number;
	dType: string;
	refInput: any;
	value: any;
	required: boolean;
	variant?: any;
	attribute_id?: string;
	composition?: object;
	handleChange?: (value: any) => void;
	onError?: (error: any) => void;
	onEmpty?: () => void;
	error?: boolean;
	empty?: boolean;
	style?: object;
}
