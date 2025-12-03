export enum Entity {
	Products = 'products',
	Categories = 'categories',
	Collections = 'collections',
	Inventory = 'inventory',
	Pricing = 'pricing',
	Buyers = 'buyers',
	Documents = 'documents',
	Catalog = 'catalog',
	Modifiers = 'modifiers',
	IntegrationSync = 'integration_sync',
}

export enum SubEntity {
	BasicInformation = 'basic_information',
	Contracts = 'contracts',
	Addresses = 'addresses',
	OrderQuoteItems = 'order_quote_items',
	OrderQuote = 'order_quote',
	PriceList = 'price_list',
	VolumePricing = 'volume_pricing',
	ModifiersSetup = 'modifiers',
	ProductModifiers = 'product_modifiers',
	IntegrationPush = 'integration_push',
	IntegrationPull = 'integration_pull',
}

export enum TaskStatus {
	Started = 'started',
	InProgress = 'in-progress',
	Failed = 'failed',
	Cancelled = 'cancelled',
	Completed = 'completed',
	Review = 'review',
}

export enum TaskType {
	import = 'import',
	export = 'export',
	pdf_download = 'pdf_download', // for tear sheet and labels both
	excel_download = 'excel_download',
	integration_sync = 'integration_sync',
}

export enum TaskName {
	TEAR_SHEET = 'TEAR SHEET',
	QUOTE_SUMMARY = 'QUOTE_SUMMARY',
	ORDER_SUMMARY = 'ORDER_SUMMARY',
	CART = 'CART',
	LABELS = 'LABELS',
}

export enum ImportOptions {
	Add = 'add',
	AddAndUpdate = 'add_and_update',
	Update = 'update',
}

export const EventType = {
	TASK_UPDATED: 'taskUpdated',
	TASK_CREATED: 'taskCreated',
	TASK_DISMISSED: 'taskDismissed',
	NEW_NOTIFICATION: 'newNotification',
};

export enum ChannelScope {
	TENANT = 'tenant',
	USER = 'uid',
}

export interface SelectedTemplate {
	dynamic_col: any;
	sub_entity?: SubEntity;
	label: string;
	value: SubEntity;
}

export interface Config {
	license_key: string;
	data: Array<SelectedTemplate>;
	blocked: boolean;
}

export enum ImportSteps {
	INIT_STATE = 'init_state',
	RETRY = 'retry',
	DATA_VALIDATION = 'data_validation',
	DATA_VALIDATION_SUCCESS = 'data_validation_success',
	REVIEW_AND_SYNC_IN_PROGRESS = 'review_and_sync_in_progress',
}

export enum StepStatus {
	Done = 'done',
	InProgress = 'in_progress',
	Pending = 'pending',
	Error = 'error',
	TakeAction = 'take_action',
}

export interface ManageDataItem {
	label: string;
	value: string;
	sub_entities?: SubEntityDataItem[];
	image: string;
	selected_image: string;
	disabled: boolean;
	can_import: boolean;
	can_export: boolean;
}

interface SubEntityDataItem {
	label: string;
	value: string;
	image: string;
	selected_image: string;
	disabled: boolean;
	can_import: boolean;
	can_export: boolean;
}

export interface ImportDrawerData {
	entity: Entity;
	taskId: string;
	sub_entity?: any;
}

export interface Notification {
	created_at: string;
	created_by: string;
	created_by_email: string;
	download_link: string;
	template_name: string;
	entity: Entity;
	remaining_count: number;
	sub_entity: SubEntity;
	task_status: TaskStatus;
	total_count: number;
	type: TaskType;
	updated_at: string;
	updated_by: string;
	id: string;
	task_name?: TaskName;
	meta?: any;
	task_duration: string;
}
