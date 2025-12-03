import { t } from 'i18next';
import { useState } from 'react';
import { TextField } from '@mui/material';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import { getFileExtension, getFilenameWithoutExtension } from '../Functions/utils';

interface renameProps {
	default_val: string;
	open_rename_upload_modal: boolean;
	set_open_rename_upload_modal: any;
	handle_rename_function: any;
	selected_file_dat_for_updation: any;
}

export const RenameFileModal = ({
	default_val,
	open_rename_upload_modal,
	set_open_rename_upload_modal,
	handle_rename_function,
	selected_file_dat_for_updation,
}: renameProps) => {
	const fileExtension = getFileExtension(default_val);
	const get_file_name = getFilenameWithoutExtension(default_val);
	const [val, set_val] = useState<string>(get_file_name);

	return (
		<Modal
			open={open_rename_upload_modal}
			onClose={() => set_open_rename_upload_modal(false)}
			title={`Rename ${selected_file_dat_for_updation?.is_folder ? 'Folder' : 'File'}`}
			children={
				<Grid py={1}>
					<TextField
						id='outlined-basic'
						label='Folder Name'
						variant='outlined'
						size='small'
						sx={{ width: '100%' }}
						value={val}
						onChange={(e: any) => {
							set_val(e.target.value);
						}}
					/>
				</Grid>
			}
			footer={
				<Grid display='flex' justifyContent='flex-end' gap={1}>
					<Button variant='outlined' color='secondary' onClick={() => set_open_rename_upload_modal(false)}>
						{t('Files.Cancel')}
					</Button>
					<Button
						variant='contained'
						disabled={default_val === val || !val}
						onClick={async () => {
							handle_rename_function(selected_file_dat_for_updation?.is_folder ? val : `${val}.${fileExtension}`);
						}}>
						{t('Files.Save')}
					</Button>
				</Grid>
			}
		/>
	);
};
