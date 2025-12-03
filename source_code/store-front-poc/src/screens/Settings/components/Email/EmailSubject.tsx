import { Modal, Box, Button } from 'src/common/@the-source/atoms';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import CustomText from 'src/common/@the-source/CustomText';
import Menu from 'src/common/@the-source/atoms/Menu';

interface EditSubjectDialogProps {
	open: boolean;
	onClose: () => void;
	onSave: (subject: string) => void;
	subjectOptions: string[];
	currentSubject: string;
}

const EditSubjectDialog = ({ open, onClose, onSave, subjectOptions, currentSubject }: EditSubjectDialogProps) => {
	const default_subject = currentSubject;
	const [subject, set_subject] = useState(default_subject);
	const [error, set_error] = useState<boolean>(false);

	useEffect(() => {
		set_subject(default_subject);
		set_error(false);
	}, [open, default_subject]);

	const handle_save = () => {
		if (subject.trim()) {
			onSave(subject);
			onClose();
		} else {
			set_error(true);
		}
	};

	const handle_reset = () => {
		set_subject(default_subject);
		set_error(false);
	};

	const handle_variable_insert = (variable: string) => {
		set_subject((prev) => `${prev}${variable}`);
		set_error(false);
	};

	const handle_change = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		set_subject(value);
		set_error(false);
	};

	return (
		<Modal open={open} onClose={onClose} title='Edit Subject' width={500}>
			<Box my={-1}>
				<Grid container spacing={1}>
					<Grid item xs={12}>
						<CustomText type='H3'>Subject</CustomText>
					</Grid>
					<Grid item xs={12}>
						<TextField
							type='text'
							placeholder='Enter Subject'
							variant='outlined'
							fullWidth
							value={subject}
							onChange={handle_change}
							error={error}
							helperText={error ? 'Subject cannot be empty.' : ''}
							InputProps={{
								endAdornment: (
									<InputAdornment position='end'>
										<Menu
											LabelComponent={
												<CustomText type='Body2' style={{ fontSize: '28px', padding: 0, cursor: 'pointer' }} color='light-green'>
													+
												</CustomText>
											}
											menu={subjectOptions.map((variable) => ({
												label: variable,
											}))}
											onClickMenuItem={(item) => handle_variable_insert(item)}
										/>
									</InputAdornment>
								),
							}}
						/>
					</Grid>

					{subject !== default_subject && (
						<Grid item xs={12}>
							<CustomText type='Subtitle' style={{ color: '#2B732F', cursor: 'pointer', marginTop: '-4px' }} onClick={handle_reset}>
								Reset to default
							</CustomText>
						</Grid>
					)}
				</Grid>

				<Divider sx={{ marginTop: 2 }} />

				<Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
					<Button variant='outlined' onClick={onClose} sx={{ mr: 2 }}>
						Cancel
					</Button>
					<Button onClick={handle_save} variant='contained' color='primary'>
						Save
					</Button>
				</Box>
			</Box>
		</Modal>
	);
};

export default EditSubjectDialog;
