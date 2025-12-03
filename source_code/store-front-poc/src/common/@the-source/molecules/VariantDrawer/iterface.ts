interface MediaItem {
	id: string;
	url: string;
	type: string;
	is_primary: boolean;
}

interface CustomAttribute {
	id: string;
	name: string;
	type: string;
	value: string;
}

interface InventoryList {
	in_stock: string;
	on_hold: string;
	on_loom: string;
}

interface Inventory {
	min_order_quantity: number;
	incremental_value: number;
	max_order_quantity: number;
	stock: number;
	name: string;
	box_color: string;
	show_stock_list: string;
	list: InventoryList;
}

interface Category {
	name: string;
	parent_id: string;
	id: string;
	children: string | null;
	level: number;
	path: string;
}

interface Collection {
	media: MediaItem[];
	id: string;
	priority: number;
	name: string;
}

interface VariantDataMap {
	[key: string]: string;
}

interface HingeValueMap {
	[key: string]: { value: string; priority: number; type: string; type_value: string };
}

interface VariantsMeta {
	hinges_value_map: HingeValueMap;
	variant_data_map: VariantDataMap[];
	hinge_attributes: CustomAttribute[];
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

interface PricingTier {
	start_quantity: number;
	end_quantity: number;
	ioq: number;
	price: number;
}

interface PricingRule {
	volume_tiers?: PricingTier[];
}

interface Pricing {
	unit: string;
	price: number;
	price_level_id: string;
	pricing_rule: PricingRule;
	id: string;
	product_id: string;
	currency: string;
	variant_price_range: {
		min_value: number;
		max_value: number;
	};
}

export interface ProductData {
	id: string;
	name: string;
	type: string;
	sku_id: string;
	tenant_id: string;
	parent_id: string;
	search_string: string[];
	custom_attributes: CustomAttribute[];
	inventory: Inventory;
	created_at: string;
	updated_at: string;
	media: MediaItem[];
	category: Category[];
	collections: Collection[];
	meta: any; // You can replace "any" with the actual type if you have the information
	variants_meta: VariantsMeta;
	transformed_attributes: TransformedAttribute[];
	pricing: Pricing;
}
