import React, { useEffect, useState } from 'react';
import { Box, Divider, Grid, MenuItem, Chip } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Button from 'src/common/@the-source/atoms/Button/Button';
import CustomText from 'src/common/@the-source/CustomText';
import settings from 'src/utils/api_requests/setting';
import TemplateModal from './TemplateModal';
import EmailAttachmentsDialog from './EmailAttachment';
import EditSubjectDialog from './EmailSubject';
import _ from 'lodash';

interface TemplateData {
	subject?: string;
	email_type?: string;
	channel?: string;
	event_name?: string;
	attachments?: string[];
}

interface TemplateSettingsProps {
	data: TemplateData;
	onTemplateChange?: (templateId: string) => void;
	onSubjectChange?: (subject: string) => void;
	onAttachmentsChange?: (attachments: string[]) => void;
}

interface DefaultTemplateResponse {
	template?: {
		id: string;
		name: string;
		email_config_key: string;
		json_content: string;
		status: string;
		tenant_id: string;
	};
	email_event_data?: {
		template_variables: string[];
		subject_variables: string[];
		attachments: string[];
	};
}

interface EmailTemplate {
	name: string;
	id: string;
}

const TemplateSettings: React.FC<TemplateSettingsProps> = ({ data, onTemplateChange, onSubjectChange, onAttachmentsChange }: any) => {
	const [templateNames, setTemplateNames] = useState<EmailTemplate[]>([]);
	const [selectedTemplateId, setSelectedTemplateId] = useState<string>(data?.template_id);
	const [attachmentOptions, setAttachmentOptions] = useState<string[]>([]);
	const [attachmentsInitial, setAttachments] = useState<string[]>(data?.attachments || []);

	const [editAttachmentsDialogOpen, setEditAttachmentsDialogOpen] = useState<boolean>(false);
	const [templateModalOpen, setTemplateModalOpen] = useState<boolean>(false);
	const [isTemplateNotSelected, setIsTemplateNotSelected] = useState<boolean>(false);
	const [isEditSubjectDialogOpen, setIsEditSubjectDialogOpen] = useState<boolean>(false);
	const [subject, setSubject] = useState<string>(data?.subject || '');
	const [shouldRefetchTemplates, setShouldRefetchTemplates] = useState<boolean>(false);

	// const [defaultTemplateData, setDefaultTemplateData] = useState<DefaultTemplateResponse | null>(null);
	// const [templateVariables, setTemplateVariables] = useState<string[]>([]);
	const [subjectVariables, setSubjectVariables] = useState<string[]>([]);

	const generateConfigKey = (): string => {
		const formatString = (str: string | undefined) => str?.toLowerCase().replace(/\s+/g, '_') || '';
		const formattedTypeName = formatString(data?.email_type);
		const formattedChannelName = formatString(data?.channel);
		const formattedEventName = formatString(data?.event_name);
		return `${formattedTypeName}__${formattedChannelName}__${formattedEventName}`;
	};

	const configKey: string = generateConfigKey();

	useEffect(() => {
		const fetchDefaultTemplate = async () => {
			try {
				const response: DefaultTemplateResponse = await settings.get_default_email_config(configKey);
				// if (response?.template?.json_content) {
				// 	setDefaultTemplateData(response?.template);
				// }
				if (data?.template_id === '') {
					setSelectedTemplateId(response?.template?.id);
					onTemplateChange(response?.template?.id);
				}

				if (response?.email_event_data) {
					// setTemplateVariables(response?.email_event_data.template_variables || []);
					setSubjectVariables(response?.email_event_data.subject_variables || []);
					setAttachmentOptions(response?.email_event_data.attachments || []);
				}
			} catch (error) {
				console.error('Error fetching default template:', error);
			}
		};

		fetchDefaultTemplate();
	}, [configKey]);

	useEffect(() => {
		const fetchEventEmailTemplates = async () => {
			try {
				const response: any = await settings.get_event_email_templates(configKey);
				if (response && typeof response === 'object') {
					const templates: EmailTemplate[] = Object.values(response).map((item: any) => ({
						name: item.name,
						id: item.id,
					}));
					setTemplateNames(templates);
					if (shouldRefetchTemplates) {
						setShouldRefetchTemplates(false);
					}

					if (data && data?.template_id) {
						setSelectedTemplateId(data?.template_id);
					}
				}
			} catch (error) {
				console.error('Error fetching email templates:', error);
			}
		};

		fetchEventEmailTemplates();
	}, [configKey, shouldRefetchTemplates, data]);

	const handleTemplateChange = (event: SelectChangeEvent<string>) => {
		const selectedId = event.target.value;
		setSelectedTemplateId(selectedId);
		onTemplateChange?.(selectedId);
	};

	const handleEditClick = () => {
		setIsTemplateNotSelected(selectedTemplateId === '');
		setTemplateModalOpen(true);
	};

	const handleTemplateRefetch = () => {
		setShouldRefetchTemplates(true);
	};

	const handleSaveAttachments = (updatedAttachments: string[]) => {
		setAttachments(updatedAttachments);
		onAttachmentsChange?.(updatedAttachments);
	};

	const handleEditAttachmentsClick = () => {
		setEditAttachmentsDialogOpen(true);
	};

	const handleEditSubjectClick = () => {
		setIsEditSubjectDialogOpen(true);
	};

	const handleSaveSubject = (updatedSubject: string) => {
		setSubject(updatedSubject);
		onSubjectChange?.(updatedSubject);
		setIsEditSubjectDialogOpen(false);
	};

	useEffect(() => {
		if (templateNames.length > 0 && !selectedTemplateId) {
			setSelectedTemplateId(templateNames[0].id);
		}
	}, [templateNames]);

	return (
		<Box mb={15}>
			<Grid container alignItems='center'>
				<Grid item>
					<CustomText type='H2'>Template Settings</CustomText>
				</Grid>
				<Grid item ml='auto'>
					<Button onClick={handleEditClick} variant='text'>
						Edit
					</Button>
				</Grid>
			</Grid>

			<Grid container spacing={3} direction='column'>
				<Grid item>
					<Grid item mt={3}>
						<Select
							value={selectedTemplateId}
							onChange={handleTemplateChange}
							fullWidth
							renderValue={(selected) => {
								return _.find(templateNames, (t: any) => t?.id === selected)?.name;
							}}>
							{_.map(templateNames, (template: any) => {
								if (template?.id)
									return (
										<MenuItem value={template?.id} key={template?.id}>
											{template?.name}
										</MenuItem>
									);
							})}
						</Select>
					</Grid>
				</Grid>

				<Divider sx={{ borderBottom: '1px dotted #D1D6DD', mt: 3 }} />

				<Grid item container direction='column'>
					<Grid item container alignItems='center'>
						<Grid item xs={3}>
							<CustomText type='H3'>Subject</CustomText>
						</Grid>
						<Grid item xs='auto' ml='auto'>
							<Button onClick={handleEditSubjectClick} variant='text'>
								Edit
							</Button>
						</Grid>
					</Grid>
					<Grid item xs={12} mt={2}>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
							<CustomText type='Body2'>{subject || data?.subject}</CustomText>
						</Box>
					</Grid>
				</Grid>

				<Divider sx={{ borderBottom: '1px dotted #D1D6DD', mt: 3 }} />

				<Grid item container direction='column'>
					<Grid item container alignItems='center'>
						<Grid item xs={3}>
							<CustomText type='H3' color='Primary'>
								Attachments
							</CustomText>
						</Grid>
						<Grid item xs='auto' ml='auto'>
							<Button onClick={handleEditAttachmentsClick} variant='text'>
								Edit
							</Button>
						</Grid>
					</Grid>
					<Grid item xs={12} mt={2}>
						<Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
							{_.map(attachmentsInitial, (attachment) => (
								<Chip label={attachment} key={attachment} />
							))}
						</Box>
					</Grid>
				</Grid>
			</Grid>

			<EmailAttachmentsDialog
				open={editAttachmentsDialogOpen}
				onClose={() => setEditAttachmentsDialogOpen(false)}
				onSave={handleSaveAttachments}
				attachmentOptions={attachmentOptions}
				selectedAttachments={attachmentsInitial}
			/>

			{templateModalOpen && (
				<TemplateModal
					open={templateModalOpen}
					set_open={setTemplateModalOpen}
					data={{
						...data,
						template_id: selectedTemplateId,
					}}
					isTemplateNotSelected={isTemplateNotSelected}
					onTemplateSaved={handleTemplateRefetch}
				/>
			)}

			<EditSubjectDialog
				open={isEditSubjectDialogOpen}
				onClose={() => setIsEditSubjectDialogOpen(false)}
				onSave={handleSaveSubject}
				subjectOptions={subjectVariables}
				currentSubject={subject}
			/>
		</Box>
	);
};

export default TemplateSettings;
