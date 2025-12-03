/* eslint-disable react/no-array-index-key */
import { useContext, useEffect, useState } from 'react';
import { Button, Icon, Image, Box, Grid, Tooltip, Skeleton } from 'src/common/@the-source/atoms';
import { FolderComponent } from './components/FolderComponent';
// import { FileComponent } from './components/FileComponent';
import { FilePreviewModal } from './components/FilePreviewModal';
import { EmailModal } from './components/EmailModal';
import { WarningModal } from './components/WarningModal';
import { CreateFolderModal } from './components/CreateFolderModal';
import { UploadModal } from './components/UploadModal';
import { UpperHeader } from './components/UpperHeader';
import { ManageAcessModal2 } from './components/ManageAcessModal2';
import { FilterSection } from './components/FiltersSection';
import ImageLinks from 'src/assets/images/ImageLinks';
import { RenameFileModal } from './components/RenameFileModal';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import Lottie from 'react-lottie';
import LoaderLottie from '../../assets/animations/loader.json';
import driveApis from 'src/utils/api_requests/userDriveApis';
import { baseUrl, download_multiple_files_api } from './utils/apis';
import { FileStackContext } from './Context/FileStackContext';
import MessageModal from './components/MessageModal';
import { File_Object, Links_Data } from './utils/Types';
import { content_type_to_extension } from './utils/option';
import { PERMISSIONS } from 'src/casl/permissions';
import Can from 'src/casl/Can';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ability from '../../casl/ability';
import NoProducts from 'src/common/@the-source/molecules/ErrorPages/No_Products';
import RouteNames from 'src/utils/RouteNames';
import { updateBreadcrumbs } from 'src/actions/topbar';
import { t } from 'i18next';
import CustomToast from 'src/common/CustomToast';
import CustomText from 'src/common/@the-source/CustomText';
import { useTheme } from '@mui/material/styles';
import useStyles from './css/UserDriveStyle';
import settings from 'src/utils/api_requests/setting';
import SelectAll from './components/SelectAll';
import { set_notification_feedback } from 'src/actions/notifications';
import OptimizedGrid from './components/OptimizedGrid';

