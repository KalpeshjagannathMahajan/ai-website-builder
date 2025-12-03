import { t } from 'i18next';
import { Button } from 'src/common/@the-source/atoms';
import CustomDialog, { DialogContainer, DialogTitle, DialogBody, DialogSeperator, DialogFooter } from 'src/common/CustomDialog';

interface Props {
	show_modal: boolean;
	is_discard_loading: boolean;
	toggle_modal: (value: boolean) => void;
	handle_discard: () => void;
	handle_resume: () => void;
}

const GoingAwayModal = ({ show_modal, toggle_modal, handle_discard, handle_resume, is_discard_loading }: Props) => {
	return (
		<CustomDialog show_modal={show_modal} handle_close={() => toggle_modal(false)} style={{ width: '420px' }}>
			<DialogContainer>
				<DialogTitle value={t('ManageData.GoingAwayModal.Going')} show_close={true} handle_close={() => toggle_modal(false)} />
				<DialogSeperator />
				<DialogBody value={t('ManageData.GoingAwayModal.Discard')} />
				<DialogSeperator />
				<DialogFooter>
					<Button onClick={handle_discard} variant='outlined' color='secondary' loading={is_discard_loading}>
						{t('ManageData.Main.Discard')}
					</Button>

					<Button onClick={handle_resume}>{t('ManageData.GoingAwayModal.Resume')}</Button>
				</DialogFooter>
			</DialogContainer>
		</CustomDialog>
	);
};

export default GoingAwayModal;
