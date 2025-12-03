/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Typography, TextField, Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import DropZone from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/DropZone';
import { Button, Grid, Icon, Drawer, Checkbox } from 'src/common/@the-source/atoms';
import { useEffect, useState } from 'react';
import api_requests from 'src/utils/api_requests';
import PreviewImage from '../Common/PreviewImage';
import CustomText from 'src/common/@the-source/CustomText';
import AttributesComp from '../Common/Drawer/AttributesComp';
import settings from 'src/utils/api_requests/setting';
import _ from 'lodash';
import constants from 'src/utils/constants';

const { DATA_TYPES } = constants;

interface AddEditLabelsProps {
	open: boolean;
	pre_data: any;
	set_open: (state: boolean) => void;
	set_pre_data: (state: any) => void;
	set_refetch_data: (state: boolean | ((prevState: boolean) => boolean)) => void;
}

const extractFileIdFromUrl = (url: string) => {
	if (!url || typeof url !== DATA_TYPES.STRING) return null;
	const fileIdMatch = url?.match(/file\/([a-zA-Z0-9_-]+)/);
	return fileIdMatch ? fileIdMatch[1] : null;
};

const useStyles = makeStyles(() => ({
	drawerContent: {
		background: '#fff',
		display: 'flex',
		width: '480px',
		flexDirection: 'column',
		height: '100vh',
	},
	header: {
		padding: '8px 16px',
	},
	scrollableContent: {
		flexGrow: 1,
		overflowY: 'auto',
		scrollbarWidth: 'none',
		'&::-webkit-scrollbar': {
			width: '0.4em',
		},
		'&::-webkit-scrollbar-thumb': {
			backgroundColor: 'transparent',
		},
	},
	scrollableBody: {
		maxHeight: 'calc(100%)',
		padding: '10px 10px 10px 0px',
		overflowY: 'auto',
	},
	buttonsContainer: {
		padding: 16,
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	inputField: {
		marginBottom: '2rem',
	},
	dashedDivider: {
		border: '1px dashed #D1D6DD',
		margin: '2rem 0',
	},
}));

const AddEditLabelDrawer = ({ open, pre_data, set_open, set_pre_data, set_refetch_data }: AddEditLabelsProps) => {
	const { VITE_APP_API_URL } = import.meta.env;
	const [data, set_data] = useState<any>({
		is_active: true,
	});
	const [upload_loader, set_upload_loader] = useState(false);
	const [uploaded_files, set_uploaded_files] = useState<any>({});
	const [attributes, set_attributes] = useState<any[]>([]);
	const [all_attributes, set_all_attributes] = useState<any[]>([]);
	const [errors, set_errors] = useState({
		name: '',
		template_id: '',
	});
	const classes = useStyles();

	useEffect(() => {
		if (Object.keys(pre_data).length > 0) {
			set_data({ ...pre_data });
		}
		const filtered_attr_list = _.filter(pre_data?.attributes, (attr_id: string) => _.find(all_attributes, { value: attr_id })) || [];
		set_attributes(filtered_attr_list);
	}, [pre_data, all_attributes]);

	const handle_get_all_attributes_data = () => {
		settings
			.get_all_attributes('product')
			.then((res: any) => {
				set_all_attributes(_.map(res?.data, (attribute: any) => ({ value: attribute.id, label: attribute.name })));
			})
			.catch((err: Error) => {
				console.log(err);
			});
	};

	useEffect(() => {
		handle_get_all_attributes_data();
	}, []);

	const handle_added_files = async (files: any, type: string) => {
		if (!files) {
			return;
		}

		let prev_value = data?.[type] || [];

		const updated_progress_data = [...prev_value];
		const uploaded_file_payload = [...prev_value];

		try {
			for (const file of files) {
				if (!file) {
					continue;
				}
				set_upload_loader(true);
				const url = URL.createObjectURL(file);
				const form_data: any = new FormData();
				form_data.append('file', file);

				const file_progress_data = {
					id: `temp_${crypto?.randomUUID()}`,
					status: 'published',
					raw_data: {
						image_url: url,
						date: file?.lastModifiedDate,
						file_name: file?.name,
						loading: 0,
					},
				};

				updated_progress_data.push(file_progress_data);

				const config = {
					headers: { 'content-type': 'multipart/form-data' },
					onUploadProgress: ({ loaded, total }: any) => {
						let percent = Math.round((loaded / total) * 100);
						file_progress_data.raw_data.loading = percent > 90 ? 90 : percent;
						set_uploaded_files((prev: any) => {
							return { ...prev, [type]: [...updated_progress_data] };
						});
					},
				};

				const response: any = await api_requests.buyer.add_image(form_data, config);

				if (response?.status === 200) {
					const obj = {
						id: `temp_${crypto?.randomUUID()}`,
						status: 'published',
						raw_data: {
							image_url: url,
							file_id: response?.id,
							date: file?.lastModifiedDate,
							file_name: file?.name,
						},
					};
					file_progress_data.raw_data.loading = 100;
					uploaded_file_payload.push(obj);
				}
			}
		} catch (error) {
			console.log(error);
		} finally {
			set_upload_loader(false);
			set_data((prev_data: any) => {
				return { ...prev_data, [type]: [...uploaded_file_payload] };
			});
		}
	};

	const handle_upload = (file: any, type: string) => {
		handle_added_files(file, type);
	};

	const onClose = () => {
		set_open(false);
		set_pre_data({});
		set_data({});
		set_uploaded_files({});
		set_attributes([]);
		set_errors({
			name: '',
			template_id: '',
		});
	};

	const handle_save = () => {
		const sample_file_id = data?.sample_file?.[0]?.raw_data?.file_id || extractFileIdFromUrl(data?.sample_file);
		const company_logo_id = data?.img_logo?.[0]?.raw_data?.file_id || extractFileIdFromUrl(data?.img_logo);
		const preview_img = data?.preview_img?.[0]?.raw_data?.file_id || extractFileIdFromUrl(data?.preview_img);
		const thumbnail_img_url = data?.thumbnail_img_url?.[0]?.raw_data?.file_id || extractFileIdFromUrl(data?.thumbnail_img_url);

		if (!data?.name) {
			set_errors((prev: any) => {
				return { ...prev, name: 'This field is required' };
			});

			return;
		}

		if (!data?.template_id) {
			set_errors((prev: any) => {
				return { ...prev, template_id: 'This field is required' };
			});

			return;
		}

		const payload = {
			...data,
			attributes,
			is_default: data?.is_default ?? false,
			type: 'BARCODE',
			img_logo: company_logo_id ? `${VITE_APP_API_URL}/artifact/v1/file/${company_logo_id}` : '',
			sample_file: sample_file_id ? `${VITE_APP_API_URL}/artifact/v1/file/${sample_file_id}` : '',
			preview_img: preview_img ? `${VITE_APP_API_URL}/artifact/v1/file/${preview_img}` : '',
			thumbnail_img_url: thumbnail_img_url ? `${VITE_APP_API_URL}/artifact/v1/file/${thumbnail_img_url}` : '',
		};

		if (data?.id) {
			settings
				.update_labels(payload)
				.then((res: any) => {
					if (res?.status === 200) {
						onClose();
						set_refetch_data((prev: boolean) => !prev);
					}
				})
				.catch((err: any) => {
					console.log(err);
				});
		} else {
			settings
				.post_labels(payload)
				.then((res: any) => {
					if (res?.status === 200) {
						onClose();
						set_refetch_data((prev: boolean) => !prev);
					}
				})
				.catch((err: any) => {
					console.log(err);
				});
		}
	};

	const drawer_content = () => {
		return (
			<Box className={classes.drawerContent}>
				{/* Header */}
				<Grid container mt={1} className={classes.header} justifyContent='space-between'>
					<Grid item>
						<Typography variant='h6'>Add label</Typography>
					</Grid>
					<Grid item>
						<Icon iconName='IconX' onClick={onClose} />
					</Grid>
				</Grid>
				<Divider sx={{ mt: 1 }} />
				{/* Body (Scrollable) */}
				<Box pl={2} mt={2} className={classes.scrollableContent}>
					<div className={classes.scrollableBody}>
						<TextField
							required
							name='name'
							label='Label name'
							fullWidth
							variant='outlined'
							value={data?.name || ''}
							onChange={(e) => set_data({ ...data, name: e.target.value })}
							className={classes.inputField}
							helperText={errors?.name}
							error={Boolean(errors?.name)}
						/>
						<TextField
							required
							name='template_id'
							type='number'
							label='Label ID'
							fullWidth
							variant='outlined'
							value={data?.template_id || ''}
							onChange={(e) => set_data({ ...data, template_id: e.target.value })}
							className={classes.inputField}
							helperText={errors?.template_id}
							error={Boolean(errors?.template_id)}
						/>
						<TextField
							label='Size'
							name='size'
							fullWidth
							variant='outlined'
							value={data?.size || ''}
							onChange={(e) => set_data({ ...data, size: e.target.value })}
							className={classes.inputField}
						/>
						<Box mb={3}>
							<CustomText type='Body' color='#4F555E' style={{ marginBottom: '12px' }}>
								Company logo
							</CustomText>
							{uploaded_files?.img_logo?.length > 0 || data?.img_logo ? (
								<PreviewImage
									current_value={uploaded_files?.img_logo}
									data={data}
									type='img_logo'
									set_data={set_data}
									set_uploaded_files={set_uploaded_files}
								/>
							) : (
								<DropZone handle_upload={(e) => handle_upload(e, 'img_logo')} title='Add Company Logo' sub_title='File Type: JPEG/PNG' />
							)}
						</Box>
						<Box mb={3}>
							<CustomText type='Body' color='#4F555E' style={{ marginBottom: '12px' }}>
								Sample file
							</CustomText>
							{uploaded_files?.sample_file?.length > 0 || data?.sample_file ? (
								<PreviewImage
									current_value={uploaded_files?.sample_file}
									data={data}
									type='sample_file'
									set_data={set_data}
									set_uploaded_files={set_uploaded_files}
								/>
							) : (
								<DropZone handle_upload={(e) => handle_upload(e, 'sample_file')} title='Add Sample File' sub_title='File Type: JPEG/PNG' />
							)}
						</Box>
						<Box mb={3}>
							<CustomText type='Body' color='#4F555E' style={{ marginBottom: '12px' }}>
								Preview Image
							</CustomText>
							{uploaded_files?.preview_img?.length > 0 || data?.preview_img ? (
								<PreviewImage
									current_value={uploaded_files?.preview_img}
									data={data}
									type='preview_img'
									set_data={set_data}
									set_uploaded_files={set_uploaded_files}
								/>
							) : (
								<DropZone
									handle_upload={(e) => handle_upload(e, 'preview_img')}
									title='Add Preview Image'
									sub_title='File Type: JPEG/PNG'
								/>
							)}
						</Box>
						<Box mb={3}>
							<CustomText type='Body' color='#4F555E' style={{ marginBottom: '12px' }}>
								Thumbnail Image
							</CustomText>
							{uploaded_files?.thumbnail_img_url?.length > 0 || data?.thumbnail_img_url ? (
								<PreviewImage
									current_value={uploaded_files?.thumbnail_img_url}
									data={data}
									type='thumbnail_img_url'
									set_data={set_data}
									set_uploaded_files={set_uploaded_files}
								/>
							) : (
								<DropZone
									handle_upload={(e) => handle_upload(e, 'thumbnail_img_url')}
									title='Add Thumbnail Image'
									sub_title='File Type: JPEG/PNG '
								/>
							)}
						</Box>
						<div className={classes.dashedDivider} />
						<Box>
							<AttributesComp attributes={attributes} set_attributes={set_attributes} attributes_list={all_attributes} />
						</Box>
					</div>
				</Box>
				{/* Footer */}
				<Divider sx={{ mt: 1 }} />
				<Box className={classes.buttonsContainer}>
					<Box display='flex' alignItems='center'>
						{/* Add Checkbox and Text here */}
						<Checkbox
							checked={data?.is_active}
							// disabled={data?.is_default}
							onChange={(e: any) => set_data({ ...data, is_active: e.target.checked })}
						/>
						<Typography>Set as active</Typography>
					</Box>

					<Grid display='flex' gap={2}>
						<Button onClick={onClose} variant='outlined'>
							Cancel
						</Button>
						<Button disabled={upload_loader} onClick={handle_save} variant='contained'>
							Save
						</Button>
					</Grid>
				</Box>
			</Box>
		);
	};

	return <Drawer content={drawer_content()} width={480} open={open} onClose={onClose} anchor='right' />;
};

export default AddEditLabelDrawer;
