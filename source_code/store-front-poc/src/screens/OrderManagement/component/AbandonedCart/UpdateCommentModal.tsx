import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';

const UpdateCommentModal = ({ comment_modal, set_comment_modal, comment, handleAddComment }: any) => {
	const [input, set_input] = useState(comment || '');
	const handleCommentChange = (event: any) => {
		set_input(event.target.value);
	};

	const { t } = useTranslation();

	return (
		<Modal
			open={comment_modal.show}
			onClose={() => {
				set_comment_modal({ show: false, is_edit: false });
				set_input('');
			}}
			title={t('OrderManagement.AbandonedCart.UpdateCommentModalTitle')}
			children={
				<Grid>
					<TextField
						label='Add Your Comments'
						multiline
						rows={4}
						variant='outlined'
						fullWidth
						value={input}
						onChange={handleCommentChange}
						style={{ marginBottom: '20px' }}
					/>
				</Grid>
			}
			footer={
				<Grid container justifyContent='space-between'>
					<Button
						variant='outlined'
						onClick={() => {
							set_comment_modal({ show: false, is_edit: false });
						}}>
						{t('OrderManagement.AbandonedCart.Cancel')}
					</Button>
					{!comment_modal.is_edit ? (
						<Button variant='contained' color='primary' onClick={() => handleAddComment(input)} disabled={!input}>
							{t('OrderManagement.AbandonedCart.AddComment')}
						</Button>
					) : (
						<Button variant='contained' color='primary' onClick={() => handleAddComment(input)}>
							{t('OrderManagement.AbandonedCart.Update')}
						</Button>
					)}
				</Grid>
			}
		/>
	);
};
export default UpdateCommentModal;
