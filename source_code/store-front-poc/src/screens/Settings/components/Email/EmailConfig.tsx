import { useContext, useEffect, useState } from 'react';
import { Divider, TextField, Typography } from '@mui/material';
import { Box, Button, Grid, Icon, Switch } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import SettingsContext from '../../context';
import DropZone from 'src/screens/BuyerLibrary/AddEditBuyerFlow/components/DropZone';
import api_requests from 'src/utils/api_requests';
import _ from 'lodash';
import PreviewImage from '../Common/PreviewImage';
import { email_columns } from '../../utils/constants';
import AgGridTableContainer from 'src/common/@the-source/molecules/Table';
import utils from 'src/utils/utils';
import AddEmailUser from '../Common/Drawer/AddEmailUser';

interface BrandImage {
	image_url: string;
}

const { VITE_APP_API_URL } = import.meta.env;

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

const EmailConfig = () => {
	const [support_email, set_support_email] = useState('');
	const [is_editing_support, set_is_editing_support] = useState(false);
	const [is_internal_emails_enabled, set_is_internal_emails_enabled] = useState(false);
	const [is_external_emails_enabled, set_is_external_emails_enabled] = useState(false);
	const [uploaded_files, set_uploaded_files] = useState<any>({});
	const [brand_image, set_brand_image] = useState<BrandImage[]>([]);
	const [user_data, set_user_data] = useState<any>([]);
	const [user, set_user] = useState<any>({});
	const [open, set_open] = useState<boolean>(false);
	const [enable_emails, set_enable_emails] = useState(false);

	const { configure, update_configuration } = useContext(SettingsContext);

	const handle_update_branding_image = () => {
		console.log(brand_image, uploaded_files);
		const payload = {
			...configure?.emailer_settings,
			branding_image: _.head(brand_image)?.image_url || '',
		};
		update_configuration('emailer_settings', payload);
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
					set_brand_image([{ image_url }]);
				}
			}
		} catch (error) {
			console.error(error);
			set_uploaded_files((prev: any) => {
				return { ...prev, [file_type]: [] };
			});
		}
	};

	const handle_save_support_email = () => {
		set_is_editing_support(false);
		const payload = {
			...configure?.emailer_settings,
			support_email,
		};

		update_configuration('emailer_settings', payload);
	};

	const handle_change = (type: string, value: boolean) => {
		if (type === 'is_internal_emails_enabled') {
			set_is_internal_emails_enabled(!is_internal_emails_enabled);
		} else {
			set_is_external_emails_enabled(!is_external_emails_enabled);
		}
		const payload = {
			...configure?.emailer_settings,
			[type]: value,
		};
		update_configuration('emailer_settings', payload);
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

	const toggle_emails = () => {
		const payload = {
			...configure?.emailer_settings,
			enable_emails: !enable_emails,
		};

		update_configuration('emailer_settings', payload);
	};

	const columnDef = [...email_columns, utils.create_action_config(actions, handle_emails)];

	useEffect(() => {
		if (configure?.emailer_settings) {
			set_support_email(_.get(configure, 'emailer_settings.support_email', ''));
			set_brand_image([{ image_url: _.get(configure, 'emailer_settings.branding_image', '') }]);
			set_uploaded_files({ branding_image: _.get(configure, 'emailer_settings.branding_image', '') });
			set_is_internal_emails_enabled(_.get(configure, 'emailer_settings.is_internal_emails_enabled', false));
			set_is_external_emails_enabled(_.get(configure, 'emailer_settings.is_external_emails_enabled', false));
			set_user_data(_.get(configure, 'emailer_settings.emails', []));
			set_enable_emails(_.get(configure, 'emailer_settings.enable_emails', false));
		}
	}, [configure?.emailer_settings]);

	useEffect(() => {
		if (_.head(brand_image)?.image_url) {
			handle_update_branding_image();
		}
	}, [_.head(brand_image)?.image_url]);

	return (
		<div style={{ minHeight: '85vh' }}>
			<Box p={2}>
				<Typography variant='h5'>Email Configuration</Typography>
				<Divider sx={{ mt: 1, mb: 2 }} />

				<Grid container my={1} alignItems='center'>
					<Grid item>
						<CustomText type='Subtitle'>Does your organization require an email flow ?</CustomText>
					</Grid>
					<Grid item ml='auto'>
						<Switch checked={enable_emails} onChange={toggle_emails} />
					</Grid>
				</Grid>

				<Divider sx={{ mt: 1, mb: 2 }} />

				<Box mb={2}>
					<Grid container>
						<Grid item>
							<CustomText type='Subtitle'>Support email</CustomText>
							<CustomText style={{ marginTop: '8px' }} type='Body'>
								The email you want to mention in the email body to hear back from your customers
							</CustomText>
						</Grid>
						<Grid item ml='auto'>
							<Box display='flex' alignItems='center'>
								{is_editing_support ? (
									<TextField
										variant='outlined'
										size='small'
										value={support_email}
										onChange={(e) => set_support_email(e.target.value)}
										sx={{ mr: 2 }}
									/>
								) : (
									<CustomText type='Body'>{support_email}</CustomText>
								)}

								{is_editing_support ? (
									<Button variant='text' onClick={handle_save_support_email}>
										Save
									</Button>
								) : (
									<Icon sx={{ ml: 1, cursor: 'pointer' }} iconName='IconEdit' onClick={() => set_is_editing_support(true)} />
								)}
							</Box>
						</Grid>
					</Grid>
				</Box>

				<Box mb={2}>
					<Grid container>
						<Grid item>
							<CustomText type='Subtitle'>Branding Image</CustomText>
							<CustomText style={{ marginTop: '8px' }} type='Body'>
								The company logo you want to add in the email body
							</CustomText>
						</Grid>
						<Grid item ml='auto'>
							{!_.isEmpty(uploaded_files?.branding_image) ? (
								<PreviewImage
									current_value={uploaded_files}
									data={brand_image}
									type='branding_image'
									set_data={set_brand_image}
									set_uploaded_files={set_uploaded_files}
									url_needed={false}
								/>
							) : (
								<DropZone
									title='Upload branding image'
									sub_title='Files: JPEG, PNG'
									handle_upload={(e: any) => handle_added_files(e, 'branding_image')}
								/>
							)}
						</Grid>
					</Grid>
				</Box>

				<Divider sx={{ my: 2 }} />

				<Box mb={2}>
					<Grid container>
						<Grid item>
							<CustomText type='Subtitle'>Internal emails</CustomText>
							<CustomText style={{ marginTop: '8px' }} type='Body'>
								Customize the email settings for communication with internal team
							</CustomText>
						</Grid>
						<Grid item ml='auto'>
							<Switch
								checked={is_internal_emails_enabled}
								onChange={(e: any) => handle_change('is_internal_emails_enabled', e.target.checked)}
							/>
						</Grid>
					</Grid>
				</Box>

				<Box mb={2}>
					<Grid container>
						<Grid item>
							<CustomText type='Subtitle'>External Emails</CustomText>
							<CustomText style={{ marginTop: '8px' }} type='Body'>
								Customize the email settings for communication with customers
							</CustomText>
						</Grid>
						<Grid item ml='auto'>
							<Switch
								checked={is_external_emails_enabled}
								onChange={(e: any) => handle_change('is_external_emails_enabled', e.target.checked)}
							/>
						</Grid>
					</Grid>
				</Box>
				<Divider sx={{ my: 2 }} />
				<Grid container justifyContent='center' alignItems='center'>
					<Grid item>
						<CustomText type='Subtitle'>CC Emails</CustomText>
					</Grid>
					<Grid item ml='auto'>
						<Button
							variant='text'
							onClick={() => {
								set_user({});
								set_open(true);
							}}>
							+ Add Email
						</Button>
					</Grid>
				</Grid>
				<Grid>
					<AgGridTableContainer
						columnDefs={columnDef}
						has_serials={false}
						hideManageColumn
						rowData={user_data}
						containerStyle={{ height: `${user_data?.length * 40 + 80}px`, maxHeight: '400px' }}
						showStatusBar={false}
					/>{' '}
				</Grid>
			</Box>

			{open && <AddEmailUser open={open} set_open={set_open} user={user ?? {}} user_data={user_data} set_user_data={set_user_data} />}
		</div>
	);
};

export default EmailConfig;
