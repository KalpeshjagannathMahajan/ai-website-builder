import { ICatalog } from 'src/reducers/buyer';

type CatalogTemplate = {
	id: string;
	template_id: string;
	title: string;
	description: string;
	preview_image: string;
	is_default: boolean;
};

type SortOption = {
	field: string;
	order: 'asc' | 'desc';
	nested?: {
		path: string;
	};
	is_default?: boolean;
};

interface TemplateCardProps {
	template: CatalogTemplate;
	is_selected: boolean;
	on_template_select: (template: CatalogTemplate) => void;
}

type CatalogFormValues = {
	name: string;
	sort_by?: string;
	template_id?: string;
	catalog_id?: string;
	show_price: boolean;
	product_ids: string[];
	template_db_id?: string;
};

type CatalogPreviewValues = {
	sort_by?: string;
	template_db_id: string | undefined;
	catalog_id?: string;
	show_price: boolean;
	product_ids: string[];
};

type FileData = {
	id?: string;
	name: string;
	url: string;
	products: number;
	pdf_status?: string;
	product_ids?: string[];
};

interface ReviewProductListingProps {
	is_edit_mode?: boolean;
}

interface EditedCatalogData {
	id: string;
	system_id: string;
	name: string;
	tenant_id: string;
	template_id: string;
	catalog_id: string;
	product_ids: string[];
	show_price: boolean;
	sort_by: string | null;
	pdf_link: string | null;
	product_names: string[];
	product_sku_ids: string[];
	created_by: string;
	updated_by: string;
	status: string;
	created_at: string;
	updated_at: string;
}

interface CustomizeCatalogDrawerProps {
	is_edit_mode: boolean;
	is_drawer_visible: boolean;
	current_sorting: SortOption | undefined;
	is_submit_loading: boolean;
	catalog_templates: CatalogTemplate[];
	default_price_list: ICatalog | undefined;
	edit_catalog_data: EditedCatalogData | null;
	handle_close_drawer: () => void;
	handle_catalog_preview: (data: any) => void;
	is_preview_loading: boolean;
	handle_submit_catalog: (data: any) => void;
}

interface EmptyReviewScreenProps {
	handle_add_products: () => void;
}

interface CatalogPreviewProps {
	open_modal: boolean;
	set_open_modal: any;
	file_data: FileData;
	is_edit_mode: boolean;
	is_submit_loading?: boolean;
	from_listing_page?: boolean;
	from_review_page?: boolean;
	submit_payload?: CatalogFormValues | null;
	handle_submit_catalog?: (paylaod: CatalogFormValues) => void;
	max_pages?: number;
	set_open_email_modal?: any;
	set_file_to_share?: any;
}

interface ExitCatalogModalProps {
	show_modal: boolean;
	set_show_modal: (value: boolean) => void;
}

export type {
	CatalogTemplate,
	SortOption,
	TemplateCardProps,
	CatalogFormValues,
	ReviewProductListingProps,
	CustomizeCatalogDrawerProps,
	CatalogPreviewValues,
	FileData,
	EditedCatalogData,
	EmptyReviewScreenProps,
	CatalogPreviewProps,
	ExitCatalogModalProps,
};
