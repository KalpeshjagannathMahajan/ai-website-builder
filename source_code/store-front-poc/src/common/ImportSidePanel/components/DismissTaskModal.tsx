import { t } from 'i18next';
import { Button } from 'src/common/@the-source/atoms';
import CustomDialog, { DialogContainer, DialogTitle, DialogBody, DialogSeperator, DialogFooter } from 'src/common/CustomDialog';

interface Props {
	show_modal: boolean;
	toggle_modal: (value: boolean) => void;
	handle_yes: () => void;
}

const DismissTaskModal = ({ show_modal, toggle_modal, handle_yes }: Props) => {
	return (
		<CustomDialog show_modal={show_modal} handle_close={() => toggle_modal(false)} style={{ width: '420px' }}>
			<DialogContainer>
				<DialogTitle value={t('ManageData.DismissTaskModal.DismissTasks')} show_close={true} handle_close={() => toggle_modal(false)} />
				<DialogSeperator />
				<DialogBody value={t('ManageData.DismissTaskModal.Close')} />
				<DialogSeperator />
				<DialogFooter>
					<Button onClick={() => toggle_modal(false)} variant='outlined' color='secondary'>
						{t('ManageData.Main.No')}
					</Button>

					<Button color='error' onClick={handle_yes}>
						{t('ManageData.Main.Yes')}
					</Button>
				</DialogFooter>
			</DialogContainer>
		</CustomDialog>
	);
};

export default DismissTaskModal;
