export interface Attributes {
	default: boolean;
	is_display: boolean;
	id: string;
	priority: number;
	is_quick_add: boolean;
	required: boolean;
	type: string;
	value: string;
}

export interface SectionProps {
	name: string;
	key: string;
	is_default: boolean;
	is_hidden: boolean;
	priority: number;
	is_quick_add?: boolean | undefined;
	attributes: Attributes;

	// [key: string]: Attributes;
}
export interface Buyer {
	sections: [SectionProps];
}
