import React, { useContext, useEffect, useState } from 'react';
import { Button, Grid, TextArea } from 'src/common/@the-source/atoms';
import CustomDialog, { DialogContainer, DialogFooter, DialogSeperator, DialogTitle } from 'src/common/CustomDialog';
import CartSummaryContext from '../context';
import { useTheme } from '@mui/material/styles';
import useStyles from '../styles';
import _ from 'lodash';
import { t } from 'i18next';

interface NoteModalProps {
	data: any;
	show_note_modal: boolean;
	set_show_note_modal: any;
}

const NoteModal = ({ data, set_show_note_modal, show_note_modal }: NoteModalProps) => {
	const { handle_update_note, handle_remove_note } = useContext(CartSummaryContext);
	const notes = _.get(data?.meta, 'notes[0]', '');
	const theme: any = useTheme();
	const classes = useStyles();

	const [form_data, set_form_data] = useState<any>({
		value: notes?.value,
	});

	const handle_change = (event: any) => {
		set_form_data((prev_state: any) => {
			return {
				...prev_state,
				value: event.target.value,
			};
		});
	};

	useEffect(() => {
		set_form_data({
			value: notes?.value,
		});
	}, [show_note_modal]);

	const note_data = form_data?.value;
	return (
		<React.Fragment>
			<CustomDialog
				sx={{}}
				show_modal={show_note_modal}
				handle_close={() => set_show_note_modal(false)}
				style={{ width: '420px', ...theme?.modal_ }}>
				<DialogContainer>
					<DialogTitle value={'Add note'} show_close={true} handle_close={() => set_show_note_modal(false)} />
					<DialogSeperator />
					<Grid className={classes?.note_container}>
						<TextArea
							rows={4}
							placeholder='Add Note '
							sx={{ width: '100%', '& .MuiOutlinedInput-root': { ...theme?.form_elements_ } }}
							handleChange={handle_change}
							value={note_data}
						/>
					</Grid>
					<DialogSeperator />
					<DialogFooter>
						{note_data ? (
							<Button
								onClick={() => {
									handle_remove_note(data?.id, data?.cart_item_id);
								}}
								variant='outlined'
								color='secondary'>
								{t('CartSummary.NoteDrawer.Remove')}
							</Button>
						) : (
							<Button onClick={() => set_show_note_modal(false)} variant='outlined' color='secondary'>
								{t('CartSummary.NoteDrawer.Cancel')}
							</Button>
						)}

						<Button
							onClick={() => {
								handle_update_note(data?.id, form_data, data?.cart_item_id, data);
							}}>
							{t('CartSummary.NoteDrawer.Save')}
						</Button>
					</DialogFooter>
				</DialogContainer>
			</CustomDialog>
		</React.Fragment>
	);
};

export default NoteModal;
