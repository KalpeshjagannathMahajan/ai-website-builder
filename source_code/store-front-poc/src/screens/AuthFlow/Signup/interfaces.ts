export interface Section {
	key: string;
	name: string;
	attributes?: Attribute[];
	contacts?: Contact[];
	addresses?: Address[];
	custom_attributes?: Attribute[];
}

export interface Attribute {
	id: string;
	name: string;
	type: string;
	required?: boolean;
	options?: { label: string; value: string }[];
}

export interface Contact {
	attributes: Attribute[];
}

export interface Address {
	attributes: Attribute[];
}

export interface Page {
	name: string;
	sections: string[];
	priority: number;
}
