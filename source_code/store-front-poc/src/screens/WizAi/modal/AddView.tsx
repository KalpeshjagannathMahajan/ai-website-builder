import { TextField } from '@mui/material';
import { useContext, useState } from 'react';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import WizAiContext from '../context';

const AddView = ({ open, on_close, data }: any) => {
	const { handle_create_view, new_view, view, handle_rename_section } = useContext(WizAiContext);
	const [_name, set_name] = useState<string>(view?.is_default ? '' : view?.name);

	const handle_rename = () => {
		if (new_view) {
			handle_create_view(_name, data);
		} else if (view?.name === _name) {
			return null;
		} else {
			handle_rename_section(_name);
		}
		on_close();
	};
	return (
		<Modal
			open={open}
			title={'View Name'}
			onClose={on_close}
			children={
				<Grid>
					<TextField
						onChange={(e) => set_name(e.target.value)}
						label={'View Name'}
						name={'Write view name here'}
						value={_name}
						disabled={false}
						fullWidth
					/>
				</Grid>
			}
			footer={
				<Grid display='flex' justifyContent='flex-end' gap={1}>
					<Button variant='outlined' onClick={on_close}>
						Cancel
					</Button>
					<Button
						disabled={_name?.trim() === ''}
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

export default AddView;
