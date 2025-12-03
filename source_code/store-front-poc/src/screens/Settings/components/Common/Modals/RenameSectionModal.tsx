import { TextField } from '@mui/material';
import { useContext, useState } from 'react';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import SettingsContext from '../../../context';

const RenameSectionModal = ({ open, on_close, section, form, data }: any) => {
	const { handle_rename_section } = useContext(SettingsContext);
	const [section_name, set_section_name] = useState<string>(section?.name);

	const handle_rename = () => {
		if (section_name === section?.name) return null;
		else {
			handle_rename_section(section?.key, section_name, form, data);
		}
	};
	return (
		<Modal
			open={open}
			title={'Rename section'}
			onClose={() => on_close(false)}
			children={
				<Grid>
					<TextField
						onChange={(e) => set_section_name(e.target.value)}
						label={'Section Name'}
						name={'Write section name here'}
						value={section_name}
						disabled={false}
						fullWidth
					/>
				</Grid>
			}
			footer={
				<Grid display='flex' justifyContent='flex-end' gap={1}>
					<Button variant='outlined' onClick={() => on_close(false)}>
						Cancel
					</Button>
					<Button
						disabled={section_name?.trim() === ''}
						onClick={() => {
							handle_rename();
							on_close(false);
						}}>
						Save
					</Button>
				</Grid>
			}
		/>
	);
};

export default RenameSectionModal;
