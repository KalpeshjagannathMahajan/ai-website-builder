import utils from '../utils';

let baseUrl = import.meta.env.VITE_APP_API_URL;
let folderURL = `${baseUrl}/folder/`;

const driveApis = {
	get_folder_data: (user_id = '', tenant_id = '', parent_id = '', created_on_filter = '', file_type = '', sort_by = '') => {
		let url = `${folderURL}user_assets/${user_id}/${tenant_id}/${parent_id}`;
		if (sort_by?.length > 0 || file_type?.length > 0 || created_on_filter?.length > 0) {
			url += '?';
			if (sort_by?.length > 0) url += `sort_by=${sort_by}&`;
			if (file_type?.length > 0) url += `file_type=${file_type}&`;
			if (created_on_filter?.length > 0) url += `created_at=${created_on_filter}&`;
		}
		return utils.request({
			url,
			method: 'GET',
		});
	},
	delete_folder: (file_id = '') => {
		return utils.request({
			url: `${folderURL}${file_id}`,
			method: 'DELETE',
		});
	},
	create_new_folder: (parent_id = '', file_name = '') => {
		// console.log("FOLDER NAME IS -> ",file_name)
		return utils.request({
			url: `${baseUrl}/folder`,
			method: 'POST',
			data: {
				parent_id,
				file_name,
				file_type: 'null',
				is_folder: true,
				file_size: 0,
				file_key: '',
				url: '',
			},
		});
	},
	create_new_file: (
		user_id = '',
		tenant_id = '',
		parent_id = '',
		file_name = '',
		file_type = 'null',
		file_size = 0,
		file_url = '',
		file_key = '',
	) => {
		return utils.request({
			url: `${baseUrl}/folder`,
			method: 'POST',
			data: {
				user_id,
				tenant_id,
				parent_id,
				file_name,
				file_type,
				is_folder: false,
				file_size,
				file_key,
				url: file_url,
			},
		});
	},
	rename_folder: (user_id = '', tenant_id = '', parent_id = '', file_name = '', file_id = '') => {
		return utils.request({
			url: `${baseUrl}/folder`,
			method: 'PUT',
			data: {
				user_id,
				tenant_id,
				parent_id,
				file_name,
				file_id,
			},
		});
	},
	send_email: (to_mail = '', cc_mail = '', bcc_mail = '', subject_mail = '', file = '') => {
		return utils.request({
			url: `${baseUrl}/email`,
			method: 'POST',
			data: {
				to_mail,
				cc_mail,
				bcc_mail,
				subject_mail,
				file,
			},
		});
	},
	get_search_data: (parent_id = '', search_string = '', created_on_filter = {}, search_term = '', file_type = '', sort_by = '') => {
		let url = `${folderURL}v1/search_assets`;
		// if (sort_by?.length > 0 || file_type?.length > 0 || created_on_filter?.length > 0) {
		// 	if (sort_by?.length > 0) url += `sort_by=${sort_by}&`;
		// 	if (file_type?.length > 0) url += `file_type=${file_type}&`;
		// 	if (created_on_filter?.length > 0) url += `created_at=${created_on_filter}&`;
		// }
		// console.log('created_on_filter ARE -> ', created_on_filter);
		return utils.request({
			url,
			method: 'POST',
			data: {
				parent_id,
				name_search: search_string,
				created_at: 'lte' in created_on_filter && 'gte' in created_on_filter ? created_on_filter : {},
				search_term: search_term ? search_term : 'all',
				sort: sort_by,
				file_type: file_type === '' || file_type.length < 1 ? [] : [file_type],
				page: 0,
				page_size: 10000,
			},
		});
	},
	get_share_file_link: (tenant_id = '', file_id = '') => {
		return utils.request({
			url: `${folderURL}share/${tenant_id}/${file_id}`,
			method: 'POST',
		});
	},
	share_acess_to_a_file: (userId = '', fileId = '') => {
		let url = `${folderURL}share_with/${userId}/${fileId}`;
		console.log('URL IS => ', url);
		return utils.request({
			url,
			method: 'POST',
		});
	},
	share_bulk_acess_to_a_file_api: (user_ids = [], file_ids = [], parent_id = '') => {
		return utils.request({
			url: `${folderURL}share_with_users`,
			method: 'POST',
			data: {
				user_ids,
				asset_ids: file_ids,
				parent_id,
			},
		});
	},
	unshare_acess_to_a_file: (userId = '', fileId = '') => {
		return utils.request({
			url: `${folderURL}unshare_with/${userId}/${fileId}`,
			method: 'DELETE',
		});
	},
	unshare_bulk_acess_to_a_file_api: (user_ids = [], file_ids = [], parent_id = '') => {
		return utils.request({
			url: `${folderURL}unshare_with_users`,
			method: 'POST',
			data: {
				user_ids,
				asset_ids: file_ids,
				parent_id,
			},
		});
	},
	get_user_with_file_access: (file_id = []) => {
		let url = `${folderURL}shared_with/${file_id}`;
		console.log('URl2 IS => ', url);
		return utils.request({
			url,
			method: 'GET',
		});
	},
	download_multiple_files: (file_details = []) => {
		return utils.request({
			url: `${folderURL}download`,
			method: 'POST',
			data: {
				file_details,
			},
		});
	},
	export_files: (data: any) => {
		return utils.request({
			url: 'tasks/v1/export',
			method: 'POST',
			data,
		});
	},
	delete_multiple_files: (
		file_details: {
			file_id: any;
			file_handle: any;
			parent_id: any;
		}[] = [],
	) => {
		return utils.request({
			url: `${folderURL}delete`,
			method: 'DELETE',
			data: {
				file_details,
			},
		});
	},
	get_multiple_file_links: (file_details: { file_id: any; tenant_id: any }[] = []) => {
		return utils.request({
			url: `${folderURL}share_multiple_assets`,
			method: 'POST',
			data: {
				file_details,
			},
		});
	},
};
export default driveApis;
