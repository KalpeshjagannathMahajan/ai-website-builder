import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import { t } from 'i18next';
import CustomText from 'src/common/@the-source/CustomText';

interface Props {
	show_modal: boolean;
	handle_close: () => any;
	handle_proceed: () => any;
}

function UpdateOrderModal({ show_modal, handle_close, handle_proceed }: Props) {
	return (
		<Modal
			open={show_modal}
			onClose={handle_close}
			title={'Are you sure?'}
			footer={
				<Grid container justifyContent={'flex-end'} gap={2}>
					<Button variant='outlined' onClick={handle_close}>
						{t('CartSummary.ConfirmationModal.GoBack')}
					</Button>
					<Button onClick={handle_proceed}>{t('CartSummary.CartSummaryCard.UpdateOrder')}</Button>
				</Grid>
			}
			children={<CustomText type='Body'>{'You are updating a confirmed order. Are you sure you want to proceed?'}</CustomText>}
		/>
	);
}

export default UpdateOrderModal;