const UserDrive = () => {
	const classes = useStyles();
	const theme: any = useTheme();
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const user_data = useSelector((state: any) => state.login.userDetails);
	const file_stack_client: any = useContext(FileStackContext);
	// let file_stack_client = file_stack_context?.file_stack_client
	let upload_data = file_stack_client?.upload_data;
	let set_upload_data = file_stack_client?.set_upload_data;
	const [sub_folder_data, set_sub_folder_data] = useState<File_Object[]>([]);
	const [files_data, set_files_data] = useState<File_Object[]>([]);
	const [show_upload_modal, set_show_upload_modal] = useState(false);
	const [show_upload_cont, set_show_upload_cont] = useState(true);
	const [selected_files_count, set_selected_files_count] = useState(0);
	const [open_email_modal, set_open_email_modal] = useState(false);
	const [user_detail, set_user_detail] = useState<any>({});
	const [open_create_folder_modal, set_open_create_folder_modal] = useState(false);
	// const [open_cancel_upload_modal, set_open_cancel_upload_modal] = useState(false);
	const [open_file_privew_modal, set_open_file_privew_modal] = useState(false);
	const [open_manage_access_modal, set_open_manage_access_modal] = useState(false);
	// const [upload_data, set_upload_data] = useState<any>([]);
	const [upload_modal_open, set_upload_modal_open] = useState(false);
	const [open_rename_file_modal, set_open_rename_file_modal] = useState(false);
	const [selected_file_dat_for_updation, set_selected_file_dat_for_updation] = useState<any>(null);
	const [parent_folder_data, set_parent_folder_data] = useState<any>(null);
	const [visited_folder_data, set_visited_folder_data] = useState([]);
	const [files_link_to_share, set_files_link_to_share] = useState<Links_Data[]>([]);
	const [search, set_search] = useState('');
	const [search_data, set_search_data] = useState<File_Object[]>([]);
	const [toast, toggle_toast] = useState({ show: false, message: '', title: '', status: 'success' });
	const [created_on_filter, set_created_on_filter] = useState<any>({
		id: 'all_time',
		data: {
			label: 'All time',
			value: () => {
				return {};
			},
		},
	});
	const [file_type, set_file_type] = useState<any>({
		id: 'all_files',
		data: {
			label: 'All Files',
			value: '',
		},
	});
	const [sort_by, set_sort_by] = useState<any>({
		id: 'time_asc',
		data: {
			label: 'Last modified: New to Old',
			value: 'time_asc',
		},
	});
	const [selected_files, set_selected_files] = useState<File_Object[]>([]);
	const [data_present, set_data_present] = useState(false);
	const [show_loader, set_show_loader] = useState(false);
	const [action_message, set_action_message] = useState('');
	const [open_message_modal, set_open_message_modal] = useState(false);
	const [content_loading, set_content_loading] = useState(false);
	const [delete_file_modal, set_delete_file_modal] = useState(false);
	const [multi_files_delete, set_multi_files_delete] = useState(false);
	const [file_data_to_delete, set_file_data_to_delete] = useState<any>(null);
	const [file_type_facets, set_file_type_facets] = useState<any>(null);
	const [show_action_icon, set_show_action_icon] = useState(false);
	const dispatch = useDispatch();

	const breadCrumbList = [
		{
			id: 1,
			linkTitle: 'Dashboard',
			link: RouteNames.dashboard.path,
		},
		{
			id: 2,
			linkTitle: 'Files',
			link: `${RouteNames.user_drive.path}`,
		},
	];

	function isSafariBrowser() {
		const userAgent = window.navigator.userAgent;
		const safari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
		return safari;
	}
	async function get_files_data() {
		if (user_data?.id && user_data?.tenant_id) {
			set_content_loading(true);
			try {
				// let apiData = await driveApis.get_folder_data(
				//  user_data?.id,
				//  user_data?.tenant_id,
				//  parent_folder_data?.id ? parent_folder_data?.id : user_data?.id,
				//  created_on_filter?.data?.value,
				//  file_type?.data?.value,
				//  sort_by?.data?.value,
				// );
				// let data: any = extract_data_from_response(apiData);
				// // console.log('DATA IS -> ', data);
				// // data.length > 0 ? set_data_present(true) : set_data_present(false);

				const search_term = searchParams.get('type') || '';
				let temp_data: any = await driveApis.get_search_data(
					parent_folder_data?.id ? parent_folder_data?.id : user_data?.id,
					'',
					created_on_filter?.data?.value(),
					search_term,
					file_type?.data?.value,
					sort_by?.data?.value,
				);
				let temp_obj: any = {};
				for (let i = 0; i < temp_data?.facets?.file_types?.buckets?.length; i++) {
					temp_obj[`${temp_data?.facets?.file_types?.buckets[i].key}`] = {
						id: `${temp_data?.facets?.file_types?.buckets[i].key}`,
						data: {
							label:
								`${content_type_to_extension[`${temp_data?.facets?.file_types?.buckets[i].key}`]}`?.length > 0
									? `${content_type_to_extension[`${temp_data?.facets?.file_types?.buckets[i].key}`]}`?.toUpperCase()
									: 'Folders',
							value: `${temp_data?.facets?.file_types?.buckets[i].key}`,
						},
					};
				}
				temp_obj.all_files = {
					id: 'all_files',
					data: {
						label: 'All Files',
						value: '',
					},
				};
				set_file_type_facets(temp_obj);
				let data: any = Object.values(temp_data?.hits);

				data.length > 0 && set_data_present(true);
				set_sub_folder_data(_.filter(data, (val: any) => val.is_folder));
				set_files_data(_.filter(data, (val: any) => !val.is_folder));
			} catch (err) {
				console.error(err);
			}
			set_content_loading(false);
		}
	}
	async function get_files_data_based_on_search() {
		if (user_data?.id && user_data?.tenant_id && search?.length > 0) {
			set_content_loading(true);
			try {
				const search_term = searchParams.get('type') || '';
				let temp_data: any = await driveApis.get_search_data(
					parent_folder_data?.id ? parent_folder_data?.id : '',
					search,
					created_on_filter?.data?.value,
					search_term,
					file_type?.data?.value,
					sort_by?.data?.value,
				);
				let temp_obj: any = {};
				for (let i = 0; i < temp_data?.facets?.file_types?.buckets?.length; i++) {
					temp_obj[`${temp_data?.facets?.file_types?.buckets[i].key}`] = {
						id: `${temp_data?.facets?.file_types?.buckets[i].key}`,
						data: {
							label:
								`${content_type_to_extension[`${temp_data?.facets?.file_types?.buckets[i].key}`]}`?.length > 0
									? `${content_type_to_extension[`${temp_data?.facets?.file_types?.buckets[i].key}`]}`?.toUpperCase()
									: 'Folders',
							value: `${temp_data?.facets?.file_types?.buckets[i].key}`,
						},
					};
					// temp_obj[`${temp_data?.facets?.file_types?.buckets[i].key}`] = {
					//  id: `${temp_data?.facets?.file_types?.buckets[i].key}`,
					//  data: {
					//      label: `${temp_data?.facets?.file_types?.buckets[i].key}`,
					//      value: `${temp_data?.facets?.file_types?.buckets[i].key}`,
					//  },
					// };
				}
				temp_obj.all_files = {
					id: 'all_files',
					data: {
						label: 'All Files',
						value: '',
					},
				};
				set_file_type_facets(temp_obj);
				let data: any = Object.values(temp_data?.hits);
				set_search_data(data);
			} catch (err) {
				console.error(err);
			}
			set_content_loading(false);
		}
	}
	const file_stack_options = {
		onOpen: () => set_upload_modal_open(true),
		onClose: () => set_upload_modal_open(false),
		fromSources: ['local_file_system'],
		onUploadDone: async (data: any) => {
			let uploadedFiles = data?.filesUploaded;
			let filesFailed = data?.filesFailed;
			let temp = upload_data;
			let newFileTemp: File_Object[] = [];
			for (let ele of uploadedFiles) {
				let newFile: any = await driveApis.create_new_file(
					user_data.id,
					user_data.tenant_id,
					parent_folder_data?.id ? parent_folder_data?.id : user_data.id,
					ele.filename,
					ele.originalFile.type,
					ele.originalFile.size,
					ele.url,
					ele.handle,
				);
				newFileTemp.push(newFile);
				let indx = temp.findIndex((opt: any) => opt.uploadId === ele.uploadId);
				if (indx !== -1) temp[indx].uploadStatus = 'uploaded';
				else temp.push({ ...data, uploadStatus: 'uploaded' });
			}
			for (let ele of filesFailed) {
				let indx = temp.findIndex((opt: any) => opt.uploadId === ele.uploadId);
				if (indx !== -1) temp[indx].uploadStatus = 'failed';
				else temp.push({ ...data, uploadStatus: 'failed' });
			}
			setTimeout(() => {
				search?.length > 0 ? get_files_data_based_on_search() : get_files_data();
			}, 1000);
			set_upload_data([...temp]);
		},
		maxFiles: 100,
		onUploadStarted: (data: any) => {
			set_upload_data([...upload_data, ...data]);
			set_show_upload_cont(true);
			const file_picker_instance = document?.querySelector<HTMLElement>('.fsp-picker');
			if (file_picker_instance) {
				file_picker_instance!.style!.display = 'none';
			}
			set_show_upload_modal(true);
		},
		onFileUploadFailed: (data: any) => {
			let temp = upload_data;
			let indx = temp.findIndex((val: any) => val.uploadId === data.uploadId);
			indx !== -1 ? (temp[indx].uploadStatus = 'failed') : temp.push({ ...data, uploadStatus: 'failed' });
			set_upload_data([...temp]);
		},
		onFileUploadProgress: (fileData: any, event: any) => {
			let temp = upload_data;
			let indx = temp.findIndex((data: any) => fileData.uploadId === data.uploadId);
			if (indx !== -1) {
				temp[indx].uploadPercentage = event.totalPercent;
				temp[indx].uploadStatus = 'uploading';
			} else
				temp.push({
					...fileData,
					uploadPercentage: event.totalPercent,
					uploadStatus: 'uploading',
				});
			set_upload_data([...temp]);
		},
		uploadInBackground: true,
		disableTransformer: false,
		accept: ['image/*', 'video/*', 'audio/*', 'text/*', 'application/*', '.pdf', '.zip'],
	};

	const handle_folder_menu_export = async (file_data: any) => {
		const payload = { entity: 'assets', entity_ids: [file_data?.id], sub_entity: file_data?.is_folder ? 'folder' : 'files' };
		const response: any = await driveApis.export_files(payload);
		if (response.status_code === 200) {
			toggle_toast({ show: true, message: 'Export in progress', title: 'Exporting', status: 'success' });
			dispatch(set_notification_feedback(true));
		}
	};

	const folder_menu_options = {
		...(ability?.can(PERMISSIONS?.view_files_dam?.slug, PERMISSIONS.view_files_dam.permissionType) && {
			download: {
				id: 'download',
				data: {
					label: 'Download',
					permission: PERMISSIONS.view_files_dam,
					icon: 'IconDownload',
					handleClickFunc: async (file_data: any) => {
						toggle_toast({ show: true, message: t('PDP.useProductDetails.DownloadInProgress'), title: 'Downloading', status: 'success' });
						window.open(`${baseUrl}/folder/download/${file_data.id}`);
						// set_show_loader(true);
						// try {
						//  await download_multiple_files_api(
						//      [{ name: file_data?.file_name, file_handle: file_data?.file_key, file_type: file_data?.file_type }],
						//  );
						// } catch (err) {

						// }
						// set_show_loader(false);
					},
				},
			},
		}),
		...(ability?.can(PERMISSIONS?.access_control_dam?.slug, PERMISSIONS.view_files_dam.permissionType) && {
			user_access: {
				id: 'user_access',
				data: {
					label: 'User Access',
					icon: 'IconUserCog',
					permission: PERMISSIONS?.access_control_dam,
					handleClickFunc: (file_data: any) => {
						set_selected_file_dat_for_updation(file_data);
						set_open_manage_access_modal(true);
					},
				},
			},
		}),
		...(ability?.can(PERMISSIONS?.edit_files_dam?.slug, PERMISSIONS.view_files_dam.permissionType) && {
			renamme: {
				id: 'rename',
				data: {
					label: 'Rename',
					icon: 'IconEdit',
					permission: PERMISSIONS?.edit_files_dam,
					handleClickFunc: async (file_data: any) => {
						set_selected_file_dat_for_updation(file_data);
						set_open_rename_file_modal(true);
					},
				},
			},
		}),
		...(ability?.can(PERMISSIONS?.delete_files_dam?.slug, PERMISSIONS.view_files_dam.permissionType) && {
			delete: {
				id: 'delete',
				data: {
					label: 'Delete',
					permission: PERMISSIONS.delete_files_dam,
					icon: 'IconTrash',
					handleClickFunc: async (file_data: any) => {
						set_multi_files_delete(false);
						set_delete_file_modal(true);
						set_file_data_to_delete(file_data);
					},
				},
			},
		}),
		mail: {
			id: 'mail',
			data: {
				label: 'Mail',
				icon: 'IconMail',
				handleClickFunc: (file_data: any) => {
					set_selected_file_dat_for_updation(file_data);
					set_open_email_modal(true);
				},
			},
		},
		export: {
			id: 'export',
			data: {
				label: 'Export',
				icon: 'downloadCloud',
				handleClickFunc: handle_folder_menu_export,
			},
		},
	};
	const content_menu_options = {
		preview: {
			id: 'preview',
			data: {
				label: 'Preview',
				icon: 'IconEye',
				permission: PERMISSIONS.view_files_dam,
				handleClickFunc: (file_data: any) => {
					set_selected_file_dat_for_updation(file_data);
					set_open_file_privew_modal(true);
				},
			},
		},
		copy_link: {
			id: 'copy_link',
			data: {
				label: 'Copy Link',
				icon: 'IconCopy',
				permission: PERMISSIONS.view_files_dam,
				handleClickFunc: async (file_data: any) => {
					set_show_loader(true);
					try {
						if (isSafariBrowser()) {
							const clipboardItem = new ClipboardItem({
								'text/plain': driveApis.get_share_file_link(user_data?.tenant_id, file_data?.id).then((result: any) => {
									if (!result) {
										return new Promise(async (resolve: any) => {
											resolve(new Blob['']());
										});
									}

									const copyText = result?.sharing_file_url;
									return new Promise(async (resolve) => {
										resolve(new Blob([copyText]));
									});
								}),
							});
							navigator.clipboard.write([clipboardItem]);
						} else {
							let data: any = await driveApis.get_share_file_link(user_data?.tenant_id, file_data?.id);
							'sharing_file_url' in data && (await navigator.clipboard.writeText(data?.sharing_file_url));
						}
						set_action_message('Link copied to clipboard');
						set_open_message_modal(true);
					} catch (err) {
						console.log('ERROR WHILE SHARING DATA -> ', err);
					}
					set_show_loader(false);
				},
			},
		},
		// share_file: {
		// 	id: 'share_file',
		// 	data: {
		// 		label: 'Share File',
		// 		icon: 'IconShare',
		// 		permission: PERMISSIONS.view_files_dam,
		// 		handleClickFunc: async (file_data: any) => {
		// 			set_show_loader(true);
		// 			try {
		// 				let data: any = await driveApis.get_share_file_link(user_data?.tenant_id, file_data?.id);
		// 				'sharing_file_url' in data && (await navigator.clipboard.writeText(data?.sharing_file_url));
		// 				set_action_message('Link copied to clipboard');
		// 				set_open_message_modal(true);
		// 			} catch (err) {
		// 				// console.log('ERROR WHILE SHARING DATA -> ', err);
		// 			}
		// 			set_show_loader(false);
		// 		},
		// 	},
		// },
	};
	function handle_clear_file_selections_func() {
		let temp = files_data;
		let temp2 = search_data;
		for (let i = 0; i < files_data.length; i++) temp[i].selected = false;
		for (let i = 0; i < search_data.length; i++) temp2[i].selected = false;
		set_selected_files_count(0);
		set_files_data([...temp]);
		set_search_data([...temp2]);
		set_selected_files([]);
	}

	const handle_files_export = async () => {
		set_show_loader(true);
		// toggle_toast({ show: true, message: t('PDP.useProductDetails.DownloadInProgress'), title: 'Downloading', status: 'success' });
		try {
			// Export api
			const payload = { entity: 'assets', entity_ids: _.map(selected_files, (data: any) => data?.id), sub_entity: 'files' };
			const response: any = await driveApis.export_files(payload);
			if (response.status_code === 200) {
				toggle_toast({ show: true, message: 'Export in progress', title: 'Exporting', status: 'success' });
				dispatch(set_notification_feedback(true));
			}
		} catch (err) {
			console.error(err);
		}
		set_show_loader(false);
		handle_clear_file_selections_func();
	};

	const files_menu = [
		{
			...(ability?.can(PERMISSIONS.delete_files_dam.slug, PERMISSIONS.delete_files_dam.permissionType) && {
				icon_name: 'IconTrash',
				tool_tip_name: 'Delete',
				handle_menu_click_func: async () => {
					set_multi_files_delete(true);
					set_delete_file_modal(true);
				},
			}),
		},
		{
			...(ability?.can(PERMISSIONS.access_control_dam.slug, PERMISSIONS.access_control_dam.permissionType) && {
				icon_name: 'IconUserCog',
				tool_tip_name: 'Manage Access',
				handle_menu_click_func: () => set_open_manage_access_modal(true),
			}),
		},
		{
			icon_name: 'IconMail',
			tool_tip_name: 'Mail',
			handle_menu_click_func: () => set_open_email_modal(true),
		},
		// {
		// 	icon_name: 'IconShare',
		// 	tool_tip_name: 'Share',
		// 	handle_menu_click_func: async () => {
		// 		set_show_loader(true);
		// 		let data = extract_data_from_response(
		// 			await driveApis.get_multiple_file_links(selected_files.map((opt: any) => ({ file_id: opt?.id, tenant_id: opt?.tenant_id }))),
		// 		);
		// 		let copy_string = '';
		// 		for (let i = 0; i < data.length; i++) {
		// 			copy_string += `${data[i]},`;
		// 		}
		// 		copy_string = copy_string.length > 0 ? copy_string.substring(0, copy_string.length - 1) : copy_string;
		// 		await navigator.clipboard.writeText(copy_string);
		// 		set_show_loader(false);
		// 		set_action_message('Links Copied!');
		// 		set_open_message_modal(true);
		// 		handle_clear_file_selections_func();
		// 	},
		// },
		{
			icon_name: 'IconDownload',
			tool_tip_name: 'Download',
			handle_menu_click_func: async () => {
				set_show_loader(true);
				toggle_toast({ show: true, message: t('PDP.useProductDetails.DownloadInProgress'), title: 'Downloading', status: 'success' });
				try {
					download_multiple_files_api(
						selected_files.map((data: any) => ({ name: data?.file_name, file_handle: data?.file_key, file_type: data?.file_type })),
					);
				} catch (err) {}
				set_show_loader(false);
				handle_clear_file_selections_func();
			},
		},
		{
			icon_name: 'downloadCloud',
			tool_tip_name: 'Export',
			handle_menu_click_func: handle_files_export,
		},
	];
	const handle_user_info = () => {
		settings
			.get_general_settings()
			.then((res: any) => {
				if (res?.status === 200) {
					set_user_detail(res?.data);
				}
			})
			.catch((err: any) => {
				console.error(err);
			});
	};

	const update_selected_files = () => {
		let temp = search?.length > 0 ? search_data : files_data;
		temp = _.map(temp, (data: any) => ({ ...data, selected: true }));
		set_selected_files(temp);
		set_selected_files_count(temp.length);
		if (search?.length > 0) {
			set_search_data([...temp]);
		} else {
			set_files_data([...temp]);
		}
	};

	const selected_files_menu = files_menu.filter((item) => Object.keys(item).length !== 0);

	const compute_file_links_to_share = () => {
		let temp = search.length > 0 ? _.filter(search_data, (opt: any) => opt?.selected) : _.filter(files_data, (opt: any) => opt?.selected);
		let temp_data = temp.map((data: any) => ({
			fileLink: `${baseUrl}/folder/download/${data?.id}`,
			txt: data?.file_name,
		}));
		set_files_link_to_share(temp_data);
	};
	async function handle_delete_file_func(file_id: any) {
		return new Promise(async (resolve) => {
			try {
				await driveApis.delete_folder(file_id);
				set_sub_folder_data(_.filter(sub_folder_data, (item) => item.id !== file_id));
				set_files_data(_.filter(files_data, (item) => item.id !== file_id));
				set_search_data(_.filter(search_data, (item) => item.id !== file_id));
				set_action_message('Assets Deleted!');
				set_open_message_modal(true);
			} catch (err) {
				console.log('ERROR WHILE DELETING FILE --> ', err);
			}
			resolve('success');
		});
	}

	useEffect(() => {
		if (data_present === false) get_files_data();
		dispatch(updateBreadcrumbs(breadCrumbList));
		handle_user_info();
	}, []);
	useEffect(() => {
		if (data_present === false && user_data !== null && user_data !== undefined) get_files_data();
	}, [user_data]);
	useEffect(() => {
		let clear_open_message_timeout = setTimeout(() => {
			set_open_message_modal(false);
		}, 2000);
		return () => clearTimeout(clear_open_message_timeout);
	}, [open_message_modal]);
	useEffect(() => {
		if (selected_files_count > 0) {
			compute_file_links_to_share();
		}
	}, [selected_files_count]);
	useEffect(() => {
		set_created_on_filter({
			id: 'all_time',
			data: {
				label: 'All time',
				value: () => {
					return {};
				},
			},
		});
		set_file_type({
			id: 'all_files',
			data: {
				label: 'All Files',
				value: '',
			},
		});
		set_sort_by({
			id: 'time_asc',
			data: {
				label: 'Last modified: New to Old',
				value: 'time_asc',
			},
		});
		set_file_type_facets(null);
		set_sub_folder_data([]);
		set_files_data([]);
		navigate('/user-drive');
		get_files_data();
	}, [parent_folder_data]);
	useEffect(() => {
		set_search(searchParams.get('search') || '');
		if (search?.length === 0) set_search_data([]);

		let search_debounce: any = null;
		search_debounce = setTimeout(() => {
			set_content_loading(true);
			handle_clear_file_selections_func();
			search?.length > 0 ? get_files_data_based_on_search() : get_files_data();
		}, 500);

		return () => clearTimeout(search_debounce);
	}, [search, searchParams]);
	useEffect(() => {
		if (search?.length > 0) get_files_data_based_on_search();
		else get_files_data();
	}, [file_type, sort_by, created_on_filter]);

	return (
		<Box position='relative'>
			{show_loader && (
				<Box className={classes.loader_container}>
					<Lottie
						options={{
							loop: true,
							autoplay: true,
							animationData: LoaderLottie,
							rendererSettings: {
								preserveAspectRatio: 'xMidYMid slice',
							},
						}}
						width={200}
						height={200}
					/>
				</Box>
			)}
			<UpperHeader
				showBack={visited_folder_data.length > 0}
				headerName={parent_folder_data ? parent_folder_data?.file_name : 'Files'}
				client={file_stack_client?.file_stack_client}
				options={file_stack_options}
				set_open_create_folder_modal={set_open_create_folder_modal}
				upload_modal_open={upload_modal_open}
				visited_folder_data={visited_folder_data}
				set_parent_folder_data={(val: any) => {
					set_parent_folder_data(val);
				}}
				set_visited_folder_data={set_visited_folder_data}
				search={search}
				set_search={set_search}
				handle_clear_file_selections_func={handle_clear_file_selections_func}
				data_present={data_present}
			/>
			{(search?.length > 0 || files_data?.length > 0 || sub_folder_data?.length > 0 || created_on_filter !== null) && (
				<>
					<FilterSection
						created_on_filter={created_on_filter}
						set_created_on_filter={set_created_on_filter}
						file_type={file_type}
						set_file_type={set_file_type}
						sort_by={sort_by}
						set_sort_by={set_sort_by}
						file_type_facets={file_type_facets}
					/>
				</>
			)}
			{search?.length === 0 && files_data?.length === 0 && sub_folder_data?.length === 0 && !content_loading && (
				<Box className={classes.empty_screen}>
					<Box className={classes.empty_container}>
						<Image src={ImageLinks.no_data} width={300} height={300} />
						<CustomText type='H1' style={{ fontSize: '24px' }}>
							{t('Files.Title1')}
						</CustomText>
						<CustomText type='Title'>{t('Files.Title2')}</CustomText>

						<Can I={PERMISSIONS.create_files_dam.slug} a={PERMISSIONS.view_files_dam.permissionType}>
							<Box sx={{ display: 'flex' }}>
								<Button variant='outlined' sx={{ marginRight: 1 }} onClick={() => set_open_create_folder_modal(true)}>
									{t('Files.Folder')}
								</Button>
								<Button
									variant='contained'
									onClick={async () => {
										file_stack_client?.file_stack_client?.picker(file_stack_options).open();
									}}>
									<Icon iconName='IconCloudUpload' color={theme?.user_drive?.user_drive_main?.icon_color} sx={{ marginRight: 1 }} />
									{t('Files.Upload')}
								</Button>
							</Box>
						</Can>
					</Box>
				</Box>
			)}
			{selected_files_count > 0 && (
				<Box className={classes.selected_header_container}>
					<Box className={classes.selected_header}>
						<CustomText type='Body' color={theme?.user_drive?.user_drive_main?.custom_text_color}>
							{selected_files_count} items selected
						</CustomText>
						<Box
							sx={{ alignItems: 'center', display: 'flex', marginLeft: '1vw', cursor: 'pointer' }}
							onClick={handle_clear_file_selections_func}>
							<Icon iconName='IconCircleX' color={theme?.user_drive?.user_drive_main?.box_icon_color} sx={{ marginRight: 1 }} />
							<CustomText color={theme?.user_drive?.user_drive_main?.box_custom_color} type='Subtitle'>
								{t('Files.Clear')}
							</CustomText>
						</Box>
						<Box className={classes.icons_container}>
							{selected_files_menu.map((data: any, indx: number) => (
								<div style={{ marginLeft: '1vw' }} key={`item-${indx}`}>
									<Tooltip title={data?.tool_tip_name} arrow>
										<div>
											<Icon
												key={indx}
												sx={{ cursor: 'pointer' }}
												iconName={data?.icon_name}
												color={theme?.user_drive?.user_drive_main?.tool_icon_color}
												onClick={() => data?.handle_menu_click_func()}
											/>
										</div>
									</Tooltip>
								</div>
							))}
						</Box>
					</Box>
				</Box>
			)}
			<Box className={classes.folders_container}>
				{search.length === 0 || (search.length > 0 && (search_data.length > 0 || content_loading)) ? (
					<>
						{((search.length < 1 && sub_folder_data?.length > 0) ||
							(search_data.length > 0 && _.filter(search_data, (alt) => alt?.is_folder)?.length > 0) ||
							content_loading) && (
							<Box width='100%' mt={1.4}>
								<CustomText type='Body' color={theme?.user_drive?.user_drive_main?.custom_text_color}>
									Showing {search?.length > 0 ? _.filter(search_data, (alt) => alt?.is_folder)?.length : sub_folder_data?.length} folders
								</CustomText>
								<Grid className={classes.folders} sx={{ gridTemplateColumns: screen?.width > 1200 ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr' }}>
									{(!content_loading
										? search?.length > 0
											? _.filter(search_data, (alt) => alt?.is_folder)
											: sub_folder_data
										: ['', '', '', '']
									).map((data: any, indx: number) => {
										if (content_loading)
											return (
												<Grid className={classes.folder_skeleton} key={`item-${indx}`}>
													<Skeleton width={20} height={20} variant='circular' />
													<Skeleton width={'70%'} height={20} variant='rounded' />
												</Grid>
											);
										else
											return (
												<FolderComponent
													key={indx}
													data={data}
													indx={indx}
													content_menu_options={folder_menu_options}
													visited_folder_data={visited_folder_data}
													set_parent_folder_data={set_parent_folder_data}
													set_visited_folder_data={set_visited_folder_data}
													handle_clear_file_selections_func={handle_clear_file_selections_func}
													set_search={set_search}
												/>
											);
									})}
								</Grid>
							</Box>
						)}
						{((search.length < 1 && files_data?.length > 0) ||
							(search_data.length > 0 && _.filter(search_data, (alt) => !alt?.is_folder)?.length > 0) ||
							content_loading) && (
							<Box width='100%' mt={1.4}>
								<Grid container alignItems={'center'} flexDirection={'row'} gap={1}>
									<CustomText type='Body' color='#636364'>
										Showing {search?.length > 0 ? _.filter(search_data, (alt) => !alt?.is_folder)?.length : files_data?.length} files
									</CustomText>
									<SelectAll
										files={search?.length > 0 ? _.filter(search_data, (alt) => !alt?.is_folder) : files_data}
										selected_files={selected_files}
										update_selected_files={update_selected_files}
										handle_clear_file_selections={handle_clear_file_selections_func}
									/>
								</Grid>
								<OptimizedGrid
									content_loading={content_loading}
									search={search}
									search_data={search_data}
									files_data={files_data}
									folder_menu_options={folder_menu_options}
									content_menu_options={content_menu_options}
									set_files_data={set_files_data}
									set_selected_files_count={set_selected_files_count}
									selected_files={selected_files}
									set_selected_files={set_selected_files}
									selected_files_count={selected_files_count}
									handle_clear_file_selections_func={handle_clear_file_selections_func}
								/>
							</Box>
						)}
					</>
				) : (
					<NoProducts reset_filter_click={() => navigate('/user-drive')} is_filter_applied={false} />
				)}
			</Box>
			{open_manage_access_modal && (
				<ManageAcessModal2
					open_manage_access_modal={open_manage_access_modal}
					set_open_manage_access_modal={(val: boolean) => {
						set_open_manage_access_modal(val);
					}}
					selected_file_dat_for_updation={selected_file_dat_for_updation}
					selected_files={selected_files}
					set_show_loader={set_show_loader}
					parent_id={parent_folder_data?.id ? parent_folder_data?.id : user_data?.id}
				/>
			)}
			{upload_data?.length > 0 && show_upload_cont && (
				<UploadModal
					show_upload_modal={show_upload_modal}
					set_show_upload_modal={set_show_upload_modal}
					set_open_cancel_upload_modal={(val: boolean) => {
						val;
						if (upload_modal_open) {
							const file_picker_instance = document?.querySelector<HTMLElement>('.fsp-picker');
							console.log('REF IS  -> ', file_picker_instance);
							if (file_picker_instance) {
								file_picker_instance!.style!.display = 'flex';
							}
						} else {
							set_show_upload_cont(false);
						}
					}}
					upload_data={upload_data}
				/>
			)}
			<CreateFolderModal
				open_create_folder_modal={open_create_folder_modal}
				set_open_create_folder_modal={set_open_create_folder_modal}
				set_sub_folder_data={set_sub_folder_data}
				parentId={parent_folder_data?.id ? parent_folder_data?.id : user_data?.id}
				set_action_message={set_action_message}
				set_open_message_modal={set_open_message_modal}
				folder_data={sub_folder_data}
			/>
			<WarningModal
				open_warn_modal={delete_file_modal}
				set_open_warn_modal={set_delete_file_modal}
				header_txt={file_data_to_delete?.is_folder ? 'Delete folder' : 'Delete file'}
				modal_text='Are you sure you want to delete this asset?'
				butt_lft_txt='Cancel'
				butt_rght_txt='Delete'
				butt_lft_func={() => {
					set_delete_file_modal(false);
				}}
				butt_rght_func={async (set_butt_rght_loading) => {
					set_butt_rght_loading(true);
					if (multi_files_delete) {
						let temp = selected_files.map((data: any) => ({
							file_id: data?.id,
							file_handle: data?.file_key,
							parent_id: parent_folder_data === null ? user_data?.id : parent_folder_data?.id,
						}));
						try {
							await driveApis.delete_multiple_files(temp);
							setTimeout(() => {
								search?.length > 0 ? get_files_data_based_on_search() : get_files_data();
							}, 1000);
							set_selected_files_count(0);
							set_action_message('Assets Deleted!');
							set_open_message_modal(true);
							handle_clear_file_selections_func();
						} catch (err) {}
					} else {
						await handle_delete_file_func(file_data_to_delete?.id);
					}
					set_butt_rght_loading(false);
					set_delete_file_modal(false);
				}}
			/>
			{open_email_modal && (
				<EmailModal
					open_email_modal={open_email_modal}
					user_info={user_detail}
					set_open_email_modal={set_open_email_modal}
					file_links_to_share={
						selected_files_count
							? files_link_to_share
							: [
									{
										fileLink: `${baseUrl}/folder/download/${selected_file_dat_for_updation?.id}`,
										txt: selected_file_dat_for_updation?.file_name,
									},
							  ]
					}
					set_action_message={set_action_message}
					set_show_action_icon={set_show_action_icon}
					set_open_message_modal={set_open_message_modal}
				/>
			)}
			<FilePreviewModal
				open_file_privew_modal={open_file_privew_modal}
				set_open_file_privew_modal={set_open_file_privew_modal}
				file_data={selected_file_dat_for_updation}
				set_show_loader={set_show_loader}
				set_action_message={set_action_message}
				set_open_message_modal={set_open_message_modal}
				user_data={user_data}
				set_selected_file_dat_for_updation={set_selected_file_dat_for_updation}
				set_open_manage_access_modal={set_open_manage_access_modal}
				set_open_email_modal={set_open_email_modal}
				toggle_toast={toggle_toast}
			/>
			{open_rename_file_modal && (
				<RenameFileModal
					default_val={selected_file_dat_for_updation?.file_name ? selected_file_dat_for_updation.file_name : ''}
					open_rename_upload_modal={open_rename_file_modal}
					set_open_rename_upload_modal={set_open_rename_file_modal}
					handle_rename_function={async (val: string) => {
						if (val.trim()?.length <= 0) {
							set_action_message('Please Enter a Folder Name!!');
							set_open_message_modal(true);
							return;
						}
						if (val?.length === 0) {
							selected_file_dat_for_updation?.is_folder
								? set_action_message('Please Enter a Folder Name!!')
								: set_action_message('Please Enter a File Name!!');
							set_open_message_modal(true);
							return;
						}
						if (sub_folder_data?.findIndex((opt: any) => opt?.file_name === val) !== -1) {
							set_action_message('Folder with same name already exist !!');
							set_open_message_modal(true);
							return;
						}
						try {
							await driveApis.rename_folder(
								user_data.id,
								user_data.tenant_id,
								selected_file_dat_for_updation.parent_id,
								val.trim(),
								selected_file_dat_for_updation.id,
							);
							// let indx1 = sub_folder_data.findIndex((opt: any) => opt.id === selected_file_dat_for_updation.id);
							// let indx2 = files_data.findIndex((opt: any) => opt.id === selected_file_dat_for_updation.id);
							// let indx3 = search_data.findIndex((opt: any) => opt.id === selected_file_dat_for_updation.id);
							// if (indx1 !== -1) {
							//  let temp = sub_folder_data;
							//  temp[indx1].file_name = val;
							//  set_sub_folder_data([...temp]);
							// }
							// if (indx2 !== -1) {
							//  let temp = files_data;
							//  temp[indx2].file_name = val;
							//  set_files_data([...temp]);
							// }
							// if (indx3 !== -1) {
							//  let temp = search_data;
							//  temp[indx2].file_name = val;
							//  set_search_data([...temp]);
							// }
							setTimeout(() => {
								search?.length > 0 ? get_files_data_based_on_search() : get_files_data();
							}, 1000);
							set_open_rename_file_modal(false);
						} catch (err) {
							console.log('ERROR WHILE UPDATING FILE -> ', err);
						}
					}}
					selected_file_dat_for_updation={selected_file_dat_for_updation}
				/>
			)}
			<MessageModal show_action_icon={show_action_icon} open_message_modal={open_message_modal} message={action_message} />
			{toast.show && (
				<CustomToast
					open={toast.show}
					showCross={true}
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					show_icon={true}
					is_custom={false}
					autoHideDuration={1000}
					onClose={() => toggle_toast({ show: false, message: '', title: '', status: '' })}
					state={toast.status}
					title={toast.title}
					subtitle={toast.message}
					showActions={false}
				/>
			)}
		</Box>
	);
};
export default UserDrive;
