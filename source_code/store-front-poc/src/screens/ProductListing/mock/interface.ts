interface CartItem {
	quantity: number;
	meta: {
		notes: {
			customer_note: string;
			share_customer_note_with_buyer: boolean;
			my_note: string;
			share_my_note_with_buyer: boolean;
		};
	};
}

interface Product {
	id: string;
	moq: number;
	name: string;
	description: string;
	sku_id: number;
	media: {
		id: string;
		url: string;
		type: string;
		is_primary: boolean;
	}[];
	pricing_rule: {
		volume_tiers?: {
			start_quantity: number;
			end_quantity: number;
			ioq: number;
			price: number;
		}[];
	};
	price: number;
	currency: string;
	unit: string;
	inventory: {
		min_order_quantity: number;
		incremental_value: number;
		max_order_quantity: number;
		stock: number;
		name: string;
		box_color: string;
		show_stock_list: boolean;
		list: string[];
	};
	attributes: {
		color: string;
		bgcolor: string;
		label: string;
		value: string;
		dtype: string;
		priority: number;
	}[];
}

interface Charge {
	value_type: string;
	id: string;
	charge_type: string;
	value: number;
	meta: Record<string, unknown>;
	name: string;
}

export interface CartData {
	status: string;
	updated_at: string;
	source: null;
	updated_by: string;
	id: string;
	created_by: string;
	meta: null;
	created_at: string;
	cart_hash: null;
	tenant_id: string;
	type: string;
	buyer_id: string;
	items: {
		[productId: string]: CartItem;
	};
	validations: {
		partially_in_stock: any[];
		not_in_stock: any[];
	};
	products: Product[];
	cart_total: number;
	total: number;
	charges: Charge[];
}

interface Attribute {
	attName: string;
	isRecommended: boolean;
}

export interface VariantMeta {
	value: string;
	priority: number;
	type: string;
	type_value: string;
}

export interface VariantsMeta {
	variant_count: number;
	hinges_value_map: {
		[key: string]: VariantMeta[];
	};
}

export interface VariantData {
	[key: string]: string;
	product_id: string;
}
export interface RecommendCardProps {
	id: string;
	imageUrl: any;
	name: string;
	hasSimillar: boolean;
	similarSW?: () => any;
	entity_id: any;
	priceRange: string;
	variants_meta: VariantsMeta; // Add the variants_meta prop
	variant_data_map: VariantData[]; // Add the variant_data_map prop
	attributes: Attribute[];
	minQuantity: number;
	maxQuantity: number;
	cartState: CartData;
	border: boolean;
}
