import { useContext } from 'react';
import { Button, Grid, Modal } from 'src/common/@the-source/atoms';
import CartSummaryContext from '../context';
import { t } from 'i18next';
import CustomText from 'src/common/@the-source/CustomText';

interface Props {
	handle_convert_to_order?: any;
}

function ConfirmationCartModal({ handle_convert_to_order }: Props) {
	const { set_show_confirmation_modal, show_confirmation_modal, is_secondary_loading } = useContext(CartSummaryContext);

	return (
		<Modal
			open={show_confirmation_modal}
			onClose={() => set_show_confirmation_modal(false)}
			title={'All set to proceed?'}
			footer={
				<Grid container justifyContent={'space-between'}>
					<Button variant='outlined' onClick={() => set_show_confirmation_modal(false)}>
						{t('CartSummary.ConfirmationModal.GoBack')}
					</Button>
					<Button loading={is_secondary_loading} onClick={handle_convert_to_order}>
						{t('CartSummary.ConfirmationModal.ConvertToOrder')}
					</Button>
				</Grid>
			}
			children={<CustomText type='Body'>{t('CartSummary.ConfirmationModal.ConfirmConvertToOrder')}</CustomText>}
		/>
	);
}

export default ConfirmationCartModal;
