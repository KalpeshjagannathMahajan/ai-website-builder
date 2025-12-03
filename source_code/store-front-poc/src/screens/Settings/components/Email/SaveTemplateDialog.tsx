import { Modal, Box, Button } from 'src/common/@the-source/atoms';
import TextField from '@mui/material/TextField/TextField';
import { useState, useEffect } from 'react';
import Divider from '@mui/material/Divider/Divider';

interface SaveTemplateDialogProps {
	open: boolean;
	onClose: () => void;
	onSave: (templateName: string) => void;
	initialTemplateName?: string;
}

const SaveTemplateDialog = ({ open, onClose, onSave, initialTemplateName = '' }: SaveTemplateDialogProps) => {
	const [template_name, set_template_name] = useState(initialTemplateName);

	useEffect(() => {
		if (open) {
			set_template_name(initialTemplateName);
		}
	}, [open, initialTemplateName]);

	const handle_save = () => {
		if (template_name) {
			onSave(template_name);
			set_template_name('');
			onClose();
		}
	};

	return (
		<Modal open={open} onClose={onClose} title='Save Changes As' _height='215px' width={500}>
			<Box>
				<TextField fullWidth placeholder='Template Name' value={template_name} onChange={(e) => set_template_name(e.target.value)} />

				<Divider sx={{ marginTop: 2 }} />

				<Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
					<Button onClick={onClose} variant='outlined'>
						Cancel
					</Button>
					<Button onClick={handle_save} sx={{ marginLeft: 2 }}>
						Save
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default SaveTemplateDialog;
