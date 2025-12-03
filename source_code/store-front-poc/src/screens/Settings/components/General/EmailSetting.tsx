/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext, useEffect, useState } from 'react';
import classes from '../../Settings.module.css';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid } from 'src/common/@the-source/atoms';
import SettingsContext from '../../context';
import { FormProvider, useForm } from 'react-hook-form';
import { email_columns } from '../../utils/constants';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import utils from 'src/utils/utils';
import AddEmailUser from '../Common/Drawer/AddEmailUser';
import ToggleSwitchEditField from 'src/common/@the-source/atoms/FieldsNew/ToggleSwitchEditField';
import _ from 'lodash';
import FormBuilder from 'src/common/@the-source/molecules/FormBuilder/FormBuilder';
import Preview from '../Common/Drawer/Preview';
import DropZone from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/DropZone';
import CustomToast from 'src/common/CustomToast';
import api_requests from 'src/utils/api_requests';

const actions = [
	{
		name: 'Edit',
		action: 'edit',
		icon: 'IconEdit',
		key: 'edit',
	},
	{
		name: 'Delete',
		action: 'delete',
		icon: 'IconTrash',
		key: 'delete',
	},
];

const dividerStyle: React.CSSProperties = {
	height: '1px',
	background: 'repeating-linear-gradient(90deg,#D1D6DD 0 4px,#0000 0 8px)',
	margin: '1rem 0',
};

