import { useEffect, useState } from 'react';
import { Modal, Box, Button, Grid } from 'src/common/@the-source/atoms';
import { makeStyles } from '@mui/styles';
import MultiSelect from 'src/common/@the-source/atoms/MultiSelect';
import _ from 'lodash';

interface EmailAttachmentsDialogProps {
	open: boolean;
	onClose: () => void;
	onSave: (attachments: string[]) => void;
	attachmentOptions: string[];
	selectedAttachments: string[];
}

const useStyles = makeStyles(() => ({
	modalContainer: {
		display: 'flex',
		flexDirection: 'column',
	},
	modalContent: {
		flex: 1,
		marginBottom: '16px',
	},
	footer: {
		display: 'flex',
		justifyContent: 'flex-end',
		gap: '8px',
	},
	multiSelect: {
		minWidth: '100%',
		marginTop: '8px',
	},
}));

const EmailAttachmentsDialog = ({ open, onClose, onSave, attachmentOptions, selectedAttachments }: EmailAttachmentsDialogProps) => {
	const [attachments, set_attachments] = useState<any[]>([_.head(attachmentOptions)]);

	const classes = useStyles();

	useEffect(() => {
		if (open) {
			set_attachments(_.size(attachmentOptions) > 0 ? [_.head(attachmentOptions)] : []);
		}
	}, [open, attachmentOptions]);

	const handle_close = () => {
		onClose();
	};

	const handle_cancel = () => {
		set_attachments(_.size(attachmentOptions) > 0 ? [_.head(attachmentOptions)] : []);
		onClose();
	};

	const handle_save = () => {
		onSave(attachments);
		onClose();
	};

	return (
		<Modal open={open} title='Edit Attachments' onClose={handle_close} width={400}>
			<Box className={classes.modalContainer}>
				<Box className={classes.modalContent}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<MultiSelect
								options={attachmentOptions}
								defaultValue={selectedAttachments.join(',')}
								label='Attachments'
								value={attachments.join(',')}
								handleChange={(newValue) => set_attachments(newValue)}
								style={{ width: '100%' }}
								checkmarks
							/>
						</Grid>
					</Grid>
				</Box>

				<Box className={classes.footer}>
					<Button variant='outlined' onClick={handle_cancel}>
						Cancel
					</Button>
					<Button variant='contained' onClick={handle_save}>
						Save
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default EmailAttachmentsDialog;
