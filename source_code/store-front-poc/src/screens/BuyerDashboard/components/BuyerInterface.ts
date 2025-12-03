export interface Buyer {
	id: string;
	buyer_id: string;
	name: string;
	sales_rep: string;
	type_of_customer?: string;
	buyer_group?: string;
	location?: string;
	contact_person_name?: string;
	catalog: any;
	label?: {
		background_color?: string;
		text_color?: string;
		text?: string;
	};
	primary_contact?: {
		email?: string | null;
		phone?: string | null;
		country_code?: any;
	};
	payment_method?: any;
	wallet_balance?: number;
	analytics: any;
	recent_orders?: {
		date: string;
		type?: string;
		id: number;
		items: number;
		price: string;
		label?: {
			background_color?: string;
			text_color?: string;
			text?: string;
		};
	}[];
}