const EmailSettings = () => {
	const { configure, update_configuration } = useContext(SettingsContext);
	const [user_data, set_user_data] = useState<any>(configure?.emailer_settings?.emails ?? []);
	const [user, set_user] = useState<any>({});
	const [open, set_open] = useState<boolean>(false);
	const [edit, set_edit] = useState<boolean>(false);
	const [show_toast, set_show_toast] = useState({ state: false, title: '', sub_title: '' });
	const [uploaded_files, set_uploaded_files] = useState<any>({});
	const [upload_loader, set_upload_loader] = useState(false);

	const { VITE_APP_API_URL } = import.meta.env;

	const methods = useForm({
		defaultValues: {
			enable_emails: configure?.emailer_settings?.enable_emails,
			support_email: configure?.emailer_settings?.support_email,
		},
	});

	const { control, getValues, setValue, watch, handleSubmit }: any = methods;

	const branding_image = watch('branding_image') || [];

	const handle_save = (props: any, source?: string) => {
		if (source !== 'toggle' && !edit) {
			set_edit(true);
			return;
		}
		let new_settings = {
			...configure?.emailer_settings,
			enable_emails: props?.enable_emails ?? configure?.emailer_settings?.enable_emails,
			support_email: props?.support_email ?? '',
			branding_image: _.head(props?.branding_image)?.image_url || '',
		};
		update_configuration('emailer_settings', new_settings);
		set_edit(false);
	};
	const handle_emails = (params: any, key: string) => {
		if (key === 'delete') {
			const updated_list = _.filter(user_data, (item: any) => item?.email !== params?.node?.data?.email);
			let new_settings = { ...configure?.emailer_settings, emails: updated_list };
			update_configuration('emailer_settings', new_settings);
		} else {
			set_user(params?.node?.data);
			set_open(true);
		}
	};
	const columnDef = [...email_columns, utils.create_action_config(actions, handle_emails)];

	const handle_render_toast = () => {
		return (
			<CustomToast
				open={show_toast?.state}
				showCross={true}
				anchorOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				show_icon={true}
				autoHideDuration={5000}
				onClose={() => set_show_toast({ state: false, title: '', sub_title: '' })}
				state='warning'
				title={show_toast?.title}
				subtitle={show_toast?.sub_title}
				showActions={false}
			/>
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

	const handle_cancel = () => {
		let img_logo_url = configure?.emailer_settings?.branding_image ? [{ image_url: configure?.emailer_settings?.branding_image }] : null;
		setValue('branding_image', img_logo_url);
		set_uploaded_files({ ...configure?.emailer_settings?.emails, branding_image: img_logo_url });
		set_edit(false);
	};

	useEffect(() => {
		setValue('enable_emails', configure?.emailer_settings?.enable_emails);
		set_user_data(configure?.emailer_settings?.emails ?? []);
		let img_logo_url = configure?.emailer_settings?.branding_image ? [{ image_url: configure?.emailer_settings?.branding_image }] : null;
		setValue('branding_image', img_logo_url);
		set_uploaded_files({ ...configure?.emailer_settings?.emails, branding_image: img_logo_url });
	}, [configure?.emailer_settings]);

	useEffect(() => {
		if (configure?.emailer_settings) handle_save(getValues(), 'toggle');
	}, [watch('enable_emails')]);

	return (
		<Grid className={classes.content}>
			{handle_render_toast()}
			<Grid className={classes.content_header}>
				<CustomText type='H2'>Email Settings</CustomText>
			</Grid>
			<Grid display='flex' direction='column' gap={1} py={1}>
				<FormProvider {...methods}>
					<Grid mx={-2}>
						<ToggleSwitchEditField
							name='enable_emails'
							key='enable_emails'
							label='Does your organization require an email flow ?'
							defaultValue={getValues()?.enable_emails}
							disabled={edit}
						/>
					</Grid>
					<Grid display='flex' direction='column' gap={1}>
						<CustomText type='H6'>CC Emails</CustomText>
						<AgGridTableContainer
							columnDefs={columnDef}
							has_serials={false}
							hideManageColumn
							rowData={user_data}
							containerStyle={{ height: `${user_data?.length * 40 + 80}px`, maxHeight: '400px' }}
							showStatusBar={false}
						/>
						<Button
							variant='text'
							sx={{ width: '12rem' }}
							onClick={() => {
								set_user({});
								set_open(true);
							}}>
							+ Add User
						</Button>
					</Grid>
					<div style={dividerStyle}></div>
					<Grid>
						<Grid display={'flex'} justifyContent={'space-between'} direction={'row'} alignItems={'center'} py={2}>
							<CustomText type='H6'>Additional Information</CustomText>
							<Grid display={'flex'} gap={2} direction={'row'}>
								{edit && (
									<Button disabled={upload_loader} variant='outlined' color='inherit' onClick={handle_cancel}>
										Cancel
									</Button>
								)}
								<Button disabled={upload_loader} onClick={handleSubmit(handle_save)}>
									{edit ? 'Save' : 'Edit'}
								</Button>
							</Grid>
						</Grid>
						<Grid display={'flex'} gap={2} direction={'column'} width={'40rem'}>
							{edit ? (
								<FormBuilder
									placeholder='Support email'
									label='Support email'
									name='support_email'
									type='text'
									control={control}
									defaultValue={configure?.emailer_settings?.support_email}
									register={methods.register}
									getValues={getValues}
									validations={{ email: true, required: true }}
									setValue={setValue}
									width={'500px'}
								/>
							) : (
								<Grid display='flex' gap={2}>
									<CustomText type='Subtitle'>Support email:</CustomText>
									<CustomText>{configure?.emailer_settings?.support_email}</CustomText>
								</Grid>
							)}
							<CustomText type='Subtitle'>Branding Image:</CustomText>
							{uploaded_files?.branding_image?.length > 0 ? (
								<Preview
									current_value={uploaded_files?.branding_image}
									data={branding_image}
									setValue={setValue}
									file_name={'Branding Image'}
									type='branding_image'
									set_uploaded_files={set_uploaded_files}
									deletable={edit}
								/>
							) : (
								edit && (
									<DropZone
										set_show_toast={set_show_toast}
										title='Upload branding image'
										sub_title='Files: JPEG, PNG'
										handle_upload={(e: any) => handle_added_files(e, 'branding_image')}
									/>
								)
							)}
						</Grid>
					</Grid>
				</FormProvider>
				{open && <AddEmailUser open={open} set_open={set_open} user={user ?? {}} user_data={user_data} set_user_data={set_user_data} />}
			</Grid>
		</Grid>
	);
};

export default EmailSettings;
