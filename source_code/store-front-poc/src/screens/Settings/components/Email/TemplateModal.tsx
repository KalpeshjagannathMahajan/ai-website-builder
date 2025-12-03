import { useEffect, useRef, useState } from 'react';
import { Box, Button, Modal } from 'src/common/@the-source/atoms';
import EmailEditor, { EditorRef, EmailEditorProps } from 'react-email-editor';
import { styled } from '@mui/material/styles';
import settings from 'src/utils/api_requests/setting';
import SaveTemplateDialog from './SaveTemplateDialog';
import EmailTriggerModal from 'src/screens/Settings/components/Email/TriggerMailModal';
import api_requests from 'src/utils/api_requests';
import React from 'react';
import { encode, decode } from 'js-base64';
interface TemplateModalProps {
	data?: any;
	open: boolean;
	set_open: (value: boolean) => void;
	isTemplateNotSelected: boolean;
	onTemplateSaved?: () => void;
	// templateVariables: string[];
}
const tenant_id = '00000000-0000-0000-0000-000000000000';

const StyledContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	maxHeight: '80vh',
	overflowY: 'auto',
	padding: theme.spacing(1),
}));

const StyledEmailEditorWrapper = styled(Box)(({ theme }) => ({
	border: '1px solid #ddd',
	borderRadius: theme.shape.borderRadius,
	marginTop: theme.spacing(1),
	padding: theme.spacing(1),
}));

const StyledButtonContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	justifyContent: 'flex-end',
	position: 'fixed',
	bottom: 10,
	right: 0,
	width: '100%',
	padding: theme.spacing(1),
	marginTop: theme.spacing(2),
	gap: theme.spacing(2),
	backgroundColor: 'white',
	borderRadius: theme.shape.borderRadius,
}));

const StyledModal = styled(Modal)(({}) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
}));

