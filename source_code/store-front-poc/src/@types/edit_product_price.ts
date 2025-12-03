import { CartProduct } from 'src/screens/CartSummary/components/ProductCard';

interface EditPriceModal {
	show_modal: boolean;
	product: CartProduct | null;
}

interface ModifyPricePayload {
	cart_id: string;
	cart_item_id: string;
	product_id: string;
	final_price: number;
	is_price_modified: boolean;
}

export type { EditPriceModal, ModifyPricePayload };
