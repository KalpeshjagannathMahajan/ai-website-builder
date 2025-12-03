import { useContext } from 'react';
import CustomText from 'src/common/@the-source/CustomText';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import WizAiContext from '../context';

const DeleteModal = ({ open, on_close }: any) => {
	const { handle_delete_view, view } = useContext(WizAiContext);

	return (
		<Modal
			open={open}
			title={'Delete view ?'}
			onClose={() => on_close(false)}
			children={
				<Grid>
					<CustomText type='Title'>Are you sure you want to delete this view</CustomText>
				</Grid>
			}
			footer={
				<Grid display='flex' justifyContent='flex-end' gap={1}>
					<Button variant='outlined' color='secondary' onClick={on_close}>
						Cancel
					</Button>
					<Button
						color='error'
						onClick={() => {
							handle_delete_view(view?.id);
							on_close();
						}}>
						Delete
					</Button>
				</Grid>
			}
		/>
	);
};

export default DeleteModal;
