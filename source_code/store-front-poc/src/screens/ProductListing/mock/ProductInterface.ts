import { ReactNode } from 'react';

interface CustomAttribute {
	id: string;
	name: string;
	type: string;
	value: string;
}

interface Inventory {
	inventory_tracking_enabled?: boolean;
	out_of_stock_threshold: number;
	reserved_quantity: any;
	total_reserved: any;
	available_quantity: any;
	total_available: number;
	inventory_status: any;
	backorder_available_quantity: any;
	stock: number;
	name: string;
	box_color: string;
	show_stock_list: string;
	list: {
		in_stock: string;
		on_hold: string;
		on_loom: string;
	};
}

interface Media {
	id: string;
	url: string;
	type: string;
	is_primary: boolean;
}

interface Category {
	children: null;
	name: string;
	level: number;
	id: string;
	path: string;
	parent_id: string;
}

interface VariantHinge {
	value: string;
	priority: number;
	type: string;
	type_value: string;
}

interface HingeAttribute {
	id: string;
	name: string;
	priority: number;
}

interface VariantsMeta {
	hinges_value_map: {
		[attributeId: string]: VariantHinge[];
	};
	variant_data_map: {
		[key: string]: string;
		product_id: string;
	}[];
	hinge_attributes: HingeAttribute[];
}

interface TransformedAttribute {
	id: string;
	dType: string;
	isInternal: boolean;
	label: string;
	value: string;
	composite: object;
	values: string[];
}

interface PricingRuleTier {
	start_quantity: number;
	end_quantity: number;
	ioq: number;
	price: number;
}

interface Pricing {
	id: string;
	product_id: string;
	catalog_id?: string;
	min_order_quantity: number;
	step_increment: number;
	max_order_quantity: number;
	price_level_id?: string;
	base_price?: number;
	price: number;
	unit: string;
	default_order_quantity?: number;
	volume_tiers?: PricingRuleTier[];
	currency: string;
	variant_price_range: {
		min_value: number;
		max_value: number;
		final_range: string;
	};
}

export interface Product {
	quantity: ReactNode;
	amount: any;
	id: string;
	name: string;
	type: string;
	sku_id: string;
	tenant_id: string;
	parent_id: string;
	search_string: string[];
	custom_attributes: {
		[attributeId: string]: CustomAttribute;
	};
	inventory: Inventory;
	created_at: string;
	updated_at: string;
	media: Media[];
	wishlists?: any;
	category: Category[];
	collections: any[]; // The structure of this might be more complex, but the data is not provided.
	meta: {
		sku_id: string;
		parent_id: string;
		name: string;
		// ... other fields
	};
	variants_meta: VariantsMeta;
	transformed_attributes: TransformedAttribute[];
	pricing: Pricing;
	position: number;
	is_customizable?: boolean;
	grouping_identifier?: string;
	inner_hits?: string[];
}

// Define the interface for the whole JSON structure
export interface ProductData {
	[productId: string]: Product;
}
