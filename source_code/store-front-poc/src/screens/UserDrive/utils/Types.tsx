export type File_Object = {
	user_id: string;
	is_folder: boolean;
	tenant_id: string;
	created_by: null | string;
	file_type: null | string;
	folder_count: number;
	file_size: number;
	url: string;
	updated_at: null | string;
	id: string;
	file_name: string;
	parent_id: string;
	last_updated_by: null | string;
	file_count: number;
	file_key: null | string;
	created_at: null | string;
	status: string;
	selected?: boolean;
};
export type Links_Data = {
	fileLink: string;
	txt: string;
};
