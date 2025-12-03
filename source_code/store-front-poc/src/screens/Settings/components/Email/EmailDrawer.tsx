import { useState } from 'react';
import { Divider } from '@mui/material';
import { Box, Button, Checkbox, Chip, Drawer, Grid, Icon, Switch } from 'src/common/@the-source/atoms';
import CustomText from 'src/common/@the-source/CustomText';
import settings from 'src/utils/api_requests/setting';
import TemplateSettings from './TemplateSelectDrawer';

interface EmailDrawerProps {
	open: boolean;
	set_open: (val: boolean) => void;
	data?: any;
	// set_template_modal: (val: boolean) => void;
	set_email_reciepent_drawer: (val: boolean) => void;
	set_data?: any;
	type?: string;
	fetch_data?: any;
	set_show_toast?: any;
}

const EmailDrawer = ({
	open,
	set_open,
	data,
	set_data,
	set_email_reciepent_drawer,
	type,
	fetch_data,
	set_show_toast,
}: EmailDrawerProps) => {
	const [loader, set_loader] = useState<boolean>(false);
	const [selectedTemplateId, setSelectedTemplateId] = useState<any>(data?.template_id || '');
	const [subject, setSubject] = useState<string>(data?.subject || '');
	const [attachments, setAttachments] = useState<string[]>(data?.attachments || []);

	const handle_close = () => {
		set_open(false);
		set_data({});
	};

	const handle_toggle = (key: string) => {
		set_data((prev: any) => ({ ...prev, [key]: !data?.[key] || false }));
	};

	const handle_save = () => {
		set_loader(true);
		const payload = {
			events: [
				{
					...data,
					template_id: selectedTemplateId,
					subject, // Add the subject to the payload
					attachments, // Add the attachments to the payload
				},
			],
		};

		settings
			.update_email_config(payload)
			.then((res: any) => {
				if (res?.status === 200) {
					set_loader(false);
					set_open(false);
					set_data({});
					set_email_reciepent_drawer(false);
					fetch_data(type);
					set_show_toast({ state: true, title: 'Email Config Updated', sub_title: '', type_status: 'success' });
				}
			})
			.catch((err) => {
				set_loader(false);
				console.log(err);
				set_show_toast({ state: true, title: 'Something went wrong', sub_title: '', type_status: 'error' });
			});
	};

	const get_label = (email: string, email_list: any) => {
		for (const item of email_list) {
			if (item.id === email) {
				return item.label;
			}
			if (item.value && Array.isArray(item.value)) {
				for (const child of item.value) {
					if (child.values && Array.isArray(child.values)) {
						if (child.values.includes(email)) {
							return email;
						}
					}
					if (child.id === email && !child.values) {
						return child.label;
					}
				}
			}
		}
		return null;
	};

	const drawer_content = (
		<Box sx={{ background: '#fff', height: '100vh' }}>
			{/* Header */}
			<Grid container p={2}>
				<Grid item>
					<CustomText type='H6'>{data?.event_name}</CustomText>
				</Grid>
				<Grid item ml='auto'>
					<Icon onClick={handle_close} iconName='IconX' sx={{ cursor: 'pointer' }} />
				</Grid>
			</Grid>
			<Divider />
			<Box
				sx={{
					height: '85vh',
					overflowY: 'auto',
					overflowX: 'hidden',
				}}>
				{/* Body content - Email On/Off */}
				<Box
					m={2}
					sx={{
						padding: '16px',
						gap: '12px',
						borderRadius: '12px',
						background: '#F7F8FA',
						width: '95%',
					}}>
					<Grid container alignItems='center'>
						<Grid item>
							<CustomText type='Subtitle'>Email on</CustomText>
						</Grid>
						<Grid item ml='auto'>
							<Switch defaultChecked={data?.is_enable} onChange={() => handle_toggle('is_enable')} />
						</Grid>
					</Grid>
					<Grid container alignItems='center'>
						<Grid item ml={'-1rem'}>
							<Checkbox checked={data?.is_auto_trigger} onChange={() => handle_toggle('is_auto_trigger')} />
						</Grid>
						<Grid item>
							<CustomText type='Body'>Trigger email by default</CustomText>
						</Grid>
					</Grid>
				</Box>
				<Divider
					sx={{
						borderBottom: '1px dotted #D1D6DD',
					}}
				/>
				{/* Body content - Email Recipient list */}
				<Box
					m={2}
					sx={{
						padding: '16px',
						gap: '12px',
						borderRadius: '12px',
						background: '#F7F8FA',
						width: '95%',
					}}>
					<Grid container alignItems='center'>
						<Grid item>
							<CustomText type='H3'>Recipient list</CustomText>
						</Grid>
						<Grid item ml='auto'>
							<Button onClick={() => set_email_reciepent_drawer(true)} variant='text'>
								Edit
							</Button>
						</Grid>
					</Grid>

					<Grid container alignItems='center' my={1}>
						<Grid item>
							<CustomText type='Body'>To</CustomText>
						</Grid>
						<Grid item display='flex' flexWrap='wrap' gap={'10px'} ml={2}>
							{data?.to_emails?.map((item: string) => {
								const label = get_label(item, data?.possible_to_email_templates);
								return <Chip label={label ? label : item} bgColor='#fff' textColor='#000' />;
							})}
						</Grid>
					</Grid>
					<Divider
						sx={{
							borderBottom: '1px dotted #D1D6DD',
						}}
					/>
					<Grid container alignItems='center' my={1}>
						<Grid item>
							<CustomText type='Body'>Cc</CustomText>
						</Grid>
						<Grid item display='flex' flexWrap='wrap' gap={'10px'} ml={2}>
							{data?.cc_emails?.map((item: string, index: number) => {
								const label = get_label(item, data?.possible_cc_email_templates);
								return (
									<Box key={`${item}_${index}`} mb={2} my={1}>
										<Chip label={label ? label : item} bgColor='#fff' textColor='#000' />
									</Box>
								);
							})}
						</Grid>
					</Grid>
					<Divider
						sx={{
							borderBottom: '1px dotted #D1D6DD',
						}}
					/>
					<Grid container alignItems='center' my={1}>
						<Grid item>
							<CustomText type='Body'>Bcc</CustomText>
						</Grid>
						<Grid item display='flex' flexWrap='wrap' gap={'10px'} ml={2}>
							{data?.bcc_emails?.map((item: string) => {
								const label = get_label(item, data?.possible_bcc_email_templates);
								return <Chip label={label ? label : item} bgColor='#fff' textColor='#000' />;
							})}
						</Grid>
					</Grid>
				</Box>
				<Divider
					sx={{
						borderBottom: '1px dotted #D1D6DD',
					}}
				/>

				<Grid p={2}>
					<TemplateSettings
						data={data}
						onTemplateChange={setSelectedTemplateId}
						onSubjectChange={setSubject}
						onAttachmentsChange={setAttachments}
					/>
				</Grid>
			</Box>

			{/* Footer */}
			<Box sx={{ width: '450px', position: 'fixed', bottom: 10, ml: '2rem' }}>
				<Divider className='drawer-divider' />
				<Grid container>
					<Grid item ml='auto' mt={1}>
						<Button loading={loader} onClick={handle_save} variant='contained'>
							Save
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Box>
	);

	return <Drawer open={open} onClose={() => set_open(false)} width={480} content={drawer_content} />;
};

export default EmailDrawer;
