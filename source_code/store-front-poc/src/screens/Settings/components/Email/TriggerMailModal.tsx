import { useState } from 'react';
import { Modal, Box, Grid, Button, Chip, Icon } from 'src/common/@the-source/atoms';
import TextField from '@mui/material/TextField/TextField';
import CustomText from 'src/common/@the-source/CustomText';
import { validateEmail } from 'src/screens/UserDrive/Functions/utils';
import { makeStyles } from '@mui/styles';

interface EmailTriggerModalProps {
	open: boolean;
	set_open: (value: boolean) => void;
}

const useStyles = makeStyles(() => ({
	modalContainer: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	},
	modalContent: {
		flex: 1,
		overflowY: 'auto',
	},
	footer: {
		display: 'flex',
		justifyContent: 'flex-end',
		gap: '8px',
		marginTop: '2px',
	},
	chipContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		gap: '8px',
		maxHeight: '150px',
		overflowY: 'auto',
		marginBottom: '12px',
	},
	inputContainer: {
		display: 'flex',
		alignItems: 'center',
		gap: '4px',
	},
	chip: {
		fontWeight: 300,
		color: '#000',
		backgroundColor: '#f0f0f0',
	},
	button: {
		whiteSpace: 'nowrap',
		minWidth: 'auto',
		padding: '2px 2px',
		fontSize: '14px',
		fontWeight: 400,
		lineHeight: '1.5',
		marginRight: '4px',
	},
}));

const EmailTriggerModal = ({ open, set_open }: EmailTriggerModalProps) => {
	const [emails, set_emails] = useState<string[]>([]);
	const [new_email, set_new_email] = useState<string>('');
	const [email_error, set_email_error] = useState<string>('');

	const handle_add_email = () => {
		if (!new_email.trim()) {
			set_email_error('Email cannot be empty.');
			return;
		}
		if (!validateEmail(new_email.trim())) {
			set_email_error('Please enter a valid email address.');
			return;
		}
		if (emails.includes(new_email.trim())) {
			set_email_error('This email is already added.');
			return;
		}
		set_emails([...emails, new_email.trim()]);
		set_new_email('');
		set_email_error('');
	};

	const handle_delete_email = (email: string) => {
		set_emails((prev) => prev.filter((e) => e !== email));
	};

	const handle_close = () => {
		set_open(false);
		set_emails([]);
		set_email_error('');
		set_new_email('');
	};

	const classes = useStyles();

	return (
		<Modal style={{ overflowY: 'hidden' }} open={open} title='Trigger test email' onClose={handle_close} width={500}>
			<Box className={classes.modalContainer}>
				<Box className={''}>
					<Grid container spacing={4}>
						<Grid item xs={12}>
							<CustomText type='H3' style={{ fontWeight: 300 }}>
								Enter emails
							</CustomText>
						</Grid>
						<Grid item xs={12}>
							<Box className={classes.inputContainer}>
								<TextField
									placeholder='Enter email'
									value={new_email}
									onChange={(e) => set_new_email(e.target.value)}
									fullWidth
									error={!!email_error}
									helperText={email_error}
								/>
								<Button variant='text' onClick={handle_add_email} className={classes.button}>
									<Box sx={{ fontSize: '30px', fontWeight: 400, lineHeight: '1.5', marginRight: '4px' }}>+</Box>
									Add email
								</Button>
							</Box>
						</Grid>
						<Grid item xs={12}>
							<Box className={classes.chipContainer}>
								{emails.map((email) => (
									<Chip
										key={email}
										label={email}
										onDelete={() => handle_delete_email(email)}
										deleteIcon={<Icon iconName='IconX' />}
										className={classes.chip}
									/>
								))}
							</Box>
						</Grid>
					</Grid>
				</Box>
				<Box className={classes.footer}>
					<Button variant='outlined' onClick={handle_close}>
						Cancel
					</Button>
					<Button variant='contained'>Send</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default EmailTriggerModal;
