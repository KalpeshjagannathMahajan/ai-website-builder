import { Grid } from 'src/common/@the-source/atoms';
import DropZone from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/DropZone';
import Preview from './Preview';
import { useEffect, useState } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import CustomToast from 'src/common/CustomToast';
import api_requests from 'src/utils/api_requests';
const { VITE_APP_API_URL } = import.meta.env;

const toast_initial_state = { state: false, title: '', sub_title: '' };
const ExcelUpload = ({ methods, set_upload_loader, file_key, data }: any) => {
	const [show_toast, set_show_toast] = useState(toast_initial_state);
	const initial_state = data?.[file_key] ? [{ image_url: data?.[file_key] }] : null;

	const [uploaded_files, set_uploaded_files] = useState<any>({ excel_file: initial_state });

	const { setValue, watch }: any = methods;

	const excel_file = watch('excel_file') || [];
	const excel_file_link = watch('excel_file_link') || [];

	useEffect(() => {
		if (data) {
			const image_url = data?.[file_key] ? [{ image_url: data?.[file_key] }] : null;

			setValue('excel_file', image_url);

			set_uploaded_files({ ...data, excel_file: image_url });
		}
	}, [data]);

	const handle_added_files = async (files: any, type: string) => {
		if (!files) {
			return;
		}

		const updated_progress_data: any = [];
		const updated_link_data: any = [];
		let image_url_link: any;

		try {
			for (const file of files) {
				if (!file) {
					continue;
				}
				set_upload_loader(true);
				const file_progress_data = {
					id: `temp_${crypto?.randomUUID()}`,
					status: 'published',
					raw_data: {
						date: file?.lastModifiedDate,
						file_name: file?.name,
						loading: 0,
					},
				};

				updated_progress_data.push(file_progress_data);

				file_progress_data.raw_data.loading = 50;
				set_uploaded_files((prev: any) => {
					return { ...prev, [type]: [...updated_progress_data] };
				});
				setTimeout(() => {
					set_uploaded_files((prev: any) => {
						return { ...prev, [type]: [file] };
					});
					setValue(type, [file]);
				}, 1000);

				const url = URL.createObjectURL(file);
				const form_data: any = new FormData();
				form_data.append('file', file);
				const file_progress_data_link = {
					id: `temp_${crypto?.randomUUID()}`,
					status: 'published',
					raw_data: {
						image_url: url,
						date: file?.lastModifiedDate,
						file_name: file?.name,
						loading: 0,
					},
				};
				updated_link_data.push(file_progress_data_link);
				const config = {
					headers: { 'content-type': 'multipart/form-data' },
					onUploadProgress: ({ loaded, total }: any) => {
						let percent = Math.round((loaded / total) * 100);
						file_progress_data_link.raw_data.loading = percent > 90 ? 90 : percent;
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
					updated_link_data.push(obj);
					image_url_link = `${VITE_APP_API_URL}/artifact/v1/file/${response?.id}`;
				}
			}
		} catch (error) {
			console.error(error);
			set_uploaded_files((prev: any) => {
				return { ...prev, [type]: [] };
			});
			set_show_toast({ state: true, title: 'Upload failed', sub_title: 'Please try again' });
		} finally {
			set_upload_loader(false);
			setValue('excel_file_link', [{ image_url: image_url_link }]);
		}
	};

	const handle_render_toast = () => {
		return (
			<CustomToast
				open={show_toast.state}
				showCross={true}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				show_icon={true}
				autoHideDuration={5000}
				onClose={() => set_show_toast(toast_initial_state)}
				state='warning'
				title={show_toast.title}
				subtitle={show_toast.sub_title}
				showActions={false}
			/>
		);
	};

	return (
		<Grid display='flex' direction='column' gap={2}>
			{handle_render_toast()}
			<CustomText color='rgba(79, 85, 94, 1)'>Upload Excel</CustomText>
			{uploaded_files?.excel_file?.length > 0 ? (
				<Preview
					current_value={uploaded_files?.excel_file}
					data={excel_file}
					setValue={setValue}
					type='excel_file'
					set_uploaded_files={set_uploaded_files}
					excel_file_link={excel_file_link}
				/>
			) : (
				<DropZone
					set_show_toast={() => {}}
					accepted_files='.xls, .xlsx'
					title='Upload an excel file'
					sub_title='Files: XLSX'
					handle_upload={(e) => handle_added_files(e, 'excel_file')}
				/>
			)}
		</Grid>
	);
};

export default ExcelUpload;
