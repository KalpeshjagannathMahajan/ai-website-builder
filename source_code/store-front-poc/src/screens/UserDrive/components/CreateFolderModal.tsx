import { TextField } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import driveApis from 'src/utils/api_requests/userDriveApis';
import { useTheme } from '@mui/material/styles';

export const CreateFolderModal = ({
	open_create_folder_modal = false,
	set_open_create_folder_modal = (val: boolean) => {
		val;
	},
	set_sub_folder_data = (val: any) => {
		val;
	},
	parentId = '',
	set_action_message = (val: any) => {
		val;
	},
	set_open_message_modal = (val: any) => {
		val;
	},
	folder_data = [],
}: any) => {
	const [folder_name, set_folder_name] = useState<any>('');
	const [show_loader, set_show_loader] = useState(false);
	const theme: any = useTheme();

	const handle_create_folder = async () => {
		if (folder_name?.trim()?.length <= 0) {
			set_action_message(t('Files.EnterFolderName'));
			set_open_message_modal(true);
			return;
		}
		if (folder_data?.findIndex((opt: any) => opt?.file_name === folder_name) !== -1) {
			set_action_message(t('Files.FolderAlreadyExist'));
			set_open_message_modal(true);
			return;
		}
		set_show_loader(true);
		try {
			let data = await driveApis.create_new_folder(parentId, folder_name?.trim());
			set_sub_folder_data((state: any) => [...state, data]);
			set_folder_name('');
			set_open_create_folder_modal(false);
		} catch (err) {
			console.error(err);
		}
		set_show_loader(false);
	};
	return (
		<Modal
			open={open_create_folder_modal}
			onClose={() => set_open_create_folder_modal(false)}
			title={t('Files.CreateFolder')}
			children={
				<Grid py={1}>
					<TextField
						id='outlined-basic2'
						label='Folder Name'
						variant='outlined'
						autoComplete='off'
						size='small'
						fullWidth
						value={folder_name}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							set_folder_name(event.target.value);
						}}
					/>
				</Grid>
			}
			footer={
				<Grid display='flex' gap={1} justifyContent='flex-end'>
					<Button
						variant='outlined'
						color='secondary'
						sx={{ color: theme?.user_drive?.user_drive_main?.modal_button_color }}
						onClick={() => {
							set_open_create_folder_modal(false);
						}}>
						{t('Files.Cancel')}
					</Button>
					<Button variant='contained' loading={show_loader} onClick={handle_create_folder}>
						{t('Files.Create')}
					</Button>
				</Grid>
			}
		/>
	);
};
