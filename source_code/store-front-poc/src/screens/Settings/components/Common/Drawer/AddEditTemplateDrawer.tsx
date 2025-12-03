import { Divider } from '@mui/material';
import _ from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Drawer, Grid, Icon } from 'src/common/@the-source/atoms';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import { MULTIPLE_TEMPLATE_ENTITY, get_fields } from '../../Product/mock';
import ToggleSwitchEditField from 'src/common/@the-source/atoms/FieldsNew/ToggleSwitchEditField';
import settings from 'src/utils/api_requests/setting';
import DropZone from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/DropZone';
import { useEffect, useState } from 'react';
import api_requests from 'src/utils/api_requests';
import CustomToast from 'src/common/CustomToast';
import Preview from './Preview';
import { useTranslation } from 'react-i18next';
import AttributesComp from './AttributesComp';

interface Props {
	is_visible: boolean;
	close: () => void;
	type: string;
	data: any;
	is_edit: boolean;
	set_refetch: any;
	all_attributes: any;
	length: number;
}

const AddEditTemplateDrawer = ({ is_visible, close, type, data, is_edit, set_refetch, all_attributes, length }: Props) => {
	const [show_toast, set_show_toast] = useState({ state: false, title: '', sub_title: '' });
	const [upload_loader, set_upload_loader] = useState(false);
	const [uploaded_files, set_uploaded_files] = useState<any>({});
	const [loading, set_loading] = useState<boolean>(false);
	const filtered_attr_list = _.filter(data?.attributes, (attr_id: string) => _.find(all_attributes, { value: attr_id })) || [];
	const [attributes, set_attributes] = useState<any>(filtered_attr_list);
	const { t } = useTranslation();
	const is_multiple = _.includes(MULTIPLE_TEMPLATE_ENTITY, type);
	const field_template = get_fields(type);
	const { VITE_APP_API_URL } = import.meta.env;

	const methods = useForm({
		defaultValues: { ...data, type },
	});

	const { control, getValues, setValue, watch, handleSubmit }: any = methods;

	const img_logo = watch('img_logo') || [];
	const img_sample_logo = watch('img_sample_file') || [];
	const preview_image = watch('preview_image') || [];

	const handle_save = (params: any) => {
		set_loading(true);
		let payload = { ...params, preview_item_count: _.toNumber(params?.preview_item_count) || 1 };

		if (img_logo) {
			payload = {
				...payload,
				img_logo: img_logo?.[0]?.image_url,
			};
		}
		if (is_multiple) {
			if (preview_image) {
				payload = {
					...payload,
					preview_image: preview_image?.[0]?.image_url,
				};
			}
			payload = {
				...payload,
				attributes,
			};
			delete payload?.img_sample_file;
		} else {
			if (img_sample_logo) {
				payload = {
					...payload,
					img_sample_file: img_sample_logo?.[0]?.image_url,
				};
			}
			delete payload?.preview_image;
		}
		delete payload?.transformed_attributes;

		const method = is_edit ? 'PUT' : 'POST';
		settings
			.add_update_template(payload, method)
			.then(() => {
				close();
			})
			.catch((err: any) => {
				console.error(err);
			})
			.finally(() => {
				set_refetch((prev: any) => ({ state: !prev.state, key: `${type}-table`, id: type, type: 'table' }));
				set_loading(false);
			});
	};

	const handle_render_upload = () => {
		const upload_key = is_multiple ? 'preview_image' : 'img_sample_file';
		const upload_data = is_multiple ? preview_image : img_sample_logo;
		return (
			<>
				<CustomText color='rgba(79, 85, 94, 1)'>{is_multiple ? 'Preview image' : 'Sample file'}</CustomText>
				{uploaded_files?.[upload_key]?.length > 0 ? (
					<Preview
						current_value={uploaded_files?.[upload_key]}
						data={upload_data}
						setValue={setValue}
						type={upload_key}
						set_uploaded_files={set_uploaded_files}
					/>
				) : (
					<DropZone
						set_show_toast={set_show_toast}
						title={is_multiple ? 'Upload a preview image' : 'Upload a sample sheet of the template'}
						sub_title='Files: JPEG, PNG'
						handle_upload={(e) => handle_added_files(e, upload_key)}
					/>
				)}
			</>
		);
	};

	useEffect(() => {
		if (watch('is_default')) setValue('is_active', true);
	}, [watch('is_default')]);

	useEffect(() => {
		if (length === 0) {
			setValue('is_active', true);
			setValue('is_default', true);
		}
	}, []);

	useEffect(() => {
		if (data) {
			let img_logo_url = !_.isEmpty(data.img_logo) ? _.map([data], ({ img_logo: image_url }) => ({ image_url })) : null;
			let img_sample_file_url = !_.isEmpty(data.img_sample_file)
				? _.map([data], ({ img_sample_file: image_url }) => ({ image_url }))
				: null;
			let preview_image_url = !_.isEmpty(data.preview_image) ? _.map([data], ({ preview_image: image_url }) => ({ image_url })) : null;

			setValue('img_logo', img_logo_url);
			setValue('img_sample_file', img_sample_file_url);
			setValue('preview_image', preview_image_url);

			set_uploaded_files({ ...data, img_logo: img_logo_url, img_sample_file: img_sample_file_url, preview_image: preview_image_url });
		}
	}, [data]);

	const handle_render_header = () => {
		return (
			<Grid className='drawer-header'>
				<CustomText type='H3'>{t('Settings.AddTemplate')}</CustomText>
				<Icon iconName='IconX' sx={{ cursor: 'pointer' }} onClick={close} />
			</Grid>
		);
	};

	const handle_render_footer = () => {
		return (
			<Grid className='drawer-footer' justifyContent='flex-end'>
				<Button variant='outlined' onClick={close}>
					{t('Settings.CTA.cancel')}
				</Button>
				<Button onClick={handleSubmit(handle_save)} loading={loading} disabled={upload_loader}>
					{t('Settings.CTA.save')}
				</Button>
			</Grid>
		);
	};

	const handle_added_files = async (files: any, file_type: string) => {
		if (!files) {
			return;
		}

		const updated_progress_data: any = [];
		const uploaded_file_payload = [];
		let image_url: any;

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
							return { ...prev, [file_type]: [...updated_progress_data] };
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
					image_url = `${VITE_APP_API_URL}/artifact/v1/file/${response?.id}`;
				}
			}
		} catch (error) {
			console.error(error);
			set_uploaded_files((prev: any) => {
				return { ...prev, [file_type]: [] };
			});
			set_show_toast({ state: true, title: 'Upload failed', sub_title: 'Please try again' });
		} finally {
			set_upload_loader(false);
			setValue(file_type, [{ image_url }]);
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
				onClose={() => set_show_toast({ state: false, title: '', sub_title: '' })}
				state='warning'
				title={show_toast.title}
				subtitle={show_toast.sub_title}
				showActions={false}
			/>
		);
	};

	const handle_render_drawer_content = () => {
		return (
			<Grid className='drawer-body'>
				<FormProvider {...methods}>
					{_.map(field_template, (attribute: any) => (
						<FormBuilder
							placeholder={attribute?.name}
							label={attribute?.name}
							name={attribute?.id}
							validations={{ required: attribute?.id !== 'description' }}
							type={attribute?.type}
							control={control}
							register={methods.register}
							getValues={getValues}
							setValue={setValue}
						/>
					))}
					<CustomText color='rgba(79, 85, 94, 1)'>Tearsheet logo</CustomText>

					{uploaded_files?.img_logo?.length > 0 ? (
						<Preview
							current_value={uploaded_files?.img_logo}
							data={img_logo}
							setValue={setValue}
							type='img_logo'
							set_uploaded_files={set_uploaded_files}
						/>
					) : (
						<DropZone
							set_show_toast={set_show_toast}
							title='Upload tearsheet logo'
							sub_title='Files: JPEG, PNG'
							handle_upload={(e: any) => handle_added_files(e, 'img_logo')}
						/>
					)}

					{handle_render_upload()}

					{is_multiple && (
						<Grid>
							<AttributesComp attributes={attributes} set_attributes={set_attributes} attributes_list={all_attributes} />
						</Grid>
					)}

					<Grid display={'flex'} direction={'column'} gap={2}>
						<Grid
							sx={{
								background: '#F7F8FA',
								borderRadius: '12px',
								padding: '2px',
							}}>
							<ToggleSwitchEditField
								name='is_active'
								key='is_active'
								defaultValue={false}
								label='Set template as active'
								disabled={length === 0 || (type === 'document' ? !!data?.is_active : !!watch('is_default'))}
							/>
						</Grid>
						{is_multiple && (
							<Grid
								sx={{
									background: '#F7F8FA',
									borderRadius: '12px',
									padding: '2px',
								}}>
								<ToggleSwitchEditField
									name='is_default'
									key='is_default'
									defaultValue={data?.is_default ?? false}
									label='Set template as default'
									disabled={length === 0 || (data?.is_default ?? false)}
								/>
							</Grid>
						)}
					</Grid>
				</FormProvider>
			</Grid>
		);
	};

	const handle_render_drawer = () => {
		return (
			<>
				{handle_render_toast()}
				<Grid className='drawer-container'>
					{handle_render_header()}
					<Divider className='drawer-divider' />
					{handle_render_drawer_content()}
					<Divider className='drawer-divider' />
					{handle_render_footer()}
				</Grid>
			</>
		);
	};

	return <Drawer width={480} open={is_visible} onClose={close} content={handle_render_drawer()} />;
};

export default AddEditTemplateDrawer;