const TemplateModal = ({ open, set_open, data, isTemplateNotSelected, onTemplateSaved }: TemplateModalProps) => {
	const email_editor_ref = useRef<EditorRef>(null);
	const [trigger_modal_open, set_trigger_modal_open] = useState(false);
	const [save_modal_open, set_save_modal_open] = useState(false);
	const { VITE_APP_API_URL } = import.meta.env;
	const [temp_data, set_template_data] = useState<string | null>(null);
	const [is_default_template, set_is_default_template] = useState<string | null>(null);

	const [default_loading, set_default_loading] = useState(true);
	const [template_loading, set_template_loading] = useState(false);
	const [template_variables, set_template_variables] = useState<string[]>([]);

	const [save_template_name, set_save_template_name] = useState('');
	const [save_template_data, set_save_template_data] = useState<any>({});

	const eventname = data?.event_name;
	const channel_name = data?.channel;
	const type_name = data?.email_type;

	const generate_config_key = () => {
		const format_string = (str: string) => str.toLowerCase().replace(/\s+/g, '_');
		const formatted_type_name = format_string(type_name || '');
		const formatted_channel_name = format_string(channel_name || '');
		const formatted_event_name = format_string(eventname || '');
		return `${formatted_type_name}__${formatted_channel_name}__${formatted_event_name}`;
	};

	useEffect(() => {
		const config_key = generate_config_key();
		set_default_loading(true);
		settings
			.get_default_email_config(config_key)
			.then((response: any) => {
				if (response?.template?.json_content) {
					set_is_default_template(response.template.json_content);
				}
				if (response?.email_event_data) {
					set_template_variables(response.email_event_data.template_variables || []);
				}
				set_default_loading(false);
			})
			.catch(() => {
				// Error fetching default email config
				set_default_loading(false);
			});
	}, [data?.template_id]);

	useEffect(() => {
		if (!isTemplateNotSelected && data?.template_id) {
			set_template_loading(true);
			settings
				.get_template_by_id(data.template_id)
				.then((response: any) => {
					if (response?.json_content) {
						set_template_data(response?.json_content);
						set_save_template_name(response?.name || '');
						set_save_template_data(response);
					}
					set_template_loading(false);
				})
				.catch(() => {
					// Error fetching template by ID
					set_template_loading(false);
				});
		}
	}, [isTemplateNotSelected, data?.template_id]);

	const editor_options = {
		tabs: {
			content: { enabled: true },
			blocks: { enabled: false },
			body: { enabled: false },
		},
		tools: {
			social: { enabled: false },
		},
	};

	const on_load: EmailEditorProps['onLoad'] = (unlayer) => {
		if (default_loading || (!isTemplateNotSelected && template_loading)) {
			return;
		}

		const dynamic_merge_tags = template_variables.reduce((acc: any, tag: string) => {
			const tag_name = tag.replace(/[{}]/g, '');
			acc[tag_name] = { name: tag_name, value: tag };
			return acc;
		}, {});

		let design_data: any = {};
		if (isTemplateNotSelected && is_default_template) {
			try {
				design_data = JSON.parse(decode(is_default_template));
			} catch (error) {}
		} else if (!isTemplateNotSelected && temp_data) {
			try {
				design_data = JSON.parse(decode(temp_data));
			} catch (error) {
				// Error parsing custom template
				console.error(error);
			}
		}

		if (Object.keys(design_data).length > 0) {
			unlayer.loadDesign(design_data);
		}

		unlayer.registerCallback('image', async (file: any, done: any) => {
			const form_data = new FormData();
			form_data.append('file', file.attachments[0]);

			try {
				const response: any = await api_requests.buyer.add_image(form_data);
				if (response && response.id) {
					const file_url = `${VITE_APP_API_URL}/artifact/v1/file/${response.id}`;
					done({ progress: 100, url: file_url });
				} else {
					done({ error: 'Image upload failed. Please try again.' });
				}
			} catch (error: any) {
				done({ error: 'Image upload failed. Please try again.' });
			}
		});

		if (dynamic_merge_tags && Object.keys(dynamic_merge_tags).length > 0) {
			unlayer.setMergeTags(dynamic_merge_tags);
		}
	};

	const handle_save = () => {
		set_save_modal_open(true);
	};

	const handle_save_template = (name: string) => {
		email_editor_ref.current?.editor?.exportHtml((editor_data: any) => {
			const { design, html } = editor_data;

			const base64_html = encode(html);
			const base64_design = encode(JSON.stringify(design));

			const generated_config_key = generate_config_key();

			const template_data: any = {
				name,
				email_config_key: generated_config_key,
				json_content: base64_design,
				html_content: base64_html,
				status: 'PUBLISHED',
			};

			if (save_template_data?.tenant_id !== tenant_id && data?.template_id) {
				template_data.id = data.template_id;
			}

			settings
				.save_default_email_template(template_data)
				.then((response) => {
					set_save_modal_open(false);
					set_open(false);
					console.log(response, 'response');

					if (onTemplateSaved) {
						onTemplateSaved();
					}
				})
				.catch(() => {});
		});
	};

	const render_content = (
		<StyledContainer>
			<StyledEmailEditorWrapper>
				{default_loading || template_loading ? (
					<React.Fragment />
				) : (
					<EmailEditor ref={email_editor_ref} onLoad={on_load} options={editor_options} />
				)}
			</StyledEmailEditorWrapper>
			<StyledButtonContainer>
				<Button variant='outlined' onClick={() => set_trigger_modal_open(true)}>
					Trigger Test Mail
				</Button>
				<Button onClick={handle_save}>Save</Button>
			</StyledButtonContainer>
		</StyledContainer>
	);
	//check
	return (
		<>
			<StyledModal title='Email template' width={1300} _height='97vh' open={open} onClose={() => set_open(false)}>
				{render_content}
			</StyledModal>
			<SaveTemplateDialog
				open={save_modal_open}
				onClose={() => set_save_modal_open(false)}
				onSave={handle_save_template}
				initialTemplateName={save_template_name || ''}
			/>
			<EmailTriggerModal open={trigger_modal_open} set_open={set_trigger_modal_open} />
		</>
	);
};

export default TemplateModal;
