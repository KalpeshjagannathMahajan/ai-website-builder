import { Box, Slide } from '@mui/material';
import ImageLinks from 'src/assets/images/ImageLinks';
import { Icon, Image } from 'src/common/@the-source/atoms';
import Menu from 'src/common/Menu';
import driveApis from 'src/utils/api_requests/userDriveApis';
import { baseUrl } from '../utils/apis';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import PdfViewer from './PdfViewer';
import { PERMISSIONS } from 'src/casl/permissions';
import ability from 'src/casl/ability';
import { t } from 'i18next';
import CustomText from 'src/common/@the-source/CustomText';
import useStyles from './../css/PreviewStyle';

interface PreviewProps {
	open_file_privew_modal: boolean;
	set_open_file_privew_modal: any;
	file_data: any;
	set_show_loader: any;
	set_action_message: any;
	set_open_message_modal: any;
	user_data: any;
	set_selected_file_dat_for_updation: any;
	set_open_manage_access_modal: any;
	set_open_email_modal: any;
	toggle_toast?: any;
}
export const FilePreviewModal = ({
	open_file_privew_modal,
	set_open_file_privew_modal,
	file_data,
	set_show_loader,
	set_action_message,
	set_open_message_modal,
	user_data,
	set_selected_file_dat_for_updation,
	set_open_manage_access_modal,
	set_open_email_modal,
	toggle_toast,
}: PreviewProps) => {
	const classes = useStyles();
	let file_type = file_data?.file_type;
	let show_no_preview = !(file_type?.includes('pdf') || file_type?.includes('video') || file_type?.includes('image'));
	let created_date = new Date(file_data?.created_at);
	const theme: any = useTheme();
	const [show_file_details_modal, set_show_file_details_modal] = useState(false);
	const [hovered_icon, set_hovered_icon] = useState<any>(null);
	function isSafariBrowser() {
		const userAgent = window.navigator.userAgent;
		const safari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
		return safari;
	}
	let flag = false;
	const executeClick = (val = false) => {
		if (!flag) {
			flag = true;
			setTimeout(() => {
				set_show_file_details_modal(val);
				flag = false;
			}, 400);
		}
	};

	function formatBytes(bytes = 0, decimals = 2) {
		if (!+bytes) return '0 Bytes';

		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'Kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb', 'Zb', 'Yb'];

		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
	}
	const menu_options = {
		copy_link: {
			id: 'copy_link',
			data: {
				label: 'Copy Link',
				icon: 'IconCopy',
				handleClickFunc: async () => {
					set_show_loader(true);
					try {
						if (isSafariBrowser()) {
							const clipboardItem = new ClipboardItem({
								'text/plain': driveApis.get_share_file_link(user_data?.tenant_id, file_data?.id).then((result: any) => {
									if (!result) {
										return new Promise(async (resolve) => {
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
		// 		handleClickFunc: async () => {
		// 			set_show_loader(true);
		// 			try {
		// 				let data = await driveApis.get_share_file_link(user_data?.tenant_id, file_data?.id);
		// 				if ('sharing_file_url' in data) {
		// 					await navigator.clipboard.writeText(data?.sharing_file_url);
		// 					set_action_message('Link copied to clipboard');
		// 					set_open_message_modal(true);
		// 				}
		// 			} catch (err) {
		// 				// Handle error here
		// 				console.error('Error while sharing data ->', err);
		// 			}
		// 			set_show_loader(false);
		// 		},
		// 	},
		// },
		view_info: {
			id: 'view_info',
			data: {
				label: 'View info',
				icon: 'IconInfoCircle',
				handleClickFunc: async () => {
					executeClick(true);
				},
			},
		},
		...(ability?.can(PERMISSIONS?.access_control_dam?.slug, PERMISSIONS.view_files_dam.permissionType)
			? {
					user_access: {
						id: 'user_access',
						data: {
							label: 'User Access',
							icon: 'IconUserCog',
							handleClickFunc: () => {
								set_open_file_privew_modal(false);
								set_selected_file_dat_for_updation(file_data);
								set_open_manage_access_modal(true);
							},
						},
					},
			  }
			: {}),
	};

	let file_data_params = [
		{
			label: 'File name',
			data: file_data?.file_name,
		},
		{
			label: 'Location',
			data: 'Test',
		},
		{
			label: 'Size',
			data: `${formatBytes(file_data?.file_size)}`,
		},
		{
			label: 'Created on',
			data: `${created_date.getDate()} ${created_date.toLocaleString('default', { month: 'short' })}’${created_date
				?.getFullYear()
				?.toString()
				?.substring(2, 4)}`,
		},
	];

	return (
		<Slide direction='up' in={open_file_privew_modal} mountOnEnter unmountOnExit>
			<Box className={classes.preview_box} onClick={() => executeClick(false)}>
				<Box borderRadius={2} className={classes.main_box}>
					<Box className={classes.preview_info}>
						<CustomText type='H1'>{file_data?.file_name}</CustomText>
						<Icon iconName='IconX' sx={{ marginLeft: 'auto' }} onClick={() => set_open_file_privew_modal(false)} />
					</Box>
					<Box className={classes.preview_icons}>
						<Icon
							iconName='IconDownload'
							className={classes.hover_shadow_effect}
							onClick={() => {
								window.open(`${baseUrl}/folder/download/${file_data.id}`);
								toggle_toast({
									show: true,
									message: t('PDP.useProductDetails.DownloadInProgress'),
									title: 'Downloading',
									status: 'success',
								});
							}}
							color={
								hovered_icon === 'download'
									? theme?.user_drive?.file_preview?.active_hover_color
									: theme?.user_drive?.file_preview?.inactive_hover_color
							}
							onMouseEnter={() => {
								set_hovered_icon('download');
							}}
							onMouseLeave={() => {
								set_hovered_icon(null);
							}}
						/>
						<Icon
							iconName='IconMail'
							onClick={() => {
								set_open_file_privew_modal(false);
								set_selected_file_dat_for_updation(file_data);
								set_open_email_modal(true);
							}}
							className={classes.hover_shadow_effect}
							color={
								hovered_icon === 'mail'
									? theme?.user_drive?.file_preview?.active_hover_color
									: theme?.user_drive?.file_preview?.inactive_hover_color
							}
							onMouseEnter={() => {
								set_hovered_icon('mail');
							}}
							onMouseLeave={() => {
								set_hovered_icon(null);
							}}
						/>
						<Menu
							hideGreenBorder={true}
							LabelComponent={
								<Icon
									iconName='IconDotsVertical'
									className={classes.hover_shadow_effect}
									color={
										hovered_icon === 'menu'
											? theme?.user_drive?.file_preview?.active_hover_color
											: theme?.user_drive?.file_preview?.inactive_hover_color
									}
									onMouseEnter={() => {
										set_hovered_icon('menu');
									}}
									onMouseLeave={() => {
										set_hovered_icon(null);
									}}
								/>
							}
							closeOnItemClick={true}
							commonMenuOnClickHandler={(val: any) => {
								// set_file_type(val);
								val;
							}}
							commonMenuComponent={(_item: any) => {
								return (
									<div className={classes.container} onClick={() => _item.data.handleClickFunc(file_data)}>
										<CustomText style={{ alignItems: 'center', display: 'flex' }} color={theme?.palette?.colors?.black_8}>
											<Icon iconName={_item?.data?.icon} sx={{ marginRight: 1 }} /> {_item.data.label}
										</CustomText>
									</div>
								);
							}}
							menu={Object.values(menu_options)}
						/>
						{show_file_details_modal && (
							<Box className={classes.details}>
								<Box display='flex' flexDirection='column'>
									{file_data_params.map((data, indx) => (
										<Box className={classes.file_label} key={`item-${indx}`}>
											<CustomText type='Title' className={classes.file_data} color={theme?.user_drive?.file_preview?.custom_text_color}>
												{data?.label}
											</CustomText>
											<CustomText type='Title' className={classes.file_data}>
												{data?.data}
											</CustomText>
										</Box>
									))}
								</Box>
							</Box>
						)}
					</Box>
					<div id='content-display-cont'>
						{show_no_preview && (
							<Box className={classes.no_preview}>
								<Image src={ImageLinks.no_preview} width={200} height={200} />
								<CustomText type='Body'>{t('Files.PreviewUnavailable')}</CustomText>
							</Box>
						)}
						{file_type?.includes('pdf') && <PdfViewer file_url={file_data?.url} />}
						{file_type?.includes('video') && (
							<Box className={classes.video}>
								<video src={file_data?.url} controls className={classes.video_info} />
							</Box>
						)}
						{file_type?.includes('image') && <Image src={file_data?.url} imgClass={classes.image} />}
					</div>
				</Box>
			</Box>
		</Slide>
	);
};
